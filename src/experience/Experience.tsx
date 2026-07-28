'use client';

import { useEffect, useRef } from 'react';
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

export default function Experience() {
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
        <Cosmos />
        <ParticleEngine />
        <CameraRig />
        <PostFX />
        <FrameloopGovernor />
      </Canvas>
    </div>
  );
}
