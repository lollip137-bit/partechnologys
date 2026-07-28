// ============================================================
// THE DELIVERY LIBRARY
// Real websites we have shipped, and the design concepts we
// built along the way. Everything here is our own work — the
// mockups are the versions that were saved as we designed.
// ============================================================

export interface Delivered {
  id: string;
  name: string;
  sector: string;
  /** NEUTRAL window label — never a client domain. See the confidentiality rule. */
  label: string;
  line: string;
  /** still shown before the reel loads */
  poster: string;
  /** self-hosted scroll-through of the LANDING PAGE, served from our domain */
  reel: string;
  stack: string[];
  highlights: string[];
  status: 'Live' | 'Demo' | 'In build';
}

export const DELIVERED: Delivered[] = [
  {
    id: 'menshub',
    name: "MEN'S HUB — The Vault",
    sector: 'Luxury E-Commerce',
    label: 'Luxury e-commerce · landing page',
    line:
      'A cinematic flagship store for men’s jewelry and instruments. The whole shop is one nine-act scroll film — the monogram is drawn by gold particles, products arrive out of the dark, and the checkout never leaves the world.',
    poster: '/library/reels/menshub-poster.jpg',
    reel: '/library/reels/menshub.mp4',
    stack: ['Next.js', 'React Three Fiber', 'Lenis', 'Vercel Blob', 'Stripe-ready checkout'],
    highlights: ['Nine-act scroll film', 'Full cart & checkout', 'Owner panel with live orders'],
    status: 'Live',
  },
  {
    id: 'pargroup',
    name: 'PAR Group Global',
    sector: 'Corporate · Holdings',
    label: 'Corporate holdings · landing page',
    line:
      'The parent-company site: a diversified group across construction, technology, aviation and specialist solutions, introduced by a slowly turning gold wireframe world.',
    poster: '/library/reels/pargroup-poster.jpg',
    reel: '/library/reels/pargroup.mp4',
    stack: ['Next.js', 'React Three Fiber', 'GSAP', 'Framer Motion', 'Tailwind'],
    highlights: ['Procedural 3D globe', 'Company & leadership sections', 'Editorial dark-gold identity'],
    status: 'Live',
  },
  {
    id: 'partech',
    name: 'PAR TECHNOLOGYS',
    sector: 'AI & Software',
    label: 'AI & software · landing page',
    line:
      'The site you are on. One conserved particle system carries you through eleven acts — vortex, DNA, brain, neural net, circuitry, stack, products, planet — and finally assembles the brand mark itself.',
    poster: '/library/reels/partech-poster.jpg',
    reel: '/library/reels/partech.mp4',
    stack: ['Next.js 15', 'React Three Fiber', 'GPU particle simulation', 'Postprocessing', 'Lenis'],
    highlights: ['65,536 GPU-simulated particles', 'Eleven-act single take', 'Adaptive quality governor'],
    status: 'Live',
  },
  {
    id: 'copperline',
    name: 'Copperline Plumbing',
    sector: 'Trades · Contractor',
    label: 'Contractor · landing page',
    line:
      'A contractor site that behaves like a premium product page: real service depth, honest pricing, emergency call-out flow, and a quiet 3D copper motif running underneath.',
    poster: '/library/reels/copper2-poster.jpg',
    reel: '/library/reels/copper2.mp4',
    stack: ['Next.js 15', 'React Three Fiber', 'TypeScript'],
    highlights: ['Emergency call-out flow', 'Service & pricing depth', 'Three saved design routes'],
    status: 'Demo',
  },
];

// ------------------------------------------------------------
// MOCKUP & DEMO LIBRARY
// Every concept saved while designing. Nothing here was thrown
// away — each version is preserved so it can be revisited.
// ------------------------------------------------------------

export type ConceptArt =
  | 'spiral' | 'vortex' | 'nebula' | 'journey' | 'fragments'
  | 'wave' | 'grid' | 'orbit' | 'monogram' | 'pipe';

export interface Mockup {
  id: string;
  no: string;
  name: string;
  family: string;
  line: string;
  tags: string[];
  art: ConceptArt;
  /** a preserved concept has no capture — it is drawn as poster art instead */
  poster?: string;
  /** self-hosted scroll-through of the landing page */
  reel?: string;
}

