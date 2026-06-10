---
id: SCREEN-028
linear: SAN-519
title: Cafés Browse Page (/cafes)
status: Not Started
priority: P1
phase: mvp
persona: carlos
depends_on:
  - SCREEN-021
  - SAN-490
  - MAP-001
skill:
  - mde-task-lifecycle
  - mde-maps
  - shadcn
  - testing
wireframes:
  - ../../venues/tasks/mvp/wireframes/008-wire-restaurant-listings-map.md
primary_wire: ../../venues/tasks/mvp/wireframes/008-wire-restaurant-listings-map.md
paired_wire_note: "Mirror SAN-490 /restaurants layout; data from search-grounded cafés or curated seed"
related_specs:
  - ../../venues/archive/005-scr-cafe-listings-map-booking.md
testing_standard: ../screens/SCREEN-TESTING-STANDARD.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-028-cafes-browse.spec.ts
path: /cafes
implementation_template: SAN-490
---

# SCREEN-028 — Cafés Browse Page (`/cafes`)

## Goal

Upgrade `/cafes` from placeholder → **catalog browse** matching `/restaurants` (SAN-490), reusing in-chat café card components (SAN-114 / SCREEN-021).

## User story

As **Carlos**, I want to browse specialty coffee shops in Laureles on `/cafes` without opening chat, so I can pick a workspace café before I land in Medellín.

## Current disk (2026-06-04)

| Item | Status |
|------|--------|
| `mdeapp/src/app/cafes/page.tsx` | ⚠️ Shell / redirect-style placeholder |
| In-chat café cards (CAF-001) | ✅ SAN-114 Done |
| `/restaurants` browse template | ✅ SAN-490 — **copy this architecture** |

## Build scope (implementation-ready)

1. Copy `restaurants/page.tsx` + `RestaurantBrowseView` pattern → `cafes/page.tsx` + `CafeBrowseView`.
2. Data loader: curated café rows or `search-grounded-places` with `intent: "cafe"` (server-side only).
3. Filters: neighborhood, `Open now`, `Specialty`, `Workspace-friendly` chips.
4. Map column optional P1 — pins reuse café pin style from chat.
5. Playwright: `SCREEN-028-cafes-browse.spec.ts` (grid loads, Laureles filter narrows).

## Acceptance criteria

- [ ] `/cafes` HTTP 200 with ≥2 café cards
- [ ] Filter bar matches DESIGN.MD tokens (no hardcoded `gray-*`)
- [ ] Empty state links to chat: "Ask the concierge for more"
- [ ] Evidence `tasks/evidence/SCREEN-028-evidence.md`
- [ ] Playwright `e2e/screens/SCREEN-028-cafes-browse.spec.ts` pass

### Sidebar nav activation (Done gate — do not enable early)

- [ ] Sidebar nav activation **only after** browse route is production-ready:
  - [ ] Update `src/components/chat/chat-nav-rail.tsx`: `cafes` `href: null` → `"/cafes"`
  - [ ] Remove Coming soon disabled state for `cafes` row
  - [ ] Playwright: `[data-testid="nav-cafes-link"]` click → HTTP 200 on `/cafes`
  - [ ] Route shows **real catalog content** — not placeholder (`EmptyState`), redirect, or 404
  - [ ] Verify checklist item on SAN-584 (SCR-002b)

## Linear label

- [SAN-519](https://linear.app/sanjiovani/issue/SAN-519) — set **`phase:mvp`** (parity with SAN-491 nightlife)

## Do not do

- Do not rebuild café detail panel — reuse `CafeDetailPanel` from chat
- Do not ship booking sheet here (VEN-021 stays in-chat)
