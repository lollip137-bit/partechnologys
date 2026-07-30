"use client";

/* eslint-disable react-hooks/immutability -- three.js objects are created once
   and mutated imperatively every frame inside useFrame. The compiler's
   immutability rule doesn't model this idiomatic R3F pattern. */

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { Drive } from "./animations/drive";
import { PALETTE } from "./design";

/**
 * A Dr. Strange–style energy portal: a sparking ring Drax steps through when it
 * hides or peeks around a frame edge. Keyed to the V3 palette (cyan core, hot
 * electric-white sparks) rather than the film's orange, so it belongs to the
 * same light as the rest of the site.
 *
 * Three cheap layers, all additive:
 *   1. a glowing torus rim,
 *   2. a shower of spark particles spun around that rim, and
 *   3. a soft inner glare disc that reads as the "open" mouth of the portal.
 *
 * Everything is driven by three drive fields written only by GSAP:
 *   `portal`  0..1 — open amount (scales size, opacity and spark energy),
 *   `portalX/Y`    — where on the frame edge the ring hangs.
 * The whole group sits OUTSIDE Drax's root group, so it stays put in world
 * space while Drax leans through it. Hidden entirely when shut, so it's free.
 */
export function Portal({ drive }: { drive: Drive }) {
  const group = useRef<THREE.Group>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const ring2Mat = useRef<THREE.MeshBasicMaterial>(null);
  const discMat = useRef<THREE.MeshBasicMaterial>(null);
  const sparks = useRef<THREE.Points>(null);
  const sparkMat = useRef<THREE.PointsMaterial>(null);

  const R = 0.72; // ring radius — sized to frame Drax's head + shoulders

  // Spark ring: N particles seeded around the rim with random angular offset,
  // radial jitter and phase so their twinkle never marches in lockstep.
  const N = 90;
  const { geometry, seeds } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3);
    const seedArr = new Float32Array(N * 2); // [phase, radialJitter]
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const rr = R + (Math.random() - 0.5) * 0.14;
      pos[i * 3] = Math.cos(a) * rr;
      pos[i * 3 + 1] = Math.sin(a) * rr;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
      seedArr[i * 2] = Math.random() * Math.PI * 2; // twinkle phase
      seedArr[i * 2 + 1] = 0.85 + Math.random() * 0.35; // per-spark size mult
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geometry: g, seeds: seedArr };
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const p = drive.portal;
    const on = p > 0.01;
    g.visible = on;
    if (!on) return;

    g.position.set(drive.portalX, drive.portalY, -0.25);

    const t = performance.now() / 1000;
    // open with a slight overshoot feel via easeOut on the raw value
    const open = THREE.MathUtils.clamp(p, 0, 1);
    const scale = 0.35 + open * 0.65; // never fully collapses to a dot
    g.scale.setScalar(scale);

    // rims counter-rotate for a churning, unstable-gateway feel
    const dt = Math.min(delta, 0.05);
    g.rotation.z += dt * 1.4;

    if (ringMat.current) ringMat.current.opacity = open * 0.9;
    if (ring2Mat.current) ring2Mat.current.opacity = open * 0.55 * (0.7 + 0.3 * Math.sin(t * 9));
    if (discMat.current) discMat.current.opacity = open * 0.22 * (0.6 + 0.4 * Math.sin(t * 4));

    // sparks: spin the whole cloud, flicker each particle by size, pulse opacity
    const s = sparks.current;
    const sm = sparkMat.current;
    if (s && sm) {
      s.rotation.z -= dt * 2.6; // opposite the rims
      sm.opacity = open;
      // collective flicker; individual twinkle is faked cheaply via base size
      const flick = 0.6 + 0.4 * Math.sin(t * 22 + seeds[0]);
      sm.size = (0.05 + open * 0.03) * flick;
    }
  });

  return (
    <group ref={group} visible={false}>
      {/* bright inner rim */}
      <mesh>
        <torusGeometry args={[R, 0.028, 10, 80]} />
        <meshBasicMaterial
          ref={ringMat}
          color={PALETTE.accentHot}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* softer outer halo rim */}
      <mesh>
        <torusGeometry args={[R + 0.05, 0.07, 10, 80]} />
        <meshBasicMaterial
          ref={ring2Mat}
          color={PALETTE.accent}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* inner glare disc — the "mouth" of the portal */}
      <mesh position={[0, 0, -0.02]}>
        <circleGeometry args={[R - 0.04, 48]} />
        <meshBasicMaterial
          ref={discMat}
          color={PALETTE.deep}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* crackling spark shower around the rim */}
      <points ref={sparks} geometry={geometry}>
        <pointsMaterial
          ref={sparkMat}
          color={PALETTE.accentHot}
          size={0.06}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          toneMapped={false}
        />
      </points>
    </group>
  );
}
