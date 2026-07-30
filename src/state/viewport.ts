// ============================================================
// CACHED LAYOUT — read once on resize, never in a frame.
//
// Six separate per-frame callbacks used to read `#film.offsetHeight`,
// `window.innerHeight` and `window.scrollY` directly, interleaved with the DOM
// writes of the act overlays and the three orbit layers. Reading a layout
// property after a style write forces the browser to flush style + layout
// synchronously, so the frame became:
//
//   read → write → read → write → read …   (a forced reflow at every arrow)
//
// That thrash was most of a ~12.6ms DOM floor — the cost measured with the
// entire 3D scene switched off, which is what now caps the frame rate rather
// than the GPU.
//
// None of those values change while scrolling. They change on RESIZE. So they
// are cached here, refreshed by a resize listener and a ResizeObserver on the
// film spacer, and every consumer reads these plain numbers instead.
// ============================================================

export const viewport = {
  w: 0,
  h: 0,
  /** scrollable length of the film spacer — the denominator of `progress` */
  filmLen: 1,
  /** scroll offset at which the film ends and the site sections take over */
  filmEnd: 0,
  /**
   * Current scroll offset, published once per frame by ScrollRoot from Lenis's
   * own value — so nothing else has to touch `window.scrollY`.
   */
  scrollY: 0,
};

/** Recomputes the cache. Safe to call at any time; call it on layout changes. */
export function measureViewport() {
  if (typeof window === 'undefined') return;
  const film = document.getElementById('film');
  viewport.w = window.innerWidth;
  viewport.h = window.innerHeight;
  const filmH = film?.offsetHeight ?? document.documentElement.scrollHeight;
  viewport.filmLen = Math.max(1, filmH - viewport.h);
  viewport.filmEnd = Math.max(0, filmH - viewport.h);
}

/** Wires up the listeners. Returns a teardown. Call once, from ScrollRoot. */
export function initViewport(): () => void {
  measureViewport();

  let pending = 0;
  const remeasure = () => {
    // coalesce bursts (a drag-resize fires continuously) into one measurement
    if (pending) cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => {
      pending = 0;
      measureViewport();
    });
  };

  window.addEventListener('resize', remeasure, { passive: true });
  window.addEventListener('orientationchange', remeasure, { passive: true });

  // The film spacer is sized in viewport units, but fonts loading or the site
  // sections reflowing can still change it — observe rather than assume.
  const film = document.getElementById('film');
  let ro: ResizeObserver | undefined;
  if (film && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(remeasure);
    ro.observe(film);
  }

  return () => {
    if (pending) cancelAnimationFrame(pending);
    window.removeEventListener('resize', remeasure);
    window.removeEventListener('orientationchange', remeasure);
    ro?.disconnect();
  };
}
