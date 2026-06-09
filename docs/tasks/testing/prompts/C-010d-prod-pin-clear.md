# C-010d — prod pin clear (PR #12 regression gate)

**Optional · TEST hardening · not MVP blocker**  
**Task:** [`tasks/commit/may-27/tasks/C-010d-prod-pin-clear-e2e.md`](../../commit/may-27/tasks/C-010d-prod-pin-clear-e2e.md)

## Run (prod only)

```bash
cd /home/sk/mdeai/mdeapp
npm run lint && npm run floor
PW_SKIP_WEBSERVER=1 SMOKE_BASE_URL=https://www.mdeai.co \
  npx playwright test e2e/prod/pr12-pin-clear-prod-gate.spec.ts --project=chromium
```

Without `SMOKE_BASE_URL=https://www.mdeai.co` the spec **skips** (safe for CI/local floor).

## Pass matrix

| # | Check | Pass |
|---|-------|:----:|
| 1 | `npm run floor` with spec tracked | |
| 2 | Test A: cards + pins on prod | |
| 3 | Test B: zero-result clears rental pins | |
| 4 | No critical console errors | |
| 5 | `POST /api/rentals/search` → 200 | |

## Evidence

`tasks/testing/evidence/YYYY-MM-DD/C-010d-RESULTS.md`

Also covers manual steps in [`01-rentals-prompt.md`](./01-rentals-prompt.md) Tests A/B.
