'use client';

// ============================================================
// THE ANATOMY OF A PRODUCTION AI SYSTEM — interactive.
//
// This is the page's centrepiece and it is deliberately NOT a
// WebGL scene: an HTML/CSS pipeline with animated energy pulses
// costs nothing per frame (transform/opacity only), is readable
// by crawlers and screen readers, and EXPLAINS the thing a buyer
// is uncertain about — what "production AI" actually contains.
//
// Interaction: every node is a real <button>. Click/focus a node
// and the detail panel explains it. Until the visitor interacts,
// the walkthrough advances itself every few seconds (paused when
// off-screen, disabled under prefers-reduced-motion).
// ============================================================

import { Fragment, useEffect, useRef, useState } from 'react';
import { ARCH_NODES, ARCH_RAIL } from '@/content/services-page';
import { usePrefersReducedMotion } from './Motion';

const ALL = [...ARCH_NODES, ARCH_RAIL];

export default function AgentArchitecture() {
  const [activeId, setActiveId] = useState(ARCH_NODES[0].id);
  const [touched, setTouched] = useState(false); // user has taken over
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // visibility gate — the auto-walkthrough never runs off-screen
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setVisible(entries.some((e) => e.isIntersecting)),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // auto-advance until the visitor interacts
  useEffect(() => {
    if (touched || reduced || !visible) return;
    const t = window.setInterval(() => {
      setActiveId((cur) => {
        const i = ARCH_NODES.findIndex((n) => n.id === cur);
        return ARCH_NODES[(i + 1) % ARCH_NODES.length].id;
      });
    }, 4200);
    return () => window.clearInterval(t);
  }, [touched, reduced, visible]);

  const pick = (id: string) => { setTouched(true); setActiveId(id); };
  const active = ALL.find((n) => n.id === activeId) ?? ARCH_NODES[0];
  const activeStep = ARCH_NODES.findIndex((n) => n.id === activeId);

  return (
    <div className={`arch ${visible ? 'arch-live' : ''}`} ref={root} role="group" aria-label="Anatomy of a production AI system — interactive walkthrough">
      <div className="arch-flow">
        {ARCH_NODES.map((n, i) => (
          <Fragment key={n.id}>
            {i > 0 && (
              <span className="arch-link" aria-hidden>
                <i className="arch-pulse" style={{ animationDelay: `${i * 0.28}s` }} />
              </span>
            )}
            <button
              className={`arch-node ${activeId === n.id ? 'on' : ''} ${activeStep > i ? 'done' : ''}`}
              aria-pressed={activeId === n.id}
              aria-controls="arch-detail"
              onClick={() => pick(n.id)}
              onFocus={() => setTouched(true)}
            >
              <span className="arch-node-num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
              <span className="arch-node-name">{n.name}</span>
              <span className="arch-node-tag">{n.tag}</span>
            </button>
          </Fragment>
        ))}
      </div>

      {/* the loop badge — agent ⇄ tools ⇄ guardrails cycle until done */}
      <div className="arch-loop" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 1 15.5-6.2M21 12a9 9 0 0 1-15.5 6.2" />
          <path d="M18.5 2v3.8h-3.8M5.5 22v-3.8h3.8" />
        </svg>
        the agent loops through plan → act → check until the task is done
      </div>

      {/* observability rail spans the whole pipeline */}
      <button
        className={`arch-rail ${activeId === ARCH_RAIL.id ? 'on' : ''}`}
        aria-pressed={activeId === ARCH_RAIL.id}
        aria-controls="arch-detail"
        onClick={() => pick(ARCH_RAIL.id)}
        onFocus={() => setTouched(true)}
      >
        <span className="arch-rail-line" aria-hidden />
        <span className="arch-node-name">{ARCH_RAIL.name}</span>
        <span className="arch-node-tag">{ARCH_RAIL.tag}</span>
      </button>

      {/* the explanation — updates as the walkthrough advances */}
      <div className="arch-detail" id="arch-detail" role="region" aria-live="polite" aria-label="Step explanation">
        <div className="arch-detail-head">
          <h3>{active.name}</h3>
          <div className="arch-chips">
            {active.chips.map((c) => <span className="arch-chip" key={c}>{c}</span>)}
          </div>
        </div>
        <p key={active.id} className="arch-detail-body">{active.desc}</p>
      </div>
    </div>
  );
}
