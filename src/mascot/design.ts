/**
 * Drax — LOCKED DESIGN SPEC (PAR Technologys V3)
 * ----------------------------------------------------------------------------
 * Single source of truth for the mascot's look & motion feel.
 *
 * Character: Drax — PAR Technologys' floating AI companion.
 *
 * Silhouette (COMMITTED):
 *   - Detached head (rounded, slightly flattened dome) hovering just above a
 *     capsule torso. No neck. No legs. Floats.
 *   - Two detached hovering "hand" orbs, one either side, no arms.
 *   - The detached head lets the head yaw/pitch toward the cursor independently
 *     of the body — the core "companion" tell.
 *
 * Face (COMMITTED):
 *   - A single dark curved visor panel fills the head front.
 *   - Two emissive eyes drawn by an SDF fragment shader. No mouth.
 *     Expression = eye shape + head tilt only.
 *
 * PALETTE — derived from the V3 site tokens in app/globals.css:
 *     --black #000104 · --navy-deep #0A0F1D · --navy #111E40
 *     --blue  #2563EB · --cyan #00C2FF      · --ink  #E5E7EB
 *
 *   Shell  = --ink, the site's light neutral (cool off-white)
 *   Visor  = --navy-deep, so it reads against the film's black void
 *   Accent = --cyan, the signature glow used across the particle film
 *   Deep   = --blue, for the cooler rim/secondary light
 */

export const PALETTE = {
  /** Soft matte shell — the site's --ink. */
  shell: "#E5E7EB",
  /** Cooler shadow tint on the underside / seam gaps. */
  shellShadow: "#AEB6C4",
  /** Dark inset visor — the site's --navy-deep. */
  visor: "#0A0F1D",
  /** THE accent: --cyan. Emissive eyes + chest logo + seam. */
  accent: "#00C2FF",
  /** Hotter peak so the glow reads as "energised". */
  accentHot: "#7FE3FF",
  /** Secondary/rim — the site's --blue. */
  deep: "#2563EB",
} as const;

/** Chest-logo emissive intensity per driven parameter. */
export const LOGO_INTENSITY = {
  idle: 1.0,
  thinking: 2.2,
  celebrate: 3.0,
} as const;

/** Always-on ambient motion. Amplitudes in world units / radians. */
export const AMBIENT = {
  floatAmplitude: 0.09, // ~8px on screen at the mascot's scale/depth
  floatPeriod: 3.2, // seconds
  driftAmplitudeZ: (2 * Math.PI) / 180, // ±2° on Z
  driftPeriod: 6.0, // seconds, out of phase with float
  blinkMin: 2.0, // seconds
  blinkMax: 6.0, // seconds
  blinkClose: 0.12, // seconds close+open
} as const;

/** Head look clamp — tracking clamped ±35°. */
export const LOOK_CLAMP = (35 * Math.PI) / 180;

/** Lerp factor for head-toward-cursor — never instant. */
export const LOOK_LERP = 0.08;
