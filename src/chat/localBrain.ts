import { KNOWLEDGE } from "./knowledge";
import type { ChatEvent, WireMessage } from "./api";

/**
 * Drax's Brain, running in the browser.
 *
 * The site is a static export, so there is no server to retrieve on. The corpus
 * is ~10 short chunks, so the full pipeline (embed → cosine top-k → similarity
 * floor → stream) runs client-side at negligible cost. Identical behaviour to
 * the server version: off-topic questions retrieve nothing and get a clean
 * refusal instead of an invented answer.
 *
 * This is the SAME contract a real provider will implement later — when a
 * Gemini endpoint exists, set NEXT_PUBLIC_CHAT_API and api.ts routes there
 * instead, with no change to the UI or the mascot lifecycle.
 */

// Wide enough that unrelated tokens rarely collide. A small dimension lets
// off-topic queries clear the similarity floor and defeats the refusal path.
const DIM = 8192;
const TOP_K = 4;
const FLOOR = 0.12;

/** Common words carry no topic signal; without this "what/you/how" match everything. */
const STOP = new Set(
  "the and for you your our are can with what how does did was were this that from have has had will would who out into about their they them thing things get got not but all any why when where which while over under more most some such only also just like using use used need needs are is it its".split(
    /\s+/,
  ),
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

function hashToken(tok: string): number {
  let h = 2166136261;
  for (let i = 0; i < tok.length; i++) {
    h ^= tok.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % DIM;
}

/** Sparse L2-normalised bag-of-words vector, held as a Map to stay cheap. */
function embed(text: string): Map<number, number> {
  const v = new Map<number, number>();
  for (const tok of tokenize(text)) {
    const k = hashToken(tok);
    v.set(k, (v.get(k) ?? 0) + 1);
  }
  let n = 0;
  for (const x of v.values()) n += x * x;
  n = Math.sqrt(n) || 1;
  for (const [k, x] of v) v.set(k, x / n);
  return v;
}

function cosine(a: Map<number, number>, b: Map<number, number>): number {
  // both are unit vectors, so the dot product IS the cosine
  let dot = 0;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const [k, x] of small) {
    const y = large.get(k);
    if (y !== undefined) dot += x * y;
  }
  return dot;
}

// Index the corpus once, lazily, on first question.
let INDEX: { source: string; text: string; vec: Map<number, number> }[] | null = null;
function getIndex() {
  if (!INDEX) {
    INDEX = KNOWLEDGE.map((d) => ({ source: d.source, text: d.text, vec: embed(d.text) }));
  }
  return INDEX;
}

export interface Retrieved {
  source: string;
  text: string;
  score: number;
}

export function retrieve(query: string): Retrieved[] {
  const qv = embed(query);
  return getIndex()
    .map((c) => ({ source: c.source, text: c.text, score: cosine(qv, c.vec) }))
    .filter((r) => r.score >= FLOOR)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K);
}

/** Trim retrieved context into a short, spoken-sounding answer. */
function compose(hits: Retrieved[], question: string): string {
  const best = hits[0];
  // Prefer the FAQ-style chunks: they are already written as an answer.
  const body = best.text
    .replace(/^[^?]*\?\s*/, "") // drop a leading "Question?" if present
    .replace(/\s+/g, " ")
    .trim();

  const sentences = body
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);

  // Two to four sentences by default (the brief's voice rule).
  const wantsDetail = /\b(detail|more|explain|how exactly|walk me)\b/i.test(question);
  return sentences.slice(0, wantsDetail ? 4 : 3).join(" ");
}

/**
 * Off-topic replies. Drax stays in character: it only knows PAR Technologys,
 * but it reacts to being asked something else rather than emitting the same
 * flat refusal every time. Each carries its own mood so the mascot's face
 * matches what it just said.
 */
const OFF_TOPIC: { test: RegExp; mood: "thoughtful" | "annoyed" | "excited"; reply: string }[] = [
  {
    // greetings and pleasantries
    test: /^\s*(hi|hey|hello|yo|good (morning|afternoon|evening)|how are you|what'?s up)\b/i,
    mood: "excited",
    reply:
      "Hello. I'm Drax — I look after questions about PAR Technologys. Ask me what we build, how long things take, or how we price.",
  },
  {
    // asking what Drax itself is
    test: /\b(who|what) are you\b|\byour name\b|\bare you (a )?(bot|ai|robot|human|real)\b/i,
    mood: "excited",
    reply:
      "I'm Drax, PAR Technologys' assistant. I only know this company — so I'll be genuinely useful about our work, and useless about almost everything else.",
  },
  {
    // rude / testing the boundaries
    test: /\b(stupid|dumb|useless|idiot|shut up|suck|hate you|rubbish|trash)\b/i,
    mood: "annoyed",
    reply:
      "Noted. I'm still only going to be helpful about PAR Technologys — ask me something about the work and I'll do better.",
  },
  {
    // trying to get it to be a general-purpose assistant
    test: /\b(write|generate|code|poem|joke|story|recipe|essay|translate|summari[sz]e)\b/i,
    mood: "annoyed",
    reply:
      "That's not what I'm for — I'm the PAR Technologys assistant, not a general-purpose one. Ask me about our services, process, timelines or pricing.",
  },
];

const REFUSAL =
  "I don't have that in what I know about PAR Technologys. I can put you in touch with the team, who'll know for sure — want the contact page?";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Streams a reply as ChatEvents, mirroring the server's SSE shape exactly so
 * useChat.ts is agnostic to which brain answered.
 */
export async function* runLocalChat(
  message: string,
  _history: WireMessage[],
): AsyncGenerator<ChatEvent> {
  // a beat of "thinking" so the mascot's thinking state is actually visible
  await delay(420);

  const hits = retrieve(message);

  let reply: string;
  let mood: "excited" | "neutral" | "thoughtful" | "annoyed" = "neutral";
  let action: null | "point_to_contact" = null;

  // A canned in-character response beats a refusal for the common off-topic
  // cases, and each one carries the mood the mascot should show.
  const canned = hits.length === 0 ? OFF_TOPIC.find((o) => o.test.test(message)) : undefined;

  if (canned) {
    reply = canned.reply;
    mood = canned.mood;
  } else if (hits.length === 0) {
    reply = REFUSAL;
    mood = "thoughtful";
    action = "point_to_contact";
  } else {
    reply = compose(hits, message);
    if (/price|cost|quote|budget|pricing/i.test(message)) mood = "thoughtful";
    else if (/hello|hi\b|hey|thanks|thank you|great|awesome|nice/i.test(message)) mood = "excited";
    if (/contact|talk|call|email|reach|team|human|book|meeting/i.test(message)) {
      action = "point_to_contact";
    }
    yield { type: "sources", sources: hits.map((h) => h.source) };
  }

  // stream word by word with realistic pacing
  const tokens = reply.split(/(\s+)/);
  for (const tok of tokens) {
    await delay(18 + Math.random() * 26);
    yield { type: "delta", text: tok };
  }

  yield { type: "control", control: { mood, action } };
  yield { type: "done" };
}
