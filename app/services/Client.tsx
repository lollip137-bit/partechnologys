'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PageShell from '@/ui/PageShell';
import Flow, { ArtCard } from '@/ui/Flow';
import { SERVICE_TREE, svcSlug } from '@/content/services';
import TechStack from '@/ui/TechStack';

/**
 * The full catalogue, VISIBLE.
 *
 * This page used to render the thirteen categories as `<details>` elements that
 * were all CLOSED. Every one of ~130 services was therefore hidden behind a
 * click, and arriving from the mega menu you saw a stack of shut boxes — "where
 * are the services?" was the entirely fair reaction. Nothing a client is meant
 * to buy should require a click to discover.
 *
 * So everything is open by default. The accordion still works (you can collapse
 * a category you don't care about), a sticky index lets you jump, and each
 * category advertises how many services it holds.
 */
export default function ServicesPage() {
  const total = useMemo(() => SERVICE_TREE.reduce((n, c) => n + c.items.length, 0), []);

  // every category starts OPEN — see above
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const [target, setTarget] = useState<string | null>(null);

  const toggle = (slug: string) =>
    setClosed((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });

  useEffect(() => {
    const apply = () => {
      const slug = decodeURIComponent(window.location.hash.replace('#', ''));
      if (!slug || !SERVICE_TREE.some((s) => svcSlug(s.cat) === slug)) return;
      setTarget(slug);
      // make sure a deep-linked category is never left collapsed
      setClosed((prev) => { const n = new Set(prev); n.delete(slug); return n; });
      requestAnimationFrame(() => {
        document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  return (
    <PageShell
      kicker="SERVICES"
      title="Everything we build. Everything we run."
      sub={`${total} services across ${SERVICE_TREE.length} disciplines — all delivered end to end by one team, from the first audit to production and beyond.`}
    >
      {/* jump index — the whole catalogue at a glance */}
      <section className="sec svc-index-sec">
        <div className="wrap">
          <div className="svc-index" data-a>
            {SERVICE_TREE.map((cat) => (
              <a key={cat.cat} href={`#${svcSlug(cat.cat)}`} className="svc-index-chip">
                {cat.cat}
                <span className="svc-index-n">{cat.items.length}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="svc-tree">
            {SERVICE_TREE.map((cat) => {
              const slug = svcSlug(cat.cat);
              const isOpen = !closed.has(slug);
              const isTarget = target === slug;
              return (
                <section
                  key={cat.cat}
                  id={slug}
                  // `in` asserted declaratively: React owns this className, so a
                  // class poked in from outside is wiped on the next render —
                  // which is how a deep-linked category once ended up invisible.
                  className={`svc-branch svc-open-sec in ${isOpen ? 'is-open' : ''} ${isTarget ? 'svc-target' : ''}`}
                >
                  <button
                    className="svc-branch-head"
                    aria-expanded={isOpen}
                    aria-controls={`${slug}-items`}
                    onClick={() => toggle(slug)}
                  >
                    <span className="svc-branch-name">{cat.cat}</span>
                    <span className="svc-branch-blurb">{cat.blurb}</span>
                    <span className="svc-branch-count">{cat.items.length}</span>
                    <span className="svc-chev" aria-hidden />
                  </button>
                  {/* the grid-template-rows height animation needs exactly ONE
                      child to collapse, hence the inner wrapper */}
                  <div className="svc-leafs" id={`${slug}-items`}>
                    <div className="svc-leafs-inner">
                      {cat.items.map((item) => (
                        <Link
                          key={item}
                          href={`/contact?need=${encodeURIComponent(item)}`}
                          className="svc-leaf"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      {/* the stack we actually build on */}
      <TechStack />

      <section className="sec sec-alt">
        <div className="wrap">
          <span className="orb orb-a" aria-hidden />
          <div className="art-grid-3">
            <ArtCard label="Intelligence" sub="Agents, models, computer vision" />
            <ArtCard label="Engineering" sub="Web, mobile, SaaS, enterprise" />
            <ArtCard label="Growth" sub="SEO · GEO · AEO, analytics, automation" />
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-kicker" data-a>THE DELIVERY RAIL</div>
          <h2 className="sec-title" data-a>Every service ships the same way.</h2>
          <Flow />
        </div>
      </section>
    </PageShell>
  );
}
