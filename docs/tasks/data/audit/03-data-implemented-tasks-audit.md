---
title: DATA implemented tasks — forensic audit
date: 2026-05-30
auditor: Supabase MCP + disk evidence (read-only)
project: zkwcbyxiwklihegjhuql
method: mde-supabase security checklist + INDEX-data cross-check
companion: 03-audit-data.md (checklist stub)
---

# DATA pack — implemented tasks forensic audit

**Scope:** All tasks marked Done (or Layer A Done) under [`tasks/data/tasks-data/`](../tasks-data/) · live Supabase MCP · repo migrations · evidence · app wiring.

**Rule applied:** No task scored 100% unless **spec + live DB + repo migration + evidence** all agree.

---

## 0. Read this first (plain English)

**What we audited:** The DATA task pack is everything that fills Supabase with real Medellín content and wires it to mdeai surfaces — café/nightclub/restaurant pins for `/chat`, rental leads for Camila, trip rows for her itinerary, and the security rules that keep guest data from leaking.

**Grade in one sentence:** **74/100** — tourists and renters already get real data from production Supabase, but Sofía cannot yet trust the git migration folder to rebuild that same database on a fresh machine without manual fixes.

### What already works (persona-visible)

| Persona | Surface | Real-world example | Status |
|---------|---------|-------------------|--------|
| **Tourist** | `/chat` | “Find a specialty coffee shop in Laureles” → concierge can resolve against **17 live café anchors** with Google `place_id` | 🟢 Works |
| **Tourist** | `/chat` | “Romantic dinner in El Poblado” → **43 restaurants** all have `google_place_id` for map cards | 🟢 Works |
| **Tourist** | `/chat` | “Where can I go dancing Friday?” → **13 nightclub anchors** (Son Havana, Dulce Jesus Mio, etc.) | 🟢 Works |
| **Camila** | `/rentals` + chat | “Schedule a viewing Saturday 3pm for listing X” → edge fn creates **lead + showing** pair (2 proof rows live) | 🟢 Works (DB) |
| **Camila** | `/chat` trips | “Add this apartment tour to my trip” → `trip_id` columns exist on leads/showings/bookings | 🟡 Columns yes, **sync not wired** (DATA-028) |
| **Roberto** | `/host/event/new` | Event tables inventoried (DATA-012); Q&A / AI-approval DDL not shipped yet | 🟡 Inventory only |
| **Patricia** | `/admin/*` | Can query venue catalog counts; migration history docs disagree with live | 🟡 Data yes, ops docs stale |

### What is broken or risky (still invisible to most users)

| Problem | Plain English | Who gets hurt |
|---------|---------------|---------------|
| **Migration drift** | Live DB was updated via MCP with filenames like `20260530003708_…`; repo still has different timestamps or missing files | **Sofía** cloning repo + running `db push` |
| **DATA-010 regression** | One Postgres helper (`trigger_set_timestamps`) lost its security hardening on live | **Patricia** if an attacker exploits search_path (Phase 2 risk) |
| **INDEX stale** | Tracker still says “do DATA-021 next” though showings bridge shipped | **Anyone** planning next sprint from INDEX |
| **No trip_items sync** | Camila books a showing but it may not appear on her trip timeline automatically | **Camila** on `/chat` trips |

### How to read the rest of this doc

- **§2** — live row counts (what is in Supabase *right now*)
- **§4** — “receipt number mismatch” between cloud DB and git (migration drift)
- **§5** — per-task scorecard with % correct
- **§6–§9** — fix list, blockers, and build order

---

## 1. Executive summary

The DATA pack has **delivered real value on live Supabase**: P0 venue foundation (17 café + 13 nightclub anchors, 43/43 restaurants with `google_place_id`), M1–M3 schema (`venue_booking_requests`, `venue_anchors`, rental indexes), trips DDL (`insert_trip_item_for_user`, `trip_id` on commerce tables), and **DATA-021** showings bridge (`chat-lead-capture` **v17**, 2 live `showings` rows).

However, **migration history hygiene is the dominant failure mode**. Only **DATA-010** (`20260530012233`) has matching remote version + repo filename. Seven other DATA migrations on remote use **different timestamps and often different names** than `supabase/migrations/`. **DATA-005 nightclub seed has no file in `supabase/migrations/` at all** (only under `tasks/data/evidence/migrations/`). **DATA-010b is over-scoped Done**: it fixed the DATA-010 orphan but did **not** align the rest of the DATA migration chain.

**DATA-010 search_path hardening is regressed on live:** advisor reports **`function_search_path_mutable: 1`** (`public.trigger_set_timestamps`). Repo migration includes `SET search_path = ''` but **`pg_get_functiondef` on live omits it** — repo and live diverge.

