/** One source of truth for anything a crawler, a bot or a share card reads. */

/**
 * The canonical origin.
 *
 * This is the REAL domain, not whatever host happens to be serving the build.
 * Canonicals, the sitemap, Open Graph and the JSON-LD graph all point at
 * partechnologys.com from the moment it is deployed, so putting it on the
 * domain needs no configuration at all — preview deployments simply declare
 * the production domain as their canonical, which is what you want anyway.
 *
 * NEXT_PUBLIC_SITE_URL overrides it, for a staging host that must self-declare.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  return 'https://partechnologys.com';
}

export const SITE = {
  name: 'PAR TECHNOLOGYS',
  legalName: 'PAR Technologys',
  tagline: 'We Build Intelligence.',
  url: resolveSiteUrl(),
  /**
   * The published addresses, given by the business on 2026-07-30.
   * `email` is the primary one everything defaults to (contact form target,
   * structured data, footer); `emailOffice` is the office/admin line.
   * Both were supplied as info@ / office@ and replace the previous
   * commission@ address.
   */
  email: 'info@partechnologys.com',
  emailOffice: 'office@partechnologys.com',
  /**
   * Where the work happens. Given as: USA, Canada, Dubai, UK and Pakistan,
   * serving worldwide. These are OPERATING markets — not a registered address,
   * which is still outstanding for the legal pages.
   */
  regions: ['USA', 'Canada', 'Dubai', 'UK', 'Pakistan'] as readonly string[],
  description:
    'PAR Technologys is an AI and software company. We build AI agents, custom software, cloud platforms, data systems and cyber security for businesses that want to run on intelligence.',
  locale: 'en_US',
  twitter: '@partechnologys',
} as const;

/** Every crawlable route, with its sitemap weight. */
export const ROUTES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/industries', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/library', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/library/mockups', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/insights', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/careers', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
];
