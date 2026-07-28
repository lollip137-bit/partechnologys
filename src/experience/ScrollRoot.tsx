'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { timeline } from '@/state/timeline';

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
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onDown = () => {
      timeline.clickAt = performance.now() / 1000;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });

    const film = document.getElementById('film');
    let raf = 0;
    let lastScroll = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      const filmLen = Math.max(1, (film?.offsetHeight ?? document.documentElement.scrollHeight) - window.innerHeight);
      timeline.progress = Math.min(1, Math.max(0, lenis.scroll / filmLen));
      const v = (lenis.scroll - lastScroll) / Math.max(1, window.innerHeight);
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
      lenis.destroy();
    };
  }, []);

  return null;
}
