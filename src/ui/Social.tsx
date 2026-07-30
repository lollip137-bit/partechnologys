'use client';

import { SOCIALS } from '@/content/site';
import { siInstagram, siFacebook } from 'simple-icons';

// LinkedIn is NOT in simple-icons — it was removed from the set on the brand's
// request, so unlike every other mark on the site it has to be carried here.
// Official geometry and official brand blue, used only to link to our own page.
const LINKEDIN = {
  hex: '0A66C2',
  path:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 ' +
    '1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 ' +
    '3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 ' +
    '01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 ' +
    '0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 ' +
    '24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
};

// Every other mark comes from the official vendor vectors, same as the tech
// stack elsewhere in the experience — never hand-traced.
const ICONS: Record<string, { path: string; hex: string }> = {
  linkedin: LINKEDIN,
  instagram: siInstagram,
  facebook: siFacebook,
};

/**
 * The social wheel — hover the hub and the accounts fan out around a circle.
 * On touch / narrow screens the CSS collapses it into a plain row, because a
 * hover-only reveal is unreachable there.
 *
 * Shared by the homepage footer and the inner-page footer so the two can never
 * drift apart again (the inner pages previously had no social links at all,
 * and the homepage wheel was five icons all pointing at "#").
 */
export default function SocialWheel() {
  return (
    <div className="social">
      <button className="social-hub" aria-label="Social links">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="2.4" />
          <circle cx="12" cy="4" r="1.6" /><circle cx="19" cy="8" r="1.6" />
          <circle cx="19" cy="16" r="1.6" /><circle cx="12" cy="20" r="1.6" /><circle cx="5" cy="12" r="1.6" />
          <path d="M12 6v3.6M17.6 8.8l-3.4 1.9M17.6 15.2l-3.4-1.9M12 18v-3.6M6.8 12h2.8" />
        </svg>
      </button>
      <div className="social-wheel">
        {SOCIALS.map((s, i) => {
          const icon = ICONS[s.slug];
          if (!icon) return null;
          return (
            <a
              key={s.slug}
              className="social-item"
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`PAR Technologys on ${s.label}`}
              style={{ ['--i' as string]: i, ['--n' as string]: SOCIALS.length }}
            >
              <svg viewBox="0 0 24 24" role="img" aria-hidden fill={`#${icon.hex}`}>
                <path d={icon.path} />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}
