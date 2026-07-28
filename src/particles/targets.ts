import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import { STATION } from '@/experience/phases';
import { sampleSvgFill } from './svg';

// Every generator fills N particles: [x, y, z, w] — w drives per-particle color/pulse.
export const TEX_SIZE = 384;
export const COUNT = TEX_SIZE * TEX_SIZE;

const noise = new ImprovedNoise();

// Deterministic RNG so the universe is stable between reloads
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeTexture(data: Float32Array) {
  const tex = new THREE.DataTexture(data, TEX_SIZE, TEX_SIZE, THREE.RGBAFormat, THREE.FloatType);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

function alloc() {
  return new Float32Array(COUNT * 4);
}

// ------------------------------------------------------------------
// SPAWN — the field of sleeping matter (visible from the first frame)
// ------------------------------------------------------------------
export function genSpawn(): Float32Array {
  const d = alloc();
  const rnd = mulberry32(101);
  for (let i = 0; i < COUNT; i++) {
    const r = 3 + Math.pow(rnd(), 0.5) * 13;
    const th = rnd() * Math.PI * 2;
    const ph = Math.acos(rnd() * 2 - 1);
    d[i * 4 + 0] = r * Math.sin(ph) * Math.cos(th);
    d[i * 4 + 1] = (r * Math.cos(ph)) * 0.55;
    d[i * 4 + 2] = r * Math.sin(ph) * Math.sin(th) - 2;
    d[i * 4 + 3] = rnd();
  }
  return d;
}

// ------------------------------------------------------------------
// DNA — precise B-form double helix. Clean, floating, premium.
// ------------------------------------------------------------------
/** The helix leans right — DNA_TILT is shared with the DOM logo overlay. */
export const DNA_TILT = 0.42;
export function genDNA(): Float32Array {
  const d = alloc();
  const rnd = mulberry32(13);
  const height = 17, radius = 2.0, turns = 6.0;
  const cz = STATION.dna;
  const STEPS = 78; // discrete base pairs, like the real molecule
  const ct = Math.cos(DNA_TILT), st = Math.sin(DNA_TILT);
  for (let i = 0; i < COUNT; i++) {
    const kind = rnd();
    let x = 0, y = 0, z = 0, w = 0;
    if (kind < 0.34) {
      // strand A — a smooth, dense ribbon of light
      const u = rnd();
      const t = u * turns * Math.PI * 2;
      x = Math.cos(t) * radius; z = Math.sin(t) * radius; y = (u - 0.5) * height;
      w = 0.14 + u * 0.32;
    } else if (kind < 0.68) {
      // strand B — offset 2.1 rad (major/minor groove of real B-DNA)
      const u = rnd();
      const t = u * turns * Math.PI * 2 + 2.1;
      x = Math.cos(t) * radius; z = Math.sin(t) * radius; y = (u - 0.5) * height;
      w = 0.56 + u * 0.42;
    } else if (kind < 0.985) {
      // base pairs — crisp rungs with a visible gap at the helix axis,
      // so every rung reads as two paired bases meeting in the middle
      const step = Math.floor(rnd() * STEPS) / STEPS;
      const t = step * turns * Math.PI * 2;
      const y0 = (step - 0.5) * height;
      const ax = Math.cos(t) * radius, az = Math.sin(t) * radius;
      const bx = Math.cos(t + 2.1) * radius, bz = Math.sin(t + 2.1) * radius;
      const half = rnd() < 0.5;
      const k = half ? 0.06 + rnd() * 0.38 : 0.56 + rnd() * 0.38;
      x = ax + (bx - ax) * k; z = az + (bz - az) * k; y = y0;
      w = half ? 0.34 : 0.66;
    } else {
      // sparse ionic shimmer, tight to the molecule
      const a = rnd() * Math.PI * 2;
      const r = 2.5 + rnd() * 1.4;
      x = Math.cos(a) * r; z = Math.sin(a) * r; y = (rnd() - 0.5) * height * 1.1;
      w = rnd() * 0.25;
    }
    const j = 0.014;
    x += (rnd() - 0.5) * j;
    y += (rnd() - 0.5) * j;
    z += (rnd() - 0.5) * j;
    // lean the whole molecule to the right — it reads diagonally on screen
    d[i * 4 + 0] = x * ct - y * st;
    d[i * 4 + 1] = x * st + y * ct;
    d[i * 4 + 2] = z + cz;
    d[i * 4 + 3] = w;
  }
  return d;
}

// ------------------------------------------------------------------
// BRAIN — anatomical: directional gyri, deep fissure, temporal lobes,
// striped cerebellum, angled stem. Tilted like a specimen on display.
// ------------------------------------------------------------------
export function genBrain(): Float32Array {
  const d = alloc();
  const rnd = mulberry32(29);
  const cz = STATION.brain;
  const A = 3.0, B = 2.45, C = 4.05; // width(x), height(y), length(z: -front, +back)
  const tilt = -0.16; // slight forward pitch
  const ct = Math.cos(tilt), st = Math.sin(tilt);
  for (let i = 0; i < COUNT; i++) {
    const kind = rnd();
    let x = 0, y = 0, z = 0, w = rnd();
    if (kind < 0.8) {
      const th = rnd() * Math.PI * 2;
      const ph = Math.acos(rnd() * 2 - 1);
      let nx = Math.sin(ph) * Math.cos(th);
      let ny = Math.cos(ph);
      let nz = Math.sin(ph) * Math.sin(th);
      // flat underside (where the brain rests on the stem)
      if (ny < -0.3) { const f = (-0.3 - ny) * 0.55; ny += f; }
      // directional gyri: folds run front-to-back, carved by noise
      const fold = Math.sin(nz * 6.5 + noise.noise(nx * 2.2, ny * 2.2, nz * 2.2) * 4.0);
      const g = fold * 0.055 + noise.noise(nx * 6.5 + 9, ny * 6.5, nz * 6.5) * 0.045;
      const shell = 0.93 + rnd() * 0.09;
      x = nx * A * (1 + g) * shell;
      y = ny * B * (1 + g) * shell;
      z = nz * C * (1 + g) * shell;
      // temporal lobes bulge low on each side
      if (Math.abs(nx) > 0.5 && ny < 0.15 && ny > -0.6 && nz > -0.4 && nz < 0.5) {
        x *= 1.12; y -= 0.28;
      }
      // longitudinal fissure — a deep canyon between hemispheres
      if (y > -0.2 && Math.abs(x) < 0.52) {
        x = (x >= 0 ? 1 : -1) * (0.52 + (0.52 - Math.abs(x)) * 0.25);
        y -= 0.34;
      }
      // frontal taper
      if (z < -1.8) { x *= 0.86; y *= 0.9; }
    } else if (kind < 0.93) {
      // cerebellum — finely striped, tucked under the back
      const th = rnd() * Math.PI * 2;
      const ph = Math.acos(rnd() * 2 - 1);
      const nx = Math.sin(ph) * Math.cos(th), ny = Math.cos(ph), nz = Math.sin(ph) * Math.sin(th);
      const stripe = Math.sin(nx * 22) * 0.045;
      x = nx * 1.7 * (1 + stripe);
      y = ny * 0.95 * (1 + stripe) - 1.75;
      z = nz * 1.3 * (1 + stripe) + 2.45;
      w = 0.15 + rnd() * 0.2;
    } else if (kind < 0.975) {
      // brain stem — angled forward as it descends
      const t = rnd();
      const r = 0.4 * (1 - t * 0.3);
      const a = rnd() * Math.PI * 2;
      x = Math.cos(a) * r;
      y = -1.35 - t * 2.1;
      z = 1.5 - t * 0.7 + Math.sin(a) * r;
      w = 0.1;
    } else {
      // sparse deep matter
      x = (rnd() * 2 - 1) * A * 0.55;
      y = (rnd() * 2 - 1) * B * 0.5;
      z = (rnd() * 2 - 1) * C * 0.55;
      w = rnd();
    }
    // pitch the whole specimen
    const y2 = y * ct - z * st;
    const z2 = y * st + z * ct;
    d[i * 4 + 0] = x;
    d[i * 4 + 1] = y2 + 0.6;
    d[i * 4 + 2] = z2 + cz;
    d[i * 4 + 3] = w;
  }
  return d;
}

// ------------------------------------------------------------------
// NEURAL NETWORK — ORGANIC: glowing somas, branching dendrites, curved
// axons carrying pulses. Like a real micrograph, not a diagram.
// Tech logos pin to the 12 outer somas.
// ------------------------------------------------------------------
export const NETWORK_ANCHOR_COUNT = 12;
function somaPositions(): number[][] {
  const rnd = mulberry32(707);
  const out: number[][] = [];
  // 12 outer somas, organically placed around an ellipse
  for (let k = 0; k < NETWORK_ANCHOR_COUNT; k++) {
    const a = (k / NETWORK_ANCHOR_COUNT) * Math.PI * 2 + (rnd() - 0.5) * 0.3;
    const r = 5.8 + rnd() * 1.9;
    out.push([Math.cos(a) * r, Math.sin(a) * r * 0.82, (rnd() - 0.5) * 2.2]);
  }
  // 5 inner somas
  for (let k = 0; k < 5; k++) {
    const a = rnd() * Math.PI * 2;
    const r = rnd() * 3.2;
    out.push([Math.cos(a) * r, Math.sin(a) * r * 0.8, (rnd() - 0.5) * 1.8]);
  }
  return out;
}
/** world positions of the outer somas — the DOM pins logos to these */
export function networkAnchors(): [number, number, number][] {
  return somaPositions().slice(0, NETWORK_ANCHOR_COUNT)
    .map((s) => [s[0], s[1], s[2] + STATION.network] as [number, number, number]);
}
export function genNetwork(): Float32Array {
  const d = alloc();
  const rnd = mulberry32(43);
  const cz = STATION.network;
  const somas = somaPositions();
  // curved axons: each soma connects to its 2 nearest neighbours
  type Path = { p0: number[]; p1: number[]; p2: number[] };
  const axons: Path[] = [];
  for (let i = 0; i < somas.length; i++) {
    const dists = somas
      .map((s, j) => ({ j, dd: j === i ? 1e9 : Math.hypot(s[0] - somas[i][0], s[1] - somas[i][1], s[2] - somas[i][2]) }))
      .sort((a, b) => a.dd - b.dd);
    for (let n = 0; n < 2; n++) {
      const bIdx = dists[n].j;
      const a = somas[i], b = somas[bIdx];
      const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
      // bow the axon sideways so nothing is a straight wire
      const bow = 0.8 + rnd() * 1.4;
      const px = -(b[1] - a[1]), py = b[0] - a[0];
      const pl = Math.hypot(px, py) || 1;
      axons.push({
        p0: a,
        p1: [mid[0] + (px / pl) * bow, mid[1] + (py / pl) * bow, mid[2] + (rnd() - 0.5) * 1.2],
        p2: b,
      });
    }
  }
  // dendrites: fine branching tendrils sprouting from every soma
  const dendrites: Path[] = [];
  for (const s of somas) {
    const branches = 5 + Math.floor(rnd() * 3);
    for (let b = 0; b < branches; b++) {
      const th = rnd() * Math.PI * 2;
      const ph = Math.acos(rnd() * 2 - 1);
      const len = 1.0 + rnd() * 1.9;
      const dir = [Math.sin(ph) * Math.cos(th), Math.cos(ph) * 0.7, Math.sin(ph) * Math.sin(th) * 0.5];
      const end = [s[0] + dir[0] * len, s[1] + dir[1] * len, s[2] + dir[2] * len];
      dendrites.push({
        p0: s,
        p1: [s[0] + dir[0] * len * 0.5 + (rnd() - 0.5) * 0.8, s[1] + dir[1] * len * 0.5 + (rnd() - 0.5) * 0.8, s[2] + dir[2] * len * 0.5],
        p2: end,
      });
    }
  }
  const bez = (path: Path, t: number) => {
    const u = 1 - t;
    return [
      u * u * path.p0[0] + 2 * u * t * path.p1[0] + t * t * path.p2[0],
      u * u * path.p0[1] + 2 * u * t * path.p1[1] + t * t * path.p2[1],
      u * u * path.p0[2] + 2 * u * t * path.p1[2] + t * t * path.p2[2],
    ];
  };
  for (let i = 0; i < COUNT; i++) {
    const kind = rnd();
    let x = 0, y = 0, z = 0, w = 0;
    if (kind < 0.18) {
      // somas — hot glowing cell bodies
      const s = somas[Math.floor(rnd() * somas.length)];
      const g = () => (rnd() + rnd() + rnd() - 1.5) * 0.3;
      x = s[0] + g(); y = s[1] + g(); z = s[2] + g() * 0.6;
      w = 0.9 + rnd() * 0.1;
    } else if (kind < 0.55) {
      // axons — curved fibres alive with travelling pulses
      const path = axons[Math.floor(rnd() * axons.length)];
      const t = rnd();
      const p = bez(path, t);
      x = p[0] + (rnd() - 0.5) * 0.05; y = p[1] + (rnd() - 0.5) * 0.05; z = p[2] + (rnd() - 0.5) * 0.05;
      w = t;
    } else if (kind < 0.92) {
      // dendrites — hair-fine tendrils, fading toward their tips
      const path = dendrites[Math.floor(rnd() * dendrites.length)];
      const t = Math.pow(rnd(), 0.8);
      const p = bez(path, t);
      const spread = 0.02 + t * 0.06;
      x = p[0] + (rnd() - 0.5) * spread; y = p[1] + (rnd() - 0.5) * spread; z = p[2] + (rnd() - 0.5) * spread;
      w = 0.28 - t * 0.2;
    } else {
      // synaptic sparks drifting between the cells
      const s = somas[Math.floor(rnd() * somas.length)];
      const r = 0.8 + rnd() * 2.2;
      const a = rnd() * Math.PI * 2;
      x = s[0] + Math.cos(a) * r; y = s[1] + Math.sin(a) * r * 0.8; z = s[2] + (rnd() - 0.5) * 1.4;
      w = rnd() * 0.5;
    }
    d[i * 4 + 0] = x;
    d[i * 4 + 1] = y;
    d[i * 4 + 2] = z + cz;
    d[i * 4 + 3] = w;
  }
  return d;
}

// ------------------------------------------------------------------
// DIGITAL — circuitry plane + rising data columns
// ------------------------------------------------------------------
export function genDigital(): Float32Array {
  const d = alloc();
  const rnd = mulberry32(59);
  const cz = STATION.digital;
  const cell = 0.62, half = 8.5;
  const tracePts: number[][] = [];
  for (let t = 0; t < 90; t++) {
    let gx = Math.round((rnd() * 2 - 1) * (half / cell));
    let gz = Math.round((rnd() * 2 - 1) * (half / cell));
    let dir = Math.floor(rnd() * 4);
    const steps = 5 + Math.floor(rnd() * 13);
    let dist = 0;
    for (let s = 0; s < steps; s++) {
      if (rnd() < 0.35) dir = (dir + (rnd() < 0.5 ? 1 : 3)) % 4;
      const dx = dir === 0 ? 1 : dir === 2 ? -1 : 0;
      const dz = dir === 1 ? 1 : dir === 3 ? -1 : 0;
      for (let q = 0; q < 6; q++) {
        const f = q / 6;
        const px = (gx + dx * f) * cell, pz = (gz + dz * f) * cell;
        if (Math.abs(px) < half && Math.abs(pz) < half) tracePts.push([px, pz, dist + f]);
      }
      gx += dx; gz += dz; dist += 1;
    }
    for (let q = 0; q < 10; q++) {
      const a = rnd() * Math.PI * 2, r = rnd() * 0.16;
      tracePts.push([gx * cell + Math.cos(a) * r, gz * cell + Math.sin(a) * r, dist]);
    }
  }
  for (let i = 0; i < COUNT; i++) {
    const kind = rnd();
    let x = 0, y = 0, z = 0, w = 0;
    if (kind < 0.72 && tracePts.length) {
      const p = tracePts[Math.floor(rnd() * tracePts.length)];
      x = p[0]; z = p[1]; y = (rnd() - 0.5) * 0.05;
      w = (p[2] % 12) / 12;
    } else if (kind < 0.86) {
      const gx = Math.round((rnd() * 2 - 1) * 12) * cell;
      const gz = Math.round((rnd() * 2 - 1) * 12) * cell;
      const t = rnd();
      x = gx; z = gz; y = 0.15 + t * 4.6;
      w = t;
    } else {
      const snap = rnd() < 0.5;
      x = snap ? Math.round((rnd() * 2 - 1) * (half / cell)) * cell : (rnd() * 2 - 1) * half;
      z = snap ? (rnd() * 2 - 1) * half : Math.round((rnd() * 2 - 1) * (half / cell)) * cell;
      y = -0.06;
      w = 0.06;
    }
    d[i * 4 + 0] = x;
    d[i * 4 + 1] = y - 0.5;
    d[i * 4 + 2] = z + cz;
    d[i * 4 + 3] = w;
  }
  return d;
}

// ------------------------------------------------------------------
// TECHNOLOGY — an orbital constellation: energy cores on a ring,
// bound by flowing arcs. Real technology names float as UI beside it.
// ------------------------------------------------------------------
/**
 * TECHNOLOGY — the real stack, made of matter.
 * Official vendor SVG paths are rasterized and sampled, so each glyph is
 * the genuine mark rather than an approximation drawn with particles.
 */
export function genTech(logoPaths: string[]): Float32Array {
  const d = alloc();
  const rnd = mulberry32(71);
  const cz = STATION.tech;
  const R = 6.0;          // ring radius
  const S = 2.05;         // glyph size
  const clouds = logoPaths.map((p) => sampleSvgFill(p, 76)).filter((c) => c.length > 40);
  const N = clouds.length;
  for (let i = 0; i < COUNT; i++) {
    const kind = rnd();
    let x = 0, y = 0, z = 0, w = 0;
    if (N > 0 && kind < 0.78) {
      // the logos themselves, standing on a perfect circle
      const k = Math.floor(rnd() * N);
      const cloud = clouds[k];
      const p = cloud[Math.floor(rnd() * cloud.length)];
      const a = (k / N) * Math.PI * 2 - Math.PI / 2;
      x = Math.cos(a) * R + p[0] * S;
      y = Math.sin(a) * R + p[1] * S;
      z = (rnd() - 0.5) * 0.12;
      w = 0.62 + (k / Math.max(1, N)) * 0.38;
    } else if (kind < 0.93) {
      // the ring of light binding the whole stack together
      const a = rnd() * Math.PI * 2;
      const tube = (rnd() - 0.5) * 0.14;
      x = Math.cos(a) * (R + tube);
      y = Math.sin(a) * (R + tube);
      z = (rnd() - 0.5) * 0.12;
      w = a / (Math.PI * 2) * 0.4;
    } else {
      // energy spokes feeding out from the core
      const k = Math.floor(rnd() * Math.max(1, N));
      const a = (k / Math.max(1, N)) * Math.PI * 2 - Math.PI / 2;
      const t = Math.pow(rnd(), 0.7);
      x = Math.cos(a) * R * t;
      y = Math.sin(a) * R * t;
      z = (rnd() - 0.5) * 0.1;
      w = t * 0.5;
    }
    d[i * 4 + 0] = x;
    d[i * 4 + 1] = y;
    d[i * 4 + 2] = z + cz;
    d[i * 4 + 3] = w;
  }
  return d;
}

// ------------------------------------------------------------------
// ECOSYSTEM — a calm halo disk: concentric rings + orbiting product nodes
// ------------------------------------------------------------------
export function genEco(): Float32Array {
  const d = alloc();
  const rnd = mulberry32(83);
  const cz = STATION.eco;
  const NODES = 4;
  for (let i = 0; i < COUNT; i++) {
    const kind = rnd();
    let x = 0, y = 0, z = 0, w = 0;
    if (kind < 0.62) {
      // three PERFECT concentric circles, facing the camera
      const ring = Math.floor(rnd() * 3);
      const R = [6.4, 5.0, 3.6][ring];
      const a = rnd() * Math.PI * 2;
      const tube = (rnd() - 0.5) * (0.09 + ring * 0.04);
      x = Math.cos(a) * (R + tube);
      y = Math.sin(a) * (R + tube);
      z = (rnd() - 0.5) * 0.15;
      w = a / (Math.PI * 2);
    } else if (kind < 0.88) {
      // product nodes riding the middle ring — bigger, richer orbs
      const k = Math.floor(rnd() * NODES);
      const a = (k / NODES) * Math.PI * 2 + 0.6;
      const g = () => (rnd() + rnd() + rnd() - 1.5) * 0.62;
      x = Math.cos(a) * 5.0 + g();
      y = Math.sin(a) * 5.0 + g();
      z = g() * 0.4;
      w = 0.85 + rnd() * 0.15;
    } else {
      // soft nucleus
      const r = Math.pow(rnd(), 1.8) * 2.0;
      const a = rnd() * Math.PI * 2;
      const p = Math.acos(rnd() * 2 - 1);
      x = r * Math.sin(p) * Math.cos(a);
      y = r * Math.cos(p) * 0.7;
      z = r * Math.sin(p) * Math.sin(a);
      w = 0.5 + rnd() * 0.4;
    }
    d[i * 4 + 0] = x;
    d[i * 4 + 1] = y;
    d[i * 4 + 2] = z + cz;
    d[i * 4 + 3] = w;
  }
  return d;
}

// ------------------------------------------------------------------
// WORLD — a mathematically perfect sphere: continents, arcs, orbit
// ------------------------------------------------------------------
export function genWorld(): Float32Array {
  const d = alloc();
  const rnd = mulberry32(97);
  const cz = STATION.world;
  const R = 5.0;
  const surf = () => {
    const th = rnd() * Math.PI * 2;
    const ph = Math.acos(rnd() * 2 - 1);
    return [Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th)];
  };
  const hubs: number[][] = [];
  for (let h = 0; h < 14; h++) hubs.push(surf());
  // orbit plane basis (tilted, perfectly circular)
  const nrm = new THREE.Vector3(0.2, 1, 0.12).normalize();
  const u = new THREE.Vector3(1, 0, 0).cross(nrm).normalize();
  const v = nrm.clone().cross(u).normalize();
  for (let i = 0; i < COUNT; i++) {
    const kind = rnd();
    let x = 0, y = 0, z = 0, w = 0;
    if (kind < 0.30) {
      // continents — dense, bright landmasses only (oceans stay empty)
      let n = surf();
      let guard = 0;
      while (noise.noise(n[0] * 2.3 + 5, n[1] * 2.3, n[2] * 2.3) <= 0.08 && guard++ < 12) n = surf();
      x = n[0] * R; y = n[1] * R; z = n[2] * R;
      w = 0.97;
    } else if (kind < 0.42) {
      // LATITUDE rings — perfect circles of constant polar angle
      const band = Math.floor(rnd() * 9);
      const phi = ((band + 0.5) / 9) * Math.PI;
      const th = rnd() * Math.PI * 2;
      const sr = Math.sin(phi) * R, cy2 = Math.cos(phi) * R;
      x = sr * Math.cos(th); y = cy2; z = sr * Math.sin(th);
      w = 0.06;
    } else if (kind < 0.54) {
      // LONGITUDE meridians — perfect great circles through the poles
      const mer = Math.floor(rnd() * 12);
      const th = (mer / 12) * Math.PI * 2;
      const phi = rnd() * Math.PI;
      const sr = Math.sin(phi) * R;
      x = sr * Math.cos(th); y = Math.cos(phi) * R; z = sr * Math.sin(th);
      w = 0.06;
    } else if (kind < 0.76) {
      // great-circle connection arcs between hub cities
      const a = hubs[Math.floor(rnd() * hubs.length)];
      let b = hubs[Math.floor(rnd() * hubs.length)];
      if (a === b) b = hubs[(hubs.indexOf(a) + 3) % hubs.length];
      const t = rnd();
      const mx = a[0] + (b[0] - a[0]) * t;
      const my = a[1] + (b[1] - a[1]) * t;
      const mz = a[2] + (b[2] - a[2]) * t;
      const len = Math.hypot(mx, my, mz) || 1;
      const lift = R + Math.sin(t * Math.PI) * 1.7;
      x = (mx / len) * lift; y = (my / len) * lift; z = (mz / len) * lift;
      w = t;
    } else if (kind < 0.85) {
      // city beacons — short pillars of light at the hubs
      const hb = hubs[Math.floor(rnd() * hubs.length)];
      const h = 0.2 + rnd() * 0.9;
      const t = rnd();
      x = hb[0] * (R + t * h); y = hb[1] * (R + t * h); z = hb[2] * (R + t * h);
      w = 0.95;
    } else if (kind < 0.94) {
      // two clean orbital rings — perfectly circular in their tilted planes
      const outer = rnd() < 0.5;
      const a = rnd() * Math.PI * 2;
      const rr = R + (outer ? 2.6 : 1.9) + (rnd() - 0.5) * 0.14;
      const cs = Math.cos(a) * rr, sn = Math.sin(a) * rr;
      if (outer) {
        x = u.x * cs + v.x * sn; y = u.y * cs + v.y * sn; z = u.z * cs + v.z * sn;
      } else {
        // second ring tilted the other way, like a satellite constellation
        x = cs; y = sn * 0.42; z = sn * 0.9;
      }
      w = a / (Math.PI * 2);
    } else {
      // atmosphere shell
      const n = surf();
      const shell = R * (1.05 + rnd() * 0.08);
      x = n[0] * shell; y = n[1] * shell; z = n[2] * shell;
      w = 0.42 + rnd() * 0.12;
    }
    d[i * 4 + 0] = x;
    d[i * 4 + 1] = y;
    d[i * 4 + 2] = z + cz;
    d[i * 4 + 3] = w;
  }
  return d;
}

