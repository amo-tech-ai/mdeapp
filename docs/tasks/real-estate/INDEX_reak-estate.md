---
title: Real estate tasks index
canonical_prd: ./real-estate-prd.md
canonical_roadmap: ./real-estate-roadmap.md
parent_index: ../INDEX.md
archived_done: ../archive/real-estate-A/README.md
persona: Camila
audited: 2026-06-08
---

# Real estate tasks — INDEX

**PRD:** [`real-estate-prd.md`](./real-estate-prd.md) · **Roadmap:** [`real-estate-roadmap.md`](./real-estate-roadmap.md)  
**Implementation tasks:** [`tasks/INDEX.md`](./tasks/INDEX.md) (RE-001–020)  
**Done backend** → [`../archive/real-estate-A/`](../archive/real-estate-A/README.md) (F17, F46, F47)

---

## Executive Summary (2026-06-08)

**Overall MVP readiness: ~46 / 100**

| Verdict | Detail |
|---------|--------|
| Go/No-Go | 🔴 **NO-GO** for Camila rental flow launch |
| Core complete | RE-006 (modal + confirmation) ✅  RE-011 (browse page) ✅ |
| Critical blockers | RE-017 parser gaps · RE-018 canned bypass active · RE-007 no E2E lead proof · RE-008 landlord inbox zero |
| Phase needed | CORE P0 items (RE-017, RE-018, RE-007) before MVP gate |

---

## Progress Tracker — Implementation Order

> Status: 🟢 Done · 🟡 Partial · ⚪ Not Started · 🔴 Blocked  
> Phase: CORE = launch-blocking · MVP = post-core required · POST = deferred · SHIP = gate

### Phase 0 — Prerequisites (done outside REAL project)

