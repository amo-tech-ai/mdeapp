---
id: MAP-018D
title: Server photo proxy for Place Photos (New)
status: Done
priority: P0
phase: MVP — MAP-018 track
effort: 2h
owner: claude
depends_on: [MAP-004, MAP-018C]
blocks: [MAP-018F]
parent: MAP-018
skill: [mde-maps, nextjs]
official_docs:
  - https://developers.google.com/maps/documentation/places/web-service/place-photos
---

# MAP-018D — Places photo proxy route

## At a glance

**Problem:** Place Photos (New) requires API key on media fetch. Putting `key=` in `<img src>` exposes the server key.

**Camila:** Sees café thumbnails in chat cards — key stays on Vercel server.

## API (verified)

```
GET https://places.googleapis.com/v1/places/{PLACE_ID}/photos/{PHOTO_REF}/media?maxWidthPx=400&key=SERVER_KEY
```

- `photoName` from Details = `places/{id}/photos/{ref}` — request path is `{photoName}/media`.
- Require `maxWidthPx` or `maxHeightPx` (1–4800). MVP: `maxWidthPx=400`.
- Optional: `skipHttpRedirect=true` + JSON `photoUri` if proxying bytes without redirect chain.

**Product route:** `GET /api/places/photo?name=places%2F...%2Fphotos%2F...` (validate prefix `places/`).

## Files to modify

| File | Change |
|------|--------|
| `mdeapp/src/app/api/places/photo/route.ts` | **New** — server fetch + redirect or stream |
| `mdeapp/src/mastra/lib/places-photo-proxy.ts` | Optional shared URL builder |
| `mdeapp/src/app/api/places/photo/route.test.ts` | Mock fetch; no key in response |

## Env vars

| Var | Client? |
|-----|---------|
| `GOOGLE_PLACES_API_KEY` or `GOOGLE_MAPS_SERVER_API_KEY` | Server only — **never** `NEXT_PUBLIC_*` |

## Security

- Allowlist `name` param: must match `^places/[^/]+/photos/[^/]+$`.
- Rate limit (middleware or simple in-route counter).
- `Cache-Control: public, max-age=86400`.
- Do not log full API key.

## Tests

- Unit: invalid `name` → 400.
- Unit: mock Google redirect → 302/200 without `key` in `Location` exposed to client incorrectly.
- Manual: browser Network tab — img URL is `/api/places/photo?...` only.

## Success criteria

1. Card can use `photoUrl="/api/places/photo?name=..."`.
2. `rg NEXT_PUBLIC.*PLACES mdeapp` → 0 for photo route.
3. `npm run floor` green.

## Rollback

018F uses placeholder image when route 404.

## Do not

- Use legacy `maps.googleapis.com/maps/api/place/photo?photo_reference=`.
