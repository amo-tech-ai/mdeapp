---
type: wireframe
id: WIRE-002
number: "005"
title: Rental Search (in-thread)
persona: Camila
path: /
priority: P0
build_status: Partial
paired_scr_note: "Rental cards in thread — NOT 002-scr-chat-nav-rail (see 002-wire-chat-chrome)"
screens:
  - 017-scr-workflow-progress-strip.md
  - 009-scr-rental-card-polish.md
  - 017-scr-schedule-viewing-modal.md
screen_ids:
  - SCREEN-004
  - SCREEN-005
  - SCREEN-008
skill:
  - mde-wireframe
---
# Wireframe: Rental Search (in-thread)

**Persona:** Camila · **Intent:** `rental_search` · **Agent:** rentalAgent + rental-search-workflow

## Flow ASCII

```text
User prompt
    ↓
[Visible] Concierge → Rental agent handoff
    ↓
search-rentals (Supabase apartments)
    ↓
ranking step (preference: remote_work | budget | …)
    ↓
Cards in stream + pins merge
    ↓
Refine: "show cheaper" | "2BR" | "with parking"
    ↓
CTA: Schedule viewing | Save to trip | Compare #1 #3
```

## Center panel (results state)

```text
┌─ Agent handoff ─────────────────────────────────────┐
│ Connecting you with rentals…                        │
│ Scouting Laureles · 24 matches · ranking for WiFi   │
└─────────────────────────────────────────────────────┘

ASSIST: Top picks for remote work in Laureles — all under $80/night.

┌─ Best pick ─────────────────────────────────────────┐
│ [#1]  ┌──────┐  Laureles Walkable Studio           │
│       │ img  │  $72/n · 0BR · host Ana · WiFi ✓     │
│       └──────┘  "Quiet street, 5 min to café row"   │
│       [Schedule viewing]  [Save to trip]  [Compare]│
└─────────────────────────────────────────────────────┘

┌─ #2 … #8 (compact cards) ───────────────────────────┐

Chips: [Show cheaper] [Monthly stays] [Envigado instead]
```

## Map sync

```text
Pin #1 = selected card (larger marker)
Pins 2–8 = numbered AdvancedMarker
Hover card ↔ highlight pin
Filter change → re-query → replace pin set (animate)
```

## Data

| Step | Supabase |
|------|----------|
| Search | `apartments` |
| Save | `saved_places`, `trip_items` |
| Lead | `leads`, `showings` |

## mdeai vs Mindtrip

| Mindtrip | mdeai |
|----------|-------|
| Hotel OTA cards | `apartments` + **Schedule viewing** |
| Generic travel | Laureles/Poblado intelligence in copy |
