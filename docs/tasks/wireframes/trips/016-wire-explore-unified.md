---
type: wireframe
id: WIRE-016
number: "016"
title: Explore Unified
persona: Tourist
path: /explore
priority: P2
build_status: Frozen
screens:
  []
screen_ids:
  []
skill:
  - mde-wireframe
phase: Phase 2+
---
# Wireframe: Explore Unified

**Source:** legacy `Explore.tsx`  
**Persona:** Tourist, Camila · **Path:** `/explore`  
**Layout:** Catalog 3-panel + map-first option

## Desktop

```text
┌────────────┬──────────────────────────────────────────────────────────┐
│ LEFT       │ EXPLORE Medellín                                         │
│ nav        │ [All] [Apartments] [Restaurants] [Events] [Attractions]  │
│            │ Neighborhood: [Any ▼]  AI search: [Find rooftop bars… 🔍]│
│            │ ┌──────────────────────────────────────────────────────┐ │
│            │ │  MAP (default) or CARD GRID toggle                   │ │
│            │ │  · category-colored pins · cluster @ zoom out        │ │
│            │ │  · "Search this area" on pan                         │ │
│            │ └──────────────────────────────────────────────────────┘ │
│            │ Featured cards row (horizontal scroll)                     │
└────────────┴──────────────────────────────────────────────────────────┘
```

## Card grid mode

```text
┌ card ──────┐ ┌ card ──────┐ ┌ card ──────┐
│ 🏠 Apt     │ │ 🍽 Resto   │ │ 🎫 Event   │
│ Laureles   │ │ Provenza   │ │ Fri 9pm    │
│ [Save][→]  │ │ [Save][→]  │ │ [Tickets]  │
└────────────┘ └────────────┘ └────────────┘
```

Click → slide-in detail (same shell as [15-rentals-browse.md](15-rentals-browse.md)).

## vs chat map

| Surface | Map behavior |
|---------|--------------|
| `/` chat | Map always right panel; pins from current thread |
| `/explore` | Map is primary; filters are browse-first, not conversational |

## Agent hook

Optional "Ask about this area" → creates thread with map viewport + category context pre-loaded.

## Data

`apartments`, `events`, `restaurants`, `tourist_destinations`, Places cache

## Mobile

Category tabs scroll horizontally; map full screen with bottom card carousel (Mindtrip Explore pattern).