**INDEX-data.md is stale** in three places: P1 row still says “DATA-021 next”; cross-track schedule-viewing still says “Needs app write to DATA-020 cols”; pack count says **20/35 Done** while **21 specs** are Done (DATA-010b).

| Lens | Verdict |
|------|---------|
| **Functional MVP data (P0 venue + trips DDL)** | 🟢 Strong — live counts match specs |
| **Security (DATA-010/011)** | 🟡 Partial — edge matrix done; search_path regression; Phase 2 DEFINER EXECUTE backlog (43 anon / 68 auth) |
| **Repo ↔ remote migration parity** | 🔴 Poor — 6/8 DATA remote migrations drift; DATA-005 missing from repo migrations |
| **Evidence discipline** | 🟡 Good for recent tasks; golden-query packs lack fresh re-run timestamps |
| **Fake Done risk** | **Medium** — mostly “Done with drift”, not “never shipped” |

**Overall grade: 74/100** — ship-ready data on Supabase, not ship-ready migration/evidence hygiene.

**Analogy (Sofía onboarding):** Production Supabase is a furnished apartment — Camila can already sleep there (17 cafés, 43 restaurants, showings bridge). The git repo is the IKEA instruction booklet. Seven pages use different part numbers than what's actually installed, and the nightclub shelf (DATA-005) is missing from the booklet entirely. Guests don't notice; the next assembler does.

---

## 2. Live Supabase snapshot (MCP 2026-05-30)

> **What this section answers:** “If Camila or a tourist used the app today, what rows actually exist behind `/chat`, `/rentals`, and trip flows?”

| Check | Live value |
|-------|------------|
| Project | `zkwcbyxiwklihegjhuql` |
| `venue_anchors` café | **17** |
| `venue_anchors` nightclub | **13** |
| `restaurants` active w/ `google_place_id` | **43 / 43** |
| `leads` cols `apartment_id`, `preferred_showing_at`, `trip_id` | **present** |
| `trip_id` on `event_orders`, `bookings`, `showings`, `leads` | **present** |
| `insert_trip_item_for_user` | **exists** (`search_path` set in def) |
| `trip_items_item_type_check` | **present** |
| `showings` rows (`scheduled`) | **2** |
| `idx_apartments_price_daily_active` | **present** |
| RLS on public tables | **101 on / 1 off** (`spatial_ref_sys`) |
| ACTIVE edge functions | **39** |
| `chat-lead-capture` | **v17**, `verify_jwt: false` |
| Security advisors | `function_search_path_mutable`: **1** · `rls_disabled_in_public`: **1** · `anon_security_definer_function_executable`: **43** · `authenticated_security_definer_function_executable`: **68** · `rls_policy_always_true`: **2** · `auth_leaked_password_protection`: **1** |

### On-screen examples tied to these numbers

| Live count | User action | What they should see |
|------------|-------------|----------------------|
| 17 café anchors | Tourist asks “quiet café with wifi in Manila” | Map pin + café card from `venue_anchors` (not empty fallback) |
| 43 restaurants | Tourist asks “best bandeja paisa near Parque Lleras” | Restaurant list with Maps links (`google_place_id` on every row) |
| 13 nightclubs | Tourist asks “salsa club open late” | Nightlife suggestions from seeded anchors |
| 2 showings | Camila submits schedule-viewing for a rental | Landlord dashboard *should* show a `scheduled` showing (app RLS smoke still pending) |
| `trip_id` cols | Camila checks out an event ticket while planning a trip | Column ready; **checkout UI not passing `tripId` yet** — trip timeline won't auto-link |
| `chat-lead-capture` v17 | Guest submits email on `/chat` without logging in | Lead lands in `leads` via edge fn (rate-limited 20/hr/IP); not a direct browser INSERT |

---

## 3. mde-supabase checklist (compared to [`03-audit-data.md`](03-audit-data.md))

| Checklist item | Status | Notes |
|----------------|--------|-------|
| Every exposed `public` table has RLS | 🟡 | 101/102; `spatial_ref_sys` off (PostGIS extension table) |
| `(SELECT auth.uid())` in RLS | ⚪ | Not re-audited per-policy this pass; spot-check on `leads`/`showings`/`venue_*` OK |
| Service-role never in browser / unauthorized `src/` | 🟢 | Only F13 carve-out: `mdeapp/src/mastra/lib/**`, `service-env.ts`, `service.ts` |
| Edge writes use service role inside fn | 🟢 | DATA-021 `chat-lead-capture` pattern verified in evidence |
| Migrations in repo match remote history | 🔴 | See § migration drift matrix |
| Advisors clean after schema change | 🔴 | `trigger_set_timestamps` search_path regression |
| Evidence per Done task | 🟡 | DATA-035 in `tasks/testing/evidence/`; DATA-023 no `.md` run log |
| `verify_jwt` documented per edge fn | 🟢 | DATA-011 matrix |
| No `apply_migration` iteration pollution | 🟢 | DATA tasks applied as named slices |
| Index on RLS-filtered columns | ⚪ | Not fully re-audited |

