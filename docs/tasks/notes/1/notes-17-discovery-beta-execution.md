---
title: Discovery Beta — execution playbook
updated: 2026-06-03
companion: improve.md · verify-task.md · notes-14.md
---

> **Summary:** How we ship Discovery Beta — one task, one PR, three proof layers (disk → tests → prod), then Linear Done. Use this before every implementation slice.
>
> **Note format:** Every file in `tasks/notes/` starts with a `> **Summary:**` block (1–2 plain sentences).

# Discovery Beta execution

Tighter execution, same gates in `improve.md` and `verify:task`.

## Core shift: prove before expand

**One task → one branch → one PR → proof → merge → Linear Done.**

No parallel feature work, no doc/Linear churn mid-slice, no "looks done" from status fields. Each task gets a **3-layer proof stack** before shippable:

| Layer | What | Pass criteria |
|-------|------|---------------|
| **1. Disk** | Grep/read spec + `tasks.md` row | Files exist; no duplicate branch doing same work |
| **2. Automated** | `npm run verify:task -- <ID>` + scoped vitest/e2e | Exit 0 on touched area |
| **3. Runtime** | Fresh `npm run dev` + localhost + **mdeai.co** where task says prod | Persona-visible behavior matches AC |

Linear flips **only after layer 3** for prod-gated tasks (auth, maps, ADK, journeys).

---

## Per-task loop

```
1. PRE-FLIGHT (5 min, no code)
   - Linear status vs disk vs open PRs — reject stale "In Review" (e.g. SAN-490)
   - Read ONE spec row + DoD table
   - Classify: env-only | code | infra — don't code env tasks

2. IMPLEMENT (smallest diff)
   - Match existing patterns (café chat → restaurant page, etc.)
   - No adjacent cleanup

3. TEST (scoped → full)
   - verify:task --skip-floor while iterating
   - verify:task (full floor) once before PR
   - Playwright/e2e only for persona-visible changes
   - Prod curl + chat-smoke / journey script when row says prod

4. SHIP
   - PR body: commands run + exit codes + preview/prod URL
   - Merge only on green floor
   - Linear comment + Done with evidence link

5. HANDOFF
   - Move cursor:active → next queued issue
   - Update notes-14 one-liner only (no new planning docs)
```

---

## Task-type efficiency

| Task | Efficient approach | Proof |
|------|-------------------|-------|
| **SAN-367** (auth) | Merge PR #56 — already coded | `verify:task AUTH-011` + prod login smoke |
| **SAN-369** (Map ID) | **Vercel env + evidence PR** — code exists | Preview pins visible; vitest map-id; don't block on Places 403 |
| **SAN-368** (ADK) | **Infra PR** — Cloud Run + Vercel env | `verify:cloud-run-grounding` against remote URL |
| **SAN-490** (`/restaurants`) | **Feature PR** — page + reuse `/api/restaurants/search` | `verify:task SCREEN-023` + new Playwright spec |
| **SAN-314** (VEN-031) | **Test-only PR** after pages work | Fix SCREEN-021 stub; add SCREEN-023 e2e; `verify:task VEN-031` |
| **F13** | **Create Linear issue first**, then memory/thread slice | Turn-11 remembers turn-1 after dev restart |

**Rule:** env/infra tasks get thin PRs (evidence + scripts). Feature tasks get UI + tests in the same PR. Test gates come **after** the thing they test exists.

---

## What stops fake-done

1. **Status ≠ shipped** — Linear "In Review" without PR/disk proof → reset to In Progress or build it.
2. **Localhost ≠ prod** — MAP/auth/ADK tasks require mdeai.co proof, not just `:3001`.
3. **Stale dev server** — kill + restart before any UI/agent claim.
4. **Wrong verify mapping** — only use registered IDs in `verify-task.mjs`; add registry entry if a task repeats.
5. **Duplicate branches** — e.g. `feat/search-003-restaurants` ≠ SCREEN-023 page; grep before coding.
6. **Commerce creep** — ignore PRs #38/#39 until soak passes; Discovery Beta only.

---

## Immediate sequence (next 48h)

| Step | Action | Done when |
|------|--------|-----------|
| **0** | Merge **PR #56** | `verify:task AUTH-011` green + prod auth smoke |
| **1** | Branch `ai/san-369-…` — Map ID on Vercel | Pins on prod preview; evidence file |
| **2** | Branch `ai/san-368-…` — ADK env | Remote grounding invoke passes |
| **3** | Branch `ai/san-490-…` — `/restaurants` page | API + page + Playwright |
| **4** | Branch `ai/san-314-…` — venue e2e fixes | `verify:task VEN-031` |
| **5** | F13 — new Linear issue, then persistence slice | Cold-start memory test |

Linear updates batched at merge time (comment + label move + Done), not during implementation.

---

## PR proof block (every PR)

```text
Task: SAN-369 / MAP-008B
Branch: ai/san-369-map-008b-map-id-on-production
Commands:
  npm run verify:task -- MAP-008B     → exit 0
  npm run floor                       → exit 0
  [prod] pins visible at mdeai.co after "restaurants Provenza"
Files: [list]
Linear: SAN-369 → Done after merge + prod check
Next: SAN-368
```

**Bottom line:** efficiency = serial shipping with typed workflows (env vs code vs tests). Correctness = `verify:task` + fresh dev + prod smoke before merge or Linear Done.
