## Playbook refs in tasks (2026-05-26)

Every **GS-001–009**, **MAP-002D**, **MAP-002E**, and **EVT-D05** spec includes `playbook_ref` frontmatter + **Cookbook references** section. Registry: [`tasks/INDEX.md`](tasks/INDEX.md). Guide: [`docs/00-playbook-guide.md`](docs/00-playbook-guide.md).

---

## Review: docs 03 / 04 / 05 vs tasks on disk

**Before:** `tasks/grounding-search/tasks/` did not exist — only docs (01–05). Suggestions in 03 were sketches; 04/05 used legacy paths (`supabase/functions`, `CORE-GEMINI-*`, `EVT-SEARCH-001`).

**Agreement across docs:** Search grounding = **freshness + citations layer**; keep Grounding Lite + Places + Supabase as primary. Scores ~86–88/100 — aligned.

**Corrections from 04 (important):**

| 04 suggestion | mdeai reality |
|---------------|---------------|
| Implement in `supabase/functions/*` | **Wrong** — use `services/adk-grounding/` + Mastra (`MAP-002D`) |
| `CORE-GEMINI-001/002` | Map to **GS-003** / **GS-002** |
| `EVT-SEARCH-001` | **Don’t add** — use **EVT-D03, D05, D07, D09** (F42 pack) |
| `REST-*` / `SPONSOR-*` | **GS-007 / 008 / 009** — Phase 2.1+ |

**05 adds:** SPONSOR-SEARCH-001 → **GS-009**; intent routing table → **GS-004**.

---

## What already existed (no duplicate)

| ID | Where |
|----|--------|
| **MAP-002D** | Parent implementation (ADK SearchAgent) |
| **MAP-002E** | Maps fallback ops |
| **EVT-D05** | Event search query templates |
| **EVT-D03–D11** | Full discovery pack + HITL (**D09**, not EVT-001) |

---

## What we added — `tasks/grounding-search/tasks/`

Index: [`tasks/grounding-search/tasks/INDEX.md`](tasks/grounding-search/tasks/INDEX.md)

| ID | Title | When | Needed? |
|----|-------|------|---------|
| **GS-001** | Types + sidecar parser | With MAP-002D | **Yes** — blocks UI |
| **GS-002** | Web citation UI | With MAP-002D | **Yes** — trust UX |
| **GS-003** | Quota + logging | With MAP-002D | **Yes** — billing guard |
| **GS-004** | Freshness router | With MAP-002D | **Yes** — cost control |
| **GS-005** | Verify ticket + venue | After 002D | **Yes** — Andrés/Roberto |
| **GS-006** | Tool combination spike | Phase 2.1 | Optional evidence |
| **GS-007** | Restaurant closure | Phase 2.1 | Defer |
| **GS-008** | Neighborhood news | After MAP-012A | Defer |
| **GS-009** | Sponsor research | Phase 3 admin | Defer |

**Minimum to ship Search grounding:** MAP-002D + **GS-001 + GS-002 + GS-003** (+ **GS-004** strongly recommended).

---

## Ship order

```text
GS-001 + GS-003  →  MAP-002D  →  GS-002 + GS-004  →  EVT-D05 templates
  →  GS-005  →  GS-006–009 (later)
```

Cross-links updated: [`03-grounding-summary.md`](tasks/grounding-search/docs/03-grounding-summary.md) §15, [`MAP-002D`](tasks/maps/MAP-002D-search-grounding-enable.md), [`EVT-D05`](tasks/events/EVT-D05-google-search-grounding.md).

**Do not add:** separate EVT-001, CORE-GEMINI-* files, or Live/Interactions MAP tasks.

Want the next step to be implementing **GS-001 + MAP-002D** together in one PR?

The playbooks are **offline mirrors** of Google’s official cookbooks — best used as **reference + test fixtures**, not as code you run inside mdeai.

## What they are

| File | Official source | Covers |
|------|-----------------|--------|
| **01-playbook.md** | [Grounding.ipynb](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Grounding.ipynb) | **Search** + **Maps** grounding, URL context, YouTube (skip for Phase 1) |
| **02-playbook.md** | Search-as-tool notebook | **Search deep dive**: IPL with/without grounding, `grounding_metadata`, chat loop, Live API (defer) |

They’re notebook exports (01 is JSON cells) — good for **grep and copy-paste**, awkward to “run” in-repo.

---

## Best use (mdeai)

**1. Learn the API shape before coding GS-001 / MAP-002D**

From 01/02, the production pattern is:

```python
config={"tools": [{"google_search": {}}]}
# → candidates[0].grounding_metadata
#    .web_search_queries
#    .grounding_chunks[].web { title, uri }
```

That maps directly to `services/adk-grounding/search_grounding.py` + Zod in **GS-001**.

**2. Steal the IPL example for tests (02-playbook)**

- **With** search: fresh answer + 2–3 `web_search_queries` + chunk titles  
- **Without** search: stale (2024 vs 2025 in the cookbook)

Use that as **GS-001** / **GS-003** fixtures — mock `grounding_metadata` in Vitest; don’t call live Search in CI.

**3. Section → task map**

| Playbook section | mdeai task | Action |
|------------------|------------|--------|
| `search_grounding` | MAP-002D, GS-001 | **Implement** |
| `grounding_metadata` parsing | GS-001, GS-002 | **Implement** |
| `search_entry_point` HTML widget | — | **Skip Phase 1** (ToS/branding) |
| `maps_grounding` | MAP-002E | **Read only** — prod = Grounding Lite MCP, not Gemini Maps every turn |
| Live API + search + functions | GS-006 | **Spike later** |
| Code execution / charts in 02 | — | **Ignore** |

**4. Colab vs repo**

| Goal | Where |
|------|--------|
| One-time key smoke, try `gemini-3.5-flash` | Open upstream Colab |
| PR review, offline, grep | `01-playbook.md` / `02-playbook.md` |
| CI | Frozen JSON fixture only |

**5. Workflow for Sofía implementing Search**

```text
03-grounding-summary.md  →  grep 02-playbook "grounding_metadata"
  →  search_grounding.py  →  GS-001 Zod  →  MAP-002D  →  GS-002 citations UI
```

---

## What NOT to do

- Don’t treat playbooks as production modules (Colab secrets, `userdata`, etc.).
- Don’t use **Maps grounding** from 01 as a replacement for **Grounding Lite MCP** (Camila’s pins).
- Don’t embed **`search_entry_point` HTML** in CopilotKit without legal/ToS review.
- Don’t copy **Live API** sections into Phase 1 (deferred per maps INDEX).

---

## Doc added

Full guide: [`tasks/grounding-search/docs/00-playbook-guide.md`](tasks/grounding-search/docs/00-playbook-guide.md) — linked from [`tasks/grounding-search/tasks/INDEX.md`](tasks/grounding-search/tasks/INDEX.md).

**Bottom line:** Use **02-playbook** for Search metadata + IPL fixtures; use **01-playbook** for Maps/URL context context only; ship behavior through **MAP-002D + GS-001–004**, with live Colab only when Google changes the API.