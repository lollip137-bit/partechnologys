'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { timeline } from '@/state/timeline';
import { CAM_KEYS } from './phases';

// Non-uniform Catmull-Rom over the keyframe list — one continuous take.
function catmull(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

function sample(keys: typeof CAM_KEYS, p: number, out: THREE.Vector3, field: 'pos' | 'look') {
  const n = keys.length;
  let i = 0;
  while (i < n - 2 && p > keys[i + 1].p) i++;
  const k0 = keys[Math.max(0, i - 1)][field];
  const k1 = keys[i][field];
  const k2 = keys[i + 1][field];
  const k3 = keys[Math.min(n - 1, i + 2)][field];
  const span = keys[i + 1].p - keys[i].p || 1;
  const t = Math.min(1, Math.max(0, (p - keys[i].p) / span));
  out.set(
    catmull(k0[0], k1[0], k2[0], k3[0], t),
    catmull(k0[1], k1[1], k2[1], k3[1], t),
    catmull(k0[2], k1[2], k2[2], k3[2], t),
  );
}

export default function CameraRig() {
  const pos = useRef(new THREE.Vector3(0, 0.8, 36));
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3(0, 1, 0));
  const fwd = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const p = timeline.progress;
    const t = state.clock.elapsedTime;
    const cam = state.camera as THREE.PerspectiveCamera;

    sample(CAM_KEYS, p, targetPos.current, 'pos');
    sample(CAM_KEYS, p, targetLook.current, 'look');

    // ---- PORTRAIT RE-FRAMING ----------------------------------------------
    // On desktop the copy owns one half of the screen, so the camera aims PAST
    // the object (look.x = ±OFF) to shove it into the other half. On a phone
    // the copy is a bottom sheet instead, and that sideways push threw every
    // structure half off the side of the screen. In portrait the object is
    // re-centred horizontally and the camera aims LOW, so the object rises
    // into the clear upper half above the panel.
    const aspect = state.size.width / state.size.height;
    if (aspect < 1.25) {
      const t = Math.min(1, Math.max(0, (1.25 - aspect) / 0.63));
      targetLook.current.x *= 1 - t;
      targetPos.current.x *= 1 - t * 0.6;
      // the finale is already framed low; don't stack a second drop on it,
      // and don't dolly as far back either — the brand mark is the hero of
      // that frame and a full portrait pull-back shrinks it to a sticker
      const fin = Math.min(1, Math.max(0, (p - 0.9) / 0.06));
      targetLook.current.y -= 1.9 * t * (1 - fin * 0.6);

      const back = 1 + (1.25 / Math.max(aspect, 0.4) - 1) * (0.75 - fin * 0.34);
      targetPos.current.sub(targetLook.current).multiplyScalar(back).add(targetLook.current);
    }

    // cinematic idle drift + handheld micro-tremor — the camera breathes, always
    targetPos.current.x += Math.sin(t * 0.23) * 0.35 + Math.sin(t * 1.7) * 0.02;
    targetPos.current.y += Math.sin(t * 0.31 + 2) * 0.22 + Math.sin(t * 2.3 + 1) * 0.015;

    // smooth pursuit — immediate but inertial, no jumps ever
    const k = 1 - Math.exp(-10.5 * delta);
    pos.current.lerp(targetPos.current, k);
    look.current.lerp(targetLook.current, k);

    // mouse-driven parallax in camera space
    fwd.current.subVectors(look.current, pos.current).normalize();
    right.current.crossVectors(fwd.current, up.current).normalize();
    const mx = timeline.mouse.x, my = timeline.mouse.y;

    cam.position.copy(pos.current)
      .addScaledVector(right.current, mx * 0.8)
      .addScaledVector(up.current, -my * 0.5);
    cam.lookAt(
      look.current.x + mx * 0.6,
      look.current.y - my * 0.4,
      look.current.z,
    );

    // subtle speed-driven FOV breathing (focus pull on velocity)
    const targetFov = 46 + Math.min(7, Math.abs(timeline.velocity) * 1.8);
    cam.fov += (targetFov - cam.fov) * k;
    cam.updateProjectionMatrix();
    timeline.camera = cam; // DOM overlays pin themselves to the 3D world through this
  });

  return null;
}
