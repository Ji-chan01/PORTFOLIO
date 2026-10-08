import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import Laptop from './Laptop';
import Mug from './Mug';
import useCameraRig from './useCameraRig';
import DeskOverlay from './DeskOverlay';

/* ═══════════════════════════════════════════════
   Procedural Wood Grain Canvas Texture
   ═══════════════════════════════════════════════ */
function createWoodTexture(width = 512, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Base colour
  ctx.fillStyle = '#3d2b1a';
  ctx.fillRect(0, 0, width, height);

  // Grain lines
  for (let i = 0; i < 120; i++) {
    const y = Math.random() * height;
    const alpha = 0.04 + Math.random() * 0.08;
    ctx.strokeStyle = `rgba(80,50,20,${alpha})`;
    ctx.lineWidth = 1 + Math.random() * 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    // Slight wobble
    for (let x = 0; x < width; x += 10) {
      ctx.lineTo(x, y + Math.sin(x * 0.02 + i) * 3);
    }
    ctx.stroke();
  }

  // Knots
  for (let i = 0; i < 5; i++) {
    const kx = Math.random() * width;
    const ky = Math.random() * height;
    const gradient = ctx.createRadialGradient(kx, ky, 0, kx, ky, 15 + Math.random() * 20);
    gradient.addColorStop(0, 'rgba(30,15,5,0.3)');
    gradient.addColorStop(1, 'rgba(30,15,5,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(kx - 30, ky - 30, 60, 60);
  }

  return new THREE.CanvasTexture(canvas);
}

function createWoodRoughness(width = 512, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#888';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 200; i++) {
    const y = Math.random() * height;
    ctx.strokeStyle = `rgba(${120 + Math.random() * 60},${120 + Math.random() * 60},${120 + Math.random() * 60},0.3)`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < width; x += 8) {
      ctx.lineTo(x, y + Math.sin(x * 0.03 + i) * 2);
    }
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

/* ═══════════════════════════════════════════════
   Background – dark wall, window / bokeh lights, fog
   ═══════════════════════════════════════════════ */
function Background({ isDark }) {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 4, -6]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial
          color={isDark ? '#0e0d0c' : '#1a1917'}
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* Floor */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color={isDark ? '#0a0908' : '#141312'}
          roughness={0.9}
        />
      </mesh>

      {/* Window / bokeh lights – emissive circles in the background */}
      {[
        { pos: [-2, 5, -5.9], size: 0.8, color: '#f4deb3', intensity: 0.4 },
        { pos: [-1.2, 5.5, -5.9], size: 0.5, color: '#e8d4a8', intensity: 0.3 },
        { pos: [3, 5.2, -5.9], size: 0.6, color: '#f0d8b0', intensity: 0.25 },
        { pos: [4, 4.8, -5.9], size: 0.35, color: '#fce4c0', intensity: 0.2 },
        { pos: [-3.5, 4.6, -5.9], size: 0.4, color: '#e0c898', intensity: 0.15 },
        { pos: [1, 5.8, -5.9], size: 0.45, color: '#f5dbb5', intensity: 0.2 },
      ].map((b, i) => (
        <mesh key={i} position={b.pos}>
          <circleGeometry args={[b.size, 32]} />
          <meshStandardMaterial
            color={b.color}
            emissive={b.color}
            emissiveIntensity={b.intensity}
            transparent
            opacity={0.25}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════
   Desk – wooden tabletop with legs
   ═══════════════════════════════════════════════ */
function Desk({ isDark }) {
  const { woodMap, roughMap } = useMemo(() => {
    const wm = createWoodTexture();
    wm.wrapS = wm.wrapT = THREE.RepeatWrapping;
    wm.repeat.set(2, 1);
    const rm = createWoodRoughness();
    rm.wrapS = rm.wrapT = THREE.RepeatWrapping;
    rm.repeat.set(2, 1);
    return { woodMap: wm, roughMap: rm };
  }, []);

  useEffect(() => {
    return () => { woodMap.dispose(); roughMap.dispose(); };
  }, [woodMap, roughMap]);

  const legPositions = [
    [-2.2, -0.45, -0.7],
    [2.2, -0.45, -0.7],
    [-2.2, -0.45, 0.7],
    [2.2, -0.45, 0.7],
  ];

  return (
    <group>
      {/* Tabletop */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 0.1, 2.0]} />
        <meshStandardMaterial
          map={woodMap}
          roughnessMap={roughMap}
          roughness={0.55}
          metalness={0.05}
          color={isDark ? '#5a3d25' : '#6b4a30'}
          envMapIntensity={0.4}
        />
      </mesh>

      {/* Front edge strip */}
      <mesh position={[0, -0.02, 1.0]} castShadow>
        <boxGeometry args={[5.0, 0.06, 0.04]} />
        <meshStandardMaterial
          color={isDark ? '#4a3320' : '#5a4028'}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Legs */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.12, 0.9, 0.12]} />
          <meshStandardMaterial
            color={isDark ? '#3a2515' : '#4a3220'}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════
   Lighting – warm key, cool fill, faint rim
   ═══════════════════════════════════════════════ */
function Lighting({ isDark }) {
  const lampColor = isDark ? '#ffc87a' : '#ffe4b5';
  return (
    <>
      {/* Warm key light (desk lamp feel) */}
      <spotLight
        position={[-2.5, 4.5, 2]}
        angle={0.5}
        penumbra={0.7}
        intensity={3.0}
        color={lampColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0003}
        shadow-radius={4}
        distance={12}
        decay={2}
      />

      {/* Cool fill from above/front */}
      <pointLight
        position={[2, 3, 4]}
        intensity={0.3}
        color="#8ab4e8"
        distance={10}
        decay={2}
      />

      {/* Faint rim light from behind */}
      <pointLight
        position={[0, 2.5, -4]}
        intensity={0.4}
        color="#c4a06a"
        distance={8}
        decay={2}
      />

      {/* Subtle ambient fill */}
      <ambientLight intensity={0.08} color="#b8a88a" />
    </>
  );
}

/* ═══════════════════════════════════════════════
   Environment setup – applies RoomEnvironment IBL
   and fog inside the R3F scene tree.
   ═══════════════════════════════════════════════ */
function EnvironmentSetup({ isDark }) {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const envScene = new RoomEnvironment();
    const envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
    scene.environment = envMap;

    // Exponential fog
    scene.fog = new THREE.FogExp2(isDark ? '#0a0908' : '#0e0d0c', 0.04);

    return () => {
      envMap.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene, isDark]);

  return null;
}

/* ═══════════════════════════════════════════════
   Scene content – ties everything together inside
   the Canvas element (has access to R3F context).
   ═══════════════════════════════════════════════ */
function SceneContent({ isDark, onPresetChange }) {
  const [hoveredObject, setHoveredObject] = useState(null);
  const { goToPreset } = useCameraRig();

  // Check reduced motion
  const reducedMotion = useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleHover = useCallback((name) => {
    setHoveredObject(name);
    goToPreset(name);
    onPresetChange?.(name);
    document.body.style.cursor = 'pointer';
  }, [goToPreset, onPresetChange]);

  const handleUnhover = useCallback(() => {
    setHoveredObject(null);
    goToPreset('default');
    onPresetChange?.('default');
    document.body.style.cursor = 'auto';
  }, [goToPreset, onPresetChange]);

  // Expose goToPreset to parent via a ref on window for the overlay buttons
  useEffect(() => {
    window.__deskSceneGoToPreset = (name) => {
      if (name === 'default') handleUnhover();
      else handleHover(name);
    };
    return () => { delete window.__deskSceneGoToPreset; };
  }, [handleHover, handleUnhover]);

  // Touch support: tap-outside = pointer out
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'CANVAS') return; // let R3F handle canvas taps
    };
    window.addEventListener('touchstart', handler, { passive: true });
    return () => window.removeEventListener('touchstart', handler);
  }, []);

  return (
    <>
      <EnvironmentSetup isDark={isDark} />
      <Lighting isDark={isDark} />
      <Background isDark={isDark} />
      <Desk isDark={isDark} />

      {/* Laptop – positioned on the desk, slightly left of center */}
      <Laptop
        position={[-0.4, 0.05, -0.1]}
        hovered={hoveredObject === 'laptop'}
        isDark={isDark}
        onPointerOver={(e) => { e.stopPropagation(); handleHover('laptop'); }}
        onPointerOut={handleUnhover}
        onClick={(e) => { e.stopPropagation(); handleHover('laptop'); }}
      />

      {/* Mug – positioned to the right of the laptop */}
      <Mug
        position={[2.0, 0.05, -0.15]}
        hovered={hoveredObject === 'coffee'}
        isDark={isDark}
        reducedMotion={reducedMotion}
        onPointerOver={(e) => { e.stopPropagation(); handleHover('coffee'); }}
        onPointerOut={handleUnhover}
        onClick={(e) => { e.stopPropagation(); handleHover('coffee'); }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════
   DeskScene – the exported component with Canvas + Overlay
   ═══════════════════════════════════════════════ */
export default function DeskScene({ isDark = true }) {
  const [activePreset, setActivePreset] = useState('default');
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  // Pause rendering when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Responsive FOV
  const [fov, setFov] = useState(window.innerWidth < 640 ? 55 : 42);
  useEffect(() => {
    const handler = () => setFov(window.innerWidth < 640 ? 55 : 42);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ height: 'clamp(340px, 50vw, 520px)' }}
    >
      <Canvas
        shadows
        frameloop={isVisible ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ fov, near: 0.1, far: 50, position: [10, 9, 14] }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
          antialias: true,
        }}
        onCreated={({ gl: renderer }) => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <SceneContent isDark={isDark} onPresetChange={setActivePreset} />
      </Canvas>

      {/* CSS vignette overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* DOM Overlay */}
      <DeskOverlay
        activePreset={activePreset}
        onPresetSelect={(name) => {
          if (window.__deskSceneGoToPreset) {
            window.__deskSceneGoToPreset(name);
          }
        }}
      />
    </div>
  );
}
