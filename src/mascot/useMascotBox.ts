"use client";

import { useEffect, useState } from "react";

export interface MascotBox {
  width: number;
  height: number;
  right: number;
  bottom: number;
  /** Where the chat panel's bottom edge should sit, clearing the mascot. */
  panelBottom: number;
}

/** Desktop: full-size companion in the corner. */
const DESKTOP: MascotBox = { width: 210, height: 240, right: 18, bottom: 16, panelBottom: 210 };

/**
 * Mobile: PARi shrinks and docks tighter to the corner so it never eats the
 * screen, and the panel sits just above the smaller footprint.
 */
const MOBILE: MascotBox = { width: 116, height: 132, right: 8, bottom: 8, panelBottom: 116 };

const QUERY = "(max-width: 640px)";

/**
 * One source of truth for the mascot's on-screen footprint, shared by the
 * canvas, the launcher hit-area and the chat panel so all three stay aligned.
 */
export function useMascotBox(): MascotBox {
  // Start desktop-sized; the effect corrects it before paint on mobile.
  const [box, setBox] = useState<MascotBox>(DESKTOP);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const apply = () => setBox(mq.matches ? MOBILE : DESKTOP);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return box;
}
