import { mascotStore } from "../useMascotState";
import { startCursorTracking } from "./cursorTracking";
import { startScrollReaction } from "./scrollReaction";
import { startIdleTimers } from "./idleTimers";
import { normalizedCenter } from "./lookAtElement";

/**
 * Composes every behavior and wires the generic DOM contract so the machine
 * works on ANY page content via data attributes (no per-component coupling):
 *
 *   [data-mascot="section"]  in view > 4s  -> curious  (head tilt, looks over)
 *   [data-mascot="card"]     hovered        -> excited  (bob up, happy eyes)
 *   [data-mascot="cta"]      cursor < 120px -> anticipating (handled in cursorTracking)
 *   [data-mascot="form"]     submit         -> celebrate
 *
 * Also installs `window.Drax` for imperative control (chat wires open/close in).
 */
export interface DraxApi {
  celebrate: () => void;
  open?: () => void;
  close?: () => void;
}

declare global {
  interface Window {
    Drax?: DraxApi;
  }
}

export function startBehaviors(): () => void {
  const store = mascotStore.getState;
  const cleanups: Array<() => void> = [];

  cleanups.push(startCursorTracking());
  cleanups.push(startScrollReaction());
  cleanups.push(startIdleTimers());

  // --- curious: section dwell > 4s -----------------------------------------
  const dwellTimers = new Map<Element, ReturnType<typeof setTimeout>>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        const el = en.target;
        if (en.isIntersecting && en.intersectionRatio >= 0.5) {
          if (!dwellTimers.has(el)) {
            dwellTimers.set(
              el,
              setTimeout(() => {
                store().setLookTarget(normalizedCenter(el));
                store().hold("section", "curious");
              }, 4000),
            );
          }
        } else {
          const t = dwellTimers.get(el);
          if (t) {
            clearTimeout(t);
            dwellTimers.delete(el);
          }
          // if this section owned the curious hold, release it
          store().hold("section", null);
        }
      }
    },
    { threshold: [0, 0.5, 1] },
  );
  const sections = document.querySelectorAll('[data-mascot="section"]');
  sections.forEach((s) => io.observe(s));
  cleanups.push(() => {
    io.disconnect();
    dwellTimers.forEach(clearTimeout);
    dwellTimers.clear();
  });

  // --- excited: hover a card -----------------------------------------------
  const onOver = (e: Event) => {
    const el = (e.target as HTMLElement)?.closest?.('[data-mascot="card"]');
    if (!el) return;
    store().setLookTarget(normalizedCenter(el));
    store().hold("hover", "excited");
  };
  const onOut = (e: Event) => {
    const el = (e.target as HTMLElement)?.closest?.('[data-mascot="card"]');
    if (!el) return;
    // only release if we've actually left the card (not moved to a child)
    const to = (e as MouseEvent).relatedTarget as HTMLElement | null;
    if (to && el.contains(to)) return;
    store().hold("hover", null);
  };
  document.addEventListener("mouseover", onOver, { passive: true });
  document.addEventListener("mouseout", onOut, { passive: true });
  cleanups.push(() => {
    document.removeEventListener("mouseover", onOver);
    document.removeEventListener("mouseout", onOut);
  });

  // --- celebrate: form submit ----------------------------------------------
  const celebrate = () => {
    store().fire("celebrate", 1500);
    store().setMood("excited");
  };
  const onSubmit = (e: Event) => {
    const el = (e.target as HTMLElement)?.closest?.('[data-mascot="form"]');
    if (el) celebrate();
  };
  document.addEventListener("submit", onSubmit, true);
  cleanups.push(() => document.removeEventListener("submit", onSubmit, true));

  // --- imperative API -------------------------------------------------------
  const api: DraxApi = { ...(window.Drax ?? {}), celebrate };
  window.Drax = api;
  cleanups.push(() => {
    if (window.Drax === api) delete window.Drax;
  });

  return () => cleanups.forEach((c) => c());
}
