import type { Metadata } from 'next';
import IndustriesPage from './Client';

export const metadata: Metadata = {
  title: "Industries",
  description: "Construction, healthcare, real estate, retail, manufacturing, finance, education, logistics and hospitality \u2014 where PAR Technologys puts AI to work, and what it changes.",
  alternates: { canonical: '/industries' },
  openGraph: {
    title: "Industries \u2014 PAR TECHNOLOGYS",
    description: "Construction, healthcare, real estate, retail, manufacturing, finance, education, logistics and hospitality \u2014 where PAR Technologys puts AI to work, and what it changes.",
    url: '/industries',
    images: ['/og.png'],
  },
};

export default function Page() {
  return <IndustriesPage />;
}
