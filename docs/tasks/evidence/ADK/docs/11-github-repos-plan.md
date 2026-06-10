---
doc_id: ADK-GITHUB-REPOS
title: GitHub repos & tutorials — ADK + Maps + Travel (mdeai)
version: 1.1
date: 2026-05-23
status: Active
canonical_roadmap: ./adk-roadmap.md
related:
  - ./prd-adk.md
  - ./adk-roadmap.md §2.1
  - ../maps/maps-prd.md
  - ../../github/maps/README.md
  - ../../github/copilotkit/README.md
---

# GitHub repos & tutorials — ADK + Maps + Travel

> **How to use this doc:** Pick repos by **phase**, clone only what you will diff in the next 2–4 weeks, and **never** import `github/**` into `mdeapp/src`. Scores are **mdeai reuse value** (fit for Mastra-first + ADK sidecar), not GitHub stars.

**Stack reminder:**

```text
Phase 1: CopilotKit + Mastra → Grounding Lite MCP + vis.gl + Places (New) → Supabase
Phase 2: + services/adk-grounding/ (Python) ← patterns from adk-samples + Greyisheep
Phase 3: Itinerary / travel depth ← cicerone, travel codelabs (not MVP)
```

---

## 1. Clone status (workspace today)

| Repo | Local path | Status | Action |
|------|------------|--------|--------|
| grounding-lite-mcp-sample-app | `github/maps/grounding-lite-mcp-sample-app/` | ✅ cloned | **Keep** — refresh before MAP-002 |
| ag-ui-adk-grounding-app | `github/copilotkit/ag-ui-adk-grounding-app/` | ✅ cloned | **Keep** — canonical ADK+CK reference |
| ag-ui-adk-grounding-app (dup) | `github/maps/ag-ui-adk-grounding-app/` | ⚠️ duplicate | **Do not use** — prefer `github/copilotkit/` |
| CopilotKit integrations/mastra | `CopilotKit/examples/integrations/mastra/` | ✅ monorepo | **Prod model** for `mdeapp` |
| CopilotKit integrations/adk | `CopilotKit/examples/integrations/adk/` | ✅ monorepo | **Reference** for sidecar layout |
| [google/adk-samples](https://github.com/google/adk-samples) | `github/adk/adk-samples/` | ✅ cloned 2026-05-23 | **Primary** Phase 2 — evals, skills, `travel-planner-google-maps-mcp` |
| [serkanyasr/mcp-agent-tool-adapter](https://github.com/serkanyasr/mcp-agent-tool-adapter) | `github/adk/mcp-agent-tool-adapter/` | ✅ cloned 2026-05-23 | MCP → ADK bridge for Grounding Lite |
| [GoogleCloudPlatform/agent-starter-pack](https://github.com/GoogleCloudPlatform/agent-starter-pack) | `github/adk/agent-starter-pack/` | ✅ cloned 2026-05-23 | Cloud Run / deploy templates — align with [`12-cloud-run-production-plan.md`](./12-cloud-run-production-plan.md) |
| [Neutrollized/adk-examples](https://github.com/Neutrollized/adk-examples) | `github/adk/adk-examples/` | ✅ cloned 2026-05-23 | `06_improved_travel_rec_agent`, MCP tutorials |
| ggalloro/cicerone | `github/adk/cicerone/` | ✅ cloned 2026-05-23 | Itinerary + Maps grounding patterns |
| okahu-demos/adk-travel-agent | `github/adk/adk-travel-agent/` | ✅ cloned 2026-05-23 | ADK + tracing demo — **mock** travel, not Maps |
| aiscalelearn/iPathPilot | `github/adk/iPathPilot/` | ✅ cloned 2026-05-23 | Phase 3 UX reference — fullstack, not Mastra |
| cablate/mcp-google-map | — | ❌ URL only | **Defer** — overlap with Grounding Lite |
| Yash-Kavaiya, srishti | — | ❌ URL only | **Bookmark** — Phase 3 review |

**Index:** [`github/adk/README.md`](../../github/adk/README.md) — when to open each folder.

---

## 1b. `github/adk/` — when to use each clone

| Clone | When (phase) | Open for | mdeai output |
|-------|--------------|----------|--------------|
| **adk-samples** | **Phase 2** start | ADK-SPIKE-01, `agents-cli eval`, sidecar scaffold | `services/adk-grounding/` layout + eval JSON |
| **adk-samples/…/travel-planner-google-maps-mcp** | **Phase 2** | Official ADK + Grounding Lite MCP agent | Tool list + `SKILL.md` patterns |
| **adk-samples/…/travel-concierge** | Phase 2 skim | MCP + Maps + Search in one product | Snippets only — **too many agents** for mdeai |
| **mcp-agent-tool-adapter** | **Phase 2** wiring | Connect ADK to `mapstools.googleapis.com/mcp` | `mcp_config.json` + loader code |
| **agent-starter-pack** | **Phase 2 deploy** | Cloud Run CI, observability | Deploy YAML — not app logic |
| **adk-examples/06_improved_travel_rec_agent** | **Phase 2** | Community Maps MCP travel rec | Nearby / travel tool shapes |
| **adk-examples/03_travel_rec_agent_w_maps_mcp** | Optional | Earlier Maps MCP sample | Compare; prefer `06` |
| **cicerone** | **Phase 2–3** | `build_grounded_itinerary` | `agent.py` + FastAPI `main.py` |
| **iPathPilot** | **Phase 3** | Multi-agent trip UI | UX ideas only |
| **adk-travel-agent** | Dev onboarding | ADK file layout, tests | **Not** Maps — mock bookings |

**Phase 1:** do **not** start in `github/adk/` — use `github/maps/grounding-lite-mcp-sample-app` + `mdeapp`.

---

## 2. Top GitHub repos (ranked for mdeai)

| # | Repo | Score | Best features | mdeai use case | How to use | Clone? |
|---|------|------:|---------------|----------------|------------|--------|
| 1 | [grounding-lite-mcp-sample-app](https://github.com/googlemaps-samples/grounding-lite-mcp-sample-app) | **99** | Grounding Lite MCP, places/routes/weather | Camila grounded search | **Model MAP-002** — Mastra tool shapes | ✅ `github/maps/` |
| 2 | [Greyisheep/ag-ui-adk-grounding-app](https://github.com/Greyisheep/ag-ui-adk-grounding-app) | **82**† | ADK + CopilotKit + AG-UI; Search/Maps tools | Generative UI + ADK tool split | **Reference** — not prod runtime | ✅ `github/copilotkit/` |
| 3 | [google/adk-samples](https://github.com/google/adk-samples) | **98** | Official agents, MCP, evals, deploy | `services/adk-grounding/` base | **`travel-planner-google-maps-mcp`** + evals | ✅ `github/adk/` |
| 4 | [ggalloro/cicerone](https://github.com/ggalloro/cicerone) | **88** | ADK travel + Maps grounding | Tourist itinerary (Phase 2+) | Prompts + tool flow only | ⬇️ shallow |
| 5 | [adk-samples PR #1975](https://github.com/google/adk-samples/pull/1975) | **93** | Travel agent + Maps MCP (upstream) | Future official sample | **Watch PR** — merge then pull `adk-samples` | 🔖 track |
| 6 | [cablate/mcp-google-map](https://github.com/cablate/mcp-google-map) | **72** | 18 Maps MCP tools (community) | Extra geo utilities | **URL review only** — maintenance risk | ❌ defer |
| 7 | [aiscalelearn/iPathPilot](https://github.com/aiscalelearn/iPathPilot) | **75** | Multi-agent trip, routes, cost | Advanced tourist planner | Phase 3 UX ideas | ❌ defer |
| 8 | [okahu-demos/adk-travel-agent](https://github.com/okahu-demos/adk-travel-agent) | **70** | ADK structure, tracing demos | Learning ADK layout | Read once; don’t architect from it | ❌ optional |
| 9 | [Yash-Kavaiya/Google-Map-AI](https://github.com/Yash-Kavaiya/Google-Map-AI) | **68** | Road trip MCP, routes, weather | Route-aware plans | Itinerary UX moodboard | ❌ defer |
| 10 | [srishti-portfolio/ai-travel-agent](https://github.com/srishti-portfolio/ai-travel-agent) | **65** | Small ADK + MCP travel agent | Simple pattern skim | 30-min review max | ❌ defer |

† Greyisheep **97** in generic travel lists; **82** here = mdeai penalty for Python-only prod path, no map panel, no Mastra — still essential as **reference**.

### Also required (not in travel top-10)

| Repo | Score | Local path | When |
|------|------:|------------|------|
| [CopilotKit/…/integrations/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) | **99** | `CopilotKit/examples/integrations/mastra/` | **Now** — production |
| [vis.gl/react-google-maps](https://github.com/visgl/react-google-maps) | **98** | `github/maps/react-google-maps/` | **Now** — npm + MAP-001 |
| [serkanyasr/mcp-agent-tool-adapter](https://github.com/serkanyasr/mcp-agent-tool-adapter) | **85** | `github/adk/mcp-agent-tool-adapter/` | Phase 2 — wrap Grounding Lite inside ADK |
| [GoogleCloudPlatform/agent-starter-pack](https://github.com/GoogleCloudPlatform/agent-starter-pack) | **92** | `github/adk/agent-starter-pack/` | Phase 2 deploy Cloud Run |
| [Neutrollized/adk-examples](https://github.com/Neutrollized/adk-examples) | **90** | `github/adk/adk-examples/` | `06_improved_travel_rec_agent` |

---

## 3. Which repos to clone (recommended)

### Clone / refresh `github/adk/` (complete set 2026-05-23)

```bash
cd /home/sk/mdeai
mkdir -p github/adk

for spec in \
  "https://github.com/google/adk-samples adk-samples" \
  "https://github.com/serkanyasr/mcp-agent-tool-adapter mcp-agent-tool-adapter" \
  "https://github.com/GoogleCloudPlatform/agent-starter-pack agent-starter-pack" \
  "https://github.com/Neutrollized/adk-examples adk-examples" \
  "https://github.com/ggalloro/cicerone cicerone" \
  "https://github.com/aiscalelearn/iPathPilot iPathPilot" \
  "https://github.com/okahu-demos/adk-travel-agent adk-travel-agent"; do
  set -- $spec; url=$1; dir=$2
  test -d "github/adk/$dir/.git" && git -C "github/adk/$dir" pull --ff-only || \
    git clone --depth 1 "$url" "github/adk/$dir"
done

# Maps + CopilotKit (outside github/adk)
git -C github/maps/grounding-lite-mcp-sample-app pull --ff-only 2>/dev/null || true
git -C github/copilotkit/ag-ui-adk-grounding-app pull --ff-only 2>/dev/null || true
```

### Do not clone (use URL + adk-docs-mcp)

| Repo | Why skip clone |
|------|----------------|
| **cablate/mcp-google-map** | Overlaps Grounding Lite + Places; third-party maintenance; 18 tools → scope creep |
| **iPathPilot**, **Google-Map-AI**, **ai-travel-agent** | Full-stack apps; wrong stack (not Mastra+CK); copy UX from docs only |
| **okahu-demos/adk-travel-agent** | Demo-quality; use `adk-samples` instead |
| **Second** `ag-ui-adk-grounding-app` under `github/maps/` | Duplicate — delete or ignore |

### Watch without clone

- **[adk-samples#1975](https://github.com/google/adk-samples/pull/1975)** — when merged, `git -C github/adk/adk-samples pull` and grep `travel` / `maps mcp`.

---

## 4. How to use each repo (by phase)

### Phase 1 — MVP (no ADK runtime in prod)

| Priority | Repo | Open when | Copy | Never copy |
|:--------:|------|-----------|------|------------|
| 1 | `grounding-lite-mcp-sample-app` | MAP-002 | MCP request/response, attribution | Python app shell into mdeapp |
| 2 | `CopilotKit/…/mastra` | F48–F50, runtime | `route.ts`, co-agent, e2e tests | — |
| 3 | `github/maps/react-google-maps` | MAP-001 | AdvancedMarker, `mapId` | Vendor lib source into `src/` |
| 4 | `github/copilotkit/ag-ui-adk-grounding-app` | F49 cards | `useCopilotAction` render patterns | `HttpAgent` in `mdeapp` |
| 5 | `github/maps/js-api-samples` | MAP-004 | Field mask examples | Entire sample apps |

### Phase 2 — ADK sidecar + Mastra wrappers

| Priority | Repo | Open when | Copy | Never copy |
|:--------:|------|-----------|------|------------|
| 1 | `github/adk/adk-samples` | ADK-SPIKE-01 | Evals, `SKILL.md`, deploy; **`python/agents/travel-planner-google-maps-mcp`** | Full `travel-concierge` monolith |
| 2 | `github/adk/mcp-agent-tool-adapter` | Wire Lite MCP into ADK | `app_client_adk.py`, `mcp_config.json` | LangGraph path (mdeai uses ADK only) |
| 3 | `github/copilotkit/ag-ui-adk-grounding-app` | `services/adk-grounding/agent.py` | `GoogleSearchTool`, `GoogleMapsGroundingTool` | Next.js runtime |
| 4 | `CopilotKit/…/integrations/adk` | Dockerfile, `dev:agent` | FastAPI + port 8000 | `HttpAgent` as mdeapp brain |
| 5 | `github/adk/agent-starter-pack` | Cloud Run deploy | CI + infra templates | Replacing Mastra deploy |
| 6 | `github/adk/adk-examples/06_*` | Nearby/travel rec tools | Maps MCP agent patterns | `03_*` distance bugs |
| 7 | `github/adk/cicerone` | `build_grounded_itinerary` | Itinerary + `google_maps_grounding` | Default city ≠ Medellín |

### Phase 3 — Travel depth

| Repo | Use |
|------|-----|
| **cicerone** + **PR 1975** | Itinerary + multi-day tourist |
| **iPathPilot** / **Google-Map-AI** | Route + cost UX only |
| **travel-agent-mcp-toolbox-adk** codelab | Supabase tool patterns (not Cloud SQL) |

---

## 5. Best articles & tutorials

| # | Link | Score | Best lesson | mdeai use |
|---|------|------:|-------------|-----------|
| 1 | [ADK MCP tools](https://adk.dev/tools-custom/mcp-tools/) | **99** | ADK ↔ MCP ↔ Grounding Lite | Phase 2 sidecar wiring |
| 2 | [ADK Skills (Google blog)](https://developers.googleblog.com/developers-guide-to-building-adk-agents-with-skills/) | **96** | Skills in `services/adk-grounding/skills/` | Dev + runtime skills split |
| 3 | [ADK + fancy frontends (AG-UI)](https://developers.googleblog.com/delight-users-by-combining-adk-agents-with-fancy-frontends-using-ag-ui/) | **95** | AG-UI protocol | CK generative UI |
| 4 | [CopilotKit: frontend for ADK (AG-UI)](https://www.copilotkit.ai/blog/build-a-frontend-for-your-adk-agents-with-ag-ui) | **94** | CK ↔ ADK bridge | Compare with **Mastra** path |
| 5 | [Cicerone (Medium)](https://medium.com/google-cloud/cicerone-an-adk-travel-agent-with-google-maps-grounding-f5ac1fc5b483) | **94** | Maps-grounded travel | Tourist Phase 2+ |
| 6 | [Travel agent + MCP toolbox codelab](https://codelabs.developers.google.com/travel-agent-mcp-toolbox-adk) | **92** | MCP + DB tools | Map to **Supabase** tools in Mastra |
| 7 | [Greyisheep Maps grounding (dev.to)](https://dev.to/greyisheepai/understanding-google-maps-grounding-with-adk-part-25-476) | **91** | Maps grounding flow | Same as repo #2 |
| 8 | [Codecademy ADK travel](https://www.codecademy.com/article/build-an-ai-travel-assistant-with-google-agent-development-kit-adk) | **83** | Onboarding | Cursor/agent training only |
| 9 | [ADK + MCP + Cloud Run (GCP blog)](https://cloud.google.com/blog/topics/developers-practitioners/build-a-multi-agent-system-for-expert-content-with-google-adk-mcp-and-cloud-run-part-1) | **87** | Sidecar deploy | Phase 2 `agents-cli deploy` |
| 10 | [ADK + AG-UI interactive (Medium)](https://medium.com/google-cloud/building-interactive-agentic-applications-using-adk-and-ag-ui-protocol-3a49ae6d3dc9) | **86** | Live map UX | Post-MVP streaming |

**Docs MCP:** use `adk-docs-mcp` for items 1–3 instead of stale training data — see [`notes.md`](./notes.md).

---

## 6. Features to copy (priority)

| Feature | mdeai example (persona) | Priority | Source repo / doc |
|---------|-------------------------|----------:|-------------------|
| Grounding Lite MCP | Camila: “quiet cafés Laureles” | **10/10** | #1 sample app |
| Search grounding | Tourist: “events tonight Provenza” | **10/10** | Greyisheep / ADK |
| Nearby lifestyle | Camila: “near this apartment?” | **10/10** | MAP-006 + Lite MCP |
| CopilotKit + AG-UI cards | Rental/event/restaurant cards | **10/10** | mastra + Greyisheep |
| MCP tool architecture | Mastra → MCP; Phase 2 ADK → MCP | **10/10** | adk.dev MCP tools |
| ADK evals (no fake places) | Sofía CI gate | **9/10** | adk-samples + `agents-cli` |
| Venue discovery | Roberto: “150-person rooftop” | **9/10** | Places New + MAP-010 |
| Travel itinerary | Tourist: “Saturday in Medellín” | **9/10** | cicerone (Phase 2+) |
| Route-aware day plan | Dinner → event → nightlife | **9/10** | Phase 3; Routes API |
| Cloud Run sidecar | Patricia deploy ADK | **8/10** | adk-samples + GCP blog #9 |

---

## 7. Implementation strategy (locked)

```text
1. Grounding Lite MCP first     (github/maps/grounding-lite-mcp-sample-app)
2. CopilotKit + Mastra prod     (CopilotKit/examples/integrations/mastra → mdeapp)
3. vis.gl + Places + cache      (github/maps/* + Supabase)
4. Greyisheep + adk-samples     (reference → services/adk-grounding/)
5. CopilotKit/adk example       (Docker/FastAPI layout only — NOT mdeapp runtime)
6. cicerone + PR 1975           (itinerary — after MAP-002 Done)
7. Travel hobby repos           (URL review only unless Phase 3)
```

**MVP pick (clone / open):**

```text
Phase 1 (prod path):
  ✅ github/maps/grounding-lite-mcp-sample-app
  ✅ CopilotKit/examples/integrations/mastra → mdeapp
  ✅ github/copilotkit/ag-ui-adk-grounding-app (UI patterns only)

Phase 2 (github/adk/ — all cloned):
  ✅ adk-samples              ← start ADK-SPIKE-01 here (travel-planner-google-maps-mcp)
  ✅ mcp-agent-tool-adapter   ← MCP bridge
  ✅ agent-starter-pack       ← deploy
  ✅ adk-examples             ← 06_improved_travel_rec_agent
  ✅ cicerone                 ← itinerary
  📖 adk-travel-agent         ← learn only
  📖 iPathPilot                ← Phase 3 UX only
  📖 CopilotKit/integrations/adk (monorepo)
```

---

## 8. Cursor workflow (review a repo)

1. **Check phase** — if Phase 1, stop at rows marked “Phase 2+”.
2. **Diff only** — `rg "GoogleMapsGroundingTool|search_places|useCopilotAction" <clone>/`.
3. **Extract** — Zod shapes → `mdeapp/src/lib/grounding/`; never paste `import` from clone.
4. **Verify** — Maps MCP `retrieve-instructions` for any API claim ([`mdeai-google-maps.mdc`](../../.cursor/rules/mdeai-google-maps.mdc)).
5. **Record** — note in `tasks/notes/MAP-###-evidence.md` which repo/file pattern was used.

---

## 9. Anti-patterns

| Don't | Do instead |
|-------|------------|
| Clone 10 travel repos | Clone **2** (adk-samples + cicerone) + use URLs for rest |
| Start from Greyisheep for `mdeapp` runtime | Start from **mastra** example |
| Add cablate MCP beside Grounding Lite in MVP | One Maps MCP path until quota understood |
| Import `github/**` into `mdeapp/src` | npm install + copy patterns |
| Build itinerary before MAP-002 attribution | Grounded pins first |

---

*Cross-links: [`adk-roadmap.md`](./adk-roadmap.md) §2.1 · [`prd-adk.md`](./prd-adk.md) §2 · [`github/maps/README.md`](../../github/maps/README.md)*
