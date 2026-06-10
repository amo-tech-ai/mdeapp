---
task_id: ven-010
mvp_step: 010
title: RestaurantDetailPanel + rental-ui-context
layer: UI
priority: P0
status: In Review
estimated_effort: 1 day
depends_on: [ven-009]
unblocks: [VEN-031]
skills: [copilotkit-develop, shadcn]
description: Right-column restaurant detail — mirror CafeDetailPanel; never VenueDetailSheet.
---

# VEN-10 — Restaurant detail panel


## At a glance

| | |
|---|---|
| **For** | Carlos |
| **Surface** | `/chat` right column |
| **Layer** | UI |

## What we're building

Restaurant detail panel — hours, photos, cuisine, price, CTA to book.

## Features

- Right-column toggle like café
- Places detail + DB merge
- Book CTA → CKV-005 sheet

## Agents & tools

None — UI reads detail API

## Workflows

None

## User journey

1. Carlos clicks restaurant card.
2. Right column shows detail (map collapses or splits).
3. Request booking opens sheet.

## Goals

1. `RestaurantVenueDetail` type in `rental-ui-context.tsx` (or unified via ven-027).
2. `openRestaurantDetail` / `closeRestaurantDetail` + siblings list.
3. `RestaurantDetailPanel` — SCREEN-008 fields, `/api/places/detail` hydrate.
4. Wire `chat-map-panel.tsx` + `map-mobile-sheet.tsx` when `restaurantDetail != null`.
5. Book CTA → `openVenueBooking` (CKV-005) with `venue_kind: restaurant`.

## Acceptance

- [x] Card click opens restaurant panel, not café panel (`restaurant-detail-panel`, SCREEN-023)
- [x] Map pin highlight on hover/select (SCREEN-023)
- [x] Book CTA opens booking sheet with `VenueBookingForm` (VEN-021 — not stub)
- [ ] Places hydrate via `/api/places/detail` (blocked DATA-008 cache backfill)

**Disk:** `restaurant-detail-panel.tsx`, `rental-ui-context.tsx` (`RestaurantVenueDetail`), `restaurant-booking-sheet.tsx`

---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-010](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-010-verify-YYYY-MM-DD.md` |
| Grade | **A- / 92** (via SCREEN-023) |
| Production ready | Staging — persist via VEN-021; signed-in e2e + Places cache pending |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Card click → `data-testid="restaurant-detail-panel"` (not café panel) |
| **MCP** | — |
| **Chrome DevTools** | Right column panel + mobile sheet; map pin `data-selected` on hover |
| **Playwright** | SCREEN-023 spec — detail + booking form / sign-in gate |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Flip **Done** with VEN-009 after signed-in booking e2e
- Wire panel to `/api/places/detail` when DATA-008 cache ≥80%
- Document Maps billing env blocker in evidence if embed 403

