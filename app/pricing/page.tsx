import type { Metadata } from 'next';
import PricingPage from './Client';

export const metadata: Metadata = {
  title: "Pricing & Engagement Models",
  description: "Fixed-scope builds with fixed prices, a monthly engineering subscription you can pause, or a dedicated embedded team. Every engagement starts with a costed audit.",
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: "Pricing & Engagement Models \u2014 PAR TECHNOLOGYS",
    description: "Fixed-scope builds with fixed prices, a monthly engineering subscription you can pause, or a dedicated embedded team. Every engagement starts with a costed audit.",
    url: '/pricing',
    images: ['/og.png'],
  },
};

export default function Page() {
  return <PricingPage />;
}