| Task | SAN | Title | Status | Evidence |
|------|-----|-------|--------|----------|
| F17 | — | Mastra rental agent (`conciergeAgent` + `search_rentals`) | 🟢 Done | [archive](../archive/real-estate-A/README.md) |
| F46 | — | `rental-search-workflow` Mastra workflow | 🟢 Done | archive |
| F47 | — | `chat-lead-capture` edge function | 🟢 Done | archive |
| DATA-019 | [SAN-327](https://linear.app/sanjiovani/issue/SAN-327) | Rentals data inventory — live schema vs PRD | 🟢 Done | [data-019](../data/archive/data-019-rentals-data-inventory.md) |
| DATA-020 | [SAN-347](https://linear.app/sanjiovani/issue/SAN-347) | leads FK — `apartment_id` + `preferred_showing_at` | 🟢 Done | [data-020](../data/archive/data-020-leads-rental-fk-columns.md) |
| DATA-023 | [SAN-348](https://linear.app/sanjiovani/issue/SAN-348) | Rental golden queries eval SQL | 🟢 Done | [data-023](../data/archive/data-023-rental-golden-queries.md) |
| DATA-043 | [SAN-381](https://linear.app/sanjiovani/issue/SAN-381) | `rental_signals` + seed 44 apartments | 🟢 Done | — |
| INT-001 | [SAN-404](https://linear.app/sanjiovani/issue/SAN-404) | Turn-1 chat routing (one intent schema) | 🟢 Done | — |
| INT-002 | [SAN-405](https://linear.app/sanjiovani/issue/SAN-405) | Parse Camila's monthly budget + June dates | 🟢 Done | — |
| INT-006 | [SAN-409](https://linear.app/sanjiovani/issue/SAN-409) | SQL date filters for availability | 🟢 Done | — |
| UX-003 | [SAN-316](https://linear.app/sanjiovani/issue/SAN-316) | Rental price parser (`$500/night`) | 🟢 Done | — |
| UX-035 | [SAN-433](https://linear.app/sanjiovani/issue/SAN-433) | Verify UX-003 parser on production | 🟢 Done | — |
| SCREEN-005 | [SAN-242](https://linear.app/sanjiovani/issue/SAN-242) | Rental card polish + CTAs in chat | 🟢 Done | [SCREEN-005-evidence](../../tasks/evidence/SCREEN-005-evidence.md) |

---

### Phase 1 — CORE (launch-blocking)

| # | Task | SAN | Title | Status | % | Blocker / Evidence |
|---|------|-----|-------|--------|---|--------------------|
| 1 | [RE-001](./tasks/RE-001-supabase-schema-audit.md) | [SAN-467](https://linear.app/sanjiovani/issue/SAN-467) | Supabase schema audit — rentals cluster | ⚪ Not Started | 0% | No evidence file; `apartments` + `rental_signals` tables confirmed live |
| 2 | [RE-002](./tasks/RE-002-apartment-inventory-quality.md) | — | Apartment inventory quality (44 units → quality gate) | ⚪ Not Started | 0% | 44 apartments seeded (DATA-043) but quality metrics never run |
| 3 | [RE-003](./tasks/RE-003-rental-search-indexes.md) | [SAN-469](https://linear.app/sanjiovani/issue/SAN-469) / [SAN-470](https://linear.app/sanjiovani/issue/SAN-470) | Rental search indexes (`price_daily`, vector) | 🟡 Partial | 30% | `price_daily` column in `database.types.ts`; index creation SQL not evidenced; SAN-469/470 are duplicates — close one |
| 4 | [RE-004](./tasks/RE-004-rental-cards-chat.md) | [SAN-471](https://linear.app/sanjiovani/issue/SAN-471) | Rental cards in chat (SCREEN-005) | 🟡 Partial | 65% | Card UI ships (SCREEN-005 Done); **Playwright E2E for card→modal path missing**; Linear status "In Progress" |
| 5 | [RE-005](./tasks/RE-005-map-pin-sync.md) | [SAN-472](https://linear.app/sanjiovani/issue/SAN-472) | Map pin sync with rental cards | 🟡 Partial | 40% | `focusPinId` + `use-browse-card-scroll.ts` exist for `/rentals` browse; chat-panel pin sync not verified |
| 6 | [RE-006](./tasks/RE-006-schedule-viewing-modal.md) | [SAN-262](https://linear.app/sanjiovani/issue/SAN-262) | Schedule viewing modal + lead capture (SCREEN-008) | 🟢 Done | 90% | [SCREEN-008-evidence](../../tasks/evidence/SCREEN-008-evidence.md) · PR [#129](https://github.com/amo-tech-ai/mdeapp/pull/129) · confirmation banner (SAN-716) shipped; **SAN-728 Playwright E2E deferred** |
| 7 | [RE-007](./tasks/RE-007-lead-capture-edge-proof.md) | — | Lead capture edge proof — G2 gate | 🟡 Partial | 40% | `chat-lead-capture` edge fn exists; `/api/leads/schedule-viewing` route exists; **`showings` table has 0 rows** — bridge never exercised end-to-end; no E2E proof |
| 17 | [RE-017](./tasks/RE-017-rental-parser-intelligence.md) | [SAN-484](https://linear.app/sanjiovani/issue/SAN-484) | Parser intelligence — dates, city, confidence | 🟡 Partial | 35% | `intelligence-rental-search.ts` has amenity/price/pet filters; **date slot extraction and city detection gaps**; Linear "Todo" P1 |
| 18 | [RE-018](./tasks/RE-018-gemini-rental-clarify-routing.md) | [SAN-485](https://linear.app/sanjiovani/issue/SAN-485) | Gemini clarify routing — remove canned bypass | 🟡 Partial | 20% | `event-search-fast-path.ts` + `event-clarify-copy.ts` still active; rental clarify bypass never removed; **INT-004 ([SAN-407](https://linear.app/sanjiovani/issue/SAN-407)) also Todo** |

**CORE completion: 3/8 Done · 4/8 Partial · 1/8 Not Started**

---

### Phase 2 — MVP (required before Camila launch)

| # | Task | SAN | Title | Status | % | Blocker / Evidence |
|---|------|-----|-------|--------|---|--------------------|
| 8 | [RE-008](./tasks/RE-008-landlord-inbox-mvp.md) | — | Landlord inbox MVP | ⚪ Not Started | 0% | `landlord_id` FK in DB types; **no inbox UI, no notification, no admin panel**; depends on RE-007 |
| 9 | [RE-009](./tasks/RE-009-showing-bridge.md) | — | Showing bridge — `leads` → `showings` insert | 🟡 Partial | 25% | `showings` table has FK to `leads` + `apartments` + `trips` in DB types; `/api/leads/schedule-viewing` returns `showing_id?`; **0 rows confirmed in `showings` in production** |
| 10 | [RE-010](./tasks/RE-010-saved-trips-integration.md) | [SAN-477](https://linear.app/sanjiovani/issue/SAN-477) | Saved + trips integration for rentals | ⚪ Not Started | 0% | `trips` table in DB; no rental→trip save UI; depends on TRIP-006 ([SAN-279](https://linear.app/sanjiovani/issue/SAN-279)) |
| 19 | [RE-019](./tasks/RE-019-rental-availability-search.md) | [SAN-486](https://linear.app/sanjiovani/issue/SAN-486) | Rental search availability + date filters | 🟡 Partial | 45% | SQL date filters shipped (SAN-409); `intelligence-rental-search.ts` queries `available_from`/`available_to`; **rental-specific integration test exists but SQL schema not verified updated** |

**MVP completion: 0/4 Done · 2/4 Partial · 2/4 Not Started**

---

### Phase 3 — POST-MVP (deferred)

| # | Task | SAN | Title | Status | Notes |
|---|------|-----|-------|--------|-------|
| 11 | [RE-011](./tasks/RE-011-rental-browse-page.md) | [SAN-478](https://linear.app/sanjiovani/issue/SAN-478) | Rental browse page `/rentals` | 🟢 Done | PR [#122](https://github.com/amo-tech-ai/mdeapp/pull/122) · [REAL-011-evidence](../../tasks/evidence/REAL-011-evidence.md) |
| 12 | [RE-012](./tasks/RE-012-rental-detail-page.md) | [SAN-479](https://linear.app/sanjiovani/issue/SAN-479) | Rental detail page `/rentals/[id]` | ⚪ Not Started | Depends RE-011 (Done) |
| 13 | [RE-013](./tasks/RE-013-application-wizard.md) | [SAN-480](https://linear.app/sanjiovani/issue/SAN-480) | Application wizard | ⚪ Not Started | Depends RE-012 |
| 14 | [RE-014](./tasks/RE-014-booking-payment-prep.md) | [SAN-481](https://linear.app/sanjiovani/issue/SAN-481) | Booking + Stripe prep | ⚪ Not Started | [data-024](../data/tasks-data/data-024-rental-booking-commerce-prep.md) |
| 20 | [RE-020](./tasks/RE-020-rental-preference-memory.md) | [SAN-487](https://linear.app/sanjiovani/issue/SAN-487) | pgvector preference memory + ranking | ⚪ Not Started | Backlog |
| — | [REAL](./tasks/) | [SAN-562](https://linear.app/sanjiovani/issue/SAN-562) | Rental lead qualification + metered billing (Lead Agent) | ⚪ Backlog | Phase 2 |

---

### Phase 4 — SHIP (quality gates)

| # | Task | SAN | Title | Status | Notes |
|---|------|-----|-------|--------|-------|
| 15 | [RE-015](./tasks/RE-015-playwright-rls-tests.md) | [SAN-482](https://linear.app/sanjiovani/issue/SAN-482) | Playwright + RLS tests | ⚪ Not Started | Floor gate before launch; SAN-728 is the Playwright E2E sub-task |
| 16 | [RE-016](./tasks/RE-016-production-smoke.md) | [SAN-483](https://linear.app/sanjiovani/issue/SAN-483) | Production smoke + floor | ⚪ Not Started | Last gate |

---

## Related Issues (adjacent projects)

| SAN | Title | Project | Status | Relevance |
|-----|-------|---------|--------|-----------|
| [SAN-386](https://linear.app/sanjiovani/issue/SAN-386) | SEARCH-001 — hybrid_search_listings wire | AI & Intelligence | In Review | Powers RE-003/RE-017 search quality |
| [SAN-407](https://linear.app/sanjiovani/issue/SAN-407) | INT-004 — Remove canned clarify bypass | Core Foundation | Todo | Blocks RE-018 |
| [SAN-545](https://linear.app/sanjiovani/issue/SAN-545) | DATA-EMBED — Fix rental embed API 403 | Platform Infra | Todo | Blocks vector search fallback |
| [SAN-557](https://linear.app/sanjiovani/issue/SAN-557) | CW-5 — G2 rental lead capture hook | Growth | Backlog | RE-007 follow-up |
| [SAN-584](https://linear.app/sanjiovani/issue/SAN-584) | SAN-584 — Enable Rentals nav link in sidebar | UX | Todo | Depends SAN-478 (Done) — **one-liner ready to ship** |
| [SAN-717](https://linear.app/sanjiovani/issue/SAN-717) | FE — Error / empty / loading state pass | UX | Done | Rentals skeleton states included |
| [SAN-728](https://linear.app/sanjiovani/issue/SAN-728) | Playwright E2E — Camila schedule-viewing flow | UX | Backlog | RE-006 G2 Playwright proof |

---

## User Journey Audit

### Camila: Search → Card → Schedule Viewing

| Step | Component | Status | Gap |
|------|-----------|--------|-----|
| Types rental intent in chat | `conciergeAgent` + INT-001 routing | 🟢 Works | — |
| Agent parses budget + neighborhood | `intelligence-rental-search.ts` + INT-002 | 🟡 Partial | City extraction unreliable; date slot gaps (RE-017) |
| Rental cards appear in thread | `RentalCard` + SCREEN-005 | 🟢 Works | Playwright E2E unverified (RE-004) |
| Card pin highlighted on map | `focusPinId` hook | 🟡 Partial | Chat-panel sync not verified; browse-only tested (RE-005) |
| Clicks "Schedule Viewing" | `ScheduleViewingModal` | 🟢 Works | Modal ships (RE-006/PR #129) |
| Submits form → edge fn fires | `chat-lead-capture` edge fn | 🟡 Partial | `showings` 0 rows; E2E unproven (RE-007/RE-009) |
| Sees confirmation in thread | `LeadConfirmationBanner` | 🟢 Works | PR #129 (SAN-716) |
| Receives follow-up from landlord | Landlord inbox | 🔴 Missing | RE-008 not started |

### Landlord (Roberto-adjacent): Receive + Act on Lead

| Step | Status | Gap |
|------|--------|-----|
| Lead row created in `leads` table | 🟡 Partial | `apartment_id` FK done; 0 real rows |
| `showings` row bridged | 🔴 Missing | RE-009 partial — logic not wired |
| Email / notification sent | 🔴 Missing | No notification trigger found |
| Views inbox UI | 🔴 Missing | RE-008 not started |

### Admin (Patricia): Rental Dashboard

| Step | Status | Gap |
|------|--------|-----|
| Views leads CRM | 🔴 Missing | No admin rental panel |
| Sees showing requests | 🔴 Missing | 0 showings rows |
| Analytics / scoring | 🔴 Missing | DATA-025 ([SAN-352](https://linear.app/sanjiovani/issue/SAN-352)) Backlog |

---

## Scorecard (7 areas)

| Area | Score | Rationale |
|------|-------|-----------|
| Data foundation | 75/100 | Schema done, 44 units seeded, indexes partial, DATA-025 Backlog |
| Chat AI / search | 50/100 | Routing + price parser done; date/city parser gaps; canned bypass active |
| Lead capture | 45/100 | Edge fn + API route exist; `showings` empty; E2E unproven |
| UI / Cards + Modal | 75/100 | SCREEN-005/008/REAL-011 all Done; Playwright missing |
| Maps / Pin sync | 45/100 | `focusPinId` hook for browse; chat-panel sync unverified |
| Admin / Landlord | 10/100 | DB FKs only; no inbox, no notification, no dashboard |
| Tests / SHIP gate | 15/100 | Unit tests for modal (PR #129); no Playwright E2E; RE-015/016 not started |
| **Overall** | **46/100** | |

---

## Supabase / Data Dependencies

| Priority | Task | Status | Unblocks |
|----------|------|--------|----------|
| P0 | [data-019](../data/archive/data-019-rentals-data-inventory.md) | 🟢 Done | — |
| P0 | [data-020](../data/archive/data-020-leads-rental-fk-columns.md) | 🟢 Done | RE-009 |
| P0 | [data-021](../data/archive/data-021-showings-lead-bridge.md) | 🟡 Schema done, 0 rows | RE-007, RE-009 |
| P0 | [data-023](../data/archive/data-023-rental-golden-queries.md) | 🟢 Done | RE-017 eval |
| P1 | [data-009 M3](../data/archive/data-009-schema-migrations-m1-m3.md) | 🟡 Partial | `price_daily` indexes |
| P2 | [data-022](../data/tasks-data/data-022-apartments-neighborhood-fk.md) | ⚪ Not Started | RE-017 city intelligence |
| P2 | [data-024](../data/tasks-data/data-024-rental-booking-commerce-prep.md) | ⚪ Backlog | RE-014 Stripe |
| P2 | [data-025](../data/tasks-data/data-025-hermes-rental-analytics-tables.md) | ⚪ Backlog | Admin analytics |

---

## Screen Specs

| Screen | Wire | SCREEN | Linear | Status |
|--------|------|--------|--------|--------|
| [009-scr-rental-card-polish](./wireframes/009-scr-rental-card-polish.md) | [009-wire-rental-search](./wireframes/009-wire-rental-search.md) | SCREEN-005 | [SAN-242](https://linear.app/sanjiovani/issue/SAN-242) | 🟢 Done |
| [009-scr-rentals-browse-page](./wireframes/009-scr-rentals-browse-page.md) | [009-wire-rentals-browse](./wireframes/009-wire-rentals-browse.md) | REAL-011 | [SAN-478](https://linear.app/sanjiovani/issue/SAN-478) | 🟢 Done — PR #122 |
| [017-scr-schedule-viewing-modal](./wireframes/017-scr-schedule-viewing-modal.md) | — | SCREEN-008 | [SAN-262](https://linear.app/sanjiovani/issue/SAN-262) | 🟢 Done — PR #129 |

---

## Priority Queue — Top 10 Now

These unblock Camila's full rental flow for launch:

| # | Task | SAN | Why now |
|---|------|-----|---------|
| 1 | RE-017 parser intelligence | [SAN-484](https://linear.app/sanjiovani/issue/SAN-484) | Date/city gaps break 60%+ of Camila queries |
| 2 | RE-018 remove canned bypass | [SAN-485](https://linear.app/sanjiovani/issue/SAN-485) | Concierge bypassed → no live Gemini for rental clarify |
| 3 | RE-007 lead edge proof | — | `showings` 0 rows = unproven lead path; G2 gate |
| 4 | RE-009 showing bridge | — | Fix the gap between `leads` insert and `showings` row |
| 5 | SAN-584 enable rentals nav | [SAN-584](https://linear.app/sanjiovani/issue/SAN-584) | One-liner — SAN-478 done, gate is open |
| 6 | RE-004 Playwright E2E | [SAN-471](https://linear.app/sanjiovani/issue/SAN-471) | Cards render; verified path to modal missing |
| 7 | SAN-728 schedule-viewing E2E | [SAN-728](https://linear.app/sanjiovani/issue/SAN-728) | RE-006 component done; E2E proof deferred |
| 8 | RE-001 schema audit | [SAN-467](https://linear.app/sanjiovani/issue/SAN-467) | Needed to gate RE-003 index work |
| 9 | RE-003 search indexes | [SAN-469](https://linear.app/sanjiovani/issue/SAN-469) | Close SAN-469 dupe; run index migration |
| 10 | RE-008 landlord inbox | — | Patricia + landlords blind without it |
