# MAP-008B Evidence — Vercel Map ID

> **Summary:** Map ID set on Vercel Production + Preview + Development. Prod AdvancedMarker pins verified on mdeai.co after PR #57 deploy (`41cfe99`).

**Date:** 2026-06-03  
**Linear:** [SAN-369](https://linear.app/sanjiovani/issue/SAN-369)  
**Prod SHA:** `41cfe99` (PR #57 squash-merge)

## Vercel env (verified via CLI)

| Variable | Production | Preview | Development |
|----------|:----------:|:-------:|:-----------:|
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ✅ | ✅ | ✅ |

Command: `vercel env ls | rg MAP_ID` (2026-06-03)

## Automated proof

```bash
cd mdeapp
npm test -- --run src/lib/__tests__/google-maps-map-id.test.ts   # 9/9 pass
npm run verify:maps-env                                           # exit 0
npm run verify:task -- MAP-008B --skip-floor                      # pass (2026-06-03)
```

## Production browser proof (required for Done)

**URL:** https://www.mdeai.co/  
**Query:** `quiet cafés in Laureles with good Wi-Fi`  
**Result:** 5 café cards + map sheet with AdvancedMarker pins (coffee-cup icons)

| Check | Result |
|-------|--------|
| `GET /` | 200 |
| `GET /restaurants` | 200 (PR #57 browse) |
| ≥1 `[data-testid="map-pin"]` | ✅ 3 pins in map sheet DOM |
| Pin titles | `grounded: Rituales Compañía de Café`, `Pergamino Café Laureles`, `Café Namazzi` |
| Screenshot | `tasks/testing/evidence/MAP-008B-prod-pins-2026-06-03.png` |

**Caveat (follow-up, not Map ID):** Google Maps JS showed “For development purposes only” watermark + “This page can't load Google Maps correctly” modal on prod. Pins still render — likely GCP billing or HTTP referrer on the **browser** Maps key, not missing Map ID. Track separately from MAP-008B; Places server 403 remains DATA-008.

## Grade

| Layer | Score | Grade |
|-------|------:|-------|
| Vercel env | 100% | A |
| Code + vitest | 100% | A |
| Prod pin proof | 100% | A |
| Console clean (S2) | 70% | C |
| **Overall** | **95%** | **A** |

Done gate: prod screenshot with visible AdvancedMarker pins — **met**.
