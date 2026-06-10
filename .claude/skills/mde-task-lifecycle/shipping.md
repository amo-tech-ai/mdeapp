---
title: Phase 5 — Shipping
impact: HIGH
impactDescription: Bookkeeping contract, changelog, project gates
tags: mde-task-lifecycle, shipping, pr, changelog
---

# Phase 5 — Shipping

Coordinator. Owns the three-record bookkeeping contract. Commit/PR mechanics live in `git-commit` / `mde-github` — not duplicated here.

**Phase 5 is mandatory.** It is the only durable proof the work shipped.

---

## Table of contents

1. [Entry / exit criteria](#entry--exit-criteria)
2. [The shipping checklist](#the-shipping-checklist)
3. [Three-record bookkeeping](#three-record-bookkeeping)
4. [Templates](#templates)
5. [Coverage-matrix updates](#coverage-matrix-updates)
6. [Push policy](#push-policy)
7. [Rollback awareness](#rollback-awareness)
8. [Routing](#routing)

---

## Entry / exit criteria

| | Criterion |
|---|---|
| **Entry** | Phase 4 evidence captured. [`/deploy-check`](../../commands/deploy-check.md) **full** (or equivalent) green. |
| **Exit** | Three records updated in sync (`tasks/todo.md`, `CHANGELOG.md`, prompt frontmatter). Coverage matrix updated if applicable. Commit created. User informed with file links. |

---

## The shipping checklist

```
[ ]  1. Run [`/deploy-check`](../../commands/deploy-check.md) **full**. Block if any gate fails.
[ ]  2. Update tasks/todo.md row to ✅ DONE with date.
[ ]  3. Add CHANGELOG.md entry under today's YYYY-MM-DD section.
[ ]  4. Flip prompt frontmatter status: In Progress → Done.
[ ]  5. Annotate AC checkboxes [x] ... — VERIFIED YYYY-MM-DD.
[ ]  6. Update coverage matrix S → C if applicable.
[ ]  7. Self-review the diff (no console.log, no scope creep).
[ ]  8. Stage explicit files (never git add -A).
[ ]  9. Hand commit to git-commit skill (canonical format below).
[ ] 10. Verify git status clean.
[ ] 11. App worktree used? After merge: git worktree remove + branch -d
        (see references/worktrees.md).
[ ] 12. Report file links to user.
[ ] 13. Push only if user explicitly asks.
```

---

## Three-record bookkeeping

| Record | Path | What changes |
|--------|------|-------------|
| Live status | [tasks/todo.md](../../../tasks/todo.md) | Row updated to ✅ DONE; risk-flag rows replaced with FIXED rows; header note bumped. |
| Daily log | [CHANGELOG.md](../../../CHANGELOG.md) | One row under today's date, grouped by Features / Fixes / Trio / Docs / Infra. |
| Spec | `tasks/prompts/.../<id>-*.md` | Frontmatter `status: Done`; AC boxes checked with verification dates. |

If any one is stale, the task is not shipped.

---

## Templates

Quick reference. Full templates with worked examples: [references/changelog-templates.md](references/changelog-templates.md).

### `tasks/todo.md` row

```markdown
| 17A | paperclip-bridge Docker service | infrastructure | P0 | ✅ DONE 2026-05-09 | — |
```

### `CHANGELOG.md` entry

```markdown
## 2026-05-09

### Trio
- 17A paperclip-bridge — Docker service joining all 4 networks; HMAC-authenticated proxy. Logs to `agent_runs`. ([prompt](tasks/prompts/advanced/17A-paperclip-bridge-docker-service.md))
```

Group rules:
- **Features** — new user-visible capability
- **Fixes** — bug fix on shipped behavior
- **Trio** — Paperclip / Hermes / OpenClaw / Postiz changes
- **Docs** — prompt, PRD, or rules updates
- **Infra** — build, deploy, dev-env, CI/CD

### Prompt frontmatter close-out

```yaml
---
task_id: 17A
title: paperclip-bridge Docker service
status: Done           # was: In Progress
shipped_at: 2026-05-09
---
```

In the body, annotate each AC:

```markdown
- [x] Bridge container starts with `/health` endpoint — VERIFIED 2026-05-09
- [x] HMAC middleware rejects bad signatures — VERIFIED 2026-05-09
```

### Commit message format

Per [CLAUDE.md](../../../CLAUDE.md) git protocol. Hand to [`git-commit`](../git-commit/SKILL.md).

```
<type>(<area>): <id> <title> — <outcome>

Co-Authored-By: Claude <noreply@anthropic.com>
```

Type: `feat` / `fix` / `refactor` / `docs` / `chore` / `test` / `infra`.
Area: `host` / `landlord` / `sponsor` / `trio` / `auth` / `pipeline` / `ai` / `repo`.

---

## Coverage-matrix updates

[tasks/trio/00-trio-task-coverage-matrix.md](../../../tasks/trio/00-trio-task-coverage-matrix.md) state transitions:

| From | To | Triggered by |
|------|----|--------------|
| `G` (gap) | `P` (planned) | Prompt drafted but not yet specced |
| `P` (planned) | `S` (specced) | Phase 1 completes |
| `S` (specced) | `C` (complete) | Phase 5 completes |

Append a one-line entry at the bottom with date and task ID when a row changes state.

---

## Push policy

**Never push without explicit user request.** This is a CLAUDE.md rule.

| Action | Authorization |
|--------|---------------|
| Commit creation | Yes, every Phase 5 |
| Push to remote | Only on explicit "push" / "open PR" |
| Force-push to main/master | Never |
| Force-push to feature branch | Only on explicit user ask |
| Open PR | Route to [`mde-github`](../mde-github/cli.md) |

---

## Rollback awareness

| Situation | Action |
|-----------|--------|
| Bug introduced, fix is small (≤15 min) | Forward-fix in follow-up commit; note in CHANGELOG. |
| Bug introduced, fix is unclear | `git revert <sha>`; reopen prompt to `In Progress`. |
| Migration broke production | Apply rollback SQL from migration's comment block immediately; then triage. |
| Edge function returning 500 | Roll back via `supabase functions deploy` of previous version; investigate before re-shipping. |

A rollback is not a failure — it is the right move when forward-fix risk exceeds revert risk.

---

## Routing

| Need | Route to |
|------|----------|
| Pre-ship gate verification | [`/deploy-check`](../../commands/deploy-check.md) |
| Commit message authoring + staging | [`git-commit`](../git-commit/SKILL.md) |
| PR creation, issue linking, release notes | [`mde-github`](../mde-github/cli.md) |
| Roadmap update after milestone closes | [`roadmap`](../roadmap/SKILL.md) |
| Full templates (todo / CHANGELOG / frontmatter / commits) | [references/changelog-templates.md](references/changelog-templates.md) |

After Phase 5: lifecycle complete. Report file links. Offer next P0 if user wants to continue.
