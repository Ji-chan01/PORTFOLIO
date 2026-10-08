import { useRef, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import gsap from 'gsap';
import { createScreenTexture } from './useScreenTexture';

/*
  DeskModel – loads the optimized GLB and puts an unlit "display" plane
  exactly on the monitor glass. Nothing is hardcoded in world units:
  the plane is sized and placed from the monitor mesh's own geometry,
  oriented from its real axes, and snapped to the glass with a raycast.

  Props (unchanged): isActive, isDark, onLoaded

  ─── Tunable ───
  SCREEN_RECT  : the screen area as fractions of the monitor's bounding box
                 x0..x1 = left..right, y0..y1 = bottom..top (stand/chin excluded)
  FLIP_FRONT   : set true if the plane ends up on the BACK of the monitor
  Add ?debug=1 to the URL to see the plane as a magenta overlay + console info.
*/

const MODEL_PATH = '/computer_desk_opt.glb';
const TWEEN_DURATION = 0.5;

const SCREEN_RECT = { x0: 0.07, x1: 0.93, y0: 0.30, y1: 0.95 };
const FLIP_FRONT = false;

const DEBUG = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug');

function findMonitorMesh(model) {
  let exact = null;
  let loose = null;
  model.traverse((c) => {
    if (!c.isMesh) return;
    if (c.name === 'Monitor_Monitor_0') exact = c;
    else if (!loose && c.name.toLowerCase().includes('monitor')) loose = c;
  });
  const found = exact || loose;
  if (!found) {
    console.warn('[DeskModel] Monitor mesh not found. Meshes in model:');
    model.traverse((c) => c.isMesh && console.log('  •', c.name));
  }
  return found;
}

/**
 * Builds the screen plane as a child of the monitor mesh, so it inherits
 * every transform (rotation, scale, the model's auto-fit) automatically.
 */
function addScreenOverlay(mesh, camera) {
  const geom = mesh.geometry;
  geom.computeBoundingBox();
  const box = geom.boundingBox;
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  mesh.updateWorldMatrix(true, false);

  const AX = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
  const worldDir = AX.map((a) => a.clone().transformDirection(mesh.matrixWorld));

  // 1) UP axis = the local axis that points most toward world up
  let up = 0;
  for (let i = 1; i < 3; i++) {
    if (Math.abs(worldDir[i].y) > Math.abs(worldDir[up].y)) up = i;
  }
  const upSign = Math.sign(worldDir[up].y) || 1;

  // 2) Of the other two axes, the thinner one is the monitor's depth (normal)
  const others = [0, 1, 2].filter((i) => i !== up);
  const n = size.getComponent(others[0]) <= size.getComponent(others[1]) ? others[0] : others[1];
  const w = others.find((i) => i !== n);

  // 3) Front side = the one facing the camera right now
  const centerWorld = mesh.localToWorld(center.clone());
  const toCam = camera.position.clone().sub(centerWorld);
  let nSign = Math.sign(worldDir[n].dot(toCam)) || 1;
  if (FLIP_FRONT) nSign *= -1;

  const U = AX[up].clone().multiplyScalar(upSign);
  const N = AX[n].clone().multiplyScalar(nSign);
  const R = new THREE.Vector3().crossVectors(U, N); // plane +X → no mirrored text

  // 4) Size from the bounding box
  const { x0, x1, y0, y1 } = SCREEN_RECT;
  const W = size.getComponent(w);
  const H = size.getComponent(up);
  const planeW = W * (x1 - x0);
  const planeH = H * (y1 - y0);

  // 5) Position (all in the mesh's local space)
  const bottom = upSign > 0 ? box.min.getComponent(up) : box.max.getComponent(up);
  const posUp = bottom + upSign * H * (y0 + y1) / 2;
  const posW = center.getComponent(w) + R.getComponent(w) * ((x0 + x1) / 2 - 0.5) * W;
  const eps = Math.max(size.x, size.y, size.z) * 0.004;
  const bboxFront = nSign > 0 ? box.max.getComponent(n) : box.min.getComponent(n);

  const pos = new THREE.Vector3();
  pos.setComponent(up, posUp);
  pos.setComponent(w, posW);
  pos.setComponent(n, bboxFront);

  // 6) Snap to the real glass: ray from in front of the rect, toward the monitor
  const start = pos.clone().addScaledVector(N, size.getComponent(n) * 2);
  const origin = mesh.localToWorld(start.clone());
  const dir = N.clone().multiplyScalar(-1).transformDirection(mesh.matrixWorld);
  const hit = new THREE.Raycaster(origin, dir).intersectObject(mesh, false)[0];
  let normal = N.clone();              // fallback: the flat bounding-box axis
  if (hit) {
    const local = mesh.worldToLocal(hit.point.clone());
    pos.setComponent(n, local.getComponent(n));
    // Monitor glass is usually tilted back a few degrees. Match it using the
    // real face normal, otherwise part of the plane sinks behind the glass
    // and the text gets cut off.
    if (hit.face) {
      const fn = hit.face.normal.clone().normalize();
      if (fn.dot(N) < 0) fn.negate();
      if (fn.dot(N) > 0.8) normal = fn;   // sanity check: within ~37° of expected
    }
  } else {
    console.warn('[DeskModel] Raycast missed the monitor; using bounding-box front.');
  }
  pos.addScaledVector(normal, eps);

  // Basis for a plane lying flat on the (possibly tilted) glass
  const Rt = new THREE.Vector3().crossVectors(U, normal).normalize();
  const Ut = new THREE.Vector3().crossVectors(normal, Rt).normalize();

  // 7) Build the plane
  const texture = createScreenTexture(planeW / planeH);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: DEBUG ? '#ff00ff' : '#ffffff',
    transparent: true,
    opacity: DEBUG ? 0.6 : 0,        // idle = invisible, so the real black glass shows
    toneMapped: false,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
  });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeW, planeH), material);
  plane.name = 'ScreenOverlay';
  plane.position.copy(pos);
  plane.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(Rt, Ut, normal));
  plane.renderOrder = 2;
  mesh.add(plane);

  if (DEBUG) {
    console.log('[DeskModel debug]', {
      mesh: mesh.name,
      bboxSize: size.toArray().map((v) => +v.toFixed(4)),
      upAxis: 'xyz'[up], depthAxis: 'xyz'[n], widthAxis: 'xyz'[w],
      upSign, frontSign: nSign, raycastHit: !!hit,
      glassTiltDeg: +(Math.acos(Math.min(1, normal.dot(N))) * 180 / Math.PI).toFixed(1),
      plane: [+planeW.toFixed(4), +planeH.toFixed(4)],
    });
  }
  return { plane, material, texture };
}

