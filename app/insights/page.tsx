import type { Metadata } from 'next';
import InsightsPage from './Client';

export const metadata: Metadata = {
  title: "Insights",
  description: "Field notes on AI strategy, engineering discipline and generative engine optimization from the team that ships the systems.",
  alternates: { canonical: '/insights' },
  openGraph: {
    title: "Insights \u2014 PAR TECHNOLOGYS",
    description: "Field notes on AI strategy, engineering discipline and generative engine optimization from the team that ships the systems.",
    url: '/insights',
    images: ['/og.png'],
  },
};

export default function Page() {
  return <InsightsPage />;
}
