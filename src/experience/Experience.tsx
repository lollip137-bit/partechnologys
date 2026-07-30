'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import ParticleEngine from '@/particles/ParticleEngine';
import { subscribe } from '@/state/ticker';
import { viewport } from '@/state/viewport';
import CameraRig from './CameraRig';
import Cosmos from './Cosmos';
import PostFX from './PostFX';

/** Puts the whole 3D world to sleep while the user reads the site sections. */
function FrameloopGovernor() {
  const set = useThree((s) => s.set);
  const frameloop = useRef<'always' | 'never'>('always');
  useEffect(() => {
    // Runs on the shared ticker rather than a third private rAF loop, and reads
    // the cached viewport instead of forcing a layout flush every frame.
    const asleepNow = () =>
      document.hidden || viewport.scrollY - viewport.filmEnd > viewport.h * 0.6;

    const stop = subscribe(() => {
      const want: 'always' | 'never' = asleepNow() ? 'never' : 'always';
      if (want !== frameloop.current) {
        frameloop.current = want;
        set({ frameloop: want });
      }
    });

    // wake immediately when the tab comes back
    const onVis = () => {
      if (!document.hidden && frameloop.current === 'never' && !asleepNow()) {
        frameloop.current = 'always';
        set({ frameloop: 'always' });
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [set]);
  return null;
}

/**
 * PROFILING HARNESS — lets a headless session bisect the frame by switching
 * whole layers off at runtime:
 *   __parLayers({ post: false })    → drop the postprocessing chain
 *   __parLayers({ cosmos: false })  → drop the ambient star/dust layer
 *   __parLayers({ field: false })   → drop the GPU particle field entirely
 * Measuring beats guessing: the particle population turned out to be almost
 * free here, which no amount of code reading would have revealed.
 */
function useLayerToggles() {
  const [layers, setLayers] = useState({ post: true, cosmos: true, field: true });
  useEffect(() => {
    (window as unknown as { __parLayers: (p: object) => void }).__parLayers = (patch) =>
      setLayers((l) => ({ ...l, ...patch }));
  }, []);
  return layers;
}

export default function Experience() {
  const layers = useLayerToggles();
  return (
    <div className="stage" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        camera={{ fov: 46, near: 0.1, far: 560, position: [0, 0.8, 28] }}
      >
        <color attach="background" args={['#000104']} />
        {layers.cosmos && <Cosmos />}
        {layers.field && <ParticleEngine />}
        <CameraRig />
        {layers.post && <PostFX />}
        <FrameloopGovernor />
      </Canvas>
    </div>
  );
}
