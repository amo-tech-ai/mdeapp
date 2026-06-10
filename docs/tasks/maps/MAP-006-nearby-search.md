---
id: MAP-006
title: Nearby Search + Show nearby on RentalCard
status: Not Started
priority: P1
phase: Post-MVP — Camila cross-sell
effort: 3-4h
owner: claude
depends_on: [MAP-005, F46]
blocks: [MAP-012]
skill: [mde-maps, mastra, copilotkit-develop, testing]
prd_ref: ../../plan/maps/maps-prd.md §8 step 6
draft_sources:
  - ../../drafts/tasks/mastra/maps/tasks/places/026-place-nearby-rental.md
verified_docs:
  - https://developers.google.com/maps/documentation/places/web-service/nearby-search
  - https://developers.google.com/maps/documentation/places/web-service/place-types
verified_against:
  - /home/sk/mdeai/github/maps/js-api-samples/
  - /home/sk/mdeai/mdeapp/src/mastra/lib/google-places-client.ts
---

# MAP-006 — Nearby Search (New)

## At a glance

**Description:** Add a **“Show nearby”** button on rental cards that drops café/gym pins around the listing — without removing the rental pins already on the map.

**Purpose:** **Camila** compares apartments by what’s walkable (coffee, coworking, transit). That needs Places **Nearby Search** with a tight radius and type list, not a new chat turn.

**Goals:**
- Mastra tool `searchNearbyPlaces` (max 5 results, default 800 m radius).
- Calls go through MAP-005 proxy + field masks from MAP-004.
- Merge into `MapContext` under a separate category; rentals/events stay visible.
- Google attribution on nearby results; Playwright proves pin count increases.

**Features:**
| Who | What they get |
|-----|----------------|
| **Camila** | Tap **Show nearby** on a Laureles card → extra pins on the map. |
| **Roberto** | Optional same pattern on event cards (later). |

> **Draft port:** PLACES-016.  
> **Real-world:** **Camila** clicks **Show nearby** on a Laureles rental card → up to 5 café/coworking pins within **800m** without wiping rental pins.

## 1. Purpose

Ship a Mastra tool (or edge-backed action) wrapping `places:searchNearby` with strict `locationRestriction`, `includedTypes`, `maxResultCount`, and audited `X-Goog-FieldMask`. UI CTA on rental/event cards merges results into MAP-001 pin pipeline under a distinct category (e.g. `nearby` / `restaurant`).

## 2. Goals

- Tool `searchNearbyPlaces` — input: `lat`, `lng`, `radiusMeters` (default 800, max 1500), `includedTypes[]`, `maxResultCount` (cap 5)
- Uses MAP-005 `places-proxy` for Google call + cache
- Each result includes `googleMapsLinks.placeUri` — **never** synthesize URLs
- `GroundingAttribution` when list is Google-sourced (same as MAP-002 component)
- `mergePinsByCategory` — does not clear `rental` / `event` pins
- `useCopilotAction` mirror for generative UI on `/` and `/rentals` when F46 card ships
- Vitest: Zod output + mocked Places client

## 3. Features

| Persona | Journey |
|---------|---------|
| **Camila** | Rental card → “Show nearby” → map adds gym/café pins; tap pin → card highlight. |
| **Roberto** | Optional same CTA on event venue card (post-MVP). |

## 4. Workflows

1. Define minimum field mask for Nearby (from MAP-004 checklist): `places.id`, `places.displayName`, `places.location`, `places.googleMapsLinks`, `places.primaryType`.
2. Implement tool calling `places-proxy` with `searchNearby` route.
3. Add CTA to rental card component (F46 dependency — coordinate file path at implement time).
4. Wire `OPEN_NEARBY_RESULTS` or extend existing action enum in `platform/contracts`.
5. Playwright smoke (**required**): click CTA → pin count increases; rental pins remain.

## 5. Acceptance criteria

1. Default radius 800m; max results 5 — documented in tool schema.
2. Invalid coords → empty result, no throw to user.
3. Rental pins remain after nearby merge.
4. Attribution on nearby result list/cards.
5. `npm run floor` green.

## 6. Verification checklist (100% Done gate)

> [`VERIFICATION-CHECKLIST.md`](./VERIFICATION-CHECKLIST.md) · Evidence: [`MAP-006-evidence.md`](../notes/MAP-006-evidence.md).  
> Requires **MAP-005** + **F46** rental cards.

### Shared gates

- [ ] G1–G8 complete

### Unit

- [ ] `searchNearbyPlaces` tool Vitest — Zod output; max 5 results; radius default 800m
- [ ] Invalid lat/lng → empty result (no throw)
- [ ] `includedTypes` only from allowlist (Table A types per Google docs)

### Integration

- [ ] Tool calls `places-proxy` `searchNearby` — not browser Places SDK
- [ ] Each result has `googleMapsLinks` from API — `rg "google.com/maps/search" mdeapp/src` hand-built URLs → 0 in tool path
- [ ] `mergePinsByCategory` — rental pins remain after nearby merge

### Playwright (**required**)

- [ ] On `/` or `/rentals` with F46 card: click **Show nearby** → `[data-testid="map-pin"]` count increases
- [ ] `GroundingAttribution` or Places attribution on nearby list

## 7. Rollback

Unregister tool; hide CTA behind feature flag `NEXT_PUBLIC_NEARBY_PLACES=0`.

## 8. Lifestyle enrichment (ex-MAIC-010 — extends MAP-006)

> **Post-MVP** depth on **Camila**’s `/rentals` cards — not required for MAP-006 “Show nearby” CTA Done. Depends **MAP-005** + **F46** + `rental_nearby_context` table (**migration in MAP-006**, not MAP-005).

| Item | Path / rule |
|------|-------------|
| Tool | `mdeapp/src/mastra/tools/rental-nearby-context.ts` — input `listing_id` or `lat/lng` + radius |
| Scoring | `mdeapp/src/mastra/lib/lifestyle-score.ts` (heuristic remote-work + lifestyle; document formula in Vitest) |
| UI | Nearby section on `RentalCard` (F46); amenity pins `category` distinct from rental (MAP-008 colors) |
| Cache | `rental_nearby_context` Supabase table — add migration in this task (RLS + TTL) |
| Categories | Parallel masked Nearby calls: café, coworking, gym, grocery, nightlife, transit |
| Anti-hallucination | **Places-only** amenities — no invented venues |
| Cost | **Medium** — 6+ Nearby calls per listing; cache mandatory |
| Security | Listing address PII — respect RLS on rentals/apartments |
| Done demo | One real listing on `/rentals` + cached row + map pins; evidence cites F46 if separate |

## 9. Out of scope

- Grounding Lite `search_places` (MAP-002)
- Turn-by-turn routes (MAP-011)
- Spatial neighborhood rollups (MAP-012) — curated compare is MAP-012, not this tool

## 10. Definition of Done

**§6 verification checklist** complete + evidence. Commit: `feat(maps): nearby search tool + rental CTA (MAP-006)`.
