'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { subscribe } from '@/state/ticker';
import { viewport } from '@/state/viewport';

/**
 * On the film page there was no way out once you scrolled past the experience:
 * the nav retreats, and the only route back to the top was a long manual
 * scroll. This appears the moment the reader leaves the film.
 */
export function FilmBackToTop() {
  const btn = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = btn.current!;
    let shown = -1;
    return subscribe(() => {
      // visible once the reader is a third of a screen into the website
      const want = viewport.scrollY > viewport.filmEnd + viewport.h * 0.3 ? 1 : 0;
      if (want !== shown) {
        shown = want;
        el.classList.toggle('on', want === 1);
      }
    });
  }, []);

  const toSite = () => {
    document.getElementById('services-sec')?.scrollIntoView({ behavior: 'smooth' });
  };
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div ref={btn} className="backdock">
      <button className="backdock-btn" onClick={toSite} aria-label="Back to the top of the site">
        <span aria-hidden>↑</span> Top of site
      </button>
      <button className="backdock-btn ghost" onClick={toTop} aria-label="Replay the experience">
        <span aria-hidden>↺</span> Replay the film
      </button>
    </div>
  );
}

/** Inner pages: a real back control, plus a way into the film on purpose. */
export function PageBack() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // history.length > 1 alone lies on a fresh tab; this is the honest check
    setCanGoBack(typeof window !== 'undefined' && window.history.length > 1 && document.referrer !== '');
  }, []);

  return (
    <button
      className="pageback"
      onClick={() => (canGoBack ? router.back() : router.push('/#services-sec'))}
      aria-label="Go back"
    >
      <span aria-hidden>←</span>
      <span className="pageback-text">Back</span>
    </button>
  );
}
