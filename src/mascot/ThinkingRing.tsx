"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { Drive } from "./animations/drive";
import { PALETTE } from "./design";

/**
 * Orbiting particle ring shown during `thinking` (brief §5). Cheap: a single
 * Points object of N particles on a tilted circle, rotated each frame. Opacity
 * is read from drive.ringOpacity so GSAP fades it in/out with the state.
 * Fully hidden (visible=false) when opacity ~0 so it costs nothing otherwise.
 */
export function ThinkingRing({ drive }: { drive: Drive }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const N = 28;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3);
    const r = 0.85;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.28; // squashed ellipse -> orbit look
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    const p = points.current;
    const m = mat.current;
    if (!p || !m) return;
    const op = drive.ringOpacity;
    p.visible = op > 0.01;
    if (!p.visible) return;
    p.rotation.y += Math.min(delta, 0.05) * 1.6;
    p.rotation.x = 0.5;
    m.opacity = op;
    // gentle per-particle twinkle via size
    m.size = 0.05 + Math.sin(performance.now() / 200) * 0.012;
  });

  return (
    <points ref={points} geometry={geometry} position={[0, 0.1, 0]} visible={false}>
      <pointsMaterial
        ref={mat}
        color={PALETTE.accentHot}
        size={0.05}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}
