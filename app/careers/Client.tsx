'use client';

import Link from 'next/link';
import PageShell from '@/ui/PageShell';
import { ArtCard } from '@/ui/Flow';
import { ROLES, PERKS } from '@/content/more';

export default function CareersPage() {
  return (
    <PageShell
      kicker="CAREERS"
      title="Build intelligence with us."
      sub="We are a small team of senior engineers, designers and strategists. If you want your work in production every week instead of in a backlog, you'll like it here."
    >
      <section className="sec">
        <div className="wrap">
          <span className="orb orb-a" aria-hidden />
          <div className="art-grid-3">
            <ArtCard label="Senior teams" sub="No juniors on client budgets" />
            <ArtCard label="Weekly releases" sub="Your work ships, always" />
            <ArtCard label="Remote-friendly" sub="Output over office hours" />
          </div>
        </div>
      </section>

      <section className="sec sec-alt">
        <div className="wrap">
          <div className="sec-kicker" data-a>OPEN ROLES</div>
          <h2 className="sec-title" data-a>Where we need people.</h2>
          <div className="role-list">
            {ROLES.map((r) => (
              <Link key={r.title} href="/contact" className="role-row" data-a>
                <span className="role-main">
                  <span className="role-title">{r.title}</span>
                  <span className="role-line">{r.line}</span>
                </span>
                <span className="role-meta">
                  <span className="role-team">{r.team}</span>
                  <span className="role-type">{r.type}</span>
                </span>
                <span className="role-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-kicker" data-a>HOW WE WORK</div>
          <h2 className="sec-title" data-a>What you get here.</h2>
          <div className="proc-grid">
            {PERKS.map((p) => (
              <div key={p.name} className="proc-card" data-a>
                <div className="proc-name">{p.name}</div>
                <p className="proc-line">{p.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
