'use client';

// ============================================================
// THE SERVICE CONSTELLATION — a navigable 3D orbit of the
// thirteen disciplines. An ALTERNATIVE way into the catalogue;
// the flat index chips below remain the reliable path.
//
// Deliberately CSS 3D, not WebGL: a perspective-tilted ring
// (preserve-3d) spinning on the compositor costs a fraction of a
// millisecond and cannot block first paint. Each chip is a real
// anchor to its category. The mechanics:
//
//   stage (perspective)
//     └ ring   — static rotateX tilt, preserve-3d
//        └ spin — rotateZ 0→360 (the orbit)
//           └ arm × 13 — static rotateZ(θ) translateX(R)
//              └ face — animated rotateZ(-θ)→(-θ-360) undoes arm+spin,
//                        then static rotateX(-tilt) faces the viewer
//
// Net Z rotation is always zero, so chips stay upright and
// clickable while genuinely orbiting in 3D. Hover or focus
// pauses the orbit. The orbit only runs while on screen, and is
// hidden entirely on mobile and under prefers-reduced-motion —
// the index chips carry those visitors.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { SERVICE_TREE, svcSlug } from '@/content/services';

export default function ServiceConstellation({ total }: { total: number }) {
  const [on, setOn] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // intersection gate — never animate off-screen
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setOn(entries.some((e) => e.isIntersecting)),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const n = SERVICE_TREE.length;

  return (
    <div className={`const ${on ? 'const-on' : ''}`} ref={root} aria-label="Service constellation — every discipline in orbit">
      <div className="const-stage" aria-hidden={false}>
        <div className="const-core" aria-hidden>
          <span className="const-core-num">{n}</span>
          <span className="const-core-label">disciplines<br />{total} services<br />one team</span>
        </div>
        <div className="const-ring">
          <div className="const-spin">
            {SERVICE_TREE.map((cat, i) => {
              const a = (i / n) * 360;
              return (
                <div className="const-arm" key={cat.cat} style={{ ['--a' as string]: `${a}deg` }}>
                  <div className="const-face">
                    <a className="const-chip" href={`#${svcSlug(cat.cat)}`}>
                      {cat.cat}
                      <span className="const-n">{cat.items.length}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
