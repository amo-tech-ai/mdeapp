---
title: /restaurants — Design Spec
status_today: ✅ LIVE (most complete browse vertical; 11 cards)
route: mdeapp/src/app/restaurants/page.tsx
vertical_accent: terracotta/orange — oklch(0.70 0.17 40)
updated: 2026-06-04
---

# `/restaurants` — polish the leader, then add the loop

**One-liner:** restaurants is the most complete vertical (image + rating + price + cuisine), so it sets the bar — but it **leaks every user to Google Maps**, has **no map of its own**, and its **descriptions truncate mid-sentence**. Fix those three and it becomes the reference page.

---

## 1. Current state (live prod, 2026-06-04)

Observed DOM ([source](../../../mdeapp/src/app/restaurants/page.tsx)):

```
HEADER  "Restaurants"  ·  "Food & dining in Medellín — browse without chat"   [Ask concierge]→/
FILTERS Neighborhood: Laureles · El Poblado · Envigado · Sabaneta
        Cuisine:      Café · Paisa · Colombian · Seafood · Steakhouse · Vegetarian · International · Street food
CARDS   (11)  each:  [image] · name · ★4.4–4.9 · cuisine · $22–$68/person · neighborhood · description · [Directions]→Google
        NO map · NO pagination/load-more
```

### What's good
- Real fields: rating, price-per-person, cuisine, neighborhood — genuinely useful.
- Filter taxonomy is sensible and SSR-driven (URL params).
- "Browse without chat" framing is honest and good for the tap-not-type user.

### What's broken / weak
| Issue | Evidence | Impact |
|---|---|---|
| **Descriptions truncate mid-sentence** | "Verdeo is a restaurant located…", "Moshi is an Asian fusion…" | looks broken; erodes trust |
| **Only CTA is Directions → Google** | every card | sends users *off* mdeai; zero retention; no funnel |
| **No map** | page has none | breaks the "city map" brand; can't see clusters by neighborhood |
| **Mixed image quality** | some stock, some real, varying crops | inconsistent, amateur feel |
| **No save / no detail** | no ♥, `/restaurants/[slug]` is POST/unbuilt | can't build a shortlist; dead-ends |
| **No "open now" / hours / reservation** | absent | the two things diners decide on |

---

## 2. Target layout

Same shared `<BrowseLayout>` as cafés (list + sticky map + filter rail). Deltas for restaurants:

- **Filter rail facets:** Cuisine (existing 8) + add **Price** ($/$$/$$$), **Open now**, **Reservation/Rooftop/Outdoor**.
- **Sort:** Rating · Price · Distance · Open now.
- **Map pins:** terracotta restaurant glyph (build `--map-pin-restaurant`), hover-synced to cards.
- **Card action row:** `[♥ Save] [Ask concierge] [Details →]`. **Directions moves into the detail sheet** as a secondary action.

```
HEADER  Restaurants · Food & dining in Medellín            [Ask concierge]
┌────────────┬───────────────────────────────┬──────────────┐
│ Cuisine    │ "11 places"          [Sort ▾]  │   MAP        │
│ Price      │ ┌───────────────────────────┐  │  terracotta  │
│ Open now   │ │[img] El Cielo  ★4.9       │  │  pins, hover │
│ Outdoor    │ │      Steakhouse · $68 · Pob│  │  sync        │
│ [Clear]    │ │      "Tasting-menu temple…"│  │              │
│            │ │   ♥   Ask   Details  →     │  │              │
│            │ └───────────────────────────┘  │              │
└────────────┴───────────────────────────────┴──────────────┘
```

---

## 3. Sections, features, components

| Zone | Component | Restaurant delta |
|---|---|---|
| Header | `BrowseHeader` (shared) | copy only |
| Filters | `FilterBar` (shared) | + Price, Open now, Outdoor/Reservation facets; **active chip = terracotta** |
| Card | **`VenueCard`** (shared) | price chip + cuisine tag + ★rating; **2-line `line-clamp`** (fixes truncation); `[♥][Ask][Details]` |
| Map | `MapColumn` (shared) | terracotta pins, price label on pin (Wanderlog pattern) |
| Detail | `VenueDetailSheet` | photos, hours/open-now, menu link, **Directions**, "Ask concierge," "Nearby cafés/nightlife" cross-sell |

---

## 4. Images
- Standardize on Google Places photos via `/api/places/photo`; one aspect ratio (16:10), one crop, one radius.
- Drop stock filler — a branded terracotta→slate gradient + fork/knife glyph beats a generic stock plate.
- Blur-up + 2-line description clamp (kills the mid-sentence truncation bug at the display layer).

---

## 5. Color
- **Accent: terracotta/orange `oklch(0.70 0.17 40)`** — appetite-warm, distinct from café caramel and nightlife magenta.
- Keep global teal for nav/links/focus; terracotta only for restaurant-vertical affordances (chips, pins, hover ring, price emphasis).

---

## 6. User-flow fixes (the retention win)
1. **Card → detail sheet** (not Google). Directions is one tap *inside* detail.
2. **♥ Save** → `/saved` (the table/route already exists) → enables "my Medellín food shortlist."
3. **Ask concierge** on a card deep-links chat pre-loaded: *"Tell me about El Cielo — is it good for a date?"* → the chat↔browse loop.
4. **Cross-sell** in detail: "cafés nearby," "rooftop bars nearby" → keeps the session in mdeai.

---

## 7. Inspiration (scores in [travelai-links.md](../travelai-links.md))

| Pattern | From |
|---|---|
| Map+list with price-on-pin | **Wanderlog**, **Airbnb** |
| Restaurant card + mood imagery + reservation | **Resy**, **OpenTable**, **The Infatuation** |
| "Ask about this place" chat handoff | **Mindtrip** |
| Save-to-collection / shortlist | **Wanderlog** collections, **Beli** |

---

## 8. Build order
1. Adopt shared `VenueCard` / `BrowseLayout` / `FilterBar` (from the cafés build).
2. Add 2-line clamp + standardized images (quick, high-visibility).
3. Add map column + terracotta pins.
4. Swap card CTA to `[♥][Ask][Details]`; move Directions into `VenueDetailSheet`.
5. Wire `/restaurants/[slug]` detail (currently POST) so Details has a destination.
