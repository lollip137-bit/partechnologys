import type { Metadata } from 'next';
import LibraryClient from './LibraryClient';

export const metadata: Metadata = {
  title: 'Work & Library',
  description:
    'Websites delivered, platforms in production and the full PAR Technologys design library — Men’s Hub, PAR Group Global, Copperline and more, with screenshots of the real builds.',
  alternates: { canonical: '/library' },
  openGraph: {
    title: 'Work & Library — PAR Technologys',
    description: 'Websites delivered, platforms in production and the full PAR Technologys design library.',
    url: '/library',
    images: ['/og.png'],
  },
};

export default function Page() {
  return <LibraryClient />;
}
