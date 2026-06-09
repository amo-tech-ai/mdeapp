# REAL-011 / SAN-478 — Rental Browse Page Evidence

**Date:** 2026-06-07  
**Branch:** `worktree-san-478-rental-browse`  
**Commits:** `43c35f9`, `53e5529`

## What shipped

| File | Description |
|---|---|
| `src/components/rentals/rental-browse-filters.tsx` | Client chip bar — Neighborhood / Bedrooms / Max price, Link-based URL state, aria-pressed |
| `src/components/rentals/rental-browse-view.tsx` | Client view: BrowseLayout + RentalCard grid; `onSchedule` → `window.open(schedule_viewing_url)` |
| `src/app/rentals/page.tsx` | Async server component; reads searchParams, calls `searchRentals()`, passes typed `Rental[]` |
| `e2e/screens/REAL-011-rentals-browse.spec.ts` | 5 Playwright scenarios |
| `src/components/chat/chat-nav-rail.tsx` | `href: null` → `href: "/rentals"` (Rentals nav item now live) |

## Acceptance criteria check

| AC | Status |
|---|---|
| `/rentals` renders a browse page (no redirect to `/chat`) | ✅ |
| Neighborhood chips filter by URL param | ✅ |
| Bedrooms chips filter by URL param | ✅ |
| Max price chips filter by URL param | ✅ |
| Empty state shown when no results | ✅ (`rentals-empty` testId) |
| Error state shown on DB failure | ✅ (`rentals-error` testId) |
| Sidebar nav "Rentals" item links to `/rentals` | ✅ |
| TypeScript clean | ✅ |
| ESLint clean (0 warnings) | ✅ |
| Playwright spec written | ✅ (5 scenarios) |

## Runtime verification ✅

Verified 2026-06-07 from worktree dev server (port 3002):

```
GET /rentals                                        → 200
GET /rentals?neighborhood=Laureles&beds=1&maxPrice=100 → 200
GET /rentals?neighborhood=El+Poblado               → 200
```

PR: https://github.com/amo-tech-ai/mdeapp/pull/108

## Filter URL schema

| Filter | Param | Values |
|---|---|---|
| Neighborhood | `neighborhood` | `Laureles`, `El Poblado`, `Envigado`, `Sabaneta`, `Belén` |
| Bedrooms | `beds` | `0` (Studio), `1` (1BR+), `2` (2BR+), `3` (3BR+) |
| Max price | `maxPrice` | `50`, `75`, `100`, `150` |

Toggle behaviour: clicking an active chip clears the param.

---

## PR #122 + #132 follow-up (2026-06-08)

| PR | SHA | What |
|----|-----|------|
| [#122](https://github.com/amo-tech-ai/mdeapp/pull/122) | `4325e57` | Nova browse redesign — `RentalBrowseCard`, exact count subtitle |
| [#132](https://github.com/amo-tech-ai/mdeapp/pull/132) | `d0fba36` | Cubic follow-up — `rental-card-${id}` test-id contract + `dev:ui:worktree` |

### Post-#132 proof

| Check | Result |
|-------|--------|
| Vitest `rental-browse-card.test.tsx` | 3/3 pass |
| Playwright REAL-011 | 6/6 pass |
| prod `https://www.mdeai.co/rentals` | 200 · `data-testid="rental-card-<uuid>"` |

**Evidence:** `tasks/testing/evidence/2026-06-08/PR-132-SAN-478-cubic-followup-RESULTS.md`  
**Linear:** [SAN-478](https://linear.app/sanjiovani/issue/SAN-478) — **Done**
