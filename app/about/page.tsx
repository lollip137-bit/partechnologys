import type { Metadata } from 'next';
import AboutPage from './Client';

export const metadata: Metadata = {
  title: "About",
  description: "Who PAR Technologys is, how we work, and why every engagement starts with a costed audit instead of a pitch deck.",
  alternates: { canonical: '/about' },
  openGraph: {
    title: "About \u2014 PAR TECHNOLOGYS",
    description: "Who PAR Technologys is, how we work, and why every engagement starts with a costed audit instead of a pitch deck.",
    url: '/about',
    images: ['/og.png'],
  },
};

export default function Page() {
  return <AboutPage />;
}
