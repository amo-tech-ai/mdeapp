# PR splitting playbook

Use when one PR has grown beyond its original scope and now mixes intents. Splitting *before* merge keeps each diff reviewable and each revert surgical.

## Decision: split or finish?

| Situation | Action |
|---|---|
| PR has been reviewed and approved | **Do not split.** Land it. Split future work. |
| PR is in draft / not yet reviewed, mixes ≥ 2 intents | Split. |
| PR is reviewed but reviewer flagged scope | Ask reviewer; default to split. |
| PR < 300 lines, single intent | Don't split. |

"Mixed intent" = the PR title cannot honestly describe the diff in ≤ 70 characters without using the word "and".

## Worked example: 957-line PR #22

The original branch carried four cohesive changes that should have been four PRs:

1. **fix(classifier):** rentalSignals + pickPrice regex bugs (~30 lines, tools/agents/workflows + tests).
2. **feat(agents):** new rental + event + concierge + router + evaluation agents (~400 lines).
3. **feat(workflows):** rental-search, event-discovery, concierge-routing workflows (~350 lines).
4. **chore(rules+skill):** worktree-discipline rule + mde-worktree-pr-flow skill (~150 lines, no runtime impact).

Order to merge:
1. `chore(rules+skill)` — zero runtime risk, lands first so the discipline is in effect for the rest.
2. `fix(classifier)` — small, with regression test, lands next.
3. `feat(agents)` — depends on no other change.
4. `feat(workflows)` — depends on agents existing.

## Mechanical steps

```bash
# 1. Confirm the source branch is clean and pushed.
git status --short          # must be empty
git log --oneline @{u}..HEAD   # must be empty (or knowingly ahead)

# 2. From a clean main, branch each sub-PR.
cd /home/sk/mde
git fetch origin
git checkout main
git pull --ff-only

git checkout -b chore/worktree-discipline origin/main
git cherry-pick <commits-for-rules-and-skill>

git checkout -b fix/classifier-regex origin/main
git cherry-pick <commits-for-classifier-fix>

# (repeat for feat/agents and feat/workflows)

# 3. Push each branch and open one PR each.
git push -u origin chore/worktree-discipline
gh pr create --base main --title "chore(rules): worktree discipline" --body-file ...

# 4. Close (do not merge) the original mega-PR with a comment pointing at the new PRs.
gh pr comment <original> --body "Split into #N1 #N2 #N3 #N4. Closing in favor of those."
gh pr close <original>
```

Never `git rebase -i` an already-pushed branch to drop commits unless the PR is unreviewed. Reviewers lose comment anchors when commit SHAs vanish.

## Rules of thumb

- **One intent per PR title.** If you have to use "and" or a comma, split.
- **300-line ceiling for non-mechanical diffs.** Mechanical refactors (rename, codemod) can be larger.
- **Tests ship with the code that needs them.** A regression test for the classifier fix belongs in the same PR as the fix, not in a separate "tests" PR.
- **Never split *after* approval.** The reviewer signed off on a specific diff; rewriting it forces a re-review and erodes trust.

## When the dependency graph is messy

If sub-change B depends on a private export from sub-change A:

1. Land A first (the export is added but not yet consumed externally).
2. Open B against `main` *after* A merges. B will not look noisy in isolation.

Stack only when the second PR cannot compile without the first. A two-deep stack is fine; three is a signal to wait and merge sequentially.

## Anti-patterns

- Closing the original PR mid-review and reopening "a cleaner one" — review history is lost.
- Splitting by file type ("all SQL changes here, all TypeScript here") — produces incoherent commits.
- Splitting by author ("the bits I wrote vs. the bits Claude wrote") — reviewers don't care; intent does.
