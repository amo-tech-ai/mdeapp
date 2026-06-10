---
title: /nightlife — Design Spec
status_today: ✅ LIVE but weakest visuals (13 cards, NO images, NO ratings)
route: mdeapp/src/app/nightlife/page.tsx
vertical_accent: magenta/violet (neon) — oklch(0.65 0.22 330)
updated: 2026-06-04
---

# `/nightlife` — reach card parity, then add the night mood

**One-liner:** nightlife is LIVE but renders as a **text spreadsheet** — no images, no ratings, just name + vibe + description + a Directions link. It's the vertical that *most* depends on mood/imagery, yet has the least. Get it to `VenueCard` parity, then push a distinct neon night aesthetic.

---

## 1. Current state (live prod, 2026-06-04)

Observed DOM ([source](../../../mdeapp/src/app/nightlife/page.tsx)):

```
HEADER  "Nightlife" · "Clubs & bars in Medellín — browse without chat"   [Ask concierge]→/
SAFETY  "Safety: use licensed taxis at night and stay in busy, well-lit areas."   ← good, keep
FILTERS Neighborhood: Provenza · Laureles · El Poblado · Manila
        Vibe:         Reggaeton · Rooftop · Salsa · Cocktails · Live DJ
CARDS   (13)  each:  name · neighborhood · vibe(Themed/Rooftop/Electronic) · description · [Directions]→Google
        NO images · NO ratings · NO map · NO footer
```

### What's good
- **Safety note** before listings — thoughtful, locally aware, keep it (maybe iconify it).
- **Vibe filter** (Reggaeton/Salsa/Rooftop/Cocktails/Live DJ) is exactly right for the persona — nightlife is chosen by *vibe*, not cuisine.

### What's broken / weak
| Issue | Impact |
|---|---|
| **No images at all** | nightlife is sold on atmosphere; text-only cards kill desire. Worst offender of the three. |
| **No ratings / no price / no hours** | can't tell a tourist trap from a local favorite; can't tell if it's open / cover charge |
| **Directions-only CTA → Google** | leaks users; no save, no detail, no "what's on tonight" |
| **No map** | nightlife clusters by zone (Provenza/Parque Lleras) — a map is *more* useful here than anywhere |
| **No "tonight" / events** | the whole point of nightlife is *when* — no day/time/event awareness |

---

## 2. Target layout

Shared `<BrowseLayout>` (list + sticky map + filter rail). Nightlife deltas:

- **Filter facets:** Vibe (existing 5) + **Open tonight / day**, **Cover charge**, **Rooftop/Outdoor**, **Age/dress** (optional).
- **Map pins:** magenta neon glyph (build `--map-pin-nightlife`); cluster on Parque Lleras/Provenza is itself a selling visual.
- **Card:** image (mandatory) + vibe tags + neighborhood + 2-line clamp + `[♥ Save][Ask][Details →]`.
- **Add a rating/price signal** (Places rating + price level) so cards aren't faceless.

```
HEADER  Nightlife · Clubs & bars in Medellín           [Ask concierge]
SAFETY  ⚠ Licensed taxis at night · stay in well-lit areas
┌────────────┬───────────────────────────────┬──────────────┐
│ Vibe       │ "13 spots"           [Sort ▾]  │   MAP        │
│ Open tonite│ ┌───────────────────────────┐  │  magenta     │
│ Rooftop    │ │[NEON img] Salón Amador    │  │  pins; Lleras│
│ Cover      │ │   Electronic · Provenza   │  │  cluster pops│
│ [Clear]    │ │   ★4.5 · $$ · Open till 3a│  │              │
│            │ │   "Warehouse techno…"     │  │              │
│            │ │   ♥   Ask   Details  →    │  │              │
│            │ └───────────────────────────┘  │              │
└────────────┴───────────────────────────────┴──────────────┘
```

---

## 3. Sections, features, components

| Zone | Component | Nightlife delta |
|---|---|---|
| Header | `BrowseHeader` (shared) | copy only |
| Safety | `SafetyBanner` | keep current copy; add ⚠ icon; subtle, not alarming |
| Filters | `FilterBar` (shared) | Vibe + Open-tonight + Cover; **active chip = magenta** |
| Card | **`VenueCard`** (shared) | **add image (duotone)**, rating, price-level, "open till"; `[♥][Ask][Details]` |
| Map | `MapColumn` (shared) | magenta pins; cluster styling for Lleras/Provenza |
| Detail | `VenueDetailSheet` | photos, hours/"open till," cover, music nights, Directions, "what's on tonight" |

---

## 4. Images — the make-or-break layer for this vertical
- **Mandatory** — a nightlife card without a photo is dead on arrival.
- Apply a **slate→magenta duotone** over Places photos to (a) unify mixed-quality club shots and (b) instantly signal "night/going out." This is the single biggest visual upgrade in the whole pack.
- Fallback: magenta→slate gradient + a neon-style glyph (🍸/♪). Never a broken icon.
- Consider a subtle film-grain/neon-glow on hover (respect `prefers-reduced-motion`).

---

## 5. Color & mood
- **Accent: magenta/violet `oklch(0.65 0.22 330)`** (neon). This is what makes nightlife *feel* different from caramel cafés and terracotta restaurants while sharing the layout.
- Push the darkest surface here — nightlife can sit on the deepest slate; let the magenta and photo glow do the work.
- Pins, active chips, hover ring, "open till" badge all use magenta.

---

## 6. User-flow & content fixes
1. **Time awareness:** "Open tonight," "Open now," "till 3am" — nightlife is a *when* decision. Surface it on the card.
2. **Tie to events:** mdeai already has `/events` + grounded event discovery — a club card should show "Tonight: [event]" when one exists. This is a unique cross-vertical advantage (clubs × events).
3. **Card → detail sheet**, not Google. `[♥ Save]` to build a "Saturday night" shortlist. `[Ask]` → chat ("salsa near Provenza, no cover, after 11").
4. Keep the **safety banner** — it's a trust signal competitors don't have.

---

## 7. Inspiration (scores in [travelai-links.md](../travelai-links.md))

| Pattern | From |
|---|---|
| Night-mood imagery + "tonight" listings | **Resident Advisor**, **Citizine**, **Fever** |
| Vibe-first filtering | **Resident Advisor** (genre), **Fever** |
| Map cluster as a selling visual | **Wanderlog**, **Mindtrip** |
| Duotone to unify mixed photos | **Spotify** (editorial), **Bandsintown** |
| Club × event tie-in | **Dice.fm**, **Fever** |

---

## 8. Build order
1. Adopt shared `VenueCard`/`BrowseLayout`/`FilterBar`.
2. **Add images with duotone** (highest visual ROI in the pack) + rating/price from Places.
3. Add map column + magenta pins + Lleras cluster.
4. Wire "open tonight" + event tie-in (uses existing events data).
5. `[♥][Ask][Details]` actions + `VenueDetailSheet`; Directions moves inside.
