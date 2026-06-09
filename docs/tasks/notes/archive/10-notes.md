---
title: Session notes — planning backlog (2026-05-27)
updated: 2026-05-27
superseded_by:
  - plan.md
  - todo.md
  - changelog
---

# Session notes — 2026-05-27

> **Authoritative order lives elsewhere.** Use [`plan.md`](../../plan.md) · [`todo.md`](../../todo.md) · [`changelog`](../../changelog) · [`tasks/INDEX.md`](INDEX.md).  
> This file is a **session log** — detail below; do not treat stale “proposed / not created yet” sections as current.

## Executive summary (synced 2026-05-27)

| Tier | Order |
|------|-------|
| **P0 A (strict)** | IMP-079 G1 → 080 EVP-003 → 081 EVP-013 → 082 G3 → 083 EVP-001 |
| **P0 B (parallel after 083)** | 084 F32 ‖ 085 AUTH-011 ‖ **091 MAP-002B** ‖ **092 MAP-008B** |
| **P1** | EVP-014, SCREEN-017, SCREEN-010, MAP-010 (conditional); AUTH-005 parallel |
| **ADV Maps** | MAP-005 → 006 → 012A → 012 → 010 → data-033 → 011A → 011 → 023 |
| **ADV Data** | data-001/009/034 · events 012–018 · rentals 019→021 · trips 026→032 |
| **ADV Trips app** | TRIP-001…012 |
| **ADV RE app** | RE-001 → 003…010 → 015/016 (RE-011–014 defer) |

**Readiness:** MVP exit 98% · Data 76 · Maps 74 localhost / 58 prod · RE 74 · Trips schema 78 / app ~45.

**Prod deploy context:** `main` @ `f37291d` · www.mdeai.co live · **9 P0 rows** still open.

---

## Session log (chronological detail)

## Deliverables

| File | Content |
|------|---------|
| [`tasks/real-estate/real-estate-prd.md`](tasks/real-estate/real-estate-prd.md) | Full PRD v2.0 — all 18 sections, MCP-verified |
| [`tasks/real-estate/real-estate-roadmap.md`](tasks/real-estate/real-estate-roadmap.md) | Phased roadmap + mermaid + cross-deps |
| [`tasks/real-estate/tasks/`](tasks/real-estate/tasks/) | **RE-001 → RE-016** + [`INDEX.md`](tasks/real-estate/tasks/INDEX.md) |

## Readiness: **74/100**

| Layer | Score | Truth |
|-------|------:|-------|
| Schema | 78 | 44 apartments, RLS ✅; gaps: `leads.apartment_id`, `price_daily` index, 0 showings |
| Agents | 82 | F17/F46/F47 **Done** — `rentalAgent`, `search-rentals`, lead API |
| UI | 58 | RentalCard + modal on disk; Save disabled; no `/rentals`, no landlord UI |
| Commerce | 45 | Rental bookings empty; events Stripe ✅ |

## CORE vs defer (anti-overbuild)

**Ship now:** chat search → cards → schedule viewing → data-020/021 → landlord inbox → saved/trips  

**Defer:** `/rentals` catalog (RE-011), applications, rental Stripe, WhatsApp, OpenClaw, sales CRM

## Critical fixes before new features

1. **data-020** — `leads.apartment_id`  
2. **data-021** — viewing → `showings`  
3. **data-009 M3** — `price_daily` indexes (RE-003)  
4. **RE-004/006** — refresh SCREEN-005/008 Done evidence (code exists, gates incomplete)  
5. **RE-008** — landlord inbox read path  

## Task execution order (CORE → MVP)

```text
RE-001 → RE-003 → RE-004 → RE-005 → RE-006 → RE-007
  → RE-008 → RE-009 → RE-010 → RE-015 → RE-016
RE-011–014 POST-MVP (after chat loop proven)
```

**Parallel data:** data-019 with RE-001; data-020/021 block RE-008/009; TRIP-006/007 block RE-010.

Old PRD claims (pingAgent-only, draft paths) are replaced with live disk + Supabase MCP evidence. No code or migrations were touched.

## Audit review (`01-audit.md`)

**Direction is correct** — Supabase truth, AI approval gates, no Mindtrip clone. Score **86 → 82** after MCP verification.

| Claim | Verdict |
|-------|---------|
| Reuse schema, no `trip_days` / `timeline_events` | ✅ Verified |
| `item_type` CHECK missing | ❌ **Stale** — exists (`event`, `restaurant`, `rental`, `poi`, `other`); extend for `showing`/`booking`/`custom_note` |
| `metadata jsonb` missing | ❌ **Stale** — column exists |
| Snapshot fields missing | 🟡 **Partial** — `title`, `address`, `lat`, `lng` already on row; use `metadata.image_url` at insert |
| Webhook → `trip_items` gap | ✅ **Real** — `idempotency_keys` yes, **no trip_items insert** in webhook |
| Durable queue required for MVP | 🟡 **Overstated** — upsert + existing idempotency enough for MVP |
| `trip_activity_log` MVP blocker | ❌ **Defer** POST-MVP |
| Soft-delete on `trip_items` | ✅ Gap — only `collections`/`trips` have `deleted_at` |
| App shells exist | ✅ `/trips`, `/trips/[id]`, itinerary logic + tests |

