// The complete PAR Technologys service catalogue
export const SERVICE_TREE: { cat: string; blurb: string; items: string[] }[] = [
  { cat: 'AI Solutions', blurb: 'Agents, models and intelligence woven into your operations.', items: ['AI Chatbots', 'AI Voice Agents', 'AI Customer Support', 'AI Sales Automation', 'AI Business Assistants', 'AI Knowledge Base', 'Machine Learning', 'Predictive Analytics', 'Computer Vision', 'Speech AI', 'Generative AI Solutions', 'AI Consulting', 'AI Integration'] },
  { cat: 'Software Development', blurb: 'Production-grade systems, engineered to last.', items: ['Custom Software', 'Enterprise Software', 'SaaS Development', 'MVP Development', 'Product Development', 'Legacy Modernization', 'White Label Development', 'Dedicated Development Teams', 'Software Maintenance'] },
  { cat: 'Web Development', blurb: 'Websites and web apps that convert and scale.', items: ['Business Websites', 'Corporate Websites', 'E-Commerce Stores', 'Landing Pages', 'Web Applications', 'CMS Development', 'WordPress Development', 'Shopify Development', 'WooCommerce', 'Headless CMS', 'Website Maintenance'] },
  { cat: 'Mobile App Development', blurb: 'Native and cross-platform apps people keep.', items: ['Android Apps', 'iOS Apps', 'Cross Platform Apps', 'Flutter', 'React Native', 'Enterprise Mobile Apps', 'App Maintenance'] },
  { cat: 'Business Automation', blurb: 'Repetitive work, retired.', items: ['Workflow Automation', 'Business Process Automation', 'Invoice Automation', 'HR Automation', 'CRM Automation', 'Email Automation', 'Document Automation', 'Approval Workflows', 'Robotic Process Automation (RPA)'] },
  { cat: 'Enterprise Solutions', blurb: 'The systems your company runs on.', items: ['CRM Systems', 'ERP Systems', 'HR & Payroll', 'Inventory Management', 'POS Systems', 'Project Management', 'Document Management', 'Client Portals', 'LMS', 'Booking Systems', 'Billing Systems'] },
  { cat: 'Cloud & Infrastructure', blurb: 'Deploy anywhere. Scale everywhere.', items: ['Cloud Migration', 'AWS Solutions', 'Azure', 'Google Cloud', 'DevOps', 'CI/CD', 'Database Management', 'API Development', 'Third Party Integrations', 'Microsoft 365 Solutions'] },
  { cat: 'Data & Analytics', blurb: 'Noise in. Strategy out.', items: ['Business Intelligence', 'Data Analytics', 'Dashboards', 'Reporting Systems', 'Data Warehousing', 'ETL Solutions', 'Data Migration'] },
  { cat: 'Digital Marketing', blurb: 'Growth loops that compound.', items: ['SEO', 'Local SEO', 'Technical SEO', 'Ecommerce SEO', 'AI SEO Optimization', 'GEO (Generative Engine Optimization)', 'AEO (Answer Engine Optimization)', 'PPC Advertising', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'Conversion Optimization', 'Marketing Automation'] },
  { cat: 'Design Services', blurb: 'Interfaces people feel before they understand.', items: ['UI Design', 'UX Design', 'Product Design', 'Branding', 'Graphic Design', 'Motion Graphics', 'Design Systems'] },
  { cat: 'Consulting', blurb: 'Senior judgment, on demand.', items: ['IT Consulting', 'Technology Strategy', 'Digital Transformation', 'AI Strategy', 'Software Architecture', 'CTO as a Service', 'Technology Audit'] },
  { cat: 'Support', blurb: 'We stay after the launch.', items: ['Technical Support', 'Software Maintenance', 'Website Maintenance', 'Security Updates', 'Performance Optimization', 'Monitoring', 'Managed IT Services'] },
];

/** URL-safe id for a category — the anchor the nav deep-links to. */
export function svcSlug(cat: string) {
  return cat.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * The mega-menu columns, DERIVED from SERVICE_TREE.
 *
 * The nav used to carry its own hand-written list of 21 service names, and it
 * had already drifted from the catalogue — the menu offered "AI Agents" while
 * the page listed "AI Chatbots", so a visitor could never find what they
 * clicked. Deriving the menu from the catalogue makes that drift impossible,
 * and every entry now points at a real anchor on the services page.
 */
export const NAV_SERVICE_COLUMNS: { title: string; items: { label: string; href: string }[] }[] = (() => {
  const per = Math.ceil(SERVICE_TREE.length / 3);
  const titles = ['Intelligence & Automation', 'Build & Engineer', 'Grow & Operate'];
  return [0, 1, 2].map((c) => ({
    title: titles[c],
    items: SERVICE_TREE.slice(c * per, (c + 1) * per).map((s) => ({
      label: s.cat,
      href: `/services#${svcSlug(s.cat)}`,
    })),
  }));
})();

export const BUSINESS_NEEDS = [
  'Build an MVP', 'Automate Business', 'Increase Sales with AI', 'Modernize Legacy Systems',
  'Launch SaaS Product', 'Improve Customer Support', 'Digital Transformation',
];
