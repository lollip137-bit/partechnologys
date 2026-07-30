'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { timeline, window01 } from '@/state/timeline';
import { subscribe } from '@/state/ticker';
import { viewport } from '@/state/viewport';
import { networkAnchors } from '@/particles/targets';
import { techByGroup } from '@/content/stack';
import { TechMark } from './TechStack';

// ACT 05 is CLOUD-SCALE SYSTEMS — "we wire models into your data and ship them
// as reliable services: observable, versioned". So the outer nodes of the neural
// system carry the cloud, data and delivery stack — the things that actually run
// a service in production. The network drinks their energy; hover shatters them
// and release reforms instantly.
const ICONS = techByGroup('Cloud', 'Database', 'DevOps');

export default function TechOrbit() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const items = Array.from(el.querySelectorAll<HTMLElement>('.orbit-item'));
    const anchors = networkAnchors();
    const v = new THREE.Vector3();
    const scatter = items.map(() => ({ x: 0, y: 0 }));
    let mouseX = -1e4, mouseY = -1e4;
    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const stop = subscribe(() => {
      const p = timeline.progress;
      const o = window01(p, 0.437, 0.455, 0.5, 0.518);
      el.style.opacity = String(o);
      el.style.visibility = o > 0.001 ? 'visible' : 'hidden';
      const cam = timeline.camera as THREE.PerspectiveCamera | null;
      if (o > 0.001 && cam) {
        const w = viewport.w, h = viewport.h;
        for (let i = 0; i < items.length; i++) {
          const a = anchors[i % anchors.length];
          v.set(a[0], a[1], a[2]).project(cam);
          const sx = (v.x * 0.5 + 0.5) * w;
          const sy = (-v.y * 0.5 + 0.5) * h;
          // hover shatter: flee the cursor, spring home fast
          const dx = sx + scatter[i].x - mouseX, dy = sy + scatter[i].y - mouseY;
          const dd = Math.hypot(dx, dy);
          if (dd < 110) {
            const f = (110 - dd) / Math.max(dd, 12);
            scatter[i].x += dx * f * 0.5;
            scatter[i].y += dy * f * 0.5;
          }
          scatter[i].x *= 0.82; // instant heal
          scatter[i].y *= 0.82;
          const item = items[i];
          const behind = v.z > 1;
          item.style.opacity = behind ? '0' : '1';
          item.style.transform =
            `translate(-50%,-50%) translate(${sx + scatter[i].x}px, ${sy + scatter[i].y}px)`;
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
