---
title: Data Layer — Supabase Live Audit
date: 2026-05-26
project_id: zkwcbyxiwklihegjhuql
project_name: medellin
region: us-east-1
methodology: READ-ONLY via Supabase MCP (list_tables, execute_sql, get_advisors security+performance, list_edge_functions)
scope: Real estate · Events · Trips · Users · Venues (data-001–008) · cross-ref tasks/data/plan/prompt.md Steps 1–9
auditor: sanjiovani (operator) + Composer agent
related_tasks:
  - tasks/data/tasks/data-001-inventory.md
  - tasks/data/tasks/data-002-catalog-contract.md
  - tasks/data/tasks/data-009-schema-migrations-m1-m3.md
  - tasks/data/tasks/data-010-postgres-search-path-hardening.md
  - tasks/data/tasks/data-011-edge-hardening-evidence.md
  - tasks/data/plan/23-audit.md
  - tasks/data/plan/prompt.md
  - plan/audit/04-supabase-audit.md
---

# Supabase live audit — data layer

> **TL;DR.** Project `zkwcbyxiwklihegjhuql` is **production-capable for CORE+MVP data** — events ticketing, rentals, trips, profiles, and restaurant catalog already exist with RLS. **Aggregate readiness: 76/100** for the data-task queue. Blockers are **operational** (guest lead path, duplicate vector indexes, missing venue booking table, café/nightclub catalog gap), not missing core schema. **Do not add 132-table scope** — ship data-001 inventory evidence, then 3 small migrations + index cleanup.

---

## Executive verdict

| Question | Answer |
|---|---|
| Can mdeapp read/write Phase 1 domains today? | **Yes** — `events`, `event_orders`, `apartments`, `trips`, `profiles`, `restaurants`, embeddings, places cache |
| Schema migrations required for MVP? | **3 targeted** — `venue_booking_requests`, optional `venue_anchors`, `idx_apartments_price_daily` |
| Biggest blocker for Camila (rentals)? | Low inventory (44 rows) + **no index on `price_daily`** (agent sorts/filters on it) |
| Biggest blocker for Roberto (events)? | None schema-side; EVP-003 webhook secret audit is ops |
| Biggest blocker for Tourist (venues)? | **No café/nightclub catalog table** — ADK/cache only; `venue_booking_requests` absent |
| Biggest blocker for Andrés (tickets)? | None — `event_orders` (35), `event_attendees` (39), Stripe edge fns live |
| RLS posture | **99/100 tables** enabled; only `spatial_ref_sys` off (PostGIS system — acceptable) |

---

## Readiness scorecard

| Domain | Score /100 | Status | Notes |
|---|---:|---|---|
| **Foundation** (auth, profiles, RLS) | 88 | 🟢 | 100 public tables; 99 RLS-on; policies on all user tables |
| **Events + ticketing** | 90 | 🟢 | Full MVP stack + tax/waitlist/refund tables provisioned (empty) |
| **Real estate** | 72 | 🟡 | Schema rich; 44 listings; lead guest path edge-only; landlord tables empty |
| **Trips + saved** | 78 | 🟢 | `trips`/`trip_items`/`saved_places`/`collections` exist; low row count |
| **Venues (café/restaurant/nightclub)** | 58 | 🟥 | Restaurants OK; café/nightclub = grounding only; booking table missing |
| **Maps cache** | 80 | 🟢 | 45 valid `place_details_cache`; 33 `places_search_cache` |
| **Vectors** | 65 | 🟡 | 3 embedding tables populated; **duplicate HNSW** on each; no attraction embeddings |
| **Security advisors** | 70 | 🟡 | 80+ `function_search_path_mutable` WARN; no ERROR-level RLS gaps |
| **Edge functions (data paths)** | 75 | 🟡 | `ticket-*`, `chat-lead-capture` in mdeai tree; 47 total (many Phase 2+) |
| **Aggregate (data tasks)** | **76** | 🟡 | Ship with cleanup plan in `supabase-plan.md` |

---

## Live snapshot (2026-05-26)

