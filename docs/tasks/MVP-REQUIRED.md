---
title: MVP required tasks — Phase 1 exit
updated: 2026-05-28
parent: INDEX.md
progress: progres.md
todo: ../todo.md
archives: archive/README.md
---

# MVP required tasks

> **Single source of truth** for Phase 1 **exit definition** (persona gates, floor bundle).  
> **Active execution order:** [`../plan.md`](../plan.md) · [`../todo.md`](../todo.md) · [`INDEX.md`](INDEX.md)  
> Master catalog: [`INDEX.md`](INDEX.md) · Live queue: [`../todo.md`](../todo.md)

## MVP definition (Phase 1 exit)

Three persona flows must work on **https://www.mdeai.co** with evidence:

| Persona | Surface | Exit criterion |
|---------|---------|----------------|
| **Camila** | `/` | Chat → rental **or** café cards + map pins + lead modal (**G2**) |
| **Andrés** | `/events/[slug]` → checkout → `/me/tickets` | Paid Stripe row + QR (**G1**) |
| **Roberto** | `/host/event/new` | NL wizard → HITL publish → row in Supabase (**G3**) |

**Exit bundle (Sofía):**

```bash
cd mdeapp && npm run smoke:map-pins && npm run smoke:f50-pin-sync && npm run verify:console && npm run test:e2e:screens && npm run floor
```

**Phase tags:** **CORE** = platform foundation · **MVP** = Phase 1 exit · **ADV** = post-MVP

---

## Status legend

| Dot | Status | Meaning |
|-----|--------|---------|
| 🟢 | **Completed** | Fully functional & tested |
| 🟡 | **In Progress** | Partially working |
| ⚪ | **Not Started** | Planned but not implemented |
| 🟥 | **Blocked** | Missing dependency or critical failure |

---

## MVP progress snapshot

| Metric | % | Status |
|--------|--:|:------:|
| **Overall MVP readiness** | **98** | 🟡 |
| Shipped foundation (CORE + MVP code) | 100 | 🟢 |
| Commerce gates (G1 + G2 + G3) | 88 | 🟡 |
| P0 blockers remaining | **9** tasks | 🟡 |
| P1 polish remaining | 4 tasks | ⚪ |

---

## MVP execution order — remaining work

> **Order authority:** [`../plan.md`](../plan.md) · [`../todo.md`](../todo.md). This section mirrors exit blockers for reference.

Execute **top to bottom**. Do not skip 🔴 rows — fix or unblock first.

### P0 — exit blockers

| Order | Phase | ID | Task | Persona | % | Status | Blocker / next action |
|------:|:-----:|----|------|---------|--:|:------:|-----------------------|
| **0** | MVP | **G2** | Lead capture prod proof (Camila flow) | Camila | 100 | 🟢 | **Done** — G2 proven on prod |
| **1** | MVP | **G1 ops** | Paid Stripe ticket → `event_orders.status=paid` + wallet QR | Andrés | 80 | 🟡 | Checkout + smokes pass; **manual live payment evidence** open |
| **2** | MVP | [EVP-003-core](events/EVP-003-core-stripe-webhook-secret-audit.md) | Ticket vs sponsor webhook secret isolation | Andrés | 60 | 🟥 | `.env.local` had **identical** secrets — rotate sponsor secret + re-audit |
| **3** | MVP | [EVP-013-core](events/EVP-013-core-event-card-component.md) | EventCard + SCREEN-006 E2E (`event-card` testid) | Andrés | 45 | 🟥 | Playwright times out on `[data-testid="event-card"]` — fix agent/card branch |
| **4** | MVP | **G3 proof** | Host publish HITL → Supabase row | Roberto | 90 | 🟡 | [`G3-core-host-publish-proof`](events/G3-core-host-publish-proof.md) — authenticated publish → SQL row |
| **5** | MVP | [EVP-001-core](events/EVP-001-core-production-proof-gates.md) | Consolidated prod proof ledger (G1+G2+G3) | All | 0 | 🟥 | **Blocked** until rows 1–4 have evidence |
| **6** | CORE | [F32](core/F32-production-smoke.md) | Prod smoke baseline @ www.mdeai.co | sanjiovani | 0 | ⚪ | `curl` probes + `tasks/notes/F32-prod-smoke-*.md` |
| **7** | MVP | [AUTH-011](data/tasks/AUTH-011-production-auth-checklist.md) | Prod auth + Vercel env sign-off | sanjiovani | 40 | 🟡 | Partial evidence (OAuth + ADK URL); checklist mostly open |
| **8** | CORE | [MAP-002B](maps/MAP-002B-prod-adk-deploy.md) | ADK Cloud Run + Vercel `ADK_GROUNDING_URL` | Camila | 0 | ⚪ | Prod grounded search |
| **9** | CORE | [MAP-008B](maps/MAP-008B-vercel-map-id-verify.md) | Vercel Map ID + referrer restrictions | Camila | 0 | ⚪ | Advanced Markers on prod |