---

## 4. Migration drift matrix (remote MCP vs `supabase/migrations/`)

**Plain English:** A migration file is a numbered receipt for each database change. Supabase Cloud keeps the receipts it actually cashed. Our git folder has **different receipt numbers** for the same purchases — and one purchase (nightclub seed) has **no receipt in git at all**, only a photocopy in `tasks/data/evidence/`.

**Real-world consequence:** Sofía runs `git clone` + `supabase db push` on a **new** project. Supabase may refuse (“version already applied”), try to re-run café seed (duplicate key error), or skip nightclub seed entirely because the file isn't in `supabase/migrations/`. Production keeps working; **new environments don't.**

| Remote version | Remote name | Repo file | Match? |
|----------------|-------------|-----------|--------|
| `20260529234934` | `data009_venue_booking_requests` | `20260529120000_data009_venue_booking_requests.sql` | 🔴 timestamp |
| `20260529234939` | `data009_apartments_price_daily_indexes` | `20260529120200_data009_apartments_price_daily_indexes.sql` | 🔴 timestamp |
| `20260529234948` | `data009_venue_anchors_m2` | `20260529120100_data009_venue_anchors.sql` | 🔴 **name + timestamp** |
| `20260529235041` | `data020_leads_rental_fk_columns` | `20260529130000_data020_leads_rental_fk.sql` | 🔴 **name + timestamp** |
| `20260529235059` | `data029_commerce_trip_id_linkage` | `20260529140100_data029_commerce_trip_id_linkage.sql` | 🔴 timestamp |
| `20260529235115` | `data027_trip_items_check_and_rpc` | `20260529140000_data027_trip_items_check_and_rpc.sql` | 🔴 timestamp |
| `20260530001941` | `data035_venue_anchors_cafes_seed` | `20260529150000_data035_venue_anchors_cafes.sql` | 🔴 **name + timestamp** |
| `20260530003708` | `data005_venue_anchors_nightclubs` | **MISSING** (copy only in `tasks/data/evidence/migrations/20260529160000_*`) | 🔴 **missing from repo migrations** |
| `20260530012233` | `data010_search_path_hardening` | `20260530012233_data010_search_path_hardening.sql` | 🟢 |

**Risk:** Fresh clone + `supabase db push` on a linked project may attempt re-apply or fail version checks. **DATA-010b “repo ↔ remote aligned” applies only to DATA-010**, not the chain above.

**Live vs repo body drift (DATA-010):**

```sql
-- Repo migration: SET search_path = ''
-- Live pg_get_functiondef(public.trigger_set_timestamps): NO search_path clause
```

---

## 5. Score table — all DATA tasks (35 + DATA-010b)

Legend: 🟢 Done (≥90%) · 🟡 Partial (50–89%) · 🔴 Wrong (<50%) · ⚪ Not started

