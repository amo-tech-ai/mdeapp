# Graphify Reference — mdeai

Knowledge graph tool for codebase + docs analysis. Builds a queryable graph of every function, component, file, and document and the connections between them.

**Package:** `graphifyy` 0.8.36  
**Venv:** `~/.venvs/graphify`  
**Output:** `mdeapp/graphify-out/` (gitignored)  
**Build script:** `scripts/graphify-phase2-build.py`

---

## Quick Start

```bash
# Activate the venv (required before every graphify command)
source ~/.venvs/graphify/bin/activate

# Run from mdeapp/
cd /home/sk/mdeai/mdeapp
```

---

## Commands

### Query — find the shortest path between two things

```bash
graphify path "useConciergeCoAgent" "concierge.ts"
graphify path "createClient" "venue_booking_requests"
graphify path "CafeBrowseFilters" "buildFilterUrl"
```

Use actual function/file names from the graph, not conceptual names. If unsure of the exact name, search first:

```bash
# Find the real node name
python3 -c "
import json
with open('graphify-out/graph.json') as f:
    g = json.load(f)
hits = [n['label'] for n in g['nodes'] if 'copilot' in n['label'].lower()]
print(hits[:20])
"
```

### Explain — plain-language description of a node

```bash
graphify explain "useRentalUi"
graphify explain "search-grounded-places.ts"
```

### Query — BFS traversal for a question

```bash
graphify query "which components use the map context"
graphify query "what calls createClient" --budget 3000
graphify query "Mastra tool registration" --dfs
```

### Affected — what breaks if X changes

```bash
graphify affected "createClient"
graphify affected "useMapContext" --depth 3
graphify affected "NEIGHBORHOODS" --relation calls
```

---

## Rebuild the Graph

Run the Phase 2 build script from `mdeapp/`:

```bash
source ~/.venvs/graphify/bin/activate
python3 scripts/graphify-phase2-build.py
```

This takes ~3 minutes. It:
1. Reuses the Phase 1 AST extraction from `.graphify_ast.json`
2. Extracts 1,064 markdown docs locally (no LLM calls, no API cost)
3. Builds the merged graph (17,080 nodes, 19,416 edges)
4. Runs Leiden clustering (1,527 communities)
5. Labels top 40 communities via `claude-cli`
6. Writes `GRAPH_REPORT.md` and `graph.json`

**When to rebuild:**
- After significant new code (new features, major refactors)
- After adding or archiving planning docs
- Before running an architecture audit

**To rebuild code AST only** (faster, no doc re-extraction):

```bash
graphify update src/
```

---

## Corpus

### Phase 1 — Code only
| Source | Files | Notes |
|---|---|---|
| `mdeapp/src/` | 591 TS/TSX | AST extraction, zero LLM calls |

### Phase 2 — Code + Docs (current)
| Source | Files | Notes |
|---|---|---|
| `mdeapp/src/` | 591 TS/TSX | Reused from Phase 1 |
| `docs/` | 509 `.md` | PRDs, ARCHITECTURE, LESSONS, linear.md |
| `tasks/maps/` | 34 `.md` | MAP-001–012 specs |
| `tasks/mastra/` | 37 `.md` | Mastra task specs |
| `tasks/intelligence/` | 45 `.md` | Intelligence layer tasks |
| `tasks/real-estate/` | 31 `.md` | Rental/RE tasks |
| `tasks/events/` | 242 `.md` | Event tasks |
| `tasks/evidence/` | 121 `.md` | F-series evidence files |
| `tasks/partners/` | 45 `.md` | Partner tasks |

To add more directories, edit `DOC_DIRS` at the top of `scripts/graphify-phase2-build.py`.

---

## Reading the Graph Report

`graphify-out/GRAPH_REPORT.md` is generated after every build.

**God nodes** — the most-connected symbols. Highest degree = everything depends on this.
- A code god node (e.g. `cn()`, `createClient()`) is a shared utility — expected.
- A doc god node (e.g. a PRD file with 100 edges) means many tasks reference it — expected.
- A god node in an unexpected place (e.g. `search-tool-renders.tsx` at 70 edges) signals hidden coupling worth investigating.

**Surprising connections** — edges the graph inferred across files that aren't explicit imports. Worth checking: sometimes they reveal real hidden coupling, sometimes they're AST noise.

**Import cycles** — circular dependencies. Zero is good. Any hit here needs immediate investigation.

**Communities** — groups of tightly connected nodes. Each community is a functional cluster. The top 40 are labeled by the LLM. The rest are "Community N" placeholders — not useless, just unnamed.

