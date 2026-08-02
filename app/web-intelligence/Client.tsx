'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import PageShell from '@/ui/PageShell';
import {
  WEB_INTELLIGENCE_URL,
  WI_AREAS,
  WI_FACTS,
  WI_STEPS,
  WI_DELIVERABLES,
} from '@/content/web-intelligence';

/** Icons stay in the site's stroke language — same weight as ServiceIcon. */
function AreaIcon({ kind }: { kind: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (kind) {
    case 'seo':
      return <svg viewBox="0 0 24 24" {...common}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /><path d="M8 10.5h5M10.5 8v5" /></svg>;
    case 'perf':
      return <svg viewBox="0 0 24 24" {...common}><path d="M4.5 18a9 9 0 1 1 15 0" /><path d="M12 13.5 16 8" /><circle cx="12" cy="14.5" r="1.4" fill="currentColor" /></svg>;
    case 'access':
      return <svg viewBox="0 0 24 24" {...common}><circle cx="12" cy="5" r="1.8" /><path d="M4.5 8.5c2.5.7 5 1 7.5 1s5-.3 7.5-1M12 9.5v4.5M12 14l-3 6M12 14l3 6" /></svg>;
    case 'content':
      return <svg viewBox="0 0 24 24" {...common}><path d="M6 3.5h9l4 4v13H6z" /><path d="M14.5 3.5v4.5H19M9 12h7M9 15.5h7M9 8.5h2.5" /></svg>;
    case 'security':
      return <svg viewBox="0 0 24 24" {...common}><path d="M12 3 5 5.8v5.2c0 4.4 3 8.4 7 9.9 4-1.5 7-5.5 7-9.9V5.8L12 3Z" /><path d="M12 8.5v4M12 15.2v.1" /></svg>;
    case 'ai':
      return <svg viewBox="0 0 24 24" {...common}><path d="M12 4.5a4 4 0 0 1 4 4v1a3.5 3.5 0 0 1 1.5 6.4A4 4 0 0 1 12 19.5a4 4 0 0 1-5.5-3.6A3.5 3.5 0 0 1 8 9.5v-1a4 4 0 0 1 4-4Z" /><path d="M12 4.5v15M8.5 12h7" /></svg>;
    default:
      return <svg viewBox="0 0 24 24" {...common}><path d="m14.5 6.5 3 3L7 20H4v-3L14.5 6.5Z" /><path d="m13 8 3 3M17.5 3.5 20.5 6.5l-1.8 1.8-3-3z" /></svg>;
  }
}

/** The animated launch button — opens the live tool on its own subdomain. */
function LaunchButton({ label }: { label: string }) {
  return (
    <a
      className="wi-cta"
      href={WEB_INTELLIGENCE_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="wi-cta-sheen" aria-hidden />
      {label}
      <span className="wi-cta-arrow" aria-hidden>→</span>
    </a>
  );
}

export default function WebIntelligencePage() {
  return (
    <PageShell
      kicker="PAR WEB INTELLIGENCE"
      title="Your website, measured."
      sub="A free live audit that reads your real pages and tells you — with evidence — what is helping you, what is hurting you, and exactly where."
    >
      {/* launch banner */}
      <section className="sec sec-alt" aria-label="Run the audit">
        <div className="wrap">
          <div className="wi-banner" data-a>
            <span className="wi-scan" aria-hidden />
            <div className="wi-copy">
              <h2 className="sec-title wi-title">Run it on your site. Right now.</h2>
              <p className="wi-line">
                Point PAR Web Intelligence at any public website and it audits the live pages —
                not a cached copy, not a guess. A home-page scan takes about 15 seconds;
                a full site audit runs for a few minutes and covers your key pages.
              </p>
              <ul className="wi-facts">
                {WI_FACTS.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <div className="wi-actions">
                <LaunchButton label="Open the audit tool" />
                <span className="wi-note">Opens in a new tab</span>
              </div>
            </div>
            <div className="wi-logo-wrap">
              <img
                className="wi-logo"
                src="/brand/par-web-intelligence.png"
                alt="PAR Web Intelligence — website audit tool"
                width={1680}
                height={644}
              />
            </div>
          </div>
        </div>
      </section>

      {/* the seven areas */}
      <section className="sec">
        <span className="orb orb-a" aria-hidden />
        <div className="wrap">
          <div className="sec-kicker" data-a>WHAT IT CHECKS</div>
          <h2 className="sec-title" data-a>Seven areas. One honest verdict.</h2>
          <div className="wi-area-grid">
            {WI_AREAS.map((a) => (
              <div key={a.name} className="svc-card" data-a>
                <div className="svc-icon"><AreaIcon kind={a.icon} /></div>
                <div className="svc-name">{a.name}</div>
                <p className="svc-line">{a.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it runs */}
      <section className="sec sec-alt">
        <div className="wrap">
          <div className="sec-kicker" data-a>HOW IT RUNS</div>
          <h2 className="sec-title" data-a>Three steps. No install, no account.</h2>
          <div className="wi-steps">
            {WI_STEPS.map((s) => (
              <div key={s.step} className="proc-card" data-a>
                <div className="proc-step">{s.step}</div>
                <div className="proc-name">{s.title}</div>
                <p className="proc-line">{s.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* what you get */}
      <section className="sec">
        <span className="orb orb-b" aria-hidden />
        <div className="wrap">
          <div className="sec-kicker" data-a>WHAT YOU WALK AWAY WITH</div>
          <h2 className="sec-title" data-a>A report you can act on.</h2>
          <div className="wi-get-grid">
            {WI_DELIVERABLES.map((d, i) => (
              <div key={d.name} className="wi-get-card" data-a>
                <div className="wi-get-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="wi-get-name">{d.name}</div>
                <p className="wi-get-line">{d.line}</p>
              </div>
            ))}
          </div>
          <p className="wi-honest" data-a>
            <strong>What it is — and isn&rsquo;t.</strong> PAR Web Intelligence diagnoses; it
            never touches your site or fixes anything automatically. Every number in the report
            is measured on your own pages, so you can verify each finding yourself — or hand
            the PDF to whoever will do the fixing. If that turns out to be us,{' '}
            <Link className="wi-honest-link" href="/contact/">we&rsquo;re easy to find</Link>.
          </p>
          <div className="wi-actions" data-a>
            <LaunchButton label="Start your free audit" />
            <span className="wi-note">Free · no signup · nothing stored</span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
