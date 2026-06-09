---
id: AIE-004-core
title: ai_runs prod write fix
status: Not Started
priority: P0
phase: core
persona: patricia
linear: SAN-704
percent: 0
blocked_by: []
blocks: [AIE-026]
depends_on: []
wireframe: —
plan: ../../../plans/04-AI-native-system.md §7
---

# AIE-004-core — ai_runs prod writes

## Objective

Agent turns persist to `ai_runs` on Vercel prod — observability is fake until this closes.

## Scope

- Trace `/api/copilotkit` → `LoggingMastraAgent` → insert path
- Fix env, service role carve-out, or RLS blocking prod writes
- Verify one turn creates row with `thread_id`, model, status

## Acceptance criteria

- Prod chat turn → row in `ai_runs` (Supabase SQL proof)
- SAN-704 → Done in Linear
- No service-role key in client bundle
