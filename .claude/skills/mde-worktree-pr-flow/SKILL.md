---
name: mde-worktree-pr-flow
description: Use for worktrees, PRs, shipping, and cleanup. Enforces "small branch → focused PR → tested → merged → deployed → verified → next branch" — one worktree, one goal, one PR, merge gate (lint/build/test/floor/Vercel/prod), PR size limits, and forensic cleanup for messy state. Triggers include start worktree, open PR, split PR, audit/clean worktrees, one PR at a time, dirty worktrees.
metadata:
  version: 0.4.0
  changelog: "v0.4.0 — guard-gitignore-worktrees (hard fail), guard-worktree-context (no nested trees), tidy-worktrees.sh; see references/worktree-safety-v040.md"
---

# mdeAI worktree + PR discipline

**North star:** Small branch → focused PR → tested → merged → deployed → verified → next branch.

No more big messy worktrees. **Ship clean slices only.**

Operate on **one worktree at a time** and **one focused PR at a time**. Finish, verify, and merge the current change before starting the next.

This skill has two modes:

| Mode | When | Goal |
|------|------|------|
| **Prevention** (default) | Starting new work, opening a PR | Clean preflight, small PRs |
| **Forensic cleanup** | Large dirty state, stale worktrees, 100+ untracked paths | Audit → backup → split → remove safely |

## When to invoke this skill

- Before `git worktree add` or `EnterWorktree`.
- Before opening a new PR or splitting an oversized one.
- When switching branches in a dirty worktree.
- When any worktree has uncommitted work older than the current task.
- When asked to **audit**, **clean up**, or **remove** worktrees.
- When `git status` or `ls-files --others` counts are in the hundreds.
- When local `main` may not match `origin/main` or production deploy SHA.

---

## Step 0 — Guards (always first)

Run **before** `git worktree add` or `EnterWorktree`:

```bash
bash .agents/skills/mde-worktree-pr-flow/scripts/guard-gitignore-worktrees.sh
bash .agents/skills/mde-worktree-pr-flow/scripts/guard-worktree-context.sh --allow-linked
```

| Script | Purpose |
|--------|---------|
| `guard-gitignore-worktrees.sh` | **Exit 1** if `.worktrees/` or `github` symlink not ignored (prevents 3 GB leak) |
| `guard-worktree-context.sh` | Detect linked worktree vs main checkout; blocks nested worktree creation |

