"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { startBehaviors } from "./behaviors";
import { useMascotState } from "./useMascotState";
import { DebugPanel, useDebugFlag } from "./DebugPanel";
import { ChatPanel } from "@/chat/ChatPanel";
import { useChat } from "@/chat/useChat";
import { useMascotPlacement } from "./useMascotPlacement";

// Client-only: keeps three.js out of SSR and out of the initial payload.
// Mounted ONCE here at app root, so it persists across routes and never remounts.
// The canvas is already inside a client-only tree (see MascotMount), but keep
// this split so three.js loads as its own chunk after first paint.
const Mascot = dynamic(() => import("./Mascot").then((m) => m.Mascot), { ssr: false });

/** How long PARi sulks off-screen before peeking back in. */
const PEEK_DELAY_MS = 4200;
/** Length of the peek animation before it ducks away again. */
const PEEK_DURATION_MS = 3400;
/** Gap between repeat peeks while still dismissed. */
const PEEK_REPEAT_MS = 11000;

/**
 * The single mount point for the whole companion.
 *
 * PARi IS the chat button — no separate bubble icon. A transparent accessible
 * <button> sits over the mascot and the panel opens beside it.
 *
 * PARi can be dragged anywhere, and remembers where you put it. Left alone, it
 * keeps itself out of the way by moving to the emptiest corner of the page.
 *
 * Dismiss it with the ✕ and it doesn't just vanish: it slides off the nearest
 * screen edge, then peeks back around it every so often until you invite it
 * back. Poke it repeatedly, fling it, or cut it off mid-sentence and it gets
 * visibly annoyed about that.
 */
