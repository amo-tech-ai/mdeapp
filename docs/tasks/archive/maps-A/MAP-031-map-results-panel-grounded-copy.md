---
id: MAP-031
title: Map results panel copy when grounded cards are visible
status: Done
priority: P2
phase: UX polish (pairs with MAP-030)
effort: 1-2h
owner: claude
depends_on: [MAP-030]
blocks: []
skill: [mde-maps, testing]
---

# MAP-031 — Map results panel copy (grounded pins)

## Problem

When **rich grounded cards** render in chat (`richGroundedCardsEnabled()`), `ChatResultsColumn` **intentionally hides** `category=grounded` pins from the bottom **Map results** list — but the empty state still says **“No pins yet”** while the main map shows 5 pins. Confuses Camila (see `screenshots/mde/2-cafes.png`).

## Fix

| Option | Copy / behavior |
|--------|-----------------|
| A (preferred) | If last search was grounded and cards visible: *“Pins are on the map and in the cards above.”* |
| B | Show compact pin rows for grounded even when rich cards on (dedupe risk) |
| C | Hide **Map results** section entirely when grounded-only turn |

## Files

- `mdeapp/src/components/chat/chat-results-column.tsx`
- Possibly `event-search-results-context` / map context flag `lastActiveCategory`

## Acceptance

- [x] After `list cafes in medellin`, bottom strip does **not** imply failure when map has pins
- [x] `smoke:grounding-attribution` asserts `results-grounded-on-map` (no `results-empty`)

## Evidence

`tasks/notes/MAP-031-evidence.md`
