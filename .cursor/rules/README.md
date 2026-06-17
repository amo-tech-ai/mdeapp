# Cursor rules — mdeai (lean stack)

Rules apply when `globs` match open files, when `description` triggers intelligent apply, or when `@`-mentioned.

**North star:** [`lean.md`](../../lean.md) · [`03-lean.md`](../docs/03-lean.md) — rules teach judgment tiers; skills teach how; evidence proves ship-class work only.  
**Cursor tooling:** [`04-subagents-hooks-setup.md`](../docs/04-subagents-hooks-setup.md) · [`05-worktrees.md`](../docs/05-worktrees.md) · [Cursor rules docs](https://cursor.com/docs/rules)

## Always on (3 rules)

| Rule | Role |
|------|------|
| [`mdeai-workflow.mdc`](./mdeai-workflow.mdc) | **Orchestrator** — classify D/C/U/S, ≤3 skills, verify by tier |
| [`mdeai-response-style.mdc`](./mdeai-response-style.mdc) | Lead with verdict, persona impact, plain language, full SAN titles in chat |
| [`karpathy-guidelines.mdc`](./karpathy-guidelines.mdc) | Surgical changes, explicit assumptions |

> Line budget ~280 across the three (trim over time; do not re-expand `alwaysApply`).

## Default pairing

```text
classify (D/C/U/S) → skills(≤3) → implement → verify(class) → evidence(if U/S) → PR(if S) → Linear In Review
```

## Change classes

| Class | Examples | Verify |
|-------|----------|--------|
| **D** | `tasks/**`, `plan/**`, diagrams | Links, mermaid validate |
| **C** | lib, API, migration | vitest + dev + curl |
| **U** | chat, cards, maps, agents | + Browser/Playwright + screenshot |
| **S** | PR, P0, prod claim | + prod smoke + PR bots |

## Intelligent apply (description — no glob)

| Rule | When |
|------|------|
| [`pr-agent.mdc`](./pr-agent.mdc) | PR-Agent workflow, `/review` `/describe` `/improve`, Actions job `pr_agent_job` |
| [`bugbot.mdc`](./bugbot.mdc) | `/review-bugbot`, `cursor review` on PRs |
| [`graphite-stacking.mdc`](./graphite-stacking.mdc) | `gt` stacks, `gt submit`, multi-PR feature slices |

## Glob-loaded (depth on demand)

| Rule | Globs / trigger |
|------|-----------------|
| [`mdeai-task-naming.mdc`](./mdeai-task-naming.mdc) | `docs/tasks/**`, `tasks/**`, `todo.md`, `changelog.md` |
| [`mdeai-docs-git-safety.mdc`](./mdeai-docs-git-safety.mdc) | `docs/**`, `tasks/**` |
| [`graphify.mdc`](./graphify.mdc) | `src/**`, `docs/**`, `graphify-out/**` |
| [`mdeai-skills-best-practices.mdc`](./mdeai-skills-best-practices.mdc) | `mdeapp/**`, `tasks/**` |
| [`mdeai-commit-discipline.mdc`](./mdeai-commit-discipline.mdc) | `mdeapp/**`, `tasks/**` — commit **when user asks** |
| [`mdeai-testing.mdc`](./mdeai-testing.mdc) | `mdeapp/src/**`, `e2e/**`, `tasks/testing/**` |
| [`mdeai-real-world-proof-pr-review.mdc`](./mdeai-real-world-proof-pr-review.mdc) | `mdeapp/src/**`, `e2e/**` |
| [`mdeai-live-prod-check.mdc`](./mdeai-live-prod-check.mdc) | class S, "check prod" |
| [`mdeai-mermaid-diagrams.mdc`](./mdeai-mermaid-diagrams.mdc) | diagrams, `tasks/**`, `plan/**`, `mdeapp/docs/**` |
| [`mdeai-linear.mdc`](./mdeai-linear.mdc) | Linear board work |
| [`mdeai-google-maps.mdc`](./mdeai-google-maps.mdc) | Maps, Places |

## Events platform

| Rule | Globs |
|------|-------|
| [`mdeai-events-task-skill-mcp-gate.mdc`](./mdeai-events-task-skill-mcp-gate.mdc) | `tasks/events/**`, host/events components |
| [`mdeai-events-pre-impl-verify.mdc`](./mdeai-events-pre-impl-verify.mdc) | Events paths |
| [`mdeai-events-gate-audit.mdc`](./mdeai-events-gate-audit.mdc) | Phase A/B gates |
| [`mdeai-events-changelog.mdc`](./mdeai-events-changelog.mdc) | Events ship |

## P0 / launch audit (heavy — not daily)

| Rule | When |
|------|------|
| [`mdeai-proof-driven-delivery.mdc`](./mdeai-proof-driven-delivery.mdc) | `phase:launch`, Evidence Score |
| [`mdeai-done-gate.mdc`](./mdeai-done-gate.mdc) | Full Done checklist |
| [`mdeai-launch-gate.mdc`](./mdeai-launch-gate.mdc) | Seven gates |
| [`mdeai-task-skill-mcp-gate.mdc`](./mdeai-task-skill-mcp-gate.mdc) | P0 todo rows |

## Deprecated

| Rule | Replacement |
|------|-------------|
| [`mdeai-localhost-verify.mdc`](./mdeai-localhost-verify.mdc) | `mdeai-testing.mdc` |

Planning: [`tasks/commit/COMMIT-LEDGER.md`](../../tasks/commit/COMMIT-LEDGER.md) · [`tasks/testing/INDEX.md`](../../tasks/testing/INDEX.md) · skills [`.cursor/docs/02-skills-plan.md`](../docs/02-skills-plan.md)
