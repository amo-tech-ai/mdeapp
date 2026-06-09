---
id: UX-025
title: RestaurantCard rich — photo, rating, badges, detail panel
status: Done
priority: P1
phase: Card unification M2
effort: 6-8h
owner: claude
depends_on: [UX-022]
blocks: [UX-026, UX-028]
recommended_after: [UX-023]
risk: 🟡 Medium
complexity: M
skill: [mde-task-lifecycle, shadcn, mde-maps, copilotkit-integrations, testing]
related:
  - UX-010-CARD-UNIFICATION-STRATEGY.md
  - ../tests/22-card-audit.md
description: Replace PlaceResultCard as primary restaurant renderer with RestaurantCard on ResultCardShell — photo, rating, cuisine/price/open badges, Directions/Details, VenueDetailSheet or place detail.
---

# UX-025 — RestaurantCard rich (M2)

## Purpose

Tourist asking "best ramen Poblado" gets café-quality cards, not title + plain link.

## Affected files

| Create | Modify |
|--------|--------|
| `restaurant-card.tsx` | `search-tool-renders.tsx` restaurant branch |
| | `domain-results.tsx` renderCard |
| | Reuse `places-display` formatters, `placesPhotoProxyUrl` |

## Data source

Consume existing restaurant tool payload fields (place_id, rating, photo, price_level, open_now) — **no tool schema change**.

## Detail panel

Minimum: `VenueDetailSheet` with place summary + Maps links. Full Places enrichment optional follow-up.

## Tests

- Vitest: maps sparse payload → glyph placeholder, no crash.
- Vitest: full payload → photo + Badge price + rating line.
- Playwright: restaurant query → N rich cards, 0 side-panel dup.

## Acceptance

- [x] Restaurant branch renders `RestaurantCard`, not bare `PlaceResultCard`.
- [x] Details CTA opens `CafeDetailPanel` via `openCafeDetail` (shared place sheet).
- [x] Map pin sync via UX-022 contract.
- [x] Vitest + `test:e2e:restaurant-fast-path` pass (2026-06-01).

## Flow diagram

```mermaid
flowchart LR
  Tool[searchRestaurantsTool] --> Shell[ResultCardShell]
  Shell --> RC[RestaurantCard]
  RC --> Panel[VenueDetailSheet]
  RC --> Map[ToolPinsSync via UX-022]
```

## Verification (2026-06-01)

| Claim | Result |
|-------|--------|
| Depends UX-022 | ✅ pin sync prerequisite — **hard blocker** |
| Depends UX-023 | ⚪ **Optional** — may copy `CafeResultCard` layout before shell lands |
| PlaceResultCard today | 🔴 minimal — thin cards on prod after UX-036 |
| Backend change | ❌ None required |
