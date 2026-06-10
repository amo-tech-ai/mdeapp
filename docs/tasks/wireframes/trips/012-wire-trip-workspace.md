---
type: wireframe
id: WIRE-018
number: "018"
title: Trip Workspace (full tabs)
persona: Camila
path: /trips/:id
priority: P1
build_status: Done
screens:
  - 013-scr-itinerary-panel.md
screen_ids:
  - SCREEN-013
skill:
  - mde-wireframe
---
# Wireframe: Trip Workspace (full tabs)

**Source:** legacy `TripDetail.tsx` · Mindtrip `04-mindtrip_itinerary.png`  
**Persona:** Camila · **Path:** `/trips/:id` · **Auth:** required

> Superset of [05-itinerary-planner.md](05-itinerary-planner.md) — full page + all right-panel tabs.

## Desktop — chat + workspace split (Mindtrip pattern)

```text
┌────┬─────────────────────────────┬──────────────────────────────────┐
│Nav │ CENTER — trip-scoped chat   │ RIGHT — workspace tabs           │
│    │ Trip: Move to Laureles      │ [Map][Itinerary*][Ideas][Bookings]│
│    │ Filters: Laureles Jun 2ppl  │ [Calendar][Chats][Media]         │
│    │                             │                                  │
│    │ CopilotChat (thread scoped) │ ITINERARY                        │
│    │ "Add viewing Sat 10am"      │ ┌ Fri Jun 14 ──────────────────┐ │
│    │                             │ │ 10am Viewing · Laureles #1   │ │
│    │                             │ │ 7pm  Salsa · ticket ✓        │ │
│    │                             │ └──────────────────────────────┘ │
│    │                             │ UP NEXT · Budget · Distances ☐   │
│    │ [Ask anything…]             │ Map tab → pins for trip items    │
└────┴─────────────────────────────┴──────────────────────────────────┘
```

## Tab contents

| Tab | Content | Legacy / Mindtrip |
|-----|---------|-------------------|
| **Map** | Pins for all trip items; route lines | Legacy trip map |
| **Itinerary** | Day-grouped `trip_items`, drag reorder | [05](05-itinerary-planner.md) |
| **Ideas** | Shortlist before committed | Mindtrip Ideas |
| **Bookings** | Confirmed + pending | Legacy `/bookings` subset |
| **Calendar** | Week grid | Mindtrip calendar screenshot |
| **Chats** | Threads linked to trip | Mindtrip trip-scoped chats |
| **Media** | Links, PDFs, receipts | Mindtrip Media tab |

## Header actions

`[Go to trip]` · `[Invite — P3]` · `[Share]` · `[Archive]`

## Mobile

Workspace tabs → horizontal scroll; chat and workspace toggle (not simultaneous 3-panel).

## Agents

`conciergeAgent` (trip-scoped thread) with trip tools · logical conflict module · logical saved/promote module

## Data

`trips`, `trip_items`, `bookings`, `saved_places`, `mastra_threads.metadata.trip_id`

Do not add `trip_days` or `timeline_events` for MVP.
