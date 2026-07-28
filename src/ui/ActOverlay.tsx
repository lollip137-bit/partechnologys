'use client';

import { useEffect, useRef } from 'react';
import { ACTS } from '@/experience/phases';
import { timeline, window01, clamp01 } from '@/state/timeline';
import { subscribe } from '@/state/ticker';

/**
 * The marketing layer. Each act is a real section — a glass copy panel on one
 * side, the particle object on the other — not a caption floating over a film.
 */
export default function ActOverlay() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blocks = Array.from(root.current?.children ?? []) as HTMLElement[];
    const wordCache = blocks.map((el) => Array.from(el.querySelectorAll<HTMLElement>('.act-word')));
    const hidden = blocks.map(() => false);
    return subscribe(() => {
      const p = timeline.progress;
      const mx = timeline.mouse.x;
      const my = timeline.mouse.y;
      for (let i = 0; i < blocks.length; i++) {
        const act = ACTS[i];
        if (!act || act.id === 'one') continue;
        const [r0, r1] = act.r;
        const len = r1 - r0;
        const a = r0 + len * 0.05, b = r0 + len * 0.18;
        const c = r0 + len * 0.85, d = r0 + len * 0.97;
        const o = window01(p, a, b, c, d);
        const el = blocks[i];
        if (o <= 0.001) {
          if (!hidden[i]) { hidden[i] = true; el.style.opacity = '0'; el.style.visibility = 'hidden'; }
          continue;
        }
        hidden[i] = false;
        el.style.visibility = 'visible';
        el.style.opacity = '1';
        // the panel drifts with the story and leans with the cursor — never static
        const drift = ((p - r0) / len - 0.5) * -34;
        const lean = act.side === 'right' ? -1 : 1;
        el.style.transform =
          `translate3d(${mx * 5 * lean}px, ${drift + my * 4}px, 0)`;
        const words = wordCache[i];
        for (let wi = 0; wi < words.length; wi++) {
          const wp = clamp01(o * 2.1 - wi * 0.1);
          const word = words[wi];
          word.style.opacity = String(Math.min(1, wp * 1.2) * Math.min(1, o * 3));
          word.style.filter = `blur(${(1 - wp) * 9}px)`;
          word.style.transform = `translateY(${(1 - wp) * 0.3}em)`;
          word.style.letterSpacing = `${(1 - wp) * 0.05}em`;
        }
      }
    });
  }, []);

  return (
    <div ref={root} className="acts">
      {ACTS.map((act) =>
        act.id === 'one' ? (
          <div key={act.id} />
        ) : (
          <section key={act.id} className={`act act-${act.side} act-${act.id}`}>
            <div className="act-panel">
              <div className="act-rule act-word" />
              <div className="act-kicker act-word">{act.kicker}</div>
              <h2 className="act-title">
                {act.title.split(' ').map((word, wi) => (
                  <span key={wi} className="act-word act-title-word">{word}&nbsp;</span>
                ))}
              </h2>
              <p className="act-line act-word">{act.line}</p>

              {act.chips && (
                <ul className="act-caps act-word">
                  {act.chips.map((chip) => (
                    <li key={chip} className="act-cap">
                      <span className="act-cap-dot" />
                      {chip}
                    </li>
                  ))}
                </ul>
              )}

              {act.stats && (
                <div className="act-stats act-word">
                  {act.stats.map((s) => (
                    <div key={s.l} className="act-stat">
                      <span className="act-stat-v">{s.v}</span>
                      <span className="act-stat-l">{s.l}</span>
                    </div>
                  ))}
                </div>
              )}

              {act.cta && (
                <a className="act-cta act-word" href={act.cta.href}>
                  {act.cta.label}
                  <span className="act-cta-arrow">→</span>
                </a>
              )}
            </div>
          </section>
        ),
      )}
    </div>
  );
}
