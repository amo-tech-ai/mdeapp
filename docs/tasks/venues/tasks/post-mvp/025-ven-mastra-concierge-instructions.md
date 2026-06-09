---
task_id: ven-025
post_mvp_step: 025
title: Concierge venue routing instructions
layer: mastra
priority: P0
status: Not Started
depends_on: [ven-011]
unblocks: [ven-029]
skills: [mastra, gemini]
doc: ../docs/12-mastra-venues-routing.md
description: Agent instructions — café vs restaurant vs nightlife vs events; never mix tools.
---

# VEN-025 — Mastra — concierge venue instructions


## At a glance

| | |
|---|---|
| **For** | All `/chat` users |
| **Surface** | Agent system instructions |
| **Layer** | mastra |

## What we're building

Concierge routing rules: when to use cafe vs restaurant vs nightlife vs events tools.

## Features

- Intent disambiguation thresholds
- Never mix ticketed events with nightlife
- Booking tool invocation rules

## Agents & tools

`conciergeAgent` instructions

## Workflows

None

## User journey

1. Ambiguous query: 'dinner and dancing'.
2. Agent asks or splits restaurant then nightlife.
3. Correct tool per kind.

## Rules to encode

| Query | Tool | Never |
|-------|------|-------|
| café / WiFi / coffee | `search-grounded-places` cafe | search-restaurants |
| dinner / cuisine | `search-restaurants` | cafe intent |
| club / reggaeton / bar | `search-grounded-places` nightlife | search-events |
| tickets / festival | `search-events` | nightlife intent |

## Acceptance

- [ ] Golden queries data-006 pass routing (manual or eval)
- [ ] Safety line for nightlife threads (Medellín taxis)
