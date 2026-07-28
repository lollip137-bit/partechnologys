'use client';

import PageShell from '@/ui/PageShell';
import { DeliveredSection, MockupSection } from '@/ui/LibraryShowcase';

export default function MockupsClient() {
  return (
    <PageShell
      kicker="MOCKUP & DEMO LIBRARY"
      title="Websites delivered — and every mockup behind them."
      sub="A working archive. Real builds at the top, then the design concepts we saved while
           making them: the spiral particle field, the living nebula, the ten-act journey, the
           Men’s Hub and PAR Group finals, and the contractor demo."
    >
      <DeliveredSection />
      <MockupSection />

      <section className="sec sec-alt">
        <div className="wrap">
          <div className="sec-kicker" data-a>HOW WE WORK WITH CONCEPTS</div>
          <h2 className="sec-title" data-a>Nothing good gets thrown away.</h2>
          <div className="proc-grid">
            <div className="proc-card" data-a>
              <div className="proc-step">01</div>
              <div className="proc-name">Explore in public</div>
              <p className="proc-line">Every direction is built for real — never a flat picture. You scroll it before you choose it.</p>
            </div>
            <div className="proc-card" data-a>
              <div className="proc-step">02</div>
              <div className="proc-name">Freeze the version</div>
              <p className="proc-line">Each concept is preserved as its own browsable snapshot the moment it is finished.</p>
            </div>
            <div className="proc-card" data-a>
              <div className="proc-step">03</div>
              <div className="proc-name">Keep evolving</div>
              <p className="proc-line">The live build moves on. The saved version stays exactly as it was, forever revisitable.</p>
            </div>
            <div className="proc-card" data-a>
              <div className="proc-step">04</div>
              <div className="proc-name">Hand it all over</div>
              <p className="proc-line">Source, assets and every saved concept ship with the project. You own the archive too.</p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
