task_id: ven-041
mvp_step: 041
id: VEN-041
title: coffee_tour_search_logs + coffee_tour_cache
status: Open
priority: P1
phase: CTI-A
effort: 1h
owner: claude
depends_on: [VEN-032]
blocks: [VEN-042]
skill: [mde-supabase, task-verifier]
mcp: [user-supabase]
verify_skill: task-verifier
---

# VEN-041 — Logs + cache tables

## In plain English

Add **ops tables** so Patricia can see what tourists searched for and cache expensive Google Places responses — without bloating the first schema migration.

**Second migration** after VEN-032. Not required for the first chat demo, but needed before Phase A closeout (VEN-042).

## User story

**As Patricia (admin),** I want search queries and API cache rows logged server-side, **so that** I can debug slow tour searches and control Places API cost without exposing logs to anonymous users.

## Real-world example

When a Tourist types *“coffee farm tour near Envigado”*, `coffee_tour_search_logs` stores the query, result IDs, and latency; a repeat enrich for the same `place_id` hits `coffee_tour_cache` instead of another Details call.

## Goals

1. `coffee_tour_search_logs` + `coffee_tour_cache` tables with RLS.
2. Independent migration — rollback does not drop core tables.
3. Optional wiring from `searchCoffeeTours` in Phase A.

## Success criteria

1. RLS enabled; service-role writes only from server/edge.
2. `searchCoffeeTours` (VEN-036) may insert logs after this lands — **optional in Phase A** if timeboxed.
3. Migration independent — rollback does not drop core tables.

## Tables

| Table | Purpose |
|-------|---------|
| `coffee_tour_search_logs` | query, filters, result ids, latency |
| `coffee_tour_cache` | Optional raw Places/API snapshots (TTL) |
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-041](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-041-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending (optional track) |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | See VEN-VERIFY-MATRIX § VEN-041 |
| **MCP** | Supabase / mastra / maps per task |
| **Chrome DevTools** | Tour UI routes when implemented |
| **Playwright** | Tour specs when implemented |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Optional coffee-tour track — verify after implementation