**Community cohesion score** — how tightly coupled the community is internally. Low (0.03) = loosely related files grouped together. High (0.8+) = everything imports everything else.

---

## Interpreting Results

### "No node matching X found"
The graph uses AST-extracted names, not conceptual names. Search for the actual identifier:
```bash
python3 -c "
import json
with open('graphify-out/graph.json') as f:
    g = json.load(f)
# Change 'copilot' to whatever you're looking for
hits = [(n['label'], n.get('source_file','')) for n in g['nodes']
        if 'copilot' in n['label'].lower()]
for lbl, sf in hits[:15]:
    print(f'{lbl}  ({sf})')
"
```

### Graph shows a file as isolated (dead code candidate)
Cross-check before acting. The graph only captures static imports. Dynamic imports, `require()`, string-based lookups, and Next.js page routing are not captured. A file with degree 0 might still be a live route.

### Community is just "Community N" with no label
The LLM only labeled the top 40 communities. To label more:
```bash
source ~/.venvs/graphify/bin/activate
python3 -c "
import json
from graphify.llm import label_communities
import networkx as nx
from networkx.readwrite import node_link_graph

with open('graphify-out/graph.json') as f:
    data = json.load(f)
G = node_link_graph(data)
communities = {}
for n, d in G.nodes(data=True):
    c = d.get('community', 0)
    communities.setdefault(c, []).append(n)

labels = label_communities(G, communities, backend='claude-cli', max_communities=100)
print(labels)
"
```

---

## Key Findings (Phase 2, 2026-06-09)

These are the audited findings. See the full report at `docs/graphify-audit-2026-06-09.md`.

| Finding | Status | Action |
|---|---|---|
| OpenClaw: 172 docs, zero code | **Done 2026-06-09** — archived to `/home/sk/mdeai/docs/_archive/openclaw/`; build script now skips `_archive/` dirs |
| Browse duplication: 4 functions in 5 files | Confirmed | Extract to `src/lib/browse/filter-utils.ts` |
| Commerce (`src/app/shop/`) | Live Phase 2 code | Keep — do not delete |
| `use-venue-booking-status.ts` queries `venue_booking_requests` with no user filter | **Cleared 2026-06-09** — RLS policy `venue_booking_select_own` enforces `user_id = auth.uid()` at DB level; no code change needed |
| `use-session.ts` calls Supabase directly | Safe | Auth-only calls, no data tables |
| `CONCIERGE_MODEL` etc. in `models.ts` | **Done 2026-06-09** — deleted 4 dead exports; `FLASH_MODEL` kept (9 importers) |
| `getSupabaseClient()` in 5 Mastra tool files | **Done 2026-06-09** — extracted to [`src/mastra/lib/supabase-client.ts`](../src/mastra/lib/supabase-client.ts), 8 callers updated |

---

## Safeguards — What NOT to Do

These are hard rules learned during Phase 1/2 setup:

- **Do NOT run `graphify claude install`** — modifies CLAUDE.md automatically
- **Do NOT run `graphify hook install`** — modifies `.claude/settings.json` automatically
- **Do NOT run `graphify uninstall --purge`** — deletes `graphify-out/`
- **Do not include `tasks/design/`** in the corpus — it's 11 GB of images
- **Do not include `tasks/archive/` or `tasks/backup/`** — adds noise without value
- **`graphify update <path>`** only rebuilds code AST, skips docs — use the build script for full rebuilds
- **`_archive/` dirs are excluded** from doc extraction (build script filters `"_archive" not in f.parts`) — move obsolete docs there to clean the corpus without deleting them
- **Commerce `src/app/api/commerce/` routes ARE live** — the graph showed low connectivity for `src/lib/commerce/` but the routes exist and the shop page imports the client

---

## Graph Stats (current build)

```
Nodes:       17,080
Edges:       19,416
Communities: 1,527 (40 labeled)
Import cycles: 0
LLM calls:   0 (all local extraction)
API cost:    $0
graph.json:  13 MB
Build time:  ~3 min
```

---

## File Reference

```
mdeapp/
  graphify-out/               ← gitignored, all derived outputs
    graph.json                ← queryable graph (13 MB)
    GRAPH_REPORT.md           ← human-readable report (413 KB)
    .graphify_ast.json        ← Phase 1 code extraction (2.7 MB)
    .graphify_semantic.json   ← Phase 2 doc extraction (8 MB)
    .graphify_labels.json     ← community labels
    .graphify_analysis.json   ← god nodes, surprises, cycles
  scripts/
    graphify-phase2-build.py  ← build script (run this to rebuild)
```
