import { NextResponse } from 'next/server';

/**
 * Keep HTML documents fresh on any CDN.
 *
 * Next serves statically-prerendered pages with `Cache-Control: s-maxage=
 * 31536000` — it tells a CDN the HTML is good for a YEAR, on the assumption
 * that the CDN is purged on every deploy (which is what Vercel does silently).
 * Hostinger's CDN honours the year and never re-fetches, so a page cached
 * once is frozen until someone purges by hand — the whole site would stop
 * reflecting new deploys.
 *
 * This overrides the header for HTML routes so the CDN must revalidate with
 * the origin. A new deploy is then live immediately, with no manual purge.
 * Hashed build assets (`/_next/static/*`) and files with an extension
 * (images, the reel .mp4s, og.png, sitemap.xml) are excluded by the matcher
 * and keep their long, safe immutable cache — filenames change each build, so
 * they can never go stale.
 */
export function middleware() {
  const res = NextResponse.next();
  res.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
};