// ------------------------------------------------------------------
// LOGO — placeholder disk, replaced at runtime by pixels sampled from
// the OFFICIAL PAR Technologys icon PNG (never redrawn, never reinterpreted)
// ------------------------------------------------------------------
export function genLogoPlaceholder(): Float32Array {
  const d = alloc();
  const rnd = mulberry32(113);
  const cz = STATION.logo;
  for (let i = 0; i < COUNT; i++) {
    const a = rnd() * Math.PI * 2;
    const r = Math.sqrt(rnd()) * 6;
    d[i * 4 + 0] = Math.cos(a) * r;
    d[i * 4 + 1] = Math.sin(a) * r;
    d[i * 4 + 2] = cz + (rnd() - 0.5) * 0.3;
    d[i * 4 + 3] = 0.0;
  }
  return d;
}

/**
 * Samples the official brand icon into particle targets.
 * w: 0 → brand blue, 0.5 → deep navy, 1 → white.
 */
export async function sampleLogoTargets(url: string): Promise<Float32Array> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = url;
  });
  const S = 220;
  const cnv = document.createElement('canvas');
  cnv.width = S; cnv.height = Math.round((img.height / img.width) * S);
  const ctx = cnv.getContext('2d')!;
  ctx.drawImage(img, 0, 0, cnv.width, cnv.height);
  const px = ctx.getImageData(0, 0, cnv.width, cnv.height).data;
  const pool: number[][] = [];
  for (let y = 0; y < cnv.height; y++) {
    for (let x = 0; x < cnv.width; x++) {
      const o = (y * cnv.width + x) * 4;
      const a = px[o + 3];
      if (a < 100) continue;
      const r = px[o], g = px[o + 1], b = px[o + 2];
      const lum = (r + g + b) / 765;
      // Mapped onto the SHARED brand ramp, but biased BRIGHT: the assembled
      // mark is the last thing anyone sees, so nothing in it sits at the dull
      // bottom of the ramp. The blue P lands past the mid stop (electric blue,
      // not navy) and every light pixel goes to full brand white.
      // The real mark has exactly two colours: a vivid blue P (with its circuit
      // traces) and a light-grey speech bubble. Map them to the two upper stops
      // and nothing else, so the finale reads as the icon and not as a haze.
      let w = 0.5;                              // blue P + traces → brand blue
      if (lum > 0.72) w = 0.9;                  // speech bubble → near white
      pool.push([x / cnv.width - 0.5, 0.5 - y / cnv.height, w]);
    }
  }
  const d = alloc();
  const rnd = mulberry32(131);
  const cz = STATION.logo;
  // Big enough to be the hero of the frame, small enough that the whole mark
  // clears the nav above and the headline below. (13.5 filled 86% of the
  // screen height and cropped under the nav; 8.2 read as an afterthought.)
  const W = 11.2, H = W * (cnv.height / cnv.width);
  for (let i = 0; i < COUNT; i++) {
    const p = pool[Math.floor(rnd() * pool.length)];
    d[i * 4 + 0] = p[0] * W + (rnd() - 0.5) * 0.02;
    d[i * 4 + 1] = p[1] * H + (rnd() - 0.5) * 0.02;
    // near-flat: depth spread blurs the mark's edges once bloom is applied
    d[i * 4 + 2] = cz + (rnd() - 0.5) * 0.05;
    d[i * 4 + 3] = p[2];
  }
  return d;
}
