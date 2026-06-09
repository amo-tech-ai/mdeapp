**Short answer:** Maps discovery is on the right *product* path (Grounding Lite MCP first, Gemini `googleMaps` only as fallback), but you are **not** using the [ADK grounding agents](https://adk.dev/grounding/google_search_grounding/) library yet — and **Google Search grounding is not shipped** at all. You should also **not** adopt [Grounding with Search](https://adk.dev/grounding/grounding_with_search/) unless Patricia later stands up a Vertex Agent Search datastore.

---

## What you have today

```text
Mastra (product OS)
  → HTTP POST /v1/grounding/invoke
    → grounding_mcp.py     → Grounding Lite MCP search_places  ✅ primary
    → gemini_maps_grounding.py → raw Gemini REST googleMaps   ✅ dev fallback only
    → (no google_search)   → citations[] always empty
```

Evidence: `services/adk-grounding/pyproject.toml` has **no `google-adk`** — only FastAPI + httpx. `main.py` never instantiates `Agent`, `LlmAgent`, or `google_search`.

That matches **MAP-002 Done** intent and [**MAP-002A**](tasks/maps/MAP-002A-ADK-agent-package.md) deferral, but task copy still says “MapsAgent + SearchAgent” while the repo only has one invoke path for places.

---

## ADK doc vs mdeai — two “Search” products (do not mix)

| ADK page | Tool | Data | mdeai? |
|----------|------|------|--------|
| [Google Search Grounding](https://adk.dev/grounding/google_search_grounding/) | `google_search` / `GOOGLE_SEARCH` | **Public web** — events, closures, news | **Yes** — MAP-002D + GS-* |
| [Grounding with Search](https://adk.dev/grounding/grounding_with_search/) | `VertexAiSearchTool` | **Private** Agent Search datastore | **No** unless you index internal docs (policies, sponsor PDFs) in Vertex |

Camila’s rentals and Tourist restaurant pins are **not** Agent Search — they are Maps + Supabase. Using Vertex “Grounding with Search” for `/chat` would be the wrong bill and wrong auth model (`GOOGLE_GENAI_USE_VERTEXAI`, datastore ID, etc.).

---

## Maps — correct pattern, partial ADK alignment

**What ADK recommends for Maps grounding:** Gemini `googleMaps` tool on an agent, with `groundingMetadata.groundingChunks` (maps chunks, not web).

**What mdeai does (better for pins):**

1. **Primary:** [Grounding Lite MCP](https://developers.google.com/maps/ai/grounding-lite) — direct `search_places`, stable `placeId`, aligns with Places enrichment (MAP-018B).
2. **Fallback:** `gemini_maps_grounding.py` — same API shape as cookbook/ADK, but **raw `generateContent`**, not `google.adk.tools`.

That split is **correct** per your own MAP-002 G4 / MAP-002E rules: don’t run Gemini Maps on every turn; **429 must not** trigger fallback.

**Gaps vs ADK/Google Search docs:**

- No parsing of `groundingSupports` for inline cite spans (optional Phase 2.1).
- `citations: []` on every invoke — Maps attribution uses `attribution[]`, not web citations (fine).
- Auth: sidecar uses `GOOGLE_GENERATIVE_AI_API_KEY` on REST — ADK [Gemini doc](https://adk.dev/agents/models/google-gemini/) also documents `GOOGLE_API_KEY` + `GOOGLE_GENAI_USE_VERTEXAI`; you’re on AI Studio path, which is fine for Cloud Run if keys live in Secret Manager.

---

## Google Search — not using ADK yet (planned correctly)

[ADK Google Search grounding](https://adk.dev/grounding/google_search_grounding/) pattern:

```python
from google.adk.agents import Agent
from google.adk.tools import google_search

Agent(..., tools=[google_search])
# → groundingMetadata: web chunks, web_search_queries, searchEntryPoint
```

**MAP-002D** correctly targets this, but **nothing in `services/adk-grounding/` implements it** — spec even says MVP stub `search_disabled`; `main.py` has no `search_grounded_events` tool branch.

When you ship Search, prefer the same **HTTP sidecar contract** Mastra already uses, whether you implement via:

- **A)** `google-adk` `Agent` + `google_search` (matches ADK docs, observability), or  
- **B)** Raw REST `tools: [{ google_search: {} }]` (matches playbooks / current Maps fallback style).

Either is valid; today you’re inconsistent — **Maps = REST**, **Search spec = “ADK Agent”** but no package.

**Do not** embed `searchEntryPoint` HTML in CopilotKit without legal review (ADK calls this out; your GS-002 already skips it).

**Interactions API:** [ADK Gemini page](https://adk.dev/agents/models/google-gemini/) notes `use_interactions_api=True` and `GoogleSearchTool(bypass_multi_tools_limit=True)` when mixing Search with custom tools — relevant for **GS-006** only; defer for Phase 1.

---

## Collaboration / dynamic workflows / routing — use Mastra, not ADK (today)

| ADK feature | Purpose | mdeai fit |
|-------------|---------|-----------|
| [Collaborative workflows](https://adk.dev/workflows/collaboration/) | Coordinator + subagents (`single_turn` / `task` / `chat`) | **Later** inside sidecar only if you add multi-agent ADK package |
| [Dynamic workflows](https://adk.dev/graphs/dynamic/) | Python `@node` graphs, HITL `RequestInput` | **Roberto HITL** already lives in CopilotKit `renderAndWaitForResponse` — keep there |
| [Agent routing](https://adk.dev/agents/routing/) | `RoutedAgent` (TS experimental) | **GS-004 / Mastra** should own “Search vs Places vs Supabase” — duplicate routing in ADK would fight `plan/maps/search-grounding-routing.md` |

**Improvement:** Treat ADK as a **thin Google intelligence microservice**; keep **intent routing in Mastra** (`conciergeAgent`, `rentalAgent`). Only move routing into ADK if you adopt MAP-002A full `LlmAgent` team — then mirror ADK `single_turn` for “search once, return JSON” subagents.

---

## Prioritized improvements

### P0 — align naming and ship Search on the same pattern as Maps

1. **Implement MAP-002D** as `search_grounding.py` + `tool: "search_grounded_events"` on invoke — parse `groundingChunks[].web`, `webSearchQueries`, return `citations[]` (GS-001 contract).
2. **Either** add `google-adk` and a minimal `SearchAgent` **or** document “REST-only sidecar, ADK docs are reference” and drop “SearchAgent” from MAP-002 diagrams to avoid Sofía grep confusion.
3. **Flag + quota:** `ENABLE_SEARCH_GROUNDING`, increment per invoke (not per chat turn) per [Gemini Search billing](https://ai.google.dev/gemini-api/docs/google-search).

### P1 — Maps hardening (still not “use ADK Maps everywhere”)

4. **Prod:** `GOOGLE_MAPS_SERVER_API_KEY` so fallback rate → MAP-002E alert threshold.
5. **F50b:** pass `locationBias` from map viewport into invoke (already in contract).
6. **MAP-002A (optional):** wrap MCP in ADK `McpToolset` **without** changing JSON contract — gets ADK retries ([429 handling](https://adk.dev/agents/models/google-gemini/)) if you configure `HttpRetryOptions`.

### P2 — ADK patterns worth stealing (not full framework migration)

7. **Subagent modes** ([collaboration doc](https://adk.dev/workflows/collaboration/)): if sidecar grows, `MapsAgent` = `single_turn`, `SearchAgent` = `single_turn`, coordinator = thin router — same as your architecture diagram, but real ADK.
8. **`groundingSupports`** in GS-002 for inline sentence ↔ source links (ADK + playbook).
9. **GS-006:** if Mastra tool + Search same turn, evaluate `bypass_multi_tools_limit` / Interactions API — don’t block MAP-002D on it.

### Explicitly skip (for mdeai Phase 1–2)

- [Grounding with Search](https://adk.dev/grounding/grounding_with_search/) / `VertexAiSearchTool` — no datastore, wrong auth story.
- ADK `RoutedAgent` in TypeScript — Mastra already routes; CopilotKit is UI only.
- ADK dynamic workflow HITL — duplicate of Roberto publish flow.
- Live API + Search combo — deferred per maps INDEX.

---

## Verdict table

| Capability | Using ADK library? | Using correct Google API? | Verdict |
|------------|-------------------|---------------------------|---------|
| **Maps discovery** | No (httpx MCP) | Yes (Grounding Lite) | ✅ Keep |
| **Maps fallback** | No (raw REST) | Yes (`googleMaps`) | ✅ Dev OK; minimize in prod |
| **Google Search** | No (not built) | N/A | ⚠️ MAP-002D |
| **Vertex Agent Search** | No | N/A | ✅ Correctly avoided |
| **Routing** | N/A (Mastra) | N/A | ✅ Right layer |
| **Multi-agent ADK 2.0** | No | N/A | Optional MAP-002A |

**Bottom line:** You’re **right** to separate Maps MCP from public Search and to keep Mastra as router. You’re **not yet** “using ADK grounding” in the sense of the linked docs — you’re using the **same Gemini tools via HTTP**. Next step: ship Search with the **same sidecar + metadata contract** as Maps fallback, and optionally adopt `google-adk` in MAP-002A for retries and agent structure without moving routing out of Mastra.

If you want, I can add a short “ADK alignment” section to `services/adk-grounding/README.md` and fix MAP-002’s diagram to say “FastAPI sidecar (ADK-style, not google-adk yet)” so tasks match disk.