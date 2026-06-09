---
title: Intelligence (MIS) — Linear views
updated: 2026-06-01
canonical_queue: intelligence-queue.json
plan: ../intelligence/intelligence-plan.md
import_script: ../../scripts/linear-import-intelligence-tasks.mjs
---

# Intelligence tasks — Linear views

**Rule:** Filter on **labels only**. Phase 1 is **frozen** — see [`intelligence-queue.json`](intelligence-queue.json).

**Import (dry-run → live):**

```bash
cd /home/sk/mdeai
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
node scripts/linear-import-intelligence-tasks.mjs --audit
node scripts/linear-import-intelligence-tasks.mjs --dry-run
node scripts/linear-import-intelligence-tasks.mjs
```

Report: [`intelligence-import-report.md`](intelligence-import-report.md) · Log: [`intelligence-import-log.json`](intelligence-import-log.json)

---

## Required views (create in Linear UI)

Linear has no public API for custom views — paste each filter into **Views → New view**.

### INTELLIGENCE (all MIS work)

**Saved view:** [Intelligence](https://linear.app/sanjiovani/view/intelligence-7bbdb829ba23)

```text
project:MDEAPP label:track:intelligence
```

Disk map: [`../intelligence/LINEAR.md`](intelligence/LINEAR.md) · INT specs [`../intelligence/tasks/INDEX.md`](intelligence/tasks/INDEX.md)

Sort: Manual — use `intel-order:01` … `intel-order:18` labels, or [`intelligence-queue.json`](intelligence-queue.json) `execution_order`.

### INTEL Phase 1 (FROZEN — ship this only)

```text
project:MDEAPP label:phase:intel-1
```

Active queue:

```text
project:MDEAPP label:phase:intel-1 state:Todo,"In Progress","In Review"
```

Shipped (MIS-M1):

```text
project:MDEAPP label:phase:intel-1 state:Done
```

### INTEL Phase 0 (pre-req)

```text
project:MDEAPP label:phase:intel-0
```

### INTEL Phase 1b (after MIS-M1 gate)

```text
project:MDEAPP label:phase:intel-1b
```

### INTEL deferred (Phase 2+ — do not pull)

```text
project:MDEAPP label:phase:intel-deferred
```

### INT Conversational routing (INT-001…010, INT-021, INT-022)

Post MIS-M1 — shared intent, rental clarify, event/café/restaurant wrappers.

```text
project:MDEAPP label:phase:intel-conv
```

Sort: Manual — `int-seq:01` … `int-seq:22` labels (import script creates these).

### INT Memory & personalization (INT-011…020)

```text
project:MDEAPP label:phase:intel-memory
```

### INT Routing layer

```text
project:MDEAPP label:layer:routing
```

### INT Memory layer

```text
project:MDEAPP label:layer:memory
```

**Canonical INT specs:** [`tasks/intelligence/tasks/`](intelligence/tasks/INDEX.md) — synced by `linear-import-intelligence-tasks.mjs` (22 INT + MIS registry).

Legacy root `tasks/intelligence/INT-00x-*.md` are **superseded stubs** only.

### INTEL Search

```text
project:MDEAPP label:track:intelligence label:stack:search
```

### INTEL Supabase

```text
project:MDEAPP label:track:intelligence label:stack:supabase
```

### INTEL Ranking

```text
project:MDEAPP label:track:intelligence label:layer:ranking
```

Covers: SEARCH-001…007 signal fusion, AI-001/002/014/015/020 (deferred).

### INTEL Grounding

```text
project:MDEAPP label:track:intelligence label:layer:grounding
```

Covers: DATA-045 evidence tables, AI-004 grounding verification.

### INTEL Observability

```text
project:MDEAPP label:track:intelligence label:layer:observability
```

Covers: DATA-047 search_logs, DATA-046 golden v2, VEC-005/006 eval.

### INTELLIGENCE blockers

```text
project:MDEAPP label:track:intelligence has:blocked-by state:Todo,"In Progress","In Review"
```

---

## Labels (import script creates)

| Label | Purpose |
|-------|---------|
| `track:intelligence` | All MIS tasks |
| `track:data` | DATA-* overlap |
| `phase:intel-0` | VEC-001, DATA-039 |
| `phase:intel-1` | Frozen Phase 1 ship list (10 tasks) |
| `phase:intel-1b` | VEC-003/004, SEARCH-001/002, AI-004/003, DATA-046, VEC-005 |
| `phase:intel-deferred` | Phase 2+ — do not execute |
| `stack:supabase` | DDL migrations |
| `stack:pgvector` | VEC / hybrid RPC |
| `stack:search` | SEARCH-* tool wiring |
| `stack:mastra` | Mastra tool/workflow changes |
| `layer:observability` | search_logs, eval, latency |
| `layer:signals` | DATA-041…043 |
| `layer:ranking` | Hybrid rank + signal fusion |
| `layer:grounding` | Evidence + citation pipeline |
| `intel-order:01` … `intel-order:18` | Manual sort in Phase 1 + Phase 1b views |

---

## Import scope (2026-06-01)

| Range | Imported | Phase 2 excluded |
|-------|----------|------------------|
| DATA-039…047 | ✅ (9 tasks; DATA-046 = 1b) | DATA-048+ not imported |
| SEARCH-001…007 | ✅ | 004–007 = `intel-deferred` |
| VEC-001…007 | ✅ | 006–007 = deferred |
| AI-001…020 | ✅ registry only (11 tasks) | AI-005…009, 016…019 **missing specs** |

**Title format:** `{SPEC-ID} — readable title` · **SAN-###** assigned by Linear on create (immutable).

**Local markdown = source of truth** — Linear body links to disk spec paths.

---

## Verification checklist

| Check | Expected |
|-------|----------|
| Phase 1 view | 10 issues (`phase:intel-1`) |
| Phase 1 Done | 10/10 after MIS-M1 import |
| Titles | `DATA-041 — venue_signals polymorphic + seed` |
| Blocked-by | DATA-041 blocked by DATA-039, DATA-040 |
| Not in Phase 1 view | AI-020, SEARCH-004, INT-001 |
| No duplicates | One issue per SPEC-ID prefix |
| Collisions | Zero duplicate `DATA-041` titles |

---

## Related

| View | Filter |
|------|--------|
| DATA (all) | `project:MDEAPP label:track:data` |
| MVP EXECUTION | `project:MDEAPP label:phase:launch` — parallel, not blocked |
| Vector | `project:MDEAPP label:stack:pgvector` |

Hub: [`linear.md`](linear/docs/linear.md) · Plan: [`intelligence-plan.md`](intelligence-plan.md)
