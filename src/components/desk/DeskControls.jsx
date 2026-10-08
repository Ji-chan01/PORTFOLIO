import { useEffect, useMemo, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/*
  DeskControls – OrbitControls + automatic left ↔ right camera sweep.
  Visitors can still hold and drag; the sweep resumes after they let go.

  Props:
    target     : [x, y, z] the point the camera looks at
    sweep      : turn the automatic sweep on/off
    holdFront  : when true, glide back to the STARTING view and stay there
                 (pass your form's isActive so the screen text is readable)
    center     : degrees. Middle of the sweep. 0 = straight in front of the desk.
                 Leave out to centre the sweep on wherever the camera starts.
    polarMin / polarMax : optional absolute up/down limits in radians.
                 Leave out to allow a small tilt around the starting view.

  ─── Tunable ───
  SWEEP_DEGREES   : total width of the sweep (180 = 90° each side of the centre)
  SWEEP_SPEED     : ≈ SWEEP_SPEED × 6 degrees per second (3 → ~10 s per 180° pass)
  RESUME_DELAY_MS : pause after a visitor stops dragging
*/

const SWEEP_DEGREES = 180;
const SWEEP_SPEED = 3;
const RESUME_DELAY_MS = 2500;
const POLAR_RANGE = { up: 0.25, down: 0.25 };
const EDGE = 0.03; // radians – how close to a limit before reversing

const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export default function DeskControls({
  target = [0, 0, 0],
  sweep = true,
  holdFront = false,
  center = null,
  polarMin = null,
  polarMax = null,
}) {
  const { camera, gl, invalidate } = useThree();
  const ctrl = useRef(null);
  const home = useRef(0);   // azimuth of the starting view
  const mid = useRef(0);    // middle of the sweep
  const dragging = useRef(false);
  const timer = useRef(null);
  const holdRef = useRef(holdFront);
  holdRef.current = holdFront;

  const reduced = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    const c = new OrbitControls(camera, gl.domElement);
    c.target.set(...target);
    c.enableZoom = false;
    c.enablePan = false;
    c.enableDamping = true;
    c.dampingFactor = 0.08;
    c.update(); // sync with the camera's starting position

    home.current = c.getAzimuthalAngle();
    mid.current = center == null ? home.current : THREE.MathUtils.degToRad(center);
    const half = THREE.MathUtils.degToRad(SWEEP_DEGREES / 2);
    c.minAzimuthAngle = mid.current - half;
    c.maxAzimuthAngle = mid.current + half;

    const polar = c.getPolarAngle();
    c.minPolarAngle = polarMin ?? Math.max(0.2, polar - POLAR_RANGE.up);
    c.maxPolarAngle = polarMax ?? Math.max(polar, Math.min(Math.PI / 2.02, polar + POLAR_RANGE.down));

    c.autoRotate = sweep && !reduced;
    c.autoRotateSpeed = SWEEP_SPEED;

    const onStart = () => {
      dragging.current = true;
      clearTimeout(timer.current);
    };
    const onEnd = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        dragging.current = false;
        invalidate();
      }, RESUME_DELAY_MS);
    };
    c.addEventListener('start', onStart);
    c.addEventListener('end', onEnd);
    c.addEventListener('change', invalidate);

    ctrl.current = c;
    invalidate();

    return () => {
      clearTimeout(timer.current);
      c.removeEventListener('start', onStart);
      c.removeEventListener('end', onEnd);
      c.removeEventListener('change', invalidate);
      c.dispose();
      ctrl.current = null;
    };
  }, [camera, gl]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, delta) => {
    const c = ctrl.current;
    if (!c) return;

    const canMove = sweep && !reduced && !dragging.current;
    const az = c.getAzimuthalAngle();
    const relMid = wrap(az - mid.current);
    const relHome = wrap(az - home.current);
    const half = THREE.MathUtils.degToRad(SWEEP_DEGREES / 2);

    if (canMove && holdRef.current) {
      // Glide back to the starting view and stay there
      if (Math.abs(relHome) > 0.02) {
        c.autoRotate = true;
        c.autoRotateSpeed = relHome > 0 ? SWEEP_SPEED : -SWEEP_SPEED;
      } else {
        c.autoRotate = false;
      }
    } else if (canMove) {
      // Ping-pong between the two limits
      c.autoRotate = true;
      if (relMid <= -half + EDGE) c.autoRotateSpeed = -SWEEP_SPEED;
      else if (relMid >= half - EDGE) c.autoRotateSpeed = SWEEP_SPEED;
    } else {
      c.autoRotate = false;
    }

    const moved = c.update(Math.min(delta, 0.05));
    if (c.autoRotate || moved) invalidate(); // keeps rendering when frameloop="demand"
  });

  return null;
}
