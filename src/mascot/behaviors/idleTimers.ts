import { mascotStore } from "../useMascotState";

/**
 * Inactivity escalation (brief §5):
 *   45s  -> sleepy
 *   120s -> asleep
 *   180s -> peeking (asleep + 60s): exits and re-enters frame, then back to asleep
 *   ...and it keeps peeking every 60s while still idle.
 * ANY user input resets the whole clock and releases the sleep hold.
 */
const SLEEPY_MS = 45_000;
const ASLEEP_MS = 120_000;
const PEEK_AFTER_ASLEEP_MS = 60_000;
const PEEK_DURATION_MS = 3200;

export function startIdleTimers(): () => void {
  const store = mascotStore.getState;
  const timers: ReturnType<typeof setTimeout>[] = [];

  const clearAll = () => {
    timers.forEach(clearTimeout);
    timers.length = 0;
  };

  const schedulePeek = () => {
    // reduced-motion kills peeking entirely (brief §1.4) — just stay asleep.
    if (store().reducedMotion) return;
    timers.push(
      setTimeout(() => {
        store().fire("peeking", PEEK_DURATION_MS);
        // after the peek, return to asleep and queue the next peek
        timers.push(
          setTimeout(() => {
            store().hold("idle", "asleep");
            schedulePeek();
          }, PEEK_DURATION_MS + 50),
        );
      }, PEEK_AFTER_ASLEEP_MS),
    );
  };

  const arm = () => {
    clearAll();
    timers.push(setTimeout(() => store().hold("idle", "sleepy"), SLEEPY_MS));
    timers.push(
      setTimeout(() => {
        store().hold("idle", "asleep");
        schedulePeek();
      }, ASLEEP_MS),
    );
  };

  const reset = () => {
    store().hold("idle", null);
    arm();
  };

  const events: (keyof WindowEventMap)[] = [
    "mousemove",
    "mousedown",
    "keydown",
    "wheel",
    "touchstart",
    "scroll",
  ];
  events.forEach((e) => window.addEventListener(e, reset, { passive: true }));

  arm(); // start the clock

  return () => {
    clearAll();
    events.forEach((e) => window.removeEventListener(e, reset));
    store().hold("idle", null);
  };
}
