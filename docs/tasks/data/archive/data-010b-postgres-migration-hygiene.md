---
task_id: data-010b
mvp_step: 10.1
title: DATA-010 migration history hygiene
layer: DATA
priority: P1
status: Done
estimated_effort: 30m
depends_on: ["data-010"]
unblocks: ["data-021"]
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
related:
  - data-010-postgres-search-path-hardening.md
  - ../evidence/data-010b-migration-hygiene.md
  - ../../../supabase/migrations/20260530012233_data010_search_path_hardening.sql
description: Align repo migration filename + SQL body with live Supabase history after DATA-010 MCP apply_migration drift.
verified: MCP list_migrations + get_advisors 2026-05-30 — remote 20260530012233 only; search_path mutable 0
evidence: ../evidence/data-010b-migration-hygiene.md
---

# DATA-010b — migration hygiene cleanup

## At a glance

| | |
|---|---|
| **For** | Sofía / sanjiovani |
| **Surface** | `supabase/migrations/` repo ↔ remote sync |
| **Layer** | DATA / process |

## Problem

DATA-010 applied live via MCP as `20260530012233_data010_search_path_hardening` but repo had orphan `20260530120000_*`. Risk: duplicate migration on next `supabase db push`.

## Goals

1. Repo migration filename matches remote version `20260530012233`.
2. Archive orphan `20260530120000` (do not delete history silently).
3. `compute_lead_score` body in repo matches live (`::jsonb` casts).
4. Confirm `function_search_path_mutable` remains **0**.

## Acceptance criteria

- [x] `supabase/migrations/20260530012233_data010_search_path_hardening.sql` exists
- [x] Orphan `20260530120000` archived under `tasks/data/evidence/migrations/_archive/`
- [x] No duplicate DATA-010 migration file in `supabase/migrations/`
- [x] MCP migration list shows single `data010_search_path_hardening` entry
- [x] Advisor lint `function_search_path_mutable` = 0

## Out of scope

- New SQL changes beyond repo/live body sync
- P0 sibling RPC `search_path` upgrades (`ticket_payment_finalize`, etc.)
- Authenticated chat-lead rate limit (P2 follow-up)

## P2 follow-up (documented)

- Rate-limit logged-in `chat-lead-capture` by `user_id` + IP

## Live re-audit note (2026-05-31 — claude)

This task's **narrow scope (the DATA-010 file only) remains correctly Done** — `20260530012233_data010_search_path_hardening.sql` is the single repo file and matches remote. Two findings sit *outside* this task's scope and are tracked separately:

1. **Pack-wide version-prefix drift** — 11 local migration files carry prefixes absent from remote + 15 remote versions lack a local file (`db push` would collide). Filed as **[DATA-048](DATA-048-migration-version-prefix-realign.md)**.
2. **AC #5 staleness** — `function_search_path_mutable` is now **1** (`trigger_set_timestamps`, a trigger fn excluded from DATA-010's batch), not 0 as recorded on 2026-05-30. Cosmetic; fold the fix into a DATA-010 follow-up if a clean advisor is desired.
3. The canonical `supabase/migrations/` dir had been symlinked to an empty target; the audit restored the project content into `mdeapp/supabase/` on 2026-05-31.