export default function DeskModel({ isActive = false, isDark = true, onLoaded }) {
  const groupRef = useRef();
  const screenRef = useRef(null);            // { plane, material, texture }
  const isActiveRef = useRef(isActive);
  const anim = useRef({ o: 0 });
  const { invalidate, camera } = useThree();

  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const applyState = (active, instant) => {
    const s = screenRef.current;
    if (!s || DEBUG) return;
    const target = active ? 1 : 0;
    if (instant || reducedMotion) {
      gsap.killTweensOf(anim.current);
      anim.current.o = target;
      s.material.opacity = target;
      invalidate();
      return;
    }
    gsap.to(anim.current, {
      o: target,
      duration: TWEEN_DURATION,
      ease: active ? 'power2.out' : 'power2.in',
      overwrite: 'auto',
      onUpdate: () => {
        s.material.opacity = anim.current.o;
        invalidate();
      },
    });
  };

  /* ── Load model ── */
  useEffect(() => {
    let cancelled = false;          // guards React StrictMode's double effect
    let model = null;
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    loader.load(
      MODEL_PATH,
      (gltf) => {
        if (cancelled) return;
        model = gltf.scene;

        // Auto-centre and scale to ≈ 2 world units
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const scale = 2.0 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        model.traverse((c) => {
          if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; }
        });

        groupRef.current.add(model);
        groupRef.current.updateWorldMatrix(true, true);   // needed before measuring/raycasting

        const monitor = findMonitorMesh(model);
        if (monitor) {
          screenRef.current = addScreenOverlay(monitor, camera);
          applyState(isActiveRef.current, true);          // respect current hover state
        }

        invalidate();
        onLoaded?.();
      },
      undefined,
      (err) => {
        console.error('[DeskModel] Load failed:', err);
        if (!cancelled) onLoaded?.();
      }
    );

    return () => {
      cancelled = true;
      gsap.killTweensOf(anim.current);
      screenRef.current?.texture.dispose();
      screenRef.current = null;
      if (model) {
        model.traverse((c) => {
          if (!c.isMesh) return;
          c.geometry?.dispose();
          (Array.isArray(c.material) ? c.material : [c.material]).forEach((m) => {
            ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap']
              .forEach((k) => m[k]?.dispose?.());
            m.dispose();
          });
        });
        model.parent?.remove(model);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Screen ON / OFF ── */
  useEffect(() => {
    isActiveRef.current = isActive;
    applyState(isActive, false);
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  return <group ref={groupRef} />;
}

/** Start fetching the model early (e.g. when the Contact tab is hovered). */
export function preloadDeskModel() {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(MODEL_PATH, () => { }, undefined, () => { });
}
