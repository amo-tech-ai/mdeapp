---
task_id: data-022
mvp_step: 22
title: apartments.neighborhood_id FK — join neighborhoods table
layer: DATA
priority: P2
status: Not Started
estimated_effort: 3h
depends_on: ["data-019"]
description: Add optional neighborhood_id on apartments; backfill from text neighborhood; unblocks hood intelligence post-MVP.
---

# DATA-022 — apartments neighborhood FK

## Gap

`apartments.neighborhood` is **text**. `neighborhoods` table has 12 curated rows with scores. PRD post-MVP **Neighborhood Intelligence** needs stable FK join.

## Proposed migration

```sql
ALTER TABLE public.apartments
  ADD COLUMN IF NOT EXISTS neighborhood_id uuid REFERENCES public.neighborhoods(id) ON DELETE SET NULL;

CREATE INDEX idx_apartments_neighborhood_id ON public.apartments (neighborhood_id)
  WHERE neighborhood_id IS NOT NULL;

-- Backfill via normalized name match (evidence script, manual review for ambiguous)
```

Keep `neighborhood` text for display until app reads FK-only.

## Acceptance criteria

- [ ] ≥90% of active apartments mapped or documented exceptions
- [ ] `search-rentals` can optionally filter by `neighborhood_id`
- [ ] No breaking change to existing text filter

## Real-world example

Camila asks "Laureles walkable" — agent joins `neighborhoods.walk_score` without fuzzy text match.
