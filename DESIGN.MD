# DESIGN.MD — mdeai Design System & UI/UX Planning

> **Scope:** Phase 1 (Week 1–6) · Platform: mdeapp repo root (Next.js 16, React 19, Tailwind v4, shadcn/ui, `@base-ui/react`)
> **Skills to load for UI work:** `shadcn` · `tailwind-best-practices` · `ui-ux-pro-max` · `copilotkit-integrations` · `web-design-guidelines`
> **Design system:** `base-nova` (shadcn style using `@base-ui/react` primitives, Tailwind v4 + oklch color space)
> **Last updated:** 2026-06-02

---

## 1. Visual Theme

**Identity:** Medellín-first AI concierge. Dark by default, light toggle available. Not a generic SaaS dashboard — it reads like a city night map: deep midnight backgrounds, warm accent amber, crisp white typography, map chrome that feels native, not embedded.

**Character:**
- **Purposeful density.** Cards pack photo + context + CTA in a scannable unit. No padded-out whitespace for visual breathing room alone.
- **Chat is the spine.** Every surface — rentals, restaurants, events, tickets — flows through the chat lane. The map is a viewport into what the AI found; cards are rendered tool results, not catalog rows.
- **AI as author.** Each card has an AI-written intent reason ("Closest to your route from Laureles, outdoor seating, strong paisa lunch menu") — not a static description. The AI voice is confident but brief.
- **Competitive differentiator over Mindtrip:** persistent planning workspace (save/collections), local depth (Supabase-curated venues with real data), Google-grounded fallback, integrated map pins with vertical glyphs.

---

## 2. Color Tokens

All tokens live in `src/app/globals.css` as CSS custom properties under `@theme`.

### Dark mode (default)

| Token | Value | Use |
|---|---|---|
| `--background` | `oklch(0.12 0.008 264)` | Page background, chat canvas |
| `--background-elevated` | `oklch(0.16 0.009 264)` | Cards, panels, sidebars |
| `--background-overlay` | `oklch(0.20 0.010 264)` | Modals, sheets |
| `--foreground` | `oklch(0.97 0.004 264)` | Primary text |
| `--foreground-muted` | `oklch(0.65 0.008 264)` | Secondary text, labels |
| `--foreground-subtle` | `oklch(0.45 0.006 264)` | Disabled, placeholder |
| `--accent` | `oklch(0.78 0.18 65)` | Amber CTA, active chips, map pin fill |
| `--accent-foreground` | `oklch(0.12 0.008 264)` | Text on amber |
| `--border` | `oklch(0.25 0.009 264)` | Card edges, dividers |
| `--ring` | `oklch(0.78 0.18 65)` | Focus ring (3px offset) |
| `--destructive` | `oklch(0.62 0.22 25)` | Error states |
| `--success` | `oklch(0.72 0.18 160)` | Confirm, paid, verified |
| `--map-pin-rental` | `oklch(0.72 0.18 220)` | Blue map pins for rentals |
| `--map-pin-event` | `oklch(0.78 0.18 65)` | Amber map pins for events |
| `--map-pin-restaurant` | `oklch(0.72 0.18 25)` | Orange map pins for restaurants |
| `--map-pin-cafe` | `oklch(0.82 0.12 85)` | Warm yellow for cafes |

### Light mode

Toggle via `class="light"` on `<html>`. Swap `--background` to `oklch(0.99 0.004 264)`, `--foreground` to `oklch(0.12 0.008 264)`, `--background-elevated` to `oklch(0.96 0.006 264)`. Amber accent stays constant. Map chrome uses lighter `--background-elevated` tint.

### Do not use
- `hsl()` / `rgb()` inline values — always reference `--token` variables.
- Hardcoded Tailwind gray shades (`gray-700`, `zinc-800`) — use semantic tokens.
- White `#fff` as text — use `--foreground-muted` or `--foreground`.

---

## 3. Typography

**Font stack:** Geist Sans (primary), Geist Mono (code/amounts), system-ui fallback.

