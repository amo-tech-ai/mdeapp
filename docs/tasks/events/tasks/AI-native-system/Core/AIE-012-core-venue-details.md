---
id: AIE-012-core
title: Venue details /venues/[slug]
status: Not Started
priority: P0
phase: core
persona: roberto
linear: SAN-499
percent: 0
blocked_by: [AIE-011]
blocks: [AIE-020]
depends_on: []
wireframe: ../../wireframes/events/030-venue-details.md
---

# AIE-012-core — Venue details

## Objective

Peerspace-style venue detail: photos, capacity, amenities, pricing, map, AI suitability score.

## Scope

- `/venues/[slug]` page
- CTA: request booking · use in event wizard (`set_venue`)
- Nearby restaurants (concierge places tool, MVP-lite OK)

## Acceptance criteria

- Slug route 200 with real venue seed or Places id
- `hostEventAgent` `set_venue` accepts venue from this page
- Mobile sticky CTA per DESIGN.MD
