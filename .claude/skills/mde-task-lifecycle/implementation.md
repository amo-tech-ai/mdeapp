---
title: Phase 3 — Implementation
impact: MEDIUM
impactDescription: Trivial vs executor routing, CLAUDE.md alignment
tags: mde-task-lifecycle, implementation, coding
---

# Phase 3 — Implementation

Coordinator. Routes coding to direct edit (trivial) or `mdeai-executor` subagent (non-trivial). Style and patterns live in [CLAUDE.md](../../../CLAUDE.md) — not duplicated here.

---

## Table of contents

1. [Entry / exit criteria](#entry--exit-criteria)
2. [Workflow checklist](#workflow-checklist)
3. [Read-before-edit rule](#read-before-edit-rule)
4. [Trivial vs non-trivial routing](#trivial-vs-non-trivial-routing)
5. [Code quality](#code-quality)
6. [Migration safety](#migration-safety)
7. [Validation steps](#validation-steps)
8. [Anti-patterns](#anti-patterns)
9. [Routing](#routing)

---

## Entry / exit criteria

| | Criterion |
|---|---|
| **Entry** | Prompt exists with full wiring plan. `status: Not Started` or `In Progress`. Phase 2 audit decision = green-light (or trivial-skip). |
| **Exit** | All wiring-plan files modified per Create/Modify column. `npm run lint` and `npm run build` pass. No new `console.log`, `// @ts-ignore`, or `any`. Frontmatter `status: In Progress`. |

---

## Workflow checklist

> **Lean loop:** Use the **`lean-dev-flow`** skill for steps 5–7 — it replaces lint-per-chunk + build-per-chunk with the 7-step loop (read→implement→T1 test→typecheck→commit→push→PR) and picks the right test tier for the change shape.
>
> **Worktree efficiency (2026-06-04):** Most lost time is worktree/git friction, not compile time. Keep **≤2–3 active app trees**; for a throwaway "run tests then delete" tree, **symlink `node_modules` + `.env.local`** from the primary (≈1 min vs 3–5 min `npm ci`) — never for a tree you'll keep editing. **Never `git stash` across `git checkout` in a shared tree** (stash is repo-global; a `pop` can inject another branch's changes). The old `rm -rf .next` `dist-leak-scan` workaround is obsolete (PR #43). Full guide: [references/worktrees.md](references/worktrees.md) → [`worktrees-best.md`](../../../tasks/notes/june4/worktrees-best.md).

```
[ ] 0.  App code? Ensure worktree at /home/sk/mdeai/mdeapp/.worktrees/wt-san-NNN-slug
        (run mde-worktree-pr-flow guards first — see references/worktrees.md).
[ ] 1.  Flip Linear issue to In Progress (via MCP or UI).
[ ] 2.  Read every file in the wiring plan, in order.
[ ] 3.  Decide trivial vs non-trivial (table below).
[ ] 4.  For non-trivial, hand off to mdeai-executor subagent.
[ ] 5.  Make changes in wiring-plan order
        (migrations → edge fns → hooks → UI).
[ ] 6.  After each file: run T1 targeted test (not lint, not build).
[ ] 7.  Run `tsc --noEmit` before push (5s, catches import drift).
[ ] 8.  Confirm no scope creep — every change traces to an AC row.
[ ] 9.  Hand off to testing.md.
```

---

## Read-before-edit rule

**Mandatory.** Read every file before issuing the first edit on it.

- Read all wiring-plan files (even those not yet edited) to understand callers.
- Read 1-2 sibling files in the same folder for pattern match.
- For a hook, read every component that calls it (`Grep -n "use<Name>"`).
- For a migration, read the latest migration in [supabase/migrations/](../../../supabase/migrations/) for ordering.
- For an edge function, read [.claude/rules/edge-function-patterns.md](../../rules/edge-function-patterns.md).

Editing without reading is the single most common cause of regressions.

---

## Trivial vs non-trivial routing

| Trivial — edit directly | Non-trivial — hand to `mdeai-executor` |
|------------------------|---------------------------------------|
| ≤5 file edits | >5 file edits |
| ≤1 hour of work | Multi-file feature spanning hooks + components + edge fn |
| Single area | Cross-area (frontend + backend + migration) |
| No new abstractions | Introduces a pattern other tasks will follow |
| No migration | Includes a migration |
| Refactor of one symbol | Refactor of a symbol with >5 callers |

### Subagent handoff prompt

```
Implement task <id> per /home/sk/mde/tasks/prompts/<phase>/<id>-<name>.md.

Constraints:
- Wiring plan is the source of truth.
- Read all referenced files before editing.
- Match CLAUDE.md style guide.
- Do not add features outside the AC list.
- Stop and report if any AC seems impossible.

Return: files modified, npm run build status, deviations from wiring plan.
```

---

## Code quality

The full style guide is canonical in [CLAUDE.md](../../../CLAUDE.md) and [.claude/rules/style-guide.md](../../rules/style-guide.md). This skill does not duplicate it.

Top reminders that catch most issues:

- `@/` path alias only; no `../../`.
- `cn()` for conditional classes.
- All four states (loading / error / empty / success) on data components.
- `(select auth.uid())` subquery in RLS, not direct.
- `import.meta.env.VITE_X`, never `process.env.X` in `src/`.
- AI proposes; never auto-applies.

For full rules, read [.claude/rules/style-guide.md](../../rules/style-guide.md), [.claude/rules/supabase-patterns.md](../../rules/supabase-patterns.md), [.claude/rules/edge-function-patterns.md](../../rules/edge-function-patterns.md), [.claude/rules/ai-interaction-patterns.md](../../rules/ai-interaction-patterns.md).

---

## Migration safety

Summary: draft SQL, draft rollback, RLS in same migration, indexes on FKs and filters, ON DELETE explicit, dev branch first.

Full checklist with examples: [references/migration-safety.md](references/migration-safety.md).

---

## Validation steps

Before exiting Phase 3:

| Command | Pass criterion |
|---------|----------------|
| `npm run lint` | No new errors. Warnings ≤ baseline (see [`/deploy-check`](../../commands/deploy-check.md)). |
| `npm run build` | Exits 0. Bundle within budget. |
| `git diff` self-review | Every hunk maps to an AC row. |
| `Grep -n "console.log"` on changed files | Zero new matches in `src/`. |
| `Grep -n ": any"` on changed files | Zero new annotations. |

---

## Anti-patterns

| Don't | Do |
|-------|-----|
| Edit a file before reading it | Read every wiring-plan file first |
| Add error handling for cases that can't happen | Trust framework + internal callers |
| Refactor adjacent code "while you're in here" | One task = one shippable unit |
| Use `any` to silence a TS error | Narrow with `unknown` + type guard |
| Add a feature not in AC list | Stop and ask; AC is the contract |
| Ship with no loading state | Four states are mandatory per CLAUDE.md |
| Skip the migration's rollback SQL | Always draft it, even if never run |

---

## Routing

| Need | Route to |
|------|----------|
| Stuck on a build/runtime error | **`systematic-debugging`** — see [CLAUDE.md](../../../CLAUDE.md) (Skills) |
| Style or framework question | [CLAUDE.md](../../../CLAUDE.md) + [.claude/rules/](../../rules/) |
| Migration deep-dive | [references/migration-safety.md](references/migration-safety.md) |
| AI/edge-fn patterns | [.claude/rules/ai-interaction-patterns.md](../../rules/ai-interaction-patterns.md) + [.claude/rules/edge-function-patterns.md](../../rules/edge-function-patterns.md) |
| Subagent execution for complex tasks | `mdeai-executor` agent (Agent tool) |

Hand off to [testing.md](testing.md) when build is green.
