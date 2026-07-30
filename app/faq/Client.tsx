'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageShell from '@/ui/PageShell';
import { FAQS } from '@/content/site';

/**
 * The questions every first call opens with, answered once.
 *
 * Both of the large regional software houses we benchmark against publish a
 * dedicated FAQ page; ours existed only as a strip on the homepage, where it
 * could not rank and could not be linked to. The answers are unchanged — this
 * is the same FAQS content, promoted to a page that search engines and
 * generative answer engines can actually cite.
 *
 * The accordion animates its height with `grid-template-rows: 0fr -> 1fr`,
 * which transitions smoothly without the layout thrash of measuring
 * scrollHeight in JS every frame.
 */
export default function FaqPage() {
  // first answer open: a page of collapsed rows reads as an empty page
  const [open, setOpen] = useState<number | null>(0);

  return (
    <PageShell
      kicker="FREQUENTLY ASKED"
      title="Everything you’d ask on the first call."
      sub="Straight answers, no sales script. If something here isn’t covered, ask us directly — every message is answered by an engineer."
    >
      <section className="sec sec-alt">
        <div className="wrap">
          {/* `data-a` sits on the LIST, not on each row. Per-row reveal was
              unreliable here: a row that is open is taller, and the shared
              IntersectionObserver (threshold 0.15, unobserve-on-first-hit) left
              some of them stuck at opacity 0 — a blank gap where a question
              should be. One reveal for the list cannot half-fail, and the rows
              still arrive in sequence via a CSS stagger. */}
          <ul className="faq-list" role="list" data-a>
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className={`faq-row ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="faq-q-text">{f.q}</span>
                    <span className="faq-mark" aria-hidden>
                      <i /><i />
                    </span>
                  </button>
                  <div className="faq-a-wrap" id={`faq-a-${i}`} role="region">
                    <p className="faq-a">{f.a}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="faq-more" data-a>
            <p>Still deciding? The fastest way to a real answer is a scoped audit.</p>
            <Link className="finale-cta" href="/contact">Ask us directly</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
