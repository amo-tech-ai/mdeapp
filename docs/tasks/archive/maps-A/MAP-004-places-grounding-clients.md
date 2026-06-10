---
id: MAP-004
title: Places API client + field-mask registry (google-places port)
status: Done
priority: P0
phase: MVP — after MAP-002
effort: 2-3h
owner: claude
depends_on: [F13, MAP-001, MAP-002]
blocks: [MAP-005, F17]
supersedes: F16
skill: [mde-maps, mastra, copilotkit-integrations]
integration_pattern: in-process
prd_ref: ../../../plan/ADK/maps-adk-prd.md · ../../../plan/prd/04-maps-grounding.md · ../../../plan/maps/maps-prd.md MAP-004
index_ref: ../../../index.md §4 github/maps
master_plan: ../../../plan/05-path-a-mastra-migration.md
source_files:
  - /home/sk/mde/my-mastra-app/src/mastra/lib/google-places-client.ts
  - /home/sk/mde/my-mastra-app/src/mastra/lib/google-places-client.test.ts
target_files:
  - /home/sk/mdeai/mdeapp/src/mastra/lib/google-places-client.ts
  - /home/sk/mdeai/mdeapp/src/mastra/lib/google-places-client.test.ts
deprecated_do_not_add:
  - mdeapp/src/mastra/lib/maps-grounding-client.ts
  - mdeapp/src/lib/places/places-client.ts
verified_against:
  - /home/sk/mdeai/github/maps/js-api-samples/
  - /home/sk/mdeai/github/maps/google-maps-services-js/
  - https://developers.google.com/maps/documentation/places/web-service/choose-fields
---

# MAP-004 — Places API client + field masks

## At a glance

**Description:** Add a **server-only** Google Places (New) client that always sends `X-Goog-FieldMask` — so every place lookup requests only the fields we pay for.

**Purpose:** Grounding Lite (MAP-002) covers conversational search; **Roberto**’s venue autocomplete (MAP-010) and **Camila**’s “show nearby” (MAP-006) need structured Places calls with controlled cost. Browsers must never hold the Places API key.

**Goals:**
- Port `google-places-client.ts` + tests from legacy Mastra app.
- Enforce minimum field masks per endpoint (Text, Nearby, Details, Autocomplete).
- Install `@googlemaps/places` only — **no** Grounding MCP packages in this task.
- Promote the field-mask CI hook from `_deferred/`.

**Features:**
| Who | What they get |
|-----|----------------|
| **Roberto** | Reliable `place_id` + `googleMapsLinks` for event venues. |
| **Camila** | Cheaper, predictable Places bills on repeat queries (via MAP-005). |
| **Sofía** | Vitest proves every method sends a field mask header. |

> **Renamed from F16** (2026-05-21). **Grounding client** → [**MAP-002**](./MAP-002-grounding-attribution.md). This task is **Places only**.

## 1. Purpose

Server-side **Google Places (New)** wrapper for autocomplete, Details, Nearby — `X-Goog-FieldMask` on every call. Feeds MAP-005 proxy and Roberto venue (MAP-010).

> **MAP-018 MVP slice:** For Mindtrip grounded cards, **ship `getPlaceDetails` first** (018A = this task scoped to Details + mask registry). Text Search / Nearby / Autocomplete can follow in same PR or immediately after — do **not** block 018B on full MAP-004 scope.

## 2. Goals

- `@googlemaps/places` installed (Places SDK direct — **no** MCP SDK in this task; Grounding MCP is MAP-002 only)
- `google-places-client.ts` callable with X-Goog-FieldMask enforced
- **Do not** re-port `maps-grounding-client.ts` here if MAP-002 Done
- 1+ Vitest for Places client passes

## 3. Source files — port

| Source | Action |
|---|---|
| `lib/google-places-client.ts` + `.test.ts` | Verbatim port — Places SDK direct usage only |
| `lib/maps-grounding-client.ts` | **Do not port** — ADK sidecar is [**MAP-002**](./MAP-002-grounding-attribution.md) |
| `lib/allowedGroundingTools.ts` | **Do not port** — Grounding Lite allowlist lives in ADK service, not Places client |

**MVP path:** Mastra calls `google-places-client.ts` **server-side** directly. **MAP-005** edge proxy is post-MVP scale — not required for first Places proof.

