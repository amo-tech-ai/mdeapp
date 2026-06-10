---
name: lean-dev-flow
description: Lean implementation loop for mdeapp (SAN-NNN) tasks. Use this skill whenever starting implementation of any Linear issue, choosing which tests to run, setting up or cleaning up a worktree, or when mde-task-lifecycle phases 3–4 feel heavy for the change at hand. Provides: the 7-step loop (read→implement→T1 test→typecheck→commit→push→PR), test-tier selection by change shape (T1 targeted ~2s / T2 domain ~5s / T3 floor ~3min), worktree bootstrap/audit/clean commands, local-vs-CI verification matrix, and structured evidence capture. ALWAYS invoke this before running `npm run floor` locally, spinning up the dev server for a backend-only change, or doing a full-suite test run after a single-file edit. Replaces the "lint-per-chunk + build-per-chunk + floor-before-commit" pattern that burns 2–3min per task cycle with no safety benefit.
title: lean-dev-flow — mdeapp lean implementation loop
impact: HIGH
impactDescription: Cuts per-task cycle overhead by eliminating floor-on-every-change, wrong test tier, stale worktrees, and silent verify-script failures
tags: lean, mde-task-lifecycle, testing, worktree, vitest, verification, implementation, efficiency
paths:
  - "mdeapp/src/**"
  - "mdeapp/e2e/**"
  - "mdeapp/scripts/**"
  - "mdeapp/workspace/**"
---

# lean-dev-flow

**BLUF:** Five minutes of per-task friction accumulates to hours lost per cycle. This skill makes the inner loop as fast as it can be without dropping safety — by running the right verification at the right time instead of running everything every time.

---

## The 7-step lean loop

Every task, every time. No detours.

```
1. READ       — Read only the files you will change + their existing test files
2. IMPLEMENT  — Make the targeted change
3. T1 TEST    — npm test -- --run src/path/to/file.test.ts  (~2s)
4. TYPECHECK  — npx tsc --noEmit  (~5s, catches import drift)
5. COMMIT     — git add <specific files> && git commit  (never git add -A)
6. PUSH       — git push
7. PR         — gh pr create
```

CI runs lint + build + full test suite. You don't need to reproduce CI locally — you need to be *confident* before pushing, which targeted tests + typecheck achieves faster and more reliably than floor.

---

## Test tier selection

**Pick the lowest tier that proves the claim.** Moving up a tier costs 2–3 extra minutes.

| Tier | Command | When | Time |
|------|---------|------|------|
| **T1 — Targeted** | `npm test -- --run src/path/to/file.test.ts` | Single file changed | ~2s |
| **T2 — Domain** | `npm test -- --run src/mastra/` (or `src/lib/`, `src/hooks/`) | Domain-wide impact (shared hook, Zod schema, concierge agent) | ~5s |
| **T3 — Floor** | `npm run floor` | PR open time — once, not per commit | ~3min |

**Tier decision rules:**

| Change | Tier |
|--------|------|
| Added/edited a single test file | T1 (just that file) |
| Changed a utility used in one place | T1 |
| Changed a hook used by multiple components | T2 (`src/hooks/`) |
| Changed concierge Zod schema | T2 (`src/mastra/`) |
| Changed a shared lib (`src/lib/`) | T2 |
| Changed a Next.js page or layout | T1 + Playwright smoke |
| PR ready to open | T3 — one run, then CI takes over |
| Docs/config only change | No test run needed |

Full decision tree with edge cases → [references/test-tiers.md](references/test-tiers.md)

---

## Verification matrix — what runs where

Never reproduce what CI already owns.

| Check | Pre-commit | Pre-push | CI (floor.yml) | Before Done |
|-------|:---:|:---:|:---:|:---:|
| T1 targeted vitest | ✅ | ✅ | — | — |
| T2 domain vitest | — | ✅ if domain touched | — | — |
| `tsc --noEmit` | — | ✅ | ✅ | — |
| ESLint | — | — | ✅ | — |
| `next build` | — | — | ✅ | — |
| Full vitest suite | — | — | ✅ | — |
| `npm audit` | — | — | ✅ | — |
| `verify:console:boot` | — | — | — | ✅ UI changes |
| `smoke:golden-queries` | — | — | — | ✅ AI path changes |
| Playwright P0 smoke | — | — | — | ✅ user journey changes |
| Prod synthetic smoke | — | — | Nightly | Release |

