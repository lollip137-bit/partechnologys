'use client';

import { useState } from 'react';
import PageShell from '@/ui/PageShell';
import { BUSINESS_NEEDS } from '@/content/services';
import { SITE } from '@/content/seo';

export default function ContactPage() {
  const [need, setNeed] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = [
      `Name: ${data.get('name')}`,
      `Company: ${data.get('company')}`,
      `Email: ${data.get('email')}`,
      `Need: ${need ?? 'Not specified'}`,
      '',
      String(data.get('message') ?? ''),
    ].join('%0D%0A');
    // Opens the visitor's mail client pre-filled. It captures nothing on its
    // own — swap for a form backend when one exists.
    window.location.href = `mailto:${SITE.email}?subject=Project inquiry — PAR Technologys&body=${body}`;
    setSent(true);
  };

  return (
    <PageShell
      kicker="CONTACT"
      title="Tell us where it hurts."
      sub="Every engagement starts with a scoped audit — you’ll know exactly what we’d build, how long it takes and what it costs, before you commit to anything."
    >
      <section className="sec sec-alt">
        {/* a rotating wireframe core — the experience continues on the page */}
        <div className="contact-stage" aria-hidden>
          <div className="c3d">
            <span className="c3d-ring" />
            <span className="c3d-ring" />
            <span className="c3d-ring" />
            <span className="c3d-core" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="c3d-sat" style={{ ['--i' as string]: i }} />
            ))}
          </div>
          <span className="orb orb-b" />
        </div>
        <div className="wrap contact-wrap">
          <form className="contact-card" onSubmit={submit} data-a>
            <div className="contact-row">
              <label className="cfield">
                <span>Your name</span>
                <input name="name" required placeholder="Jane Douglas" />
              </label>
              <label className="cfield">
                <span>Company</span>
                <input name="company" placeholder="Acme Logistics" />
              </label>
            </div>
            <label className="cfield">
              <span>Email</span>
              <input name="email" type="email" required placeholder="jane@acme.com" />
            </label>
            <div className="cfield">
              <span>What do you need?</span>
              <div className="need-row tight">
                {BUSINESS_NEEDS.map((n) => (
                  <button
                    type="button"
                    key={n}
                    className={`act-chip need-chip ${need === n ? 'sel' : ''}`}
                    onClick={() => setNeed(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <label className="cfield">
              <span>Tell us about the project</span>
              <textarea name="message" rows={5} placeholder="We spend 30 hours a week re-typing invoices…" />
            </label>
            <button className="finale-cta contact-send" type="submit">
              {sent ? 'Opening your mail app…' : 'Send it — get a scoped audit'}
            </button>
            <span className="pmodal-note">
              Prefer talking? Every message is answered by an engineer, not a sales script.
            </span>
          </form>

          <aside className="contact-side" data-a>
            <div className="contact-fact">
              <span className="contact-fact-num">24h</span>
              <span className="contact-fact-label">first response, on business days</span>
            </div>
            <div className="contact-fact">
              <span className="contact-fact-num">Free</span>
              <span className="contact-fact-label">scoping call — no obligation</span>
            </div>
            <div className="contact-fact">
              <span className="contact-fact-num">NDA</span>
              <span className="contact-fact-label">signed before you share anything sensitive</span>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
