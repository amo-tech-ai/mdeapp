## MCP + mde-maps verification (2026-05-26)
Implemented **Sprint B** in order: MAP-002E (ops + code), GS-001 (search grounding foundation), full test battery.

## Execution order and testing strategy

| Step | Work | Verify |
|------|------|--------|
| 1 | **MAP-002E** — `RUNBOOK.md`, structured JSON logs, MCP **429 → no Gemini fallback** | `pytest test_main_invoke.py` (4 tests) |
| 2 | **GS-001** — `search_grounding.py`, `tool=search_grounded_events`, TS Zod parser | `pytest test_search_grounding.py` + Vitest |
| 3 | Contract + Dockerfile + README | Manual grep / file review |
| 4 | **Floor gate** | `npm run floor` exit 0 |
| 5 | **Cloud Run redeploy** | Not run here (needs your approval + ~5–10 min build) |

## Production files added/updated

**Sidecar (`services/adk-grounding/`):**
- `RUNBOOK.md` — triage flowchart, env vars, Cloud Logging queries, deploy command
- `invoke_logging.py` — `grounding_invoke` JSON logs (`source`, `pin_count`, `duration_ms`, `reason`)
- `search_grounding.py` — Gemini `googleSearch` parser; flag `ENABLE_SEARCH_GROUNDING=1`
- `main.py` — 429 `quota_exceeded` (fail-closed), logging on every invoke, `search_grounded_events` route
- `grounding_mcp.py` — `GroundingMcpError` with `status_code`
- `test_main_invoke.py`, `test_search_grounding.py`
- `Dockerfile` — copies new modules

**Mastra (`mdeapp/`):**
- `src/mastra/lib/search-grounding-types.ts` + `.test.ts` — fail-closed citation parse

**Docs:**
- `tasks/ADK/docs/sidecar-api-contract.md` — Search tool + `metadata.source` table
- `tasks/ADK/docs/14-cloud-run-reference.md` — links RUNBOOK

## Test results

```text
services/adk-grounding: 22/22 pytest
mdeapp:               222/222 Vitest
npm run floor:        exit 0
```

Key policy tests:
- MCP **429** → `reason=quota_exceeded`, **no** `search_via_gemini_maps`
- MCP **403** → `source=gemini-maps-grounding`
- `search_grounded_events` default → `search_disabled`
- Search metadata parser → real `http` URLs only, no invented links

Evidence: [`tasks/notes/MAP-002E-evidence.md`](tasks/notes/MAP-002E-evidence.md), [`tasks/notes/GS-001-evidence.md`](tasks/notes/GS-001-evidence.md)

## What you should run next (deploy + manual)

```bash
# 1. Prod mask v3 + MAP-002E logging (gcloud configured: dev-inscriber-445714-k0)
cd /home/sk/mdeai/services/adk-grounding
./scripts/deploy-cloud-run.sh

# 2. Manual G1 (Camila viewport)
cd /home/sk/mdeai/mdeapp && npm run dev
# Pan El Poblado → ask for cafés → pins follow viewport; CTAs on enriched cards

# 3. Enable Search grounding on staging only when ready
# Cloud Run env: ENABLE_SEARCH_GROUNDING=1
```

## Still open (not in this PR)

| ID | Why deferred |
|----|----------------|
| **GS-002** | CopilotKit citation UI |
| **GS-003** | Quota logging to Supabase |
| **GS-004** | Mastra freshness router calling sidecar |
| **MAP-002D** | Wire Mastra tool → `search_grounded_events` when flag on |
| **MAP-005+** | Post-MVP chain |

Architecture unchanged: **Grounding Lite MCP** primary; **Gemini Maps** fallback only on 403/empty pins; **Google Search** flag-gated, separate from Maps.



Cross-checked **`.agents/skills/mde-maps`** against **Google Maps Code Assist MCP** (`retrieve-instructions` + `retrieve-google-maps-platform-docs`). Updated [`tasks/maps/maps-checklist.md`](tasks/maps/maps-checklist.md) § executive + §3b and refreshed stale bits in [`tasks/maps/notes-3.md`](tasks/maps/notes-3.md).

### Aligned with official docs

