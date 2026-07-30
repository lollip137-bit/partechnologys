'use client';

import { STACK_GROUPS, safeHex, type Tech } from '@/content/stack';

/**
 * The stack, in full colour.
 *
 * Marks are the official vendor vectors where they exist; the handful that no
 * longer ship one (AWS, Azure, OpenAI, Java, Pinecone, Chroma) appear as a
 * lettermark in the brand's own colour rather than a hand-drawn imitation.
 *
 * Each tile lifts and saturates on hover — transform and opacity only, and the
 * colour glow is a static shadow that does not animate, so nothing here
 * re-rasterizes per frame.
 */
export function TechMark({ tech, size = 26 }: { tech: Tech; size?: number }) {
  const colour = `#${safeHex(tech.hex)}`;
  if (tech.path) {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label={tech.name} width={size} height={size} fill={colour}>
        <path d={tech.path} />
      </svg>
    );
  }
  return (
    <span className="tech-letter" style={{ color: colour, fontSize: size * 0.42 }} aria-label={tech.name}>
      {tech.mark}
    </span>
  );
}

export default function TechStack() {
  return (
    <section className="sec sec-alt" id="stack">
      <div className="wrap">
        <div className="sec-kicker" data-a>THE STACK WE BUILD ON</div>
        <h2 className="sec-title" data-a>Your team’s tools, not ours.</h2>
        <p className="library-sub" data-a>
          We work in the technologies your engineers already trust — so what we hand over is
          something your team can own, not a black box only we understand.
        </p>

        <div className="stack-groups">
          {STACK_GROUPS.map((g) => (
            <div className="stack-group" key={g.group} data-a>
              <div className="stack-group-head">
                <h3 className="stack-group-name">{g.group}</h3>
                <span className="stack-group-line">{g.line}</span>
              </div>
              <div className="stack-row">
                {g.items.map((tech) => (
                  <span
                    className="tech-tile"
                    key={g.group + tech.name}
                    style={{ ['--tech' as string]: `#${safeHex(tech.hex)}` }}
                  >
                    <TechMark tech={tech} />
                    <span className="tech-name">{tech.name}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
