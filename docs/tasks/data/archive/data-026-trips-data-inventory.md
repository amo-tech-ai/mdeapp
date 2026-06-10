---
task_id: data-026
mvp_step: 26
title: Trips data inventory — live schema vs trips-plan
layer: DATA
priority: P0
status: Done
verified: 2026-05-29
evidence: ../evidence/data-026-trips-inventory.md
estimated_effort: 3h
depends_on: ["data-001"]
unblocks: ["data-027", "data-028", "data-029", "data-030", "TRIP-001"]
skills: [mde-supabase, task-verifier]
related:
  - ../../trips/trips-plan.md
  - ../../trips/docs/01-audit.md
  - ../audit-supabase.md
description: Read-only trips cluster map; confirm MVP needs no new tables; golden queries.
---

# DATA-026 — trips data inventory

## Live baseline

| Table | Rows | RLS |
|-------|-----:|-----|
| `trips` | 2 | ✅ |
| `trip_items` | 4 | ✅ |
| `saved_places` | 0 | ✅ |
| `collections` | 0 | ✅ |
| `conflict_resolutions` | 0 | ✅ |
| `budget_tracking` | 0 | ✅ |

**CORE verdict:** no new tables for MVP.

## Gap matrix (drives data-027–032)

| Gap | Task | Priority |
|-----|------|----------|
| Gap | Task | Status |
|-----|------|--------|
| `item_type` CHECK extended | data-027 | **Done** 2026-05-29 |
| Insert RPC + ownership validation | data-027 | **Done** |
| `event_orders.trip_id` | data-029 | **Done** |
| Webhook → `trip_items` sync | data-028 | Open (app) |
| Golden SQL pack | data-030 | Open |
| `(trip_id, start_at)` index | data-031 | P2 |
| `mastra_threads` trip lookup | data-032 | P2 |
| `trip_days`, `timeline_events` | ❌ defer | — |

## Goals

1. Full constraint dump (`trip_items_item_type_check`, `unique_trip_item`)
2. Golden SQL: list trips for user, items by day, conflicts open
3. Evidence → `tasks/data/evidence/data-026-trips-inventory.md`
4. Pair with TRIP-001 (app evidence)

## Acceptance criteria

- [x] PRD table list marked exists / defer
- [x] No migrations in this task
- [x] Drives data-027–032 — see [`../evidence/data-026-trips-inventory.md`](../evidence/data-026-trips-inventory.md)
