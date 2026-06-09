
Your framing is right: **six small upgrades to existing MAP work**, not new systems. The specs already capture most of this; a few details need tightening so nobody builds the wrong thing.

---

## Verdict: mostly correct — 4 nuance fixes

| # | Your summary | Verdict | Add / fix |
|---|--------------|---------|-----------|
| 1 | Viewport → smarter bias | ✅ Correct | See nuance below |
| 2 | Gemini Maps fallback | ⚠️ Mostly | **429/quota does not fallback** |
| 3 | Full `googleMapsLinks` | ⚠️ Mostly | Not “sharing/nearby” URIs |
| 4 | Real routes | ✅ Correct | Phase 1 = card, not map polyline |
| 5 | Aggregate vs Insights | ✅ Correct | Spike **blocks** v1 build |
| 6 | Search vs Maps split | ✅ Correct | Already in MAP-002D + MAP-002 G4 |

---

### 1. MAP-002 — smarter location bias ✅

**Correct:** Laureles-heavy results when the map is on El Poblado is the real UX bug.

**Already in spec (MAP-002 § G1):**
```text
MapContext / F50b → Mastra search-grounded-places → ADK locationBias → Grounding Lite
```

**Nuances to add:**
- Default today is **Medellín city centroid** when `locationBias` is omitted — not literally “Laureles,” but same effect (fixed point, not viewport).
- Sidecar **already accepts** `locationBias`; the gap is **Mastra not forwarding** viewport yet.
- **Blocked on F50b** (viewport sync — still Not Started in INDEX).
- Phase 1 = **viewport center / hood**, not browser GPS (“near me” without geolocation permission).

Your before/after story is exactly what Camila should feel.

---

### 2. MAP-002 — Gemini Maps fallback ⚠️

**Correct:**
- Production path = Grounding Lite MCP → Places Details enrich.
- Fallback code exists in `gemini_maps_grounding.py`.
- Spec now documents triggers (MAP-002 § G4).

**Important correction — not all failures fallback:**

| Failure | Behavior (spec) |
|---------|-----------------|
| MCP **403** / referrer key block | ✅ Gemini Maps fallback |
| MCP returns **0 pins** | ✅ Gemini Maps fallback |
| MCP **429** / quota exhausted | ❌ **No** silent fallback — `adk_error` + quota hint |
| Gemini also fails | Fail-closed empty result |

So: **more reliable for key misconfig / empty MCP**, not a blanket “always fallback on any error.”

**Observability:** spec adds `metadata.source` logging + Patricia alert if `gemini-maps-grounding` >10% of volume. Full runbook → [**MAP-002E**](./MAP-002E-gemini-maps-fallback-runbook.md).

---

### 3. MAP-004 / 018B / 018F — Maps links ⚠️

**Correct:** Mindtrip-style CTAs beyond “Open in Maps.”

**Scope in amended specs (Phase 1 follow-on):**

| URI | Status |
|-----|--------|
| `placeUri` | ✅ Shipped |
| `directionsUri` | P1 — “Get directions” |
| `reviewsUri` | P2 — “Read reviews” |
| `writeReviewUri` | **Skip** Phase 1 |

**Correction:** Places `googleMapsLinks` does **not** expose separate “sharing” or “nearby” URIs the way you listed. Nearby discovery stays **MAP-006 / Grounding Lite search**, not a link field on Details.

Flow: **mask bump (MAP-004 §12 / 018B) → card buttons ([MAP-019](./MAP-019-google-maps-link-ctas.md))**.

---

### 4. MAP-011 — real routes ✅

**Correct:** `compute_routes_not_implemented` in `main.py` today.

**Amended split:**
- **011A** — sidecar MCP `compute_routes` (prerequisite)
- **011B** — Mastra tool + `CommuteCard` / `RouteDisplay`

**Phase 1 limits (still in spec):**
- DRIVE / WALK / TRANSIT modes ✅
- Commute **card** (minutes + distance) ✅
- **No** polyline on map, **no** live traffic, **no** turn-by-turn

Answers *“~15 min walk from this rental?”* in chat — not in-map routing.

---

### 5. MAP-012 — Aggregate vs Insights ✅

**Correct** product split:

| SKU | Good for |
|-----|----------|
| **Aggregate** | “How many cafés in Laureles?” (counts / rollups) |
| **Insights** | Richer territory signals (ratings density, category mix — if CO has data) |

**Amendment adds §0 spike** — 3–5 hoods × 2 categories, evidence file, then decision:

1. Aggregate enough in CO → v1 = Aggregate → `neighborhood_scores`
2. Insights needed + data exists → v1 = Insights
3. Both weak → v1 = **MAP-006 Nearby cache + curated `medellin.json`** (original plan)

Patricia analytics / hood cards **must not** start the migration until spike Done.

---

### 6. MAP-002D — Search vs Maps ✅

**Correct separation** — now explicit in MAP-002D header:

| Type | Task | Purpose |
|------|------|---------|
| **Google Search grounding** | **MAP-002D** | Web / promos / “this weekend” events — citations |
| **Grounding Lite MCP** | **MAP-002** (primary) | Place discovery + pins |
| **Gemini Maps tool** | **MAP-002 § G4** (fallback only) | When MCP blocked or empty |

MAP-002D is **not** Gemini Maps. That naming confusion is what the amendment fixed.

Also added: **per-query billing** (Gemini 3+), separate quota bucket from MCP.

---

## What you got exactly right

- These are **incremental upgrades**, not new architecture.
- **#1** is the biggest Camila UX win on `/` and `/rentals`.
- **#4** unblocks rental commute questions.
- **#6** prevents long-term ADK/Gemini doc drift.

---

## Suggested one-liner for `notes-2.md` (optional)

If you want a executive summary at the top:

> **Post-MVP maps = 6 follow-ons on existing MAP ids:** viewport bias (002+F50b), fallback rules (002 G4), deep links (004/018B/018F), routes (011A→B), analytics spike (012 §0), Search-only enablement (002D).

---

## Execution order (matches INDEX)

