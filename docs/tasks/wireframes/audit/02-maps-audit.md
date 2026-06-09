---
title: Google Maps + responsive forensic audit
date: 2026-06-02
auditor: claude (forensic pass)
prompt: ./02-maps-prompt.md
prod_sha: bf40ef9
prod_url: https://www.mdeai.co
skills: [mde-maps, responsive-design, tailwind-responsive-ui]
verified: disk + grep + e2e inventory + MCP Code Assist instructions
---

# MDEAI — Google Maps & Mobile Responsive Audit

**Scope:** `mdeapp/src/components/maps/**`, `platform/maps/**`, Places proxy routes, Mastra grounding, `/chat` layout (MAP-007B), Playwright map specs.  
**Method:** Forensic disk read — no assumptions. Production gate referenced @ **`bf40ef9`** (Vercel = `origin/main`, `GET /` 200).

---

## 1. Executive summary

The maps stack is **architecturally sound for Phase 1 MVP**: `@vis.gl/react-google-maps` + `APIProvider`, `AdvancedMarker` + `mapId`, server-side Places (New) with field masks, ADK grounding with Supabase quota/fallback, and Mindtrip-style mobile bottom sheet (MAP-007). Desktop three-column layout and core Playwright proofs exist.

**Not production-signed for mobile-at-scale** yet. Critical gaps: **(1)** hidden desktop `ChatMap` still mounts on mobile viewports (double Maps JS instance when sheet opens), **(2)** `MarkerClusterer` never destroyed on unmount, **(3)** no `dvh` / `safe-area-inset` on mobile sheet (iOS Safari chrome overlap risk), **(4)** prod synthetic smoke (SAN-462) never asserts map load or pin count, **(5)** GCP Maps billing can still block tiles in prod (`BillingNotEnabledMapError` — documented in `e2e/README.md`).

**Overall implementation correctness: ~74%** — strong foundation, fixable blockers before calling mobile production-ready.

| Verdict | Answer |
|---------|--------|
| Production-ready (desktop chat + map)? | **Conditional yes** — if Map ID + billing + referrer restrictions configured on prod |
| Mobile-production-ready? | **No** — double mount, viewport units, missing prod map assertions |
| Scalable (100+ pins)? | **Partial** — clustering exists (≥4 pins) but lifecycle cleanup missing |
| Google best-practices aligned? | **Mostly** — AdvancedMarker + mapId + server Places; not Places UI Kit (acceptable for custom Mindtrip UX) |
| Migrate to Maps web components (`<gmp-map>`)? | **Not now** — React/CopilotKit stack fits vis.gl; revisit Phase 2 for embed-only surfaces |
| AdvancedMarker everywhere? | **Yes when `mapId` set** — markers gated on `mapId && …` in `ChatMap.tsx` |
| Clustering architecture correct? | **Mostly** — custom Paisa renderer + ref sync; missing teardown |
| Places grounding reliable? | **Moderate** — ADK + café DB fallback + quota; agent flake handled in e2e retries |
| Mobile map interactions stable? | **Moderate** — FAB/sheet/resize signal work; hidden map + vh units are risks |

---

## 2. Scorecard

| Dimension | Score | Weight | Notes |
|-----------|------:|--------|-------|
| **Maps architecture** | **78%** | 25% | vis.gl + MapContext + controllers; double-mount drags score |
| **Mobile readiness** | **65%** | 25% | MAP-007 sheet + FAB; no dvh/safe-area/landscape e2e |
| **Performance** | **70%** | 15% | Debounced camera sync; clusterer leak; greedy gestures OK |
| **Security** | **88%** | 15% | Server keys, field masks, photo rate limit; browser key exposed by design |
| **AI grounding** | **76%** | 10% | ADK invoke + fallback + quota tables |
| **Production readiness** | **71%** | 10% | Prod smoke skips map; billing/referrer ops gaps |

**Weighted overall: ~74% correct**

---

## 3. Architecture (verified)

### 3.1 Component hierarchy ✅

```
GeoChatShell
  └─ MapsShell (APIProvider, libraries=["marker"])
       └─ ChatCanvas
            ├─ ChatMapPanel (lg+ only, hidden on mobile)
            │    └─ ChatMap
            └─ MapMobileSheet (lg:hidden FAB + bottom sheet)
                 └─ ChatMap (second instance when sheet open)
```

