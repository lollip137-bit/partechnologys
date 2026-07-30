'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { PageHeader, PageFooter } from './PageChrome';

/** Shared shell for inner pages: brand bar, reveal animations, mini footer. */
export default function PageShell({ kicker, title, sub, children }: {
  kicker: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-a]') ?? []);
    // threshold 0.01, not 0.15: requiring 15% of an element to be visible is
    // unreliable for anything TALL — a tall block straddling the fold can sit
    // there permanently unrevealed, i.e. `opacity: 0`, i.e. a blank gap on a
    // live page. Since this observer also unobserves on first hit, that state
    // never recovers. A hair over zero still animates on entry and cannot fail.
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      }
    }, { threshold: 0.01, rootMargin: '0px 0px -2% 0px' });
    els.forEach((el, i) => { el.style.transitionDelay = `${(i % 6) * 60}ms`; io.observe(el); });

    // ---- SAFETY NET ----
    // This reveal is the single biggest correctness risk on the site: anything it
    // misses renders as `opacity: 0` — a blank gap where real content should be —
    // and because the observer unobserves on first hit, it never recovers. It has
    // been caught doing exactly that three times (FAQ rows, and a service branch
    // deep-linked from the nav, which arrives mid-smooth-scroll and so is
    // off-screen at the moment the observer is created).
    //
    // So: a couple of one-shot sweeps reveal anything that is genuinely on
    // screen but still hidden. These are two timers, not per-frame work, so the
    // layout reads here cost nothing measurable — and correctness beats a
    // perfectly staggered entrance.
    const sweep = () => {
      for (const el of els) {
        if (el.classList.contains('in')) continue;
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          el.classList.add('in');
          io.unobserve(el);
        }
      }
    };
    const t1 = window.setTimeout(sweep, 900);
    const t2 = window.setTimeout(sweep, 2500);

    // the 3D language carries onto every inner page
    const el = root.current;
    const SEL = '.svc-card, .ind-card, .quote-card, .eng-card, .ins-card, .pwin, .art-card, .svc-branch, .contact-fact, .flow-dot, .mcard, .dcard';
    const onMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest?.(SEL) as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      card.style.setProperty('--tilt', `perspective(900px) rotateX(${-dy * 5}deg) rotateY(${dx * 7}deg) translateY(-3px)`);
    };
    const onOut = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest?.(SEL) as HTMLElement | null;
      if (card) card.style.setProperty('--tilt', 'none');
    };
    el?.addEventListener('mousemove', onMove, { passive: true });
    el?.addEventListener('mouseout', onOut, { passive: true });

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      io.disconnect();
      el?.removeEventListener('mousemove', onMove);
      el?.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <div className="page" ref={root}>
      <a className="skip-link" href="#page-main">Skip to content</a>
      <PageHeader />

      <main id="page-main">
        <section className="sec page-hero">
          <div className="wrap">
            <div className="sec-kicker" data-a>{kicker}</div>
            <h1 className="sec-title" data-a>{title}</h1>
            {sub && <p className="library-sub" data-a>{sub}</p>}
          </div>
        </section>

        {children}

        <section className="sec sec-cta">
          <div className="wrap cta-wrap">
            <h2 className="cta-title" data-a>Ready when you are.</h2>
            <div className="cta-actions" data-a>
              <Link className="finale-cta" href="/contact">Start a Project</Link>
              <Link className="finale-replay" href="/">↺ Watch the journey</Link>
            </div>
          </div>
          <PageFooter />
        </section>
      </main>
    </div>
  );
}
