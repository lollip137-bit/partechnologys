'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ReelTarget {
  title: string;
  /** self-hosted capture of the landing page, on OUR domain */
  reel: string;
  /** neutral label for the window — never a client domain */
  label: string;
}

/**
 * A landing page, playing.
 *
 * Deliberately NOT an iframe of the client's deployment: an iframe publishes
 * the client's URL in our page source and hands the visitor the whole site to
 * click through and inspect. This plays a capture we host ourselves — the
 * design is on show, the build is not. There is no link out, no address, and
 * nothing to navigate into.
 */
export default function ReelPlayer({ target, onClose }: {
  target: ReelTarget | null;
  onClose: () => void;
}) {
  const vid = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hint, setHint] = useState(true);
  const scrubbing = useRef(false);
  const releaseAt = useRef(0);

  useEffect(() => { setReady(false); setProgress(0); setHint(true); }, [target]);

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [target, onClose]);

  useEffect(() => {
    if (!target || !ready) return;
    const t = window.setTimeout(() => setHint(false), 4600);
    return () => window.clearTimeout(t);
  }, [target, ready]);

  // wheel = timeline. Scrolling walks the page exactly as it does on the
  // real site, because the capture IS a scroll-through.
  const onWheel = useCallback((e: React.WheelEvent) => {
    const v = vid.current;
    if (!v || !v.duration) return;
    e.preventDefault();
    setHint(false);
    scrubbing.current = true;
    releaseAt.current = performance.now() + 900;
    v.pause();
    const next = v.currentTime + (e.deltaY / 900);
    v.currentTime = Math.max(0, Math.min(v.duration - 0.05, next));
  }, []);

  // hands off for a beat → it carries on by itself
  useEffect(() => {
    if (!target) return;
    const id = window.setInterval(() => {
      const v = vid.current;
      if (!v || !scrubbing.current) return;
      if (performance.now() > releaseAt.current) {
        scrubbing.current = false;
        void v.play().catch(() => {});
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [target]);

  if (!target) return null;

  return (
    <div className="reelbox" role="dialog" aria-modal="true" aria-label={`${target.title} — design preview`}>
      <div className="reelbox-backdrop" onClick={onClose} />

      <div className="reelshell" onClick={(e) => e.stopPropagation()}>
        <div className="reelbar">
          <span className="pwin-dot" /><span className="pwin-dot" /><span className="pwin-dot" />
          {/* a neutral label — the real address is never shown or shipped */}
          <span className="reelbar-label">{target.label}</span>
          <button className="livebar-close" onClick={onClose} aria-label="Close preview">✕</button>
        </div>

        <div
          className="reelstage"
          onWheel={onWheel}
          onContextMenu={(e) => e.preventDefault()}
        >
          <video
            ref={vid}
            className="reelvideo"
            src={target.reel}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            onContextMenu={(e) => e.preventDefault()}
            onCanPlay={() => setReady(true)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setProgress(v.currentTime / v.duration);
            }}
          />
          {/* swallows every pointer event so the design can be watched, never operated */}
          <div className="reelguard" aria-hidden />

          <div className="reelprogress" aria-hidden>
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>

          {!ready && (
            <div className="liveloading">
              <span className="liveloading-ring" aria-hidden />
              <span>Loading the design…</span>
            </div>
          )}

          {ready && hint && (
            <div className="livehint">
              <span aria-hidden>↕</span> Scroll to walk through the page
            </div>
          )}
        </div>

        <div className="livefoot">
          <span className="livefoot-title">{target.title}</span>
          <span className="livefoot-note">Design preview — landing page only.</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Card preview: the reel itself, muted and looping while the pointer is over
 * the card. Flipping between stills read as "cut pictures" — this is the same
 * continuous motion the visitor gets when they open it.
 *
 * `preload="none"` means nothing downloads until someone actually hovers, so a
 * grid of ten cards still costs one poster image each.
 */
export function CardReel({ reel, poster, alt, playing }: {
  reel: string;
  poster: string;
  alt: string;
  playing: boolean;
}) {
  const vid = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    // someone who asked the OS for less motion does not want a grid of
    // cards playing at them
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (playing && !still) {
      void v.play().catch(() => {});
    } else {
      v.pause();
      // back to the top so the next hover starts the story again
      try { v.currentTime = 0; } catch { /* not seekable yet */ }
    }
  }, [playing]);

  // preload="metadata" costs a few KB per card but lets hover start without a
  // stall; the reel itself only downloads when someone actually plays it.
  return (
    <video
      ref={vid}
      className="cardreel"
      src={reel}
      poster={poster}
      aria-label={alt}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      controlsList="nodownload noplaybackrate noremoteplayback"
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
