'use client';

import PageShell from '@/ui/PageShell';
import Flow, { ArtCard } from '@/ui/Flow';
import { PROCESS } from '@/content/site';

const VALUES = [
  { name: 'Ship weekly', line: 'Working software every week. No six-month black boxes, ever.' },
  { name: 'Own the outcome', line: 'We measure ourselves on your numbers — not our hours.' },
  { name: 'Stay after launch', line: 'Systems are living things. We monitor, iterate and grow them.' },
  { name: 'You own everything', line: 'Code, infrastructure, models, weights. Handed over, documented.' },
];

export default function AboutPage() {
  return (
    <PageShell
      kicker="ABOUT US"
      title="We build intelligence."
      sub="PAR Technologys is an AI and software company. We take the rawest material there is — an idea — and organize it, particle by particle, into systems that think, sell, and scale."
    >
      <section className="sec sec-alt">
        <div className="wrap">
          <div className="sec-kicker" data-a>WHAT WE BELIEVE</div>
          <h2 className="sec-title" data-a>Principles we don’t negotiate.</h2>
          <div className="proc-grid">
            {VALUES.map((value) => (
              <div key={value.name} className="proc-card" data-a>
                <div className="proc-name">{value.name}</div>
                <p className="proc-line">{value.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <span className="orb orb-a" aria-hidden />
          <div className="art-grid-3">
            <ArtCard label="One team" sub="Strategy, design, engineering, growth" />
            <ArtCard label="Senior by default" sub="No juniors learning on your budget" />
            <ArtCard label="Yours to keep" sub="Code, infra and models handed over" />
          </div>
        </div>
      </section>

      <section className="sec sec-alt">
        <div className="wrap">
          <div className="sec-kicker" data-a>HOW WE WORK</div>
          <h2 className="sec-title" data-a>From first audit to running production.</h2>
          <Flow />
          <div className="proc-grid" style={{ marginTop: 62 }}>
            {PROCESS.map((s) => (
              <div key={s.step} className="proc-card" data-a>
                <div className="proc-step">{s.step}</div>
                <div className="proc-name">{s.title}</div>
                <p className="proc-line">{s.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
