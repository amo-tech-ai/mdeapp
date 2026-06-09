---
title: "Component Mapping — /rentals catalog · /rentals/[id] · Map workspace"
updated: 2026-06-06
owner: sanjiovani
scope: maps the 3 new wireframes (rentals-browse · rental-detail · map-workspace) to shadcn primitives + 21st.dev references
sources:
  - ./component-inventory.md        # D-04 — global 70/20/10 inventory
  - ../wireframe/rentals-browse-wireframe.html
  - ../wireframe/rental-detail-wireframe.html
  - ../wireframe/map-workspace-wireframe.html
registry: "@shadcn only (verified via shadcn MCP 2026-06-06); 21st.dev is a copy-paste gallery, NOT a configured registry"
---

# Component Mapping — rentals + map workspace

> **One line:** the 3 new pages need **9 new shadcn primitives** on top of the 19 already installed. **21st.dev is not a registry** here — its [`/s/shadcn-ui` blocks](https://21st.dev/community/components/s/shadcn-ui) are copy-paste markup you adapt to our oklch tokens, not `npx` installs.

## Registry reality (verified via shadcn MCP)

- Configured registry: **`@shadcn` only** (`components.json` → `registries: {}`).
- **21st.dev** (`https://21st.dev/community/components/s/shadcn-ui`) = a gallery of shadcn-styled blocks. You **copy the JSX**, paste into our components, then conform to our tokens (teal/gold, pale-teal placeholders) and strip clichés (Sparkles, oklch gradient text → solid). Per `index-design.md`: **70% shadcn / 20% 21st / 10% custom**.

## Installed vs. to-install

**✅ Already installed (19):** `avatar` `badge` `button` `card` `carousel` `command` `dialog` `dropdown-menu` `input` `input-group` `label` `separator` `sheet` `sidebar` `skeleton` `sonner` `tabs` `textarea` `toggle` `tooltip`

**➕ Install for these 3 pages (9, all verified in `@shadcn`):**

```bash
npx shadcn@latest add @shadcn/popover @shadcn/slider @shadcn/hover-card @shadcn/drawer @shadcn/resizable @shadcn/breadcrumb @shadcn/select @shadcn/toggle-group @shadcn/empty
```

| New primitive | Needed by | Why |
|---|---|---|
| `popover` | rentals filter bar | filter dropdowns (neighborhood, beds) |
| `slider` | rentals filter bar | COP price range |
| `select` | rentals filter / sort | type, sort dropdowns |
| `toggle-group` | rentals filter / mobile | beds 1·2·3·4+, list⇄map toggle |
| `empty` | all 3 (empty states) | shadcn's canonical empty-state block |
| `breadcrumb` | rental detail | Home / Rentals / listing |
| `drawer` | rentals + map mobile | vaul bottom sheet (card sheet over map) |
| `resizable` | map workspace | optional rail ⇄ map split handle |
| `hover-card` | map workspace | floating mini-card on pin (or custom popover) |

**♻ Reuse — do NOT rebuild** (hard rules / existing code): **CopilotKit** input + popup (concierge, refine, HITL `renderAndWaitForResponse`) · **`@vis.gl/react-google-maps` ChatMap** + `AdvancedMarker` (every map; `mapId` + `X-Goog-FieldMask`) · **`VenueCard`** (D-08 / SAN-574 — the rental skin, similar row, map rail, floating card all use it).

---

## Page A — `/rentals` catalog  (`rentals-browse-wireframe.html`)

| # | Section | shadcn primitive(s) | Status | 21st ref / note |
|---|---|---|---|---|
| 01 | Nav (rentals active) | `button` + `sheet` (mobile) | ✅ | custom navbar; active = teal outline |
| 02 | Filter bar | `popover` · `slider` · `select` · `toggle-group` · `badge` · `button` | ➕ | active filters → removable `badge` chips |
| 03 | Results header | `dropdown-menu` · `badge` | ✅ | sort menu + live count |
| 04 | List │ map split (core) | `card`→**VenueCard** · **♻ @vis.gl map** · `tooltip` | ♻+✅ | **price pins**, hover↔card sync (→ Page C) |
| 05 | RentalCard | **VenueCard** = `card`·`badge`·`button` | ♻ (D-08) | rental skin: beds/baths/m² + Schedule-viewing CTA |
| 06 | Concierge refine | **♻ CopilotKit input** | ♻ | NL → structured filters |
| 07 | States | `skeleton` · `empty` | ✅+➕ | empty → concierge CTA (never dead end) |
| 08 | Mobile | `sheet` · `drawer` · `toggle-group` | ✅+➕ | filters in Sheet; list⇄map toggle |

## Page B — `/rentals/[id]` detail  (`rental-detail-wireframe.html`)

| # | Section | shadcn primitive(s) | Status | 21st ref / note |
|---|---|---|---|---|
| 01 | Back + breadcrumb | `breadcrumb` · `button` | ➕ | back preserves catalog filters |
| 02 | Photo gallery | `carousel` · `dialog` (lightbox) | ✅ | fetch photos on open only (cost) |
| 03 | Title + sticky booking (conversion) | `card` · `badge` · `button` · **♻ CopilotKit HITL** | ♻+✅ | Schedule viewing → `/api/leads/schedule-viewing` |
| 04 | Specs + amenities | `badge` · `separator` | ✅ | glyph + label pills (lucide) |
| 05 | Description + AI insight | custom prose + `button` ("read more") · gold strip | 🎨 | grounded summary; hide if empty |
| 06 | Location map | **♻ @vis.gl map** | ♻ | single pin, `mapId` + FieldMask |
| 07 | Similar rentals | `carousel` + **VenueCard** | ♻+✅ | 21st **gallery4** as row pattern |
| 08 | States | `skeleton` · `empty` | ✅+➕ | delisted → "see similar" |

> No `collapsible`/`accordion` needed — "read more" is a `button` toggle. Add `accordion` only if specs become long sectioned groups.

## Page C — Map workspace (D-11)  (`map-workspace-wireframe.html`)

| # | Section | shadcn primitive(s) | Status | 21st ref / note |
|---|---|---|---|---|
| 01 | Layout (rail │ map) | `resizable` · `card`→**VenueCard** · **♻ ChatMap** | ➕+♻ | rail virtualized |
| 02 | Two-way card↔pin sync (core) | custom shared `activeId` · **♻ AdvancedMarker** | 🎨+♻ | implements **UX-024** hover parity |
| 03 | Pin click → floating card | `hover-card` *or* `popover` + **VenueCard** | ➕+♻ | not the native gray InfoWindow |
| 04 | Clustering + controls | **♻ marker clusterer** · `button` · `tooltip` | ♻+✅ | clear stale markers (**UX-033**) |
| 05 | States | `skeleton` · `empty` | ✅+➕ | map fail → list fallback |
| 06 | Mobile | `drawer` (vaul snap) | ➕ | map fullscreen + draggable card sheet |

---

## Legend

✅ installed · ➕ `npx shadcn add` (verified in `@shadcn`) · ♻ reuse existing code, don't rebuild · 🎨 custom / 21st copy-paste (the 10%).

## 21st.dev usage rule

From [`/s/shadcn-ui`](https://21st.dev/community/components/s/shadcn-ui): treat blocks as **starting markup**, not dependencies. Pull the JSX, then: swap any `oklch()`/gradient text → solid `text-foreground`; teal = interactive, gold = AI + stars only; pale-teal (`#E1F6F2`) placeholders; guard motion with `prefers-reduced-motion`. Re-verify any block against our tokens before merge. Applicable picks already scored in `home-wireframe.html`: **gallery4** (curated rows), **large-name-footer**, **cta-with-marquee** — none required for these 3 pages except gallery4 (similar/trending rows).

## Handoff

- **One install PR** for the 9 primitives unblocks all 3 pages (extends D-07 / SAN-573).
- **Build order:** finish **D-08 VenueCard** (SAN-574) first — it's the shared dependency for every list/rail/floating card here.
- **Open question:** floating mini-card via `hover-card` (simpler) vs custom `popover` anchored to marker (more control on mobile)? Recommend `hover-card` for desktop, `drawer` peek for mobile.
