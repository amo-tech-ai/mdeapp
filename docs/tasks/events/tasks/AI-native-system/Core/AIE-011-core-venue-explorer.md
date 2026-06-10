---
id: AIE-011-core
title: Venue explorer /venues
status: Not Started
priority: P0
phase: core
persona: roberto
linear: SAN-498
percent: 0
blocked_by: [AIE-001]
blocks: [AIE-012]
depends_on: []
wireframe: ../../wireframes/events/029-venue-explorer.md
spec: ../../../specs/venue-booking/
---

# AIE-011-core — Venue explorer

## Objective

First-class venue product at `/venues` — map search, capacity filters, AI suitability scores. **Not** wizard-only compare (025).

## Scope

- List + map dual pane per wireframe 029
- Places/DB hybrid per VEN-004–006 specs
- Optional `venueShortlistWorkflow` for top-5 ranking

## Acceptance criteria

- Route LIVE in sitemap
- Map pins with `mapId` on parent Map
- Field masks on all Places calls
- Browser: search Laureles → ≥1 venue card + pin

## Note

025-venue-comparison remains wizard step — does not satisfy this task.
