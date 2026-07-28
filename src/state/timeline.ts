// Global cinematic timeline. Scroll controls TIME.
// Mutated in place every frame — never triggers React re-renders.
export const timeline = {
  progress: 0, // 0..1 across the FILM (sections after the film clamp at 1)
  velocity: 0, // smoothed scroll velocity (world energy)
  mouse: { x: 0, y: 0 }, // -1..1, eased
  pointerSpeed: 0, // EMA of cursor motion — drives repulsion strength
  clickAt: -10, // clock time of last pointer-down (shockwave)
  ready: false, // particle engine compiled & first frame rendered
  camera: null as unknown, // live THREE camera — DOM overlays project 3D anchors through it
};

export function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/** 0 → 1 → 0 window with smooth edges */
export function window01(p: number, a: number, b: number, c: number, d: number) {
  return smoothstep(a, b, p) * (1 - smoothstep(c, d, p));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