Audit file updated with verification table + corrected red-flag fixes.

---

## Tasks created

### App — [`tasks/trips/tasks/`](tasks/trips/tasks/)

| ID | Title |
|----|-------|
| TRIP-001 | Supabase audit + evidence |
| TRIP-002 | Dashboard polish (SCREEN-012) |
| TRIP-003 | Create trip modal |
| TRIP-004 | Workspace shell |
| TRIP-005 | Itinerary hardening |
| TRIP-006 | `/saved` (SCREEN-011) |
| TRIP-007 | Add-to-trip + Mastra/CopilotKit |
| TRIP-008 | Google Map pins (MAP-008) |
| TRIP-009 | Conflict persist + HITL |
| TRIP-010 | Booking → `trip_items` sync |
| TRIP-011 | Playwright suite |
| TRIP-012 | Production smoke + floor |

Index: [`tasks/trips/tasks/INDEX.md`](tasks/trips/tasks/INDEX.md)

### Data (supports TRIP-007/010)

- **data-026** — trips inventory  
- **data-027** — extend `item_type` CHECK + insert RPC  
- **data-028** — `event_orders`/`showings` → `trip_items` sync  

Linked from [`tasks/data/tasks-data/INDEX-data.md`](tasks/data/tasks-data/INDEX-data.md) and [`tasks/trips/INDEX.md`](tasks/trips/INDEX.md).

**Suggested start:** TRIP-001 + data-026 in parallel → TRIP-003 (create modal is the biggest product gap after verified shells).

Created **[`tasks/trips/trips-plan.md`](tasks/trips/trips-plan.md)** — full PRD + roadmap from wireframes, live Supabase, and existing `mdeapp/src/trips` code.

## Forensic verdict

**Schema: 78/100 — app: ~45/100.** MVP needs **no new tables**. Use `trips`, `trip_items`, `saved_places`, `collections`, `conflict_resolutions`, `budget_tracking`, plus mirror from `event_orders` / `showings`.

**Already on disk:** `/trips`, `/trips/[id]`, day-grouped itinerary, client overlap detection, unit tests in `itinerary-logic.ts`.

**Still missing:** create trip modal, `/saved`, add-to-trip from cards, trip-scoped chat, real Google Map tab, booking→itinerary bridge, Playwright evidence.

## Scope discipline (anti–Mindtrip-clone)

| Ship (CORE/MVP) | Defer |
|-----------------|-------|
| Dashboard + create + workspace | Calendar, Media, Chats tabs |
| Itinerary + conflict banner | `/bookings` global inbox |
| `/saved` + add-to-trip | `trip_days`, `timeline_events`, `collection_items` |
| Map pins (list → MAP-008) | WhatsApp reminders, OpenClaw auto-insert |

## Roadmap (TRIP-001 → TRIP-012)

1. Audit evidence → dashboard polish → **create modal** → workspace  
2. `/saved` → add-to-trip from cards → map → conflict HITL  
3. Ticket/viewing → `trip_items` → Playwright → production smoke  

Cross-deps: **data-020/021** (rentals), **EVP-001** (tickets), **MAP-008** (map).

## Data tasks created (trips — ✅ filed)

| ID | Title |
|----|-------|
| data-026 | Trips inventory |
| data-027 | trip_items RPC + item_type CHECK |
| data-028 | order/showing → trip_items sync |
| data-029 | `trip_id` FKs on commerce tables |
| data-030 | Golden queries pack |
| data-031 | `(trip_id, start_at)` index (P2) |
| data-032 | mastra_threads trip metadata index (P2) |

[`tasks/trips/INDEX.md`](tasks/trips/INDEX.md) links the plan. No code or migrations were touched per instruction.

Real estate Supabase gap review is done. **7 rental data tasks** are in `tasks/data/tasks-data/` (019–025), and indexes are wired up.

## Verdict

**CORE rental MVP needs no new tables.** F17/F46/F47 already cover search + lead capture. Gaps are:

| Gap | Task | Priority |
|-----|------|----------|
| PRD ↔ live schema map | **data-019** | P0 |
| `leads.apartment_id` + `preferred_showing_at` | **data-020** | P1 |
| Schedule viewing → `showings` rows | **data-021** | P1 |
| Rental golden SQL pack | **data-023** | P1 |
| `price_daily` indexes | **data-009 M3** | P0 |
| `apartments.neighborhood_id` FK | **data-022** | P2 |
| Booking/Stripe prep on `bookings`/`payments` | **data-024** | P2 |
| Hermes `scoring_logs` / `market_snapshots` | **data-025** | P2 |

