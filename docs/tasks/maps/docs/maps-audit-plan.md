---
doc_id: MAPS-AUDIT-2026-05-27
title: mdeai Maps — Forensic Audit Report
date: 2026-05-27
auditor: Cursor (forensic read-only pass)
status: Active
sources:
  - tasks/maps/docs/maps-prd.md
  - tasks/maps/INDEX.md
  - tasks/archive/maps-A/README.md
  - tasks/data/audit-supabase.md
  - tasks/ADK/docs/maps-adk-prd.md
  - .agents/skills/mde-maps/SKILL.md
  - mdeapp/src/platform/maps/
  - mdeapp/src/components/maps/
  - mdeapp/src/mastra/tools/
  - services/adk-grounding/
  - supabase/migrations/
verified_docs:
  - https://developers.google.com/maps/documentation/javascript/advanced-markers/start
  - https://developers.google.com/maps/documentation/places/web-service/place-details
  - https://developers.google.com/maps/ai/grounding-lite
  - https://supabase.com/docs/guides/database/postgres/row-level-security
rules:
  - No file modifications from this audit (report only)
  - No migrations from this audit
---

# mdeai Maps — Forensic Audit Report

> **Core rule (verified correct):** Google Maps is **spatial truth**, Supabase owns **inventory + commerce**, Mastra **orchestrates**, CopilotKit **renders**, Gemini **explains/ranks** — it must **never invent** coordinates, place IDs, URLs, hours, or distances.

---

## 1. Executive summary

The **MVP maps platform is largely shipped on disk** — significantly ahead of stale sections in `tasks/maps/docs/maps-prd.md` §1.2 ("not started" claims for vis.gl, MapContext, grounding tool, attribution, and tests are **false**).

**What works today (Camila on `/`):**

- Three-panel chat + map shell (F48/F49/F50 archived)
- `MapContext` with **merge-by-category** pin pipeline (not global replace)
- `@vis.gl/react-google-maps` + `AdvancedMarker` gated on Map ID
- `@googlemaps/markerclusterer` (MAP-009)
- `searchGroundedPlaces` Mastra tool → ADK FastAPI sidecar → Grounding Lite MCP
- Server-side Places client with **mandatory `X-Goog-FieldMask`**
- `GroundingAttribution` component + Playwright attribution smoke
- Vitest + Playwright maps coverage (5 unit files + 4 e2e specs)

**What blocks production cost-safety and MAP spine completion:**

- **MAP-005** — no `places-proxy` edge; cache tables exist in migrations but **mdeapp does not read/write `places_search_cache`** (ADK sidecar writes `place_details_cache` only)
- **MAP-006 / MAP-010 / MAP-011 / MAP-012** — not started
- **Prod ADK** — `ADK_GROUNDING_URL` defaults to localhost; Cloud Run + `ADK_INTERNAL_TOKEN` required on Vercel
- **Planning drift** — this file was empty; maps-prd §1.2 materially stale

**Verdict:** Architecture is **correct**. Execute **MAP-005 → 006 → 012A → 012 → 010 → 011** before advanced route planning, heatmaps, or multi map-agent fan-out.

---

## 2. Maps readiness score

| Lens | Score | Notes |
|------|------:|-------|
| **Chat + map MVP (localhost)** | **74/100** | Pins, merge, grounding, clustering work with ADK running |
| **Production cost-safe Places** | **58/100** | No proxy/cache wiring; repeat queries bill Google |
| **MAP-001–012 literal spine** | **58/100** | 5 of 12 open (005, 006, 010, 011, 012) |
| **Docs accuracy** | **45/100** | maps-prd §1.2 contradicts disk |
| **Security posture** | **82/100** | Key split enforced; hooks + e2e guard browser Places |
| **Gemini geo-safety** | **78/100** | Zod on tool outputs; model can still hallucinate in prose — cards must be tool-backed |

**Overall platform readiness:** **74/100** (MVP demo) · **58/100** (prod billing + full spine)

**Target after Core gates:** ~83/100 per maps-prd.

---

## 3. Percent correct by area

