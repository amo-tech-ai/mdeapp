---
task_id: ven-026
post_mvp_step: 026
title: normalizeVenueToolOutput + kind discriminator
layer: mastra
priority: P0
status: Not Started
depends_on: [ven-011]
unblocks: [ven-012]
skills: [mastra, copilotkit]
doc: ../docs/12-mastra-venues-routing.md
description: Extend normalize-tool-output for restaurant/nightlife pin categories and card kinds.
---

# VEN-026 — Mastra — normalizeVenueToolOutput


## At a glance

| | |
|---|---|
| **For** | CopilotKit UI |
| **Surface** | Tool output → cards |
| **Layer** | mastra |

## What we're building

Normalize Mastra tool JSON into stable card/detail shapes for CopilotKit renders and map pins.

## Features

- Shared normalizer for grounded + restaurants
- Pin category for F50 map
- MASTRA-046 alignment

## Agents & tools

All venue search tools

## Workflows

None

## User journey

1. Tool returns raw grounding rows.
2. Normalizer maps to VenuePlaceDetail.
3. Cards and pins render consistently.

Extends MASTRA-046 pattern.

## Goals

1. Map tool outputs → `category`: cafe | restaurant | nightlife | event.
2. Pin merge in F50 / map-ui-sync without duplicate markers.
3. Rich-card dedup per kind.

## Acceptance

- [ ] Restaurant tool pins ≠ café pins on same map state
- [ ] Vitest fixture for each tool output shape
