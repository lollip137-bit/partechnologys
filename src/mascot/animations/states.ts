import gsap from "gsap";
import type { Drive } from "./drive";
import { LOGO_INTENSITY } from "../design";
import type { MascotState } from "../useMascotState";

/**
 * One builder per state -> a GSAP timeline that tweens the shared `drive`.
 * Every tween uses `overwrite: "auto"` so a new state's timeline cleanly steals
 * any property an old one was still animating (brief §5 rule: never snap, never
 * let two timelines fight the same property).
 *
 * A neutral "resting" pose that most builders return toward:
 *   eyeOpen 1 · happy/wide/narrow/sad 0 · tilt 0 · bob 1 · sink 0 · scale 1
 */

const DUR = 0.55; // default transition seconds
const EASE = "power2.out";

/**
 * `hideDir` is the screen edge Drax hid behind (-1 left, +1 right); only the
 * hide/peek pair use it, so every other builder simply ignores it.
 */
type Builder = (d: Drive, hideDir?: number) => gsap.core.Timeline;

/** Shared helper: tween a resting expression, returning the timeline. */
function toRest(tl: gsap.core.Timeline, d: Drive, extra: Partial<Drive> = {}) {
  tl.to(
    d,
    {
      eyeOpen: 1,
      happy: 0,
      wide: 0,
      narrow: 0,
      sad: 0,
      headTiltZ: 0,
      tiltZ: 0,
      bob: 1,
      sinkY: 0,
      scale: 1,
      spin: 0,
      offsetX: 0,
      offsetY: 0,
      logoIntensity: LOGO_INTENSITY.idle,
      accentIntensity: 1.0,
      ringOpacity: 0,
      breathe: 0,
      flicker: 0,
      lookInfluence: 1,
      duration: DUR,
      ease: EASE,
      overwrite: "auto",
      ...extra,
    },
    0,
  );
  return tl;
}

