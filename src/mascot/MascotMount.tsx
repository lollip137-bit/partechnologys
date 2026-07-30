"use client";

import dynamic from "next/dynamic";

/**
 * Client-only mount for Drax.
 *
 * Nothing about a floating 3D companion should be server-rendered: it reads
 * window size, localStorage (saved position, session id) and the live page
 * layout, so any SSR pass is guaranteed to disagree with the client and produce
 * a hydration mismatch. Loading it with `ssr: false` removes that whole class
 * of bug — and keeps three.js out of the server bundle.
 *
 * `ssr: false` isn't allowed from a Server Component, hence this thin client
 * wrapper between the root layout and MascotRoot.
 */
const MascotRoot = dynamic(() => import("./MascotRoot").then((m) => m.MascotRoot), {
  ssr: false,
});

export function MascotMount() {
  return <MascotRoot />;
}
