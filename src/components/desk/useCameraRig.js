import { useRef, useCallback, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import gsap from 'gsap';

/* ───────────────────────────────────────────────
   Camera preset definitions
   Each preset has a camera position and a lookAt target.
   Tweak these to reframe the scene.
   ─────────────────────────────────────────────── */
const PRESETS = {
  // Wide three-quarter overview of the whole desk
  default: {
    position: [4.5, 4.0, 6.5],
    target: [0, 0.6, 0],
  },
  // Close, slightly low angle, framing the laptop screen
  laptop: {
    position: [0.3, 2.0, 3.2],
    target: [-0.3, 1.4, -0.5],
  },
  // Very close, low angle, shallow framing of the mug and steam
  coffee: {
    position: [3.0, 1.6, 2.0],
    target: [2.2, 0.9, -0.3],
  },
};

// Intro start camera (far, high angle)
const INTRO_START = {
  position: [10, 9, 14],
  target: [0, 0.6, 0],
};

export default function useCameraRig() {
  const { camera } = useThree();
  const cameraPos = useRef(new Vector3(...INTRO_START.position));
  const lookTarget = useRef(new Vector3(...INTRO_START.target));
  const currentPreset = useRef('default');
  const mouseOffset = useRef({ x: 0, y: 0 });
  const introPlayed = useRef(false);
  const reducedMotion = useRef(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mql.matches;
    const handler = (e) => { reducedMotion.current = e.matches; };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Mouse parallax listener
  useEffect(() => {
    const handler = (e) => {
      mouseOffset.current.x = (e.clientX / window.innerWidth - 0.5) * 0.15;
      mouseOffset.current.y = (e.clientY / window.innerHeight - 0.5) * 0.1;
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // Intro dolly on mount
  useEffect(() => {
    if (introPlayed.current) return;
    introPlayed.current = true;

    const preset = PRESETS.default;
    const dur = reducedMotion.current ? 0 : 3;

    camera.position.set(...INTRO_START.position);
    cameraPos.current.set(...INTRO_START.position);
    lookTarget.current.set(...INTRO_START.target);

    gsap.to(cameraPos.current, {
      x: preset.position[0],
      y: preset.position[1],
      z: preset.position[2],
      duration: dur,
      ease: 'power3.inOut',
    });
    gsap.to(lookTarget.current, {
      x: preset.target[0],
      y: preset.target[1],
      z: preset.target[2],
      duration: dur,
      ease: 'power3.inOut',
    });
  }, [camera]);

  // Navigate to a preset
  const goToPreset = useCallback(
    (name) => {
      const preset = PRESETS[name] || PRESETS.default;
      currentPreset.current = name;

      const dur = reducedMotion.current ? 0.25 : 1.4;

      // Kill any running camera tweens to prevent jitter
      gsap.killTweensOf(cameraPos.current);
      gsap.killTweensOf(lookTarget.current);

      gsap.to(cameraPos.current, {
        x: preset.position[0],
        y: preset.position[1],
        z: preset.position[2],
        duration: dur,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });
      gsap.to(lookTarget.current, {
        x: preset.target[0],
        y: preset.target[1],
        z: preset.target[2],
        duration: dur,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });
    },
    []
  );

  // Per-frame update: apply position + parallax + breathing, then lookAt
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Subtle breathing sway (a few cm only)
    const breathX = reducedMotion.current ? 0 : Math.sin(t * 0.3) * 0.04;
    const breathY = reducedMotion.current ? 0 : Math.cos(t * 0.25) * 0.03;

    camera.position.set(
      cameraPos.current.x + mouseOffset.current.x + breathX,
      cameraPos.current.y + mouseOffset.current.y * 0.5 + breathY,
      cameraPos.current.z
    );

    camera.lookAt(lookTarget.current);
  });

  return { goToPreset, currentPreset, PRESETS };
}
