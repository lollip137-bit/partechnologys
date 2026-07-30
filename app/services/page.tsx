import type { Metadata } from 'next';
import ServicesPage from './Client';

export const metadata: Metadata = {
  title: "Services",
  description: "Production AI systems \u2014 agentic AI, RAG, evals, guardrails, governance, MCP \u2014 plus custom software, cloud, data, automation and growth. Thirteen disciplines, delivered end to end by one team.",
  alternates: { canonical: '/services' },
  openGraph: {
    title: "Services \u2014 PAR TECHNOLOGYS",
    description: "Production AI systems \u2014 agentic AI, RAG, evals, guardrails, governance, MCP \u2014 plus custom software, cloud, data, automation and growth. Thirteen disciplines, delivered end to end by one team.",
    url: '/services',
    images: ['/og.png'],
  },
};

export default function Page() {
  return <ServicesPage />;
}
