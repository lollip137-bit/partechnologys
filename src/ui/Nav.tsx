'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { timeline } from '@/state/timeline';
import { subscribe } from '@/state/ticker';
import { NAV_SERVICE_COLUMNS, BUSINESS_NEEDS } from '@/content/services';
import { NAV_INDUSTRY_COLUMNS } from '@/content/site';

/**
 * The mega menus are built from the real catalogues in src/content, and every
 * entry deep-links to its own anchor.
 *
 * They used to be hand-written lists here, and EVERY item shared one href — all
 * 21 service links went to `/services`, all 17 industry links to `/industries`.
 * Clicking a specific service dropped you on a page of collapsed accordions with
 * nothing indicating what you had asked for, so each menu entry appeared to do
 * the same nothing. The lists had also drifted from the catalogue: the menu
 * offered "AI Agents" and "Legal"/"Energy"/"Agriculture", none of which exist in
 * the content, so those were unfindable by design.
 */
type MegaCol = { title: string; items: { label: string; href: string }[] };

function Mega({ columns, moreHref, moreLabel, extra }: {
  columns: MegaCol[];
  moreHref: string;
  moreLabel: string;
  extra?: MegaCol;
}) {
  const cols = extra ? [...columns, extra] : columns;
  return (
    <div className="mega">
      <div className="mega-inner">
        {cols.map((col, ci) => (
          <div className="mega-col" key={`${col.title}-${ci}`}>
            <div className="mega-title">{col.title}</div>
            {col.items.map((item) => (
              <a key={item.href + item.label} href={item.href} className="mega-item">
                {item.label}
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
            <Mega
              columns={NAV_SERVICE_COLUMNS}
              moreHref="/services"
              moreLabel="Explore all services"
            />
          </div>
          <div className="link has-mega">
            <span>Industries <i className="chev" /></span>
            <Mega
              columns={NAV_INDUSTRY_COLUMNS}
              moreHref="/industries"
              moreLabel="Explore all industries"
              extra={{
                title: 'By Business Need',
                items: BUSINESS_NEEDS.slice(0, 5).map((n) => ({ label: n, href: '/contact' })),
              }}
            />
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
            {/* real categories with real anchors — these were five hand-typed
                labels all pointing at /services */}
            {NAV_SERVICE_COLUMNS.flatMap((c) => c.items).slice(0, 6).map((c) => (
              <a key={c.href} href={c.href} className="act-chip" onClick={() => setOpen(false)}>{c.label}</a>
            ))}
          </div>
        </div>
        <a className="drawer-cta" href="/contact" onClick={() => setOpen(false)}>Start a Project →</a>
      </div>
    </>
  );
}