```css
@theme {
  --font-sans: 'Geist Sans', system-ui, sans-serif;
  --font-mono: 'Geist Mono', monospace;
}
```

### Scale (Tailwind v4 — reference these classes only)

| Role | Class | Size | Weight | Use |
|---|---|---|---|---|
| Display | `text-5xl font-bold` | 48px | 700 | Hero headers, empty state |
| H1 | `text-4xl font-bold` | 36px | 700 | Page titles |
| H2 | `text-2xl font-semibold` | 28px | 600 | Section headers |
| H3 | `text-xl font-semibold` | 20px | 600 | Panel titles, card heading |
| Body large | `text-base` | 16px | 400 | Chat messages, descriptions |
| Body | `text-sm` | 14px | 400 | Card metadata, labels |
| Caption | `text-xs` | 12px | 400 | Timestamps, chips, badges |
| Mono | `font-mono text-sm` | 14px | 400 | Price, coordinates, IDs |

**Rules:**
- Never use `font-light` (300) — minimum `font-normal` (400).
- AI intent reasons use `text-sm italic text-foreground-muted` — visually distinct from static content.
- Price tiers (`$`, `$$`, `$$$`) always `font-mono font-medium`.
- Minimum touch target for interactive text: 44x44px.

---

## 4. Components

### 4.1 Result Cards

Every vertical has a typed card. Cards are CopilotKit `useCopilotAction` render outputs — not static catalog items.

**Shared anatomy:**
```
+----------------------------------+
|  [Photo hero 16:9 or 4:3]        |  <- aspect-video or aspect-[4/3]
|  [Vertical badge top-left]       |  <- "Restaurant" / "Rental" / "Event"
|  [Save button top-right]         |  <- heart icon, useCopilotReadable
+----------------------------------+
|  [Name H3] [Price tier mono]     |
|  [Neighborhood chip] [Rating]    |
|  [Cuisine/Type chips]            |
+----------------------------------+
|  [AI intent reason italic]       |  <- "Why this matches your query"
+----------------------------------+
|  [Social proof line]             |  <- "4.7 * 340 reviews * Popular"
+----------------------------------+
|  [CTA buttons row]               |  <- Directions / Details / Reserve
+----------------------------------+
```

**Vertical-specific fields:**

| Vertical | Extra fields | CTA |
|---|---|---|
| Restaurant | Cuisine tags, Price tier, Opening hours | Directions, Reserve*, Source |
| Cafe | Specialties, Wi-Fi badge, Outdoor badge | Directions, Details |
| Rental | Bedrooms, Baths, m2, Amenity chips | Schedule Viewing, Contact |
| Event | Date, Time, Venue, Ticket tier | Buy Tickets, Save Event |
| Nightclub | Cover charge, Music genre, Hours | Directions, Details |

**Implementation file targets:**
- `RestaurantResultCard.tsx`, `CafeResultCard.tsx`, `RentalResultCard.tsx`, `EventResultCard.tsx`
- `search-tool-renders.tsx` — vertical dispatch

**Do not:**
- Invent prices, menus, or hours not in tool payload.
- Show empty photo placeholder — use a `skeleton` or category gradient fallback.
- Render `undefined` as text — guard every field.

### 4.2 Map Pins

Every vertical has a styled `<AdvancedMarker>` — always within a `<Map mapId="...">`.

```
Rental:     house icon (blue --map-pin-rental)
Event:      ticket icon (amber --map-pin-event)
Restaurant: fork-knife glyph + price tier "$" / "$$" (orange)
Cafe:       cup icon (warm yellow)
Nightclub:  music note (purple)
```

**Pin interaction pattern (from SCREEN-001 / MAP-001):**
1. Chat query -> tool result -> cards render -> pins appear.
2. Hover card -> pin bounces (150ms spring).
3. Click pin -> card scrolls into view, highlights 200ms.
4. Click card "Details" -> detail panel slides in from right (right column).
5. Active pin shows expanded label (name + price tier).