**Files:** `geo-chat-shell.tsx`, `MapProvider.tsx`, `chat-canvas.tsx`, `chat-map-panel.tsx`, `map-mobile-sheet.tsx`, `ChatMap.tsx`

### 3.2 State management ✅

- **`MapContextProvider`** — pins, viewport, selection, fitBounds token, category merge (`platform/maps/map-context.tsx`)
- **`MapUiSync`** — debounced push to concierge working memory (`components/copilot/map-ui-sync.tsx`)
- **Controllers inside `<Map>`:** `MapCameraSync`, `MapFocusController`, `MapFitBoundsController`, `MapResizeSignal`

### 3.3 SSR / client boundaries ✅

- All map components `"use client"`
- `MapMobileSheet` uses `useSyncExternalStore` for `lg` breakpoint — correct SSR snapshot (`false`)

### 3.4 Red flag — dual `ChatMap` on mobile 🔴

`ChatMapPanel` uses `hidden lg:flex` — **DOM still mounts** `ChatMap` on 390px viewports. When user opens `MapMobileSheet`, a **second** `ChatMap` mounts inside the sheet.

**Why it matters:** Two Maps JS map instances under one `APIProvider` → duplicated tile requests, memory, event listeners, clusterer state. Real failure: sluggish sheet open, iOS tab kills, inconsistent pin selection between hidden/shown maps.

**Fix (Critical):** Conditionally render desktop map only when `isLgUp` (same pattern as `MapMobileSheet`), or lift single `ChatMap` into a shared portal.

```tsx
// chat-map-panel.tsx — pattern
const isLgUp = useMediaQuery("(min-width: 1024px)");
if (!isLgUp) return null; // or skeleton placeholder without Map
```

---

## 4. Google Maps implementation

### 4.1 Loader & provider ✅

| Check | Status | Evidence |
|-------|--------|----------|
| vis.gl `APIProvider` | ✅ | `MapProvider.tsx` |
| `libraries={["marker"]}` for AdvancedMarker | ✅ | `MapProvider.tsx:40` |
| `authReferrerPolicy="origin"` | ✅ | `MapProvider.tsx:41` |
| Missing key UX | ✅ | `data-testid="map-env-error"` |
| Auth failure hook | ✅ | `use-maps-auth-failure.ts`, `MapRefererHelp` |

### 4.2 AdvancedMarker + mapId ✅ (with guard)

```51:58:mdeapp/src/components/maps/ChatMap.tsx
      <Map
        mapId={mapId}
        defaultCenter={MEDELLIN_CENTER}
        defaultZoom={DEFAULT_MAP_ZOOM}
        gestureHandling="greedy"
```

- `getGoogleMapsMapId()` blocks `DEMO_MAP_ID` on production/preview (`google-maps-map-id.ts`)
- Markers **only render when `mapId` truthy** — correct guard per LESSONS.md
- `data-mapid-present` attribute for Playwright

### 4.3 Clustering (MAP-009) 🟡

- Threshold: **≥4 pins**, opt-out via `NEXT_PUBLIC_MAP_CLUSTERING=0` (`map-clustering.ts`)
- Custom Paisa SVG cluster renderer using `AdvancedMarkerElement`
- **Issue:** `ClusteredCategoryMarkers` creates `MarkerClusterer` in `useMemo` but **never calls `.clearMarkers()` / destroy on unmount** — memory leak on route change or sheet close.

**Fix (Important):**

```tsx
useEffect(() => () => clusterer?.clearMarkers(), [clusterer]);
```

### 4.4 Map lifecycle controllers ✅

| Controller | Role | Debounce |
|------------|------|----------|
| `MapCameraSync` | idle → viewport in context | 300ms |
| `MapResizeSignal` | `google.maps.event.trigger(map, "resize")` on sheet open | 300ms timeout |
| `MapFitBoundsController` | fitBounds after tool merge | on `fitBoundsToken` |
| `MapFocusController` | pan to `focusPinId` | — |

### 4.5 Places API usage ✅

