'use client';

import { useState } from 'react';
import PageShell from '@/ui/PageShell';
import { BUSINESS_NEEDS } from '@/content/services';
import { CONTACT_NEXT } from '@/content/site';
import { SITE } from '@/content/seo';
import { Magnetic } from '@/ui/Motion';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const [need, setNeed] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [vals, setVals] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false });

  // the form's pulse — four signals, one bar
  const ok = {
    name: vals.name.trim().length >= 2,
    email: EMAIL_RE.test(vals.email.trim()),
    need: need !== null,
    message: vals.message.trim().length > 0,
  };
  const progress = Number(ok.name) + Number(ok.email) + Number(ok.need) + Number(ok.message);

  const set = (k: 'name' | 'email' | 'message') => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setVals((v) => ({ ...v, [k]: e.target.value }));
  const blur = (k: 'name' | 'email') => () => setTouched((t) => ({ ...t, [k]: true }));

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const company = String(new FormData(e.currentTarget).get('company') ?? '');
    const body = encodeURIComponent([
      `Name: ${vals.name}`,
      `Company: ${company}`,
      `Email: ${vals.email}`,
      `Need: ${need ?? 'Not specified'}`,
      '',
      vals.message,
    ].join('\r\n'));
    const subject = encodeURIComponent('Project inquiry — PAR Technologys');
    // Opens the visitor's mail client pre-filled. It captures nothing on its
    // own — swap for a form backend when one exists.
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — the address stays visible to select by hand */
    }
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
            <div className={`form-progress ${progress === 4 ? 'full' : ''}`}>
              <span className="fp-label">
                {progress === 4 ? 'Signal strong — ready to send' : `Signal ${progress}/4`}
              </span>
              <span className="fp-bar" aria-hidden>
                <span className="fp-fill" style={{ transform: `scaleX(${progress / 4})` }} />
              </span>
            </div>

            <div className="contact-row">
              <label className={`cfield ${ok.name ? 'ok' : ''} ${touched.name && !ok.name ? 'bad' : ''}`}>
                <span>
                  Your name <i className="cfield-tick" aria-hidden>✓</i>
                </span>
                <input
                  name="name"
                  required
                  placeholder="Jane Douglas"
                  autoComplete="name"
                  value={vals.name}
                  onChange={set('name')}
                  onBlur={blur('name')}
                  aria-invalid={touched.name && !ok.name}
                />
                {touched.name && !ok.name && <em className="cfield-err">We need a name to reply to.</em>}
              </label>
              <label className="cfield">
                <span>Company</span>
                <input name="company" placeholder="Acme Logistics" autoComplete="organization" />
              </label>
            </div>

            <label className={`cfield ${ok.email ? 'ok' : ''} ${touched.email && !ok.email ? 'bad' : ''}`}>
              <span>
                Email <i className="cfield-tick" aria-hidden>✓</i>
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="jane@acme.com"
                autoComplete="email"
                value={vals.email}
                onChange={set('email')}
                onBlur={blur('email')}
                aria-invalid={touched.email && !ok.email}
              />
              {touched.email && !ok.email && (
                <em className="cfield-err">That address doesn’t look complete yet.</em>
              )}
            </label>

            <div className={`cfield ${ok.need ? 'ok' : ''}`}>
              <span>
                What do you need? <i className="cfield-tick" aria-hidden>✓</i>
              </span>
              <div className="need-row tight">
                {BUSINESS_NEEDS.map((n) => (
                  <button
                    type="button"
                    key={n}
                    className={`act-chip need-chip ${need === n ? 'sel' : ''}`}
                    aria-pressed={need === n}
                    onClick={() => setNeed((cur) => (cur === n ? null : n))}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <label className={`cfield ${ok.message ? 'ok' : ''}`}>
              <span>
                Tell us about the project <i className="cfield-tick" aria-hidden>✓</i>
              </span>
              <textarea
                name="message"
                rows={5}
                placeholder="We spend 30 hours a week re-typing invoices…"
                value={vals.message}
                onChange={set('message')}
              />
            </label>

            <Magnetic className="contact-send-wrap">
              <button className="finale-cta contact-send" type="submit">
                {sent ? 'Opening your mail app…' : 'Send it — get a scoped audit'}
              </button>
            </Magnetic>

            {sent && (
              <div className="sent-panel" role="status">
                <span className="sent-title">Your mail app should be open.</span>
                <span className="sent-line">
                  Nothing happened? Email us directly at{' '}
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a> — or copy the address.
                </span>
                <button className="copy-btn" type="button" onClick={copy}>
                  {copied ? 'Copied ✓' : 'Copy address'}
                </button>
              </div>
            )}

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

            <div className="next-steps">
              <span className="side-label">What happens next</span>
              {CONTACT_NEXT.map((s) => (
                <div className="nstep" key={s.name}>
                  <div className="nstep-name">{s.name}</div>
                  <div className="nstep-line">{s.line}</div>
                </div>
              ))}
            </div>

            <div className="direct-card">
              <span className="side-label">Prefer plain email?</span>
              <a className="direct-mail" href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <button className="copy-btn" type="button" onClick={copy} aria-label="Copy email address">
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