**Price pin label:**
```tsx
<div className="flex items-center gap-1 bg-background-elevated rounded-full px-2 py-0.5 text-xs font-mono">
  <ForkKnifeIcon className="w-3 h-3" />
  <span>{priceTier}</span>
</div>
```

### 4.3 Detail Panels (Right Column)

Slide in from the right into the 360-420px right column.

**Sections:** Overview, Photos, Reviews, Location
**Header:** Photo strip (4 thumbs), Name, Rating, Address, Distance
**Actions:** sticky bottom bar with primary CTA (Reserve / Book / Directions)

Triggered by `useCopilotReadable` state update -> `rentalDetail` / `restaurantDetail` / `eventDetail` in rental-ui-context.

### 4.4 Navigation Rail (Left Column, Desktop)

```
+--------------+
|  Logo mark   |  <- 40px icon
|  [Home]      |  <- /
|  [Chat]      |  <- /chat
|  [Rentals]   |  <- /rentals
|  [Events]    |  <- /host/events (host) or events modal
|  [Saved]     |  <- /saved (Phase 2)
|  ------      |
|  [Profile]   |  <- /login or avatar
|  [Settings]  |
+--------------+
```

**Width:** 240-280px. Collapsible to 64px icon-only mode.
**Mobile:** Hidden — replaced by bottom tab bar.
**Tablet:** Hidden — accessible via hamburger drawer.

### 4.5 Chat Input

Persistent on ALL pages. Docked at bottom. Never hidden behind a page transition.

```
+-------------------------------------------------+
|  [Chip: Restaurants] [Laureles] [Date]          |  <- context chips
|  +-------------------------------------------+  |
|  |  Ask anything about Medellin...            |  |  <- textarea
|  +-------------------------------------------+  |
|                              [Send]             |
+-------------------------------------------------+
```

- Context chips update based on last tool result (neighborhood, intent, date).
- On mobile: full-width, above keyboard (CSS `env(safe-area-inset-bottom)`).
- `data-testid="chat-input"`, `data-testid="chat-send"`.

### 4.6 Chips / Filter Chips

Two types:
- **Context chips** (above chat input): `bg-background-elevated border border-border rounded-full px-3 py-1 text-xs`
- **Filter chips** (above card list): active state `bg-accent text-accent-foreground`, inactive `bg-background-elevated text-foreground-muted`

Medellin-specific restaurant filter chips: Colombian, Paisa, Seafood, Date Night, Quick Lunch, Vegetarian, International

### 4.7 Skeleton Loaders

Every async surface needs a skeleton before data arrives.

```tsx
// Card skeleton
<div className="animate-pulse rounded-lg overflow-hidden">
  <div className="bg-foreground-subtle/20 aspect-video" />
  <div className="p-4 space-y-2">
    <div className="h-4 bg-foreground-subtle/20 rounded w-3/4" />
    <div className="h-3 bg-foreground-subtle/20 rounded w-1/2" />
  </div>
</div>
```

- Use `animate-pulse` (Tailwind built-in).
- Show 3 skeleton cards while first tool response streams.
- Pin skeletons: grey circles at estimated cluster positions.

### 4.8 Error + Empty States

**Error chip (inline, above cards):**
```
Warning: Could not load restaurants. [Retry]
```
Class: `bg-destructive/10 text-destructive border border-destructive/20 rounded-full px-4 py-2 text-sm`

**Empty state (full panel):**
```
[Vertical icon 64px]
No restaurants found for "vegan fusion Laureles"
Try: Colombian / Vegetarian / Laureles neighborhood
```

**Rules (from SCREEN-019):**
- Never show a blank panel — always empty state or skeleton.
- Error messages in English only.
- Retry buttons use `aria-live="polite"` region to announce new results.

### 4.9 Modals + Sheets

- Desktop: `Dialog` from `@base-ui/react` — centered, max-w-lg, backdrop blur.
- Mobile: `Sheet` — bottom-anchored, `snap-y` at 40% / 75% / full.
- All modals trap focus (`@base-ui/react` Dialog handles this natively).
- All sheets have a drag handle bar `w-12 h-1 rounded-full bg-foreground-subtle mx-auto`.

