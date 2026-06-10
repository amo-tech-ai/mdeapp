---
task_id: data-030
mvp_step: 30
title: Trips golden queries pack
layer: DATA
priority: P1
status: Done
verified: 2026-05-29
evidence: ../evidence/data-030-trips-golden-queries.md
estimated_effort: 2h
depends_on: ["data-026"]
unblocks: ["TRIP-011", "TRIP-015"]
skills: [mde-supabase, task-verifier]
related:
  - ../../trips/trips-plan.md
  - data-023-rental-golden-queries.md
description: Saved SQL for trips dashboard, itinerary by day, conflicts, RLS negative tests.
---

# DATA-030 — trips golden queries

## Purpose

Sofía and Lucía run the same probes for TRIP Done gates — mirror **data-023** pattern for rentals.

## Queries to document

```sql
-- 1. User trips (dashboard)
SELECT id, title, status, start_date, end_date
FROM trips
WHERE user_id = :uid AND deleted_at IS NULL
ORDER BY start_date;

-- 2. Itinerary items for trip (workspace)
SELECT id, item_type, title, start_at, end_at, latitude, longitude
FROM trip_items
WHERE trip_id = :trip_id
ORDER BY start_at NULLS LAST;

-- 3. Open conflicts
SELECT id, title, severity, status, affected_items
FROM conflict_resolutions
WHERE trip_id = :trip_id AND status IN ('detected', 'pending_review');

-- 4. Item count per trip (dashboard card)
SELECT trip_id, count(*) AS item_count
FROM trip_items
WHERE trip_id = ANY(:trip_ids)
GROUP BY trip_id;

-- 5. RLS negative (manual): User B must not SELECT User A trips
```

## Deliverable

- `tasks/data/evidence/data-030-trips-golden-queries.md` with EXPLAIN on (2) if index added in data-031

## Acceptance criteria

- [x] ≥5 queries with expected row shapes
- [ ] Linked from TRIP-001 / TRIP-015
- [x] No migrations
