# Worktree organization — quick guide (v0.4.1)

**What this is:** A short cheat sheet for *where* to work and *how* to stay safe.  
**Full playbook:** [`worktrees-best.md`](./worktrees-best.md) (naming, commands, migration, tooling).

---

## Strategy (read this first)

**Problem:** Two agents (or two terminals) editing the same folder overwrite each other. Stashing and branch-switching wastes context.

**Fix:** A **worktree** = a second copy of the repo on disk, on its own branch. You can run Camila’s chat fix in one folder and Roberto’s host wizard in another — no file fights.

**Golden rule:** One Linear task → one folder → one branch → one PR. After merge: `git worktree remove` + delete the branch.

### Canonical paths

| Role | Path |
|------|------|
| **App git root** | `/home/sk/mdeai/mdeapp` |
| **New app feature worktrees** | `/home/sk/mdeai/mdeapp/.worktrees/wt-san-NNN-slug` |
| **Planning git root** | `/home/sk/mdeai` |
| **New planning worktrees** | `/home/sk/mdeai/.worktrees/wt-san-NNN-slug` |
| **Cursor shortcuts only** | `/home/sk/mdeai/wt-visibility/` — symlinks, **never** `git worktree add` here |
| **Legacy clean `main` only** | `/home/sk/mde-wt-search-clean` — prod-aligned checkout; **do not** start new feature work here |

| You have… | Use it for… |
|-----------|-------------|
| **mdeai** | Plans, tasks, sitemap, notes |
| **mdeapp** | Next.js app, tests, Supabase in app |

**Never** mix both repos in one PR. **Never** create a worktree inside another worktree. **Never** create new trees under `/home/sk/mde-wt-*`.

**Active app worktrees:** max **5** under `mdeapp/.worktrees/`. Delete merged trees before opening a sixth.

---

## Picture

```text
/home/sk/mdeai/                         ← planning git
  .worktrees/wt-san-546-ops/          ← docs-only slice
  wt-visibility/                      ← symlinks only (not git worktrees)
  tasks/  plan/

/home/sk/mdeai/mdeapp/                  ← app git (canonical root)
  .worktrees/wt-san-550-rentals/      ← all new feature work
  src/

/home/sk/mde-wt-search-clean/           ← legacy clean main (read/ship only; no new features)
```

---

## Three safety scripts (run before `git worktree add`)

| Script | Plain English |
|--------|----------------|
| `guard-gitignore-worktrees.sh` | **Block leak:** `.worktrees/` must be gitignored so you never commit 3 GB of copies. |
| `guard-worktree-context.sh` | **No nesting:** you must be on `main` (primary checkout), not already inside a worktree. |
| `verify-clean.sh` | **Clean slate:** no uncommitted junk before you spin up a new tree. |

**Path (only):** `.claude/skills/mde-worktree-pr-flow/scripts/`

**Weekly housekeeping:**

```bash
bash .claude/skills/mde-worktree-pr-flow/scripts/tidy-worktrees.sh
bash .claude/skills/mde-worktree-pr-flow/scripts/audit-worktrees.sh
```

**Deep reference:** `.claude/skills/mde-worktree-pr-flow/references/worktree-safety-v040.md`

---

## Start a new app task (minimal)

```bash
# Canonical app root — NOT /home/sk/mde-wt-search-clean for new features
cd /home/sk/mdeai/mdeapp
git switch main
git fetch origin main

bash .claude/skills/mde-worktree-pr-flow/scripts/guard-gitignore-worktrees.sh
bash .claude/skills/mde-worktree-pr-flow/scripts/guard-worktree-context.sh
bash .claude/skills/mde-worktree-pr-flow/scripts/verify-clean.sh

SAN=550 SLUG=rentals
git worktree add ".worktrees/wt-san-${SAN}-${SLUG}" -b "ai/san-${SAN}-${SLUG}" origin/main
cd "/home/sk/mdeai/mdeapp/.worktrees/wt-san-${SAN}-${SLUG}"

npm ci   # today: npm only; pnpm after deliberate repo migration

# Env: prefer Infisical into gitignored mdeapp/.env.local
# If copying locally from another checkout, never commit .env.local
```

Naming: folder `wt-san-550-rentals`, branch `ai/san-550-rentals`. PR body: `Closes SAN-550`.

---

## Planning repo still messy?

Use **small commits** from `tasks/commit/june-4/COMMIT-PLAN.md` (slices 3–6). Docs-only worktree at `/home/sk/mdeai/.worktrees/wt-san-NNN-slug` — don’t touch `mdeapp/src/` there.

---

## After merge

```bash
cd /home/sk/mdeai/mdeapp
git worktree remove .worktrees/wt-san-550-rentals
git branch -d ai/san-550-rentals
git worktree prune
```

Long-lived merged trees = disk clutter + wrong-branch confusion.

---

## What we added in v0.4.x

- Hard fail if worktrees aren’t gitignored  
- Block nested worktree creation  
- Tidy/audit scripts for cleanup  
- Canonical paths + max 5 active app trees  
- **Skipped:** new skill pack, submodules, merge-expert tooling  

Optional elsewhere: [linear-worktree skill](https://www.skills.sh/mblode/agent-skills/linear-worktree) — we use `mdeapp/.worktrees/wt-san-NNN-slug`.

---

## Links

| Doc | Use when |
|-----|----------|
| [`worktrees-best.md`](./worktrees-best.md) | Full commands, Cursor/Claude, migration |
| [`tasks/commit/june-4/worktrees.md`](../../commit/june-4/worktrees.md) | Live inventory + `wt-visibility` symlinks |
| [`linear.md`](../../../linear.md) | Branch `ai/san-*`, PR magic words |
