---
task_id: ven-029
post_mvp_step: 029
title: Filter chips + nightlife instructions
layer: copilot
priority: P1
status: Not Started
depends_on: [ven-025]
skills: [copilotkit-develop]
doc: ../docs/13-copilotkit-venues-routing.md
description: Chat filter chips for restaurant/nightlife; scoped messages to concierge.
---

# VEN-029 — Copilot — filter chips + nightlife


## At a glance

| | |
|---|---|
| **For** | Tourist |
| **Surface** | `/chat` filter chips + instructions |
| **Layer** | copilot |

## What we're building

Nightlife filter chips in chat UI + co-agent instructions aligned with ven-025 routing.

## Features

- Chip UI for vibe/area filters
- useCopilotReadable context
- ven-025 instruction sync

## Agents & tools

`conciergeAgent` reads chip context

## Workflows

None

## User journey

1. Tourist taps 'Reggaeton' chip.
2. Context sent to agent.
3. Nightlife search narrows to Provenza clubs.

## Goals

1. Chips: `[Colombian]` `[Paisa]` `[After 11pm]` `[Live DJ]` etc. per 008/007 wires.
2. `useCopilotAdditionalInstructions` or filter bar injects scope.
3. Nightlife safety strip once per thread.

## Acceptance

- [ ] Chip click sends scoped query without breaking thread
- [ ] Playwright optional smoke
