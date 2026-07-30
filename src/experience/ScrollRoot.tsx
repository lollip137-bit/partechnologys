'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { timeline } from '@/state/timeline';
import { initViewport, viewport } from '@/state/viewport';

/**
 * Scroll IS time — but only across the film spacer (#film).
 * Once the film completes, the real website sections scroll over the hero.
 */
export default function ScrollRoot() {
  useEffect(() => {
    // a film always starts at the first frame — never resume mid-story on reload
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      lerp: 0.2,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.6,
    });
    lenis.scrollTo(0, { immediate: true });

    let mx = 0, my = 0, lastMx = 0, lastMy = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / viewport.w) * 2 - 1;
      my = (e.clientY / viewport.h) * 2 - 1;
    };
    const onDown = () => {
      timeline.clickAt = performance.now() / 1000;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });

    const teardownViewport = initViewport();

    let raf = 0;
    let lastScroll = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      // Publish the scroll offset ONCE per frame, from Lenis's own value, so no
      // other per-frame callback has to touch window.scrollY or offsetHeight.
      viewport.scrollY = lenis.scroll;
      timeline.progress = Math.min(1, Math.max(0, lenis.scroll / viewport.filmLen));
      const v = (lenis.scroll - lastScroll) / Math.max(1, viewport.h);
      lastScroll = lenis.scroll;
      timeline.velocity += (v * 60 - timeline.velocity) * 0.1;
      // eased mouse + cursor speed (drives particle repulsion)
      const dx = mx - lastMx, dy = my - lastMy;
      lastMx = mx; lastMy = my;
      // fast attack, fast release — hover scatters instantly and heals instantly
      timeline.pointerSpeed += (Math.hypot(dx, dy) * 60 - timeline.pointerSpeed) * 0.3;
      timeline.mouse.x += (mx - timeline.mouse.x) * 0.1;
      timeline.mouse.y += (my - timeline.mouse.y) * 0.1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('pointerdown', onDown);
      teardownViewport();
      lenis.destroy();
    };
  }, []);

  return null;
}
