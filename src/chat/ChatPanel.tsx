"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "./useChat";

/**
 * Chat panel. Anchored directly above the mascot so the two read as ONE object:
 * PARi is the button, this is PARi talking. framer-motion for the DOM UI only.
 *
 * Fully keyboard + screen-reader usable and NOT aria-hidden (the 3D mascot is).
 * The typing indicator is the mascot's own `thinking` state — deliberately no
 * three-dot bubble.
 *
 * Colours are the V3 site tokens: --cyan #00C2FF on --navy-deep #0A0F1D.
 */
export interface PanelAnchor {
  x: number;
  y: number;
  width: number;
  height: number;
  side: -1 | 1;
}

const PANEL_W = 354;
const PANEL_H = 460;
const GAP = 12;

/**
 * Place the panel next to PARi and always fully on screen: prefer above, flip
 * below if there's no room, and align to whichever side keeps it in view.
 */
function anchorPanel(a: PanelAnchor) {
  const vw = typeof window === "undefined" ? 1280 : window.innerWidth;
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;
  const w = Math.min(PANEL_W, vw - 2 * GAP);
  const h = Math.min(PANEL_H, vh - 2 * GAP);

  // vertical: above PARi if it fits, else below, else pinned in view
  let top = a.y - h - GAP;
  if (top < GAP) {
    const below = a.y + a.height + GAP;
    top = below + h <= vh - GAP ? below : Math.max(GAP, vh - h - GAP);
  }

  // horizontal: align the panel's near edge with PARi, then clamp
  let left = a.side === 1 ? a.x + a.width - w : a.x;
  left = Math.max(GAP, Math.min(left, vw - w - GAP));

  return { left, top, width: w, height: h };
}

