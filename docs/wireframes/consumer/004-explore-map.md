# Explore Map
> Route: `/explore` (also accessible as a panel mode from any page)  
> User: All roles  
> Phase: Core · P1

---

## Page Goal

Full-screen, domain-agnostic city map. Every active event, rental, restaurant, cafe, nightlife venue, and venue on the platform has a pin. Tap any pin to get an AI quick view without leaving the map. Ideal for tourists and "what's nearby" discovery.

---

## User Stories

- As a tourist, I want to see everything going on near my hotel so I can pick what to do tonight.
- As Camila, I want to switch from "all" to "rentals only" and see only 2BR listings in Laureles.
- As a local, I want to say "find me a jazz venue with a rooftop" and see the matching pin highlighted.

---

## Desktop Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  Explore                                                 🔔  Camila  │
├─────────────────┬──────────────────────────────────────────────────────────────┤
│  LEFT 280px     │  FULL MAP CENTER+RIGHT                                       │
│  ─────────────  │                                                              │
│  Domain Filter  │  ┌──────────────────────────────────────────────────────┐   │
│  ✓ All          │  │  🗺️ Google Maps — Medellín                           │   │
│  ✓ Events       │  │                                                      │   │
│  ✓ Rentals      │  │    [🎵] Jazz Night                                   │   │
│  ✓ Restaurants  │  │       [🎵] Weekend Salsa                            │   │
│  ✓ Cafes        │  │                                                      │   │
│  ✓ Nightlife    │  │  [🏠] [🏠] [🏠]   ← rental cluster                 │   │
│  ✓ Venues       │  │                                                      │   │
│  ─────────────  │  │         [🍽️] Oci.Mde                               │   │
│  Tonight Only   │  │         [☕] Pergamino                              │   │
│  ─────────────  │  │                                                      │   │
│  AI Summary     │  │  [🏢] Venue Lleras                                  │   │
│  "8 events,     │  │                                                      │   │
│  15 rentals     │  └──────────────────────────────────────────────────────┘   │
│  visible in     │                                                              │
│  this view"     │  ┌──────────────────────────────┐                           │
│  ─────────────  │  │ 💬 What are you looking for?  │                           │
│  [List View]    │  │                          [▶]  │                           │
│                 │  └──────────────────────────────┘                           │
└─────────────────┴──────────────────────────────────────────────────────────────┘
```

---

## Pin Quick View (tap a pin)

```
┌──────────────────────────────────────────────────────┐
│  [Photo]  Jazz Night                                 │
│           Parque Lleras · Fri Jan 10 · 9pm          │
│           GA $25 · VIP $60 · 🔥 90% sold            │
│                                                      │
│  [View Details]  [♡ Save]  [Get Tickets ▶]          │
└──────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────┐
│  [Photo]  Apto El Estadio                            │
│           Laureles · 2BR · $950/mo                  │
│           ⭐ 92% match · Furnished · 300Mbps        │
│           🟢 Available                               │
│                                                      │
│  [View Details]  [♡ Save]  [Inquire ▶]              │
└──────────────────────────────────────────────────────┘
```

---

## Mobile Wireframe

```
┌─────────────────────────────────────┐
│  Explore Medellín                   │
│  [All][🎵][🏠][🍽️][☕][🌙][🏢]    │ ← domain filter tabs
│  ─────────────────────────────     │
│  ┌─────────────────────────────┐  │
│  │  🗺️ Full-screen map         │  │
│  │                             │  │
│  │   [🎵]  [🎵]               │  │
│  │       [🏠][🏠]             │  │
│  │            [🍽️]            │  │
│  │                             │  │
│  └─────────────────────────────┘  │
│  [List View ⊞]  Tonight Only □    │
│  ─────────────────────────────     │
│  [💬 What are you looking for?]   │
├─────────────────────────────────────┤
│  🏠  📅  🗺️  📌  👤             │
└─────────────────────────────────────┘
```

---

## Pin Color / Icon Key

| Domain | Pin color | Icon |
|---|---|---|
| Events | Purple | 🎵 |
| Rentals | Blue | 🏠 |
| Restaurants | Orange | 🍽️ |
| Cafes | Brown | ☕ |
| Nightlife | Dark blue | 🌙 |
| Venues | Gray | 🏢 |
| Saved items | Yellow star | ★ |

All pins use `<AdvancedMarker>` with `mapId` set on parent `<Map>`. Pin clustering active via `@googlemaps/markerclusterer` when zoom < 13.

---

## States

### Loading State (initial map load)

```
┌────────────────────────────────────────────────────────┐
│  🗺️ Loading map...                                    │
│  ████████████████████████████████████████ ← skeleton  │
└────────────────────────────────────────────────────────┘
```

### Empty State (domain filter yields no results)

```
┌────────────────────────────────────────────────────────┐
│  No cafes in this view.                                │
│  Try zooming out or removing filters.                 │
│  [Clear Filters]                                      │
└────────────────────────────────────────────────────────┘
```

### AI Chat in Map Context

User types "find me a quiet cafe with fast wifi":
- Agent calls `search_cafes({ wifi_min: 200, noise: "quiet" })` with `X-Goog-FieldMask`
- Returns top 3 results as map pins (highlighted in yellow)
- Quick-view card appears in left panel for top result
- Other pins dim to 40% opacity to emphasize matches

### Offline State

```
┌────────────────────────────────────────────────────────┐
│  📡 Offline — showing cached map                       │
│  Some pins may be outdated.                           │
│  [Retry]                                              │
└────────────────────────────────────────────────────────┘
```
Map tiles show last-cached Google Maps; pins from `localStorage` (max 50); chat disabled.

---

## Components

| Component | Props | Notes |
|---|---|---|
| `ExploreMap` | `pins[]`, `filter`, `onPinClick` | Full-screen Google Map |
| `DomainFilterBar` | `active[]`, `onChange` | Tabs at top / left panel |
| `PinQuickView` | `entity`, `onClose`, `onSave`, `onCta` | Slides up on pin tap |
| `MapChatBar` | — | Persistent chat bar at bottom of map |
| `PinCluster` | `count`, `lat`, `lng` | Markerclusterer bubble |
| `MapEmptyState` | `domain`, `onClear` | When filter yields no results |
| `MapSkeleton` | — | Loading state |
| `MapOfflineBanner` | `onRetry` | Offline indicator |

---

## Data Contract / Maps Rules

```typescript
// Pin data fetched from Supabase (server component)
type MapPin = {
  id: string
  entity_type: "event" | "rental" | "restaurant" | "cafe" | "nightlife" | "venue"
  lat: number
  lng: number
  title: string
  price: string | null
  status: string
}

