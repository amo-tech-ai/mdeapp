---
title: Data + Auth task index & progress tracker
date: 2026-05-30
parent: tasks/data/supabase-plan.md
canonical_folder: tasks/data/tasks-data/
archived_pr_data: ../../PR/archive/README.md
archived_done: ../archive/README.md
pr_remediation: ../../PR/INDEX.md
verified: Supabase MCP zkwcbyxiwklihegjhuql + disk evidence 2026-05-30 · live forensic re-audit 2026-06-01 · DATA-007 archived 2026-06-02
---

# Data layer — INDEX & Progress Tracker

**Role:** Expert project analyst / detective reviewer · systems architect view of the DATA + Auth pack.

**Active specs:** [`tasks/data/tasks-data/`](./) · **Done specs (26):** [`../archive/`](../archive/README.md) · **PR archive (DATA-048/050):** [`../../PR/archive/tasks-data/`](../../PR/archive/tasks-data/) · **Plan:** [`../supabase-plan.md`](../supabase-plan.md) · **PR train:** [`../../PR/INDEX.md`](../../PR/INDEX.md) · **Live log:** [`../evidence/IMPLEMENTATION-STATUS.md`](../evidence/IMPLEMENTATION-STATUS.md) · **Master plan:** [`../../plan.md`](../../plan.md)

**Real-estate PRD:** [`../../real-estate/real-estate-prd.md`](../../real-estate/real-estate-prd.md) · **Trips app:** [`../../trips/tasks/`](../../trips/tasks/) · **Maps app:** [`../../maps/INDEX.md`](../../maps/INDEX.md)

---

## Pack summary (verified 2026-05-30 · live re-audit 2026-05-31 · forensic 2026-06-01)

> **Live re-audit 2026-05-31 (claude):** all "Done" DATA tasks verified present + correct on `zkwcbyxiwklihegjhuql` (live DB **98%** accurate). Corrections below: restaurants **44** (not 43), edge functions **40** (not 39), `function_search_path_mutable` now **1** (`trigger_set_timestamps`), canonical `supabase/migrations/` was symlinked to an empty dir (**restored**), and migration version-prefix drift exists (11 local-only / 15 remote-only). Full report: [`../audit/DATA-PACK-LIVE-AUDIT-2026-05-31.md`](../audit/DATA-PACK-LIVE-AUDIT-2026-05-31.md).

> **Live forensic re-audit 2026-06-01 (claude):** intelligence stack **deployed + version-tracked** — `data039→data047` all applied (latest remote `20260601120800`). **6/6 search RPCs live** (`hybrid_search_*` + `semantic_search_*`, `search_path=''` hardened); **3/3 embed triggers enabled**; HNSW dedup clean (VEC-001); **RLS 113/114** (only `spatial_ref_sys`). Embeddings **~95% backfilled** (apartments 44/44, restaurants 43/44, events 43/49). **Corrections:** DATA-045 is **venue-only ≈45%** (event/rental grounding **0 rows**; `venue_grounding`+`event/rental_source_evidence` absent); migration drift now **1 local-only** file (DATA-048 reconciled the prior 11/15, remote=**76**); neighborhoods **13** (was 12, 8 profiled); DATA-050 archaeology **complete** (§9). Full report: [`../audit/DATA-FORENSIC-AUDIT-2026-06-01.md`](../audit/DATA-FORENSIC-AUDIT-2026-06-01.md) · diagrams: [`../diagrams/`](../diagrams/).

| Scope | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|-------|-------------|--------|------------|--------------|----------------------|----------------|
| **DATA pack (35 tasks)** | Supabase schema, seeds, golden queries, security | 🟡 In Progress | **77%** (27/35 Done) | 26 specs archived + DATA-042/043/044 live | 8 active specs | **DATA-028** trip_items sync |
| **P0 venue foundation** | Inventories → M1–M3 → café/restaurant/nightclub seeds | 🟢 Completed | **100%** | 17 café + 13 nightclub anchors live; **44/44** restaurants w/ place_id (live 2026-05-31) | — | None |
| **P0 trips DDL** | RPC + `trip_id` linkage + golden SQL | 🟢 Completed | **100%** | `insert_trip_item_for_user`; cols on 3 tables | **DATA-028** app sync not started | **DATA-028** after **DATA-021** |
| **P1 security** | search_path + edge matrix | 🟢 Completed | **100%** | DATA-010 + **DATA-010b**; DATA-011 matrix (**40** ACTIVE fns live 2026-05-31) | Phase 2 DEFINER EXECUTE backlog (113 warns); `trigger_set_timestamps` search_path open | **DATA-028** trip_items sync |
| **Auth open (3)** | E2E, JWT context, prod checklist | 🟡 In Progress | **~25%** | F08 + AUTH-001–010 archived | AUTH-005/009/011 open | **AUTH-005** Playwright |

