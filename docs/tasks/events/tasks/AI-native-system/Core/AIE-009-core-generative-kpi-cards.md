---
id: AIE-009-core
title: Generative KPI cards on analytics
status: Not Started
priority: P0
phase: core
persona: roberto
linear: —
percent: 0
blocked_by: [AIE-008]
blocks: []
depends_on: []
wireframe: ../../wireframes/events/013-revenue-dashboard.md
---

# AIE-009-core — Generative KPI cards

## Objective

`useCopilotAction` with `available: "disabled"` renders revenue/tier charts when `salesInsightWorkflow` completes.

## Components

- `GenerativeChartCard` · `KpiCardRow` · `TierBreakdown`
- Mirror pattern from event cards (concierge) — one render per tool name

## Acceptance criteria

- Chat question → KPI cards appear in right panel without page navigation
- Cards use design tokens from DESIGN.MD (no hardcoded gray-*)
- Vitest: action render smoke
