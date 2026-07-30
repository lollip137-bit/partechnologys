'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PageShell from '@/ui/PageShell';
import { SERVICE_TREE, svcSlug } from '@/content/services';
import { SVC_HERO, SVC_PROBLEM, ROLE_PATHS, AI_CAPABILITIES, CLUSTERS, PROOF_NOTE } from '@/content/services-page';
import { ENGAGEMENT, PROJECTS, VALUES, FAQS } from '@/content/site';
import AgentArchitecture from '@/ui/AgentArchitecture';
import DeliveryRail from '@/ui/DeliveryRail';
import ServiceConstellation from '@/ui/ServiceConstellation';
import TechStack from '@/ui/TechStack';

/**
 * SERVICES — the page that wins the client.
 *
 * Rebuilt to the 2026 conversion anatomy: outcome hero → problem framing in
 * the buyer's language → an interactive walkthrough of a production agentic
 * AI system (the page EXPLAINS instead of claiming) → entry paths by role →
 * the full catalogue, flagship-first but with every service visible → the
 * scroll-driven delivery pipeline → stack → proof → engagement models →
 * risk reduction → one CTA.
 *
 * Two invariants carried over from the previous fix, do not regress:
 *  - every service in SERVICE_TREE is VISIBLE without interaction;
 *  - /services#<category-slug> deep links from the mega menu keep working.
 */
