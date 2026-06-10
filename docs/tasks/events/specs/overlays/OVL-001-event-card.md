---
id: OVL-001
title: Event card (chat + browse)
route: overlay (chat thread, browse grid)
status: Live
linear: SAN-117
persona: camila
screen: SCREEN-006
updated: 2026-06-08
implementation:
  component: mdeapp/src/components/copilot/event-card.tsx
  renders: mdeapp/src/components/copilot/search-tool-renders.tsx
playwright: mdeapp/e2e/screens/SCREEN-006-event-card.spec.ts
vitest: mdeapp/src/components/copilot/__tests__/event-card.test.tsx
---

# OVL-001 — Event card

## Purpose

Generative UI card for Mastra `search_events` results in chat; reused in browse via `EventBrowseCard`.

## Persona example

Camila sees card: photo, *Salsa en La 70*, Laureles, Sat 9pm, **Buy** + **Details**.

## Layout

DESIGN.MD §4.1 event row: hero 16:9, badge, title, venue, time, price mono, CTA row.

## Data source

Tool output / `PublishedEventListItem` mapped to props.

## States

| Mode | Behavior |
|------|----------|
| Chat | `onSelect`, pin sync, optional sheet |
| Browse | `detailsHref` → `/events/[slug]` |

## testIds

`event-card`, `event-buy-cta`, `event-details-cta`, `data-result-kind="event"`, `data-pin-id`

## Accessibility

- `aria-label="Event: {title}, {neighborhood}"`
- Keyboard: Enter on selectable card body
- Buy/Details buttons explicit labels

## Gaps

- Generic query clarify branch flaky in SCREEN-006 (needs dev server)
- Missing AI intent reason line (DESIGN.MD optional for events)

## Acceptance

- [x] Buy + Details CTAs
- [x] Pin selection sync
- [x] Vitest markup
- [ ] Stable Playwright clarify test
