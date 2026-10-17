import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/*
  Laptop – an aluminium laptop with:
  - Rounded-edge body (base + lid)
  - Instanced keyboard keys
  - Trackpad
  - Emissive screen with a CanvasTexture (dark code editor look)
  - Screen glow point light
*/

// Creates a procedural canvas texture for the laptop screen
function createScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  // Dark IDE background
  ctx.fillStyle = '#1a1b26';
  ctx.fillRect(0, 0, 512, 320);

  // Sidebar
  ctx.fillStyle = '#16161e';
  ctx.fillRect(0, 0, 60, 320);

  // Tab bar
  ctx.fillStyle = '#24283b';
  ctx.fillRect(60, 0, 452, 26);

  // Active tab
  ctx.fillStyle = '#1a1b26';
  ctx.fillRect(62, 0, 80, 26);
  ctx.fillStyle = '#7aa2f7';
  ctx.font = '10px monospace';
  ctx.fillText('App.jsx', 72, 16);

  // Inactive tab
  ctx.fillStyle = '#565f89';
  ctx.fillText('index.css', 155, 16);

  // Line numbers
  ctx.fillStyle = '#3b4261';
  ctx.font = '9px monospace';
  for (let i = 0; i < 18; i++) {
    ctx.fillText(String(i + 1).padStart(3, ' '), 68, 44 + i * 16);
  }

  // Code lines – simulated syntax highlighting
  const lines = [
    { text: 'import ', color: '#bb9af7' },
    { text: '{ useState }', color: '#c0caf5', dx: 46 },
    { text: ' from ', color: '#bb9af7', dx: 126 },
    { text: "'react'", color: '#9ece6a', dx: 162 },
  ];

  const codeSamples = [
    [
      { text: 'import ', color: '#bb9af7' },
      { text: 'React', color: '#c0caf5' },
      { text: ' from ', color: '#bb9af7' },
      { text: "'react'", color: '#9ece6a' },
    ],
    [
      { text: 'import ', color: '#bb9af7' },
      { text: '{ motion }', color: '#c0caf5' },
      { text: ' from ', color: '#bb9af7' },
      { text: "'framer-motion'", color: '#9ece6a' },
    ],
    [],
    [
      { text: 'const ', color: '#bb9af7' },
      { text: 'Portfolio', color: '#7aa2f7' },
      { text: ' = () => {', color: '#89ddff' },
    ],
    [
      { text: '  const ', color: '#bb9af7' },
      { text: '[tab, setTab]', color: '#c0caf5' },
      { text: ' = ', color: '#89ddff' },
      { text: 'useState', color: '#7aa2f7' },
      { text: '(0)', color: '#ff9e64' },
    ],
    [],
    [
      { text: '  return (', color: '#89ddff' },
    ],
    [
      { text: '    <', color: '#89ddff' },
      { text: 'motion.div', color: '#f7768e' },
      { text: ' className=', color: '#73daca' },
      { text: '"app"', color: '#9ece6a' },
      { text: '>', color: '#89ddff' },
    ],
    [
      { text: '      <', color: '#89ddff' },
      { text: 'Header', color: '#f7768e' },
      { text: ' />', color: '#89ddff' },
    ],
    [
      { text: '      <', color: '#89ddff' },
      { text: 'Sidebar', color: '#f7768e' },
      { text: ' tab={tab}', color: '#73daca' },
      { text: ' />', color: '#89ddff' },
    ],
    [
      { text: '      <', color: '#89ddff' },
      { text: 'main', color: '#f7768e' },
      { text: '>', color: '#89ddff' },
    ],
    [
      { text: '        {', color: '#89ddff' },
      { text: 'renderTab', color: '#7aa2f7' },
      { text: '(tab)}', color: '#89ddff' },
    ],
    [
      { text: '      </', color: '#89ddff' },
      { text: 'main', color: '#f7768e' },
      { text: '>', color: '#89ddff' },
    ],
    [
      { text: '    </', color: '#89ddff' },
      { text: 'motion.div', color: '#f7768e' },
      { text: '>', color: '#89ddff' },
    ],
    [
      { text: '  )', color: '#89ddff' },
    ],
    [
      { text: '}', color: '#89ddff' },
    ],
    [],
    [
      { text: 'export default ', color: '#bb9af7' },
      { text: 'Portfolio', color: '#7aa2f7' },
    ],
  ];

  ctx.font = '10px monospace';
  codeSamples.forEach((line, lineIdx) => {
    let x = 94;
    line.forEach(({ text, color }) => {
      ctx.fillStyle = color;
      ctx.fillText(text, x, 44 + lineIdx * 16);
      x += ctx.measureText(text).width;
    });
  });

  // Cursor blink area indicator
  ctx.fillStyle = '#c0caf5';
  ctx.fillRect(94, 105, 6, 12);

  // Status bar
  ctx.fillStyle = '#24283b';
  ctx.fillRect(0, 300, 512, 20);
  ctx.fillStyle = '#7aa2f7';
  ctx.font = '9px monospace';
  ctx.fillText('main ● App.jsx — JavaScript React', 10, 313);

  return new THREE.CanvasTexture(canvas);
}

