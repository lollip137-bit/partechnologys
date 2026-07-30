"use client";

import { Canvas } from "@react-three/fiber";
import { useMascotState } from "./useMascotState";
import { MascotModel } from "./MascotModel";
import { PerfMonitor } from "./PerfMonitor";

import type { Placement } from "./useMascotPlacement";

/**
 * The <Canvas> wrapper. Mounted ONCE at app root, fixed-position, sized to the
 * same corner box as the launcher button so the two line up exactly.
 *
 * `pointer-events: none` on the canvas — the page stays fully clickable
 * underneath, and the transparent <button> in MascotRoot (which sits on top of
 * this box) is what receives the click. The canvas is aria-hidden; the button
 * and the chat panel carry the accessible names.
 *
 * Lighting is keyed to the V3 palette: a warm-neutral key, a --blue rim and a
 * --cyan underglow so PARi sits in the same light as the particle film.
 */
export function Mascot({
  onFps,
  placement,
}: {
  onFps?: (fps: number) => void;
  placement: Placement;
}) {
  const quality = useMascotState((s) => s.quality);

  return (
    <div
      aria-hidden="true"
      data-pari-canvas=""
      style={{
        position: "fixed",
        left: placement.x,
        top: placement.y,
        width: placement.width,
        height: placement.height,
        pointerEvents: "none",
        zIndex: 2147482999,
      }}
    >
      <Canvas
        dpr={quality === "high" ? [1, 2] : [1, 1.25]}
        gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
        /**
         * Framed so the WHOLE mascot fits with margin. PARi spans roughly
         * y -1.3 (body bottom at full sleepy-sink) to +0.85 (head top at float
         * peak) — ~2.15 units — centred near y -0.22, so the camera is offset
         * down to match and pulled back to 4.6 (visible height 2.81) to leave
         * headroom. Framed too tight and the body clips on the viewport edge.
         */
        camera={{ position: [0, -0.22, 4.6], fov: 34 }}
        style={{ pointerEvents: "none", background: "transparent" }}
      >
        {/* Self-contained lighting — no network HDR fetch. */}
        <hemisphereLight args={["#DCE6F5", "#04070F", 0.85]} />
        <ambientLight intensity={0.34} />
        <directionalLight position={[2.5, 4, 3]} intensity={1.25} color="#FFFFFF" />
        {/* --blue rim from behind-left */}
        <directionalLight position={[-3, 1, -2]} intensity={0.6} color="#2563EB" />
        {/* --cyan underglow, ties PARi to the film's signature light */}
        <pointLight position={[0, -1.5, 2]} intensity={0.55} color="#00C2FF" />

        <MascotModel />
        <PerfMonitor onFps={onFps} />
      </Canvas>
    </div>
  );
}