| Area | Official (MCP) | mdeai implementation | Verdict |
|------|----------------|----------------------|---------|
| **Places deep links** | [`googleMapsLinks`](https://developers.google.com/maps/documentation/places/web-service/maps-links?utm_source=gmp-code-assist) GA — `placeUri`, `directionsUri`, `reviewsUri`, `writeAReviewUri`, `photosUri`; mask only what you need | Mask `details-v3-links-2026-05-26`; sidecar + TS client; `GroundedPlaceCard` CTAs; rollback `NEXT_PUBLIC_MAPS_DEEP_LINKS=false` | **Pass** — MAP-019 matches skill (“never build Maps URLs from lat/lng”) |
| **Directions URI** | Google generates link; origin = user **current location** on device | We surface `directionsUri` only when Places returns it | **Pass** |
| **Grounding Lite MCP** | `https://mapstools.googleapis.com/mcp`, `X-Goog-Api-Key`, `search_places` + optional `location_bias` circle | `grounding_mcp.py` + Medellín default `{6.2442, -75.5812}`; F50b forwards viewport | **Pass** |
| **Attribution** | Link previews must use `places.googleMapsLinks.placeUrl` (MCP naming) | Parser accepts `placeUri` **or** `placeUrl` | **Pass** |
| **Field mask / cost** | Every Places call needs `X-Goog-FieldMask` | Enrichment mask is explicit subset, not `googleMapsLinks` blob | **Pass** |

**Scorecard bump:** `googleMapsLinks` depth **45 → 82**; Phase 1 MVP **88 → 91** (see checklist).

### Intentional gaps (not regressions)

| Gap | Why |
|-----|-----|
| **`writeAReviewUri` / `photosUri`** | Deferred per MAP-004 — no UGC loop; photos via proxy |
| **Prod CTAs until redeploy** | Cloud Run **00009-bwv** may still serve v2-cached Details without `directionsUri`/`reviewsUri` |
| **Google Search grounding** | GMP MCP indexes Maps/Vertex, not `ai.google.dev/google-search` — stays **MAP-002D + GS-*** (Phase 2), not prod today |
| **Skill drift** | `references/maps-grounding.md` still says “Mode 1 for production” — **code uses Grounding Lite (Mode 2)**; fix in a doc-only pass |

---

## Recommended next implementation (ordered)

```text
1. ADK Cloud Run redeploy     → prod mask v3 + link fields in enrich cache
2. MAP-002 § G1 manual QA      → pan El Poblado → cafés → pins + CTAs match viewport
3. MAP-002E (P2, ~1–2h)        → README + metadata.source runbook; 429 ≠ Gemini Maps fallback
4. GS-001 + GS-003 → MAP-002D  → search_grounding.py + sidecar route (playbook 02)
5. GS-002 + GS-004             → citations UI + Mastra freshness router
6. Post-MVP chain              → MAP-005 → 006 → 012A → 012 → 011 → 023
```

**Sprint B (ops, no new pins):** MAP-002E is docs + light logging — Patricia/Sofía triage when MCP fails; criteria already in MAP-002 § G4.

**Do not:** Vertex [Grounding with Search](https://adk.dev/grounding/grounding_with_search/) for public web freshness; keep Mastra routing (not ADK `RoutedAgent`).

---

## Quick manual verify (Camila)

```bash
cd /home/sk/mdeai/mdeapp && npm run dev
# Pan map in El Poblado → concierge: "cafés near what I see"
# Expect: pins biased to viewport; enriched cards show Directions/Reviews when Google returns URIs
```

---

**Billing note:** Usage may incur GMP charges — **Places API (New)** (Details enrichment), **Maps Grounding Lite** (experimental, no charge today per docs), **Maps JavaScript API** (ChatMap). Restrict API keys per [Google guidance](https://cloud.google.com/docs/quotas/quotas?hl=en). Google sample snippets are Apache 2.0 where marked; you own security review of the full app. [Maps Platform Terms](https://cloud.google.com/maps-platform/terms).


Implemented **MAP-019** and **F50b** in order, with tests and runtime checks.

## Execution order (what we ran)

| Step | Task | Verify |
|------|------|--------|
| 1 | Mask v3 + sidecar `directionsUrl` / `reviewsUrl` | `pytest test_places_enrich.py` **8/8** |
| 2 | **MAP-019** — `GroundedPlaceCard` CTA row + schema propagation | Vitest grounded-card + pins tests |
| 3 | **F50b** — `MapCameraSync` → `mapUi.viewport` → `locationBias` on ADK invoke | Vitest summary + bias + client tests |
| 4 | Integration | `npm run floor` · `verify:grounding` · `smoke:map-pins` · `smoke:f50-pin-sync` |

## What shipped

**MAP-019 (Camila / Tourist)**  
- Field mask version `details-v3-links-2026-05-26` (TS + Python)  
- Sidecar merges `googleMapsLinks.directionsUri` / `reviewsUri`  
- Card buttons: **Directions**, **Reviews**, **Open in Google Maps** (`NEXT_PUBLIC_MAPS_DEEP_LINKS=false` → single link rollback)  
- `data-testid`: `grounded-directions-link`, `grounded-reviews-link`, `grounded-maps-link`

**F50b (Camila map-aware search)**  
- `MapCameraSync` — debounced `idle` → `MapContext.viewport`  
- `MapUiSync` pushes `viewport` into concierge `mapUi`  
- `search-grounded-places` accepts `locationBias` → POST to ADK  
- Concierge prompt: use `mapUi.viewport` when search should follow the visible map  
- `ChatMap` pin click → `panToPin` (not only `setSelectedPinId`)

## Test results

- **219/219** Vitest  
- **floor** exit 0 (lint, typecheck, build, test)  
- **verify:grounding** — 5 pins, `grounding-lite`  
- **smoke:map-pins** — 5 cards / 5 pins  
- **smoke:f50-pin-sync** — pass  

Evidence: [`tasks/notes/MAP-019-evidence.md`](tasks/notes/MAP-019-evidence.md), [`tasks/notes/F50b-evidence.md`](tasks/notes/F50b-evidence.md)

Trackers updated: [`changelog`](changelog), [`todo.md`](todo.md), [`tasks/progres.md`](tasks/progres.md), [`tasks/maps/INDEX.md`](tasks/maps/INDEX.md)

## What's next for `tasks/maps/`

| Priority | ID | Work |
|----------|-----|------|
| **Done** | **MAP-002E**, **GS-001** | Runbook + logs + search sidecar stub + TS types |
| **P2** | **Cloud Run redeploy** | Mask v3 links in prod (`./scripts/deploy-cloud-run.sh`) |
| **Phase 2** | **MAP-002D** + **GS-002–004** | Mastra wire + citation UI + quota |
| **Post** | **MAP-005** → **006** → **012A** → **012** → **011** → **023** | Proxy, nearby, hood intel, routes, OG |

**Manual check:** `cd mdeapp && npm run dev` → pan map in El Poblado → ask for cafés → confirm pins bias toward viewport and CTA row on enriched cards (Directions only when Google returns `directionsUri`).

**Deploy note:** Redeploy ADK Cloud Run so production enrichment uses mask v3; until then, new link fields appear only when sidecar cache misses or locally.


Updated [`changelog`](changelog), [`todo.md`](todo.md), [`tasks/progres.md`](tasks/progres.md), and [`tasks/maps/notes-2.md`](tasks/maps/notes-2.md) § “What's next”.

---

## Maps status (2026-05-26)

**MVP + Sprint A done.** Grounding Lite → enrich mask **v3** → `GroundedPlaceCard` CTAs + F50b viewport bias. Cloud Run **00009-bwv** still needs redeploy for prod v3 cache.

**Next** — MAP-002E ops, ADK redeploy, Phase 2 Search (specs only until coded).

| Bucket | IDs | Status |
|--------|-----|--------|
| **Done** | MAP-001–002, 004, 007B, 008, 013–018 (incl. B–F/E), F48–F50, **MAP-019**, **F50b** | 🟢 |
| **P2 next** | **MAP-002E**, ADK redeploy (mask v3), MAP-002 § G1 manual | ⚪ |
| **P2** | MAP-002E, MAP-011, MAP-012A→012 | ⚪ specced |
| **Phase 2** | MAP-002D + GS-001–004 | ⚪ specced |
| **Later** | MAP-005→006→009→010→023 | ⚪ |

---

## What’s next for `tasks/maps/` (recommended order)

### Sprint A — ✅ shipped 2026-05-26

1. ~~**MAP-019**~~ — directions/reviews CTAs + mask v3.
2. ~~**F50b**~~ — viewport → `locationBias`.
3. **MAP-002 § G1** — manual: pan El Poblado → café search → pins follow viewport.

**Verify:** `npm run dev` · `smoke:f50-pin-sync` · **redeploy ADK** for prod mask v3 links.

### Sprint B — parallel (ops + Search prep)

4. ~~**MAP-002E**~~ — Done (`services/adk-grounding/RUNBOOK.md`, structured logs, 429 guard).
5. ~~**GS-001**~~ — Done (sidecar `search_grounded_events` + TS types). **Next:** GS-003 + GS-002 + GS-004 → **MAP-002D** Mastra wire.

**Do not use** [Grounding with Search](https://adk.dev/grounding/grounding_with_search/) (Vertex datastore) — wrong product for public web freshness.

### Sprint C — post-MVP chain

```text
MAP-005 → MAP-006 → MAP-012A → MAP-012 → MAP-010 → MAP-011A→B → MAP-023
```

**Explicitly defer:** Live API, Interactions API, Street View AI, transit map layers (see [`maps/INDEX.md`](tasks/maps/INDEX.md)).

**Optional:** MAP-002A — adopt `google-adk` `McpToolset` without changing the Mastra HTTP contract.

---

## ADK alignment (from prior review)

Sidecar is **FastAPI + httpx**, not `google.adk` agents. That’s fine for Maps; for Search, either add a minimal ADK `Agent(tools=[google_search])` or keep REST like `gemini_maps_grounding.py` and document it. **Routing stays in Mastra** (GS-004), not ADK [RoutedAgent](https://adk.dev/agents/routing/) or [collaborative workflows](https://adk.dev/workflows/collaboration/).

---

## Tracker links

| File | Role |
|------|------|
| [`tasks/maps/INDEX.md`](tasks/maps/INDEX.md) | Authoritative step table |
| [`tasks/maps/maps-checklist.md`](tasks/maps/maps-checklist.md) | GMP audit + gaps |
| [`tasks/maps/notes-2.md`](tasks/maps/notes-2.md) | Gap analysis + P1 table |
| [`todo.md`](todo.md) | Sprint A/B/C checklist |
| [`tasks/progres.md`](tasks/progres.md) | % complete + maps row |

**Best next implementation PR:** **MAP-019 + F50b** together — highest persona impact, smallest scope. Want that scoped as a single task evidence template?