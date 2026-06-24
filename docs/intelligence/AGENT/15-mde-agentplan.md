---
title: mdeai Agent Platform — Deep Audit Prompt (v2)
date: 2026-06-11
class: D
status: canonical-prompt
version: 2.0
supersedes_prompt_in: ./10-agent-research.md (v1 inline request)
output_artifact: ./10-agent-research.md (or dated sibling e.g. 16-agent-research-YYYY-MM-DD.md)
related:
  - ./05-agent-plan.md
  - ./06-agent-summary.md
  - ./13-grounding.md
  - ../../events/todo.md
  - ../tasks/INT-023-flash-structured-router.md
north_star: ./01-prompt-agent.md
---

# Deep audit prompt — Gemini + Mastra + mdeai agent platform (v2)

**Use this document** when requesting or running a principal-architect audit of mdeai's concierge, tools, routing, memory, grounding, and workflows.

**Prior run:** [10-agent-research.md](./10-agent-research.md) (v1 · 2026-06-11 · **8.5/10 prompt quality**). v2 adds competitor bench, memory architecture, SQL/Maps/Search matrix, trust scores, and workflow agent-vs-tool classification.

---

## Audit rules (non-negotiable)

1. **Score `origin/main` for shipped status** — never mix feature-branch gaps into production verdicts. Run `git fetch origin && git show origin/main:src/lib/concierge-send-user-message.ts` before claiming routing is wired.
2. **Frame as four layers:** `Routing → Tools → Agent → Workflow` — not "regex vs Gemini."
3. **Evidence every score** — file path, test result, or prod URL. No score from memory alone.
4. **Name personas + surfaces** — Camila `/chat`, Roberto `/host/event/new`, Patricia `/admin/event-bookings`, Tourist restaurants, Andrés `/me/tickets`.
5. **Name tasks** — `SAN-### · SPEC-ID — title` on first mention ([task naming](../../../linear.md)).
6. **Verify Gemini/Mastra APIs** via MCP or official docs — not training data.

### Auditor traps (verified 2026-06-11 · re-check each run)

