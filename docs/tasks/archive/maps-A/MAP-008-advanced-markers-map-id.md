---
id: MAP-008
title: Production Map ID + AdvancedMarker chrome
status: Done
priority: P1
phase: MVP-hardening — before Vercel production (can run after MAP-002)
effort: 4-6h
owner: claude
depends_on: [MAP-001]
blocks: [MAP-009]
skill: [mde-maps, mde-vercel, shadcn, testing]
prd_ref: ../../../plan/maps/maps-prd.md §8 step 8
draft_sources:
  - ../../../drafts/tasks/mastra/maps/tasks/markers/068-mastra-production-map-id.md
  - ../../../drafts/tasks/mastra/maps/plans/05-markers-plan.md
  - ../../../github/maps/react-google-maps/website/src/examples/advanced-marker.mdx
verified_docs:
  - https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over
---

# MAP-008 — Advanced markers + Map ID

## At a glance

**Description:** Upgrade pins from “proof marker” to **production markers** — real **Map ID**, price badges, selected state, and accessibility.

**Purpose:** MAP-001 may use `DEMO_MAP_ID` in dev; **Vercel prod** breaks without `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`. **Camila** needs price pills on rental pins; **Roberto** needs clear venue markers.

**Goals:**
- `getGoogleMapsMapId()` — fail loud in production if Map ID missing.
- `MdeMarker` with category colors, selection ring, valid lat/lng filter.
- InfoWindow / click behavior without duplicate loaders.
- Hook + Vitest for env branches; Vercel env documented.

**Features:**
| Who | What they get |
|-----|----------------|
| **Camila** | Rental pins show price and highlight when selected. |
| **Roberto** | Venue pins look distinct from rental pins. |
| **Sofía** | Prod deploy cannot silently fall back to demo map. |

> **MAP-001** proves one `<AdvancedMarker>`; **MAP-008** is production-grade pins for **Camila** (price badges) and **Roberto** (venue pins).  
> **Draft port:** MASTRA-068, MARKERS-002–006, [`05-markers-plan`](../../../drafts/tasks/mastra/maps/plans/05-markers-plan.md).  
> **Env:** `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` (not legacy `VITE_*`).

## 1. Purpose

`AdvancedMarker` requires a **real Map ID** in production (`DEMO_MAP_ID` is dev-only). Ship `getGoogleMapsMapId()`, category-colored pin DOM (`pinContent.ts`), selected-state ring, a11y, and Vercel env wiring — without regressing MAP-001 vis.gl shell.

## 2. Goals

**Components (ex-MAIC-004 — category chrome beyond MAP-001 proof marker):**

| Path | Role |
|------|------|
| `mdeapp/src/components/maps/CategoryMarker.tsx` | Category icon/color per `MapPinCategory` |
| `mdeapp/src/components/maps/PinPopover.tsx` | Click summary (or vis.gl `InfoWindow`) |
| `mdeapp/src/components/maps/ChatMap.tsx` | Render pin layer via `MdeMarker` / `CategoryMarker` |

- `aria-label` on marker content from pin `title`
- Selected state syncs with `MapContext.selectedPinId` and **F50** `focusMapPin`
- Too many markers without clustering → perf risk — defer **MAP-009**

- `mdeapp/src/lib/google-maps-map-id.ts` — `getGoogleMapsMapId()`:
  - Production: `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` required; `undefined` + `console.error` if missing (never silent `DEMO_MAP_ID`)
  - Dev/test: `DEMO_MAP_ID` + `console.warn`
- `mdeapp/src/components/maps/MdeMarker.tsx` — `<AdvancedMarker>` + `buildPinContent(pin)` (price, category color, `role="button"`)
- Filter pins: `Number.isFinite(lat) && Number.isFinite(lng)` before render
- `gmp-click` → single reused InfoWindow / vis.gl `<InfoWindow>` pattern
- Promote hook `advanced-marker-needs-mapid.mjs` from `_deferred/` in `.claude/settings.json`
- Vitest: ≥15 tests for env branches (port from legacy `google-maps-map-id.test.ts`)
- Playwright attribute: `data-mapid-present="true"` on map root when env set

## 3. Strategy (four layers — from draft 05-markers-plan)

| Layer | Question | Owner |
|-------|----------|-------|
| Data | Numeric lat/lng + stable IDs? | Tool output / Supabase listings |
| State | Pins in MapContext? | MAP-001 pipeline |
| Runtime | Map ID + APIProvider? | This task |
| Render | AdvancedMarker + click? | `MdeMarker`, MAP-009 cluster |

## 4. Workflows

1. Create GCP Map ID (human) — style linked to Advanced Markers; restrict browser key HTTP referrers (`localhost:3001`, preview, prod domain).
2. Implement `getGoogleMapsMapId()` + tests.
3. Replace MAP-001 placeholder marker with `MdeMarker` + `pinContent.ts` (category → color per `MapPinCategory`).
4. Selected pin: sync `selectedPinId` from MapContext → highlight ring.
5. `fitBounds` when pin set changes (reuse MAP-001 `useFitBounds` / vis.gl `useMap()`).
6. Vercel: set `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` on preview + production.
7. Evidence: screenshot Laureles search with ≥5 price-labeled pins.

## 5. Acceptance criteria

1. `rg 'DEMO_MAP_ID' mdeapp/src` — only inside `getGoogleMapsMapId` dev branch.
2. `rg "new google.maps.marker.AdvancedMarkerElement" mdeapp/src` → **0** (vis.gl JSX only).
3. Every `<Map>` has `mapId={getGoogleMapsMapId()}`.
4. Vitest env matrix passes.
5. `npm run floor` green.
6. Preview deploy shows markers (not blank map).

## 6. Verification checklist (100% Done gate)

> [`VERIFICATION-CHECKLIST.md`](./VERIFICATION-CHECKLIST.md) · Evidence: [`MAP-008-evidence.md`](../notes/MAP-008-evidence.md).

### Shared gates

- [ ] G1–G8 complete

### Unit

- [ ] `google-maps-map-id.test.ts` — prod missing env → error path; dev → `DEMO_MAP_ID` + warn
- [ ] `npm test -- google-maps-map-id` exit 0

### Grep / structure

- [ ] `rg 'DEMO_MAP_ID' mdeapp/src` — only inside `getGoogleMapsMapId` dev branch
- [ ] `rg "new google.maps.marker.AdvancedMarkerElement" mdeapp/src` → 0
- [ ] Every `<Map` has `mapId={getGoogleMapsMapId()}`
- [ ] `advanced-marker-needs-mapid.mjs` hook active

### Visual / deploy

- [ ] Invalid lat/lng pins filtered — no marker throw
- [ ] Selected pin ring follows `selectedPinId`
- [ ] Vercel preview: `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` set — markers visible (screenshot)
- [ ] `data-mapid-present="true"` on map root when env set (Playwright or DOM check)

## 7. Rollback

Revert to MAP-001 minimal marker; remove Map ID env on Vercel.

## 8. Out of scope

- Clustering (**MAP-009**)
- Custom ECL `gmpx-*` web components (draft features/12)
- Server pin emission changes

## 9. Definition of Done

§5 acceptance + **§6 verification checklist** + preview screenshot. Commit: `feat(maps): production Map ID + MdeMarker chrome (MAP-008)`.
