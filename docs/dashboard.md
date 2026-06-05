# 📊 MDE AI — Progress Dashboard

> Single-glance status for the platform: **where each feature stands** and **how well each tech-stack component applies best practices.**
> _Last updated: 2026-06-05 · Source: Linear (Sanjiovani MVP scope) + codebase audit + merged PRs._

> **Two MVP lenses:** This dashboard scores **product vertical breadth + revenue readiness** (~17–24% weighted). Phase 1 **exit checklist** readiness is tracked separately in [`tasks/MVP-REQUIRED.md`](https://github.com/amo-tech-ai/mdeai/blob/main/tasks/MVP-REQUIRED.md) (~98% foundation shipped; G1/G2/G3 commerce gates still open). Do not conflate the two percentages.

## Legend

| Dot | Meaning |
|---|---|
| 🟢 | Strong / on-track / mostly done (≥60%) |
| 🟡 | In progress / partial (25–59%) |
| 🔴 | Behind / blocked / weak (<25%) |
| ⚪ | Not started / not yet wired |

**Grades:** A (90+) · B (80–89) · C (70–79) · D (60–69) · F (<60). Score = best-practice quality of what exists.

---

## 🚦 Headline

| Metric | Value | Status |
|---|---|---|
| **MVP completion** | ~17% done · **~24% weighted** | 🟡 |
| **Engineering best-practices grade** | **B+ (≈85/100)** | 🟢 |
| **Verticals live end-to-end** | 1 of 5 (Venues) | 🟡 |
| **Merged PRs** | 64+ | 🟢 |
| **Revenue features live** | Booking requests only (no payment loop yet) | 🔴 |

---

## 🧱 Tech stack — best-practice scorecard

| Component | Status | Score | Grade | Notes |
|---|---|---|---|---|
| **Supabase** (DB) | 🟢 | 92 | **A** | 80 migrations, RLS lockdown, atomic RPCs, idempotency, advisor remediation |
| **Google Maps / Places** | 🟢 | 90 | **A−** | Field-mask on every call, single-pin-writer, mapId discipline, Places cache |
| **Next.js / React** | 🟢 | 88 | **A−** | Next 16 App Router + RSC, React 19, Turbopack, pinned deps |
| **pgvector** | 🟡 | 87 | **B+** | Hybrid FTS + per-entity embeddings — wiring still in review |
| **Testing / CI** | 🟢 | 86 | **B+** | `floor` gate, **519** Vitest (`npm test -- --run`), Playwright e2e, CodeRabbit/Vercel/Supabase preview |
| **UI** (shadcn / Tailwind 4) | 🟢 | 85 | **B+** | Design-token reuse, no-new-colors discipline |
| **CopilotKit** | 🟢 | 85 | **B+** | Pinned 1.55.2, clean Pattern-1 runtime, generative cards |
| **Stripe** | 🟡 | 82 | **B+** | Excellent ticketing (idempotent, oversell-safe, webhook=truth); no Connect/Billing |
| **Gemini** | 🟡 | 80 | **B** | Model pinned; single provider, no fallback/routing |
| **UX** | 🟡 | 80 | **B** | Mobile sheets, 3-panel shell; accessibility + some flows still landing |
| **Mastra** | 🟡 | 78 | **C+** | Clean agent/workflow/tool split; agents are read-only (can't transact) |
| **ADK grounding** | 🟡 | 75 | **C** | Sidecar + quota logs; still proving on prod |
| **WhatsApp** | 🔴 | — | — | Tables only (`whatsapp_*`, `wa_outbox`); no live send loop |
| **Chatwoot** | ⚪ | — | — | Planned (omnichannel + handoff) — not built |
| **OpenClaw** | ⚪ | — | — | Planned (compliant discovery) — not wired |
| **Postiz** (IG/FB) | ⚪ | — | — | Planned (social automation) — not wired |

**Stack summary:** Foundation layers (DB, Maps, Next.js, CI) are **A-level**. The relative soft spot is the **AI layer** (Mastra C+, ADK C, Gemini B) — agents can search but not transact, and there's no model fallback. Channels (WhatsApp/Chatwoot) and growth tools (OpenClaw/Postiz) are still on the roadmap.

---

## 🗂️ Feature areas — completion

| Area | Status | % Complete | Grade | What works / gap |
|---|---|---|---|---|
| **Auth** | 🟢 | ~80% | A− | Prod auth checklist done, RLS-scoped |
| **Nightlife** | 🟢 | ~70% | B+ | List + map + detail sheet + table-booking request |
| **Maps** | 🟢 | ~65% | A− | Prod Map ID, field-mask, single-pin, Places cache |
| **Restaurants** | 🟢 | ~55% | B | Listings + detail + booking; reservation depth pending |
| **AI Concierge (core)** | 🟡 | ~50% | C+ | Routes intents + grounded search; can't transact yet |
| **Search / Intelligence** | 🟡 | ~40% | B− | Hybrid (keyword+vector) search in review |
| **Events / Ticketing** | 🟡 | ~35% | C+ | Host list + ticket checkout edges; discovery thin |
| **Cafés** | 🟡 | ~30% | C | Render split done, but `/cafes` page is a stub |
| **Payments (Stripe)** | 🟡 | ~30% | C+ | Ticketing only; no in-chat checkout / Connect |
| **Rentals / Real estate** | 🔴 | ~10% | D | Cards-in-chat + viewing modal in progress; `/rentals` redirects |
| **Trips** | 🔴 | ~5% | F | Shell exists; **blocked by SAN-275** (create-trip modal) |
| **Fashion / Commerce** | ⚪ | 0% | — | Not started |
| **OVERALL MVP** | 🟡 | **~17% (24% weighted)** | C | Venues proven; rest repeats the pattern |

---

## 🧭 What moves the needle (next 3)

| Move | Lifts | Effort |
|---|---|---|
| 🟢 Merge in-review **hybrid search** | Search 40→70%, every vertical's results | Low (code done) |
| 🟡 Add **`create_checkout`** Mastra tool | AI can *book + pay*; Payments + AI-layer grade | Medium |
| 🟡 Clone **Venues recipe** → Cafés + Rentals | Two stubs → live verticals | Medium |

---

## 📈 Status rollup

```text
Tech foundation   🟢🟢🟢🟢🟢🟢🟢  A-level (DB · Maps · Next · CI · UI · CopilotKit · pgvector)
AI layer          🟡🟡🟡          B/C  (Mastra · Gemini · ADK — search-only, single model)
Channels          🔴⚪⚪           WhatsApp tables only · Chatwoot/OpenClaw/Postiz planned
Verticals         🟢🟢🟡🔴🔴⚪      Nightlife/Restaurants live · Cafés stub · Rentals/Trips behind · Fashion none
Revenue           🔴              Booking requests only — no payment captured yet
```

> **One-line read:** A-grade foundation, ~20% built. The gap to close is the **AI-transaction layer** (let agents book + pay) and **replicating the one proven vertical** (Venues) across Cafés, Rentals, and Trips.

---
_Dashboard is a living snapshot — refresh from Linear + GitHub as work lands. Pairs with [`strategic-audit.md`](strategic-audit.md), [`task-backlog.md`](task-backlog.md), and [`prd/mde-ai-improvement-roadmap.md`](prd/mde-ai-improvement-roadmap.md)._
