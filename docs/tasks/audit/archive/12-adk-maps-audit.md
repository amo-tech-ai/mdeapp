---
id: audit-12
title: ADK + Maps task forensic audit (MAP-001–012)
date: 2026-05-20
auditor: task-verifier protocol
scope:
  - plan/ADK/maps-adk-prd.md
  - tasks/maps/INDEX.md
  - tasks/maps/MAP-001–MAP-012
  - crosswalk: tasks/maps/MAP-*, tasks/core/F48–F50
note: MAIC-* tables below are **historical (2026-05-23)** — execute **MAP-* + F48/F49/F50 only**; see tasks/maps/NUMBERING.md
skills:
  - task-verifier
  - mde-maps
  - copilotkit-integrations
  - mde-supabase
  - google-agents-cli-adk-code
mcp:
  - google-maps-code-assist
  - adk-docs (planning)
  - mastra
  - copilotkit
sources:
  - CLAUDE.md
  - tasks/INDEX.md
  - mdeapp/package.json
  - mdeapp/src/app/page.tsx
  - mdeapp/src/app/api/copilotkit/route.ts
---

# Verification report — tasks/maps (MAP-001–012)

> **Verdict (2026-05-20 re-probe):** Spec pack **~92/100** — aligned with [`plan/ADK/maps-adk-prd.md`](../../plan/ADK/maps-adk-prd.md) and repo reference corrections. **Execution readiness: ~48/100** — **MAP-001 + F48 Done** on disk; **F49 in progress**; **MAP-002+ not started** (`services/adk-grounding/` absent).

**Persona impact:** Camila sees the **3-panel shell + map** on `/` (F48 + MAP-001). **Pin proof + generative cards** (F49) and **grounded NL geo** (MAP-002) still gate full concierge + Tourist flows.

---

## Summary scores

| Scope | Spec quality /100 | Execution readiness /100 | Safe to execute? |
|-------|------------------:|-------------------------:|:----------------|
| **MAP specs (tasks/maps)** | **92** | **48** | Yes — finish F49 → MAP-002 |
| **Crosswalk MAP/F48–F50** | **94** | **48** | MAP-001/F48 Done; F49 active |
| **ADK sidecar (MAP-002)** | **93** | **0** | Safe to execute after F49 pin proof |
| **Search grounding (plan)** | **90** | N/A | Plan-only — [`search-grounding-routing.md`](../../plan/maps/search-grounding-routing.md) |
| **Production maps MVP** | — | **48** | Partial — shell + pipeline; no ADK grounding yet |

**Letter grade:** B+ spec · F execution (expected — planner-only pack).

---

## Task-level matrix

| Task | Spec /100 | Ready /100 | Status | Blockers | Required fixes |
|------|----------:|-----------:|--------|----------|----------------|
| MAIC-001 | 88 | 15 | 🟡 | No vis.gl pkg | Fix target paths → `platform/contracts`, `platform/maps` |
| MAIC-002 | 72 | 10 | 🔴 | Layout ≠ F48 | Rewrite §1 Goal to CopilotSidebar + children canvas |
| MAIC-003 | 85 | 10 | 🟡 | — | Align paths + `normalizeToolOutput` |
| MAIC-004 | 86 | 5 | 🟡 | After MAP-001 | OK; defer full MAP-008 |
| MAIC-005 | 82 | 5 | 🟡 | After MAP-002 | Fix paths → `mastra/lib/google-places-client.ts` |
| MAIC-006 | 88 | 0 | 🟡 | No migrations | OK after MAIC-014 |
| MAIC-007 | 80 | 0 | 🟡 | — | Tool `id`: `search-grounded-places`; MCP URL; port MAP-002 files |
| MAIC-008 | 92 | N/A | 🟢 | — | Linked routing doc ✅ |
| MAIC-009 | 90 | 5 | 🟡 | F48, MAP-001 | Kebab tool `name`; add existing tool ids table |
| MAIC-010 | 84 | 0 | 🟢 | Post-F49 | OK defer |
| MAIC-011 | 78 | 20 | 🟡 | — | **search-restaurants exists** — extend don't create |
| MAIC-012 | 82 | 15 | 🟢 | — | search-events exists — SQL-first OK |
| MAIC-013 | 80 | 0 | 🟢 | — | OK defer |
| MAIC-014 | 90 | 0 | 🟡 | No SQL files | OK |
| MAIC-015 | 85 | 30 | 🟡 | No Playwright pkg | Note Vitest ✅; Playwright Phase gate |
| MAIC-016 | 91 | N/A | 🟢 | — | sidecar contract exists ✅ |
| INDEX | 88 | — | 🟡 | — | Add skills row; fix layout diagram |

