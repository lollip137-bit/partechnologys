# Giving Drax a real brain — Groq + Cloudflare, free, no card ever

Gemini was abandoned for this project — the free-tier project got stuck behind
Google's "Activate billing" wall, and enabling billing on the Gemini API drops
you out of the free tier entirely (confirmed on Google's own billing docs), so
there was no free path forward there.

Drax now runs on a **hybrid**: **Groq** for the actual conversation, and
**Cloudflare Workers AI** (which you already have set up) for retrieval only.

> **Why hybrid, not one or the other:** Groq's free tier is generous for chat
> — **14,400 requests/day**, no card ever — but Groq doesn't offer a text
> embedding model. Cloudflare's `bge` embedding model does that job for free,
> and you already have the binding from the earlier attempt. No reason to sign
> up for a second thing just to duplicate what you've already got.

Also included: **lead capture**. When a visitor shows real buying intent, Drax
asks for their name, email, and what they want built — one question at a
time, in conversation, never a form dump — and once it has all three, saves
them and tells the visitor it's passed them to the team. Fields match the
site's real contact form (`name`, `company`, `email`, `message` — no phone
field there, so Drax doesn't push for one either; it only records a phone
number if a visitor offers it unprompted).

> ⚠️ **No WhatsApp handoff is built.** There's no real WhatsApp number
> anywhere in the site's content — only generic mentions of "phone" as a
> service channel — and inventing one would put a fake number in front of
> customers. If you have a real business WhatsApp number, give it to me and
> I'll wire up a proper handoff (a `wa.me` link Drax can offer once someone
> wants to talk immediately).

---

## Step 1 — Get a free Groq key (no card, ever)

1. Go to **https://console.groq.com** → sign up with email (no card asked)
2. Left sidebar → **API Keys** → **Create API Key**
3. Copy it. Treat it like a password — paste it **only** in Step 3 below,
   nowhere else.

## Step 2 — Replace the Worker's code

1. **Cloudflare dashboard** → **Workers & Pages** → your `drax-brain` Worker
2. **Edit code**
3. Select all, delete, paste the entire contents of:
   ```
   D:\PAR_TECHNOLOGYS_V2\docs\drax-brain-worker.js
   ```
4. **Deploy**

## Step 3 — Add the Groq key

1. Still on your Worker, **Settings** → **Variables and Secrets** → **Add**
2. Type: **Secret** (this encrypts it — always choose Secret for keys, never Text)
3. Name: exactly `GROQ_API_KEY`
4. Value: paste the key from Step 1
5. **Deploy**

## Step 4 — Keep the Workers AI binding (used for retrieval only now)

You should already have this from the earlier attempt — confirm it's still
there:

1. **Settings** → **Bindings**
2. Confirm there's a **Workers AI** binding named exactly `AI`
3. If it's missing: **Add** → **Workers AI** → variable name `AI` → **Deploy**

## Step 5 — Add the KV binding (for lead capture)

A KV namespace is Cloudflare's free key-value store — this is where captured
leads (name, email, project) get saved so you can read them back.

1. **Settings** → **Bindings** → **Add**
2. Choose **KV Namespace**
3. Variable name: exactly `LEADS`
4. If you don't have a namespace yet, there's a **Create new** option right in
   this same step — name it anything, e.g. `drax-leads`
5. **Deploy**

## Step 6 — Keep (or re-check) the origin variable

1. **Settings** → **Variables and Secrets**
2. Confirm `ALLOWED_ORIGIN` (Text) = `https://partechnologys.com`

(`GEMINI_API_KEY`, if it's still listed from the earlier attempt, can be
deleted — nothing reads it anymore. The abandoned `drax-ai-bot` Google Cloud
project is also safe to ignore or delete; nothing was ever billed on it.)

## Step 7 — Nothing to do on GitHub

`NEXT_PUBLIC_CHAT_API` is already set to your Worker's URL from the earlier
setup, and that URL hasn't changed. The website doesn't know or care what runs
inside the Worker — you don't need to touch the repo or trigger a deploy.

---

## How to read captured leads

There's no admin page for this yet — leads live in the KV namespace from
Step 5. To view them:

1. **Cloudflare dashboard** → **Workers & Pages** → **KV** (left sidebar)
2. Open your `drax-leads` namespace
3. Each key looks like `lead:2026-07-31T10:22:03.000Z:s_abc123` — click one to
   see the stored JSON (name, email, project, company, phone, timestamp).

If you'd rather get an email the moment a lead comes in, say so and I'll add
that — it needs either a small third-party email API (its own free signup) or
moving the domain's DNS onto Cloudflare to use their native email sending,
which is a bigger change I wouldn't make without asking first.

---

## Verify it's actually answering from Groq, not the fallback

The clearest tell: the built-in fallback brain **quotes sentences verbatim**
from the knowledge base. A real model **paraphrases** — it won't repeat the
exact same sentence every time, and it can handle odd phrasing the fallback
can't.

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
3. Read the log line — it will say exactly what failed:
   - `Server not configured: no GROQ_API_KEY` → Step 3 wasn't completed, or
     the variable name has a typo (must be exactly `GROQ_API_KEY`).
   - `Groq chat call failed: 401 ...` → the key itself is wrong or was pasted
     with extra whitespace — recopy it from console.groq.com/keys.
   - `Server not configured: no AI binding` → Step 4's binding is missing or
     misnamed (must be exactly `AI`).
   - Anything mentioning the embed model → that's Cloudflare's side (retrieval),
     not Groq — check the `AI` binding first.

---

## Tuning notes for later (optional, not required now)

- **`FLOOR` in the Worker (currently `0.6`)** controls how strict retrieval is
  before Drax will answer at all. If it starts refusing things it clearly
  should know, lower it slightly; if it starts answering things outside its
  knowledge, raise it. Watch the Logs tab while testing.
- **Model swap:** `openai/gpt-oss-20b` is a strong default with real tool-use
  training (which helps it reliably emit the reaction block). If you ever want
  to compare, check **console.groq.com/docs/models** for the current catalogue
  before switching — Groq deprecates models on notice (it retired
  `llama-3.1-8b-instant` and `llama-3.3-70b-versatile` in June 2026), so don't
  trust an older guide's model name.
- **Rate limits:** Groq's free tier is 14,400 requests/day but also capped at
  30 requests/minute — comfortably enough for a small business site's real
  traffic, but if the site ever gets a sudden burst (e.g. a viral post), you'd
  see `429`s. The Worker already falls back to the built-in brain when that
  happens, so the chat never breaks — it just gets less clever for a moment.
