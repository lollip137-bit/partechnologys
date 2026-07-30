'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageShell from '@/ui/PageShell';
import Flow, { ArtCard } from '@/ui/Flow';
import { PROCESS, STATS, VALUES } from '@/content/site';
import { SERVICE_TREE } from '@/content/services';
import { Counter, SpotlightCard, usePrefersReducedMotion } from '@/ui/Motion';

/**
 * The four-step process as a living stepper: it advances on its own,
 * pauses the moment you touch it, and every step is a real button.
 */
function ProcessStepper() {
  const reduced = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const auto = !paused && !reduced;

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % PROCESS.length), 4600);
    return () => window.clearInterval(id);
  }, [auto]);

  const s = PROCESS[idx];
  return (
    <div
      className="steps"
      data-a
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="step-tabs">
        {PROCESS.map((p, i) => (
          <button
            key={p.step}
            type="button"
            className={`step-tab ${i === idx ? 'on' : ''}`}
            aria-current={i === idx ? 'step' : undefined}
            onClick={() => setIdx(i)}
          >
            <span className="step-num">{p.step}</span>
            <span className="step-name">{p.title}</span>
            <span className="step-bar" aria-hidden>
              {i === idx && auto && <span key={idx} className="step-fill" />}
            </span>
          </button>
        ))}
      </div>
      <div className="step-panel" key={s.step}>
        <span className="step-panel-num" aria-hidden>{s.step}</span>
        <div>
          <h3>{s.title}</h3>
          <p>{s.line}</p>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <PageShell
      kicker="ABOUT US"
      title="We build intelligence."
      sub="PAR Technologys is an AI and software company. We take the rawest material there is — an idea — and organize it, particle by particle, into systems that think, sell, and scale."
    >
      {/* proof — the numbers count themselves up as they enter the frame */}
      <section className="sec sec-stats">
        <div className="wrap">
          <div className="stats-grid">
            {STATS.map((s) => (
              <Counter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* manifesto — three lines, revealed in order */}
      <section className="sec sec-alt">
        <div className="wrap">
          <span className="orb orb-b" aria-hidden />
          <div className="sec-kicker" data-a>THE SHORT VERSION</div>
          <h2 className="mani">
            <span className="mani-line" data-a>An idea is raw material.</span>
            <span className="mani-line" data-a>We organize it — <em>particle by particle</em> —</span>
            <span className="mani-line" data-a>into systems that think, sell and scale.</span>
          </h2>
        </div>
      </section>

      {/* principles — spotlight cards that follow the cursor */}
      <section className="sec">
        <div className="wrap">
          <span className="orb orb-a" aria-hidden />
          <div className="sec-kicker" data-a>WHAT WE BELIEVE</div>
          <h2 className="sec-title" data-a>Principles we don’t negotiate.</h2>
          <div className="val-grid">
            {VALUES.map((value, i) => (
              <SpotlightCard key={value.name} className="val-card" data-a>
                <span className="val-num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <span className="val-rule" aria-hidden />
                <h3 className="val-name">{value.name}</h3>
                <p className="val-line">{value.line}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* one team */}
      <section className="sec sec-alt">
        <div className="wrap">
          <div className="art-grid-3">
            <ArtCard label="One team" sub="Strategy, design, engineering, growth" />
            <ArtCard label="Senior by default" sub="No juniors learning on your budget" />
            <ArtCard label="Yours to keep" sub="Code, infra and models handed over" />
          </div>
        </div>
      </section>

      {/* process — the rail plus a living stepper */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-kicker" data-a>HOW WE WORK</div>
          <h2 className="sec-title" data-a>From first audit to running production.</h2>
          <Flow />
          <ProcessStepper />
        </div>
      </section>

      {/* everything we build — an endless ribbon of the real catalogue */}
      <section className="sec sec-alt">
        <div className="wrap">
          <div className="sec-kicker" data-a>WHAT WE BUILD</div>
          <h2 className="sec-title" data-a>Twelve disciplines. One team.</h2>
        </div>
        <div className="mq" data-a>
          <div className="mq-track">
            {[0, 1].map((dup) => (
              <div className="mq-set" key={dup} aria-hidden={dup === 1}>
                {SERVICE_TREE.map((c) => (
                  <span className="mq-item" key={c.cat}>
                    {c.cat}
                    <i className="mq-dot" aria-hidden />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="wrap mq-cta-row" data-a>
          <Link className="act-cta" href="/services">
            Explore all services <span className="act-cta-arrow">→</span>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