| Metric | Value |
|---|---|
| Public tables | **100** |
| RLS enabled | **99/100** (only `spatial_ref_sys`) |
| Tables with ≥1 policy | **99/100** |
| Edge functions (active) | **47** |
| Auth profiles | **13** rows |
| Semantic RPCs | `semantic_search_*`, `hybrid_search_*` (listings, events, restaurants); `get_anonymous_order` |

### Row counts — load-bearing entities

| Table | Rows | MVP use |
|---|---:|---|
| `profiles` | 13 | Users |
| `apartments` | 44 (44 active) | Camila `/rentals` |
| `listing_embeddings` | 44 | Rental semantic search |
| `events` | 49 (49 publishable*) | Roberto + discovery |
| `event_embeddings` | 43 | Event semantic search |
| `event_venues` | 7 | Host venue spine |
| `event_tickets` | 4 | Checkout tiers |
| `event_orders` | 35 | Andrés wallet |
| `event_attendees` | 39 | QR wallet |
| `restaurants` | 44 (44 `google_place_id`) | Concierge restaurants |
| `restaurant_embeddings` | 43 | Restaurant semantic search |
| `tourist_destinations` | 23 | Attractions |
| `trips` | 2 | Trip dashboard |
| `trip_items` | 4 | Itinerary |
| `saved_places` | 0 | Collections MVP empty |
| `collections` | 0 | Saved lists empty |
| `leads` | 11 | Rental CRM |
| `place_details_cache` | 45 (45 valid) | Detail panels |
| `places_search_cache` | 33 | Search cost control |
| `mastra_messages` | 1009 | Agent observability |

\*Events counted with `status IN ('published','live') AND is_active = true`.

---

## Red flags · blockers · failure points

### P0 — blocks data tasks or MVP proof

| ID | Severity | Finding | Persona impact | Fix |
|---|---|---|---|---|
| **DATA-B1** | 🔴 Blocker | **`venue_booking_requests` table absent** (confirmed via `information_schema`) | Tourist cannot persist venue table-reservation requests; data-001 AC | Migration **M1** in supabase-plan |
| **DATA-B2** | 🔴 Blocker | **No café or nightclub catalog table** — only `restaurants` + ADK grounding | Sarah/Tourist nightlife queries have no curated anchors (data-003, data-005) | Migration **M2** `venue_anchors` OR seed-only JSON + cache (MVP-min) |
| **DATA-B3** | 🟡 Blocker | **`leads` has no anon INSERT policy** — only `authenticated` + `service_role` | Camila guest schedule-viewing depends on `chat-lead-capture` edge (`verify_jwt: false`) — direct client insert fails | Keep edge path; verify AUTH-004; do not open anon INSERT on `leads` |
| **DATA-B4** | 🟡 Blocker | **Missing index `apartments(price_daily)`** — `search-rentals` filters/orders on `price_daily` | Camila price sort does seq scan at scale | Migration **M3** partial index |
| **DATA-B5** | 🟡 Blocker | **Duplicate HNSW indexes** on all 3 embedding tables | Write amplification on re-embed; 2× storage | VEC-001 drop duplicates |

### P1 — performance / cost / correctness

| ID | Severity | Finding | Fix |
|---|---|---|---|
| **DATA-R1** | 🟠 Red flag | Duplicate **RLS policies** on embedding tables (legacy + `*_public_select` names) | Consolidate in maintenance migration |
| **DATA-R2** | 🟠 Red flag | **`idx_apartments_rental_search` uses `price_monthly`** but agent uses `price_daily` | Add composite index on `(neighborhood, bedrooms, price_daily) WHERE status='active'` |
| **DATA-R3** | 🟠 Red flag | **80+ functions** with mutable `search_path` (security advisor WARN) | Batch `SET search_path = public` on SECURITY DEFINER RPCs |
| **DATA-R4** | 🟠 Red flag | **Low inventory** — 44 apartments, 44 restaurants | Product risk for AI concierge; not a schema gap |
| **DATA-R5** | 🟡 | **`tourist_destinations` has no embedding table** | Phase B: `attraction_embeddings` or unified `semantic_embeddings` |
| **DATA-R6** | 🟡 | **`collections` / `saved_places` empty** — no `collection_items` table | MVP uses polymorphic `saved_places.location_type/location_id`; document contract in data-002 |
| **DATA-R7** | 🟡 | **`spatial_ref_sys` RLS off** | PostGIS system table — advisor noise only; optional read-only policy |
| **DATA-R8** | 🟡 | **47 edge functions** — sponsor/openclaw/postiz/contest dead weight Phase 1 | Freeze per plan/audit/04-supabase-audit.md |

