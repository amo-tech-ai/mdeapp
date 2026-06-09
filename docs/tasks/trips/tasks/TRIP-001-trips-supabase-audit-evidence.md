---
task_id: TRIP-001
title: Trips Supabase audit + evidence
layer: DATA + APP
priority: P0
phase: core
status: Not Started
estimated_effort: 3h
persona: Camila
depends_on: []
unblocks: [TRIP-002, TRIP-010]
skills: [mde-supabase, mde-task-lifecycle, task-verifier]
related:
  - ../trips-plan.md
  - ../docs/01-audit.md
  - ../../data/audit-supabase.md
  - ../../data/tasks-data/data-026-trips-data-inventory.md
description: MCP-verified inventory of trips cluster; evidence file; drives data-026–029 gaps.
---

# TRIP-001 — Trips Supabase audit + evidence

## Goal

Prove the trips cluster is MVP-ready **without new tables** and document exact gaps for TRIP-010 and data-027/028.

## Live baseline (MCP 2026-05-26)

| Table | Rows | RLS | Notes |
|-------|-----:|-----|-------|
| `trips` | 2 | ✅ 4 policies | `deleted_at` soft delete |
| `trip_items` | 4 | ✅ 4 policies | CHECK: event, restaurant, rental, poi, other |
| `saved_places` | 0 | ✅ 5 policies | No `deleted_at` |
| `collections` | 0 | ✅ 5 policies | `deleted_at` ✅ |
| `conflict_resolutions` | 0 | ✅ 4 policies | |
| `budget_tracking` | 0 | ✅ 4 policies | POST-MVP UI |

**Indexes verified:** `unique_trip_item`, `idx_trip_items_trip`, `idx_trip_items_dates`, `idx_trips_user_id`.

## Goals

1. Column + constraint dump → `tasks/trips/evidence/TRIP-001-schema.md`
2. RLS negative-test script (two test users cannot read each other's trips)
3. Map PRD features → exists / gap / defer
4. Confirm **no** `trip_days`, `timeline_events` for MVP

## Acceptance criteria

- [ ] Evidence file committed at `tasks/trips/evidence/TRIP-001-schema.md`
- [ ] CORE verdict: zero new tables for MVP
- [ ] Gap list: item_type extension, webhook→trip_items, `/saved` route missing
- [ ] Cross-ref data-026 created or linked
- [ ] No migrations in this task

## Do not do

- Do not create `trip_activity_log` (POST-MVP per corrected audit)
- Do not add durable queue table for MVP
