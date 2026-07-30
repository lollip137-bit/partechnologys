/**
 * Chat transport.
 *
 * The V3 site is a static export, so by default there is NO server and the
 * whole RAG pipeline runs in the browser (localBrain.ts).
 *
 * When a real provider is stood up later (Phase 7 — Gemini, which must stay
 * server-side so the key never reaches the browser), deploy it as a small
 * serverless function and set NEXT_PUBLIC_CHAT_API to its URL. This module then
 * streams SSE from there instead. Nothing else in the UI changes.
 */

export interface ControlBlock {
  mood: "excited" | "neutral" | "thoughtful";
  action: null | "point_to_contact";
}

export type ChatEvent =
  | { type: "delta"; text: string }
  | { type: "control"; control: ControlBlock }
  | { type: "sources"; sources: string[] }
  | { type: "done" }
  | { type: "error"; message: string; fallback: boolean };

export interface WireMessage {
  role: "user" | "model";
  content: string;
}

export class RateLimitedError extends Error {
  retryAfterMs: number;
  constructor(retryAfterMs: number) {
    super("rate_limited");
    this.retryAfterMs = retryAfterMs;
  }
}

const REMOTE = process.env.NEXT_PUBLIC_CHAT_API?.trim();

export async function* streamChat(
  message: string,
  history: WireMessage[],
  sessionId: string,
  signal?: AbortSignal,
): AsyncGenerator<ChatEvent> {
  // --- default: the in-browser brain -------------------------------------
  if (!REMOTE) {
    const { runLocalChat } = await import("./localBrain");
    yield* runLocalChat(message, history);
    return;
  }

  // --- optional: a real streaming endpoint -------------------------------
  const res = await fetch(REMOTE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, sessionId }),
    signal,
  });

  if (res.status === 429) {
    let retryAfterMs = 4000;
    try {
      const j = await res.json();
      if (typeof j.retryAfterMs === "number") retryAfterMs = j.retryAfterMs;
    } catch {
      /* keep the default */
    }
    throw new RateLimitedError(retryAfterMs);
  }

  if (!res.ok || !res.body) {
    yield { type: "error", message: `HTTP ${res.status}`, fallback: true };
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let sep: number;
    while ((sep = buf.indexOf("\n\n")) >= 0) {
      const frame = buf.slice(0, sep);
      buf = buf.slice(sep + 2);
      const line = frame.split("\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      const json = line.slice(5).trim();
      if (!json) continue;
      try {
        yield JSON.parse(json) as ChatEvent;
      } catch {
        /* skip a malformed frame */
      }
    }
  }
}
