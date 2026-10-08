import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import DeskControls from './DeskControls';
import DeskModel from './DeskModel';
import DeskPlaceholder from './DeskPlaceholder';

/*
  ContactDesk – 3D desk scene for the Contact tab.

  Props:
    isActive  – boolean, whether the contact form is hovered/focused
    isDark    – boolean, current theme

  ─── Tunable values ───
  CAMERA_POS        : initial camera position [x, y, z]
  CAMERA_FOV        : field of view (degrees)
  LIGHT_KEY_*       : warm key light (desk lamp feel) parameters
  LIGHT_RIM_*       : soft accent rim light parameters
  POLAR_MIN/MAX     : up/down orbit limits (radians)
  SWEEP_CENTER_DEG  : middle of the automatic left↔right sweep (0 = straight in front).
                      Width of the sweep (180°) and its speed live in DeskControls.jsx
*/

const CAMERA_POS = [2.0, 1.8, 2.8];   // three-quarter view
const CAMERA_FOV = 40;                 // narrow FOV for clean perspective
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 50;

// Key light – warm desk lamp feel
const LIGHT_KEY_POS = [-1.5, 3.0, 2.0];
const LIGHT_KEY_INTENSITY = 2.5;
const LIGHT_KEY_COLOR_DARK = '#ffc87a';
const LIGHT_KEY_COLOR_LIGHT = '#ffe4b5';

// Rim light – follows theme accent
const LIGHT_RIM_POS = [2.0, 1.5, -2.0];
const LIGHT_RIM_INTENSITY = 0.8;
const LIGHT_RIM_COLOR_DARK = '#fb7185';   // pink accent in dark mode
const LIGHT_RIM_COLOR_LIGHT = '#4488cc';  // blue accent in light mode

// Ambient
const LIGHT_AMBIENT_INTENSITY = 0.08;

// Camera limits
const POLAR_MIN = Math.PI * 0.15;   // ~27° from top
const POLAR_MAX = Math.PI * 0.55;   // ~99° – just above horizon
const SWEEP_CENTER_DEG = 0;         // sweep is centred on the front of the desk

/* ═══════════════════════════════════════
   Environment – applies RoomEnvironment IBL at low intensity
   ═══════════════════════════════════════ */
function EnvironmentSetup() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const envScene = new RoomEnvironment();
    const envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
    scene.environment = envMap;

    return () => {
      envMap.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene]);

  return null;
}

/* ═══════════════════════════════════════
   Lighting – warm key + theme-aware rim
   ═══════════════════════════════════════ */
function Lighting({ isDark }) {
  const keyColor = isDark ? LIGHT_KEY_COLOR_DARK : LIGHT_KEY_COLOR_LIGHT;
  const rimColor = isDark ? LIGHT_RIM_COLOR_DARK : LIGHT_RIM_COLOR_LIGHT;

  return (
    <>
      {/* Warm key light (desk lamp feel) */}
      <spotLight
        position={LIGHT_KEY_POS}
        angle={0.6}
        penumbra={0.7}
        intensity={LIGHT_KEY_INTENSITY}
        color={keyColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0003}
        shadow-radius={4}
        distance={10}
        decay={2}
      />

      {/* Accent rim light (follows theme) */}
      <pointLight
        position={LIGHT_RIM_POS}
        intensity={LIGHT_RIM_INTENSITY}
        color={rimColor}
        distance={8}
        decay={2}
      />

      {/* Very subtle ambient fill */}
      <ambientLight intensity={LIGHT_AMBIENT_INTENSITY} color="#b8a88a" />
    </>
  );
}

/* ═══════════════════════════════════════
   Contact shadow plane under the desk
   ═══════════════════════════════════════ */
function ShadowPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <shadowMaterial transparent opacity={0.25} />
    </mesh>
  );
}

/* ═══════════════════════════════════════
   Scene content – wraps everything inside the Canvas
   ═══════════════════════════════════════ */
function SceneContent({ isActive, isDark, onLoaded, enableShadows }) {
  return (
    <>
      <EnvironmentSetup />
      <Lighting isDark={isDark} />
      {enableShadows && <ShadowPlane />}
      {/* Auto-sweeps 180° left↔right. While the form is active it glides
          back to the starting view so the screen text is readable. */}
      <DeskControls
        holdFront={isActive}
        center={SWEEP_CENTER_DEG}
        polarMin={POLAR_MIN}
        polarMax={POLAR_MAX}
      />
      <DeskModel isActive={isActive} isDark={isDark} onLoaded={onLoaded} />
    </>
  );
}

/* ═══════════════════════════════════════
   ContactDesk – main exported component
   ═══════════════════════════════════════ */
export default function ContactDesk({ isActive = false, isDark = true }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  // Responsive: detect small screens
  const [isSmall, setIsSmall] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handler = () => setIsSmall(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // IntersectionObserver – mount canvas only when in viewport
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

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) setWebglFailed(true);
    } catch {
      setWebglFailed(true);
    }
  }, []);

  const handleModelLoaded = useCallback(() => {
    setModelLoaded(true);
  }, []);

  const enableShadows = !isSmall;
  const dpr = isSmall ? [1, 1.25] : [1, 2];

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      style={{
        minHeight: isSmall ? '30vh' : '100%',
        /* Allow vertical scrolling on touch over the canvas */
        touchAction: 'pan-y',
      }}
      role="img"
      aria-label="3D computer desk scene that reacts when you interact with the contact form"
    >
      {/* Placeholder – shown while loading or on WebGL failure */}
      {(!modelLoaded || webglFailed) && (
        <div
          className="absolute inset-0 z-10 transition-opacity duration-700"
          style={{ opacity: modelLoaded && !webglFailed ? 0 : 1 }}
        >
          <DeskPlaceholder isDark={isDark} />
        </div>
      )}

      {/* 3D Canvas – only mount when visible and WebGL is available */}
      {isVisible && !webglFailed && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: modelLoaded ? 1 : 0 }}
        >
          <Canvas
            shadows={enableShadows}
            frameloop="demand"
            dpr={dpr}
            camera={{
              fov: CAMERA_FOV,
              near: CAMERA_NEAR,
              far: CAMERA_FAR,
              position: CAMERA_POS,
            }}
            gl={{
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.0,
              outputColorSpace: THREE.SRGBColorSpace,
              antialias: true,
              alpha: true,  // transparent background
            }}
            onCreated={({ gl: renderer }) => {
              if (enableShadows) {
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
              }
            }}
          >
            <SceneContent
              isActive={isActive}
              isDark={isDark}
              onLoaded={handleModelLoaded}
              enableShadows={enableShadows}
            />
          </Canvas>
        </div>
      )}


    </div>
  );
}