---

## 5. Layout System

### 5.1 Desktop (>=1280px) — 3-panel

```
+--------------+------------------------------+---------------------+
|  Left Rail   |  Center: Chat + Cards        |  Right: Map         |
|  240-280px   |  flex-1 (min 480px)          |  ~40% viewport      |
|  collapsible |  scroll: cards below chat    |  sticky, full-height |
+--------------+------------------------------+---------------------+
```

**Tailwind grid class:**
```tsx
<div className="grid grid-cols-[260px_1fr_40%] min-h-screen">
```

When detail panel opens: right column splits -> map shrinks to 50% of right, detail panel takes 50%.

**Key spec:** SCREEN-001 (`001-scr-home-chat-chrome.md`)
**Component:** `app/page.tsx` outer grid, `components/chat/chat-canvas.tsx`

### 5.2 Tablet (768px-1279px) — 2-panel

```
+------------------------------+---------------------+
|  Center: Chat + Cards        |  Right: Map         |
|  flex-1                      |  ~45% viewport      |
+------------------------------+---------------------+
[Hamburger drawer for left rail]
```

Left rail collapses to a drawer (`Sheet` triggered by hamburger icon in top-left header). Map stays visible to the right.

### 5.3 Mobile (<768px) — Bottom-sheet over full-bleed map

```
+---------------------------------+
|                                 |
|         Full-bleed Map          |
|         (100vh)                 |
|                                 |
+---- drag handle ----------------+  <- peek: 80px
|  Cards + Chat (bottom sheet)    |  <- half: 50vh / full: 85vh
|  [Card 1] [Card 2] [Card 3]...  |
+---------------------------------+
|  [Chat input -- docked]         |
+---------------------------------+
|  [Tab: Home][Chat][Map][Saved]  |  <- bottom tab bar, 48px
+---------------------------------+
```

**Bottom sheet states:** `peek` (80px, shows 1 card edge) -> `half` (50vh) -> `full` (85vh, scrollable cards).
**Map FAB:** Floating "Map" button when sheet is `full` to snap back to `peek`.
**Bottom tab bar height:** 48px + `safe-area-inset-bottom`.

**Key spec:** SCREEN-018 (`018-scr-mobile-responsive-shell.md`)
**Component:** `components/chat/map-mobile-sheet.tsx`

### 5.4 Breakpoints

| Breakpoint | Tailwind prefix | Layout |
|---|---|---|
| < 640px | default (mobile-first) | Bottom-sheet, full-bleed map |
| 640-767px | `sm:` | Same as mobile, slightly wider sheet |
| 768-1023px | `md:` | 2-panel (chat + map) |
| 1024-1279px | `lg:` | 2-panel, wider center |
| >=1280px | `xl:` | 3-panel (rail + chat+cards + map) |

**Grid implementation:**
```tsx
// Responsive outer shell
<div className="
  flex flex-col
  md:grid md:grid-cols-[1fr_45%]
  xl:grid xl:grid-cols-[260px_1fr_38%]
  min-h-screen
">
```

### 5.5 Spacing Scale

Use Tailwind v4 spacing only — `space-*`, `gap-*`, `p-*`, `m-*`.

| Token | Value | Use |
|---|---|---|
| `space-1` | 4px | Icon gaps |
| `space-2` | 8px | Chip internal padding |
| `space-3` | 12px | Card inner padding (sm) |
| `space-4` | 16px | Card inner padding (default) |
| `space-6` | 24px | Section gaps |
| `space-8` | 32px | Panel padding |
| `space-12` | 48px | Page section spacing |

---

## 6. Depth & Visual Hierarchy

### Shadows

```css
/* Cards (elevated) */
.card { box-shadow: 0 1px 3px oklch(0 0 0 / 0.3), 0 4px 12px oklch(0 0 0 / 0.2); }

/* Active pin labels */
.pin-label { box-shadow: 0 2px 8px oklch(0 0 0 / 0.4); }

/* Modals */
.modal { box-shadow: 0 8px 32px oklch(0 0 0 / 0.5); }
```