**Detection guard (manual equivalent):**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
git rev-parse --show-superproject-working-tree 2>/dev/null
```

- **`GIT_DIR != GIT_COMMON` and NOT a submodule** → already in a linked worktree. **Do not** `worktree add` again. Use `--allow-linked` or work in current path → Step 2.
- **`GIT_DIR == GIT_COMMON`** → normal checkout. Proceed to Step 1.

Optional sibling-dir pattern (not required): [linear-worktree](https://www.skills.sh/mblode/agent-skills/linear-worktree) uses `../$REPO-$ISSUE_ID` next to the main clone. mdeai defaults to `.worktrees/wt-san-NNN-slug` under repo root.

Report: "Already in isolated workspace at `<path>` on branch `<name>`." or "Already in linked worktree (detached HEAD)."

## Step 1 — Create worktree

### 1a. Native tool (preferred)

If `EnterWorktree` tool is available, use it. It handles directory placement, branch creation, `.env` copy, and cleanup automatically. **Never use raw `git worktree add` when a native tool is available** — it creates phantom state the harness can't see.

### 1b. Manual git worktree (fallback only)

Use only when no native tool exists.

**Directory selection (priority order):**

1. Explicit user instruction → use exactly that path
2. Existing `.worktrees/` at project root → use it (verify ignored first)
3. Existing `worktrees/` at project root → use it  
4. Default → `.worktrees/` at project root

**`.gitignore` verification (mandatory — hard fail):**

```bash
bash .agents/skills/mde-worktree-pr-flow/scripts/guard-gitignore-worktrees.sh
```

Exits **1** if `.worktrees/` or `github` are not ignored. Fix `.gitignore`, commit, then create worktree. See `references/worktree-safety-v040.md` (June 4 incident).

**Naming convention:** `wt-<san-NNN>-<slug>` (e.g. `wt-san-413-rental-test`)

```bash
git fetch origin
git worktree add .worktrees/wt-san-NNN-slug -b ai/san-NNN-slug origin/main
```

**Sandbox fallback:** If `git worktree add` fails with a permission error, work in the current directory and note the limitation.

**If path already exists:** Inspect it; do NOT overwrite.

### 1c. Sync `.env.local`

After creation, copy environment files:

```bash
cp /home/sk/mdeai/mdeapp/.env.local .worktrees/wt-san-NNN-slug/
# or for the mdeapp worktrees:
cp /path/to/main/.env.local <worktree-path>/
```

### 1cc. Provision `node_modules` (hardlink — NOT symlink)

**Hard rule (2026-06-11):** give the worktree its OWN `node_modules` via a hardlink copy. **Never `ln -s`** the main checkout's `node_modules`.

```bash
cp -al /home/sk/mdeai/mdeapp/node_modules <worktree-path>/node_modules
```

**Why:** Next 16 / Turbopack **rejects a symlinked `node_modules`** that points outside the worktree —
`next build` dies with *"Symlink [project]/node_modules is invalid, it points out of the filesystem root."*
`cp -al` makes a real directory of **hardlinks** — instant, no disk duplication (same inodes), and Turbopack
accepts it. `node_modules` is gitignored, so it never enters the diff. (First hit on SAN-759 · AIE-007 —
salesInsightWorkflow; the symlink passed lint+test but failed the build gate.)

> ⚠️ **Hardlinks share inodes — do NOT `npm install`/`pnpm install` inside a hardlinked worktree.** A tool that
> edits a file **in place** would mutate the main checkout's `node_modules` through the shared inode. The worktree
> is meant to **reuse main's already-installed deps read-only** — that's the whole point. If a worktree genuinely
> needs different deps, first detach it from the hardlinks: `rm -rf <worktree-path>/node_modules` then run a real
> `npm ci` there (no `cp -al`). (npm/pnpm normally write-new-then-rename, which breaks the link safely, but don't
> rely on it — treat hardlinked `node_modules` as install-frozen.)

If a worktree was already created with a symlinked **or** real `node_modules`, replace it before building
(`rm -rf` handles both a symlink and a directory):

```bash
rm -rf <worktree-path>/node_modules
cp -al /home/sk/mdeai/mdeapp/node_modules <worktree-path>/node_modules
```

### 1d. Post-creation validation

```bash
git worktree list                          # shows expected path + branch
git -C <worktree-path> status --short      # must be clean
git -C <worktree-path> log --oneline -3    # tip matches origin/main
ls -ld <worktree-path>/node_modules        # must be a DIRECTORY, not an 'l'/symlink
```

## Step 2 — Verify path convention before staging

**Critical rule — always run before `git add`:**

```bash
# Which repo are you in?
git remote get-url origin

# What does the root tree look like?
git ls-tree origin/main --name-only | head -20

