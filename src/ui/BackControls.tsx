'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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

/**
 * Inner pages: a real back control.
 *
 * This used to gate on `document.referrer !== ''`, which is empty on a fresh tab
 * AND on plenty of ordinary in-app navigations — so `canGoBack` was false far
 * more often than it should have been and the button fell through to
 * `router.push('/#services-sec')`, dumping the visitor onto the homepage film
 * instead of taking them back one step. That is the "back button takes us to the
 * main page" bug.
 *
 * The honest signal is how many in-app navigations this tab has made, so we
 * count them in sessionStorage. If there is somewhere to go back TO, we go
 * there. If the visitor landed directly on this page (shared link, search
 * result, new tab) there is no history to pop, so the control becomes an
 * explicit "Home" instead of pretending to be Back.
 */
const DEPTH_KEY = 'par-nav-depth';

export function PageBack() {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let depth = Number(sessionStorage.getItem(DEPTH_KEY) ?? '0');
    // A route change inside the app pushes a history entry we are allowed to pop.
    // The first page of the session is entry 0 — nothing behind it.
    depth += 1;
    sessionStorage.setItem(DEPTH_KEY, String(depth));
    setCanGoBack(depth > 1 && window.history.length > 1);
  }, [pathname]);

  const onClick = () => {
    if (canGoBack) {
      // stay in step with our own counter, or the next page miscounts
      const depth = Number(sessionStorage.getItem(DEPTH_KEY) ?? '1');
      sessionStorage.setItem(DEPTH_KEY, String(Math.max(0, depth - 2)));
      router.back();
      return;
    }
    router.push('/');
  };

  return (
    <button
      className="pageback"
      onClick={onClick}
      aria-label={canGoBack ? 'Go back to the previous page' : 'Go to the homepage'}
    >
      <span aria-hidden>←</span>
      <span className="pageback-text">{canGoBack ? 'Back' : 'Home'}</span>
    </button>
  );
}