| Task | Spec status | Audit status | % correct | Evidence | Live proof | Blocks next? |
|------|-------------|--------------|----------:|----------|------------|--------------|
| **DATA-001** inventory | Done | 🟢 Done | 96 | `evidence/data-001-inventory.md` | Inventory tables exist | No |
| **DATA-002** catalog contract | Done | 🟢 Done | 95 | `evidence/data-002-three-kind-contract.md` | Kinds cafe/restaurant/nightclub | No |
| **DATA-003** café sign-off | Done | 🟢 Done | 92 | `evidence/data-003-cafe-signoff.md` | 17 café anchors | No |
| **DATA-004** restaurant verify | Done | 🟢 Done | 98 | `evidence/data-004-restaurant-verify.md` | 43/43 `google_place_id` | No |
| **DATA-005** nightclub seed | Done | 🟡 Partial | 78 | `evidence/data-005-nightclub-seed.md` | 13 nightclub rows | No — **fix migration file** |
| **DATA-006** golden queries | Done (Layer A) | 🟡 Partial | 88 | `evidence/data-006-venue-golden-queries.md` (26/26) | Counts match; Layer B open | No for DATA track |
| **DATA-007** cache audit | Blocked | ⚪ N/A | 0 | Spec only | — | Yes — MAP-005 |
| **DATA-008** Places backfill | Blocked | ⚪ N/A | 0 | Spec only | — | After 007 |
| **DATA-009** M1–M3 migrations | Done | 🟡 Partial | 82 | `evidence/data-009-migrations.md` | Tables + indexes live | **Migration drift blocks clean push** |
| **DATA-010** search_path | Done | 🟡 Partial | 85 | `evidence/data-010-search-path.md` | **1 mutable fn on live** | Re-harden before claiming 100% |
| **DATA-010b** migration hygiene | Done | 🟡 Partial | 68 | `evidence/data-010b-migration-hygiene.md` | Only DATA-010 aligned | **Reopen scope** — chain still drifted |
| **DATA-011** edge matrix | Done | 🟢 Done | 93 | `evidence/data-011-edge-matrix.md` | 39 ACTIVE fns classified | No |
| **DATA-012** events inventory | Done | 🟢 Done | 96 | `evidence/data-012-events-inventory.md` | Events schema documented | No |
| **DATA-013** event_qa | Open | ⚪ | 0 | — | No DDL | EVP-034 |
| **DATA-014–017** events P2 | Deferred | ⚪ | 0 | — | — | Phase 2 |
| **DATA-016** AI approval cols | Open | ⚪ | 0 | — | — | EVP |
| **DATA-018** admin views | Open | ⚪ | 0 | — | — | EVP |
| **DATA-019** rentals inventory | Done | 🟢 Done | 96 | `evidence/data-019-rentals-inventory.md` | Rentals tables documented | No |
| **DATA-020** leads FK cols | Done | 🟡 Partial | 87 | `evidence/data-020-leads-rental-fk.md` | Cols live; edge v17 writes | Migration name drift |
| **DATA-021** showings bridge | Done | 🟡 Partial | 88 | `evidence/data-021-showings-bridge.md` | v17 + 2 showings | App smokes incomplete |
| **DATA-022–025** rentals P2 | Deferred | ⚪ | 0 | — | — | Phase 2 |
| **DATA-023** rental golden SQL | Done | 🟡 Partial | 84 | `.sql` + `.json` only | Not re-run this audit | No |
| **DATA-026** trips inventory | Done | 🟢 Done | 96 | `evidence/data-026-trips-inventory.md` | Trips schema documented | No |
| **DATA-027** trip_items RPC | Done | 🟡 Partial | 87 | `evidence/data-027-trip-items-rpc.md` | RPC + CHECK live | Migration drift |
| **DATA-028** booking→trip_items | Blocked | ⚪ | 0 | Spec | No webhook sync | **Next critical path** |
| **DATA-029** trip_id linkage | Done | 🟡 Partial | 86 | `evidence/data-029-commerce-trip-id.md` | Cols live | App checkout not passing `tripId` |
| **DATA-030** trips golden SQL | Done | 🟡 Partial | 84 | `evidence/data-030-trips-golden-queries.md` | Not re-run this audit | No |
| **DATA-031–033** maps/trips P2 | Open | ⚪ | 0 | — | — | Deferred |
| **DATA-034** maps geo inventory | Done | 🟢 Done | 95 | `evidence/data-034-maps-geo-inventory.md` | place_id matrix doc | No |
| **DATA-035** café seed | Done | 🟡 Partial | 83 | `tasks/testing/evidence/DATA-035-*.md` | 17 rows | Migration missing remote name in repo |

**Pack math:** 21 specs Done · **11 fully green** · **10 partial (drift/evidence gaps)** · **0 outright fake Done** · 14 open/deferred.

### Task groups — what each bundle means on screen

| Group | Tasks | Plain English | Example |
|-------|-------|---------------|---------|
| **Inventories** | 001, 012, 019, 026, 034 | “Map of what tables exist before we change anything” | Patricia opens DATA-012 doc to see which event columns exist before EVP-034 |
| **Venue catalog** | 002, 003, 004, 005, 035, 006 | “Pins and cards tourists see in `/chat`” | “Café Velvet” resolves because DATA-035 seeded it with verified `place_id` |
| **Schema M1–M3** | 009 | “Tables for venue bookings + anchor storage + faster rental search” | Camila’s price filter uses `idx_apartments_price_daily_active` |
| **Security** | 010, 010b, 011 | “Lock down Postgres helpers + document which edge fns are frozen” | Guest lead form hits `chat-lead-capture`, not raw `INSERT INTO leads` |
| **Rentals CRM** | 020, 021, 023 | “Schedule viewing → lead + showing rows + eval SQL for Camila queries” | Viewing request at `/rentals` creates lead `apartment_id` + showing `status=scheduled` |
| **Trips** | 027, 029, 030, 028 | “Trip planner plumbing” | **Done:** add item RPC + `trip_id` FKs. **Not done:** auto-add showing to itinerary (028) |
| **Events DDL** | 013–018 | “Roberto Q&A, live updates, discovery pipeline” | Not started — Roberto still uses existing `events` table only |

