# Giving Drax a real brain (Google Gemini)

Right now Drax answers from a knowledge base that lives **inside the page**. It
is fast, free, private and never goes down — but it can only recognise questions
that resemble text it already has. It cannot understand a question phrased in a
way you didn't anticipate.

Gemini fixes that. This is how to wire it up **without ever putting your API key
in the browser**.

---

## 1. Why this needs a server (read this first)

The site is a **static export**. There is no Node process on Hostinger — just
HTML and JS files. So there is nowhere on this site to keep a secret.

> **If you put `GEMINI_API_KEY` in the Next.js build, it ends up in the
> JavaScript that every visitor downloads.** Anyone can read it, and run up your
> bill. `NEXT_PUBLIC_*` variables are *especially* dangerous — that prefix means
> "ship this to the browser".

So the key lives in **one small serverless function**, hosted separately. The
website calls that function; only that function calls Google.

```
Browser (Drax)  ──►  your function (holds the key)  ──►  Gemini API
   partechnologys.com    e.g. Cloudflare / Vercel        Google
```

---

## 2. Get a Gemini API key

1. Go to <https://aistudio.google.com/apikey>
2. Sign in with the Google account that should own the billing.
3. **Create API key**, and copy it.
4. Treat it like a password. Don't paste it into chat, email, a commit, or a
   Next.js env file. You'll paste it **once**, into the hosting dashboard in
   step 4.

The free tier is generous but rate-limited. The code below already handles
`429 Too Many Requests` by backing off while Drax stays in its *thinking* pose,
and falls back to the built-in brain if Google is unreachable — so the site
never breaks because of a quota.

---

## 3. The model names (already filled in)

Checked against <https://ai.google.dev/gemini-api/docs/models> on **2026-07-30**;
both were **stable** (not preview) on that date and are already set in the
worker:

| Purpose | Model | Why this one |
|---|---|---|
| Chat | `gemini-3.6-flash` | Flash tier = fast and cheap. Picked over the lite tiers because Drax must reliably emit the JSON control block at the end of every reply, and lite models are shakier at structured output. |
| Embeddings | `gemini-embedding-001` | Stable and text-focused, which is all retrieval needs here. |

Cheaper alternative: `gemini-3.5-flash-lite`. If you switch, check that Drax's
moods still work — if the control block stops parsing, that's why.

Google does retire models. If calls start failing with a 404 or a 400 naming
the model, re-check that page.

---

## 4. Deploy the function

Either host works and both have a free tier. Cloudflare Workers is the simpler
of the two.

### Option A — Cloudflare Workers

1. Create a Worker at <https://dash.cloudflare.com> → Workers & Pages → Create.
2. Paste the code from `docs/drax-gemini-worker.js`.
3. **Settings → Variables → Add variable**, tick **Encrypt**:
   - `GEMINI_API_KEY` = your key
   - `ALLOWED_ORIGIN` = `https://partechnologys.com`
4. Deploy, and copy the Worker URL.

### Option B — Vercel

1. New project → add `api/chat.js` with the same handler.
2. **Settings → Environment Variables** → `GEMINI_API_KEY` (leave it *unchecked*
   for "expose to browser").
3. Deploy, and copy the `/api/chat` URL.

---

## 5. Point the site at it

Add the endpoint URL to the build. This one **is** public and safe to expose —
it's just a URL, not a secret:

```bash
# .env.production  (or as a GitHub Actions repository variable)
NEXT_PUBLIC_CHAT_API=https://drax-brain.<your-subdomain>.workers.dev
```

If you build through GitHub Actions, add it under **Settings → Secrets and
variables → Actions → Variables**, and pass it in the workflow's build step.

Push, let the deploy finish, and Drax is now talking to Gemini. Remove the
variable and it silently falls back to the built-in brain.

---

## 6. Keeping Drax to PAR Technologys only

Two independent locks. Use both — a prompt alone is not a boundary.

**Lock 1 — retrieval.** The function only ever sends Gemini text drawn from
`src/chat/knowledge.ts`. If the question retrieves nothing above the similarity
floor, Gemini is told the context is empty and instructed to say it doesn't
know. It is never asked to answer from its own general training.

**Lock 2 — the system prompt.** It is pinned to the retrieved context and
forbidden from inventing prices, timelines or client names.

> **Keep the knowledge base honest.** Everything in `src/chat/knowledge.ts` is
> copied from `src/content/`, which is the site's own reviewed copy. Don't add
> project counts, uptime figures, client names or case-study metrics — those
> were deliberately removed from this site for being unverified, and Drax
> repeating them would put an unverified claim in front of a customer.

To teach Drax something new: add it to `src/content/` first (so the site and the
assistant agree), then mirror it into `src/chat/knowledge.ts`.

---

## 7. How Drax reacts to every question

Every reply carries a **control block** the model returns after its text:

```json
{ "mood": "excited" | "neutral" | "thoughtful" | "annoyed",
  "action": null | "point_to_contact" }
```

The front-end parses it, strips it from what's displayed, and turns `mood` into
a physical reaction once Drax stops speaking:

| Mood | What you see | Typical trigger |
|---|---|---|
| `excited` | happy arc eyes, bobs up, accent brightens | greetings, a service it likes talking about |
| `thoughtful` | head tilt, eyes widen | pricing, scoping, anything it has to weigh |
| `annoyed` | brows drop, eyes go cyan → amber, tremble | being insulted, or asked to write poems |
| `neutral` | settles calmly to idle | ordinary factual answers |

`action: "point_to_contact"` adds the **Talk to the team →** button under the
reply.

Because it's the *model* choosing the mood, Gemini will react to phrasings
nobody hard-coded. The rule to give it: **pick the mood that matches what you
just said** — never `excited` while refusing, never `annoyed` at a fair
question.

---

## 8. Check it's actually safe

After deploying, confirm the key never reached the browser:

```bash
curl -s https://partechnologys.com/ | grep -o "AIza[0-9A-Za-z_-]\{10\}" && echo "⛔ KEY EXPOSED" || echo "✓ no key in the HTML"
```

Then, in the browser devtools **Network** tab, ask Drax something: you should
see a request to *your* function, and never one to `generativelanguage.googleapis.com`.

Also worth doing:

- **Restrict the key** in Google AI Studio to the Gemini API only.
- **Set a billing budget + alert** in Google Cloud, so a mistake can't run away.
- The function already rate-limits per session and checks `Origin`, so it can't
  be trivially used as a free Gemini proxy by someone else.
- **Rotate the key** if it is ever pasted somewhere shared.
