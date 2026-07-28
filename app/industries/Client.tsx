'use client';

import PageShell from '@/ui/PageShell';
import { INDUSTRY_CARDS } from '@/content/site';
import { BUSINESS_NEEDS } from '@/content/services';
import Link from 'next/link';
import Image from 'next/image';

export default function IndustriesPage() {
  return (
    <PageShell
      kicker="INDUSTRIES"
      title="Intelligence for every arena."
      sub="We speak the language of your sector — and the highest-ROI automations live in the industries everyone else calls 'non-technical'."
    >
      <section className="sec sec-alt">
        <div className="wrap">
          <div className="ind-grid page-grid">
            {INDUSTRY_CARDS.map((industry, i) => (
              <div key={industry.name} className="ind-card has-photo" data-a>
                <span className="ind-photo">
                  <Image src={industry.img} alt="" fill sizes="(max-width: 700px) 92vw, 360px" />
                </span>
                <span className="ind-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="ind-name">{industry.name}</span>
                <span className="ind-line">{industry.line}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <div className="sec-kicker" data-a>BY BUSINESS NEED</div>
          <h2 className="sec-title" data-a>Or start from the problem.</h2>
          <div className="need-row">
            {BUSINESS_NEEDS.map((need) => (
              <Link key={need} href="/contact" className="act-chip need-chip" data-a>{need}</Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
