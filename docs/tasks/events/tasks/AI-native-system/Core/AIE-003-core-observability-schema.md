---
id: AIE-003-core
title: Observability schema — approval_logs + workflow_runs
status: Not Started
priority: P0
phase: core
persona: patricia
linear: —
percent: 0
blocked_by: []
blocks: [AIE-019, AIE-026]
depends_on: []
wireframe: ../../wireframes/038-shared-state.md
plan: ../../../plans/04-AI-native-system.md §7
---

# AIE-003-core — Observability schema

## Objective

Migrate tables so HITL and workflow execution are auditable — required before sponsor/approval screens claim Done.

## Scope

| Table | Columns (min) | RLS |
|-------|---------------|-----|
| `approval_logs` | user_id, action_type, entity_type, entity_id, decision, payload_hash | organizer + admin read |
| `workflow_runs` | workflow_id, event_id, status, step_results, duration_ms | host scoped |

## Acceptance criteria

- Supabase migration applied with RLS + ≥1 policy each
- Types in `mdeapp` generated/updated
- Wizard publish HITL writes `approval_logs` row (can follow AIE-005)

## Notes

Design only in wireframe 038 until migration lands. Partial coverage via `ai_runs` tool span RPCs today.