### P2 — advanced / defer

| Finding | Notes |
|---|---|
| No `event_categories`, `event_hosts`, `event_qa`, `event_chat` | ADVANCED per prompt.md Step 2 |
| No `trip_days`, `itinerary_suggestions` | MVP uses `trip_items` timeline |
| No `route_cache`, `grounding_logs` unified | Partial: `grounding_quota_log`, `search_grounding_quota_log` exist — **`route_cache` → data-033** |
| No `semantic_embeddings` unified table | plan/vector/docs/vector-strategy.md Phase 2 |
| `approval_requests` empty | HITL infra provisioned; mdeapp uses CopilotKit renderAndWaitForResponse first |

---

## Domain audits

### 1. Users + auth (`profiles`, `user_roles`, `user_preferences`)

**Exists:** `profiles` (13), `user_roles` (3), `user_preferences` (0).

**Indexes (profiles):** `email` unique, `last_active_at`, `role` partial.

**RLS:** Own-profile SELECT/INSERT/UPDATE for `authenticated` only — no public profile browse (correct for MVP).

**Gaps:** None for CORE. AUTH-011 production checklist is ops, not schema.

**Failure point:** `profiles` FK to `auth.users` dropped per table comment — seed/dev convenience; production sign-up must still create matching rows.

---

### 2. Events + bookings

**Exists (MVP-complete — no new tables for CORE commerce):**

```text
events → event_venues, event_tickets → event_orders → event_attendees → event_check_ins
         event_promo_codes, event_order_refunds, event_taxes_and_fees, event_wait_list
```

**Indexes:** Strong coverage — `events_slug_uk`, `events_status_idx`, `idx_events_start_time`, `idx_events_active`, organizer indexes, FTS GIN. Orders: buyer, event, status, stripe PI, access_token unique.

**RLS:** `events` 11 policies (public published select + organizer/admin paths). `event_orders` buyer + organizer SELECT via `public` role (relies on RPC/token for anon — `get_anonymous_order` exists).

**Missing (MVP Phase 2 — data tasks):** `event_qa` (data-013), `event_live_updates` (data-014), `event_attendee_social` (data-015), AI approval columns on `events` (data-016), admin ops views (data-018).

**Missing (Post-MVP discovery):** `event_sources`, `raw_events`, scrape pipeline (data-017 / EVP-020).

**Missing (ADVANCED):** `event_categories`, `event_chat`, sponsor CRM tables (EVP-029 — `event_sponsors` exists empty).

**Edge functions (keep):** `ticket-checkout`, `ticket-payment-webhook`, `ticket-validate` (mdeai + legacy paths).

---

### 3. Real estate

**Exists:** `apartments`, `listing_embeddings`, `neighborhoods`, `leads`, `rental_applications`, `showings`, `landlord_*`, `rental_search_sessions`, `property_verifications`, `bookings`, `payments` — all RLS ✅.

**CORE verdict:** search + lead capture need **no new tables** (F17/F46/F47 done). Gaps are columns, indexes, and workflow wiring.

**Data quality:** 44/44 active apartments with lat/lng. No `google_place_id` on apartments (not required — unlike restaurants).

**Indexes present:** `idx_apartments_rental_search (neighborhood, bedrooms, price_monthly)`, GIST `location`, FTS, landlord/host FKs.

**Indexes missing → data-009 M3:**

```sql
-- Required for search-rentals.ts (filters .lte('price_daily') + .order('price_daily'))
CREATE INDEX CONCURRENTLY idx_apartments_price_daily_active
  ON public.apartments (price_daily)
  WHERE status = 'active' AND price_daily IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_apartments_rental_search_daily
  ON public.apartments (neighborhood, bedrooms, price_daily)
  WHERE status = 'active';
```

