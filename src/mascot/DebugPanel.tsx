"use client";

import { useState } from "react";
import { useMascotState, type MascotState } from "./useMascotState";

const STICKY: MascotState[] = [
  "idle",
  "tracking",
  "curious",
  "excited",
  "anticipating",
  "thinking",
  "speaking",
  "sleepy",
  "asleep",
  "annoyed",
  "dragging",
  "hiding",
];
/**
 * Hidden dev panel, shown only with `?debug=mascot` (brief phase 3). A button
 * per state so transitions are testable without waiting 120s. Sticky states are
 * held under a "debug" source; one-shots are fired.
 */
export function DebugPanel({ fps }: { fps: number }) {
  const state = useMascotState((s) => s.state);
  const quality = useMascotState((s) => s.quality);
  const reduced = useMascotState((s) => s.reducedMotion);
  const hold = useMascotState((s) => s.hold);
  const fire = useMascotState((s) => s.fire);
  const flash = useMascotState((s) => s.flashExpression);
  const setQuality = useMascotState((s) => s.setQuality);
  const setReduced = useMascotState((s) => s.setReducedMotion);
  const [held, setHeld] = useState<MascotState | null>(null);

  const setSticky = (s: MascotState) => {
    hold("debug", s === held ? null : s);
    setHeld(s === held ? null : s);
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        bottom: 12,
        zIndex: 9999,
        width: 250,
        padding: 12,
        borderRadius: 12,
        background: "rgba(6,16,10,0.92)",
        border: "1px solid rgba(34,197,94,0.4)",
        color: "#cfe9d8",
        font: "12px ui-monospace, monospace",
        backdropFilter: "blur(6px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <strong style={{ color: "#22c55e" }}>PARi debug</strong>
        <span>{fps.toFixed(0)} fps</span>
      </div>
      <div style={{ marginBottom: 8, opacity: 0.85 }}>
        state: <b style={{ color: "#4ade80" }}>{state}</b> · {quality}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
        {STICKY.map((s) => (
          <button
            key={s}
            onClick={() => setSticky(s)}
            style={btn(held === s)}
          >
            {s}
          </button>
        ))}
        <button style={btn(false)} onClick={() => fire("boot", 1800)}>
          boot ▶
        </button>
        <button style={btn(false)} onClick={() => fire("celebrate", 1500)}>
          celebrate ▶
        </button>
        <button style={btn(false)} onClick={() => fire("peeking", 3200)}>
          peeking ▶
        </button>
        <button style={btn(false)} onClick={() => flash("disappointed", 1200)}>
          disappointed ▶
        </button>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <button
          style={btn(false)}
          onClick={() => {
            hold("debug", null);
            setHeld(null);
          }}
        >
          release
        </button>
        <button style={btn(quality === "low")} onClick={() => setQuality(quality === "low" ? "high" : "low")}>
          {quality === "low" ? "low fx" : "high fx"}
        </button>
        <button style={btn(reduced)} onClick={() => setReduced(!reduced)}>
          reduced
        </button>
      </div>
    </div>
  );
}

function btn(active: boolean): React.CSSProperties {
  return {
    padding: "5px 6px",
    borderRadius: 7,
    cursor: "pointer",
    border: "1px solid rgba(34,197,94,0.35)",
    background: active ? "#22c55e" : "rgba(34,197,94,0.08)",
    color: active ? "#04170c" : "#cfe9d8",
    fontWeight: active ? 700 : 500,
  };
}

/** Small hook: is `?debug=mascot` present? Read once on the client at mount. */
export function useDebugFlag() {
  const [on] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug") === "mascot",
  );
  return on;
}
