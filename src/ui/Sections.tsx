'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { STATS, SERVICES, PROCESS, PROJECTS, FAQS, INDUSTRY_CARDS, ENGAGEMENT, INSIGHTS } from '@/content/site';
import { ProjectWindow, ProjectModal, useProjectPreview } from './Projects';
import Flow, { ArtCard } from './Flow';
import SocialWheel from './Social';
import {
  siReact, siNextdotjs, siNodedotjs, siPython, siTensorflow,
  siDocker, siKubernetes, siPostgresql, siTypescript, siGooglecloud,
} from 'simple-icons';

const STACK = [siReact, siNextdotjs, siNodedotjs, siPython, siTensorflow, siDocker, siKubernetes, siPostgresql, siTypescript, siGooglecloud];

function ServiceIcon({ kind }: { kind: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (kind) {
    case 'agent': return <svg viewBox="0 0 24 24" {...common}><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.8L3 20l1-4.1a8.4 8.4 0 1 1 17-4.4Z" /><circle cx="9" cy="11.5" r="0.9" fill="currentColor" /><circle cx="14.5" cy="11.5" r="0.9" fill="currentColor" /></svg>;
    case 'ml': return <svg viewBox="0 0 24 24" {...common}><circle cx="5" cy="12" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="M7 11.2 17 6.8M7 12.8 17 17.2" /></svg>;
    case 'code': return <svg viewBox="0 0 24 24" {...common}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" /></svg>;
    case 'cloud': return <svg viewBox="0 0 24 24" {...common}><path d="M17.5 18.5H7a4.5 4.5 0 1 1 .8-8.9A6 6 0 0 1 19.4 12a3.3 3.3 0 0 1-1.9 6.5Z" /></svg>;
    case 'shield': return <svg viewBox="0 0 24 24" {...common}><path d="M12 3 5 5.8v5.2c0 4.4 3 8.4 7 9.9 4-1.5 7-5.5 7-9.9V5.8L12 3Z" /><path d="m9.2 11.6 2 2.2 3.8-4.4" /></svg>;
    default: return <svg viewBox="0 0 24 24" {...common}><path d="M4 20V9M10 20V4M16 20v-8M21 20H3" /></svg>;
  }
}

/** numbers that COUNT UP when they enter the view */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('0');
  useEffect(() => {
    const el = ref.current!;
    const match = value.match(/^([\d.]+)(.*)$/);
    if (!match) { setText(value); return; }
    const target = parseFloat(match[1]);
    const suffix = match[2];
    const dec = match[1].includes('.') ? 1 : 0;
    let started = false;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      const t0 = performance.now();
      const dur = 1500;
      const tick = () => {
        const k = Math.min(1, (performance.now() - t0) / dur);
        const ease = 1 - Math.pow(1 - k, 3);
        setText((target * ease).toFixed(dec) + suffix);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <div ref={ref} className="stat-value">{text}</div>;
}

/** everything tagged data-a rises, sharpens and glows into place */
function useRevealAnimations(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const els = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-a]') ?? []);
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      }
    }, { threshold: 0.18 });
    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 70}ms`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, [root]);
}

/** 3D tilt on every card — the site stays spatial after the film ends */
function useTiltInteractions(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const SEL = '.svc-card, .ind-card, .quote-card, .eng-card, .ins-card, .pwin';
    const onMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest?.(SEL) as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      card.style.setProperty('--tilt', `perspective(900px) rotateX(${-dy * 6}deg) rotateY(${dx * 8}deg) translateY(-4px)`);
    };
    const onOut = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest?.(SEL) as HTMLElement | null;
      if (card) card.style.setProperty('--tilt', 'none');
    };
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseout', onOut, { passive: true });
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseout', onOut); };
  }, [root]);
}

/** The real website — a liquid-glass sheet gliding over the particle world. */
export default function Sections() {
  const preview = useProjectPreview();
  const root = useRef<HTMLDivElement>(null);
  useRevealAnimations(root);
  useTiltInteractions(root);

  return (
    <div className="site" ref={root}>
      {/* glass entry — the 3D world still glows through the first sheet */}
      <section className="sec sec-stats site-entry" aria-label="Key numbers">
        <div className="entry-handle" />
        <div className="wrap stats-grid">
          {STATS.map((s) => (
            <div key={s.label} className="stat" data-a>
              <CountUp value={s.value} />
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* services */}
      <section className="sec" id="services-sec">
        <span className="orb orb-a" aria-hidden />
        <div className="wrap">
          <div className="sec-kicker" data-a>WHAT WE DO</div>
          <h2 className="sec-title" data-a>One team. The entire stack of intelligence.</h2>
          <div className="svc-grid">
            {SERVICES.map((s) => (
              <div key={s.title} className="svc-card" data-a>
                <div className="svc-icon"><ServiceIcon kind={s.icon} /></div>
                <div className="svc-name">{s.title}</div>
                <p className="svc-line">{s.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* industries as cards */}
      <section className="sec sec-alt" id="industries-sec">
        <div className="wrap">
          <div className="sec-kicker" data-a>INDUSTRIES WE SERVE</div>
          <h2 className="sec-title" data-a>Intelligence for every arena.</h2>
          <div className="ind-grid">
            {INDUSTRY_CARDS.map((industry, i) => (
              <Link key={industry.name} href="/industries" className="ind-card has-photo" data-a>
                <span className="ind-photo">
                  <Image src={industry.img} alt="" fill sizes="(max-width: 700px) 92vw, 360px" />
                </span>
                <span className="ind-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="ind-name">{industry.name}</span>
                <span className="ind-line">{industry.line}</span>
                <span className="ind-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* process */}
      <section className="sec">
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

      {/* capability visuals */}
      <section className="sec sec-alt">
        <div className="wrap">
          <div className="sec-kicker" data-a>INSIDE THE WORK</div>
          <h2 className="sec-title" data-a>What we actually deliver.</h2>
          <div className="art-grid-3">
            <ArtCard label="AI Agents in production" sub="Conversation, tools, guardrails, evals" />
            <ArtCard label="Dashboards that decide" sub="Live pipelines, forecasts, alerts" />
            <ArtCard label="Platforms built to scale" sub="Multi-tenant SaaS, APIs, cloud-native" />
          </div>
        </div>
      </section>

      {/* engagement models */}
      <section className="sec sec-alt">
        <span className="orb orb-b" aria-hidden />
        <div className="wrap">
          <div className="sec-kicker" data-a>ENGAGEMENT MODELS</div>
          <h2 className="sec-title" data-a>Work with us the way that fits.</h2>
          <div className="eng-grid">
            {ENGAGEMENT.map((model) => (
              <div key={model.name} className="eng-card float-slow" data-a>
                <span className="pwin-tag">{model.tag}</span>
                <div className="eng-name">{model.name}</div>
                <p className="eng-line">{model.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* library preview — 5 windows, see more → /library */}
      <section className="sec sec-alt" id="work">
        <div className="wrap">
          <div className="sec-kicker" data-a>THE LIBRARY</div>
          <h2 className="sec-title" data-a>Things we’ve built.</h2>
          <div className="lib-grid home">
            {PROJECTS.slice(0, 5).map((p) => (
              <div key={p.id} data-a>
                <ProjectWindow p={p} onPreview={preview.open} />
              </div>
            ))}
            <Link href="/library" className="lib-more" data-a>
              <span className="lib-more-num">+{PROJECTS.length - 5}</span>
              <span className="lib-more-text">See the full library</span>
              <span className="lib-more-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* tech stack — original colored logos */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-kicker" data-a>THE STACK WE SPEAK</div>
          <div className="stack-row" data-a>
            {STACK.map((icon) => (
              <div key={icon.slug} className="stack-item" title={icon.title}>
                <svg viewBox="0 0 24 24" role="img" aria-label={icon.title}
                  fill={icon.hex === '000000' ? '#E5E7EB' : `#${icon.hex}`}>
                  <path d={icon.path} />
                </svg>
                <span>{icon.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* insights */}
      <section className="sec sec-alt" id="insights">
        <span className="orb orb-a" aria-hidden />
        <div className="wrap">
          <div className="sec-kicker" data-a>INSIGHTS</div>
          <h2 className="sec-title" data-a>Thinking, written down.</h2>
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

      {/* FAQ */}
      <section className="sec" id="faq">
        <div className="wrap wrap-narrow">
          <div className="sec-kicker" data-a>FAQ</div>
          <h2 className="sec-title" data-a>Everything you’d ask on the first call.</h2>
          <div className="faq-list">
            {FAQS.map((f) => (
              <details key={f.q} className="faq-item" data-a>
                <summary>{f.q}<span className="faq-plus">+</span></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA + footer */}
      <section className="sec sec-cta" id="contact">
        <div className="wrap cta-wrap">
          <h2 className="cta-title" data-a>Let’s build your intelligence.</h2>
          <p className="cta-line" data-a>Tell us where your business hurts. We’ll show you where AI heals it.</p>
          <div className="cta-actions" data-a>
            <Link className="finale-cta" href="/contact">Start a Project</Link>
            <button className="finale-replay" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↺ Replay the journey</button>
          </div>
        </div>
        <footer className="footer">
          <div className="wrap footer-grid">
            <div className="footer-brand">
              <img src="/brand/par-icon.png" alt="PAR Technologys" width={40} height={40} />
              <div>
                <div className="footer-name">PAR <span>TECHNOLOGYS</span></div>
                <div className="footer-tag">We Build Intelligence.</div>
              </div>
            </div>
            <nav className="footer-links" aria-label="Footer">
              <Link href="/services">Services</Link>
              <Link href="/industries">Industries</Link>
              <Link href="/library">Work</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/insights">Insights</Link>
              <Link href="/about">About</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/contact">Contact</Link>
            </nav>
            <SocialWheel />
            <div className="footer-copy">© {new Date().getFullYear()} PAR Technologys. All rights reserved.</div>
          </div>
        </footer>
      </section>

      <ProjectModal p={preview.active} onClose={preview.close} />
    </div>
  );
}
