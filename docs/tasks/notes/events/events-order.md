---
title: Events implementation order
updated: 2026-06-08
linear_project: https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues
planning_verification: tasks/events/PLANNING-VERIFICATION.md
canonical_index: tasks/events/tasks/INDEX.md
mvp_specs: tasks/events/tasks/MVP/
---

# Events — correct implementation order

> **Verified 2026-06-08:** Linear shows **4/5 MVP gates Done** (SAN-117,118,116,366). **Only SAN-115 (EVP-001 ledger) remains P0.**

---

## Implementation order — MVP backlog (`tasks/events/tasks/MVP/` + G3)

Build top → bottom. **EVP-018** is a meta pack (019–028 parent) — not a build step.

| # | ID | Linear | Persona | Purpose | Feature | Use case | Real-world example | Status |
|--:|----|--------|---------|---------|---------|----------|-------------------|--------|
| **1** | **G3-core** | [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) | Roberto | Prove host publish on prod | Wizard → HITL → `events` row | Roberto publishes meetup, slug 200 | 🟢 **Done** (Linear) — capture evidence for ledger |
| **2** | **EVP-014-core** | [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) | Roberto | Host command center | `/host/events` grid | Roberto sees Published events | 🟢 **Done** — polish [SAN-730](https://linear.app/sanjiovani/issue/SAN-730) nav |
| **3** | **EVP-003-core** | [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) | Patricia | Webhook isolation | Ticket vs sponsor secrets | Ops audit clean | 🟢 **Done** (Linear) |
| **4** | **EVP-001-core** | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) | All | Launch sign-off ledger | G1+G2+G3 + chat evidence | One doc → launch ready | 🟥 **Todo — P0 exit gate** |
| **5** | **EVP-015-mvp** | [SAN-119](https://linear.app/sanjiovani/issue/SAN-119) | Camila, Tourist | DB-first discovery with optional web freshness | Supabase search first; grounding when stale or “what’s on this weekend?” | Camila asks chat for events in El Poblado | Chat shows 3 **published mdeai** cards; if thin, adds **cited** web results with source links | ⚪ Post-MVP |
| **6** | **EVP-016-mvp** | [SAN-120](https://linear.app/sanjiovani/issue/SAN-120) | Camila, Roberto | Map + venue consistency | Event pins, card↔pin focus, venue on detail + host wizard | Tourist taps event card; map flies to venue pin | “Jazz at Enrique Olaya” card highlights pin in Laureles; detail shows address + Maps link | 🟡 35% partial |
| **7** | **EVP-019-mvp** | [SAN-122](https://linear.app/sanjiovani/issue/SAN-122) | Sofía | MCP/doc verification before discovery code | Research notes: CopilotKit, Mastra, Gemini grounding, ADK, Places | Agent implements 020+ without guessing API shapes | `EVP-019-mvp-research-notes.md` records model IDs, field masks, deprecation list | ⚪ Post-MVP |
| **8** | **EVP-020-mvp** | [SAN-123](https://linear.app/sanjiovani/issue/SAN-123) | Patricia | Staging schema for discovered candidates | `event_sources`, `raw_events`, approval queue tables + RLS | Web scrape/grounding writes **candidates**, not live `events` | Firecrawl finds “Startup Grind Medellín” → row in queue, **not** on homepage until approved | ⚪ Post-MVP |
| **9** | **EVP-023-mvp** | [SAN-126](https://linear.app/sanjiovani/issue/SAN-126) | Sofía | ADK sidecar for search + maps grounding | SearchAgent + MapsAgent JSON contracts | Mastra workflow calls sidecar instead of inline hacks | Sidecar returns `{ venues: [{ name, place_id, citation }] }` validated by Zod | ⚪ Post-MVP |
| **10** | **EVP-021-mvp** | [SAN-124](https://linear.app/sanjiovani/issue/SAN-124) | Camila | Search Grounding query templates + citations | Allowlisted queries, quota logging, chunk parsing | “What tech events happened in Medellín **this week**?” | Template runs grounding; cards show **“Source: meetup.com/…”** footnotes | ⚪ Post-MVP |
| **11** | **EVP-022-mvp** | [SAN-125](https://linear.app/sanjiovani/issue/SAN-125) | Patricia | Batch + runtime discovery orchestration | `eventDiscoveryWorkflow` — ingest, dedupe, score, queue | Nightly job refreshes external listings; chat uses runtime path | Cron ingests 40 candidates; Patricia sees 12 new in approval queue Monday AM | ⚪ Post-MVP |
| **12** | **EVP-024-mvp** | [SAN-127](https://linear.app/sanjiovani/issue/SAN-127) | Camila | Places enrichment on candidates | `place_id`, coords, field-masked Places New calls | Discovered event gets map pin without manual geocoding | Candidate “Rooftop Salsa Night” resolves to `ChIJ…` with lat/lng cached 7d | ⚪ Post-MVP |
| **13** | **EVP-025-mvp** | [SAN-128](https://linear.app/sanjiovani/issue/SAN-128) | Camila | Discovery generative UI in chat | Cited discovery cards + attribution + approval affordance | Camila sees **discovered** vs **official** badge in chat | Card: “Found on Eventbrite · Not yet on mdeai — **Suggest save**” | ⚪ Post-MVP |
| **14** | **EVP-026-mvp** | [SAN-129](https://linear.app/sanjiovani/issue/SAN-129) | Patricia, Roberto | Human gate before catalog write | HITL approve/reject → promote to `public.events` | No auto-publish from AI scrape | Patricia edits date, taps **Approve** → event goes live; reject keeps audit reason | ⚪ Post-MVP |
| **15** | **EVP-027-mvp** | [SAN-130](https://linear.app/sanjiovani/issue/SAN-130) | Lucía | Discovery test plan | Vitest + Playwright + RLS + workflow mocks | QA replays discovery without manual chat every release | Playwright: Camila query → cited card → mock approve → slug 200 | ⚪ Post-MVP |
| **16** | **EVP-028-mvp** | [SAN-131](https://linear.app/sanjiovani/issue/SAN-131) | Patricia | Discovery prod readiness | Rate limits, quotas, logging, fallback copy, security grep | Turn on `EVENT_WEB_DISCOVERY=1` safely | Checklist green: 15s ADK timeout, no secrets in logs, graceful “catalog only” fallback | ⚪ Post-MVP |

**Meta (not sequenced):** [EVP-018-mvp](https://linear.app/sanjiovani/issue/SAN-121) [SAN-121] — parent pack index for rows 7–16.

**Already shipped (not in MVP folder):** EVP-004–012, **EVP-013** (archived [`../../events/archive/EVP-013-core-event-card-component.md`](../../events/archive/EVP-013-core-event-card-component.md)). **Deferred:** EVP-002 commerce ([`../../archive/events-A/`](../../archive/events-A/)).

---

## Order check — MVP folder vs this table

| MVP file on disk | Seq # | Match? |
|------------------|------:|--------|
| EVP-014-core-host-events-list-page.md | 2 | ✅ |
| EVP-003-core-stripe-webhook-secret-audit.md | 3 | ✅ |
| EVP-001-core-production-proof-gates.md | 4 | ✅ |
| EVP-015 → EVP-016 | 5–6 | ✅ |
| EVP-018 (meta) | — | ✅ excluded from build order |
| EVP-019 → EVP-028 | 7–16 | ✅ chain 019→020→**023**→021→022→024→025→026→027→028 |

**G3** lives at [`tasks/events/tasks/G3-core-host-publish-proof.md`](../../events/tasks/G3-core-host-publish-proof.md) (not under `MVP/`) — correctly **#1** before EVP-014.

---

## What to build next (2026-06-08)

| Priority | Task | Linear | Why now |
|---------:|------|--------|---------|
| **1** | EVP-001 launch ledger | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) | **Only P0 gate open** — sign-off doc |
| **2** | UI polish: host nav + detail a11y | [SAN-730](https://linear.app/sanjiovani/issue/SAN-730), [SAN-731](https://linear.app/sanjiovani/issue/SAN-731) | Quick wins on live surfaces |
| **3** | Luma detail layout | [SAN-135](https://linear.app/sanjiovani/issue/SAN-135) | In Review — biggest UX gap |
| **4** | Discovery pack | SAN-119–131 | After ledger green |
| — | G3, EVP-014, EVP-003, EVP-013 | SAN-366,118,116,117 | **Done** on Linear |

---

## Phase map

```text
PHASE A — Launch core (P0)
  Done:    G3 (SAN-366) · EVP-014 (SAN-118) · EVP-003 (SAN-116) · EVP-013 (SAN-117)
  Now:     EVP-001 (SAN-115) → SAN-730/731 polish → SAN-135 Luma
  Deferred: EVP-002 (Andrés paid ticket proof → ledger row)

PHASE B — Discovery & maps (post-MVP)
  EVP-015 → EVP-016
  EVP-019 → EVP-020 → EVP-023 → EVP-021 → EVP-022 → EVP-024
  → EVP-025 → EVP-026 → EVP-027 → EVP-028
  (EVP-018 = meta pack only)

PHASE C — Luma / community UX (ADV/ — see INDEX)
  EVP-032 → … → EVP-047

PHASE D — Advanced revenue (ADV/)
  EVP-029 → EVP-030 → EVP-031
```

---

## Master table — full events program (MVP + ADV + archived refs)

| Order | ID | Linear | Persona | Purpose / feature | Tech stack | Status | Phase |
|------:|----|--------|---------|-------------------|------------|--------|-------|
| **A1** | G3-core | [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) | Roberto | Prod proof: wizard → HITL → `events` row | Next.js · CopilotKit HITL · Mastra · Supabase | Partial 90% | **Launch now** |
| A2 | EVP-014-core | [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) | Roberto | `/host/events` drafts + published list | Next.js · shadcn · Supabase RLS | **Not started** | Launch |
| A3 | EVP-003-core | [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) | Andrés, Patricia | Ticket vs sponsor Stripe webhook secrets | Stripe · Supabase edge | In Progress 60% | Launch |
| A4 | EVP-001-core | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) | All | Launch proof ledger | Vitest · Playwright · evidence | Not Started | Launch (last) |
| — | EVP-013-core | [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) | Camila, Roberto | `<EventCard>` in chat + detail | CopilotKit generative UI | **Done** (archived) | Launch ✓ |
| — | EVP-002-core | — | Andrés | Ticket checkout loop | Stripe · edge | Done (archived) | **Deferred** |
| — | EVP-004–012 | — | — | Host wizard + agents + commit | Mastra · CopilotKit | Done | Core ✓ |
| B1–B12 | EVP-015–028 | SAN-119–131 | — | Discovery pack | See table above | Not Started | Post-MVP |
| — | EVP-018-mvp | [SAN-121](https://linear.app/sanjiovani/issue/SAN-121) | — | Meta pack 019–028 | — | Not Started | Meta |
| C* | EVP-032–047 | SAN-135–150 | — | Luma / social UX | See [`INDEX.md`](../../events/tasks/INDEX.md) | Post-MVP | UX |
| D* | EVP-029–031 | SAN-132–134 | Patricia | Sponsor + OpenClaw | Supabase · VPS | Not Started | Advanced |

---

## Dependency chains (quick reference)

| Chain | Rule |
|-------|------|
| **Launch** | G3 → **EVP-014** → EVP-003 → EVP-001 · EVP-013 before cards everywhere |
| **Host** | EVP-008 → 009 → 010 → 011 → 012 → **G3** → **EVP-014** |
| **Discovery** | EVP-015 → 016 · 019 → 020 → **023** → 021 → 022 → 024 → 025 → 026 → 027 → 028 |
| **Luma page** | EVP-013 + 016 → **032** → 033/034/035 → 036/037 |
| **Sponsor** | EVP-001 + 003 → **029** → 030 → 031 (after commerce stable) |

---

## Linear hygiene notes

| Issue | Detail |
|-------|--------|
| EVT-001 collision | SAN-115 (launch ledger) vs SAN-119 (grounded discovery) |
| EVT-002 collision | SAN-120 (maps) vs SAN-366 (host publish proof) |
| EVT-013 collision | SAN-117 (event cards Done) vs SAN-131 (discovery prod readiness) |
| CTEST-000–012 | SAN-532–544 on Events Platform — contest track, not EVP |
| EVP-014 project | SAN-118 on **Screens** project; spec `linear: SAN-118` |

---

## Rules (from INDEX)

- Supabase = event/ticket truth · Stripe = money · Mastra orchestrates · CopilotKit renders UI · Gemini only for production AI.
- Search grounding discovers candidates — **no auto-publish** (EVP-026).
- OpenClaw/Postiz only after EVP-029/030.
- No **Done** without dated evidence; refresh via EVP-001.
