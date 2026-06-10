# Linear board — MDEAPP

**Rule:** [`.cursor/rules/mdeai-linear.mdc`](../../.cursor/rules/mdeai-linear.mdc)  
**Project:** [MDEAPP issues](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues)  
**Events view:** [events board](https://linear.app/sanjiovani/view/events-02e135249149)

## Columns (only these)

| Column | Sort |
|--------|------|
| Todo | Manual — **implementation order** (top = next) |
| In Progress | Active work (max 1–3) |
| In Review | Manual — impl order; **~10 items near top** |
| Done | Verified on disk |

Flow: Todo → In Progress → In Review → Done

## Implementation order sources

1. [`tasks/linear/02-views-sort.md`](02-views-sort.md) — P0 pull order  
2. [`tasks/INDEX-SCREEN-FIRST.md`](05-INDEX-SCREEN-FIRST.md) — screen order  
3. [`tasks/screens/INDEX.md`](screens/INDEX.md) — progress tracker  

## Cursor delegation

`@Cursor … [repo=amo-tech-ai/mdeapp]` — [Cursor Linear docs](https://cursor.com/docs/integrations/linear)

Log: [`todo-sort-log.json`](todo-sort-log.json) — last run sorted **133** Todo issues.

**Top of Todo now:**

1. SAN-178 — Andrés G1  
2. SAN-115 — EVP-001 proof  
3. SAN-117 — EVP-013 EventCard  
4. SAN-118 — EVP-014 host list  
5. … maps / vector / phase 2 …  
**Bottom:** GS-005→009 · OCL-* · CTEST-*

Re-sort after bulk changes:

```bash
node scripts/linear-sort-todo.mjs
```

Created [`.cursor/rules/mdeai-linear.mdc`](.cursor/rules/mdeai-linear.mdc).

## What it enforces

| Topic | Rule |
|-------|------|
| **Columns** | Todo → In Progress → In Review → Done only |
| **Todo sort** | Manual — top = next in **implementation order** |
| **In Review sort** | Same order; ~10 active items near top |
| **Source of truth** | `tasks/**` disk + evidence → then Linear |
| **Order sources** | P0 pull → [`INDEX-SCREEN-FIRST.md`](tasks/INDEX-SCREEN-FIRST.md) → [`screens/INDEX.md`](tasks/screens/INDEX.md) → milestone bucket |
| **Sync triggers** | Start → In Progress · PR → In Review · verified Done → Done |
| **Cursor delegation** | `@Cursor … [repo=amo-tech-ai/mdeapp]` per [Cursor Linear docs](https://cursor.com/docs/integrations/linear) |
| **MCP** | Linear plugin `list_issues` / `save_issue`; scripts for bulk import |

## Also updated

- [`tasks/notes/03-linear-notes.md`](tasks/notes/03-linear-notes.md) — condensed checklist + links
- [`tasks/linear/01-linear.md`](tasks/linear/01-linear.md) + [`02-views-sort.md`](tasks/linear/02-views-sort.md) — rule + [events view](https://linear.app/sanjiovani/view/events-02e135249149)
- [`.cursor/rules/README.md`](.cursor/rules/README.md) + Done gates in `mdeai-skills-best-practices.mdc`

## Manual Linear UI (one-time)

On [MDEAPP project](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues): trim statuses to the 4 columns, set **Todo** and **In Review** views to **Manual sort**, drag P0 queue to top per [`02-views-sort.md`](tasks/linear/02-views-sort.md). Linear API/MCP can't set manual board order — agents note reorder in comments when they can't drag.

Want me to pull current SAN-* states via Linear MCP and diff against disk for a sync audit?
