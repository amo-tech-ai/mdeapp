# Prod synthetic smoke — UX-034 / SAN-322

**Date:** 2026-06-01  
**PR:** [#37](https://github.com/amo-tech-ai/mdeapp/pull/37) → merge `c9e54b8`  
**Target:** https://www.mdeai.co

## Local run (pre-merge, rebased branch)

```bash
cd mdeapp && npm run test:e2e:prod-synthetic
```

| Result | Detail |
|--------|--------|
| Exit | 0 — 1 passed (~2.8m) |
| Rentals | cards > 0 |
| Events | cards > 0 |
| Restaurants | 5 cards, **0** photo placeholders (post #35 proxy) |
| Cafés | 5 grounded café cards |

`report.json` excerpt: `restaurantCards: 5`, `restaurantPhotoPlaceholders: 0`, `cafeGroundedCards: 5`.

## Fix applied before merge

- Rebased onto `main` (#35 + #36); resolved `package.json` conflict (kept `test:e2e:new-chat` + `test:e2e:prod-synthetic`).
- **`playwright.config.ts`:** honor `PROD_SMOKE_BASE_URL` (workflow/script only set this; config previously used `SMOKE_BASE_URL` → would have hit localhost in CI).
- **Workflow:** `SMOKE_BASE_URL` mirror + validate `PROD_SMOKE_BASE_URL` non-empty.

## Post-merge ops

| Item | Value |
|------|--------|
| `PROD_SMOKE_ENABLED` | `true` |
| `PROD_SMOKE_BASE_URL` | `https://www.mdeai.co` |
| Manual dispatch | [run 26760735915](https://github.com/amo-tech-ai/mdeapp/actions/runs/26760735915) — **success** (~5m) |
| Schedule | `0 9 * * *` UTC |

Artifacts: `prod-synthetic-smoke-26760735915` uploaded on dispatch run.
