'use client';

// ============================================================
// Shared micro-interaction primitives for the inner pages.
//
// Performance rules honoured here (measured on this codebase —
// see the notes in phase4.css and src/state/viewport.ts):
//  * no layout reads inside per-frame callbacks — the counter
//    reads only the timestamp; getBoundingClientRect happens in
//    one-off event handlers (a mousemove over a single card)
//  * transform/opacity animation only, driven through the ONE
//    shared rAF ticker instead of new requestAnimationFrame loops
//  * anything continuous respects prefers-reduced-motion
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { subscribe, device } from '@/state/ticker';

/** Live media-query hook — continuous animation switches itself off. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduced;
}

/**
 * A stat that counts up when it scrolls into view.
 * Renders the final value in the HTML (SEO / no-JS safe) and only
 * rewinds to zero at the moment the animation actually starts.
 */
export function Counter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const m = value.match(/([\d.]+)/);
    if (!m || m.index === undefined) return; // nothing numeric — leave the text alone
    const target = parseFloat(m[1]);
    const prefix = value.slice(0, m.index);
    const suffix = value.slice(m.index + m[1].length);
    const decimals = m[1].includes('.') ? m[1].split('.')[1].length : 0;

    let unsub: (() => void) | null = null;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      let start = 0;
      unsub = subscribe((t) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / 1400);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p >= 1 && unsub) { unsub(); unsub = null; }
      });
    }, { threshold: 0.4 });
    io.observe(el);

    return () => { io.disconnect(); if (unsub) unsub(); };
  }, [value]);

  return (
    <div className="stat" data-a>
      <span className="stat-value" ref={ref}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/**
 * A glass card whose border/glow follows the cursor, with a gentle 3D tilt.
 * Layout is read inside the mousemove handler only — never per-frame.
 */
export function SpotlightCard({ className = '', children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (device.isCoarse) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x.toFixed(1)}px`);
    el.style.setProperty('--my', `${y.toFixed(1)}px`);
    const dx = x / r.width - 0.5;
    const dy = y / r.height - 0.5;
    el.style.setProperty('--tilt', `perspective(900px) rotateX(${(-dy * 4).toFixed(2)}deg) rotateY(${(dx * 6).toFixed(2)}deg) translateY(-2px)`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--tilt', 'none');
  };

  return (
    <div ref={ref} className={`spot ${className}`} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </div>
  );
}

/** A wrapper that leans its child toward the cursor. Pointer-fine only. */
export function Magnetic({ className = '', strength = 0.22, children, ...rest }: React.HTMLAttributes<HTMLSpanElement> & { strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (device.isCoarse) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const clamp = (v: number) => Math.max(-12, Math.min(12, v));
    const dx = clamp((e.clientX - (r.left + r.width / 2)) * strength);
    const dy = clamp((e.clientY - (r.top + r.height / 2)) * strength);
    el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'translate3d(0, 0, 0)';
  };

  return (
    <span ref={ref} className={`mag ${className}`} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </span>
  );
}
