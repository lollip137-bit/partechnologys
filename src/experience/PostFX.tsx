'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction, ChromaticAberrationEffect, ToneMappingMode } from 'postprocessing';
import { HalfFloatType } from 'three';
import { Vector2, Vector3, PerspectiveCamera } from 'three';
import { timeline, smoothstep } from '@/state/timeline';
import { device } from '@/state/ticker';
import { STATION } from './phases';

export default function PostFX() {
  // built imperatively: passing a ref prop makes EffectComposer's memo
  // JSON.stringify a circular React 19 ref — this sidesteps it entirely
  const ca = useMemo(
    () =>
      new ChromaticAberrationEffect({
        blendFunction: BlendFunction.NORMAL,
        offset: new Vector2(0.00045, 0.00027),
        radialModulation: false,
        modulationOffset: 0.15,
      }),
    [],
  );

  const lightPos = useMemo(() => new Vector3(), []);
  const screen = useMemo(() => new Vector2(), []);

  useFrame((state) => {
    // Aberration swells with scroll velocity — but only barely. The old ceiling
    // (0.00245) was wide enough to split any bright streak into separate red,
    // green and blue copies, which is what made fast scrolling look like a
    // scratched 70s film print rather than a camera lens.
    const e = Math.min(1, Math.abs(timeline.velocity) * 0.3);
    const amt = 0.0003 + e * 0.0006;
    ca.offset.set(amt, amt * 0.6);

    // The subject's screen position, projected once per frame and shared with
    // the particle field and the ambient cosmos via `timeline.focus`.
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

  // phones run bloom + vignette only: aberration and grain cost a full-screen
  // pass each and read as noise on a small, high-DPI panel anyway.
  // Bloom is the only convolution pass here (CA + Noise + Vignette merge into
  // one shader), so its blur chain is the entire post-processing budget.
  // Running it at 1/3–1/2 resolution is invisible on a glow and roughly
  // doubles the frame rate on integrated GPUs.
  // HDR pipeline: the composer works in half-float, so particle nuclei can
  // exceed 1.0 and bloom turns them into genuine light. Tone mapping brings
  // the frame back to display range at the very end — this is what separates
  // "glowing circles" from photographed highlights.
  if (device.lowPower) {
    return (
      <EffectComposer multisampling={0} frameBufferType={HalfFloatType}>
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.22}
          mipmapBlur
          radius={0.62}
          resolutionScale={0.35}
        />
        <Vignette eskil={false} offset={0.18} darkness={0.84} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0} frameBufferType={HalfFloatType}>
      {/* threshold sits above 1.0 so only the HDR nuclei bloom — the faint
          atmosphere around each mote stays sharp instead of turning to mush */}
      <Bloom
        intensity={0.95}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.18}
        mipmapBlur
        radius={0.72}
        resolutionScale={0.5}
      />
      <primitive object={ca} />
      <Noise premultiply opacity={0.1} />
      <Vignette eskil={false} offset={0.16} darkness={0.86} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
