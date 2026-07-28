'use client';

import { useEffect, useRef } from 'react';
import { timeline, window01 } from '@/state/timeline';
import { subscribe } from '@/state/ticker';

const PRODUCTS = [
  {
    name: 'PAR Assist',
    tag: 'Conversational AI',
    line: 'Agents that speak like your best people — trained on your business.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.8L3 20l1-4.1a8.4 8.4 0 1 1 17-4.4Z" />
        <circle cx="9" cy="11.5" r="0.9" fill="currentColor" />
        <circle cx="14.5" cy="11.5" r="0.9" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'PAR Cloud',
    tag: 'Elastic Infrastructure',
    line: 'Compute that breathes with demand. Deploy anywhere, scale everywhere.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 18.5H7a4.5 4.5 0 1 1 .8-8.9A6 6 0 0 1 19.4 12a3.3 3.3 0 0 1-1.9 6.5Z" />
      </svg>
    ),
  },
  {
    name: 'PAR Shield',
    tag: 'Cyber Security',
    line: 'Threat detection and defense that never sleeps, never blinks.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 5 5.8v5.2c0 4.4 3 8.4 7 9.9 4-1.5 7-5.5 7-9.9V5.8L12 3Z" />
        <path d="m9.2 11.6 2 2.2 3.8-4.4" />
      </svg>
    ),
  },
  {
    name: 'PAR Insights',
    tag: 'Data Analytics',
    line: 'Every metric, alive. Data pipelines that turn noise into decisions.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V9M10 20V4M16 20v-8M21 20H3" />
      </svg>
    ),
  },
];

export default function EcoCards() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    return subscribe(() => {
      const o = window01(timeline.progress, 0.702, 0.728, 0.772, 0.798);
      el.style.opacity = String(o);
      el.style.visibility = o > 0.001 ? 'visible' : 'hidden';
      el.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
    });
  }, []);

  // magnetic hover physics per card
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / r.width;
    const dy = (e.clientY - r.top - r.height / 2) / r.height;
    card.style.setProperty('--tx', `${dx * 10}px`);
    card.style.setProperty('--ty', `${dy * 10}px`);
    card.style.setProperty('--rx', `${-dy * 7}deg`);
    card.style.setProperty('--ry', `${dx * 9}deg`);
  };
  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty('--tx', '0px');
    card.style.setProperty('--ty', '0px');
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  return (
    <div ref={root} className="eco">
      <div className="eco-grid">
        {PRODUCTS.map((prod, i) => (
          <div
            key={prod.name}
            className="eco-card"
            style={{ animationDelay: `${i * 0.9}s` }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
          >
            <div className="eco-icon">{prod.icon}</div>
            <div className="eco-tag">{prod.tag}</div>
            <div className="eco-name">{prod.name}</div>
            <p className="eco-line">{prod.line}</p>
            <div className="eco-sheen" />
          </div>
        ))}
      </div>
    </div>
  );
}
