---
id: AIE-006-core
title: hostOps read tools — list events + sales summary
status: Not Started
priority: P0
phase: core
persona: roberto
linear: —
percent: 0
blocked_by: [AIE-005]
blocks: [AIE-007, AIE-008]
depends_on: []
wireframe: ../../wireframes/events/013-revenue-dashboard.md
plan: ../../../plans/02-mastra-events.md
---

# AIE-006-core — hostOps read tools

## Objective

Grounded read tools for Roberto — numbers from SQL, never hallucinated revenue.

## Tools

| Tool | Input | Output |
|------|-------|--------|
| `list_host_events` | organizer_id, status filter | event rows |
| `get_sales_summary` | event_id or all | revenue, orders, tier breakdown |

## Acceptance criteria

- Tools on `hostOpsAgent` only
- RLS: organizer sees own events only
- Vitest with mocked Supabase or fixture DB
- Tool spans recorded via existing RPC

## Files (expected)

`src/mastra/tools/host-*.ts`, service client via approved carve-out
