'use client';

import { useMemo } from 'react';
import type { ConceptArt as Kind } from '@/content/library';

/**
 * Poster art for the saved design concepts. Each concept that has no
 * screenshot is drawn here from the same particle vocabulary as the film —
 * deterministic, weightless, and honest about being a design study.
 */

const W = 480, H = 300;

function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

interface Dot { x: number; y: number; r: number; o: number; c: string }

const BLUE = '#3D9DFF';
const DEEP = '#1C5CE8';
const PALE = '#CFE8FF';

function build(kind: Kind): { dots: Dot[]; paths: { d: string; o: number; w: number }[] } {
  const r = rng(kind.length * 7919 + kind.charCodeAt(0) * 131 + 17);
  const dots: Dot[] = [];
  const paths: { d: string; o: number; w: number }[] = [];
  const cx = W / 2, cy = H / 2;
  const tint = (t: number) => (t < 0.33 ? DEEP : t < 0.78 ? BLUE : PALE);

  // Math.cos/sin differ by one ULP between Node and V8-in-the-browser, which is
  // enough for React to report a hydration mismatch. Everything that reaches the
  // DOM is rounded, so server and client serialize byte-identical markup.
  const q = (n: number) => Math.round(n * 100) / 100;
  const push = (x: number, y: number, sz = 1, o = 0.8) =>
    dots.push({ x: q(x), y: q(y), r: sz, o: q(o), c: tint(r()) });

  switch (kind) {
    case 'spiral': {
      // nine dust rivers falling into a clean black centre
      for (let arm = 0; arm < 9; arm++) {
        const a0 = (arm / 9) * Math.PI * 2;
        for (let i = 0; i < 62; i++) {
          const t = i / 62;
          const rad = 22 + t * 132;
          const a = a0 + t * 2.1;
          const j = (r() - 0.5) * (5 + t * 16);
          push(cx + Math.cos(a) * rad * 1.5 + j, cy + Math.sin(a) * rad * 0.72 + j * 0.5, t < 0.2 ? 1.5 : 0.9, 0.25 + t * 0.6);
        }
      }
      break;
    }
    case 'vortex': {
      // a gravitational funnel seen side-on
      for (let i = 0; i < 620; i++) {
        const t = r();
        const a = r() * Math.PI * 2;
        const rad = 12 + Math.pow(t, 0.55) * 170;
        push(cx + Math.cos(a) * rad * 1.32, cy + Math.sin(a) * rad * 0.34 + (t - 0.5) * 42, t < 0.25 ? 1.6 : 0.9, 0.3 + (1 - t) * 0.6);
      }
      for (let k = 0; k < 4; k++) {
        const rad = 44 + k * 34;
        paths.push({ d: ellipse(cx, cy, rad * 1.32, rad * 0.34), o: q(0.14 - k * 0.025), w: 1 });
      }
      break;
    }
    case 'nebula': {
      // ridged filaments over true black
      for (let f = 0; f < 14; f++) {
        const y0 = 26 + r() * (H - 52);
        const amp = 12 + r() * 30;
        const ph = r() * 6.28;
        let d = '';
        for (let i = 0; i <= 40; i++) {
          const x = (i / 40) * W;
          const y = y0 + Math.sin(i * 0.28 + ph) * amp + Math.sin(i * 0.63 + ph * 2) * amp * 0.35;
          d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
          if (i % 2 === 0) push(x + (r() - 0.5) * 8, y + (r() - 0.5) * 12, 0.8, 0.2 + r() * 0.4);
        }
        paths.push({ d, o: q(0.10 + r() * 0.12), w: 0.9 });
      }
      break;
    }
    case 'journey': {
      // stations along one flight line
      paths.push({ d: `M0 ${cy} L${W} ${cy}`, o: 0.16, w: 1 });
      for (let s = 0; s < 6; s++) {
        const sx = 46 + s * ((W - 92) / 5);
        const rad = 15 + r() * 14;
        for (let i = 0; i < 70; i++) {
          const a = r() * Math.PI * 2;
          const rr = Math.pow(r(), 0.5) * rad;
          push(sx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 0.9, 0.35 + r() * 0.5);
        }
      }
      for (let i = 0; i < 200; i++) push(r() * W, cy + (r() - 0.5) * 26, 0.6, 0.12 + r() * 0.2);
      break;
    }
    case 'fragments': {
      // shards travelling toward a reassembly point
      for (let s = 0; s < 24; s++) {
        const a = r() * Math.PI * 2;
        const rad = 34 + r() * 150;
        const x = cx + Math.cos(a) * rad * 1.25;
        const y = cy + Math.sin(a) * rad * 0.72;
        const sz = 6 + r() * 16;
        paths.push({
          d: `M${q(x)} ${q(y)} l${q(sz)} ${q(-sz * 0.4)} l${q(-sz * 0.3)} ${q(sz)} Z`,
          o: q(0.14 + r() * 0.3), w: 0.9,
        });
        for (let i = 0; i < 10; i++) push(x + (r() - 0.5) * sz * 2, y + (r() - 0.5) * sz * 2, 0.8, 0.3 + r() * 0.4);
      }
      for (let i = 0; i < 80; i++) {
        const a = r() * 6.28, rad = Math.pow(r(), 2) * 46;
        push(cx + Math.cos(a) * rad * 1.3, cy + Math.sin(a) * rad * 0.8, 1.2, 0.5 + r() * 0.5);
      }
      break;
    }
    case 'wave': {
      // matter unfolding outward
      for (let i = 0; i < 720; i++) {
        const t = r();
        const a = r() * Math.PI * 2;
        const rad = Math.pow(t, 0.35) * 190;
        push(cx + Math.cos(a) * rad * 1.25, cy + Math.sin(a) * rad * 0.62, t > 0.7 ? 0.7 : 1.1, 0.55 - t * 0.35);
      }
      break;
    }
    case 'grid': {
      // structured intelligence — a data lattice
      for (let gy = 0; gy < 7; gy++) {
        for (let gx = 0; gx < 12; gx++) {
          const x = 34 + gx * ((W - 68) / 11);
          const y = 34 + gy * ((H - 68) / 6);
          push(x, y, 1.4, 0.35 + r() * 0.5);
          if (gx < 11 && r() > 0.45) paths.push({ d: `M${x} ${y} L${x + (W - 68) / 11} ${y}`, o: 0.1, w: 0.8 });
          if (gy < 6 && r() > 0.6) paths.push({ d: `M${x} ${y} L${x} ${y + (H - 68) / 6}`, o: 0.08, w: 0.8 });
        }
      }
      break;
    }
    case 'orbit': {
      // a wireframe world
      for (let k = 0; k < 7; k++) {
        const t = (k + 0.5) / 7;
        const rad = Math.sin(t * Math.PI) * 108;
        const y = cy - 108 + t * 216;
        paths.push({ d: ellipse(cx, q(y), rad * 1.1, rad * 0.26), o: 0.2, w: 0.9 });
        for (let i = 0; i < 52; i++) {
          const a = r() * 6.28;
          push(cx + Math.cos(a) * rad * 1.1, y + Math.sin(a) * rad * 0.26, 1, 0.3 + r() * 0.5);
        }
      }
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI;
        paths.push({ d: ellipse(cx, cy, q(118 * Math.abs(Math.cos(a)) + 6), 112), o: 0.12, w: 0.8 });
      }
      break;
    }
    case 'monogram': {
      // a mark drawn out of dust
      const strokes = [
        [[150, 220], [150, 90]], [[150, 90], [200, 200]], [[200, 200], [250, 90]], [[250, 90], [250, 220]],
        [[290, 230], [330, 78]],
      ];
      for (const [p0, p1] of strokes) {
        for (let i = 0; i < 120; i++) {
          const t = i / 120;
          push(p0[0] + (p1[0] - p0[0]) * t + (r() - 0.5) * 7, p0[1] + (p1[1] - p0[1]) * t + (r() - 0.5) * 7, 1, 0.4 + r() * 0.55);
        }
      }
      for (let i = 0; i < 110; i++) push(r() * W, r() * H, 0.7, 0.1 + r() * 0.18);
      break;
    }
    case 'pipe': {
      // a run of line under pressure
      let d = `M0 ${cy + 40}`;
      const pts = [[110, cy + 40], [150, cy - 30], [300, cy - 30], [340, cy + 46], [W, cy + 46]];
      for (const [x, y] of pts) d += ` L${x} ${y}`;
      paths.push({ d, o: 0.5, w: 6 });
      paths.push({ d, o: 0.22, w: 14 });
      for (let i = 0; i < 380; i++) {
        const t = r();
        const x = t * W;
        const y = x < 110 ? cy + 40 : x < 150 ? cy + 40 - ((x - 110) / 40) * 70 : x < 300 ? cy - 30 : x < 340 ? cy - 30 + ((x - 300) / 40) * 76 : cy + 46;
        push(x, y + (r() - 0.5) * 16, 0.9, 0.25 + r() * 0.5);
      }
      break;
    }
  }
  return { dots, paths };
}

function ellipse(cx: number, cy: number, rx: number, ry: number) {
  const q = (n: number) => Math.round(n * 100) / 100;
  return `M${q(cx - rx)} ${q(cy)} a${q(rx)} ${q(ry)} 0 1 0 ${q(rx * 2)} 0 a${q(rx)} ${q(ry)} 0 1 0 ${q(-rx * 2)} 0`;
}

export default function ConceptArt({ kind }: { kind: Kind }) {
  const { dots, paths } = useMemo(() => build(kind), [kind]);
  return (
    <svg className="concept-art" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${kind} design concept`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`cg-${kind}`} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#0A1936" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#000104" stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#cg-${kind})`} />
      {paths.map((p, i) => (
        <path key={`p${i}`} d={p.d} fill="none" stroke={BLUE} strokeOpacity={p.o} strokeWidth={p.w} strokeLinecap="round" />
      ))}
      {dots.map((d, i) => (
        <circle key={`d${i}`} cx={d.x} cy={d.y} r={d.r} fill={d.c} fillOpacity={Math.min(1, d.o * 1.45)} />
      ))}
    </svg>
  );
}
