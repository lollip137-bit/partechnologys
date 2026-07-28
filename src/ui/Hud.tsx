'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from 'react';
import { timeline } from '@/state/timeline';
import { subscribe } from '@/state/ticker';

/** Minimal luxury HUD + the boot sequence: sparks converge into the logo. */
export default function Hud() {
  const bar = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const [hintArmed, setHintArmed] = useState(false);

  // deterministic spark cloud for the boot animation
  const sparks = useMemo(() => {
    let seed = 41;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    return Array.from({ length: 34 }, () => ({
      sx: (rnd() * 2 - 1) * 42,
      sy: (rnd() * 2 - 1) * 30,
      d: rnd() * 0.5,
      s: 0.6 + rnd() * 1.6,
    }));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHintArmed(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let formed = false;
    return subscribe(() => {
      const p = timeline.progress;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (hint.current) {
        const show = hintArmed && p < 0.008 && timeline.ready;
        hint.current.style.opacity = show ? '1' : '0';
      }
      // boot: dot breathes → sparks fly inward → the logo forms → the veil lifts
      if (veil.current && timeline.ready && !formed) {
        formed = true;
        veil.current.classList.add('veil-form');
        setTimeout(() => veil.current?.classList.add('veil-lift'), 1750);
      }
    });
  }, [hintArmed]);

  return (
    <>
      <div ref={veil} className="veil">
        <span className="veil-dot" />
        <div className="veil-core">
          {sparks.map((sp, i) => (
            <span
              key={i}
              className="veil-spark"
              style={{
                ['--sx' as string]: `${sp.sx}vw`,
                ['--sy' as string]: `${sp.sy}vh`,
                ['--sd' as string]: `${sp.d}s`,
                ['--ss' as string]: sp.s,
              }}
            />
          ))}
          <img className="veil-logo" src="/brand/par-icon.png" alt="" draggable={false} />
          <div className="veil-name">
            <span className="veil-par">PAR</span>
            <span className="veil-tech">TECHNOLOGYS</span>
          </div>
        </div>
      </div>
      <div className="hud-bar"><div ref={bar} className="hud-bar-fill" /></div>
      <div ref={hint} className="hud-hint">
        <span>Scroll to witness the beginning</span>
        <span className="hud-hint-line" />
      </div>
    </>
  );
}
