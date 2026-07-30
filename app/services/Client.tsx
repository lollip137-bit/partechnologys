'use client';

import { useEffect, useState } from 'react';
import PageShell from '@/ui/PageShell';
import Flow, { ArtCard } from '@/ui/Flow';
import { SERVICE_TREE, svcSlug } from '@/content/services';

export default function ServicesPage() {
  // Which category the visitor actually asked for. Arriving from the mega menu
  // used to drop you here with every accordion shut and no clue which one you
  // clicked — the page looked identical no matter what you chose. Now the
  // requested branch opens, scrolls into view and is briefly highlighted.
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const apply = () => {
      const slug = decodeURIComponent(window.location.hash.replace('#', ''));
      if (!slug) return;
      if (!SERVICE_TREE.some((s) => svcSlug(s.cat) === slug)) return;
      setActive(slug);
      // wait a frame so the branch is open (and therefore its real height)
      // before scrolling, otherwise we land short of it
      requestAnimationFrame(() => {
        // The branch is revealed declaratively via `active` (see className
        // below) rather than left to the scroll observer, which misses it: it is
        // off-screen at the instant the observer is created and arrives
        // mid-smooth-scroll. A missed reveal here means the visitor lands on a
        // blank gap where the service they clicked should be.
        document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    };
    apply();
    // the mega menu links to a hash on a page you may already be on
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

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
            {SERVICE_TREE.map((cat) => {
              const slug = svcSlug(cat.cat);
              const isActive = active === slug;
              return (
                <details
                  key={cat.cat}
                  id={slug}
                  // `in` is asserted DECLARATIVELY here, not added imperatively.
                  // React owns this className, so any class poked in from the
                  // outside is wiped on the next render — which is precisely how
                  // the deep-linked branch ended up permanently at opacity 0
                  // while its `svc-target` highlight survived.
                  className={`svc-branch ${isActive ? 'svc-target in' : ''}`}
                  data-a
                  open={isActive}
                >
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
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
