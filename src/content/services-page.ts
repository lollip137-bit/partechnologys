// ============================================================
// SERVICES PAGE COPY — everything the rebuilt /services page says.
//
// Two rules govern this file:
//  1. INVENT NOTHING. No client names, no metrics, no benchmarks,
//     no certifications. Outcome lines describe what a service DOES,
//     never numbers we cannot stand behind.
//  2. The catalogue in services.ts keeps the business's own service
//     names. This file layers the 2026 buyer's language ON TOP —
//     agentic AI, RAG, evals, guardrails, governance, MCP,
//     observability, cost control — without deleting their words.
// ============================================================

import { svcSlug } from './services';

/** Hero — outcome + who it's for, not a list of nouns. */
export const SVC_HERO = {
  title: 'Production AI. Software that carries the business.',
  sub: 'For companies that need working systems, not experiments — every service delivered end to end by one team: grounded in your data, observable in production, governed from day one.',
};

/** Problem framing, in the buyer's language. Rendered as manifesto lines. */
export const SVC_PROBLEM: { plain: string; em?: string }[] = [
  { plain: 'Most AI pilots die between the demo and production.' },
  { plain: 'The gap is never the model — it is ', em: 'grounding, guardrails, evals and cost control.' },
  { plain: 'That production layer is what we build.' },
];

// ------------------------------------------------------------
// THE ARCHITECTURE — an interactive walkthrough of a production
// agentic AI system. This section EXPLAINS instead of decorating:
// each node is a step a request actually takes through a system
// we would ship, in the order it takes it.
// ------------------------------------------------------------
export interface ArchNode {
  id: string;
  name: string;
  tag: string;
  desc: string;
  /** the concepts this node demonstrates, shown as chips */
  chips: string[];
}

export const ARCH_NODES: ArchNode[] = [
  {
    id: 'request', name: 'Request', tag: 'chat · voice · email · event',
    desc: 'A customer message, a phone call, an inbox, an API call or a row landing in a database. Production systems answer real channels — not a demo textbox.',
    chips: ['Omnichannel', 'Webhooks', 'Event-driven'],
  },
  {
    id: 'context', name: 'Context & RAG', tag: 'grounded in your data',
    desc: 'Before the model sees anything, the system retrieves the relevant slice of YOUR data — documents, records, policies — and assembles it into context. Answers cite sources instead of guessing.',
    chips: ['RAG', 'Vector search', 'Context engineering'],
  },
  {
    id: 'agent', name: 'Agent loop', tag: 'plan → act → check',
    desc: 'Not a chatbot. The agent plans the steps, executes them, checks its own output and retries what failed — looping until the task is done or a rule says stop.',
    chips: ['Agentic AI', 'Multi-step reasoning', 'Self-correction'],
  },
  {
    id: 'tools', name: 'Tools via MCP', tag: 'your systems, standard plugs',
    desc: 'The agent reaches your CRM, ERP, calendars and internal APIs through a standard connector layer (MCP) — not bespoke glue code per system. Swap the model, keep the tools.',
    chips: ['MCP', 'Integrations', 'No lock-in'],
  },
  {
    id: 'guardrails', name: 'Guardrails', tag: 'policy on every response',
    desc: 'Input and output pass through policy: scope limits, PII redaction, tone rules, refusal conditions. The system can only say and do what it is allowed to.',
    chips: ['Guardrails', 'PII redaction', 'Policy enforcement'],
  },
  {
    id: 'human', name: 'Human approval', tag: 'gates on the irreversible',
    desc: 'Anything irreversible — a payment, a contract, a deletion — waits for a person to approve it. Everything routine flows straight through. You choose where the gates go.',
    chips: ['Human-in-the-loop', 'Approval gates', 'Escalation'],
  },
  {
    id: 'response', name: 'Response / action', tag: 'done, with receipts',
    desc: 'The answer goes back to the user, or the action lands in your systems — booked, filed, updated — with a full record of what was done and why.',
    chips: ['Grounded output', 'Audit trail', 'Provenance'],
  },
];

