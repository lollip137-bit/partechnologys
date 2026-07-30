# Giving Drax a real brain — free, open-source, no card ever

This replaces the earlier Gemini plan. Google now requires a billing account
(a card on file) even to use their free tier on a manually created project —
that's what the "Restricted / Set up billing" status you hit was. Rather than
add a card, Drax now runs on **Cloudflare Workers AI**: real open-weight models
(Meta's Llama, BAAI's embeddings) hosted by Cloudflare, on the **same account
you already have**, with a genuinely free daily allowance and no card ever.

> **10,000 free "Neurons" a day**, resetting at midnight UTC — roughly 1,300
> chat replies or 12,500 embeddings. A small business site won't come close.

---

## What changed vs. the Gemini plan

- No API key. No `aistudio.google.com`. No Google Cloud project at all —
  you can ignore or delete the `drax-ai-bot` project, it's unused and nothing
  was ever billed on it.
- The **same Worker URL** you already gave GitHub
  (`https://drax-brain.partechnologys.workers.dev`) keeps working — the site's
  `NEXT_PUBLIC_CHAT_API` setting doesn't change. You only need to update the
  code **inside** the Worker.

---

## Step 1 — Replace the Worker's code

1. **Cloudflare dashboard** → **Workers & Pages** → your `drax-brain` Worker
2. **Edit code**
3. Select all, delete, paste the entire contents of:
   ```
   D:\PAR_TECHNOLOGYS_V2\docs\drax-brain-worker.js
   ```
4. **Deploy**

## Step 2 — Add the Workers AI binding (replaces the API key step)

This is the one new thing. It's a checkbox, not a signup — Workers AI is part
of the account you're already on.

1. Still on your Worker, go to **Settings** → **Bindings**
2. **Add** → choose **Workers AI**
3. Variable name: exactly `AI` (capital letters, the code expects this name)
4. **Deploy**

## Step 3 — Keep (or re-check) the origin variable

You should already have this from the Gemini setup — no change needed:

1. **Settings** → **Variables and Secrets**
2. Confirm `ALLOWED_ORIGIN` = `https://partechnologys.com`

(`GEMINI_API_KEY`, if it's still listed from before, can be deleted — it's no
longer read by anything.)

## Step 4 — Nothing to do on GitHub

`NEXT_PUBLIC_CHAT_API` is already set to your Worker's URL from the earlier
setup, and that URL hasn't changed. The website doesn't know or care what runs
inside the Worker — you don't need to touch the repo or trigger a deploy.

---

## Verify it's actually answering from Llama, not the fallback

The clearest tell: the built-in fallback brain **quotes sentences verbatim**
from the knowledge base. Llama, like Gemini, **paraphrases** — it won't repeat
the exact same sentence every time, and it can handle odd phrasing the
fallback can't.

Ask something the fallback previously failed on, e.g.:

> "How much time does it take to build a fully 3D animated website?"

If it now gives a real, specifically-phrased answer instead of the same
"I don't have that in what I know…" line, it's working.

**Confirm in the Network tab too:** open the site, `F12` → **Network**, ask
Drax something, and look for the call to `drax-brain.partechnologys.workers.dev`
returning a real streamed answer (not an immediate `type:"error"` frame).

## If it's still falling back

1. Cloudflare dashboard → your Worker → **Logs** tab → **Begin log stream**
2. Ask Drax a question on the live site
3. Read the log line — it will say exactly what failed. Two things to check
   first if it's a permission-style error:
   - The **AI binding is spelled `AI`** exactly (Step 2) — a typo here means
     `env.AI` is `undefined` and the Worker returns "no AI binding".
   - **Workers AI is enabled for the account** — it's on by default for every
     Cloudflare account, but if it was ever explicitly disabled, re-enable it
     under **Account Home → Workers AI**.

---

## Tuning notes for later (optional, not required now)

- **The model occasionally forgets to end its message with the reaction
  code.** Open models are less obedient than Gemini about following an exact
  format instruction. The Worker already handles this gracefully — if the
  control block is missing, Drax just settles to a calm, neutral expression
  instead of getting stuck. Nothing breaks; it just means a slightly less
  expressive reaction on the occasional reply.
- **`FLOOR` in the Worker (currently `0.6`)** controls how strict retrieval is
  before Drax will answer at all. If it starts refusing things it clearly
  should know, lower it slightly; if it starts answering things outside its
  knowledge, raise it. Watch the Logs tab while testing — nothing to change
  today, just something to know exists.
- **Model swap:** `@cf/meta/llama-3.1-8b-instruct-fp8` is a good default. If
  you ever want to compare, `@cf/meta/llama-3.3-70b-instruct-fp8` is larger and
  more capable but uses more of the daily Neuron budget per reply — check
  developers.cloudflare.com/workers-ai/models before switching, model names do
  change over time.