Never use `drop-shadow` utility — use `shadow-*` with custom shadow tokens.

### Borders

- Cards: `border border-border rounded-xl`
- Chips: `border border-border/50 rounded-full`
- Inputs: `border border-border focus:border-accent rounded-lg`
- No decorative borders between list items — use `gap-*` spacing.

### Z-index layers

| Layer | z-index | Elements |
|---|---|---|
| Base | 0 | Cards, content |
| Map | 10 | Map canvas |
| Pins | 20 | `<AdvancedMarker>` |
| Rail | 30 | Left nav rail |
| Sheet | 40 | Bottom sheet, right panel |
| Toast | 50 | Sonner toasts |
| Modal | 60 | Dialogs |
| Backdrop | 55 | Modal backdrop |

---

## 7. Animation & Motion

**Principle:** Communicate state, don't entertain. `prefers-reduced-motion: reduce` disables all transitions — test this.

| Animation | Duration | Easing | Trigger |
|---|---|---|---|
| Card appear (stagger) | 150ms delay per card | `ease-out` | Tool result arrives |
| Pin bounce | 200ms spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Card hover |
| Sheet snap | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Touch release / click |
| Right panel slide | 280ms | `ease-in-out` | Detail CTA click |
| Skeleton fade-out | 200ms | `ease-out` | Data ready |
| Toast enter | 250ms | `ease-out` | Action confirmation |
| Map zoom | 400ms (Maps SDK) | SDK default | Neighborhood query |
| Chat message stream | — | character-by-character | AG-UI stream |

```tsx
// Tailwind animation classes
"transition-transform duration-200 ease-out"  // pin bounce
"transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"  // sheet snap
```

**prefers-reduced-motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Do's and Don'ts

### Do
- Load `shadcn` + `tailwind-best-practices` skills before any UI implementation.
- Use `data-testid` on every interactive element (SCREEN-017 / SCREEN-019 requirements).
- Always provide a skeleton state before async data.
- Sync card hover state -> pin bounce via `onMouseEnter` / `onMouseLeave` on card.
- Use `oklch()` color space for all new tokens.
- Show AI intent reason on every card (`text-sm italic text-foreground-muted`).
- Add context chips above chat input that update with last tool result neighborhood/intent.
- Show `price tier` in `font-mono` always.
- Keep chat input docked and visible on all pages (Mindtrip lesson: persistent = better retention).
- Auto-zoom map to neighborhood context when restaurant/rental/event query returns.
- Add `mapId` on every `<Map>` parent when using `<AdvancedMarker>`.
- Add `X-Goog-FieldMask` on every Places API New call.

### Don't
- Use `@anthropic-ai/*` SDK anywhere in `src/**`.
- Mix CopilotKit v1/v2 imports — v1 only during Phase 1.
- Invent prices, menus, or hours not in the Mastra tool payload.
- Add Spanish text (`es` locale deferred to Phase 2).
- Use `gray-*` / `zinc-*` Tailwind shades — use semantic `--foreground-*` tokens.
- Render undefined/null as visible text — always fallback or hide.
- Add `<AdvancedMarker>` without `mapId` on parent `<Map>`.
- Make Places API calls without `X-Goog-FieldMask`.
- Flatten the 3-panel layout into a single column on desktop — it destroys the core UX.
- Add a standalone `/restaurants` catalog page that bypasses chat (Mindtrip lesson: chat-first routing).
- Omit `prefers-reduced-motion` handling on all animations.
- Add `service-role` keys anywhere under `src/**` outside the F13 carve-out paths.

---

## 9. Screens Inventory

Complete list of SCREEN spec files with IDs, Linear issues, file paths, and current status.

