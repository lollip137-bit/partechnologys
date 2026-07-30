'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { analyticsAvailable, loadAnalytics, readConsent, writeConsent } from '@/lib/analytics';

/**
 * Glass cookie consent — appears once, remembers the choice, and now actually
 * DOES something.
 *
 * Previously this wrote a value to localStorage that nothing read, while the
 * copy claimed the site used analytics cookies. It set no cookies and loaded no
 * analytics, so the notice described something that wasn't happening.
 *
 * Now: the bar only appears when analytics is genuinely configured (see
 * src/lib/analytics.ts), "Accept" is what loads the tag, and "Essential only"
 * means nothing is loaded at all. If no measurement ID is set the site truly
 * sets no cookies, so there is nothing to consent to and no bar is shown.
 */
export default function CookieBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // No analytics configured → no cookies → nothing to ask about.
    if (!analyticsAvailable) return;
    if (readConsent() !== null) {
      // an earlier "accept" still stands; honour it on this visit
      loadAnalytics();
      return;
    }
    const t = setTimeout(() => setShow(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const choose = (v: 'all' | 'essential') => {
    writeConsent(v);
    if (v === 'all') loadAnalytics();
    setShow(false);
  };

  if (!show) return null;
  return (
    <div className="cookiebar" role="dialog" aria-label="Cookie preferences">
      <div className="cookiebar-glow" />
      <p>
        We use a single analytics cookie to understand which pages are useful —
        measurement only, never advertising, never sold.{' '}
        <Link href="/privacy">Privacy Policy</Link>
      </p>
      <div className="cookiebar-actions">
        <button className="cookie-accept" onClick={() => choose('all')}>Accept</button>
        <button className="cookie-essential" onClick={() => choose('essential')}>Essential only</button>
      </div>
    </div>
  );
}
