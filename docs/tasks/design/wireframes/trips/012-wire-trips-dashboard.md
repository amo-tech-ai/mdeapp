---
type: wireframe
id: WIRE-017
number: "017"
title: Trips Dashboard
persona: Camila
path: /trips
priority: P1
build_status: Done
screens:
  - 012-scr-trips-dashboard.md
screen_ids:
  - SCREEN-012
skill:
  - mde-wireframe
---
# Wireframe: Trips Dashboard

**Source:** legacy `Trips.tsx`  
**Persona:** Camila · **Path:** `/trips` · **Auth:** required

> Distinct from [05-itinerary-planner.md](05-itinerary-planner.md) (single trip tab). This is the **list of all trips**.

## Desktop

```text
┌─────────────────────────────────────────────────────────────────┐
│ My trips                                    [+ New trip]        │
├─────────────────────────────────────────────────────────────────┤
│ ┌─ Active ────────────────────────────────────────────────────┐ │
│ │ 🗺 Move to Laureles          Jun 1 – Aug 31 · 2 travelers   │ │
│ │ 3 saved · 1 viewing scheduled · $420 / $600 budget          │ │
│ │ [Open workspace →]                                           │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─ Planning ──────────────────────────────────────────────────┐ │
│ │ 🎶 Medellín nightlife weekend   May 29–31                   │ │
│ │ 2 events saved · 0 bookings                                  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─ Archived ──────────────────────────────────────────────────┐ │
│ │ ✈ Austin → Medellín (2025)                    [Restore]     │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Empty state (Mindtrip gap — mdeai should do better)

```text
┌─ No trips yet ──────────────────────────────────────────────┐
│ Start from chat — ask for rentals or events, then           │
│ [Create trip from last chat]  or  [+ Blank trip]            │
└─────────────────────────────────────────────────────────────┘
```

## Create trip modal

```text
┌─ New trip ─────────────────────────────────────── [×] ─┐
│ Title: [Move to Laureles                    ]          │
│ Destination: [Medellín ▼]                              │
│ Dates: [Jun 1] – [Aug 31]                              │
│ Travelers: [2 ▼]   Budget: [6000000 COP ▼]             │
│ [Create]  → trips row + optional mastra_thread link    │
└────────────────────────────────────────────────────────┘
```

## Navigation

- Card click → `/trips/:id` ([18-trip-workspace.md](18-trip-workspace.md))
- Left nav in chat also lists trips (see [14-chat-chrome.md](14-chat-chrome.md))

## Data

`trips`, `trip_items` count, `budget_tracking`, `mastra_threads.trip_id`