**Schema/workflow gaps → `tasks/data/tasks-data/`:**

| Gap | Task |
|---|---|
| Inventory + PRD map | **data-019** |
| `leads.apartment_id` missing (listing in metadata only) | **data-020** |
| `showings` never populated from schedule-viewing | **data-021** |
| Rental golden SQL pack | **data-023** |
| `apartments.neighborhood_id` FK missing | **data-022** |
| Booking/Stripe bridge on `bookings`/`payments` | **data-024** |
| Hermes `scoring_logs` / `market_snapshots` | **data-025** |

**RLS:** Public SELECT active apartments; admin/service paths. `leads` — authenticated insert own user only; **guest capture must use `chat-lead-capture`**.

**Semantic search:** RPCs `semantic_search_listings`, `hybrid_search_listings` confirmed.

---

### 4. Trips + itinerary

**Exists:** `trips`, `trip_items`, `conflict_resolutions`, `budget_tracking`, `saved_places`, `collections`, `bookings.trip_id`.

**RLS:** Trip ownership via `user_id = (SELECT auth.uid())`; `trip_items` INSERT `WITH CHECK` verifies parent trip ownership ✅.

**Indexes:** `idx_trips_user_id` (partial deleted_at), `idx_trip_items_trip`, `unique_trip_item (trip_id, item_type, source_id)`, date range index.

**Missing (MVP optional):** `trip_days` — defer; group by `start_at` in app (`itinerary-logic.ts`).

**Missing (MVP data tasks — `tasks/data/tasks-data/`):**

| Gap | Task |
|---|---|
| Inventory + golden SQL | **data-026**, **data-030** |
| Extend `item_type` CHECK + insert RPC | **data-027** |
| **`event_orders.trip_id` missing** | **data-029** |
| Paid ticket / showing → `trip_items` | **data-028** |
| `(trip_id, start_at)` index | **data-031** (P2) |
| `mastra_threads` trip lookup index | **data-032** (P2) |

**Failure point:** `trip_items.source_id` FK not enforced per type — app/RPC must validate entity exists.

---

### 5. Venues (café · restaurant · nightclub)

Per **data-001** / **data-002** three-kind contract:

| Kind | Catalog | Embeddings | Cache | Status |
|---|---|---|---|---|
| **Restaurant** | `restaurants` 44 rows, 100% `google_place_id` | `restaurant_embeddings` 43 | `place_details_cache` | 🟢 Ready for data-004 expansion |
| **Café** | None — ADK `intent:cafe` only | None | cache hits | 🟥 data-003 anchors needed |
| **Nightclub** | None — not shipped | None | overlap via cache | 🟥 data-005 anchors needed |

**Shared caches:** `places_search_cache` (33), `place_details_cache` (45 valid). **Service-role only** RLS on caches — correct (edge/app server writes).

**Missing tables:**

| Table | Purpose | Task |
|---|---|---|
| `venue_booking_requests` | Table reservation / venue inquiry (not ticket checkout) | CAF-008 / data-001 AC |
| `venue_anchors` (recommended) | Curated café/nightclub `place_id` + kind + neighborhood | data-003, data-005 |

**Note:** `event_venues` is for **Roberto's ticketed events**, not Tourist nightclub discovery — data-002 rule: nightclubs ≠ `events` rows.

---

### 6. Vectors + embeddings

| Table | Rows | HNSW indexes | Issue |
|---|---:|---|---|
| `listing_embeddings` | 44 | `listing_embeddings_hnsw` + `idx_listing_embeddings_hnsw` | **Duplicate** |
| `event_embeddings` | 43 | `event_embeddings_hnsw` + `idx_event_embeddings_hnsw` | **Duplicate** |
| `restaurant_embeddings` | 43 | `restaurant_embeddings_hnsw` + `idx_restaurant_embeddings_hnsw` | **Duplicate** |

Each table also has **6 RLS policies** (duplicate naming from migration layering).

