---
id: AIE-007-core
title: salesInsightWorkflow
status: Not Started
priority: P0
phase: core
persona: roberto
linear: —
percent: 0
blocked_by: [AIE-006]
blocks: [AIE-008, AIE-009]
depends_on: []
wireframe: ../../wireframes/events/013-revenue-dashboard.md
plan: ../../../plans/04-AI-native-system.md §5
---

# AIE-007-core — salesInsightWorkflow

## Objective

Deterministic workflow: fetch sales → compute deltas → LLM narrates only.

## Steps

1. `get_sales_summary` (SQL)
2. Compare prior period / prior event (SQL)
3. Gemini narrative + suggested actions (read-only)

## Acceptance criteria

- Workflow registered in Mastra index
- Unit test: mocked orders → stable numeric output
- LLM step receives pre-computed numbers in prompt context
- Invoked from hostOps chat toolbar 📊 action