export function MascotRoot() {
  const debug = useDebugFlag();
  const [fps, setFps] = useState(60);
  const [hovered, setHovered] = useState(false);
  const [hintSeen, setHintSeen] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  const setReducedMotion = useMascotState((s) => s.setReducedMotion);
  const fire = useMascotState((s) => s.fire);
  const hold = useMascotState((s) => s.hold);
  const setHideDir = useMascotState((s) => s.setHideDir);

  const openPanel = useChat((s) => s.openPanel);
  const closePanel = useChat((s) => s.closePanel);
  const chatOpen = useChat((s) => s.open);
  const streaming = useChat((s) => s.streaming);

  const started = useRef(false);
  const pokes = useRef<number[]>([]);
  const peekTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /** Short, self-limiting irritation. */
  const getAnnoyed = useCallback(() => {
    fire("annoyed", 2600);
  }, [fire]);

  const { placement, isDragging, onPointerDown, wasDragged } = useMascotPlacement(
    // drag start
    useCallback(() => hold("drag", "dragging"), [hold]),
    // drag end — a hard fling is rude
    useCallback(
      (flung: boolean) => {
        hold("drag", null);
        if (flung) getAnnoyed();
      },
      [hold, getAnnoyed],
    ),
  );

  // PARi hides toward whichever edge it's nearest.
  useEffect(() => {
    setHideDir(placement.side);
  }, [placement.side, setHideDir]);

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
        /* private mode — skip the hint */
      }

      return () => {
        stop();
        mq.removeEventListener("change", apply);
        if (hintTimer) clearTimeout(hintTimer);
      };
    }
    return () => mq.removeEventListener("change", apply);
  }, [setReducedMotion, fire, openPanel, closePanel]);

  const clearPeekTimers = useCallback(() => {
    peekTimers.current.forEach(clearTimeout);
    peekTimers.current = [];
  }, []);

  /**
   * The hide → peek → hide → peek cycle.
   *
   * Both states are held on the SAME `dismiss` source and swapped, rather than
   * firing the peek as a one-shot. A one-shot would be resolved against
   * `hiding`, which deliberately outranks almost everything so idle timers
   * can't drag PARi back on screen — and it would therefore swallow the peek
   * entirely. Same source = a clean swap, no priority fight.
   */
  const startPeekCycle = useCallback(() => {
    clearPeekTimers();
    const schedule = (delay: number) => {
      peekTimers.current.push(
        setTimeout(() => {
          hold("dismiss", "peeking");
          peekTimers.current.push(
            setTimeout(() => {
              hold("dismiss", "hiding");
              schedule(PEEK_REPEAT_MS);
            }, PEEK_DURATION_MS),
          );
        }, delay),
      );
    };
    schedule(PEEK_DELAY_MS);
  }, [hold, clearPeekTimers]);

  /** The ✕ (or an outside click): PARi withdraws behind the edge and peeks. */
  const dismiss = useCallback(() => {
    // interrupting PARi mid-sentence is rude — it notices
    const interrupted = streaming;
    closePanel();
    setDismissed(true);
    hold("dismiss", "hiding");
    if (interrupted) getAnnoyed();
    startPeekCycle();
  }, [closePanel, hold, startPeekCycle, streaming, getAnnoyed]);

  /** Bring PARi back from behind the edge. */
  const recall = useCallback(() => {
    clearPeekTimers();
    setDismissed(false);
    hold("dismiss", null);
  }, [hold, clearPeekTimers]);

  useEffect(() => clearPeekTimers, [clearPeekTimers]);

  const dismissHint = () => {
    if (hintSeen) return;
    setHintSeen(true);
    try {
      localStorage.setItem("pari.hintSeen", "1");
    } catch {
      /* ignore */
    }
  };

  const handleClick = () => {
    // a drag just ended — don't also treat it as a click
    if (wasDragged()) return;
    dismissHint();

    // poke detection: 4+ clicks inside 2s and PARi has had enough
    const now = Date.now();
    pokes.current = [...pokes.current.filter((t) => now - t < 2000), now];
    if (pokes.current.length >= 4) {
      pokes.current = [];
      getAnnoyed();
      return;
    }

    if (dismissed) {
      recall();
      return;
    }
    if (chatOpen) {
      closePanel();
    } else {
      openPanel();
      fire("excited", 800);
    }
  };

  const tooltip = dismissed
    ? "Come back?"
    : hovered
      ? "Ask me anything"
      : "Hi — need a hand?";

  return (
    <>
      <style>{`
        @keyframes pari-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pari-hint-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        [data-pari-launcher]:focus-visible { outline: 2px solid #00C2FF; outline-offset: 4px; border-radius: 18px; }
      `}</style>

      <Mascot onFps={setFps} placement={placement} />

      {/* PARi IS the button: transparent, sits exactly over the mascot, drags. */}
      <button
        type="button"
        data-pari-launcher=""
        onPointerDown={onPointerDown}
        onClick={handleClick}
        onMouseEnter={() => {
          setHovered(true);
          if (!dismissed) hold("launcherHover", "excited");
        }}
        onMouseLeave={() => {
          setHovered(false);
          hold("launcherHover", null);
        }}
        aria-label={
          dismissed
            ? "Bring PARi back"
            : chatOpen
              ? "Close chat with PARi"
              : "Chat with PARi, the PAR Technologys assistant. Drag to move."
        }
        aria-expanded={chatOpen}
        style={{
          position: "fixed",
          left: placement.x,
          top: placement.y,
          width: placement.width,
          height: placement.height,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: isDragging ? "grabbing" : "grab",
          zIndex: 2147483001,
          touchAction: "none", // let us own the drag gesture on touch
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            padding: "5px 11px",
            borderRadius: 999,
            fontSize: 11.5,
            fontWeight: 600,
            fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
            color: "#D9F1FB",
            background: "rgba(10,15,29,0.92)",
            border: "1px solid rgba(0,194,255,0.34)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
            opacity: chatOpen || isDragging ? 0 : hovered || !hintSeen || dismissed ? 1 : 0,
            transition: "opacity 240ms ease",
            animation: !hintSeen ? "pari-hint-in 420ms ease both" : undefined,
            pointerEvents: "none",
          }}
        >
          {tooltip}
        </span>
      </button>

      <ChatPanel placement={placement} onDismiss={dismiss} />

      {debug && <DebugPanel fps={fps} />}
    </>
  );
}
