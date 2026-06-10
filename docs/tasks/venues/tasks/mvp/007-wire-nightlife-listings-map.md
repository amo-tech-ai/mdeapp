---
type: wireframe
id: WIRE-010
number: "007"
title: Nightlife Listings + Map (Clubs & Bars)
persona: Tourist, Andrés
path: / (nightlife mode) · /nightlife (browse)
priority: P1
build_status: Done
feature_group: "007"
paired_scr: 007-scr-nightlife-listings-map.md
related_wires:
  - 005-wire-cafe-listings-map-booking.md
  - 003-wire-event-discovery.md
  - 008-wire-restaurant-listings-map.md
related_specs:
  - 005-008-places-README.md
screens:
  - 007-scr-nightlife-listings-map.md
screen_ids:
  - SCREEN-022
skill:
  - mde-wireframe
---
# Wireframe: Nightlife Listings + Map (Clubs & Bars)

> **Places group 007:** [005-008-places-README.md](005-008-places-README.md) · Build spec: [007-scr-nightlife-listings-map.md](007-scr-nightlife-listings-map.md)

**Persona:** Tourist, Andrés · **Surface:** `/` chat-first + **`/nightlife` browse (SAN-491)**  
**Discovery:** `search-grounded-places` with `intent: "nightlife"` · **Agent:** `conciergeAgent` only

## Desktop center + map

```text
USER: best reggaeton clubs near Provenza tonight

┌─ Workflow ──────────────────────────────────────────────┐
│ Nightlife search · Provenza · 5 clubs · Safety: licensed taxis │
└─────────────────────────────────────────────────────────┘

ASSIST: Five clubs within walking distance — busiest after 11pm.

┌ NightlifeResultCard #1 ─────────────────────────────────┐
│ [#1] Provenza Rooftop · Night club · $$ · Opens 10pm   │
│      Reggaeton & crossover · ★4.6 (820)                 │
│      [Directions] [Details] [Events tonight*] [Save*]   │
└─────────────────────────────────────────────────────────┘

┌ NightlifeResultCard #2 … #5 ────────────────────────────┘

Chips: [Open now] [After 11pm] [Laureles] [Live DJ] [Salsa club]
```

* Save / Events tonight — Phase B polish; Events link when `search-events` returns venue match

## Right column: NightlifeDetailPanel

Same slot toggle as café ([005-wire](005-wire-cafe-listings-map-booking.md)):

```text
+----------+----------------------------------------+---------------------------+
| NAV      | CENTER (cards stay visible)            | NightlifeDetailPanel      |
|          | …                                      | [← Back to map]             |
|          |                                        | Photo · ★ · Night club $$   |
|          |                                        | [Overview|Reviews|Location] |
|          |                                        | Vibe: reggaeton, rooftop*   |
|          |                                        | Hours · phone · directions  |
|          |                                        | Safety tip (static Medellín)  |
|          |                                        | You might want to ask → chat  |
|          |                                        | More from this search (rail)  |
+----------+----------------------------------------+---------------------------+
```

*vibe tags only when summary/Places types support — never invent dress code

## Map

- Pin style distinct from café (e.g. purple vs teal) — requires `mapId` on parent `<Map>`
- Cluster when >10 in Provenza
- Optional district label chip on map (Provenza polygon — Phase B)

## Overlap with events (003)

| User intent | Tool |
|-------------|------|
| “Clubs near Provenza” | `search-grounded-places` nightlife |
| “Salsa with tickets Friday” | `search-events` → [003-wire-event-discovery](003-wire-event-discovery.md) |
| “Is there a party at {club} tonight?” | nightlife detail → optional `search-events` scoped to venue name |

## Tool filter (spec)

```text
intent=nightlife:
  INCLUDE primaryType: bar, night_club, nightclub, wine_bar (when query implies club)
  INCLUDE summary keywords: reggaeton, discoteca, rooftop, DJ, dance
  EXCLUDE: cafe, coffee_shop, bakery (café intent)
```

## Mobile

- Cards full width; `[Open map (N)]` FAB
- Detail: bottom sheet 85vh or same column toggle as café mobile

## Tests

| Check | Pass |
|-------|------|
| Nightlife query | ≥1 `nightlife-card` or `grounded-card` with nightlife kind |
| Café query | No nightlife intent misfire |
| Detail | `nightlife-detail-panel` or shared `cafe-detail-panel` with `data-venue-kind=nightlife` |
| Safety | Workflow strip contains safety string once |

## Do not do

- Separate `nightlifeAgent` in Phase A
- Route club detail through [006-wire-venue-detail](../../archive/006-wire-venue-detail.md) sheet
- Heatmap / Phase 3 polygon until Phase B

## Legacy filename

Previously `007-wire-nightlife-explorer.md` (frozen stub, [archived](../../../archive/007-wire-nightlife-explorer.md)) — superseded by this spec.
