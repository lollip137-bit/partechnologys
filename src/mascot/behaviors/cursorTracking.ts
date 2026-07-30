import { mascotStore } from "../useMascotState";
import { normalizedCenter } from "./lookAtElement";

/**
 * Mouse move -> `tracking` (brief §5). Writes the normalized pointer every move
 * (this is the ONLY per-move store write; the 3D loop reads it, no re-render).
 * Tracking is released ~1.1s after the cursor stops so the idle timers can take
 * over and escalate to sleepy/asleep.
 *
 * Also resolves proximity to CTAs here (cheap, piggybacks on the same event):
 * within 120px of a `[data-mascot="cta"]` -> `anticipating`, glancing at it.
 */
export function startCursorTracking(): () => void {
  const store = mascotStore.getState;
  let stopTimer: ReturnType<typeof setTimeout> | null = null;

  const onMove = (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    store().setPointer(x, y);
    store().hold("cursor", "tracking");

    if (stopTimer) clearTimeout(stopTimer);
    stopTimer = setTimeout(() => store().hold("cursor", null), 1100);

    // --- CTA proximity (anticipating) ---
    let nearest: HTMLElement | null = null;
    let best = Infinity;
    const ctas = document.querySelectorAll<HTMLElement>('[data-mascot="cta"]');
    for (const el of ctas) {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - Math.max(r.left, Math.min(e.clientX, r.right));
      const dy = e.clientY - Math.max(r.top, Math.min(e.clientY, r.bottom));
      const d = Math.hypot(dx, dy);
      if (d < best) {
        best = d;
        nearest = el;
        if (d < 120) store().setLookTarget(normalizedCenter(el) ?? { x: cx, y: cy });
      }
    }
    if (nearest && best < 120) store().hold("cta", "anticipating");
    else store().hold("cta", null);
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  return () => {
    window.removeEventListener("mousemove", onMove);
    if (stopTimer) clearTimeout(stopTimer);
    store().hold("cursor", null);
    store().hold("cta", null);
  };
}
