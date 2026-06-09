---
id: PAGE-003
title: Event detail — commerce (current)
route: /events/[slug]
status: Live
linear: SAN-237
persona: andres
screen: SCREEN-014
updated: 2026-06-08
implementation:
  page: mdeapp/src/app/events/[slug]/page.tsx
  view: mdeapp/src/components/events/event-detail-view.tsx
  tiers: mdeapp/src/components/events/event-ticket-tiers.tsx
playwright: mdeapp/e2e/screens/SCREEN-014-event-detail.spec.ts
upgrade_spec: ./PAGE-003b-event-detail-luma.md
---

# PAGE-003 — Event detail (commerce)

## Purpose

Public ticket purchase page for a single published event.

## Persona example

Andrés opens `/events/manda-moorflow-live` → selects tier → checkout modal → Stripe.

## Layout

Desktop: 2-col — media + about left; title + tiers right. Mobile: stacked + **fixed bottom buy bar**.

## Data

`getPublicEvent(slug)` — tickets, image, schedule, description

## States

| State | testId / behavior |
|-------|-------------------|
| Success | `event-detail-page` |
| Sold out | copy + no mobile bar |
| Checkout open | modal overlay |
| 404 | `notFound()` |

## Mobile

`event-detail-mobile-buy-bar` sticky; title block duplicated md:hidden

## Accessibility

Share button disabled with title Phase 2 — remove or implement to avoid confusion

## Gaps vs wire

- No host block, vibe, map (see PAGE-003b)
- Hero alt empty string — use event name for a11y

## Acceptance

- [x] Tiers + checkout
- [x] Mobile sticky CTA
- [x] Semantic tokens (no gray-*)
- [ ] Luma sections (PAGE-003b)