| Area | % | Status |
|------|--:|--------|
| Architecture (layer model) | **95** | Matches PRD + ADK sidecar pattern |
| MapContext / pin pipeline | **88** | merge-by-category, dedupe, cross-category preserve |
| Advanced Markers + Map ID | **85** | vis.gl + gating; hook deferred |
| Places API New (client library) | **80** | Masks enforced; searchText/nearby not wired to tools |
| Places proxy + cache (MAP-005) | **20** | Migrations yes; edge + app integration no |
| Grounding Lite / ADK sidecar | **78** | Shipped dev-side; prod deploy partial |
| Supabase cache tables | **70** | Tables + RLS exist; partial usage |
| Edge functions (maps) | **15** | No places-proxy |
| Map UX (categories, cluster, selection) | **75** | Category markers, overlay card; mobile sheet partial |
| Testing | **72** | Good unit/e2e base; no cache hit/miss integration |
| Gemini geo-safety | **78** | Tool-only coords in pipeline; prose risk remains |
| Documentation | **45** | PRD repo-truth section stale |

---

## 4. Critical blockers

| # | Blocker | Owner | Fix |
|---|---------|-------|-----|
| B1 | **MAP-005** — no `places-proxy`; cache unused from mdeapp | MAP-005 | Edge fn + Mastra/API route → cache read-through |
| B2 | **`places_search_cache` never hit** from Next/Mastra | MAP-005 | Wire `searchText`/`searchNearby` through proxy |
| B3 | **Prod grounding** — localhost default | MAP-002 deploy | Cloud Run URL + token on Vercel |
| B4 | **MAP-006** — `searchNearby` in client only (tests) | MAP-006 | Mastra tool + UI CTA after MAP-005 |
| B5 | **MAP-010** — Roberto venue autocomplete | MAP-010 | Autocomplete route + host wizard |
| B6 | **Stale maps-prd §1.2** misleads auditors | Doc refresh | Update repo-truth table (see §15) |
| B7 | **`advanced-marker-needs-mapid` hook deferred** | Hook promote | Move from `_deferred/` to PreToolUse |

---

## 5. Red flags

| Severity | Issue | Evidence | Fix |
|----------|-------|----------|-----|
| 🔴 Critical | Places key in browser bundle | Mitigated today — `maps-security.test.ts` scans client `src/**` | Keep hook + never add `NEXT_PUBLIC_GOOGLE_PLACES_*` |
| 🔴 Critical | Advanced Markers without Map ID in prod | `google-maps-map-id.ts` throws/warns; markers gated in `ChatMap.tsx` | Verify `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` on Vercel preview/prod |
| 🔴 Critical | Field masks missing = cost/error | `google-places-client.ts` validates masks; `.claude/hooks/places-api-field-mask.mjs` active | Keep registry; add cache-layer mask logging in MAP-005 |
| 🟠 High | Grounded places without attribution | `GroundingAttribution.tsx` exists; e2e `smoke:grounding-attribution` | Ensure every grounded card path renders attribution |
| 🟠 High | Agent could invent lat/lng | `search-grounded-places.ts` uses Zod + ADK payload mapping | Reject free-text coords in any new tool; audit prose disclaimers |
| 🟠 High | MapContext overwrite risk | **Not present** — `mergePinsByCategory` preserves other categories | Do not replace with `setPins(incoming)` globally |
| 🟠 High | Cache tables service_role-only but unused | `20260515043737_places_cache_schema.sql` | MAP-005 must use service role from edge only |
| 🟡 Medium | Too many map agents early | PRD §6.6 design-only; `conciergeAgent` + tools shipped | Keep single router + tools until post-MVP |
| 🟡 Medium | ADK as second brain | FastAPI sidecar bounded to `/v1/grounding/invoke`; MAP-002A deferred | Do not move orchestration into ADK LlmAgent for MVP |
| 🟡 Medium | Duplicate map loaders | Single `APIProvider` in `MapProvider.tsx` | Do not add ECL `<gmpx-api-loader>` without feature flag |
| 🟡 Medium | `route_cache` missing | audit-supabase § gaps | **data-033** (proposed) before MAP-011 |
| 🟢 Low | DEMO_MAP_ID in dev only | `getGoogleMapsMapId()` fallback | Acceptable for localhost |

---

## 6. Supabase maps audit matrix

