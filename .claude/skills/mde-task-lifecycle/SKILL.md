---
name: mde-task-lifecycle
description: "Five-phase orchestrator for mdeai.co tasks — plan, research, implement, test, ship. Routes each phase to specialist skills (mde-writing-plans, testing for Vitest/Playwright, `/deploy-check` for pre-ship gates, mdeai-executor) and owns boundaries between them. Use when the user wants to work on a task by ID (work on task 17A, implement 18B, ship this prompt, process the backlog, next P0, go through the lifecycle, close out a task, run a task), or asks to move anything in tasks/prompts/ from spec to shipped. Does NOT write PRDs (use mde-writing-plans), debug arbitrary bugs (use systematic-debugging), or author new skills (use mde-prompting). Replaces overlapping ad-hoc skills create-tasks, spec-tasks, tasks, tasks-generator, prd-taskmaster, task-prd-creator, executing-tasks."
title: mde-task-lifecycle — five-phase orchestrator
impact: HIGH
impactDescription: Routes plan → research → implement → test → ship with gates
tags: mde-task-lifecycle, workflow, tasks, backlog, shipping
paths:
  - "tasks/**"
  - ".claude/commands/**"
---

# mde-task-lifecycle

**BLUF:** One skill, five phases, one bookkeeping contract. Each phase has its own module file. SKILL.md routes; modules execute.

---

## When to invoke

| Trigger phrase | Action |
|----------------|--------|
| "Work on task `<id>`" / "Implement 17A" | Load prompt, route through phases 2-5 |
| "Process backlog" / "Next P0" | Read [tasks/prompts/INDEX.md](../../../tasks/prompts/INDEX.md), pick next unstarted P0, run all phases |
| "Plan a task for `<feature>`" | Phase 1 only — write the prompt |
| "Research `<topic>` before we build" | Phase 2 only — produce audit notes |
| "Ship `<prompt>`" / "Close out `<id>`" | Phase 5 only — bookkeeping + gates |
| "Run lifecycle on `<id>`" | All 5 phases in order |
| Status update on a shipped task | Phase 5 only |

### Don't invoke for

- New PRD section or planning prose → `mde-writing-plans`
- Pure debugging without a task ID → `systematic-debugging`
- Authoring or editing a skill → `mde-prompting`
- One-off PR creation unrelated to a task → `mde-github`
- Commit-only requests with no task context → `git-commit`

---

## Five phases at a glance

| # | Phase | Module | Specialist skill(s) | Output |
|---|-------|--------|---------------------|--------|
| 1 | Plan | [planning.md](planning.md) | `mde-writing-plans` | Prompt at `tasks/prompts/{core,advanced,production}/<NN><X>-name.md` per [tasks/tasks-template.md](../../../tasks/tasks-template.md) |
| 2 | Research | [research.md](research.md) | (none — built-in) | Audit notes, source-cited risks, validated assumptions |
| 3 | Implement | [implementation.md](implementation.md) | `mdeai-executor` (subagent), `systematic-debugging` | Code changes; `npm run build` green |
| 4 | Test | [testing.md](testing.md) | `testing` ([vitest.md](../testing/vitest.md), [playwright.md](../testing/playwright.md)), `testing-strategy` | Passing tests + smoke evidence |
| 5 | Ship | [shipping.md](shipping.md) | `/deploy-check`, `git-commit`, `mde-github` | Updated `todo.md` + `CHANGELOG.md` + prompt frontmatter `status: Done` |

---

## Phase sequencing rules

| Rule | Detail |
|------|--------|
| Skip Phase 1 | Only when a prompt already exists at `tasks/prompts/.../<id>-*.md`. |
| Skip Phase 2 | Only when the prompt's wiring plan is fully concrete and the change is trivial (≤3 file edits). |
| Skip Phase 3 | Only on docs-only / changelog-only tasks. |
| Skip Phase 4 | Never on code changes. Docs-only tasks may skip with a note. |
| Skip Phase 5 | **Never.** Phase 5 is the only durable proof the work shipped. |
| Loop back | Phase 4 failure → Phase 3 (do not advance until green). Phase 2 finds a contradiction → Phase 1 (re-plan). |

---

## Routing decision tree

```
User intent
  │
  ├─ Prompt file exists for <id>?
  │   ├─ No  → Phase 1 (planning.md)
  │   └─ Yes → continue
  │
  ├─ status: Done in frontmatter?
  │   ├─ Yes → report shipped; offer next P0
  │   └─ No  → continue
  │
  ├─ Need external/codebase facts?
  │   ├─ Yes → Phase 2 (research.md)
  │   └─ No  → continue
  │
  ├─ Code change required?
  │   ├─ Yes → Phase 3 (implementation.md) → Phase 4 (testing.md)
  │   └─ No  → continue
  │
  └─ Phase 5 (shipping.md) — always.
```

---

## Quick links

