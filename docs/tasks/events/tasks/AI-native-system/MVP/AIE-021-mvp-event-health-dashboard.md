---
id: AIE-021-mvp
title: Event health dashboard
status: Not Started
priority: P1
phase: mvp
persona: roberto
linear: —
percent: 0
blocked_by: [AIE-008, AIE-013]
blocks: []
depends_on: []
wireframe: ../../wireframes/events/032-event-health.md
---

# AIE-021-mvp — Event health

## Objective

`/host/events/[id]/health` — AI insights: sales pace, venue mismatch, marketing weak, suggested actions.

## Factors

Sales pace · venue quality · engagement · refunds (when available)

## Acceptance criteria

- Health score 0–100 with explain panel
- `hostOpsAgent` + workflow — not new agent
- Generative action cards with HITL for mutations
