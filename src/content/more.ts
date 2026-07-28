// Careers, pricing, resources — the sections a premium IT company site carries.

export const ROLES = [
  { title: 'Senior AI Engineer', team: 'Artificial Intelligence', type: 'Full-time · Hybrid', line: 'Own agent architectures and production ML for enterprise clients.' },
  { title: 'Full-Stack Engineer', team: 'Software Engineering', type: 'Full-time · Remote', line: 'Ship SaaS platforms end to end — Next.js, Node, Postgres, cloud.' },
  { title: 'DevOps / Platform Engineer', team: 'Cloud & Infrastructure', type: 'Full-time · Hybrid', line: 'Kubernetes, CI/CD and observability across every client platform.' },
  { title: 'Product Designer', team: 'Design', type: 'Full-time · Remote', line: 'Interfaces people feel before they understand. Systems, not screens.' },
  { title: 'Growth Engineer', team: 'Growth & Transformation', type: 'Full-time · Remote', line: 'SEO, GEO and AEO loops that compound into pipeline.' },
  { title: 'Business Analyst', team: 'Strategy', type: 'Full-time · Hybrid', line: 'Turn messy operations into the roadmap that gets automated.' },
];

export const PERKS = [
  { name: 'Senior by default', line: 'Small teams of experienced engineers. No juniors learning on client budgets.' },
  { name: 'Ship weekly', line: 'Your work reaches production every week — not once a quarter.' },
  { name: 'Learning budget', line: 'Conferences, certifications and hardware, covered.' },
  { name: 'Remote-friendly', line: 'Work where you think best. We measure output, not hours at a desk.' },
];

export const PRICING = [
  {
    name: 'Discovery Sprint',
    price: 'Fixed fee',
    line: 'A scoped audit of your operations and a costed roadmap. The way every engagement starts.',
    items: ['Operations & tech audit', 'AI opportunity map', 'Architecture proposal', 'Costed delivery plan'],
    cta: 'Book a discovery call',
    featured: false,
  },
  {
    name: 'Fixed-Scope Build',
    price: 'Per project',
    line: 'One goal, one price, one deadline. Best for MVPs and clearly defined platforms.',
    items: ['Fixed price & timeline', 'Weekly production releases', 'Full source handover', '30 days post-launch support'],
    cta: 'Scope my project',
    featured: true,
  },
  {
    name: 'Engineering Subscription',
    price: 'Monthly',
    line: 'A senior team on a rolling plan you can pause anytime. Best for products that keep evolving.',
    items: ['Dedicated senior team', 'Pause or cancel anytime', 'Continuous delivery', 'Monitoring & iteration'],
    cta: 'Talk about a team',
    featured: false,
  },
];

export const RESOURCES = [
  { tag: 'GUIDE', title: 'The AI Readiness Checklist', line: 'The 12 questions to answer before you spend a rupee on AI.', kind: 'PDF · 14 pages' },
  { tag: 'TEMPLATE', title: 'Automation ROI Calculator', line: 'Model the payback of automating any repetitive process.', kind: 'Spreadsheet' },
  { tag: 'GUIDE', title: 'Choosing a Software Partner', line: 'How to evaluate an engineering vendor without a technical team.', kind: 'PDF · 9 pages' },
  { tag: 'PLAYBOOK', title: 'GEO & AEO Playbook', line: 'Ranking inside AI answers, not just search results.', kind: 'PDF · 18 pages' },
  { tag: 'CHECKLIST', title: 'Pre-Launch Security Review', line: 'What we check before any platform we build goes live.', kind: 'Checklist' },
  { tag: 'TEMPLATE', title: 'Product Requirements Starter', line: 'The PRD format our teams actually build from.', kind: 'Document' },
];
