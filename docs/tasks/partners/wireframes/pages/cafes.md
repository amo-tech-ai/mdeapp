---
title: /cafes — Design Spec
status_today: ⚠️ SHELL (placeholder only)
route: mdeapp/src/app/cafes/page.tsx
vertical_accent: caramel/gold — oklch(0.80 0.13 85)
mockup: ../mockups/cafes.html
updated: 2026-06-04
---

# `/cafes` — from empty shell to browse page

**One-liner:** `/cafes` is a "coming soon" placeholder. It's the **biggest single win** because there's nothing to undo — clone the (improved) browse system and you instantly have parity with restaurants, plus a chance to set the *correct* pattern the other two should converge on.

---

## 1. Current state (live prod, 2026-06-04)

What renders today ([source](../../../mdeapp/src/app/cafes/page.tsx)):

```
[skip to main content]
            ☕ (Coffee icon)
      "Café browse coming soon"
"Ask the concierge for quiet cafés, coworking
 spots, and specialty coffee in Laureles or Poblado."
        [ Open concierge chat ]   → /
```

- Single centered `EmptyState`, one link back to chat. No nav rail, no filters, no cards, no map, no footer.
- It's honest (doesn't pretend to work) but it's a dead end for anyone who wanted to *browse* cafés.

---

## 2. Target layout (desktop ≥1024px)

Three-zone split — the shared `<BrowseLayout>`:

```
┌───────────────────────────────────────────────────────────────┐
│  HEADER: "Cafés"  ·  "Coffee & coworking in Medellín"   [Ask concierge] │
├──────────────┬──────────────────────────────┬─────────────────┤
│  FILTER RAIL │  RESULTS (scroll)            │   MAP (sticky)  │
│              │                              │                 │
│  Neighborhood│  "18 cafés"        [Sort ▾]  │   ● ● ●  pins   │
│  ◦ Laureles  │  ┌────────────────────────┐  │   (café glyph,  │
│  ◦ Poblado   │  │ [img]  Pergamino       │  │    caramel)     │
│  ◦ Provenza  │  │        ★4.7 · Poblado  │  │                 │
│  ◦ Envigado  │  │        Specialty · Wifi│  │   hover card ↔  │
│              │  │        "Quiet, great…" │  │   pin highlight │
│  Vibe        │  │   ♥  Ask   Details  →  │  │                 │
│  ◦ Specialty │  └────────────────────────┘  │                 │
│  ◦ Coworking │  ┌────────────────────────┐  │                 │
│  ◦ Quiet     │  │ … next card …          │  │                 │
│  ◦ Brunch    │  └────────────────────────┘  │                 │
│  ◦ Outdoor   │                              │                 │
│  [Clear]     │                              │                 │
└──────────────┴──────────────────────────────┴─────────────────┘
```

**Mobile (<768px):** filter rail collapses to a horizontal scroll chip row under the header; map becomes a `[Map]` / `[List]` toggle (sticky bottom). One column of cards.

---

## 3. Sections, features, components

| Zone | Component | Notes |
|---|---|---|
| Header | `BrowseHeader` | Title + subtitle + `[Ask concierge]` (deep-links chat with `?intent=cafes`). Shared across verticals — only copy changes. |
| Filter rail | `FilterBar` | Neighborhood (Laureles, Poblado, Provenza, Envigado) + **café-specific facets**: Specialty, Coworking/Wifi, Quiet, Brunch, Outdoor. Active chip uses **caramel accent**. `[Clear]` resets. URL-param driven (SSR-friendly, matches current pattern). |
| Results | `ResultsColumn` | Count ("18 cafés") + `Sort ▾` (Rating · Distance · Open now). Card skeletons while loading. |
| Card | **`VenueCard`** (shared) | image (16:10) · name · ★rating · neighborhood · 2-line clamp · facet tags · action row `[♥ Save] [Ask] [Details →]`. |
| Map | `MapColumn` | Google Map (`mapId` set), café-glyph `AdvancedMarker` pins in caramel. Hover-sync with cards. Sticky on desktop. |
| Detail | `VenueDetailSheet` (reuse `/chat` overlay) | Opens over the page on card click. Photos, hours, "Ask concierge," "Directions," "Cafés nearby." |

**Café-specific data worth surfacing (differentiators tourists/remote workers actually filter on):**
- **Wifi / power outlets / "laptop-friendly"** (the #1 café filter for the digital-nomad persona)
- **Open now + closes-at** (time-aware)
- **Specialty coffee vs. brunch vs. bakery**
- **Outdoor seating** (Medellín's climate is the selling point)
- **Noise level / "quiet"** (coworking)

---

## 4. Images

- Café photos via `/api/places/photo` (FieldMask). 16:10, `rounded-xl`, bottom scrim.
- **Fallback:** caramel→slate gradient + ☕ glyph (never a broken icon).
- Cafés are the most *aesthetic* vertical — lean into warm, bright, daytime imagery (the opposite of nightlife's dark mood). This visual contrast between verticals is a feature, not a bug.
- Blur-up placeholder to avoid layout shift.

---

## 5. Color & motion

- **Accent: caramel/gold `oklch(0.80 0.13 85)`** — daytime, cozy. Used on active chips, pins, hover ring, sort control.
- Base: shipped dark slate theme (`--background oklch(0.208 0.042 265)`, `--card oklch(0.279 0.041 260)`).
- Card hover: 1px caramel ring + 2px lift; respect `prefers-reduced-motion`.
- Skeletons mandatory (DESIGN.MD do/don't rule).

---

## 6. Inspiration (see [travelai-links.md](../travelai-links.md) for scores)

| Pattern to steal | From |
|---|---|
| Laptop-friendly / wifi / outlet filters | **Workfrom**, **Beanhunter** |
| Warm specialty-coffee imagery + map | **European Coffee Trip**, **Resy** (warmth) |
| Map+list split with hover sync | **Wanderlog**, **Mindtrip**, **Airbnb** |
| Save-to-collection ("My Medellín coffee tour") | **Wanderlog** collections |

---

## 7. Build order (smallest shippable first)

1. Build `VenueCard` + `BrowseLayout` + `FilterBar` as shared components (this unblocks all 3 verticals).
2. Wire `/cafes` to the existing **grounded places search** (`/api/grounded/search`, kind=cafe) — data already exists; the home chat already finds cafés.
3. Add the map column with café pins (build the missing `--map-pin-cafe` token).
4. Add `VenueDetailSheet` on card click.
5. Ship. Then restaurants + nightlife adopt the same components (their docs cover the deltas).

> Mockup of zones 1–4: [`../mockups/cafes.html`](../mockups/cafes.html).
