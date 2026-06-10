---
id: AIE-016-mvp
title: sponsorMatchWorkflow + fit scores
status: Not Started
priority: P1
phase: mvp
persona: roberto
linear: SAN-132
percent: 0
blocked_by: [AIE-008]
blocks: [AIE-017]
depends_on: []
wireframe: ../../wireframes/events/016-sponsor-opportunities.md
plan: ../../../plans/04-AI-native-system.md §8
---

# AIE-016-mvp — Sponsor match workflow

## Objective

Rank sponsors by event fit — e.g. Fashion Night → jewelry 96%, fintech 34%.

## Steps

1. Event tags + audience from DB
2. Prospect list (CRM or Firecrawl queue)
3. Deterministic score + LLM explain panel

## Acceptance criteria

- `sponsorMatchWorkflow` registered
- FitScoreBadge UI per wireframe 016
- HITL before any outreach send