/** The rail that spans the whole pipeline — every step reports into it. */
export const ARCH_RAIL: ArchNode = {
  id: 'observe', name: 'Observability · evals · cost', tag: 'the layer under everything',
  desc: 'Every step above is logged with provenance. Output quality is measured by evals — so a regression is caught by a test, not by your customers. Cost is tracked per request, so the bill is predictable and the model is swappable.',
  chips: ['Observability', 'Evals', 'Cost per request', 'Model portability'],
};

/** The modern capability cards — the 2026 framing, named explicitly. */
export const AI_CAPABILITIES: { name: string; line: string }[] = [
  { name: 'Agentic AI', line: 'Systems that plan, act and loop until the work is done — not chat windows that talk about it.' },
  { name: 'RAG & grounding', line: 'Answers drawn from your documents and data, with sources — not the internet’s guesses.' },
  { name: 'Evals & guardrails', line: 'Output quality measured on every change; policy enforced on every response.' },
  { name: 'AI governance', line: 'Approvals, logging, provenance. When someone asks “why did it do that?”, there is an answer.' },
  { name: 'MCP connectivity', line: 'Standard connectors to your tools and data — swap models without rebuilding integrations.' },
  { name: 'Cost & observability', line: 'Per-request cost tracking and full tracing. Predictable bills, portable models, no lock-in.' },
];

// ------------------------------------------------------------
// ENTRY PATHS BY ROLE — buyers self-select.
// ------------------------------------------------------------
export const ROLE_PATHS: { role: string; pain: string; links: { label: string; href: string }[] }[] = [
  {
    role: 'CTO / Engineering leader',
    pain: 'You need architecture that survives an audit — and a partner your own engineers respect.',
    links: [
      { label: 'How we build production AI', href: '#ai-architecture' },
      { label: 'Cloud & Infrastructure', href: `#${svcSlug('Cloud & Infrastructure')}` },
      { label: 'Consulting & architecture', href: `#${svcSlug('Consulting')}` },
    ],
  },
  {
    role: 'Product leader',
    pain: 'You need to ship a product, not coordinate five vendors who each own a fragment of it.',
    links: [
      { label: 'Software Development', href: `#${svcSlug('Software Development')}` },
      { label: 'Web & Mobile', href: `#${svcSlug('Web Development')}` },
      { label: 'Design Services', href: `#${svcSlug('Design Services')}` },
    ],
  },
  {
    role: 'Operations leader',
    pain: 'You need hours back and error rates down in the processes your team runs every day.',
    links: [
      { label: 'Business Automation', href: `#${svcSlug('Business Automation')}` },
      { label: 'Enterprise Solutions', href: `#${svcSlug('Enterprise Solutions')}` },
      { label: 'Data & Analytics', href: `#${svcSlug('Data & Analytics')}` },
    ],
  },
];

// ------------------------------------------------------------
// FLAGSHIPS — 3-4 services surfaced first in each category, with an
// outcome line each and one "recommended if" cue per category.
// Names MUST match items in SERVICE_TREE exactly — the page renders
// flagship cards + the remaining items as chips, so everything in the
// catalogue stays visible.
// ------------------------------------------------------------
export interface Flagship { name: string; line: string }
export interface ClusterMeta { fit: string; flagships: Flagship[] }

