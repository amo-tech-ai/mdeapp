---
description: Pre-commit floor check — same 5 gates as F09's `npm run floor` + an RLS evidence add-on
allowed-tools: Bash, Read, Grep
---

# /verify-floor — pre-commit floor for mdeapp

Run the floor before any commit or PR. After F09 lands, this command delegates to `npm run floor` (the single source of truth) and then adds one RLS evidence check on top. Should finish in under 90 seconds.

## What it checks

The 5 gates match F09's `package.json` `floor` script verbatim — when F09 ships, this command **runs that exact script** rather than duplicating the gate list.

| # | Gate | Command | Pass criterion |
|---|------|---------|----------------|
| 1 | Lint | `cd mdeapp && npm run lint` | exit 0 |
| 2 | Typecheck | `cd mdeapp && npm run typecheck` (i.e. `tsc --noEmit`) | exit 0 |
| 3 | Build | `cd mdeapp && npm run build` | exit 0 |
| 4 | Test | `cd mdeapp && npm test` (Vitest, single-run) | exit 0 + ≥1 passing |
| 5 | Audit (high+) | `cd mdeapp && npm run audit` (`--audit-level=high`) | exit 0 |
| + | RLS evidence (add-on) | If `mdeapp/supabase/migrations/**` changed this session, confirm `pg_policies` query was run via Supabase MCP | hook `stop-rls-gate` emits no warning |

## Workflow

**Once F09 is Done** (the `floor` script exists), just run:

```bash
cd mdeapp && npm run floor
```

Then add the RLS check below if any migration file is in the working tree.

**Before F09 ships** (no `floor` script yet) — run the 5 gates manually in the same order:

```bash
cd mdeapp
npm run lint     && echo "LINT  ✅" || { echo "LINT  ❌"; exit 1; }
npm run typecheck && echo "TSC   ✅" || { echo "TSC   ❌"; exit 1; }
npm run build    && echo "BUILD ✅" || { echo "BUILD ❌"; exit 1; }
npm test         && echo "TEST  ✅" || { echo "TEST  ❌"; exit 1; }
npm run audit    && echo "AUDIT ✅" || { echo "AUDIT ❌"; exit 1; }
```

If any migration file is in the working tree, query Supabase MCP:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname='public' AND tablename IN (<new tables this session>);
```

Print the 6-row table (5 gates + RLS) and exit. Do not fix anything — surface failures only.

## Expected output

```
| Gate      | Result |
|-----------|--------|
| Lint      | ✅     |
| Typecheck | ✅     |
| Build     | ✅     |
| Test      | ✅     |
| Audit     | ✅     |
| RLS       | ✅     |
```

If any row is ❌, do NOT proceed to commit. Investigate root cause.

## Run the floor as a `/goal`

`/goal` (Claude Code ≥ v2.1.139) keeps the session working until a separate evaluator model confirms a condition, removing the per-turn "is it done yet?" prompt the way Auto Mode removes the per-tool one. The floor fits: it has a measurable end state. The evaluator only reads the transcript — it can't run commands — so each condition below forces the gate results to be **printed** and pairs exit codes with a real journey signal, so a bare "exited 0" summary can't satisfy it.

Paste one (one goal per session; `/goal` checks status, `/goal clear` stops):

- **Floor only** —
  `/goal The mdeapp floor is green: from mdeapp/, npm run lint, npm run typecheck, npm run build, npm test, and npm run audit each exit 0, with each command's exit status shown in the transcript. Do not modify any test, eslint config, tsconfig.json, or next.config to force a pass — fix the source. Stop after 15 turns and report if any gate is still red.`

- **Search / intelligence floor** (adds the golden-queries journey) —
  `/goal The mdeapp floor is green (lint, typecheck, build, vitest, audit all exit 0 from mdeapp/, each shown in the transcript) AND npm run smoke:golden-queries passes with GQ-E01 "salsa this weekend" showing hybridUsed:true in its output. A green smoke exit code alone is insufficient — the hybridUsed:true line must appear. Do not edit tests, smoke scripts, or config to force a pass. Stop after 20 turns and report if not met.`

- **Ship one small PR** (no merge) —
  `/goal One small PR is open for the current change: the mdeapp floor is green (each gate's result shown in the transcript), the work is a single fresh branch off latest main (not stacked), git status shows only the intended files, and gh pr view shows the PR open. Do not merge and do not force-push. Stop after 25 turns and report status if not met.`

A goal is only as honest as the evidence surfaced in the transcript — keep printing real command output, not summaries. A permanent project Stop hook is **not** recommended for the floor: it would re-fire on every turn of every session, whereas the floor only matters pre-commit.

### Best practices for `/goal` conditions

- **Binary, transcript-visible end state.** The evaluator can't run commands — it judges only what's printed. Write "`vitest run` exits 0 with the pass count shown," never "tests look fine."
- **Pair every exit code with a journey signal.** "Exited 0" ≠ "it works." Demand the proof line: GQ-E01 `hybridUsed:true`, a non-zero pin count, a `paid` ticket row — not just the return code.
- **Forbid the cheat explicitly.** The evaluator can't see that you weakened a gate, so spell it out: no `.skip`/`xfail`, no editing the test/smoke/config, no `next.config` `ignoreBuildErrors`. Fix the source instead.
- **Always bound the run.** End with "stop after N turns and report." Goals re-fire unattended and spend tokens; an unbounded red gate loops.
- **Fence irreversible/shared-state actions inside the condition.** "Do not merge, do not force-push, disposable DB only, no `vercel --prod`." A goal acts across turns without you — name what it must never touch.
- **One goal, one coherent end state.** One per session; don't bundle five unrelated gates. `/goal clear` and reset when scope shifts. It composes with Auto Mode so each turn runs hands-free.
- **Scope to the change, not the repo.** Narrow to what you touched (`e2e/restaurant*`, `src/mastra/lib/**`) — faster turns, cheaper, less flake. Read the evaluator's last reason via `/goal`; if it's misreading the transcript, tighten the wording rather than re-running.

## Anti-patterns

- Do not auto-fix ESLint/Prettier as part of this command — that's the PostToolUse hooks' job.
- Do not run Playwright here — use `/release-checklist` for E2E gates.
- Do not modify `next.config.ts` `ignoreBuildErrors` to make tsc pass.
