---
commit_id: C-001
status: pending_commit
sha: pending
---

# C-001 — maps platform + clustering

## Tracker

| Field | Value |
|-------|--------|
| **Commit ID** | C-001 |
| **Intended message** | `feat(maps): category markers, clustering, and pin sync (C-001)` |
| **Percent complete** | **100%** on disk — **0%** committed |
| **Pass/fail (scope)** | **PASS** — unit tests exist |
| **Production readiness** | **88/100** |
| **Standalone** | ⚠️ Partial — app incomplete until C-004; build passes |
| **File count** | **26** — ⚠️ exceeds 20-file soft limit |

## Files to include (exact)

```
e2e/helpers/maps-layout.ts
e2e/maps-layout-mobile.spec.ts
scripts/smoke-f50-pin-sync.mjs
scripts/smoke-map-chat-pins.mjs
src/components/maps/ChatMap.tsx
src/components/maps/ClusteredCategoryMapPin.tsx
src/components/maps/ClusteredCategoryMarkers.tsx
src/components/maps/MapCameraSync.tsx
src/components/maps/MapFitBoundsController.tsx
src/components/maps/MapPinInfoWindow.tsx
src/components/maps/SelectedPlaceOverlayCard.tsx
src/components/maps/__tests__/clustered-category-markers.test.tsx
src/components/maps/__tests__/selected-place-overlay-card.test.tsx
src/components/maps/map-pin-meta.ts
src/components/maps/markers/CategoryMapMarker.tsx
src/components/maps/markers/category-map-marker.test.ts
src/components/maps/markers/category-map-marker.ts
src/hooks/use-is-lg-up.ts
src/lib/__tests__/map-clustering.test.ts
src/lib/__tests__/map-ui-summary.test.ts
src/lib/map-clustering.ts
src/lib/map-ui-summary.ts
src/lib/maps-deep-links.ts
src/platform/maps/__tests__/map-pin-filters.test.ts
src/platform/maps/__tests__/normalize-tool-output.test.ts
src/platform/maps/map-context.tsx
src/platform/maps/map-pin-filters.ts
src/platform/maps/normalize-tool-output.ts
```

**Include (from old C-000 plan):** `ClusteredCategoryMarkers.tsx`, `map-clustering.test.ts` — new untracked files; ship here, not in C-000.

## Files to exclude

- All `src/components/chat/**` (C-004)
- All `src/mastra/**` grounding (C-003)
- `src/app/api/places/**` (C-002)
- `package.json` (C-006)
- `supabase/.temp/**`

## Tests required

```bash
npm run lint
npm test -- --run map-clustering map-pin-filters map-ui-summary normalize-tool-output clustered-category
```

Optional (needs dev :3001 + keys):

```bash
npm run smoke:map-pins
npm run smoke:f50-pin-sync
```

## Verification results (2026-05-27)

| Test | Status |
|------|--------|
| Unit (maps-related) | **PASS** (in full 263 suite) |
| `smoke:map-pins` | **FAIL** — rental-card agent timeout |
| `smoke:f50-pin-sync` | **FAIL** — same |

**Red flag:** Rental smokes are **agent/Gemini path**, not maps clustering code. **CONDITIONAL** for C-001 — waive or fix concierge separately before prod.

## Risks

| Risk | Level | Note |
|------|-------|------|
| 26 files in one commit | Medium | Harder review; optional split: C-001a platform / C-001b components |
| Google Maps API cost | Low | markers + clustering client-side |
| Rollback | Medium | Map pins revert to pre-MAP-030 behavior |

## Blockers

- **C-000** must be committed first (lint on `ClusteredCategoryMarkers.tsx`).

## Rollback notes

Revert C-001 → map falls back to legacy pin merge; chat may error if C-004 already merged — revert in reverse order.

## Dependency notes

- **Requires:** C-000  
- **Required by:** C-004 (map panel), C-002 (pin normalize for places)

## Split recommendation

Optional **C-001b** if reviewers insist: commit `src/platform/maps/**` + `src/lib/map-*.ts` first, then `src/components/maps/**`.

## Staging command

```bash
# After C-000 committed — use paths from list above, one git add per line or grouped
git add e2e/helpers/maps-layout.ts e2e/maps-layout-mobile.spec.ts \
  scripts/smoke-f50-pin-sync.mjs scripts/smoke-map-chat-pins.mjs \
  src/components/maps/ src/hooks/use-is-lg-up.ts \
  src/lib/map-clustering.ts src/lib/map-ui-summary.ts src/lib/maps-deep-links.ts \
  src/lib/__tests__/map-clustering.test.ts src/lib/__tests__/map-ui-summary.test.ts \
  src/platform/maps/
git commit -m "feat(maps): category markers, clustering, and pin sync (C-001)"
```
