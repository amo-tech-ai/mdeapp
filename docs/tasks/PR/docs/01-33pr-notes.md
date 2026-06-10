Good call — let me suggest the next steps honestly, which means doing the one that's clearly right and explaining why I'm *not* auto-doing the other two.

**My recommendation:**
- ✅ **Do now:** test-run `pr-scope-reviewer` on your live `mdeapp` branch — read-only, proves the agent works, and gives you a real scope verdict before that branch becomes a PR.
- ⏸️ **Hold:** the architecture rules (your `rules.md` says "don't add rules until F21A calibration finishes" — I'll respect that).
- ⏸️ **Hold:** loosening `security-reviewer` (skipping its permission prompts on `execute_sql` is a security-posture call you should make deliberately, not me).

Running the scope check on `hotfix/g2d-cafe-fast-path` now (read-only git — I won't mutate the tree).

This is a *perfect* real-world demonstration — the branch is in a messy state and the scope check caught it immediately. Before I write the verdict, let me run the agent's targeted probes (read-only) to classify the high-risk items precisely rather than hand-wave.

The test-run worked — and it immediately caught a real mess. This is `pr-scope-reviewer` doing exactly its job. Here's what it found on `hotfix/g2d-cafe-fast-path`:

## PR scope review — hotfix/g2d-cafe-fast-path vs main

**Two headline problems before any file-level detail:**
1. **The branch is stale.** Its only commit (the cafe fast path) is *already in main* as [#33]. Main is **3 commits ahead** (#32, #33, #34). A PR from here would show **0 commits ahead** — there's nothing committed to actually PR.
2. **All the real work is uncommitted, and it's 4 unrelated workstreams piled together.** Opening one PR from this would be PR #14 all over again (the 33-file unreviewable `CONFLICTING` mess).

| Class | Path(s) | Note |
|-------|---------|------|
| 🔴 **Stray migration** | `supabase/migrations/20260430140000_landlord_v1_base_tables.sql` (untracked, 11 KB) | a whole landlord base-tables schema change sitting in a "cafe" branch — needs its **own** PR + RLS evidence |
| 🔴 **Nested worktrees** | `.wt-wave1-pr-a/`, `-b/`, `-c/` | real git worktrees living *inside* mdeapp/ — one `git add -A` would swallow them; they belong as siblings (like `mde-wt-search-clean`) |
| 🟠 **Off-domain spread** | `src/components/chat/*` (5 files: center-panel, nav-rail, geo-shell, rich-card-context, concierge-session) | a concierge/chat UI workstream, unrelated to restaurant fast path |
| 🟠 **Release/CI tooling** | `.github/workflows/prod-synthetic-smoke.yml`, `e2e/prod-synthetic-smoke.spec.ts`, `scripts/smoke-*.mjs`, `playwright.config.ts` | a prod-smoke/CI workstream — separate concern |
| 🟠 **Possible Phase-2 leak** | `scripts/smoke-adk-grounding.mjs` | CLAUDE.md says **ADK is Phase 2 only** — verify this isn't premature |
| 🟢 **On-theme** | `src/lib/restaurant-search-fast-path.ts`, `src/app/api/restaurants/search/route.ts`, `src/lib/restaurant-place-photo.ts` (+test) | the actual cafe/restaurant work |
| ✅ **Clean** | `package.json` (only 2 new test scripts), CopilotKit still `1.55.2` | no dep pollution, no version drift |

**Verdict:** ⚠️ Do **not** open a PR from this branch as-is.

## Suggested next steps (your working tree — I won't touch it; the agent's contract is surface-don't-fix)

1. **Refresh first** — the branch is 3 behind main; start new work off *latest* `main`.
2. **Confirm the restaurant changes are new** — the cafe fast path already merged (#33), so check the uncommitted `restaurant-*` edits aren't leftover duplicates.
3. **Split the pile into separate PRs**, each off fresh main: (a) restaurant place-photo, (b) concierge chat-session UI, (c) prod-synthetic-smoke + CI, (d) the landlord migration on its **own** PR with RLS evidence.
4. **Move the 3 nested worktrees out** of `mdeapp/` (or remove if stale) so they stop polluting `git status`.

I deliberately stopped at surfacing — splitting branches, moving worktrees, and committing migrations are your calls (and several are fenced by your own safety rules). 

Want me to help with the safe parts? I can: draft the exact split (which files → which branch), or relocate the `.wt-wave1-pr-*` worktrees cleanly. Say which.