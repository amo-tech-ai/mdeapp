---
id: EVP-014-wire
title: Wire — /host/events list page (Roberto draft + published view)
status: Live
phase: mvp
persona: roberto
path: /host/events
screens:
  - EVP-014-core-host-events-list-page.md
screen_ids:
  - EVP-014-core
linear: SAN-118
depends_on:
  - EVP-013-core
  - F08
updated: 2026-06-02
---

# Wire — `/host/events` — Roberto's Event List

## Route context

Auth-gated Server Component. Anonymous users redirect to `/login` (F08 middleware). Roberto sees all his events filtered by `host_id = auth.uid()`.

## Layout

```
+--------------------------------------------------+
|  HEADER: "My Events" [+ Create Event]           |
+--------------------------------------------------+
|  FILTER BAR                                      |
|  [All] [Drafts] [Pending] [Published] · [Date▼] |
+--------------------------------------------------+
|  CARD GRID (1 col mobile · 2 col md · 3 col xl) |
|                                                  |
|  +---------------------+  +-------------------+ |
|  | [Event photo]       |  | [Event photo]     | |
|  | Title · Date        |  | Title · Date      | |
|  | Neighborhood chip   |  | Neighborhood chip | |
|  | [Draft] badge       |  | [Published] badge | |
|  | [Edit] [Preview]    |  | [View] [Copy URL] | |
|  +---------------------+  +-------------------+ |
|                                                  |
|  ... up to 50 cards, no pagination               |
+--------------------------------------------------+

EMPTY STATE (no events):
+--------------------------------------------------+
|                                                  |
|   [Medellín hero photo — F22]                    |
|                                                  |
|   No events yet                                  |
|   Create your first event to get started         |
|                                                  |
|   [+ Create Event →]                            |
|                                                  |
+--------------------------------------------------+
```

## Header

```
My Events                          [+ Create Event]
```

- `[+ Create Event]` → `/host/event/new` (EVP-010-core)
- Header sticky on scroll (64px height)

## Filter bar

| Filter | Values | Behavior |
|---|---|---|
| Status tabs | All · Drafts · Pending · Published | Client-side filter over server-fetched list |
| Date picker | Any date range | Optional — default "All" |
| Neighborhood | Dropdown from distinct values | Optional |

## Event card (per row)

Uses `<EventCard>` (EVP-013-core). Additional host-specific fields:

| Field | Source | Notes |
|---|---|---|
| Status badge | `events.status` | color-coded: Draft=gray, Pending=yellow, Published=green |
| CTA primary | Based on status | Draft → [Edit]; Published → [View public page] |
| CTA secondary | Based on status | Draft → [Preview]; Published → [Copy URL] |
| Edit action | → `/host/event/new?edit={id}` | Phase 2 edit flow |

## Empty state

- Hero photo: F22 Medellín photo asset
- Heading: "No events yet" (`text-xl font-semibold`)
- Body: "Create your first event to get started" (`text-sm text-foreground-muted`)
- CTA: `<Button>+ Create Event</Button>` → `/host/event/new`
- `data-testid="empty-state-cta"`

## Status badge colors

| Status | Background | Text | Icon |
|---|---|---|---|
| `draft` | `bg-foreground-subtle/20` | `text-foreground-muted` | pencil |
| `pending_approval` | `bg-accent/20` | `text-accent` | clock |
| `approved` | `bg-success/20` | `text-success` | check |
| `published` | `bg-success` | `text-accent-foreground` | globe |

## Accessibility

- `<main aria-label="My events">` wrapper
- Each card has `aria-label="{title} — {status}"` on the card root
- Filter tabs use `role="tablist"` + `aria-selected`
- Empty state CTA has visible focus ring

## Responsive

| Breakpoint | Card columns | Filter bar |
|---|---|---|
| < 640px | 1 col | Scrollable horizontal chips |
| 640–1023px | 2 col | Inline row |
| ≥ 1024px | 3 col | Inline row |

## Data contract

```ts
// Supabase query (Server Component, F08 pattern)
const { data } = await supabase
  .from('events')
  .select('id, title, date_iso, neighborhood, status, cover_photo_url, slug')
  .eq('host_id', user.id)
  .order('created_at', { ascending: false })
  .limit(50)
```

No CopilotKit — pure Server Component list view.

## `data-testid` map

| Element | testid |
|---|---|
| Page root | `host-events-page` |
| Create CTA (header) | `create-event-btn` |
| Event card (nth) | `event-card-{id}` |
| Status badge | `event-status-badge` |
| Empty state | `empty-state` |
| Empty state CTA | `empty-state-cta` |
| Filter tab: all | `filter-tab-all` |
| Filter tab: drafts | `filter-tab-drafts` |
| Filter tab: published | `filter-tab-published` |

## Spec file

Task spec: [`EVP-014-core-host-events-list-page.md`](../tasks/MVP/EVP-014-core-host-events-list-page.md)
