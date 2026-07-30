'use client';

import PageShell from './PageShell';
import { LEGAL_UPDATED, TO_CONFIRM, type LegalBlock } from '@/content/legal';

/**
 * Renders a legal document. Shared by /privacy and /terms so the two can never
 * drift in styling or structure.
 *
 * Any `[TO CONFIRM]` marker in the copy is highlighted rather than hidden. These
 * are business facts nobody has supplied yet (registered entity, registered
 * address, governing law, retention period) and quietly rendering them as plain
 * text is how a placeholder ends up published as if it were true.
 */
function Body({ text }: { text: string }) {
  if (!text.includes(TO_CONFIRM)) return <>{text}</>;
  const parts = text.split(TO_CONFIRM);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <mark className="legal-todo">{TO_CONFIRM}</mark>}
        </span>
      ))}
    </>
  );
}

export default function LegalDoc({ kicker, title, sub, blocks }: {
  kicker: string;
  title: string;
  sub: string;
  blocks: LegalBlock[];
}) {
  const pending = blocks.some((b) => (b.p ?? '').includes(TO_CONFIRM) || (b.list ?? []).some((l) => l.includes(TO_CONFIRM)));

  return (
    <PageShell kicker={kicker} title={title} sub={sub}>
      <section className="sec sec-alt">
        <div className="wrap legal-wrap">
          {pending && (
            <div className="legal-notice" role="note" data-a>
              <strong>Draft — not yet ready to rely on.</strong> The highlighted
              items are company details still to be supplied. This document is
              accurate about how the website behaves, but it should be reviewed by
              a qualified adviser before it is treated as final.
            </div>
          )}

          <article className="legal-doc">
            {blocks.map((b, i) => (
              <div className="legal-block" key={b.h ?? `intro-${i}`} data-a>
                {b.h && <h2 className="legal-h">{b.h}</h2>}
                {b.p && <p className="legal-p"><Body text={b.p} /></p>}
                {b.list && (
                  <ul className="legal-list">
                    {b.list.map((li) => <li key={li}><Body text={li} /></li>)}
                  </ul>
                )}
              </div>
            ))}
          </article>

          <p className="legal-updated" data-a>Last updated {LEGAL_UPDATED}</p>
        </div>
      </section>
    </PageShell>
  );
}