export const CLUSTERS: Record<string, ClusterMeta> = {
  'AI Solutions': {
    fit: 'Recommended if a process in your business still depends on people reading, routing, answering or re-typing.',
    flagships: [
      { name: 'AI Agents & Agentic Systems', line: 'Agents that plan, call your tools and finish the workflow — with approval gates on anything irreversible.' },
      { name: 'RAG & Knowledge Grounding', line: 'Assistants that answer from your documents and data, with sources — grounded, not guessing.' },
      { name: 'AI Voice Agents', line: 'Natural voice on your phone lines — answering, qualifying and booking around the clock.' },
      { name: 'LLM Evals & Guardrails', line: 'Output quality measured on every change; policy enforced on every response. AI you can put in front of customers.' },
    ],
  },
  'Software Development': {
    fit: 'Recommended if the software you need does not exist off the shelf — or the off-the-shelf version is what slows you down.',
    flagships: [
      { name: 'MVP Development', line: 'A working product in front of real users in weeks, not quarters.' },
      { name: 'SaaS Development', line: 'Multi-tenant platforms with billing, roles and scale designed in from the first commit.' },
      { name: 'Legacy Modernization', line: 'Incremental modernization that never stops the business for a rewrite.' },
    ],
  },
  'Web Development': {
    fit: 'Recommended if your website is a brochure and you need it to be a salesperson.',
    flagships: [
      { name: 'Web Applications', line: 'Product-grade applications in the browser — fast, secure, maintainable.' },
      { name: 'E-Commerce Stores', line: 'Storefronts engineered for conversion, speed and search.' },
      { name: 'Business Websites', line: 'A site that loads fast, ranks, and turns visits into enquiries.' },
    ],
  },
  'Mobile App Development': {
    fit: 'Recommended if your customers or field teams live on their phones.',
    flagships: [
      { name: 'Cross Platform Apps', line: 'One codebase, both stores — Flutter or React Native, chosen for the job.' },
      { name: 'Enterprise Mobile Apps', line: 'Field and workforce apps wired directly into your backend systems.' },
      { name: 'iOS Apps', line: 'Native where it counts — performance, camera, offline, platform features.' },
    ],
  },
  'Business Automation': {
    fit: 'Recommended if your team re-types the same data into two systems, or approvals live in email threads.',
    flagships: [
      { name: 'Workflow Automation', line: 'Hand-offs, reminders and data entry retired — hours returned every week.' },
      { name: 'Document Automation', line: 'Invoices, contracts and reports drafted, filed and reconciled automatically.' },
      { name: 'Approval Workflows', line: 'Every approval tracked, escalated and auditable — out of the inbox for good.' },
    ],
  },
  'Enterprise Solutions': {
    fit: 'Recommended if the company runs on spreadsheets and disconnected tools that do not talk to each other.',
    flagships: [
      { name: 'CRM Systems', line: 'Your pipeline, customers and follow-ups in one system your team actually uses.' },
      { name: 'ERP Systems', line: 'Operations, inventory and finance connected — one source of truth.' },
      { name: 'Client Portals', line: 'A branded home where your clients see status, documents and invoices — without emailing you.' },
    ],
  },
  'Industry Solutions': {
    fit: 'Recommended if generic software keeps fighting the way your sector actually works.',
    flagships: [
      { name: 'Healthcare', line: 'Triage agents, records automation and imaging support — built HIPAA-conscious.' },
      { name: 'Construction', line: 'Site intelligence, bid automation and project copilots for the field and the office.' },
      { name: 'Logistics', line: 'Route optimization, fleet telemetry and load forecasting that move with the day.' },
    ],
  },
  'Cloud & Infrastructure': {
    fit: 'Recommended if deploys are scary, bills are surprising, or one engineer holds all the keys.',
    flagships: [
      { name: 'Cloud Migration', line: 'From wherever you are to where you should be — without an outage on the way.' },
      { name: 'DevOps', line: 'CI/CD, infrastructure as code and observability. Ship on a Friday without flinching.' },
      { name: 'API Development', line: 'Clean, documented, versioned interfaces your partners can build on.' },
    ],
  },
  'Data & Analytics': {
    fit: 'Recommended if the same question gets a different number from every department.',
    flagships: [
      { name: 'Business Intelligence', line: 'One source of truth, live — decisions made on data instead of recollection.' },
      { name: 'Dashboards', line: 'The numbers that run the business, on one screen, current.' },
      { name: 'Data Warehousing', line: 'Every system feeding one queryable store — the foundation AI is built on.' },
    ],
  },
  'Digital Marketing': {
    fit: 'Recommended if buyers cannot find you in the places they now search — including AI answers.',
    flagships: [
      { name: 'SEO', line: 'Rank for the searches your buyers actually make — technically and editorially.' },
      { name: 'GEO (Generative Engine Optimization)', line: 'Be the answer when the searching is done by AI, not by scrolling.' },
      { name: 'Conversion Optimization', line: 'More of the traffic you already have turning into pipeline.' },
    ],
  },
  'Design Services': {
    fit: 'Recommended if users need training to use your product — or your brand undersells your work.',
    flagships: [
      { name: 'Product Design', line: 'From problem to shipped interface — designed with engineering in the room.' },
      { name: 'UX Design', line: 'Flows people complete without thinking about the software.' },
      { name: 'Design Systems', line: 'One visual language every screen obeys — consistency that scales with the team.' },
    ],
  },
  'Consulting': {
    fit: 'Recommended if you need senior judgment before you need headcount.',
    flagships: [
      { name: 'AI Strategy', line: 'Where AI pays back first in YOUR operation — and what to ignore.' },
      { name: 'Software Architecture', line: 'Systems designed to survive scale, audits and staff turnover.' },
      { name: 'CTO as a Service', line: 'Senior technical leadership, fractional — decisions made like an owner.' },
    ],
  },
  'Support': {
    fit: 'Recommended if launch day was the last time anyone looked at the system.',
    flagships: [
      { name: 'Monitoring', line: 'We see the problem before your users do — alerts, tracing, uptime.' },
      { name: 'Performance Optimization', line: 'The same system, measurably faster — found by profiling, not guessing.' },
      { name: 'Managed IT Services', line: 'The whole stack watched, patched and improved — a team, not a ticket queue.' },
    ],
  },
};

