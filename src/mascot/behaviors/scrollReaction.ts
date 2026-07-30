import { mascotStore } from "../useMascotState";

/**
 * Body leans on scroll velocity, then settles (brief phase 2). We compute a
 * smoothed velocity from scroll deltas and decay it toward 0 on a rAF loop; the
 * 3D loop reads `scrollVelocity` and eases the torso's lean, so this file never
 * touches the scene graph directly.
 */
export function startScrollReaction(): () => void {
  const store = mascotStore.getState;
  let lastY = window.scrollY;
  let lastT = performance.now();
  let vel = 0;
  let raf = 0;

  const onScroll = () => {
    const now = performance.now();
    const dt = Math.max(16, now - lastT) / 1000;
    const dy = window.scrollY - lastY;
    lastY = window.scrollY;
    lastT = now;
    // clamp to a sane range; normalize to roughly -1..1
    vel = Math.max(-1, Math.min(1, (dy / dt) / 2500));
  };

  const decay = () => {
    vel *= 0.9;
    if (Math.abs(vel) < 0.001) vel = 0;
    store().setScrollVelocity(vel);
    raf = requestAnimationFrame(decay);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  raf = requestAnimationFrame(decay);

  return () => {
    window.removeEventListener("scroll", onScroll);
    cancelAnimationFrame(raf);
    store().setScrollVelocity(0);
  };
}