# What convention do tracked test/src files use?
git ls-files | grep "\.test\." | head -5
```

**mdeai repo layout:**

| Repo | Remote | Git paths |
|------|--------|-----------|
| `amo-tech-ai/mdeapp` | `mdeapp.git` | `src/`, `tests/`, `supabase/` at root — NEVER `mdeapp/src/` |
| `amo-tech-ai/mdeai` | `mdeai.git` | Planning/docs at root; app code lives under `mdeapp/` locally but is NOT tracked here |

The local filesystem nests the app under `/home/sk/mdeai/mdeapp/` — but worktrees of `amo-tech-ai/mdeapp` (e.g. `/home/sk/mde-wt-search-clean`, `/home/sk/mdeai/mdeapp/`, `/tmp/mdeai-san-*/`) treat `src/` as root. A file staged as `mdeapp/src/mastra/...` in an mdeapp worktree is at the **wrong path**.

## Step 3 — Preflight (new work)

Run `scripts/verify-clean.sh` (blocks: dirty tree, huge untracked, local `main` ≠ `origin/main`, dirty siblings, staged secrets).

- Same-task dirt → commit on branch
- Other-task dirt → labeled stash or commit on correct branch
- Abandoned → user confirms before `restore` / `clean`
- Never discard untracked silently; never `git add .` when untracked count is high

## Step 4 — Baseline test verification

After creation and setup, confirm the workspace starts clean:

```bash
cd <worktree-path>/mdeapp   # adjust to app root
npm test -- --run           # must pass; count must not regress
```

If tests fail: report failures and ask whether to proceed or investigate. Do not assume pre-existing failures are acceptable.

## Workflow standard

| Rule | Meaning |
|------|---------|
| 1 worktree | Only one active feature environment |
| 1 goal | No mixed maps + events + Supabase in one change |
| 1 PR | One clear purpose per merge |
| Tested before push | lint / build / test / smoke (and `floor` when shipping) |
| Merged before next | No stacking unless necessary |
| Vercel verified | Preview or prod URL checked |
| Clean local state | No dirty leftovers before the next branch |

## Focused PR shipping rule

Every change must follow:

1. Start from clean `origin/main`.
2. Create one focused branch.
3. Change only files required for the task.
4. Add or update tests for that task.
5. Run local verification.
6. Push branch to GitHub.
7. Open one focused PR.
8. Verify GitHub checks and Vercel preview.
9. Merge only after green checks.
10. Pull latest `main`.
11. Confirm production deploy.
12. Start next task only after local tree is clean.

**Hard limits:**

- No mixed feature PRs.
- No `git add .`.
- No untracked migrations inside unrelated PRs.
- No docs + runtime code in the same PR unless docs explain that exact change.
- No worktree removal without backup.
- No second worktree while the first is dirty.

## Recommended PR size

| Type | Max size |
|------|----------|
| Bug fix | 1–5 files |
| Feature | 5–12 files |
| Migration | Schema only (migrations + related SQL/RLS) |
| Docs | Docs only |
| Tooling | No runtime code |
| Big refactor | Split first — do not open one PR |

If a diff exceeds these bounds, stop and split before push.

## Testing & browser verification (which tool for which row)

| What to prove | Tool / command | When |
|---|---|---|
| Unit + integration (logic, schema, ranking) | `npm test` (Vitest) + `npm run verify:task -- <TASK-ID>` | Every task |
| Scoped e2e (one surface/flow) | `npm run test:e2e:<spec>` (Playwright) | UI / flow change |
| Prod persona journey | `npm run test:e2e:prod-synthetic` + `test:e2e:prod-venues-journey` (`PROD_SMOKE_BASE_URL`) | Persona-visible / prod gate |
| Console + network clean | chrome-devtools MCP `list_console_messages` / `list_network_requests` | Any UI change |
| Manual smoke + screenshot | playwright-test MCP or Claude-in-Chrome | Visual / UX change |

**Rules:**
- Scope the proof to the diff — a one-line ranking fix does not need the full prod journey, but it does need `verify:task` green.
- `verify:task -- <TASK-ID>` is the one-command gate (runs the task's scoped tests + floor); prefer it over hand-running individual specs.
- Console-clean is its own row — a green typecheck does not prove a clean console, and neither proves the feature works.

## Merge gate

> **Lean default (ordinary task PR):** `npm run verify:task -- <TASK-ID>` exit 0 + PR-body runtime proof is the bar — see [`pull_request_template.md`](../../../mdeapp/.github/pull_request_template.md) and [`improve.md`](../../../tasks/notes/improve.md) §6. The full row-by-row gate below is the **release / persona-prod gate** — use it for persona-visible, DATA, or prod-verified tasks where proof must outlive the PR.

A PR is **not done** until **every** row below is checked with paste-able evidence:

```text
git status clean                       ✅   (no uncommitted changes)
npm run lint                           ✅   (0 errors)
npm run build                          ✅   (exit 0; bundle within budget)
npm run test                           ✅   (count did not regress)
npm run floor                          ✅   (lint + typecheck + build + test + audit all green)
git push origin <branch>               ✅   (branch up to date with origin)
GitHub PR checks pass                  ✅   (CI green; CodeRabbit / security-review satisfied)
Vercel preview deploy ● Ready          ✅   (preview URL HTTP 200 + Camila smoke at viewport 390×844)
Outcomes rubric `satisfied`            ✅   (whichever rubric matches the diff)
merged to main (squash, no force)      ✅   (commit SHA on origin/main)
Vercel production deploy ● Ready       ✅   (production deploy ID, build time, no error tags in Sentry first 5 min)
https://www.mdeai.co live verified     ✅   (HTTP 200 + screenshot of the touched surface + console clean)
PR body lists evidence per row         ✅   (links to commit SHA, preview URL, prod deploy ID, screenshot path)
```

Record evidence in the PR body — never mark complete from `tsc --noEmit` alone. "Deployed" without the production HTTP check is a claim, not proof.

## One-tree-at-a-time gate (non-negotiable)

**No new worktree is created until the current one is fully shipped through the gate above.**

```text
Tree A: created → coded → committed → pushed → PR opened → reviews ✓
      → CI green → preview ● Ready → smoke ✓ → merged ✓
      → main updated → prod deploy ● Ready → www.mdeai.co HTTP 200 ✓
      → screenshot captured → PR body finalized
      → THEN: Tree B may be created
