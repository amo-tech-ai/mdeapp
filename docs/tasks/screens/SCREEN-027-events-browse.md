---
id: SCREEN-027
linear: SAN-518
spec_owner: SAN-585
title: Events Browse Page (/events)
status: Live
priority: P1
phase: mvp
persona: andres
depends_on:
  - SCREEN-006
  - SCREEN-014
  - MAP-001
  - SAN-586
blocks:
  - SAN-587
nav_activation: SAN-584
design_polish: SAN-587
skill:
  - mde-task-lifecycle
  - mde-maps
  - shadcn
  - testing
wireframes:
  - ../venues/tasks/mvp/wireframes/008-wire-restaurant-listings-map.md
primary_wire: ../venues/tasks/mvp/wireframes/008-wire-restaurant-listings-map.md
paired_wire_note: "Layout clone SAN-490 /restaurants + SAN-491 /nightlife — event-specific filters + EventCard"
testing_standard: SCREEN-TESTING-STANDARD.md
playwright_spec: ../../mdeapp/e2e/screens/SCREEN-027-events-browse.spec.ts
path: /events
implementation_template: SAN-490
data_api: SAN-586
sidebar_href_today: null
---

# SCREEN-027 — Events Browse Page (`/events`)

## Metadata

| Field | Value |
|-------|-------|
| Screen ID | **SCREEN-027** |
| Implementation owner | [SAN-518](https://linear.app/sanjiovani/issue/SAN-518) |
| Spec owner | [SAN-585](https://linear.app/sanjiovani/issue/SAN-585) SPEC-027 |
| Route | `/events` |
| Status | **Live** (verified 2026-06-08 — see `tasks/events/specs/pages/PAGE-002-events-browse.md`) |
| Data dependency | [SAN-586](https://linear.app/sanjiovani/issue/SAN-586) DATA-036 — public published-events list |
| Nav activation | [SAN-584](https://linear.app/sanjiovani/issue/SAN-584) SCR-002b — **after** SAN-518 Done |
| Design polish (after ship) | [SAN-587](https://linear.app/sanjiovani/issue/SAN-587) D-09b |
| Template | [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) `/restaurants` · [SAN-491](https://linear.app/sanjiovani/issue/SAN-491) `/nightlife` |
| Sidebar today | `chat-nav-rail.tsx` → `events` **`href: null`** (Coming soon — intentional) |

---

## 1. Purpose

`/events` is a **public browse catalog** for **published Medellín events**. Tourists and Andrés discover real ticketed events without opening chat.

**Hard rules:**

- **Do not invent events with an LLM** — no generative fill, no placeholder lorem events, no chat grounding on this page.
- **Deterministic data only** — rows from Supabase via [SAN-586](https://linear.app/sanjiovani/issue/SAN-586) public list API or an equivalent **documented SSR query** with the same contract.
- **Do not use** `POST /api/events/search` (Mastra `searchEvents` / hybrid / web fallback) as the browse catalog source — that route is for **chat fast-path**, not catalog SSR.

**Persona outcome:** Sidebar Events (when enabled) → catalog → filter → `/events/[slug]` detail → existing ticket checkout path.

---

## 2. User story

As **Andrés** (or a **Tourist**), I open **Events** from the Explore sidebar (once enabled), land on `/events`, see **real published events** with photos and dates, filter by **this weekend** / **category** / **neighborhood**, tap **Details** on a card, continue to **`/events/[slug]`**, and **Buy tickets** when tiers exist — without asking the concierge.

---

## 3. Current disk (2026-06-08)

| Item | Path / owner | Status |
|------|----------------|--------|
| Browse route | `mdeapp/src/app/events/page.tsx` | ✅ Live — SSR `fetchPublicEventsCatalog` |
| Browse UI | `mdeapp/src/components/events/event-browse-view.tsx` | ✅ Filters + empty/error |
| Detail route | `mdeapp/src/app/events/[slug]/page.tsx` | ✅ SAN-237 / SCREEN-014 |
| In-chat card | `mdeapp/src/components/copilot/event-card.tsx` | ✅ SCREEN-006 / SAN-236 |
| Chat search API | `mdeapp/src/app/api/events/search/route.ts` | ✅ **Not** browse source |
| Public list API | SAN-586 DATA-036 | ✅ Used by catalog fetch |
| Sidebar | `chat-nav-rail.tsx` `events: href: "/events"` | ✅ Enabled (SAN-584) |
| Sitemap | `sitemap.md` `/events` row | ✅ LIVE |
| Canonical spec | `tasks/events/specs/pages/PAGE-002-events-browse.md` | ✅ |

---

## 4. Layout

### Desktop (≥1024px)

Mirror [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) / [SAN-491](https://linear.app/sanjiovani/issue/SAN-491) browse split:

```text
┌──────────────┬─────────────────────────────────────────────┐
│ Left nav     │ Page header: "Events in Medellín"           │
│ rail         │ Subcopy + result count                      │
│ (from /      ├─────────────────────────────────────────────┤
│  layout)     │ Filters row: date · category · neighborhood │
│              │ · price/free (if data)                      │
│ Explore:     ├──────────────────────┬──────────────────────┤
│ Events       │ Event cards grid     │ Map / context panel  │
│ (disabled    │ 2-col (md) 3-col (lg)│ (optional P1 —     │
│  until       │ `<EventCard>` rows   │  MAP-001 pins)       │
│  SAN-584)    │                      │                      │
└──────────────┴──────────────────────┴──────────────────────┘
```

### Tablet (768px)

- Filters wrap; grid **2 columns**.
- Map: collapsed toggle or stacked below grid (match restaurants responsive behavior).

### Mobile (375px)

- **Single-column** card stack.
- **Sticky filter** control → bottom sheet or drawer (no horizontal overflow).
- Map: optional bottom sheet; must not block card scroll.
- Touch targets ≥44px on filter chips and CTAs.

**Reference implementations:**

- `mdeapp/src/app/restaurants/page.tsx` + `RestaurantBrowseView`
- `mdeapp/src/app/nightlife/page.tsx` + nightlife browse view (SAN-491)

---

## 5. Required card content

Reuse **`EventCard`** (`data-testid="event-card"`, `data-result-kind="event"`) from SCREEN-006. Each browse row must show:

| Field | Source | UI |
|-------|--------|-----|
| Image | `imageUrl` or fallback | 16:9 or match chat card (`h-28`); muted placeholder if missing |
| Title | `title` | `h3` — same as chat |
| Date/time | `startsAt` | `formatStartsAt` (existing) |
| Venue | `venue` | Secondary line |
| Neighborhood | `neighborhood` | With venue · separator |
| Category | event category enum | Chip or badge if available in list payload |
| Price / tier | `pricePerTicket` + `currency` | `formatEventCardPrice` — "From $X COP" |
| **Details** CTA | `data-testid="event-details-cta"` | Links to `/events/[slug]` |
| **Buy tickets** | `data-testid="event-buy-cta"` | When `ticketUrl` / tier exists — same rules as chat card |

**Preserve existing EventCard behavior** — do not fork card markup for browse unless extracting a shared export; CTAs and test ids must stay compatible with SCREEN-006 tests.

---

## 6. Data / API contract (SAN-586)

**Owner:** [SAN-586](https://linear.app/sanjiovani/issue/SAN-586) DATA-036

Browse page consumes **one** of (document choice in SAN-518 PR):

1. **Preferred:** `GET` or `POST` `/api/events` (or `/api/events/public`) — public list, no auth.
2. **Alternative:** Server Component direct Supabase query via `createClient()` — same shape, documented in this spec's PR.

### List payload (minimum per row)

```typescript
{
  id: string;
  eventId: string;
  slug: string;           // for /events/[slug]
  title: string;
  venue: string;
  neighborhood: string;
  startsAt: string;       // ISO
  pricePerTicket: number;
  currency?: string;
  imageUrl?: string;
  ticketUrl: string;
  category?: "music" | "food" | "culture" | "sport" | "nightlife";
  status: "published";    // only this status in browse
}
```

### Rules

| Rule | Requirement |
|------|-------------|
| Visibility | **Published + active** events only |
| Exclude | Drafts, cancelled, host-private, unlisted |
| No LLM rows | Zero generated events in UI or API layer for browse |
| Ordering | Stable **`starts_at` ASC** (upcoming first); tie-break by `id` |
| Pagination | ≤50 per page (cursor or offset — SAN-586 defines) |
| Filters | Server-side or SSR where possible; client narrow OK for neighborhood if documented |
| Auth | Public — anon RLS; **no service role in client bundle** |
| Errors | 500 → error state; empty array → empty state (not fake cards) |

**Not in scope for browse:** `hybridUsed`, web grounding, `queryText` semantic search ([`/api/events/search`](../../../mdeapp/src/app/api/events/search/route.ts) stays chat-only).

---

## 7. Filters (minimum)

Map to URL search params (mirror restaurants `?neighborhood=` pattern):

| Filter | Values | Param example |
|--------|--------|---------------|
| **Date** | Tonight · This weekend · This week · Next week · Any | `dateWindow= this_weekend` (align with search-events enum) |
| **Category** | Music · Food · Culture · Sport · Nightlife | `category=music` |
| **Neighborhood** | Laureles · El Poblado · Envigado · … | `neighborhood=Laureles` |
| **Price** | Free · Paid · Any | `price=free` — **only if** SAN-586 exposes `pricePerTicket === 0` reliably |

Filter chips use DESIGN.MD tokens — no hardcoded `gray-*`.

---

## 8. States

| State | Requirement | Test id / pattern |
|-------|-------------|-------------------|
| **Loading** | Skeleton grid (cards + filter bar) per SCREEN-019 | `data-testid="events-browse-loading"` or skeleton role |
| **Empty** | "No events match" + link to chat: "Ask the concierge" | `data-testid="events-browse-empty"` |
| **API error** | Retry button + message; no uncaught console errors | `data-testid="events-browse-error"` |
| **No image** | Muted placeholder ("Event photo") — layout must not collapse | Existing EventCard fallback |
| **No map data** | Grid-only mode; no broken map iframe | "No pins yet" or hide map column |

---

## 9. Acceptance criteria

### Route & data

- [ ] `GET /events` → **HTTP 200** — public, no auth
- [ ] **Real published Supabase rows only** — no placeholder page, no redirect, no 404
- [ ] ≥1 event card when published data exists; **empty state** when none (never fake cards)
- [ ] Stable upcoming sort by `starts_at`
- [ ] Event cards preserve SCREEN-006 behavior + existing `data-testid`s
- [ ] **Details** → `/events/[slug]` (SCREEN-014) returns 200 for valid slug
- [ ] **Buy tickets** CTA present when tier/ticket URL exists

### Layout & responsive

- [ ] Desktop screenshot — grid + optional map column
- [ ] Tablet **768px** screenshot — 2-col grid, filters usable
- [ ] Mobile **375px** screenshot — single column, no horizontal scroll
- [ ] Filters render and narrow results (or empty state)

### SEO

- [ ] `<title>Events in Medellín · mdeai</title>`
- [ ] OpenGraph tags when SAN-518 implements metadata

### Sidebar / nav (SAN-584 — not in spec PR)

- [ ] **During SAN-518 implementation:** `EXPLORE_ITEMS` `events` remains **`href: null`**
- [ ] **After SAN-518 Done:** [SAN-584](https://linear.app/sanjiovani/issue/SAN-584) may flip `href: "/events"` and remove Coming soon tooltip
- [ ] Post-flip: `[data-testid="nav-events-link"]` click → 200 with real catalog

### Tests & evidence

- [ ] Playwright `e2e/screens/SCREEN-027-events-browse.spec.ts` pass
- [ ] Evidence `tasks/evidence/SCREEN-027-evidence.md`
- [ ] `npm run floor` green on touched files (SAN-518 PR)

---

## 10. Playwright — `SCREEN-027-events-browse.spec.ts`

**Path:** `mdeapp/e2e/screens/SCREEN-027-events-browse.spec.ts` (create in SAN-518, not this spec PR)

| # | Scenario | Assert |
|---|----------|--------|
| P1 | Navigate to `/events` | HTTP 200; not redirect; not 404 |
| P2 | Catalog content | ≥1 `[data-testid="event-card"]` **or** `[data-testid="events-browse-empty"]` |
| P3 | Filters visible | Date/category/neighborhood controls render |
| P4 | Details link | When cards exist, Details → `/events/[slug]` 200 |
| P5 | Sidebar disabled (pre-SAN-584) | `[data-testid="nav-events-link"]` has `aria-disabled="true"` OR click does not navigate |
| P6 | Sidebar enabled (post-SAN-584) | Nav click → `/events` 200 with catalog (run in SAN-584 / prod smoke) |

---

## 11. Out of scope

- Event creation / host wizard (Roberto → `/host/event/new`)
- Host list (`/host/events` — SAN-118 Done separately)
- Ticket checkout / Stripe webhook changes
- CopilotKit / Mastra / `/api/copilotkit` changes
- `POST /api/events/search` / SEARCH-002 / hybrid grounding changes
- Autonomous event ingestion (DATA-017, OpenClaw)
- **Nav activation in SAN-585 spec PR** — tracked on SAN-584 only
- D-09b visual re-skin ([SAN-587](https://linear.app/sanjiovani/issue/SAN-587)) — after functional ship

---

## 12. Build scope (SAN-518 — not this task)

1. `mdeapp/src/app/events/page.tsx` — SSR loader + metadata.
2. `mdeapp/src/components/events/event-browse-view.tsx` — filters, grid, map toggle.
3. Wire SAN-586 list API or documented SSR query.
4. Map pins (MAP-001) if lat/lng in list payload — optional P1.
5. Playwright + evidence.

**Do not enable sidebar in the same PR unless all §9 AC pass and SAN-584 checklist signed.**

---

## Related Linear

| Issue | Role |
|-------|------|
| [SAN-518](https://linear.app/sanjiovani/issue/SAN-518) | Implementation |
| [SAN-585](https://linear.app/sanjiovani/issue/SAN-585) | This spec |
| [SAN-586](https://linear.app/sanjiovani/issue/SAN-586) | Public list API |
| [SAN-584](https://linear.app/sanjiovani/issue/SAN-584) | Sidebar href flip |
| [SAN-587](https://linear.app/sanjiovani/issue/SAN-587) | Post-ship re-skin |