export function ChatPanel({
  placement,
  onDismiss,
}: {
  placement: PanelAnchor;
  onDismiss: () => void;
}) {
  const open = useChat((s) => s.open);
  const messages = useChat((s) => s.messages);
  const streaming = useChat((s) => s.streaming);
  const closePanel = useChat((s) => s.closePanel);
  const send = useChat((s) => s.send);

  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Escape closes from anywhere while the panel is open, and clicking outside
  // dismisses it — both are what people expect from a chat bubble.
  useEffect(() => {
    if (!open) return;
    // Escape just closes the panel; it is not a rejection of PARi, so it does
    // NOT trigger the hide-and-peek sulk. Only the ✕ does that.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (panelRef.current?.contains(t)) return;
      if (t.closest?.("[data-pari-launcher]")) return; // the mascot toggles itself
      closePanel();
    };
    window.addEventListener("keydown", onKey);
    // defer so the click that opened the panel doesn't immediately close it
    const id = setTimeout(() => window.addEventListener("mousedown", onDown), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
      clearTimeout(id);
    };
  }, [open, closePanel]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft;
    setDraft("");
    void send(text);
  };

  const goToContact = () => {
    closePanel();
    window.location.href = "/contact/";
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          data-pari-panel=""
          role="dialog"
          aria-label="Chat with PARi, the PAR Technologys assistant"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
          // follows PARi wherever it has been dragged, always kept on screen
          style={{ ...panelStyle, ...anchorPanel(placement) }}
        >
          <header style={headerStyle}>
            <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
              <span aria-hidden style={dotStyle} />
              <strong style={{ color: "#F3F6FA", letterSpacing: "0.01em" }}>PARi</strong>
              <span style={subtleLabel}>PAR TECHNOLOGYS</span>
            </span>
            <button
              type="button"
              aria-label="Dismiss PARi"
              title="Dismiss — PARi will wait at the edge"
              onClick={onDismiss}
              style={closeBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,194,255,0.16)";
                e.currentTarget.style.color = "#DFF6FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(229,231,235,0.6)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden focusable="false">
                <path
                  d="M1.5 1.5 L12.5 12.5 M12.5 1.5 L1.5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>

          <div ref={listRef} style={listStyle} aria-live="polite">
            {messages.map((m) => (
              <div
                key={m.id}
                style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%" }}
              >
                <div style={m.role === "user" ? userBubble : asstBubble}>
                  <span style={srOnly}>{m.role === "user" ? "You said:" : "PARi said:"}</span>
                  {m.content}
                  {m.pending && !m.content && <span aria-hidden style={{ opacity: 0.55 }}>…</span>}
                  {m.pending && m.content && <span aria-hidden style={caret}>▍</span>}
                </div>
                {m.pointToContact && !m.pending && (
                  <button onClick={goToContact} style={contactBtn}>
                    Talk to the team →
                  </button>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} style={formStyle}>
            <label htmlFor="pari-input" style={srOnly}>
              Message PARi
            </label>
            <input
              id="pari-input"
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask what we build, timelines, pricing…"
              autoComplete="off"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(0,194,255,0.55)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(229,231,235,0.12)")}
            />
            <button
              type="submit"
              disabled={!draft.trim() || streaming}
              style={{ ...sendBtn, opacity: !draft.trim() || streaming ? 0.4 : 1 }}
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden focusable="false">
                <path
                  d="M8 13.5 V3 M3.5 7.5 L8 3 L12.5 7.5"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- styles: V3 tokens (cyan on navy) ---------- */

const srOnly: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

const panelStyle: React.CSSProperties = {
  position: "fixed",
  // left/top/width/height come from anchorPanel(), which tracks PARi
  display: "flex",
  flexDirection: "column",
  borderRadius: 16,
  overflow: "hidden",
  background: "linear-gradient(180deg, rgba(17,30,64,0.97) 0%, rgba(10,15,29,0.98) 100%)",
  border: "1px solid rgba(0,194,255,0.28)",
  boxShadow: "0 24px 70px rgba(0,0,0,0.62), 0 0 0 1px rgba(0,0,0,0.4), 0 0 40px rgba(0,194,255,0.10)",
  backdropFilter: "blur(12px)",
  zIndex: 2147483000,
  color: "#E5E7EB",
  fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 12px 12px 14px",
  borderBottom: "1px solid rgba(229,231,235,0.08)",
  flex: "0 0 auto",
};

const dotStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#00C2FF",
  boxShadow: "0 0 10px #00C2FF",
  flex: "0 0 auto",
};

const subtleLabel: React.CSSProperties = {
  color: "rgba(229,231,235,0.45)",
  fontSize: 10.5,
  letterSpacing: "0.14em",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const closeBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: 9,
  background: "transparent",
  border: "none",
  color: "rgba(229,231,235,0.6)",
  cursor: "pointer",
  transition: "background 160ms, color 160ms",
  flex: "0 0 auto",
};

const listStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  padding: 14,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const bubbleBase: React.CSSProperties = {
  position: "relative",
  padding: "9px 12px",
  borderRadius: 13,
  fontSize: 13.5,
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const asstBubble: React.CSSProperties = {
  ...bubbleBase,
  background: "rgba(0,194,255,0.09)",
  border: "1px solid rgba(0,194,255,0.20)",
  borderBottomLeftRadius: 4,
  color: "#DCE7F2",
};

const userBubble: React.CSSProperties = {
  ...bubbleBase,
  background: "rgba(37,99,235,0.22)",
  border: "1px solid rgba(37,99,235,0.34)",
  borderBottomRightRadius: 4,
  color: "#F1F5FB",
};

const caret: React.CSSProperties = {
  marginLeft: 2,
  opacity: 0.85,
  animation: "pari-blink 1s steps(2) infinite",
};

const contactBtn: React.CSSProperties = {
  marginTop: 7,
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  background: "linear-gradient(135deg, #00C2FF 0%, #2563EB 100%)",
  color: "#04121C",
  border: "none",
  letterSpacing: "0.01em",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  padding: 12,
  borderTop: "1px solid rgba(229,231,235,0.08)",
  flex: "0 0 auto",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: "10px 12px",
  borderRadius: 11,
  border: "1px solid rgba(229,231,235,0.12)",
  background: "rgba(0,1,4,0.5)",
  color: "#F1F5FB",
  fontSize: 13.5,
  outline: "none",
  transition: "border-color 160ms",
  fontFamily: "inherit",
};

const sendBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  flex: "0 0 auto",
  borderRadius: 11,
  border: "none",
  background: "linear-gradient(135deg, #00C2FF 0%, #2563EB 100%)",
  color: "#04121C",
  cursor: "pointer",
  transition: "opacity 160ms",
};
