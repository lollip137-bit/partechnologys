'use client';

import { useEffect, useRef } from 'react';
import { timeline, smoothstep } from '@/state/timeline';
import { subscribe } from '@/state/ticker';
import { viewport } from '@/state/viewport';

/** ACT 11 — the world becomes still. */
export default function Finale() {
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = root.current!;
    return subscribe(() => {
      const p = timeline.progress;
      // fade the hero away as the real website scrolls over it
      const over = Math.max(0, viewport.scrollY - viewport.filmEnd);
      const site = Math.max(0, 1 - over / (viewport.h * 0.45));
      const head = smoothstep(0.94, 0.962, p) * site;
      const sub = smoothstep(0.955, 0.978, p) * site;
      const cta = smoothstep(0.968, 0.992, p) * site;
      el.style.setProperty('--head', String(head));
      el.style.setProperty('--sub', String(sub));
      el.style.setProperty('--cta', String(cta));
      el.style.visibility = head > 0.001 ? 'visible' : 'hidden';
      el.style.pointerEvents = cta > 0.6 ? 'auto' : 'none';
    });
  }, []);

  // magnetic CTA
  const onMove = (e: React.MouseEvent) => {
    const b = btn.current!;
    const r = b.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    b.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
  };
  const onLeave = () => {
    if (btn.current) btn.current.style.transform = 'translate(0,0)';
  };

  return (
    <div ref={root} className="finale">
      <div className="finale-scrim" aria-hidden />
      <h1 className="finale-head">
        {'We Build Intelligence.'.split(' ').map((word, i) => (
          <span key={i} className="finale-word" style={{ transitionDelay: `${i * 90}ms` }}>
            {word}&nbsp;
          </span>
        ))}
      </h1>
      <p className="finale-sub">
        From a single particle to a global ecosystem — AI, cloud, security and software
        engineered by PAR Technologys to build businesses that think.
      </p>
      <div className="finale-actions" onMouseMove={onMove} onMouseLeave={onLeave}>
        <a
          ref={btn}
          className="finale-cta"
          href="#work"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Explore Our Work
        </a>
        <button
          className="finale-replay"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↺ Witness it again
        </button>
      </div>
    </div>
  );
}
