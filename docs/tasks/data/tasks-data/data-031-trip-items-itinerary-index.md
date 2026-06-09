---
task_id: data-031
mvp_step: 31
title: trip_items itinerary covering index
layer: DATA
priority: P2
status: Not Started
estimated_effort: 1h
depends_on: ["data-026"]
unblocks: []
skills: [mde-supabase]
related:
  - ../../trips/trips-plan.md
description: idx_trip_items_trip_start_at for workspace load + day grouping at scale.
---

# DATA-031 — trip_items itinerary index

## Gap

Live indexes: `idx_trip_items_trip`, `idx_trip_items_dates` — no composite `(trip_id, start_at)` for ordered itinerary fetch in `load-trip-workspace.ts`.

## Migration

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_items_trip_start_at
  ON public.trip_items (trip_id, start_at)
  WHERE start_at IS NOT NULL;
```

## Acceptance criteria

- [ ] Index exists
- [ ] EXPLAIN on data-030 query (2) uses index when rows > 100 (note low row count today)
- [ ] Apply only if TRIP-005 load path profiled or preemptive before scale

## Note

44 apartments / 4 trip_items — **optional for MVP**; ship before Camila-scale trips if dashboard feels slow.
