"use client";

import { create } from "zustand";
import { mascotStore, type Mood } from "@/mascot/useMascotState";
import { RateLimitedError, streamChat, type WireMessage } from "./api";

export interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** true while this assistant message is still streaming. */
  pending?: boolean;
  /** set when the reply suggests pointing the visitor at the contact form. */
  pointToContact?: boolean;
}

interface ChatStore {
  open: boolean;
  messages: ChatMsg[];
  streaming: boolean;
  sessionId: string;
  openedAt: number;

  openPanel: () => void;
  closePanel: () => void;
  send: (text: string) => Promise<void>;
}

function newSessionId(): string {
  if (typeof window === "undefined") return "server";
  const KEY = "pari.sessionId";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(KEY, id);
  }
  return id;
}

const MOOD_MAP: Record<string, Mood> = {
  excited: "excited",
  neutral: "neutral",
  thoughtful: "thoughtful",
};

const uid = () => Math.random().toString(36).slice(2);

export const useChat = create<ChatStore>((set, get) => ({
  open: false,
  messages: [
    {
      id: "greet",
      role: "assistant",
      content:
        "Hi — I'm PARi, PAR Technologys' assistant. Ask me what we build, how long a project takes, or how we price.",
    },
  ],
  streaming: false,
  sessionId: newSessionId(),
  openedAt: 0,

  openPanel: () => set({ open: true, openedAt: Date.now() }),

  closePanel: () => {
    const { openedAt } = get();
    // Chat closed < 3s after opening -> one-shot disappointed flash (brief §5).
    if (openedAt && Date.now() - openedAt < 3000) {
      mascotStore.getState().flashExpression("disappointed", 1200);
    }
    set({ open: false });
  },

  send: async (text) => {
    const clean = text.trim();
    if (!clean || get().streaming) return;

    const mascot = mascotStore.getState();
    const userMsg: ChatMsg = { id: uid(), role: "user", content: clean };
    const asstId = uid();
    set((s) => ({
      streaming: true,
      messages: [
        ...s.messages,
        userMsg,
        { id: asstId, role: "assistant", content: "", pending: true },
      ],
    }));

    // history = prior turns (exclude the just-added empty assistant)
    const history: WireMessage[] = get()
      .messages.filter((m) => m.id !== asstId && m.content)
      .slice(-6)
      .map((m) => ({ role: m.role === "assistant" ? "model" : "user", content: m.content }));

    // typing indicator IS the mascot's thinking state (brief phase 4).
    mascot.setEnabled(true);
    mascot.hold("chat", "thinking");

    const appendDelta = (delta: string) =>
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === asstId ? { ...m, content: m.content + delta } : m,
        ),
      }));

    const finishAssistant = (patch: Partial<ChatMsg> = {}) =>
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === asstId ? { ...m, pending: false, ...patch } : m,
        ),
      }));

    // Run with 429 backoff — mascot stays in `thinking` between attempts.
    const MAX_ATTEMPTS = 3;
    let attempt = 0;
    let firstToken = true;

    while (attempt < MAX_ATTEMPTS) {
      try {
        for await (const ev of streamChat(clean, history, get().sessionId)) {
          if (ev.type === "delta") {
            if (firstToken) {
              firstToken = false;
              mascot.hold("chat", "speaking"); // first token -> speaking
            }
            appendDelta(ev.text);
            // nudge speaking flicker on each token
            mascot.setMood(mascotStore.getState().mood);
          } else if (ev.type === "control") {
            mascot.setMood(MOOD_MAP[ev.control.mood] ?? "neutral");
            if (ev.control.action === "point_to_contact") finishAssistant({ pointToContact: true });
          } else if (ev.type === "error") {
            // Degrade to a static fallback; Body keeps running (brief §7).
            if (!get().messages.find((m) => m.id === asstId)?.content) {
              appendDelta(
                "I'm having trouble reaching my knowledge right now. You can reach the team through the contact form and they'll help directly.",
              );
            }
            finishAssistant({ pointToContact: true });
          }
        }
        break; // stream completed
      } catch (e) {
        if (e instanceof RateLimitedError && attempt < MAX_ATTEMPTS - 1) {
          attempt += 1;
          // exponential backoff, capped; stay in `thinking`
          const wait = Math.min(e.retryAfterMs, 1500 * 2 ** attempt);
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }
        // out of retries (or non-retryable): apologize once, surface contact.
        if (!get().messages.find((m) => m.id === asstId)?.content) {
          appendDelta(
            e instanceof RateLimitedError
              ? "I'm getting a lot of questions right now. Give me a moment, or reach the team via the contact form."
              : "Something went wrong on my end. The contact form is the quickest way to reach the team.",
          );
        }
        finishAssistant({ pointToContact: true });
        break;
      }
    }

    finishAssistant();
    set({ streaming: false });
    // settle mascot back to idle shortly after speaking ends
    setTimeout(() => mascotStore.getState().hold("chat", null), 400);
  },
}));
