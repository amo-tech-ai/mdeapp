---
id: F50b
title: MapUiState viewport sync — onCameraChanged → agent memory
status: Done
priority: P2
phase: MVP-hardening
effort: 3h
owner: claude
depends_on: [F50, MAP-001]
blocks: [SCREEN-003]
skill: [copilotkit-integrations, mde-maps, testing]
audit_ref: ../audit/27-maps-audit.md §6 P2
companion_tasks: [F50]
prd_ref: ../../plan/prd/07-contracts-schemas.md
---

# F50b — Map viewport sync (F50 completion)

## At a glance

**Problem:** `MapUiStateSchema.viewport` exists and F50 spec mentions it, but **`map-ui-sync.tsx`** never writes `viewport`. Agent cannot answer *"zoom out"* / *"center on Poblado"* with camera context. [SCREEN-003](SCREEN-003-chat-query-bar.md) "Near map" chip depends on `mapUi.viewport`.

**Goal:** Debounced camera mirror: map pan/zoom → `mapUi.viewport` in concierge working memory. Keep **uncontrolled** map for gestures; read-only sync out (vis.gl [controlled hybrid](https://visgl.github.io/react-google-maps/)).

| Who | Effect |
|-----|--------|
| **Camila** | Follow-up "show what's on my map" uses real center/zoom |
| **Tourist** | Concierge can reason about visible area after grounding search |

## Build scope

### Frontend
- **`MapCameraSync.tsx`** (new) — inside `<Map>`; `useMap()` + `onCameraChanged` (or idle listener) → debounce 300ms → callback to parent/context.
- **`map-ui-sync.tsx`** — include `viewport: { lat, lng, zoom }` in `buildMapUiSummary` payload.
- **`concierge.ts`** — confirm working memory `mapUi` schema already allows viewport (no full pin arrays).

### Do not
- Store full `MapPin[]` in agent memory.
- Force controlled `center`/`zoom` on `<Map>` in Phase 1 (read sync only).
- Block `MapFocusController` imperative pan.

## Acceptance criteria

1. Pan/zoom map manually → within 500ms `mapUi.viewport` in co-agent state reflects center + zoom (DevTools or temporary debug).
2. `focusMapPin` / card click still works; viewport updates after pan settles.
3. Vitest: `buildMapUiSummary` includes viewport when passed.
4. `npm run smoke:f50-pin-sync` pass.
5. `npm run floor` exit 0.
6. `ChatMap` marker click calls `panToPin` (not only `setSelectedPinId`) so map recenters when user taps pin after panning away.

## Verification

- Evidence: `tasks/notes/F50b-evidence.md`
- Optional: extend SCREEN-003 Playwright when "Near map" chip wired

## Definition of Done

§4 acceptance + evidence. Complements F50 Done gate for viewport slice only — do not revert F50 status.

## Out of scope

- Agent-initiated viewport commands (frontend tool `setMapViewport`) — Phase 2
- Persist viewport across page reload
