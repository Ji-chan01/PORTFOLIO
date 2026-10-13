import { Component, Suspense, useRef, useLayoutEffect, useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Desk lamp that is OFF until the cursor moves, then lights up and follows the cursor.
 *
 * The <CursorLamp /> element is only a PLACEHOLDER that reserves space in your layout.
 * The actual 3D canvas is drawn across the whole scrollable content area (via a portal),
 * so the lamp and its light are never clipped to the placeholder box.
 *
 *   npm i three @react-three/fiber @react-three/drei
 *   Model must be at  public/models/desk_lamp.glb
 *
 * Usage (same as before):  <div className="h-[560px]"><CursorLamp className="w-full h-full" /></div>
 */

const MODEL_URL = "/desk_lamp.glb";
const IDLE_MS = 1000;

// Lamp geometry measured from desk_lamp.glb (units ~ meters)
const PIVOT = new THREE.Vector3(0.33, 2.2, 0); // head hinge
const BULB = new THREE.Vector3(0.51, 1.95, 0); // light origin inside the shade
const REST_DIR = new THREE.Vector3(0, -1, 0); // shade opening direction at rest
const BODY_PIVOT = new THREE.Vector3(-0.5, 0.3, 0); // lower arm joint, just above the base
const BODY_LEAN = 0.14; // max sway in radians (~8 degrees). 0 = body never moves
const BASE_NODES = ["Cylinder001", "Cylinder006"]; // base discs stay put
const LAMP_H = 2.7;
const LAMP_W = 1.9;

const FLIP_Y = Math.PI; // Math.PI = head on the left (toward text), 0 = head on the right
const HEAD_FOLLOW = 0.45; // 0 = head never moves, 1 = points straight at the cursor
// Responsiveness: higher = snappier, lower = smoother/laggier
const SMOOTH = {
  on: 16, // light fading ON when the cursor moves
  off: 4, // light fading OFF when idle (smooth and gentle)
  aim: 22, // light/target tracking the cursor
  head: 16, // head tilting toward the cursor
  body: 10, // body swaying toward the cursor
  disabled: 6, // light fading OFF when the lamp is switched off by the page (stats cards on screen)
};
const DESK_COLOR = "#000000"; // same as the dark-mode page background (pure black). Keep in sync with DESK_COLOR in AboutTab.jsx
const DOME_DEPTH = 3.2; // how far the black dome extends BEHIND the lamp (world units) = how tall the arc looks
const DOME_TAIL = 3; // arc profile: higher = flatter and thinner toward the left/right ends (keeps it away from the buttons)
const DOME_MIN_R = 3.3; // minimum half-width; it auto-widens to always reach the left edge of the page
const POOL_RX = 4.2; // light pool half-width on the desk (wider than before)
const POOL_RZ = 1.5; // light pool half-depth (reaches down to the stats cards)
const POOL_COLOR = "255,176,80"; // warm light colour (r,g,b)
const POOL_STRENGTH = 0.9; // 0..1 brightness of the pool centre
const FIT = 0.85; // how much of the placeholder height the lamp fills

// --- Lamp finish: mid-tone metal instead of black, so it reads on dark AND light backgrounds ---
const LAMP_COLOR = "#5B6475"; // gunmetal: arms, springs, head
const BASE_COLOR = "#8A93A6"; // slightly lighter brushed steel for the base discs (the "foot")
const METALNESS = 0.6; // 0 = plastic, 1 = mirror metal
const ROUGHNESS = 0.38; // lower = shinier highlights

// --- Idle resting glow: 0 so the light completely turns off when the cursor stops moving ---
const IDLE_GLOW_DARK = 0;

// --- Contact light: soft cool ellipse on the desk under the base, always on, so the foot has something lighter around it ---
const BASE_X = 0.15; // base position along the desk; nudge left/right if the glow looks off-centre
const BASE_GLOW_RX = 1.6;
const BASE_GLOW_RZ = 0.8;
const BASE_GLOW_COLOR = "150,190,255";
const BASE_GLOW_STRENGTH = 0.4;

// --- Spotlight glare: when the head tilts far enough, the light "hits the screen" (blur + bloom where the shade points) ---
const GLARE_TILT_START = 0.35; // head tilt (radians from straight down) where the glare starts to fade in (~20 deg)
const GLARE_TILT_FULL = 0.75; // tilt where it reaches full strength (~43 deg)
const GLARE_REACH = 1.6; // how far from the bulb (world units) the glare lands, along the direction the shade points
const GLARE_RADIUS = 1.9; // glare radius in lamp-heights-ish units (multiplied by pixels per unit)
const GLARE_BLUR = 7; // max blur in px at the centre of the glare
const GLARE_DEBUG = false; // true = small label at the top-left showing the live head tilt, so you can tune the two TILT values

const DOME_FLOOR = 0.03; // minimum dome thickness at its far ends; hides the thin hairline where the slab edge peeks out
const DOME_FRONT = 0.04; // dome also extends a few pixels IN FRONT of the ground line, so it overlaps the HTML slab and no gap can show

const HEAD_NODES = [
  "Cylinder005", "Sphere020", "Cylinder004", "Object014", "Sphere017",
  "Object020", "Cylinder008", "Object015", "Box010", "Object016",
];

/** Soft radial gradient texture used for the light pools on the desk. */
function makeGlowTexture(rgb, strength) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 256;
  const g = cv.getContext("2d");
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, `rgba(${rgb},${strength})`);
  grad.addColorStop(0.5, `rgba(${rgb},${strength * 0.3})`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(cv);
}