**Live Supabase spot-check:** `venue_anchors` cafe **17** · nightclub **13** · `insert_trip_item_for_user` **exists** · project `zkwcbyxiwklihegjhuql`.

---

## Archived — completed specs (26 files)

Moved to [`../../data/archive/`](../../data/archive/README.md): DATA-001–007, 009–012, 019–021, 023, 026–027, 029–030, 034–035, 039–040, 047, SEARCH-003. **PR archive:** DATA-048, DATA-050 → [`../archive/tasks-data/`](../archive/tasks-data/). Index-only Done: DATA-042, 043, 044, VEC-001.

---

## Progress tracker — active DATA tasks

**Legend:** 🟢 Completed · 🟡 In Progress · ⚪ Not Started · 🟥 Blocked

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|------|-------------|--------|---|--------------|----------------------|----------------|
| [DATA-008](data-008-places-backfill-cron.md) | Places backfill cron | 🟥 Blocked | 0% | Spec | Blocked by DATA-007 audit list | After DATA-007 (archived) — unblocks backfill |
| [DATA-013](data-013-event-qa-schema.md) | `event_qa` schema | ⚪ Not Started | 0% | Inventory done | No DDL | P1 when EVP-034 ready |
| [DATA-016](data-016-events-ai-content-approval-columns.md) | AI approval columns on `events` | ⚪ Not Started | 0% | — | No DDL | P1 backlog |
| [DATA-018](data-018-event-admin-ops-views.md) | Admin ops SQL views | ⚪ Not Started | 0% | — | No views | P1 backlog |
| [DATA-014](data-014-event-live-updates-schema.md) | `event_live_updates` | ⚪ Not Started | 0% | — | P2 deferred | Phase 2 |
| [DATA-015](data-015-event-attendee-social-schema.md) | Attendee social schema | ⚪ Not Started | 0% | — | P2 deferred | Phase 2 |
| [DATA-017](data-017-discovered-events-pipeline-schema.md) | Discovery pipeline schema | ⚪ Not Started | 0% | — | P2 deferred | Phase 2 |
| [DATA-022](data-022-apartments-neighborhood-fk.md) | `apartments.neighborhood_id` FK | ⚪ Not Started | 0% | — | P2 | Deferred |
| [DATA-024](data-024-rental-booking-commerce-prep.md) | Rental booking / Stripe prep | ⚪ Not Started | 0% | — | P2 | Deferred |
| [DATA-025](data-025-hermes-rental-analytics-tables.md) | Hermes analytics tables | ⚪ Not Started | 0% | — | P2 / Phase 2 | Deferred |
| [DATA-028](data-028-booking-trip-item-sync.md) | Orders/showings → `trip_items` sync | 🟥 Blocked | 0% | DATA-021 bridge live | Webhook + app not wired | Implement webhook upsert |
| [DATA-031](data-031-trip-items-itinerary-index.md) | Itinerary covering index | ⚪ Not Started | 0% | — | P2 scale | Deferred |
| [DATA-032](data-032-mastra-threads-trip-metadata-index.md) | Thread `trip_id` index | ⚪ Not Started | 0% | — | P2 | Deferred |
| [DATA-033](data-033-route-cache-schema.md) | `route_cache` schema | ⚪ Not Started | 0% | — | P2 / MAP-011 | After DATA-034 (archived) |
| [DATA-041](DATA-041-venue-signals.md) | venue_signals + seed | 🟢 Done | 100% | 30 rows · GQ-S01 ✅ | Patricia editorial ☐ | [`evidence/DATA-041-verify-2026-06-03.md`](../../data/evidence/DATA-041-verify-2026-06-03.md) |
| DATA-045 | Evidence / grounding tables | 🟡 In Progress | **45%** | `venue_source_evidence` **20** rows (live 2026-06-01) | `event_grounding` **0**, `rental_grounding` **0** | Define shape; seed via **AI-004** |
| [SEARCH-001](SEARCH-001-rental-hybrid.md) | Hybrid rentals app | ⚪ Not Started | 0% | **RPC `hybrid_search_listings` live** | App wiring only | Wire app (SAN-386); not Stable Beta train |
| [SEARCH-002](SEARCH-002-event-hybrid.md) | Hybrid events app | ⚪ Not Started | 0% | **RPC `hybrid_search_events` live** | App wiring; PR **#38** open | **PR-11** un-stack; do not mix UX soak |
| [AI-003](AI-003-signal-enrichment.md) | Signal enrichment batch | ⚪ Not Started | 0% | Spec on disk | Phase 1b | Linear SAN-395 |
| [AI-004](AI-004-grounding-verify.md) | Grounding verification | ⚪ Not Started | 0% | Spec on disk | Phase 1b | Linear SAN-396 |
| [DATA-046](DATA-046-golden-queries-v2.md) | Golden queries v2 | ⚪ Not Started | 0% | Spec on disk | Phase 1b | Linear SAN-384 |