**Server-dependent verify scripts** (`verify:console`, `verify:grounding`, `verify:rental-pins`, etc.) require `localhost:3001`. Before running any of them, confirm the server is alive:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/
```
If not 200, restart with `npm run dev:ui` first, then wait for "Ready in".

Full matrix with rationale → [references/verification-matrix.md](references/verification-matrix.md)

---

## What to skip

Eliminating these patterns is the highest-ROI part of this skill.

| Pattern | Cost | Replace with |
|---------|------|-------------|
| `npm run floor` before every commit | 3min/commit; CI does this | T1 before commit, T3 at PR time only |
| `npm run lint` per chunk during coding | ~30s/run; CI catches it | Skip locally; fix when CI flags |
| `npm run build` for a lib/hook change | 90s for a type question | `tsc --noEmit` (5s) |
| Reading CLAUDE.md/sitemap.md every task | Context load waste | Read once; reference the specific section |
| `git status` after every edit | Noise | Only before `git add` |
| Re-reading a file after editing | Edit tool confirmed success | Don't re-read |
| Starting dev server for backend-only change | 30s boot waste | Server needed only for UI/verify:* |
| `git add -A` | Risks staging .env, WIP files | Always `git add <specific files>` |
| Running full E2E for a non-UI change | 3–8min; nothing to prove | Skip; Playwright is for user journeys |

---

## Worktree bootstrap

Every branch gets an isolated worktree. Canonical root: `mdeapp/.worktrees/wt-san-NNN-slug/` — never work in the main worktree on a feature branch.

```bash
# Start a new task — creates branch + worktree from origin/main
bash scripts/worktree-add.sh <SAN-NNN> <slug>
# Example: bash scripts/worktree-add.sh 500 event-filter-ui
# Creates: mdeapp/.worktrees/wt-san-500-event-filter-ui/
# Branch:  ai/san-500-event-filter-ui

# Audit all worktrees (shows stale/merged/dirty/unknown)
bash scripts/worktree-audit.sh
```

Manual fallback (only if the scripts are unavailable):
```bash
git -C /home/sk/mdeai/mdeapp fetch origin main --quiet
git -C /home/sk/mdeai/mdeapp worktree add .worktrees/wt-san-NNN-slug -b ai/san-NNN-slug origin/main
```

---

## Evidence capture

Before flipping any task to Done, capture runtime-verified evidence. "I reviewed the code" is not evidence.

**For test-only changes:**
```bash
npm test -- --run src/path/to/file.test.ts 2>&1 | grep -E "Tests|passed|failed"
# Paste the "Tests N passed (N)" line into the task .md
```

**For UI/server changes:**
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/  # confirm 200
npm run verify:console:boot
```

**For API/agent path changes:**
```bash
npm run smoke:golden-queries
```

Evidence format for task `.md` (append to `## Verification` section):
```markdown
## Evidence — SAN-NNN
- [x] Tests: N passed (`src/path/file.test.ts`, sha <abbrev>)
- [x] GET /: HTTP 200 @ localhost:3001
- [x] POST /api/copilotkit: HTTP 200
- [x] [relevant smoke output line]
```

Structured evidence script template → [references/evidence-template.md](references/evidence-template.md)

---

## Wired package.json scripts (verified 2026-06-09)

These exist in `mdeapp/package.json` — use them directly:

| Script | What it runs | Use for |
|--------|--------------|---------|
| `npm run check` | typecheck + full vitest suite, no build | Default pre-push for 80% of changes |
| `npm run floor:fast` | parallel lint+typecheck+tests, then build+audit | PR-open gate (~half of serial floor) |
| `npm run test:mastra` | `vitest run src/mastra/` | T2 — agent/schema changes |
| `npm run test:lib` | `vitest run src/lib/` (260 tests, ~2.4s) | T2 — shared lib changes |
| `npm run test:hooks` | `vitest run src/hooks/` | T2 — shared hook changes |
| `npm run test:api` | `vitest run src/app/api/` | T2 — API route changes |

---

## Integration with mde-task-lifecycle

This skill operates inside phases 3 and 4. The lifecycle owns everything else.

| Phase | mde-task-lifecycle owns | lean-dev-flow adds |
|-------|------------------------|-------------------|
| Phase 3 — Implement | Entry criteria, wiring plan, read-before-edit rule | 7-step loop replaces lint-per-chunk + build-per-chunk |
| Phase 4 — Test | Which test types apply, failure triage, smoke steps | Tier selection (T1/T2/T3), local-vs-CI matrix |
| Phase 5 — Ship | Bookkeeping, changelog, PR | Structured evidence format before Done flip |

---

## Routing

| Need | Route to |
|------|----------|
| Full task lifecycle (plan → research → ship) | `mde-task-lifecycle` |
| Worktree/PR discipline and forensic cleanup | `mde-worktree-pr-flow` |
| Vitest patterns (mocks, fixtures, RTL) | `vitest` skill |
| Playwright setup, selectors, network mocking | `playwright-cli` skill |
| Pre-ship gate full checklist | `/deploy-check` |
| Debugging a failing test or build error | `systematic-debugging` |
| Supabase migration safety | `mde-supabase` |