export const boot: Builder = (d) => {
  const tl = gsap.timeline();
  // one eye opens, then the other, small settle. (Eye stagger handled in shader
  // via eyeOpen for both; we fake the "one then other" with a quick wide beat.)
  d.eyeOpen = 0;
  tl.to(d, { eyeOpen: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" }, 0.15)
    .to(d, { wide: 0.6, duration: 0.25, ease: "power2.out", overwrite: "auto" }, 0.4)
    .to(d, { wide: 0, happy: 0.4, duration: 0.4, ease: "power2.out" }, 0.75)
    .to(d, { happy: 0, scale: 1, logoIntensity: LOGO_INTENSITY.idle, duration: 0.5, ease: "power2.inOut" }, 1.2);
  return tl;
};

export const idle: Builder = (d) => toRest(gsap.timeline(), d);

export const tracking: Builder = (d) => {
  const tl = gsap.timeline();
  toRest(tl, d, { lookInfluence: 1 });
  return tl;
};

export const curious: Builder = (d) => {
  const tl = gsap.timeline();
  tl.to(
    d,
    {
      eyeOpen: 1,
      wide: 0.85,
      happy: 0,
      narrow: 0,
      sad: 0,
      headTiltZ: (12 * Math.PI) / 180, // 12° tilt
      bob: 1.05,
      sinkY: 0,
      scale: 1,
      logoIntensity: LOGO_INTENSITY.idle,
      duration: DUR,
      ease: EASE,
      overwrite: "auto",
    },
    0,
  );
  return tl;
};

export const excited: Builder = (d) => {
  const tl = gsap.timeline();
  tl.to(
    d,
    {
      eyeOpen: 1,
      happy: 1,
      wide: 0.2,
      narrow: 0,
      sad: 0,
      headTiltZ: 0,
      bob: 1.6, // bob amplitude up
      sinkY: 0.03,
      scale: 1.04,
      accentIntensity: 1.5, // accent brightens
      logoIntensity: 1.4,
      duration: 0.4,
      ease: "back.out(2)",
      overwrite: "auto",
    },
    0,
  );
  return tl;
};

export const anticipating: Builder = (d) => {
  const tl = gsap.timeline();
  // glance at the button, then back toward the cursor — expressed as a quick
  // lookInfluence dip/return plus a small eager lean.
  tl.to(d, {
    eyeOpen: 1,
    wide: 0.5,
    happy: 0.35,
    narrow: 0,
    sad: 0,
    headTiltZ: (5 * Math.PI) / 180,
    bob: 1.2,
    scale: 1.02,
    accentIntensity: 1.25,
    duration: 0.35,
    ease: EASE,
    overwrite: "auto",
  });
  return tl;
};

export const thinking: Builder = (d) => {
  const tl = gsap.timeline();
  tl.to(
    d,
    {
      eyeOpen: 0.85,
      narrow: 0.7, // focused
      happy: 0,
      wide: 0,
      sad: 0,
      headTiltZ: (-4 * Math.PI) / 180,
      bob: 0.7,
      scale: 1,
      ringOpacity: 1, // orbiting particle ring on
      logoIntensity: LOGO_INTENSITY.thinking,
      accentIntensity: 1.6,
      duration: 0.5,
      ease: EASE,
      overwrite: "auto",
    },
    0,
  );
  // slow chest-logo pulse while thinking
  tl.to(d, {
    logoIntensity: LOGO_INTENSITY.thinking * 0.7,
    duration: 0.9,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
  return tl;
};

export const speaking: Builder = (d) => {
  const tl = gsap.timeline();
  tl.to(
    d,
    {
      eyeOpen: 1,
      happy: 0.3,
      wide: 0.15,
      narrow: 0,
      sad: 0,
      headTiltZ: 0,
      bob: 1.1,
      ringOpacity: 0,
      logoIntensity: 1.3,
      accentIntensity: 1.3,
      flicker: 0.4,
      duration: 0.45,
      ease: EASE,
      overwrite: "auto",
    },
    0,
  );
  return tl;
};

export const celebrate: Builder = (d) => {
  const tl = gsap.timeline();
  tl.to(d, {
    eyeOpen: 1,
    happy: 1,
    wide: 0.3,
    narrow: 0,
    sad: 0,
    headTiltZ: 0,
    bob: 1.8,
    scale: 1.08,
    logoIntensity: LOGO_INTENSITY.celebrate, // brief flash
    accentIntensity: 2.0,
    duration: 0.25,
    ease: "back.out(3)",
    overwrite: "auto",
  })
    .to(d, { spin: Math.PI * 2, duration: 1.1, ease: "power2.inOut" }, 0)
    .to(d, { logoIntensity: LOGO_INTENSITY.idle, accentIntensity: 1.0, duration: 0.6, ease: "power1.out" }, 0.9)
    .set(d, { spin: 0 }); // reset spin accumulator after the full turn
  return tl;
};

export const sleepy: Builder = (d) => {
  const tl = gsap.timeline();
  tl.to(
    d,
    {
      eyeOpen: 0.4, // half-lid
      happy: 0,
      wide: 0,
      narrow: 0.2,
      sad: 0,
      headTiltZ: (-6 * Math.PI) / 180,
      bob: 0.5, // slower/smaller float
      sinkY: -0.23, // sink ~20px
      scale: 1,
      logoIntensity: 0.7,
      accentIntensity: 0.7,
      duration: 1.0,
      ease: "power1.inOut",
      overwrite: "auto",
    },
    0,
  );
  return tl;
};

export const asleep: Builder = (d) => {
  const tl = gsap.timeline();
  tl.to(
    d,
    {
      eyeOpen: 0.04, // closed (thin line)
      happy: 0,
      wide: 0,
      narrow: 0,
      sad: 0,
      headTiltZ: (-8 * Math.PI) / 180,
      bob: 0.25,
      sinkY: -0.28,
      scale: 1,
      logoIntensity: 0.45,
      accentIntensity: 0.5,
      breathe: 1, // occasional slow breath
      duration: 1.2,
      ease: "power1.inOut",
      overwrite: "auto",
    },
    0,
  );
  return tl;
};

/**
 * Frame geometry, in world units.
 *
 * The mascot's canvas is a small ~210x240 corner box with the camera framed so
 * the WHOLE idle mascot fits with margin (see Mascot.tsx). At that framing the
 * visible half-width is ~1.23 and half-height ~1.4. Anything beyond those is
 * off-screen, which is what the hide/peek offsets are built from. Tuned once
 * here rather than sprinkled as magic numbers: an earlier version used values
 * meant for a full-page canvas and pushed Drax almost entirely out of frame,
 * so only a sliver ever showed during a peek.
 */
const OFF_X = 1.7; // clears the frame horizontally
const OFF_Y = 2.3; // clears it vertically (the body is ~2.15 tall)
const PEEK_X = 0.62; // leaning in from a side edge, most of the body visible
const PEEK_Y = 0.78; // leaning in from top/bottom

/** The four edges Drax can hide behind and re-enter from. */
const EDGES = [
  { x: -1, y: 0 }, // left
  { x: 1, y: 0 }, // right
  { x: 0, y: 1 }, // top
  { x: 0, y: -1 }, // bottom
] as const;

/**
 * Peeks in from a RANDOM edge, leaning its whole body around the corner,
 * watches for a moment, then ducks back out the way it came.
 *
 * Deliberately independent of `hideDir` (the edge it originally withdrew
 * behind): Drax slips off one side and reappears somewhere else entirely, so
 * you never know where it's coming from next. It's off-screen and invisible
 * between peeks, so relocating to a new edge is free.
 *
 * The lean is a WHOLE-BODY tilt (`tiltZ`, applied at the root) rather than a
 * head cock — that's what sells "leaning around a corner" instead of just
 * looking sideways.
 */
export const peeking: Builder = (d) => {
  const tl = gsap.timeline();

  const edge = EDGES[Math.floor(Math.random() * EDGES.length)];
  const horizontal = edge.x !== 0;

  // Where it waits off-screen, and how far it leans into view.
  const offX = edge.x * OFF_X;
  const offY = edge.y * OFF_Y;
  const depth = 0.85 + Math.random() * 0.3; // vary how far it commits
  const inX = horizontal ? edge.x * PEEK_X * depth : (Math.random() - 0.5) * 0.5;
  const inY = horizontal ? 0 : edge.y * PEEK_Y * depth;

  // Whole-body lean, 20°-50°, direction depending on which edge it came from.
  // Coming from the left, the body tips right (negative Z) so the head leads
  // into view — and vice versa. From top/bottom there's no "correct" way to
  // lean, so it picks a side at random for variety.
  const magnitude = ((20 + Math.random() * 30) * Math.PI) / 180;
  const tiltSign = horizontal ? edge.x : Math.random() < 0.5 ? -1 : 1;
  const tiltRad = tiltSign * magnitude;

  const holdSeconds = 0.6 + Math.random() * 0.8;

  tl.set(d, {
    offsetX: offX,
    offsetY: offY,
    tiltZ: tiltRad * 0.6, // already leaning as it emerges
    eyeOpen: 0.2,
    happy: 0,
    sad: 0,
    angry: 0,
    heat: 0,
    shake: 0,
  })
    // lean in around the corner, whole body
    .to(d, {
      offsetX: inX,
      offsetY: inY,
      tiltZ: tiltRad,
      eyeOpen: 1,
      wide: 1,
      duration: 0.6,
      ease: "back.out(1.4)",
    })
    // settle into watching you
    .to(d, { wide: 0.55, happy: 0.5, duration: 0.5, ease: "sine.inOut" })
    .to(d, {}, `+=${holdSeconds}`) // hold the stare, a different length each time
    // duck back out the way it came
    .to(d, {
      offsetX: offX,
      offsetY: offY,
      tiltZ: tiltRad * 0.5,
      wide: 0,
      happy: 0,
      eyeOpen: 0.4,
      duration: 0.5,
      ease: "power2.in",
    });
  return tl;
};

/** Held by the user: eyes wide, body stiffens, ambient float suspended. */
export const dragging: Builder = (d) => {
  const tl = gsap.timeline();
  tl.to(d, {
    eyeOpen: 1,
    wide: 1,
    happy: 0,
    narrow: 0,
    sad: 0,
    angry: 0,
    heat: 0,
    shake: 0,
    headTiltZ: 0,
    bob: 0, // stop floating — it's being carried
    sinkY: 0,
    scale: 1.06,
    accentIntensity: 1.5,
    duration: 0.22,
    ease: "power3.out",
    overwrite: "auto",
  });
  return tl;
};

/**
 * Annoyed. Brows down, colour runs hot, and a tremble that decays — a sulk
 * that settles rather than a loop, so it never nags.
 */
export const annoyed: Builder = (d) => {
  const tl = gsap.timeline();
  tl.to(
    d,
    {
      eyeOpen: 1,
      angry: 1,
      narrow: 0.45,
      happy: 0,
      wide: 0,
      sad: 0,
      heat: 1,
      headTiltZ: (-7 * Math.PI) / 180,
      bob: 0.8,
      scale: 1.03,
      accentIntensity: 1.7,
      logoIntensity: 1.5,
      duration: 0.18,
      ease: "power3.out",
      overwrite: "auto",
    },
    0,
  );
  // a sharp shudder that dies away
  tl.fromTo(d, { shake: 1 }, { shake: 0, duration: 1.1, ease: "power2.out" }, 0.05);
  // huff: a few quick nods
  tl.to(
    d,
    { headTiltZ: (7 * Math.PI) / 180, duration: 0.12, yoyo: true, repeat: 3, ease: "sine.inOut" },
    0.05,
  );
  // cool off, but stay a little narrow-eyed about it
  tl.to(d, { heat: 0.22, angry: 0.45, accentIntensity: 1.2, duration: 1.2, ease: "power1.inOut" }, 1.3);
  return tl;
};

/** Dismissed: slides off the nearest edge and stays gone until it peeks. */
export const hiding: Builder = (d, hideDir = 1) => {
  const tl = gsap.timeline();
  tl.to(d, {
    // slips out sideways past the frame edge, leaning as it goes
    offsetX: OFF_X * hideDir,
    offsetY: 0,
    tiltZ: (hideDir * 18 * Math.PI) / 180,
    eyeOpen: 0.45,
    wide: 0,
    happy: 0,
    narrow: 0.3,
    angry: 0,
    heat: 0,
    shake: 0,
    bob: 0.4,
    scale: 1,
    accentIntensity: 0.8,
    logoIntensity: 0.6,
    duration: 0.42,
    ease: "power2.in",
    overwrite: "auto",
  });
  return tl;
};

export const BUILDERS: Record<MascotState, Builder> = {
  boot,
  idle,
  tracking,
  curious,
  excited,
  anticipating,
  thinking,
  speaking,
  celebrate,
  sleepy,
  asleep,
  peeking,
  dragging,
  annoyed,
  hiding,
};