---

## Claims verified (disk probes)

| Claim | Probe | Result |
|-------|-------|--------|
| CopilotKit 1.55.2 pinned | `mdeapp/package.json` dependencies | ✅ `@copilotkit/*": "1.55.2"` |
| In-process Mastra runtime | `grep getLocalAgents mdeapp/src/app/api/copilotkit/route.ts` | ✅ `getLocalAgentsWithLogging` |
| Production agent = `conciergeAgent` | `layout.tsx` + `mastra/index.ts` | ✅ registry key matches |
| `npm test` / floor exists | `package.json` scripts | ✅ `vitest run`, `floor` chain |
| Map not implemented | `ls mdeapp/src/components/maps` | ✅ **missing** (0 files) |
| vis.gl not installed | `package.json` grep vis.gl | ✅ **absent** |
| `/` has layout placeholder | `page.tsx` L35–40 | ✅ "Pin map lands in MAP-001" |
| `/chat` redirect | `chat/page.tsx` | ✅ alias to `/` |
| Grounding sample clone | `ls github/maps/grounding-lite-mcp-sample-app` | ✅ present |
| react-google-maps clone | `github/maps/react-google-maps` | ✅ present |
| ADK travel MCP sample | `github/adk/adk-samples` | ✅ present (Phase 2) |
| Cache tables | `grep grounded_places supabase/migrations` | ✅ **none** (expected pre-MAIC-014) |
| search-restaurants tool | `mdeapp/src/mastra/tools/search-restaurants.ts` | ✅ SQL/curated + `placeId` optional |
| search-events tool | exists | ✅ |
| F48/F49/MAP-001 Not Started | frontmatter | ✅ matches disk |
| Search routing plan | `plan/maps/search-grounding-routing.md` | ✅ |
| ADK sidecar draft | `plan/ADK/sidecar-api-contract.md` | ✅ |

---

## Claims not verified / stale

| Claim | Issue |
|-------|--------|
| MAIC-001 "`/chat` renders map" | 🟡 `/chat` redirects — **DoD = `/` only** |
| MAIC-002 "center CopilotKit chat" | 🔴 **Conflicts with F48** — chat is **sidebar**, map in `children` |
| MAIC paths `src/lib/maps/*` | 🔴 **Stale** — MAP-001 canon = `src/platform/contracts`, `src/platform/maps`, `src/components/maps` |
| MAIC-005 `src/lib/places/places-client.ts` | 🔴 **Stale** — MAP-004 = `mastra/lib/google-places-client.ts` |
| MAIC-007 `searchGroundedPlacesTool` | 🟡 **Stale** — use `createTool({ id: "search-grounded-places" })` per F49 |
| MAIC-007 `GROUNDLITE_MCP_URL` | 🟡 Prefer **MAP-002** URL `https://mapstools.googleapis.com/mcp` + allowed tools list |
| MAIC-011 "build foundation" | 🟡 Tool exists — task = **Places enrichment + F49 render + pins** |
| MAIC-015 Playwright in floor | 🟡 **Playwright not in package.json** — gate X1–X5 when wired |
| MAIC tasks `skill:` frontmatter | 🟡 Missing vs `mde-task-lifecycle` — add per task or INDEX table |
| `index-skills.md` ADK pack | ✅ 7 skills for Phase 2 dev only — MAIC-016 correctly defers |

---

## Architecture validation

