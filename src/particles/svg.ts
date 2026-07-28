// ============================================================
// SVG → PARTICLES
// Shapes are never hand-drawn. A real vector path is rasterized,
// then its filled area is sampled into particle positions, so every
// glyph is mathematically exact before it becomes matter.
// ============================================================

export type Pt = [number, number];

/** Samples the FILLED area of an SVG path (24x24 viewBox) into unit points. */
export function sampleSvgFill(pathData: string, res = 72): Pt[] {
  if (typeof document === 'undefined') return [];
  const cnv = document.createElement('canvas');
  cnv.width = res;
  cnv.height = res;
  const ctx = cnv.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  ctx.scale(res / 24, res / 24);
  try {
    ctx.fill(new Path2D(pathData));
  } catch {
    return [];
  }
  const data = ctx.getImageData(0, 0, res, res).data;
  const pts: Pt[] = [];
  for (let y = 0; y < res; y++) {
    for (let x = 0; x < res; x++) {
      if (data[(y * res + x) * 4 + 3] > 120) {
        // centered, y-up, in a -0.5..0.5 box
        pts.push([x / res - 0.5, 0.5 - y / res]);
      }
    }
  }
  return pts;
}

/** Samples along the OUTLINE of a path — for wireframe/edge treatments. */
export function sampleSvgOutline(pathData: string, count = 600): Pt[] {
  if (typeof document === 'undefined') return [];
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', pathData);
  svg.appendChild(path);
  document.body.appendChild(svg);
  const out: Pt[] = [];
  try {
    const len = path.getTotalLength();
    if (len > 0) {
      for (let i = 0; i < count; i++) {
        const p = path.getPointAtLength((i / count) * len);
        out.push([p.x / 24 - 0.5, 0.5 - p.y / 24]);
      }
    }
  } catch {
    /* ignore malformed paths */
  }
  svg.remove();
  return out;
}
