import type { Metadata } from 'next';
import { FAQS } from '@/content/site';
import { SITE } from '@/content/seo';
import FaqPage from './Client';

const DESC =
  'Straight answers on what PAR Technologys builds, how long projects take, how we price, and who owns the code and models.';

export const metadata: Metadata = {
  title: 'FAQ',
  description: DESC,
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ — PAR TECHNOLOGYS',
    description: DESC,
    url: '/faq',
    images: ['/og.png'],
  },
};

export default function Page() {
  // FAQPage structured data — this is the whole reason a dedicated page beats a
  // strip on the homepage: it makes the answers eligible for rich results and
  // citable by generative answer engines. Built from the same FAQS source, so
  // the markup can never drift from what the page renders.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqPage />
    </>
  );
}