export default function ServicesPage() {
  const total = useMemo(() => SERVICE_TREE.reduce((n, c) => n + c.items.length, 0), []);

  // every category starts OPEN; the accordion is a choice, not a gate
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
      // a deep-linked category is never left collapsed
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
      title={SVC_HERO.title}
      sub={SVC_HERO.sub}
    >
      {/* ---- problem framing, in the buyer's words ---- */}
      <section className="sec svc2-problem">
        <div className="wrap">
          <div className="mani" data-a>
            {SVC_PROBLEM.map((l) => (
              <span className="mani-line" key={l.plain}>
                {l.plain}{l.em && <em>{l.em}</em>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- the centrepiece: how production AI is actually built ---- */}
      <section className="sec sec-alt" id="ai-architecture">
        <div className="wrap">
          <span className="orb orb-a" aria-hidden />
          <div className="sec-kicker" data-a>HOW PRODUCTION AI IS BUILT</div>
          <h2 className="sec-title" data-a>The anatomy of a system you can trust.</h2>
          <p className="library-sub" data-a>
            Walk through what we ship when a business says &ldquo;we need AI&rdquo; — step by step,
            from the first request to the audit trail. Click any stage.
          </p>
          <AgentArchitecture />

          <div className="cap-grid stag" data-a>
            {AI_CAPABILITIES.map((c) => (
              <div className="cap-card" key={c.name}>
                <span className="cap-name">{c.name}</span>
                <span className="cap-line">{c.line}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- entry paths by role ---- */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-kicker" data-a>START WHERE YOU SIT</div>
          <h2 className="sec-title" data-a>Three doors into the same team.</h2>
          <div className="role-grid stag" data-a>
            {ROLE_PATHS.map((r) => (
              <div className="role-card" key={r.role}>
                <span className="svc2-tag">{r.role}</span>
                <p className="role-pain">{r.pain}</p>
                <div className="role-links">
                  {r.links.map((l) => (
                    <a href={l.href} key={l.href}>{l.label} →</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- the catalogue: constellation + index + every service visible ---- */}
      <section className="sec svc-index-sec" id="catalogue">
        <div className="wrap">
          <div className="sec-kicker" data-a>THE FULL CATALOGUE</div>
          <h2 className="sec-title" data-a>{total} services. All of them visible.</h2>
          <ServiceConstellation total={total} />
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
              const meta = CLUSTERS[cat.cat];
              const flagNames = new Set(meta?.flagships.map((f) => f.name) ?? []);
              const rest = cat.items.filter((i) => !flagNames.has(i));
              return (
                <section
                  key={cat.cat}
                  id={slug}
                  // `in` asserted declaratively: React owns this className, so a
                  // class poked in from outside is wiped on the next render.
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
                      child to collapse, hence the single inner wrapper */}
                  <div className="svc-leafs" id={`${slug}-items`}>
                    <div className="svc-body">
                      {meta && <p className="svc-fit">{meta.fit}</p>}
                      {meta && (
                        <div className="flag-grid">
                          {meta.flagships.map((f) => (
                            <Link
                              key={f.name}
                              href={`/contact?need=${encodeURIComponent(f.name)}`}
                              className="flag-card"
                            >
                              <span className="flag-name">{f.name}</span>
                              <span className="flag-line">{f.line}</span>
                              <span className="flag-go" aria-hidden>Enquire →</span>
                            </Link>
                          ))}
                        </div>
                      )}
                      <div className="svc-leafs-inner">
                        {rest.length > 0 && <span className="svc-more-label">Also in {cat.cat}</span>}
                        {rest.map((item) => (
                          <Link
                            key={item}
                            href={`/contact?need=${encodeURIComponent(item)}`}
                            className="svc-leaf"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                      <Link className="svc-cta" href={`/contact?need=${encodeURIComponent(cat.cat)}`}>
                        Talk to an engineer about {cat.cat} →
                      </Link>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- how it ships: the scroll-driven pipeline ---- */}
      <section className="sec sec-alt" id="delivery">
        <div className="wrap">
          <span className="orb orb-b" aria-hidden />
          <div className="sec-kicker" data-a>THE DELIVERY RAIL</div>
          <h2 className="sec-title" data-a>Every service ships the same way.</h2>
          <p className="library-sub" data-a>
            What you get at each phase — and where the boundaries are.
          </p>
          <DeliveryRail />
        </div>
      </section>

      {/* the stack we actually build on */}
      <TechStack />

      {/* ---- proof: the kinds of systems we ship ---- */}
      <section className="sec" id="proof">
        <div className="wrap">
          <div className="sec-kicker" data-a>PROOF, NOT PROMISES</div>
          <h2 className="sec-title" data-a>The kinds of systems we ship.</h2>
          <div className="proof-grid stag" data-a>
            {PROJECTS.slice(0, 6).map((p) => (
              <article className="proof-card" key={p.id}>
                <span className="svc2-tag">{p.tag}</span>
                <h3 className="proof-title">{p.title}</h3>
                <p className="proof-line">{p.line}</p>
                <ul className="proof-points">
                  {p.points.map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
              </article>
            ))}
          </div>
          <p className="proof-note" data-a>{PROOF_NOTE}</p>
        </div>
      </section>

      {/* ---- engagement models + risk reduction ---- */}
      <section className="sec sec-alt">
        <div className="wrap">
          <div className="sec-kicker" data-a>ENGAGEMENT MODELS</div>
          <h2 className="sec-title" data-a>Three ways to work with us.</h2>
          <div className="eng-grid stag" data-a>
            {ENGAGEMENT.map((e) => (
              <div className="eng-card" key={e.name}>
                <span className="svc2-tag">{e.tag}</span>
                <div className="eng-name">{e.name}</div>
                <p className="eng-line">{e.line}</p>
              </div>
            ))}
          </div>
          <p className="eng-note" data-a>
            Every engagement starts with a scoped audit — you see what we&rsquo;d build, how long
            it takes and what it costs, before you commit. <Link href="/pricing">How engagements work →</Link>
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-kicker" data-a>WHY THIS IS LOW-RISK</div>
          <h2 className="sec-title" data-a>Built to be trusted with production.</h2>
          <div className="val-grid stag" data-a>
            {VALUES.map((v, i) => (
              <div className="val-card spot" key={v.name}>
                <span className="val-num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <span className="val-rule" aria-hidden />
                <div className="val-name">{v.name}</div>
                <p className="val-line">{v.line}</p>
              </div>
            ))}
          </div>

          <div className="svc2-faq" data-a>
            {FAQS.slice(2, 5).map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}<span className="faq-plus">+</span></summary>
                <p>{f.a}</p>
              </details>
            ))}
            <p className="faq-more-line">More questions answered on the <Link href="/faq">FAQ page →</Link></p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
