On it. This is a real source change to `mdeapp/src/mastra/agents/concierge.ts`, so it must go on a **clean branch off `main`** in its own worktree — not the `hotfix/g2d-cafe-fast-path` tree (your in-progress work) and not stacked on it. Let me gather the exact target text and survey existing worktrees before creating one.

Confirmed the exact fix: the Zod `lastRentalQuery` block (concierge.ts:21-29) lacks `genericAskPending`, while the TS type (`types.ts:17`) and the Zod `lastEventQuery` both have it. I'll mirror the `lastEventQuery` definition. `concierge.test.ts` exists, so I can add a regression assertion. I'll work in a clean worktree off `origin/main` (c9e54b8), keeping the hotfix tree untouched. Let me set up task tracking.

Starting the worktree. Let me mark the task active, check whether `node_modules` can be safely symlinked (package-lock parity between the hotfix base and main), and create the worktree off `origin/main` outside the repo.

Worktree created at `/home/sk/mde-wt-int010` on `fix/int-010-rental-generic-ask-pending` (HEAD c9e54b8). `package-lock.json` is unchanged between the hotfix base and main (only `package.json` gained 3 lines), so the installed dependency set is identical — a `node_modules` symlink is safe. Let me confirm those `package.json` lines aren't new deps, then wire up `node_modules`.

I'll read the concierge.ts file in the worktree to confirm the exact current content before editing.

The file matches expectations exactly — `lastRentalQuery` (lines 22-27) lacks `genericAskPending` while `lastEventQuery` (lines 55-58) has it. Let me make the one-line parity fix.

Backend Zod schema change — not browser-observable, so verification is typecheck + unit test + build, not preview. Let me confirm the TS type parity and read the existing test file structure.

Confirmed: `types.ts:17` already has `genericAskPending?: boolean;` on `lastRentalQuery` — so my Zod edit closes the drift (Zod now matches TS). The test file has an event-side `genericAskPending` test (line 82-92) but **no rental equivalent**. I'll add the regression test that would fail pre-fix (Zod strips unknown keys) and pass post-fix.

Both edits are in. Now I'll verify — running the targeted vitest test and `tsc --noEmit` in parallel from the worktree.

Both green: **11/11 tests pass** (my new rental-flag test included — it would have failed pre-fix since Zod strips unknown keys) and **tsc --noEmit clean** (no type errors). Now the final gate — `next build` — which I'll run in the background while I sync task tracking.

Build is running in the background. Let me sync task tracking — #36/37/38 done, #39 in progress.

The two fast gates are green and the build is running in the background (ID `b8vd6wleg`). Here's where the INT-010 fix stands:

**Change made** (worktree `/home/sk/mde-wt-int010`, branch `fix/int-010-rental-generic-ask-pending` off `origin/main` c9e54b8):

- `src/mastra/agents/concierge.ts` — added `genericAskPending: z.boolean().optional().describe(...)` inside the `lastRentalQuery` Zod object, matching `lastEventQuery`'s field.
- `src/mastra/agents/__tests__/concierge.test.ts` — added a regression test asserting the schema preserves `lastRentalQuery.genericAskPending`.

**Verification so far:**

- `vitest concierge.test.ts` → **11/11 pass** (was 10; my new test is the +1). Pre-fix it would fail, since Zod strips keys absent from the schema.
- `tsc --noEmit` → **clean**, no type errors. Confirms parity with `types.ts:17` which already declared the field.

**Persona impact:** Camila asks a vague "show me apartments," the fast-path sets `genericAskPending: true` and asks her to narrow neighborhood/budget. Before this fix, Zod dropped that flag when persisting working memory, so on her next turn the agent forgot it had already asked and re-clarified. Now the flag survives the turn.

I'll report the build result and offer commit/PR once it finishes — not auto-committing or pushing.

Build completed with exit code 0. Let me read the output to confirm it's a clean Next.js build, not a partial.

Clean build — exit 0, all 20 static pages generated, every route compiled including `/chat` and `/rentals` (Camila's surfaces). All three gates are green. Let me capture the diff for the report and update task tracking.

All three gates green and the diff is exactly the surgical change intended. Marking the report task done.

## INT-010 fix done and verified

The one-line Zod drift fix is staged in a clean worktree (`/home/sk/mde-wt-int010`, branch `fix/int-010-rental-generic-ask-pending` off `origin/main` c9e54b8). **Not committed, not pushed** — awaiting your go-ahead.

**Diff — 2 files, +15 lines:**

- `src/mastra/agents/concierge.ts` (+4) — `genericAskPending` added to the `lastRentalQuery` Zod object, matching `lastEventQuery`.
- `src/mastra/agents/__tests__/concierge.test.ts` (+11) — regression test asserting the schema preserves `lastRentalQuery.genericAskPending`.

**Verification (all green):**

|Gate|Result|
|---|---|
|`vitest concierge.test.ts`|11/11 pass (was 10 — the new test is the +1; fails pre-fix since Zod strips unknown keys)|
|`tsc --noEmit`|clean — confirms parity with `types.ts:17`, which already declared the field|
|`next build`|exit 0 — 20/20 static pages, all routes incl. `/chat` + `/rentals`|

**What it fixes (Camila):** she sends a vague "show me apartments," the fast-path sets `genericAskPending: true` and asks her to narrow neighborhood/budget. Pre-fix, Zod dropped that flag when persisting working memory, so on her next turn the agent forgot it had already asked and re-clarified. The flag now survives the turn. This closes exactly the drift the INT tracker flagged (`⚠️ INT-010 — Zod lastRentalQuery missing genericAskPending`).

**Your call — I won't act without a yes:**

1. **Commit** on this branch (message scoped to INT-010 drift fix), or
2. **Commit + open PR** against `mdeapp` `main`, or
3. **Hold** — leave it staged in the worktree.

After it's committed + live on Vercel, the Phase-5 follow-on is flipping INT-010 to Done in the spec + INDEX and moving it to `archive/` (same model as INT-001/002/007/008) — I'll do that bookkeeping only once it's actually deployed.