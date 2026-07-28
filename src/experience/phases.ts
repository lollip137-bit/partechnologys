// ============================================================
// THE FILM SCRIPT — one continuous journey along a flight line.
// Every act is a PAR TECHNOLOGYS capability; the same conserved
// particles travel between tightly-packed stations. No dead air.
// ============================================================

export const PAGES = 9; // scroll length in viewport-heights x100

// World stations — compressed spacing so the camera is never in empty space
export const STATION = {
  vortex: 0,
  dna: -34,
  brain: -66,
  network: -98,
  digital: -130,
  tech: -162,
  eco: -194,
  world: -226,
  logo: -258,
} as const;

export interface Act {
  id: string;
  kicker: string;
  title: string;
  line: string;
  chips?: string[];
  /** hard proof — every act must answer "why PAR" */
  stats?: { v: string; l: string }[];
  cta?: { label: string; href: string };
  r: [number, number];
  side: 'left' | 'right' | 'center';
}

// The story describes PAR TECHNOLOGYS — what we do, achieve and build.
// Every act answers two questions at once:
//   where are we in the story of intelligence — and what does PAR do here?
export const ACTS: Act[] = [
  {
    id: 'void', kicker: 'PAR TECHNOLOGYS', title: 'We build intelligence.',
    line: 'An AI and software company. We turn ideas into intelligent digital products that run real businesses.',
    cta: { label: 'See what we build', href: '#services-sec' },
    r: [0.0, 0.04], side: 'center',
  },
  {
    id: 'wake', kicker: '01 — DISCOVERY & STRATEGY', title: 'Every innovation begins with one idea.',
    line: 'We audit your operations and find the exact process where AI pays back first — then map the route to production.',
    chips: ['Technology Audit', 'AI Strategy', 'Roadmapping', 'CTO as a Service'],
    stats: [{ v: '2 wks', l: 'to a costed roadmap' }, { v: '100%', l: 'fixed-scope pricing' }],
    cta: { label: 'Book a discovery call', href: '/contact' },
    r: [0.04, 0.10], side: 'left',
  },
  {
    id: 'vortex', kicker: '02 — BUSINESS AUTOMATION', title: 'Scattered work becomes one flow.',
    line: 'Manual, repetitive operations gather into a single intelligent system that runs itself — and never files a duplicate again.',
    chips: ['Workflow Automation', 'RPA', 'CRM & Invoice Automation', 'Integrations'],
    stats: [{ v: '12×', l: 'average automation ROI' }, { v: '−63%', l: 'manual workload' }],
    cta: { label: 'Automate my business', href: '/services' },
    r: [0.10, 0.225], side: 'left',
  },
  {
    id: 'dna', kicker: '03 — SOFTWARE ENGINEERING', title: 'Every solution starts with architecture.',
    line: 'We design scalable foundations, then write the software strand by strand — web, mobile, SaaS and enterprise systems built to last.',
    chips: ['Custom Software', 'SaaS Platforms', 'Web & Mobile', 'Legacy Modernization'],
    stats: [{ v: '120+', l: 'projects shipped' }, { v: 'Weekly', l: 'production releases' }],
    cta: { label: 'Explore engineering', href: '/services' },
    r: [0.225, 0.33], side: 'right',
  },
  {
    id: 'brain', kicker: '04 — ARTIFICIAL INTELLIGENCE', title: 'Intelligence, engineered.',
    line: 'Machine learning, computer vision and autonomous agents trained on the language of your domain — not a generic chatbot.',
    chips: ['AI Agents', 'Machine Learning', 'Computer Vision', 'Generative AI'],
    stats: [{ v: '40+', l: 'AI systems in production' }, { v: '92%', l: 'agent containment rate' }],
    cta: { label: 'See our AI work', href: '/library' },
    r: [0.33, 0.43], side: 'left',
  },
  {
    id: 'network', kicker: '05 — CLOUD-SCALE SYSTEMS', title: 'Intelligence becomes connected.',
    line: 'We wire models into your data and ship them as reliable services — observable, versioned and sharper every day.',
    chips: ['MLOps', 'Data Pipelines', 'API Development', 'Kubernetes'],
    stats: [{ v: '99.9%', l: 'platform uptime' }, { v: '150ms', l: 'median inference' }],
    cta: { label: 'Talk architecture', href: '/contact' },
    r: [0.43, 0.52], side: 'right',
  },
  {
    id: 'digital', kicker: '06 — DATA & ANALYTICS', title: 'Data becomes decisions.',
    line: 'Warehouses, ETL and live dashboards that turn raw operational noise into the numbers your leadership actually acts on.',
    chips: ['Business Intelligence', 'Dashboards', 'Data Warehousing', 'ETL'],
    stats: [{ v: '11k+', l: 'events processed / day' }, { v: 'Real-time', l: 'reporting' }],
    cta: { label: 'See analytics work', href: '/library' },
    r: [0.52, 0.61], side: 'left',
  },
  {
    id: 'tech', kicker: '07 — THE STACK WE SPEAK', title: 'Your stack, fully assembled.',
    line: 'Cloud, DevOps and security engineered end to end. We work in the technologies your team already trusts.',
    chips: ['AWS · Azure · GCP', 'Docker & Kubernetes', 'CI/CD', 'Cyber Security'],
    stats: [{ v: '30+', l: 'technologies in production' }, { v: '24/7', l: 'monitoring' }],
    cta: { label: 'View the full stack', href: '/services' },
    r: [0.61, 0.70], side: 'right',
  },
  {
    id: 'eco', kicker: '08 — PRODUCTS', title: 'The PAR ecosystem.',
    line: 'Our own products — Assist, Cloud, Shield and Insights — ready to deploy straight into your business.',
    stats: [{ v: '4', l: 'shipping products' }, { v: 'Day 1', l: 'deployment' }],
    cta: { label: 'Explore products', href: '#work' },
    r: [0.70, 0.79], side: 'center',
  },
  {
    id: 'world', kicker: '09 — GLOBAL SCALE', title: 'Built to go worldwide.',
    line: 'From first MVP to global platform. Growth engineering, managed services and teams that travel with you.',
    chips: ['Growth Engineering', 'SEO · GEO · AEO', 'Managed IT', 'Dedicated Teams'],
    stats: [{ v: '9', l: 'industries served' }, { v: '6', l: 'languages supported' }],
    cta: { label: 'Scale with us', href: '/contact' },
    r: [0.79, 0.875], side: 'right',
  },
  {
    id: 'one', kicker: 'PAR TECHNOLOGYS', title: 'We Build Intelligence.',
    line: 'From a single particle to an ecosystem.',
    r: [0.875, 1.0], side: 'center',
  },
];

