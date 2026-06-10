---
task_id: data-025
mvp_step: 25
title: Hermes rental analytics — scoring_logs + market_snapshots
layer: DATA
priority: P2
phase: Post-MVP
status: Not Started
estimated_effort: 6h
depends_on: ["data-019"]
skills: [mde-task-lifecycle, mde-supabase]
related:
  - ../../real-estate/real-estate-prd.md
description: Create batch-only Hermes output tables per PRD §15; read-only from app hot path.
---

# DATA-025 — Hermes rental analytics tables

## Gap (PRD §15)

Listed but **not in live DB:**

| Table | Purpose |
|---|---|
| `scoring_logs` | Hermes rank/lead scores (batch writes only) |
| `market_snapshots` | Weekly neighborhood/listing market stats |

## Rules

- Hermes **never mutates** `apartments` or `leads` in hot path
- OpenClaw **never** writes without approval (Part B PRD)
- Service_role or batch role INSERT only

## Proposed schema (sketch)

```sql
CREATE TABLE public.scoring_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('listing','lead','neighborhood')),
  entity_id uuid NOT NULL,
  model_version text NOT NULL,
  score numeric NOT NULL,
  features jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.market_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id uuid REFERENCES public.neighborhoods(id),
  snapshot_date date NOT NULL,
  metrics jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (neighborhood_id, snapshot_date)
);
```

## Acceptance criteria

- [ ] RLS: admin read; service_role write; anon denied
- [ ] Documented as **Phase 2 / Hermes** — not blocking Camila MVP
- [ ] Align with **data-022** neighborhood FK

## Out of scope

- Hermes model training
- OpenClaw WhatsApp