// ------------------------------------------------------------
// DELIVERY — the scroll-driven pipeline. Deliverables and
// boundaries per phase. Every claim here restates what the site
// already publishes (costed audit, weekly ships, full handover).
// ------------------------------------------------------------
export const DELIVERY: { step: string; name: string; line: string; gives: string[]; boundary: string }[] = [
  {
    step: '01', name: 'Discover', line: 'We map your operations and find the exact place where a system changes the numbers.',
    gives: ['A map of your current systems and processes', 'The highest-ROI targets, ranked', 'A costed, scoped build plan'],
    boundary: 'No commitment yet — the plan is yours to keep, whoever builds it.',
  },
  {
    step: '02', name: 'Design', line: 'Architecture, prototypes and a week-by-week roadmap — you see the system before we build it.',
    gives: ['Architecture you can show your own engineers', 'A clickable prototype', 'For AI scope: the eval plan — how quality will be measured'],
    boundary: 'Nothing is built until you have seen and approved what will be.',
  },
  {
    step: '03', name: 'Build', line: 'Weekly ships, visible progress, production-grade engineering from day one.',
    gives: ['Working software every week on a staging link', 'Tests and CI on every change', 'For AI scope: evals running on every change'],
    boundary: 'No six-month black boxes — if a week produced nothing you can click, we owe you an explanation.',
  },
  {
    step: '04', name: 'Scale', line: 'Monitoring, iteration and growth loops that keep compounding after launch.',
    gives: ['Monitoring and alerting in place', 'Cost tracking per system — AI spend included', 'An iteration loop with a named engineer'],
    boundary: 'You own everything: code, infrastructure, models, weights — documented and handed over.',
  },
];

/** Honest availability line for the proof section — no invented references. */
export const PROOF_NOTE =
  'Client names, references and detailed case studies are shared in scoping calls — under NDA where the work requires it. What is published here describes the kinds of systems we ship, not claims we cannot show you.';
