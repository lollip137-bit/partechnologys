/**
 * Chat transport.
 *
 * The V3 site is a static export, so by default there is NO server and the
 * whole RAG pipeline runs in the browser (localBrain.ts).
 *
 * The real brain is a small Cloudflare Worker (docs/drax-brain-worker.js) — it
 * must stay server-side so nothing secret ever reaches the browser — and
 * NEXT_PUBLIC_CHAT_API points at it. This module streams SSE from there;
 * nothing else in the UI needs to know or care what runs inside the Worker.
 */

/**
 * The reaction the model sends back alongside its words. `mood` drives a
 * visible expression on the mascot for a beat after it finishes answering, so
 * every question gets a physical response and not just text.
 */
export interface ControlBlock {
  mood: "excited" | "neutral" | "thoughtful" | "annoyed";
  /**
   * `point_to_contact` — couldn't answer, or wants a human, and no lead has
   *   been captured yet; the UI offers the "Talk to the team" link.
   * `lead_captured` — the Worker validated and stored name+email+project;
   *   the UI shows a confirmation instead, since there's nothing left to send
   *   the visitor off to do.
   */
  action: null | "point_to_contact" | "lead_captured";
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
  // If it is unreachable, fall back to the in-browser brain rather than
  // failing: a slightly less clever Drax beats a broken one.
  let res: Response;
  try {
    res = await fetch(REMOTE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, sessionId }),
      signal,
    });
  } catch {
    const { runLocalChat } = await import("./localBrain");
    yield* runLocalChat(message, history);
    return;
  }

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

  // Server error / quota exhausted / misconfigured: same fallback.
  if (!res.ok || !res.body) {
    const { runLocalChat } = await import("./localBrain");
    yield* runLocalChat(message, history);
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