```text
NOW:  G1 → EVP-003 → EVP-013 → G3 proof → EVP-001  then  F32 ‖ AUTH-011 ‖ MAP-002B ‖ MAP-008B
```

### P1 — MVP polish (after P0, before public marketing)

| Order | Phase | ID | Task | Persona | % | Status | Notes |
|------:|:-----:|----|------|---------|--:|:------:|-------|
| **8** | MVP | [EVP-014-core](events/EVP-014-core-host-events-list-page.md) | `/host/events` list page | Roberto | 0 | ⚪ | Host UX gap — not an exit blocker |
| **9** | MVP | [017-scr login](screens/017-scr-login-signup-polish.md) | Login / signup chrome polish | All | 0 | ⚪ | Skip if AUTH-011 covers |
| **10** | MVP | [SCREEN-010](maps/wireframes/011-scr-map-exploration-panel.md) | Map exploration panel | Camila | 0 | ⚪ | Optional — not SCREEN-021 blocker |
| **11** | MVP | [MAP-010](maps/MAP-010-place-autocomplete-venue.md) | Venue Places autocomplete | Roberto | 0 | ⚪ | Only if free-text venue blocks publish |

### P1 parallel — quality (never blocks MVP alone)

| Order | Phase | ID | Task | Persona | % | Status | Notes |
|------:|:-----:|----|------|---------|--:|:------:|-------|
| — | CORE | [AUTH-005](data/tasks/AUTH-005-playwright-auth-e2e.md) | Playwright magic-link E2E | sanjiovani | 0 | ⚪ | Strengthens CI; not G1 |
| — | CORE | [AUTH-009](data/auth/AUTH-009-jwt-request-context.md) | JWT → Mastra RequestContext | Sofía | 0 | ⚪ | Post-MVP hardening |

---

## MVP execution order — shipped foundation (do not re-execute)

Built in this sequence; all **🟢 Completed** unless noted.

| Order | Phase | Track | Scope | Count | % | Status | Archive / proof |
|------:|:-----:|-------|-------|------:|--:|:------:|-----------------|
| 1 | CORE | W1 foundation | F01–F06 | 6 | 100 | 🟢 | [`archive/core/`](archive/core/README.md) |
| 2 | CORE | W2 platform | F07–F13, F13b, F18–F19 | 10 | 98 | 🟢 | archive/core — F11 audit → EVP-003 |
| 3 | CORE | CopilotKit shell | F48–F50b | 5 | 100 | 🟢 | [`archive/copilot-A/`](archive/copilot-A/README.md) |
| 4 | CORE | Maps MVP + Search | MAP-001–019, 002D/E, 030/031, 009… | 23 | 100 | 🟢 | [`archive/maps-A/`](archive/maps-A/README.md) |
| 5 | CORE | Mastra gates | MASTRA-001–005 | 5 | 100 | 🟢 | [`archive/mastra-A/`](archive/mastra-A/README.md) |
| 6 | CORE | ADK Cloud Run | CR-00–06 | 3+ | 100 | 🟢 | [`archive/ADK-A/`](archive/ADK-A/README.md) |
| 7 | CORE | Search grounding | GS-001–004 | 4 | 100 | 🟢 | [`archive/grounding-search-A/`](archive/grounding-search-A/README.md) |
| 8 | MVP | Events core code | EVP-002, 004–012, 017 | 11 | 95 | 🟢 | [`archive/events-A/`](archive/events-A/README.md) — proof rolls to EVP-001 |
| 9 | MVP | Rentals backend | F17, F46, F47 | 3 | 100 | 🟢 | [`archive/real-estate-A/`](archive/real-estate-A/README.md) |
| 10 | CORE | Auth batch | AUTH-001–004, 006–008, 010 | 8 | 100 | 🟢 | [`archive/data-A/`](archive/data-A/README.md) |
| 11 | MVP | Screens P0 commerce | SCREEN-001–016, 019–020 | 16 | 100 | 🟢 | [`INDEX-SCREEN-FIRST.md`](05-INDEX-SCREEN-FIRST.md) |
| 12 | MVP | Café discovery A.5 | SCREEN-021 / CAF-A5 | 1 | 100 | 🟢 | [`venues/cafes/CAF-A5-cafe-discovery-ui.md`](venues/cafes/CAF-A5-cafe-discovery-ui.md) |

