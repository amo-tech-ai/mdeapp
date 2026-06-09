---
id: MAP-009
title: Marker clustering for dense rental/event pins
status: Done
priority: P2
phase: Post-MVP
effort: 2-3h
owner: claude
depends_on: [MAP-008]
blocks: []
skill: [mde-maps, testing]
prd_ref: ../../../plan/maps/maps-prd.md §8 step 9
draft_sources:
  - ../../../drafts/tasks/mastra/maps/plans/05-markers-plan.md (Phase D5–D6)
  - ../../../github/maps/codelab-maps-platform-101-react-js/solution/
  - ../../../github/maps/react-google-maps/website/src/examples/marker-clustering.mdx
  - ../../../github/maps/js-markerclusterer/
verified_against:
  - /home/sk/mdeai/github/maps/codelab-maps-platform-101-react-js/solution/
  - /home/sk/mdeai/github/maps/react-google-maps/website/src/examples/marker-clustering.mdx
  - /home/sk/mdeai/github/maps/js-markerclusterer/
---

# MAP-009 — Marker clustering

## At a glance

**Description:** When many pins overlap (e.g. 20+ rentals in El Poblado), **group them into clusters** that expand as **Camila** zooms in.

**Purpose:** Dense neighborhoods otherwise show unreadable stacked price pills. Clustering keeps the map truthful (“25 results”) without visual chaos.

**Goals:**
- Add `@googlemaps/markerclusterer` integrated with vis.gl `useMap()`.
- Fix marker-vs-clusterer init order so pins are never dropped.
- Paisa-themed cluster styling; `fitBounds` respects clusters.
- Evidence screenshot: clusters at city zoom, individuals when zoomed in.

**Features:**
| Who | What they get |
|-----|----------------|
| **Camila** | Zoom out → see counts; zoom in → pick a listing. |
| **Lucía** | Map pin count matches search result count (no race). |

> **Real-world:** 25 rental pins in El Poblado → clusters at zoom 12; expand on zoom in; **Camila** still sees count badge matching search results.

## 1. Purpose

Dense Medellín neighborhoods (Laureles, Provenza) need `@googlemaps/markerclusterer` on top of vis.gl `AdvancedMarker` — avoid overlapping price pills and “badge says N but map shows 0” races.

## 2. Goals

- `npm install @googlemaps/markerclusterer` in `mdeapp`
- `mdeapp/src/components/maps/MdeMarkerCluster.tsx` — uses `useMap()` from `@vis.gl/react-google-maps`
- **Pending marker queue** until clusterer instance exists (fix effect-order: markers before clusterer → never added)
- Cluster renderer matches Paisa teal/neutral tokens (not default blue only)
- `fitBounds` respects clustered bounds
- Screenshot evidence: 20+ pins → visible clusters; zoom in → individuals

## 3. Workflows

1. Read codelab solution + vis.gl `marker-clustering.mdx` example.
2. After `useMap()` ready, create `MarkerClusterer` with custom `renderer` if needed.
3. On `pins` change: clear clusterer markers, re-add from `Number.isFinite` positions only.
4. Wire on `/` map panel and `/rentals` map view (when F41 ships).
5. Vitest: mock map + assert clusterer `addMarkers` called with correct count (light mock).

## 4. Acceptance criteria

1. 50-pin fixture clusters at default zoom without console errors.
2. Pin count in UI header matches finite-coordinate pin count.
3. Click cluster zooms or spiderfies per library default (document behavior).
4. `npm run floor` green.
5. No duplicate marker DOM nodes after HMR (manual note in evidence).

## 5. Verification checklist (100% Done gate)

> [`VERIFICATION-CHECKLIST.md`](./VERIFICATION-CHECKLIST.md) · Evidence: [`MAP-009-evidence.md`](../notes/MAP-009-evidence.md).

### Shared gates

- [ ] G1–G8 complete

### Unit

- [ ] `MdeMarkerCluster.test.tsx` (or equivalent) — mock `useMap`; `MarkerClusterer.addMarkers` called with N pins after update
- [ ] Pending-queue test: pins set before clusterer init still render after init

### Manual / visual

- [ ] 20+ pin fixture (Laureles search or seed) → clusters at ~zoom 12
- [ ] Zoom in → individual `AdvancedMarker` visible
- [ ] UI result count matches finite-coordinate pin count (no “25 results, 0 markers”)
- [ ] Screenshot in evidence (cluster + expanded)

### Integration

- [ ] `/` map panel and `/rentals` (when F41 map exists) both cluster without duplicate DOM after HMR (note in evidence)

## 6. Rollback

Feature flag `NEXT_PUBLIC_MAP_CLUSTERING=0` → render flat `MdeMarker` list.

## 7. Out of scope

- Server-side clustering
- 3D markers / WebGL overlay

## 8. Definition of Done

§4 acceptance + **§5 verification checklist** + cluster screenshots. Commit: `feat(maps): marker clustering on chat map (MAP-009)`.
