# Task spec rubric (task-verifier)

Use when scoring `tasks/core/F*.md`, `tasks/agent/tasks/CTI-*.md`, or `tasks/openclaw/tasks/OCL-*.md` **before execution** (spec quality) and **after** (execution readiness).

## Letter grades

| Grade | Spec score | Execution readiness |
|---|---:|---|
| A | 90–100 | 90–100, zero blockers |
| B | 80–89 | 80–89 |
| C | 70–79 | 70–79 |
| D | 60–69 | 60–69 |
| F | &lt;60 | &lt;60 or any unresolved blocker |

**Execution readiness** = spec score minus blocker penalties: each unresolved blockers −15 (cap at 0). If spec has blockers, readiness cannot exceed 70 until spec is patched.

## Spec quality weights (100 pts)

| Dimension | Weight | What to check |
|---|---:|---|
| Source-of-truth alignment | 20 | Matches CLAUDE.md, plan/prd, INDEX; no stale model IDs |
| Disk/MCP accuracy | 25 | Schema, enum, file paths, beta API shapes probed |
| DoD provability | 25 | Every AC has command + expected; anonymous/auth paths explicit |
| Template completeness | 15 | Sections 1–10 per mde-task-lifecycle (see SKILL §6) |
| Security / hooks | 15 | Service-role placement, RLS, hook carve-outs documented |

## Mastra port pack extras (F13–F20)

Score **−10** each if missing:

1. **Integration surface** table (CopilotKit vs Mastra HTTP `/chat`)
2. **`useCoAgent` / `<CopilotKit agent>` key** matches `Mastra({ agents: { key } })`
3. **`agent_type` enum** mapped to existing Postgres labels (no invented values)
4. **`ai_runs` vs `mastra_ai_spans`** decision line
5. **F13 `logAgentRunForTurn`** referenced for runtime DoD on F14–F19

## Dependency slug normalization

| INDEX / spec slug | Canonical file |
|---|---|
| `F09-supp` | `F09-floor-script-and-vitest.md` |
| `F09` | `F09-floor-script-and-vitest.md` |

Flag INDEX-only `F09-supp` as naming drift until INDEX is fixed.

## Persona impact line (required in audit reports)

One sentence per task: who notices the change on which surface (`/`, `/chat`, `/host/event/new`, Patricia dashboard).
