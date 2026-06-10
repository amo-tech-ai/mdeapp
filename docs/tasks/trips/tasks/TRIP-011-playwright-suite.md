---
task_id: TRIP-011
title: Playwright suite (SCREEN-011/012/013)
layer: QA
priority: P1
phase: ship
status: Not Started
estimated_effort: 4h
persona: Lucía
depends_on: [TRIP-002, TRIP-004, TRIP-006, TRIP-009, TRIP-010, TRIP-014, TRIP-019]
unblocks: [TRIP-012]
skills: [playwright-cli, webapp-testing, task-verifier]
testing_standard: ../../screens/SCREEN-TESTING-STANDARD.md
description: E2E specs for /trips, /trips/[id], /saved; auth fixture; desktop + mobile.
---

# TRIP-011 — Playwright suite

## Specs to create

| File | Route |
|------|-------|
| `e2e/screens/SCREEN-012-trips.spec.ts` | `/trips` |
| `e2e/screens/SCREEN-013-itinerary.spec.ts` | `/trips/[id]` |
| `e2e/screens/SCREEN-011-saved.spec.ts` | `/saved` |

## Auth

`E2E_BYPASS_AUTH=1` or seeded test user per SCREEN-TESTING-STANDARD §7.

## Scenarios

- Dashboard empty + populated
- Create trip flow (TRIP-003)
- Itinerary day groups + conflict banner fixture
- Saved page RLS note (two-user test or documented manual)
- Add-to-trip happy path (TRIP-007)
- Add-to-trip failed insert rollback path (TRIP-019)
- Multi-user RLS fixture: User B cannot view/update/delete User A trips, trip_items, saves, or conflicts (TRIP-014)
- Mobile workspace: itinerary controls remain reachable when map/bottom sheet is open (TRIP-016)

## Acceptance criteria

- [ ] All specs pass chromium desktop + mobile viewports
- [ ] Evidence files: `tasks/notes/SCREEN-011/012/013-evidence.md`
- [ ] `npm run floor` exit 0
- [ ] RLS isolation proof is automated or explicitly attached as SQL/JWT evidence; "manual note only" is not enough for production

## Commands

```bash
cd mdeapp && PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-012-trips.spec.ts e2e/screens/SCREEN-013-itinerary.spec.ts e2e/screens/SCREEN-011-saved.spec.ts
```
