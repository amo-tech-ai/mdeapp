---
id: REAL-011
legacy_screen: WIRE-015
linear: SAN-478
title: Rentals Browse Page (/rentals)
status: Not Started
priority: P0
phase: mvp
persona: camila
depends_on:
  - SCREEN-005
  - SCREEN-001
  - MAP-001
  - F49
blocks:
  - REAL-012
skill:
  - mde-task-lifecycle
  - mde-maps
  - shadcn
  - tailwind-responsive-ui
  - testing
wireframes:
  - 009-wire-rentals-browse.md
primary_wire: 009-wire-rentals-browse.md
testing_standard: ../screens/SCREEN-TESTING-STANDARD.md
playwright_spec: ../../../mdeapp/e2e/screens/REAL-011-rentals-browse.spec.ts
path: /rentals
scope_note: "Distinct from SCREEN-005 (in-chat cards). Replaces current redirect('/chat')."
---

# REAL-011 — Rentals Browse Page (`/rentals`)

## Goal

Ship a **catalog browse** surface for Camila — filter bar, card grid, optional map split — without requiring chat first.

## User story

As **Camila**, I want to browse apartments on `/rentals` with neighborhood and price filters, so I can compare listings like Zillow without starting a new chat thread.

## Wireframe source

- [`009-wire-rentals-browse.md`](009-wire-rentals-browse.md) (WIRE-015)

## Current disk (2026-06-04)

| Item | Status |
|------|--------|
| `mdeapp/src/app/rentals/page.tsx` | ⚠️ `redirect("/chat")` only |
| In-chat `RentalCard` + pins (SCREEN-005) | ✅ Shipped |
| `/rentals/[id]` detail | ⚪ REAL-012 not started |

## Build scope

### Frontend

1. Replace redirect in `app/rentals/page.tsx` with server component browse (mirror [`RestaurantBrowseView`](../../../mdeapp/src/components/restaurants/restaurant-browse-view.tsx) layout).
2. **Create** `components/rentals/rental-browse-view.tsx` — filter bar (neighborhood, beds, max price), grid of `RentalCard`, empty/error states per SCREEN-019.
3. Optional map split column — reuse map pin sync from F50 when lat/lng on listing rows.
4. Deep link: `/rentals?neighborhood=Laureles&beds=2` from chat CTA "See all on map".

### Data

- Query `apartments` via existing Supabase patterns (same as `search-rentals` tool filters).
- RLS: public read for published listings only.

### CopilotKit / Mastra

- None on browse page itself; link **Back to chat** → `/` with optional query prefill.

## Acceptance criteria

- [ ] `/rentals` returns HTTP 200 (no redirect to `/chat`)
- [ ] Grid shows ≥1 listing from Supabase seed data
- [ ] Filters update URL search params and narrow results
- [ ] Card click opens detail sheet or navigates to `/rentals/[id]` (REAL-012 may stub)
- [ ] Mobile: single-column list + bottom sheet detail
- [ ] Playwright spec `REAL-011-rentals-browse.spec.ts` pass
- [ ] Evidence at `tasks/evidence/REAL-011-evidence.md`

## Do not do

- Do not duplicate SCREEN-005 chat card logic — reuse `RentalCard` component
- Do not use service role in client bundle
- Do not block on semantic/vector search (SAN-545) — keyword filters OK for MVP

## Linear

- [SAN-478](https://linear.app/sanjiovani/issue/SAN-478) — label **`phase:mvp`** (not `phase:phase2`) if Camila browse is Discovery Beta P0
