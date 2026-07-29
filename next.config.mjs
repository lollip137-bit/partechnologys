/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `next build` writes a plain /out folder of HTML/CSS/JS that
  // any web host serves with no Node process. Ideal for Hostinger shared
  // (Business) hosting — nothing to run or restart, and no CDN-staleness
  // games. All interactivity (the particle film, reels) is client-side, so it
  // works exactly the same as a served build.
  output: 'export',
  // no server = no on-the-fly image optimizer; images ship as-is (already sized)
  images: { unoptimized: true },
  // emit /route/index.html so LiteSpeed serves clean URLs (/library/mockups/)
  // natively, with no rewrite rules needed
  trailingSlash: true,
  reactStrictMode: false,
  devIndicators: false,
};

export default nextConfig;