PRD names **not** in DB (use substitutes): `places_cache` → places cache tables; `contacts`/`conversations` → `mastra_threads` + `leads`.

## Files updated this turn

- [`tasks/data/tasks-data/INDEX-data.md`](tasks/data/tasks-data/INDEX-data.md) — full Events (012–018) + Rentals (019–025) index
- [`tasks/data/tasks-data/README.md`](tasks/data/tasks-data/README.md) — steps 01–25 + dependency graph
- [`tasks/data/audit-supabase.md`](tasks/data/audit-supabase.md) — real-estate section cross-refs data-019–025
- [`tasks/real-estate/INDEX.md`](tasks/real-estate/INDEX.md) — Supabase dependencies table

## Suggested execution order (rentals)

```text
data-019 → data-020 → data-021 → data-023
data-009 M3 (parallel — price_daily indexes)
data-022 / data-024 / data-025 (P2, post-MVP)
```

Nothing has been migrated yet — all specs only. Next concrete step is **data-019 inventory evidence**, then **data-020** for `017-scr-schedule-viewing` to write proper FKs instead of metadata-only listing refs.

## Review verdict

**CORE events commerce needs no new tables.** Live MCP confirms the spine is complete:

`events` → `event_venues` → `event_tickets` → `event_orders` → `event_attendees` → `event_check_ins` (+ `event_embeddings`)

That covers EVP-001, EVP-003, EVP-013, G3, Andrés checkout/wallet. Those stay **app/proof tasks** in `tasks/events/tasks/`.

**Phase 2 MVP features** in the PRD/roadmap/matrix *do* need schema work — EVP-020/034/033/etc. spec tables but had no **data-layer migration tasks**.

---

## Added to `tasks/data/tasks/`

| ID | What | Priority | Unblocks |
|---|---|---|---|
| **data-012** | Events schema inventory (read-only) | P0 | all below |
| **data-013** | `event_qa` + RLS | P1 | EVP-034, EVP-045 |
| **data-016** | `ai_summary_status` / `tags_status` on `events` | P1 | EVP-033 |
| **data-018** | Admin exception queue **views** (no new table) | P1 | events-prd Patricia queue |
| **data-014** | `event_live_updates` | P2 | EVP-046 |
| **data-015** | `event_attendee_social` (new — not check-in `event_attendee_profiles`) | P2 | EVP-035 |
| **data-017** | Discovered-events pipeline (`event_sources`, `raw_events`, …) | P2 post-MVP | EVP-020, EVP-022 |

---

## Explicitly NOT needed (now)

| EVP / PRD item | Why |
|---|---|
| Ticketing / webhooks | Tables + edge fns exist |
| EVP-033 vibe tags | `events.tags` + `ai_summary` exist — only **approval columns** (data-016) |
| EVP-029 sponsor CRM | `event_sponsors` / `event_sponsor_placements` exist (empty) — **advanced**, defer |
| EVP-016 venue binding | `event_venues` + `google_place_id` on `events` exist |
| `event_chat`, networking rooms | ADVANCED — no data task yet |

---

## Suggested order

```text
data-012 (inventory) → data-013 + data-016 + data-018 (Phase 2 MVP schema)
                     → data-014/015/017 when EVP-046/035/020 start
```

Updated: [`INDEX-data.md`](tasks/data/tasks/INDEX-data.md), [`README.md`](tasks/data/tasks/README.md), [`audit-supabase.md`](tasks/data/audit-supabase.md) events section.

## Verdict on `23-audit.md`

**Was ~82/100 correct on direction; now 84/100 after MCP + disk verification.**

### Confirmed correct
- Reuse DB, no rebuild, M1/M2/M3 migrations, VEC-001, defer unified vectors / `trip_days`
- 100 tables / 99 RLS (live SQL)
- Missing `venue_booking_requests`, `venue_anchors`, `price_daily` indexes, duplicate HNSW

### Corrections made

| Original claim | Fix |
|---|---|
| Stripe webhook “must verify, not assumed” as **missing** | **Overstated.** `ticket-payment-webhook` already has `constructEventAsync`, raw body, `idempotency_keys`. Remaining work = **EVP-003** (secret isolation evidence), not re-implementation |
| Guest `verify_jwt=false` = 🔴 critical, no protection | **Wrong severity.** `chat-lead-capture` already has `allowRateDurable` (20/hr/IP anon). Turnstile = P2 nice-to-have |
| 80+ search_path = 🔴 before MVP seeds | **High, not launch blocker** for current 44-row inventory |

---

## New tasks (`tasks/data/tasks/`)

| ID | What |
|---|---|
| **data-009** | M1 `venue_booking_requests` + M2 `venue_anchors` + M3 rental indexes |
| **data-010** | Postgres `search_path` hardening batch (advisor lint 0011) |
| **data-011** | Edge KEEP/FREEZE matrix + guest-lead abuse audit (cross-links EVP-003) |

