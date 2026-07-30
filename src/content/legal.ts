import { SITE } from './seo';

/**
 * Legal copy for /privacy and /terms.
 *
 * WRITTEN FROM THE CODE, NOT FROM IMAGINATION. Every factual claim below was
 * checked against the actual build:
 *   - `next.config.mjs` has `output: 'export'` — the site is a static export.
 *     There is no server, no database, no API route and no session. It cannot
 *     store anything about a visitor server-side because there is no server.
 *   - The contact form is a `mailto:` (app/contact/Client.tsx). It opens the
 *     visitor's own mail client; nothing is transmitted to or stored by us.
 *   - The only browser storage is a cookie-consent preference in localStorage
 *     and, ONLY after opt-in, Google Analytics cookies (src/lib/analytics.ts).
 *   - Hosting is Hostinger; the source repository is on GitHub.
 *
 * ⚠️ ANYTHING MARKED `TO_CONFIRM` IS A BUSINESS FACT WE DO NOT HAVE. It must be
 * filled in and the documents reviewed by a qualified adviser before they are
 * relied upon. These drafts are accurate about the SITE's behaviour; they are
 * not legal advice.
 */
export const TO_CONFIRM = '[TO CONFIRM]';

export const LEGAL_UPDATED = '30 July 2026';

export interface LegalBlock { h?: string; p?: string; list?: string[] }

export const PRIVACY: LegalBlock[] = [
  {
    p: `This policy explains what happens to information when you use ${SITE.url}. It is written to describe exactly how this website behaves — no more and no less.`,
  },
  {
    h: 'Who we are',
    p: `${SITE.legalName} ("we", "us") is an AI and software company. We operate across ${SITE.regions.join(', ')} and serve clients worldwide. The data controller for this website is ${SITE.legalName}, registered as ${TO_CONFIRM} at ${TO_CONFIRM}. You can reach us at ${SITE.email}.`,
  },
  {
    h: 'The short version',
    p: 'This website has no server, no database and no user accounts. It is a set of static files. We cannot and do not build a profile of you from your visit, and we never sell data.',
  },
  {
    h: 'What we collect',
    list: [
      `Nothing, unless you tell us something. There is no sign-up, no login and no tracking pixel placed without your consent.`,
      `If you use the contact form, it opens your own email application with the details you typed. The message travels from your email account to ours — it is not submitted through this website and we do not store a copy anywhere on it.`,
      `If you email us directly (${SITE.email} or ${SITE.emailOffice}) we hold that correspondence in our mailbox so we can reply.`,
      `Our hosting provider keeps standard server logs, which include IP addresses, as every web host does. We do not use these for analytics.`,
    ],
  },
  {
    h: 'Cookies and analytics',
    p: 'We set no cookies at all until you accept them. If you accept, we load Google Analytics 4 with IP anonymisation on and advertising personalisation off — it tells us which pages are useful, nothing more. Choosing "Essential only" means no analytics is loaded and no analytics cookie is written. If analytics has not been configured for this site, no cookie banner appears, because there is genuinely nothing to consent to.',
  },
  {
    h: 'Withdrawing consent',
    p: 'You can change your mind at any time from the cookie preferences link in the footer. Withdrawing consent stops further collection and clears the analytics cookies from your browser. Clearing your browser storage has the same effect.',
  },
  {
    h: 'Who else is involved',
    list: [
      'Hostinger — serves the website files and keeps standard access logs.',
      'Google Analytics — only if you accept cookies; see their own privacy terms.',
      'GitHub — hosts our source code. It receives nothing about visitors.',
      'Your email provider and ours — if you choose to email us.',
    ],
  },
  {
    h: 'How long we keep things',
    p: `Email correspondence is retained for as long as needed to serve you and to meet our record-keeping obligations (${TO_CONFIRM} retention period). Analytics data is retained per the retention setting on our analytics property. The consent preference stays in your browser until you clear it.`,
  },
  {
    h: 'Your rights',
    p: `Depending on where you live, you may have the right to access, correct, export or delete the personal information we hold about you, and to object to its processing. Because we hold little more than email correspondence, requests are usually simple to honour. Write to ${SITE.email} and we will respond. Governing data-protection law for these rights: ${TO_CONFIRM}.`,
  },
  {
    h: 'Children',
    p: 'This is a business-to-business website and is not directed at children. We do not knowingly collect information from anyone under 16.',
  },
  {
    h: 'Changes',
    p: `We will update this page when the website's behaviour changes, and change the date below when we do. Last updated ${LEGAL_UPDATED}.`,
  },
];

export const TERMS: LegalBlock[] = [
  {
    p: `These terms cover your use of ${SITE.url}. They do not govern any project we carry out for you — paid work is governed by the separate written agreement or statement of work we sign with you, which takes precedence over anything here.`,
  },
  {
    h: 'Using this website',
    p: 'You may read, share and link to this site freely. Please do not attempt to disrupt it, scrape it at a volume that degrades it for others, or misrepresent it as your own.',
  },
  {
    h: 'What is on this site is not an offer',
    p: 'Descriptions of services, timelines and indicative prices are published to help you decide whether to talk to us. They are not a contractual offer and are not a quotation. Anything binding is set out in a signed agreement.',
  },
  {
    h: 'Figures and examples',
    p: 'Where this site shows performance figures or outcome statistics, they describe our own aggregate experience and are not a promise of the result you will get. Your result depends on your systems, your data and your team.',
  },
  {
    h: 'Our work shown here',
    p: 'The design library shows work we designed and built. Screenshots and recordings of client-facing work are shown as design references only; the underlying trade marks and content belong to their owners, and their inclusion is not an endorsement by them.',
  },
  {
    h: 'Intellectual property',
    p: `The design, code and text of this website belong to ${SITE.legalName}, except third-party marks and open-source components, which belong to their respective owners. Deliverables from a client engagement are handled by that engagement's agreement — as a rule, our clients own their code, infrastructure and models on handover.`,
  },
  {
    h: 'Third-party links',
    p: 'We link to other sites, including our social profiles. We are not responsible for their content or their privacy practices.',
  },
  {
    h: 'No warranty for the site itself',
    p: 'This website is provided as-is. We work to keep it accurate and available, but we do not warrant that it will be uninterrupted or error-free, and we are not liable for loss arising from reliance on information published here. Nothing in these terms limits liability that cannot lawfully be limited.',
  },
  {
    h: 'Privacy',
    p: 'Our handling of information is described in the Privacy Policy, which forms part of these terms.',
  },
  {
    h: 'Governing law',
    p: `These terms are governed by the laws of ${TO_CONFIRM}, and disputes are subject to the exclusive jurisdiction of the courts of ${TO_CONFIRM}. We operate across ${SITE.regions.join(', ')} and serve clients worldwide; local consumer rights that apply to you are unaffected.`,
  },
  {
    h: 'Contact',
    p: `Questions about these terms: ${SITE.email}. Office and accounts: ${SITE.emailOffice}. Last updated ${LEGAL_UPDATED}.`,
  },
];
