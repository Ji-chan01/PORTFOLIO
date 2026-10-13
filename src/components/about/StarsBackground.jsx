import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

/**
 * Floating 3D stars for the "What Clients Say" background.
 * - "shaded" stars are lit (you see depth, highlights and shadow sides)
 * - "flat" stars use an unlit material (solid color, no shading)
 * Sits behind the content: parent must be `relative`, content must be `relative z-10`.
 */

const PALETTE = {
  light: {
    shaded: ['#0866FF', '#3B82F6', '#60A5FA', '#00B8E6'],
    flat: ['#BFDBFE', '#DBEAFE', '#93C5FD'],
  },
  dark: {
    shaded: ['#2563EB', '#3B82F6', '#38BDF8', '#6366F1'],
    flat: ['#1E3A8A', '#1E40AF', '#172554'],
  },
};

// x / y are fractions of the visible area (-0.5 .. 0.5); s = size; c = palette index
// Stars sit mostly toward the left and right edges so the cards stay readable.
const STARS = [
  { x: -0.4, y: -0.26, z: 0.5, s: 0.8, shaded: true, c: 0, spin: 0.45, phase: 0.2 },
  { x: -0.32, y: -0.04, z: -1.5, s: 0.45, shaded: false, c: 0, spin: 0.3, phase: 1.4 },
  { x: -0.42, y: 0.16, z: 1.0, s: 0.55, shaded: true, c: 2, spin: 0.6, phase: 2.1 },
  { x: -0.3, y: 0.34, z: -0.5, s: 0.7, shaded: false, c: 1, spin: 0.35, phase: 3.0 },
  { x: 0.4, y: -0.24, z: -0.5, s: 0.65, shaded: false, c: 1, spin: 0.4, phase: 0.9 },
  { x: 0.33, y: -0.06, z: 1.0, s: 0.5, shaded: true, c: 1, spin: 0.55, phase: 1.8 },
  { x: 0.42, y: 0.14, z: 0.0, s: 0.85, shaded: true, c: 3, spin: 0.4, phase: 2.7 },
  { x: 0.31, y: 0.32, z: -1.5, s: 0.4, shaded: false, c: 2, spin: 0.3, phase: 3.6 },
  { x: 0.4, y: 0.38, z: 0.8, s: 0.5, shaded: true, c: 0, spin: 0.5, phase: 4.2 },
  { x: -0.12, y: 0.4, z: -2.0, s: 0.3, shaded: false, c: 0, spin: 0.25, phase: 5.0 },
  { x: 0.1, y: -0.32, z: -2.0, s: 0.28, shaded: true, c: 2, spin: 0.35, phase: 5.6 },
  { x: -0.2, y: 0.08, z: -2.5, s: 0.25, shaded: false, c: 1, spin: 0.3, phase: 0.6 },
];

function makeStarGeometry() {
  const points = 5;
  const outer = 1;
  const inner = 0.48;
  const shape = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.1,
    bevelSegments: 4,
    curveSegments: 1,
  });
  geo.center();
  return geo;
}

function Star({ cfg, geometry, colors, animate }) {
  const ref = useRef(null);
  const { viewport } = useThree();
  // Size stars relative to the smaller side so they stay in proportion on phones too
  const unit = Math.min(viewport.width, viewport.height) / 8;
  const list = cfg.shaded ? colors.shaded : colors.flat;
  const color = list[cfg.c % list.length];

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh || !animate) return;
    const t = clock.elapsedTime;
    mesh.rotation.y = t * cfg.spin + cfg.phase;
    mesh.rotation.x = Math.sin(t * 0.6 + cfg.phase) * 0.35;
    mesh.position.y = cfg.y * viewport.height + Math.sin(t * 0.8 + cfg.phase) * 0.22 * unit;
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      position={[cfg.x * viewport.width, cfg.y * viewport.height, cfg.z]}
      rotation={[0.35, cfg.phase, 0.15]}
      scale={cfg.s * unit}
    >
      {cfg.shaded ? (
        <meshStandardMaterial
          color={color}
          roughness={0.35}
          metalness={0.15}
          transparent
          opacity={0.55}
        />
      ) : (
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
        />
      )}
    </mesh>
  );
}

export default function StarsBackground({ dark = false }) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const geometry = useMemo(makeStarGeometry, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  // Only run the render loop while the section is on screen
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '200px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const colors = dark ? PALETTE.dark : PALETTE.light;
  const animate = !reduceMotion;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <Canvas
        frameloop={animate && visible ? 'always' : 'demand'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 6]} intensity={2.2} />
        <directionalLight position={[-5, -3, 3]} intensity={0.6} color="#7dd3fc" />
        {STARS.map((cfg, i) => (
          <Star key={i} cfg={cfg} geometry={geometry} colors={colors} animate={animate} />
        ))}
      </Canvas>
    </div>
  );
}