Also updated:
- [`23-audit.md`](tasks/data/plan/23-audit.md) — frontmatter, MCP proof table, corrected severities
- [`README.md`](tasks/data/tasks/README.md) — steps 01–11 + dependency graph
- [`INDEX-data.md`](tasks/data/tasks/INDEX-data.md) — full data backlog index
- **data-001** → `In Progress` (audit doc exists; evidence file still pending)

---

## Updated fix order

```text
data-002 → data-009 (migrations) → data-003/004/005 seeds
VEC-001 (parallel)
data-010 + data-011 + EVP-003 (P1 hardening)
```

Plan score **84/100**; DB readiness stays **76/100** until data-009 + VEC-001 land.

Live Supabase MCP audit is done. Both deliverables are written:

- [`tasks/data/audit-supabase.md`](tasks/data/audit-supabase.md) — red flags, blockers, live row counts, RLS/index findings  
- [`tasks/data/supabase-plan.md`](tasks/data/supabase-plan.md) — CORE/MVP/ADVANCED migrations + mermaid diagrams  

## Verdict: **76/100** (data layer)

Schema is **mostly ready** for CORE+MVP. Gaps are targeted, not a greenfield rebuild.

### What already exists (reuse)
| Domain | Tables | Live rows |
|--------|--------|-----------|
| **Users** | `profiles`, `user_roles`, `user_preferences` | 13 / 3 / 0 |
| **Events** | full spine through `event_check_ins` | 49 events, 35 orders |
| **Real estate** | `apartments`, `listing_embeddings`, `leads`, rental ops | 44 listings, 11 leads |
| **Trips** | `trips`, `trip_items`, `saved_places`, `collections` | 2 / 4 / 0 / 0 |
| **Restaurants** | `restaurants` + embeddings + cache | 44 (100% `google_place_id`) |
| **RLS** | 99/100 tables | only `spatial_ref_sys` off |

### P0 blockers (data tasks)
1. **`venue_booking_requests` missing** → data-001 AC / CAF-008  
2. **No café/nightclub catalog** → only ADK + cache; need **`venue_anchors`** (data-003/005)  
3. **No index on `apartments.price_daily`** → `search-rentals.ts` filters/sorts on it  
4. **Duplicate HNSW** on all 3 embedding tables → VEC-001 cleanup  
5. **Guest leads** → no anon `leads` INSERT (by design); must use `chat-lead-capture` edge  

### Planned migrations (in supabase-plan)
| Batch | What |
|-------|------|
| **M1** | `venue_booking_requests` + RLS |
| **M2** | `venue_anchors` (café/nightclub) + RLS |
| **M3** | `price_daily` partial indexes on `apartments` |
| **VEC-001** | Drop duplicate HNSW indexes |

Mermaid diagrams in the plan: system context, ER diagram, trips RLS flow, event checkout webhook, venue cache layer, Gantt implementation order.

**Next step:** Run **data-002** catalog contract, then ship M1–M3. I can draft the actual migration SQL files under `supabase/migrations/` if you want.

## Who is Patricia / Sofía?

They are **PRD fictional personas**, not people on your team:

| Name | Role in mdeai docs | Linear mapping now |
|------|-------------------|-------------------|
| **Camila** | Apartment seeker / chat user | Project **Camila Discovery** |
| **Roberto** | Event host | Project **Roberto Host** |
| **Andrés** | Ticket buyer | Project **Andrés Commerce** |
| **Patricia** | Admin/ops (legacy label) | Dropped as assignee — use **sanjiovani** |
| **Sofía** | Dev/CI persona (legacy label) | Project **Sofía Platform** → assignee **you (sanjiovani)** |

---

## Summary of changes