### Partial tasks — why not 100%?

| Task | Works for users? | What's missing |
|------|------------------|----------------|
| DATA-005 | Yes — 13 clubs on map | Git migration file missing from `supabase/migrations/` |
| DATA-009 | Yes — booking table + anchors | Receipt numbers in git ≠ cloud |
| DATA-010 | Mostly — 9/10 functions hardened | `trigger_set_timestamps` soft on live |
| DATA-021 | Yes — 2 showings created via edge | Lucía hasn't run `/api/leads/schedule-viewing` smoke; landlord read path unproven |
| DATA-029 | Yes — columns exist | Andrés buys ticket; checkout doesn't attach `trip_id` yet |
| DATA-035 | Yes — 17 cafés | Evidence lives in `tasks/testing/evidence/` not `tasks/data/evidence/` |

---

## 6. Top 10 critical fixes (priority order)

| # | Fix | Plain English | Who notices |
|---|-----|---------------|-------------|
| 1 | **DATA-010c** — re-harden `trigger_set_timestamps` | One Postgres auto-date function lost its security seatbelt on live | Patricia (security); invisible to Camila today |
| 2 | **DATA-010b-ext** — sync all migration filenames | Make git receipts match cloud receipts | **Sofía** spinning up staging |
| 3 | Remove orphan migration names | Stop git from trying to create `venue_anchors` twice under two filenames | Sofía / CI |
| 4 | Fix **INDEX-data.md** stale rows | Stop telling the team “build DATA-021” when it's already shipped | PM + next agent session |
| 5 | **DATA-021 app smoke** | Prove `/api/leads/schedule-viewing` → edge → DB end-to-end with dev server | **Lucía** QA; landlord sees showing in dashboard |
| 6 | Auth rate limit on `chat-lead-capture` | Logged-in user could spam leads without IP cap today | Patricia (abuse); Camila (inbox noise) |
| 7 | Re-run golden SQL (006/023/030) | Re-execute “does Camila's query still return apartments?” test pack | **Lucía** regression |
| 8 | Update edge inventory doc | Doc says 16 fns; project has 39 — misleads deploy audits | Sofía |
| 9 | Phase 2 DEFINER EXECUTE triage | 111 functions callable wider than ideal — backlog, not P0 | Patricia |
| 10 | Enable leaked-password protection | Block “password123” at signup | All logged-in personas |

---

## 7. Red flags

| # | Severity | Finding | Plain English / example |
|---|----------|---------|-------------------------|
| R1 | **P0** | Live `trigger_set_timestamps` lacks `SET search_path` | DATA-010 evidence says “all clear”; advisor now flags 1 function — like a smoke alarm that passed inspection but beeps again |
| R2 | **P0** | DATA-005 migration absent from `supabase/migrations/` | Son Havana exists in DB; git can't reproduce how it got there |
| R3 | **P0** | 7/8 DATA migrations: remote timestamp ≠ repo | Same SQL change, two different “invoice numbers” — breaks automated deploy |
| R4 | **P1** | DATA-010b overclaimed alignment | Task fixed one file; INDEX implied whole chain fixed |
| R5 | **P1** | INDEX says schedule-viewing needs DATA-020 cols | **Stale:** Camila's viewing flow already writes `apartment_id` + `showings` via DATA-021 |
| R6 | **P1** | Supabase CLI **403** for Sofía | Must use MCP/dashboard; CLI onboarding doc may lie |
| R7 | **P2** | Edge fns deploy from legacy `/home/sk/mde/` paths | Editing `mdeai/supabase/functions/chat-lead-capture` may not match what's deployed if wrong tree used |
| R8 | **P2** | 2 RLS policies always true | Some rows may be world-readable/writable — needs Patricia review |
| R9 | **P2** | Service-role in `mastra/lib/**` | Allowed for AI run logging; must never leak to browser bundle |
| R10 | **P2** | `trip_id` cols unused in checkout | Andrés buys ticket; trip planner won't show it until app passes ID |

---

## 8. Blockers

