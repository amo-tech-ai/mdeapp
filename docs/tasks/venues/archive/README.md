---
title: Venues archive
date: 2026-06-02
---

# Venues archive

**Shipped + live on Vercel** or superseded task docs. **Do not re-implement** — use active backlog in [`../tasks/`](../tasks/INDEX.md).

## Shipped to production (archived 2026-06-02)

| ID | Title | Prod | Evidence |
|----|-------|------|----------|
| **CAF-A5 / SCREEN-021** | Café listings + map + detail | [mdeai.co/chat](https://www.mdeai.co/chat) | [`SCREEN-021-evidence.md`](../../../tasks/evidence/SCREEN-021-evidence.md) |
| **005-scr / 005-wire** | Café screen + wireframe specs | same | same |
| **SCREEN-007 / 006** | Rental + event `VenueDetailSheet` | [mdeai.co](https://www.mdeai.co/) | [`SCREEN-007-evidence.md`](../../../tasks/evidence/SCREEN-007-evidence.md) |

Disk: `CafeResultCard`, `CafeDetailPanel`, `VenueDetailSheet`, `search-grounded-places` café intent, Playwright SCREEN-021 + SCREEN-007 green.

## Superseded (never shipped)

| File | Was | Use instead |
|------|-----|-------------|
| [CAFE-001-booking-requests-schema.md](CAFE-001-booking-requests-schema.md) | Root task | DATA-009 + VEN-015 |
| CAFE-001-*-copy.md | Duplicates | same |
| 005-scr-cafe-listings-map-booking-docs-copy.md | `docs/` duplicate | [005-scr-cafe-listings-map-booking.md](005-scr-cafe-listings-map-booking.md) |
| [007-wire-nightlife-explorer.md](007-wire-nightlife-explorer.md) | Frozen stub | [`../tasks/mvp/wireframes/007-wire-nightlife-listings-map.md`](../tasks/mvp/wireframes/007-wire-nightlife-listings-map.md) |
| [CTI-019-openclaw-tour-crawler.md](CTI-019-openclaw-tour-crawler.md) | Cancelled CTI | OCL-013 |

## Active backlog (not archived)

- Restaurant UI **008** — partial (`search-restaurants` only); [`008-scr`](../tasks/mvp/wireframes/008-scr-restaurant-listings-map.md) stays **In Review**
- Nightlife **007** — not started
- Booking chain **VEN-015…024** — not started
- Event venue booking **VEB-001…018** — not started
- Coffee tours **VEN-032…043** — optional

## Canonical replacements

| Topic | Active spec |
|-------|-------------|
| Booking schema SQL | [`../../data/tasks-data/data-009-schema-migrations-m1-m3.md`](../../data/tasks-data/data-009-schema-migrations-m1-m3.md) |
| Booking app + RLS | [`../tasks/mvp/015-ven-booking-requests-schema.md`](../tasks/mvp/015-ven-booking-requests-schema.md) |
| Master task order | [`../tasks/mvp/mvp-index.md`](../tasks/mvp/mvp-index.md) |
| Event venue booking | [`../tasks/event-booking/INDEX.md`](../tasks/event-booking/INDEX.md) |
