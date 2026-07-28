'use client';

import { useState } from 'react';
import type { Project } from '@/content/site';

/** A browser-window mockup card — the site "library" format. */
export function ProjectWindow({ p, onPreview }: { p: Project; onPreview: (p: Project) => void }) {
  return (
    <div className="pwin">
      <div className="pwin-bar">
        <span className="pwin-dot" /><span className="pwin-dot" /><span className="pwin-dot" />
        <span className="pwin-url">{p.kind}</span>
      </div>
      <div className="pwin-body" style={{ background: `linear-gradient(135deg, ${p.grad[0]}, ${p.grad[1]})` }}>
        <div className="pwin-art">
          <span className="pwin-art-ring" />
          <span className="pwin-art-bar b1" />
          <span className="pwin-art-bar b2" />
          <span className="pwin-art-bar b3" />
        </div>
        <button className="pwin-preview" onClick={() => onPreview(p)}>Preview</button>
      </div>
      <div className="pwin-meta">
        <span className="pwin-tag">{p.tag}</span>
        <div className="pwin-title">{p.title}</div>
        <p className="pwin-line">{p.line}</p>
      </div>
    </div>
  );
}

export function ProjectModal({ p, onClose }: { p: Project | null; onClose: () => void }) {
  if (!p) return null;
  return (
    <div className="pmodal" onClick={onClose}>
      <div className="pmodal-card" onClick={(e) => e.stopPropagation()}>
        <button className="pmodal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="pwin-bar">
          <span className="pwin-dot" /><span className="pwin-dot" /><span className="pwin-dot" />
          <span className="pwin-url">{p.kind}</span>
        </div>
        <div className="pmodal-hero" style={{ background: `linear-gradient(135deg, ${p.grad[0]}, ${p.grad[1]})` }}>
          <div className="pwin-art big">
            <span className="pwin-art-ring" />
            <span className="pwin-art-bar b1" />
            <span className="pwin-art-bar b2" />
            <span className="pwin-art-bar b3" />
          </div>
        </div>
        <div className="pmodal-info">
          <span className="pwin-tag">{p.tag}</span>
          <h3>{p.title}</h3>
          <p>{p.line}</p>
          <ul>
            {p.points.map((pt) => <li key={pt}>{pt}</li>)}
          </ul>
          <span className="pmodal-note">Full case study available on request.</span>
        </div>
      </div>
    </div>
  );
}

export function useProjectPreview() {
  const [active, setActive] = useState<Project | null>(null);
  return { active, open: setActive, close: () => setActive(null) };
}