| Surface | Pattern | Field mask |
|---------|---------|------------|
| `/api/places/detail` | Server cache read-through | via `google-places-client.ts` |
| `/api/places/photo` | Proxy + rate limit | — |
| Mastra tools | `@googlemaps/places` server client | `X-Goog-FieldMask` enforced |
| Browser | **No direct Places POST** | e2e guard in `maps-grounding.spec.ts` |

**Spec drift:** `tasks/maps/MAP-005` still `Not Started` but **partial ship** exists (`place-details-cache.ts`, `/api/places/detail`). Full MAP-005 (edge fn + search/nearby/autocomplete proxy) remains open.

### 4.6 Legacy API usage ✅

- No `react-wrapper`, no legacy `google.maps.Marker` in product code
- `@vis.gl/react-google-maps` is the canonical React integration (matches mde-maps skill)

---

## 5. Mobile responsiveness

### 5.1 Layout (MAP-007B) ✅

- Desktop: `lg:grid-cols-[240px_1fr_360-420px]` (`chat-canvas.tsx`)
- Mobile: center chat full width; map via FAB + bottom sheet
- FAB position: `fixed bottom-[7.5rem] right-4 z-40` — clears chat input (verified in `maps-layout-mobile.spec.ts`)

### 5.2 Touch targets ✅

- FAB: `h-11` (44px) + `aria-label` with pin count
- Map pins: `size-10` (40px) — **slightly under 44px** guideline (Important)

### 5.3 Viewport units 🟡

- Sheet: `max-h-[85vh] min-h-[75vh]` — **not `dvh`**
- Map body: `h-[min(70vh,520px)]`
- **No `env(safe-area-inset-*)`** anywhere in `mdeapp/src`

**Failure scenario:** iPhone Safari dynamic toolbar shrinks `vh` → sheet clips map or FAB overlaps home indicator.

**Fix (Important):** Use `max-h-[85dvh]`, `pb-[env(safe-area-inset-bottom)]` on sheet content and FAB offset.

### 5.4 Responsive testing coverage 🟡

| Viewport | Spec file | Covered |
|----------|-----------|---------|
| 390×844 mobile | `maps-layout-mobile.spec.ts` | ✅ FAB, sheet, chat input |
| 768×1024 tablet | `maps-layout-mobile.spec.ts` | ✅ partial |
| 1280×900 desktop | `maps-layout-desktop.spec.ts` | ✅ 3-column |
| 1440×900 | `maps-layout-desktop.spec.ts` | ✅ |
| 375×667 / 412×915 / landscape | — | ❌ missing |
| Pin click on mobile map | — | ❌ missing |
| Orientation change | — | ❌ missing |

### 5.5 Z-index / overlays ✅

- FAB `z-40`; CopilotKit inspector hidden in e2e via CSS injection
- Empty states use `pointer-events-none` overlay — correct

### 5.6 Reduced motion ✅

- `@media (prefers-reduced-motion: reduce)` in `globals.css`
- Pin markers use CSS `transition` — should respect global reduce rule (verify pin scale animation)

---

## 6. AI grounding

### 6.1 Pipeline ✅

```
conciergeAgent → search_grounded_places tool
  → invokeAdkGrounding (ADK sidecar /v1/grounding/invoke)
  → mapAdkGroundingPins → MapContext.mergePinsByCategory
  → ChatMap pins + grounded cards in chat
```

**Fallback:** café queries → `venue_anchors` DB when ADK unavailable (`search-grounded-places.ts`)

### 6.2 Reliability 🟡

| Control | Status |
|---------|--------|
| Daily quota (`grounding_quota_log`) | ✅ |
| Search grounding separate bucket | ✅ |
| Location bias (Medellín) | ✅ |
| Hallucination guard | Partial — agent instructions + grounded cards require place_id |
| Map/card sync | ✅ via shared pin merge |
| Attribution UI | Cards show photo/rating; standalone attribution footer removed (by design) |

**Failure scenario:** Agent skips tool → cards without pins. e2e mitigates with retry nudge messages (`waitForCafeGroundedCards`).

### 6.3 Working memory sync ✅

`MapUiSync` pushes debounced `mapUi` summary into co-agent state — Camila follow-ups can reference visible pins.

---

## 7. Performance

