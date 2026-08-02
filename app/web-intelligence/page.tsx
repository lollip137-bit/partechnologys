import type { Metadata } from 'next';
import WebIntelligencePage from './Client';

export const metadata: Metadata = {
  title: 'PAR Web Intelligence — Free Website Audit',
  description:
    'A free live audit of any website. PAR Web Intelligence reads your real pages and reports on SEO, performance, accessibility, content, security, AI readiness and technical health — with evidence, on screen and as a PDF.',
  alternates: { canonical: '/web-intelligence' },
  openGraph: {
    title: 'PAR Web Intelligence — Free Website Audit',
    description:
      'A free live audit of any website. Seven areas measured on your real pages — SEO, performance, accessibility, content, security, AI readiness and technical health.',
    url: '/web-intelligence',
    images: ['/og.png'],
  },
};

export default function Page() {
  return <WebIntelligencePage />;
}
