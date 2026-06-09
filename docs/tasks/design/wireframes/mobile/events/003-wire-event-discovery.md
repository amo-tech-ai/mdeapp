---
type: wireframe
id: WIRE-003
number: "003"
title: Event Discovery (in-thread)
persona: Tourist, Andrés
path: /
priority: P0
build_status: Done
feature_group: "003"
paired_scr: 003-scr-event-card-polish.md
related_wires:
  - 003-wire-event-detail-page.md
  - 010-wire-booking-checkout.md
related_specs:
  - 003-events-README.md
screens:
  - 003-scr-event-card-polish.md
screen_ids:
  - SCREEN-006
skill:
  - mde-wireframe
---
# Wireframe: Event Discovery (in-thread)

> **Events group 003:** [003-events-README.md](003-events-README.md) · Build spec: [003-scr-event-card-polish.md](003-scr-event-card-polish.md) (SCREEN-006) · Detail page: [003-wire-event-detail-page.md](003-wire-event-detail-page.md)

**Persona:** Tourist, Andrés · **Intent:** `event_discovery` · **Agent:** eventAgent

## Desktop center

```text
USER: salsa events this weekend in Poblado

┌─ Workflow ──────────────────────────────────────────┐
│ Event agent · Searching nightlife + music · 6 found │
└─────────────────────────────────────────────────────┘

ASSIST: Three salsa nights worth booking — Provenza is busiest Friday.

┌ EventCard ──────────────────────────────────────────┐
│ [#1] Salsa en Provenza · Fri 9pm                    │
│      Club XYZ · $25/ticket · ★4.8                   │
│      [Buy tickets]  [Save]  [Add Fri 9pm itinerary] │
└─────────────────────────────────────────────────────┘

┌ EventCard #2 … #6 ──────────────────────────────────┘

Chips: [Cheaper] [This Saturday] [More culture] [Free events]
```

## Map

- Event pins (category: event) — purple/marker variant
- Cluster when >10 in Poblado
- Tap pin → EventCard scroll-into-view in chat

## Workflow

```text
classify-intent → event_discovery
  → search-events (Supabase events + event_tickets)
  → cards + pins
  → "Buy tickets" → `/events/[slug]` ([003-wire-event-detail-page](003-wire-event-detail-page.md)) or in-chat checkout ([009-wire-booking-checkout](009-wire-booking-checkout.md))
  → "Details" → [006-wire-venue-detail](006-wire-venue-detail.md) overlay (SCREEN-007)
```

## Tables

`events`, `event_tickets`, `event_orders`, `saved_places`, `trip_items`
