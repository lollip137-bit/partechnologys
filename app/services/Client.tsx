'use client';

import PageShell from '@/ui/PageShell';
import Flow, { ArtCard } from '@/ui/Flow';
import { SERVICE_TREE } from '@/content/services';

export default function ServicesPage() {
  return (
    <PageShell
      kicker="SERVICES"
      title="Everything we build. Everything we run."
      sub="Twelve disciplines, one team. Every service below is delivered end-to-end — from the first audit to production and beyond."
    >
      <section className="sec">
        <div className="wrap">
          <span className="orb orb-a" aria-hidden />
          <div className="art-grid-3">
            <ArtCard label="Intelligence" sub="Agents, models, computer vision" />
            <ArtCard label="Engineering" sub="Web, mobile, SaaS, enterprise" />
            <ArtCard label="Growth" sub="SEO · GEO · AEO, analytics, automation" />
          </div>
        </div>
      </section>

      <section className="sec sec-alt">
        <div className="wrap">
          <div className="sec-kicker" data-a>THE DELIVERY RAIL</div>
          <h2 className="sec-title" data-a>Every service ships the same way.</h2>
          <Flow />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="svc-tree">
            {SERVICE_TREE.map((cat) => (
              <details key={cat.cat} className="svc-branch" data-a>
                <summary>
                  <span className="svc-branch-name">{cat.cat}</span>
                  <span className="svc-branch-blurb">{cat.blurb}</span>
                  <span className="faq-plus">+</span>
                </summary>
                <div className="svc-leafs">
                  {cat.items.map((item) => (
                    <span key={item} className="svc-leaf">{item}</span>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
