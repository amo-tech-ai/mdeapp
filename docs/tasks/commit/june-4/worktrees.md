# mdeapp worktrees — paths, contents, visibility shortcuts

**Git repo:** `mdeapp` (remote `amo-tech-ai/mdeapp`). Refresh: `git -C /home/sk/mdeai/mdeapp worktree list`.

**Production / shipped:** use **`/home/sk/mde-wt-search-clean`** (`main` @ `ae9a1e6`) — not the primary `/home/sk/mdeai/mdeapp` checkout.

**June-4 commit plan** (`COMMIT-PLAN.md`) applies only to the **planning** repo `/home/sk/mdeai` — **no slice touches `mdeapp/src/**`**.

---

## Visibility shortcuts (not separate git trees)

These are **symlinks or folders** under `/home/sk/mdeai` so Explorer can open hidden paths (`.worktrees/`, `.wt-*`, gitignored `mdeapp/`).

| Explorer path | Points to | What it is |
|---------------|-----------|------------|
| `/home/sk/mdeai/wt-main-clean` | `/home/sk/mde-wt-search-clean` | **Shortcut → prod `main` worktree** |
| `/home/sk/mdeai/wt-san521` | `.worktrees/wt-san521` | Shortcut → SAN-521 worktree |
| `/home/sk/mdeai/worktrees-all` | `.worktrees/` | Shortcut → only **two** trees inside (see below) |
| `/home/sk/mdeai/worktrees-all/wt-san521` | same as `wt-san521` | Mobile composer branch checkout |
| `/home/sk/mdeai/worktrees-all/wt-ux-020` | `.worktrees/wt-ux-020` | Maps API key dev-warn branch |
| `/home/sk/mdeai/wt-visibility/` | mixed symlinks | Index of all shortcuts + `README.md` |
| `/home/sk/mdeai/wt-visibility/main-clean` | `/home/sk/mde-wt-search-clean` | **Prod-aligned `main`** |
| `/home/sk/mdeai/wt-visibility/mdeapp-primary-checkout` | `/home/sk/mdeai/mdeapp` | Stale SAN-491 checkout + local WIP |
| `/home/sk/mdeai/wt-visibility/ux003-night-parser` | `.wt-ux-003-night-parser` | Rental nightly parser branch |

**Note:** `.wt-ux-003-night-parser` lives at repo root — **not** under `worktrees-all/` (only `wt-san521` and `wt-ux-020` are in `.worktrees/`).

---

## Real git worktrees (full paths + what’s in each)

| Full path | Branch | SHA | vs prod `main` | Purpose / contents | Uncommitted (local) |
|-----------|--------|-----|----------------|--------------------|---------------------|
| `/home/sk/mde-wt-search-clean` | `main` | `ae9a1e6` | **= production** | Merged app: SAN-491 nightlife (#67), restaurants, chat, rentals, etc. | **Clean** |
| `/home/sk/mdeai/mdeapp` | `ai/san-491-screen-022-nightlife-listings-map` | `8813112` | Behind `main` (pre-merge tip) | Old primary checkout; **007a grounding `intent` WIP** in Mastra tools | `search-grounded-places.ts` + 2 tests; untracked `e2e/...MOB-CK-001...`, `scripts/prove-ven-020...`, `github/` |
| `/home/sk/mdeai/.worktrees/wt-san521` | `ai/san-521-mob-ck-001-mobile-composer` | `397e9c2` | Ahead of old base; not merged to `main` | **SAN-521** mobile chat composer UX (`/chat` mobile) | `?? workspace` only |
| `/home/sk/mdeai/.worktrees/wt-ux-020` | `feat/pr-12-maps-key-warn` | `71650d2` | Feature branch | **PR-12** dev warning when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` missing | **Clean** |
| `/home/sk/mdeai/.wt-ux-003-night-parser` | `feat/ux-003-night-parser` | `e9f058e` | Feature branch (Linear UX-003 / SAN-316 marked Done) | Rental query parser: `"$500 a night"` / `nightly` → nightly price | `M rental-query-parser.test.ts` |
| `/home/sk/mdeai/mdeapp/workspace/wt-infra-workflow-lean` | `infra/workflow-lean-scripts` | `14c0029` | Infra only | Lean dev-flow / verify helper scripts (not product UI) | **Clean** |
| `/tmp/mdeai-san-413` | `ai/san-413-rental-generic-ask-test` | `b0fbea5` | **prunable** (often missing) | Rental generic-ask test branch | — |

---

## What “in each worktree” means

Each row is a **full clone** of `mdeapp` (own `node_modules`, `.next`, branch). Typical layout:

```text
<worktree>/
  src/          ← Next.js + Mastra app source (differs by branch)
  e2e/
  package.json
  ...
```

| Worktree | Notable `src/` / product surface |
|----------|----------------------------------|
| `main-clean` | `/nightlife`, `/restaurants`, `/chat`, `/rentals` — **matches https://www.mdeai.co** |
| `mdeapp` (primary) | Same tree as SAN-491 era + **uncommitted** `search-grounded-places` (`007a` intent) |
| `wt-san521` | Mobile composer components/hooks for `/chat` (SAN-521) |
| `wt-ux-020` | Maps env / dev-console warn helpers |
| `.wt-ux-003-night-parser` | `src/lib/...` rental price parsing |
| `wt-infra-workflow-lean` | `scripts/` workflow lean tooling only |

---

## Planning repo worktrees (separate from mdeapp)

| Path | Branch | Role |
|------|--------|------|
| `/home/sk/mdeai` | `docs/venues-index-canonical-order` | June-4 slices: `tasks/**`, `sitemap.md`, venue specs — see `COMMIT-PLAN.md` |
| `/tmp/mdeai-venues-pr` | `docs/venues-map-blocker-evidence` | prunable doc branch |

---

## Feature file tree (nightlife, restaurants, chat)

See **[`feature-tree-main-clean.md`](feature-tree-main-clean.md)** — full tree under `wt-main-clean` + what to commit first (planning june-4 vs app branches).

## Quick picks

| Goal | Open |
|------|------|
| Prod / merged features | `/home/sk/mde-wt-search-clean` or `wt-main-clean` / `wt-visibility/main-clean` |
| SAN-521 mobile work | `/home/sk/mdeai/wt-san521` |
| Maps key warn PR | `worktrees-all/wt-ux-020` |
| Rental nightly parser | `/home/sk/mdeai/.wt-ux-003-night-parser` or `wt-visibility/ux003-night-parser` |
| 007a intent WIP (not on `main`) | `/home/sk/mdeai/mdeapp/src/mastra/tools/` |
| June-4 doc commits only | `/home/sk/mdeai/tasks/commit/june-4/` |

---

*Generated 2026-06-04. Re-run `git -C /home/sk/mdeai/mdeapp worktree list` and `git status` per path after merges.*
