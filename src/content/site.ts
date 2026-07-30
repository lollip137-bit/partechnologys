// Site content — structured like the best AI/software agency sites
// (hero film → proof → services → process → work → stack → voices → FAQ → CTA)

// The real, live accounts — one source of truth for every footer on the site.
// Rule: only add an entry once its URL is confirmed to resolve. An icon that
// links nowhere (this wheel used to be five icons all pointing at "#") reads as
// a broken site, so a shorter honest list beats a longer decorative one.
export const SOCIALS: { slug: string; label: string; href: string }[] = [
  { slug: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/par-technologys/' },
  // profile URL kept clean: the ?igsh= token on a shared Instagram link is just
  // app-share tracking and is not needed to reach the account
  { slug: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/_partechnologys' },
  { slug: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1ZTiXM6yUW/' },
];

export const STATS = [
  { value: '120+', label: 'Projects shipped' },
  { value: '40+', label: 'AI systems in production' },
  { value: '99.9%', label: 'Uptime across client platforms' },
  { value: '12×', label: 'Average automation ROI' },
];

export const SERVICES = [
  { title: 'AI Agents & Automation', line: 'Conversational and autonomous agents that run real workflows — sales, support, operations.', icon: 'agent' },
  { title: 'Machine Learning', line: 'Custom models, computer vision and forecasting trained on the language of your domain.', icon: 'ml' },
  { title: 'Custom Software', line: 'Web, mobile, SaaS and enterprise systems — engineered strand by strand, built to last.', icon: 'code' },
  { title: 'Cloud & DevOps', line: 'Elastic infrastructure, CI/CD and observability. Deploy anywhere, scale everywhere.', icon: 'cloud' },
  { title: 'Cyber Security', line: 'Threat detection, hardening and compliance that never sleeps, never blinks.', icon: 'shield' },
  { title: 'Growth Engineering', line: 'SEO, GEO, AEO and analytics loops that compound — traffic into pipeline into revenue.', icon: 'growth' },
];

/** About page — the principles. Previously hardcoded in app/about/Client.tsx. */
export const VALUES = [
  { name: 'Ship weekly', line: 'Working software every week. No six-month black boxes, ever.' },
  { name: 'Own the outcome', line: 'We measure ourselves on your numbers — not our hours.' },
  { name: 'Stay after launch', line: 'Systems are living things. We monitor, iterate and grow them.' },
  { name: 'You own everything', line: 'Code, infrastructure, models, weights. Handed over, documented.' },
];

/**
 * Contact page — what happens after you press send. Every line restates a
 * claim already published on this site (24h response, free scoping call,
 * NDA-first, costed audit before commitment) — nothing new is promised here.
 */
export const CONTACT_NEXT = [
  { name: 'An engineer reads it', line: 'Every message is answered by an engineer, not a sales script — within one business day.' },
  { name: 'A free scoping call', line: 'We map the problem together. No obligation — and an NDA before you share anything sensitive.' },
  { name: 'A costed audit', line: 'You see exactly what we’d build, how long it takes and what it costs — before you commit.' },
];

export const PROCESS = [
  { step: '01', title: 'Discover', line: 'We map your operations and find the exact place where AI changes everything.' },
  { step: '02', title: 'Design', line: 'Architecture, prototypes and a roadmap — you see the system before we build it.' },
  { step: '03', title: 'Build', line: 'Weekly ships, visible progress, production-grade engineering from day one.' },
  { step: '04', title: 'Scale', line: 'Monitoring, iteration and growth loops that keep compounding after launch.' },
];

export interface Project {
  id: string;
  title: string;
  tag: string;
  /** the KIND of system — never a client domain, real or invented */
  kind: string;
  line: string;
  grad: [string, string];
  /** what the system does. Not outcome numbers we cannot stand behind. */
  points: string[];
}

export const PROJECTS: Project[] = [
  {
    id: 'aichat', title: 'Conversational AI for Healthcare', tag: 'AI Agents', kind: 'Conversational AI',
    line: 'A HIPAA-conscious triage assistant that books, answers and escalates — 24/7.',
    grad: ['#111E40', '#2563EB'],
    points: ['Triage and routing', '24/7 booking and answers', 'Escalation to a human on demand'],
  },
  {
    id: 'logistics', title: 'Predictive Logistics Platform', tag: 'Machine Learning', kind: 'Forecasting & routing',
    line: 'Demand forecasting and live routing for a nationwide delivery fleet.',
    grad: ['#0A0F1D', '#00C2FF'],
    points: ['Demand forecasting', 'Live route optimization', 'Fleet telemetry mesh'],
  },
  {
    id: 'commerce', title: 'E-Commerce Growth Engine', tag: 'Growth · SEO', kind: 'Search & personalization',
    line: 'Search, personalization and content automation for a retail marketplace.',
    grad: ['#2563EB', '#0A0F1D'],
    points: ['Personalized merchandising', 'Content automation', 'AEO-ready content graph'],
  },
  {
    id: 'fintech', title: 'FinTech Risk Analytics', tag: 'Data & BI', kind: 'Risk & analytics',
    line: 'Real-time risk scoring and dashboards for a lending platform.',
    grad: ['#111E40', '#00C2FF'],
    points: ['Real-time scoring', 'Explainable models', 'Audit-ready pipeline'],
  },
  {
    id: 'factory', title: 'Smart Manufacturing Vision', tag: 'Computer Vision', kind: 'Computer vision',
    line: 'Defect detection on the line — cameras that never blink.',
    grad: ['#0A0F1D', '#2563EB'],
    points: ['Defect detection on the line', 'Edge inference', 'Multi-line rollout'],
  },
  {
    id: 'realestate', title: 'Real-Estate Intelligence Suite', tag: 'SaaS', kind: 'Multi-tenant SaaS',
    line: 'Valuation models and portfolio dashboards for property teams.',
    grad: ['#2563EB', '#111E40'],
    points: ['Valuation models', 'Portfolio dashboards', 'Map-native UI'],
  },
  {
    id: 'voice', title: 'Voice Agent for Bookings', tag: 'Voice AI', kind: 'Voice AI',
    line: 'A natural voice agent that answers, qualifies and schedules calls.',
    grad: ['#00C2FF', '#0A0F1D'],
    points: ['Natural turn-taking', 'Qualifies and schedules', 'Multilingual'],
  },
  {
    id: 'edu', title: 'Adaptive Learning Platform', tag: 'EdTech', kind: 'Adaptive learning',
    line: 'Personalized curricula that adapt to every learner in real time.',
    grad: ['#111E40', '#E5E7EB'],
    points: ['Knowledge-graph engine', 'Per-learner pathways', 'Teacher copilot'],
  },
  {
    id: 'hospitality', title: 'Hospitality Revenue OS', tag: 'Automation', kind: 'Revenue automation',
    line: 'Dynamic pricing and guest messaging for a hotel group.',
    grad: ['#0A0F1D', '#00C2FF'],
    points: ['Dynamic pricing', 'Unified guest inbox', 'Channel sync'],
  },
];

export const ENGAGEMENT = [
  { name: 'Fixed Scope', line: 'One goal, one price, one deadline. Perfect for MVPs and defined builds.', tag: 'PROJECT' },
  { name: 'Engineering Subscription', line: 'A senior team on a monthly plan you can pause anytime. Perfect for products that keep evolving.', tag: 'MONTHLY' },
  { name: 'Dedicated Team', line: 'Hand-picked engineers embedded in your org, managed by us. Perfect for scale.', tag: 'EMBEDDED' },
];

export const INSIGHTS = [
  { tag: 'AI STRATEGY', title: 'Where AI actually pays back first', line: 'The three processes in every business where automation ROI shows up in a single quarter.', min: 6 },
  { tag: 'ENGINEERING', title: 'Why we ship weekly (and you should demand it)', line: 'Six-month black boxes kill software projects. Weekly increments keep everyone honest.', min: 4 },
  { tag: 'GROWTH', title: 'GEO: being the answer when AI does the searching', line: 'Generative Engine Optimization is the new SEO — how to rank inside AI answers.', min: 7 },
];

// Photography is Unsplash (free licence), colour-graded in CSS to the brand
// so a sector photo never breaks the one-blue rule of the experience.
export const INDUSTRY_CARDS: { name: string; line: string; img: string }[] = [
  { name: 'Construction', line: 'Site intelligence, bid automation, project copilots.', img: '/img/construction.jpg' },
  { name: 'Healthcare', line: 'Triage agents, records automation, imaging AI.', img: '/img/healthcare.jpg' },
  { name: 'Real Estate', line: 'Valuation models, lead engines, portfolio dashboards.', img: '/img/realestate.jpg' },
  { name: 'Retail', line: 'Personalization, demand forecasting, smart inventory.', img: '/img/retail.jpg' },
  { name: 'Manufacturing', line: 'Vision QA, predictive maintenance, digital twins.', img: '/img/manufacturing.jpg' },
  { name: 'Finance', line: 'Risk scoring, fraud detection, reporting automation.', img: '/img/finance.jpg' },
  { name: 'Education', line: 'Adaptive learning, tutoring agents, admin automation.', img: '/img/education.jpg' },
  { name: 'Logistics', line: 'Route optimization, fleet telemetry, load forecasting.', img: '/img/logistics.jpg' },
  { name: 'Hospitality', line: 'Dynamic pricing, guest messaging, revenue OS.', img: '/img/hospitality.jpg' },
];

export const FAQS = [
  { q: 'What does PAR Technologys actually build?', a: 'AI agents and automation, custom software (web, mobile, SaaS, enterprise), machine-learning systems, cloud infrastructure, cyber security and growth engineering. One team, end to end — from the first audit to running production.' },
  { q: 'How long does a typical project take?', a: 'An MVP usually ships in 4–8 weeks. Larger platforms run in weekly increments so you see working software every single week — no six-month black boxes.' },
  { q: 'Do you work with existing systems or only greenfield?', a: 'Mostly existing systems. We integrate with your current stack — ERPs, CRMs, databases, legacy APIs — and modernize incrementally instead of forcing a rewrite.' },
  { q: 'How do you price engagements?', a: 'Fixed-scope builds have fixed prices. Ongoing product work runs as a monthly engineering subscription you can pause anytime. Every engagement starts with a scoped audit, so you know cost before you commit.' },
  { q: 'Who owns the code and the models?', a: 'You do. Full source, infrastructure and model weights are handed over — with documentation and training for your team.' },
  { q: 'Can AI really help a non-tech business?', a: 'That’s where it helps most. The highest-ROI automations we ship are in logistics, construction, healthcare, real estate and hospitality — businesses full of repetitive decisions and paperwork.' },
];
