import type { MetadataRoute } from 'next';
import { SITE } from '@/content/seo';

// emit a static robots.txt at build time (required with output: 'export')
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
