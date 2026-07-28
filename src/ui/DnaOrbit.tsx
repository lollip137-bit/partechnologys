'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { timeline, window01 } from '@/state/timeline';
import { subscribe } from '@/state/ticker';
import { STATION } from '@/experience/phases';
import { DNA_TILT } from '@/particles/targets';
import {
  siAnthropic, siGooglegemini, siLangchain, siN8n, siHuggingface, siMeta,
  siOpenjdk, siSupabase, siOllama, siFirebase, siFlutter, siKotlin,
} from 'simple-icons';

// The AI platforms we build with — attached to the DNA, climbing it like
// light from bottom to top. Hover scatters them; they snap back instantly.
const ICONS = [
  siAnthropic, siGooglegemini, siLangchain, siN8n, siHuggingface, siMeta,
  siOpenjdk, siSupabase, siOllama, siFirebase, siFlutter, siKotlin,
];

export default function DnaOrbit() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const items = Array.from(el.querySelectorAll<HTMLElement>('.orbit-item'));
    const v = new THREE.Vector3();
    const scatter = items.map(() => ({ x: 0, y: 0 }));
    let mouseX = -1e4, mouseY = -1e4;
    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const height = 17, radius = 2.0, turns = 6.0;
    const ct = Math.cos(DNA_TILT), st = Math.sin(DNA_TILT);
    const stop = subscribe(() => {
      const p = timeline.progress;
      const t = performance.now() / 1000;
      const o = window01(p, 0.232, 0.252, 0.3, 0.322);
      el.style.opacity = String(o);
      el.style.visibility = o > 0.001 ? 'visible' : 'hidden';
      const cam = timeline.camera as THREE.PerspectiveCamera | null;
      if (o > 0.001 && cam) {
        const w = window.innerWidth, h = window.innerHeight;
        for (let i = 0; i < items.length; i++) {
          // climb the helix: bottom → top, forever
          const s = ((i / items.length) + t * 0.045) % 1;
          const th = s * turns * Math.PI * 2;
          // same lean as the particle helix, so the logos ride the strands
          const lx = Math.cos(th) * radius;
          const ly = (s - 0.5) * height;
          v.set(
            lx * ct - ly * st,
            lx * st + ly * ct,
            Math.sin(th) * radius + STATION.dna,
          ).project(cam);
          const sx = (v.x * 0.5 + 0.5) * w;
          const sy = (-v.y * 0.5 + 0.5) * h;
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
          const fade = s < 0.06 ? s / 0.06 : s > 0.94 ? (1 - s) / 0.06 : 1;
          item.style.opacity = String(fade);
          item.style.transform =
            `translate(-50%,-50%) translate(${sx + scatter[i].x}px, ${sy + scatter[i].y}px)`;
        }
      }
    });
    return () => { stop(); window.removeEventListener('mousemove', onMouse); };
  }, []);

  return (
    <div ref={root} className="orbit" aria-hidden>
      {ICONS.map((icon) => (
        <div key={icon.slug} className="orbit-item orbit-pinned">
          <span className="orbit-glow" />
          <svg viewBox="0 0 24 24" role="img" aria-label={icon.title}
            fill={icon.hex === '000000' ? '#E5E7EB' : `#${icon.hex}`}>
            <path d={icon.path} />
          </svg>
          <span className="orbit-label">{icon.title}</span>
        </div>
      ))}
    </div>
  );
}
