/**
 * Map a DOM element's on-screen center to the mascot's normalized look space
 * (-1..1, matching the pointer convention in cursorTracking). Returns null if
 * the element isn't laid out.
 */
export function normalizedCenter(el: Element): { x: number; y: number } | null {
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  return {
    x: (cx / window.innerWidth) * 2 - 1,
    y: (cy / window.innerHeight) * 2 - 1,
  };
}
