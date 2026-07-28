'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { timeline } from '@/state/timeline';
import { subscribe } from '@/state/ticker';

const SERVICES: { title: string; items: string[] }[] = [
  {
    title: 'AI Solutions',
    items: ['AI Agents', 'Voice Agents', 'Computer Vision', 'Machine Learning', 'Automation', 'AI Consulting', 'AI Integration'],
  },
  {
    title: 'Software & Digital Engineering',
    items: ['Custom Software', 'SaaS', 'Web', 'Mobile', 'Enterprise', 'Cloud', 'APIs', 'DevOps'],
  },
  {
    title: 'Growth & Transformation',
    items: ['SEO', 'GEO', 'AEO', 'Digital Marketing', 'Consulting', 'Managed Services'],
  },
];

const INDUSTRIES: { title: string; items: string[] }[] = [
  {
    title: 'By Sector',
    items: ['Construction', 'Healthcare', 'Real Estate', 'Retail', 'Manufacturing', 'Finance'],
  },
  {
    title: ' ',
    items: ['Education', 'Logistics', 'Hospitality', 'Legal', 'Energy', 'Agriculture'],
  },
  {
    title: 'By Business Need',
    items: ['Build an MVP', 'Automate Business', 'Increase Sales with AI', 'Launch SaaS', 'Digital Transformation'],
  },
];

function Mega({ columns, moreHref, moreLabel }: {
  columns: { title: string; items: string[] }[];
  moreHref: string;
  moreLabel: string;
}) {
  return (
    <div className="mega">
      <div className="mega-inner">
        {columns.map((col) => (
          <div className="mega-col" key={col.title + col.items[0]}>
            <div className="mega-title">{col.title}</div>
            {col.items.map((item) => (
              <a key={item} href={moreHref} className="mega-item">
                {item}
              </a>
            ))}
          </div>
        ))}
        <a className="mega-more" href={moreHref}>
          {moreLabel} <span className="mega-more-arrow">→</span>
        </a>
      </div>
    </div>
  );
}

export default function Nav() {
  const bar = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // the bar retreats while the story plays, returns when the user reaches for it
  useEffect(() => {
    let shown = 1;
    let lastP = 0;
    let lastWritten = -1;
    return subscribe(() => {
      const p = timeline.progress;
      const scrollingUp = p < lastP - 0.00001;
      lastP = p;
      const want = p < 0.03 || p > 0.93 || scrollingUp || timeline.velocity < -0.2 ? 1 : 0;
      shown += (want - shown) * 0.12;
      // only touch the DOM when it actually changes
      if (bar.current && Math.abs(shown - lastWritten) > 0.002) {
        lastWritten = shown;
        bar.current.style.transform = `translate3d(0, ${(1 - shown) * -110}%, 0)`;
        bar.current.style.opacity = String(0.25 + shown * 0.75);
      }
    });
  }, []);

  // the drawer owns the screen while it is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header ref={bar} className="navbar">
        <a
          className="nav"
          href="#"
          aria-label="PAR Technologys — home"
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            window.scrollTo({ top: 0 });
          }}
        >
          <img className="nav-mark" src="/brand/par-icon.png" alt="PAR Technologys" draggable={false} />
          <span className="nav-reveal">
            <span className="nav-name">
              <span className="nav-par">PAR</span>
              <span className="nav-tech">TECHNOLOGYS</span>
            </span>
          </span>
        </a>

        <nav className="links" aria-label="Primary">
          <a className="link" href="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); }}>Home</a>
          <div className="link has-mega">
            <span>Services <i className="chev" /></span>
            <Mega columns={SERVICES} moreHref="/services" moreLabel="Explore all services" />
          </div>
          <div className="link has-mega">
            <span>Industries <i className="chev" /></span>
            <Mega columns={INDUSTRIES} moreHref="/industries" moreLabel="Explore all industries" />
          </div>
          <a className="link" href="/library">Work</a>
          <a className="link" href="/pricing">Pricing</a>
          <a className="link" href="/insights">Insights</a>
          <a className="link" href="/about">About</a>
        </nav>

        <a className="nav-cta" href="/contact">
          <span className="nav-cta-text">Contact</span>
          <span className="nav-cta-arrow">→</span>
        </a>

        {/* mobile: a real menu button */}
        <button
          className={`burger ${open ? 'on' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* mobile drawer */}
      <div className={`drawer ${open ? 'on' : ''}`} role="dialog" aria-modal="true" aria-hidden={!open}>
        <nav className="drawer-nav">
          <a href="/" onClick={(e) => { e.preventDefault(); setOpen(false); window.scrollTo({ top: 0 }); }}>Home</a>
          <a href="/services" onClick={() => setOpen(false)}>Services</a>
          <a href="/industries" onClick={() => setOpen(false)}>Industries</a>
          <a href="/library" onClick={() => setOpen(false)}>Work</a>
          <a href="/pricing" onClick={() => setOpen(false)}>Pricing</a>
          <a href="/insights" onClick={() => setOpen(false)}>Insights</a>
          <a href="/about" onClick={() => setOpen(false)}>About</a>
          <a href="/careers" onClick={() => setOpen(false)}>Careers</a>
        </nav>
        <div className="drawer-sub">
          <div className="drawer-sub-title">POPULAR</div>
          <div className="drawer-chips">
            {['AI Agents', 'Custom Software', 'Automation', 'Cloud & DevOps', 'SEO · GEO'].map((c) => (
              <a key={c} href="/services" className="act-chip" onClick={() => setOpen(false)}>{c}</a>
            ))}
          </div>
        </div>
        <a className="drawer-cta" href="/contact" onClick={() => setOpen(false)}>Start a Project →</a>
      </div>
    </>
  );
}