1. **004 §12 → 018B → 018F** — directions/reviews CTAs (~2h)
2. **002 G1 + F50b** — viewport-aware search
3. **011A → 011B** — commute cards
4. **012 §0** — CO spike (evidence only)
5. **002D** — Phase 2 Search grounding

Want the next step to be **implementing #3 (mask + directions CTA)** or **F50b for #1**?



Based on [`maps-checklist.md`](tasks/maps/maps-checklist.md) vs the MAP index and specs, here’s the gap analysis.

> **2026-05-26:** Existing tasks amended + **new specs filed:** MAP-019, MAP-002E, MAP-012A, MAP-023.

## Already covered — no new task

| Checklist item | Existing task |
|----------------|---------------|
| Nearby Search | **MAP-006** |
| Autocomplete (Roberto) | **MAP-010** |
| `compute_routes` | **MAP-011** (sidecar stub exists; task is right, execution isn’t) |
| Places proxy + search cache | **MAP-005** |
| Clustering | **MAP-009** |
| Google Search grounding (G3/G5) | **MAP-002D** |
| Gemini Maps Mode 1 fallback | Sidecar code + **MAP-002D** naming is misleading — see below |
| Viewport sync | **F50b** (core, not MAP) |
| Details cache | **MAP-018E** Done |

---

## Amend existing tasks — ✅ applied 2026-05-26

| Task | Amendment |
|------|-----------|
| **MAP-002** | § Post-ship follow-ons: **G1** dynamic `locationBias` (F50b); **G4** Gemini Maps fallback criteria + `gemini_maps_grounding.py` |
| **MAP-004** | §12 extended `googleMapsLinks` mask + version bump |
| **MAP-018B** | Post-ship follow-on: sidecar mask parity for directions/reviews URIs |
| **MAP-018F** | Post-ship follow-on: directions/reviews CTAs (after mask) |
| **MAP-011** | §0 **011A** sidecar `compute_routes` prerequisite (stub today); **011B** Mastra/UI |
| **MAP-012** | §0 Phase 0 Aggregate vs Insights CO spike |
| **MAP-002D** | Search vs Maps distinction; per-query billing; `groundingMetadata` contract |
| **places-mask-checklist.md** | Planned `PLACE_DETAILS_LINKS_MASK` row |
| **INDEX.md** | MVP exit + P1 follow-on table (018E Done; no stale “Next P1: 018E”) |

### New task specs (2026-05-26)

| ID | File | Priority |
|----|------|----------|
| **MAP-019** | [`MAP-019-google-maps-link-ctas.md`](./MAP-019-google-maps-link-ctas.md) | **P1** — Directions / Reviews / Open in Maps |
| **MAP-002E** | [`MAP-002E-gemini-maps-fallback-runbook.md`](./MAP-002E-gemini-maps-fallback-runbook.md) | P2 — ops runbook + observability |
| **MAP-012A** | [`MAP-012A-colombia-aggregate-insights-spike.md`](./MAP-012A-colombia-aggregate-insights-spike.md) | P2 gate — blocks MAP-012 |
| **MAP-023** | [`MAP-023-static-maps-event-previews.md`](./MAP-023-static-maps-event-previews.md) | P3 — Static Maps OG for Roberto |

---

## Amend existing tasks (high value) — superseded by table above

| Task | What to add from checklist |
|------|----------------------------|
| **MAP-002** | ~~G1 + G4~~ → **Done in spec** |
| **MAP-004** / **018B** | ~~googleMapsLinks~~ → **Done in spec** |
| **MAP-011** | ~~compute_routes DoD~~ → **Done in spec** |
| **MAP-012** | ~~Phase 0 spike~~ → **Done in spec** |
| **MAP-002D** | ~~Search grounding body~~ → **Done in spec** |
| **INDEX.md** | ~~stale 018E~~ → **Done** |

---

## New tasks — ✅ filed 2026-05-26

| ID | Spec | Effort | Priority |
|----|------|--------|----------|
| **MAP-019** | [google-maps-link-ctas](./MAP-019-google-maps-link-ctas.md) | ~2h | **P1** |
| **MAP-002E** | [gemini-maps-fallback-runbook](./MAP-002E-gemini-maps-fallback-runbook.md) | ~1–2h | P2 |
| **MAP-012A** | [colombia-aggregate-insights-spike](./MAP-012A-colombia-aggregate-insights-spike.md) | ~2–4h | P2 (gates MAP-012) |
| **MAP-023** | [static-maps-event-previews](./MAP-023-static-maps-event-previews.md) | ~2h | P3 |
| **MAP-020** | Grounding Lite `lookup_weather` | ~1–2h | P2 — **not yet filed** |

**Optional / defer (no MAP yet — OK):**

- Address Validation → fold into **MAP-010** acceptance criteria, not standalone
- Maps Datasets (comuna polygons) → **MAP-012+** or Patricia admin
- Street View / transit layers → Phase 2, no task until persona story
- Distance Matrix → note under **MAP-011** out-of-scope (already there)

---

## Do not file MAP tasks yet — ✅ agreed 2026-05-26

