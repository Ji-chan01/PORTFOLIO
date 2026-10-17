import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/*
  Steam – rising wisps of warm vapour above the mug.
  Uses THREE.Points with a custom ShaderMaterial for
  soft, semi-transparent sprites that drift upward, fade out, and loop.
*/

const PARTICLE_COUNT = 28;

const vertexShader = `
  attribute float aSize;
  attribute float aLife;
  varying float vLife;
  uniform float uTime;
  void main() {
    vLife = aLife;
    vec3 pos = position;
    // Each particle loops from y=0 to y~0.6 based on its life+time
    float phase = fract(aLife + uTime * 0.15);
    pos.y += phase * 0.55;
    pos.x += sin(phase * 6.2831 + aLife * 40.0) * 0.03;
    pos.z += cos(phase * 6.2831 + aLife * 23.0) * 0.025;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (180.0 / -mvPos.z) * (1.0 - phase * 0.5);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = `
  varying float vLife;
  uniform float uTime;
  void main() {
    float phase = fract(vLife + uTime * 0.15);
    // Soft circle
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.15, d);
    // Fade in at start, fade out at end of life
    alpha *= smoothstep(0.0, 0.15, phase) * smoothstep(1.0, 0.55, phase);
    alpha *= 0.28;
    gl_FragColor = vec4(0.85, 0.85, 0.85, alpha);
  }
`;

export default function Steam({ position = [0, 0, 0], reducedMotion = false }) {
  const pointsRef = useRef();

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const lives = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
      sizes[i] = 0.8 + Math.random() * 1.2;
      lives[i] = Math.random();
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geom.setAttribute('aLife', new THREE.BufferAttribute(lives, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geom, material: mat };
  }, []);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} position={position} />
  );
}