| Table / column | Exists | Required cols | Indexes | RLS | Used by mdeapp | Used by ADK | Task |
|----------------|:------:|---------------|---------|:---:|:--------------:|:-----------:|------|
| `places_search_cache` | ✅ | query_hash, payload, expires_at | query_hash, expires_at | service_role only | ❌ | ❌ | **MAP-005** |
| `place_details_cache` | ✅ | place_id, field_mask_version, payload, expires_at | mask+expires | service_role only | ❌ (direct) | ✅ | **MAP-005**, data-007 |
| `grounding_quota_log` | ✅ | user/session counters | — | policies | ✅ `grounding-quota.ts` | — | MAP-002 |
| `grounded_places_cache` | ❌ optional | — | — | — | ❌ | ❌ | MAP-005 optional |
| `route_cache` | ❌ | origin_hash, dest_hash, mode, payload, expires_at | — | — | ❌ | ❌ | **data-033** (proposed) |
| `neighborhoods` | ✅ | scores, geom | — | ✅ | map path N/A | — | MAP-012 |
| `apartments.latitude/longitude` | ✅ | lat/lng on rows | partial via data-009 | ✅ | rental pins | — | data-001, data-019 |
| `events` venue lat/lng | ✅ | via venue join | — | ✅ | event pins | — | data-012 |
| `restaurants.google_place_id` | partial | place_id column | — | ✅ | restaurant pins | — | data-001 |
| `tourist_destinations` lat/lng | ✅ | lat/lng | — | ✅ | attraction pins | — | data-001 |
| Source attribution cols | ✅ on tool payload | placeUri, source | — | n/a | UI | — | MAP-002 |

**Live cache counts (audit-supabase 2026-05-26):** 45 `place_details_cache`, 33 `places_search_cache` rows — schema provisioned, app integration incomplete.

---

## 7. ADK / Grounding audit matrix

| Check | Status | Evidence |
|-------|:------:|----------|
| Grounding Lite MCP endpoint | ✅ | `services/adk-grounding/grounding_mcp.py` → `mapstools.googleapis.com` |
| Sidecar not main orchestrator | ✅ | Mastra `invokeAdkGrounding()` HTTP client; JSON contract fixed |
| `search_places` / `compute_routes` wrapped | ✅ partial | search via MCP; routes **not in product** (MAP-011) |
| Zod validation before render | ✅ | `adk-grounding-types.ts`, `parse-grounded-tool-result.ts` |
| Attribution shown | ✅ | `GroundingAttribution.tsx` + cafe cards |
| Quota logging | ✅ | `grounding_quota_log` via service carve-out |
| Prod auth token | ⚠️ | `ADK_INTERNAL_TOKEN` optional locally |
| MAP-002A full ADK LlmAgent | ❌ deferred | Correct — P2 hardening only |
| Gemini Maps fallback | ⚠️ | Documented in MAP-002E runbook; must stay fail-closed in prod |

**Skill alignment:** `mde-maps` § Grounding Lite + `google-agents-cli-adk-code` — sidecar pattern matches ADK roadmap MVP; do **not** port CopilotKit `HttpAgent` → Python ADK for Phase 1.

---

## 8. Places API audit matrix

| Check | Status | Evidence |
|-------|:------:|----------|
| Server-side only | ✅ | `google-places-client.ts`; browser key = Maps JS only |
| `X-Goog-FieldMask` every request | ✅ | L191–265 + unit tests |
| Field mask registry | ✅ | `DEFAULT_*_MASK`, `PLACE_DETAILS_MVP_MASK`, version string |
| Wildcard rejected | ✅ | `validatePlacesFieldMask` |
| PreToolUse hook | ✅ | `places-api-field-mask.mjs` in settings |
| `searchText` in production | ❌ | Client only + tests |
| `searchNearby` in production | ❌ | MAP-006 blocked on MAP-005 |
| `getPlaceDetails` wired | ✅ | `/api/places/detail` |
| Photo proxy | ✅ | `/api/places/photo` (MAP-018D) |
| Autocomplete | ❌ | MAP-010 |
| Expensive fields avoided | ✅ | No `generativeSummary` / US-only fields in masks |
| `placeUri` from API | ✅ | Not hand-built Maps URLs |
| Attribution stored | ✅ partial | In tool payload + cache payload |

---

## 9. Advanced Marker audit matrix

