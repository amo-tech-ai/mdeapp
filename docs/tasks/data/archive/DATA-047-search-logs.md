---
task_id: DATA-047
title: search_logs + rank_explanation observability
layer: DATA
phase: intel-1
priority: P0
status: Not Started
estimated_effort: 3h
depends_on: []
unblocks: [SEARCH-003, SEARCH-001, SEARCH-002]
blocks: []
skills: [mde-supabase, mde-task-lifecycle]
related:
  - ../../intelligence/intelligence-plan.md
  - ../../vector/VEC-006-semantic-search-logs-and-observability.md
description: Minimal search observability before hybrid tuning — query, slots, latency, grounding flag, rank_explanation JSON.
---

# DATA-047 — search_logs observability

## At a glance

| | |
|---|---|
| **For** | Sofia · Patricia (ops) |
| **Why now** | Without logs, signal tuning and latency debugging are impossible |
| **Rule** | **1 migration = search_logs only** |

## What we're building

```sql
CREATE TABLE public.search_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text text NOT NULL,
  intent text,
  slots jsonb NOT NULL DEFAULT '{}',
  tool_name text NOT NULL,  -- search-rentals | search-restaurants | ...
  results_count int NOT NULL DEFAULT 0,
  zero_results boolean GENERATED ALWAYS AS (results_count = 0) STORED,
  clicked_entity_type text,
  clicked_entity_id uuid,
  latency_ms int NOT NULL,
  grounding_used boolean NOT NULL DEFAULT false,
  hybrid_used boolean NOT NULL DEFAULT false,
  rank_explanation jsonb NOT NULL DEFAULT '[]',  -- [{ factor, score, note }]
  session_id text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX search_logs_created_at_idx ON public.search_logs (created_at DESC);
CREATE INDEX search_logs_zero_results_idx ON public.search_logs (zero_results) WHERE zero_results = true;

ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY search_logs_service_insert ON public.search_logs
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY search_logs_authenticated_own_select ON public.search_logs
  FOR SELECT TO authenticated USING (user_id = auth.uid());
-- Patricia admin read: Phase 2 admin policy
```

### rank_explanation example

```json
[
  { "factor": "rooftop_score", "score": 0.92, "note": "venue_signals join" },
  { "factor": "neighborhood", "score": 1.0, "note": "Provenza exact match" },
  { "factor": "hybrid_semantic", "score": 0.81, "note": "hybrid_search_restaurants" }
]
```

## App wiring (SEARCH-003 / Mastra)

1. `runAuditedSearch` or tool wrapper writes one row per search (service_role from Mastra route only).
2. Card click → optional PATCH or second insert with `clicked_entity_*` (Phase 1b — can defer click tracking).
3. **No client direct insert** — server only.

## Done gate

| Check | Evidence |
|-------|----------|
| Table + RLS | Supabase MCP |
| One search writes row | local `search-restaurants` with hybrid flag |
| rank_explanation populated when signals joined | SEARCH-003 evidence |
| p95 latency logged | `tasks/data/evidence/data-047-search-logs.md` |

## Real-world example

Camila searches *"quiet rooftop Provenza"* → log shows `latency_ms: 420`, `grounding_used: false`, `rank_explanation` cites `rooftop_score 0.88` — Patricia can tune weights without guessing.

## Out of scope (Phase 2 — VEC-006)

- Full `semantic_search_logs` with embedding snapshots
- Click stream analytics dashboard
- Gorse / external ranker
