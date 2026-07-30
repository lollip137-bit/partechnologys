'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import {
  ACESFilmicToneMapping, HalfFloatType, NoToneMapping,
  Vector2, Vector3, PerspectiveCamera,
} from 'three';
import { timeline, smoothstep } from '@/state/timeline';
import { device } from '@/state/ticker';
import { quality, subscribeQuality } from '@/state/quality';
import { STATION } from './phases';

/**
 * Two jobs, and they are deliberately in one component:
 *
 *  1. Project the subject's world position to screen ONCE per frame into
 *     `timeline.focus`, for the particle field and the ambient cosmos to
 *     compose against. This runs at EVERY quality tier — the composition mask
 *     depends on it, so it must never be skipped.
 *  2. Mount the post-processing chain, but only when the frame can afford it.
 *
 * ---- WHY THE CHAIN IS SO SHORT NOW ----
 * Profiled at the brain act on an Intel Iris Xe at 1376x774, bisected one pass
 * at a time. Of a ~38ms frame the chain cost ~19ms:
 *     bloom ~11ms · tone mapping ~4ms · aberration + vignette ~3.6ms
 * while the HDR buffer and the composer itself measured ~0.
 *
 * Bloom's cost is its FULL-RESOLUTION luminance prefilter, not its blur:
 * quartering resolutionScale and disabling mipmapBlur both changed nothing
 * measurable. It is kept because HDR nuclei blooming into real light is the
 * entire look — but it is the first thing the governor takes away.
 *
 * Chromatic aberration is gone: ~1.6ms for an effect that was also fringing
 * every bright streak into red/green/blue.
 *
 * Vignette is gone from the chain and done in CSS instead (`.stage::after`),
 * where it costs zero GPU passes and looks identical.
 *
 * The Noise pass is gone: full-screen film grain at 0.1 opacity, over a dark
 * frame full of fine particles, was a large part of why fast scrolling read as
 * a scratched print. It cost us both frame time and the look we wanted.
 */
export default function PostFX() {
  const gl = useThree((s) => s.gl);

  // Re-render when the governor changes tier, so the composer can unmount.
  const [tier, setLocalTier] = useState(quality.tier);
  useEffect(() => subscribeQuality(() => setLocalTier(quality.tier)), []);

  const lightPos = useMemo(() => new Vector3(), []);
  const screen = useMemo(() => new Vector2(), []);

  // Tone mapping lives in exactly ONE place at a time. With the composer up it
  // must run last, after bloom, so HDR nuclei survive as light — hence the post
  // pass, and NoToneMapping on the renderer to avoid grading twice. With the
  // composer gone it moves onto the renderer, where three folds it into every
  // material's output for free instead of another full-screen pass.
  useEffect(() => {
    gl.toneMapping = tier > 0 ? ACESFilmicToneMapping : NoToneMapping;
    gl.toneMappingExposure = tier > 0 ? 1.1 : 1;
  }, [gl, tier]);

  useFrame((state) => {
    const p = timeline.progress;
    const stations: [number, number][] = [
      [0.10, STATION.vortex], [0.225, STATION.dna], [0.33, STATION.brain],
      [0.43, STATION.network], [0.52, STATION.digital], [0.61, STATION.tech],
      [0.70, STATION.eco], [0.79, STATION.world], [0.875, STATION.logo],
      [1.01, STATION.logo],
    ];
    let z: number = STATION.vortex;
    for (const [edge, sz] of stations) { if (p >= edge) z = sz; }
    lightPos.set(0, 0, z).project(state.camera as PerspectiveCamera);
    screen.set(lightPos.x * 0.5 + 0.5, lightPos.y * 0.5 + 0.5);
    const inFront = lightPos.z < 1 ? 1 : 0;

    // How far inside the frame the subject sits. The composition mask is only
    // meaningful while there is a subject on screen to compose around — if the
    // projection slides off-frame, a mask anchored out there would black out
    // the visible matter instead of the empty half.
    const edgeX = 1 - smoothstep(0.62, 1.05, Math.abs(screen.x - 0.5));
    const edgeY = 1 - smoothstep(0.62, 1.05, Math.abs(screen.y - 0.5));
    timeline.focus.x = screen.x;
    timeline.focus.y = screen.y;
    timeline.focus.inFrame = inFront ? edgeX * edgeY : 0;
  });

  // TIER 1 — no composer at all. Worth ~19ms of a ~38ms frame on an Iris Xe,
  // the difference between 26fps and roughly 50. The particle shader raises its
  // own per-mote atmosphere to compensate for the missing bloom.
  if (tier > 0) return null;

  return (
    <EffectComposer multisampling={0} frameBufferType={HalfFloatType}>
      {/* threshold sits above 1.0 so only the HDR nuclei bloom — the faint
          atmosphere around each mote stays sharp instead of turning to mush */}
      <Bloom
        intensity={device.lowPower ? 0.9 : 0.95}
        luminanceThreshold={device.lowPower ? 0.85 : 0.9}
        luminanceSmoothing={device.lowPower ? 0.22 : 0.18}
        mipmapBlur
        radius={device.lowPower ? 0.62 : 0.72}
        resolutionScale={device.lowPower ? 0.3 : 0.4}
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