// Google Maps API call
// REQUIRED: X-Goog-FieldMask on every Places API New request
// REQUIRED: mapId on every <Map> that has <AdvancedMarker>
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
```

Every `fetch` to Places API New must include `X-Goog-FieldMask` specifying only the fields needed — never omit this (billing impact).

---

## AI Features

| Feature | Trigger | Notes |
|---|---|---|
| Context-aware search | Chat in map | "Find cafes near Parque Lleras" → pins highlight |
| Count summary | Map view change | "8 events, 15 rentals in this view" (left panel) |
| Tonight filter | Toggle | Limits event pins to today's events |
| Cross-domain plan | Chat | "I'm seeing Jazz Night — find nearby parking and dinner" |

---

## RLS Policy

Map pins are derived from public entity tables (events, rentals, etc.) — no new table needed. Supabase queries use anon client scoped to `status = 'active'`.

---

## Technical Notes

- `mapId`: Required on every `<Map>` instance when `<AdvancedMarker>` is used. Store in `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`.
- Pin clustering: Use `@googlemaps/markerclusterer` to avoid 500+ pins at zoom-out.
- Pins fetched server-side and hydrated as `useCoAgent` state for agent access.
- Map tiles do NOT go through Supabase — direct Google Maps JS API calls.

---

## Analytics Events

| Event | Properties |
|---|---|
| `map.opened` | `referrer` |
| `map.filter_changed` | `active_domains[]` |
| `map.pin_clicked` | `entity_type`, `entity_id` |
| `map.quick_view_cta` | `entity_type`, `cta_type` |
| `map.chat_query` | — |

---

## MVP / Post-MVP Scope

| Feature | Phase |
|---|---|
| Full-screen map with domain pins | Core P1 |
| Domain filter bar | Core P1 |
| Pin quick view | Core P1 |
| AI chat in map context | Core P1 |
| Tonight filter | Core P1 |
| Loading / empty / offline states | Core P1 |
| Pin clustering | Core P1 |
| Saved items pins (yellow) | MVP |
| Neighborhood heatmap overlay | Post-MVP |
| Transit / walking time overlay | Post-MVP |
