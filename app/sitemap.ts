import type { MetadataRoute } from 'next';
import { SITE, ROUTES } from '@/content/seo';

// emit a static sitemap.xml at build time (required with output: 'export')
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE.url}${r.path === '/' ? '' : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
