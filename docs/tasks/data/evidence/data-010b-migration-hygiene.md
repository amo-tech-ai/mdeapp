---
task: data-010b
date: 2026-05-30
project: zkwcbyxiwklihegjhuql
method: repo file rename + SQL body sync (no new apply_migration)
status: pass
---

# DATA-010b — migration hygiene evidence

## Verdict

**PASS** — Repo migration history aligned with live Supabase. Orphan archived. No duplicate DATA-010 file in `supabase/migrations/`. Advisor gate unchanged.

## Problem fixed

| Before | After |
|--------|-------|
| Remote: `20260530012233_data010_search_path_hardening` | unchanged (already applied) |
| Repo: `20260530120000_data010_search_path_hardening.sql` | **`20260530012233_data010_search_path_hardening.sql`** |
| `compute_lead_score` missing `::jsonb` casts in repo | synced to match live function body |

## Repo paths

| Artifact | Path |
|----------|------|
| **Canonical migration** | [`supabase/migrations/20260530012233_data010_search_path_hardening.sql`](../../../supabase/migrations/20260530012233_data010_search_path_hardening.sql) |
| Evidence copy | [`migrations/20260530012233_data010_search_path_hardening.sql`](migrations/20260530012233_data010_search_path_hardening.sql) |
| Archived orphan | [`migrations/_archive/20260530120000_data010_search_path_hardening.orphan.sql`](migrations/_archive/20260530120000_data010_search_path_hardening.orphan.sql) |

## Remote migration list (MCP `list_migrations`, 2026-05-30)

DATA-010 entry (single):

```text
20260530012233 | data010_search_path_hardening
```

No `20260530120000` on remote — confirms orphan was repo-only.

**Local `supabase migration list`:** CLI not linked (403 privileges). MCP list used as source of truth.

## Duplicate push check

| Check | Result |
|-------|--------|
| `supabase/migrations/*data010*` count | **1** file (`20260530012233`) |
| Orphan `20260530120000` in `supabase/migrations/` | **absent** ✅ |
| Remote already has `20260530012233` | ✅ |
| Next `db push` would re-apply DATA-010? | **No** — repo version matches remote version |

## Advisor re-check (security)

| Lint | Count |
|------|------:|
| `function_search_path_mutable` | **0** ✅ |

## P2 follow-up (not in scope)

- Rate-limit authenticated `chat-lead-capture` by `user_id` + IP

## Unblocks

**DATA-021** showings bridge — migration history clean for next DDL slice.

## Score

| Scope | Score |
|-------|------:|
| DATA-010b acceptance | **100/100** |