| Resource | Path |
|----------|------|
| Phase 1 — planning | [planning.md](planning.md) |
| Phase 2 — research | [research.md](research.md) |
| Phase 3 — implementation | [implementation.md](implementation.md) |
| Phase 4 — testing | [testing.md](testing.md) |
| Phase 5 — shipping | [shipping.md](shipping.md) |
| Prompt template cheat sheet | [references/prompt-template-cheatsheet.md](references/prompt-template-cheatsheet.md) |
| Audit checklist | [references/audit-checklist.md](references/audit-checklist.md) |
| Migration safety | [references/migration-safety.md](references/migration-safety.md) |
| Testing matrix | [references/testing-matrix.md](references/testing-matrix.md) |
| Changelog & commit templates | [references/changelog-templates.md](references/changelog-templates.md) |
| Source-of-truth template | [tasks/tasks-template.md](../../../tasks/tasks-template.md) |
| Prompt INDEX | [tasks/prompts/INDEX.md](../../../tasks/prompts/INDEX.md) |
| Coverage matrix | [tasks/trio/00-trio-task-coverage-matrix.md](../../../tasks/trio/00-trio-task-coverage-matrix.md) |
| Live status | [tasks/todo.md](../../../tasks/todo.md) |
| Daily log | [CHANGELOG.md](../../../CHANGELOG.md) |
| Project rules | [CLAUDE.md](../../../CLAUDE.md) |
| **Worktrees (Phase 3/5)** | [references/worktrees.md](references/worktrees.md) · [`tasks/notes/june4/worktrees-best.md`](../../../tasks/notes/june4/worktrees-best.md) |
| **Revenue tasks (TIER R)** | [tasks/revenue/INDEX.md](../../../tasks/revenue/INDEX.md) · strategy: [docs/strategy/index-revenue.md](../../../docs/strategy/index-revenue.md) |
| **MASTRA task series** | [tasks/mastra/maps/tasks/places/](../../../tasks/mastra/maps/tasks/places/) |
| **CopilotKit map canvas (core)** | [F48](../../../tasks/archive/copilot/F48-copilotkit-map-canvas-layout.md) → [F49](../../../tasks/archive/copilot/F49-copilotkit-generative-search-ui.md) → [F50](../../../tasks/archive/copilot/F50-copilotkit-map-ui-state.md) (after [MAP-001](../../../tasks/archive/maps/MAP-001-platform-map-pipeline.md)) |
| **Event discovery (plans 10–11)** | [EVP-018 pack](../../../tasks/events/EVP-018-mvp-event-web-discovery-task-pack.md) · [skill routing](../../../tasks/events/docs/event-discovery-skill-routing.md) · [10-plan](../../../plan/events/event-discovery/10-event-discover-plan.md) · [11-openclaw](../../../plan/events/event-discovery/11-openclaw-event-discovery.md) |

### MASTRA task series (geo-chat production plan)

Tasks 043–049 form a staged roadmap for the Mastra concierge geo-chat system. Load them in order when a user asks to "work on MASTRA-04x".

| ID | File | Phase | Blocks |
|----|------|-------|--------|
| PLAN-001 | `043-mastra-geo-production-plan.md` | Master plan (read first) | 044–049 |
| MASTRA-044 | `044-mastra-deploy-verification.md` | Phase 0 — Deploy Mastra beta | 045 |
| MASTRA-045 | `045-mastra-smoke-hardening.md` | Phase 0 — Smoke spec | 046, 047 |
| MASTRA-046 | `046-mastra-action-schema-validation.md` | Phase 1 — normalizeToolOutput | 047 |
| MASTRA-047 | `047-mastra-map-pin-merge-versioning.md` | Phase 1 — Pin merge + versioning | 048 |
| PLACES-005-010 | `020-place-details-enrichment.md` | Phase 2 — Places enrichment | 049 |
| GROUNDING-001 | `010-grounded-search.md` | Phase 3 — Maps grounding | — |

**Phase gate rules:**
- MASTRA-044 must pass before MASTRA-045 runs (deploy before smoke)
- MASTRA-045 smoke must be green before Phase 1 work starts
- Phase 2 (048) requires Phase 1 (047) fully shipped
- Phase 3 (049) requires Phase 2 (048) fully shipped + place_id coverage ≥ 80%

---

## Worktrees (app code tasks)

Before Phase 3 on **`mdeapp/src/**`**: open or reuse a worktree per [references/worktrees.md](references/worktrees.md). One SAN → `mdeapp/.worktrees/wt-san-NNN-slug` + branch `ai/san-NNN-slug`. After Phase 5 merge: `git worktree remove` + branch delete. Load `mde-worktree-pr-flow` for guards and audit scripts.

---

## Contract

- **Atomicity:** A task that enters Phase 1 either ships through Phase 5 or fails closed. No half-done artifacts in repo.
- **Three-record sync:** `tasks/todo.md`, `CHANGELOG.md`, and the prompt's frontmatter `status:` are always consistent at task close-out.
- **Traceability:** Every shipped task is reachable both forward (prompt → wiring → tests → commit → changelog) and backward (changelog row → commit → prompt ID).
- **No silent push:** Commits are always created; pushes only on explicit user request (per [CLAUDE.md](../../../CLAUDE.md) git protocol).
