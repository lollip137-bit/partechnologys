'use client';

// ============================================================
// THE DELIVERY PIPELINE — scroll-driven.
//
// A vertical rail whose spine fills as each phase scrolls into
// view; the phase lights, its deliverables cascade in. State is
// asserted DECLARATIVELY in JSX (React owns className — a class
// poked in from outside gets wiped on the next render, which is
// exactly how this codebase produced blank sections before).
//
// One IntersectionObserver, no per-frame work, no layout reads:
// the fill is a CSS scaleY transition keyed off a class.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { DELIVERY } from '@/content/services-page';

export default function DeliveryRail() {
  // highest phase index that has entered the viewport — phases never un-light
  const [lit, setLit] = useState(-1);
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const steps = Array.from(root.current?.querySelectorAll<HTMLElement>('.rail-step') ?? []);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const i = steps.indexOf(e.target as HTMLElement);
        setLit((prev) => Math.max(prev, i));
        io.unobserve(e.target);
      }
    }, { threshold: 0.35, rootMargin: '0px 0px -8% 0px' });
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <ol className="rail" ref={root}>
      {DELIVERY.map((d, i) => (
        <li className={`rail-step ${i <= lit ? 'lit' : ''}`} key={d.step}>
          <span className="rail-spine" aria-hidden><i /></span>
          <span className="rail-dot" aria-hidden>{d.step}</span>
          <div className="rail-body">
            <h3 className="rail-name">{d.name}</h3>
            <p className="rail-line">{d.line}</p>
            <ul className="rail-gives">
              {d.gives.map((g) => <li key={g}>{g}</li>)}
            </ul>
            <p className="rail-boundary">{d.boundary}</p>
          </div>
        </li>
      ))}
      <li className={`rail-step rail-cta-step ${lit >= DELIVERY.length ? 'lit' : ''}`}>
        <span className="rail-dot rail-dot-end" aria-hidden>→</span>
        <div className="rail-body">
          <Link href="/contact" className="rail-cta">Start at phase 01 — it costs nothing →</Link>
        </div>
      </li>
    </ol>
  );
}