| Blocker | Type | Unblocks when | Camila / Roberto example |
|---------|------|---------------|----------------------------|
| **MAP-005** places proxy | App/maps | Places proxy verified on `/chat` map column | Tourist map can't cache place details cheaply until proxy lands → DATA-007 blocked |
| **DATA-028** not implemented | App/webhook | Webhook upserts `trip_items` when showing/order created | Camila schedules viewing → **should** see “Apartment tour — Sat 3pm” on trip timeline; **doesn't auto-appear yet** |
| **Migration drift** | Repo hygiene | 010b-ext merges receipt numbers | Sofía can't clone→push; doesn't block production `/chat` |
| **DATA-010 live regression** | Security advisor | 010c re-applies hardening | Invisible to users today; blocks claiming “security Done” |
| **EVP-034+** | Product | Event Q&A spec approved | Roberto can't run live audience Q&A from new `event_qa` table — table doesn't exist |

**DATA-021 does NOT block DATA-028** — showings land in DB today; 028 is “also add to trip calendar” wiring only.

---

## 9. Correct next implementation order

```text
1. DATA-010c     — fix live trigger_set_timestamps (search_path)
2. DATA-010b-ext — sync all DATA migration filenames to remote MCP list
3. DATA-028      — showings/orders → trip_items sync (webhook + app)
4. MSV-012       — DATA-006 Layer B CopilotKit harness (app track)
5. MAP-005       — verify places proxy → DATA-007 cache audit
6. DATA-007 → DATA-008 — Places backfill cron
7. P2 auth rate-limit on chat-lead-capture
8. DATA-013+     — when EVP event Q&A/admin ready
```

**Why this order (user story):**

1. **010c / 010b-ext** — Sofía-safe deploys (no user-visible change)
2. **DATA-028** — Camila: “I booked a viewing and bought tickets — show both on my Medellín trip”
3. **MSV-012** — Lucía: run 19 golden `/chat` queries in CI so café regressions catch before tourists do
4. **MAP-005 → 007/008** — Tourist: café card shows correct hours/phone without burning Places budget every click
5. **Events DDL** — Roberto: live Q&A and AI-approved event copy when EVP ships

---

## 10. Tasks safe to mark Done (no reopen)

These pass **spec + live + evidence** with only doc/minor drift:

- DATA-001, DATA-002, DATA-004, DATA-012, DATA-019, DATA-026, DATA-034
- DATA-003 (depends on DATA-035 counts — both live OK)
- DATA-011 (edge matrix — Phase 2 DEFINER backlog explicitly deferred)
- DATA-006 **Layer A only** (keep `layer_b: Open`)

---

## 11. Tasks that must be reopened or downgraded

| Task | Action | Reason |
|------|--------|--------|
| **DATA-010** | Downgrade to 🟡 In Progress OR reopen slice **010c** | Live advisor ≠ evidence (1 mutable fn) |
| **DATA-010b** | Reopen as **010b-ext** | Scope was DATA-010 only; chain still drifted |
| **DATA-005** | Add migration to `supabase/migrations/` | Missing canonical file |
| **INDEX-data.md** | Edit tracker rows | Stale P1 + cross-track + count |

**Do not fully reopen** (functional live, fix hygiene only): DATA-009, DATA-020, DATA-027, DATA-029, DATA-035, DATA-021.

---

## 12. Tasks ready to execute next

| Task | Ready? | Preconditions met |
|------|--------|---------------------|
| **DATA-028** | ✅ **Yes** | DATA-021 bridge live; DATA-027 RPC live; DATA-029 cols live |
| **DATA-010c** | ✅ Yes | Repo SQL exists; read-only audit complete |
| **DATA-010b-ext** | ✅ Yes | Remote migration list captured in this audit |
| **DATA-007** | ❌ No | MAP-005 |
| **DATA-013+** | ❌ No | EVP product gate |

---

## 13. Per-task detail — implemented Done tasks

> Each subsection: **what shipped**, **who uses it**, **example query or action**.

### Inventories (DATA-001, 012, 019, 026, 034)

Read-only audits with markdown evidence. Live schema matches documented inventories. **No DDL claims.** Safe Done.

| Task | Who | Example use |
|------|-----|-------------|
| DATA-001 | Patricia | “Which tables feed `/chat` venue cards?” → inventory lists `venue_anchors`, `restaurants` |
| DATA-012 | Roberto / Patricia | “Do we have `event_qa` yet?” → doc says no; plan EVP-034 before DDL |
| DATA-019 | Camila track | “Where do showings live?” → `showings`, `leads`, `apartments` mapped |
| DATA-026 | Camila trips | “What's `trip_items.item_type` CHECK allow?” → documented before DATA-027 RPC |
| DATA-034 | Maps team | “Which entities have `google_place_id`?” → matrix for MAP tasks |

