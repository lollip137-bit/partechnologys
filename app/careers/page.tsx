import type { Metadata } from 'next';
import CareersPage from './Client';

export const metadata: Metadata = {
  title: "Careers",
  description: "Build production AI and software with a senior team that ships weekly. Open roles and how we hire at PAR Technologys.",
  alternates: { canonical: '/careers' },
  openGraph: {
    title: "Careers \u2014 PAR TECHNOLOGYS",
    description: "Build production AI and software with a senior team that ships weekly. Open roles and how we hire at PAR Technologys.",
    url: '/careers',
    images: ['/og.png'],
  },
};

export default function Page() {
  return <CareersPage />;
}
