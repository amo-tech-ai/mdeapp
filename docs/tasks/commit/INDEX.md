---
title: Commit tracking (mdeapp)
updated: 2026-05-28
status: main @ e8d2a60; PR #1–#12 merged; remaining C-010d, C-012, C-013
git_root: ../../mdeapp/
skill: ../../.claude/skills/mde-worktree-pr-flow/SKILL.md
---

# Commit tracking

Git history lives only in **`mdeapp/`**. This folder is the **planning ledger** so work does not pile into one 98-file push.

| Doc | Use when |
|-----|----------|
| [**00-commit-playbook.md**](./00-commit-playbook.md) | Rules, size limits, split order, message format |
| [**COMMIT-LEDGER.md**](./COMMIT-LEDGER.md) | **Ledger** — shipped stack + next C-004 row |
| **Cursor rule** | [`.cursor/rules/mdeai-commit-discipline.mdc`](../../.cursor/rules/mdeai-commit-discipline.mdc) — commit often, small slices |
| [**may-27/AUDIT-2026-05-28-remaining-commits.md**](./may-27/AUDIT-2026-05-28-remaining-commits.md) | **Forensic** — remaining slices + % correct |
| [**may-27/tasks/INDEX.md**](./may-27/tasks/INDEX.md) | **Open commit tasks** C-010d, C-012, C-013 |
| [**may-27/working-tree-audit-2026-05-27.md**](./may-27/working-tree-audit-2026-05-27.md) | **WIP split** — 55 files, commit/PR plan (no ship yet) |
| [**checklist/27-may-notes.md**](./checklist/27-may-notes.md) | **Latest** — PR #6/#7 merge + floor proof |
| [**checklist/26-may-checklist.md**](./checklist/26-may-checklist.md) | **Production tracker** — dots, %, verdict vs external audit |
| [**CHECKLIST.md**](./CHECKLIST.md) | **Per-commit gates** — tick before each `git add` |
| [**01-notes.md**](./01-notes.md) | Staging paths + ship-week notes |
| [**PROGRESS-TASK-TRACKER.md**](./PROGRESS-TASK-TRACKER.md) | GO/NO-GO + verification table |
| [**audits/INDEX.md**](./audits/INDEX.md) | Per-slice forensic audits |

**Preflight (from `mdeapp/`):**

```bash
npm run lint && npm run typecheck && npm run floor
git diff --stat origin/main   # when on a feature branch
```

---

## One-line discipline

```text
1 branch goal → ledger rows → commit → floor → push → PR → clear ledger row
```

Never `git add .` without a ledger row ID (`C-###`).

**Agents:** load `.cursor/rules/mdeai-commit-discipline.mdc` when staging commits; load `.cursor/rules/mdeai-testing.mdc` before marking UI tasks Done.