**Archived (not in active folder):** DATA-007 → [`../../data/archive/data-007-cache-audit.md`](../../data/archive/data-007-cache-audit.md) · DATA-048/050 → [`../archive/tasks-data/`](../archive/tasks-data/)

**Intelligence roadmap:** [`../../intelligence/intelligence-plan.md`](../../intelligence/intelligence-plan.md) · **Mastra routing:** [`../../mastra/MASTRA-MIS-001-routing-canonical.md`](../../mastra/MASTRA-MIS-001-routing-canonical.md) · **MIS task index:** [`../../mastra/MIS-TASKS-INDEX.md`](../../mastra/MIS-TASKS-INDEX.md)

---

## Progress tracker — Auth tasks (merged from former `INDEX.md`)

**Done specs archived:** [`../../../archive/data-A/`](../../../archive/data-A/README.md) · **F08 login:** [`../../core/F08-supabase-auth-login-page.md`](../../core/F08-supabase-auth-login-page.md) (Done)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|------|-------------|--------|---|--------------|----------------------|----------------|
| AUTH-001–004, 006–008, 010 | OAuth, middleware, RLS, Studio doc | 🟢 Completed | 100% | Archive + [`evidence/AUTH-*`](../../data/evidence/) | — | None |
| F08 | Magic link + SSR login | 🟢 Completed | 100% | Core task Done | — | None |
| [AUTH-005](AUTH-005-playwright-auth-e2e.md) | Playwright auth smoke | ⚪ Not Started | 0% | Spec Ready | No e2e evidence | Run manual Google flow test |
| [AUTH-009](AUTH-009-jwt-request-context.md) | JWT in Mastra RequestContext | ⚪ Not Started | 0% | Spec Ready | Tools lack user context | Implement per spec |
| [AUTH-011](AUTH-011-production-auth-checklist.md) | Production auth checklist | 🟡 In Progress | **40%** | Partial [`AUTH-011-evidence`](../../data/evidence/AUTH-011-evidence.md) | Checklist not closed; **`auth_leaked_password_protection` OFF** (live advisor 2026-05-31) | Enable HaveIBeenPwned password check + complete prod evidence |

**Auth verification note:** [`../../data/auth/VERIFICATION.md`](../../data/auth/VERIFICATION.md) — pack execution not 100% until AUTH-005/009/011 close. **Spec accuracy:** [`../VERIFICATION.md`](../VERIFICATION.md) (2026-06-01).

---

## Critical path (what matters for MVP)

```text
DONE ── DATA-001→006 Layer A + DATA-010/010b/011 + DATA-021 (showings bridge)
NEXT ── DATA-028 (trip_items sync from showings/orders)
APP  ── MSV-012 CopilotKit harness (Layer B)
BLOCKED ── DATA-008 (miss list from archived DATA-007) until backfill cron wired
PARALLEL ── MIS Phase 1 FROZEN: VEC-001 → DATA-039…047 → SEARCH-003 (see intelligence-queue.json)
INTEL    ── Linear: node scripts/linear-import-intelligence-tasks.mjs · view: 11-intelligence-views.md
P2   ── chat-lead-capture auth user rate limit
```

