import type { Metadata } from 'next';
import { PRIVACY } from '@/content/legal';
import LegalDoc from '@/ui/LegalDoc';

const DESC = 'What happens to information when you use this site: no server, no accounts, and no cookies at all until you accept them.';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: DESC,
  alternates: { canonical: '/privacy' },
  openGraph: { title: 'Privacy Policy — PAR TECHNOLOGYS', description: DESC, url: '/privacy', images: ['/og.png'] },
};

export default function Page() {
  return (
    <LegalDoc
      kicker="PRIVACY"
      title="What we do with your data."
      sub="A short answer: almost nothing. This site is a set of static files with no server and no database, and it sets no cookies until you say yes."
      blocks={PRIVACY}
    />
  );
}
