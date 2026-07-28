import type { Metadata } from 'next';
import ContactPage from './Client';

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us where your business hurts and we will show you where AI heals it. Book a discovery call with PAR Technologys.",
  alternates: { canonical: '/contact' },
  openGraph: {
    title: "Contact \u2014 PAR TECHNOLOGYS",
    description: "Tell us where your business hurts and we will show you where AI heals it. Book a discovery call with PAR Technologys.",
    url: '/contact',
    images: ['/og.png'],
  },
};

export default function Page() {
  return <ContactPage />;
}
