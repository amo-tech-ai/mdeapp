---
title: Data task pack — forensic audit (tasks-data)
date: 2026-05-29
auditor: cursor (Supabase MCP + disk + plan cross-check)
project_id: zkwcbyxiwklihegjhuql
methodology: READ-ONLY Supabase MCP execute_sql, get_advisors (security), list_edge_functions; disk grep; no migrations applied
scope: tasks/data/tasks-data/* (35 data-* + 3 AUTH-*)
related:
  - ../tasks-data/INDEX-data.md
  - ../audit-supabase.md
  - ../../plan.md Tier 4
  - ux-import-log.json
evidence_gap: tasks/data/evidence/ directory empty on disk (2026-05-29)
---

# Data task pack — forensic audit

> **Verdict:** Spec pack is **directionally correct** (~**79% spec accuracy**) but **not execution-ready** (~**61%**) until inventories are evidenced, **DATA-009** lands, and order drift is fixed. Live Supabase confirms CORE commerce/rentals/trips **work without new tables**; venue anchors, route cache, trip commerce linkage, and rental FK columns are **real gaps**.

---

## Executive summary

| Metric | Score | Dot |
|--------|------:|:---:|
| **Spec accuracy (vs live DB + plan)** | **79/100** | 🟡 |
| **Execution readiness (today)** | **61/100** | 🔴 |
| **RLS posture (live)** | **98/100** | 🟢 |
| **Implementation order correctness** | **72/100** | 🟡 |
| **Evidence / anti-fake-done hygiene** | **35/100** | 🔴 |
| **Full pack readiness** | **68/100** | 🟡 |

### Live Supabase snapshot (2026-05-29 MCP)

| Check | Result |
|-------|--------|
| Public tables with RLS on | **99/100** (`spatial_ref_sys` only exception) |
| RLS-enabled tables with **zero** policies | **0** (all covered) |
| `venue_anchors`, `venue_booking_requests`, `route_cache`, `event_qa` | **Absent** — DATA-009/013/033 not applied |
| `leads.apartment_id`, `leads.trip_id`, `event_orders.trip_id`, `showings.trip_id` | **Absent** — DATA-020/029 not applied |
| `apartments.neighborhood_id` | **Absent** — DATA-022 not applied |
| `apartments.price_daily` column | **Exists**; index on **`price_monthly`** only — DATA-009 M3 still needed |
| `trip_items` CHECK | `event, restaurant, rental, poi, other` only — DATA-027 gap confirmed |
| `restaurants.google_place_id` | **44/44** (100%) — DATA-004 scope partly **already shipped** |
| Active edge functions | **37** (not 47 — DATA-011 count stale) |
| `tasks/data/evidence/*` on disk | **0 files** — inventories claim “shipped” without artifacts |

### What is already safe on prod

- **Events MVP:** `events` (49), `event_orders` (35), `event_attendees` (39), ticket edge fns in mdeai tree ✅
- **Rentals MVP:** `apartments` (44, all geo), `leads` (11), `showings` table+RLS (0 rows) ✅
- **Trips MVP:** `trips` (2), `trip_items` (4), `bookings.trip_id`, `saved_places.trip_id` ✅
- **Maps cache:** `place_details_cache` (52), `places_search_cache` (33) ✅

---

## Red flag list

| # | Severity | Finding |
|---|----------|---------|
| 🔴 | **Blocker** | **DATA-009 not applied** — entire venue P0 chain (035→003→006) blocked |
| 🔴 | **Fake-done risk** | **DATA-001** `status: In Progress` + “audit shipped 2026-05-26” but **no** `tasks/data/evidence/data-001-inventory.md` on disk |
| 🔴 | **Order inversion** | **DATA-034** INDEX says it blocks **MAP-001** (archived/shipped) — wrong dependency |
| 🔴 | **Agent bypass** | Specs assume Mastra/tools write `trip_items` / `showings` — without **DATA-027 RPC** + **DATA-029** columns, agents must not use service-role shortcuts in `mdeapp/src` |
| 🟡 | **Stale spec** | **DATA-004** targets restaurant backfill; live DB already **44/44** `google_place_id` via `20260404044721_restaurants_seed.sql` |
| 🟡 | **IMP collision** | Plan IMP-099 used for both **UX-007** and **MAP-012** in Linear — naming only, but confuses operators |
| 🟡 | **Edge matrix drift** | **DATA-011** says 47 functions; MCP lists **37** active |
| 🟡 | **Dual ownership** | Nightlife/café: specs split `restaurants` vs future `venue_anchors` — **DATA-002** must pick canonical before seeds |
| 🟡 | **Security debt** | 80+ `function_search_path_mutable` WARN (advisor) — DATA-010 correctly scoped but not started |
| 🟡 | **Metadata debt** | `leads.metadata.listing_id` exists (2 rows) but no FK — Camila’s landlord CRM cannot join reliably until DATA-020 |

---

## Blockers list

| Blocker | Blocks | Fix |
|---------|--------|-----|
| DATA-009 M1+M2 | DATA-035, DATA-003, DATA-005, CAF-008, VEN booking | Apply migrations to `zkwcbyxiwklihegjhuql` |
| DATA-001 evidence missing | DATA-002 sign-off, task-verifier Done | Write evidence MD + SQL exports |
| DATA-002 unsigned | All venue seeds | Complete contract doc |
| DATA-029 | DATA-028, TRIP-010 | Add `trip_id` to commerce tables |
| DATA-020 | DATA-021, schedule-viewing CRM | Add `leads.apartment_id` |
| DATA-027 | TRIP-007, DATA-028 | Extend `trip_items_item_type_check` |
| MAP-005 (app) | DATA-007, DATA-008 | Wire Places proxy before cache audit |
| MVP exit (EVP-003) | Prod ticket safety | Ops — not data schema |

---

## Corrected implementation sequence

```text
PHASE A — Inventories (parallel, evidence required before Done)
  DATA-001 ‖ DATA-012 ‖ DATA-019 ‖ DATA-026 ‖ DATA-034

PHASE B — Contracts + critical DDL (strict)
  DATA-002 → DATA-009 (M1→M2→M3) → DATA-035 → DATA-003

PHASE C — Seeds + eval (after B)
  DATA-005 ‖ DATA-004* → DATA-006 → DATA-007 (after MAP-005) → DATA-008

PHASE D — Rentals workflow (after DATA-019)
  DATA-020 → DATA-021 → DATA-023
  DATA-022 ‖ DATA-024 (P2, defer)

PHASE E — Trips commerce bridge (after DATA-026)
  DATA-027 → DATA-029 → DATA-028 → DATA-030
  DATA-031 ‖ DATA-032 (P2)

PHASE F — Events extensions (post-MVP commerce)
  DATA-016 → DATA-013 → DATA-018
  DATA-014 ‖ DATA-015 ‖ DATA-017 (P2+)

PHASE G — Security + ops
  DATA-010 (after 009) ‖ DATA-011 (after 001)

PHASE H — Maps ADV
  DATA-033 (after DATA-001) — MAP-011

AUTH (parallel, not blocking venue DDL)
  AUTH-011 (P0) ‖ AUTH-005 ‖ AUTH-009 (P2)

* DATA-004: downgrade to “verify + gap-fill only” — full seed likely redundant
```

---

## Score table (all tasks)

| ID | Spec % | Ready % | Dot | Linear |
|----|-------:|--------:|:---:|--------|
| DATA-001 | 82 | 45 | 🟡 | — |
| DATA-002 | 85 | 55 | 🟡 | — |
| DATA-003 | 80 | 40 | 🟡 | — |
| DATA-004 | 65 | 70 | 🟡 | — |
| DATA-005 | 84 | 35 | 🔴 | — |
| DATA-006 | 86 | 30 | 🔴 | — |
| DATA-007 | 88 | 50 | 🟡 | — |
| DATA-008 | 83 | 35 | 🔴 | — |
| DATA-009 | 90 | 75 | 🟡 | **Critical path** |
| DATA-010 | 88 | 60 | 🟡 | — |
| DATA-011 | 75 | 55 | 🟡 | — |
| DATA-012 | 88 | 50 | 🟡 | — |
| DATA-013 | 87 | 65 | 🟡 | Post-MVP |
| DATA-014 | 85 | 40 | 🟡 | P2 |
| DATA-015 | 84 | 40 | 🟡 | P2 |
| DATA-016 | 86 | 60 | 🟡 | — |
| DATA-017 | 82 | 25 | 🔴 | Phase 2 |
| DATA-018 | 80 | 55 | 🟡 | — |
| DATA-019 | 90 | 50 | 🟡 | — |
| DATA-020 | 92 | 70 | 🟡 | — |
| DATA-021 | 88 | 55 | 🟡 | — |
| DATA-022 | 85 | 45 | 🟡 | P2 |
| DATA-023 | 87 | 60 | 🟡 | — |
| DATA-024 | 83 | 30 | 🔴 | P2 |
| DATA-025 | 80 | 20 | 🔴 | Phase 2 |
| DATA-026 | 89 | 50 | 🟡 | — |
| DATA-027 | 91 | 72 | 🟡 | — |
| DATA-028 | 86 | 35 | 🔴 | — |
| DATA-029 | 93 | 75 | 🟡 | — |
| DATA-030 | 88 | 55 | 🟡 | — |
| DATA-031 | 90 | 80 | 🟢 | Optional |
| DATA-032 | 82 | 70 | 🟡 | Optional |
| DATA-033 | 88 | 65 | 🟡 | P2 |
| DATA-034 | 78 | 48 | 🟡 | Fix MAP-001 dep |
| DATA-035 | 91 | 38 | 🔴 | Blocked on 009 |
| AUTH-005 | 90 | 65 | 🟡 | — |
| AUTH-009 | 85 | 70 | 🟡 | — |
| AUTH-011 | 88 | 55 | 🟡 | P0 queue |

---

## Safe to implement now

| Task | Why safe |
|------|----------|
| **DATA-001, 012, 019, 026, 034** | Read-only MCP/SQL — no DDL |
| **DATA-002** | Doc-only contract |
| **DATA-011** | Audit-only edge matrix (update fn count to 37) |
| **DATA-023, 030** | Golden-query packs (read-only SQL) |
| **DATA-016** | ALTER `events` — low row count; test RLS on staging first |
| **AUTH-011** | Checklist/evidence — no schema |
| **DATA-031, 032** | Index-only, low risk (CONCURRENTLY) |

---

## Do not implement yet

| Task | Wait for |
|------|----------|
| **DATA-035, 003, 005, 006** | DATA-009 M2 + DATA-002 contract |
| **DATA-008** | DATA-007 + MAP-005 |
| **DATA-028** | DATA-027 + DATA-029 + DATA-021 |
| **DATA-017** | EVP-026 HITL + DATA-016 |
| **DATA-025** | Phase 2 / Hermes |
| **DATA-004 full seed** | Re-verify — may only need diff audit |
| Any **service-role writes from mdeapp/src** | F13 carve-out only |

---

# Per-task audit

---

## DATA-001 — Venues data inventory

**1. Simple description**  
A read-only census of every Supabase table and cache that powers café, restaurant, and nightclub discovery — row counts, RLS, and gap list before any seed work.

**2. Real-world example**  
Like Patricia opening a warehouse ledger before stocking shelves: “We have 44 restaurants with Google IDs, zero curated café anchors, and no booking request table.”

**3. Audit result:** 🟡 Needs fixes

**4. Percent correct:** **72%** (spec 82%, ready 45%)

**5. Problems found**
- Claims “audit shipped 2026-05-26” but **`tasks/data/evidence/` is empty** on disk
- Live: no `venue_anchors` / `venue_booking_requests` (matches gap claim)
- `audit-supabase.md` exists but task points to wrong path `tasks/data/tasks/data-001` in frontmatter
- Status `In Progress` for 3+ days without evidence = anti-fake-done violation

**6. Required corrections**
- Write `tasks/data/evidence/data-001-inventory.md` with MCP SQL outputs dated 2026-05-29
- Flip to Done only after task-verifier
- Fix related paths to `tasks-data/`

**7. Tests to run**
```sql
SELECT count(*) FROM restaurants;
SELECT count(*) FROM place_details_cache;
SELECT table_name FROM information_schema.tables
  WHERE table_schema='public' AND table_name IN ('venue_anchors','venue_booking_requests');
```
- RLS: `SELECT tablename, count(*) FROM pg_policies WHERE tablename='restaurants' GROUP BY 1;`
- No migration tests (read-only)

**8. Order:** ✅ First in venue track — keep

---

## DATA-002 — Three-kind catalog contract

**1. Simple description**  
A written contract defining how cafés, restaurants, and nightclubs are stored — which table, which columns, and shared `metadata` shape — so seeds do not fight each other.

**2. Real-world example**  
“Cafés and nightclubs live in `venue_anchors`; restaurants stay in `restaurants` — both share the same JSON keys for Instagram and vibe text.”

**3. Audit result:** 🟡 Needs fixes

**4. Percent correct:** **78%**

**5. Problems found**
- Depends on incomplete DATA-001
- Does not resolve **dual path**: `restaurants` (44 rows live) vs planned `venue_anchors` for café/nightlife
- DATA-035 metadata v1 must be merged into contract before M2 migration

**6. Required corrections**
- Explicit decision table: kind → table → seed task
- Document that restaurants are **already populated** — contract is delta for café/nightclub only

**7. Tests:** Doc review + gap SQL file; no DDL until DATA-009

**8. Order:** ✅ After DATA-001 — keep

---

## DATA-009 — Schema migrations M1–M3

**1. Simple description**  
Three migrations: booking requests table, venue anchors table, and rental price indexes so Camila’s search and Tourist’s café booking have real DB homes.

**2. Real-world example**  
“When a Tourist taps ‘Request a table,’ a row lands in `venue_booking_requests` tied to a café anchor — not a loose JSON blob in chat.”

**3. Audit result:** 🟡 Needs fixes (spec good, **not applied**)

**4. Percent correct:** **88%**

**5. Problems found**
- **Live: all three artifacts missing** (tables + price_daily index)
- M3 spec says `price_daily` index; live has `idx_apartments_rental_search` on **`price_monthly`**
- Migration path says `supabase/migrations/` — correct at repo root `/home/sk/mdeai/supabase/migrations/` (not `mdeapp/`)
- M1 guest INSERT “edge only” — must pair with edge fn or RPC; no spec file for booking edge yet (VEN-019 app layer)

**6. Required corrections**
- Apply M1→M2→M3 in one PR with evidence
- M3: add index matching **actual** agent filter (`price_daily` used in search-rentals)
- RLS: `(SELECT auth.uid())` pattern; service_role seed path documented

**7. Tests to run**
```sql
-- After migration
\d+ venue_anchors
\d+ venue_booking_requests
EXPLAIN ANALYZE SELECT id FROM apartments
  WHERE status='active' AND price_daily <= 100 ORDER BY price_daily LIMIT 20;
-- RLS negative: SET ROLE anon; INSERT INTO venue_booking_requests ...
```
- `supabase db push` or MCP `apply_migration` on staging first
- `get_advisors` security post-apply

**8. Order:** ✅ After DATA-002 — **#1 DDL priority**

---

## DATA-035 — Café listings → venue_anchors seed

**1. Simple description**  
Load ≥15 curated Medellín cafés into `venue_anchors` with rich metadata (IG, vibe, Places verify) so concierge results are DB-backed, not Places-only.

**2. Real-world example**  
“Café Velvet gets a row with `kind=cafe`, lat/lng, and metadata.why_special — Camila sees it in chat and on the map.”

**3. Audit result:** 🔴 Blocked

**4. Percent correct:** **82%**

**5. Problems found**
- **Blocked:** `venue_anchors` does not exist
- Seed artifacts referenced but not in repo under verified paths
- Depends on DATA-009 M2 — correct

**6. Required corrections**
- Wait for DATA-009 M2
- Add seed script + verify log per spec
- Every Places call: `X-Goog-FieldMask`

**7. Tests**
```sql
SELECT count(*) FROM venue_anchors WHERE kind='cafe' AND is_active;
```
- App smoke: “Quiet cafés near Laureles” on localhost
- Vitest if seed script added

**8. Order:** ✅ After DATA-009 — keep

---

## DATA-003 — Café seed sign-off

**1. Simple description**  
Sign-off checklist after DATA-035 — golden-query mapping and QA that café search hits seeded anchors.

**2. Real-world example**  
“After seeding, run five café prompts and confirm each returns a known `google_place_id` from our catalog.”

**3. Audit result:** 🟡 Needs fixes

**4. Percent correct:** **76%**

**5. Problems:** Thin task — mostly checklist; depends on 035+009; no standalone work

**6. Corrections:** Merge checklist into DATA-035 Done gate or keep as gate-only doc

**7. Tests:** Golden query map; concierge smoke

**8. Order:** ✅ After 035 — keep

---

## DATA-004 — Restaurant seed expansion

**1. Simple description**  
Backfill `restaurants` with Medellín listings and valid `google_place_id` values.

**2. Real-world example**  
“Add 20 restaurants so ‘Italian in El Poblado’ returns cards, not empty state.”

**3. Audit result:** 🟡 Needs fixes (scope overstated)

**4. Percent correct:** **68%**

**5. Problems found**
- **Live: 44/44 restaurants already have `google_place_id`**
- Migration `20260404044721_restaurants_seed.sql` already applied
- Task still says “Not Started” and ≥20 rows — **already met**
- DATA-008 `blocks: data-004` in subagent summary may be cyclic — verify INDEX

**6. Required corrections**
- Re-scope to **gap-fill audit** (cuisine tags, neighborhoods, price tier) not full seed
- Mark dependency satisfied for row count; link live migration
- Remove duplicate seed work

**7. Tests**
```sql
SELECT count(*), count(google_place_id) FROM restaurants;
```
- `search-restaurants` tool smoke on `/`

**8. Order:** Can run **parallel with DATA-005** after DATA-002 — downgrade priority

---

## DATA-005 — Nightclub anchor seed

**1. Simple description**  
Seed nightlife venues as **grounded anchors** (not events tickets) so Tourist can ask “reggaeton in Provenza tonight.”

**2. Real-world example**  
“Discoteca XYZ is an anchor row, not an Andrés ticket event — chat shows pins without implying ticket sales.”

**3. Audit result:** 🔴 Blocked

**4. Percent correct:** **78%**

**5. Problems:** Requires `venue_anchors` (DATA-009 M2); no seed files on disk

**6. Corrections:** Apply after 009; ≥10 anchors; exclude events table

**7. Tests:** Golden query in DATA-006; Places field mask

**8. Order:** ✅ After 002+009 — keep

---

## DATA-006 — Venue golden queries

**1. Simple description**  
Fifteen eval prompts (5 per kind) with expected place IDs for CI/manual regression of venue search.

**2. Real-world example**  
“Query ‘specialty coffee Laureles’ must return place_id `ChIJ…` from our café seed every time.”

**3. Audit result:** 🔴 Blocked

**4. Percent correct:** **80%**

**5. Problems:** Depends on seeds not landed; no `seeds/golden-queries-venues.json` on disk

**6. Corrections:** Block Done until 003/004/005 evidence merged

**7. Tests:** JSON-driven eval; POST `/api/copilotkit` per query

**8. Order:** ✅ After seeds — keep

---

## DATA-007 — place_details_cache audit

**1. Simple description**  
Measure cache hit rate per venue kind so DATA-008 knows what to backfill.

**2. Real-world example**  
“52 cache rows exist — audit shows which of our 15 café anchors already have rich hours/photos cached.”

**3. Audit result:** 🟡 Needs fixes

**4. Percent correct:** **82%**

**5. Problems:** Correctly depends on MAP-005; live cache 52 rows — audit can **start now** for restaurants

**6. Corrections:** Split “restaurant cache audit now” vs “café after 035”

**7. Tests:** Per-kind coverage SQL; document misses

**8. Order:** ✅ After MAP-005 for full sign-off — partial audit OK now

---

## DATA-008 — Places backfill cron

**1. Simple description**  
Server-side job to fill `place_details_cache` for anchor place IDs — no browser Places calls.

**2. Real-world example**  
“Nightly cron fills missing café detail rows so detail panels load without live API on every click.”

**3. Audit result:** 🔴 Blocked

**4. Percent correct:** **79%**

**5. Problems:** Needs DATA-007 miss list; new edge/cron not in `supabase/functions/`

**6. Corrections:** Implement edge fn with service_role + field mask + rate limit

**7. Tests:** Idempotent backfill; ≥80% coverage after one run

**8. Order:** ✅ After 007 — keep

---

## DATA-010 — search_path hardening

**1. Simple description**  
Batch-fix Postgres functions missing fixed `search_path` — closes advisor WARNs without changing behavior.

**2. Real-world example**  
“`ticket_payment_finalize` gets `SET search_path = public` so a search_path injection cannot hijack payment RPCs.”

**3. Audit result:** 🟡 Needs fixes

**4. Percent correct:** **83%**

**5. Problems:** Live advisor still 80+ WARN; P0 RPC list must be pinned first; depends on 009 (reasonable)

**6. Corrections:** Export mutable fn list from MCP; batch ≤20 per migration

**7. Tests:** `get_advisors` before/after; smoke ticket webhook

**8. Order:** ✅ After 009 — keep

---

## DATA-011 — Edge function freeze matrix

**1. Simple description**  
Classify every edge function KEEP/FREEZE/DEFER and audit guest lead abuse on `chat-lead-capture`.

**2. Real-world example**  
“`chat-lead-capture` stays LIVE with 20/hr/IP rate limit; `sponsor-*` functions marked FREEZE for Phase 1.”

**3. Audit result:** 🟡 Needs fixes

**4. Percent correct:** **76%**

**5. Problems**
- Count **47 → 37** active functions (MCP 2026-05-29)
- Many fns still point at **`/home/sk/mde/`** paths — legacy freeze violation risk
- `chat-lead-capture` ✅ in mdeai tree, `verify_jwt: false` confirmed

**6. Corrections:** Refresh matrix with 37 slugs; flag legacy path deployments; document rate limit proof

**7. Tests:** curl guest lead; rate limit burst test

**8. Order:** ✅ Parallel with DATA-001 — keep

---

## DATA-012 — Events data inventory

**1. Simple description**  
Read-only map of event tables vs EVP roadmap — what exists, what’s empty, what’s missing for discovery features.

**2. Real-world example**  
“`event_orders` has 35 paid rows — Andrés path works; `event_qa` table does not exist yet for host Q&A.”

**3. Audit result:** 🟡 Needs fixes

**4. Percent correct:** **84%**

**5. Problems:** CORE commerce claim **verified live**; no evidence file; missing tables list accurate

**6. Corrections:** Write evidence MD; do not mutate schema

**7. Tests:** Row count SQL; RLS policy counts per event table

**8. Order:** ✅ Parallel with DATA-001 — keep

---

## DATA-013 — event_qa schema

**1. Simple description**  
New Q&A table for “Ask Host” with moderation states and public visibility rules.

**2. Real-world example**  
“Andrés asks ‘Is there parking?’ — row in `event_qa` until Roberto approves the answer.”

**3. Audit result:** 🟡 Needs fixes (spec good, not applied)

**4. Percent correct:** **85%**

**5. Problems:** Table absent live; RLS design solid; must not expose pending rows to anon

**6. Corrections:** Migration + 4 policies + indexes as spec

**7. Tests:** Anon SELECT pending → 0 rows; organizer UPDATE

**8. Order:** ✅ After DATA-012 — post-MVP commerce OK

---

## DATA-014 / DATA-015 / DATA-017 — Events P2+ schemas

**Summary:** Specs are coherent; tables absent; **do not implement until Phase 2** discovery/HITL (017 explicitly says wait for EVP-026).

| ID | Spec % | Dot |
|----|-------:|:---:|
| DATA-014 live updates | 85 | 🟡 |
| DATA-015 attendee social | 84 | 🟡 |
| DATA-017 discovery pipeline | 82 | 🔴 defer |

---

## DATA-016 — Events AI approval columns

**1. Simple description**  
Add approval status columns so AI-generated event copy is not public until Roberto approves.

**2. Real-world example**  
“`ai_summary` stays hidden until `ai_summary_status='approved'` — tourists don’t see draft Gemini text.”

**3. Audit result:** 🟡 Needs fixes

**4. Percent correct:** **86%**

**5. Problems:** Live has `ai_summary` + `status` on events; **missing** `ai_summary_status`, `tags_status`, approver columns

**6. Corrections:** ALTER + backfill + RLS or app filter documented

**7. Tests:** Anon cannot read draft AI fields

**8. Order:** ✅ After DATA-012 — safe on staging

---

## DATA-018 — Event admin ops views

**1. Simple description**  
SQL views/RPCs for Patricia — failed orders, pending publish, check-in gaps.

**3. Audit result:** 🟡 **79%**

**5. Problems:** Must use `security_invoker` or admin RPC; coordinate DATA-010 for DEFINER fns

**8. Order:** ✅ After DATA-012

---

## DATA-019 — Rentals inventory

**1. Simple description**  
Document rental tables vs PRD — what Camila’s search uses today and what columns are missing.

**2. Real-world example**  
“44 apartments, 11 leads — but leads don’t link to `apartment_id`, so landlord CRM can’t filter by listing.”

**3. Audit result:** 🟡 Needs fixes

**4. Percent correct:** **86%**

**5. Problems:** Gap claims **verified live**; no evidence file; `showings` schema matches spec (no trip_id)

**6. Corrections:** Evidence MD; confirm metadata backfill candidates

**7. Tests:** RLS negative tests landlord vs renter

**8. Order:** ✅ Parallel inventory — keep

---

## DATA-020 — leads.apartment_id FK

**1. Simple description**  
Add foreign key from lead to apartment plus preferred showing time — replaces JSON `listing_id` hack.

**2. Real-world example**  
“When Camila schedules a viewing for listing X, the lead row points at `apartments.id` — landlord sees which unit.”

**3. Audit result:** 🟡 Needs fixes

**4. Percent correct:** **88%**

**5. Problems:** Columns **absent** live; 2 leads have `metadata.listing_id` for backfill; `chat-lead-capture` must be updated (app task)

**6. Corrections:** Migration + backfill + index; extend edge fn

**7. Tests**
```sql
SELECT count(*) FROM leads WHERE apartment_id IS NOT NULL;
```
- Schedule-viewing e2e creates FK not just metadata

**8. Order:** ✅ After DATA-019 — **rentals P1 critical**

---

## DATA-021 — showings bridge

**1. Simple description**  
When user schedules a viewing, create a `showings` row linked to lead + apartment.

**2. Real-world example**  
“Lead captures interest; showing row holds the Tuesday 3pm slot status for landlord calendar.”

**3. Audit result:** 🟡 Needs fixes

**4. Percent correct:** **84%**

**5. Problems:** Table+RLS exist (5 policies); **0 rows** — SCREEN-008 only writes leads; spec correctly flags gap

**6. Corrections:** Edge/RPC insert; depends DATA-020

**7. Tests:** One flow → lead + showing rows

**8. Order:** ✅ After DATA-020

---

## DATA-022 — apartments.neighborhood_id

**Spec % 82** — Column absent live (only `neighborhood` text). P2 — defer until MAP-012 hood intelligence.

---

## DATA-023 — Rental golden queries

**Spec % 86** — Safe read-only after DATA-019; document M3 index dependency.

---

## DATA-024 / DATA-025 — P2 commerce / Hermes

**Defer** — bookings/payments exist empty; Hermes tables absent; Phase 2.

---

## DATA-026 — Trips inventory

**1. Simple description**  
Inventory trips schema vs plan — confirm MVP needs no new tables.

**3. Audit result:** 🟡 **86%** — CORE claim verified (`trips` 2, `trip_items` 4, RLS on); no evidence file.

**8. Order:** ✅ Parallel inventory

---

## DATA-027 — trip_items CHECK + RPC

**1. Simple description**  
Allow `showing`, `booking`, `custom_note` item types and add secure insert RPC for agents.

**3. Audit result:** 🟡 **90%**

**5. Problems:** Live CHECK **missing** new types — spec accurate

**6. Corrections:** ALTER CONSTRAINT + RPC with `auth.uid()` trip ownership

**7. Tests:** Wrong user insert fails; valid types insert OK

**8. Order:** ✅ Before DATA-028/029 — **trips P1 critical**

---

## DATA-029 — Commerce trip_id linkage

**1. Simple description**  
Add `trip_id` to orders/leads/showings so purchases and viewings attach to Camila’s itinerary.

**3. Audit result:** 🟡 **91%**

**5. Problems:** **Verified absent** on `event_orders`, `leads`, `showings`; `bookings.trip_id` exists

**6. Corrections:** Single migration adding 3 FKs + indexes; app checkout schema update

**7. Tests:** Insert order with trip_id; RLS unchanged on read

**8. Order:** ✅ Before DATA-028 — correct

---

## DATA-028 — trip_items sync

**1. Simple description**  
After ticket paid or showing confirmed, upsert one `trip_items` row idempotently.

**3. Audit result:** 🔴 **82%** — Blocked on 027+029; webhook gap verified

**8. Order:** ✅ After 029 — keep

---

## DATA-030 — Trips golden queries

**Spec % 86** — Read-only pack; safe after DATA-026

---

## DATA-031 / DATA-032 — P2 indexes

**Spec % 88 / 80** — 🟢 Optional; low row counts today; safe when needed

---

## DATA-033 — route_cache

**1. Simple description**  
Cache table for Google Directions responses — service_role only.

**3. Audit result:** 🟡 **86%** — Table **absent** live; RLS pattern matches places caches

**8. Order:** After DATA-001; blocks MAP-011 — keep

---

## DATA-034 — Maps geo inventory

**1. Simple description**  
Audit lat/lng and place_id coverage across rentals, events, restaurants, destinations.

**3. Audit result:** 🟡 **74%**

**5. Problems:** INDEX claims blocks **MAP-001** (foundation shipped) — **wrong**; apartments 44/44 geo OK live

**6. Corrections:** Remove MAP-001 from blocks; fix unblocks to MAP-012 / DATA-009 M3

**7. Tests:** Geo coverage SQL per kind

**8. Order:** Parallel with DATA-001 — keep

---

## AUTH-005 / AUTH-009 / AUTH-011

Included in folder; not data DDL but audited briefly:

| ID | Spec % | Dot | Note |
|----|-------:|:---:|------|
| AUTH-011 | 88 | 🟡 | P0 MVP exit; 40% claimed; prod checklist valid |
| AUTH-005 | 90 | 🟡 | E2E not wired |
| AUTH-009 | 85 | 🟡 | Optional RequestContext — RLS-safe client pattern correct |

---

# Final readiness — full data task pack

| Dimension | Grade |
|-----------|------:|
| Live DB matches CORE claims | B+ |
| Spec completeness | B |
| Evidence discipline | F |
| DDL critical path clarity | B+ |
| RLS safety (existing) | A |
| Agent write safety (future) | C+ |
| **Overall pack** | **68/100 (D+→C-)** |

**Ship rule:** No DATA task flips **Done** without `tasks/data/evidence/<id>.md` + MCP-dated SQL unless pure doc (002) with reviewer sign-off.

---

# Appendix — Live SQL reference (2026-05-29)

```sql
-- Missing planned tables
SELECT table_name FROM information_schema.tables
WHERE table_schema='public'
  AND table_name IN ('venue_anchors','venue_booking_requests','route_cache','event_qa');

-- Leads gaps
SELECT column_name FROM information_schema.columns
WHERE table_name='leads' AND column_name IN ('apartment_id','trip_id','preferred_showing_at');

-- Trip commerce gaps
SELECT table_name, column_name FROM information_schema.columns
WHERE table_name IN ('event_orders','showings') AND column_name='trip_id';

-- trip_items types
SELECT pg_get_constraintdef(oid) FROM pg_constraint
WHERE conrelid='public.trip_items'::regclass AND conname='trip_items_item_type_check';
```

---

*Auditor: Supabase MCP on project `zkwcbyxiwklihegjhuql`. Re-run after DATA-009 merge.*