```

**The check before creating any new worktree:**

```bash
git worktree list                          # show all trees
git -C <each-other-tree> status --short    # must be empty
gh pr list --author @me --state open       # ≤ 1 open PR (the current one)
gh pr view <current> --json mergedAt       # must be non-null OR you are the merger
curl -fsSL -o /dev/null -w "%{http_code}\n" https://www.mdeai.co/  # must be 200
```

**Forensic exception.** If the current tree has work to preserve but not ship now: stash with a labeled message, document in `tasks/todo.md`, and start the new tree on a fresh checkout of `origin/main`.

## Hard rules

0. **No new tree until the current tree is live on production and verified.**
1. **One worktree active at a time** for new work. Sibling dirty worktrees must be surfaced before starting.
2. **One focused PR per change.** Split before merging if scope exceeds the PR size table or mixes domains.
3. **Never force-push `main`.** `--force-with-lease` only on your own feature branch.
4. **Never stage `.env*`.** Credential rotation if committed.
5. **Backup before any destructive command** (see Forensic cleanup mode).
6. **Verify before declaring done** — merge gate above; production SHA from `git fetch` + deploy, not stale `tasks/todo.md`.
7. **Verify path convention before `git add`** — run `git ls-tree origin/main --name-only` in the worktree to confirm whether paths start with `src/` or `mdeapp/src/`. Never assume — the mdeapp worktree uses `src/` at root, not `mdeapp/src/`.
8. **Never use `EnterWorktree`/native tools + raw `git worktree add` in the same session.** Pick one; mixing creates phantom state.

## Forensic cleanup mode

Use when any worktree has large dirty state, stale branches, many untracked files, or mixed work across domains (maps + events + mastra + supabase in one tree).

**Trigger phrases:** `audit all worktrees before cleanup`, `forensic audit`, `clean up worktrees`, `377 dirty paths`.

### Before changing anything

1. `git fetch origin`
2. Record **production/main SHA**: `git rev-parse origin/main` (+ optional `gh` production deploy)
3. List all worktrees: branch, HEAD, upstream, dirty count, untracked count, stash count, ahead/behind vs `origin/main`
4. Per worktree: `git diff --stat origin/main`, classify by domain
5. Identify intentional vs stale vs duplicate vs risky
6. **Create backup** — no exceptions

```bash
bash .claude/skills/mde-worktree-pr-flow/scripts/audit-worktrees.sh
bash .claude/skills/mde-worktree-pr-flow/scripts/list-worktrees.sh
git stash list
bash .claude/skills/mde-worktree-pr-flow/scripts/backup-worktree.sh [worktree-path]
```

Full playbook: `references/forensic-cleanup.md`

### Never run these blindly

Safe **only after backup + review + user go/no-go**:

```bash
git add .
git clean -fd
git reset --hard
git stash pop
git worktree remove --force
git branch -D
```

### Worktree removal gate

Never remove a dirty worktree until **all** are true:

1. Diff vs `origin/main` reviewed for unique content
2. Local-only commits listed (`git log origin/main..HEAD`)
3. Untracked files included in backup (rsync / `backup-worktree.sh`)
4. User confirms removal (or written GO in audit doc)

### PR priority order (mdeai) — ship in this sequence

Do **not** fix everything in one branch. One PR per row.

| Order | PR | Why |
|-------|-----|-----|
| 1 | Supabase migrations / security | Highest risk |
| 2 | Events buyer smoke / ticketing | MVP revenue |
| 3 | Maps (e.g. 5/5 pins fix) | User-visible bug |
| 4 | Mastra runtime fixes | AI reliability |
| 5 | Cursor evidence hooks | Tooling only |
| 6 | Docs / worktree cleanup | Lowest production impact |

### Cleanup from messy state (slice by slice)

Do **not** try to fix everything at once:

1. Backup dirty state (`backup-worktree.sh`).
2. Reset local `main` to `origin/main` (production).
3. Create **one** branch for **one** task from clean main.
4. Cherry-pick or copy only needed files.
5. Test (merge gate).
6. Push PR → merge → verify production.
7. Repeat — next branch only when `git status` is clean.

### Executable cleanup plan

A plan is **not executable** until it includes:

- Backup command + output path
- Rollback plan (bundle, patches, reflog)
- PR split table (branch, base `origin/main`, file globs)
- Acceptance criteria per PR (`npm run floor`, smoke, migration evidence)
- Go / no-go decision

## The six-step cycle (new work)

### Step A — Locate + detect

```bash
bash .agents/skills/mde-worktree-pr-flow/scripts/guard-gitignore-worktrees.sh
bash .agents/skills/mde-worktree-pr-flow/scripts/guard-worktree-context.sh --allow-linked
pwd && git branch --show-current && git status --short
bash .agents/skills/mde-worktree-pr-flow/scripts/list-worktrees.sh
```

If dirty and not in forensic mode → Step B or forensic playbook.

### Step B — Preflight

Run `scripts/verify-clean.sh`. Then verify path convention (Step 2 above).

### Step C — Research before coding

MCP/docs first (Mastra, Supabase, Vercel). Match `node_modules` to docs. No guessed model slugs.

### Step D — Code in small units

~300 line / single-domain cap. Split if exceeded.

### Step E — Verify

```bash
npm run lint && npm run typecheck && npm run build && npm test   # (or: npm run floor)
```

Typecheck passing ≠ feature working.

### Step F — Ship one PR

Satisfy the **merge gate** and **Focused PR shipping rule**. Minimum before push:

- `git diff --stat origin/main` matches task and PR size table
- No staged `.env*`
- Rebased on `origin/main`
- Vercel preview URL exercised
- After merge: pull latest `main`, confirm production deploy, clean tree before next branch

## How to split a PR

1. Name cohesive sub-changes
2. Fresh branch from `origin/main` per sub-change
3. Cherry-pick relevant commits only
4. Separate PR each; merge in **PR priority order** above
5. Do not split after review approval — finish current PR first

See `references/pr-splitting-playbook.md`.

## Failure recovery

| Failure | Action |
|---------|--------|
| `git worktree add` fails — path exists | Inspect path; do NOT overwrite |
| `git worktree add` fails — sandbox denied | Work in current directory; note limitation |
| `.env.local` copy fails | Continue with explicit warning; copy manually before first run |
| `npm install` fails in worktree | Mark, continue, fix manually |
| Stale dev server / wrong worktree on :4111 | `lsof -i :4111`, restart from correct tree |
| PR body stale after retarget base | Rewrite body when `gh pr edit --base main` |
| `fatal: bad object` | `git fetch origin` first |
| local `main` behind `origin/main` | Reset local main before new branches |
| Thousands of untracked `.agents/skills/**` | Forensic mode; rsync backup; never `git add .` |
| `git status` shows D + ?? same file | Use `git mv`, not delete + re-add |

## Common failure modes

- **Stale dev server / wrong worktree on :4111** — `lsof -i :4111`, restart from correct tree
- **PR body stale after retarget base** — rewrite body when `gh pr edit --base main`
- **`fatal: bad object`** — `git fetch origin` first
- **local `main` behind `origin/main`** — reset local main before new branches
- **Thousands of untracked `.agents/skills/**`** — forensic mode; rsync backup; never `git add .`
- **Status D + ?? same file** — `git mv`, not delete+re-add
- **File staged at wrong path in mdeapp worktree** — `git ls-tree origin/main --name-only` to verify; `src/` not `mdeapp/src/`

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/guard-gitignore-worktrees.sh` | **v0.4.0** — exit 1 if `.worktrees/` / `github` not gitignored |
| `scripts/guard-worktree-context.sh` | **v0.4.0** — detect linked worktree; block nested `worktree add` |
| `scripts/tidy-worktrees.sh` | **v0.4.0** — weekly `fetch --prune`, `worktree prune`, `remote prune origin` |
| `scripts/audit-worktrees.sh` | Read-only forensic table: HEAD, dirty, untracked, vs `origin/main`, stashes |
| `scripts/list-worktrees.sh` | Quick multi-worktree status + upstream + main divergence |
| `scripts/backup-worktree.sh` | Bundle + patches + stash list + untracked rsync → `~/mde-dirty-backup-*` |
| `scripts/verify-clean.sh` | Preflight for new work (runs gitignore guard first) |

## Reference files

- `references/worktree-safety-v040.md` — **before/after risk assessment** (June 4 `.worktrees/` leak)
- `references/forensic-cleanup.md` — phased audit, classify, backup, PR order, removal gate
- `references/git-worktree-cheatsheet.md` — add/list/remove; forensic commands
- `references/pr-splitting-playbook.md` — worked split example
- `tasks/commit/june-4/COMMIT-PLAN.md` — slice commits when planning repo tree is dirty

## Anti-patterns

- New worktree to avoid diagnosing the current mess — use forensic mode
- PR without runtime verification
- Parallel edits in two worktrees
- Close reviewed PR to "open a cleaner one" — push fixes instead
- Stash-only backup for 300+ untracked paths
- Trust `tasks/todo.md` production SHA over `git rev-parse origin/main`
- Using `git worktree add` when `EnterWorktree` native tool is available
- Skipping Step 2 path-convention check and assuming `mdeapp/src/` is correct in an mdeapp worktree
- Creating a nested worktree (Step 0 not run first)
- Skipping `.gitignore` verification for project-local worktree directories

## See also

- [`tasks.md`](../../../tasks.md) — live task board + lean evidence policy
- [`plan.md`](../../../plan.md) — platform-gate roadmap
- [`tasks/notes/improve.md`](../../../tasks/notes/improve.md) — execution playbook (test pyramid §5, evidence §6)
- [`mdeapp/.github/pull_request_template.md`](../../../mdeapp/.github/pull_request_template.md) — lean PR checklist
- `references/forensic-cleanup.md`, `references/git-worktree-cheatsheet.md`, `references/pr-splitting-playbook.md`
- [Git worktree docs](https://git-scm.com/docs/git-worktree)
