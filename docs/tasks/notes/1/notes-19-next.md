---
title: Next steps — venues queue (non-GCP)
updated: 2026-06-03
companion: notes-18-next.md · INDEX-VENUE.md · tasks.md
---

> **Summary:** Non-GCP execution order for venues — Playwright release gate first, then browse pages, then VEB Linear. MAP-002B evidence stays local until GCP rerun.

**Linear hubs**

| Project | Board |
|---------|--------|
| Venues (VEN, booking, Playwright) | [Venues project](https://linear.app/sanjiovani/project/venues-b003fe68b767/issues) |
| Screens (browse pages, mobile shell) | [Screens project](https://linear.app/sanjiovani/project/screens-c954b41b2344/issues) |

---

## Hold

| Item | Linear | Rule |
|------|--------|------|
| MAP-002B evidence commit | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | Local only until post-GCP rerun — do not record temp failure as final proof |
| SAN-368 debugging | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | Blocked: Cloud Run 200 · `source=grounding-lite` · attribution · no curated fallback |

---

## Execution queue

| # | Task | Linear | Project | Spec / wireframe | Status |
|--:|------|--------|---------|------------------|--------|
| 1 | **VEN-031** Playwright release gate | [SAN-314](https://linear.app/sanjiovani/issue/SAN-314) | Venues | [`031-ven-playwright`](../venues/tasks/mvp/031-ven-playwright-venue-screens.md) | **Merged** [PR #60](https://github.com/amo-tech-ai/mdeapp/pull/60) `d88741f` — **not Done** (booking e2e · SAN-368) |
| 2 | **SCREEN-022** `/nightlife` full browse | [SAN-491](https://linear.app/sanjiovani/issue/SAN-491/screen-022-nightlife-listings-map) | Screens | [`007-scr`](../venues/tasks/mvp/wireframes/007-scr-nightlife-listings-map.md) | Backlog · mirror `/restaurants` |
| 3 | **SCREEN-028** `/cafes` full browse | [SAN-519](https://linear.app/sanjiovani/issue/SAN-519/screen-028-cafes-browse-listing-cafes) | Screens | clone [`008-scr`](../venues/tasks/mvp/wireframes/008-scr-restaurant-listings-map.md) + [`005-wire`](../venues/archive/005-wire-cafe-listings-map-booking.md) | Backlog · placeholder live today |
| 4 | **VEB-001…018** Linear setup | — (create) | — | [`event-booking/INDEX`](../venues/tasks/event-booking/INDEX.md) | Before Roberto/Carlos work |
| 5 | Hardening / cleanup | see below | both | retry helpers · console filters · mobile regressions | after SAN-314 |

**ROI order:** SAN-314 → SAN-491 → SAN-519

---

## Venues screens — what we can design

Design = wireframe / layout spec / component inventory **before or during** build. Browse pages share one pattern (filters · grid/list · map · mobile sheet · SEO · empty/loading/error).

| Screen | Route | Linear | Wireframe / spec | Live today | Design now? | Notes |
|--------|-------|--------|------------------|------------|-------------|-------|
| **SCREEN-021** | `/chat` café cards | [SAN-114](https://linear.app/sanjiovani/issue/SAN-114) | [`005-scr`](../venues/archive/005-scr-cafe-listings-map-booking.md) | ✅ chat | Polish only | Booking sheet done (VEN-021); e2e needs update in SAN-314 |
| **SCREEN-023** | `/restaurants` browse | [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) | [`008-scr`](../venues/tasks/mvp/wireframes/008-scr-restaurant-listings-map.md) | ✅ browse | Polish + mobile map | **Reference architecture** for 491/519 |
| **SCREEN-022** | `/nightlife` browse | [SAN-491](https://linear.app/sanjiovani/issue/SAN-491) | [`007-scr`](../venues/tasks/mvp/wireframes/007-scr-nightlife-listings-map.md) | 🟡 placeholder | **Yes — P0 design** | NightlifeCard · vibe filters · club pin icon · safety copy in sheet |
| **SCREEN-028** | `/cafes` browse | [SAN-519](https://linear.app/sanjiovani/issue/SAN-519) | draft from 008 + café card tokens | 🟡 placeholder | **Yes — P1 design** | Wifi/vibe chips · reuse `CafeResultCard` · map café pins |
| **SCREEN-018** | mobile 3-panel shell | [SAN-489](https://linear.app/sanjiovani/issue/SAN-489) | [`018-scr`](../../screens/018-scr-mobile-responsive-shell.md) | ✅ Done | Regression only | Wire into SAN-314 release gate |
| **Nightlife chat panel** | `/chat` | [SAN-296](https://linear.app/sanjiovani/issue/SAN-296) | [`013-ven`](../venues/tasks/mvp/013-ven-nightlife-detail-panel.md) | ✅ Done | Minor polish | Chat e2e: `SCREEN-022-nightlife-listings.spec.ts` |
| **Restaurant chat panel** | `/chat` | [SAN-293](https://linear.app/sanjiovani/issue/SAN-293) | [`010-ven`](../venues/tasks/mvp/010-ven-restaurant-detail-panel.md) | 🟡 partial | Yes | Cards + panel for Carlos dinner intent |
| **Restaurant chat cards** | `/chat` | [SAN-292](https://linear.app/sanjiovani/issue/SAN-292) | [`009-ven`](../venues/tasks/mvp/009-ven-restaurant-result-card.md) | 🟡 partial | Yes | Pattern for all venue cards |

**Design-out of scope until gates pass:** VEB event-booking flows (Roberto) · real ADK attribution UI (blocked on [SAN-368](https://linear.app/sanjiovani/issue/SAN-368))

**Screens milestone (Linear):** M6 — Venue Listings hosts [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) ✅ and [SAN-491](https://linear.app/sanjiovani/issue/SAN-491); M7 — Admin & Browse hosts [SAN-519](https://linear.app/sanjiovani/issue/SAN-519).

---

## SAN-314 — release gate scope

| Surface | Status (2026-06-03) |
|---------|---------------------|
| Unified suite | `e2e/screens/VEN-035-venue-release.spec.ts` — **8/8 pass** locally |
| verify:task | `npm run verify:task -- VEN-031 --skip-floor` — **PASS** (22 vitest + 8 e2e) |
| floor | `npm run floor` — **PASS** |
| Helpers | `e2e/helpers/venue-release.ts` — strict waits, no nudge retry |
| Run | `npm run test:e2e:venue-release` (fresh `dev:ui` + `dev:agent`) |
| PR / CI | [#60](https://github.com/amo-tech-ai/mdeapp/pull/60) merged `d88741f` — floor + Vercel + CodeRabbit **green** |
| Evidence | [`VEN-031-verify-2026-06-03.md`](../venues/tasks/evidence/VEN-031-verify-2026-06-03.md) — grade **A / 92** (slice shipped) |

**Remaining before SAN-314 Done:** signed-in booking e2e · flip `EXPECT_CURATED_GROUNDING_FALLBACK` when SAN-368 ships · optional prod row.

**Next implement:** **SAN-491** `/nightlife` full browse (mirror `/restaurants`).

**Related Linear:** [SAN-314](https://linear.app/sanjiovani/issue/SAN-314)

---

## SAN-491 / SAN-519 — build rules

Mirror [`/restaurants`](https://www.mdeai.co/restaurants) (`src/app/restaurants/page.tsx`): filters · cards · grid/list · map · mobile · SEO · empty/loading/error.

| Item | Linear | Do not depend on |
|------|--------|------------------|
| Full `/nightlife` browse | [SAN-491](https://linear.app/sanjiovani/issue/SAN-491) | Real ADK grounding |
| Full `/cafes` browse | [SAN-519](https://linear.app/sanjiovani/issue/SAN-519) | Real ADK grounding |

Use venue data layer + current fallback safely.

---

## VEB Linear setup (before Roberto)

Create **VEB-001…018** in Linear; map repo IDs ↔ SAN IDs in [`prefix-catalog.json`](../linear/prefix-catalog.json).

**Hard gates:**

| Gate | Linear |
|------|--------|
| Playwright release | [SAN-314](https://linear.app/sanjiovani/issue/SAN-314) |
| JWT → Mastra context | AUTH-009 — **no SAN yet** · [`AUTH-009`](../data/tasks-data/AUTH-009-jwt-request-context.md) |
| Real ADK prod | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) |
| Event offerings schema | VEB-001 — create issue first |

---

## Hardening / cleanup (audit list)

| Area | Watch |
|------|-------|
| Retry / nudge helpers | false-positive passes in e2e |
| 120s timeout overuse | flake masking |
| Copilot runtime | silent failures |
| Console filters | gaps in `maps-layout.ts` |
| Mobile shell | [SAN-489](https://linear.app/sanjiovani/issue/SAN-489) regressions |
| Duplicate rendering | event vs grounding surfaces |
| Fallback detection | curated vs real grounding in prod chat |

---

## Shipped reference (do not re-open)

| Item | Linear |
|------|--------|
| `/restaurants` browse | [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) Done · PR #57 |
| Map pins prod | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) Done |
| Kind split + panels | [SAN-295](https://linear.app/sanjiovani/issue/SAN-295) · [SAN-296](https://linear.app/sanjiovani/issue/SAN-296) Done |
| Booking persist + chips | [SAN-304](https://linear.app/sanjiovani/issue/SAN-304) · [SAN-307](https://linear.app/sanjiovani/issue/SAN-307) Done |
| MAP-002B verify registry | mdeapp PR [#58](https://github.com/amo-tech-ai/mdeapp/pull/58) merged |
| Venue index + blocker docs | mdeai PR [#42](https://github.com/amo-tech-ai/mdeai/pull/42) open |

**Next action:** branch `ai/san-314-ven-035-playwright-screen-021022023` · land venue release gate spec.
