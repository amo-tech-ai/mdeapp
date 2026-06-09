---
task_id: DATA-040
title: embedding_jobs queue + disable sync embed triggers
layer: DATA
phase: intel-1
priority: P0
status: Not Started
estimated_effort: 4h
depends_on: [VEC-001]
unblocks: [DATA-041, DATA-042, DATA-043, VEC-004]
blocks: []
skills: [mde-supabase, mde-task-lifecycle, task-verifier]
related:
  - ../../intelligence/intelligence-plan.md
  - ../plan/data-intelligence-plan.md
  - ../../vector/VEC-004-embedding-text-builders.md
description: Create embedding_jobs table with RLS; route all re-embeds through queue; verify no sync trigger stalls catalog writes.
---

# DATA-040 — embedding_jobs queue

## At a glance

| | |
|---|---|
| **For** | Sofia (schema) · Mastra/edge worker (consumer) |
| **Surface** | Supabase migration only — worker stub in Phase 1 tail |
| **Layer** | DATA · MIS Phase 1 M1-Jobs |
| **Plan** | [`intelligence-plan.md`](../../intelligence/intelligence-plan.md) · [`data-intelligence-plan.md`](../plan/data-intelligence-plan.md) |

## What we're building

Async embedding pipeline so catalog INSERT/UPDATE never blocks on Gemini embed API.

### DDL (target)

```sql
CREATE TABLE public.embedding_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN (
    'apartment', 'event', 'restaurant', 'venue_anchor'
  )),
  entity_id uuid NOT NULL,
  content_hash text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'done', 'failed', 'skipped'
  )),
  model text NOT NULL DEFAULT 'gemini-embedding-001',
  dimensions int NOT NULL DEFAULT 768,
  attempts int NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

CREATE UNIQUE INDEX embedding_jobs_dedup_uidx
  ON public.embedding_jobs (entity_type, entity_id, content_hash)
  WHERE status IN ('pending', 'processing');

ALTER TABLE public.embedding_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY embedding_jobs_service_all ON public.embedding_jobs
  FOR ALL TO service_role USING (true) WITH CHECK (true);
-- No anon/authenticated policies — edge/cron only
```

## Goals

1. Migration `YYYYMMDD_data040_embedding_jobs.sql` under `supabase/migrations/`.
2. Audit live DB for sync embed triggers — **verified 2026-05-31: none in migrations**; document `pg_trigger` probe in evidence. If found later, replace with enqueue-only trigger.
3. Document worker contract for VEC-004 (input: job row → output: upsert `*_embeddings`).
4. Seed job: enqueue all 44+43+43 existing rows with `status=skipped` OR one-time `pending` for rebuild test (operator choice in evidence).
5. RLS: service_role only; no client exposure.

## Done gate

| Check | Command / evidence |
|-------|-------------------|
| Table exists | Supabase MCP `list_tables` or `\d embedding_jobs` |
| RLS on | `source-command-supabase-rls-audit` or policy query |
| Dedup works | Insert duplicate `(entity_type, entity_id, content_hash)` → unique violation |
| No write stall | UPDATE restaurants row < 200ms without embed API call |
| Evidence | `tasks/data/evidence/data-040-embedding-jobs.md` |

## Out of scope

- Edge worker implementation → VEC-004 tail + separate OPS cron task
- Unified `semantic_embeddings` → DATA-051 Phase 2
- Anchor embeddings backfill → DATA-041 follow-up

## Related tasks

| ID | Relationship |
|----|--------------|
| VEC-001 | Prerequisite — index cleanup before new DDL |
| VEC-004 | Consumer — text builders + embed upsert |
| DATA-041–043 | Signal seed may enqueue re-embed after summary update |
