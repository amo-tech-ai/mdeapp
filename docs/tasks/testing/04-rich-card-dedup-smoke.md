# 04 — Rich card dedup smoke

**Target:** localhost `:3001`

## Verify

| # | Check |
|---|--------|
| 1 | Rental cards appear once (chat) |
| 2 | Café `grounded-card` once |
| 3 | Event cards once (when C-013 ships) |
| 4 | Map pins still render |
| 5 | No generic Map results strip when cards visible |
| 6 | Category switch clears stale cards (manual) |
| 7 | Citations/source links not hidden incorrectly |

## Commands

```bash
PW_SKIP_WEBSERVER=1 npx playwright test e2e/rich-card-dedup.spec.ts --project=chromium --workers=1
```

Note: **events** row fails until `EventFastPathPanel` exists.