**Linear:** [Data view](https://linear.app/sanjiovani/view/data-54425dec37b9) · filter `project:MDEAPP label:track:data` · SAN-325…359 map 1:1 to DATA-001…033 via [`import-log.json`](../../linear/import-log.json) · **Title format:** `DATA-### — readable name` (not `SYS-021` — prefix-catalog rename reverted by `linear-import-data-tasks.mjs`) · resync: `node scripts/linear-restore-track-labels.mjs && node scripts/linear-import-data-tasks.mjs`

---

## Task index by domain (quick links)

### Venue + schema (P0) — all Done → [`../../data/archive/`](../../data/archive/README.md)

DATA-001, 002, 003, 004, 005, 009, 035 archived.

### Cache + eval

| Order | ID | Title | Status |
|------:|-----|-------|--------|
| 12 | DATA-006 | Golden queries (Layer A) | 🟢 [archive](../../data/archive/data-006-golden-queries.md) |
| 13 | DATA-007 | Cache audit | 🟢 [archive](../../data/archive/data-007-cache-audit.md) |
| 14 | DATA-008 | Places backfill | 🟥 blocked (app cron) |

### Security (P1) — Done → [`../../data/archive/`](../../data/archive/README.md)

DATA-010, 010b, 011 archived.

### Events data

| ID | Title | Priority |
|----|-------|----------|
| DATA-012 | Events inventory | P0 [archive](../../data/archive/data-012-events-data-inventory.md) |
| DATA-013, 016, 018 | Q&A, AI cols, admin views | P1 open |
| DATA-014, 015, 017 | Live updates, social, discovery | P2 deferred |

**CORE events commerce:** no new tables.

### Rentals (Camila / Andrés)

| ID | Title | Status |
|----|-------|--------|
| DATA-019, 020, 021, 023 | Rentals DDL + bridge + golden | [archive](../../data/archive/README.md) |
| DATA-022, 024, 025 | P2 prep / Hermes | Deferred |

### Trips (Camila)

| ID | Title | Status |
|----|-------|--------|
| DATA-026, 027, 029, 030 | Inventory + DDL + golden SQL | [archive](../../data/archive/README.md) |
| DATA-028 | Booking → `trip_items` sync | Blocked (app) |
| DATA-031, 032 | P2 indexes | Deferred |

### Maps

| ID | Title | Status |
|----|-------|--------|
| DATA-034 | Geo inventory | [archive](../../data/archive/data-034-maps-geo-inventory.md) |
| DATA-033 | `route_cache` | P2 open |

---

## Cross-track (app — not DATA DDL)

| Track | Task | Notes |
|-------|------|-------|
| Events | [EVP-003](../../events/tasks/EVP-003-core-stripe-webhook-secret-audit.md) | Webhook secrets |
| Rentals | [017-scr-schedule-viewing](../../real-estate/017-scr-schedule-viewing-modal.md) | Needs app write to DATA-020 cols |
| Auth | AUTH-005/009/011 | See tracker above |
| Trips | [TRIP-001](../../trips/tasks/TRIP-001-trips-supabase-audit-evidence.md) … | App on top of DATA-027/029 |

---

## Evidence & docs

| Doc | Purpose |
|-----|---------|
| [`../evidence/IMPLEMENTATION-STATUS.md`](../evidence/IMPLEMENTATION-STATUS.md) | Execution log |
| [`../audit/DATA-FORENSIC-AUDIT-2026-06-01.md`](../audit/DATA-FORENSIC-AUDIT-2026-06-01.md) | **Live forensic audit + deployment tracker (2026-06-01)** |
| [`../diagrams/`](../diagrams/) | Mermaid: intelligence-stack ER · deployment status · migration-replay debt (all `mermaid.parse` validated) |
| [`../audit-supabase.md`](../audit-supabase.md) | Live MCP audit |
| [`../supabase-plan.md`](../supabase-plan.md) | Migrations + mermaid |
| [`../plan/23-audit.md`](../plan/23-audit.md) | Plan verdict |
| [`../../../supabase/seeds/`](../../../supabase/seeds/) | Seed JSON, CSV (sources); SQL in `supabase/migrations/` |
| [`VERIFICATION.md`](VERIFICATION.md) | Auth forensic report |

---

## Verification methodology (this tracker)

1. **Examine** — task spec `status` + `tasks/data/evidence/*`
2. **Verify** — Supabase MCP SQL on `zkwcbyxiwklihegjhuql` (2026-05-30)
3. **Validate** — Places verify logs under `tasks/testing/evidence/DATA-*`
4. **Measure** — Done = 100%; partial deliverables = 40–70%; blocked = 0% until dependency clears
5. **Identify** — 🟥 = hard dependency or app layer gap with no DDL left

**Percent formula (DATA pack):** `Done / 35` = **27/35 ≈ 77%** (26 archived specs + DATA-042/043/044). **Active folder:** 19 spec files + INDEX. P0 venue + P1 security = **100%** (archived).
