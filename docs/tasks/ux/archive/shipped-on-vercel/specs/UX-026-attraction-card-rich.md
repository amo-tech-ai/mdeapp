---
id: UX-026
title: AttractionCard rich on ResultCardShell
status: Done
priority: P2
phase: Card unification M3
effort: 4-6h
owner: claude
depends_on: [UX-025]
blocks: []
risk: 🟡 Medium
complexity: M
skill: [mde-task-lifecycle, shadcn, testing]
related:
  - UX-010-CARD-UNIFICATION-STRATEGY.md
description: Same shell pattern as RestaurantCard for searchAttractionsTool — type/hours badges, photo, Details + Directions.
---

# UX-026 — AttractionCard rich (M3)

## Purpose

Attractions currently share weak `PlaceResultCard` via `GenericResults` — parity with restaurants after UX-025.

## Affected files

- Create `attraction-card.tsx`
- Modify `search-tool-renders.tsx` attraction branch + `DomainResults`

## Acceptance

- [x] Attraction search uses `AttractionCard` via `DomainResults`.
- [x] `PlaceResultCard` only for non restaurant/attraction categories (none wired).
- [x] Vitest green; full `npm run floor` blocked by untracked `supabase/` in tsc (pre-existing).

## Flow diagram

```mermaid
flowchart LR
  UX025[RestaurantCard M2] --> UX026[AttractionCard M3]
  UX026 --> Same[Same ResultCardShell pattern]
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| Blocks on UX-025 | ✅ Correct sequencing |
