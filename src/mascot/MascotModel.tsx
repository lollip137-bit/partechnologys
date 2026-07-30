"use client";

/* eslint-disable react-hooks/immutability -- react-three-fiber's model is to
   create three.js objects once and mutate them imperatively every frame inside
   useFrame (material uniforms, emissiveIntensity, transforms). The React
   Compiler immutability rule doesn't model this and flags the per-frame writes;
   they are correct and intentional here. */

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mascotStore } from "./useMascotState";
import { createDrive } from "./animations/drive";
import { TransitionManager } from "./animations/transitions";
import { createEyeMaterial } from "./eyeMaterial";
import { createLogoTexture, LOGO_EMISSIVE } from "./logoTexture";
import { AMBIENT, LOOK_CLAMP, LOOK_LERP, PALETTE } from "./design";
import { ThinkingRing } from "./ThinkingRing";
import { Portal } from "./Portal";

// ---- scratch objects: declared ONCE, reused every frame (brief §8) ----------
const _tmpEuler = new THREE.Euler();
const _accent = new THREE.Color(PALETTE.accent);

export function MascotModel() {
  // Groups / meshes we drive each frame.
  const root = useRef<THREE.Group>(null);
  const bodyGroup = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const handL = useRef<THREE.Mesh>(null);
  const handR = useRef<THREE.Mesh>(null);

  // Materials whose emissive we drive.
  const logoMat = useRef<THREE.MeshStandardMaterial>(null);
  const seamMat = useRef<THREE.MeshStandardMaterial>(null);

  // The drive object + its GSAP transition manager live for the model's life.
  const drive = useMemo(() => createDrive(), []);
  const tm = useMemo(() => new TransitionManager(drive), [drive]);

  // Created once, stable for the model's life. Their uniforms/emissive are
  // written every frame in useFrame — the idiomatic R3F pattern.
  const eyeMat = useMemo(() => createEyeMaterial(), []);
  const logoTex = useMemo(() => createLogoTexture(), []);

  // Blink scheduler (procedural, not GSAP).
  const blink = useRef({ next: 0.8, closing: -1 });

  // Smoothed head look angles + body lean.
  const look = useRef({ yaw: 0, pitch: 0 });
  const lean = useRef(0);

  // Drive the GSAP timeline off resolved-state changes WITHOUT re-rendering the
  // R3F tree: subscribe imperatively.
  useEffect(() => {
    tm.hideDir = mascotStore.getState().hideDir;
    tm.go(mascotStore.getState().state);
    const unsub = mascotStore.subscribe((s, prev) => {
      // keep the edge current BEFORE building a hide/peek timeline
      tm.hideDir = s.hideDir;
      if (s.state !== prev.state) tm.go(s.state);
    });
    return () => {
      unsub();
      tm.dispose();
    };
  }, [tm]);

  useEffect(() => {
    return () => {
      eyeMat.dispose();
      logoTex.dispose();
    };
  }, [eyeMat, logoTex]);

  useFrame((_, rawDelta) => {
    const s = mascotStore.getState();
    const t = performance.now() / 1000;
    const dt = Math.min(rawDelta, 1 / 20); // clamp huge deltas (tab refocus)
    const reduced = s.reducedMotion;
    const ambient = reduced ? 0 : 1;

    // --- ambient float + drift (killed by reduced-motion) -------------------
    const floatY =
      Math.sin((t * 2 * Math.PI) / AMBIENT.floatPeriod) *
      AMBIENT.floatAmplitude *
      drive.bob *
      ambient;
    const driftZ =
      Math.sin((t * 2 * Math.PI) / AMBIENT.driftPeriod) *
      AMBIENT.driftAmplitudeZ *
      ambient;

    // slow breath while asleep (adds a tiny scale pulse)
    const breath = drive.breathe * Math.sin(t * 0.8) * 0.012 * ambient;

    // irritated tremble — fast, small, amplitude decays via drive.shake
    const sh = drive.shake * ambient;
    const shakeX = sh ? Math.sin(t * 47) * 0.032 * sh : 0;
    const shakeY = sh ? Math.sin(t * 61) * 0.020 * sh : 0;

    if (root.current) {
      root.current.position.x = drive.offsetX + shakeX;
      root.current.position.y = floatY + drive.sinkY + shakeY + drive.offsetY;
      root.current.rotation.y = drive.spin;
      // Whole-body lean — head, torso and hands rotate together as one object.
      root.current.rotation.z = drive.tiltZ;
      const sc = drive.scale + breath;
      root.current.scale.setScalar(sc);
    }
    // body lean on scroll velocity, eased and settling back to 0
    const leanTarget = reduced ? 0 : THREE.MathUtils.clamp(s.scrollVelocity * 0.35, -0.35, 0.35);
    lean.current += (leanTarget - lean.current) * Math.min(1, dt * 6);
    if (bodyGroup.current) {
      bodyGroup.current.rotation.z = driftZ;
      bodyGroup.current.rotation.x = lean.current;
    }

    // --- head look (tracking / curious / anticipating) ----------------------
    // desired look source: pointer normally, lookTarget for curious/anticipating
    let tx = s.pointer.x;
    let ty = s.pointer.y;
    if ((s.state === "curious" || s.state === "anticipating") && s.lookTarget) {
      tx = s.lookTarget.x;
      ty = s.lookTarget.y;
    }
    const active =
      s.state === "tracking" ||
      s.state === "curious" ||
      s.state === "anticipating" ||
      s.state === "excited";
    const desiredYaw = active ? THREE.MathUtils.clamp(tx * LOOK_CLAMP, -LOOK_CLAMP, LOOK_CLAMP) : 0;
    const desiredPitch = active
      ? THREE.MathUtils.clamp(-ty * LOOK_CLAMP * 0.7, -LOOK_CLAMP, LOOK_CLAMP)
      : 0;
    // lerp, never instant
    look.current.yaw += (desiredYaw - look.current.yaw) * LOOK_LERP;
    look.current.pitch += (desiredPitch - look.current.pitch) * LOOK_LERP;

    if (head.current) {
      head.current.rotation.set(look.current.pitch, look.current.yaw, drive.headTiltZ + driftZ * 0.5);
      _tmpEuler.set(0, 0, 0); // keep scratch touched (avoids unused warning paths)
    }

    // --- hands: gentle counter-bob --------------------------------------------
    if (handL.current && handR.current) {
      const hb = Math.sin((t * 2 * Math.PI) / AMBIENT.floatPeriod + Math.PI) * 0.04 * drive.bob * ambient;
      handL.current.position.y = -0.05 + hb;
      handR.current.position.y = -0.05 - hb;
    }

    // --- blink (procedural) ---------------------------------------------------
    let lid = drive.eyeOpen;
    if (!reduced || true) {
      const b = blink.current;
      if (b.closing >= 0) {
        b.closing += dt;
        const half = AMBIENT.blinkClose / 2;
        // triangular close/open
        const k = b.closing < half ? b.closing / half : 1 - (b.closing - half) / half;
        lid *= 1 - THREE.MathUtils.clamp(k, 0, 1);
        if (b.closing >= AMBIENT.blinkClose) {
          b.closing = -1;
          b.next = t + THREE.MathUtils.randFloat(AMBIENT.blinkMin, AMBIENT.blinkMax);
        }
      } else if (t >= b.next && drive.eyeOpen > 0.5) {
        b.closing = 0;
      }
    }

    // --- eye uniforms ---------------------------------------------------------
    const u = eyeMat.uniforms;
    u.uTime.value = t;
    u.uOpen.value = lid;
    // disappointed flash overrides expression while it lasts
    const disappointed = s.flash === "disappointed";
    u.uHappy.value = disappointed ? 0 : drive.happy;
    u.uWide.value = drive.wide;
    u.uNarrow.value = drive.narrow;
    u.uSad.value = disappointed ? 1 : drive.sad;
    u.uAngry.value = drive.angry;
    u.uHeat.value = drive.heat;
    u.uFlicker.value = drive.flicker;
    u.uLookInfluence.value = drive.lookInfluence;
    (u.uLook.value as THREE.Vector2).set(s.pointer.x, s.pointer.y);
    u.uIntensity.value = drive.accentIntensity;

    // --- emissive intensities -------------------------------------------------
    if (logoMat.current) logoMat.current.emissiveIntensity = drive.logoIntensity;
    if (seamMat.current) seamMat.current.emissiveIntensity = drive.accentIntensity * 0.6;
  });

  // ---- static scene graph (built once) -------------------------------------
  return (
    <>
      {/* The portal lives in world space, OUTSIDE Drax's root group, so it
          stays put at the frame edge while Drax leans through it. */}
      <Portal drive={drive} />
      <group ref={root} dispose={null}>
        <group ref={bodyGroup}>
        {/* Torso — capsule, soft matte shell */}
        <mesh castShadow position={[0, -0.35, 0]}>
          <capsuleGeometry args={[0.42, 0.5, 12, 24]} />
          <meshStandardMaterial color={PALETTE.shell} roughness={0.62} metalness={0.05} />
        </mesh>

        {/* Thin emissive seam around the torso (the one subtle accent line) */}
        <mesh position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.425, 0.008, 8, 48]} />
          <meshStandardMaterial
            ref={seamMat}
            color={PALETTE.accent}
            emissive={_accent}
            emissiveIntensity={0.6}
            roughness={0.4}
            toneMapped={false}
          />
        </mesh>

        {/* Chest logo — inset panel with emissive PAR decal.
            Sits just proud of the torso shell (front ≈ z 0.42) so it reads as a
            flush decal without being clipped by the opaque capsule. */}
        <group position={[0, -0.2, 0.44]}>
          {/* dark inset panel */}
          <mesh position={[0, 0, -0.015]}>
            <circleGeometry args={[0.17, 32]} />
            <meshStandardMaterial color={PALETTE.visor} roughness={0.35} metalness={0.1} />
          </mesh>
          {/* emissive PAR mark */}
          <mesh>
            <planeGeometry args={[0.26, 0.26]} />
            <meshStandardMaterial
              ref={logoMat}
              transparent
              color="#000000"
              emissive={LOGO_EMISSIVE}
              emissiveMap={logoTex}
              emissiveIntensity={1.0}
              alphaMap={logoTex}
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>

      {/* Detached head — rounded flattened dome, hovers above the torso */}
      <group ref={head} position={[0, 0.42, 0]}>
        {/* head shell */}
        <mesh castShadow scale={[1, 0.86, 0.92]}>
          <sphereGeometry args={[0.4, 32, 24]} />
          <meshStandardMaterial color={PALETTE.shell} roughness={0.6} metalness={0.05} />
        </mesh>
        {/* dark visor faceplate — a flattened ellipsoid embedded in the head
            front, protruding just enough to seat the eyes (front ≈ z 0.40). */}
        <mesh position={[0, 0.0, 0.3]} scale={[1.05, 0.8, 0.4]}>
          <sphereGeometry args={[0.26, 32, 24]} />
          <meshStandardMaterial color={PALETTE.visor} roughness={0.22} metalness={0.25} />
        </mesh>
        {/* eyes: SDF shader plane just in front of the visor faceplate */}
        <mesh position={[0, 0.01, 0.42]} material={eyeMat}>
          <planeGeometry args={[0.44, 0.44]} />
        </mesh>
      </group>

      {/* Detached hover-hand orbs */}
      <mesh ref={handL} position={[-0.6, -0.05, 0.12]}>
        <sphereGeometry args={[0.1, 20, 16]} />
        <meshStandardMaterial color={PALETTE.shell} roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh ref={handR} position={[0.6, -0.05, 0.12]}>
        <sphereGeometry args={[0.1, 20, 16]} />
        <meshStandardMaterial color={PALETTE.shell} roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Thinking orbiting particle ring (visible only while thinking) */}
      <ThinkingRing drive={drive} />
      </group>
    </>
  );
}
