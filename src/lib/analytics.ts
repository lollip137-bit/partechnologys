/**
 * Consent-gated analytics.
 *
 * The audit that produced this file: the site showed a cookie banner claiming
 * "we use cookies — analytics only", while setting NO cookies and loading NO
 * analytics. The banner wrote a value to localStorage that nothing ever read, so
 * consent had no effect on anything. A consent notice that misdescribes what a
 * site does is worse than no notice, and it is the one thing a privacy policy
 * cannot be allowed to contradict.
 *
 * So the contract here is deliberately strict:
 *
 *  1. Nothing loads, and no cookie is written, until the visitor accepts.
 *  2. If no measurement ID is configured, analytics does not exist — and the
 *     banner does not appear at all. The site genuinely sets no cookies, and the
 *     Privacy Policy says exactly that. This is the state the site ships in
 *     until an ID is added, so it is never misleading in the meantime.
 *  3. Consent is revocable. Withdrawing it clears the stored choice and the
 *     analytics cookies we know the vendor sets, and stops further collection
 *     for the rest of the session.
 *
 * To switch analytics on: set NEXT_PUBLIC_GA_ID to a GA4 measurement id
 * (`G-XXXXXXXXXX`) and rebuild. Nothing else needs to change.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

/** True only when analytics is actually configured — gates the whole feature. */
export const analyticsAvailable = GA_ID.length > 0;

const CONSENT_KEY = 'par-cookies';

export type Consent = 'all' | 'essential' | null;

export function readConsent(): Consent {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === 'all' || v === 'essential' ? v : null;
}

export function writeConsent(v: Exclude<Consent, null>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CONSENT_KEY, v);
}

let loaded = false;

/** Injects the analytics tag. Idempotent, and a no-op without consent + an ID. */
export function loadAnalytics() {
  if (loaded || !analyticsAvailable) return;
  if (typeof document === 'undefined') return;
  if (readConsent() !== 'all') return;
  loaded = true;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag(...args: unknown[]) { w.dataLayer!.push(args); };
  w.gtag('js', new Date());
  // IP anonymisation on, ad personalisation off: this is measurement, not
  // advertising, which is also what the Privacy Policy commits us to.
  w.gtag('config', GA_ID, { anonymize_ip: true, allow_google_signals: false });
}

/** Revokes consent and clears the vendor cookies we know about. */
export function revokeAnalytics() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CONSENT_KEY);
  const w = window as unknown as Record<string, unknown>;
  // documented GA opt-out flag — respected even if the tag is already loaded
  if (GA_ID) w[`ga-disable-${GA_ID}`] = true;
  for (const c of document.cookie.split(';')) {
    const name = c.split('=')[0]?.trim();
    if (name && (name.startsWith('_ga') || name === '_gid')) {
      document.cookie = `${name}=; Max-Age=0; path=/`;
    }
  }
  loaded = false;
}
