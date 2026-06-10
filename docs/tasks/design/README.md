---
title: mdeai — Design Improvement Pack (cafes · restaurants · nightlife)
updated: 2026-06-04
author: design review (forensic, grounded in live prod + shipped tokens)
scope: live-page review → cross-cutting improvements (chat, images, color, flow) → per-page specs → mockup
related:
  - ./docs/design-plan.md        # prior forensic audit (design stack + competitor UX)
  - ./docs/concierge-os-direction.md  # OS direction option (IA + dashboard framing, light-luxury)
  - ./travelai-links.md          # categorized, scored inspiration index
  - ./pages/cafes.md
  - ./pages/restaurants.md
  - ./pages/nightlife.md
  - ./mockups/cafes.html          # real oklch-token mockup
sources: live prod fetch 2026-06-04 · mdeapp/src/app/globals.css · DESIGN.MD · sitemap.md
---

# mdeai — Design Improvement Pack

**Verdict in one line:** the product's *vision* (chat ↔ map concierge, per-vertical identity) is strong, but the three browse verticals shipped at three different maturity levels with three different card schemas and **no map** — so the highest-leverage move is **one shared browse system** (card + layout + map + detail), not new visuals.

> Scope note: this pack focuses on **cafes, restaurants, nightlife** (the user's stated focus) plus the cross-cutting layers they share — **chat, images, color palette, user flow**. Home, /saved, /host/event/new are referenced where they touch these flows. Prior deep audit lives in [`docs/design-plan.md`](docs/design-plan.md); inspiration index in [`travelai-links.md`](travelai-links.md).

---

## 1. What's actually shipped today (live prod, fetched 2026-06-04)

| Page | Status | Cards | Image | Rating | Price | Map | Card CTA | Verdict |
|---|---|---|---|---|---|---|---|---|
| `/restaurants` | ✅ LIVE | 11 | ⚠️ mixed stock+real | ✅ 4.4–4.9 | ✅ $/person | ❌ | **Directions only** (→ Google) | Most complete, but leaks users off-site; descriptions truncate mid-sentence |
| `/nightlife` | ✅ LIVE | 13 | ❌ none | ❌ none | ❌ | ❌ | **Directions only** | Looks like a spreadsheet — no imagery, no mood |
| `/cafes` | ⚠️ SHELL | 0 | — | — | — | ❌ | "Open concierge chat" | Empty "coming soon" placeholder |
| `/` (home) | ✅ LIVE | in-chat | — | — | — | ✅ (empty state) | chat-driven | Good chat+map bones; no browse entry cards; weak map empty state |

**Three problems jump out:**
1. **Inconsistency** — restaurants ≠ nightlife ≠ cafes. Different fields, different completeness. No shared card.
2. **No map on any browse page** — yet home is map-centric and the brand is "a city night map." The signature asset is abandoned the moment you leave home.
3. **Cards dead-end at Google Maps** — the only action is "Directions," which sends users *off* mdeai. No detail page, no save, no "ask the concierge about this."

> Note on screenshots: live PNG capture was blocked in this environment (browser-profile lock; I declined to kill the running Chrome). Findings above are from server-rendered DOM fetches + reading the page source (`mdeapp/src/app/{restaurants,nightlife,cafes}/page.tsx`) + `globals.css`. Each per-page doc lists the exact DOM I observed so a designer can reproduce.

---

## 2. The five cross-cutting improvements (chat · images · color · flow · consistency)

### 2A. Consistency — ship ONE browse system *(highest leverage)*
Today each vertical reinvents the card. Replace with a **shared `<VenueCard>` + `<BrowseLayout>`**, parameterized per vertical:

```
<BrowseLayout vertical="cafes">
  ├─ FilterBar        (neighborhoods + vertical-specific facets, active-state chips, "Clear")
  ├─ ResultsColumn    (list of <VenueCard>, skeletons while loading, "X places" count)
  │    └─ <VenueCard> (image · name · neighborhood · rating · 2-line clamp · tags · actions)
  └─ MapColumn        (sticky on desktop; pins synced to cards; toggle on mobile)
```

One component, three skins. Cafes inherits restaurants' completeness for free; nightlife gains images + the same action row. This single change fixes problems #1 and most of #3.

### 2B. Images — the weakest layer
- **Every card gets a consistent 16:10 image**, `rounded-xl`, with a subtle bottom gradient scrim so an overlaid name/neighborhood stays legible.
- **Source:** Google Places photos via the existing `/api/places/photo` proxy (FieldMask-gated). **Never** render a broken-image icon.
- **Fallback:** a *branded gradient placeholder per vertical* (the vertical accent → slate) with the vertical glyph centered — so a missing photo still looks intentional.
- **Blur-up:** `next/image` `placeholder="blur"` (tiny base64) to kill layout shift and the "pop-in."
- **Nightlife mood:** apply a slate→accent duotone over mixed-quality club photos to unify them and signal "night." This is the difference between "spreadsheet" and "going out tonight."
- **Fix truncation:** 2-line CSS `line-clamp` with ellipsis — never hard-cut a sentence server-side (current restaurants bug: "Verdeo is a restaurant located…").

### 2C. Color palette — stop the drift, build the per-vertical system
**Finding:** the documented system and the shipped system disagree.

| Token | DESIGN.MD (documented) | `globals.css` (shipped) | Reality |
|---|---|---|---|
| brand | amber on near-black midnight | **teal `primary` + gold `accent` on slate** ("Paisa") | shipped wins — more Medellín |
| `--accent` | `oklch(0.78 0.18 65)` amber | `oklch(0.795 0.184 86)` gold | drifted (hue 65→86) |
| `--primary` | (amber-centric) | `oklch(0.696 0.17 175)` teal | DESIGN.MD never mentions teal |
| map-pin tokens | 4 per-vertical specified | **none exist** | signature element never built |

**Recommendation:**
1. **Adopt the shipped "Paisa" theme as the source of truth** (teal/gold/slate reads more Colombian than generic amber) and **update DESIGN.MD to match** — kill the drift.
2. **Build the per-vertical accent system** that DESIGN.MD promised but CSS lacks. Give each vertical one accent, used for: active filter chip · map pin · card hover ring · section underline. Shared layout, distinct identity:

   | Vertical | Accent (proposed oklch) | Feel |
   |---|---|---|
   | Restaurants | `oklch(0.70 0.17 40)` terracotta/orange | warm, appetite |
   | Cafés | `oklch(0.80 0.13 85)` caramel/gold | cozy, daytime |
   | Nightlife | `oklch(0.65 0.22 330)` magenta/violet | neon, night |
   | Rentals | `oklch(0.70 0.15 220)` blue | trust, home |
   | Events | `oklch(0.795 0.184 86)` gold | the existing accent |

3. Keep the global teal `--primary` for system chrome (nav, focus rings, links); the **vertical accent is a layer on top**, not a replacement.

### 2D. User flow — close the loop, stop the off-site leak
Current: home is chat-only (no browse entry cards) → browse pages reached via nav → cards dead-end at Google.

Improved:
- **Home:** keep chat+map, but add a **"Browse" row of 5 vertical entry cards** below the hero for users who'd rather tap than type (Wanderlog/Mindtrip both offer browse *and* chat).
- **Card click → detail sheet** (reuse the `/chat` venue-detail-sheet overlay), not a Google redirect.
- **Detail actions:** `[Save ♥]` · `[Ask concierge]` · `[Directions]` · `[Add to trip]`. Directions becomes secondary, *inside* detail.
- **Chat ↔ browse loop:** "Ask concierge" deep-links to chat with the venue pre-loaded ("Tell me about El Cielo"). This is the Mindtrip living-sync move and mdeai's biggest unbuilt advantage.
- **Cross-sell:** restaurant detail shows "cafés nearby / nightlife nearby" — keeps the session alive.

### 2E. Chat — make in-chat results identical to browse
- In-chat result cards **must be the same `<VenueCard>`** as browse (consistency + less code).
- **Skeletons while the agent searches** (perceived latency) + **map pins drop as results stream**.
- **Card hover ↔ pin highlight** (the Mindtrip "living map").
- **Smarter suggested prompts**, time/context aware: "salsa tonight in Provenza," "brunch cafés in Laureles with wifi," "rooftop cocktails near me."
- **Replace the weak map empty state** ("Map is ready") with an inviting prompt + a few sample pins so the right panel is never dead.

---

## 3. Tools, templates & Figma — what I'd actually use

**Short answer: don't buy a template. Build the component system on what you already have** (shadcn/base-nova + Tailwind v4 + oklch). A heavy travel template (Webflow/ThemeForest) would fight the token system and the Next 16 / RSC architecture. Detail and links in [`travelai-links.md`](travelai-links.md).

| Need | Use | Why |
|---|---|---|
| Design surface | **Figma** + official **Figma MCP** (already configured in `.mcp.json`) | design→code both directions; matches the repo |
| Component base | **shadcn/ui** (in use) + **shadcn blocks** (sidebar-filter, gallery, card grid) | zero new deps; tokens already wired |
| Map | **Google Maps** + `vis.gl/react-google-maps` `AdvancedMarker` (mapId required — hard rule) | already wired; needed for the split view |
| Motion | **tw-animate-css** (in use); Framer only for throwaway prototypes | keep runtime light |
| Mockup handoff | the included **[`mockups/cafes.html`](mockups/cafes.html)** (real oklch tokens) | paste-ready visual target before React work |

**Inspiration to actually copy (not browse):** Mindtrip (chat↔map↔itinerary living sync) · Wanderlog (map+list duality, save-to-collection) · Airbnb (card image treatment + sticky filter bar) · Resy/OpenTable (restaurant mood) · Resident Advisor/Citizine (nightlife night-mood imagery). Full scored list in [`travelai-links.md`](travelai-links.md).

---

## 4. Per-page specs

| Doc | Page | Headline change |
|---|---|---|
| [`pages/cafes.md`](pages/cafes.md) | `/cafes` (SHELL) | Build it — clone the browse system; biggest single win |
| [`pages/restaurants.md`](pages/restaurants.md) | `/restaurants` (LIVE) | Add map + save + detail; fix image consistency + truncation |
| [`pages/nightlife.md`](pages/nightlife.md) | `/nightlife` (LIVE) | Add images + ratings + mood; reach card parity with restaurants |

---

## 5. Mockup

[`mockups/cafes.html`](mockups/cafes.html) — a real, standalone HTML mockup of the **cafés browse page** (the SHELL → biggest win), using the **actual shipped oklch tokens** from `globals.css` (dark "city night" default, teal/gold) plus the proposed caramel café accent, the shared `<VenueCard>`, the split list+map layout, and branded image fallbacks. Open it in a browser to see the target.

**Next step I can take on request:** port the mockup to a real `<VenueCard>` + `<BrowseLayout>` React/shadcn component and wire `/cafes` to the existing grounded-places search — or produce the same mockup for restaurants & nightlife.
