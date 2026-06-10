---
task_id: data-009
mvp_step: 09
title: Supabase schema migrations — venue booking, anchors, rental indexes
layer: DATA
priority: P0
status: Done
verified: 2026-05-29
evidence: ../evidence/data-009-migrations.md
estimated_effort: 6h
depends_on: ["data-002"]
unblocks: ["data-003", "data-005", "data-008"]
blocks: []
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
related:
  - ../audit-supabase.md
  - ../supabase-plan.md
  - ../plan/23-audit.md
  - ../../events/EVP-003-core-stripe-webhook-secret-audit.md
description: Apply M1 venue_booking_requests, M2 venue_anchors, M3 apartments price_daily indexes per supabase-plan.md.
---

# DATA-009 — schema migrations (M1–M3)

## At a glance

| | |
|---|---|
| **For** | sanjiovani (operator) |
| **Surface** | Supabase migrations — no mdeapp UI |
| **Layer** | DATA |

## What we're building

Three surgical migrations from [`../supabase-plan.md`](../supabase-plan.md) Batch 1:

| Migration | Table / index | Unblocks |
|---|---|---|
| **M1** | `venue_booking_requests` + RLS | Tourist venue booking (CAF-008) |
| **M2** | `venue_anchors` (café, nightclub) + RLS | **data-035**, data-003, data-005 seeds |
| **M3** | `idx_apartments_price_daily_*` | Camila `search-rentals.ts` — see also **data-019** |

## Goals

1. Add SQL files under `supabase/migrations/` (mdeai repo) — one file or three, dated `YYYYMMDD_*`.
2. M1: guest INSERT via edge only (no anon RLS on table); authenticated own-row SELECT/INSERT.
3. M2: public SELECT active anchors; service_role write for seeds.
4. M3: use non-`CONCURRENTLY` index in MCP apply (44-row table) or `CREATE INDEX CONCURRENTLY` in maintenance-window migration per [mde-supabase](../../../.agents/skills/mde-supabase/references/project-rules/supabase-migrations.md).
5. Wire M1 optional FK to M2 `venue_anchor_id` after M2 lands.
6. Run RLS gap query — only `spatial_ref_sys` off.

## Acceptance criteria

- [x] Migrations apply clean on project `zkwcbyxiwklihegjhuql`
- [x] `\d venue_booking_requests` + `\d venue_anchors` show expected columns
- [x] `EXPLAIN` on rental filter uses `price_daily` index
- [x] RLS policies use `(SELECT auth.uid())` on `venue_booking_requests` (mde-supabase rule)
- [x] Evidence in [`../evidence/data-009-migrations.md`](../evidence/data-009-migrations.md)
- [x] task-verifier gate 9 N/A (migration-only) — recorded in evidence

## Verification SQL

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('venue_booking_requests', 'venue_anchors');

SELECT indexname FROM pg_indexes
WHERE tablename = 'apartments' AND indexname LIKE '%price_daily%';
```

## Real-world example

**Tourist** submits a Provenza nightclub table request → row lands in `venue_booking_requests` with `venue_kind=nightclub` and `place_id` from `venue_anchors`.