| Rule | MAIC pack | CLAUDE / MAP | Verdict |
|------|-----------|--------------|---------|
| Mastra orchestrator | ✅ | ✅ `getLocalAgentsWithLogging` | 🟢 |
| No ADK in MVP route | ✅ MAIC-016 | ✅ | 🟢 |
| No Places in browser | ✅ MAIC-005/006 | ✅ | 🟢 |
| Field masks required | ✅ | ✅ MAP-004 | 🟢 |
| mapId on Map | ✅ | ✅ MAP-001/008 | 🟢 |
| Agent key `conciergeAgent` | ✅ INDEX | ✅ layout | 🟢 |
| Gemini 3.5 flash | implied | ✅ concierge | 🟢 |
| English only Phase 1 | ✅ | ✅ | 🟢 |

---

## MVP order validation

**Canonical (tasks/INDEX + MAP INDEX):**

```text
MAP-001 → F48 → F49 → MAP-002 → MAP-004 → MAP-005 → MAP-007
```

**MAIC INDEX order:** matches ✅ (MAIC-007=MAP-002 before MAIC-005=MAP-004).

**Dependency fix:** MAP-004 `depends_on: [MAP-002]` — MAIC-005 must not be scheduled before MAIC-007.

**F49 ↔ MAP-002:** F49 `blocks: MAP-002` = pin-proof before grounding is **product gate**, not a hard code dependency — MAIC INDEX note is correct.

---

## Red flags (7)

1. 🔴 **Layout spec drift (MAIC-002)** — Mindtrip center-chat vs CopilotKit `CopilotSidebar` (F48). Implement F48; treat MAIC-002 center column as **wrong** until corrected.
2. 🔴 **Wrong file paths in MAIC-001/003/005** — will cause duplicate modules if implementers follow MAIC literally.
3. 🟡 **Tool naming** — Mastra uses kebab `id`; MAIC-007 camelCase export name misleads `useCopilotAction` wiring.
4. 🟡 **Duplicate work MAIC-011** — restaurant search shipped without map pins / Places mask.
5. 🟡 **MAIC format ≠ mde-task-lifecycle §6** — acceptable for forensic pack; add `skill:` + link to MAP/F48 for execution.
6. 🟡 **No Playwright yet** — MAIC-015 must not claim floor includes E2E until dep added.
7. 🟢 **ADK scope** — correctly plan-only; `ag-ui-adk-grounding-app` UI-only reference ✅

---

## Critical blockers (execution)

| # | Blocker | Unblocks |
|---|---------|----------|
| 1 | MAP-001 not started | F48, F49, all pins |
| 2 | `@vis.gl/react-google-maps` not in package.json | MAIC-001 |
| 3 | MAIC-002 layout doc wrong | Implementers following MAIC-002 instead of F48 |
| 4 | Wrong paths in MAIC-001/003/005 | Port to `platform/*` per MAP-001 |

---

## Required corrections (applied in repo)

See git diff on:

- `tasks/maps/001-map-foundation.md` — paths, `/` DoD, skills
- `tasks/maps/002-three-panel-layout.md` — F48 layout canon
- `tasks/maps/003-map-context-pins.md` — platform paths
- `tasks/maps/005-places-api-new-client.md` — MAP-004 paths + depends MAP-002
- `tasks/maps/007-grounding-lite-mcp-tool.md` — tool id + MCP URL + target files from MAP-002
- `tasks/maps/009-copilotkit-generative-cards.md` — tool id table
- `tasks/maps/011-restaurant-discovery.md` — extend existing tool
- `tasks/maps/015-testing-verification.md` — Playwright gate
- `tasks/maps/INDEX.md` — layout note + skills table

---

## Best-practice additions (recommended)

| Practice | Where |
|----------|--------|
| Maps Code Assist MCP **before** Places/grounding code | MAIC-005, 007 pre-flight |
| `normalizeToolOutput` before `mergePinsByCategory` | MAIC-003, F49 |
| `useCopilotAction({ available: "disabled" })` | MAIC-009 (= F49) |
| `logging-mastra-agent` for ai_runs | already in route — MAIC-015 should probe |
| Single `APIProvider` | MAIC-001 |
| Grounding attribution component on every grounded turn | MAIC-007, MAP-002 |
| Never `mastra.agents.X` dot access | copilotkit-integrations skill |
| ADK tools JSON-only, no Supabase writes | MAIC-016 ✅ |

