/**
 * The "drive" object.
 * ----------------------------------------------------------------------------
 * ONE plain object of scalar targets. GSAP timelines are the ONLY writers.
 * useFrame is the ONLY reader — it composes these with procedural ambient
 * motion (float / blink / drift) and writes the result to the actual Object3D
 * transforms and material uniforms.
 *
 * Because GSAP owns every field and every tween uses `overwrite: 'auto'`, two
 * timelines can never fight over the same property (brief §5 rule).
 */
export interface Drive {
  /** Eyelid openness 0 (closed) .. 1 (open). Blink multiplies this at render. */
  eyeOpen: number;
  /** Expression blends, 0..1, mixed in the eye shader. */
  happy: number; // happy arc
  wide: number; // wide / curious
  narrow: number; // narrow / focused
  sad: number; // flat / disappointed
  angry: number; // inner brows down — annoyed / cross
  /** How strongly the eyes slide toward the look direction, 0..1. */
  lookInfluence: number;

  /** Irritated tremble, 0..1. Scales a fast positional jitter. */
  shake: number;
  /** How far the eye colour shifts from accent toward hot amber, 0..1. */
  heat: number;

  /** Extra head tilt on Z, radians (curious = ~12°). Head only. */
  headTiltZ: number;
  /**
   * WHOLE-BODY tilt on Z, radians — head, torso and hands together, applied at
   * the root. This is what makes a peek read as leaning around a corner
   * rather than just cocking the head.
   */
  tiltZ: number;
  /** Float amplitude multiplier (excited > 1, sleepy < 1). */
  bob: number;
  /** Vertical world offset — sleepy sink (~ -0.23 ≈ 20px). */
  sinkY: number;
  /** Overall scale multiplier. */
  scale: number;
  /** Extra continuous Y spin, radians (celebrate). */
  spin: number;
  /** Horizontal world offset used by hiding/peeking (exits/enters frame). */
  offsetX: number;
  /**
   * Vertical world offset used by hiding/peeking. Paired with offsetX so Drax
   * can leave and re-enter from ANY edge — left, right, top or bottom — not
   * just the two horizontal ones.
   */
  offsetY: number;

  /**
   * Dr. Strange portal open amount, 0 (shut) .. 1 (fully open). Drives the
   * sparking energy ring Drax steps through when it hides / peeks. Scales its
   * size, opacity and spark intensity together.
   */
  portal: number;
  /** Portal centre in world units — placed at whichever edge Drax uses. */
  portalX: number;
  portalY: number;

  /** Chest-logo emissive intensity (idle 1.0 · thinking 2.2 · celebrate 3.0). */
  logoIntensity: number;
  /** Eyes/seam emissive intensity. */
  accentIntensity: number;

  /** Thinking particle-ring opacity 0..1. */
  ringOpacity: number;
  /** Asleep slow-breath amplitude 0..1. */
  breathe: number;
  /** Speaking eye-flicker intensity 0..1 (bumped on each token). */
  flicker: number;
}

export function createDrive(): Drive {
  return {
    eyeOpen: 0, // starts closed; boot opens the eyes
    happy: 0,
    wide: 0,
    narrow: 0,
    sad: 0,
    angry: 0,
    lookInfluence: 1,
    shake: 0,
    heat: 0,
    headTiltZ: 0,
    tiltZ: 0,
    bob: 1,
    sinkY: 0,
    scale: 1,
    spin: 0,
    offsetX: 0,
    offsetY: 0,
    portal: 0,
    portalX: 0,
    portalY: 0,
    logoIntensity: 1.0,
    accentIntensity: 1.0,
    ringOpacity: 0,
    breathe: 0,
    flicker: 0,
  };
}
