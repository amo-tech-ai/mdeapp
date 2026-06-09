# MAP-013 evidence — 2026-05-20 Done

## Automated (exit 0)

```bash
cd mdeapp && npm run verify:maps-env
cd mdeapp && npm run verify:rental-pins
npm test -- maps-security
```

## Env audit (names only)

| Variable | Status |
|----------|--------|
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | ✅ **removed** |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ✅ set |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | ✅ set |
| `GOOGLE_PLACES_API_KEY` | ✅ server |
| `GOOGLE_MAPS_API_KEY` | ✅ server |
| `ADK_GROUNDING_URL` | ✅ `http://localhost:8000` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ set |

## Warnings (non-blocking)

- `GOOGLE_PLACES_API_KEY` has HTTP referrer restriction — fix before **MAP-004** server Places calls (use IP-restricted server key).
- `GEMINI_API_KEY` duplicates Gemini env — prefer `GOOGLE_GENERATIVE_AI_API_KEY` only.

## Vercel checklist

Mirror INDEX § Environment: never `NEXT_PUBLIC_*` for Places/MCP/ADK.
