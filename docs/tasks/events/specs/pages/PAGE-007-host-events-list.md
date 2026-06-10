---
id: PAGE-007
title: Host events list dashboard
route: /host/events
status: Live
linear: SAN-118
persona: roberto
phase: mvp
updated: 2026-06-08
implementation:
  page: mdeapp/src/app/host/events/page.tsx
  components:
    - mdeapp/src/components/host/host-events-grid.tsx
    - mdeapp/src/components/host/host-event-card.tsx
playwright: mdeapp/e2e/screens/SCREEN-016b-host-events.spec.ts
vitest: mdeapp/src/components/host/__tests__/host-events-grid.test.tsx
wireframe: ../../wireframes/EVP-014-wire-host-events-list.md
task_spec: ../../tasks/MVP/EVP-014-core-host-events-list-page.md
---

# PAGE-007 — `/host/events`

## Purpose

Roberto's dashboard to see **all events he organizes** (draft + published), with CTA to create another.

## Persona & real-world example

After publishing *Medellín Tech Meetup*, Roberto opens **My events** and sees status, date, thumbnail, link to public page.

## Route & auth

| Field | Value |
|-------|-------|
| Route | `/host/events` |
| Auth | Required → `/login?next=/host/events` |
| Middleware | `PROTECTED_PREFIXES` includes `/host` |

## Layout

```text
┌──────────────────────────────────────────────────┐
│ My events                    [Back] [Create event]│
│ Subcopy                                           │
├──────────────────────────────────────────────────┤
│ host-events-list grid (1/2/3 cols)                │
│  host-event-card × N                              │
└──────────────────────────────────────────────────┘
```

**Wire drift:** Spec mentioned `EventFilters` bar — **not implemented** (status chips deferred).

## Components

| Component | Path | Role |
|-----------|------|------|
| `HostEventsPage` | `app/host/events/page.tsx` | Server Component, Supabase query |
| `HostEventsGrid` | `components/host/host-events-grid.tsx` | Grid wrapper |
| `HostEventCard` | `components/host/host-event-card.tsx` | Row card |
| `EmptyState` | `components/empty/empty-state.tsx` | Empty + error |

## Data source

```sql
SELECT id, name, slug, status, address, city, event_start_time,
       primary_image_url, ticket_price_min, ticket_url
FROM events
WHERE organizer_id = auth.uid()
ORDER BY event_start_time DESC
LIMIT 50
```

RLS: `events_organizer_select_own`

## UI states

| State | testId | Behavior |
|-------|--------|----------|
| Error | `host-events-error` | EmptyState — not fake empty |
| Empty | `host-events-empty` + `host-events-create-cta` | First event CTA |
| Success | `host-events` + `host-events-list` | Grid |

## Mobile behavior

- Single column grid; header stacks Create button
- No host nav rail on this page (standalone main) — **host wizard** uses `HostNavRail` separately

## Accessibility

- `data-testid="host-events-new"` on Create button with icon `aria-hidden`
- Page `<h1>` My events
- Cards link to `/events/[slug]` when published

## Test plan

| Layer | Spec | Coverage |
|-------|------|----------|
| Vitest | `host-events-grid.test.tsx` | Grid render |
| Playwright | `SCREEN-016b` | Auth redirect only |
| Playwright | **Missing** authed grid | Needs fixture or SCREEN-016c |

## Acceptance criteria

- [x] Server Component (no `"use client"` on page)
- [x] Auth redirect when logged out
- [x] `organizer_id` filter
- [x] Empty + error states
- [x] Create event CTA
- [ ] Status filter bar (wire spec) — post-MVP
- [ ] Enable **Events** link in `host-nav-rail.tsx` (currently disabled)
- [ ] Authed Playwright: ≥1 card or empty

## Audit fixes required

1. **`host-nav-rail.tsx`** — set `/host/events` link active, remove `disabled: true`
2. Update EVP-014 task `status: Done`, `percent: 88`
3. Add `e2e/screens/SCREEN-016c-host-events-authed.spec.ts` proof (file exists — verify green)
