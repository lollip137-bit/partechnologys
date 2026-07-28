'use client';

const STEPS = [
  {
    name: 'Discover',
    line: 'Audit your operations, find the highest-ROI target.',
    icon: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4.3-4.3" /></>,
  },
  {
    name: 'Design',
    line: 'Architecture, prototypes, a roadmap you can see.',
    icon: <><path d="M3 20h18" /><path d="M6 20V9l6-5 6 5v11" /><path d="M10 20v-6h4v6" /></>,
  },
  {
    name: 'Build',
    line: 'Weekly ships. Production-grade from day one.',
    icon: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" /></>,
  },
  {
    name: 'Scale',
    line: 'Monitor, iterate, compound the growth.',
    icon: <><path d="M4 19h16" /><path d="m5 15 4-5 4 3 6-8" /><path d="M19 5h-4M19 5v4" /></>,
  },
];

/** The engagement rail — a pulse of light travels the whole journey. */
export default function Flow() {
  return (
    <div className="flow">
      <span className="flow-pulse" aria-hidden />
      {STEPS.map((s) => (
        <div className="flow-step" key={s.name} data-a>
          <span className="flow-dot">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              {s.icon}
            </svg>
          </span>
          <span className="flow-name">{s.name}</span>
          <span className="flow-line">{s.line}</span>
        </div>
      ))}
    </div>
  );
}

/** Generated visual panels — real art without stock photography. */
export function ArtCard({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="art-card" data-a>
      <span className="art-mesh" aria-hidden />
      <span className="art-grid" aria-hidden />
      <span className="art-label">
        {label}
        <span className="art-sub">{sub}</span>
      </span>
    </div>
  );
}
