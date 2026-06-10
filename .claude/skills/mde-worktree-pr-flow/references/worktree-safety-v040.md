# Worktree safety v0.4.0 — before / after risk assessment

**Skill:** `mde-worktree-pr-flow` (keep; do not replace with generic [linear-worktree](https://www.skills.sh/mblode/agent-skills/linear-worktree)).

**June 4, 2026 incident:** `/.worktrees/` (~3 GB) was not gitignored → thousands of untracked paths, mixed commits risk, agent confusion.

---

## Before v0.4.0 guards (residual risk)

| Risk | Severity | What happened |
|------|----------|----------------|
| `.worktrees/` not in `.gitignore` | 🔴 Critical | 3 GB untracked; `git status` unusable; near-miss `git add .` |
| `github` symlink not ignored | 🔴 Critical | Trailing-slash rule missed symlink |
| Nested `git worktree add` inside worktree | 🟡 High | `main` checked out in one tree while creating another → merge failures |
| Stale `git worktree` + remote refs | 🟡 Medium | Orphan paths, confusing `worktree list` |
| Soft gitignore warning only | 🟡 Medium | Skill echoed "NOT IGNORED" but scripts did not **exit 1** |

---

## After v0.4.0 guards (target state)

| Control | Script / step | Effect |
|---------|---------------|--------|
| **Gitignore pre-check** | `scripts/guard-gitignore-worktrees.sh` | **Hard fail** if `.worktrees/` or `github` not ignored |
| **Detection guard** | `scripts/guard-worktree-context.sh` + Step 0 | Block nested worktree; `--allow-linked` = use current tree |
| **Preflight integration** | `verify-clean.sh` calls gitignore guard | Cannot start "clean" work with leak paths |
| **Weekly tidy** | `scripts/tidy-worktrees.sh` | `fetch --prune`, `worktree prune`, `remote prune origin` |
| **Slice discipline** | `tasks/commit/june-4/COMMIT-PLAN.md` | Docs vs `mdeapp/` vs plan move — one PR per slice |

---

## Optional: linear-worktree pattern (not required)

[mblode/agent-skills linear-worktree](https://www.skills.sh/mblode/agent-skills/linear-worktree) uses **sibling** dirs: `$REPOS_BASE/$REPO_NAME-$ISSUE_ID`.

**mdeai convention (this repo):**

| Repo | Worktree location | Branch |
|------|-------------------|--------|
| `mdeai` (planning) | `.worktrees/wt-san-NNN-slug` | docs/tasks only |
| `mdeapp` (app) | `/home/sk/mde-wt-*` or `.worktrees/` under app repo | `ai/san-NNN-slug` |

Use Linear issue ID in branch name; optional `COMMIT-###` ledger row before coding.

---

## Operator checklist (new worktree)

```bash
# 1 — leak guard (must pass)
bash .agents/skills/mde-worktree-pr-flow/scripts/guard-gitignore-worktrees.sh

# 2 — context (must pass before *creating* another tree)
bash .agents/skills/mde-worktree-pr-flow/scripts/guard-worktree-context.sh

# 3 — preflight
bash .agents/skills/mde-worktree-pr-flow/scripts/verify-clean.sh

# 4 — create (mdeapp example; from main checkout, not inside a worktree)
git fetch origin
git worktree add .worktrees/wt-san-546-ops-journey -b ai/san-546-ops-journey origin/main

# 5 — weekly (cron or manual)
bash .agents/skills/mde-worktree-pr-flow/scripts/tidy-worktrees.sh
```

---

## What we explicitly did **not** add

- Submodule-specific worktree managers  
- Merge-expert / alias packs  
- Replacing `mde-worktree-pr-flow` with third-party skills  
- Mandatory Linear MCP hook (optional mapping only)

---

## Grade

| Area | Before | After |
|------|--------|-------|
| Leak prevention | 🔴 | 🟢 |
| Nested worktree prevention | 🟡 | 🟢 |
| Hygiene / prune | 🟡 | 🟢 |
| mdeai PR/merge discipline | 🟢 (unchanged) | 🟢 |

**Overall:** v0.4.0 closes the June 4 `.worktrees/` class of failures without rewriting the skill.
