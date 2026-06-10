## Completed

| Step | Result |
|------|--------|
| **PR #69 merge** | Merged → `main` @ **`52dc154`** ([PR #69](https://github.com/amo-tech-ai/mdeapp/pull/69)) |
| **Rebase push** | Not done (hook blocks `git push`); merge used pre-rebase branch — still clean on GitHub |
| **`wt-main-clean`** | Pulled to `52dc154` |
| **Tests on `main`** | Maps unit **18/18**; MOB-CK-001 chromium **7/7** |
| **UX-020** | **Already on `main`** (`map-config.ts` dev warn) — no PR needed |
| **Stale `mdeapp`** | Reset to `origin/main` content (`52dc154`); removed `prove-ven-020-status-fetch.mjs` |
| **VEN-020 script** | Deleted locally (one-off proof; uses service role — don’t ship from stale checkout) |
| **007a / SAN-294** | Already merged in **#68** (`ac8390e`) |

Still untracked on primary `mdeapp`: `github/` — do not commit.

---

## Queue status (updated)

| Priority | Item | Action |
|----------|------|--------|
| Done | SAN-521 mobile (#69) | Merged |
| Done | Grounded places intent (#68) | Merged |
| Done | Maps key warn (UX-020) | On `main` — close SAN-456 if open |
| Done | **SAN-549** (#70) | Merged `704c0ce` — prod J06 nightlife venues ✅ |
| Next | **Rental night parser** | `.wt-ux-003-night-parser` is **ancient** vs `main` — rebase or re-apply 1 test file only |
| Skip | VEN-020 script | Removed locally |
| Cleanup | `mdeapp` branch name | Still `ai/san-491-…` at `main` SHA — rename or use `wt-main-clean` |

---

## Suggested next steps

### 1. SAN-549 — concierge `intent` (highest product value)
```bash
cd /home/sk/mde-wt-search-clean   # main @ 52dc154
git switch -c ai/san-549-concierge-nightlife-intent
# Edit src/mastra/agents/concierge.ts — pass intent on tool calls
npm test -- --run src/mastra/agents/__tests__/concierge.test.ts
# PR → merge
```

### 2. Rental parser (only if still needed)
Branch is far behind `main`. Safer path:
```bash
# On main, cherry-pick or re-implement parser test change only
git -C /home/sk/mde-wt-search-clean diff origin/main -- \
  /home/sk/mdeai/.wt-ux-003-night-parser/src/lib/__tests__/rental-query-parser.test.ts
```
Or read the 1 modified test in `.wt-ux-003-night-parser` and port to `wt-main-clean`.

### 3. Planning repo (optional)
```bash
cd /home/sk/mdeai
git push origin docs/venues-index-canonical-order   # 2 commits ahead
gh pr create --base main   # docs-only PR
```

### 4. Local hygiene
```bash
rm -rf /home/sk/mdeai/mdeapp/github    # symlink junk
git -C /home/sk/mdeai/mdeapp worktree prune
```

---

## Prod state

`main` = **#68** + **#69** + **#70** (`704c0ce`). Prod validated 2026-06-04 — see `SAN-549-prod-live-RESULTS-2026-06-04.md`.

**Next:** rental parser cherry-pick · VEN-025 generic-venues routing · or next `phase:launch` Linear item.