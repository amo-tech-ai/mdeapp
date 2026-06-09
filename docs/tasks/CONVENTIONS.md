---
title: tasks/ conventions
updated: 2026-06-04
---

# tasks/ conventions

How task specs are organized in this repo. Keep it boring and consistent.

## Folder shape

```
tasks/<feature>/<TASK-ID>/
  spec.md          # required — what/why/acceptance
  evidence.md      # optional — runtime/QA proof (only when the task has it)
```

- **`<feature>`** is one of the canonical feature folders (see list below), not a person or a sprint.
- **`<TASK-ID>`** matches the Linear ID (`SAN-NNN`) or the canonical prefix in `linear.md`. Deprecated prefixes (`SCREEN-*`, `EVP-*`, `IMP-*`) are not used for new work.
- Single-file tasks may live as `tasks/<feature>/<TASK-ID>.md` until they grow a second artifact.

## Canonical feature folders

`venues · restaurants · nightlife · events · real-estate · maps · trips · data · intelligence · ux · mobile · revenue · payments · contest · testing · notes · process (+process/linear) · ops · eng`

- `ops/` = chatwoot / support. `eng/` = mastra / copilotkit infra specs. `process/` = PR docs, commit plans; `process/linear/` = Linear sync/meta.

## Two rules that keep this clean

1. **One feature = one PR.** A change set touches one feature folder. Mixing features (or mixing docs with infra) is the "mega-PR" anti-pattern — split it.
2. **Migrate on touch, never big-bang.** Don't relocate the whole tree in one PR (unreviewable, breaks every link at once). When you next edit a task, `git mv` it into its feature folder and fix its links in the same small PR.

## Out of scope for `tasks/`

App code, tests, and runtime live in the separate `mdeapp/` repo. `tasks/` holds **specs, evidence, and process docs only** — so lint/build/Playwright/Vercel don't apply to commits here.
