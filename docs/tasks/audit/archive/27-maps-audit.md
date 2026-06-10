# Maps architecture audit — mdeapp

**Date:** 2026-05-24  
**Scope:** `mdeapp/src` Google Maps + `@vis.gl/react-google-maps`  
**References:** [Google blog — React + Maps JS API](https://mapsplatform.google.com/resources/blog/streamline-the-use-of-the-maps-javascript-api-within-your-react-applications/) · [vis.gl react-google-maps](https://visgl.github.io/react-google-maps/) · [`26-audit-plan.md`](./26-audit-plan.md)

**Verdict:** Solid **MVP declarative pipeline** aligned with vis.gl philosophy. Not production-scale for dense pins, Places depth, or full camera sync. **Score: 74/100.**

---

## 1. Architecture (current)

```text
page.tsx
  MapContextProvider          ← pin SSOT (React state)
    GeoChatShell
      MapsShell / APIProvider ← JS API bootstrap (libraries: marker)
        SearchToolRenders     ← Mastra tool JSON → ToolPinsSync → mergePinsByCategory
        MapUiSync             ← pins summary → conciergeAgent working memory (debounced)
        FocusMapPinAction     ← agent frontend tool → panToPin
        ChatCanvas
          ChatMapPanel        ← desktop: ChatMap (hidden on mobile, still mounted)
          MapMobileSheet      ← mobile: second ChatMap in bottom sheet
            ChatMap
              <Map mapId>     ← uncontrolled camera (defaultCenter/defaultZoom)
              MapFocusController  ← imperative pan/zoom bridge (focusPinId)
              MapResizeSignal     ← resize on sheet open
              AdvancedMarker × N
```

**Mastra → map pipeline**

```text
conciergeAgent tool (search-rentals | search-events | search-grounded-places | …)
  → CopilotKit generative render (search-tool-renders.tsx)
  → normalizeToolOutput(category, result)
  → mergePinsByCategory (MapContext)
  → ChatMap AdvancedMarker + ChatResultsColumn + inline cards
```

**Grounding Lite path (MAP-002)**

```text
search-grounded-places → adk-grounding-client → ADK :8000 /v1/grounding/invoke
  → tool results + attribution[] → GroundingAttribution UI + grounded pins
```

---

## 2. Score /100

| Area | Weight | Score | Notes |
|------|--------|------:|-------|
| APIProvider / bootstrap | 10 | 9 | Single provider, `libraries={["marker"]}`, referrer policy, auth-failure UX |
| Declarative map + markers | 15 | 11 | `<Map>` + `<AdvancedMarker>` correct; imperative pan isolated in controller |
| MapContext / ownership | 15 | 12 | Single writer, Zod contracts, category merge — matches Google “state drives UI” |
| Card ↔ pin sync (F50) | 15 | 10 | Rental/event strong; grounded/restaurant/attraction weak |
| Viewport / camera sync | 10 | 4 | Uncontrolled map; `MapUiState.viewport` never populated |
| Grounding + attribution | 10 | 8 | ADK + quota + attribution UI; not Grounding Lite MCP in-app |
| Places API (New) | 10 | 2 | MAP-004+ not started; no client Places, no FieldMask |
| Clustering / scale | 5 | 1 | MAP-009 not started |
| Performance / rerenders | 10 | 5 | Hidden desktop map on mobile; full marker remount on pin merge |
| Mobile / overlays | 10 | 7 | Bottom sheet + resize signal good; dual map instances bad |
| **Total** | **100** | **74** | MVP-ready for ≤20 pins; refactor before W5+ density |

---

## 3. Correct vs incorrect patterns

| Pattern | Verdict | Evidence |
|---------|---------|----------|
| Single `APIProvider` wrapping map subtree | ✅ Correct | `MapProvider.tsx` → `geo-chat-shell.tsx` |
| `mapId` on every `<Map>` using AdvancedMarker | ✅ Correct | `ChatMap.tsx` — markers gated when `mapId` missing (MAP-008) |
| `libraries={["marker"]}` for AdvancedMarker | ✅ Correct | vis.gl requirement |
| Pin state in React context, not agent `setPins` | ✅ Correct | `map-context.tsx` sole writer |
| Tool output → normalize → merge by category | ✅ Correct | `normalize-tool-output.ts`, `merge-pins-by-category.ts` |
| Imperative pan in child controller via `useMap()` | ✅ Acceptable | Google blog: bridge imperative API at leaf; `MapFocusController.tsx` |
| Uncontrolled `defaultCenter` / `defaultZoom` for MVP | ✅ Acceptable | Valid vis.gl mode for “map owns interactions” |
| `panToPin` = select + focus (unidirectional events up) | ✅ Correct | Cards/rows call `panToPin`; marker click calls `setSelectedPinId` only |
| Debounced `mapUi` mirror to agent memory | ✅ Correct | `map-ui-sync.tsx` — summary only, not full `MapPin[]` |
| Hidden desktop `ChatMap` still mounted on mobile | ❌ Anti-pattern | `hidden lg:flex` panel keeps map instance alive |
| Second `ChatMap` in mobile sheet | ⚠️ Risk | Two map instances possible on same page |
| Map pin click does not call `panToPin` | ⚠️ Inconsistent | Selection sync OK; no re-center if user panned away |
| Grounded/restaurant cards without `panToPin` | ❌ Gap | Pins on map, cards not clickable for sync |
| `CATEGORY_COLORS.mock` | ❌ Dead key | `mock` is `source`, not `category` |
| Mock pin seeded but filtered only in list | ⚠️ Quirk | Map still renders `MOCK_LAYOUT_PIN` until real search |
| `MapUiState.viewport` in schema, never written | ❌ Incomplete F50 | Agent cannot reason about camera |
| No clustering at 20+ pins | ❌ Missing | MAP-009 deferred — OK for Phase 1 |
| No Places API New in `mdeapp/src` | ❌ By design | MAP-004 next — not a bug today |

---

## 4. Area-by-area review

### APIProvider

| Check | Status |
|-------|--------|
| One provider per app surface | ✅ |
| API key from env, not hardcoded | ✅ `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` |
| Missing key → graceful placeholder | ✅ `map-env-error` |
| Referrer / auth failure handling | ✅ `useMapsAuthFailure` + `MapRefererHelp` |
| `authReferrerPolicy="origin"` | ✅ |

**Fix:** Document required GCP APIs + referrers in `mdeapp/docs/ARCHITECTURE.md` (already partially in CLAUDE.md).

### Map component architecture

| Check | Status |
|-------|--------|
| Declarative `<Map>` children for markers | ✅ |
| Controlled vs uncontrolled choice documented | ⚠️ Implicit — uncontrolled only |
| `gestureHandling="greedy"` on chat layout | ✅ Mobile-friendly |
| Map ID production guard | ✅ `google-maps-map-id.ts` |

**Fix:** When agent needs “show me Laureles”, add optional **controlled** mode: `center`/`zoom` from `MapContext` + `onCameraChanged` (vis.gl [controlled map pattern](https://visgl.github.io/react-google-maps/)).

### AdvancedMarker

| Check | Status |
|-------|--------|
| Parent `<Map mapId={...}>` | ✅ |
| Markers as React children | ✅ |
| Lifecycle tied to React tree | ✅ keys = `pin.id` |
| Custom content (not default pin) | ✅ category-colored div |
| `PinElement` / collision behavior | ❌ Not used |
| Accessibility | ⚠️ `role="img"` + aria-label — OK for MVP |

### MapContext / state flow

| State | Owner | Flow |
|-------|-------|------|
| `pins[]` | `MapContextProvider` | Tools → merge; never from agent directly |
| `selectedPinId` | MapContext | Cards, rows, markers, `mapUi` mirror |
| `focusPinId` | MapContext (ephemeral) | `panToPin` / `focusMapPin` → controller → cleared |
| Camera | Google Maps internal | Not in React state |

**Unidirectional flow:** ✅ Data down (pins → markers/cards), events up (`panToPin`, `setSelectedPinId`, `focusMapPin` handler).

**Duplicate state:** `mapUi.selectedPinId` mirrors MapContext — intentional (F50), debounced, not bidirectional. **Not a bug.**

### Card ↔ pin synchronization

| Surface | Pin sync | Card click → pan | Pin click → card |
|---------|----------|------------------|------------------|
| RentalCard | ✅ | ✅ `openDetail` / `panToPin` | ✅ via `selectedPinId` |
| EventCard | ✅ | ✅ | ✅ |
| ChatResultsColumn | ✅ | ✅ `panToPin` | ✅ |
| PlaceResultCard (grounded/restaurant) | ✅ pins only | ❌ | ⚠️ marker only |
| Agent `focusMapPin` | ✅ | N/A | ✅ |

**Verified:** `smoke:f50-pin-sync`, SCREEN-005/006/007 Playwright — rental/event paths green.

### Mastra tool → map pipeline

| Tool | Normalizer category | Generative render | Pin IDs |
|------|---------------------|-------------------|---------|
| search-rentals | `rental` | `RentalResults` | `rental-${id}` (render) / `rental-${id}` (normalizer) |
| search-events | `event` | `EventResults` | `event-${id}` |
| search-grounded-places | `grounded` | `groundedRender` | `grounded-${id}` |
| search-restaurants / attractions | restaurant/attraction | `GenericResults` | `${category}-${id}` |

**ToolPinsSync dedupe:** fingerprint by sorted pin ids — prevents merge loops on CopilotKit rerenders. ✅

### Grounding Lite integration

| Layer | Status |
|-------|--------|
| Mastra tool + ADK HTTP client | ✅ Done (MAP-002) |
| Quota logging | ✅ `grounding-quota.ts` |
| Attribution UI (`translate="no"`) | ✅ `GroundingAttribution.tsx` |
| Pins from grounding results | ✅ when lat/lng present |
| In-app MCP Grounding Lite | ❌ Server-side ADK only (correct for Phase 1) |

### Clustering, Places, performance

| Topic | Status |
|-------|--------|
| `@googlemaps/markerclusterer` | ❌ Not installed (MAP-009) |
| Places API New + FieldMask | ❌ MAP-004/005 |
| Marker memoization | ❌ Inline map in `ChatMap` |
| `fitBounds` for multi-pin results | ❌ Only single-pin pan |
| Memory leaks | ✅ No orphaned listeners; effects cleaned in controllers |

---

## 5. Task verification

| Task | Claim | Disk | Verdict |
|------|-------|------|---------|
| **MAP-001** | Platform pipeline + contracts + vis.gl + AdvancedMarker | All paths exist; Vitest on merge/normalize | ✅ **Done — verified** |
| **F48** | 3-panel ChatCanvas | `chat-canvas.tsx`, nav/center/map | ✅ **Done** |
| **F49** | Generative cards → pins | `search-tool-renders.tsx`, dual tool names | ✅ **Done** |
| **F50** | MapUiState + focusPin | `map-ui-sync`, `focus-map-pin-action`, `panToPin` | ✅ **Done** (viewport partial) |
| **MAP-002** | Grounding + attribution | ADK client + UI | ✅ **Done** |
| **MAP-008** | Map ID guard | `google-maps-map-id.ts` | ✅ **Done** |
| **MAP-007B** | Center chat layout | Replaces MAP-007 | ✅ **Done** |
| **MAP-004** | Places API New | Not in src | ⏳ **Next maps task** |
| **MAP-009** | Clustering | Not started | ⏳ Post-MVP density |

---

## 6. Errors & risks

| Severity | Issue | Impact |
|----------|-------|--------|
| **P1** | Desktop `ChatMap` mounted but `hidden` on mobile | Extra Maps JS instance, memory, billing surface |
| **P1** | No clustering (MAP-009) | UI breaks down at ~30+ pins (Camila dense search) |
| **P2** | Grounded/restaurant cards don't call `panToPin` | Tourist sees pins but card click doesn't focus map |
| **P2** | `viewport` never synced to agent | Agent can't answer “zoom out” / “center on Poblado” |
| **P2** | No `fitBounds` after multi-result search | User may not see all pins without manual pan |
| **P3** | Mock pin on map before first search | Confusing “Laureles — map ready” pin in smokes |
| **P3** | Marker `onClick` skips `panToPin` | Pin selected but map may not recenter |
| **P3** | Production without Map ID → map without markers | Guard exists; deploy checklist must enforce env |

No critical **correctness** bugs found in pin merge, schema validation, or AdvancedMarker `mapId` wiring.

### Task coverage (added 2026-05-24)

| Issue | Task |
|-------|------|
| Dual map on mobile (P1) | [MAP-014](../maps/MAP-014-single-map-mobile-mount.md) |
| Place card ↔ pin gap (P2) | [MAP-015](../maps/MAP-015-place-card-pin-sync.md) |
| fitBounds (P2) | [MAP-016](../maps/MAP-016-fit-bounds-on-search.md) |
| viewport + marker panToPin (P2/P3) | [F50b](../core/F50b-map-viewport-sync.md) |
| Mock pin (P3) | [MAP-017](../maps/MAP-017-mock-pin-lifecycle.md) |
| Clustering (P1) | [MAP-009](../maps/MAP-009-marker-clustering.md) (existing) |
| Places FieldMask | [MAP-004](../maps/MAP-004-places-grounding-clients.md) (existing) |
| Map ID prod guard (P3) | MAP-008 + MAP-013 ✅ Done |

---

## 7. Recommended improvements (priority order)

| # | Fix | Task | Effort |
|---|-----|------|--------|
| 1 | Conditional map mount (mobile) | **[MAP-014](../maps/MAP-014-single-map-mobile-mount.md)** | 2h |
| 2 | PlaceResultCard / grounded `panToPin` | **[MAP-015](../maps/MAP-015-place-card-pin-sync.md)** | 1h |
| 3 | `fitBounds` after multi-pin merge | **[MAP-016](../maps/MAP-016-fit-bounds-on-search.md)** | 2h |
| 4 | Viewport sync + marker `panToPin` | **[F50b](../core/F50b-map-viewport-sync.md)** | 3h |
| 5 | Mock pin lifecycle | **[MAP-017](../maps/MAP-017-mock-pin-lifecycle.md)** | 30m |
| 6 | `MdeMapPin` extract + memo | **MAP-009** prep (no separate id) | 2h |
| 7 | MAP-004 Places + FieldMask | **[MAP-004](../maps/MAP-004-places-grounding-clients.md)** | 1d |
| 8 | MAP-009 clustering | **[MAP-009](../maps/MAP-009-marker-clustering.md)** | 1d |

---

## 8. Missing best practices (vs Google + vis.gl)

| Best practice | Source | mdeapp |
|---------------|--------|--------|
| State drives map UI (declarative) | [Google blog](https://mapsplatform.google.com/resources/blog/streamline-the-use-of-the-maps-javascript-api-within-your-react-applications/) | ✅ Pins/markers |
| Unidirectional data flow | Google blog | ✅ MapContext |
| Controlled viewport when app owns camera | vis.gl docs | ❌ |
| Copy examples for advanced features (clustering) | vis.gl philosophy | ❌ MAP-009 |
| `useMapsLibrary` for optional libs | vis.gl | ❌ Only static `libraries` prop |
| InfoWindow as declarative child | vis.gl | ❌ Not needed MVP |
| Avoid duplicate map instances | React perf | ❌ Mobile |
| FieldMask on every Places call | mdeai hard rule | ❌ MAP-004 |

---

## 9. Suggested refactors

### R1 — Single map instance (mobile)

```tsx
// chat-canvas.tsx — mount one ChatMap, move between panel vs sheet via portal/layout
const isDesktop = useMediaQuery("(min-width: 1024px)");
{isDesktop ? <ChatMapPanel><ChatMap /></ChatMapPanel> : <MapMobileSheet><ChatMap /></MapMobileSheet>}
```

Do **not** mount both simultaneously.

### R2 — `MdeMapPin` + memo

```tsx
// components/maps/mde-map-pin.tsx
export const MdeMapPin = memo(function MdeMapPin({ pin, selected, onSelect }: Props) {
  return (
    <AdvancedMarker position={{ lat: pin.lat, lng: pin.lng }} onClick={() => onSelect(pin.id)}>
      …
    </AdvancedMarker>
  );
});
```

### R3 — `MapCameraController` (controlled hybrid)

```tsx
// Optional: center/zoom in MapContext; onCameraChanged updates context;
// MapFocusController sets center instead of map.panTo when controlled mode on
```

Matches Google blog “properties from application state + map handles gestures.”

### R4 — Post-merge bounds

```tsx
// After mergePinsByCategory in ToolPinsSync effect:
if (pins.length > 1) requestFitBounds(pins.map(p => ({ lat: p.lat, lng: p.lng })));
```

Use vis.gl example / `useMap` + `LatLngBounds`.

---

## 10. Performance recommendations

| Issue | Recommendation |
|-------|----------------|
| Full `pins.map` on every context change | Memoize marker list; split `selectedPinId` into pin component |
| Hidden desktop map on mobile | Conditional render (highest ROI) |
| Two ChatMaps | One instance |
| No clustering | MAP-009 before enabling “show all Laureles rentals” |
| `MapUiSync` on every pin change | Already debounced 300ms — keep; avoid pushing full pin arrays to agent |
| AdvancedMarker count in smokes | 6 pins OK; test clustering at 50+ in W5 |

---

## 11. Future implementation strategy

| Phase | Maps work | Persona |
|-------|-----------|---------|
| **Now (W1–W2)** | MAP-004 Places New (server proxy + FieldMask); fix mobile single-map | Sofía |
| **W3–W4** | MAP-009 clustering; `fitBounds`; Roberto event pins on `/host/event/new` | Roberto |
| **W5–W6** | Viewport in agent memory; InfoWindow on marker; `/rentals` full page (F41) | Camila |
| **W6+** | MAP-011 routes; deck.gl only if 3D/heatmap needed | Tourist |

**Do not:** revert to `@react-google-maps/api` wrapper; mix imperative `new google.maps.Map` outside vis.gl; store full `MapPin[]` in Mastra working memory.

**Do:** keep MAP-001 pipeline as the only pin ingress; extend with Places enrichment (MAP-004) and clustering (MAP-009) without forking state.

---

## 12. Quick reference — key files

| File | Role |
|------|------|
| `components/maps/ChatMap.tsx` | Map + AdvancedMarker render |
| `components/maps/MapProvider.tsx` | APIProvider |
| `components/maps/MapFocusController.tsx` | Imperative pan/zoom |
| `platform/maps/map-context.tsx` | Pin SSOT |
| `platform/maps/normalize-tool-output.ts` | Tool JSON → MapPin |
| `platform/maps/merge-pins-by-category.ts` | Category-safe merge |
| `components/copilot/search-tool-renders.tsx` | CopilotKit ↔ pins |
| `components/copilot/map-ui-sync.tsx` | F50 agent mirror |
| `components/copilot/focus-map-pin-action.tsx` | Agent pan tool |
| `mastra/lib/adk-grounding-client.ts` | Grounding Lite HTTP |

---

## 13. Alignment with `26-audit-plan.md`

- **Trust MAP-001 / F48–F50 Done** — smokes + Playwright confirm pin/card sync for rentals/events.
- **Do not mark MAP-004+ Done** without Places FieldMask proof.
- **Next maps work:** MAP-004 (Places), then **MAP-014–017 + F50b** (audit 27 gaps), then MAP-009 before dense rental UX.
- **Screen-first track unchanged:** SCREEN-010 (map panel polish) depends on MAP-001 ✅ — can proceed after SCREEN-014.

---

**Bottom line:** Architecture matches [vis.gl declarative model](https://visgl.github.io/react-google-maps/) and [Google’s React guidance](https://mapsplatform.google.com/resources/blog/streamline-the-use-of-the-maps-javascript-api-within-your-react-applications/) for Phase 1. Fix mobile dual-map mount and incomplete card sync before scaling pin density or shipping MAP-004 Places enrichment.
