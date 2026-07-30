"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { mascotStore } from "./useMascotState";

/**
 * fps auto-degrade (brief §3/§6). Samples frame time in ~1s windows. If two
 * consecutive windows fall below 30fps it drops quality to "low"; if it climbs
 * back above 48fps for two windows it restores "high". Hysteresis avoids
 * flip-flopping. Writes only to the store — the Canvas reacts to `quality`.
 */
export function PerfMonitor({ onFps }: { onFps?: (fps: number) => void }) {
  const acc = useRef({ frames: 0, time: 0, lowStreak: 0, highStreak: 0 });

  useFrame((_, delta) => {
    const a = acc.current;
    a.frames += 1;
    a.time += delta;
    if (a.time < 1) return;

    const fps = a.frames / a.time;
    a.frames = 0;
    a.time = 0;
    onFps?.(fps);

    const q = mascotStore.getState().quality;
    if (fps < 30) {
      a.lowStreak += 1;
      a.highStreak = 0;
      if (a.lowStreak >= 2 && q !== "low") mascotStore.getState().setQuality("low");
    } else if (fps > 48) {
      a.highStreak += 1;
      a.lowStreak = 0;
      if (a.highStreak >= 2 && q !== "high") mascotStore.getState().setQuality("high");
    } else {
      a.lowStreak = 0;
      a.highStreak = 0;
    }
  });

  return null;
}
