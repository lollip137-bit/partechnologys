'use client';

import dynamic from 'next/dynamic';
import ScrollRoot from '@/experience/ScrollRoot';
import Nav from '@/ui/Nav';
import ActOverlay from '@/ui/ActOverlay';
import EcoCards from '@/ui/EcoCards';
import TechOrbit from '@/ui/TechOrbit';
import DnaOrbit from '@/ui/DnaOrbit';
import BrainOrbit from '@/ui/BrainOrbit';
import BinaryRain from '@/ui/BinaryRain';
import Finale from '@/ui/Finale';
import Hud from '@/ui/Hud';
import Sections from '@/ui/Sections';
import CookieBar from '@/ui/CookieBar';
import { FilmBackToTop } from '@/ui/BackControls';
import { PAGES } from '@/experience/phases';

const Experience = dynamic(() => import('@/experience/Experience'), { ssr: false });

export default function Page() {
  return (
    <main>
      <Experience />
      <ScrollRoot />
      <Nav />
      <ActOverlay />
      <EcoCards />
      <TechOrbit />
      <DnaOrbit />
      <BrainOrbit />
      <BinaryRain />
      <Finale />
      <Hud />
      {/* scroll = time. This spacer is the length of the FILM. */}
      <div id="film" style={{ height: `${PAGES * 100}vh` }} aria-hidden />
      {/* the hero settles — and the real website begins */}
      <Sections />
      <FilmBackToTop />
      <CookieBar />
    </main>
  );
}
