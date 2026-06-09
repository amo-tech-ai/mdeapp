---
task_id: data-032
mvp_step: 32
title: mastra_threads trip_id metadata index
layer: DATA
priority: P2
status: Not Started
estimated_effort: 2h
depends_on: ["data-026"]
unblocks: []
skills: [mde-supabase]
related:
  - ../../trips/docs/01-audit.md
description: Expression index on metadata->>'trip_id' for trip-scoped chat lookup; defer FK column to Phase 2.
---

# DATA-032 — mastra_threads trip metadata index

## MVP pattern

Trip-scoped chat uses `mastra_threads.metadata->>'trip_id'` (no dedicated column).

## Migration (POST-MVP / when thread volume warrants)

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_mastra_threads_trip_id_metadata
  ON public.mastra_threads ((metadata->>'trip_id'))
  WHERE metadata->>'trip_id' IS NOT NULL;
```

## Phase 2 alternative

```sql
ALTER TABLE public.mastra_threads
  ADD COLUMN trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL;
```

Only if expression index insufficient — **do not** add column for MVP.

## Acceptance criteria

- [ ] Index applied OR explicit defer note in TRIP-001 evidence
- [ ] Query plan documented for "threads for trip X"
