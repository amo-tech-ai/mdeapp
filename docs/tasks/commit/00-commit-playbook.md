---
title: Commit playbook — small slices
parent: ./INDEX.md
aligns: mde-worktree-pr-flow (PR size table)
---

# Commit playbook

**Cursor rule (agents):** [`.cursor/rules/mdeai-commit-discipline.mdc`](../../.cursor/rules/mdeai-commit-discipline.mdc) — `alwaysApply: true`; commit after each ledger row, not at end of week.

## Why commits get too large

| Mistake | Effect |
|---------|--------|
| Days of work on `main` with no commits | One scary diff (+1,800 lines) |
| `git add .` | Maps + events + env + smokes in one blob |
| `tasks/` outside `mdeapp` git | Planning “done” but GitHub unchanged |
| No ledger before coding | Hard to split after the fact |

## Size limits (hard)

Per **commit** (not whole PR):

| Type | Files | Lines (approx) | Example scope |
|------|------:|---------------:|---------------|
| **fix** | 1–5 | ≤150 | lint, single bug, `shrink-0` on EventCard |
| **feat** | 5–15 | ≤400 | one surface: maps clustering OR event fast path |
| **chore** | any | ≤200 | `package.json`, smokes, `.env.example` only |
| **docs** | docs only | — | `mdeapp/docs/**` only |

Per **PR** (stack of commits): ≤12 files touched *net* for a feature PR; split by domain if more.

**Stop rule:** If `git diff --stat origin/main` shows **>20 files** or **>500 insertions**, update [COMMIT-LEDGER.md](./COMMIT-LEDGER.md) and split **before** the next commit.

---

## Commit stack template (current ship example)

Use IDs `C-001`, `C-002`, … in ledger. Order matters (review + rollback).

| ID | Scope | Verify before commit |
|----|-------|----------------------|
| C-000 | `.gitignore` — `supabase/.temp/` only | `npm run lint` |
| C-001 | Maps platform + clustering | `npm test -- map-clustering map-pin` |
| C-002 | Places client + photo proxy | `npm test -- places` |
| C-003 | Grounding + search router | `smoke:grounding-attribution` |
| C-004 | Chat shell + tool renders | `npm run build`, `curl :3001/` |
| C-005 | Events fast path + panel | `perf-events-chat-latency.mjs` |
| C-006 | `package.json`, lockfile, `.env.example`, docs | `npm run floor` |

Full gates: [CHECKLIST.md](./CHECKLIST.md).

After each commit: `npm run floor` (or subset that touched area).

---

## Message format (Conventional Commits)

```text
<type>(<scope>): <imperative summary ≤72 chars>

<body: why, not file list — 1–3 bullets>
```

| type | When |
|------|------|
| `feat` | User-visible behavior |
| `fix` | Bug / regression |
| `test` | Tests only |
| `chore` | Tooling, deps, env.example |
| `docs` | Markdown in repo only |

**Scopes:** `maps`, `events`, `chat`, `copilot`, `grounding`, `mastra` — one per commit.

---

## Workflow (every task)

1. **Preflight** — `cd mdeapp && npm run commit:status`
2. **Ledger** — Add row to [COMMIT-LEDGER.md](./COMMIT-LEDGER.md) with file globs *before* coding
3. **Stage surgically** — `git add path1 path2` (never `.` unless chore-only row says so)
4. **Commit** — message references `C-00x`
5. **Mark ledger** — `status: committed` + `sha: abc1234`
6. **Push** when PR row is complete — one PR per branch goal

---

## Parent repo (`/home/sk/mdeai`)

| Content | Track here | Ship how |
|---------|------------|----------|
| `tasks/*.md`, audits, changelog | COMMIT-LEDGER “planning” column | Optional: second repo or copy summary into PR body |
| `screenshots/` | PR evidence links | Never in `mdeapp` git |
| Evidence | `tasks/notes/*-evidence.md` | Link in PR + Vercel comment |

If planning must version with code: add `mdeai-docs` repo or monorepo later — until then, **ledger links task IDs → commit SHAs**.

---

## Anti-patterns

- ❌ One commit: “WIP everything since May 25”
- ❌ Commit on red `floor`
- ❌ Mixed `feat(maps,events,grounding)` scope in subject
- ❌ Amending pushed commits (new commit instead)
- ❌ Ledger empty while `git status` shows 30+ files

---

## Related

- Skill: `mde-worktree-pr-flow` — PR size, split playbook
- Deploy audit: [01-notes.md](./01-notes.md)
- Task index: [../INDEX.md](../INDEX.md)
