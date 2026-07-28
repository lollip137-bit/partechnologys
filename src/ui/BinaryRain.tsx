'use client';

import { useEffect, useMemo, useRef } from 'react';
import { timeline, window01 } from '@/state/timeline';
import { subscribe } from '@/state/ticker';

/** ACT 07 — streams of raw binary orbiting the computation. */
export default function BinaryRain() {
  const root = useRef<HTMLDivElement>(null);

  const columns = useMemo(() => {
    const cols: { left: number; dur: number; delay: number; text: string }[] = [];
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 16; i++) {
      let s = '';
      for (let k = 0; k < 46; k++) s += rnd() > 0.5 ? '1' : '0';
      cols.push({
        left: 3 + i * 6 + rnd() * 2,
        dur: 7 + rnd() * 9,
        delay: -rnd() * 12,
        text: s,
      });
    }
    return cols;
  }, []);

  useEffect(() => {
    const el = root.current!;
    return subscribe(() => {
      const o = window01(timeline.progress, 0.528, 0.548, 0.595, 0.615);
      el.style.opacity = String(o * 0.8);
      el.style.visibility = o > 0.001 ? 'visible' : 'hidden';
    });
  }, []);

  return (
    <div ref={root} className="binary" aria-hidden>
      {columns.map((col, i) => (
        <span
          key={i}
          className="binary-col"
          style={{
            left: `${col.left}%`,
            animationDuration: `${col.dur}s`,
            animationDelay: `${col.delay}s`,
          }}
        >
          {col.text}
        </span>
      ))}
      <span className="binary-band">
        {'01001010 11010010 01101001 00101101 01010011 10010110 01001010 11010010 01101001 00101101 '.repeat(3)}
      </span>
    </div>
  );
}
