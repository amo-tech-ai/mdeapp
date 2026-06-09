# Places discovery — groups 005–008

**Index:** [`mvp-index.md`](../mvp-index.md) · **Verify:** `node scripts/verify-scr-wire-pairing.mjs`

Shared Mindtrip pattern on `/`: ranked cards in chat → map pin sync → right-column detail panel (café/nightlife/restaurant) **or** slide-over sheet (rentals/events).

---

## When to implement (code on disk)

**scr/wire = design specs (already written).** You implement **code** at these MVP steps in [`mvp-index.md`](mvp-index.md):

| Group | scr / wire | SCREEN | When (MVP step) | Status |
|-------|------------|--------|-----------------|--------|
| **005** Café discover | [scr](../../archive/005-scr-cafe-listings-map-booking.md) · [wire](../../archive/005-wire-cafe-listings-map-booking.md) | 021 | **Archived** — live Vercel | ✅ Shipped |
| **005** Café booking | same wire Phase C | 021 | **Steps 16–21** (sheet → persist → chip) | 🟡 VEN-021 In Review — update SCREEN-021 assertions |
| **006** Rental/event sheet | [scr](../../archive/006-scr-venue-detail-sheet.md) · [wire](../../archive/006-wire-venue-detail.md) | 007 | **Archived** — live Vercel | ✅ Shipped |
| **008** Restaurant | [scr](008-scr-restaurant-listings-map.md) · [wire](008-wire-restaurant-listings-map.md) | 023 | **Steps 09–10** | 🟡 In Review (disk shipped) |
| **007** Nightlife | [scr](007-scr-nightlife-listings-map.md) · [wire](007-wire-nightlife-listings-map.md) | 022 | **Steps 11–13** | 🔴 VEN-012 bug blocks |
| **All three** E2E | — | 021/022/023 | **Step 31** Playwright | 🟡 023 partial; 021 stale; 022 missing |

**Data first:** complete steps **01–08** (inventory + seeds) before **09–13** if you want real catalog data; UI can still be built with mocks after **04** (restaurant) or **05** (nightlife).

**Ignore:** [007-wire-nightlife-explorer.md](007-wire-nightlife-explorer.md) — redirect stub; use `007-wire-nightlife-listings-map.md`.

---

## Groups

| Group | scr | wire | Legacy SCREEN | Tool / discovery |
|-------|-----|------|---------------|------------------|
| **005** Café | [005-scr-cafe-listings-map-booking](../../archive/005-scr-cafe-listings-map-booking.md) | [005-wire-cafe-listings-map-booking](../../archive/005-wire-cafe-listings-map-booking.md) | 021 | `search-grounded-places` `intent: "cafe"` |
| **006** Venue sheet | [006-scr-venue-detail-sheet](../../archive/006-scr-venue-detail-sheet.md) | [006-wire-venue-detail](../../archive/006-wire-venue-detail.md) | 007 | Rental/event overlay — **not** café detail |
| **007** Nightlife | [007-scr-nightlife-listings-map](007-scr-nightlife-listings-map.md) | [007-wire-nightlife-listings-map](007-wire-nightlife-listings-map.md) | 022 | `search-grounded-places` `intent: "nightlife"` |
| **008** Restaurants | [008-scr-restaurant-listings-map](008-scr-restaurant-listings-map.md) | [008-wire-restaurant-listings-map](008-wire-restaurant-listings-map.md) | 023 | `search-restaurants` |

---

## Detail UX routing

```text
Card click
  ├─ kind=cafe        → CafeDetailPanel (005) ✅
  ├─ kind=restaurant  → RestaurantDetailPanel (008) 🟡 shipped
  ├─ kind=nightlife   → NightlifeDetailPanel (007) ⚪ — ⚠️ grounded queries mis-route to café until VEN-012
  ├─ kind=rental      → VenueDetailSheet (006) ✅
  └─ kind=event       → sheet or /events/[slug] → events/wireframes/
```

*Last updated: 2026-06-02*
