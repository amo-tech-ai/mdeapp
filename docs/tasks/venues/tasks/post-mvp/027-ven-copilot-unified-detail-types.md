---
task_id: ven-027
post_mvp_step: 027
title: Unified VenuePlaceDetail types
layer: copilot
priority: P1
status: Not Started
depends_on: [ven-010, ven-013]
skills: [copilotkit-develop]
doc: ../docs/13-copilotkit-venues-routing.md
description: Refactor rental-ui-context — shared base + kind-specific extensions.
---

# VEN-027 — Copilot — unified VenuePlaceDetail types


## At a glance

| | |
|---|---|
| **For** | All detail panel users |
| **Surface** | TypeScript types |
| **Layer** | copilot |

## What we're building

Unified VenuePlaceDetail type shared across café, restaurant, nightlife panels and normalizer.

## Features

- Single source in types.ts
- Kind-specific optional fields
- ven-010 / ven-013 consumers

## Agents & tools

None

## Workflows

None

## User journey

1. Normalizer emits VenuePlaceDetail.
2. Any detail panel consumes same shape.
3. Less duplication across three UIs.

## Goals

1. Base: placeId, title, pinId, rating, mapsUrl, photoName.
2. Extensions: CafeVenueDetail | RestaurantVenueDetail | NightlifeVenueDetail.
3. Single `openVenueDetail(kind, ...)` or typed openers — match existing patterns.

## Acceptance

- [ ] Typecheck clean; no `any` on detail panels