| ID | Title | Linear | Path | Status | Spec file |
|---|---|---|---|---|---|
| SCREEN-001 | Home / Chat Chrome | SAN-232 | `/` | In Review | `docs/tasks/wireframes/screens/001-scr-home-chat-chrome.md` |
| SCREEN-002 | Chat Nav Rail | SAN-488 | `/` | Not Started | `docs/tasks/wireframes/screens/002-scr-chat-nav-rail.md` |
| SCREEN-003 | Chat Query Bar | SAN-234 | `/` | Not Started | `docs/tasks/wireframes/screens/002-scr-chat-query-bar.md` |
| SCREEN-005 | Cafe Listings + Map + Booking | — | `/` (chat) | Not Started | `docs/tasks/wireframes/venues/005-scr-cafe-listings-map-booking.md` |
| SCREEN-006 | Event Card Polish | — | `/` | Not Started | `docs/tasks/wireframes/screens/003-scr-event-card-polish.md` |
| SCREEN-017 | Login / Signup Polish | SAN-112 | `/login`, `/signup` | In Review | `docs/tasks/wireframes/screens/017-scr-login-signup-polish.md` |
| SCREEN-018 | Mobile Responsive Shell | SAN-489 | All routes | Not Started | `docs/tasks/wireframes/screens/018-scr-mobile-responsive-shell.md` |
| SCREEN-019 | Loading / Error / Empty States | SAN-265 | All routes | Not Started | `docs/tasks/wireframes/screens/019-scr-loading-error-empty-states.md` |
| SCREEN-020 | Accessibility Pass | SAN-268 | All routes | Not Started | `docs/tasks/wireframes/screens/020-scr-accessibility-pass.md` |
| SCREEN-021 | Workflow Progress Strip | SAN-263 | `/host/event/new` | Not Started | `docs/tasks/wireframes/screens/017-scr-workflow-progress-strip.md` |
| SCREEN-022 | Schedule Viewing Modal | SAN-262 | `/rentals` | Not Started | `docs/tasks/wireframes/real-estate/017-scr-schedule-viewing-modal.md` |
| SCREEN-023 | Restaurant Listings + Map | SAN-490 | `/` (chat) | In Review | `docs/tasks/venues/tasks/mvp/wireframes/008-scr-restaurant-listings-map.md` |
| SCREEN-024 | Booking Checkout Modal | SAN-248 | `/events` | Not Started | `docs/tasks/wireframes/trips/010-scr-booking-checkout-modal.md` |
| SCREEN-025 | Saved Collections Page | SAN-253 | `/saved` | Not Started | `docs/tasks/wireframes/trips/014-scr-saved-collections-page.md` |
| SCREEN-026 | Trips Dashboard | SAN-255 | `/trips` | Not Started | `docs/tasks/wireframes/trips/012-scr-trips-dashboard.md` |
| SCREEN-027 | Itinerary Panel | SAN-251 | `/trips` | Not Started | `docs/tasks/wireframes/trips/013-scr-itinerary-panel.md` |
| SCREEN-028 | Rental Card Polish | SAN-242 | `/rentals` | Not Started | `docs/tasks/wireframes/real-estate/009-scr-rental-card-polish.md` |

### Priority order (Phase 1 MVP)

1. **SCREEN-001** — Home chat chrome (foundation, all else depends on it)
2. **SCREEN-003** — Chat query bar + chips
3. **SCREEN-023** — Restaurant listings (chat mode, Phase A)
4. **SCREEN-005** — Cafe listings (fork from restaurant)
5. **SCREEN-018** — Mobile shell (bottom sheet, bottom tab bar)
6. **SCREEN-019** — Loading/error/empty states (required for production quality)
7. **SCREEN-017** — Login/signup (auth wall before checkout)
8. **SCREEN-020** — Accessibility pass (WCAG 2.1 AA)

---

## 10. Responsive Design Checklist (Per-Screen)

Before any SCREEN spec is marked Done, verify:

- [ ] Desktop (1440px): 3-panel renders, no overflow
- [ ] Tablet (768px): 2-panel, left rail -> hamburger drawer
- [ ] Mobile (375px): bottom sheet, full-bleed map, bottom tab bar, chat input docked
- [ ] Map pins visible and interactive at all breakpoints
- [ ] Cards scroll horizontally on mobile (bottom sheet half-state)
- [ ] Detail panel: full-page on mobile, right column on desktop
- [ ] Chat input: above keyboard on mobile (CSS env variables)
- [ ] Touch targets >= 44x44px
- [ ] `prefers-reduced-motion` disables all transitions
- [ ] Dark mode renders correctly (default)
- [ ] Light mode toggle does not break layout
- [ ] `data-testid` attributes present on all interactive elements

