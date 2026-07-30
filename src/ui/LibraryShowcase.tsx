'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import ConceptArt from './ConceptArt';
import ReelPlayer, { CardReel, type ReelTarget } from './ReelPlayer';
import { DELIVERED, MOCKUPS, type Delivered, type Mockup } from '@/content/library';

/* ------------------------------------------------------------ delivered site */

function DeliveredCard({ d, onOpen }: { d: Delivered; onOpen: (t: ReelTarget) => void }) {
  const [hover, setHover] = useState(false);

  return (
    <article
      className="dcard"
      data-a
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        className="dcard-frame"
        onClick={() => onOpen({ title: d.name, reel: d.reel, label: d.label })}
        aria-label={`Preview the ${d.name} landing page`}
      >
        <span className="pwin-bar">
          <span className="pwin-dot" /><span className="pwin-dot" /><span className="pwin-dot" />
          <span className="pwin-url">{d.label}</span>
        </span>
        <span className="dcard-shot">
          <CardReel reel={d.reel} poster={d.poster} alt={`${d.name} — landing page`} playing={hover} />
        </span>
        <span className="dcard-zoom">
          <span className="dcard-play" aria-hidden>▶</span> Watch the design
        </span>
      </button>

      <div className="dcard-meta">
        <div className="dcard-top">
          <span className="pwin-tag">{d.sector}</span>
          <span className={`dcard-status s-${d.status.toLowerCase().replace(' ', '')}`}>{d.status}</span>
        </div>
        <h3 className="dcard-name">{d.name}</h3>
        <p className="dcard-line">{d.line}</p>
        <ul className="dcard-points">
          {d.highlights.map((h) => <li key={h}>{h}</li>)}
        </ul>
        <div className="dcard-stack">
          {d.stack.map((s) => <span key={s} className="dcard-chip">{s}</span>)}
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------- mockup card */

function MockupCard({ m, onOpen }: { m: Mockup; onOpen: (t: ReelTarget) => void }) {
  const [hover, setHover] = useState(false);
  const playable = Boolean(m.reel);

  // The cursor tilt comes from PageShell's single delegated mousemove listener,
  // which sets `--tilt` on anything matching its selector list — one listener
  // for the whole page instead of a React handler per card. `.mcard` and
  // `.dcard` were simply missing from that list.
  return (
    <article
      className={`mcard ${playable ? 'is-clickable' : ''}`}
      data-a
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => m.reel && onOpen({ title: m.name, reel: m.reel, label: `${m.family} · landing page` })}
    >
      <div className="mcard-art">
        {m.reel && m.poster
          ? <CardReel reel={m.reel} poster={m.poster} alt={m.name} playing={hover} />
          : <ConceptArt kind={m.art} />}
        <span className="mcard-no">{m.no}</span>
        {playable && <span className="mcard-play" aria-hidden>▶</span>}
      </div>
      <div className="mcard-meta">
        <span className="mcard-family">{m.family}</span>
        <h3 className="mcard-name">{m.name}</h3>
        <p className="mcard-line">{m.line}</p>
        <div className="mcard-tags">
          {m.tags.map((t) => <span key={t} className="mcard-tag">{t}</span>)}
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ sections */

export function DeliveredSection({ limit }: { limit?: number }) {
  const [reel, setReel] = useState<ReelTarget | null>(null);
  const open = useCallback((t: ReelTarget) => setReel(t), []);
  const list = limit ? DELIVERED.slice(0, limit) : DELIVERED;

  return (
    <section className="sec sec-alt" id="delivered">
      <div className="wrap">
        <div className="sec-kicker" data-a>WEBSITES DELIVERED</div>
        <h2 className="sec-title" data-a>Real builds, running right now.</h2>
        <p className="library-sub" data-a>
          Every site below was designed, engineered and shipped by PAR Technologys.
          Open one and scroll to walk through the landing page exactly as it moves.
        </p>
        <div className="dgrid">
          {list.map((d) => <DeliveredCard key={d.id} d={d} onOpen={open} />)}
        </div>
        {limit && limit < DELIVERED.length && (
          <div className="lib-cta-row" data-a>
            <Link className="finale-cta" href="/library/mockups">See the mockup &amp; demo library</Link>
          </div>
        )}
      </div>
      <ReelPlayer target={reel} onClose={() => setReel(null)} />
    </section>
  );
}

export function MockupSection() {
  const [reel, setReel] = useState<ReelTarget | null>(null);
  const open = useCallback((t: ReelTarget) => setReel(t), []);

  return (
    <section className="sec" id="mockups">
      <div className="wrap">
        <div className="sec-kicker" data-a>MOCKUP &amp; DEMO LIBRARY</div>
        <h2 className="sec-title" data-a>Every direction we explored, still running.</h2>
        <p className="library-sub" data-a>
          We never overwrite a good idea. Each concept explored while designing was frozen as its own
          version — so a direction we set aside in week two can still be picked up in year two.
          What you see here is the design; the builds themselves stay with the people who own them.
        </p>
        <div className="mgrid">
          {MOCKUPS.map((m) => <MockupCard key={m.id} m={m} onOpen={open} />)}
        </div>
      </div>
      <ReelPlayer target={reel} onClose={() => setReel(null)} />
    </section>
  );
}