| Trap | Truth on `origin/main` | How to verify |
|------|------------------------|---------------|
| **SAN-494 Done ≠ venue path live** | **494-A1** send ✅ on main (#175); **494-A2** venue hook ❌ in `concierge-chat-input.tsx` | `git show origin/main:src/components/chat/concierge-chat-input.tsx \| rg EventVenue` (expect 0) |
| **Mastra “2 agents” target ≠ today** | `mastra/index.ts` still registers `routerAgent`, `rentalAgent`, `eventAgent`, `conciergeAgent`, `hostEventAgent` | `git show origin/main:src/mastra/index.ts` |
| **Scorers exist ≠ live path** | Global `scorers` registry; **not** attached to `conciergeAgent` | `rg scorers src/mastra/agents/concierge.ts` |
| **Flash / topic switch** | No `classifyRouteWithFlash`, `topicShift`, or `clearVerticalState` in `src/` | `rg classifyRouteWithFlash topicShift src/` |
| **Working memory drift** | Router has **8 intents**; Zod `lastIntent` has **6** (no `venue_booking`) | `router-intent.ts` vs `concierge.ts` |
| **Workflow file exists** | `event-venue-booking-workflow.ts` **on main** (#179) | `git ls-tree origin/main src/mastra/workflows/` |

---

## Part A — Core questions (15)

Answer each in a table row: **Answer · Evidence · Score /10 · Fix · Linear task if any**.

| # | Question |
|---|----------|
| 1 | Are we using **Gemini** effectively (model, structured output, function calling, grounding)? |
| 2 | Are we using **Mastra** effectively (agents, tools, memory, workflows, scorers)? |
| 3 | Are agents correctly designed (count, responsibilities, duplication)? |
| 4 | Are tools correctly designed (schemas, audit wrappers, fallbacks)? |
| 5 | Are workflows correctly designed (HITL, suspend/resume, chat vs admin boundary)? |
| 6 | Is memory correctly designed (working, semantic, prefs, topic switch)? |
| 7 | Is grounding correctly implemented (Search + Maps + SQL chain)? |
| 8 | Is Maps/Places usage correct (field masks, pins, attribution, location bias)? |
| 9 | Is Search grounding correct (gating, citations, cost observability)? |
| 10 | Is structured output used where it should be (routing classify)? |
| 11 | Is function calling used where it should be (post-route actions)? |
| 12 | Does the system handle **natural topic change** every turn? |
| 13 | Is mdeai **better than generic AI** (Gemini app, Perplexity) for Medellín bookable inventory? |
| 14 | What is the **weakest area** today? |
| 15 | What is the **highest ROI** fix next (with Linear issue)? |

---

## Part B — Competitor benchmark (NEW · required)

Compare mdeai against each competitor **for Medellín travel/rentals/events/venues**. For each: what they do better, what mdeai does better, what to copy, what to avoid.

| Competitor | Primary surface | Audit focus |
|------------|-----------------|-------------|
| **Gemini** (Google app) | General chat + Maps grounding | NL understanding, no bookable Medellín inventory |
| **Perplexity** | Search-first answers + cites | Citation UX, freshness, no transactional spine |
| **Mindtrip** | Trip planner + saved places | Itinerary UX, map+cards pattern ([DESIGN.MD](../../../DESIGN.MD)) |
| **Layla AI** | WhatsApp/chat trip agent | Conversational planning, local expert tone |
| **Google Maps** | Maps + Places discovery | Geo accuracy, hours, reviews — we must not hallucinate |
| **TripAdvisor** | Reviews + bookings links | Trust signals, UGC — we lack review depth |
| **Airbnb Experiences** | Experience booking | Event/experience conversion funnel |
| **Expedia** | Package search + booking | Route → inventory → checkout pattern |
| **Booking.com AI** | Hotel/concierge assistant | Clarify band, structured search |

**Output table (required):**

| Competitor | They win at | mdeai wins at | Copy | Avoid |
|------------|-------------|---------------|------|-------|
| … | … | … | … | … |

**Competitive advantage score:** `/10` current vs `/10` target — one sentence on **moat** (Medellín inventory + Patricia approval + real bookings vs prose-only chat).

---

## Part C — Agent architecture review (NEW · required)

Review current architecture on disk. Recommend one option with scored criteria (cost, speed, reliability obvious/ambiguous, UX, maintainability, testability).

| Option | Description |
|--------|-------------|
| **A** | One super-agent (`conciergeAgent` does route + tools + planning) |
| **B** | Gemini-only router (Flash every turn, no regex fast-path) |
| **C** | **Hybrid router** — rules ≥0.85 + Flash structured 0.50–0.84 + agent for mixed/planning |
| **D** | Router + specialist agents (`rentalAgent`, `eventAgent`, …) |
| **E** | Supervisor / multi-agent orchestration (Mastra supervisor, A2A) |
| **F** | Workflow-first (most user journeys become Mastra workflows) |

**Deliverables:**

1. Current-state mermaid (UI → send pipeline → router → tools/agent → workflow).
2. Target-state mermaid (Phase 1 exit).
3. Weighted score table (1–10 per criterion per option).
4. **Recommendation** — cite [05-agent-plan.md](./05-agent-plan.md) and [SAN-871 · INT-023](https://linear.app/sanjiovani/issue/SAN-871) if hybrid wins.

**Phase 1 default hypothesis (validate, do not assume):** Option **C** — same pattern as Airbnb/Expedia/Google travel: deterministic lanes + LLM for ambiguity.

---

## Part D — Memory architecture audit (NEW · required)

### Current (audit on disk)

| Layer | Implementation | Score /10 |
|-------|----------------|----------:|
| Thread history | CopilotKit + Mastra messages | |
| Working memory | Zod in `concierge.ts` · `lastIntent`, vertical slots | |
| UI state | CopilotKit co-agent state · INT-009 readable map | |
| Semantic recall | pgvector / INT-016 | |
| User preferences | `user_preferences` INT-011+ | |
| Cross-session | Resource scope / F13 Postgres | |
| Behavioral / observational | INT-020 | |

### Missing (explicitly score)

- Semantic memory across threads
- User preferences (*Camila likes rooftops, salsa, Laureles*)
- Cross-session return-visitor boost
- Topic-switch memory processors (strip stale card blobs)

### Design exercise (required)

> **Camila** over three visits prefers Laureles, rooftop venues, salsa on weekends, budget ~$1000/mo rentals.  
> **Should the system remember this?** When? Where stored? RLS? How retrieved before search (INT-013)?

**Deliverables:**

1. Ideal memory tier diagram (thread → working → prefs → semantic → observational).
2. Phase 1 vs Phase 2 boundary (what ships before launch vs post-MVP).
3. Link gaps to **INT-010**, **INT-011–015**, **INT-016**, **F13**.
4. Memory score `/10` current vs `/10` target.

---

## Part E — Search + Maps excellence (NEW · required)

Review against **Google Maps** (geo truth) and **Perplexity** (search cites + freshness).

For **each vertical**, specify when each layer runs:

| Layer | When |
|-------|------|
| **SQL** (Supabase inventory) | Own catalogue: rentals, events, venue offerings, bookings |
| **Maps** (Places / Grounding Lite MCP) | Geo discovery, hours, pins, *near me* |
| **Search** (web grounding sidecar) | Sparse SQL, events discovery imports, freshness |
| **Agent** (Gemini + tools) | Multi-step, clarify, mixed intent, planning |
| **Direct Gemini answer** | Never for bookable claims without tool evidence |

### Required routing matrix (fill every cell: Yes / Optional / No)

| Query type | SQL | Maps | Search | Agent | Example prompt |
|------------|:---:|:----:|:------:|:-----:|----------------|
| Rentals | | | | | *1BR Laureles under $80* |
| Events | | | | | *salsa this weekend* |
| Restaurants | | | | | *quiet rooftop Provenza* |
| Cafés | | | | | *laptop-friendly Laureles* |
| Venues (private hire) | | | | | *birthday venue 30 people* |
| Weekend / day trip | | | | | *plan my weekend* |
| After-dinner / vague | | | | | *what after dinner?* |
| Venue + rental combo | | | | | *venue then Airbnb nearby* |
| Host / proposal | | | | | *book Mamacita for corporate* |

**Deliverables:** ideal matrix + gap list vs current `search-grounded-places.ts`, `search-events`, rental SQL path.

---

## Part F — Grounding trust architecture (NEW · required)

Users must trust cards and booking CTAs. Design scores (0–100 or /10) per dimension:

| Score | Definition | How mdeai computes today | Gap |
|-------|------------|--------------------------|-----|
| **Grounding score** | Answer backed by tool result IDs | | |
| **Trust score** | User can verify entity exists | place_id, event slug, venue offering id | |
| **Freshness score** | Hours/availability/event date current | | |
| **Source score** | Visible attribution (Maps ToS, web URL) | GND-002–004 | |

**Per entity type:** venue · event · restaurant · rental listing — what proof appears on card?

**Deliverables:**

1. Trust architecture diagram (tool result → card → citation → map pin).
2. Link to [13-grounding.md](./13-grounding.md) and Linear **SAN-877–880**.
3. Recommend Mastra **faithfulness + grounding-coverage** scorer thresholds (SAN-870).

---

## Part G — Workflow audit (NEW · required)

Classify each journey: **Agent task** · **Tool task** · **Workflow task** (Mastra suspend/resume + admin HITL).

| Journey | Current | Should be | Owner | Evidence |
|---------|---------|-----------|-------|----------|
| Venue booking (Camila → Patricia) | Workflow + send wired; **UI hook pending** | Tool discover → Workflow HITL | Camila / Patricia | SAN-501/502 · **494-A2** |
| Rental inquiry | Tool fast-path | Tool (+ agent refine) | Camila | `search_rentals` |
| Event proposal / HITL | Workflow suspend | Workflow | Roberto / Patricia | SAN-496 |
| Ticket purchase (Andrés) | Checkout path partial | Stripe Checkout + wallet | Andrés | [SAN-178 · PAY-001](https://linear.app/sanjiovani/issue/SAN-178) |
| Weekend / day-trip planner | Agent (day_trip intent) | Agent | Tourist | `day_trip_planning` → conciergeAgent |
| Event creation (Roberto wizard) | Agent + HITL | Agent + CopilotKit HITL | Roberto | hostEventAgent |
| Host onboarding | Shell / partial | Agent + forms | Roberto | `/host/*` |
| Partner / venue onboarding | Data + admin | Workflow + Patricia | Patricia | SAN-493 seed |

**Rule:** Booking with Patricia approval = **Workflow**. Obvious single vertical search = **Tool** (+ optional fast-path). Mixed/planning = **Agent**. Do not put Patricia HITL in chat hot path.

**Deliverables:**

1. Agent vs tool vs workflow decision tree.
2. List orphaned workflows on disk — **`concierge-routing-workflow.ts`** (duplicate of send-path routing; **do not register** on chat hot path).
3. Phase 2 workflow candidates (defer with ROI).

---

## Part H — Required scorecard (fill all cells)

Use **`origin/main`** baseline unless labeled **local checkout**.

| Category | Current /10 | Target /10 | Evidence pointer | Top fix |
|----------|:-----------:|:----------:|------------------|---------|
| Gemini Usage | | | | SAN-871 Flash |
| Mastra Usage (core) | | | | |
| Mastra Advanced | | | | SAN-870 scorers |
| Routing | | | | **494-A2** venue UI hook + **SAN-871** Flash |
| Topic Switching | | | | **023-C** `clearVerticalState` + **SAN-876** INT-024 tests |
| Memory | | | | INT-010 / INT-011+ |
| Search Grounding | | | | GND-003 |
| Maps Grounding | | | | GND-001 |
| Tools | | | | |
| Workflows | | | | |
| Rentals | | | | |
| Events | | | | |
| Restaurants | | | | |
| Venues | | | | |
| Booking Flow | | | | |
| Medellín Expertise | | | | |
| Competitive Advantage | | | | Part B |
| **Overall Product** | | | | |

**Local checkout override table** — if auditor branch lags main, second table with branch name + failing checks.

---

## Part I — Hypothesis checklist (validate, do not copy blindly)

v1 audit expected these ranges on **`origin/main`** (2026-06-11) — confirm or revise with evidence:

| Area | Expected current | If yours differs, explain |
|------|-----------------:|---------------------------|
| Gemini effective usage | 5–6 | |
| Mastra core | 7–8 | |
| Mastra advanced | 3–4 | |
| Routing | 5–7 | Main has classify-first send; **venue UI hook may still be unwired**; no Flash |
| Topic switching | 4–5 | |
| Search grounding | 6 | |
| Maps grounding | 7 | |
| Venue booking | 8–9 | |
| Rentals | 7 | |
| Events | 8 | |
| Memory | 3–5.5 | Working memory yes; **6 vs 8 intent drift**; no prefs/semantic |
| Workflows | 7 | |
| Competitive advantage | 8 | |
| **Overall** | 6.5–7.5 | |

**Likely top gaps:** memory · topic switch · Flash routing · grounding UX · scorers · workflow expansion · competitive UX (not inventory).

**Likely strengths:** venue booking spine · events + Patricia queue · Mastra tools · CopilotKit · Medellín catalogue · Maps/Places foundation.

**Roadmap alignment:** [docs/events/todo.md](../../events/todo.md) — G6 → **494-A2–D** → **SAN-871** → **SAN-876** → 870 ∥ INT-010 → GND-001–004 → 497.

---

## Part J — Output format

1. **Executive verdict** — one paragraph + overall /10.
2. **Parts A–H** — tables filled, no empty required rows.
3. **Mermaid** — current + target architecture (Part C).
4. **Roadmap** — P0 / P1 / P2 with Linear links.
5. **Appendices** — SAN-494 vs Flash scope · doc index · local verification block.
6. Save as `10-agent-research.md` (update) or new dated file; link from [05-agent-plan.md](./05-agent-plan.md).

---

## Quick invoke (paste to agent)

```text
Run the mdeai agent platform deep audit per docs/intelligence/AGENT/15-mde-agentplan.md v2.

Audit origin/main (not local branch unless labeled). Fill Parts A–H with evidence.
Compare competitors Part B. Recommend architecture Part C. Design memory Part D.
Build SQL/Maps/Search matrix Part E. Design trust scores Part F. Classify workflows Part G.
Use scorecard Part H. Validate hypothesis Part I.

Output: update 10-agent-research.md or create 16-agent-research-YYYY-MM-DD.md.
Link new fixes to Linear (INT/SAN/GND). Do not claim Done without disk + test proof.
```

---

## Document index

| Doc | Role |
|-----|------|
| **15-mde-agentplan.md** (this file) | **Canonical audit prompt v2** |
| [10-agent-research.md](./10-agent-research.md) | Latest audit **v1 output** (domain detail) |
| [16-agent-research-2026-06-11.md](./16-agent-research-2026-06-11.md) | **Audit output v2** — Parts A–I complete |
| [05-agent-plan.md](./05-agent-plan.md) | Execution plan + INT map |
| [06-agent-summary.md](./06-agent-summary.md) | Plain scorecard for stakeholders |
| [13-grounding.md](./13-grounding.md) | Search + Maps deep dive |
| [01-prompt-agent.md](./01-prompt-agent.md) | Product north star (intent-first) |
