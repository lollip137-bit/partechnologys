'use client';

import Link from 'next/link';
import PageShell from '@/ui/PageShell';
import { PROJECTS } from '@/content/site';
import { ProjectWindow, ProjectModal, useProjectPreview } from '@/ui/Projects';
import { DeliveredSection } from '@/ui/LibraryShowcase';

export default function LibraryClient() {
  const preview = useProjectPreview();
  return (
    <PageShell
      kicker="THE FULL LIBRARY"
      title="Every system we can show you."
      sub="Websites we have delivered, platforms we run, and the design library behind them.
           Some of our best work runs under NDA — ask us about it."
    >
      {/* real, running websites — screenshots of the actual builds */}
      <DeliveredSection />

      {/* the mockup library lives on its own page */}
      <section className="sec">
        <div className="wrap">
          <div className="lib-bridge" data-a>
            <div>
              <div className="sec-kicker">MOCKUP &amp; DEMO LIBRARY</div>
              <h2 className="sec-title">See every version we saved.</h2>
              <p className="library-sub">
                Thirteen preserved concepts — the spiral particle field, the living nebula, the
                ten-act journey, the Men’s Hub and PAR Group finals, and more.
              </p>
            </div>
            <Link className="finale-cta" href="/library/mockups">Open the mockup library</Link>
          </div>
        </div>
      </section>

      {/* platform work */}
      <section className="sec sec-alt">
        <div className="wrap">
          <div className="sec-kicker" data-a>PLATFORMS &amp; SYSTEMS</div>
          <h2 className="sec-title" data-a>Software that runs the business.</h2>
          <p className="library-sub" data-a>
            Agents, models and platforms in production. Client names are withheld where the work is
            under NDA; the numbers are real.
          </p>
          <div className="lib-grid">
            {PROJECTS.map((p) => (
              <div key={p.id} data-a>
                <ProjectWindow p={p} onPreview={preview.open} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectModal p={preview.active} onClose={preview.close} />
    </PageShell>
  );
}
