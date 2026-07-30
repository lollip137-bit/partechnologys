"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface MascotBox {
  width: number;
  height: number;
}

export interface Placement extends MascotBox {
  /** Top-left of the mascot box, in viewport px (position: fixed). */
  x: number;
  y: number;
  /** Which half of the screen Drax is on: -1 left, +1 right. Drives hide/peek. */
  side: -1 | 1;
}

const DESKTOP: MascotBox = { width: 210, height: 240 };
const MOBILE: MascotBox = { width: 116, height: 132 };
const MARGIN = 16;
const STORAGE_KEY = "drax.pos";

/* ------------------------------------------------------------------ *
 * Finding empty space
 * ------------------------------------------------------------------ */

/**
 * Does this point sit on real page content?
 *
 * `elementFromPoint` always returns something (html/body at minimum), so
 * "occupied" means: the topmost element is a genuine content node — it carries
 * text, or it's interactive, or it's media. Big empty layout wrappers and the
 * full-bleed <canvas> backdrop don't count, otherwise every position on this
 * site would score as blocked by the particle film.
 */
function pointIsOccupied(x: number, y: number): boolean {
  const el = document.elementFromPoint(x, y) as HTMLElement | null;
  if (!el) return false;

  // Ignore Drax's own chrome.
  if (el.closest("[data-drax-launcher],[data-drax-panel],[data-drax-canvas]")) return false;

  const tag = el.tagName;
  if (tag === "HTML" || tag === "BODY" || tag === "CANVAS") return false;

  if (el.matches("a,button,input,textarea,select,img,video,svg,[role='button']")) return true;

  // A node counts as text content only if the text is its own, not a
  // descendant's — otherwise a page-wrapping <div> reads as occupied.
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim().length > 0) {
      return true;
    }
  }
  return false;
}

/** Fraction of sampled points inside `rect` that land on content, 0..1. */
function occupancy(x: number, y: number, w: number, h: number): number {
  const COLS = 4;
  const ROWS = 5;
  let hits = 0;
  let total = 0;
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      const px = x + ((i + 0.5) / COLS) * w;
      const py = y + ((j + 0.5) / ROWS) * h;
      if (px < 0 || py < 0 || px > window.innerWidth || py > window.innerHeight) continue;
      total++;
      if (pointIsOccupied(px, py)) hits++;
    }
  }
  return total === 0 ? 1 : hits / total;
}

/**
 * Candidate anchors, in preference order. Bottom-right first (the conventional
 * spot); the rest are fallbacks for when it's covered.
 */
function candidates(w: number, h: number): { x: number; y: number }[] {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const right = vw - w - MARGIN;
  const left = MARGIN;
  const bottom = vh - h - MARGIN;
  const middle = Math.round((vh - h) / 2);
  const upper = Math.round(vh * 0.18);
  return [
    { x: right, y: bottom },
    { x: right, y: middle },
    { x: left, y: bottom },
    { x: right, y: upper },
    { x: left, y: middle },
    { x: left, y: upper },
  ];
}

/** Pick the emptiest candidate. Ties break toward the earlier (preferred) one. */
function findEmptySpot(w: number, h: number): { x: number; y: number } {
  const list = candidates(w, h);
  let best = list[0];
  let bestScore = Infinity;
  for (const c of list) {
    const score = occupancy(c.x, c.y, w, h);
    if (score < bestScore - 0.01) {
      bestScore = score;
      best = c;
    }
    if (bestScore === 0) break; // completely clear, take it
  }
  return best;
}

function clamp(x: number, y: number, w: number, h: number) {
  return {
    x: Math.max(MARGIN, Math.min(x, window.innerWidth - w - MARGIN)),
    y: Math.max(MARGIN, Math.min(y, window.innerHeight - h - MARGIN)),
  };
}

/* ------------------------------------------------------------------ *
 * The hook
 * ------------------------------------------------------------------ */

export interface UseMascotPlacement {
  placement: Placement;
  isDragging: boolean;
  /** Attach to the launcher's onPointerDown. */
  onPointerDown: (e: React.PointerEvent) => void;
  /** True if the last pointer sequence was a drag, not a click. */
  wasDragged: () => boolean;
  /** Drop the saved position and re-run auto-placement. */
  resetPosition: () => void;
}

