---
task_id: ven-031
post_mvp_step: 031
title: Vitest card + tool render tests
layer: vitest
priority: P1
status: Not Started
depends_on: [ven-009, ven-012]
skills: [vitest, testing]
doc: ../docs/13-copilotkit-venues-routing.md
description: Snapshot/unit tests for RestaurantResultCard, nightlife grounded render.
---

# VEN-031 — Vitest — Copilot card renders


## At a glance

| | |
|---|---|
| **For** | Sofía |
| **Surface** | Vitest + RTL |
| **Layer** | vitest |

## What we're building

Component tests for Restaurant/Nightlife/Café cards — snapshots and required fields.

## Features

- Vitest renders
- Mock tool payloads

## Agents & tools

Mock CopilotKit actions

## Workflows

None

## User journey

1. PR changes card layout.
2. Vitest fails on missing cuisine line.
3. Fix before merge.

## Coverage

- RestaurantResultCard required fields
- Grounded render kind split (café vs nightlife mock)
- mastra-tool-action-names dual registration smoke

## Acceptance

- [ ] `npm test` includes new specs
- [ ] No snapshot churn on unrelated CSS
