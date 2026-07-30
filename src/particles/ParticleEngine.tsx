'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { timeline, smoothstep, window01, clamp01 } from '@/state/timeline';
import { device } from '@/state/ticker';
import { SHAPE_SLOTS, SHAPE_PALETTES, STATION } from '@/experience/phases';
import {
  TEX_SIZE, COUNT, makeTexture,
  genSpawn, genDNA, genBrain, genNetwork,
  genDigital, genTech, genEco, genWorld, genLogoPlaceholder,
  sampleLogoTargets,
} from './targets';
import { simVertex, velocityFragment, positionFragment, renderVertex, renderFragment } from './shaders';
import {
  siDocker, siKubernetes, siPython, siReact,
  siNodedotjs, siTensorflow, siGithub, siGooglecloud,
} from 'simple-icons';

// ACT 07 is assembled from the OFFICIAL vendor vectors, not drawn by hand.
const TECH_LOGO_PATHS = [
  siReact, siPython, siNodedotjs, siDocker,
  siKubernetes, siTensorflow, siGooglecloud, siGithub,
].map((i) => i.path);

const PULSE_FREQ: Record<string, number> = {
  genesis: 0, dna: 6, brain: 6, network: 4, digital: 14, tech: 3, eco: 3, world: 3, logo: 0,
};
const PULSE_AMT: Record<string, number> = {
  genesis: 0, dna: 0.7, brain: 0.5, network: 1, digital: 1, tech: 0.8, eco: 0.5, world: 0.9, logo: 0,
};
// slow living rotation per structure — everything floats, nothing is a statue.
// dna + network stay at 0: DOM logos are PINNED to their world coordinates.
const SPIN_AMT: Record<string, number> = {
  genesis: 0, dna: 0, brain: 0.22, network: 0, digital: 0.06, tech: 0.3, eco: 0.38, world: 0.26, logo: 0,
};
const SPIN_STATION: Record<string, keyof typeof STATION> = {
  genesis: 'vortex', dna: 'dna', brain: 'brain', network: 'network', digital: 'digital',
  tech: 'tech', eco: 'eco', world: 'world', logo: 'logo',
};

// ---- COMPOSITION MASK, per act ----
// How aggressively the frame goes black away from the subject. ACT I is a
// full-screen field by design and is never masked; the tight, legible acts are
// masked hard so the copy panel sits on nothing; `world` is a deliberately
// wide spread of clusters, so it keeps a generous radius.
const MASK_AMT: Record<string, number> = {
  genesis: 0, dna: 1, brain: 1, network: 0.92, digital: 1,
  tech: 0.95, eco: 0.88, world: 0.6, logo: 1,
};
// [full-brightness radius, fully-black radius] in screen heights
const MASK_R: Record<string, [number, number]> = {
  genesis: [1.6, 2.2], dna: [0.34, 0.70], brain: [0.34, 0.70],
  network: [0.38, 0.78], digital: [0.36, 0.74], tech: [0.38, 0.78],
  eco: [0.44, 0.88], world: [0.58, 1.10], logo: [0.30, 0.62],
};

function makeRT() {
  return new THREE.WebGLRenderTarget(TEX_SIZE, TEX_SIZE, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    depthBuffer: false,
    stencilBuffer: false,
  });
}

