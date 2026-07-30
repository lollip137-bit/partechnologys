/**
 * Drax's knowledge base — browser-native.
 *
 * The V3 site is a STATIC EXPORT (next.config.mjs `output: 'export'`), so there
 * is no Node process and no API route to run retrieval on. The corpus is tiny,
 * so the whole RAG pipeline runs client-side instead (see localBrain.ts).
 *
 * ⚠️ EVERY fact here is taken from the site's own content modules
 * (src/content/seo.ts, src/content/site.ts, src/content/services.ts) so the
 * assistant can never contradict the site. Do NOT add project counts, uptime
 * figures, client names, testimonials or case-study metrics — those were
 * deliberately removed from this site for being unverified. If a number isn't
 * in src/content, it does not go in here.
 */

export interface KbDoc {
  source: string;
  text: string;
}

export const KNOWLEDGE: KbDoc[] = [
  {
    source: "company",
    text: `PAR Technologys is an AI and software company. The tagline is "We Build Intelligence." We turn ideas into intelligent digital products that run real businesses. One team, end to end — from the first audit to running production. We operate across the USA, Canada, Dubai, the UK and Pakistan, and serve clients worldwide.`,
  },
  {
    source: "services",
    text: `What PAR Technologys builds: AI agents and automation — production AI grounded in your data, governed, observable and cost-controlled. Custom software — production-grade systems engineered to last, across web, mobile, SaaS and enterprise. Web platforms — websites and web apps that convert and scale. Mobile apps — native and cross-platform apps people keep. Business automation — repetitive work, retired. Enterprise systems — the systems your company runs on. Industry solutions — systems built for how your sector actually works. Cloud and DevOps — deploy anywhere, scale everywhere. Data and analytics — noise in, strategy out. Growth engineering — growth loops that compound. Product design and UX — interfaces people feel before they understand. Consulting — senior judgment, on demand. Support — we stay after the launch.`,
  },
  {
    source: "faq-what",
    text: `What does PAR Technologys actually build? AI agents and automation, custom software (web, mobile, SaaS, enterprise), machine-learning systems, cloud infrastructure, cyber security and growth engineering. One team, end to end — from the first audit to running production.`,
  },
  {
    source: "faq-timeline",
    text: `How long does a typical project take? An MVP usually ships in 4 to 8 weeks. Larger platforms run in weekly increments so you see working software every single week — no six-month black boxes.`,
  },
  {
    source: "faq-existing-systems",
    text: `Do you work with existing systems or only greenfield projects? Mostly existing systems. We integrate with your current stack — ERPs, CRMs, databases, legacy APIs — and modernize incrementally instead of forcing a rewrite.`,
  },
  {
    source: "faq-pricing",
    text: `How do you price engagements? Fixed-scope builds have fixed prices. Ongoing product work runs as a monthly engineering subscription you can pause anytime. Every engagement starts with a scoped audit, so you know cost before you commit.`,
  },
  {
    source: "faq-ownership",
    text: `Who owns the code and the models? You do. Full source code, infrastructure and model weights are handed over, with documentation and training for your team.`,
  },
  {
    source: "faq-non-tech",
    text: `Can AI really help a non-technical business? That is where it helps most. The highest-return automations we ship are in logistics, construction, healthcare, real estate and hospitality — businesses full of repetitive decisions and paperwork.`,
  },
  {
    source: "contact",
    text: `How to reach PAR Technologys: email info@partechnologys.com for enquiries, or office@partechnologys.com for office and admin. The contact page on this site is the fastest route, and every engagement begins with a scoped audit call. We work across the USA, Canada, Dubai, the UK and Pakistan and serve clients worldwide, so timezone is not a blocker.`,
  },
  {
    source: "process",
    text: `How PAR Technologys works: every engagement starts with a scoped audit so cost and scope are known before you commit. Delivery runs in weekly increments — you see working software every week rather than waiting on a long black-box build. An MVP typically ships in 4 to 8 weeks. After launch we stay on for support, and you own the source, the infrastructure and the model weights outright.`,
  },
];