/** Repaint a material as mid-tone metal (drops the original black texture/colour). */
function paintMetal(m, color) {
  m.map = null;
  m.color.set(color);
  if ("metalness" in m) {
    m.metalness = METALNESS;
    m.roughness = ROUGHNESS;
    m.metalnessMap = null;
    m.roughnessMap = null;
  }
  m.envMapIntensity = 1.2;
  m.needsUpdate = true;
}

function isBasePart(o) {
  for (let p = o; p; p = p.parent) if (BASE_NODES.includes(p.name)) return true;
  return false;
}

/** If anything in the 3D scene throws, hide it instead of blanking the whole site. */
class LampBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error("[CursorLamp] failed, hiding it:", error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function getScrollParent(el) {
  let p = el.parentElement;
  while (p && p !== document.body) {
    if (/(auto|scroll)/.test(getComputedStyle(p).overflowY)) return p;
    p = p.parentElement;
  }
  return null;
}

function Lamp({ phRef, host, mouse, lastMove, onGround, darkRef, enabledRef, glareEls, isMobile = false }) {
  const { scene: original } = useGLTF(MODEL_URL);
  // Clone per mount: useGLTF caches one shared scene and we re-parent the head nodes.
  const scene = useMemo(() => original.clone(true), [original]);

  const hostRef = useRef(host);
  hostRef.current = host;

  const head = useMemo(() => new THREE.Group(), []);
  const body = useMemo(() => new THREE.Group(), []);
  const target = useMemo(() => new THREE.Object3D(), []);
  const lights = useRef({ spot: null, glow: null });
  const mats = useRef({ bulb: null, lining: null });
  const level = useRef(0);
  const idleGlow = useRef(0); // resting glow (dark mode), fades in/out when the theme changes

  const ray = useMemo(() => new THREE.Raycaster(), []);
  // Invisible wall slightly in front of the lamp; the cursor is projected onto it
  const wall = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), -1), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const tmp = useMemo(
    () => ({ dir: new THREE.Vector3(), full: new THREE.Quaternion(), goal: new THREE.Quaternion(), id: new THREE.Quaternion() }),
    []
  );

  // Warm light pool (follows the cursor) and cool contact light under the base
  const poolTex = useMemo(() => makeGlowTexture(POOL_COLOR, POOL_STRENGTH), []);
  const baseTex = useMemo(() => makeGlowTexture(BASE_GLOW_COLOR, BASE_GLOW_STRENGTH), []);
  const pool = useRef();
  const baseGlow = useRef();
  const dome = useRef();
  const ppuRef = useRef(150);
  // Unit dome profile: x in [-1,1], height (1 - x^2)^DOME_TAIL in [0,1]; scaled to size every frame
  const domeGeo = useMemo(() => {
    const sh = new THREE.Shape();
    const N = 96;
    sh.moveTo(-1, -DOME_FRONT);
    for (let i = 0; i <= N; i++) {
      const t = -1 + (2 * i) / N;
      sh.lineTo(t, Math.max(DOME_FLOOR, Math.pow(Math.max(0, 1 - t * t), DOME_TAIL)));
    }
    sh.lineTo(1, -DOME_FRONT);
    return new THREE.ShapeGeometry(sh);
  }, []);
  const wv = useMemo(() => new THREE.Vector3(), []);
  const gl = useRef(0); // glare level 0..1 (smoothed)
  const gv = useMemo(() => ({ q: new THREE.Quaternion(), dir: new THREE.Vector3(), p: new THREE.Vector3() }), []);

  useLayoutEffect(() => {
    scene.rotation.y = FLIP_Y; // before re-parenting

    scene.traverse((o) => {
      if (!o.isMesh || !o.material || Array.isArray(o.material)) return;
      o.material = o.material.clone(); // preserve original material per instance
      o.castShadow = true;
      o.receiveShadow = true;
      let glowPart = false;
      if (o.name.startsWith("Sphere020_05")) {
        mats.current.bulb = o.material;
        if (o.material.emissive) o.material.emissive.set("#ffb45a");
        o.material.emissiveIntensity = 0;
        o.castShadow = false;
        glowPart = true;
      }
      if (o.name.startsWith("Cylinder005_Material")) {
        mats.current.lining = o.material;
        if (o.material.emissive) o.material.emissive.set("#ff9d3c");
        o.material.emissiveIntensity = 0;
        glowPart = true;
      }
      // Everything else becomes mid-tone metal (base discs a bit lighter)
      if (!glowPart && !o.material.transparent) paintMetal(o.material, isBasePart(o) ? BASE_COLOR : LAMP_COLOR);
    });

    scene.add(head, target);
    head.position.copy(PIVOT);
    scene.updateMatrixWorld(true);
    HEAD_NODES.forEach((n) => {
      const node = scene.getObjectByName(n);
      if (node) head.attach(node);
    });

    // Everything except the base discs (arms, springs, head) goes into a body group that can sway
    scene.add(body);
    body.position.copy(BODY_PIVOT);
    scene.updateMatrixWorld(true);
    const rootNode = scene.getObjectByName("RootNode");
    if (rootNode) {
      [...rootNode.children].forEach((c) => {
        if (!BASE_NODES.includes(c.name)) body.attach(c);
      });
    }
    body.attach(head);

    const spot = new THREE.SpotLight("#ffcf8a", 0, 12, 0.65, 0.75, 2);
    spot.position.copy(BULB).sub(PIVOT);
    spot.target = target;
    spot.castShadow = true;
    spot.shadow.mapSize.set(1024, 1024);
    spot.shadow.bias = -0.0005;

    const glow = new THREE.PointLight("#ffb45a", 0, 2, 2);
    glow.position.copy(BULB).sub(PIVOT);

    head.add(spot, glow);
    lights.current = { spot, glow };

    return () => {
      head.remove(spot, glow);
      scene.remove(body, target);
      spot.dispose();
    };
  }, [scene, head, body, target]);

  useFrame((state, dt) => {
    const h = hostRef.current;
    const ph = phRef.current;
    if (!h || !ph) return;
    const { camera, size } = state;

    // 1. Frame the lamp inside the placeholder, while the canvas covers the whole content area
    const pr = ph.getBoundingClientRect();
    const W = size.width;
    const H = size.height;
    if (pr.width > 0 && pr.height > 0 && W > 0 && H > 0) {
      const ppu = Math.min((FIT * pr.height) / LAMP_H, (0.95 * pr.width) / LAMP_W); // pixels per unit
      ppuRef.current = ppu;
      const dist = H / ppu / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
      camera.position.set(0.1, 1.5, dist);
      camera.lookAt(0.05, 1.3, 0);
      const cx = pr.left + pr.width / 2 - h.left;
      const cy = pr.top + pr.height / 2 - h.top;
      camera.setViewOffset(W, H, -(cx - W / 2), -(cy - H / 2), W, H);
      camera.updateMatrixWorld();
    }

    // 1b. Project the lamp's ground point: (a) stretch the dome so it always reaches the left edge of the page,
    //     (b) tell the page where the ground line is so the black band can start exactly there
    tmp.dir.set(0, 0, 0).project(camera);
    const groundX = h.left + ((tmp.dir.x + 1) / 2) * h.width;
    const groundY = h.top + ((1 - tmp.dir.y) / 2) * h.height;
    if (dome.current) {
      const R = Math.max(DOME_MIN_R, (groundX - h.left + 60) / ppuRef.current);
      dome.current.scale.set(R, DOME_DEPTH, 1);
    }
    if (onGround.current) onGround.current(groundY);

    // 2. Off -> on while the cursor moves
    // enabled = false (e.g. the stats cards are on screen): lamp stops following the cursor and switches off
    const on = enabledRef.current;
    const active = on && performance.now() - lastMove.current < IDLE_MS;
    level.current = THREE.MathUtils.damp(level.current, active ? 1 : 0, active ? SMOOTH.on : on ? SMOOTH.off : SMOOTH.disabled, dt);
    const k = level.current;

    // 3. Cursor (anywhere on the page) -> point in front of the lamp
    const m = mouse.current;
    if (on && m.x >= 0) {
      ndc.set(((m.x - h.left) / h.width) * 2 - 1, -((m.y - h.top) / h.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(wall, hit)) {
        scene.updateMatrixWorld();
        scene.worldToLocal(hit);
        target.position.lerp(hit, 1 - Math.exp(-SMOOTH.aim * dt));
      }
    }

    // 4. Tilt the head toward the cursor
    tmp.dir.copy(target.position).sub(PIVOT).normalize();
    tmp.full.setFromUnitVectors(REST_DIR, tmp.dir);
    tmp.goal.copy(tmp.id.identity()).slerp(tmp.full, HEAD_FOLLOW * k);
    head.quaternion.slerp(tmp.goal, 1 - Math.exp(-SMOOTH.head * dt));

    // 4b. Sway the whole body toward the cursor; relaxes to rest when idle or when the cursor leaves
    const side = THREE.MathUtils.clamp((target.position.x - PIVOT.x) / 2.5, -1, 1);
    body.rotation.z = THREE.MathUtils.damp(body.rotation.z, -side * BODY_LEAN * k, SMOOTH.body, dt);

    // 5. Lights + glowing materials. glowK = cursor-driven level, but never below the dark-mode resting glow
    const dk = darkRef.current;
    idleGlow.current = THREE.MathUtils.damp(idleGlow.current, dk && on ? IDLE_GLOW_DARK : 0, 3, dt);
    const glowK = Math.max(k, idleGlow.current);
    const { spot, glow } = lights.current;
    if (spot) spot.intensity = 30 * glowK;
    if (glow) glow.intensity = 1.2 * glowK;
    if (mats.current.bulb) mats.current.bulb.emissiveIntensity = 3 * glowK;
    if (mats.current.lining) mats.current.lining.emissiveIntensity = 0.6 * glowK;

    // 6. Light pool on the desk: fades with the lamp and drifts toward where the cursor is aiming
    if (pool.current) {
      target.getWorldPosition(wv);
      const px = THREE.MathUtils.clamp(wv.x * 0.7, -2.2, 2.2);
      pool.current.position.x = THREE.MathUtils.damp(pool.current.position.x, px, 6, dt);
      // When the beam is hitting the screen (glare), the desk pool fades out: the light is already "on screen"
      pool.current.material.opacity = glowK * (dk ? 1 : 0.85) * (1 - gl.current);
    }

    // Blue light under the base: turns OFF when the yellow light is visible, turns ON when yellow light is off
    if (baseGlow.current) {
      baseGlow.current.material.opacity = Math.max(0, 1 - glowK);
    }

    // 7. Spotlight glare: the more the shade tilts, the more the light "hits the screen" where it points
    const G = glareEls.current;
    if (G.blur && G.bloom) {
      head.updateWorldMatrix(true, true);
      head.getWorldQuaternion(gv.q);
      gv.dir.copy(REST_DIR).applyQuaternion(gv.q); // world direction the shade opening points
      const tilt = Math.acos(THREE.MathUtils.clamp(-gv.dir.y, -1, 1)); // 0 = straight down (rest)
      const want = THREE.MathUtils.smoothstep(tilt, GLARE_TILT_START, GLARE_TILT_FULL) * k;
      gl.current = THREE.MathUtils.damp(gl.current, want, 6, dt);
      const g = gl.current;
      if (GLARE_DEBUG && G.dbg) G.dbg.textContent = `tilt ${((tilt * 180) / Math.PI).toFixed(0)} deg | glare ${g.toFixed(2)}`;

      if (g < 0.003) {
        if (G.shown) {
          G.blur.style.opacity = "0";
          G.bloom.style.opacity = "0";
          G.shown = false;
        }
      } else if (lights.current.spot) {
        lights.current.spot.getWorldPosition(gv.p);
        gv.p.addScaledVector(gv.dir, GLARE_REACH).project(camera);
        const gx = ((gv.p.x + 1) / 2) * h.width;
        const gy = ((1 - gv.p.y) / 2) * h.height;
        const R = GLARE_RADIUS * ppuRef.current;

        const f = `blur(${(GLARE_BLUR * g).toFixed(2)}px) brightness(${(1 + 0.25 * g).toFixed(3)})`;
        const mask = `radial-gradient(circle ${R.toFixed(0)}px at ${gx.toFixed(0)}px ${gy.toFixed(0)}px, #000 0%, rgba(0,0,0,0.7) 40%, transparent 100%)`;
        G.blur.style.opacity = "1";
        G.blur.style.backdropFilter = f;
        G.blur.style.webkitBackdropFilter = f;
        G.blur.style.maskImage = mask;
        G.blur.style.webkitMaskImage = mask;

        G.bloom.style.opacity = "1";
        G.bloom.style.mixBlendMode = dk ? "screen" : "normal";
        G.bloom.style.background =
          `radial-gradient(circle ${R.toFixed(0)}px at ${gx.toFixed(0)}px ${gy.toFixed(0)}px, ` +
          `rgba(255,242,220,${(0.85 * g).toFixed(3)}) 0%, rgba(255,196,120,${(0.4 * g).toFixed(3)}) 30%, rgba(255,160,70,0) 70%)`;
        G.shown = true;
      }
    }
  });

  return (
    <>
      <primitive object={scene} />
      {/* Black dome behind the lamp (back half only). Omitted on mobile so only the transparent lamp shows */}
      {!isMobile && (
        <mesh ref={dome} geometry={domeGeo} position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={DESK_COLOR} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Warm light pool on the black desk (additive glow, fades in with the lamp) */}
      <mesh ref={pool} position={[0, 0.002, 0.7]} rotation={[-Math.PI / 2, 0, 0]} scale={[POOL_RX * 2, POOL_RZ * 2, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={poolTex} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Cool contact light under the base: on when idle, fades off when yellow light is on */}
      <mesh ref={baseGlow} position={[BASE_X, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[BASE_GLOW_RX * 2, BASE_GLOW_RZ * 2, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={baseTex} transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </>
  );
}

export default function CursorLamp({ className = "", style, onGround, dark = false, enabled = true }) {
  const phRef = useRef(null);
  const mouse = useRef({ x: -1, y: -1 });
  const lastMove = useRef(0);
  const onGroundRef = useRef(onGround);
  onGroundRef.current = onGround;
  const darkRef = useRef(dark);
  darkRef.current = dark;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const [host, setHost] = useState(null);
  const [scrollerEl, setScrollerEl] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const glareEls = useRef({ blur: null, bloom: null, dbg: null, shown: false }); // DOM layers for the spotlight glare, updated every frame

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Cursor position anywhere on the page
  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      lastMove.current = performance.now();
    };
    const onLeave = () => (lastMove.current = 0); // cursor left the window: switch off and relax
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Measure the placeholder and the scrollable content area it lives in
  useLayoutEffect(() => {
    const ph = phRef.current;
    if (!ph) return;
    const scroller = getScrollParent(ph);
    setScrollerEl(scroller);

    const measure = () => {
      const pr = ph.getBoundingClientRect();
      const visible = pr.width > 0 && pr.height > 0; // false for the hidden desktop/mobile duplicate
      let left = 0, top = 0, width = window.innerWidth, height = window.innerHeight;
      if (scroller) {
        const r = scroller.getBoundingClientRect();
        left = r.left + scroller.clientLeft;
        top = r.top + scroller.clientTop;
        width = scroller.clientWidth;
        height = scroller.clientHeight;
      }
      setHost((p) =>
        p && p.visible === visible && p.left === left && p.top === top && p.width === width && p.height === height
          ? p
          : { visible, left, top, width, height }
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ph);
    if (scroller) ro.observe(scroller);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const box = host && {
    position: "fixed",
    left: host.left,
    top: host.top,
    width: host.width,
    height: host.height,
    pointerEvents: "none",
    overflow: "hidden",
  };

  if (isMobile) return null;

  return (
    <>
      <div ref={phRef} className={className} style={{ width: "100%", height: "100%", minHeight: 360, ...style }} />

      {host?.visible &&
        createPortal(
          <>
            {/* Glare, part 1: blurs the page behind the lamp (below the 3D canvas, so the lamp itself stays sharp) */}
            <div ref={(el) => (glareEls.current.blur = el)} aria-hidden="true" style={{ ...box, zIndex: 29, opacity: 0 }} />
            <LampBoundary>
              <div style={{ ...box, zIndex: 30 }}>
                <Canvas
                  shadows
                  dpr={[1, 1.5]}
                  gl={{ alpha: true, antialias: true }}
                  style={{ background: "transparent", pointerEvents: "none" }}
                  camera={{ position: [0.1, 1.5, 6], fov: 35 }}
                >
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[4, 6, 5]} intensity={1.5} />
                  {/* Cool rim lights from behind: outline the arms and shade so the lamp never melts into a dark background */}
                  <directionalLight position={[-4, 3, -4]} intensity={dark ? 3 : 2} color="#7DD3FC" />
                  <directionalLight position={[4, 2, -3]} intensity={dark ? 2 : 1.2} color="#93C5FD" />
                  <Suspense fallback={null}>
                    {/* Built-in studio reflections (no download) so the metal actually looks metallic */}
                    <Environment resolution={128} frames={1}>
                      <Lightformer form="rect" intensity={2.2} color="#BAE6FD" position={[-4, 2.5, -3]} scale={[6, 2, 1]} target={[0, 0, 0]} />
                      <Lightformer form="rect" intensity={1.6} color="#FFFFFF" position={[3, 3, 4]} scale={[5, 2, 1]} target={[0, 0, 0]} />
                      <Lightformer form="ring" intensity={1} color="#FFD9A0" position={[0, 0.5, 5]} scale={3} target={[0, 0, 0]} />
                    </Environment>
                    <Lamp phRef={phRef} host={host} mouse={mouse} lastMove={lastMove} onGround={onGroundRef} darkRef={darkRef} enabledRef={enabledRef} glareEls={glareEls} isMobile={false} />
                  </Suspense>
                </Canvas>
              </div>
            </LampBoundary>
            {/* Glare, part 2: warm bloom on top, as if the beam were hitting the screen */}
            <div ref={(el) => (glareEls.current.bloom = el)} aria-hidden="true" style={{ ...box, zIndex: 31, opacity: 0 }} />
            {GLARE_DEBUG && (
              <div
                ref={(el) => (glareEls.current.dbg = el)}
                style={{ position: "fixed", left: 12, top: 12, zIndex: 60, padding: "4px 8px", font: "12px monospace", color: "#fff", background: "rgba(0,0,0,0.6)" }}
              />
            )}
          </>,
          document.body
        )}
    </>
  );
}

useGLTF.preload(MODEL_URL);