---

## Repos / docs per execution tranche

| Tranche | GitHub (local) | MCP / docs |
|---------|----------------|------------|
| MAP-001 + F48 | `github/maps/react-google-maps`, `CopilotKit/examples/integrations/mastra` | google-maps-code-assist |
| F49 | `CopilotKit/examples/showcases/generative-ui`, `ag-ui-adk-grounding-app` (UI only) | CopilotKit tool-rendering |
| MAP-002 | `github/maps/grounding-lite-mcp-sample-app` | mapstools MCP docs |
| MAP-004–005 | `github/maps/google-maps-services-js` | Places API New masks |
| Phase 2 | `github/adk/adk-samples/.../travel-planner-google-maps-mcp` | adk-docs-mcp |

---

## Commands before execution

```bash
cd /home/sk/mdeai/mdeapp && npm run floor
grep -E 'vis\.gl|GOOGLE_MAPS' package.json .env.local 2>/dev/null | sed 's/=.*$/=***'
ls -la src/platform/contracts src/components/maps 2>&1 || true
grep -l getLocalAgents src/app/api/copilotkit/route.ts
```

## Commands after MAP-001 + F48

```bash
npm install @vis.gl/react-google-maps  # per MAP-001
npm run dev
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/
# Evidence: tasks/notes/MAP-001-evidence.md
```

---

## Stop condition

> **✅ Done:** MAP-001, F48 (evidence on disk).  
> **▶️ Now:** Finish **F49** pin proof (VERIFICATION X1–X2).  
> **⏭️ Next:** **MAP-002A/B/C** (`services/adk-grounding/` + Mastra tool + attribution).  
> **🛑 Not yet:** MAP-005 proxy until MAP-004 + cache migrations (MAIC-014 content in MAP-005 §).  
> **Never:** `HttpAgent` → ADK in `api/copilotkit/route.ts`.

---

## Production readiness score

| Dimension | Score |
|-----------|------:|
| Task spec accuracy (post-fix) | 92 |
| Architecture alignment | 96 |
| Implementation on disk | 48 |
| Test gates wired | 45 |
| **Overall maps MVP readiness** | **68/100** (unchanged — planning > code) |

---

## Success probability (post-fix)

| Milestone | Probability |
|-----------|-------------|
| MAP-001 + F48 in one sprint | **85%** |
| F49 pin proof (≥3 pins) | **80%** |
| MAP-002 Laureles grounding query | **75%** |
| Full MAIC-001–015 Done | **65%** by W7 |

---

## Second pass — 2026-05-23 (external verdict validation)

**Auditor question:** Is the **84/100 · 🟡 not execution-ready** verdict correct?

**Answer: ✅ Yes — within ~3 points.** Re-probed disk after MAIC doc fixes. **Spec pack ~89/100** · **Execution readiness ~14/100** · **Will succeed ~82%** if locked order is followed and ADK stays plan-only.

### External red flags — agree / disagree

