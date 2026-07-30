"use client";

import { create } from "zustand";

/**
 * The twelve mutually-exclusive mascot states (brief §5).
 * `disappointed` is intentionally NOT here — it is a one-shot EXPRESSION flash
 * (brief lists exactly 12 states), handled via `flash` below while `state`
 * stays `idle`.
 */
export type MascotState =
  | "boot"
  | "idle"
  | "tracking"
  | "curious"
  | "excited"
  | "anticipating"
  | "thinking"
  | "speaking"
  | "celebrate"
  | "sleepy"
  | "asleep"
  | "peeking"
  /** Held by the user, mid-drag. */
  | "dragging"
  /** Poked, flung, or interrupted — Drax is not happy about it. */
  | "annoyed"
  /** Dismissed: slid off the screen edge, waiting to peek back in. */
  | "hiding";

/**
 * Higher wins.
 *
 * `dragging` outranks everything: while the user physically holds Drax, no
 * timer or hover may steal the pose. `hiding` sits just under it — once
 * dismissed, Drax stays gone until it chooses to peek, and idle timers must not
 * drag it back on screen.
 */
export const STATE_PRIORITY: Record<MascotState, number> = {
  dragging: 140,
  hiding: 130,
  boot: 120,
  celebrate: 100,
  annoyed: 95,
  speaking: 90,
  thinking: 80,
  excited: 70,
  anticipating: 60,
  curious: 50,
  peeking: 40,
  tracking: 30,
  asleep: 20,
  sleepy: 15,
  idle: 10,
};

/** Mood carried from the Brain's control block; tints expression subtly. */
export type Mood = "neutral" | "excited" | "thoughtful" | "disappointed";

/** One-shot expression flashes that don't own a state. */
export type Flash = "disappointed" | null;

/** Quality tier — dropped automatically by the fps monitor (brief §6/§3). */
export type Quality = "high" | "low";

const ONESHOT_KEY = "__oneshot__";

interface MascotStore {
  /** The resolved, currently-active state. Read this everywhere. */
  state: MascotState;
  /** Previous resolved state — transitions read this to know where to blend from. */
  prevState: MascotState;
  /** A monotonically increasing id bumped on every resolved-state change. */
  epoch: number;

  /** Brain mood. */
  mood: Mood;
  /** One-shot expression flash (e.g. `disappointed`), independent of `state`. */
  flash: Flash;

  /** Normalized pointer, -1..1, y-up. Written every mousemove (throttled). */
  pointer: { x: number; y: number };
  /** Where the head should look when curious/anticipating; normalized -1..1. */
  lookTarget: { x: number; y: number } | null;
  /** Smoothed scroll velocity for the body lean. */
  scrollVelocity: number;

  /** Screen edge Drax hides behind / peeks from: -1 left, +1 right. */
  hideDir: 1 | -1;

  /** Global runtime flags. */
  reducedMotion: boolean;
  quality: Quality;
  /** True while a real/mock chat request is in flight (for the fps monitor grace). */
  enabled: boolean;

  /** Per-source sticky state requests. Resolver takes the max-priority one. */
  holds: Record<string, MascotState>;

  // ---- actions ----------------------------------------------------------
  /** Set/clear a sticky request for `source`. Pass null to release. */
  hold: (source: string, state: MascotState | null) => void;
  /** Fire a one-shot state for `ms` then auto-release (boot, celebrate, peeking). */
  fire: (state: MascotState, ms: number) => void;
  /** Briefly flash a non-state expression (disappointed). */
  flashExpression: (flash: Exclude<Flash, null>, ms: number) => void;

  setPointer: (x: number, y: number) => void;
  setLookTarget: (t: { x: number; y: number } | null) => void;
  setScrollVelocity: (v: number) => void;
  setMood: (m: Mood) => void;
  setHideDir: (d: 1 | -1) => void;
  setReducedMotion: (r: boolean) => void;
  setQuality: (q: Quality) => void;
  setEnabled: (e: boolean) => void;
}

/** Pure resolver: highest-priority held state, or idle. */
function resolve(holds: Record<string, MascotState>): MascotState {
  let best: MascotState = "idle";
  let bestP = STATE_PRIORITY.idle;
  for (const key in holds) {
    const s = holds[key];
    const p = STATE_PRIORITY[s];
    if (p > bestP) {
      bestP = p;
      best = s;
    }
  }
  return best;
}

// Timers live outside React so they survive re-renders and can be cancelled.
const timers: Record<string, ReturnType<typeof setTimeout>> = {};
let flashTimer: ReturnType<typeof setTimeout> | null = null;

export const useMascotState = create<MascotStore>((set, get) => ({
  state: "boot",
  prevState: "boot",
  epoch: 0,
  mood: "neutral",
  flash: null,
  pointer: { x: 0, y: 0 },
  lookTarget: null,
  scrollVelocity: 0,
  hideDir: 1,
  reducedMotion: false,
  quality: "high",
  enabled: true,
  holds: {},

  hold: (source, state) =>
    set((prev) => {
      const holds = { ...prev.holds };
      if (state === null) delete holds[source];
      else holds[source] = state;
      const next = resolve(holds);
      if (next === prev.state) return { holds };
      return {
        holds,
        state: next,
        prevState: prev.state,
        epoch: prev.epoch + 1,
      };
    }),

  fire: (state, ms) => {
    // A one-shot occupies the shared oneshot slot; a fresh fire replaces it.
    if (timers[ONESHOT_KEY]) clearTimeout(timers[ONESHOT_KEY]);
    get().hold(ONESHOT_KEY, state);
    timers[ONESHOT_KEY] = setTimeout(() => {
      delete timers[ONESHOT_KEY];
      get().hold(ONESHOT_KEY, null);
    }, ms);
  },

  flashExpression: (flash, ms) => {
    if (flashTimer) clearTimeout(flashTimer);
    set({ flash });
    flashTimer = setTimeout(() => {
      flashTimer = null;
      set({ flash: null });
    }, ms);
  },

  setPointer: (x, y) => set({ pointer: { x, y } }),
  setLookTarget: (t) => set({ lookTarget: t }),
  setScrollVelocity: (v) => set({ scrollVelocity: v }),
  setMood: (m) => set({ mood: m }),
  setHideDir: (d) => set({ hideDir: d }),
  setReducedMotion: (r) => set({ reducedMotion: r }),
  setQuality: (q) => set({ quality: q }),
  setEnabled: (e) => set({ enabled: e }),
}));

/** Non-reactive read for use inside useFrame (no per-frame re-render). */
export const mascotStore = useMascotState;
