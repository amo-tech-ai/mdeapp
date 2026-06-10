# Forensic cleanup playbook (mdeai)

Use when any worktree has large dirty state, stale branches, hundreds of untracked files, or mixed domains (maps + events + mastra + supabase in one tree).

**Related audits:** `tasks/trees/01-trees-audit.md`, `tasks/audits/01-audit-worktress.md`

## Phase 0 — Record production truth (before any cleanup)

```bash
cd /home/sk/mde   # or canonical repo root
git fetch origin
PROD_SHA=$(git rev-parse origin/main)
echo "origin/main: $PROD_SHA $(git log -1 --oneline $PROD_SHA)"
# Optional: gh api repos/amo-tech-ai/mdeai/deployments --jq '.[] | select(.environment=="Production") | .sha[0:7]'
```

Also record:

- Local `main` tip: `git rev-parse main` — **must match `origin/main` before new branches** (`git reset --hard origin/main` if not).
- Canonical worktree branch + HEAD.
- `tasks/todo.md` production SHA line — if it disagrees with git, **trust git + GitHub deployments**.

## Phase 1 — Forensic audit (read-only)

Run:

```bash
bash .claude/skills/mde-worktree-pr-flow/scripts/audit-worktrees.sh
bash .claude/skills/mde-worktree-pr-flow/scripts/list-worktrees.sh
git stash list
```

Per worktree, mentally confirm:

| Field | Command |
|-------|---------|
| Branch | `git -C <wt> branch --show-current` |
| HEAD | `git -C <wt> rev-parse --short HEAD` |
| Upstream | `git -C <wt> rev-parse --abbrev-ref '@{u}' 2>/dev/null` |
| Dirty lines | `git -C <wt> status --short \| wc -l` |
| Untracked paths | `git -C <wt> ls-files --others --exclude-standard \| wc -l` |
| vs `origin/main` | `git -C <wt> rev-list --left-right --count origin/main...HEAD` |
| Diff stat | `git -C <wt> diff --stat origin/main \| tail -3` |

## Phase 2 — Classify by domain

Tag each dirty path (do not commit yet):

| Domain | Path hints |
|--------|------------|
| **supabase** | `supabase/migrations/`, `supabase/functions/`, `*.sql` |
| **events** | `EventDetail`, `ticket-`, `events/` |
| **maps** | `src/components/map/`, `ChatMap`, `google-maps` |
| **mastra** | `my-mastra-app/` |
| **cursor/tooling** | `.cursor/`, `AGENTS.md` |
| **docs** | `tasks/`, `*.md`, `docs/` |
| **claude/config** | `.claude/skills/`, `.agents/skills/` |
| **unknown** | everything else — review manually |

**Red flags:**

- `git status` shows **D** + **??** for same logical file → use `git mv`, not delete+add.
- `git ls-files --others` >> 500 → **never `git add .`**
- Untracked `supabase/migrations/*` → prod apply state unknown until verified.

## Phase 3 — Backup (mandatory before destructive ops)

```bash
bash .claude/skills/mde-worktree-pr-flow/scripts/backup-worktree.sh
```

No `git clean`, `git reset --hard`, `git worktree remove`, `git branch -D`, or `git stash pop` until backup completes and path is printed.

## Phase 4 — PR split order (mdeai MVP)

Ship **one PR per row** — see merge gate in `SKILL.md`.

| Order | PR | Why |
|-------|-----|-----|
| 1 | Supabase migrations / security | Highest risk |
| 2 | Events buyer smoke / ticketing | MVP revenue |
| 3 | Maps (e.g. 5/5 pins) | User-visible |
| 4 | Mastra runtime | AI reliability |
| 5 | Cursor evidence hooks | Tooling only |
| 6 | Docs / worktree cleanup | Lowest prod impact |

One PR = one intent. Never combine rows 1–3 in a single merge.

## Phase 5 — Worktree removal gate

Never remove a worktree until **all** are true:

1. `git diff origin/main -- <wt-path>` reviewed for unique content
2. Local-only commits listed: `git -C <wt> log origin/main..HEAD`
3. Untracked files copied in backup rsync
4. User explicitly confirms removal (or written go/no-go in audit doc)

```bash
# Only after clean OR forced with backup:
git worktree remove .claude/worktrees/<name>
# If dirty and user approved after backup:
git worktree remove --force .claude/worktrees/<name>
```

## Phase 6 — Executable plan checklist

A cleanup plan is **not executable** until it includes:

- [ ] Backup command + output path
- [ ] Rollback plan (bundle, patches, reflog)
- [ ] PR split table (branch name, base `origin/main`, files glob)
- [ ] Acceptance criteria per PR (`npm run floor`, smoke, migration evidence)
- [ ] Go/no-go (conditional GO / NO-GO)

## Rollback

| Action | Undo |
|--------|------|
| Backup bundle | `git clone /path/to.bundle` or `git pull` from bundle instructions |
| `reset --hard origin/main` on main | `git reflog` → reset to prior main |
| Cherry-pick PR | `git revert <sha>` or drop branch |
| Force worktree remove | Restore from backup rsync only |
