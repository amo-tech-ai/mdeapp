# 02 — Rental search smoke (Camila / SAN-242, SAN-243)

**Target:** `http://localhost:3001/` · prod after deploy

**Prompt:**
```text
Show me rentals in Laureles under $80 per night with good WiFi.
```

Playwright query (SCREEN-005):
```text
1BR apartment in Laureles under 80 dollars per night
```

## Verify

| # | Check |
|---|--------|
| 1 | `POST /api/rentals/search` → **200** |
| 2 | ≥3 results (DB may return 5 on current seed) |
| 3 | `[data-testid="rental-card"]` inline in chat |
| 4 | title, neighborhood, price, photo/fallback |
| 5 | Schedule viewing CTA + modal |
| 6 | Save CTA present (disabled until auth) |
| 7 | Map pins match cards (`data-pin-id`) |
| 8 | `[data-testid="results-column"]` count **0** |
| 9 | No invented listings (IDs from `apartments`) |
| 10 | Response &lt;3s preferred, &lt;6s max |
| 11 | No service-role in browser network |

## Commands

```bash
node tasks/testing/scripts/chat-smoke.mjs --base http://localhost:3001
node tasks/testing/scripts/maps-smoke.mjs --base http://localhost:3001
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-005-rental-card.spec.ts --project=chromium --workers=1
```

Evidence: `tasks/testing/evidence/YYYY-MM-DD/rental-search-RESULTS.md`