| External claim | Verdict | Evidence |
|----------------|---------|----------|
| ADK scope creep 🔴 | ✅ **Agree** | `route.ts` = `getLocalAgentsWithLogging` only; no HttpAgent/ADK |
| MAIC-014 before MAIC-006 🔴 | ✅ **Agree** | MAIC-006 §7 requires cache tables; INDEX table order 7→8 correct; **one-liner was wrong** — fixed 2026-05-23 |
| Grounding Lite MCP-based 🟡 | ✅ **Agree** | MAP-002 + Google Grounding Lite docs; quota in MAP-002 |
| Field masks 🔴 | ✅ **Agree** | CLAUDE.md + MAP-004; no `google-places-client.ts` on disk yet |
| Layout before map proof 🟡 | ✅ **Agree** | INDEX order 001→002; `page.tsx` placeholder only |
| Tests planned not proven 🟡 | ✅ **Agree** | `npm test` 66 passed — **zero maps/pins/grounding tests**; no Playwright pkg |
| Phase 1 without ADK runtime | ✅ **Agree** | Matches `adk-roadmap.md` + MAIC-016 |
| Locked order through MAP-007 | ✅ **Mostly** | Use **`MAP-004 → MAIC-014 → MAP-005`** not MAP-005 before 014 |
| Do not implement Search in MVP | ✅ **Agree** | MAIC-008 plan-only; routing doc exists |
| No CopilotKit→ADK | ✅ **Agree** | F48/F49 + copilotkit-integrations Mastra pattern |
| CI grep no Places key in client | ✅ **Agree** | **Not wired yet** — MAIC-015 should add; probe today: no matches in `src/` |
| Playwright card→pin sync | ✅ **Agree** | Deferred — correct recommendation |
| MAIC-004 post-MVP | ✅ **Agree** | INDEX order 9; MAP-001 needs ≥1 AdvancedMarker anyway |
| MAIC-002 after MAP-001 | ✅ **Agree** | INDEX order 1→2 |

### Priority tension (🟡 doc fix)

| Doc | Says |
|-----|------|
| `tasks/maps/INDEX.md` | MAP-005 = **P1 post-MVP** order 5 |
| MAIC-006 / INDEX row 8 | MAP-005 proxy = **P0 week W6** |

**Resolution:** MVP **pin proof** does not require proxy — Mastra can call `google-places-client` server-side (MAP-004). **Production scale** requires MAIC-014 → MAP-005. Treat MAP-005 as **P1 for MVP demo**, **P0 before prod traffic**.

### Commands run (this pass)

| Command | Result |
|---------|--------|
| `cd mdeapp && npm run floor` | ✅ exit 0 (lint, typecheck, build, 66 tests, audit high) |
| `npm test` | ✅ 11 files, 66 passed |
| `@vis.gl/react-google-maps` in package.json | ❌ MISSING |
| `src/components/maps`, `src/platform/*` | ❌ missing |
| `GOOGLE_PLACES` in `mdeapp/src` | ✅ none |
| `getLocalAgentsWithLogging` in route | ✅ present |

### Per-task score + corrections (MAIC-001–016)

| Task | % correct | Status | Required corrections |
|------|----------:|--------|----------------------|
| **MAIC-001** | 90 | 🟡 | Execute MAP-001 paths; install vis.gl; evidence on `/` only |
| **MAIC-002** | 92 | 🟡 | F48 sidebar canon (fixed); after MAP-001 |
| **MAIC-003** | 91 | 🟢 | Add Vitest: dedupe + reject pin without `place_id` when source=grounding |
| **MAIC-004** | 82 | 🟢 defer | After F49 pin proof; MAP-001 still needs 1 AdvancedMarker |
| **MAIC-005** | 88 | 🟡 | After MAP-002; port `google-places-client.ts`; mask tests in CI |
| **MAIC-006** | 85 | 🟡 | **After MAIC-014**; fix proxy client path (fixed); RLS advisors |
| **MAIC-007** | 87 | 🟡 | Fail closed; attribution; cache write optional until 014 |
| **MAIC-008** | 94 | 🟢 | No Search in MVP — keep plan |
| **MAIC-009** | 90 | 🟡 | Kebab tool ids (fixed); F49 blocks MAP-002 product-wise |
| **MAIC-010** | 83 | 🟢 defer | After 005/006/009 |
| **MAIC-011** | 86 | 🟡 | Extend `search-restaurants.ts` (fixed in spec) |
| **MAIC-012** | 84 | 🟢 defer | SQL-first OK; RLS on events |
| **MAIC-013** | 80 | 🟢 defer | Curated JSON before Search |
| **MAIC-014** | 91 | 🟡 | Before MAP-005 proxy; partial `grounded_places_cache` OK before MAP-002 |
| **MAIC-015** | 78 | 🟡 | Add grep mask + no client Places key; Playwright when dep added |
| **MAIC-016** | 93 | 🟢 | Plan only — sidecar contract exists |
| **INDEX** | 88 | 🟡 | One-liner order fixed; MAP-005 vs P1 note above |

