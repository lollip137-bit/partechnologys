/** ============================================================
 * PAR WEB INTELLIGENCE — the free website audit product.
 * One module owns everything both surfaces (the home promo and
 * /web-intelligence/) say about it, so the claims can never drift
 * apart — and the tool's address lives in exactly one place.
 * ============================================================ */

/**
 * The live tool. It runs on its own subdomain; when that host ever
 * moves, this line is the only thing that changes.
 */
export const WEB_INTELLIGENCE_URL = 'https://parwebintelligence.partechnologys.com';

/** The seven areas every audit measures — on the client's real pages. */
export const WI_AREAS: { icon: string; name: string; line: string }[] = [
  {
    icon: 'seo',
    name: 'SEO',
    line: 'How search engines read each page — titles, descriptions, headings, canonicals and the signals that decide whether you rank.',
  },
  {
    icon: 'perf',
    name: 'Performance',
    line: 'Page weight, load behaviour and the assets slowing you down, measured on your pages against a throttled mobile profile.',
  },
  {
    icon: 'access',
    name: 'Accessibility',
    line: 'Contrast, alt text, labels and keyboard paths — the barriers real visitors quietly hit and leave over.',
  },
  {
    icon: 'content',
    name: 'Content',
    line: 'Readability, thin pages, duplication — where the words on the page stop doing their job.',
  },
  {
    icon: 'security',
    name: 'Security',
    // The audit is passive observation only. Nothing is probed, fuzzed or
    // tested for weaknesses, and the wording must not suggest otherwise.
    line: 'HTTPS, certificates, response headers and cookie flags, read from what your site already sends back.',
  },
  {
    icon: 'ai',
    name: 'AI readiness',
    // Deliberately "can read", not "how often you are cited". The tool measures
    // readability to AI crawlers and says so plainly in its own report; it
    // cannot see citation frequency, so this must not imply that it can.
    line: 'Whether AI assistants and answer engines can actually read and understand your pages.',
  },
  {
    icon: 'tech',
    name: 'Technical health',
    line: 'Broken links, redirects, sitemaps, robots rules — the plumbing everything else stands on.',
  },
];

/** Honest facts — repeated verbatim wherever the product is offered. */
export const WI_FACTS: string[] = [
  'Free to run',
  'No signup',
  'Nothing stored',
  'Measured on your real pages',
];

/** How an audit actually runs — including honest timing. */
export const WI_STEPS: { step: string; title: string; line: string }[] = [
  {
    step: '01',
    title: 'Point it at your site',
    line: 'Paste your address into the tool. It works on any public website — no install, no account.',
  },
  {
    step: '02',
    title: 'It reads your real pages',
    line: 'The engine fetches and measures your live pages. A home-page scan takes about 15 seconds; a full site audit runs for a few minutes.',
  },
  {
    step: '03',
    title: 'You read the verdict',
    line: 'Graded findings across all seven areas, each backed by evidence from your own pages — on screen, and as a PDF you can keep.',
  },
];

/** What a client walks away with. */
export const WI_DELIVERABLES: { name: string; line: string }[] = [
  {
    name: 'An on-screen report',
    line: 'A live, graded report of every finding — what is wrong, where it is, and the evidence from your own pages that proves it.',
  },
  {
    name: 'A downloadable PDF',
    line: 'The same report as a clean document — ready to share with your team, your agency, or whoever maintains the site.',
  },
];
