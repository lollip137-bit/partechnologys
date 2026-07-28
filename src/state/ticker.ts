// ONE requestAnimationFrame for the whole DOM layer.
// Nine independent rAF loops used to compete with the render loop every frame;
// this collapses them into a single, ordered pass.
type Fn = (t: number) => void;

const subs = new Set<Fn>();
let raf = 0;

function loop(t: number) {
  // a backgrounded tab does no work at all — several open tabs must not
  // each keep a particle simulation and a DOM pass alive
  if (typeof document === 'undefined' || !document.hidden) {
    for (const fn of subs) fn(t);
  }
  raf = requestAnimationFrame(loop);
}

export function subscribe(fn: Fn) {
  subs.add(fn);
  if (raf === 0) raf = requestAnimationFrame(loop);
  return () => {
    subs.delete(fn);
    if (subs.size === 0 && raf !== 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

/** Device capability probe — mobiles and weak GPUs start lean instead of thrashing. */
export const device = {
  get isMobile() {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;
  },
  get isCoarse() {
    return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  },
  get lowPower() {
    if (typeof navigator === 'undefined') return false;
    const cores = navigator.hardwareConcurrency ?? 8;
    return cores <= 4 || this.isCoarse;
  },
};
