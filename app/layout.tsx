import type { Metadata, Viewport } from 'next';
import { Sora, Inter } from 'next/font/google';
import './globals.css';
import './site.css';
import './phase4.css';
import './phase6.css';
import './phase7.css';
import './library.css';
import './inner.css';
import './services.css';
import './web-intelligence.css';
import { SITE } from '@/content/seo';
import { MascotMount } from '@/mascot/MascotMount';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['300', '400', '600', '700', '800'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    // every inner page supplies its own title; this frames it
    template: `%s — ${SITE.name}`,
  },
  description:
    'Witness intelligence being born — from a single particle in the void to a global technology ecosystem. AI agents, custom software, cloud, data and cyber security by PAR Technologys.',
  applicationName: SITE.name,
  keywords: [
    'AI agency', 'AI agents', 'machine learning', 'custom software development',
    'SaaS development', 'cloud and DevOps', 'cyber security', 'data analytics',
    'business automation', 'PAR Technologys',
  ],
  authors: [{ name: SITE.legalName, url: SITE.url }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description:
      'An AI and software company. We turn ideas into intelligent digital products that run real businesses.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description:
      'An AI and software company. We turn ideas into intelligent digital products that run real businesses.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  icons: {
    // Theme-aware favicon: dark chat bubble on light tabs, white bubble on dark
    // tabs. Browsers pick the icon whose media query matches the tab's scheme.
    icon: [
      { url: '/icon-light.png', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.png', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: [{ url: '/brand/par-icon.png' }],
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: '#000104',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

/** Structured data — how AI answers and search engines read the company. */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE.url}/#organization`,
      name: SITE.legalName,
      alternateName: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/brand/par-icon.png`,
      description: SITE.description,
      slogan: SITE.tagline,
      knowsAbout: [
        'Artificial Intelligence', 'AI Agents', 'Machine Learning', 'Computer Vision',
        'Custom Software Development', 'SaaS', 'Cloud Infrastructure', 'DevOps',
        'Cyber Security', 'Data Analytics', 'Business Automation',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      publisher: { '@id': `${SITE.url}/#organization` },
      inLanguage: 'en',
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE.url}/#service`,
      name: SITE.legalName,
      url: SITE.url,
      parentOrganization: { '@id': `${SITE.url}/#organization` },
      areaServed: 'Worldwide',
      serviceType: [
        'AI Agents & Automation', 'Machine Learning', 'Custom Software',
        'Cloud & DevOps', 'Cyber Security', 'Growth Engineering',
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        {children}
        {/* Drax — the floating AI companion. Mounted once, persists across routes. */}
        <MascotMount />
        <script
          type="application/ld+json"
          // schema.org graph — static, authored here, never user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </body>
    </html>
  );
}