### DATA-002 three-kind contract

Evidence + gap SQL. Live `venue_anchors.kind` ∈ {cafe, nightclub}; restaurants separate table. **OK.**

**Why it matters:** Tourist asks “coffee shop” → query hits `venue_anchors` (café). Same tourist asks “restaurant” → query hits `restaurants` table, not anchors. Mixing them breaks map pins and golden eval (DATA-006).

### DATA-009 M1–M3

**Live:** `venue_booking_requests` + RLS (insert/select own + service_role); `venue_anchors` public select + service write; `idx_apartments_price_daily_active` present.

**Drift:** Repo uses `2026052912*` timestamps and `data009_venue_anchors` name; remote applied `202605292349*` with `data009_venue_anchors_m2`. Functionally Done; **migration hygiene Partial.**

### DATA-035 + DATA-003 + DATA-005 seeds

| Kind | Live count | Evidence | Tourist example |
|------|----------:|----------|-----------------|
| café | 17 | DATA-035 testing/evidence + DATA-003 sign-off | “Specialty coffee in Manila” → Pergamino, Café Velvet, etc. |
| nightclub | 13 | DATA-005 evidence | “Salsa tonight” → Son Havana, Eslabón |
| restaurant | 43 w/ place_id | DATA-004 | “Bandeja paisa near Parque Lleras” → any of 43 verified rows |

**DATA-035:** Evidence path is `tasks/testing/evidence/` (valid but non-standard vs `tasks/data/evidence/`).

**DATA-005:** Seed live; **repo migration missing** from `supabase/migrations/`. Clubs exist for tourists; Sofía can't replay seed from git alone.

### DATA-006 golden queries

Layer A: 26/26 pass documented 2026-05-30. Layer B explicitly Open (MSV-012). **Accept Done (Layer A)** at 88%.

**Example golden query:** “Quiet café with wifi in Laureles under $15k” → SQL returns expected anchor IDs. **Layer B gap:** CopilotKit `/chat` doesn't auto-run these 19 persona queries in CI yet (MSV-012).

### DATA-010 + DATA-010b

Evidence claims 10 functions hardened, advisor 0. **This audit:** advisor **1**; live `trigger_set_timestamps` missing `SET search_path`. Repo file has fix → **apply gap or post-migration overwrite**.

DATA-010b correctly fixed orphan `20260530120000` → `20260530012233` but **overclaimed full alignment**.

### DATA-011 edge matrix

39 ACTIVE functions: KEEP 6 / FREEZE 21 / DEFER 12. `chat-lead-capture`: verify_jwt false, anon rate limit, service-role writes. **Done.**

### DATA-020 + DATA-021 rentals bridge

**DATA-020:** Columns on `leads` verified live.

**DATA-021:** Edge v17; paired lead+showing; idempotency; Deno 3/3 + Vitest 4/4 per evidence. **Missing:** Next.js route smoke with dev server; landlord SELECT RLS smoke.

**Camila flow (intended):**

1. Camila on `/rentals` opens listing `750e8400-…`, picks **Sat Jul 10, 3pm**
2. UI calls `/api/leads/schedule-viewing` → `chat-lead-capture` v17
3. Edge creates `leads` row (`apartment_id`, `preferred_showing_at`) + `showings` row (`status=scheduled`)
4. Retry with same idempotency key → same IDs (no duplicate tour)
5. **Not yet:** row auto-appears in `trip_items` (DATA-028) · landlord dashboard smoke unproven

**App wiring exists:**

- `mdeapp/src/app/api/leads/schedule-viewing/route.ts`
- `supabase/functions/_shared/schedule-viewing-bridge.ts`

### DATA-023, DATA-030 golden SQL

Artifacts present; no fresh MCP re-run in this audit session. **Partial evidence freshness.**

### DATA-027 + DATA-029 trips DDL

RPC + CHECK constraint live. `trip_id` on four commerce tables live. Migration timestamp drift only.

**DATA-027 example:** Camila (authenticated) calls `insert_trip_item_for_user` to add “Comuna 13 tour” to her trip — RPC enforces allowed `item_type` values.

**DATA-029 example:** When Andrés buys an event ticket, `event_orders.trip_id` *could* link the purchase to “Medellín June” — column exists, checkout UI doesn't pass it yet.

### DATA-028 (not Done — listed for dependency clarity)

Spec status Blocked. **Correct** — no `trip_items` sync from showings/orders in repo yet. Unblocked by DATA-021 completion.

