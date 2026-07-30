'use client';

import { useEffect, useState } from 'react';
import { analyticsAvailable, readConsent, revokeAnalytics } from '@/lib/analytics';

/**
 * Footer control for withdrawing cookie consent.
 *
 * Consent has to be as easy to withdraw as it was to give — a banner with an
 * "Accept" button and no way back is not real consent. Renders nothing at all
 * when analytics isn't configured, because then no cookie was ever set and there
 * is nothing to manage.
 */
export default function CookiePrefs() {
  const [consent, setConsent] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setConsent(readConsent());
  }, []);

  // Nothing to manage: no analytics configured, or the visitor never chose.
  if (!mounted || !analyticsAvailable || consent === null) return null;

  return (
    <button
      className="footer-cookie-btn"
      onClick={() => { revokeAnalytics(); setConsent(null); window.location.reload(); }}
    >
      {consent === 'all' ? 'Withdraw cookie consent' : 'Cookie preferences'}
    </button>
  );
}
