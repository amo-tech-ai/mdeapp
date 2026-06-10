---
id: PAGE-002
title: Events browse catalog
route: /events
status: Live
linear: SAN-518
persona: andres
phase: mvp
updated: 2026-06-08
implementation:
  page: mdeapp/src/app/events/page.tsx
  components:
    - mdeapp/src/components/events/event-browse-view.tsx
    - mdeapp/src/components/events/event-browse-filters.tsx
    - mdeapp/src/components/events/event-browse-card.tsx
    - mdeapp/src/components/browse/BrowseLayout.tsx
playwright: mdeapp/e2e/screens/SCREEN-027-events-browse.spec.ts
vitest: mdeapp/src/components/events/__tests__/event-browse-card.test.tsx
wireframe: ../../wireframes/003-events-README.md
screen_spec: ../../../screens/SCREEN-027-events-browse.md
design: ../../../../DESIGN.MD
data_api: fetchPublicEventsCatalog → list-published-events (SAN-586)
---

# PAGE-002 — `/events` browse catalog

## Purpose

Public, deterministic catalog of **published** Medellín events. Andrés and tourists browse without chat. No LLM-generated rows.

## Persona & real-world example

**Andrés** opens **Events** from nav → filters *This weekend · Music · Laureles* → taps **Details** on *Manda MoorFLOW* → `/events/[slug]`.

## Route & auth

| Field | Value |
|-------|-------|
| Route | `/events` + query `?category=&neighborhood=&dateWindow=&price=` |
| Auth | Public |
| Layout | `BrowseLayout` (matches `/restaurants`, `/nightlife`) |

## Layout

```text
Desktop
┌─────────────────────────────────────────────────────┐
│ H1 Events in Medellín · subtitle (count)            │
│ [Date chips] [Category] [Neighborhood] [Free/Paid]  │
├─────────────────────────────────────────────────────┤
│ Grid 1→2→3 cols — EventBrowseCard (event-card testid)│
└─────────────────────────────────────────────────────┘

Mobile: single column; filters wrap; sticky header optional Phase 2
```

## Components

| Component | Path | Role |
|-----------|------|------|
| `EventsPage` | `app/events/page.tsx` | SSR loader, param normalize |
| `EventBrowseView` | `components/events/event-browse-view.tsx` | Grid + states |
| `EventBrowseFilters` | `components/events/event-browse-filters.tsx` | URL-driven filters |
| `EventBrowseCard` | `components/events/event-browse-card.tsx` | Wraps card anatomy |
| `BrowseLayout` | `components/browse/BrowseLayout.tsx` | Shared browse chrome |
| `EmptyState` | `components/empty/empty-state.tsx` | Empty + error fallback |

## Data source

| Field | Source | Notes |
|-------|--------|-------|
| Catalog rows | `fetchPublicEventsCatalog()` | **Not** `POST /api/events/search` |
| Filters | URL searchParams | Validated enums only |
| Limit | 24 | SSR |

## UI states

| State | testId | Behavior |
|-------|--------|----------|
| Loading | `events/loading.tsx` | Route-level skeleton |
| Success | `events-browse` | Grid with cards |
| Empty | `events-browse-empty` | Copy + link to `/chat` concierge |
| Error | `events-error` | Destructive panel + retry link |

## Mobile behavior

- Single-column grid; filter bar scrolls horizontally if needed
- Touch targets ≥44px on filter chips and CTAs
- Nav rail links to `/events` (enabled in `chat-nav-rail.tsx`)

## Accessibility

- `aria-label="Event listings"` on grid section
- Cards use `data-testid="event-card"` + `aria-label` on article
- Error uses visible text + retry button (not toast-only)
- Images: decorative `alt=""` when hero only; title in card text

## Test plan

| Layer | Command | Pass |
|-------|---------|------|
| Vitest | `npm test -- --run event-browse` | Card markup |
| Playwright | `SCREEN-027-events-browse.spec.ts` | 200, cards or empty |
| Prod | `chat-smoke.mjs` events section | API shape (browse separate) |

## Acceptance criteria

- [x] `page.tsx` exists; SSR catalog only
- [x] No Mastra/chat search as browse source
- [x] Filters in URL; invalid params ignored
- [x] Empty and error states distinct
- [x] Nav href `/events` enabled
- [ ] Playwright evidence refreshed post-SAN-518
- [ ] Map toggle (optional EVP-016) — not in v1 browse

## Audit notes (2026-06-08)

**Verified correct:** Implementation matches intent; SCREEN-027 §3 "Missing" was stale.

**Gaps:** No map column on browse (restaurants have map — parity gap). No skeleton in `EventBrowseView` for client transitions (SSR loading.tsx covers navigation).

## Design rules

Semantic tokens only; amber accent on primary CTAs; dense cards per DESIGN.MD §4.
