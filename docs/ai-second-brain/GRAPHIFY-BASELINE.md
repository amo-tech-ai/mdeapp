# Graphify Baseline — AI-SB-001

**Task:** `SAN-### · AI-SB-001 — Restore Graphify Builder + Generate mdeai Knowledge Graph`
**Date:** 2026-06-16 · **Branch:** `ai/ai-sb-001-graphify-baseline` · **graphify CLI:** `graphifyy` 0.8.36

## The answer first

The mdeai knowledge graph builds successfully, costs **$0 (no LLM — pure AST extraction)**, and
Claude can query it. The graph covers the whole repo: **77,560 nodes / 77,831 edges** across
**6,879 files**, rebuilt in **~65 seconds**.

**What it means for the team:** Sofía (dev) and Lucía (QA) now have a committed, reproducible
"second brain" — instead of grepping 6,879 files (~26M words) to find where code lives or what an
edit breaks, an AI assistant does a graph lookup in seconds at zero token cost. Per Graphify's docs
that's **~71.5× fewer tokens per query** than reading raw files. Internal dev-accuracy tooling — no
user-facing surface changes.

## What this task actually changed

Graphify was already installed and the graph already built locally — but the builder and ignore
file were **never committed to the repo**, and the docs pointed at a Python script
(`scripts/graphify-phase2-build.py`) that never existed. This task **commits the real builder into
version control** and reconciles the docs, so a fresh clone can rebuild the graph.

| Deliverable | Status |
|---|---|
| Canonical builder `scripts/graphify-run.sh` | ✅ committed (was untracked) |
| `.graphifyignore` | ✅ committed + added `coverage/`, `test-results/`, `playwright-report/`, `screenshots/` |
| Docs reconciled (`graphify-reference.md`) | ✅ 4 stale `graphify-phase2-build.py` refs → `graphify-run.sh` |
| First graph generated | ✅ `graphify-out/graph.json` (63 MB) |
| HTML export | ✅ `graphify-out/GRAPH_TREE.html` (5.4 MB) — see note below |
| Baseline metrics | ✅ this doc |

> **No redundant Python builder was created** — the working builder is `graphify-run.sh` + the
> installed `graphify` CLI. Per the AI-SB-001 decision, we formalized that rather than shadow it
> with a duplicate script.

## Measured baseline (real run, current `main`)

| Metric | Value | How |
|---|---|---|
| Nodes | **77,560** | `graphify update .` → `GRAPH_REPORT.md` |
| Edges | **77,831** | same |
| Communities | 6,806 (6,333 shown, 473 thin omitted) | same |
| Files indexed | 6,879 | same |
| Corpus size | ~26,386,530 words | same |
| **Build time** | **1:04.56 (~65 s)** incremental update | `/usr/bin/time -v` |
| Peak memory | ~1.16 GB | `/usr/bin/time -v` |
| **Token cost** | **0 input / 0 output** | AST-only; `Extraction: 100% EXTRACTED · 0% INFERRED` |
| graph.json | 63 MB | `graphify-out/` (gitignored) |
| GRAPH_REPORT.md | 1.7 MB | `graphify-out/` (gitignored) |

## Index / exclude contract (`.graphifyignore`)

**Indexed:** `src/` (742 TS/TSX), `docs/` (incl. `docs/tasks/`, `docs/prd/`), `CLAUDE.md`,
`DESIGN.MD`, `sitemap.md`, `linear.md`, `LESSONS.md`, `supabase/migrations/`, `scripts/`, `e2e/`.

**Excluded:** `node_modules/`, `.next/`, `.mastra/`, `dist/`, `out/`, `.turbo/`, `coverage/`,
`test-results/`, `playwright-report/`, `screenshots/`, design image trees, `**/_archive/**`,
`**/backup/**`, vendored clones, and `graphify-out/` itself.

## Success criteria

| Criterion | Result |
|---|---|
| Graph builds successfully | 🟢 exit 0, 65 s |
| Claude can query the graph | 🟢 `graphify query "where is the concierge agent defined"` → BFS returned 12 nodes |
| Baseline metrics documented | 🟢 this doc |
| Ready for AI-SB-002 (Understand Anything) | 🟢 graph + builder committed |

## How to rebuild / query

```bash
bash scripts/graphify-run.sh update .         # rebuild (~65s, $0)
bash scripts/graphify-run.sh tree             # regenerate GRAPH_TREE.html
bash scripts/graphify-run.sh query "where is X defined"
bash scripts/graphify-run.sh explain "conciergeAgent"
```

## Honest notes / caveats

- **`graph.html` filename:** Graphify auto-disables its full interactive `graph.html` viz for graphs
  over 5,000 nodes (ours is 77k). The HTML deliverable is therefore **`GRAPH_TREE.html`** (a D3
  collapsible tree), generated via `graphify tree`. Both `graph.json` and the HTML live in the
  gitignored `graphify-out/` — they are generated artifacts, not committed (per the second-brain plan).
- **Graph freshness:** the graph is built from a working-tree snapshot; run `graphify update .` after
  significant code/doc changes. `GRAPH_REPORT.md` stamps the source commit so staleness is visible.
- **Query relevance is keyword/label-based BFS**, not semantic ranking — a query can surface
  doc nodes that merely share a label. Good enough for "locate + blast-radius"; AI-SB-002 (Understand
  Anything) adds the visual dependency layer on top.
- The historical corpus numbers in `docs/graphify-reference.md` (591 files, 17,080 nodes) are
  superseded by the measured figures above.