Future platform work; **not** MVP priorities. Same table in [`INDEX.md`](./INDEX.md#do-not-file-map-tasks-yet-phase-2-platform) + [`maps-checklist.md`](./maps-checklist.md#do-not-file-map-tasks-yet).

| Feature | Why defer |
|---------|-----------|
| Live voice AI | Too early |
| Gemini Interactions API | Architecture still evolving |
| Full multimodal live agent | Phase 2 |
| Street View AI | Nice-to-have |
| Transit overlays | Later (MAP-011 = text commute only) |
| Datasets admin analytics | After core UX |

**Correct decision** — Explorer **0/100** on these is intentional, not a gap to close with MAP ids.

---

## Belongs outside `tasks/maps/` (checklist §1b)

| Checklist | Where it should live |
|-----------|----------------------|
| **G2** `thinking_level: low` on router | `tasks/core/` or Mastra agent config task — not GMP |
| **G5** Tool combination spike | **MAP-002D** extension or ADK doc — after Search ships |
| **G6** Interactions API | Phase 2 platform — defer until Mastra path decision |
| **G7** Live API voice | Phase 2 WhatsApp — not maps track |

---

## Naming fix worth doing

**MAP-002D** is titled “Search grounding” but checklist sometimes points “Gemini Maps → MAP-002D”. That’s wrong:

- **MAP-002D** = [Google Search grounding](https://ai.google.dev/gemini-api/docs/google-search) (web citations)
- **Gemini Maps** fallback = **MAP-002E** (new) or § in **MAP-002**

---

## Recommended execution order (from checklist + deps)

```
MAP-019 (directions CTAs + mask)  ← P1, ~2h
F50b (viewport) + MAP-002 G1     ← parallel
MAP-002E (fallback runbook)      ← ops, can parallel
MAP-005 → MAP-006 → MAP-010      ← existing chain
MAP-012A spike → MAP-012         ← gate before hood analytics
MAP-011 (compute_routes)           ← sidecar stub → real
MAP-002D (Search)                  ← Phase 2
MAP-023 (Static OG)                ← Roberto marketing
MAP-020 (weather MCP)              ← not filed yet
```

---

## Bottom line

**Yes — 3–5 task changes:**

1. **Add:** MAP-019 (deep links), MAP-020 (weather MCP), MAP-002E (Gemini Maps runbook); optional MAP-012A spike.
2. **Amend:** MAP-002 (viewport bias + fallback doc), MAP-004/018B (mask), MAP-011 (implement stub), MAP-012 (Aggregate path), MAP-002D (Search billing/citations), INDEX.md (status).
3. **Don’t add MAP tasks for:** Interactions, Live API, thinking levels — route to core/Gemini backlog.

Want me to draft the MAP-019 / MAP-002E specs and patch INDEX + the amended sections in the existing MAP files?



Added **§1b Gemini API — built-in tools & agent features** to [`tasks/maps/maps-checklist.md`](tasks/maps/maps-checklist.md).

## How mdeai uses Gemini today

```text
gemini-3.5-flash (@ai-sdk/google)
  → Mastra createTool + Zod (custom function calling)
  → search-grounded-places → ADK → Grounding Lite MCP (primary geo)
  → Places Details enrich (NOT Gemini googleMaps on every turn)

Fallback only: gemini_maps_grounding.py → generateContent + googleMaps
```

## Gemini grades (new scorecard)

| Area | Score |
|------|------:|
| Model `gemini-3.5-flash` | **95** |
| Mastra custom function calling + Zod tools | **85** |
| Built-in **Google Maps** tool in prod | **15** (sidecar fallback) |
| Built-in **Google Search** tool | **0** |
| **Tool combination** (Search/Maps + custom) | **0** |
| `groundingMetadata` / citation widgets | **35** |
| Native **structured output** on replies | **45** (tools/memory use Zod) |
| **Interactions API** | **0** |
| **Live API** | **0** |
| **Gemini 3.5** thinking tuning | **40** |

**Overall Gemini built-in tools: 12/100** — intentional; geo goes through MCP + Places, not Gemini Maps on every turn.

## What to add (recommended G1–G7)

| P | Feature | Why |
|---|---------|-----|
| **G1** | Map viewport → ADK/Gemini `latLng` bias | Better “near me” when Camila pans the map |
| **G2** | `thinking_level: low` on router/simple turns | Latency/cost on tool-heavy chat ([3.5 docs](https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.5)) |
| **G3** | [**Google Search grounding**](https://ai.google.dev/gemini-api/docs/google-search) for event dates | Fresh facts when Supabase is empty — with quota + citations |
| **G4** | MAP-002D criteria: MCP vs Gemini Maps fallback | Document when sidecar uses [`googleMaps`](https://ai.google.dev/gemini-api/docs/maps-grounding) |
| **G5** | [**Tool combination**](https://ai.google.dev/gemini-api/docs/tool-combination) spike (Search + `search-events`) | Phase 2 — don’t merge with Maps built-in |
| **G6** | [**Interactions API**](https://ai.google.dev/gemini-api/docs/interactions) | Defer — Mastra owns threads; beta breaking changes |
| **G7** | [**Live API**](https://ai.google.dev/gemini-api/docs/live-api) voice | Phase 2 WhatsApp |

## Key invariants (from docs)

- **Don’t** replace Grounding Lite MCP with Gemini `googleMaps` in Mastra — you lose explicit pins + Places enrich pipeline.
- **Don’t** use Search/Maps grounding for structured pin JSON — use Mastra tools + Zod ([structured output](https://ai.google.dev/gemini-api/docs/structured-output) + Maps grounding don’t mix on one call).
- **Do** keep [`function calling`](https://ai.google.dev/gemini-api/docs/function-calling) via Mastra — already at **85/100**.
- **Prod stability:** stay on `generateContent` + Mastra until Interactions API exits beta (Google recommends this in [Interactions docs](https://ai.google.dev/gemini-api/docs/interactions)).

Full tables for Search, Maps, tool combination, function calling, structured output, Interactions, Live, and 3.5 Flash are in **§1b** of the checklist.Updated `tasks/maps/maps-checklist.md` with the Capabilities Explorer items you pasted. New sections:

## Added sections

| § | API | Rows |
|---|-----|------|
| **3b** | Places `googleMapsLinks` | placeUri ✅ (90), directions/photos/reviews/write-review URIs scored |
| **6** | **Places Insights API** | All 13 explorer capabilities — filters, brands, H3 hex, type breakdowns, schema/CO coverage |
| **7** | **Places Aggregate API** | Count + place-ID queries with operating status, type, price, rating filters |
| **8** | Maps Static API | URL, embed, size, format |
| **9** | Map Tiles + **Maps Datasets** | 2D/3D/SV tiles; CSV/GeoJSON/KML datasets |
| **10** | Maps Embed API | map / search / directions / SV iframes |
| **11** | **Geocoding API** | Forward/reverse, viewport/region restrict, entrances, outlines, landmarks, SV panorama |
| **12** | Maps JS API (extended) | Layers, SV, Fleet Engine (N/A), localization |

## New executive scores

- **Analytics SKUs (Insights + Aggregate):** 0/100 — not started
- **`googleMapsLinks` depth:** 45/100 — only `placeUri` in prod
- **Maps JS breadth:** 22/100 — core map + AdvancedMarker only

## Key mdeai callouts

1. **Places Insights** — Patricia / MAP-012 v2; never live in chat; verify **Colombia coverage** before committing.
2. **Places Aggregate** — simpler first step for MAP-012 neighborhood density vs hand-rolled Nearby loops.
3. **Quick win:** add `googleMapsLinks.directionsUri` to Details mask + “Get directions” on cards (~1h).
4. **Geocoding** — probe-only in `verify-maps-env.mjs`; product path stays Places + Grounding.
5. **Fleet Engine / Map Tiles / Embed** — explicitly N/A or skip for Phase 1.

Recommended additions table reordered with directions URI (#1) and Aggregate (#5) before full Insights (#6).

Source: [Google Maps Platform Capabilities Explorer](https://developers.google.com/maps/documentation/capabilities-explorer?hl=en)


Added a full [Google Maps Platform Capabilities Explorer](https://developers.google.com/maps/documentation/capabilities-explorer?hl=en) audit to `tasks/maps/maps-checklist.md` (linked from `INDEX.md`).

## Executive scores

| Metric | Score | Takeaway |
|--------|------:|----------|
| Phase 1 maps MVP (MAP-001–018) | **88/100** | Near max for what we committed to ship |
| Full product-relevant GMP (incl. backlog) | **46/100** | Expected — MAP-005–012 not started |
| Architecture fit | **94/100** | Grounding Lite → Details → proxy → vis.gl is correct |
| Cost / security | **90/100** | Masks, 018E cache, photo proxy, rate limit |

## What we're using well

- **Maps Grounding Lite** `search_places` — primary discovery (Camila/Tourist)
- **Places API (New)** Details + Photos — sidecar enrichment + card UI
- **Maps JS + Map ID + AdvancedMarker** — chat map panel
- **Supabase Details cache** — 018E on Cloud Run **00009-bwv**

## Highest-ROI additions (not using yet)

| P | Capability | Persona | Task |
|---|------------|---------|------|
| 1 | **Nearby Search** | Camila — walkable from rental | MAP-006 |
| 2 | **Place Autocomplete** | Roberto — venue picker | MAP-010 |
| 3 | **`compute_routes`** | Camila — commute Q&A | MAP-011 |
| 4 | **Marker clustering** | Dense pin UX | MAP-009 |
| 5 | **Places proxy + search cache** | Patricia — scale/cost | MAP-005 |
| 6 | **`lookup_weather`** (Grounding Lite) | Tourist — weather in chat | New / cheap add-on |

## Intentionally not maxing (correct for Phase 1)

- **Places `searchText` in chat** — would duplicate Grounding billing
- **Routes API polylines / Navigation SDK** — out of Mindtrip parity scope
- **Environment APIs** (Solar, Pollen, Air Quality) — no persona story
- **Gemini Maps grounding Mode 1** — deferred to MAP-002D; MCP is the prod path

The doc has six scored tables (AI/agentic, Maps web, Places, Routes, Environment, Analytics), a priority “should we add?” matrix, architecture diagram, and the operational run checklist preserved at the bottom. Re-audit when MAP-005–012 land or Google adds new Capabilities Explorer SKUs.# Maps track — status, changelog, audit

*All P1 next steps are done and tests are green.

## Shipped

**MAP-018E — Supabase cache**
- Wired `places_details_supabase.py` into `places_enrich.py` (memory L1 → Supabase L2 → Google)
- Dockerfile + `deploy-cloud-run.sh` updated with Supabase secrets/env

**Photo attributions (Google ToS)**
- Sidecar extracts `photos[0].authorAttributions` → `photoAuthorAttributions`
- Pipeline through schema, parser, `GroundedPlaceCard` UI

**Photo proxy hardening**
- `/api/places/photo` — 120 req/min per IP via `places-photo-rate-limit.ts`

**Docs**
- MAP-018 + MAP-018E → **Done**
- Evidence: `tasks/notes/MAP-018E-evidence.md`

## Test results

| Suite | Result |
|-------|--------|
| Vitest | **211/211** |
| Python `test_places_enrich.py` | **8/8** |
| `verify:grounding` | OK |
| `verify:grounding-enrichment` | 5/5 enriched pins |
| Playwright `maps-grounding.spec.ts` | **1/1** (flaky on cold start; passed on retry with `:3001` up) |

## Remaining ops (not code)

Redeploy Cloud Run with `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` so prod sidecar actually hits the cache table. Migration is already applied remotely.*Updated:** 2026-05-20 · **Index:** [`INDEX.md`](./INDEX.md)

---

## Status snapshot

| Area | State | Camila sees |
|------|-------|-------------|
| **Grounding discovery** | ✅ Done (MAP-002) | Real cafés from Google, not invented |
| **Map UX** | ✅ Done (MAP-014–017) | One map, card↔pin sync, fitBounds |
| **Places client** | ✅ Done (MAP-004) | Field masks, retry, pinned SDK |
| **Rich grounded cards** | ✅ Done (018B/C/D/F) | Photo, ★, $$, hours, map pins |
| **Chat UX dedupe** | ✅ Done (2026-05-20) | Cards only — no prose list / name attribution spam |
| **Details cache** | ✅ Done (MAP-018E) | Supabase cache live — 5 rows after Cloud Run **00009-bwv** |
| **mde-maps audit** | ✅ ~98/100 | Photo attributions + proxy rate limit closed |

**Mindtrip card parity:** ~**90%** (photo, rating, price, hours, map sync). Out of scope Phase 1: Save/trip, walking routes, `editorialSummary` blurb (cost).

**MAP-018 parent:** **Done** (018B–F + 018E + audit hardening 2026-05-20).

---

## Changelog

| Date | What |
|------|------|
| **2026-05-20** | Cloud Run **00009-bwv** — Supabase cache secrets + IAM; multi-test sweep 211 Vitest + 11 Playwright. Evidence: [`MAP-018-multi-test-sweep-2026-05-20.md`](../notes/MAP-018-multi-test-sweep-2026-05-20.md) |
| **2026-05-20** | MAP-018E Supabase `place_details_cache` + photo attributions + photo proxy rate limit. Evidence: [`MAP-018E-evidence.md`](../notes/MAP-018E-evidence.md) |
| **2026-05-20** | UX dedupe — concierge no prose lists; compact Maps attribution; hide grounded Map results when rich cards on. Evidence: [`MAP-018-ux-dedupe-evidence.md`](../notes/MAP-018-ux-dedupe-evidence.md) |
| **2026-05-20** | mde-maps + Google MCP audit PASS (~94/100). See audit section below. |
| **2026-05-25** | MAP-018B sidecar enrich (Cloud Run **00007-9wh**). Evidence: [`MAP-018B-evidence.md`](../notes/MAP-018B-evidence.md) |
| **2026-05-25** | MAP-018C/D/F — enriched schema, photo proxy, `GroundedPlaceCard`. Evidence: [`MAP-018C-F-evidence.md`](../notes/MAP-018C-F-evidence.md) |
| **2026-05-25** | MAP-014–017 map UX shipped |
| **Earlier** | MAP-001/002/004/007B/008/013 + F48–F50 |

---

## What's next (priority order) — updated 2026-05-26

| P | Task | Why | Effort |
|---|------|-----|--------|
| ~~1~~ | ~~**MAP-019**~~ | ✅ Done 2026-05-26 | |
| ~~2~~ | ~~**F50b**~~ | ✅ Done 2026-05-26 | |
| **3** | **MAP-002E** — fallback runbook | Patricia ops; playbook **01** | ~1–2h |
| **Phase 2** | **MAP-002D** + **GS-001–004** | Web Search + citations ([`grounding-search/tasks/`](../grounding-search/tasks/)) | ~1–2d |
| **Post-MVP** | MAP-005 → 006 → 012A → 012 → 011 → 023 | Proxy, nearby, hood intel, routes, OG | weeks |

**Trackers:** [`todo.md`](../../todo.md) · [`tasks/progres.md`](../progres.md) · [`changelog`](../../changelog).

**Done (do not redo):** MAP-018B–F/E · Cloud Run **00009-bwv** · sweep ([evidence](../notes/MAP-018-multi-test-sweep-2026-05-20.md)).

---

## Audit verdict: **PASS with 2 minor gaps**

MAP-018 (004 / 018A–F) matches **mde-maps** and **Google Maps Code Assist MCP** guidance. The architecture is sound; remaining items are attribution polish, proxy hardening, and planned cache work (018E).

---

### Architecture (locked pattern)

| Layer | Implementation | mde-maps / docs |
|-------|----------------|-----------------|
| Discovery | Grounding Lite MCP → ADK Cloud Run sidecar | Mode 2 in [`maps-grounding.md`](references/maps-grounding.md) |
| Enrichment | Place Details (New) REST, server-only | Places API (New), not legacy |
| Map UI | `@vis.gl/react-google-maps` + `mapId` + `AdvancedMarker` | MAP-001 / js-api rules |
| Photos | Details → `photoName` → `/api/places/photo` proxy | [Place Photos (New)](https://developers.google.com/maps/documentation/places/web-service/place-photos?utm_source=gmp-code-assist) |

Discovery vs enrichment split is correct. Live sidecar enrichment with 300s TTL is an interim step until **MAP-018E** (Supabase cache), which aligns with the skill’s “fetch once, cache in DB” direction.

---

### Checklist — what passes

**Field masks (MAP-004)**  
- Every call sends `X-Goog-FieldMask`; wildcards blocked in `validatePlacesFieldMask()`  
- MVP Details mask is Essentials + Pro + Enterprise, **not** Enterprise+Atmosphere  
- `editorialSummary` opt-in only via `PLACES_ENABLE_EDITORIAL_SUMMARY=true`  
- `generativeSummary` / `reviewSummary` excluded (per `places-mask-checklist.md`, stricter than the skill’s Phase-2 seeding example)  
- TS + Python masks synced via `PLACE_DETAILS_FIELD_MASK_VERSION = details-v2-mvp-2026-05-20`

**Billing (MCP-confirmed)**  
Per [SKU details](https://developers.google.com/maps/billing-and-pricing/sku-details?utm_source=gmp-code-assist):

- Details with `rating`, `priceLevel`, `currentOpeningHours`, `userRatingCount` → **Place Details Enterprise** (~$20/1k)
- Adding `editorialSummary` would bump to **Enterprise + Atmosphere** (~$25/1k) — correctly gated off
- `photos` in Details mask returns metadata only; each thumbnail load bills **Place Details Photo** separately — expected for 018D

**Security**  
- Server key via `requirePlacesApiKey()` — never `NEXT_PUBLIC_*`  
- `places-photo-proxy.ts` has no env key strings; route reads key server-side  
- `maps-security.test.ts` blocks client exposure of `GOOGLE_PLACES_API_KEY`  
- Photo URL uses `places/{placeId}/photos/{ref}/media?maxWidthPx=` — matches [getMedia REST spec](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places.photos/getMedia?utm_source=gmp-code-assist)  
- `maxWidthPx` clamped 1–4800 per docs

**Resilience**  
- `@googlemaps/places` pinned at **2.4.1**  
- TS: `withPlacesRetry` — 3 attempts, 429/500/503 + gRPC 8/13/14, jitter  
- Sidecar: 2 retries on 429/500/503, parallel cap 5, timeout 8s

**Maps URLs & attribution**  
- `googleMapsLinks.placeUri` used (`_maps_url()` in sidecar, `extractPlaceUri()` in TS) — not lat/lng-built URLs  
- `GroundingAttribution` renders grounding citations  
- Tests: 14/14 on client, security, photo route

**UI**  
- No browser Places JS `Place` class — enrichment stays server-side  
- `ChatMap` sets `mapId` on `<Map>` for every `<AdvancedMarker>`

---

### Gaps (non-blocking for MVP)

| # | Issue | Severity | Official basis |
|---|--------|----------|----------------|
| 1 | **Photo `authorAttributions` not surfaced** — sidecar extracts `photoName` only; card renders `<img>` with no attribution line | **Medium (ToS)** | [Place Photos (New)](https://developers.google.com/maps/documentation/places/web-service/place-photos?utm_source=gmp-code-assist): *“If `authorAttributions` includes a value, you must include the additional attribution wherever you display the image.”* |
| 2 | **`/api/places/photo` is unauthenticated** — valid `name` param + server key = quota burn vector | **Low–Medium** | [API key best practices](https://developers.google.com/maps/api-security-best-practices?utm_source=gmp-code-assist): restrict keys + limit proxy abuse |
| 3 | **018E Supabase cache not shipped** — 300s sidecar memory only; cold redeploy loses cache | **Planned** | mde-maps: cache Details at seeding; interim TTL documented in checklist |
| 4 | **Photo proxy `Cache-Control: max-age=86400`** — acceptable for cost; verify against photo ToS if you extend TTL | **Info** | Photos return short-lived URIs; 24h edge cache is a product call |

---

### Intentional deviations (not bugs)

1. **Custom cards vs Places UI Kit** — MCP defaults to Places UI Kit for cost; Mindtrip-style `GroundedPlaceCard` is a deliberate UX trade (Enterprise Details + Photo SKU vs UI Kit pricing).

2. **Per-turn enrichment vs “seed once”** — Skill golden rule targets batch seeding (PLACES-005-010). Chat-time enrichment is scoped in MAP-018B with TTL + rollback (`PLACES_ENRICHMENT_ENABLED=false`).

3. **Skill enrichment mask includes `generativeSummary`** — MAP-004 checklist overrides for MVP (US/India-only, attribution burden). Correct for Colombia/Medellín.

---

### Scorecard

| Area | Grade | Notes |
|------|-------|-------|
| Field masks & cost hygiene | **A** | Highest-SKU-wins understood; editorial gated |
| Key security | **A** | 2-key pattern, proxy, tests |
| Places API (New) usage | **A** | REST + pinned SDK, no legacy |
| Photo pipeline | **B+** | Correct API shape; missing attributions |
| Retry / resilience | **A** | Both TS and Python |
| Grounding architecture | **A** | Lite MCP + sidecar enrichment |
| Caching | **B** | Interim only until 018E |
| Map JS (vis.gl) | **A** | `mapId` + AdvancedMarker |

**Overall: ~94/100** — production-ready for Tourist/Camila café queries; fix photo attributions before wide prod traffic.

---

### Recommended next fixes (priority order)

1. Pass `photoAuthorAttributions[]` from sidecar → Mastra schema → `GroundedPlaceCard` (render when non-empty).  
2. Rate-limit or sign `/api/places/photo` (e.g. per-session token or middleware cap).  
3. Ship **MAP-018E** — durable `places_details_cache` keyed by `place_id + FIELD_MASK_VERSION`.

---

**Billing note:** Usage of Google Maps Platform products may incur costs against your GCP billing account, including:

- Maps Grounding Lite (MCP)
- Places API (New) — Place Details
- Places API (New) — Place Details Photo
- Maps JavaScript API (browser map)

Restrict API keys per [Google’s key restriction guide](https://docs.cloud.google.com/api-keys/docs/add-restrictions-api-keys). Use of Google code snippets is subject to the [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms).

Want me to implement gap #1 (photo attributions) or #2 (photo proxy rate limit) next?



## Mindtrip vs mdeai — gap review (2026-05-20)

Reference: `screenshots/mde/cafes.png`

### Per-card

| Mindtrip element | mdeai today | Status |
|------------------|-------------|--------|
| Photo thumbnail | ✅ `/api/places/photo` | **018D/F** |
| ★ rating + count | ✅ on card | **018C/F** |
| $$ price chip | ✅ | **018F** |
| Category / type | ✅ primary type chip | **018F** |
| Summary blurb | partial (address fallback; no editorialSummary) | cost-gated |
| Open now / hours | ✅ | **018F** |
| Open in Google Maps | ✅ | Done |
| Card → map highlight | ✅ | MAP-015 |
| Map fits all pins | ✅ | MAP-016 |

### Still out of scope (Phase 2+)

Save ♥ / trips, "Mentioned by", walking route chips, styled follow-up chips, price on marker.

**Bottom line:** Card chrome is **shipped**. Remaining work is **cache (018E)** + **polish**, not discovery.

---

## What's already shipped (don't redo)

```
✅ MAP-002   Grounding Lite + real titles
✅ MAP-004   Places client + MVP mask + retry
✅ MAP-014–017  Map UX (single mount, pin sync, fitBounds, mock cleanup)
✅ MAP-018B  Sidecar enrichment (Cloud Run 00007-9wh)
✅ MAP-018C  Mastra enriched schema + normalizer
✅ MAP-018D  /api/places/photo proxy
✅ MAP-018F  GroundedPlaceCard (Mindtrip-style)
✅ UX dedupe 2026-05-20 — cards-first chat, compact attribution
```

Camila's *"list cafés in medellin"* → photo cards + map pins. **Next:** durable cache (018E), not more discovery work.

---

## ~~Complete next steps~~ → superseded

See **What's next** at top of this file. Tracks 1–3 below are **historical** (completed 2026-05-25).

### Track 1 — Wire data to UI (~1 day)

**1. MAP-018C** — Mastra enriched schema *(2–3h)*  
Pass sidecar fields through to CopilotKit without breaking thin fallback.

| File | Change |
|------|--------|
| `adk-grounding-types.ts` | Enriched pin type |
| `search-grounded-places.ts` | Optional Zod fields |
| `normalize-tool-output.ts` | `subtitle`, rating meta |
| Vitest | Enriched + MCP-only fixtures |

**Verify:** `npm run test` + mocked enriched ADK JSON reaches `parseGroundedToolResult`.

---

**2. MAP-018D** — Photo proxy *(2h)* — **can parallel with C after types exist**

```
GET /api/places/photo?name=places/{id}/photos/{ref}
maxWidthPx=400 · server key only · Cache-Control 24h
```

**Verify:** Network tab shows `/api/places/photo?...` only — no `key=` in browser.

---

**3. MAP-018F** — `GroundedPlaceCard` *(3–4h)*

Replace `PlaceResultCard` in `groundedRender` with Mindtrip-style layout:

```
[photo]  Pergamino | Cafe - Laureles
         ★ 4.8 (1.7k)  $$  Café  [Open now]
         One-line blurb (Gemini fallback — NOT editorialSummary SKU)
         Open in Google Maps →
```

| Rollback | `NEXT_PUBLIC_RICH_GROUNDED_CARDS=false` |

**Verify:** Playwright asserts rating text or photo testid; screenshot matches Mindtrip **structure** (not social/trip features).

---

### Track 2 — Cost + scale (~half day)

**4. MAP-018E** — Supabase `places_details_cache` *(3h)*  
Replace sidecar 5-min in-memory TTL with durable cache keyed by `(place_id, field_mask_version)`.

**Verify:** Repeat Laureles query → cache hit log; Details calls drop on 2nd turn.

---

### Track 3 — MAP-018 Done gate

| # | Criterion |
|---|-----------|
| 1 | Café query: **photo or placeholder + ★ rating** on ≥1 card |
| 2 | No generic `"Place"` titles |
| 3 | Card click pans map |
| 4 | No server key in client network |
| 5 | `npm run floor` + Playwright green |

Then flip **MAP-018** → Done in `tasks/maps/INDEX.md`.

---

## Blurb strategy (Mindtrip text without billing spike)

Mindtrip blurbs may be editorial **or** AI-written. We **removed** `editorialSummary` from the default mask (+25% Details SKU). **018F** should:

1. Use agent prose from concierge turn when available  
2. Else optional **one Gemini sentence** from title + types + rating (cheap)  
3. Never request `generativeSummary` SKU in Phase 1  

That gets the *feel* of Mindtrip copy without Enterprise+Atmosphere billing.

---

## Suggested sprint (this week)

| Day | Work |
|-----|------|
| **1** | 018C + 018D (schema + photo route) |
| **2** | 018F UI + Playwright/visual check vs `cafes-1.png` |
| **3** | 018E cache + prod smoke on www |

---

## Visual target checklist (compare to your screenshot)

After 018F, Camila should see:

- [ ] Left-aligned **photo** on each card  
- [ ] **Star + count** next to title  
- [ ] **$$** chip  
- [ ] **Open now / Closed** badge when Google has hours  
- [ ] **One-line description** (AI, not editorial SKU)  
- [ ] Map with **5 named pins** + fitBounds (already works)  

Won't match yet (OK for MVP): save/trip, "mentioned by", walking route, follow-up chips.

Want me to start **018C + 018D** now? That's the critical path to make the next localhost screenshot look like Mindtrip cards.
Your screenshot is the **current Camila experience** after the last few weeks of maps work — not the final Mindtrip card yet. Here's what actually changed vs what you're still looking at.

## What you're seeing (and why it's better than before)

| Before (broken) | Now (your screenshot) |
|-----------------|----------------------|
| Generic **"Place"** on every card | Real names — **Café Zeppelin**, **Candelaria.cafe.bar**, **Café Noir**, etc. |
| Unreliable / localhost-only grounding | **Grounding Lite MCP** on Cloud Run — same flow on localhost and www |
| 5× duplicate attribution links | One clean **Maps grounding** block + compact **Sources: Google Maps** |
| Pins sometimes wrong or missing | **5 pins** on map — **Open map (5)** matches the card count |

That title fix (MAP-002 prod + sidecar `00005`) is the biggest visible win: the agent finds places, and the UI shows **actual café names**, not placeholders.

---

## UX polish you can't see in a static screenshot (but works on `/chat`)

These shipped in **MAP-014 → 017** and matter when Camila *uses* the map:

1. **MAP-015 — card ↔ pin sync**  
   Tap a card → map **pans to that pin** (`data-pin-id` + `panToPin`). Rental cards already did this; grounded cafés now do too.

2. **MAP-016 — fitBounds**  
   After a multi-café search, the map **frames all 5 pins** instead of leaving her zoomed on one corner.

3. **MAP-014 — one map on mobile**  
   Phone doesn't mount two hidden `ChatMap` instances — faster open, less memory.

4. **MAP-017 — mock pin cleanup**  
   Dev mock pins disappear when live grounded pins arrive — no ghost markers in e2e/prod.

5. **MAP-018C/D/F** — photo cards with ★, $$, hours (`GroundedPlaceCard` + photo proxy).

6. **UX dedupe (2026-05-20)** — no agent prose lists; compact attribution; Map results panel deduped.

---


## Completed (✅ Done)

Formal evidence: `tasks/notes/MAP-###-evidence.md`

| ID | Plain English | Persona example |
|----|---------------|-----------------|
| **MAP-001** | Pins flow from Mastra tools → map state → markers | Any search tool result shows up as a pin on `/chat`. |
| **MAP-002** | Google discovery via ADK sidecar + Grounding Lite MCP | *"quiet cafés near Laureles"* returns real places + attribution. |
| **MAP-002 prod** | Cloud Run `mdeai-adk-grounding` + Vercel env (ADK-CR-*) | Same query works on **www.mdeai.co**, not just localhost. |
| **MAP-013** | `verify-maps-env.mjs` checks browser key, server key, Places probe | Sofía runs floor and catches missing keys before deploy. |
| **MAP-008** | Every map has `mapId`; AdvancedMarker works | Pins render with custom styling, not deprecated markers. |
| **MAP-007B** | Copilot chat centered; map on the right | Desktop layout matches product mockups. |
| **F48 / F49 / F50** | 3-panel CopilotKit + generative cards + `panToPin` for rentals/events | Roberto’s rental search: click card → map jumps. |
| **MAP-014–017** | Single mobile map, café card↔pin, fitBounds, mock cleanup | Camila taps café card → map pans; all pins in view. |
| **MAP-004** | Server Places API (New) client + signed field masks | Details MVP mask; no wildcards; retry on 429/503. |
| **MAP-018B** | Sidecar batch Place Details after MCP | invoke → `rating`, `photoName`, `openNow` on wire. |
| **MAP-018C/D/F** | Enriched tool schema + photo proxy + rich cards | Photo thumbnails via `/api/places/photo`; ★ and $$ on card. |
| **UX dedupe** | No duplicate prose / attribution lists | New chat: cards + 1–2 sentence agent reply only. |

**Bonus (2026-05-25):** Real café titles on www; title recovery from attribution. Evidence: [`MAP-002-grounding-cards-evidence.md`](../notes/MAP-002-grounding-cards-evidence.md)

---

## Outstanding (❌ remaining)

### MVP — close MAP-018

| ID | Problem | Example |
|----|---------|---------|
| **MAP-018E** | No durable Details cache | Same Laureles café query bills 5× Details every session |
| **MAP-018 parent** | Done gate #5 (cache hit visibility) | Flip to Done after 018E |

### MVP — audit polish (optional before wide prod)

| Item | Problem |
|------|---------|
| Photo `authorAttributions` | ToS when Google returns photographer credit |
| Photo proxy rate limit | Unauthenticated `/api/places/photo` quota risk |

### Core (not MAP id)

| ID | Problem |
|----|---------|
| **F50b** | Map viewport not fully app-controlled |

### Post-MVP

| ID | When you'd care | Example |
|----|-----------------|---------|
| **MAP-005** | Traffic + cost at scale | Edge proxy + cache for all Places calls. |
| **MAP-006** | "What's near this apartment?" | Nearby search for Camila's rental detail page. |
| **MAP-009** | 30+ pins on map | Clustering when Laureles café search returns huge lists. |
| **MAP-010** | Roberto picks a venue | Autocomplete on `/host/event/new` venue field. |
| **MAP-011** | "How far from Poblado?" | Route preview polyline on map. |
| **MAP-012** | Neighborhood intel | "Is Laureles walkable?" summaries. |
| **MAP-002D** | Phase 2 | Google Search grounding (not Maps MCP). |
| **MAP-002A** | Phase 2 | Full Python ADK LlmAgent package (optional). |

**Do not execute:** MAP-007 (superseded by MAP-007B).

---

## What APIs we use (today)

```
Discovery           → Grounding Lite MCP (ADK sidecar)  → "find cafés in Laureles"
Enrichment          → Places API (New) Place Details    → photo, rating, hours (018B)
Photo display       → Place Photos (New) via /api/places/photo (018D)
Map display         → Maps JavaScript API + vis.gl       → pins on screen
Inventory           → Supabase                           → rentals, restaurant rows
Cache (interim)     → Sidecar RAM 300s TTL               → 018E replaces with Supabase
```

We **do not** use legacy Places API or browser Places JS for card data.

---

## One-line "what's next"

**Done:** MAP-001–002, 004, 007B, 008, 013, 014–017, 018B/C/D/F, UX dedupe ✅  
**Next P1:** **MAP-018E** (Supabase cache) → flip **MAP-018** Done  
**Then:** audit polish (photo attributions, proxy rate limit) → **MAP-005** at scale

---

## MAP-018 task files — do they need to be added?

**Yes — partially.** Per [`NUMBERING.md`](./NUMBERING.md) every executable step needs a `MAP-*.md` spec.

| ID | Separate file? | Why |
|----|----------------|-----|
| **018A** | **No** — use **[MAP-004](./MAP-004-places-grounding-clients.md)** | Already existed; scoped to `getPlaceDetails` + field masks for enrichment |
| **018B** | **Yes** ✅ [`MAP-018B`](./MAP-018B-sidecar-places-enrichment.md) | Cloud Run / Python — different repo path than mdeapp |
| **018C** | **Yes** ✅ [`MAP-018C`](./MAP-018C-mastra-enriched-grounded-schema.md) | Mastra + normalizer |
| **018D** | **Yes** ✅ [`MAP-018D`](./MAP-018D-places-photo-proxy.md) | Next.js API route |
| **018E** | **Yes** ✅ [`MAP-018E`](./MAP-018E-places-details-cache.md) | Supabase migration + sidecar cache |
| **018F** | **Yes** ✅ [`MAP-018F`](./MAP-018F-grounded-place-card-ui.md) | React UI |
| **MAP-018** | Parent only | Architecture + audit — links to children |

**Docs correction (MCP + mde-maps):** use `googleMapsLinks` / `placeUri`, not `googleMapsUri`. Place Details mask uses **top-level** field names. Photo path = `{photos[0].name}/media` with `maxWidthPx`.

**Google note:** Code Assist recommends Places UI Kit for cost — we **defer** it because CopilotKit generative cards are the product surface (MAP-018F).

### MAP-018 execution order (authoritative)

| Order | Task | Real-world outcome |
|------:|------|-------------------|
| 0 | MAP-014 → MAP-015 → MAP-016 | Mobile one map; tap café card → map pans; all pins in view |
| 1 | **MAP-004** (= 018A) | Server can `GET places/ChIJ…` with field mask |
| 2 | **MAP-018B** | Sidecar returns rating + photo ref on invoke |
| 3 | **MAP-018C** | Mastra tool passes enriched JSON to UI |
| 4 | **MAP-018D** + **MAP-018F** | Thumbnails + Mindtrip cards on www |
| 5 | **MAP-018E** | Repeat Laureles query hits cache — lower bill |
| 6 | **MAP-005** | Full edge proxy at scale |

---

## Quick reference — files you'll touch

| Area | Path |
|------|------|
| Sidecar / MCP | `services/adk-grounding/` |
| Mastra tool | `mdeapp/src/mastra/tools/search-grounded-places.ts` |
| Cards | `mdeapp/src/components/copilot/place-result-card.tsx`, `search-tool-renders.tsx` |
| Map | `mdeapp/src/components/maps/ChatMap.tsx`, `mdeapp/src/platform/maps/` |
| Places client (B1) | `mdeapp/src/mastra/lib/google-places-client.ts` |
| Env gate | `mdeapp/scripts/verify-maps-env.mjs` |

---

## Related ADK work (Done)

Cloud Run production (ADK-CR-00–06) is **Done** — required for MAP-002 on www. See `tasks/notes/ADK-CR-evidence.md`.