| Issue | Severity | Detail |
|-------|----------|--------|
| Dual map mount mobile | 🔴 Critical | See §3.4 |
| Clusterer no teardown | 🟡 Important | See §4.3 |
| `gestureHandling="greedy"` | ✅ OK for full-bleed map column | May fight page scroll if map ever inline on mobile main column |
| Re-renders on pin merge | ✅ Low | Keys stable on `pin.id` |
| Mock layout pin | ✅ | Filtered once real pins exist (`filterRenderableMapPins`) |
| Bundle | Not measured | `@vis.gl/react-google-maps` + marker library loaded once per page |

**Google guidance:** Lazy-load map when off-screen — **not implemented** (hidden desktop map still loads tiles).

---

## 8. Accessibility

| Check | Status |
|-------|--------|
| Pin `role="img"` + `aria-label` | ✅ `CategoryMapMarker.tsx` |
| Map panel `aria-label` | ✅ `chat-map-panel.tsx` |
| Sheet title/description | ✅ |
| Keyboard Escape closes sheet | ✅ e2e |
| Map pan/zoom keyboard | ⚠️ Default Google controls only |
| Screen reader map exploration | ⚠️ Limited (inherent Maps JS limitation) |
| Focus trap in sheet | ⚠️ Not verified — shadcn Sheet default |

---

## 9. Security

| Check | Status | Evidence |
|-------|--------|----------|
| `GOOGLE_PLACES_API_KEY` not in client | ✅ | `maps-security.test.ts` walk |
| Browser key `NEXT_PUBLIC_*` only | ✅ | By design — referrer-restrict |
| Field mask on every Places call | ✅ | `google-places-client.ts` |
| Photo proxy rate limit | ✅ | `places-photo-rate-limit.ts` |
| Service role not in map components | ✅ | — |

**Ops blockers (not code):**

- Referrer allowlist must include `https://www.mdeai.co/*` and preview URLs
- **Billing must be enabled** on GCP Maps project — prod console error documented
- Quota alerts / budget caps — not in repo

---

## 10. Testing

### 10.1 Playwright map specs ✅

| Spec | What it proves |
|------|----------------|
| `maps-layout-mobile.spec.ts` | FAB above send, sheet open/close, chat visible |
| `maps-layout-desktop.spec.ts` | 3-column, no overflow, rental card → pin row |
| `maps-grounding.spec.ts` | Grounded café cards, pins ≥1, no browser Places POST |
| `maps-007b-evidence.spec.ts` | Evidence capture |
| `prod-synthetic-smoke.spec.ts` | 4 verticals on prod — **no map assertions** |

### 10.2 Unit tests ✅

- `map-pin-filters`, `map-clustering`, `clustered-category-markers`, `category-map-marker`, `maps-security`

### 10.3 Gaps ❌

- Mobile pin tap → selection
- Cluster expand at 4+ pins
- Map resize after orientation change
- Prod: `data-testid="chat-map"` visible on desktop prod smoke
- Landscape 844×390
- Billing/auth failure UI paths

---

## 11. Critical blockers

| # | Blocker | Persona impact | Fix |
|---|---------|----------------|-----|
| B1 | **Dual ChatMap on mobile** | Tourist opens map sheet → slow/broken pins | Single map instance or `lg`-only desktop mount |
| B2 | **GCP billing / referrer on prod** | Blank map, `BillingNotEnabledMapError` | Enable billing + HTTP referrer restrictions (ops) |
| B3 | **Prod smoke ignores map** | SAN-462 green while map broken | Add prod assertion: `chat-map` visible @1280 + optional pin after café query |
| B4 | **MAP-008B / Map ID on Vercel** | AdvancedMarker silent fail if env missing | Verify `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` on prod (SAN-368) |

---

## 12. Red flags

1. Hidden `display:none` map still initializes Google tiles on every mobile page load
2. `MarkerClusterer` lifecycle incomplete
3. `vh` instead of `dvh` + no safe-area on FAB/sheet
4. `tasks/maps/INDEX.md` stale (MAP-005 partial, many shipped items in `archive/maps-A`)
5. Pin touch target 40px (< 44px WCAG mobile target)
6. `InfoWindow` + custom React card — watch for focus trap / scroll bleed on mobile sheet
7. `gestureHandling="greedy"` inside bottom sheet — can steal vertical scroll near map edge

