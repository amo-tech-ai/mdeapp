---
id: MAP-019
title: Google Maps deep-link CTAs on place cards
status: Done
priority: P1
phase: Post-MVP polish
effort: 2h
owner: claude
depends_on: [MAP-018F, MAP-018C, MAP-004]
blocks: []
skill: [mde-maps, copilotkit-develop, shadcn, testing]
checklist_ref: ../../maps-checklist.md §3b #1 + #9
prd_ref: ../../../plan/maps/maps-prd.md
parent_track: MAP-018
related_amendments:
  - ./MAP-004-places-grounding-clients.md#12-post-ship-follow-on--googlemapslinks-depth-checklist-3b
  - ./MAP-018B-sidecar-places-enrichment.md
target_files:
  - /home/sk/mdeai/mdeapp/src/components/copilot/grounded-place-card.tsx
  - /home/sk/mdeai/mdeapp/src/mastra/lib/google-places-client.ts
  - /home/sk/mdeai/services/adk-grounding/places_enrich.py
  - /home/sk/mdeai/mdeapp/src/lib/types.ts
  - /home/sk/mdeai/mdeapp/e2e/maps-grounding.spec.ts
---

# MAP-019 — Google Maps deep-link CTAs

## At a glance

**Description:** Replace a single generic “Open in Maps” link with **Mindtrip-style action buttons** — **Directions**, **Reviews**, **Open in Maps** — on grounded place cards (and rental cards when enriched).

**Purpose:** **Camila** and **Tourist** get a **real travel-app** feel, not a prototype with one blue link. Small task, huge polish impact.

| Who | Effect |
|-----|--------|
| **Camila** | One tap to directions from a rental or café card |
| **Tourist** | “Read reviews” without hunting inside Maps |
| **Sofía** | Playwright asserts CTAs when URIs present; hidden when null |

> **Not a new API.** Uses existing Places **`googleMapsLinks`** URIs from Details — mask extension per [**MAP-004 §12**](./MAP-004-places-grounding-clients.md#12-post-ship-follow-on--googlemapslinks-depth-checklist-3b) + [**018B**](./MAP-018B-sidecar-places-enrichment.md) sidecar parity.

## Prerequisites (same PR or immediately before)

1. Bump Details field mask to request:
   ```
   googleMapsLinks.placeUri,googleMapsLinks.directionsUri,googleMapsLinks.reviewsUri
   ```
2. Bump `PLACE_DETAILS_FIELD_MASK_VERSION` (TS + Python + 018E cache key).
3. Propagate `directionsUrl`, `reviewsUrl`, `mapsUrl` through **018C** schema + sidecar merge.

**Do not** hand-build URLs from lat/lng.

## UI spec

| Button | Prop | When shown | Label (English Phase 1) |
|--------|------|------------|-------------------------|
| Primary | `mapsUrl` | Always when enriched | **Open in Google Maps** |
| Secondary | `directionsUrl` | When API returns URI | **Directions** |
| Tertiary | `reviewsUrl` | When API returns URI | **Reviews** |

**Layout:** Icon row or stacked buttons below rating line — match Paisa tokens (F07 when landed). Mobile: ≥44px tap targets.

**Rules:**

- `rel="noopener noreferrer"` on all external links.
- `translate="no"` on Google-branded labels (ToS).
- Hide button when prop is null — no fallback URL construction.
- **Skip Phase 1:** `writeReviewUri`, embed iframes.

## Files to modify

| File | Change |
|------|--------|
| `grounded-place-card.tsx` | CTA button row + testids |
| `search-tool-renders.tsx` | Pass new props from tool output |
| `018C` schema types | `directionsUrl?`, `reviewsUrl?` if not already |
| `places_enrich.py` / `google-places-client.ts` | Mask + denormalized URLs (if §12 not done) |
| `grounded-place-card.test.tsx` | Renders/hides CTAs per props |
| `maps-grounding.spec.ts` | `data-testid="grounded-directions-link"` when fixture has URI |

## Acceptance criteria

1. Enriched café query → ≥1 card with **Directions** when Google returns `directionsUri`.
2. **Open in Google Maps** still works via `placeUri`.
3. Card with missing `directionsUri` → no Directions button (not broken link).
4. No `GOOGLE_PLACES_API_KEY` in client bundle.
5. `npm run floor` green; Playwright maps spec green.

## Verification checklist

> Evidence: `tasks/notes/MAP-019-evidence.md`

- [ ] Mask version bumped + [`places-mask-checklist.md`](./places-mask-checklist.md) updated
- [ ] Sidecar + TS client masks match
- [ ] Vitest: 3 CTAs render / hide correctly
- [ ] Playwright: directions link on enriched turn (or mocked)
- [ ] localhost screenshot: Mindtrip-style button row

## Out of scope

- Nearby Search (“places near this one”) — **MAP-006**
- Share-sheet native OS sharing — Phase 2
- Roberto event venue cards — reuse component when F34 ships; not required for Done

## Rollback

Feature flag `NEXT_PUBLIC_MAPS_DEEP_LINKS=false` → single “Open in Maps” link (018F behavior).

## Definition of Done

§ acceptance + verification + evidence. Commit: `feat(maps): Google Maps deep-link CTAs on grounded cards (MAP-019)`.
