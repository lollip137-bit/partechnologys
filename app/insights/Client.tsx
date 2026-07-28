'use client';

import PageShell from '@/ui/PageShell';
import { INSIGHTS } from '@/content/site';
import { RESOURCES } from '@/content/more';

export default function InsightsPage() {
  return (
    <PageShell
      kicker="INSIGHTS & RESOURCES"
      title="Thinking, written down."
      sub="What we've learned shipping AI and software into real businesses — plus the templates and guides our own teams use."
    >
      <section className="sec sec-alt">
        <div className="wrap">
          <span className="orb orb-a" aria-hidden />
          <div className="sec-kicker" data-a>ARTICLES</div>
          <h2 className="sec-title" data-a>From the engineering floor.</h2>
          <div className="ins-grid">
            {INSIGHTS.map((post) => (
              <article key={post.title} className="ins-card float-slow" data-a>
                <span className="pwin-tag">{post.tag}</span>
                <h3 className="ins-title">{post.title}</h3>
                <p className="ins-line">{post.line}</p>
                <span className="ins-meta">{post.min} min read · Coming soon</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-kicker" data-a>RESOURCE LIBRARY</div>
          <h2 className="sec-title" data-a>Take these with you.</h2>
          <div className="res-grid">
            {RESOURCES.map((r) => (
              <div key={r.title} className="res-card" data-a>
                <span className="pwin-tag">{r.tag}</span>
                <div className="res-title">{r.title}</div>
                <p className="res-line">{r.line}</p>
                <span className="res-kind">{r.kind}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
