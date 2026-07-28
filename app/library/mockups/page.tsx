import type { Metadata } from 'next';
import MockupsClient from './MockupsClient';

export const metadata: Metadata = {
  title: 'Mockup & Demo Library',
  description:
    'Websites delivered and every design mockup we saved building them — Spiral Particle Concept, Birth of Intelligence, The Living Nebula, the Ten-Act Journey, Men’s Hub, PAR Group Global and Copperline.',
  alternates: { canonical: '/library/mockups' },
  openGraph: {
    title: 'Mockup & Demo Library — PAR Technologys',
    description: 'Websites delivered and every design mockup we saved building them.',
    url: '/library/mockups',
    images: ['/og.png'],
  },
};

export default function Page() {
  return <MockupsClient />;
}