/**
 * Owns where Drax sits.
 *
 * Two rules:
 *  1. The user always wins. Once Drax has been dragged, that position is kept
 *     (and persisted), and auto-placement never overrides it.
 *  2. Otherwise Drax keeps out of the way — on mount, on resize and on route
 *     change it samples candidate corners and moves to the emptiest one, so it
 *     stops sitting on top of the page's own content.
 */
export function useMascotPlacement(
  onDragStart?: () => void,
  onDragEnd?: (flung: boolean) => void,
): UseMascotPlacement {
  const [box, setBox] = useState<MascotBox>(DESKTOP);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const [isDragging, setIsDragging] = useState(false);

  const userPlaced = useRef(false);
  const dragged = useRef(false);
  const drag = useRef({ dx: 0, dy: 0, startX: 0, startY: 0, lastT: 0, vx: 0, vy: 0 });
  // Callbacks change identity every render; keep them in refs so the pointer
  // listeners stay stable and don't need re-binding mid-drag.
  const cbStart = useRef(onDragStart);
  const cbEnd = useRef(onDragEnd);
  cbStart.current = onDragStart;
  cbEnd.current = onDragEnd;

  // --- responsive size ----------------------------------------------------
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setBox(mq.matches ? MOBILE : DESKTOP);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // --- initial position: saved, else auto-placed --------------------------
  useEffect(() => {
    let saved: { x: number; y: number } | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p?.x === "number" && typeof p?.y === "number") saved = p;
      }
    } catch {
      /* private mode — fall through to auto-placement */
    }

    if (saved) {
      userPlaced.current = true;
      setPos(clamp(saved.x, saved.y, box.width, box.height));
    } else {
      // let the page paint before sampling it
      const id = window.setTimeout(() => {
        setPos(findEmptySpot(box.width, box.height));
      }, 600);
      return () => window.clearTimeout(id);
    }
  }, [box.width, box.height]);

  // --- keep clear on resize / navigation ----------------------------------
  useEffect(() => {
    const reflow = () => {
      setPos((p) => {
        if (userPlaced.current) return clamp(p.x, p.y, box.width, box.height);
        return findEmptySpot(box.width, box.height);
      });
    };
    const onResize = () => reflow();
    window.addEventListener("resize", onResize);

    // App-router navigations don't reload, so re-check the new page's layout.
    const onNav = () => window.setTimeout(reflow, 700);
    window.addEventListener("popstate", onNav);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("popstate", onNav);
    };
  }, [box.width, box.height]);

  // --- dragging -----------------------------------------------------------
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      const d = drag.current;
      d.dx = e.clientX - pos.x;
      d.dy = e.clientY - pos.y;
      d.startX = e.clientX;
      d.startY = e.clientY;
      d.lastT = performance.now();
      d.vx = 0;
      d.vy = 0;
      dragged.current = false;

      const move = (ev: PointerEvent) => {
        const dist = Math.hypot(ev.clientX - d.startX, ev.clientY - d.startY);
        // 5px of slop so a normal click isn't read as a drag
        if (!dragged.current && dist > 5) {
          dragged.current = true;
          setIsDragging(true);
          cbStart.current?.();
        }
        if (!dragged.current) return;

        const now = performance.now();
        const dt = Math.max(1, now - d.lastT);
        const nx = ev.clientX - d.dx;
        const ny = ev.clientY - d.dy;
        d.vx = (ev.clientX - d.startX) / dt;
        d.vy = (ev.clientY - d.startY) / dt;
        d.lastT = now;
        setPos(clamp(nx, ny, box.width, box.height));
      };

      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        if (dragged.current) {
          const speed = Math.hypot(d.vx, d.vy);
          userPlaced.current = true;
          setIsDragging(false);
          setPos((p) => {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
            } catch {
              /* ignore */
            }
            return p;
          });
          // a hard fling annoys Drax; a gentle move doesn't
          cbEnd.current?.(speed > 1.1);
        }
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    },
    [pos.x, pos.y, box.width, box.height],
  );

  const resetPosition = useCallback(() => {
    userPlaced.current = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setPos(findEmptySpot(box.width, box.height));
  }, [box.width, box.height]);

  const side: -1 | 1 =
    typeof window === "undefined" || pos.x + box.width / 2 >= window.innerWidth / 2 ? 1 : -1;

  return {
    placement: { x: pos.x, y: pos.y, width: box.width, height: box.height, side },
    isDragging,
    onPointerDown,
    wasDragged: () => dragged.current,
    resetPosition,
  };
}