---

## 13. Failure points

| Scenario | Likely symptom | Root cause |
|----------|----------------|------------|
| Open map on iPhone | Map half gray | resize not fired / dual instance |
| 10+ rental pins | Jank on pan | Clusterer + no cleanup |
| ADK down + non-café query | Cards without pins | Fallback café-only |
| Missing Map ID on Vercel | No markers, map tiles only | `mapId` undefined in prod |
| Places cache cold | Slow detail panel | DATA-008 backfill not wired |
| Copilot POST storm during map test | Flaky e2e | Separate from maps but affects grounding tests |

---

## 14. Incorrect / anti-patterns

| Pattern | Verdict | Recommendation |
|---------|---------|----------------|
| vis.gl + MapContext | ✅ Correct for React 19 / Next 16 | Keep |
| AdvancedMarker custom HTML pins | ✅ Google-recommended | Keep |
| Server Places proxy | ✅ Security + cache | Complete MAP-005 edge parity later |
| Hidden-but-mounted map | ❌ Anti-pattern | Fix B1 |
| `useMemo` for clusterer without cleanup | ❌ Anti-pattern | Add teardown effect |
| Places UI Kit | ⏭ Not used | OK — custom Mindtrip UX is intentional |
| Web components migration | ⏭ Deferred | Revisit for marketing embeds only |

---

## 15. Recommended fixes (priority)

### Critical (before mobile prod sign-off)

1. **MAP-AUDIT-001** — Render `ChatMapPanel` map only `@lg` (or single shared map instance)
2. **MAP-AUDIT-002** — Extend SAN-462 prod smoke: desktop `chat-map` visible + café query → pin count ≥ 1
3. **Ops** — Confirm GCP billing + referrer + Map ID on Vercel (MAP-002B / MAP-008B)

### Important (next sprint)

4. **MAP-AUDIT-003** — Clusterer destroy on unmount
5. **MAP-AUDIT-004** — `dvh` + `safe-area-inset` on `MapMobileSheet` / FAB
6. **MAP-AUDIT-005** — Bump pin hit area to 44×44 (visual size can stay 40 with padding)
7. **MAP-AUDIT-006** — Playwright: mobile pin tap, landscape, 375/412 viewports
8. **MAP-DOC-002** — Refresh `tasks/maps/INDEX.md` (MAP-005 partial, DATA-007 archived)

### Nice-to-have

9. Lazy-init map when sheet closed on mobile (defer APIProvider children)
10. `MAP-034` marker UX polish (animation with `prefers-reduced-motion`)
11. MAP-006 nearby search when MAP-005 complete

### Future scaling

12. Viewport-based pin culling (>100 pins)
13. Consider Places UI Kit for autocomplete-only surfaces (MAP-010)
14. Routes preview (MAP-011A/011) — separate from chat map

---

## 16. Best-practice alignment (Google)