**Missing:** Attraction/tourist embeddings; unified `semantic_embeddings` (ADVANCED).

---

### 7. Security + advisors summary

| Check | Result |
|---|---|
| RLS on all app tables | ✅ except `spatial_ref_sys` |
| Policies without RLS | ✅ none |
| Service-role in mdeapp/src | ✅ carve-out only per F13 |
| Places cache client exposure | ✅ service_role only |
| Embedding public read | ✅ intentional for semantic search |
| Security advisor ERRORs | **0** on RLS |
| Security advisor WARNs | **80+** `function_search_path_mutable` |
| Performance advisor | Review duplicate indexes (HNSW) — primary win |

---

## Existing vs missing — summary matrix

| Capability | Exists | Missing / action |
|---|---|---|
| User profiles + roles | ✅ | — |
| Event publish + tickets + orders | ✅ | ADVANCED social/QA tables |
| Rental search + embeddings | ✅ | `price_daily` index |
| Guest rental leads | ✅ via edge | No direct anon `leads` INSERT |
| Trips + items + conflicts | ✅ | `trip_days` (defer) |
| Saved places + collections | ✅ schema | Empty data; no `collection_items` |
| Restaurant catalog | ✅ | Seed expansion (data-004) |
| Café catalog | ❌ | `venue_anchors` or grounding-only MVP |
| Nightclub catalog | ❌ | data-005 |
| Venue booking requests | ❌ | **M1 migration** |
| Places cache | ✅ | data-007 after MAP-005, data-008 cron |
| Maps geo inventory | audit needed | **data-034** |
| Route cache | ❌ | **data-033** before MAP-011 |
| Attraction vectors | ❌ | Phase B |
| WhatsApp tables | ✅ schema, 0 rows | Phase 2 automation |

---

## Recommended immediate actions (data task order)

1. **data-001** — Mark inventory DONE using this audit + SQL evidence below.
2. **data-002** — Publish three-kind contract referencing this matrix.
3. **M1–M3 migrations** — See `tasks/data/supabase-plan.md`.
4. **VEC-001** — Drop duplicate HNSW indexes (CONCURRENTLY, off-peak).
5. **data-003/004/005** — Seeds (no schema except M2 if using `venue_anchors`).
6. **data-007/008** — Cache coverage + backfill cron.

---

## Evidence SQL (reproducible)

```sql
-- RLS gaps
SELECT c.relname, c.relrowsecurity, COUNT(p.policyname) AS policies
FROM pg_class c
LEFT JOIN pg_policies p ON p.tablename = c.relname AND p.schemaname = 'public'
WHERE c.relnamespace = 'public'::regnamespace AND c.relkind = 'r'
GROUP BY c.relname, c.relrowsecurity
HAVING c.relrowsecurity = false OR COUNT(p.policyname) = 0;

-- Missing venue tables
SELECT unnest(ARRAY['cafes','venue_booking_requests','venue_anchors','collection_items','trip_days']) AS expected
EXCEPT
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Duplicate HNSW
SELECT tablename, indexname FROM pg_indexes
WHERE schemaname = 'public' AND indexdef ILIKE '%hnsw%'
ORDER BY tablename, indexname;

-- Catalog coverage
SELECT COUNT(*) AS restaurants, COUNT(*) FILTER (WHERE google_place_id IS NOT NULL) AS with_place_id FROM restaurants;
SELECT COUNT(*) AS apartments, COUNT(*) FILTER (WHERE status = 'active') AS active FROM apartments;
SELECT COUNT(*) AS place_details, COUNT(*) FILTER (WHERE expires_at > now()) AS valid FROM place_details_cache;
```

---

## Cross-references

- Prior forensic audit: [`plan/audit/04-supabase-audit.md`](../../plan/audit/04-supabase-audit.md) (2026-05-19; table count differed — live now **100** public tables)
- Implementation plan: [`tasks/data/supabase-plan.md`](./supabase-plan.md)
- Data tasks: [`tasks/data/tasks/`](./tasks/)
- Events MVP: [`tasks/events/`](../events/)

---

*Audit complete — READ-ONLY. No migrations applied.*
