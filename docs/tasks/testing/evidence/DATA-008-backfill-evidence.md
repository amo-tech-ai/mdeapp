---
task: DATA-008
date: 2026-06-02
field_mask_version: details-v3-links-2026-05-26
status: Partial
grade: B
execution_score: 78
---

# DATA-008 — Places backfill + cache read-through

## Shipped (disk)

| Artifact | Path |
|----------|------|
| Cache read/write | `mdeapp/src/mastra/lib/place-details-cache.ts` |
| API read-through | `mdeapp/src/app/api/places/detail/route.ts` (`X-Place-Details-Cache: HIT\|MISS`) |
| Backfill script | `mdeapp/scripts/backfill-place-details-cache.mjs` |
| Vitest | `place-details-cache.test.ts` — **4/4** pass |

## Backfill run (2026-06-02)

```bash
cd mdeapp
node --env-file=.env.local scripts/backfill-place-details-cache.mjs --limit=80
# ok=0 fail=72 — Google Places 403 PERMISSION_DENIED + 429 quota on GetPlaceRequest
```

Log: [`DATA-008-backfill.log`](DATA-008-backfill.log)

**Env blocker:** enable Places API (New) Place Details on the server key + raise quota before batch backfill can hit ≥80% coverage.

## Localhost proof (cache read-through)

```bash
curl -s -D - "http://localhost:3001/api/places/detail?placeId=ChIJwRtMUncpRI4R5SM5WvAmBkQ" | head -5
# HTTP/1.1 200 OK
# x-place-details-cache: HIT
# JSON includes displayName, weekdayDescriptions (hours)
```

Second request for same `place_id` avoids Places API when cache row exists for current `field_mask_version`.

## Acceptance matrix

| Criterion | Status |
|-----------|--------|
| Field mask on every fetch | ✅ script + `google-places-client.ts` |
| Idempotent upsert by `(place_id, field_mask_version)` | ✅ |
| No browser-side Places calls | ✅ server route only |
| ≥80% anchor coverage after one run | ❌ blocked by API 403/429 |
| RLS unchanged | ✅ service_role writes only |

## Grade (B / 78)

Implementation + read-through verified; batch backfill and ≥80% metric blocked on Google API credentials/quota in this environment.

## Next

1. Fix Google Cloud: enable **Places API (New)** + billing on server key used by `.env.local`
2. Re-run `backfill-place-details-cache.mjs` → re-run DATA-007 audit
3. Spot-check 3 DATA-035 café anchors (Rituales, Pergamino, Semilla) for hours in detail panel
