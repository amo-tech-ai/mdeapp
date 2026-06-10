---
id: VEN-050
title: Extract coffeeTourSearchWorkflow from concierge
status: Open
priority: P3
phase: CTI-C
effort: 3h
owner: claude
depends_on: [VEN-036, VEN-042]
blocks: []
skill: [mastra, mde-task-lifecycle]
mcp: [user-mastra]
---

# VEN-050 — coffeeTourSearchWorkflow

## In plain English

Refactor tour search into a **Mastra workflow** (classify → search → enrich → rank) so `conciergeAgent` stays smaller and tour logic is testable on its own.

## User story

**As Sofía (dev),** I want tour steps in one workflow file, **so that** changes to ranking do not risk breaking restaurant or rental routing in concierge.

## Real-world example

Same smoke query as VEN-040 still passes after refactor — `conciergeAgent` delegates to `coffeeTourSearchWorkflow` but CopilotKit still uses `name: "conciergeAgent"`.

## Goals

1. Extract steps from concierge into workflow.
2. Registry + CopilotKit agent name unchanged.
3. Smoke parity with Phase A.

## Steps

1. Classify tour intent
2. `searchCoffeeTours`
3. Optional `enrichCoffeeTourWithPlaces`
4. `rankCoffeeTours`
5. Return tool result

## Success criteria

1. Same smoke output as VEN-040 after refactor.
2. Concierge delegates to workflow — agent registry unchanged for CopilotKit name.
3. Vitest covers workflow steps in isolation where practical.
