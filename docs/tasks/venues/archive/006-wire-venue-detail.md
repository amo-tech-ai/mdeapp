---
type: wireframe
id: WIRE-004
number: "006"
title: Venue / Listing Detail (sheet)
persona: Camila, Andrés
path: overlay on /
priority: P0
build_status: Archived
archived: 2026-06-02
was_status: Done
shipped: true
production: https://www.mdeai.co/
evidence: ../../../tasks/evidence/SCREEN-007-evidence.md
feature_group: "006"
paired_scr: 006-scr-venue-detail-sheet.md
related_wires:
  - 005-wire-cafe-listings-map-booking.md
  - 008-wire-restaurant-listings-map.md
  - 007-wire-nightlife-listings-map.md
related_specs:
  - 005-008-places-README.md
screens:
  - 006-scr-venue-detail-sheet.md
screen_ids:
  - SCREEN-007
skill:
  - mde-wireframe
---
# Wireframe: Venue / Listing Detail (sheet)

> **Places group 006:** [005-008-places-README.md](../tasks/mvp/wireframes/005-008-places-README.md) · Build spec: [006-scr-venue-detail-sheet.md](006-scr-venue-detail-sheet.md)

**Use this sheet for:** rentals · ticketed events (in-chat)  
**Do not use for:** cafés ([005-wire](005-wire-cafe-listings-map-booking.md)), nightclubs ([007-wire](007-wire-nightlife-listings-map.md)), restaurants ([008-wire](008-wire-restaurant-listings-map.md)) — those use **right-column detail panels**.

## Rental detail (sheet over chat)

```text
                    ┌─ Listing detail ─────────────── [×] ─┐
                    │ ┌──────── gallery ────────────┐   │
                    │ │  img   img   img            │   │
                    │ └─────────────────────────────┘   │
                    │ Laureles Walkable Studio          │
                    │ $72/n · $1,800/mo · 0BR · WiFi    │
                    │ ─────────────────────────────────  │
                    │ AI summary: "Best for remote work…" │
                    │ Amenities: desk, washer, kitchen    │
                    │ Map mini-preview [pin]              │
                    │ ─────────────────────────────────  │
                    │ [Schedule viewing]  [Save to trip]  │
                    └───────────────────────────────────┘
     Map panel still visible behind (dimmed) — pin pulsing
```

## Event venue detail (in-chat sheet)

```text
┌─ Event detail ────────────────────────────────────────┐
│ Hero image · Salsa en Provenza                        │
│ Fri Jun 14 · 9:00 PM · Club XYZ                       │
│ From $25 · 120 tickets left                           │
│ Tier: General $25 | VIP $45                           │
│ [Buy tickets] [Save] [Directions on map]            │
└───────────────────────────────────────────────────────┘
```

Full-page event detail: [003-wire-event-detail-page.md](003-wire-event-detail-page.md) (`/events/:slug`).

## Detail routing (mdeai)

| Card type | Detail surface |
|-----------|----------------|
| Rental | This sheet |
| Event (in-thread) | This sheet **or** navigate `/events/[slug]` |
| Café | `CafeDetailPanel` — group 005 |
| Nightclub | `NightlifeDetailPanel` — group 007 (planned) |
| Restaurant | `RestaurantDetailPanel` — group 008 (planned) |

## States

| State | UI |
|-------|-----|
| Loading | Skeleton gallery + text |
| Available | CTAs enabled |
| Sold out | Waitlist CTA → `event_wait_list` |
| Error | Retry fetch |

## CK pattern

Chat thread stays mounted; sheet is overlay. Map pin sync via F50 on open.