---

## ADV — advanced backlog (post-MVP)

**Phase: ADV** — do not start until P0 table above is all 🟢. **Full tier order:** [`../plan.md`](../plan.md) Tiers 3–10.

| Order | Phase | Track | Scope | % | Status |
|------:|:-----:|-------|-------|--:|:------:|
| 1 | CORE | Intelligence | INT-001 → 005 (rental clarify) | 0 | ⚪ |
| 2 | ADV | Data | data-001 → 009 → **035** → 003…008; rentals/trips packs | 5 | ⚪ |
| 3 | MVP→ADV | Venues | **VEN-009…051** (SCREEN-021 A.5 🟢); tours VEN-032…051 | 10 | ⚪ |
| 4 | MVP | Intelligence | INT-006 → 010 (café INT-008 after VEN-012) | 0 | ⚪ |
| 5 | ADV | Maps depth | MAP-005 → 006 → 012A → 012 → 010 → data-033 → 011A → 011 → 023 | 15 | ⚪ |
| 6 | ADV | Vector | VEC-001 → 005 (before INT-016) | 0 | ⚪ |
| 7 | ADV | Grounding | GS-005–009 | 0 | ⚪ |
| 8 | ADV | Events discovery | EVP-015 → 028 | 0 | ⚪ |
| 9 | ADV | RE + Trips | RE-001…020 · TRIP-001…019 | 0 | ⚪ |
| 10 | ADV | Core W8+ | F20, F21A, F22, F26, F30 | 0 | ⚪ |
| 11 | CORE | Quality | CK-001–008, AUTH-009 | 0 | ⚪ |
| 12 | Phase 2+ | OpenClaw / contest | OCL-*, CTEST-* | 0 | ⚪ |

Detail: [`INDEX.md`](INDEX.md) · venues: [`venues/tasks/mvp/mvp-index.md`](venues/tasks/mvp/mvp-index.md) · INT: [`intelligence/tasks/INDEX.md`](intelligence/tasks/INDEX.md)

---

## What is NOT needed for MVP

**Phase: ADV** (+ some **CORE** hardening) — do not pull into MVP sprints:

- MAP-005+ spine (except MAP-010 if Roberto blocked on venue)
- VEC-* / VEN-032+ tours / EVP-015–047 / CTEST-* / OCL-* / INT-006+
- F20, F21A, F22, F26, F30, F41
- Full venues data path (DATA-035 seed + VEN-015 booking) before marketing cafés at scale
- CK-001–008 as a batch

---

## Implementation flow (visual)

```text
CORE (shipped 🟢) → P0 blockers → P1 polish → ADV

P0 NOW:
  G1 🟡 → EVP-003 🟥 → EVP-013 🟥 → G3 🟡 → EVP-001 🟥
  then parallel: F32 ⚪ ‖ AUTH-011 🟡 ‖ MAP-002B ⚪ ‖ MAP-008B ⚪

P1 POLISH:
  EVP-014 · SCREEN-017 · SCREEN-010 · MAP-010 (conditional) · AUTH-005

ADV Maps:
  MAP-005 → 006 → 012A → 012 → 010 → data-033 → 011A → 011 → 023
```

*Last reviewed: 2026-05-28 — execution order in [`../plan.md`](../plan.md); venues use VEN-009…051 (not ven/CTI)*
