"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { startBehaviors } from "./behaviors";
import { useMascotState } from "./useMascotState";
import { DebugPanel, useDebugFlag } from "./DebugPanel";
import { ChatPanel } from "@/chat/ChatPanel";
import { useChat } from "@/chat/useChat";
import { useMascotBox } from "./useMascotBox";

// Client-only: keeps three.js out of SSR and out of the initial payload.
// Mounted ONCE here at app root (it lives in the root layout), so it persists
// across route changes and never remounts.
const Mascot = dynamic(() => import("./Mascot").then((m) => m.Mascot), { ssr: false });

/**
 * The single mount point for the whole companion.
 *
 * PARi IS the chat button. There is deliberately no separate bubble icon — the
 * mascot sits in the corner, a transparent accessible <button> covers it, and
 * clicking (or Enter/Space on) the mascot toggles the panel that opens directly
 * above it. Hovering makes PARi look excited; the panel closes on the ✕, on
 * Escape, on an outside click, or by clicking PARi again.
 */
export function MascotRoot() {
  const debug = useDebugFlag();
  const BOX = useMascotBox();
  const [fps, setFps] = useState(60);
  const [hovered, setHovered] = useState(false);
  const [hintSeen, setHintSeen] = useState(true);

  // zustand setters (not React state) — safe to call from effects.
  const setReducedMotion = useMascotState((s) => s.setReducedMotion);
  const fire = useMascotState((s) => s.fire);
  const hold = useMascotState((s) => s.hold);

  const openPanel = useChat((s) => s.openPanel);
  const closePanel = useChat((s) => s.closePanel);
  const chatOpen = useChat((s) => s.open);

  const started = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);

    if (!started.current) {
      started.current = true;
      const stop = startBehaviors();
      fire("boot", 1800);
      window.PARi = {
        ...(window.PARi ?? { celebrate: () => {} }),
        open: openPanel,
        close: closePanel,
      };

      // One-time "ask me anything" nudge, a few seconds after arrival.
      let hintTimer: ReturnType<typeof setTimeout> | undefined;
      try {
        if (!localStorage.getItem("pari.hintSeen")) {
          setHintSeen(false);
          hintTimer = setTimeout(() => {
            setHintSeen(true);
            localStorage.setItem("pari.hintSeen", "1");
          }, 9000);
        }
      } catch {
        /* private mode — just skip the hint */
      }

      return () => {
        stop();
        mq.removeEventListener("change", apply);
        if (hintTimer) clearTimeout(hintTimer);
      };
    }
    return () => mq.removeEventListener("change", apply);
  }, [setReducedMotion, fire, openPanel, closePanel]);

  const dismissHint = () => {
    if (hintSeen) return;
    setHintSeen(true);
    try {
      localStorage.setItem("pari.hintSeen", "1");
    } catch {
      /* ignore */
    }
  };

  const toggleChat = () => {
    dismissHint();
    if (chatOpen) {
      closePanel();
    } else {
      openPanel();
      fire("excited", 800); // PARi reacts as the panel opens
    }
  };

  return (
    <>
      <style>{`
        @keyframes pari-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pari-hint-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        [data-pari-launcher]:focus-visible {
          outline: 2px solid #00C2FF;
          outline-offset: 4px;
          border-radius: 18px;
        }
      `}</style>

      <Mascot onFps={setFps} box={BOX} />

      {/* PARi IS the button. Transparent, sits exactly over the mascot. */}
      <button
        type="button"
        data-pari-launcher=""
        onClick={toggleChat}
        onMouseEnter={() => {
          setHovered(true);
          hold("launcherHover", "excited");
        }}
        onMouseLeave={() => {
          setHovered(false);
          hold("launcherHover", null);
        }}
        aria-label={chatOpen ? "Close chat with PARi" : "Chat with PARi, the PAR Technologys assistant"}
        aria-expanded={chatOpen}
        style={{
          position: "fixed",
          right: BOX.right,
          bottom: BOX.bottom,
          width: BOX.width,
          height: BOX.height,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          zIndex: 2147483001,
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* tooltip / affordance — the only visible chrome */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: 4,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            padding: "5px 11px",
            borderRadius: 999,
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: "0.01em",
            fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
            color: "#D9F1FB",
            background: "rgba(10,15,29,0.92)",
            border: "1px solid rgba(0,194,255,0.34)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
            opacity: chatOpen ? 0 : hovered || !hintSeen ? 1 : 0,
            transition: "opacity 240ms ease",
            animation: !hintSeen ? "pari-hint-in 420ms ease both" : undefined,
            pointerEvents: "none",
          }}
        >
          {hovered ? "Ask me anything" : "Hi — need a hand?"}
        </span>
      </button>

      <ChatPanel panelBottom={BOX.panelBottom} />

      {debug && <DebugPanel fps={fps} />}
    </>
  );
}