// KEY LAYOUT – positions for instanced keyboard keys
function makeKeyPositions() {
  const keys = [];
  const rows = 5;
  const colCounts = [14, 14, 13, 12, 8]; // keys per row
  const rowWidths = [1.6, 1.6, 1.52, 1.44, 1.1]; // total row width
  const keyW = 0.1;
  const keyD = 0.09;
  const gap = 0.012;
  const startZ = 0.3;

  for (let r = 0; r < rows; r++) {
    const cols = colCounts[r];
    const totalW = rowWidths[r];
    const offsetX = -totalW / 2;
    for (let c = 0; c < cols; c++) {
      keys.push([
        offsetX + (c / cols) * totalW + keyW / 2,
        0.025,
        startZ - r * (keyD + gap),
      ]);
    }
  }
  return keys;
}

export default function Laptop({
  position = [0, 0, 0],
  hovered = false,
  onPointerOver,
  onPointerOut,
  onClick,
  isDark = false,
}) {
  const groupRef = useRef();
  const screenLightRef = useRef();
  const instancedRef = useRef();

  const keyPositions = useMemo(makeKeyPositions, []);

  const screenTexture = useMemo(() => createScreenTexture(), []);

  const {
    baseGeom, lidGeom, screenGeom, trackpadGeom, keyGeom, bezelGeom,
  } = useMemo(() => {
    return {
      // Laptop base (the bottom half)
      baseGeom: new THREE.BoxGeometry(1.8, 0.06, 1.1, 1, 1, 1),
      // Lid
      lidGeom: new THREE.BoxGeometry(1.8, 0.04, 1.2, 1, 1, 1),
      // Inner screen plane
      screenGeom: new THREE.PlaneGeometry(1.6, 1.0),
      // Trackpad
      trackpadGeom: new THREE.BoxGeometry(0.5, 0.005, 0.32, 1, 1, 1),
      // Individual key
      keyGeom: new THREE.BoxGeometry(0.09, 0.015, 0.08),
      // Bezel frame
      bezelGeom: new THREE.BoxGeometry(1.72, 0.005, 1.1),
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      baseGeom.dispose();
      lidGeom.dispose();
      screenGeom.dispose();
      trackpadGeom.dispose();
      keyGeom.dispose();
      bezelGeom.dispose();
      screenTexture.dispose();
    };
  }, [baseGeom, lidGeom, screenGeom, trackpadGeom, keyGeom, bezelGeom, screenTexture]);

  // Set instanced key positions
  useEffect(() => {
    if (!instancedRef.current) return;
    const dummy = new THREE.Object3D();
    keyPositions.forEach((pos, i) => {
      dummy.position.set(...pos);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(i, dummy.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
  }, [keyPositions]);

  // Screen glow intensity
  useFrame(() => {
    if (screenLightRef.current) {
      screenLightRef.current.intensity = hovered ? 2.0 : 1.0;
    }
  });

  // Lid angle ~110 degrees
  const lidAngle = -(Math.PI * 110) / 180;
  const aluminumColor = isDark ? '#8a8a90' : '#b0b0b8';
  const screenEmissive = hovered ? 1.5 : 0.8;

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      {/* Base */}
      <mesh geometry={baseGeom} position={[0, 0.03, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color={aluminumColor}
          roughness={0.35}
          metalness={0.85}
        />
      </mesh>

      {/* Keyboard keys (instanced) */}
      <instancedMesh
        ref={instancedRef}
        args={[keyGeom, null, keyPositions.length]}
        position={[0, 0.06, -0.05]}
        castShadow
      >
        <meshStandardMaterial
          color={isDark ? '#2a2a2e' : '#3a3a3e'}
          roughness={0.6}
          metalness={0.3}
        />
      </instancedMesh>

      {/* Trackpad */}
      <mesh geometry={trackpadGeom} position={[0, 0.063, 0.38]} receiveShadow>
        <meshStandardMaterial
          color={aluminumColor}
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>

      {/* Lid pivot group – rotated to ~110 degrees open */}
      <group position={[0, 0.06, -0.55]} rotation={[lidAngle, 0, 0]}>
        {/* Lid body */}
        <mesh geometry={lidGeom} position={[0, 0, -0.6]} castShadow>
          <meshStandardMaterial
            color={aluminumColor}
            roughness={0.35}
            metalness={0.85}
          />
        </mesh>

        {/* Bezel */}
        <mesh geometry={bezelGeom} position={[0, 0.025, -0.6]}>
          <meshStandardMaterial color="#0a0a0a" roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Screen */}
        <mesh geometry={screenGeom} position={[0, 0.03, -0.6]} rotation={[0, 0, 0]}>
          <meshStandardMaterial
            map={screenTexture}
            emissiveMap={screenTexture}
            emissive="#ffffff"
            emissiveIntensity={screenEmissive}
            roughness={0.1}
            metalness={0.0}
            toneMapped={false}
          />
        </mesh>

        {/* Cool-blue screen glow light */}
        <pointLight
          ref={screenLightRef}
          position={[0, 0.4, -0.3]}
          color="#6088cc"
          intensity={1.0}
          distance={4}
          decay={2}
        />
      </group>
    </group>
  );
}
