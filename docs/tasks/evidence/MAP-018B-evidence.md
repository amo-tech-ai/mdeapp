# MAP-018B evidence — 2026-05-20

## Shipped

- `services/adk-grounding/places_enrich.py` — batch GET Place Details (max 5 parallel), fail-open, 429/503 retry
- `services/adk-grounding/main.py` — `enrich_pins_if_enabled()` after MCP/Gemini fallback
- `services/adk-grounding/test_places_enrich.py` — 5 unit tests (merge, flag, no-key skip, parallel, retry)

## MAP-004b (same session)

- Pinned `@googlemaps/places` → `2.4.1` exact
- `mdeapp/src/mastra/lib/places-retry.ts` + tests wired into `google-places-client.ts`
- `PLACE_DETAILS_FIELD_MASK_VERSION = details-v1-2026-05-25`

## Tests

```bash
cd mdeapp && npm test -- src/mastra/lib/__tests__/places-retry.test.ts src/mastra/lib/google-places-client.test.ts
# 15 passed

cd services/adk-grounding && python3 -m pytest test_places_enrich.py -q
# 5 passed
```

## Deploy (2026-05-25)

- Revision: **`mdeai-adk-grounding-00007-9wh`** (00006 failed — Dockerfile missing `places_enrich.py`, fixed)
- Env: `PLACES_ENRICHMENT_ENABLED=true`, `PLACES_ENRICH_CACHE_TTL_SEC=300`, `PLACES_ENABLE_EDITORIAL_SUMMARY=false`

## Localhost verification (2026-05-25)

```bash
cd mdeapp && npm run verify:grounding                    # ✅ grounding-lite 5 pins
cd mdeapp && npm run verify:grounding-enrichment         # ✅ 5/5 enriched, cache OK
node --env-file=.env.local scripts/smoke-grounding-attribution.mjs  # ✅ 5 cards, 5 pins, 0 console errors
PW_SKIP_WEBSERVER=1 npx playwright test e2e/maps-grounding.spec.ts --project=chromium  # ✅ 1 passed
cd services/adk-grounding && .venv/bin/python -m pytest test_places_enrich.py test_invoke_auth.py -q  # ✅ 9 passed
```

**Local stack:** UI `:3001` HTTP 200 · Mastra `:4111` HTTP 200 · ADK prod Cloud Run

## Rollback

`PLACES_ENRICHMENT_ENABLED=false` on Cloud Run — no Vercel change.
