# Runtime constitution pointer

The authoritative runtime rules for Maps work live **outside** this skill so they can be cited from PRs, Outcomes rubrics, and task specs without resolving a skill path. Read these before any architectural Maps change.

| Doc | What it owns |
|---|---|
| [`tasks/mastra/maps/99-runtime-architecture-supplement.md`](../../../../tasks/mastra/maps/99-runtime-architecture-supplement.md) | 22 runtime constraints (C1–C22), observability catalogue, marker runtime, mobile rules, cache ops, abuse protection, performance budgets |
| [`tasks/mastra/maps/98-runtime-state-ownership.md`](../../../../tasks/mastra/maps/98-runtime-state-ownership.md) | State × Owner matrix — who owns pins, cache, `run_id`, viewport, etc. + conflict resolution + degraded modes per owner |
| [`tasks/mastra/maps/diagrams/00-index.md`](../../../../tasks/mastra/maps/diagrams/00-index.md) | 12 architecture diagrams (platform / Maps runtime / Grounding / Places / Mastra / dev workflow / hooks / Outcomes / Playwright / observability / mobile / CI-CD) |
| [`tasks/mastra/maps/100-maps-plan.md`](../../../../tasks/mastra/maps/100-maps-plan.md) | Master plan + phase order (1A → 6 hardening) |
| [`tasks/mastra/maps/tasks/index-maps-tasks.md`](../../../../tasks/mastra/maps/tasks/index-maps-tasks.md) | Feature-system task index — 10 systems (runtime, grounding, places, observability, mobile, markers, security, verification, advanced, deferred) with numbering ranges |

**When the constitution and a `references/` file disagree, the constitution wins.** The skill's own references mirror Google's official docs and are advisory; the constitution captures *our* decisions on top of those.

## When to read which

| Scenario | Read first |
|---|---|
| Adding a new tool / edge fn that touches Maps | `99-runtime-architecture-supplement.md` §1 (constraints C1–C22) |
| A bug looks like two layers stepping on each other | `98-runtime-state-ownership.md` — find the state in §2 and check who owns it |
| Drawing the data path for a PR | `diagrams/00-index.md` — pick the matching diagram |
| Deciding which phase a task belongs to | `100-maps-plan.md` §4 + `tasks/index-maps-tasks.md` §2 |
| Authoring a new task file | `tasks/index-maps-tasks.md` §15 template + numbering range from §14 |