| Check | Status | Evidence |
|-------|:------:|----------|
| `@vis.gl/react-google-maps` installed | ✅ | package.json ^1.8.3 |
| `AdvancedMarker` used | ✅ | `ChatMap.tsx`, `ClusteredCategoryMapPin.tsx` |
| Map ID on parent `<Map>` | ✅ | `mapId={getGoogleMapsMapId()}` |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | ✅ local | `.env.example`; verify Vercel prod |
| Markers gated without mapId | ✅ | `{mapId && ...}` in ChatMap |
| Custom HTML/CSS marker content | ✅ partial | `CategoryMapMarker.tsx` category colors |
| Selected marker z-index / ring | ⚠️ partial | `SelectedPlaceOverlayCard`; no universal z-index ring spec |
| Accessible marker labels | ⚠️ partial | Some `title`/ARIA; not audited on all pins |
| Marker clustering | ✅ | MAP-009 `ClusteredCategoryMarkers` |
| Marker collision behavior | ❌ | Not configured |
| Numbered rental/event pins | ❌ | Post-MVP polish |
| Price badges for rentals | ❌ | Post-MVP |
| Category colors | ✅ | rental/event/restaurant/attraction/grounded |
| Mobile bottom sheet on click | ⚠️ partial | Overlay card; not full ECL sheet |
| Fallback when mapId missing | ✅ | Dev DEMO_MAP_ID; prod error path |
| map capabilities test | ⚠️ | `google-maps-map-id.test.ts`; no runtime capability probe |
| PreToolUse mapId hook | ❌ deferred | `_deferred/advanced-marker-needs-mapid.mjs` |

---

## 10. Gemini geo-safety audit

| Vector | Risk | Mitigation today | Gap |
|--------|------|------------------|-----|
| Invented lat/lng | High | Pins from Supabase tools or ADK Zod output only | New tools must follow same pattern |
| Invented place_id | High | Grounding + Places tool paths | Autocomplete not yet shipped |
| Hand-built Maps URLs | Medium | `mapsUrl` from tool payload / `placeUri` | Audit any new card components |
| Opening hours | Medium | Place Details mask fields | Only cafe detail path wired |
| Distance/duration | Medium | Not in MVP product paths | MAP-011 must parse `"180s"` strings |
| Model prose vs facts | Medium | Cards show tool fields; summaries separate | Add visible "from Google Maps" on all grounded surfaces |
| Free-text coord injection | High | No user-supplied coords in tools | Keep rejected in MCP/tool schemas |

**Mastra skill note:** Tools use `createTool` + Zod — extend `enrichedGroundedPlaceFieldsSchema` for new fields; never `??` default on required geo fields.

---

## 11. Security / billing risk report

| Risk | Severity | Mitigation |
|------|----------|------------|
| Browser Places API key | 🔴 if misconfigured | Only `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (JS); verify-maps-env.mjs |
| Service role in browser | 🔴 | Carve-out only `mastra/lib/` — grounding-quota, ai-runs |
| Repeat Places billing | 🟠 | **MAP-005** cache read-through |
| Missing field mask | 🔴 | Hook + client validation |
| Grounding quota bypass | 🟡 | `incrementAndCheckGroundingQuota` |
| ADK sidecar open on internet | 🟠 | `ADK_INTERNAL_TOKEN` on Cloud Run |
| Photo API key in server URL | 🟢 expected | Server fetch only; client uses proxy route |
| E2E browser Places POST | 🟢 guarded | `maps-grounding.spec.ts` blocks direct calls |

---

## 12. Required fixes — implementation order

```text
P0 — unblock prod billing
  1. MAP-005  places-proxy edge + wire Mastra/API to cache
  2. Prod ADK  Cloud Run + Vercel env (ADK_GROUNDING_URL, ADK_INTERNAL_TOKEN)
  3. Doc fix   Refresh maps-prd.md §1.2 repo truth

P1 — MVP spine completion
  4. MAP-006  nearby search tool + UI
  5. MAP-012A CO aggregate insights spike
  6. MAP-012  neighborhood intelligence
  7. MAP-010  Roberto venue autocomplete
  8. MAP-011  route previews (+ data-033 route_cache)
  9. Promote   advanced-marker-needs-mapid hook

P2 — polish + hardening
  10. MAP-023  static maps OG previews
  11. MAP-002A ADK LlmAgent package (optional)
  12. MAP-034  advanced marker UX bundle (proposed — §16)
  13. data-007  cache coverage audit (parallel MAP-005)
  14. data-033  route_cache schema (before MAP-011)
