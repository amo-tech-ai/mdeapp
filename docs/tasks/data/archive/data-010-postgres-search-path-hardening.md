---
task_id: data-010
mvp_step: 10
title: Postgres function search_path hardening batch
layer: DATA
priority: P1
status: Done
estimated_effort: 4h
depends_on: ["data-009"]
unblocks: []
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
related:
  - ../audit-supabase.md
  - ../plan/23-audit.md
  - ../evidence/data-010-search-path.md
  - ../../../supabase/migrations/20260530012233_data010_search_path_hardening.sql
  - data-010b-postgres-migration-hygiene.md
description: Pin search_path on functions flagged by advisor lint 0011 — prioritize Andrés ticket/lead RPCs; export before/after MCP evidence.
verified: MCP apply_migration 2026-05-30 — function_search_path_mutable 10→0
evidence: ../evidence/data-010-search-path.md
---

# DATA-010 — search_path hardening

## At a glance

| | |
|---|---|
| **For** | sanjiovani |
| **Surface** | Supabase SQL migrations (`supabase/migrations/`) |
| **Layer** | DATA / security |

## What we're building

Batch migration(s) pinning `search_path` on functions flagged by Supabase database advisor lint [`0011_function_search_path_mutable`](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable).

**Live baseline (MCP `get_advisors` security, 2026-05-30):**

| Lint | Count |
|------|------:|
| `function_search_path_mutable` | **10** |
| `anon_security_definer_function_executable` | 43 (document in evidence — **out of scope** for Done) |
| `authenticated_security_definer_function_executable` | 68 (document — **out of scope**) |

**Pinning standard (mde-supabase):**

- **Preferred** for `SECURITY DEFINER`: `SET search_path = ''` + fully qualified `public.*` names ([supabase-database-functions.md](../../../.agents/skills/mde-supabase/references/project-rules/supabase-database-functions.md)).
- `SET search_path = public` (or `public, pg_temp`) clears the linter when already applied — acceptable for invoker-style helpers; upgrade DEFINER revenue RPCs to `''` when touching them.

## Scope (priority order)

### P0 — revenue / guest order path (Andrés)

Still flagged 2026-05-30:

- `get_anonymous_order`
- `ticket_payment_finalize_response`
- `ticket_payment_refund`

**Already pinned (not on mutable list — verify only, no migration unless body lacks qualified names):**

- `ticket_payment_finalize` — `search_path = public, pg_temp`
- `check_rate_limit` — `search_path = public, pg_temp`
- `insert_trip_item_for_user` — `search_path = public` (DATA-027)

### P1 — lead + messaging

- `compute_lead_score`
- `record_check_in`
- `update_conversation_on_message`

### P2 — triggers + FTS

- `fts_spanish`, `fts_array_to_text`
- `trigger_set_timestamps`, `set_updated_at`

**Not flagged today:** `semantic_search_*`, `hybrid_search_*` (already `search_path = ''`).

## Goals

1. Export full security advisor via MCP `get_advisors` type=security → evidence (counts + flagged function names).
2. Iterate with MCP `execute_sql` — **do not** use `apply_migration` for iteration.
3. One migration per batch ≤20 functions in `supabase/migrations/`.
4. Re-run advisor — **P0 names absent** from `function_search_path_mutable`; total count **0** when all 10 fixed.
5. No behavior change — note in evidence if any signature/body edit beyond `search_path`.

## Acceptance criteria

- [x] P0 RPCs pinned in migration; absent from mutable list after re-run
- [x] P1 + P2 batch applied (10/10 flagged functions)
- [x] Evidence: before/after lint counts in [`tasks/data/evidence/data-010-search-path.md`](../evidence/data-010-search-path.md)
- [x] Evidence notes anon/auth `security_definer_function_executable` counts (Phase 2 backlog)
- [x] `function_search_path_mutable`: **10 → 0** (2026-05-30)

## Out of scope

- Rewriting RPC logic beyond qualified names for `search_path = ''`
- Fixing `anon_security_definer_function_executable` / `authenticated_security_definer_function_executable` (DATA-011 matrix / Phase 2)
- New features

## Real-world example

**Andrés** guest checkout — `get_anonymous_order` and `ticket_payment_finalize_response` cannot resolve objects via a hijacked schema when `search_path` is pinned.
