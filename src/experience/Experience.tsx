'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import ParticleEngine from '@/particles/ParticleEngine';
import CameraRig from './CameraRig';
import Cosmos from './Cosmos';
import PostFX from './PostFX';

/** Puts the whole 3D world to sleep while the user reads the site sections. */
function FrameloopGovernor() {
  const set = useThree((s) => s.set);
  const frameloop = useRef<'always' | 'never'>('always');
  useEffect(() => {
    const film = document.getElementById('film');
    let raf = 0;
    const loop = () => {
      const filmEnd = (film?.offsetHeight ?? Infinity) - window.innerHeight;
      const over = window.scrollY - filmEnd;
      // sleep when the reader is in the site sections OR the tab is hidden
      const asleep = document.hidden || over > window.innerHeight * 0.6;
      const want: 'always' | 'never' = asleep ? 'never' : 'always';
      if (want !== frameloop.current) {
        frameloop.current = want;
        set({ frameloop: want });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // wake immediately when the tab comes back
    const onVis = () => {
      if (!document.hidden && frameloop.current === 'never') {
        const filmEnd = (film?.offsetHeight ?? Infinity) - window.innerHeight;
        if (window.scrollY - filmEnd <= window.innerHeight * 0.6) {
          frameloop.current = 'always';
          set({ frameloop: 'always' });
        }
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
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
