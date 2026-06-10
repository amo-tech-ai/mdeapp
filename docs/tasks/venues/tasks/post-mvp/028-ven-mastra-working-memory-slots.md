---
task_id: ven-028
post_mvp_step: 028
title: Working memory venue slots
layer: mastra
priority: P1
status: Not Started
depends_on: [VEN-016]
skills: [mastra, copilotkit]
doc: ../docs/12-mastra-venues-routing.md
description: Extend conciergeWorkingMemorySchema with venue_kind, place_id, booking id.
---

# VEN-028 — Mastra — working memory venue slots


## At a glance

| | |
|---|---|
| **For** | Multi-turn chat users |
| **Surface** | `/chat` useCoAgent state |
| **Layer** | mastra |

## What we're building

Extend concierge working memory with last venue kind, place_id, name, and booking id.

## Features

- Zod schema + types.ts sync
- Survives thread scope
- Powers follow-up booking questions

## Agents & tools

`conciergeAgent` memory

## Workflows

None

## User journey

1. User books then asks 'change to 6 people'.
2. Agent reads lastBookingRequestId.
3. Updates or clarifies without losing context.

## Fields (add to agent Zod + types.ts)

- `lastVenueKind`: cafe | restaurant | nightlife
- `lastPlaceId`, `lastVenueName`
- `lastBookingRequestId`
- `lastGroundedPlaceResults[]` (optional)

## Acceptance

- [ ] `useCoAgent` reads updated fields after tool calls
- [ ] Three-way sync agent / types / UI
