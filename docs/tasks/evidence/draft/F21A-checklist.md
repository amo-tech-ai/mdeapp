# F21A — auto-review system · checklist

> Runnable checklist. Tick each box as you go. Stop and fix before proceeding to the next item if anything fails.

## 0 — pre-flight (one-time)

- [x] `tasks/core/F21A-auto-review-calibration.md` exists
- [x] `.claude/auto-review/rules.md` exists with R1–R5 + scoring rubric (V1)
- [x] `.claude/agents/mdeai-auto-reviewer.md` exists (Haiku, read-only: Read+Grep+Glob)
- [x] `.claude/commands/auto-review.md` exists (slash command wrapper)
- [ ] Next session start picks up the new subagent — verify by running `/auto-review` in a fresh Claude session; if Task tool returns "unknown subagent_type", restart Claude Code

## 1 — subagent shape gates (no invocation yet)

- [ ] T1 — rules.md has 5 rules: `grep -cE '^### R[1-5]' .claude/auto-review/rules.md` → ≥ 5
- [ ] T2 — rules.md has scoring rubric: `grep -q 'A 90–100' .claude/auto-review/rules.md && grep -qE 'min.*0\.6' .claude/auto-review/rules.md`
- [ ] T3 — subagent uses Haiku: `grep -q '^model: haiku$' .claude/agents/mdeai-auto-reviewer.md`
- [ ] T4 — subagent is read-only: `grep -E '^tools:' .claude/agents/mdeai-auto-reviewer.md` returns exactly `tools: Read, Grep, Glob` (no Edit/Write/Bash)
- [ ] T5 — slash command exists with allowed-tools restricted: `grep -E '^allowed-tools:' .claude/commands/auto-review.md` returns `Bash, Read, Task`

## 2 — environment / regressions

- [ ] `.claude/hooks/` byte-identical to pre-F21A state: `git diff --stat .claude/hooks/` → empty
- [ ] `.claude/settings.json` byte-identical: `git diff .claude/settings.json` → empty
- [ ] `npm run floor` still exits 0: `cd mdeapp && npm run floor`
- [ ] `task-verifier` probe still green: `bash .claude/skills/task-verifier/scripts/probe-disk.sh` → `🔴 fail` count unchanged from yesterday

## 3 — calibration runs (5 runs · the core of F21A)

Each run = one Task tool invocation of `mdeai-auto-reviewer` with the listed target file(s). Capture verbatim subagent output in `tasks/notes/F21A-evidence.md`.

### Run 1 — R2 fixture (must fire)

- [ ] Create `mdeapp/src/mastra/_calibration-r2.ts.tmp` with:
  ```ts
  import { mastra } from "@/mastra";
  // deliberate-drift fixture for F21A R2 calibration
  export const _x = mastra.agents.pingAgent;
  ```
- [ ] Invoke reviewer on that file
- [ ] **Expected:** R2 finding, deduction −25, file_score 75, grade C, header `findings=1`
- [ ] Delete the fixture file
- [ ] Confirm no fixture leaked: `find mdeapp -name '_calibration-*.tmp'` → empty

### Run 2 — R3 fixture (must fire)

- [ ] Create `mdeapp/src/mastra/tools/_calibration-r3.ts.tmp` with:
  ```ts
  // deliberate-drift fixture for F21A R3 calibration
  export async function execute({ inputData }: { inputData: { maxCapacity?: number } }) {
    const cap = inputData.maxCapacity ?? 100;
    return cap;
  }
  ```
- [ ] Invoke reviewer
- [ ] **Expected:** R3 finding, deduction −15, file_score 85, grade B
- [ ] Delete the fixture file

### Run 3 — clean file (must be silent)

- [ ] Invoke reviewer on `mdeapp/src/mastra/agents/index.ts` (real file, currently clean)
- [ ] **Expected:** `📋 mdeai-auto-review v1 · 1 files · 0 findings · score=100 grade=A — no issues found.`

### Run 4 — negative control (must skip)

- [ ] Invoke reviewer on `tasks/core/F09-floor-script-and-vitest.md` (Markdown — out of scope)
- [ ] **Expected:** `📋 skipped: tasks/core/F09-floor-script-and-vitest.md (out of scope — extension or path)`
- [ ] **Acceptable alternative:** returns 0 findings without error

### Run 5 — real candidate (record whatever fires)

- [ ] Invoke reviewer on `mdeapp/src/components/cards/PlaceInfoCard.tsx`
- [ ] **Expected:** likely 0 findings under V1 (R6 inline hex isn't in V1). Any R1–R5 finding is calibration data — note in evidence whether the finding is real or false-positive.

## 4 — evidence

- [ ] Create `tasks/notes/F21A-evidence.md` with the 5 run transcripts (verbatim subagent output, no trimming)
- [ ] Per-run table: name / target / expected rule firings / actual rule firings / file score / turn grade / verdict (signal | noise | skip)
- [ ] Signal-to-noise observation paragraph: of the rules that fired across runs 3+5, what fraction were true positives?
- [ ] Recommendation paragraph: `PROCEED to F21B` | `ITERATE Rx first` | `PARK entire F21 effort`

## 5 — gate to F21B (hook automation)

Do NOT start F21B until ALL of these are true:

- [ ] Run 1 fired R2 with deduction −25 (no false negatives on critical rule)
- [ ] Run 2 fired R3 with deduction −15
- [ ] Run 3 returned 0 findings on a known-clean file (no false positives)
- [ ] Run 4 was skipped (extension filter works)
- [ ] Run 5's findings (if any) were judged true positives by a human reviewer
- [ ] Evidence file written and the recommendation paragraph reads `PROCEED`

If any box fails: tune `.claude/auto-review/rules.md` (narrow the probe for the offending rule), re-run the affected calibration run, re-evaluate. Do not paper over false positives by adding suppressions to the subagent — fix the rule.

## 6 — rollback (if F21A is abandoned)

```bash
rm -rf /home/sk/mdeai/.claude/auto-review/
rm -f /home/sk/mdeai/.claude/agents/mdeai-auto-reviewer.md
rm -f /home/sk/mdeai/.claude/commands/auto-review.md
rm -f /home/sk/mdeai/tasks/core/F21A-auto-review-calibration.md
rm -f /home/sk/mdeai/tasks/notes/F21A-evidence.md
rm -f /home/sk/mdeai/tasks/notes/F21A-checklist.md
find /home/sk/mdeai/mdeapp -name '_calibration-*.tmp' -delete
```

`.claude/hooks/` and `.claude/settings.json` and `mdeapp/src/**` are untouched by F21A — nothing to revert there.

## 7 — definition of Done for F21A

When boxes 0 through 5 are all ticked and the evidence file's recommendation reads `PROCEED`, F21A is Done. Flip `tasks/core/F21A-auto-review-calibration.md` frontmatter `status: Done` + `completed_at: <date>` + `evidence: tasks/notes/F21A-evidence.md`. Update `tasks/INDEX.md` if F21A is later added there.

## 8 — what comes next (after F21A is Done)

- **F21B** — local Stop-hook automation (amend `lint-edited-ts.mjs` + `stop-rls-gate.mjs` with the `decision:"block"` JSON pattern per redline; gated by F21A signal/noise observation)
- **F21C** — hash dedup + telemetry (`.claude/runtime/review.log`, `skip.log`, mock mode, throttle)
- **F21D** — GitHub Actions PR-time review (`anthropics/claude-code-action@v1`)

Do NOT start any of these before F21A is Done.
