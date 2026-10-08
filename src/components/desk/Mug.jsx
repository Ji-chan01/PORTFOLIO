import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import Steam from './Steam';

/*
  Mug – a ceramic coffee mug with handle, dark coffee surface, and steam.
  Built entirely from THREE.LatheGeometry + TorusGeometry.
*/

// Mug body profile for LatheGeometry
function makeMugProfile() {
  const pts = [];
  // Bottom disc
  pts.push(new THREE.Vector2(0, 0));
  pts.push(new THREE.Vector2(0.32, 0));
  pts.push(new THREE.Vector2(0.34, 0.02));
  // Outer wall
  pts.push(new THREE.Vector2(0.36, 0.08));
  pts.push(new THREE.Vector2(0.38, 0.3));
  pts.push(new THREE.Vector2(0.39, 0.5));
  pts.push(new THREE.Vector2(0.38, 0.62));
  // Rim (slightly flared out)
  pts.push(new THREE.Vector2(0.40, 0.65));
  pts.push(new THREE.Vector2(0.40, 0.67));
  // Inner wall going back down
  pts.push(new THREE.Vector2(0.34, 0.65));
  pts.push(new THREE.Vector2(0.33, 0.5));
  pts.push(new THREE.Vector2(0.32, 0.3));
  pts.push(new THREE.Vector2(0.31, 0.1));
  pts.push(new THREE.Vector2(0, 0.08));
  return pts;
}

export default function Mug({
  position = [0, 0, 0],
  hovered = false,
  onPointerOver,
  onPointerOut,
  onClick,
  reducedMotion = false,
  isDark = true,
}) {
  const groupRef = useRef();

  const { mugGeom, coffeeSurfaceGeom, handleGeom, coasterGeom } = useMemo(() => {
    const profile = makeMugProfile();
    const mug = new THREE.LatheGeometry(profile, 48);
    // Coffee surface – a circle slightly below the rim
    const coffee = new THREE.CircleGeometry(0.33, 48);
    coffee.rotateX(-Math.PI / 2);
    // Handle – a torus ring
    const handle = new THREE.TorusGeometry(0.15, 0.04, 12, 24);
    // Coaster
    const coaster = new THREE.CylinderGeometry(0.5, 0.5, 0.04, 48);
    return { mugGeom: mug, coffeeSurfaceGeom: coffee, handleGeom: handle, coasterGeom: coaster };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      mugGeom.dispose();
      coffeeSurfaceGeom.dispose();
      handleGeom.dispose();
      coasterGeom.dispose();
    };
  }, [mugGeom, coffeeSurfaceGeom, handleGeom, coasterGeom]);

  const ceramicColor = isDark ? '#c4b5a0' : '#d4c8b8';
  const emissiveIntensity = hovered ? 0.15 : 0;

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      {/* Coaster */}
      <mesh geometry={coasterGeom} position={[0, 0.02, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2a2520" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Mug body */}
      <mesh geometry={mugGeom} position={[0, 0.04, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color={ceramicColor}
          roughness={0.45}
          metalness={0.05}
          emissive={hovered ? '#5a4a35' : '#000000'}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Handle */}
      <mesh geometry={handleGeom} position={[0.40, 0.38, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <meshStandardMaterial
          color={ceramicColor}
          roughness={0.45}
          metalness={0.05}
          emissive={hovered ? '#5a4a35' : '#000000'}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Coffee surface */}
      <mesh geometry={coffeeSurfaceGeom} position={[0, 0.64, 0]}>
        <meshStandardMaterial
          color="#1a0e06"
          roughness={0.15}
          metalness={0.3}
        />
      </mesh>

      {/* Steam */}
      <Steam position={[0, 0.7, 0]} reducedMotion={reducedMotion} />
    </group>
  );
}