// ---- Shape schedule: tighter holds, quick liquid morphs between them
export interface ShapeSlot {
  name: string;
  hold: [number, number];
}
// transitions squeezed to ~0.03 of scroll: no dead air, morphs are instant
export const SHAPE_SLOTS: ShapeSlot[] = [
  { name: 'genesis', hold: [0.0, 0.192] },
  { name: 'dna',     hold: [0.222, 0.316] },
  { name: 'brain',   hold: [0.348, 0.418] },
  { name: 'network', hold: [0.448, 0.508] },
  { name: 'digital', hold: [0.530, 0.598] },
  { name: 'tech',    hold: [0.625, 0.688] },
  { name: 'eco',     hold: [0.715, 0.778] },
  { name: 'world',   hold: [0.805, 0.862] },
  { name: 'logo',    hold: [0.893, 1.10] },
];

// ---- ONE locked brand palette for the entire experience.
// #0A0F1D · #111E40 · #2563EB · #00C2FF · #E5E7EB (+ deep black)
// ONE colour family for the entire experience. Every act — vortex, DNA,
// brain, network, circuitry, stack, planet, logo — is rendered from these
// three stops. Acts differ by BRIGHTNESS and GLOW, never by hue.
//   deep brand navy  →  brand blue / electric cyan  →  brand white
const BRAND: [string, string, string] = ['#123A8F', '#2E86FF', '#DDF3FF'];
// The finale is the ONE place the ramp is lifted: same hue family, every stop
// pushed toward the luminous end so the assembled mark reads as the real,
// vivid brand icon instead of a dark navy silhouette.
const BRAND_LOGO: [string, string, string] = ['#0B49D8', '#1E90FF', '#EAF4FF'];
export const SHAPE_PALETTES: Record<string, [string, string, string]> = {
  genesis: BRAND,
  dna: BRAND,
  brain: BRAND,
  network: BRAND,
  digital: BRAND,
  tech: BRAND,
  eco: BRAND,
  world: BRAND,
  logo: BRAND_LOGO,
};
export const GENESIS_PALETTE = BRAND;

