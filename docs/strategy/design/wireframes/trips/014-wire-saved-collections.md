---
type: wireframe
id: WIRE-007
number: "014"
title: Saved Collections
persona: Camila
path: /saved
priority: P1
build_status: Done
screens:
  - 014-scr-saved-collections-page.md
screen_ids:
  - SCREEN-011
skill:
  - mde-wireframe
---
# Wireframe: Saved Collections

**Persona:** Camila · **Surface:** left nav + full view

## Left nav expanded

```text
┌ LEFT ─────────────────┐
│ Saved                 │
│ ├ ♡ Laureles shortlist│
│ │   3 rentals         │
│ ├ ♡ Date night spots  │
│ │   5 restaurants     │
│ ├ ♡ Weekend events    │
│ │   2 events          │
│ [+ New collection]    │
└───────────────────────┘
```

## Collection detail (center or modal)

```text
┌─ Collection: Laureles shortlist ──────────────────────┐
│ 3 items · shared with trip "June Medellín"              │
│ ┌ card ┐ ┌ card ┐ ┌ card ┐                            │
│ │ #1   │ │ #2   │ │ #3   │  [Compare on map]          │
│ └──────┘ └──────┘ └──────┘                            │
│ [Add all to itinerary] [Remove] [Share link — P3]     │
└───────────────────────────────────────────────────────┘
```

## Data

`collections`, `saved_places`, FK to `trips` optional

## Map

Selecting collection → filter pins to collection IDs only
