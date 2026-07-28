# PAR TECHNOLOGYS — V2

The flagship site. One conserved GPU particle system carries the visitor through
eleven acts and finally assembles the brand mark; the marketing site then scrolls
up over the finished film.

**Branch:** `par_tech_v2` — self-contained, ready to deploy.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3010
```

```bash
npm run build && npm start
```

`npm run typecheck` runs `tsc --noEmit`.

> **Do not run `npm run build` while `npm run dev` is running.** The build
> overwrites `.next`, the dev server then 404s on its client chunks, and every
> page serves un-hydrated HTML — the site renders but nothing is clickable. If
> that happens: stop dev, delete `.next`, start dev again.

## Deploy

Plain Next.js 15 App Router, fully static (`○ (Static) prerendered` for every
route). Any Next host works. **No environment variables and no configuration
are required** — point the host at this branch and attach the domain.

The canonical domain is already `https://partechnologys.com`, hard-set in
`src/content/seo.ts`. Canonicals, `sitemap.xml`, `robots.txt`, Open Graph and
the JSON-LD graph all declare it, so nothing needs changing when it goes live.
Set `NEXT_PUBLIC_SITE_URL` only if a staging host must declare itself instead.

### Caching / why updates show up

Next serves static HTML with a one-year shared-cache header, assuming the CDN
is purged on every deploy (Vercel does this silently). A generic CDN — e.g.
Hostinger's — is not purged automatically, so a page cached once would freeze
until purged by hand, and **new deploys would never appear**.

`middleware.ts` fixes this: it sets `Cache-Control: public, max-age=0,
must-revalidate` on HTML documents, so the CDN revalidates with the origin and
a deploy is live immediately. Hashed build assets keep their long immutable
cache (their filenames change each build). **The one exception is fixed-name
media in `/public` (the reel `.mp4`s, `og.png`): if you replace one with the
same filename, purge the CDN once, or the old copy can linger.**

> **First cutover only:** the CDN already cached the pre-V2 homepage with the
> old one-year header. That single stale entry needs one manual purge in the
> host's CDN panel. After that, the middleware keeps everything fresh on its
> own — no more purges for normal deploys.

---

## Layout

```
app/
  page.tsx            the film + the marketing site below it
  layout.tsx          metadata, JSON-LD, fonts
  sitemap.ts robots.ts
  <route>/page.tsx    server component: metadata only
  <route>/Client.tsx  the actual page (client component)
  library/mockups/    the delivery library
src/
  experience/         camera rig, post FX, phase/act script
  particles/          the GPU simulation, shaders, shape targets
  ui/                 acts, HUD, nav, sections, library
  content/            all copy and data — edit here, not in components
public/library/reels/ landing-page captures shown in the library
```

Every act, station, camera key and shape hold lives in
`src/experience/phases.ts`. That file is the film script.

---

## Two rules that are not obvious

**1. The library shows the DESIGN, never the build.**
`src/ui/ReelPlayer.tsx` plays a self-hosted capture of each landing page. It is
deliberately not an `<iframe>` of the real deployment: an iframe publishes the
client's URL in this site's own page source and hands visitors the whole site to
click through and inspect. There are no client URLs, no links out and no
click-through anywhere in the library — please keep it that way.

**2. Brightness comes from density, not exposure.**
Pushing `uIntensity` past ~4.5 clips the HDR nucleus and ACES tone-maps every
particle to flat white. If something needs to look brighter, add particles or
lift the palette — do not raise exposure.

---

## Before this goes on the domain

Content that still needs the business to confirm or replace:

- **`STATS` in `src/content/site.ts`** — "120+ projects shipped", "40+ AI systems
  in production", "99.9% uptime", "12× ROI". Self-reported figures; confirm them
  or change them.
- **`PROJECTS` in `src/content/site.ts`** — these describe *types of systems*,
  not named client engagements, and carry no client-attributed metrics. If real
  case studies are cleared for publication, they belong here.
- **`INSIGHTS`** — three article cards with no articles behind them yet.
- **Contact form** (`app/contact/Client.tsx`) — composes a `mailto:` to
  `commission@partechnologys.com` (from `SITE.email`). It captures nothing on
  its own and fails silently for anyone without a desktop mail client, so wire
  a real form endpoint when there is one.
