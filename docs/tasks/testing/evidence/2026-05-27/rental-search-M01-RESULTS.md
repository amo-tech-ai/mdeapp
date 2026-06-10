# Rental search smoke — M01 (2026-05-27)

**Pack:** `tasks/testing/02-multi-intent-stress.md` M01  
**Prompt (Camila):** *Find 5 furnished rentals in Laureles under $1200/month with fast WiFi and nearby cafés.*  
**Playwright query (SCREEN-005):** *1BR apartment in Laureles under 80 dollars per night*

## Dev restart

```bash
pkill -f "next dev"; pkill -f "mastra dev"; sleep 2
cd mdeapp && npm run dev
```

- `[ui]` bound **localhost:3001** (port 3000 occupied)
- Mastra Studio **:4111**

## Localhost

| Check | Result |
|-------|--------|
| GET / | **200** |
| `chat-smoke.mjs` | **All checks passed** |
| POST `/api/rentals/search` | **200** — 1 result (Laureles studio); `source: supabase` |
| Playwright `SCREEN-005-rental-card.spec.ts` | **3/3 pass** — `[data-testid="rental-card"]` ≥3, schedule CTA, modal, pin sync |

**Verdict localhost:** **PASS** (UI path works; API returns sparse inventory — 1 row in DB for Laureles filter).

## Production (https://www.mdeai.co/)

| Check | Result |
|-------|--------|
| GET / | **200** |
| POST `/api/rentals/search` | **404** (HTML document, not JSON) — route **not deployed** on prod |

**Verdict prod:** **FAIL** — rental fast-path API + likely UI fix not on production deploy yet.

---

## Re-verify duplicate prose fix (2026-05-26)

After `showDevConsole: false`, empty `showExchange` assistant text, sanitizer, and `RentalResultsHeader` removal:

- Localhost browser M01: **PASS** (5 cards, 0× narrative boilerplate) — see `SCREEN-005-rental-ui-localhost-RESULTS.md` § M01 browser verified.
- Prod: still **FAIL** (`POST /api/rentals/search` → **404**).

## Root cause (prod)

`/api/rentals/search` exists in `mdeapp` repo but prod returns Next.js 404 HTML. Deploy `mdeapp` to `amo100/mdeai` / www.mdeai.co to fix Camila's rental search on prod.

## Re-test commands

```bash
node tasks/testing/scripts/chat-smoke.mjs --base http://localhost:3001
curl -s -X POST http://localhost:3001/api/rentals/search \
  -H 'Content-Type: application/json' \
  -d '{"neighborhood":"Laureles","maxPricePerNight":40,"limit":5}'
cd mdeapp && PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-005-rental-card.spec.ts --project=chromium
```
