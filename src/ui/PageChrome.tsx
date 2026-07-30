'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import Link from 'next/link';
import { PageBack } from './BackControls';
import SocialWheel from './Social';

export const PAGE_LINKS: { href: string; label: string }[] = [
  { href: '/services', label: 'Services' },
  { href: '/industries', label: 'Industries' },
  { href: '/library', label: 'Work' },
  { href: '/library/mockups', label: 'Mockups' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
];

/** The real navigation for every page outside the film. */
export function PageHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="pagebar">
        <PageBack />
        {/* The mark lands on the WEBSITE, not on the film. Being thrown back
            into a nine-screen experience every time you click the logo is a
            trap, not a delight — replaying it is an explicit choice below. */}
        <Link href="/#services-sec" className="nav" aria-label="PAR Technologys — home">
          <img className="nav-mark" src="/brand/par-icon.png" alt="" draggable={false} />
          <span className="pagebar-name">
            <span className="nav-par">PAR</span>
            <span className="nav-tech">TECHNOLOGYS</span>
          </span>
        </Link>

        <nav className="pagebar-links" aria-label="Primary">
          {PAGE_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>

        <Link href="/contact" className="nav-cta page-cta">
          <span className="nav-cta-text">Contact</span>
          <span className="nav-cta-arrow">→</span>
        </Link>

        <button
          className={`burger ${open ? 'on' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </header>

      <div className={`drawer ${open ? 'on' : ''}`} role="dialog" aria-modal="true" aria-hidden={!open}>
        <nav className="drawer-nav" aria-label="Mobile">
          <Link href="/#services-sec" onClick={() => setOpen(false)}>Home</Link>
          {PAGE_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/" onClick={() => setOpen(false)} className="drawer-replay">↺ Replay the experience</Link>
        </nav>
        <Link className="drawer-cta" href="/contact" onClick={() => setOpen(false)}>Start a Project →</Link>
      </div>
    </>
  );
}

/** One footer for the whole site. */
export function PageFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <img src="/brand/par-icon.png" alt="" width={40} height={40} />
          <div>
            <div className="footer-name">PAR <span>TECHNOLOGYS</span></div>
            <div className="footer-tag">We Build Intelligence.</div>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer">
          {PAGE_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
          <Link href="/contact">Contact</Link>
          <Link href="/">↺ Replay the experience</Link>
        </nav>
        <SocialWheel />
        <div className="footer-copy">© {new Date().getFullYear()} PAR Technologys. All rights reserved.</div>
      </div>
    </footer>
  );
}