export default function ParticleEngine() {
  const gl = useThree((s) => s.gl);
  const initialized = useRef(false);
  // adaptive quality governor — every machine gets its best possible density.
  // phones and low-core devices start lean instead of thrashing their way down.
  const quality = useRef({
    frac: device.lowPower ? 0.4 : 1,
    dpr: device.lowPower ? 0.8 : 1,
    acc: 0,
    frames: 0,
  });

  const sim = useMemo(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geo = new THREE.PlaneGeometry(2, 2);

    const velMat = new THREE.ShaderMaterial({
      vertexShader: simVertex,
      fragmentShader: velocityFragment,
      uniforms: {
        uPos: { value: null }, uVel: { value: null },
        uTargetA: { value: null }, uTargetB: { value: null }, uBlend: { value: 0 },
        uTime: { value: 0 }, uDt: { value: 0.016 },
        uSeek: { value: 0 }, uCrit: { value: 0 },
        uCurlAmp: { value: 0.1 }, uCurlScale: { value: 0.18 },
        uSwirl: { value: 0 }, uSwirlSpeed: { value: 1 }, uBurst: { value: 0 },
        uDamp: { value: 0.92 }, uMaxSpeed: { value: 9 },
        uSwirlCenter: { value: new THREE.Vector3(0, 0, 0) },
        uRayO: { value: new THREE.Vector3() },
        uRayD: { value: new THREE.Vector3(0, 0, -1) },
        uPush: { value: 0 },
        uSpinCenter: { value: new THREE.Vector3() },
        uSpin: { value: 0 },
        uAlive: { value: 0 },
        uTiltX: { value: 0 },
        uTiltY: { value: 0 },
      },
    });
    const posMat = new THREE.ShaderMaterial({
      vertexShader: simVertex,
      fragmentShader: positionFragment,
      uniforms: {
        uPos: { value: null }, uVel: { value: null }, uSpawn: { value: null }, uDt: { value: 0.016 },
      },
    });
    const copyMat = new THREE.ShaderMaterial({
      vertexShader: simVertex,
      fragmentShader: `varying vec2 vUv; uniform sampler2D uTex; void main(){ gl_FragColor = texture2D(uTex, vUv); }`,
      uniforms: { uTex: { value: null } },
    });
    const mesh = new THREE.Mesh(geo, velMat);
    scene.add(mesh);

    const rt = { velA: makeRT(), velB: makeRT(), posA: makeRT(), posB: makeRT() };

    const shapes = {
      genesis: makeTexture(genSpawn()),
      dna: makeTexture(genDNA()),
      brain: makeTexture(genBrain()),
      network: makeTexture(genNetwork()),
      digital: makeTexture(genDigital()),
      tech: makeTexture(genTech(TECH_LOGO_PATHS)),
      eco: makeTexture(genEco()),
      world: makeTexture(genWorld()),
      logo: makeTexture(genLogoPlaceholder()),
    };
    const spawnTex = makeTexture(genSpawn());
    const zeroTex = makeTexture(new Float32Array(COUNT * 4));

    return { scene, camera, mesh, velMat, posMat, copyMat, rt, shapes, spawnTex, zeroTex };
  }, []);

  // Replace the logo placeholder with pixels sampled from the OFFICIAL icon
  useEffect(() => {
    let dead = false;
    sampleLogoTargets('/brand/par-icon.png')
      .then((data) => {
        if (dead) return;
        (sim.shapes.logo.image.data as Float32Array).set(data);
        sim.shapes.logo.needsUpdate = true;
      })
      .catch(() => {});
    return () => { dead = true; };
  }, [sim]);

  const points = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const ref = new Float32Array(COUNT * 2);
    for (let i = 0; i < COUNT; i++) {
      ref[i * 2 + 0] = ((i % TEX_SIZE) + 0.5) / TEX_SIZE;
      ref[i * 2 + 1] = (Math.floor(i / TEX_SIZE) + 0.5) / TEX_SIZE;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aRef', new THREE.BufferAttribute(ref, 2));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -180), 500);
    // start at the device-appropriate budget instead of full blast
    geo.setDrawRange(0, Math.floor(COUNT * (device.lowPower ? 0.4 : 1)));
    const mat = new THREE.ShaderMaterial({
      vertexShader: renderVertex,
      fragmentShader: renderFragment,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uPos: { value: null }, uVel: { value: null },
        uTargetA: { value: null }, uTargetB: { value: null }, uBlend: { value: 0 },
        uSize: { value: 1.35 }, uReveal: { value: 0 }, uPixelRatio: { value: 1 },
        uCol0: { value: new THREE.Color('#0d5dff') },
        uCol1: { value: new THREE.Color('#1479ff') },
        uCol2: { value: new THREE.Color('#bfe0ff') },
        uTime: { value: 0 }, uPulse: { value: 0 }, uPulseFreq: { value: 4 },
        uFog: { value: 0.016 }, uEnergy: { value: 0 },
        uWave: { value: 0 }, uWaveR: { value: 0 },
        uIntensity: { value: 3.2 }, uHalo: { value: 1 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uFocus: { value: new THREE.Vector2(0.5, 0.5) },
        uMask: { value: 0 }, uMaskIn: { value: 0.4 }, uMaskOut: { value: 0.8 },
      },
    });
    return { geo, mat };
  }, []);

  const colA = useMemo(() => new THREE.Color(), []);
  const colB = useMemo(() => new THREE.Color(), []);
  const colOut = useMemo(() => new THREE.Color(), []);
  const rayDir = useMemo(() => new THREE.Vector3(), []);
  const shapeOrder = useMemo(() => SHAPE_SLOTS.map((s) => s.name as keyof typeof sim.shapes), [sim]);

  useFrame((state, delta) => {
    const renderer = state.gl;
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const p = timeline.progress;
    const { rt, velMat, posMat, copyMat, mesh, scene, camera } = sim;

    // one-time GPU init: write spawn/zero textures into the ping-pong chain
    if (!initialized.current) {
      mesh.material = copyMat;
      copyMat.uniforms.uTex.value = sim.spawnTex;
      for (const target of [rt.posA, rt.posB]) {
        renderer.setRenderTarget(target); renderer.render(scene, camera);
      }
      copyMat.uniforms.uTex.value = sim.zeroTex;
      for (const target of [rt.velA, rt.velB]) {
        renderer.setRenderTarget(target); renderer.render(scene, camera);
      }
      renderer.setRenderTarget(null);
      initialized.current = true;
      timeline.ready = true;
    }

    // ---------- BEHAVIOR SCHEDULE (scroll time → physics) ----------
    // a dense premium field breathes from the first frame; the flood follows fast
    const rv = clamp01((p - 0.004) / (0.085 - 0.004));
    const reveal = Math.max(0.13, Math.pow(rv, 1.7));

    // target pair + blend
    let base = 0;
    for (let i = SHAPE_SLOTS.length - 1; i >= 0; i--) {
      if (p >= SHAPE_SLOTS[i].hold[0]) { base = i; break; }
    }
    const next = Math.min(base + 1, SHAPE_SLOTS.length - 1);
    const blend = next === base ? 0 : smoothstep(SHAPE_SLOTS[base].hold[1], SHAPE_SLOTS[next].hold[0], p);
    const texA = sim.shapes[shapeOrder[base]];
    const texB = sim.shapes[shapeOrder[next]];
    const holdA = SHAPE_SLOTS[base].hold, holdB = SHAPE_SLOTS[next].hold;
    const formed = Math.max(
      window01(p, holdA[0] - 0.012, holdA[0], holdA[1], holdA[1] + 0.012),
      window01(p, holdB[0] - 0.012, holdB[0], holdB[1], holdB[1] + 0.012),
    );

    // act weights — the vortex hands off to the helix as one liquid gesture
    const vortexW = smoothstep(0.04, 0.10, p) * (1 - smoothstep(0.19, 0.225, p));
    // forward: instant assembly. backward: matter returns HOME to the genesis field
    // (fixes the shrunken far-away vortex when the user scrolls back up)
    // back-seek hands the matter to the vortex BEFORE the disk starts forming
    const seekW = Math.max(
      smoothstep(0.19, 0.218, p),
      0.85 * (1 - smoothstep(0.045, 0.095, p)),
    );
    const logoW = smoothstep(0.9, 0.94, p);
    // awakening: a wave of energy propagates outward from the first spark
    const wakeW = window01(p, 0.035, 0.05, 0.085, 0.105);
    const waveR = ((p - 0.035) / 0.07) * 22;
    const energyBoost = Math.min(1.2, Math.abs(timeline.velocity) * 0.4);

    const domShape = blend < 0.5 ? shapeOrder[base] : shapeOrder[next];
    const precise = domShape === 'digital' || domShape === 'logo' ? 0.45 : 1;

    velMat.uniforms.uTime.value = t;
    velMat.uniforms.uDt.value = dt;
    velMat.uniforms.uTargetA.value = texA;
    velMat.uniforms.uTargetB.value = texB;
    velMat.uniforms.uBlend.value = blend;
    // ---- ASSEMBLY SPEED ----
    // Roughly 3x the old stiffness. Arrival time scales with 1/sqrt(k), so this
    // is about 1.7x faster into place — and because uCrit below damps it
    // critically, the extra stiffness buys speed instead of jitter.
    const seek = seekW * (30.0 + (1 - formed) * 18.0 + logoW * 14.0);
    velMat.uniforms.uSeek.value = seek;
    // 2*sqrt(k) is the critically-damped coefficient — the fastest approach
    // that never overshoots. Slightly under it (0.92) leaves a trace of
    // liquid follow-through so the motion still reads as matter, not UI easing.
    velMat.uniforms.uCrit.value = 2.0 * Math.sqrt(Math.max(seek, 0)) * 0.92;
    velMat.uniforms.uCurlAmp.value =
      (0.16 + wakeW * 0.35 + vortexW * 1.25 + seekW * 0.55 * (1 - formed * 0.7) + energyBoost * 0.25) * precise;
    velMat.uniforms.uCurlScale.value = 0.16 + vortexW * 0.06;
    velMat.uniforms.uSwirl.value = vortexW * 2.4;
    velMat.uniforms.uSwirlSpeed.value = 1 + smoothstep(0.12, 0.21, p) * 2.2;

    // ---- DESTROY ----
    // Structures used to simply fade toward the next target, which is what made
    // transitions feel slow and gluey. Now each act ENDS with a real outward
    // impulse the instant its hold expires: the shape blows apart, and the
    // (now much stiffer) seek spring immediately reels the same matter into the
    // next one. Fast form, fast destroy, one conserved population.
    const burst = Math.max(
      window01(p, holdA[1] - 0.006, holdA[1] + 0.004, holdA[1] + 0.014, holdA[1] + 0.032),
      // scrolling back up detonates the shape the reader is leaving too
      window01(p, holdA[0] - 0.030, holdA[0] - 0.012, holdA[0] - 0.004, holdA[0] + 0.004),
    );
    velMat.uniforms.uBurst.value = burst * 30.0;
    // The burst radiates from the CENTRE OF THE STRUCTURE being destroyed, not
    // from the world origin. (At the genesis act this station is 0, so the
    // vortex physics that also reads uSwirlCenter is untouched.)
    velMat.uniforms.uDamp.value =
      0.88 + vortexW * 0.07 - logoW * 0.01;
    velMat.uniforms.uMaxSpeed.value = 26 + energyBoost * 6 + logoW * 12;

    // pointer physics: ray through the cursor + click shockwave
    const cam = state.camera;
    rayDir.set(timeline.mouse.x, -timeline.mouse.y, 0.5).unproject(cam).sub(cam.position).normalize();
    velMat.uniforms.uRayO.value.copy(cam.position);
    velMat.uniforms.uRayD.value.copy(rayDir);
    const clickAge = performance.now() / 1000 - timeline.clickAt;
    const clickKick = clickAge < 2 ? Math.exp(-clickAge * 3.2) * 26 : 0;
    // a resting hand still dimples the surface; a moving one parts it.
    // The baseline stays small so an idle cursor never carves a hole.
    velMat.uniforms.uPush.value =
      smoothstep(0.015, 0.05, p) * (1.9 + Math.min(10, timeline.pointerSpeed * 42)) + clickKick;

    // living rotation of whichever structure currently holds the matter
    velMat.uniforms.uSpin.value = (SPIN_AMT[domShape] ?? 0) * formed;
    const spinZ = STATION[SPIN_STATION[domShape] ?? 'vortex'];
    velMat.uniforms.uSpinCenter.value.set(0, 0, spinZ);
    velMat.uniforms.uSwirlCenter.value.set(0, 0, spinZ);

    // every formed object breathes and turns toward the cursor, always
    velMat.uniforms.uAlive.value = formed * seekW;
    velMat.uniforms.uTiltY.value = timeline.mouse.x * 0.36 + Math.sin(t * 0.21) * 0.05;
    velMat.uniforms.uTiltX.value = -timeline.mouse.y * 0.22 + Math.sin(t * 0.17) * 0.035;

    // ---------- SIMULATE (velocity → position, ping-pong) ----------
    // The whole population is always integrated. Restricting the sim viewport
    // to the drawn rows was tried and reverted: three.js reuses the viewport
    // for the scene pass that follows, and the cost is fillrate anyway.
    mesh.material = velMat;
    velMat.uniforms.uPos.value = rt.posA.texture;
    velMat.uniforms.uVel.value = rt.velA.texture;
    renderer.setRenderTarget(rt.velB);
    renderer.render(scene, camera);

    mesh.material = posMat;
    posMat.uniforms.uDt.value = dt;
    posMat.uniforms.uSpawn.value = sim.spawnTex;
    posMat.uniforms.uPos.value = rt.posA.texture;
    posMat.uniforms.uVel.value = rt.velB.texture;
    renderer.setRenderTarget(rt.posB);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);

    // swap
    let tmp = rt.velA; rt.velA = rt.velB; rt.velB = tmp;
    tmp = rt.posA; rt.posA = rt.posB; rt.posB = tmp;

    // ---------- RENDER UNIFORMS ----------
    const m = points.mat.uniforms;
    m.uPos.value = rt.posA.texture;
    m.uVel.value = rt.velA.texture;
    m.uTargetA.value = texA;
    m.uTargetB.value = texB;
    m.uBlend.value = blend;
    m.uReveal.value = reveal;
    m.uTime.value = t;
    m.uPixelRatio.value = Math.min(state.viewport.dpr, 2) * 0.85;
    // thinner populations render slightly larger to keep perceived density
    // Thinner populations render slightly larger to keep perceived density —
    // EXCEPT in the finale. There the particles are a legible logo, and fat
    // points on a throttled phone turn the mark into one blown-out white blob.
    const thinComp = 1 + (1 - quality.current.frac) * 0.5 * (1 - logoW * 0.9);
    m.uSize.value = (0.5 + logoW * 0.34) * thinComp;
    // The mark burns hotter than the travelling field, but only so far: past
    // roughly 4.5 the HDR nucleus clips and every particle tonemaps to white,
    // which is what made the logo colourless. Brightness now comes from
    // density (uSize) and a lifted palette instead of raw exposure.
    m.uIntensity.value = 3.0 + logoW * 1.2 + formed * 0.5;
    m.uFog.value = 0.016 - logoW * 0.013;
    // the mark is a shape to READ — kill the per-mote haze that makes a
    // travelling field look alive but makes an assembled logo look smeared
    m.uHalo.value = 1 - logoW * 0.78;
    m.uEnergy.value = Math.min(1, energyBoost * 0.6);
    m.uWave.value = wakeW;
    m.uWaveR.value = waveR;

    // ---- COMPOSITION MASK ----
    // The subject's screen position is projected once per frame in PostFX.
    // Blend the mask shape across the morph so the frame never pops.
    m.uRes.value.set(state.size.width, state.size.height);
    m.uFocus.value.set(timeline.focus.x, timeline.focus.y);
    const rA = MASK_R[shapeOrder[base]] ?? [0.4, 0.8];
    const rB = MASK_R[shapeOrder[next]] ?? [0.4, 0.8];
    m.uMaskIn.value = rA[0] + (rB[0] - rA[0]) * blend;
    m.uMaskOut.value = rA[1] + (rB[1] - rA[1]) * blend;
    const amtA = MASK_AMT[shapeOrder[base]] ?? 0;
    const amtB = MASK_AMT[shapeOrder[next]] ?? 0;
    // Only mask while the subject is actually IN frame — if the projection has
    // slid off-screen there is no meaningful centre to mask around, and a mask
    // anchored off-frame would black out the visible matter instead.
    m.uMask.value = (amtA + (amtB - amtA) * blend) * timeline.focus.inFrame;

    const palA = SHAPE_PALETTES[shapeOrder[base]];
    const palB = SHAPE_PALETTES[shapeOrder[next]];
    for (let c = 0; c < 3; c++) {
      colA.set(palA[c]); colB.set(palB[c]);
      colOut.copy(colA).lerp(colB, blend);
      (c === 0 ? m.uCol0 : c === 1 ? m.uCol1 : m.uCol2).value.copy(colOut);
    }
    m.uPulse.value = (PULSE_AMT[domShape] ?? 0) * formed;
    m.uPulseFreq.value = PULSE_FREQ[domShape] ?? 4;

    // ---------- QUALITY GOVERNOR ----------
    // two levers, in order: thin the drawn population, then lower resolution.
    // The finale raises both floors: the mark is a shape the visitor has to
    // READ, and a sparse, upscaled logo dissolves into a bloom smear.
    const q = quality.current;
    const fracFloor = 0.22 + logoW * 0.24;
    const dprFloor = 0.72 + logoW * 0.16;
    if (q.frac < fracFloor) { q.frac = fracFloor; points.geo.setDrawRange(0, Math.floor(COUNT * q.frac)); }
    if (q.dpr < dprFloor) {
      q.dpr = dprFloor;
      state.setDpr(Math.min(window.devicePixelRatio || 1, 1.75) * q.dpr);
    }
    q.acc += delta; q.frames++;
    // react within ~0.8s so a struggling browser recovers before it feels laggy
    if (q.acc >= 0.8) {
      const fps = q.frames / q.acc;
      if (fps < 52) {
        if (q.frac > fracFloor) q.frac = Math.max(fracFloor, q.frac * 0.7);
        else if (q.dpr > dprFloor) {
          q.dpr = Math.max(dprFloor, q.dpr - 0.14);
          state.setDpr(Math.min(window.devicePixelRatio || 1, 1.75) * q.dpr);
        }
      } else if (fps > 58) {
        if (q.frac < 1) q.frac = Math.min(1, q.frac * 1.08);
        else if (q.dpr < 1) {
          q.dpr = Math.min(1, q.dpr + 0.14);
          state.setDpr(Math.min(window.devicePixelRatio || 1, 1.75) * q.dpr);
        }
      }
      points.geo.setDrawRange(0, Math.floor(COUNT * q.frac));
      q.acc = 0; q.frames = 0;
    }

    // headless verification hook — real GPU readback, never guess blind
    const dbg = (window as unknown as { __parDebug?: { wants?: boolean } }).__parDebug;
    if (dbg?.wants) {
      const px = new Float32Array(4 * 4);
      renderer.readRenderTargetPixels(rt.posA, 0, 0, 2, 2, px);
      (window as unknown as { __parDebug: object }).__parDebug = {
        p, reveal, blend, base, seek: velMat.uniforms.uSeek.value,
        swirl: velMat.uniforms.uSwirl.value,
        frac: quality.current.frac, qdpr: quality.current.dpr,
        drawn: points.geo.drawRange.count,
        size: m.uSize.value,
        pos: Array.from(px.slice(0, 8)).map((v) => Math.round(v * 100) / 100),
      };
    }
  });

  useEffect(() => {
    const simRef = sim;
    const ptsRef = points;
    return () => {
      Object.values(simRef.rt).forEach((r) => r.dispose());
      Object.values(simRef.shapes).forEach((s) => s.dispose());
      simRef.spawnTex.dispose();
      simRef.zeroTex.dispose();
      ptsRef.geo.dispose();
      ptsRef.mat.dispose();
    };
  }, [sim, points]);

  void gl;
  return <points geometry={points.geo} material={points.mat} frustumCulled={false} />;
}