---

## 11. Agent Prompt Guide (AI-Generated UI)

When building UI surfaces that CopilotKit's `useCopilotAction` renders, the AI author should include in Mastra agent instructions:

**Card payload structure** (all verticals, fields vary by type):
```ts
{
  id: string,
  name: string,
  photo_url: string | null,    // first photo from Places or Supabase
  neighborhood: string,
  cuisine: string[],           // max 3 tags (restaurant/cafe)
  price_tier: "$" | "$$" | "$$$",
  rating: number | null,
  review_count: number | null,
  ai_reason: string,           // 1-2 sentence intent match, English only
  lat: number | null,
  lng: number | null,
  place_id: string | null,
  cta_primary: "Reserve" | "Directions" | "Details" | "Book" | "View",
  source: "supabase" | "google"
}
```

**ai_reason examples (mdeai voice — confident local expert, short, English only):**
- "Matches your Laureles dinner request — outdoor terrace, strong paisa menu, closes at midnight."
- "Top-rated Colombian in Poblado for a date night — live music on weekends."
- "Closest to your El Poblado hotel, opens for lunch at noon."

**Tone:** Confident local expert. Short sentences. No hedging. English only in Phase 1.

---

## 12. Skills Reference

Load these when working on UI tasks (max 5 per task):

| Skill | Slug | Trigger |
|---|---|---|
| shadcn/ui components | `shadcn` | Any component implementation |
| Tailwind v4 patterns | `tailwind-best-practices` | Layout, spacing, responsive |
| CopilotKit screens | `copilotkit-integrations` | Any CopilotKit render/action |
| UI/UX design work | `ui-ux-pro-max` | Design decisions, wireframe review |
| Web design guidelines | `web-design-guidelines` | Accessibility, polish |
| Maps integration | `mde-maps` | Any map, pin, or Places work |
| Testing standards | `testing` + `webapp-testing` | Before marking any screen Done |

**Load order for a typical screen task:**
```
1. shadcn                   (component building blocks)
2. tailwind-best-practices  (layout + responsive)
3. copilotkit-integrations  (if useCopilotAction/useCoAgent involved)
4. ui-ux-pro-max            (design review gate)
5. webapp-testing           (before marking Done)
```

---

## 13. Mindtrip Competitive Findings (Live Review 2026-06-02)

Patterns observed on mindtrip.ai that inform our design decisions:

| Pattern | Mindtrip | mdeai direction |
|---|---|---|
| **Architecture** | Chat-first, no `/restaurants` page | Same — all verticals through `/chat` |
| **Card intent reason** | Per-card AI reasoning matched to query | Required on every card (`ai_reason` field) |
| **Map integration** | Auto-zooms to neighborhood on query | Required — trigger on tool result |
| **Price pins** | Fork-knife glyph + `$` tier on map pins | Required — styled `<AdvancedMarker>` |
| **Chat input** | Persistent on ALL pages including detail | Required — never hide chat input |
| **Planning workspace** | Trip board / save flow | Phase 2 (SCREEN-025 Saved Collections) |
| **Restaurant page** | Does NOT exist standalone | We should NOT add `/restaurants` catalog |
| **Filter chips** | Query-specific, update per result set | Required — chips sync to tool result |
| **Photo density** | High — photo hero is primary identifier | Required — skip card if no photo fallback |
| **Mobile bottom sheet** | Cards slide up over map | Required — SCREEN-018 |

**Key advantages our implementation has over Mindtrip:**
- Supabase-curated local venue depth (Mindtrip is Google-only)
- Integrated ticket purchase (Andres checkout flow — Mindtrip has no commerce)
- Google-grounded fallback for new/unlisted venues
- Phase 2: Spanish language for local Medellin users
