'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { timeline, window01 } from '@/state/timeline';
import { subscribe } from '@/state/ticker';
import { viewport } from '@/state/viewport';
import { STATION } from '@/experience/phases';
import { techByGroup } from '@/content/stack';
import { TechMark } from './TechStack';

// ACT 04 — ARTIFICIAL INTELLIGENCE. The models, agents and vector stores that
// engineer intelligence, orbiting the cortex.
const ICONS = techByGroup('AI');

export default function BrainOrbit() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const items = Array.from(el.querySelectorAll<HTMLElement>('.orbit-item'));
    const v = new THREE.Vector3();
    const scatter = items.map(() => ({ x: 0, y: 0 }));
    let mouseX = -1e4, mouseY = -1e4;
    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const stop = subscribe(() => {
      const p = timeline.progress;
      const t = performance.now() / 1000;
      const o = window01(p, 0.352, 0.372, 0.408, 0.428);
      el.style.opacity = String(o);
      el.style.visibility = o > 0.001 ? 'visible' : 'hidden';
      const cam = timeline.camera as THREE.PerspectiveCamera | null;
      if (o > 0.001 && cam) {
        const w = viewport.w, h = viewport.h;
        // anchor to the specimen, then ring it in SCREEN space so the logos
        // always frame the cortex instead of drifting across it
        v.set(0, 0.5, STATION.brain).project(cam);
        // the act copy owns the left column — bias the ring right of it
        const cx = (v.x * 0.5 + 0.5) * w + w * 0.09;
        const cy = (-v.y * 0.5 + 0.5) * h;
        const rx = Math.min(w * 0.34, 560);
        const ry = Math.min(h * 0.40, 330);
        for (let i = 0; i < items.length; i++) {
          const a = (i / items.length) * Math.PI * 2 + t * 0.12;
          const sx = cx + Math.cos(a) * rx;
          const sy = cy + Math.sin(a) * ry;
          const dx = sx + scatter[i].x - mouseX, dy = sy + scatter[i].y - mouseY;
          const dd = Math.hypot(dx, dy);
          if (dd < 100) {
            const f = (100 - dd) / Math.max(dd, 12);
            scatter[i].x += dx * f * 0.5;
            scatter[i].y += dy * f * 0.5;
          }
          scatter[i].x *= 0.8;
          scatter[i].y *= 0.8;
          const item = items[i];
          item.style.opacity = '1';
          item.style.transform =
            `translate(${sx + scatter[i].x}px, ${sy + scatter[i].y}px) translate(-50%,-50%)`;
        }
      }
    });
    return () => { stop(); window.removeEventListener('mousemove', onMouse); };
  }, []);

  return (
    <div ref={root} className="orbit" aria-hidden>
      {ICONS.map((tech) => (
        <div key={tech.name} className="orbit-item orbit-pinned" style={{ ['--tech' as string]: `#${tech.hex}` }}>
          <span className="orbit-glow" />
          <TechMark tech={tech} />
          <span className="orbit-label">{tech.name}</span>
        </div>
      ))}
    </div>
  );
}
