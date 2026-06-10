---
task_id: DATA-041
title: venue_signals polymorphic + seed (human QA top 30)
layer: DATA
phase: intel-1
priority: P0
status: Done
completed: 2026-06-03
estimated_effort: 6h
depends_on: [DATA-039, DATA-040]
unblocks: [DATA-045, SEARCH-003]
evidence:
  - ../evidence/DATA-041-verify-2026-06-03.md
  - ../evidence/DATA-041-venue-signals-human-qa.md
skills: [mde-supabase, gemini, mde-task-lifecycle]
related:
  - ../../venues/data/venue-dataplan.md
  - ../../intelligence/intelligence-plan.md
description: One migration for venue_signals only. Polymorphic FK to restaurants + venue_anchors. Signal provenance required. Human QA on top 30 before Done.
---

# DATA-041 — venue_signals

## At a glance

| | |
|---|---|
| **Rule** | **1 migration = venue_signals table + RLS only** — seed in separate SQL file or edge job |
| **Human QA** | Required for top 30 rows (10 restaurants, 10 cafés, 10 nightlife) before Done |
| **Batch model** | `gemini-3.1-flash-lite` structured output — not 3.5 Flash |

## DDL

Copy from [`venue-dataplan.md`](../../venues/data/venue-dataplan.md) §5 MVP DDL with **provenance columns**:

```sql
-- Required on every signal row (tuning + audit)
source text NOT NULL DEFAULT 'ai_enriched',  -- ai_enriched | places_cache | human_qa | editorial
model_version text,                             -- e.g. gemini-3.1-flash-lite@2026-05-31
generated_at timestamptz NOT NULL DEFAULT now(),
confidence numeric(4,3) NOT NULL DEFAULT 0.5,
evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
```

**Do not** combine with `embedding_jobs`, evidence tables, or restaurant ALTER in this migration.

## Seed strategy

1. Batch Gemini → top 20 restaurants + 10 anchors (MVP scope).
2. **Human QA sheet** — Sofia signs off rooftop/nightlife/nomad scores for Provenza/Poblado/Laureles staples.
3. Rows with `confidence < 0.6` excluded from SEARCH-003 rank boost until QA bump.

## Done gate

| Check | Command |
|-------|---------|
| Table + RLS | MCP + RLS audit |
| ≥30 signal rows | `SELECT COUNT(*) FROM venue_signals` |
| Human QA evidence | `tasks/data/evidence/data-041-venue-signals-qa.md` |
| GQ-S01 SQL | rooftop + Provenza returns ≥1 row |

## Real-world example

Tourist: *"quiet rooftop dinner Provenza"* → SQL joins `restaurants` + `venue_signals` where `rooftop_score >= 0.7` and neighborhood = Provenza → Oci.Mde ranks first with `source: human_qa`, not a hallucinated name.

## Out of scope

- Unified `venues` table (Phase 2 DATA-050)
- Anchor embeddings (embedding_jobs follow-up)
- Full 44 restaurant seed (Phase 1b)
