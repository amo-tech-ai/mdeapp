# 02 — Discovery: Restaurant · Rental · Nightlife/Events

All three share the **list + map** discovery shell: sticky `FilterBar` (00 §5), scrollable `ResultCard` list (00 §6), synced `MapCanvas` (00 §4). A persistent `ConciergeInput` lets users refine in natural language. Differences are per-vertical card anatomy, filters, and CTAs.

Shared shell:

```text
DESKTOP discovery shell
┌──────────────────────────────────────────────────────────────────┐
│ TopNav                                                             │
├──────────────────────────────────────────────────────────────────┤
│ [Neighborhood▾][Price▾][…vertical pills…][More] · active chips ✕   │ sticky FilterBar
├───────────────────────────────┬────────────────────────────────────┤
│ 24 results · Sort: Recommended │                                    │
│ ┌─ ResultCard ① ────────────┐ │        ●②    ●④                     │
│ │ photo · title · ★ · price  │ │      ●①   ◉③(selected)             │ MapCanvas
│ │ [Primary CTA] [Save ♡]     │ │        (clusters at zoom-out)      │ (pins ↔ cards)
│ └────────────────────────────┘ │                                    │
│ ┌─ ResultCard ② ────────────┐ │     ▣ from Google Maps              │
│ └────────────────────────────┘ │                                    │
│  …scroll…                       │  [ Search this area ] (on pan)     │
├───────────────────────────────┴────────────────────────────────────┤
│ ┌ refine: "only with parking under $1.4M"            🎤  ➤ ┐         │ ConciergeInput
└──────────────────────────────────────────────────────────────────┘
```

```text
MOBILE: list view + [ Map ◍ ] FAB → full-screen map + BottomSheet (peek/half/full).
Filters → single [Filters ⚙ (3)] button → full sheet. Docked ConciergeInput above bottom-tab.
```

---

## #4 Rental discovery  ·  `/rentals`  ·  persona: Camila

**Goals:** turn "where do I live" into ≤ a handful of trustworthy, map-placed options and capture a **lead** (Schedule viewing) — not bounce to an OTA.

| Aspect | Spec |
|---|---|
| Filters | Neighborhood · Price (range, **shows total**) · Beds/Baths · Furnished · Amenities · **Verified only** ☑ · Distance from metro/pin |
| Card | `ResultCard(RENTAL)` — carousel · ① index · ★(count) · ✔ Verified · `$1,200/mo · total $1,320` · "10 min from metro · 350m to coffee" |
| Pins | **Price pins** (`$1.2M`); selected = accent + lifts card |
| Primary CTA | **Schedule viewing** → `LeadForm` (HITL) → `leads` row. Secondary: Save ♡ |
| Sort | Recommended · Price · Closest to [pin] · Newest |
| Local intel | "X min from metro", nearby coffee/coworking density chips (the Medellín graph payoff) |

**Monetization:** lead fee → (Advanced) booking commission. **Retention:** Save + "alert me for new in Laureles ≤$1.5M" (Post-MVP). **Trust:** Verified badge + grounding + total price (anti-GuideGeek $107→$1,009).

### States
| View | Default | Loading | Empty | Error |
|---|---|---|---|---|
| List | cards + price pins | 4 skeleton cards | "No verified rentals match — widen price/neighborhood" + [Reset] | retry banner, keep last pins |
| Lead submit | form | spinner on submit | — | "Couldn't send — retry / WhatsApp us" |

---

## #3 Restaurant discovery  ·  `/restaurants`  ·  persona: Tourist + Camila

**Goals:** semantic, vibe-led food discovery ("best cafés to work from", "date-night arepas") grounded in real open-now places.

| Aspect | Spec |
|---|---|
| Filters | Neighborhood · Cuisine · **Vibe** (laptop-friendly, romantic, lively, quiet, rooftop) · Price band `$–$$$$` · Open now · ★ ≥ · Distance |
| Card | `ResultCard(RESTAURANT)` — photo · ② index · ★(count) · vibe tags · **"Best for: focus work, espresso"** (AI, labeled) · Open now · grounding |
| Pins | **Glyph pins** (☕ 🍽); selected accent |
| Primary CTA | **Add to trip** / **Reserve** (Post-MVP bookings) · Directions · Save ♡ |
| Sort | Recommended · ★ · Closest · Open now |
| Local intel | "best dish", review-synthesis themes ("what people say"), creator picks (Post-MVP) |

**Monetization:** reservation fees + promoted placements (labeled, Post-MVP). **Retention:** Save to collections; vibe search is the sticky differentiator. **Trust:** `ReviewSynthesis` (grounded, labeled AI) + open-now from Places.

### States: list default cards+glyph pins · loading skeletons · empty "No spots match that vibe — try 'quiet' or widen area" · error retry. Detail fetch (photos/hours) **on card open only**.

---

## #5 Nightlife & Events  ·  `/nightlife`  ·  persona: Tourist + Andrés/Miguel

**Goals:** answer "what's good tonight/this weekend" — blend venues (nightlife) + ticketed events; drive **ticket purchase** (O1) and venue reservations.

```text
┌──────────────────────────────────────────────────────────────────┐
│ [Tonight] [This weekend] [Date ▾]  [Neighborhood▾][Vibe▾][Type▾]   │ time-first filters
├───────────────────────────────┬────────────────────────────────────┤
│ TONIGHT (Fri Jun 6)            │                                    │
│ ┌Event ③ Salsa Night──────┐   │      ●④ rooftop                     │
│ │ poster·Provenza·9pm      │   │    ●③ event                         │ pins: events vs
│ │ from $25 · 124 going     │   │                                    │ venues (glyph)
│ │ [ Buy tickets ] [Save ♡] │   │                                    │
│ └──────────────────────────┘   │  ▣ from Google Maps                │
│ ┌Venue ④ Rooftop X────────┐    │                                    │
│ │ cover $20 · ★4.7 · lively│   │                                    │
│ │ [ View · Reserve ] [♡]   │   │                                    │
│ └──────────────────────────┘   │                                    │
└───────────────────────────────┴────────────────────────────────────┘
```

| Aspect | Spec |
|---|---|
| Filters | **Time-first** (Tonight / Weekend / Date) · Neighborhood · Vibe · Type (club/bar/rooftop/live/event) |
| Cards | `ResultCard(EVENT)` (Buy tickets) + `ResultCard(NIGHTLIFE)` (Reserve/View) interleaved by relevance/time |
| Pins | Events vs venue glyphs; "tonight" emphasized |
| Primary CTA | Events → **Buy tickets** (→ checkout, 04). Venues → **Reserve/View** |
| Local intel | "going" counts, nightlife heatmap (Post-MVP), Provenza/Poblado density |

**Monetization:** **ticket commission (primary money path)** + venue promos + guest-list (Advanced). **Retention:** "going" social proof, event reminders/alerts (WA templates Phase 2), Save. **Trust:** verified organizers, transparent fees, ★ for venues.

### States: default tonight feed · loading skeletons · **empty (time-scoped): "Nothing ticketed tonight — see this weekend →"** (never dead-end) · error retry. Past events filtered out (B-06 lesson).

---

## Cross-cutting discovery UX
- **Search this area** appears on map pan (Airbnb pattern); list re-queries.
- **Refine via chat** — `ConciergeInput` at bottom turns NL into filter+query (bridges conversational ↔ structured).
- Card↔pin bidirectional highlight everywhere (00 §4).
- New results **augment** pins (cross-fade), never silently wipe (UX-007).
- Mobile: list-first, Map FAB → bottom sheet; one Filters button w/ active count.
