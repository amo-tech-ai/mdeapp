# Prod visual cards — 2026-06-01

**Target:** https://www.mdeai.co  
**Command:**

```bash
cd mdeapp
PROD_SMOKE_BASE_URL=https://www.mdeai.co \
PW_SKIP_WEBSERVER=1 \
VISUAL_EVIDENCE_DIR=../tasks/testing/evidence/visual-cards-prod \
npm run test:e2e:visual-cards
```

**Result:** 4/4 passed (~37s)

| Shot | Vertical | Assertion |
|------|----------|-----------|
| 01-restaurants.png | Restaurants | `restaurant-card` count > 0 |
| 02-cafes.png | Cafés | `grounded-card[data-result-kind=cafe]` > 0 |
| 03-events.png | Events | `event-card` > 0 |
| 04-rentals.png | Rentals | `rental-card` > 0 |

**Related prod proof:** [prod-synthetic-smoke-2026-06-01.md](../prod-synthetic-smoke-2026-06-01.md) — `restaurantPhotoPlaceholders: 0` on API matrix.

**Localhost evidence (unchanged):** [../visual-cards/](../visual-cards/)