**Patricia pre-flight:** `GOOGLE_PLACES_API_KEY` must be **IP-restricted** (or server-only), not HTTP-referrer — referrer blocks server calls ([`tasks/notes/env-maps-verification-2026-05-23.md`](../notes/env-maps-verification-2026-05-23.md)).

**Reference repos (Places only — not Grounding Lite / ADK):**

| Repo | Study |
|------|--------|
| [`github/maps/js-api-samples`](../../../github/maps/js-api-samples/) | Field masks, Nearby, Details, Autocomplete snippets |
| [`github/maps/google-maps-services-js`](../../../github/maps/google-maps-services-js/) | Server-side request shapes for MAP-005 edge (optional here) |

Grounding MCP lives in [**MAP-002**](./MAP-002-grounding-attribution.md) — do not port `maps-grounding-client.ts` here.

## 4. Workflow

1. **Install deps:**
   ```bash
   cd mdeapp && npm install @googlemaps/places@^2.4.1
   ```

2. **Pre-flight:** Maps Code Assist MCP or mde-maps — confirm field-mask paths for Text/Nearby/Details before coding.

3. **Copy files:** `google-places-client.ts` + `.test.ts` → `mdeapp/src/mastra/lib/` only.

4. **Verify env vars in `mdeapp/.env.local`:**
   - Server: `GOOGLE_PLACES_API_KEY` (Places API New — **not** `NEXT_PUBLIC_*`)
   - Browser: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` + `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` (vis.gl only)
   - **Reject:** `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` — run [**MAP-013**](./MAP-013-env-key-verification.md) if unsure
   - `SUPABASE_URL` + keys (F13) only if Places client logs via `recordMastraRun`

5. **Promote `_deferred/places-api-field-mask.mjs` hook** to active in `.claude/settings.json`.

## 5. SDK drift (Places only)

| Risk | Mitigation |
|------|------------|
| `@googlemaps/places` major version bump | Pin `^2.4.1`; re-run mask tests |
| Field mask path changes | Re-check [choose-fields](https://developers.google.com/maps/documentation/places/web-service/choose-fields) + Code Assist MCP |

## 6. Field-mask registry (PLACES-002 / 024 port)

Maintain or create `tasks/maps/places-mask-checklist.md` (seed from [`drafts/tasks/maps/places-mask-checklist.md`](../../../drafts/tasks/maps/places-mask-checklist.md)) — minimum masks per endpoint:

| Endpoint | Minimum mask (example — tighten in PR) |
|----------|----------------------------------------|
| `searchText` | `places.id,places.displayName,places.location,places.googleMapsLinks` |
| `searchNearby` | same + `places.primaryType` |
| `getPlace` | `id,displayName,formattedAddress,location,googleMapsLinks,rating,userRatingCount,priceLevel,currentOpeningHours,photos,types,editorialSummary` |
| `autocomplete` | per [Autocomplete docs](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete) |

- No `generativeSummary` unless explicitly justified for CO.
- Every call site references checklist ID **MAP-004**.

## 7. Verification checklist (100% Done gate)

> [`VERIFICATION-CHECKLIST.md`](./VERIFICATION-CHECKLIST.md) · Evidence: [`MAP-004-evidence.md`](../notes/MAP-004-evidence.md).

### Shared gates

- [ ] G1–G8 complete

### Unit

- [ ] `google-places-client.test.ts` exists — **each** public method asserts `X-Goog-FieldMask` header (mock fetch/SDK)
- [ ] No production code uses mask `*` — `rg 'FieldMask.*\\*' mdeapp/src/mastra/lib/google-places` → 0
- [ ] `tasks/maps/places-mask-checklist.md` updated (or created) with Text / Nearby / Details / Autocomplete minimums
- [ ] `places-api-field-mask.mjs` hook active in `.claude/settings.json` (promoted from `_deferred/`)
- [ ] `package.json` lists `@googlemaps/places`; **no** `@mastra/mcp` added for this task
- [ ] `maps-grounding-client.ts` **not** duplicated if MAP-002 Done

### Integration (dev key optional)

- [ ] `searchText({ query: 'rooftop bar Provenza' })` → ≥1 place (mock or live)
- [ ] Response includes `googleMapsLinks` when mask requests it

### Grep

- [ ] `rg "GOOGLE_PLACES_API_KEY|GOOGLE_MAPS_API_KEY" mdeapp/src/components` → 0

## 8. Acceptance criteria

- [ ] `google-places-client.ts` + `.test.ts` in `mdeapp/src/mastra/lib/`
- [ ] No `allowedGroundingTools.ts` / `maps-grounding-client.ts` in `mdeapp/src/mastra/lib/`
- [ ] **Skip** `maps-grounding-client.ts` if MAP-002 Done
- [ ] `@googlemaps/places` installed and pinned in lockfile
- [ ] `places-api-field-mask.mjs` hook promoted from `_deferred/`
- [ ] Field-mask checklist updated
- [ ] 2+ Vitest tests pass; `npm run floor` green

## 9. Failure points & security

| Risk | Mitigation |
|------|------------|
| Legacy Places endpoints | Use Places API **(New)** only |
| Over-broad field masks | Quota spike — enforce checklist per endpoint |
| Client bundle import | **P0** — `rg GOOGLE_PLACES mdeapp/src/components` → 0 |
| Reject rows without `place_id` | Tool + tests filter hallucinated venues |

## 10. Rollback

`git revert HEAD` removes Places client files + hook promotion. Grounding unaffected if MAP-002 shipped separately.

## 11. Restaurant discovery (ex-MAIC-011 — extend existing tool)

> **Not a new MAP file** (MAP-011 = routes). **Tourist** path on `/` via **`conciergeAgent`** + **F49**.

| Item | Detail |
|------|--------|
| Tool on disk | ✅ `mdeapp/src/mastra/tools/search-restaurants.ts` — SQL + curated fallback; optional `placeId`, `mapsUrl` |
| Gap | F49 render + map pins + strict Places enrichment when `placeId` null |
| After | **MAP-004** client + **MAP-002** for NL “best brunch near Laureles” |
| UI | `RestaurantCard` or `PlaceResultCard` + `useCopilotAction({ name: 'searchRestaurantsTool' })` per F49 |
| Cache | `restaurant_profiles` table (MAP-005 migrations) |
| Steps | 1) Text/nearby with restaurant types + Laureles bias 2) Normalize to pins `category: restaurant` 3) Cache by `place_id` 4) `is_partner: false` stub |
| Tests | `search-restaurants.test.ts` — every result has `place_id` or is dropped |
| Failure | Model invents venues — prompt + reject non-Places rows |
| Done | Live “brunch Laureles” → ≥1 card + pins + attribution |

## 12. Post-ship follow-on — `googleMapsLinks` depth (checklist §3b)

> **Status:** MAP-004 MVP is **Done** (`PLACE_DETAILS_MVP_MASK` + 018B sidecar parity). Extend masks before card CTAs ship.

**Gap (2026-05-26 audit):** Only `googleMapsLinks.placeUri` is consumed in prod. Checklist score **45/100** on link depth.

### Target mask extension

Add to **Place Details** minimum mask (TS + Python sidecar must stay in sync):

```
googleMapsLinks.placeUri,googleMapsLinks.directionsUri,googleMapsLinks.reviewsUri
```

| URI field | UI (MAP-018F follow-on) | Priority |
|-----------|-------------------------|----------|
| `placeUri` | “Open in Google Maps” | ✅ shipped |
| `directionsUri` | “Get directions” on `GroundedPlaceCard` + rental cards | **P1** |
| `reviewsUri` | “Read reviews” secondary link | **P2** |
| `writeReviewUri` | — | **Skip Phase 1** |

### Version bump (required)

1. Bump `PLACE_DETAILS_FIELD_MASK_VERSION` in `google-places-client.ts` + `places_enrich.py` (e.g. `details-v2-links-2026-05-26`).
2. Update [`places-mask-checklist.md`](./places-mask-checklist.md) registry + **018E** cache invalidation note (old rows remain valid until TTL; new version writes fresh rows).
3. Extend `EnrichedGroundedPlace` / sidecar merge to pass `directionsUrl`, `reviewsUrl` (camelCase denormalized from API).
4. Vitest: mock Details response includes all three URIs → client surfaces them.

**Depends on:** Nothing blocking — small PR after MAP-018E cache stable.

**Blocks:** MAP-018F CTA buttons — implement mask first; UI in [**MAP-019**](./MAP-019-google-maps-link-ctas.md).

## 13. Definition of Done

All §8 ACs + **§7 verification checklist** + evidence. Commit: `feat(mastra): port google-places client + field masks (MAP-004)`.

**Follow-on Done (§12):** mask bump + sidecar/TS parity + checklist updated + ≥1 Vitest for extended links.
