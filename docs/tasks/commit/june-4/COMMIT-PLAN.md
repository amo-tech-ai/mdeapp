---
title: Commit Plan — split dirty working tree (June 4, 2026)
branch: docs/venues-index-canonical-order
author: senior git-audit pass
status: ready-to-execute (slice 1 gitignore already applied to working tree, uncommitted)
---

# Commit Plan — June 4, 2026

Split the dirty working tree on `docs/venues-index-canonical-order` into focused,
reviewable branches. **No mega-commit. No `git add -A`. Explicit paths only.**

## TL;DR verdict

- **Safe to commit (its own PR):** SAN-491 venue docs — the only thing the branch name promises.
- **Must be split out:** `plan/`→`docs/plan/` move, `tasks/**` import, `.mcp.json`+wrapper scripts, old-script deletions.
- **Must never be committed:** `.worktrees/` (3 GB), `github` symlink. ✅ now `.gitignore`-blocked.
- **SAN-491 merge-ready?** Yes, *once isolated* — it's docs-only, no `mdeapp/src/**` risk.

## Working-tree snapshot (at audit time)

| Kind | Count | Where |
|---|---|---|
| Tracked modified (M) | ~125 | mostly `tasks/**`, + `CLAUDE.md`, `.mcp.json`, `sitemap.md` |
| Tracked deleted (D) | 688 | whole `plan/**` (451) + 29 `scripts/` + tasks moves |
| Untracked (??) | 1,252 | `docs/plan/**` (432), new `tasks/**` (717), root `DESIGN.MD`/`plan.md`/`linear.md` |
| **Leaks (now ignored)** | — | `.worktrees/` 3 GB, `github` symlink |

`git diff --shortstat`: 813 files, +4,879 / −185,775 (the huge deletion count = the `plan/` move, verified byte-identical).

## Three gotchas the naive plan misses

1. **`.worktrees/` (3 GB) was NOT ignored** — only `/.wt-*/` was in `.gitignore`, dir is `.worktrees/`. ✅ Fixed: added `/.worktrees/`.
2. **`github` is a symlink** → `mdeapp/github`; the `/github/` rule (trailing slash) missed it. ✅ Fixed: added `/github`.
3. **The 8 `.obsidian` files are already TRACKED** — a `.gitignore` rule can't untrack them. They need `git rm --cached` (done in Slice 1). Files stay on disk; only the index entry is dropped.

## Mechanism (robust — avoids working-tree-carry conflicts)

This branch is **10 commits ahead of `main`** and several working-tree-modified files
(`sitemap.md`, `tasks/INDEX.md`, …) also differ in those commits — so branch-hopping
*with* the dirty tree can conflict. Instead:

1. Stay on `docs/venues-index-canonical-order`. Build clean, single-purpose commits via
   **explicit `git add <paths>`**. After every stage: `git diff --cached --name-only` and
   eyeball it. Commit only if the slice is clean.
2. When all slices are committed, rebuild each as a PR branch off `main`:
   ```bash
   git switch -c <slice-branch> main
   git cherry-pick <slice-sha>
   git push -u origin <slice-branch>
   ```
   Cherry-pick lands only that slice on `main` → clean single-purpose PR.

Pre-stage guard for **every** commit — abort if any hit:
```bash
git diff --cached --name-only | grep -E '\.env|\.worktrees/|^github|/\.obsidian/' && echo "STOP: leak staged"
```

## Slices (commit in this order)

### 1 — `chore/gitignore-dev-state`  🟢 do first
Protect the repo. Already half-applied (`.gitignore` edited in working tree).
```bash
git add .gitignore
git rm -r --cached docs/.obsidian plan/.obsidian      # untrack editor state (keeps files on disk)
git diff --cached --name-only                          # expect: .gitignore + 8 .obsidian deletions only
git commit -m "chore: ignore .worktrees/, github symlink, untrack .obsidian editor state"
```

### 2 — `docs/san-491-venues-index-sync`  🟢 the real task
SAN-491 venue index + SCREEN-022 evidence + sitemap status. **Merge-ready.**
```bash
git add tasks/venues/ tasks/venues/tasks/evidence/SCREEN-022-evidence.md \
        sitemap.md tasks/progres.md tasks/maps/INDEX.md
git diff --cached --name-only                          # confirm venues/sitemap scope only
git commit -m "docs(venues): sync SAN-491 venue index canonical order + SCREEN-022 evidence"
```
> Note: the *already-committed* SAN-491 work (cff809a etc.) is separate; this is only the uncommitted delta.

### 3 — `chore/plan-to-docs-migration`  🟡 pure move, review by `--stat`
`plan/**` (deleted) → `docs/plan/**` (added). Verified byte-identical on sample.
```bash
git add plan/ docs/plan/                                # stages the deletions + the new copies
git status --short | grep -E '^.D plan/|^\?\? docs/plan/' | wc -l   # sanity: counts match
git commit -m "chore(docs): relocate plan/ library to docs/plan/ (content-identical move)"
```
Reviewer check: `git diff --cached --stat` should show paired delete/add, no content churn.

