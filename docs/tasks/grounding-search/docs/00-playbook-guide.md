---
title: How to use the official cookbook playbooks (mdeai)
updated: 2026-05-26
sources:
  - https://github.com/google-gemini/cookbook/blob/main/quickstarts/Grounding.ipynb
  - https://github.com/google-gemini/cookbook/blob/main/quickstarts/Search.ipynb (02-playbook lineage)
---

# How to use `01-playbook.md` and `02-playbook.md`

These files are **offline copies** of Google’s official Gemini cookbooks — for **reading, fixtures, and code porting**. They are **not** runnable docs in the mdeai repo (JSON notebook export + Colab-only secrets).

## What each file is

| File | Upstream | Primary topics |
|------|----------|----------------|
| **01-playbook.md** | [`quickstarts/Grounding.ipynb`](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Grounding.ipynb) | **Search** + **Maps** grounding, YouTube links, URL context |
| **02-playbook.md** | Search-as-tool notebook (Gemini 3.x) | **Search only**: unary API, chat loop, `grounding_metadata`, **Live API** (defer) |

**Rule:** Official docs win on API changes — refresh these exports when Google ships a new cookbook commit. Live links: [google-search](https://ai.google.dev/gemini-api/docs/google-search), [ADK Search grounding](https://adk.dev/grounding/google_search_grounding/).

---

## Best use by role

| Role | Use the playbooks to… |
|------|------------------------|
| **Sofía (implement GS-001 / MAP-002D)** | Copy request/response shapes into `search_grounding.py` + Vitest fixtures |
| **Lucía (QA)** | Build expected `webSearchQueries` / `groundingChunks` assertions from IPL example |
| **Patricia (ops)** | See that **one user prompt → multiple search queries** (billing) |
| **Anyone learning** | Read offline without Colab; grep for `grounding_metadata` |

**Do not:** run playbooks as production code, import Colab `userdata`, or treat matplotlib/code-execution cells as mdeai patterns.

---

## Section map → mdeai tasks

### From `01-playbook.md`

| Section | Use for mdeai | Task |
|---------|---------------|------|
| `#search_grounding` | `tools: [{ google_search: {} }]` body for ADK | **MAP-002D**, **GS-001** |
| Search response + `groundingMetadata` | Parser + citation list | **GS-001**, **GS-002** |
| `searchEntryPoint` HTML | **Skip Phase 1** — ToS/branding; optional Phase 2 | — |
| `#maps_grounding` | Understand Gemini Maps tool ( **not** prod path) | **MAP-002E**, compare to `gemini_maps_grounding.py` |
| `#url_context` | Verify ticket URL + web (Phase 2) | **GS-005** |
| `#yt_links` | **Skip** Phase 1 | — |

### From `02-playbook.md`

| Section | Use for mdeai | Task |
|---------|---------------|------|
| IPL match **with** vs **without** search | Demo why Tourist needs Search; test “stale without grounding” | **GS-004** router narrative |
| `web_search_queries` + chunk titles | Log fields + quota math | **GS-003** |
| `show_parts` / chat with `search_tool` | Multi-turn behavior reference only — Mastra owns threads | — |
| Code execution + charts | **Ignore** — not CopilotKit | — |
| Live API + `google_search` + function_declarations | Concept for **GS-006** spike only | **Defer** |

---

## Recommended workflow (implementation)

```text
1. Read 03-grounding-summary.md (mdeai architecture)
2. Grep 02-playbook for "grounding_metadata" → extract golden snippet
3. Implement services/adk-grounding/search_grounding.py (mirror generate_content + google_search)
4. Port metadata → JSON contract in GS-001 (Zod)
5. Wire Mastra tool in MAP-002D
6. Build GS-002 UI from citations[] — not searchEntryPoint HTML
7. Once: run upstream Colab with your key to validate model ID still works
```

### Golden fixture (from 02-playbook — use in tests)

**Prompt:** `What was the latest Indian Premier League match and who won?`

**Expect when grounded:**

- `web_search_queries`: array of 2–3 strings (not empty)
- `grounding_chunks[].web`: `{ title, uri }`
- Answer text **newer** than non-grounded run (2025 vs 2024 in cookbook)

Save redacted JSON as `mdeapp/src/mastra/lib/__fixtures__/search-grounding-ipl.json` during **GS-001**.

### API shape to port (sidecar Python)

From 01/02 (REST equivalent):

```python
# ADK / genai — align with GOOGLE_GENERATIVE_AI_API_KEY on Cloud Run
config={"tools": [{"google_search": {}}]}
# Parse: response.candidates[0].grounding_metadata
```

mdeai production uses **`gemini-3.5-flash`** per `CLAUDE.md` — cookbook allows `gemini-3.5-flash` in 02; verify in Colab before changing env `GEMINI_GROUNDING_MODEL`.

---

## What to copy vs what to skip

| Copy into mdeai | Skip |
|-----------------|------|
| `google_search` tool config | Live API session code |
| `grounding_chunks` / `grounding_supports` parsing | `search_entry_point.rendered_content` embed (unless legal approves) |
| Before/after grounding comparison (docs/evidence) | matplotlib / code_execution demos |
| URL context pattern (GS-005 later) | YouTube link grounding |
| Maps grounding section → **read only** | Using Maps grounding instead of Grounding Lite MCP |

---

## When to re-export playbooks

| Trigger | Action |
|---------|--------|
| Google updates `Grounding.ipynb` | Re-download → replace `01-playbook.md` |
| Gemini 3.x Search billing docs change | Update **GS-003** + `03-grounding-summary.md` |
| New `grounding_supports` fields | Update **GS-001** Zod + **GS-002** inline cites |

```bash
# Optional: refresh from cookbook (manual)
# npx @mcp-pandoc or jupyter nbconvert — team choice
```

---

## Colab vs repo playbooks

| Need | Use |
|------|-----|
| First-time API key smoke | [Open Grounding.ipynb in Colab](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Grounding.ipynb) |
| PR review / offline grep | `01-playbook.md` / `02-playbook.md` in repo |
| CI tests | **Fixtures only** — no live Search in unit tests (mock metadata) |

---

## Quick grep cheatsheet

```bash
# From repo root
rg "google_search" tasks/grounding-search/docs/01-playbook.md
rg "grounding_metadata" tasks/grounding-search/docs/02-playbook.md
rg "maps_grounding" tasks/grounding-search/docs/01-playbook.md
rg "search_entry_point" tasks/grounding-search/docs/
```

---

## Tasks with `playbook_ref` (grep targets in each file)

| Task | Primary playbook | Section hint |
|------|------------------|--------------|
| [MAP-002D](../../maps/MAP-002D-search-grounding-enable.md) | **02** + guide | `google_search`, ADK agent |
| [MAP-002E](../../maps/MAP-002E-gemini-maps-fallback-runbook.md) | **01** | `#maps_grounding` (read-only) |
| [MAP-002 § G4](../../maps/MAP-002-grounding-attribution.md) | **01** + **02** | Links to 002D/E |
| [EVT-D05](../../events/EVT-D05-google-search-grounding.md) | **02** | Medellín templates + IPL fixture |
| [GS-001](../tasks/GS-001-search-grounding-types.md) | **02** | `grounding_metadata`, fixtures |
| [GS-002](../tasks/GS-002-web-citation-ui.md) | **02** | `grounding_chunks` |
| [GS-003](../tasks/GS-003-search-quota-logging.md) | **02** | `web_search_queries` |
| [GS-004](../tasks/GS-004-mastra-freshness-router.md) | **02** | IPL with/without search |
| [GS-005](../tasks/GS-005-verify-ticket-venue-tools.md) | **02** + **01** | url_context optional |
| [GS-006](../tasks/GS-006-tool-combination-spike.md) | **02** | Live + custom tools tail |
| [GS-007–009](../tasks/INDEX.md) | **02** (+ **05** for 008/009) | Vertical prompts |

Each spec has YAML `playbook_ref` and a **Cookbook references** section.

## Related mdeai docs

- Audit: [03-grounding-summary.md](./03-grounding-summary.md)
- Tasks: [../tasks/INDEX.md](../tasks/INDEX.md)
- Parent ship: [MAP-002D](../../maps/MAP-002D-search-grounding-enable.md)