export const MOCKUPS: Mockup[] = [
  {
    id: 'm01', no: '01', name: 'Nebula World', family: 'PAR TECHNOLOGYS',
    line: 'The first world: an enormous drifting nebula the visitor travels inside of, with the copy floating in the cloud.',
    tags: ['Volumetric', 'Slow drift', 'Opening act'], art: 'nebula',
  },
  {
    id: 'm02', no: '02', name: 'Vortex Intro', family: 'PAR TECHNOLOGYS',
    line: 'Scattered matter falls into a single gravitational vortex — the first version of intelligence gathering itself into one flow.',
    tags: ['Gravity', 'Elliptical spin', 'Intro'], art: 'vortex',
  },
  {
    id: 'm03', no: '03', name: 'Fragment Journey', family: 'PAR TECHNOLOGYS',
    line: 'Broken shards of a logo travelling through space and reassembling — the ancestor of the finale you just watched.',
    tags: ['Shards', 'Reassembly', 'Journey'], art: 'fragments',
  },
  {
    id: 'm04', no: '04', name: 'Spiral Particle Concept', family: 'PAR TECHNOLOGYS',
    line: 'The living particle field: nine dust rivers spiralling into a clean black centre — luminosity built from density, never from a glowing blob.',
    tags: ['Nine rivers', 'Curl flow', 'True black core'], art: 'spiral',
  },
  {
    id: 'm05', no: '05', name: 'ACT I — Birth of Intelligence', family: 'PAR TECHNOLOGYS',
    line: 'Controlled chaos becomes uneven self-organization, then a gravitational living vortex. The core is earned only after order emerges.',
    tags: ['600k particles', 'Organization front', 'Earned core'], art: 'vortex',
  },
  {
    id: 'm06', no: '06', name: 'ACT II — Intelligence Expanding', family: 'PAR TECHNOLOGYS',
    line: 'The same particles unfold outward into the larger universe. Streams burst into individuals mid-unfold — the vortex was compressed intelligence all along.',
    tags: ['Unfold', 'Reveal', 'Continuous flow'], art: 'wave',
  },
  {
    id: 'm07', no: '07', name: 'ACT III — The Living Nebula', family: 'PAR TECHNOLOGYS',
    line: 'The nebula becomes the world: ridged filaments and a finer detail octave, violet-warmed cores over true-black voids, drifting with the camera.',
    tags: ['Ridged filaments', 'Camera drift', 'True blacks'], art: 'nebula',
  },
  {
    id: 'm08', no: '08', name: 'Ten-Act Particle Journey', family: 'PAR TECHNOLOGYS',
    line: 'The first complete single-system homepage: vortex → DNA → brain → neural net → technology written by dust → products → industries → trust → collapse.',
    tags: ['Ten acts', 'One system', 'World line'], art: 'journey',
  },
  {
    id: 'm09', no: '09', name: 'V2 — Phase One', family: 'PAR TECHNOLOGYS',
    line: 'The rebuilt engine: one conserved 65,536-particle simulation with acts as stations along a single flight route.',
    tags: ['Conserved flow', 'FBO simulation', 'Stations'], art: 'orbit',
  },
  {
    id: 'm10', no: '10', name: 'V2 — Phase Two', family: 'PAR TECHNOLOGYS',
    line: 'The film becomes a website: marketing acts, glass product cards, the inner pages, and the finale that assembles the official mark.',
    tags: ['Story layer', 'Glass UI', 'Finale'], art: 'grid',
  },
  {
    id: 'mh',
    no: '—', name: "MEN'S HUB — Final Mockup", family: 'LUXURY RETAIL',
    line: 'The finished dark-luxury flagship: a gold monogram drawn by particles, cream-and-gold identity, and a full storefront underneath the film.',
    tags: ['Cream & gold', 'Nine acts', 'Full commerce'], art: 'monogram', reel: '/library/reels/menshub.mp4', poster: '/library/reels/menshub-poster.jpg',
  },
  {
    id: 'pg',
    no: '—', name: 'PAR Group Global — Final Mockup', family: 'CORPORATE',
    line: 'The holding-company face of the group: a gold wireframe world, editorial typography and a calm, institutional tone.',
    tags: ['Wireframe world', 'Editorial', 'Institutional'], art: 'orbit', reel: '/library/reels/pargroup.mp4', poster: '/library/reels/pargroup-poster.jpg',
  },
  {
    id: 'cl2', no: '02', name: 'Copperline — Route 02 · Daylight', family: 'TRADES',
    line: 'The route we shipped: a plumbing contractor rebuilt as a premium product page — bright, airy, with copper running through clean water light.',
    tags: ['Emergency flow', 'Pricing depth', 'Copper motif'], art: 'pipe', reel: '/library/reels/copper2.mp4', poster: '/library/reels/copper2-poster.jpg',
  },
  {
    id: 'cl1', no: '01', name: 'Copperline — Route 01 · Night', family: 'TRADES',
    line: 'The first saved route: the same contractor brand in a dark, technical key — copper glowing against deep blue instead of daylight.',
    tags: ['Dark key', 'Pressure HUD', 'Technical'], art: 'pipe',
    reel: '/library/reels/copper1.mp4', poster: '/library/reels/copper1-poster.jpg',
  },
  {
    id: 'cl3', no: '03', name: 'Copperline — Route 03 · Refined', family: 'TRADES',
    line: 'The last pass over the daylight route — reworked service depth, proof blocks and the areas-served map further down the page.',
    tags: ['Service depth', 'Proof blocks', 'Areas served'], art: 'pipe',
    reel: '/library/reels/copper3.mp4', poster: '/library/reels/copper3-poster.jpg',
  },
];
