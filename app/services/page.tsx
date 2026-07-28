import type { Metadata } from 'next';
import ServicesPage from './Client';

export const metadata: Metadata = {
  title: "Services",
  description: "AI agents, machine learning, custom software, SaaS, cloud & DevOps, cyber security, data analytics and growth engineering \u2014 twelve disciplines delivered end to end by one team.",
  alternates: { canonical: '/services' },
  openGraph: {
    title: "Services \u2014 PAR TECHNOLOGYS",
    description: "AI agents, machine learning, custom software, SaaS, cloud & DevOps, cyber security, data analytics and growth engineering \u2014 twelve disciplines delivered end to end by one team.",
    url: '/services',
    images: ['/og.png'],
  },
};

export default function Page() {
  return <ServicesPage />;
}
