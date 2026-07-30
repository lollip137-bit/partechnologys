// ============================================================
// QUALITY TIERS — derived from measurement, not intuition.
//
// Profiled at the brain act (the worst in the film: close camera, dense
// structure) on an Intel Iris Xe at 1376x774, by switching one layer off at a
// time. A ~38ms frame broke down as:
//
//   post-processing   ~19ms   (bloom 11 · tone mapping 4 · aberration+vignette 3.6)
//   particle field     ~5ms
//   ambient cosmos     ~2ms
//   DOM / React floor ~12.6ms
//
// Two conclusions changed the design:
//
// 1. The particle population is nearly FREE. Drawing 5% instead of 100% of it
//    saved ~1ms — inside the noise. So the old governor, whose only two levers
//    were "thin the population" and "lower the resolution", was bidding against
//    ~7ms of a 38ms frame and could never win. It floored both levers on this
//    GPU and still sat at 26fps.
//
// 2. Bloom's cost is its FULL-RESOLUTION luminance prefilter, not its blur.
//    Quartering resolutionScale, and switching mipmapBlur off entirely, both
//    changed nothing measurable — only removing it did.
//
// So quality is now a tier over the POST-PROCESSING chain, which is where the
// time actually is. Tier 1 drops the composer wholesale (~19ms, roughly double
// the frame rate) and moves tone mapping onto the renderer, where it is folded
// into the existing material shaders for free.
// ============================================================

export const quality = {
  /** 0 = full composer (bloom + graded tone mapping). 1 = no composer. */
  tier: 0,
};

type Fn = () => void;
const subs = new Set<Fn>();

/** React components re-render on tier changes; the tier is read in useFrame. */
export function subscribeQuality(fn: Fn): () => void {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

export function setTier(t: number) {
  if (quality.tier === t) return;
  quality.tier = t;
  for (const fn of subs) fn();
}
