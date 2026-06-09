task_id: ven-032
mvp_step: 032
id: VEN-032
title: Supabase coffee_tours core tables + RLS
status: Open
priority: P0
phase: CTI-A
effort: 3h
owner: claude
depends_on: [F08]
blocks: [VEN-041, VEN-033, VEN-034, VEN-044, VEN-047]
replaces: CTI-001 (split)
roadmap: ../10-cafeintelligence-plan.md
listings_ref: ../../listings/cafes/06-coffee-tours.md
skill: [mde-supabase, mde-task-lifecycle, task-verifier]
mcp: [user-supabase]
mcp_verify_before_code:
  - list_tables — no duplicate coffee_tours
  - get_advisors — RLS on every new table
verify_skill: task-verifier
---

# VEN-032 — Core schema + RLS

## In plain English

Create the **database home** for coffee farm tours in Supabase — names, neighborhoods, Google `place_id`, sources, and “why we recommend this” text — with row-level security so tourists cannot overwrite Patricia’s curated data.

**Split from monolithic CTI-001.** Ship **before** logs (VEN-041) or embeddings (VEN-044).

## User story

**As Patricia (admin),** I need tour data stored in real tables with RLS, **so that** when a Tourist asks Camila’s chat for farm tours, the agent reads facts from Postgres — not invented listings.

## Real-world example

After this task, a row like *Tour Urbano La Sierra* can exist with `slug`, `neighborhood: La Sierra`, and a linked `coffee_tour_profiles` row explaining social-impact coffee — ready for VEN-034 seed and VEN-036 search.

## Goals

1. Five core tables migrated with RLS on user-owned data only.
2. `get_advisors` clean — no public write to canonical tours.
3. Unique `slug` and `place_id` where present.
4. No pgvector in this migration (VEN-044 later).

## Success criteria

1. `apply_migration` succeeds; `get_advisors` clean on all five tables.
2. Anonymous client cannot `INSERT` into `coffee_tours`.
3. Authenticated user can `INSERT` own row in `coffee_tour_user_interactions` only.
4. Unique `slug`; unique `place_id` where not null.
5. **No** `pgvector` extension required in this migration.

## Tables (this task only)

| Table | Purpose |
|-------|---------|
| `coffee_tours` | Canonical tour rows |
| `coffee_tour_sources` | URL / provenance |
| `coffee_tour_profiles` | Narrative (`ai_summary`, `best_for`) — not factual without confidence |
| `coffee_tour_rank_signals` | Optional precomputed signals |
| `coffee_tour_user_interactions` | save/compare — **RLS per `auth.uid()`** |

**Not in this migration:** `coffee_tour_search_logs`, `coffee_tour_cache`, `coffee_tour_embeddings` → VEN-041 / VEN-044.

## Do not

- Store service role in `mdeapp/src/**`.
- Enable semantic search claims in Phase A (embeddings = VEN-044).
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-032](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-032-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending (optional track) |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | See VEN-VERIFY-MATRIX § VEN-032 |
| **MCP** | Supabase / mastra / maps per task |
| **Chrome DevTools** | Tour UI routes when implemented |
| **Playwright** | Tour specs when implemented |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Optional coffee-tour track — verify after implementation