```

---

## 13. MVP-safe roadmap

| Week | Deliverable | Tasks |
|------|-------------|-------|
| W6 | Cost-safe Places | MAP-005, data-007 evidence |
| W6 | Nearby + hood intel | MAP-006, MAP-012A |
| W7 | Roberto venue + routes | MAP-010, MAP-011, data-033 |
| W7 | Neighborhood product | MAP-012 |
| W8 | OG / share previews | MAP-023 |

**Do not start before MAP-005:** heatmaps, multi-agent map fan-out, Computer-use map CLI, Contextual View widget, ADK as CopilotKit HttpAgent.

---

## 14. Advanced roadmap (post-MVP)

- Extended Component Library mobile sheet (single loader rule)
- Numbered pins + rental price badges on markers
- Marker collision + custom cluster renderers
- `route_cache` + commute intelligence on rental cards
- MAP-002A full ADK agent package
- Vector hybrid for attractions (VEC-* + data-001)
- Itinerary map mode (trips TRIP-* + map column)

---

## 15. Exact files to create / update

### Create (recommended new tasks — §17)

| File | Purpose |
|------|---------|
| `tasks/data/tasks-data/data-033-route-cache-schema.md` | `route_cache` for MAP-011 |
| `tasks/data/tasks-data/data-034-maps-geo-inventory.md` | lat/lng + place_id coverage matrix |
| `tasks/maps/MAP-034-advanced-marker-ux-polish.md` | Post-MVP marker UX bundle |
| `tasks/maps/MAP-DOC-001-refresh-maps-prd-repo-truth.md` | Fix stale §1.2 (or edit maps-prd directly) |

### Update (no code — planning)

| File | Change |
|------|--------|
| `tasks/maps/docs/maps-prd.md` §1.1–1.2 | Mark shipped: vis.gl, MapContext, grounding, attribution, tests |
| `tasks/maps/MAP-005-places-proxy-cache.md` | Note migrations **already applied** — scope = edge + wiring only |
| `tasks/data/tasks-data/data-007-cache-audit.md` | Add `depends_on: MAP-005` for post-proxy hit-rate |
| `tasks/data/tasks-data/INDEX-data.md` | Add § Maps data (data-033, data-034) |
| `.claude/hooks/_deferred/advanced-marker-needs-mapid.mjs` | Promote to active PreToolUse |

### Shipped reference (audit evidence)

| Path | Role |
|------|------|
| `mdeapp/src/platform/maps/map-context.tsx` | Pin state |
| `mdeapp/src/platform/maps/merge-pins-by-category.ts` | Category merge |
| `mdeapp/src/components/maps/ChatMap.tsx` | Map + AdvancedMarker |
| `mdeapp/src/mastra/lib/google-places-client.ts` | Places + masks |
| `mdeapp/src/mastra/tools/search-grounded-places.ts` | Grounding tool |
| `services/adk-grounding/main.py` | Sidecar |
| `supabase/migrations/20260515043737_places_cache_schema.sql` | Cache DDL |

---

## 16. Tests to add

| Test | Type | Blocks |
|------|------|--------|
| Cache hit on repeated `getPlaceDetails` | Vitest/integration | MAP-005 Done |
| `places-proxy` field mask header logged | Edge unit | MAP-005 |
| RLS negative on cache tables (anon) | SQL/manual | data-007 |
| Card click → pin highlight sync | Playwright | MAP-015 regression |
| Pin click → card scroll sync | Playwright | MAP-015 regression |
| Map ID missing in prod build | Vitest/env | MAP-008 |
| Attribution on all grounded cards | Playwright | MAP-002 |
| Mobile viewport map + sheet | Playwright | MAP-014 |
| Browser Places POST blocked | e2e ✅ exists | keep |
| Quota log increment | Vitest | grounding-quota |
| `compute_routes` duration parse `"180s"` | Unit | MAP-011 |

---

## 17. Additional tasks — recommendations

### Keep in `tasks/maps/` (app layer) — **no duplicates needed**

Existing open specs are sufficient for the MVP spine:

| ID | Status | Notes |
|----|--------|-------|
| MAP-005 | Not started | **#1 priority** — edge + cache wiring (DDL already live) |
| MAP-006 | Not started | After 005 |
| MAP-010 | Not started | Roberto autocomplete |
| MAP-011 | Not started | Routes — needs **data-033** |
| MAP-012 / 012A | Not started | Neighborhood intel |
| MAP-023 | Not started | Static maps OG |
| MAP-002A | Not started | P2 — correct defer |

### Add to `tasks/data/tasks-data/` — **2 new data tasks recommended**

Maps Supabase work was split across MAP specs and venue data-001/007/008. Gaps for the **data track**:

| Proposed ID | Title | Priority | Why | Unblocks |
|-------------|-------|----------|-----|----------|
| **data-033** | `route_cache` schema + RLS + TTL | P2 | Missing per audit-supabase; MAP-011 needs it | MAP-011 |
| **data-034** | Maps geo inventory matrix | P1 | apartments/events/restaurants/tourist lat/lng + `google_place_id` coverage; complements data-001 | MAP pin proof, data-009 |

**Do not duplicate MAP-005 into data-034** — proxy/cache **implementation** stays MAP-005; data-007 remains **audit/backfill** after proxy ships.

### Add to `tasks/maps/` — **2 optional app/doc tasks**

| Proposed ID | Title | Priority | Why |
|-------------|-------|----------|-----|
| **MAP-034** | Advanced marker UX polish | P2 | User list: z-index ring, price badges, numbered pins, collision, mobile sheet, a11y labels |
| **MAP-DOC-001** | Refresh maps-prd repo truth | P0 doc | §1.2 stale — blocks accurate audits |

### Corrections to existing specs

1. **MAP-005** — Remove "ship migrations" from acceptance; migrations exist. Acceptance = edge fn + mdeapp read-through + hit-rate evidence.
2. **maps-prd.md §Repo truth** — Update "Built / Not started" to match `tasks/archive/maps-A/` + open MAP-005+.
3. **data-007** — Add dependency on MAP-005 for meaningful hit-rate audit.
4. **INDEX.md numbering** — MAP-003 never existed (correct per NUMBERING.md).

### Skill-driven improvements (no new tasks required)

| Skill | Action |
|-------|--------|
| **mde-maps** | Use `references/security-and-optimization.md` before any new Places surface |
| **gemini** | Re-verify model IDs before MAP-012 generative hood copy |
| **google-agents-cli-adk-code** | MAP-002A only — keep MVP on FastAPI sidecar |
| **mastra** | New map tools = `createTool` + Zod; register in single concierge/router agent |

---

## 18. Final recommendation

**The architecture in maps-prd is correct and largely implemented.** Sofía should not re-scaffold MapContext or switch map libraries.

**Immediate priority (unchanged):**

```text
MAP-005 → MAP-006 → MAP-012A → MAP-012 → MAP-010 → MAP-011
Parallel: prod ADK deploy, MAP-DOC-001, data-034 geo inventory
Before MAP-011: data-033 route_cache
```

**Do not add:** second map loader, browser Places key, ADK as CopilotKit orchestrator, or extra map-only Mastra agents until post-MVP.

**Score path:** 74 → **83/100** after MAP-005 + prod ADK + MAP-006; **90+** after full 001–012 spine + data-033/034.

---

## Appendix A — Disk vs PRD §1.2 correction table

| PRD claim (§1.2) | Actual (2026-05-27) |
|------------------|---------------------|
| No vis.gl | **Installed** — `@vis.gl/react-google-maps@^1.8.3` |
| No MapContext / ChatMap | **Shipped** — `platform/maps/`, `components/maps/ChatMap.tsx` |
| No searchGroundedPlaces | **Shipped** — `search-grounded-places.ts` |
| No GroundingAttribution | **Shipped** — `GroundingAttribution.tsx` |
| No Map ID | **Partial** — MAP-008 Done; prod env required |
| No maps tests | **False** — vitest + playwright + smoke scripts |
| No places-proxy | **True** — still blocking |
| MAP-005–012 not started | **Partial** — 005, 006, 010, 011, 012 open; 001–004, 007B, 008, 009 Done |

---

## Appendix B — Verified best practices (external)

| Topic | Verified |
|-------|----------|
| Advanced Markers need Map ID | [Google Advanced Markers start](https://developers.google.com/maps/documentation/javascript/advanced-markers/start) |
| Places API New needs field masks | [Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/place-details) |
| Grounding Lite MCP endpoint | [Maps Grounding Lite](https://developers.google.com/maps/ai/grounding-lite) — `mapstools.googleapis.com` |
| Supabase service role safety | [RLS docs](https://supabase.com/docs/guides/database/postgres/row-level-security) |

---

*Tasks created 2026-05-27: data-033, data-034, MAP-034, MAP-DOC-001, MAP-002B, MAP-008B, MAP-011A; maps-audit-2 verified.*