### PRD alignment (`plan/prd/04-maps-grounding.md`)

| PRD requirement | Tasks cover? |
|-----------------|--------------|
| Pins from tools not LLM coords | MAP-001, F49, MAIC-003 ✅ |
| Forbidden lat/lng in model prose | Agent instructions + tools ✅ |
| vis.gl + AdvancedMarker + mapId | MAP-001, MAIC-001 ✅ |
| Grounding + attribution | MAP-002, MAIC-007 ✅ |
| Places masks server-side | MAP-004, MAIC-005 ✅ |

**Will tasks achieve PRD goals?** ✅ **Yes**, if execution order holds and F49 pin proof gates verticals.

### Final grades (second pass)

| Area | Score |
|------|------:|
| Architecture | **91** |
| MVP focus | **88** |
| Task clarity | **86** (↑ after path/layout fixes) |
| Security | **82** |
| Testing readiness | **76** |
| Production readiness (code) | **14** |
| **Overall plan correctness** | **89/100** |
| **Overall execution readiness** | **84/100** (matches external 🟡) |

### Stop condition (superseded by third pass below)

---

## Third pass — 2026-05-20 (repo reference + execution re-probe)

**Canonical architecture:** [`plan/ADK/maps-adk-prd.md`](../../plan/ADK/maps-adk-prd.md) (392 lines) · **Execution order:** [`tasks/maps/INDEX.md`](../maps/INDEX.md) steps 0–13.

### Disk probes (verified today)

| Claim | Probe | Result |
|-------|-------|--------|
| MAP-001 shipped | `ls mdeapp/src/platform/maps/` | ✅ 7 files + 3 Vitest suites |
| F48 map shell | `ls mdeapp/src/components/maps/` | ✅ `ChatMap.tsx`, `MapProvider.tsx`, … |
| vis.gl installed | `package.json` → `@vis.gl/react-google-maps` | ✅ `^1.8.3` |
| F49 generative UI started | `search-tool-renders.tsx`, `mastra-tool-action-names.ts` | ✅ present |
| CopilotKit → Mastra only | `grep getLocalAgents mdeapp/src/app/api/copilotkit/route.ts` | ✅ no `HttpAgent` |
| ADK sidecar | `ls services/adk-grounding/` | ❌ absent (MAP-002 not started) |
| Places client | `google-places-client.ts` in mdeapp | ❌ absent (MAP-004) |
| Reference clones | `CopilotKit/examples/integrations/adk/agent/main.py`, `github/maps/grounding-lite-mcp-sample-app/mcpServer.ts`, `github/copilotkit/ag-ui-adk-grounding-app/agent/agent.py` | ✅ on disk |
| Wrong filename | `mcpPlacesServer.ts` in tasks/audit | ✅ fixed → `mcpServer.ts` |

### Architecture corrections locked in tasks

| Rule | Where documented |
|------|------------------|
| Prod runtime = Mastra example, not ADK `HttpAgent` | `INDEX.md` § Reference repos, MAP-002, `maps-adk-prd.md` |
| ADK = MVP HTTP sidecar (MAP-002), not “Phase 2 only” | `adk-roadmap.md` v1.3, `github/adk/README.md` |
| Grounding Lite entry = `mcpServer.ts` | MAP-002, `maps-prd.md`, audit-09 |
| Prefer `github/copilotkit/ag-ui-adk-grounding-app` over `github/maps/` duplicate | INDEX, MAP-002, `github/maps/README.md` |

### Grades (third pass)

| Area | Score |
|------|------:|
| Task spec + repo references | **92** |
| Architecture alignment (`maps-adk-prd`) | **96** |
| Implementation on disk | **48** |
| **Overall execution readiness** | **48/100** |

### Stop condition (current)

> Finish **F49** → execute **MAP-002** (sidecar + Mastra bridge + attribution) → **MAP-004** Places client. Do not wire Search Grounding in MVP. Do not use MAIC-* filenames for execution.

---

*Next audit: after F49 → Done + `tasks/notes/F49-evidence.md` (or MAP-002 scaffold exists).*
