---
title: Gemini Events AI Plan
task: GEM-EVENTS-001 — Create Gemini Events AI Plan
date: 2026-06-16
status: Plan only — no code in this task
stack: Next.js 16, CopilotKit v2 (pinned 1.55.2), Mastra, Supabase, Google Maps / Places API New, ADK, Gemini
model_default: gemini-3.5-flash (Pro tier: gemini-3.1-pro-preview · Lite: gemini-3.1-flash-lite)
owners: AI / Events
related:
  - docs/tasks/events/events-prd.md
  - src/mastra/agents/host-event.ts
  - .claude/skills/gemini/references/model-registry.md
---

# Gemini Events AI Plan

> **Read me first (plain English).** This document is the build map for the AI brain
> behind Roberto's event creation flow at `/host/event/new`. It says exactly what Gemini
> (Google's AI model) is allowed to do, what it is **never** allowed to do, which tools and
> agents we build, and in what order. The single most important rule lives in §9: **Gemini
> writes words, ranks options, and fills forms — it never invents a map pin, a place ID, a
> price, or an availability slot.** Those facts come from Supabase, Stripe, and Google Maps.
> Gemini only explains and arranges them.

---

## 1. Executive Summary

**What we are building:** an AI assistant that turns a host's plain-English description
("I want a 200-person rooftop launch party in El Poblado next month") into a complete,
ready-to-review event draft — title, description, venue shortlist with real map pins,
and suggested ticket tiers — that Roberto approves before anything goes live.

**How Gemini powers it, in one line:** Gemini is the *language and judgment layer*. It
reads messy human text, pulls out structured facts, asks our own tools for real venues,
ranks those venues with a reason, writes the marketing copy, and proposes ticket prices —
then hands the whole package to Roberto for a yes/no.

**The hard boundary that makes this safe:**

| Job | Who owns the truth | Gemini's role |
|---|---|---|
| Venue exists / its coordinates / place ID | Google Maps / Places API New + ADK | Asks for them, never invents them |
| Event saved / published | Supabase | Proposes a draft; a human approves the write |
| Ticket money charged | Stripe | Never touched by Gemini |
| Venue facts (capacity, address, hours) | Google Maps + our DB | Quotes them, never makes them up |
| Title, description, ranking reason, tier names | **Gemini** | Generates and explains |

**Why this matters to the business:** Roberto (event host) gets a 5-minute event setup
instead of a 30-minute form. Camila and Andrés (attendees) only ever see real venues with
working map pins, because Gemini is structurally blocked from inventing geography. If we
get §9 wrong, a host could publish an event at a venue that does not exist — so the
guardrails are not optional polish, they are the product.

**Model choice:** default everything to **`gemini-3.5-flash`** (fast, cheap, strong tool
use). Use **`gemini-3.1-pro-preview`** only for the heaviest reasoning (advanced sponsor
matching, post-event analysis). Use **`gemini-3.1-flash-lite`** for cheap bulk jobs
(batch enrichment, cached summaries). Re-verify model IDs against the Gemini model
registry before coding — previews get superseded fast.

---

## 2. Core Use Cases

These are the real things a host or attendee asks for. Each maps to one or more tools (§6)
and agents (§5).

| # | Use case | Persona | What Gemini does | Truth source it must use |
|---|---|---|---|---|
| 1 | **Event detail extraction** | Roberto | Reads a free-text pitch, fills the draft fields (date, headcount, vibe, budget) | — (pure language) |
| 2 | **Venue suggestion** | Roberto | Calls our venue search, presents a shortlist as cards + pins | Maps/Places + Supabase venues |
| 3 | **Venue ranking** | Roberto | Orders the shortlist and gives a one-line reason per venue | Facts from the search results only |
| 4 | **Event description generation** | Roberto | Writes title + marketing copy in mdeai's voice | — (pure language) |
| 5 | **Ticket tier suggestions** | Roberto | Proposes tier names, prices, quantities as a *draft* | Capacity from venue; host confirms price |
| 6 | **Approval before publishing** | Roberto | Stops and asks for explicit yes/no before any save/publish | HITL gate (§6 `preparePublishApproval`) |
| 7 | **Event search / discovery** | Camila, Tourist | Understands "live music this weekend under $30" and queries real events | Supabase events + Search grounding |
| 8 | **Support questions** | Roberto | Answers "is this venue good for 200 people?" using the venue's real capacity | Venue facts from Maps/DB, never guessed |

**Guard note on use case 8:** if our data does not have the venue's capacity, Gemini must
say "I don't have that venue's capacity on file" — **not** invent a number. This is a §9
rule, enforced by Zod validation and a test (§11).

---

## 3. Core MVP Tasks

The minimum to ship Roberto's flow end to end. Each is a Linear-style task with a clear
"done when."

| Task | What it builds | Done when |
|---|---|---|
| **GEM-EVENTS-001 — Event Description Parser** | Gemini call that turns free text into raw extracted fields | A pitch string returns date/headcount/vibe/budget candidates; junk text returns empty fields, not hallucinated ones |
| **GEM-EVENTS-002 — Structured Event Draft Output** | Force Gemini's output through a Zod schema (`EventDraftStateSchema`) | Output always parses; invalid output is rejected and retried, never saved |
| **GEM-EVENTS-003 — Venue Search Tool Planning** | The `searchVenuesForEvent` tool contract (input/output, source = Maps/Places) | Gemini can request venues by area + headcount; results carry real place IDs + coords |
| **GEM-EVENTS-004 — Venue Ranking Logic** | `rankVenueCandidates` — orders search results with a reason | Ranking only references fields present in the candidates; no new facts appear |
| **GEM-EVENTS-005 — Event Copy Generator** | `generateEventDescription` — title + body copy | Copy is on-brand, English-only (Phase 1), no invented venue facts |
| **GEM-EVENTS-006 — Human Approval Gate** | The HITL stop before save/publish (`renderAndWaitForResponse`) | No draft saves and nothing publishes without an explicit host approval event |
| **GEM-EVENTS-007 — Streaming UI Response** | Token streaming so Roberto sees progress, not a spinner | Copy and reasoning stream into the UI; final structured draft arrives intact |
| **GEM-EVENTS-008 — Gemini Safety + No Hallucinated Geo Rules** | System prompt + validators that block invented coords/place IDs/prices | A test proves Gemini cannot output a lat/lng or place ID it was not given |

---

## 4. Advanced Tasks (Post-MVP)

Build only after §3 is green and used by real hosts.

| Task | What it adds | Persona payoff | Gemini feature it leans on |
|---|---|---|---|
| **Sponsor matching** | Suggests likely sponsors for an event profile | Roberto monetizes | Thinking + Search grounding |
| **Audience targeting** | Describes who to market the event to | Roberto/Patricia | Thinking + structured output |
| **Campaign copy** | Email/social copy variants per audience | Roberto | Text generation + batch |
| **Post-event report** | Plain-English summary of attendance/revenue | Patricia | Thinking + code execution (for the math) |
| **Batch enrichment** | Bulk-fill descriptions/tags for many events overnight | Patricia | **Batch API** + Flash-Lite |
| **Cached venue summaries** | Reusable, pre-written venue blurbs | Roberto (faster flow) | **Context caching** |
| **Live event assistant** | Real-time help during a running event | Roberto | **Live API** |
| **Voice / Live API** | Talk-to-create an event hands-free | Roberto | **Live API** (audio) |
| **Webhook-based automation** | Long jobs (reports, batch) notify us when done | Patricia | **Webhooks** + Batch |
| **Search grounding for fresh facts** | "What else is on that weekend?" using live web | Camila/Roberto | **Google Search grounding** |

---

## 5. Agents

Agents are the named "workers." Each is a Mastra `Agent` running on a Gemini model with a
fixed toolbox. The golden rule from the codebase: **the agent name in `useCoAgent({ name })`
must match the key in `Mastra({ agents: {…} })`** or production silently 404s.

### 5.1 `hostEventAgent` — the event creation lead (MVP)
- **Purpose:** drive Roberto's whole create-event conversation at `/host/event/new`.
- **Inputs:** host's chat messages, current `EventDraftState`, thread memory.
- **Outputs:** updated draft, venue shortlist, copy, ticket-tier proposals, an approval request.
- **Tools allowed:** `extractEventDraft`, `searchVenuesForEvent`, `rankVenueCandidates`,
  `generateEventDescription`, `suggestTicketTiers`, `validateEventDraft`, `preparePublishApproval`.
- **Tools forbidden:** anything that writes to Supabase or Stripe directly; raw coordinate creation.
- **Human approval:** **required** before save-draft and before publish. Already exists today as
  `host-event.ts` (`hostEventAgent`, `id: "host-event-agent"`, `FLASH_MODEL`).

### 5.2 `venueDiscoveryAgent` — finds and ranks real venues (MVP)
- **Purpose:** given event needs (area, headcount, vibe, budget), return a ranked, real shortlist.
- **Inputs:** structured event needs from the draft.
- **Outputs:** ordered venue candidates with place IDs, coords, and a one-line reason each.
- **Tools allowed:** `searchVenuesForEvent`, `rankVenueCandidates`, `summarizeVenueFromUrl` (read-only).
- **Tools forbidden:** writing drafts; inventing venues; ticket/payment tools.
- **Human approval:** none to *search*; the host approves which venue is chosen (handled by `hostEventAgent`).

### 5.3 `eventCopyAgent` — the copywriter (MVP / P1)
- **Purpose:** write title + description + (later) campaign copy in mdeai's voice, English only.
- **Inputs:** approved event facts (date, venue name, vibe).
- **Outputs:** title, short description, long description.
- **Tools allowed:** none (pure language) — optionally `searchFreshEventContext` for accurate references.
- **Tools forbidden:** any data-writing or geo tool; must not state venue facts it was not given.
- **Human approval:** host edits/accepts copy before publish.

### 5.4 `ticketStrategyAgent` — proposes ticket tiers (P1)
- **Purpose:** suggest tier names, prices, and quantities as a *draft only*.
- **Inputs:** venue capacity, event type, host's price hints.
- **Outputs:** proposed tiers (name, price, quantity) — clearly marked "suggestion."
- **Tools allowed:** `suggestTicketTiers`, `validateEventDraft`.
- **Tools forbidden:** **Stripe / any payment mutation** — proposing a price is fine, charging is not.
- **Human approval:** **required** — host confirms every price before it is saved.

### 5.5 `eventDiscoveryAgent` — attendee-side search (P1)
- **Purpose:** power Camila/Tourist event search and discovery ("live music under $30 this weekend").
- **Inputs:** natural-language query, optional location/date filters.
- **Outputs:** matched real events (cards + pins).
- **Tools allowed:** `searchFreshEventContext`, existing `search_events`, Search grounding.
- **Tools forbidden:** any host-write or payment tool; inventing events.
- **Human approval:** none (read-only discovery).

### 5.6 `sponsorResearchAgent` — sponsor matching (ADVANCED ONLY)
- **Purpose:** propose plausible sponsors for an event profile, with sourced reasoning.
- **Inputs:** event profile, audience description.
- **Outputs:** ranked sponsor leads with a cited reason each.
- **Tools allowed:** `searchFreshEventContext`, `summarizeVenueFromUrl`/URL context, Search grounding.
- **Tools forbidden:** contacting sponsors, writing CRM records, payments.
- **Human approval:** **required** — every lead is a suggestion Patricia/Roberto vet before outreach.

---

## 6. Tools

Tools are the only way Gemini touches the real world. Each has a typed input and output,
a single source of truth, a defined failure behavior, and a "can Gemini call it directly?"
flag. Schemas below are written in plain field lists; the implementation uses **Zod**
(a TypeScript validation library) so a malformed call is rejected before it runs.

> **Universal rule:** every tool's output is validated by Zod before the agent sees it. A
> tool that cannot get real data returns a typed "no data" result — it never fabricates.

### 6.1 `extractEventDraft`
- **Input:** `{ text: string, currentDraft?: EventDraftState }`
- **Output:** `{ title?, dateText?, headcount?, area?, vibe?, budgetText?, confidence: number }`
- **Source of truth:** the host's own words (language task, no external data).
- **Failure handling:** unreadable text → all fields empty + `confidence: 0`; never guesses.
- **Gemini can call directly?** Yes (it is Gemini's own structured-output result).

### 6.2 `searchVenuesForEvent`
- **Input:** `{ area: string, headcount: number, vibe?: string, priceLevel?: 1|2|3|4 }`
- **Output:** `{ candidates: Array<{ placeId, name, lat, lng, capacityHint?, priceLevel?, address }> }`
- **Source of truth:** **Google Maps / Places API New + ADK + Supabase venues.** Every call carries
  `X-Goog-FieldMask` (cost control) and uses real `mapId`-backed data.
- **Failure handling:** API down → empty `candidates` + an error flag; agent tells the host "couldn't
  reach venue data right now," never invents a venue.
- **Gemini can call directly?** Yes (read-only, safe).

### 6.3 `rankVenueCandidates`
- **Input:** `{ candidates: VenueCandidate[], needs: { headcount, vibe?, budget? } }`
- **Output:** `{ ranked: Array<{ placeId, rank, reason }> }`
- **Source of truth:** **only the fields already in `candidates`** — no new facts may appear.
- **Failure handling:** if a reason would require an unknown fact, it omits that fact; reasons cite
  only provided fields. Validated that every `placeId` in output existed in input.
- **Gemini can call directly?** Yes.

### 6.4 `generateEventDescription`
- **Input:** `{ eventFacts: { title?, date, venueName, vibe, headcount } }`
- **Output:** `{ title, shortDescription, longDescription }`
- **Source of truth:** the **provided** facts only (language task).
- **Failure handling:** missing facts → copy stays generic, never fills a gap with an invented detail.
- **Gemini can call directly?** Yes.

### 6.5 `suggestTicketTiers`
- **Input:** `{ capacity: number, eventType: string, priceHints?: { min?, max? } }`
- **Output:** `{ tiers: Array<{ name, price, quantity, note }>, isSuggestion: true }`
- **Source of truth:** capacity from the chosen venue; **prices are proposals the host must confirm.**
- **Failure handling:** total quantity never exceeds capacity (validated); no currency math invented —
  uses code execution if arithmetic is needed.
- **Gemini can call directly?** Yes, but output is always flagged `isSuggestion` and cannot auto-save.

### 6.6 `validateEventDraft`
- **Input:** `{ draft: EventDraftState }`
- **Output:** `{ valid: boolean, errors: string[] }`
- **Source of truth:** the **Zod `EventDraftStateSchema`** (the same schema the agent memory uses).
- **Failure handling:** any schema violation → `valid: false` with reasons; blocks the approval step.
- **Gemini can call directly?** Yes (and it must, before `preparePublishApproval`).

### 6.7 `preparePublishApproval`
- **Input:** `{ draft: EventDraftState }`
- **Output:** `{ approvalRequestId, summary }` then **pauses for a human** (`renderAndWaitForResponse`).
- **Source of truth:** the validated draft.
- **Failure handling:** invalid draft → refuses to open approval; nothing is saved/published.
- **Gemini can call directly?** It can *request* approval, but it **cannot grant it** — only Roberto's
  `respond(value)` unblocks the write. This is the §9 publish gate.

### 6.8 `searchFreshEventContext`
- **Input:** `{ query: string }`
- **Output:** `{ findings: Array<{ claim, sourceUrl }> }`
- **Source of truth:** **Google Search grounding** (live web), with source links attached.
- **Failure handling:** no grounding hit → empty findings; the agent must not state a fresh fact
  without a source link.
- **Gemini can call directly?** Yes (read-only).

### 6.9 `summarizeVenueFromUrl`
- **Input:** `{ url: string }`
- **Output:** `{ summary, extractedFacts: Array<{ label, value, fromUrl: true }> }`
- **Source of truth:** **URL context** — the actual page content, not memory.
- **Failure handling:** page unreachable → empty summary + error flag; no facts invented.
- **Gemini can call directly?** Yes (read-only); facts are tagged with their source URL.

### 6.10 `cacheVenueSummary`
- **Input:** `{ placeId: string, summary: string }`
- **Output:** `{ cached: boolean, cacheKey }`
- **Source of truth:** **Gemini context caching** + our own store, keyed by real `placeId`.
- **Failure handling:** cache miss/expired → regenerate from the real venue, never serve a stale guess
  as current availability.
- **Gemini can call directly?** No — this is an infra write; only server code calls it after a
  validated summary exists.

---

## 7. Workflows

Text flowcharts (read top to bottom). Each box is a step; **[HUMAN]** marks where Roberto
must act.

### 7.1 Create Event From Chat (MVP)
```
Roberto types a pitch
  -> hostEventAgent calls extractEventDraft
  -> validateEventDraft (Zod)
  -> agent asks for any missing must-haves (date, headcount)
  -> draft held in thread memory
  -> agent offers: "Want venue suggestions?"  [HUMAN: yes/no]
```

### 7.2 Suggest Venue From Event Description (MVP)
```
Draft has area + headcount
  -> venueDiscoveryAgent calls searchVenuesForEvent  (Maps/Places — real place IDs + coords)
  -> rankVenueCandidates  (reasons use only returned fields)
  -> UI shows cards + map pins  (pins come from real lat/lng, never Gemini)
  -> [HUMAN: Roberto picks one or asks for more options]
```

### 7.3 Approve Venue (MVP)
```
Roberto selects a venue card
  -> agent writes the chosen placeId + coords into the draft  (copied, not generated)
  -> validateEventDraft
  -> draft updated; agent moves to copy + tickets
```

### 7.4 Generate Ticket Tiers (P1)
```
Venue chosen -> capacity known
  -> ticketStrategyAgent calls suggestTicketTiers  (quantity <= capacity, prices = proposals)
  -> UI shows tiers marked "Suggestion"
  -> [HUMAN: Roberto edits/confirms every price]  <- prices never auto-saved
  -> validateEventDraft
```

### 7.5 Publish Event With HITL (MVP)
```
Draft complete + validated
  -> agent calls preparePublishApproval  (shows a plain summary)
  -> [HUMAN: Roberto approves]   <- nothing publishes without this
  -> server code (not Gemini) writes to Supabase + creates Stripe products
  -> confirmation shown
If Roberto declines -> back to edit; nothing saved.
```

### 7.6 Post-MVP Sponsor Proposal (Advanced)
```
Published event profile
  -> sponsorResearchAgent uses Search grounding + URL context
  -> proposes ranked sponsor leads WITH source links
  -> [HUMAN: Patricia/Roberto vet each lead before any outreach]
  -> no auto-contact, no CRM write by Gemini
```

---

## 8. Gemini Feature Mapping

How each official Gemini capability maps to an mdeai event use case, and how hard it is.

| Gemini feature | mdeai use | Where | Effort |
|---|---|---|---|
| **Structured output** | Force every draft/tier/ranking through a schema | All write-shaped tools (§6) | Low — use now |
| **Function calling** | Let the agent call our venue/ticket/validate tools | `hostEventAgent` | Low — use now |
| **Tool combination** | One turn: search venues + rank + draft copy | `hostEventAgent` / `venueDiscoveryAgent` | Medium — use now (carefully) |
| **Thinking** | Better venue ranking + ticket reasoning | ranking, ticket, sponsor agents | Low (built into 3.5) — use now |
| **Thought signatures** | Keep reasoning intact across multi-step tool calls | any multi-tool turn | **Use the official SDK and pass history back** — the SDK handles signatures automatically; omitting the signature on the first function call in a turn returns a 400 error. Low effort if we never hand-roll REST. |
| **Streaming** | Show copy + reasoning as it types | `/host/event/new` UI | Low — use now (GEM-EVENTS-007) |
| **Google Search grounding** | "What else is on that weekend?" / fresh facts | `searchFreshEventContext`, discovery | Medium — use for discovery; **off** for venue facts |
| **Maps grounding** | Real venue facts, place IDs, coords | venue search/support answers | Medium — **this is the only source of geo truth**; returns place IDs + grounding metadata we use for pins/citations |
| **URL context** | Summarize a venue's own webpage | `summarizeVenueFromUrl` | Medium — use later |
| **Caching** | Reuse venue blurbs / long system prompts | `cacheVenueSummary` | Medium — use later (cost win) |
| **Batch API** | Overnight bulk enrichment of many events | batch enrichment | Medium — use later |
| **Webhooks** | Get notified when batch/long jobs finish | automation | Medium — use later |
| **Live API** | Voice / real-time event-day assistant | live assistant | High — avoid for MVP |
| **Code execution** | Exact ticket-revenue / capacity math | ticket + reports | Low — use when math appears |
| **Image generation** | Draft event banner art | copy step (optional) | Medium — use later, human-reviewed |

---

## 9. Security + Guardrails

These are non-negotiable. They mirror the repo's hard rules and the "no service-role in
`src/**`" / "Gemini only" / "RLS on every table" policies.

1. **No API keys in the client.** The Gemini key (`GOOGLE_GENERATIVE_AI_API_KEY`) lives only
   in server/edge runtime (injected via Infisical), never shipped to the browser.
2. **No service-role key in the frontend.** Database writes happen in server routes/edge
   functions under the F13 carve-out — never in client components, never via Gemini output.
3. **No publish without approval.** Nothing saves or publishes unless Roberto's explicit
   `respond()` fires (§7.5). Gemini can *ask*, only a human *grants*.
4. **No payment mutation by Gemini.** Stripe is touched by server code after approval only.
   `ticketStrategyAgent` proposes prices; it cannot charge or create live products.
5. **No invented Maps data.** Coordinates, place IDs, capacities, addresses, hours, and
   availability come **only** from Maps/Places/ADK or Supabase. The system prompt forbids
   generating geo facts; `rankVenueCandidates` is validated so every `placeId` in its output
   existed in its input. **Map pins are drawn from real `lat/lng`, never from Gemini text.**
6. **All generated output is validated by Zod.** Drafts, tiers, and rankings must parse
   against `EventDraftStateSchema` (and tier/ranking schemas) before the agent or the user
   sees them. Invalid output is retried or dropped, never persisted.
7. **Log every AI run and tool call.** Each Gemini turn and tool invocation is recorded
   (`ai_runs`, agent traces) — token/cost tracking is already wired (OBS-002 / COST-001).
   Log env var **names** only, never secret values.
8. **English only (Phase 1).** Spanish strings are a regression; copy generation stays English.

---

## 10. Implementation Order

Strict build order. Do not start a later item until earlier items are green and tested.

**P0 — Core (Roberto's flow works end to end):**
1. Event Description **Parser** (GEM-EVENTS-001)
2. **Structured output** through Zod (GEM-EVENTS-002)
3. **Venue search** tool wired to Maps/Places (GEM-EVENTS-003)
4. **Venue ranking** with reasons (GEM-EVENTS-004)
5. **HITL approval** gate (GEM-EVENTS-006)
6. **Save draft** (server-side write after approval)

**P1 — Make it good:**
7. **Event copy** generator (GEM-EVENTS-005)
8. **Ticket tier** suggestions (`ticketStrategyAgent`)
9. **Streaming** progress (GEM-EVENTS-007)
10. **Tests** (the §11 suite, including the no-hallucinated-geo gate, GEM-EVENTS-008)

**Advanced — only after P0+P1 are used by real hosts:**
11. **Sponsors** (`sponsorResearchAgent`)
12. **Batch enrichment** (Batch API + Flash-Lite)
13. **Live assistant** (Live API)
14. **Automation** (webhooks on long jobs)

---

## 11. Tests

What must be green before any of these tasks flips to Done (the repo requires Vitest +
Playwright green and a localhost runtime proof).

| Test | Proves | Type |
|---|---|---|
| **Schema unit tests** | `EventDraftStateSchema`, tier schema, ranking schema accept valid and reject invalid shapes | Vitest unit |
| **Fake venue search tests** | With a stubbed search returning known venues, the agent ranks/uses only those — no extras appear | Vitest unit (mocked tool) |
| **No-hallucinated lat/lng test** | Given candidates with fixed coords, the agent's draft/output never contains a coordinate or place ID not in the input | Vitest — the §9.5 gate (GEM-EVENTS-008) |
| **HITL approval required test** | No save/publish path executes without a simulated `respond()` approval | Vitest / integration |
| **Failed Gemini response fallback** | When Gemini errors or returns unparseable output, the flow surfaces a clean error and persists nothing | Vitest — error path |
| **Streaming smoke test** | A streamed turn delivers partial tokens and a final valid structured draft | Playwright / smoke |

---

## 12. Final Recommendation

Simple build/no-build call per Gemini feature for the events product.

| Feature | Decision | Why |
|---|---|---|
| Structured output | **Use now** | Backbone of every safe draft |
| Function calling | **Use now** | How the agent reaches our tools |
| Thinking | **Use now** | Free in 3.5; better rankings |
| Thought signatures | **Use now** | Required for multi-step tools — but only "use the SDK + pass history," don't hand-roll |
| Streaming | **Use now** | Cheap UX win for Roberto |
| Maps grounding | **Use now** | The only legitimate source of venue geo truth |
| Tool combination | **Use now (carefully)** | Fewer round-trips; keep it to read-only combos at first |
| Code execution | **Use now (when math appears)** | Exact ticket/capacity arithmetic, no invented numbers |
| Google Search grounding | **Use later** | Great for discovery/sponsors; not for venue facts |
| URL context | **Use later** | Nice for venue-page summaries, not core |
| Caching | **Use later** | Cost optimization once volume justifies it |
| Batch API | **Use later** | Only when we have many events to enrich |
| Webhooks | **Use later** | Pairs with batch/long jobs |
| Image generation | **Use later** | Banner art is polish; human-review required |
| Live API (voice/real-time) | **Avoid for MVP** | High effort; not on Roberto's critical path |

---

### Sources (official + verification)
- Thought signatures requirement (400 error if omitted; SDK auto-handles):
  [Thought Signatures — Gemini API](https://ai.google.dev/gemini-api/docs/thought-signatures),
  [New Gemini API updates for Gemini 3](https://developers.googleblog.com/new-gemini-api-updates-for-gemini-3/)
- Maps grounding returns place IDs + grounding metadata for citations/widgets:
  [Grounding with Google Maps — Gemini API](https://ai.google.dev/gemini-api/docs/maps-grounding),
  [Grounding with Google Maps: Now available in the Gemini API](https://blog.google/innovation-and-ai/technology/developers-tools/grounding-google-maps-gemini-api/)
- Model tiers/IDs: `.claude/skills/gemini/references/model-registry.md` (re-verify before coding).