// ---- Camera choreography: always looking at matter, never at emptiness.
export interface CamKey {
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
}
const S = STATION;
// Composition rule: the copy panel owns one half of the screen, so the camera
// aims PAST the object toward the panel side — pushing the object to the
// opposite half. look.x > 0 shoves the object left; look.x < 0 shoves it right.
const OFF = 3.4; // how far the object is pushed out of the copy column
export const CAM_KEYS: CamKey[] = [
  { p: 0.000, pos: [0.0, 0.8, 28],   look: [0, 0, 0] },
  // wake (copy LEFT → object RIGHT)
  { p: 0.045, pos: [0.5, 1.2, 24],   look: [-OFF, 0, 0] },
  { p: 0.085, pos: [5.0, 2.6, 17],   look: [-OFF, 0, 0] },
  // vortex (copy LEFT → object RIGHT)
  { p: 0.130, pos: [-4.0, 2.0, 13],  look: [-OFF, 0, 0] },
  { p: 0.175, pos: [0.0, 1.2, 9.5],  look: [-OFF, 0, 0] },
  { p: 0.210, pos: [0.0, 1.0, 4.0],  look: [0, 0, S.dna] },
  // dna (copy RIGHT → object LEFT)
  { p: 0.245, pos: [6.0, 1.0, S.dna + 15], look: [OFF + 0.6, 0, S.dna] },
  { p: 0.290, pos: [7.0, 0.5, S.dna + 12], look: [OFF + 1.0, 0, S.dna] },
  // brain (copy LEFT → object RIGHT)
  { p: 0.330, pos: [3.0, 1.0, S.brain + 20], look: [-OFF, 0.5, S.brain] },
  { p: 0.385, pos: [8.0, 2.6, S.brain + 8],  look: [-OFF, 0.5, S.brain] },
  // network (copy RIGHT → object LEFT)
  { p: 0.430, pos: [-1.5, 1.0, S.network + 22], look: [OFF, 0, S.network] },
  { p: 0.480, pos: [1.5, 1.5, S.network + 16], look: [OFF, 0, S.network] },
  // digital (copy LEFT → object RIGHT)
  { p: 0.520, pos: [0.0, 0.5, S.digital + 22], look: [-OFF, 0, S.digital] },
  { p: 0.570, pos: [6.0, 4.4, S.digital + 9],  look: [-OFF, 0, S.digital] },
  // tech (copy RIGHT → object LEFT)
  { p: 0.610, pos: [0.0, 1.5, S.tech + 26],  look: [OFF, 0, S.tech] },
  { p: 0.660, pos: [0.0, 0.4, S.tech + 15],  look: [OFF, 0, S.tech] },
  // eco (centered)
  { p: 0.700, pos: [-2.5, 1.0, S.eco + 28],  look: [0, -1.2, S.eco] },
  { p: 0.750, pos: [5.5, 1.6, S.eco + 9],    look: [0, -1.2, S.eco] },
  // world (copy RIGHT → object LEFT)
  { p: 0.790, pos: [0.0, 2.0, S.world + 26], look: [OFF, 0, S.world] },
  { p: 0.835, pos: [5.5, 2.6, S.world + 15], look: [OFF, 0, S.world] },
  // finale — the mark owns the UPPER half of the frame, the copy owns the lower
  // third. The camera aims BELOW the logo centre, which lifts the mark on screen
  // and opens clean space for the headline. Never let the two share a band.
  { p: 0.875, pos: [0.0, 1.4, S.logo + 30],  look: [0, -1.5, S.logo] },
  { p: 0.920, pos: [0.0, 0.4, S.logo + 27],  look: [0, -1.9, S.logo] },
  { p: 1.000, pos: [0.0, 0.0, S.logo + 25.0], look: [0, -2.1, S.logo] },
];
