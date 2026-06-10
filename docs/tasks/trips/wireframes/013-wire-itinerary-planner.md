---
type: wireframe
id: WIRE-005
number: "010"
title: Itinerary Tab
persona: Camila
path: right tab / trips
priority: P1
build_status: Done
screens:
  - 013-scr-itinerary-panel.md
screen_ids:
  - SCREEN-013
skill:
  - mde-wireframe
---
# Wireframe: Itinerary Tab

**Persona:** Camila · **Surface:** right panel tab **Itinerary** (Phase 2)

## Right panel tab view

```text
┌─ RIGHT: [Map] [Itinerary*] [Ideas] [Bookings] ────────┐
│ Trip: June Medellín          [+ Add] [AI optimize]      │
│ ─────────────────────────────────────────────────────── │
│ UP NEXT                                                 │
│ ┌ Fri Jun 14 ────────────────────────────────────────┐  │
│ │ 7:00 PM  Salsa en Provenza          [ticket ✓]    │  │
│ │ 9:30 PM  Dinner · Carmen (saved)     [pending]    │  │
│ └────────────────────────────────────────────────────┘  │
│ ┌ Sat Jun 15 ────────────────────────────────────────┐  │
│ │ 10:00 AM Apartment viewing · Laureles #1          │  │
│ │ 2:00 PM  Comuna 13 tour (saved)                   │  │
│ └────────────────────────────────────────────────────┘  │
│ ⚠ Conflict: Fri 9pm overlap — [Resolve]                 │
│ Budget: $420 / $600 spent                               │
└─────────────────────────────────────────────────────────┘
```

## Agent: conciergeAgent trip tools + logical conflict module

```text
User: "add salsa Friday and viewing Saturday morning"
  → trip_items insert
  → conflict_resolutions if overlap
  → proactive_suggestions ("leave 45 min between…")
```

## Tables

`trips`, `trip_items`, `conflict_resolutions`, `budget_tracking`

Do not add `trip_days` or `timeline_events` for MVP; group by `trip_items.start_at`.

## Mobile

Itinerary tab → full-screen stack; map via bottom sheet toggle.
