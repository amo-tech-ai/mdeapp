# Cloud Run deploy + maps/search sprint — 2026-05-26

## Deploy

| Item | Value |
|------|--------|
| Revision | `mdeai-adk-grounding-00011-lbt` |
| URL | `https://mdeai-adk-grounding-4huwyjbclq-ue.a.run.app` |
| Image | `mdeai-adk-grounding:20260525-224942` |
| Env | `ENABLE_SEARCH_GROUNDING=1` (staging) |

## Smoke (`verify-cloud-run-grounding.mjs`)

```
✅ health
✅ places source=grounding-lite pins=5
   mask v3: 5/5 withLinks=5
```

## Tests

- Sidecar pytest: **22/22**
- mdeapp `npm run floor`: **232/232** Vitest, exit 0

## Vercel / local env (Patricia)

```bash
ADK_GROUNDING_URL=https://mdeai-adk-grounding-4huwyjbclq-ue.a.run.app
ENABLE_SEARCH_GROUNDING=1          # Mastra + optional match Cloud Run
SEARCH_GROUNDING_DAILY_CAP=50
```

## Manual G1 (Camila viewport)

```bash
cd mdeapp && npm run dev
# /chat → pan El Poblado → "quiet cafés near what I see on the map"
# Expect: locationBias in network payload; pins near viewport; CTAs when enriched
```
