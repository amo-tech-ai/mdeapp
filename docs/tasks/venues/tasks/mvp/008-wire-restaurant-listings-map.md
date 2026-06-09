---
type: wireframe
id: WIRE-027
number: "008"
title: Restaurant Listings + Map
persona: Tourist, Camila
path: / (restaurant mode)
priority: P1
build_status: In Progress
feature_group: "008"
paired_scr: 008-scr-restaurant-listings-map.md
related_wires:
  - 005-wire-cafe-listings-map-booking.md
  - 007-wire-nightlife-listings-map.md
related_specs:
  - 005-008-places-README.md
screens:
  - 008-scr-restaurant-listings-map.md
screen_ids:
  - SCREEN-023
skill:
  - mde-wireframe
---
# Wireframe: Restaurant Listings + Map

> **Places group 008:** [005-008-places-README.md](005-008-places-README.md) · Build spec: [008-scr-restaurant-listings-map.md](008-scr-restaurant-listings-map.md)

**Persona:** Tourist, Camila · **Surface:** `/` chat-first  
**Phase A tool:** `search-restaurants` (Supabase) · **Phase B:** + `search-grounded-places` `intent: "restaurant"`

## Desktop center + map

```text
USER: best paisa restaurant in Laureles for dinner

┌─ Workflow ──────────────────────────────────────────────┐
│ Restaurant search · Laureles · paisa · 4 matches        │
└─────────────────────────────────────────────────────────┘

ASSIST: Four solid paisa spots — Hatoviejo is the local favorite.

┌ RestaurantResultCard #1 ────────────────────────────────┐
│ [#1] Hatoviejo Laureles · Paisa · $$ · ★4.5            │
│      Traditional bandeja · family-friendly              │
│      ~$18/person · Live music weekends*                   │
│      [Directions] [Details] [Reserve*]                  │
└─────────────────────────────────────────────────────────┘

Chips: [Colombian] [Paisa] [Seafood] [Date night] [Under $30] [El Poblado]
```

* Reserve = stub until partner integration

## Right column: RestaurantDetailPanel

Mirror café layout ([005-wire](005-wire-cafe-listings-map-booking.md)):

```text
| RestaurantDetailPanel                                      |
| [← Back to map]                                              |
| Hero photo · Hatoviejo · ★4.5 · Paisa · $$                   |
| [Overview | Reviews | Location]                              |
| Overview: aiSummary or grounding blurb (labeled source)      |
| Cuisine · vibe chips · avg price                             |
| Facts: address, phone, website, hours (Places when placeId)  |
| You might want to ask → chat (panel stays open)              |
| More from this search (sibling rail)                         |
```

## Data sources

| Phase | Source | When |
|-------|--------|------|
| A | `search-restaurants` | cuisine, neighborhood, price filters |
| B | `search-grounded-places` restaurant intent | Google rows missing from Supabase |
| Enrich | `getPlaceDetails` | when `placeId` on card |

## vs Café (005) vs Nightlife (007)

| Query | Tool | Detail panel |
|-------|------|--------------|
| “quiet café WiFi Laureles” | grounded `cafe` | CafeDetailPanel |
| “paisa dinner Laureles” | `search-restaurants` | RestaurantDetailPanel |
| “reggaeton club Provenza” | grounded `nightlife` | NightlifeDetailPanel |

## Mobile

Same patterns as café: bottom sheet or column toggle; horizontal sibling rail.

## Tests

```bash
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-023-restaurant-listings.spec.ts
```

| Check | Pass |
|-------|------|
| Restaurant cards | `restaurant-card` with photo, cuisine, price tier |
| Detail panel | `restaurant-detail-panel` visible on Details |
| Dedup | No duplicate generic tool JSON in chat prose |
| Café negative | “cafés Laureles” does not render restaurant cards |

## Do not do

- Mix restaurant cards with café grounded cards in one turn without user intent
- Full-page `/restaurants/[id]` before chat flow ships