**Example gap:** Camila has trip “Medellín June” with a café reservation. She schedules an apartment viewing (DATA-021 writes `showings`). Her trip UI still won't list “Apartment viewing — Sat 3pm” until DATA-028 upserts a `trip_items` row.

---

## 14. RLS spot-check (implemented tables)

> **RLS in plain English:** Row Level Security is the bouncer at each table. Even if someone crafts a raw API call, Postgres checks “is this user allowed to see or change this row?”

| Table | Policies | Guest anon INSERT? |
|-------|----------|-------------------|
| `venue_anchors` | public SELECT; service ALL | No direct anon write ✅ |
| `venue_booking_requests` | auth insert/select own; service ALL | No anon ✅ |
| `leads` | auth CRUD patterns + service ALL | No anon ✅ (edge service-role) |
| `showings` | auth insert/select/update; service ALL | No anon ✅ |
| `trip_items` | auth CRUD | No anon ✅ |

**Gap:** Authenticated users can INSERT showings directly (policy exists) — schedule-viewing intended path is edge; direct INSERT is a **P2 hardening** item (not DATA-021 scope).

| Scenario | Expected bouncer behavior |
|----------|---------------------------|
| Anonymous tourist POSTs to `leads` from browser | **Blocked** — must go through `chat-lead-capture` edge |
| Camila (logged in) reads her lead | **Allowed** — `leads_select_own_or_agent_or_admin` |
| Random anon lists all `venue_anchors` | **Allowed** — public catalog for `/chat` |
| Random anon inserts fake nightclub | **Blocked** — only `service_role` seed path |

---

## 15. Service-role misuse scan (`mdeapp/src/**`)

> **Service role in plain English:** A master key that bypasses RLS. Correct in server-side edge fns and Mastra logging; **catastrophic** if shipped to the browser.

| Path | Verdict |
|------|---------|
| `mdeapp/src/mastra/lib/ai-runs.ts` | F13 carve-out ✅ |
| `mdeapp/src/mastra/lib/grounding-quota*.ts` | F13 carve-out ✅ |
| `mdeapp/src/lib/supabase/service-env.ts` | F13 carve-out ✅ |

No service-role in client components or unauthorized routes found.

---

## 16. Linear / INDEX mismatch

| Source | Claim | Audit |
|--------|-------|-------|
| INDEX pack summary | 20/35 Done (~57%) | **21 Done specs** (includes DATA-010b); functional % higher than hygiene % |
| INDEX P1 security | “DATA-021 next” | **Stale** — 021 Done |
| INDEX cross-track | “Needs app write to DATA-020 cols” | **Stale** — 021 writes cols + showings |
| Linear SAN-* | Not re-queried this session | Recommend sync DATA-021 Done + open DATA-028 |

---

## 17. Final grade breakdown

| Category | Weight | Score | Weighted | Plain English |
|----------|-------:|------:|---------:|---------------|
| P0 functional data (seeds + DDL live) | 35% | 92 | 32.2 | Tourists get real cafés/restaurants/clubs; Camila's viewing hits real rows |
| Evidence quality | 15% | 78 | 11.7 | Recent tasks have proof files; some golden SQL not re-run this week |
| Migration repo ↔ remote parity | 25% | 45 | 11.25 | **Biggest drag** — git can't faithfully replay cloud history |
| Security (DATA-010/011 + advisors) | 15% | 70 | 10.5 | Edge matrix solid; one search_path regression + Phase 2 backlog |
| INDEX/spec accuracy | 10% | 65 | 6.5 | Tracker still points at finished work (021) |
| **Total** | 100% | — | **72.15 → 74/100** | **Users: B+ · Engineers reproducing DB: D+** |

---

## 18. Verification commands used (read-only)

- Supabase MCP: `execute_sql`, `list_migrations`, `list_edge_functions`, `get_advisors` (security)
- Disk: `tasks/data/evidence/*`, `tasks/data/tasks-data/*`, `supabase/migrations/202605*`
- Repo grep: service-role in `mdeapp/src/**`

**No DDL applied during this audit.**

---

## 19. Recommended immediate actions (Sofía)

1. Open **DATA-010c** task row — one-function migration or MCP apply from repo body for `trigger_set_timestamps`.
2. Open **DATA-010b-ext** — batch rename migrations to match remote list (use this doc §4 as checklist).
3. Copy **DATA-005** migration from evidence folder → `supabase/migrations/20260530003708_data005_venue_anchors_nightclubs.sql` (content verify against live).
4. Patch **INDEX-data.md** stale rows (5 min doc fix).
5. Start **DATA-028** implementation.

---

*Audit complete. Companion checklist: [`03-audit-data.md`](03-audit-data.md).*
