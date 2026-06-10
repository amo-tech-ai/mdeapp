---
task_id: DATA-039
title: Restaurants schema patch — neighborhood, nullable price/hours
layer: DATA
phase: intel-0
priority: P0
status: Not Started
estimated_effort: 2h
depends_on: []
unblocks: [DATA-041]
skills: [mde-supabase, mde-task-lifecycle]
related:
  - ../../venues/data/venue-dataplan.md
  - ../../intelligence/intelligence-plan.md
  - ../../venues/restaurants/24-restaurants.md
description: Add restaurants.neighborhood; make price_level and hours_of_operation nullable so Places gaps do not block inserts.
---

# DATA-039 — Restaurants schema patch

## Goals

1. `ALTER TABLE restaurants ADD COLUMN neighborhood text;` — backfill from address parser rules in seed script.
2. `ALTER TABLE restaurants ALTER COLUMN price_level DROP NOT NULL;` (if currently NOT NULL).
3. `ALTER TABLE restaurants ALTER COLUMN hours_of_operation DROP NOT NULL;` (if applicable).
4. Update `search-restaurants.ts` to prefer `neighborhood` column over address parse.
5. Evidence: `tasks/data/evidence/data-039-restaurants-patch.md`

**Live (2026-05-31):** 44 restaurant rows; 43 embeddings — backfill orphan after patch.

## Done gate

Migration applied · backfill ≥40/43 rows with neighborhood · golden query R3 still passes.

Full context: [`venue-dataplan.md`](../../venues/data/venue-dataplan.md) §1 gaps · [`24-restaurants.md`](../../venues/restaurants/24-restaurants.md).