| Google guidance | MDEAI status |
|-----------------|--------------|
| [Advanced Markers require mapId](https://developers.google.com/maps/documentation/javascript/advanced-markers?utm_source=gmp-code-assist) | ✅ Enforced |
| [Dynamic library import / loader](https://developers.google.com/maps/documentation/javascript/load-maps-js-api?utm_source=gmp-code-assist) | ✅ via vis.gl `APIProvider` |
| [Marker clustering](https://mapsplatform.google.com/resources/blog/how-cluster-map-markers/) | ✅ @googlemaps/markerclusterer |
| [Performance tips](https://mapsplatform.google.com/resources/blog/google-maps-platform-best-practices-optimization-and-performance-tips/) | 🟡 Lazy load + single instance needed |
| [Places field masks](https://developers.google.com/maps/documentation/places/web-service/choose-fields?utm_source=gmp-code-assist) | ✅ Server enforced |
| Web components (`<gmp-map>`) | Not adopted — OK for React app |

**Web components migration:** **No** for `/chat` — CopilotKit + React state + AdvancedMarker DOM content is easier with vis.gl. Consider web components only for static marketing pages or iframe embeds.

---

## 17. Suggested Linear tasks

| ID | Title | Priority | Estimate |
|----|-------|----------|----------|
| MAP-AUDIT-001 | Single ChatMap instance — no hidden mobile mount | P0 | 3h |
| MAP-AUDIT-002 | Prod smoke map + pin assertions | P0 | 2h |
| MAP-AUDIT-003 | MarkerClusterer cleanup on unmount | P1 | 1h |
| MAP-AUDIT-004 | dvh + safe-area on mobile map sheet | P1 | 2h |
| MAP-AUDIT-005 | 44px pin touch targets | P1 | 1h |
| MAP-AUDIT-006 | Playwright mobile pin + landscape | P1 | 3h |
| MAP-005 | Complete places proxy (edge/search/nearby) | P1 | 6h |
| MAP-006 | Nearby search tool | P2 | 4h |

---

## 18. Suggested Playwright tests

```ts
// e2e/maps-mobile-interaction.spec.ts
test("mobile sheet pin tap selects pin", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // ... grounding query → open sheet → click [data-testid="map-pin"] → expect selected
});

test("only one chat-map in DOM on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoHome(page);
  expect(await page.locator('[data-testid="chat-map"]').count()).toBe(1);
  await page.locator('[data-testid="map-sheet-trigger"]').click();
  expect(await page.locator('[data-testid="chat-map"]').count()).toBe(1);
});

test("landscape 844x390 no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  // ...
});
```

---

## 19. Suggested monitoring / logging

- Vercel log drain: count `BillingNotEnabledMapError`, `RefererNotAllowedMapError`
- Supabase: `grounding_quota_log` daily cap alerts
- `X-Places-Cache: hit|miss` ratio on `/api/places/detail` (already returned)
- RUM: map sheet open → first `idle` event latency (custom metric)

---

## 20. Production rollout checklist

- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — HTTP referrer restricted to prod + preview
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` — real Map ID (not `DEMO_MAP_ID`) on Vercel production
- [ ] GCP billing enabled for Maps JavaScript API + Places API (New)
- [ ] MAP-AUDIT-001 merged (single map instance)
- [ ] SAN-462 prod smoke includes map visibility assertion
- [ ] 3/3 scheduled prod synthetic greens
- [ ] Mobile sheet tested on physical iPhone + Android Chrome
- [ ] `place_details_cache` hit rate monitored (DATA-007 done; DATA-008 backfill queued)

---

## 21. File reference index

| Area | Primary files |
|------|----------------|
| Map root | `src/components/maps/ChatMap.tsx` |
| Provider | `src/components/maps/MapProvider.tsx` |
| Context | `src/platform/maps/map-context.tsx` |
| Mobile UX | `src/components/chat/map-mobile-sheet.tsx` |
| Clustering | `src/components/maps/ClusteredCategoryMarkers.tsx`, `src/lib/map-clustering.ts` |
| Places server | `src/mastra/lib/google-places-client.ts`, `src/app/api/places/detail/route.ts` |
| Grounding | `src/mastra/tools/search-grounded-places.ts` |
| Map ID | `src/lib/google-maps-map-id.ts` |
| E2E | `e2e/maps-layout-mobile.spec.ts`, `e2e/maps-grounding.spec.ts` |
| Tasks | `tasks/archive/maps-A/`, `tasks/maps/INDEX.md` |

---

## 22. Audit metadata

| Field | Value |
|-------|-------|
| Prompt source | `tasks/wireframes/audit/02-maps-prompt.md` |
| Code rev verified | `bf40ef9` (prod) |
| Automated tests counted | 8 map-related vitest + 4+ Playwright specs |
| MCP | Google Maps Code Assist `retrieve-instructions` loaded |
| Next review trigger | After MAP-AUDIT-001 merge + SAN-462 3/3 |

---

*Usage of Google Maps Platform products and services may incur costs against your Google Cloud project billing account.*

*APIs referenced in this audit: Maps JavaScript API, Advanced Markers, Places API (New), Marker Clusterer library.*

*Restrict API keys (HTTP referrers, API restrictions) per [Google Cloud API key restrictions](https://cloud.google.com/api-keys/docs/add-restrictions-api-keys).*

*Google documentation citations use `utm_source=gmp-code-assist` where applicable.*
