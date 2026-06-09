# MAP-008 evidence — 2026-05-20

## Status: **Done** (Map ID hardening — MdeMarker chrome deferred to MAP-009 polish)

## Implementation

| Path | Change |
|------|--------|
| `mdeapp/src/lib/google-maps-map-id.ts` | Prod/preview fail-closed; dev `DEMO_MAP_ID` + warn |
| `mdeapp/src/lib/__tests__/google-maps-map-id.test.ts` | 9 tests — env matrix |
| `mdeapp/src/platform/maps/map-config.ts` | Re-exports from lib |
| `mdeapp/src/components/maps/ChatMap.tsx` | `data-mapid-present`, invalid lat/lng filter, markers only when `mapId` set |
| `mdeapp/scripts/verify-maps-env.mjs` | Prod mapId required; rejects `DEMO_MAP_ID` in env |

## Verification

```bash
cd mdeapp
npm test -- google-maps-map-id   # 9/9
npm run verify:maps-env          # mapId present
npm run smoke:map-pins           # pins render
npm run floor                    # exit 0
```

| Check | Result |
|-------|--------|
| `rg 'DEMO_MAP_ID' mdeapp/src` | only `google-maps-map-id.ts` |
| `rg "react-google-maps/api" mdeapp` | 0 |
| `rg "AdvancedMarkerElement" mdeapp/src` | 0 (vis.gl JSX only) |
| Production without mapId | `undefined` + `console.error` — not DEMO |

## Human step (Vercel)

Set `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` on **preview + production** (already in `.env.local` for localhost).

## Out of scope (this pass)

- `MdeMarker` / price badges / InfoWindow — MAP-008 §2 full chrome; MAP-009 clustering
- `advanced-marker-needs-mapid.mjs` hook promotion
