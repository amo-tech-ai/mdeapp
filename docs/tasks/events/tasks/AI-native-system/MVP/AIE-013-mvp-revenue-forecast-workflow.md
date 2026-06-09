---
id: AIE-013-mvp
title: revenueForecastWorkflow + forecast card
status: Not Started
priority: P1
phase: mvp
persona: roberto
linear: —
percent: 0
blocked_by: [AIE-001, AIE-008]
blocks: []
depends_on: [AIE-007]
wireframe: ../../wireframes/events/026-revenue-forecast.md
plan: ../../../plans/04-AI-native-system.md §5
---

# AIE-013-mvp — Revenue forecast

## Objective

Pace → projected attendance → revenue range. Numbers from SQL; LLM explains pace only.

## Acceptance criteria

- Workflow steps: sales pace · compare similar events · narrative
- Generative forecast card on `/host/analytics`
- Toolbar 📈 invokes workflow
- Vitest with fixture orders
