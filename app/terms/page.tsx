import type { Metadata } from 'next';
import { TERMS } from '@/content/legal';
import LegalDoc from '@/ui/LegalDoc';

const DESC = 'The terms covering use of this website. Paid work is governed by the separate signed agreement, which takes precedence.';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: DESC,
  alternates: { canonical: '/terms' },
  openGraph: { title: 'Terms & Conditions — PAR TECHNOLOGYS', description: DESC, url: '/terms', images: ['/og.png'] },
};

export default function Page() {
  return (
    <LegalDoc
      kicker="TERMS & CONDITIONS"
      title="The rules of the road."
      sub="These cover this website. Anything we build for you is governed by the agreement we sign — that document always wins over this one."
      blocks={TERMS}
    />
  );
}
