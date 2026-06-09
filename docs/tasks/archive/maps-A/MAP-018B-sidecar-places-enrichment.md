---
id: MAP-018B
title: ADK sidecar batch Place Details after Grounding Lite MCP
status: Done
priority: P0
phase: MVP — MAP-018 track
effort: 4-6h
owner: claude
depends_on: [MAP-004, MAP-002, ADK-CR-06]
blocks: [MAP-018C]
parent: MAP-018
skill: [mde-maps, mde-supabase]
official_docs:
  - https://developers.google.com/maps/documentation/places/web-service/place-details
  - https://developers.google.com/maps/documentation/places/web-service/data-fields
---

# MAP-018B — Sidecar Places enrichment

## At a glance

**Camila:** After *"list cafés in Laureles"*, each pin should carry **rating, hours, photo ref, canonical Maps URL** — not just MCP title + coordinates.

**Goal:** Extend `POST /v1/grounding/invoke` so Cloud Run calls **Place Details (New)** for each MCP `placeId` (max 5, parallel, cache-aware in 018E).

| Who | Effect |
|-----|--------|
| **Camila** | Richer tool JSON before UI work (018F). |
| **Sofía** | `PLACES_ENRICHMENT_ENABLED=false` rolls back to MCP-only. |

## Architecture

- **Keep** Grounding Lite MCP for discovery — do not replace with Text Search.
- **Add** `places_enrich.py` using same server key as MCP (`GOOGLE_MAPS_SERVER_API_KEY`).
- **Fail-open:** missing `placeId` or Details timeout → return MCP pin unchanged.

## API (verified — Maps Code Assist MCP 2026-05-25)

| Call | Method | URL / header |
|------|--------|----------------|
| Place Details (New) | `GET` | `https://places.googleapis.com/v1/places/{place_id}` |
| Field mask | Header | `X-Goog-FieldMask` — **top-level** names (no `places.` prefix on Details) |
| Place Photos (New) | `GET` | `https://places.googleapis.com/v1/{photo.name}/media?maxWidthPx=400` — `photo.name` from Details is `places/{id}/photos/{ref}`; append `/media` for media fetch |

**Details field mask (MVP):**

```
id,displayName,formattedAddress,googleMapsLinks,location,rating,userRatingCount,priceLevel,currentOpeningHours,photos,types,editorialSummary
```

**Maps URL:** use `googleMapsLinks.placeUri` per mde-maps — not hand-built `maps.google.com` URLs.

**Colombia:** skip `generativeSummary` in MVP; `editorialSummary` often empty — sidecar may leave `summary` null (018F shows title only).

## Files to modify

| File | Change |
|------|--------|
| `services/adk-grounding/places_enrich.py` | **New** — `enrich_pins(pins[], api_key)` |
| `services/adk-grounding/main.py` | Call enrich after MCP; feature flag |
| `services/adk-grounding/grounding_mcp.py` | Ensure `placeId` on every pin |
| `services/adk-grounding/test_places_enrich.py` | **New** — mocked HTTP |
| `plan/ADK/sidecar-api-contract.md` | Document enriched pin shape |

## Env vars

| Var | Where | Notes |
|-----|-------|-------|
| `GOOGLE_MAPS_SERVER_API_KEY` | Cloud Run | IP-restricted; same as MCP |
| `PLACES_ENRICHMENT_ENABLED` | Cloud Run | `true` / `false` rollback |
| `PLACES_ENRICH_MAX_PARALLEL` | Cloud Run | Default `5` |
| `PLACES_ENRICH_TIMEOUT_MS` | Cloud Run | Default `8000` |

## Security

- Bearer on `/v1/grounding/invoke` unchanged.
- Server key never in response body.
- Return **photo resource name** only — not raw media URL with `key=` (018D proxies on Vercel).
- Log field mask on every Details call.

## Tests

- Unit: mock `GET places/ChIJ…` → merged pin has `rating`, `photoName`, `mapsUrl` from `placeUri`.
- Unit: Details 404 → original MCP pin returned.
- Integration: `curl` invoke with enrichment on → 5 pins enriched.

## Success criteria

1. Invoke response pins include `rating` (when Google has data) + `photoName` + `googleMapsLinks.placeUri`.
2. `PLACES_ENRICHMENT_ENABLED=false` → identical to pre-018B behavior.
3. p95 invoke < 8s cold (5 Details, no cache).

## Rollback

Cloud Run env `PLACES_ENRICHMENT_ENABLED=false` + redeploy — no Vercel change required.

## Rollout

Deploy Cloud Run revision after MAP-004 client exists (shared mask constants or duplicate minimal GET in Python).

## Post-ship follow-on — extended `googleMapsLinks` (checklist §3b)

> **Status:** 018B MVP is **Done**. Sidecar mask matches MAP-004 MVP; **directions/reviews URIs not yet requested.**

**Amend scope (same task ID — UI in [**MAP-019**](./MAP-019-google-maps-link-ctas.md)):**

1. Extend `PLACES_DETAILS_MASK` in `places_enrich.py` per [**MAP-004 §12**](./MAP-004-places-grounding-clients.md#12-post-ship-follow-on--googlemapslinks-depth-checklist-3b).
2. Merge into enriched pin JSON: `directionsUrl`, `reviewsUrl` (from `googleMapsLinks.directionsUri` / `reviewsUri`).
3. Bump `PLACE_DETAILS_FIELD_MASK_VERSION` — 018E Supabase cache keys on new version.
4. Unit test: mocked Details with all link fields → merged pin exposes URLs.

**Do not** hand-build Maps URLs from lat/lng — always use API-returned URIs ([Maps links doc](https://developers.google.com/maps/documentation/places/web-service/maps-links)).
