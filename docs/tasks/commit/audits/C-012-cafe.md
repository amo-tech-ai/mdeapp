---
title: C-012 café Places — post-merge audit
date: 2026-05-28
slice: C-012
---

# C-012 post-merge audit checklist

## Localhost (before PR merge)

- [ ] `rg 'X-Goog-FieldMask|validatePlacesFieldMask' src/mastra/lib/google-places-client.ts src/app/api/places/`
- [ ] `node scripts/commit-staged-guard.mjs c012` on final staged set
- [ ] `npm test -- --run src/lib/place-details.test.ts src/components/copilot/__tests__/cafe-result-card.test.ts`
- [ ] `PW_SKIP_WEBSERVER=1 npx playwright test e2e/maps-grounding.spec.ts e2e/screens/SCREEN-021-cafe-listings.spec.ts --project=chromium`
- [ ] `npm run floor`

## Preview (Vercel)

- [ ] `GET /api/places/detail?placeId=ChIJ…` → 200
- [ ] Grounded café query → `[data-testid="grounded-card"]` visible
- [ ] No duplicate `results-column` when cards render

## Production (https://www.mdeai.co/)

- [ ] Same as preview after promote
- [ ] Evidence: `tasks/testing/evidence/YYYY-MM-DD/C-012-RESULTS.md`

## Rollback

Revert PR; `places/detail` 404 is safe (route-only).
