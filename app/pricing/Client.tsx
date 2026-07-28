'use client';

import Link from 'next/link';
import PageShell from '@/ui/PageShell';
import { PRICING } from '@/content/more';
import { FAQS } from '@/content/site';

export default function PricingPage() {
  return (
    <PageShell
      kicker="ENGAGEMENT MODELS"
      title="Know the cost before you commit."
      sub="Every engagement starts with a scoped audit, so you see exactly what we'd build, how long it takes and what it costs — before anything is signed."
    >
      <section className="sec sec-alt">
        <div className="wrap">
          <span className="orb orb-b" aria-hidden />
          <div className="price-grid">
            {PRICING.map((tier) => (
              <div key={tier.name} className={`price-card ${tier.featured ? 'featured' : ''}`} data-a>
                {tier.featured && <span className="price-flag">MOST CHOSEN</span>}
                <div className="price-name">{tier.name}</div>
                <div className="price-value">{tier.price}</div>
                <p className="price-line">{tier.line}</p>
                <ul className="price-items">
                  {tier.items.map((i) => (
                    <li key={i}><span className="act-cap-dot" />{i}</li>
                  ))}
                </ul>
                <Link href="/contact" className="price-cta">{tier.cta} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap wrap-narrow">
          <div className="sec-kicker" data-a>COMMON QUESTIONS</div>
          <h2 className="sec-title" data-a>Before you ask.</h2>
          <div className="faq-list">
            {FAQS.slice(3).map((f) => (
              <details key={f.q} className="faq-item" data-a>
                <summary>{f.q}<span className="faq-plus">+</span></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
