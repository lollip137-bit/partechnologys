import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That page does not exist. Find your way back to PAR Technologys.',
  robots: { index: false, follow: true },
};

/** A dead link should still feel like the rest of the universe. */
export default function NotFound() {
  return (
    <main className="page notfound">
      <div className="wrap notfound-inner">
        <div className="sec-kicker">404 — LOST IN THE VOID</div>
        <h1 className="sec-title">This page never formed.</h1>
        <p className="library-sub">
          The address you followed does not exist. Everything we build is one link away.
        </p>
        <div className="cta-actions">
          <Link className="finale-cta" href="/#services-sec">Back to the site</Link>
          <Link className="finale-replay" href="/library/mockups">See the work</Link>
        </div>
      </div>
    </main>
  );
}
