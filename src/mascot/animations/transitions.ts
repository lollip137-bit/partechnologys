import gsap from "gsap";
import type { Drive } from "./drive";
import { BUILDERS } from "./states";
import type { MascotState } from "../useMascotState";

/**
 * Interrupt/blend manager.
 * ----------------------------------------------------------------------------
 * Holds the single "active" timeline. When the resolved state changes we build
 * the new state's timeline; GSAP's `overwrite: "auto"` inside each builder
 * ensures the new tweens seize any drive property the old timeline was still
 * moving — so we get a smooth blend from wherever the values currently are,
 * never a snap. We keep a handle only so an infinitely-repeating timeline
 * (thinking's pulse) is explicitly killed when we leave the state.
 */
export class TransitionManager {
  private drive: Drive;
  private active: gsap.core.Timeline | null = null;
  private activeState: MascotState | null = null;

  /** Screen edge PARi hid behind: -1 left, +1 right. Set before hiding. */
  hideDir = 1;

  constructor(drive: Drive) {
    this.drive = drive;
  }

  /** Switch to `state`. No-op if already there. */
  go(state: MascotState) {
    if (state === this.activeState) return;
    // Kill only the previous timeline's *repeating* residue; property tweens
    // are overwritten by the new builder, but a yoyo/repeat:-1 tween must be
    // stopped explicitly or it keeps running forever.
    if (this.active) this.active.kill();
    this.active = BUILDERS[state](this.drive, this.hideDir);
    this.activeState = state;
  }

  current() {
    return this.activeState;
  }

  dispose() {
    if (this.active) this.active.kill();
    this.active = null;
    this.activeState = null;
  }
}
