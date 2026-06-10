---
id: SCREEN-007
title: Venue / Listing Detail Sheet
status: Archived
archived: 2026-06-02
was_status: Done
shipped: true
production: https://www.mdeai.co/
evidence: ../../../tasks/evidence/SCREEN-007-evidence.md
priority: P0
phase: MVP Phase 2
effort: 3-4h
feature_group: "006"
depends_on:
  - SCREEN-005
  - F50
blocks:
  - SCREEN-008
skill:
  - mde-task-lifecycle
  - copilotkit-develop
  - shadcn
  - mde-maps
wireframes:
  - 006-wire-venue-detail.md
primary_wire: 006-wire-venue-detail.md
related_specs:
  - 005-scr-cafe-listings-map-booking.md
  - 005-008-places-README.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../evidence/SCREEN-007-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-007-*.spec.ts
path: overlay (rentals + events on `/`)
---

# SCREEN-007 — Venue / Listing Detail Sheet

> **Places group 006:** [005-008-places-README.md](../tasks/mvp/wireframes/005-008-places-README.md) · Wire: [006-wire-venue-detail.md](006-wire-venue-detail.md) · **Cafés/nightlife/restaurants use right-column panels (005/007/008), not this sheet.**

## Goal
Slide-over sheet for **rental** and **event** detail before Schedule or Buy CTA.

## User story
As **Camila**, I want listing photos and amenities in a sheet, so I decide before scheduling a viewing.

## Screen / path
Overlay on `/` (sheet) for `kind: rental | event`. Optional deep link from `/rentals/[id]` later (F41).

## Wireframe source
- [006-wire-venue-detail.md](006-wire-venue-detail.md)

## Current status
**Done** — `venue-detail-sheet.tsx` shipped; rental Details + event Details from in-thread cards; F50 pin sync; e2e SCREEN-007. Evidence: [`../evidence/SCREEN-007-evidence.md`](../evidence/SCREEN-007-evidence.md).

## Build scope

### Frontend
- **Shipped** `components/sheets/venue-detail-sheet.tsx` using `ui/sheet.tsx`
- Open from RentalCard / EventCard **Details** (not café cards)
- Responsive: full-screen sheet mobile

### CopilotKit
- Listing id via `rental-ui-context` / card payload

### Mastra
- Detail data from card payload — no new search tool for MVP

### ADK / Google Maps
- `focusPin` + pan when sheet opens

### Supabase
- Read `apartments` or `events` by id (RLS)

## Acceptance criteria
- [x] Click rental card opens sheet with title, price, neighborhood
- [x] Map focuses matching pin
- [x] Sheet closes without losing chat thread
- [x] Schedule CTA in sheet opens SCREEN-008 modal shell

## Tests
- [x] `npm run floor`
- [x] Playwright: `SCREEN-007-venue-sheet.spec.ts`
- [x] `npm run smoke:f50-pin-sync`

## Evidence required
- [x] Screenshot: sheet open + map focused pin; mobile full-width sheet

## Dependencies
- SCREEN-005 (rentals), F50 ✅

## Runtime proof

```bash
cd mdeapp && npm run dev
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-007-venue-sheet.spec.ts --project=chromium
```

## Done gate

- [x] Evidence at `tasks/evidence/SCREEN-007-evidence.md`
- [x] Playwright desktop + mobile pass

## Do not do
- Do not route **café** detail through this sheet — use `CafeDetailPanel` (SCREEN-021 / group 005)
- Do not build full `/rentals/[id]` page (F41 deferred)