### 4 — `docs/task-library-import`  🟡 large but isolated
New organized `tasks/**` specs (venues backlog, contest, ux, data, revenue, PR, notes).
```bash
git add tasks/                                          # everything else under tasks/ not already in slice 2
git diff --cached --name-only | grep -v '^tasks/' && echo "STOP: non-tasks file leaked"
git commit -m "docs(tasks): import organized task library (venues, contest, ux, data, revenue)"
```

### 5 — `chore/mcp-config-updates`  🟡 coupled — include wrapper scripts
`.mcp.json` (copilotkit→stdio, +gcp, +chatwoot). **The wrapper scripts are untracked — must ship together** or MCP startup breaks for everyone.
```bash
# First verify .mcp.json doesn't reference a script you're about to delete in slice 6:
grep -n 'mcp-google-developer-knowledge\|test-mcp-google' .mcp.json    # expect: no match
git add .mcp.json scripts/mcp-copilotkit.sh scripts/mcp-chatwoot.sh CLAUDE.md
git diff --cached --name-only
git commit -m "chore(mcp): copilotkit stdio wrapper + gcp/chatwoot servers; fix CLAUDE.md MCP id"
```
> `CLAUDE.md` here because its only edits are the MCP-id correction + hook-count fix — same theme.

### 6 — `chore/remove-old-linear-scripts`  🟡 confirm unused
29 one-shot `linear-import-*` / seed scripts. Verify nothing references them first.
```bash
grep -rEl 'linear-import|linear-apply|seed-mis-phase1' package.json mdeapp/package.json .github 2>/dev/null
# if clean:
git add -A scripts/                                     # -A scoped to scripts/ ONLY (safe)
git diff --cached --name-only | grep -v '^scripts/' && echo "STOP"
git commit -m "chore(scripts): remove completed one-shot Linear import/seed scripts"
```

Leftover root files (`DESIGN.MD`, `plan.md`, `linear.md`, `linear-reference.md`, `README.md`,
`changelog`, `index-skills.md`, `skills-lock.json`): decide per-file — most belong with slice 3
(docs reorg) or a tiny `chore/root-doc-pointers` follow-up. Do **not** sweep them in blindly.

## Testing — right-sized (senior call)

**Zero `mdeapp/src/**` changes in any slice** → the elaborate per-branch lint/typecheck/
build/Playwright/Vercel matrix is overkill and tests nothing the diff touches.

Run **once**, as a baseline on `main` (not 6×):
```bash
cd mdeapp && npm run lint && npm run build && npm test -- --run
```
Per-slice: only a **markdown/link sanity** + the pre-stage leak guard. The only slice with any
runtime surface is **Slice 5 (.mcp.json)**, and it affects *local MCP dev*, not the app or Vercel —
smoke it by launching `npm run dev` and confirming MCP servers connect.

**Explicitly out of scope (separate ticket):** authoring new Playwright tests for
`/venues` `/restaurants` `/nightlife` `/events` / mobile. That is feature-test work, not
working-tree hygiene — conflating them bloats every PR. File as its own `test:` task.

**Vercel:** doc/config PRs don't change `mdeapp/src/**`, so preview deploys are a no-op signal.
Reserve Vercel preview + smoke for the eventual app-code branches.

## Final report skeleton (fill after execution)

| Slice | Files | Tests | Risk | Score /100 | Merge Ready |
|---|---|---|---|---:|---|
| 1 gitignore | .gitignore +8 untrack | guard | low | — | 🟢 |
| 2 SAN-491 | ~6 | links | low | — | 🟢 |
| 3 plan→docs | ~880 (move) | --stat pairing | low | — | 🟡 |
| 4 tasks import | ~830 | links | low | — | 🟡 |
| 5 mcp config | 4 + scripts | dev MCP smoke | med | — | 🟡 |
| 6 script delete | 29 | grep refs | med | — | 🟡 |

Grade key: 🟢 90–100 ready · 🟡 75–89 review · 🟠 60–74 risky · 🔴 <60 blocked.

## Worktree discipline (v0.4.0 — use with slices)

**Skill:** `.agents/skills/mde-worktree-pr-flow` (keep; do not replace). **Risk doc:** `references/worktree-safety-v040.md`.

Before any new `git worktree add` on this repo:

```bash
bash .agents/skills/mde-worktree-pr-flow/scripts/guard-gitignore-worktrees.sh
bash .agents/skills/mde-worktree-pr-flow/scripts/guard-worktree-context.sh
bash .agents/skills/mde-worktree-pr-flow/scripts/verify-clean.sh
```

Weekly: `bash .agents/skills/mde-worktree-pr-flow/scripts/tidy-worktrees.sh`

**Two git roots:** planning = `mdeai` (this file); app = `mdeapp/` (separate remote). One worktree per goal per repo — see `mde-wt-search-clean` for app `main`.

Optional sibling pattern: [linear-worktree](https://www.skills.sh/mblode/agent-skills/linear-worktree) — not required; mdeai uses `.worktrees/wt-san-NNN-slug`.

---

## What's done vs pending

- [x] Slice 1 working-tree edit (`.gitignore`) — leaks now unstageable (verified via `git check-ignore`)
- [ ] Slices 1–6 commits (explicit staging)
- [ ] Cherry-pick each onto `main`, push, open focused PRs
- [ ] Baseline `lint && build && test` on main
- [ ] Separate ticket: Playwright browse-page tests
