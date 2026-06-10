---
audit_id: 09-maps-audit
date: 2026-05-21
auditor: forensic maps review (Cursor)
scope:
  - tasks/maps/maps-prd.md
  - tasks/maps/MAP-001-platform-map-pipeline.md
  - tasks/maps/MAP-002-grounding-attribution.md
  - tasks/maps/F16-maps-clients-port.md
  - tasks/maps/F43-chat-three-panel.md
  - tasks/maps/INDEX.md
  - plan/prd/04-maps-grounding.md
  - .claude/skills/mde-maps/SKILL.md
  - github/maps/* (clone verify)
  - mdeapp/ disk truth
grading_legend:
  green: "≥85% — safe to execute as written"
  yellow: "65–84% — execute after listed corrections"
  red: "<65% — blocked or wrong order until fixed"
---

# Maps PRD + tasks — forensic audit (09)

## Executive summary

| Question | Verdict |
|----------|---------|
| **Will the maps plan achieve MVP goals?** | 🟡 **Conditional yes** — if you ship **MAP-001 → MAP-002** (merge MAP-003 into 002), then **F18 + F46/F41** on top. Full §8 MAP-004–012 is **not** task-spec’d yet. |
| **Overall plan correctness** | **74%** — strategy and repo picks are strong; **path drift**, **step-order conflicts**, and **missing MAP-003–012 specs** block a “100%” grade. |
| **Implementation order** | 🟡 **Mostly correct** at MVP track level; **PRD §8 table disagrees** with MAP-001 scope and `tasks/INDEX.md`. |
| **Skills + MCP alignment** | 🟡 **mde-maps** is the right skill; tasks **under-specify MCP pre-flight** (Code Assist + Mastra + optional interactive Maps MCP). |
| **`github/maps` components** | 🟢 **Clones present** — use **npm** from vis.gl + markerclusterer, **patterns** from grounding-lite sample + codelab; **avoid** react-wrapper + ADK runtime. |

**Real-world stake:** Camila asks *“1BR in Laureles near coworking”* — without MAP-001, the chat answers but **the map stays empty** (no shared `MapPin` contract, no `mergePinsByCategory`). Andrés ticket flow does not need maps; Roberto venue autocomplete is **MAP-010** (no spec file yet).

---

## Grading system

| Symbol | Range | Meaning |
|--------|-------|---------|
| 🟢 | 85–100% | Spec matches PRD, repo, skills, deps; executable |
| 🟡 | 65–84% | Direction right; fix listed items before Done |
| 🔴 | &lt;65% | Wrong deps, missing proof, or contradicts canon |

**Dimensions scored per artifact:** (A) PRD alignment (B) Repo truth (C) Deps/order (D) Skills/MCP/github (E) Acceptance/proof gates

---

## Disk truth (2026-05-21)

| Check | Result |
|-------|--------|
| `mdeapp/src/platform/contracts/` | 🔴 **Missing** |
| `MapContext` / `/chat` page | 🔴 **Missing** |
| `@vis.gl/react-google-maps` in `package.json` | 🔴 **Not installed** (README mentions W5+ only) |
| `mdeapp/.env.example` | 🟢 `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` + `MAP_ID` |
| `github/maps/react-google-maps` | 🟢 Cloned |
| `github/maps/grounding-lite-mcp-sample-app` | 🟢 Cloned |
| `github/maps/codelab-maps-platform-101-react-js` | 🟢 Cloned |
| `plan/maps/maps-prd.md` | 🔴 **Missing** — canonical copy lives at **`tasks/maps/maps-prd.md`** |
| `plan/prd/04-maps-grounding.md` link `../maps/maps-prd.md` | 🔴 **Broken** until symlink or move |
| Hooks `places-api-field-mask.mjs` | 🟡 Under `.claude/hooks/_deferred/` (promote per F16/MAP-004) |

---

## Skills & MCP — required vs task coverage

### Skill: `.claude/skills/mde-maps/`

| Requirement | PRD / skill | Task specs cite? |
|-------------|-------------|------------------|
| Load `references/architecture.md` before multi-API work | Skill load order | 🟡 PRD §10.6 only |
| **Code Assist MCP** (`mapscodeassist.googleapis.com`) — doc verification **dev only** | `references/maps-ai-code-assist.md` | 🔴 No task step |
| **Grounding Lite** (`mapstools.googleapis.com/mcp`) — runtime | `references/maps-grounding.md` § Mode 2 | 🟡 MAP-002 sample app only |
| **Interactive MCP** (`search_places`, …) — session QA, not prod | Skill § Interactive | 🔴 Not distinguished in MAP-002 |
| Field masks / Colombia rules | `places-api-web-service.md`, drafts v2 | 🟡 MAP-004 not written |
| Env: server `GOOGLE_PLACES_API_KEY` vs browser `NEXT_PUBLIC_*` | Skill § mdeAI environment | 🟢 PRD §3; 🟡 skill still says `VITE_*` (legacy Vite naming) |

**Correction (all maps tasks):** Add pre-flight block:

```text
Before Places/Grounding implementation:
1. mde-maps SKILL.md + references/maps-grounding.md
2. MCP google-maps-code-assist: retrieve-google-maps-platform-docs (Advanced Markers, field masks)
3. MCP user-mastra: @mastra/mcp MCPClient constructor (F16 / MAP-002)
4. Optional: interactive google-maps-code-assist search_places for localhost smoke — not shipped to browser
```

### MCP servers (workspace)

| Server | URL / type | Role in plan |
|--------|------------|--------------|
| **google-maps-code-assist** | `https://mapscodeassist.googleapis.com/mcp` | 🟢 Docs RAG — pre-PR |
| **Grounding Lite** | `https://mapstools.googleapis.com/mcp` | 🟢 Production discovery — wrap in Mastra |
| **user-google-maps-code-assist** (folder) | Same as above | Configure per `.cursor/MCP-GOOGLE-MAPS.md` / `.mcp.json` |

**Red flag:** Confusing Code Assist (no live `search_places` for prod) with Grounding Lite (live tools, API key). MAP-002 must call **mapstools**, not mapscodeassist.

---

## PRD §8 order vs MVP tasks — conflict matrix

| PRD §8 step | PRD says | Actual MVP task | Conflict |
|-------------|----------|-----------------|----------|
| 1 | MAP-001 pipeline | MAP-001 **also** installs vis.gl, `/chat` shell, AdvancedMarker | 🟡 Step 7 duplicated into step 1 (acceptable if documented) |
| 2 | MAP-002 tool | MAP-002 spec | 🟢 |
| 3 | MAP-003 attribution | **MAP-002 already includes attribution** | 🔴 Duplicate ID; INDEX says MAP-003 “hardening” |
| 7 | MAP-007 vis.gl `/chat` | MAP-001 + **F43** (MAP-007 polish) | 🔴 PRD table late; work moved early |
| 4–6, 8–12 | MAP-004–012 | **No task `.md` files** | 🔴 75% of MAP IDs are PRD-only |

**Recommended canonical MVP order (matches `tasks/INDEX.md`):**

```text
F09 ✅ + F13 ✅
  → MAP-001 (contracts + MapContext + vis.gl + /chat shell + mock/test pin)
  → MAP-002 (+ absorb MAP-003 attribution; drop separate MAP-003 MVP)
  → F18 (router)
  → F46 → F41 → F47 (real-estate lane)
  → F43 (polish; optional split MAP-007 label)
  → MAP-004+ when Camila needs Places proxy / nearby (post first pin demo)
```

---

## Per-artifact scores

### 1. `tasks/maps/maps-prd.md` (master plan)

| Score | **78%** 🟡 |

| Dimension | % | Dot |
|-----------|---|-----|
| A PRD/strategy | 88 | 🟢 |
| B Repo truth | 82 | 🟢 |
| C Order/deps | 62 | 🟡 |
| D Skills/MCP/github | 80 | 🟡 |
| E Proof gates | 75 | 🟡 |

**What’s strong**

- North star (“Maps = spatial truth, not AI brain”) matches mdeai personas.
- Repo table scores align with [`index.md`](../../index.md) §4 and [`github/maps/README.md`](../../github/maps/README.md).
- Correct **primary UI**: `@vis.gl/react-google-maps` from `github/maps/react-google-maps` — **not** `react-wrapper`.
- Correct **runtime grounding**: port `grounding-lite-mcp-sample-app` → Mastra tool; **not** ADK `ag-ui-adk-grounding-app` as orchestrator.
- Colombia constraints (no `generativeSummary`, attribution, field masks) match mde-maps.
- Anti-patterns §9.4 and localhost proof align with CLAUDE.md gate 9.

**Red flags / blockers**

| # | Severity | Issue |
|---|----------|-------|
| R1 | 🔴 | **Broken canonical path:** `plan/prd/04` and `github/maps/README` point to `plan/maps/maps-prd.md` — file is at **`tasks/maps/maps-prd.md`**. |
| R2 | 🔴 | **§8 step 3 MAP-003** duplicates MAP-002 attribution; confuses INDEX backlog. |
| R3 | 🟡 | **§8 step 7 vs MAP-001:** vis.gl + three-panel listed twice (step 1 and 7). |
| R4 | 🟡 | **Schema path split:** §4.4 / Appendix `src/lib/maps/actions.ts` vs `plan/prd/07` **`platform/contracts/`** — MAP-001 is correct; PRD appendix should be updated. |
| R5 | 🟡 | **Agent names:** §6 uses `conciergeAgent` / `rentalAgent`; W1 ships **`pingAgent`** until F18 — document rename gate. |
| R6 | 🟡 | **MAP-004–012** listed with files/tests but **no task specs** — plan over-promises vs backlog. |
| R7 | 🟡 | Skill env `VITE_GOOGLE_MAPS_API_KEY` vs mdeapp `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — use Next names in all new code. |

**Corrections**

1. Symlink or copy: `plan/maps/maps-prd.md` → `tasks/maps/maps-prd.md` (single SoT).
2. Merge **MAP-003 into MAP-002** for MVP; renumber MAP-003 = Places proxy **or** delete step 3 from MVP table.
3. Edit §8: note step 7 **partially satisfied by MAP-001**; MAP-007/F43 = polish only.
4. Unify schema location to `src/platform/contracts/` + `src/platform/maps/normalize-tool-output.ts`.
5. Add § “MCP pre-flight” referencing mde-maps Code Assist + Grounding Lite endpoints.
6. Add explicit **Google Maps Platform AI** subsection: use Grounding Lite + Places + vis.gl; defer Ask Maps / Immersive Navigation (consumer app).

**Will it achieve PRD goals?** 🟡 **Yes for MVP outcomes 3–4** after MAP-001/002; **no** for full §7.2–7.4 without authoring MAP-004–012 tasks.

---

### 2. MAP-001 — platform map pipeline

| Score | **76%** 🟡 |

| Dimension | % | Dot |
|-----------|---|-----|
| A PRD alignment | 82 | 🟢 |
| B Repo truth | 70 | 🟡 |
| C Deps/order | 88 | 🟢 |
| D Skills/MCP/github | 72 | 🟡 |
| E Proof gates | 78 | 🟡 |

**Real-world example:** Camila opens `/chat` — sidebar streams from `pingAgent`; a **test tool** returns two Laureles apartment pins; both appear on the map without wiping a prior `event` pin category. That is MAP-001 Done.

**github/maps — correct components**

| Use | Repo / package |
|-----|----------------|
| Map shell | `github/maps/react-google-maps` → npm `@vis.gl/react-google-maps` |
| Marker pattern | `website/src/examples/advanced-marker.mdx` |
| Cluster (later) | `codelab-maps-platform-101-react-js/solution` + `js-markerclusterer` |
| Runtime wiring | `CopilotKit/examples/integrations/mastra` (already F01) |

**Red flags**

| # | Issue |
|---|--------|
| M1 | §5 out of scope cites **“Places edge proxy (MAP-003)”** — PRD MAP-003 is **attribution**, not Places. Should say MAP-005 or MAP-004. |
| M2 | **Scope creep:** 8–12h for contracts + MapContext + vis.gl + `/chat` + tool + tests — high fake-Done risk; split “shell without vis.gl” optional milestone. |
| M3 | No **MCP pre-flight** (Code Assist: Advanced Markers + `mapId` requirement). |
| M4 | `prd_ref` includes `../../plan/maps/maps-prd.md` — **broken path**. |
| M5 | Installs vis.gl but **package.json today has zero** — AC should list `npm install @vis.gl/react-google-maps` explicitly. |

**Corrections**

1. Fix MAP-003 reference → MAP-004/005 for Places proxy.
2. Add workflow step 0: `npx skills` / read **mde-maps**; Code Assist doc pull for Advanced Markers migration.
3. Add `npm install @vis.gl/react-google-maps` + `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` in Goals.
4. Pin file paths to `platform/contracts/map-pin.ts` per `plan/prd/07` (not `lib/maps/actions.ts` only).
5. Evidence: Playwright `data-testid="map-pin"` count ≥ 1 (matches maps-prd §9.2).

**Commands/deps:** 🟢 `depends_on: [F09, F13]` correct. **Blocks** F33, F41, F46, MAP-002 — correct.

---

### 3. MAP-002 — grounding + attribution

| Score | **68%** 🟡 |

| Dimension | % | Dot |
|-----------|---|-----|
| A PRD alignment | 75 | 🟡 |
| B Repo truth | 65 | 🟡 |
| C Deps/order | 90 | 🟢 |
| D Skills/MCP/github | 70 | 🟡 |
| E Proof gates | 55 | 🔴 |

**Real-world example:** Tourist asks *“quiet cafés near Parque Lleras”* — `searchGroundedPlaces` calls **Grounding Lite MCP** (`mapstools.googleapis.com`), returns ≥3 pins with real `placeId`, UI shows **Google Maps attribution** on each card, one row in `grounding_quota_log`.

**Red flags**

| # | Issue |
|---|--------|
| G1 | **Too thin** for a P0 task — no workflow steps, no RLS migration sketch, no `useCopilotAction` mirror name. |
| G2 | **MAP-003 split** — PRD step 3 separate; this task already owns attribution → **merge MAP-003 here**. |
| G3 | **F16 overlap** — grounding client port should be **in MAP-002** or MAP-002 must depend on F16; today optional “fold” is ambiguous. |
| G4 | Missing **mde-maps** red flags: do not combine grounding + structured output in one Gemini call (see `maps-grounding.md`). |
| G5 | Missing **Mastra MCP** pre-flight (`@mastra/mcp` if wrapping MCP in-process vs raw HTTP). |
| G6 | `blocks: [MAP-003, F43]` — if MAP-003 absorbed, block MAP-004 instead. |

**Corrections**

1. Expand to full 10-section task template (workflow, tests, rollback, DoD).
2. Register tool + `useCopilotAction({ name: 'showGroundedPlaces', available: 'disabled', render })`.
3. Add migration: `grounding_quota_log` + RLS (≥1 policy) per CLAUDE.md.
4. Cite `github/maps/grounding-lite-mcp-sample-app/mcpServer.ts` + `services/groundingLiteService.ts` + `pageSize: 5` + Medellín `locationBias`.
5. Require **Code Assist MCP** check for attribution HTML (`translate="no"`) before PR.
6. Rename PRD MVP: eliminate standalone MAP-003 or make MAP-003 = quota dashboard only.

**Will achieve O4?** 🟡 Yes **if** expanded; 🔴 **no** as 46-line stub.

---

### 4. F16 — maps clients port

| Score | **62%** 🔴 |

| Dimension | % | Dot |
|-----------|---|-----|
| A PRD alignment | 70 | 🟡 |
| B Repo truth | 75 | 🟡 |
| C Deps/order | 45 | 🔴 |
| D Skills/MCP/github | 80 | 🟢 |
| E Proof gates | 70 | 🟡 |

**Real-world example:** Sofía runs Vitest — `callGroundingTool('search_places', { query: 'rooftop bar Provenza' })` returns places; breaker stays closed; **no** browser key involved.

**Red flags**

| # | Issue |
|---|--------|
| F1 | **`depends_on: [F13, F15]`** — F15 is **deferred** event workflow in `tasks/events/`; blocks maps client port on unrelated Path A. Should be `[F13, MAP-001]` or merge into MAP-002/004. |
| F2 | Target `mdeapp/src/mastra/lib/` vs PRD `src/lib/google/places-client.ts` — pick **one** tree (`mastra/lib` OK if documented). |
| F3 | `recordMastraRun` + service role — must stay **server-only** (Mastra process); task should forbid import from client components. |
| F4 | Duplicates MAP-002 (grounding) and MAP-004 (Places) — INDEX says merge; **do not run F16 standalone** on MVP track without owner decision. |

**Corrections**

1. Change `depends_on` to `[F13, MAP-001]` or status **Merged into MAP-002/004**.
2. Drop F15 dependency until event discovery ships.
3. Add Mastra MCP export verification steps (already in spec — keep).
4. On MVP track: execute grounding half in **MAP-002**, Places half in **MAP-004** (when written).

---

### 5. F43 — `/chat` three-panel polish

| Score | **71%** 🟡 |

| Dimension | % | Dot |
|-----------|---|-----|
| A PRD alignment | 78 | 🟡 |
| B Repo truth | 80 | 🟡 |
| C Deps/order | 75 | 🟡 |
| D Skills/MCP/github | 65 | 🟡 |
| E Proof gates | 68 | 🟡 |

**Real-world example:** Camila on her phone (390×844) opens `/chat` — map sheet slides up; tapping a rental pin highlights the card in the middle column.

**Red flags**

| # | Issue |
|---|--------|
| C1 | **Depends on F18** — router not required for layout polish; could run after MAP-002 with mock data. |
| C2 | Overlaps **MAP-001** (shell) and PRD **MAP-007** — clarify F43 = polish only. |
| C3 | Thin spec — no `extended-component-library` flag note (Post-MVP per PRD Appendix C). |

**Corrections**

1. `depends_on: [MAP-001, MAP-002]` — F18 optional for polish sprint.
2. Reference `CopilotKit/examples/canvas/mastra` for layout, not v2 travel (OSM).
3. Add Playwright `maps-mobile-390.spec.ts` to acceptance (from maps-prd §9.2).

---

### 6. `tasks/maps/INDEX.md`

| Score | **82%** 🟢 |

| Issue | Fix |
|-------|-----|
| `canonical_prd` → `../../plan/maps/maps-prd.md` | Point to `maps-prd.md` in same folder or fix symlink |
| MAP-003 row duplicates MAP-002 | Align with merged MVP |
| MAP-007 duplicates F43 | Cross-link “F43 = MAP-007 polish” |

---

### 7. Missing tasks MAP-003–012 (PRD only)

| Task ID | PRD step | Spec file | Score | Dot |
|---------|----------|-----------|-------|-----|
| MAP-003 | Attribution | — (merge 002) | **40%** | 🔴 |
| MAP-004 | Places client + masks | — | **35%** | 🔴 |
| MAP-005 | places-proxy + cache | — | **35%** | 🔴 |
| MAP-006 | Nearby Search | — | **35%** | 🔴 |
| MAP-007 | `/chat` vis.gl | F43 partial | **55%** | 🟡 |
| MAP-008 | Advanced markers + Map ID | — | **40%** | 🔴 |
| MAP-009 | Clustering | — | **40%** | 🔴 |
| MAP-010 | Autocomplete (Roberto) | — | **40%** | 🔴 |
| MAP-011 | Routes / commute | — | **35%** | 🔴 |
| MAP-012 | Neighborhood intel | — | **35%** | 🔴 |

**MVP requires MAP-001–003 per `mvp.md` — treat MAP-003 as merged into MAP-002** until a separate spec is justified.

---

## `github/maps` — component checklist (forensic)

| Repo | Score | Install vs reference | mdeai task |
|------|------:|----------------------|------------|
| `react-google-maps` | 98 | **npm** `@vis.gl/react-google-maps` | MAP-001, 008 |
| `grounding-lite-mcp-sample-app` | 96 | **Pattern** → Mastra tool | MAP-002 |
| `js-api-samples` | 94 | Reference masks/snippets | MAP-004+ |
| `js-markerclusterer` | 92 | **npm** `@googlemaps/markerclusterer` | MAP-009 |
| `codelab-maps-platform-101-react-js` | 91 | Copy AdvancedMarker+cluster | MAP-001/009 |
| `google-maps-services-js` | 90 | Edge / Mastra fetch | MAP-004–005 |
| `extended-component-library` | 88 | Post-MVP; **one loader** | MAP-007+ / F43 |
| `platform-ai` | 85 | Dev Code Assist docs | Pre-PR MCP |
| `ag-ui-adk-grounding-app` | 75 | UX only — **no ADK** | Reference |
| `react-wrapper` | 52 | **AVOID** | — |

---

## Best practices verification

| Practice | PRD | Tasks | mdeapp |
|----------|-----|-------|--------|
| `mapId` on `<Map>` for AdvancedMarker | 🟢 | 🟡 MAP-001 | 🔴 not wired |
| `X-Goog-FieldMask` every Places call | 🟢 | 🟡 F16/MAP-004 | 🔴 |
| No Places key in `NEXT_PUBLIC_*` | 🟢 | 🟢 | 🟢 .env.example |
| Grounding attribution on UI | 🟢 | 🟡 MAP-002 thin | 🔴 |
| `mergePinsByCategory` single writer | 🟢 | 🟢 MAP-001 | 🔴 |
| CopilotKit 1.55.2 only | 🟢 | 🟢 | 🟢 |
| Localhost + evidence for Done | 🟢 | 🟡 MAP-002 weak | — |
| MCP verify before external API code | CLAUDE.md | 🔴 missing in tasks | — |

---

## Critical fixes (priority order)

| P | Fix | Owner |
|---|-----|-------|
| P0 | Create `plan/maps/maps-prd.md` symlink → `../tasks/maps/maps-prd.md` | Docs |
| P0 | Merge MAP-003 into MAP-002; update PRD §8 + INDEX + mvp.md wording | Maps |
| P0 | Expand **MAP-002** to full task spec + RLS migration | Maps |
| P1 | Fix MAP-001 wrong MAP-003 reference; add npm install + MCP pre-flight | Maps |
| P1 | Change **F16** `depends_on` off F15; mark merged into MAP-002/004 on MVP track | Maps |
| P1 | Author **MAP-004** (Places + masks) before F16 standalone | Maps |
| P2 | Align PRD appendix paths with `platform/contracts/` | PRD |
| P2 | Update mde-maps skill env vars to `NEXT_PUBLIC_*` for Next.js | Skills |
| P2 | Author MAP-005–006 before “Show nearby” in F46 | Real-estate + maps |

---

## Success probability

| Milestone | Probability | Condition |
|-----------|-------------|-----------|
| MAP-001 Done (pins on `/chat`) | **75%** | 8–12h held; vis.gl install; mock tool only first |
| MVP O4 (`/chat` + grounding + attribution) | **65%** | MAP-002 expanded + MAP-003 merged |
| Full PRD §8 (MAP-012) | **35%** | Need 8 new task specs + 4–6 weeks |
| Camila O3 (rentals + pins) | **60%** | MAP-001 + F46/F41 after F18 |

---

## Summary scorecard

| Artifact | % correct | Dot |
|----------|------------:|-----|
| **maps-prd.md** | 78 | 🟡 |
| **MAP-001** | 76 | 🟡 |
| **MAP-002** | 68 | 🟡 |
| **F16** | 62 | 🔴 |
| **F43** | 71 | 🟡 |
| **INDEX.md** | 82 | 🟢 |
| **MAP-003–012 specs** | 38 avg | 🔴 |
| **Overall executable plan** | **74** | 🟡 |

**Bottom line:** The maps PRD is **directionally correct** and uses the **right `github/maps` repos**. The plan **will not** be “100% correct” until canonical paths, MAP-003 duplication, and **seven missing task specs** are fixed. **MVP can succeed** with MAP-001 → MAP-002 (incl. attribution) → real-estate lane → F43, using **mde-maps** + **Code Assist MCP** (dev) + **Grounding Lite** (runtime).

---

---

## Corrections applied (2026-05-21)

| P | Fix | Status |
|---|-----|--------|
| P0 | `plan/maps/maps-prd.md` symlink → `tasks/maps/maps-prd.md` | ✅ Done |
| P0 | MAP-003 merged into MAP-002; PRD §8 + `mvp.md` + INDEX | ✅ Done |
| P0 | Expand MAP-002 spec | ✅ Done (6–8h, workflows, RLS note, grounding client) |
| P1 | MAP-001 MAP-003 ref → MAP-005; MCP pre-flight; npm install | ✅ Done |
| P1 | F16 → **MAP-004**, deps off F15 | ✅ Done |
| P1 | Author MAP-004 before F16 | ✅ N/A — F16 renamed to MAP-004 |
| P2 | PRD appendix `platform/contracts` | 🟡 Partial — MAP-001 aligned; full maps-prd appendix TBD |
| P2 | mde-maps `NEXT_PUBLIC_*` | ⏸️ Open — skill still documents `VITE_*` |
| P2 | MAP-005–006 before F46 nearby | ⏸️ Specs still TBD |
| — | **Consistent numbering:** F43→**MAP-007**, [`NUMBERING.md`](../maps/NUMBERING.md) | ✅ Done |

*Next audit: re-run after `tasks/notes/MAP-001-evidence.md` exists and MAP-005 spec is authored.*