Reorganized **CORE + MVP only** (12 active tasks) into a Linear-shaped hierarchy per [Initiatives → Projects → Milestones → Issues](https://linear.app/docs/conceptual-model).

### New / rewritten docs

| File | Purpose |
|------|---------|
| [`plan.md`](plan.md) | **Master plan** — ordered tables, sub-issues, sync commands, conflicts |
| [`tasks/linear/core-mvp-order.json`](tasks/linear/core-mvp-order.json) | Machine-readable active queue |
| [`tasks/linear/04-core-mvp-linear-plan.md`](tasks/linear/04-core-mvp-linear-plan.md) | Linear views, labels, import gaps |
| [`tasks/README.md`](tasks/README.md) | One-page router |
| [`tasks/INDEX.md`](tasks/INDEX.md) | **Slimmed** (~70 lines) — metrics + queue summary + links |
| [`tasks/events/G3-core-host-publish-proof.md`](tasks/events/G3-core-host-publish-proof.md) | New P0 spec for Roberto G3 proof |

### Frontmatter updated (12 specs)

`imp`, `phase`, `persona`, `project`, `milestone`, `linear`, `percent`, `blocked_by`, `blocks` on:

- EVP-003, EVP-013, EVP-001, EVP-014, G3 (new)
- F32, AUTH-011, AUTH-005
- MAP-010, SCREEN-010, SCREEN-017

### Build script

[`scripts/linear-build-implementation-order.mjs`](scripts/linear-build-implementation-order.mjs) — P0 order fixed, `tasks/data/tasks/` scanned, EVP-013 promoted to P0. **Re-run locally** (shell didn’t execute here):

```bash
node scripts/linear-build-implementation-order.mjs
node scripts/linear-import-tasks.mjs
node scripts/linear-organize-project.mjs
node scripts/linear-apply-imp-numbers.mjs
node scripts/linear-sort-todo.mjs
```

---

## New implementation order (CORE + MVP)

| IMP | ID | Phase | Project | % | | Milestone |
|----:|----|:-----:|---------|--:|:--:|-----------|
| 079 | OPS-ANDRES-G1 | MVP | Andrés Commerce | 80 | 🟡 | **P0** |
| 080 | EVP-003-core | MVP | Andrés Commerce | 60 | 🟥 | **P0** |
| 081 | EVP-013-core | MVP | Andrés Commerce | 45 | 🟥 | **P0** |
| 082 | G3-core-host-publish-proof | MVP | Roberto Host | 90 | 🟡 | **P0** |
| 083 | EVP-001-core | MVP | Andrés Commerce | 0 | 🟥 | **P0** blocked |
| 084 | F32 | CORE | Sofía Platform | 0 | ⚪ | **P0** |
| 085 | AUTH-011 | MVP | Sofía Platform | 40 | 🟡 | **P0** |
| 086 | EVP-014-core | MVP | Roberto Host | 0 | ⚪ | P1 |
| 087 | SCREEN-017 | MVP | Sofía Platform | 0 | ⚪ | P1 |
| 088 | SCREEN-010 | MVP | Camila Discovery | 0 | ⚪ | P1 |
| 089 | MAP-010 | MVP | Roberto Host | 0 | ⚪ | P1 |
| 090 | AUTH-005 | CORE | Sofía Platform | 0 | ⚪ | P2 |

**Critical path:** `079 → 080 → 081 → 082 → 083` then `084` + `085` in parallel.

---

## Conflicts / duplicates found

| Issue | Fix applied |
|-------|-------------|
| EVP-013 was P1 in old IMP ledger but P0 blocker | Promoted to P0 IMP-081 |
| EVP-001 before EVP-013 in old sort | Reordered in `plan.md` / `core-mvp-order.json` |
| EVP-013/014 blocked by **F22** (ADV) | Removed from `depends_on` |
| MAP-010 blocked by **MAP-005** (ADV) | Cleared — conditional only |
| SCREEN-010 blocked by **SCREEN-018** (deferred) | Cleared |
| AUTH specs under `data/tasks/` not in Linear | `linear: null` — import on next sync |
| G3 had no spec file | Added `G3-core-host-publish-proof.md` |
| SCREEN-010 lives at `maps/wireframes/011-scr-*` but id is `SCREEN-010` | Documented; canonical path in frontmatter |
| SAN-114 still in old P0 | Marked Done — remove from Linear P0 |

---

## Linear sync (your next steps)

1. Create **Initiative:** Phase 1 MVP Exit  
2. Create **Projects:** Andrés Commerce · Roberto Host · Camila Discovery · Sofía Platform  
3. **Import** G3 + AUTH-011 + AUTH-005 → update `linear: SAN-*` in specs  
4. Set **blocked-by:** EVP-001 ← G1, EVP-003, EVP-013, G3  
5. Todo column → sort **Manual** by IMP  
6. Add **sub-issues** on EVP-001 + AUTH-011 (listed in `plan.md`)  
7. Close **SAN-114** if still In Progress  

Full playbook: [`tasks/linear/04-core-mvp-linear-plan.md`](tasks/linear/04-core-mvp-linear-plan.md)

**ADV tasks** stay in repo/Linear deferred milestones — not in [`plan.md`](plan.md) active queue.

Trips Supabase review is done. **Four additional data tasks** were added to `tasks/data/tasks-data/`; cross-refs are wired.

## Trips schema verdict (MCP)

**No new MVP tables.** Existing CORE is solid: `trips`, `trip_items`, `saved_places`, `collections`, `conflict_resolutions`, `budget_tracking` — all RLS-on.

**Gaps that need data work:**

| Gap | Task |
|-----|------|
| `item_type` CHECK missing `showing`/`booking`/`custom_note` + insert RPC | **data-027** |
| **`event_orders` has no `trip_id`** — blocks ticket→itinerary | **data-029** (new) |
| Paid ticket / showing → `trip_items` sync | **data-028** (now depends on data-029) |
| Golden SQL pack for Done gates | **data-030** (new) |
| `(trip_id, start_at)` index for workspace load | **data-031** (new, P2) |
| `mastra_threads.metadata->>'trip_id'` index | **data-032** (new, P2) |

## New tasks in `tasks/data/tasks-data/`

| ID | Title | Priority |
|----|-------|----------|
| **data-029** | `event_orders`/`leads`/`showings` trip_id FKs | P1 |
| **data-030** | Trips golden queries pack | P1 |
| **data-031** | `idx_trip_items_trip_start_at` | P2 |
| **data-032** | mastra_threads trip metadata index | P2 |

## Critical path

```text
data-026 → data-027 → data-029 → data-028 → TRIP-010
data-026 → data-030 (parallel)
data-031/032 — P2, ship when scale warrants
```

## Updated cross-refs

- `INDEX-data.md` — trips section now data-026–032
- `README.md` — dependency graph
- `data-026` — gap matrix
- `data-028` — `depends_on: data-029`
- `audit-supabase.md` §4 Trips
- `trips-plan.md`, `trips/tasks/INDEX.md`, `TRIP-010`

**Not added (correctly deferred):** `trip_days`, `timeline_events`, `collection_items`, `trip_activity_log` — app groups by `start_at` via `itinerary-logic.ts`.

Forensic audit is in [`tasks/maps/docs/maps-audit-plan.md`](tasks/maps/docs/maps-audit-plan.md). Read-only — no code or migrations touched.

## Bottom line

**Architecture is right and ~74% MVP-ready on disk** — ahead of what `maps-prd.md` §1.2 still claims. The gap is **cost-safe Places (MAP-005)** and the open MAP spine (006, 010, 011, 012), not a rethink.

| Lens | Score |
|------|------:|
| Chat + map MVP (localhost) | **74/100** |
| Prod cost-safe Places | **58/100** |
| Docs accuracy | **45/100** (PRD §1.2 stale) |

## What's already correct (your red flags mostly mitigated)

- **mergePinsByCategory** — not global pin replace (`merge-pins-by-category.ts`)
- **AdvancedMarker + mapId** — gated in `ChatMap.tsx`; MAP-008 Done
- **Field masks** — enforced in client + PreToolUse hook
- **Places server-side** — browser key = Maps JS only; e2e blocks browser Places POST
- **Grounding sidecar** — bounded HTTP invoke, not second orchestrator
- **Zod on tool geo** — `search-grounded-places.ts` + ADK types
- **Attribution** — `GroundingAttribution.tsx` + smoke scripts

## Critical blockers (unchanged priority)

```text
MAP-005 (places-proxy + cache wiring) → MAP-006 → MAP-012A → MAP-012 → MAP-010 → MAP-011
Parallel: prod ADK (Cloud Run + ADK_INTERNAL_TOKEN)
```

Cache **migrations exist**; MAP-005 scope should be **edge fn + mdeapp read-through**, not re-shipping DDL.

## Additional tasks needed?

### `tasks/maps/` — **no new MVP spine tasks**

MAP-005, 006, 010, 011, 012, 012A, 023, 002A cover it. Optional adds:

| Proposed | Purpose |
|----------|---------|
| **MAP-DOC-001** | Refresh maps-prd §1.2 repo truth (P0 doc) |
| **MAP-034** | Advanced marker UX polish (z-index, price badges, mobile sheet, a11y) — P2 |

### `tasks/data/tasks-data/` — **2 new data tasks recommended**

Maps work was split across MAP specs + data-001/007/008. Gaps:

| Proposed | Purpose | Unblocks |
|----------|---------|----------|
| **data-033** | `route_cache` schema + RLS + TTL | MAP-011 |
| **data-034** | Geo inventory matrix (apartments/events/restaurants lat/lng + `google_place_id`) | Pin proof, data-009 |

**Don't duplicate MAP-005 in data track** — implementation stays MAP-005; **data-007** should add `depends_on: MAP-005` for meaningful cache hit-rate audit.

### Corrections to existing specs

1. **MAP-005** — drop "ship migrations" from Done criteria (already applied)
2. **maps-prd.md §1.2** — mark vis.gl, MapContext, grounding, attribution, tests as **shipped**
3. Promote **`advanced-marker-needs-mapid.mjs`** from `_deferred/` to PreToolUse

**Status:** data-033, data-034, MAP-DOC-001, MAP-034 created; maps-prd §1.2 patched — see changelog § 2026-05-27 planning backlog.

All audit corrections are in. Summary:

## New task files

| File | Purpose |
|------|---------|
| [`data-033-route-cache-schema.md`](tasks/data/tasks-data/data-033-route-cache-schema.md) | `route_cache` + RLS for MAP-011 |
| [`data-034-maps-geo-inventory.md`](tasks/data/tasks-data/data-034-maps-geo-inventory.md) | lat/lng + `place_id` matrix for pin inventory |
| [`MAP-034-advanced-marker-ux-polish.md`](tasks/maps/MAP-034-advanced-marker-ux-polish.md) | Post-MVP marker UX (badges, sheet, a11y) |
| [`MAP-DOC-001-refresh-maps-prd-repo-truth.md`](tasks/maps/MAP-DOC-001-refresh-maps-prd-repo-truth.md) | Doc task — **Done** |

## Updated specs

- **`maps-prd.md`** — §Repo truth + §1.1/1.2 aligned with disk (74/100 MVP, 58/100 prod)
- **`MAP-005`** — DDL already live; scope = edge + cache wiring only
- **`MAP-011`** — `depends_on: data-033`
- **`data-007`** — `depends_on: MAP-005` (hit-rate audit after proxy)
- **`data-001`** — unblocks `data-034`

## Index / cross-refs

- [`INDEX-data.md`](tasks/data/tasks-data/INDEX-data.md) — Maps data section (033, 034, 007)
- [`README.md`](tasks/data/tasks-data/README.md) — dependency graph
- [`tasks/maps/INDEX.md`](tasks/maps/INDEX.md) — MAP-034, MAP-DOC-001, data track
- [`audit-supabase.md`](tasks/data/audit-supabase.md) — route_cache + geo inventory gaps
- [`maps/README.md`](tasks/maps/README.md) — audit + PRD links

## Hook promoted

- **Active:** `.claude/hooks/advanced-marker-needs-mapid.mjs` in PreToolUse
- **`_deferred/`** stub → redirect only

## Execution order (unchanged)

```text
MAP-005 → MAP-006 → MAP-012A → MAP-012 → MAP-010 → MAP-011
Parallel: data-034 (geo inventory), data-033 (before MAP-011), data-007 (after MAP-005)
Post-MVP: MAP-034
```

**Verdict: maps-audit-2 suggestions are correct.** Most were already filed; three P0 gaps were missing as standalone tasks — now added.

## Assessment

| Audit-2 claim | Verdict |
|---------------|---------|
| Architecture correct | ✅ Matches disk |
| MAP-005 + cache wiring = #1 blocker | ✅ Correct — DDL live, edge unwired |
| Prod ADK localhost default | ✅ Correct — needed explicit task |
| Vercel Map ID verify | ✅ Correct — MAP-008 code done, env proof missing |
| data-033 / data-034 / MAP-034 | ✅ Already filed — enhanced data-034 with cache counts |
| Docs stale | ✅ Fixed via MAP-DOC-001 |
| Test matrix | ✅ Added to VERIFICATION-CHECKLIST |
| Score 84/100 | ✅ Fair for architecture; **58/100** prod cost-safe until MAP-005 + MAP-002B |

## New tasks created

| Task | Priority | Why |
|------|----------|-----|
| **MAP-002B** | P0 | Cloud Run ADK + `ADK_GROUNDING_URL` / token on Vercel |
| **MAP-008B** | P0 | Prove Map ID + referrer restrictions on preview/prod |
| **MAP-011A** | P1 | Split `compute_routes` stub from MAP-011 (was embedded only) |

## Updated

- [`maps-audit-2.md`](tasks/maps/docs/maps-audit-2.md) — verification header + task crosswalk
- [`INDEX.md`](tasks/maps/INDEX.md) — P0 section, chain, spec table
- [`MAP-005`](tasks/maps/MAP-005-places-proxy-cache.md) — audit-2 test AC
- [`MAP-011`](tasks/maps/MAP-011-route-previews.md) — depends on MAP-011A
- [`data-034`](tasks/data/tasks-data/data-034-maps-geo-inventory.md) — cache coverage queries
- [`VERIFICATION-CHECKLIST.md`](tasks/maps/docs/VERIFICATION-CHECKLIST.md) — audit-2 test matrix
- [`maps-prd.md`](tasks/maps/docs/maps-prd.md) — MAP-002B/008B blockers
- [`mde-maps/SKILL.md`](.agents/skills/mde-maps/SKILL.md) — current task paths (replaces stale `07-mapsv2-tasks.md`)

## Execution order (updated)

```text
MAP-002B + MAP-008B  (P0 parallel)
MAP-005 → MAP-006 → MAP-012A → MAP-012 → MAP-010 → MAP-011A → MAP-011
data-034 (parallel) · data-033 (before MAP-011)
```Updated all three planning files with a unified, dependency-correct order.

## Structure

**Tier 1 — P0 strict (commerce first)**
```text
079 G1 → 080 EVP-003 → 081 EVP-013 → 082 G3 → 083 EVP-001
```

**Tier 1 — P0 parallel (platform sign-off, after EVP-001)**
```text
084 F32 ‖ 085 AUTH-011 ‖ 091 MAP-002B ‖ 092 MAP-008B
```

**Tier 2 — P1 polish:** EVP-014 → SCREEN-017 → SCREEN-010 → MAP-010 (conditional) · AUTH-005 parallel

**Tier 3 — Post-MVP ADV:**
```text
Maps:  MAP-005 → 006 → 012A → 012 → 010 → data-033 → 011A → 011 → 023
Data:  data-001/009/034 · data-019→021 · data-007 after MAP-005
Trips: data-026 → 027 → 029 → 028 → TRIP-*
```

## What changed

| File | Fix |
|------|-----|
| [`tasks/INDEX.md`](tasks/INDEX.md) | Master order diagram + P0/P1 tables + post-MVP track links |
| [`plan.md`](plan.md) | Split P0 into Sequence A/B; full ADV maps/data/trips tables |
| [`todo.md`](todo.md) | Added missing **G3** step; MAP-002B/008B in P0-B; corrected maps ADV chain |
| [`linear/core-mvp-order.json`](tasks/linear/core-mvp-order.json) | IMP-091/092 for MAP-002B/008B |
| [`maps/INDEX.md`](tasks/maps/INDEX.md) | Renumbered steps 1–9 in dependency order |
| [`MVP-REQUIRED.md`](tasks/MVP-REQUIRED.md) | Synced visual flow + ADV maps line |

**Key call:** MAP-002B + MAP-008B are **P0 parallel** (prod grounded search + pins on Vercel), not buried in post-MVP. Full MAP-005 spine stays **ADV** after MVP exit.

*End of session log — see [`plan.md`](../../plan.md) for current queue.*

**Short answer:** `plan.md` covers **all MVP-exit blockers** (14 active IMP rows). It does **not** enumerate every remaining post-MVP spec — those are summarized by track with pointers to domain indexes.

---

### ✅ Fully in `plan.md` (MVP exit queue)

| Tier | Count | IDs |
|------|------:|-----|
| **P0 A** | 5 | G1 ops, EVP-003, EVP-013, G3, EVP-001 |
| **P0 B** | 4 | F32, AUTH-011, **MAP-002B**, **MAP-008B** |
| **P1** | 4 | EVP-014, SCREEN-017, SCREEN-010, MAP-010 |
| **P2** | 1 | AUTH-005 |

That matches [`todo.md`](todo.md) and [`tasks/INDEX.md`](tasks/INDEX.md). Nothing open in the MVP exit path is missing from the plan tables.

---

### ⚠️ Post-MVP — covered by **track summary**, not line-by-line

`plan.md` § Post-MVP is an **ordered spine + index links**, not a full catalog:

| Track | In plan? | Detail lives in |
|-------|----------|-----------------|
| Maps ADV | ✅ spine (005→011→023) | [`tasks/maps/INDEX.md`](tasks/maps/INDEX.md) |
| Data 001–034 | ✅ ranges + order | [`tasks/data/tasks-data/INDEX-data.md`](tasks/data/tasks-data/INDEX-data.md) |
| Trips | ✅ `TRIP-001…012` ref only | [`tasks/trips/tasks/INDEX.md`](tasks/trips/tasks/INDEX.md) |
| Real estate | ✅ abbreviated `RE-001→003…010` | [`tasks/real-estate/tasks/INDEX.md`](tasks/real-estate/tasks/INDEX.md) |
| Events schema | ✅ data-012–018 | INDEX-data |
| Hardening | ✅ data-010/011, VEC-001 | INDEX-data |

---

### ❌ Not in `plan.md` (by design — see [`MVP-REQUIRED.md`](tasks/MVP-REQUIRED.md) § ADV)

These remaining specs exist on disk but are **intentionally deferred** to domain indexes:

| Bucket | Examples | Count (approx) |
|--------|----------|----------------|
| **Events app (EVP)** | EVP-015…047 (discovery, vibe, Q&A, sponsors, OpenClaw) | ~25+ open |
| **Core W8+** | F20, F21A, F22, F26, F30, F41 | 6 |
| **Quality** | CK-001–008, **AUTH-009** | 9 |
| **Vector / venues** | VEC-002–005, SCREEN-021 B/C, venues 01–24 | many |
| **Grounding** | GS-005–009 | 5 |
| **Phase 2+** | CTI, CTEST, OpenClaw | — |

Also **gaps inside tracks** the plan abbreviates:

- **RE-002** — in RE index, omitted from plan’s `RE-001 → 003…` shorthand  
- **data-006, data-008** — venue golden queries + Places backfill cron  
- **data-022, 024, 025** — rentals P2 (plan stops at 019→021→023)  
- **MAP-002A** — ADK package (in maps INDEX + `tasks/INDEX` Tier 3, not in `plan.md`)  
- **TRIP-001…012** — not listed individually (only via index)

---

### Verdict

| Scope | Complete in `plan.md`? |
|-------|------------------------|
| **MVP exit (P0–P2 active queue)** | **Yes** — all 14 rows |
| **Post-MVP execution order** | **Yes** — maps + data/trips/rentals spines |
| **Every remaining task file in repo** | **No** — ADV buckets point to indexes |

`plan.md` is the **MVP execution plan + ADV spine**, not a flat registry of ~100+ open specs. For exhaustive lists use the per-track INDEX files above.

**Note:** [`MVP-REQUIRED.md`](tasks/MVP-REQUIRED.md) P0 table is **stale** — it still shows 6 P0 blockers and omits MAP-002B/008B; `plan.md` / `todo.md` are current.

Want me to add a **“Post-MVP catalog (by index)”** section to `plan.md` so nothing requires cross-referencing five INDEX files?