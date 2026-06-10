---
id: UX-T-037
title: Playwright — restaurant card fast path + request budget split
status: In Review
pr: https://github.com/amo-tech-ai/mdeapp/pull/28
priority: P0
implements: [UX-036, CK-P0-07]
depends_on: [UX-036]
blocks: [UX-036 Done gate, #27 e2e-only PR]
skill: [testing, playwright-cli, copilotkit-debug]
output:
  - mdeapp/e2e/copilotkit-request-budget.spec.ts
  - mdeapp/e2e/restaurant-card-fast-path.spec.ts
  - mdeapp/e2e/helpers/maps-layout.ts (waitForRestaurantCards)
evidence: tasks/testing/evidence/<date>/ux-t-037-restaurant-fast-path.png
description: |
  Split CK-P0-07 (idle + event budget only) from restaurant card coverage.
  Restaurant spec uses fast-path query "suggest restaurants medellin".
---

# UX-T-037 — Restaurant fast path e2e

## Target files

| File | Purpose |
|------|---------|
| `e2e/copilotkit-request-budget.spec.ts` | Idle ≤10 POSTs; event burst ≤10 POSTs; `salsa events this weekend` only — **no** `waitForEventCards` agent nudge |
| `e2e/restaurant-card-fast-path.spec.ts` | Cards render; no event misroute; no `restaurant-card-empty` |

## Preconditions

- `cd mdeapp && npm run dev` — UI `:3001`
- **UX-036 feat slice on disk** (fast path + `/api/restaurants/search`)

## Assertions (restaurant spec)

- `[data-testid="restaurant-fast-path-panel"]` visible
- `[data-testid="restaurant-card"]` count > 0
- `[data-testid="event-card"]` count === 0
- Assistant text does not match `/Found \d+ events/i`
- `[data-testid="restaurant-card-empty"]` count === 0

## Commands (never bare `npm run test:e2e`)

```bash
cd mdeapp && npm run dev   # fresh :3001 + :4111 before budget spec
npm run test:e2e:copilot-budget
npm run test:e2e:restaurant-fast-path
npm run test:e2e:concierge-run-error
# or:
npm run test:e2e:p0-focused
```

See `mdeapp/e2e/README.md`.

## Out of scope

- Café silent UI (60s+ no bubble) — separate follow-up task
- Prod POST storm under stress — CK-P0-07 guards localhost only

## Verification log (2026-06-01, clean dev)

| Spec | Result | Notes |
|------|--------|-------|
| `test:e2e:copilot-budget` | ✅ ~20s | Idle ≤10 POSTs; event burst ≤10; `waitForEventCardsFastPath` (no agent nudge) |
| `test:e2e:restaurant-fast-path` | ✅ ~13s | Panel + cards; 0 event cards |
| `test:e2e:concierge-run-error` | ✅ ~2s | |
| `test:e2e:p0-focused` | ✅ ~36s | Full chain |

**Not in GitHub CI** — run locally before merge.

## Café follow-up note

```
Café server returns 200 after ~19s, but UI sometimes does not render assistant
reply within 60s. Inspect stream/tool envelope/message state separately.
```
