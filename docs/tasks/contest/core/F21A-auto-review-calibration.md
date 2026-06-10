---
id: F21A
title: Auto-review — manual calibration (rules + subagent only, no hooks)
status: Not Started
priority: P2
phase: W2 — Day 4 / Day 5 (after F09 + F10 ship)
effort: ~1h (write rules + subagent + run 5 calibration probes)
owner: claude
depends_on: [F09]
skill: [mde-task-lifecycle, testing]
parent_plan: /home/sk/mdeai/plan/06-auto-review-plan.md (v3 — Layer 1 only)
supersedes_for_v1: plan/06-auto-review-plan.md (v2)
defers: full F21 (hooks + Stop trigger + Layer 2 GitHub Actions) until F21A produces 10+ useful manual runs
---

# F21A — Auto-review · manual calibration only

## 1. Purpose

The v3 auto-review plan is solid on paper (verified against `code.claude.com/docs/en/hooks` and `anthropics/claude-code-action@v1.0.127`) but has **zero runtime evidence**. Before automating via hooks + Stop-trigger + CI, we need to know whether the rule set actually catches real drift in *this* codebase without crying wolf. F21A is that calibration step. It creates the rules file + the reviewer subagent and uses **manual invocation only** — no hook plumbing, no `decision:"block"` JSON, no GitHub Actions. We invoke the reviewer by hand on real changed files, read the findings, and tune the rule set until the signal/noise ratio justifies automation.

Persona impact: **Sofía (dev)** runs the reviewer on her own branch by typing one Task tool invocation, sees what it would have flagged, decides if the findings are actionable. If 8 of 10 runs produce useful findings, F21B (the hook automation) gets greenlit. If 3 of 10 do, the rules get tightened before any hook fires.

## 2. Goals

- `.claude/auto-review/rules.md` exists with **R1-R5 only** (user decision — start narrow, avoid cry-wolf):
  - R1 — agent-name mismatch (critical, −25)
  - R2 — `mastra.agents.X` access (critical, −25)
  - R3 — `??` default on required tool input (high, −15)
  - R4 — generic naming (medium, −10)
  - R5 — domain logic in route layer (medium, −10)
- `.claude/agents/mdeai-auto-reviewer.md` exists, `model: haiku`, tools = `Read, Grep, Glob` only (read-only — cannot edit or shell out).
- Subagent invocable by hand via the Task tool with `subagent_type: "mdeai-auto-reviewer"` and a file list as the prompt.
- Subagent output follows the exact format from v3 plan §5 (`📋 mdeai-auto-review · N files · M findings · score=X grade=Y` header + per-file findings with rule ID, line, snippet, fix, deduction).
- Subagent obeys the "don't invent problems" rule — prints `0 findings · score=100 grade=A` when nothing fires.
- ≥ 5 calibration runs captured in `tasks/notes/F21A-evidence.md`:
  - Run 1: deliberate-drift fixture (insert `mastra.agents.pingAgent` access) — **must** fire R2, grade ≤ D
  - Run 2: deliberate-drift fixture (`inputData.maxCapacity ?? 100` in a tool stub) — **must** fire R3
  - Run 3: clean file from `mdeapp/src/mastra/agents/index.ts` (no edits) — **should** print `0 findings`
  - Run 4: negative control — Markdown file from `tasks/core/` — reviewer **should refuse** (file-extension filter R-N1 in rules) or return empty
  - Run 5: real candidate file from `mdeapp/src/components/` (`PlaceInfoCard.tsx`) — record whatever fires, that's the calibration data
- **No hooks installed.** `.claude/hooks/` and `.claude/settings.json` untouched.
- `npm run floor` still exits 0 (F21A is doc + agent-file only; doesn't touch runtime).

## 3. Features (what the user gets)

- **Sofía:** when she finishes a Claude turn that edited 3 files, she can manually invoke `mdeai-auto-reviewer` on those files via the Task tool and see findings + a numeric score in ~20-40 seconds.
- **Camila / Roberto:** no direct user impact in F21A — this is dev tooling. The benefit lands at F21B when hooks automate the invocation.
- **Future Claude session:** finds the rules.md + subagent.md on disk; can manually invoke the reviewer on its own changed files before claiming "Done" on any future task. The anti-fake-done discipline gets a real auditor.

## 4. Workflows

1. **Pre-flight (per `mde-task-lifecycle` skill):**
   - Confirm [`F09-floor-script-and-vitest.md`](../archive/core/F09-floor-script-and-vitest.md) status is `Done` (we need vitest + floor to verify nothing regresses).
   - Confirm `.claude/agents/security-reviewer.md` exists and uses `model: haiku` + the `tools:` frontmatter pattern (this is our template).
   - Confirm `.claude/auto-review/` does NOT yet exist (F21A creates it).
   - Note: `tasks/mvp.md` referenced in some plans does **not** exist on disk as of 2026-05-20 — F21A does not block on it.

2. **Create `.claude/auto-review/rules.md`** with R1-R5 only. Scoring rubric matching `plan/data/04-checklist.md` (A 90-100 / B 80-89 / C 70-79 / D 60-69 / F <60). File-extension allow-list = `["ts", "tsx"]` only for V1. Exclude paths: `node_modules/`, `.next/`, `**/__tests__/**`, `**/*.test.ts`, `**/*.spec.ts`. Each rule has: trigger pattern, severity, weight, example offender, example fix.

3. **Create `.claude/agents/mdeai-auto-reviewer.md`** following the existing `security-reviewer.md` shape:
   ```yaml
   ---
   name: mdeai-auto-reviewer
   description: <triggers proactively on changed .ts/.tsx, references rules.md>
   tools: Read, Grep, Glob
   model: haiku
   ---
   ```
   Body: procedure (read rules.md → scan files → score → output), output-format spec (verbatim header line + per-file blocks), hard rules ("never invent", "say so if clean", "scope to file list"), what NOT to flag (style nits, test files, markdown).

4. **Manual calibration — 5 runs.** For each run, capture the full prompt + reviewer output in `tasks/notes/F21A-evidence.md`:
   - Run 1 — R2 fixture. Create `mdeapp/src/mastra/_calibration-r2.ts.tmp` with `import { mastra } from "@/mastra"; const x = mastra.agents.pingAgent;`. Invoke reviewer with that file as the only target. Expect R2 finding, deduction −25, file_score 75, grade C. Delete the fixture file immediately after.
   - Run 2 — R3 fixture. Create `mdeapp/src/mastra/tools/_calibration-r3.ts.tmp` with a tool stub whose `execute:` does `const cap = inputData.maxCapacity ?? 100;`. Invoke. Expect R3, deduction −15. Delete.
   - Run 3 — clean file. Invoke on `mdeapp/src/mastra/agents/index.ts` (the actual pingAgent file, already lints clean). Expect `0 findings · score=100 grade=A`.
   - Run 4 — negative control. Invoke on `tasks/archive/core/F09-floor-script-and-vitest.md` (Markdown). Expect the reviewer to refuse (out of scope by extension filter) OR return empty findings. Either is acceptable — record which.
   - Run 5 — real candidate. Invoke on `mdeapp/src/components/cards/PlaceInfoCard.tsx`. Whatever it surfaces is the calibration data. Likely R6 (inline hex `#0f766e`) BUT that rule isn't in V1 — it should be silent on this file. If it flags R1-R5, capture and judge whether the finding is real or a false positive.

5. **Tune the rules based on Run 5 + Run 4 outcomes.** If R3 false-positives on any line that's actually intentional, narrow the probe (e.g. only flag inside files matching `src/mastra/tools/**`, not anywhere). Re-run the affected fixture to confirm.

6. **Write `tasks/notes/F21A-evidence.md`** with: 5 run transcripts + a calibration table (run / expected / actual / verdict: signal/noise/skip), a 1-paragraph "should we automate?" recommendation based on the signal-to-noise ratio observed.

7. **Decide if F21B is justified.** Threshold for proceeding: ≥ 4 of 5 calibration runs produce expected outcomes (R1-R5 fire on their fixtures; clean file is clean; markdown is skipped). If yes, queue F21B as next. If no, iterate the rules + re-run.

## 5. User journeys

- **Sofía finishes editing 3 agent files manually.** She runs in her Claude Code session: "Task tool — subagent_type mdeai-auto-reviewer — prompt: review these 3 files: …". Subagent returns findings + score in ~30s. Sofía sees R3 finding on a `??` default she added, removes it, commits. No hook fires, no automation — Sofía drove the loop herself.
- **Future Claude session shipping F14 (eventAgent port).** Before flipping F14 → Done, the session manually invokes `mdeai-auto-reviewer` on the ported file. Anti-fake-done discipline reinforced — the reviewer either finds nothing (true Done) or finds a real bug (caught before commit).
- **A skeptic.** Reads `tasks/notes/F21A-evidence.md`, sees 5 runs with named expected/actual outcomes. If runs 1-2 fired on the fixtures and run 3-5 were clean/quiet, they're convinced. If runs were all over the place, they push back — F21A's calibration data is the input to that conversation.

## 6. Agents

- **`mdeai-auto-reviewer`** (NEW) — Haiku, read-only (Read+Grep+Glob), scoped to ≤10 findings per file, never modifies code, never invents problems. Reads `.claude/auto-review/rules.md` at start of each invocation.
- `security-reviewer` (existing) — unchanged. Separate concern (secrets/RLS/JWT). Both can run on the same file list.

## 7. Integrations

| Integration | Purpose | Status |
|---|---|---|
| Task tool | Manual invocation of the reviewer | Built-in |
| `.claude/agents/security-reviewer.md` | Template shape (frontmatter, `model: haiku`, body structure) | Existing — used as reference |
| `.claude/settings.json` | NOT touched in F21A (no `autoReview` block needed for manual invocation) | Untouched |
| `.claude/hooks/` | NOT touched in F21A (no Stop hook, no PostToolUse log) | Untouched |
| `package.json` floor | Must still exit 0 after F21A | Verified post-run |
| `mde-task-lifecycle` skill | Template + DoD discipline | Followed |
| `testing` skill | Smoke-test approach (deliberate-drift fixtures) | Followed |

## 8. Summary

Build the rules file + the reviewer subagent. Use them manually. Do not automate yet. Capture 5 calibration runs as evidence. If the rules catch the things they're supposed to catch without false-positive noise on clean files, queue F21B (hook automation) as the follow-up. If not, iterate the rules and re-calibrate. **The goal of F21A is calibration data, not production deployment.**

## 9. Definition of Done

- [ ] `.claude/auto-review/rules.md` exists with R1-R5 + scoring rubric + extension allow-list + path exclude-list
- [ ] `.claude/agents/mdeai-auto-reviewer.md` exists, `model: haiku`, `tools: Read, Grep, Glob` only
- [ ] Subagent discoverable in the available-skills/agents list on next session start
- [ ] 5 calibration runs captured in `tasks/notes/F21A-evidence.md` with: run name, fixture/target file, expected outcome, actual subagent output (quoted verbatim), verdict
- [ ] Run 1 (R2 fixture) fired R2 with deduction −25
- [ ] Run 2 (R3 fixture) fired R3 with deduction −15
- [ ] Run 3 (clean file) returned `0 findings · score=100 grade=A`
- [ ] Run 4 (markdown) was correctly skipped or returned empty
- [ ] Run 5 (real candidate `PlaceInfoCard.tsx`) outcome recorded — whatever it surfaced
- [ ] Evidence file includes a 1-paragraph "should we automate (F21B)?" recommendation with signal/noise observation
- [ ] `.claude/hooks/` and `.claude/settings.json` byte-identical to pre-F21A state (verified via diff)
- [ ] `npm run floor` still exits 0
- [ ] `task-verifier probe-disk.sh` still exits 0 across struct/scripts/deps/files/git
- [ ] No fixture files leaked into git working tree (`_calibration-*.ts.tmp` deleted post-run)

## 10. Tests

### Acceptance tests (run after files created)

| # | Test | Probe | Expected |
|---|---|---|---|
| T1 | rules.md exists | `test -f .claude/auto-review/rules.md` | OK |
| T2 | rules.md has all 5 rules | `grep -cE '^### R[1-5]' .claude/auto-review/rules.md` | ≥ 5 |
| T3 | rules.md has scoring rubric | `grep -q 'A 90' .claude/auto-review/rules.md && grep -q 'min.*0.6' .claude/auto-review/rules.md` | OK |
| T4 | Subagent exists with correct frontmatter | `head -10 .claude/agents/mdeai-auto-reviewer.md \| grep -E 'name:\\|model:\\|tools:'` | 3 lines |
| T5 | Subagent uses Haiku | `grep -q '^model: haiku' .claude/agents/mdeai-auto-reviewer.md` | OK |
| T6 | Subagent is read-only (no write/edit/bash) | `awk '/^tools:/{print}' .claude/agents/mdeai-auto-reviewer.md` | `tools: Read, Grep, Glob` |
| T7 | `.claude/hooks/` unchanged | `git -C /home/sk/mdeai diff --stat .claude/hooks/` | empty |
| T8 | `.claude/settings.json` unchanged | `git -C /home/sk/mdeai diff .claude/settings.json` | empty |
| T9 | `npm run floor` post-F21A | `cd mdeapp && npm run floor` | exit 0 |
| T10 | No fixture files leaked | `find mdeapp -name '_calibration-*.tmp'` | empty |

### Negative tests

| # | Inject | Expected |
|---|---|---|
| Tn1 | Add `tools: Read, Edit, Write, Bash` to subagent | Manual review catches it — subagent is supposed to be read-only |
| Tn2 | Add a 6th rule R6 to rules.md (out of V1 scope) | Manual review catches it — V1 scope is R1-R5 only |
| Tn3 | Skip the deliberate-drift fixtures (Run 1 + Run 2) | DoD acceptance fails — those runs are the calibration's whole point |

### Evidence to capture in `tasks/notes/F21A-evidence.md`

- Full subagent output for each of 5 runs (no trimming)
- Per-run table: name / target file / expected rule firings / actual rule firings / score / grade / verdict (signal/noise/skip)
- Aggregate signal-to-noise observation: of the rules that fired across all 5 runs, what fraction were true positives?
- Recommendation: "proceed to F21B" OR "iterate R3/R4/R5 first" OR "park entire F21 effort"

## 11. Rollback plan

`rm -rf .claude/auto-review/ .claude/agents/mdeai-auto-reviewer.md tasks/notes/F21A-evidence.md`. Nothing else to undo — F21A doesn't touch hooks, settings, mdeapp source, or any infra. Single-commit revert removes everything.

## 12. What F21A does NOT do (out of scope)

- **No hook plumbing.** No PostToolUse logging, no Stop hook trigger. That's F21B (after calibration justifies it).
- **No `decision:"block"` JSON output.** The Redline pattern is verified but unused at this stage.
- **No GitHub Actions / Layer 2.** That's F21D (after F21B + F21C land).
- **No `autoReview` block in `settings.json`.** Not needed for manual invocation.
- **No telemetry.** F21A captures evidence by hand in a single Markdown file; metrics framework is F21C.
- **No false-positive logging / mock mode.** Those are F21C concerns.
- **No score gate on commits.** F21A is warn-only by definition (manual = user decides).

## Notes / verification

- The Stop hook `{"decision":"block","reason":"..."}` pattern WAS verified against [code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks) this session ✅. F21A defers using it; F21B will.
- `anthropics/claude-code-action@v1.0.127` is GA (since 2025-08-26, 7,652 stars, latest release 2026-05-19) ✅. F21D will use it.
- The subagent `tools:` field accepts a comma-separated list; verified against existing `security-reviewer.md`.
- The reviewer cannot delete or modify code — tool list excludes Edit/Write/Bash by design.
- `tasks/mvp.md` referenced in the original plan request does **not exist on disk** as of 2026-05-20. F21A doesn't block on it. If/when it lands, F21A's rules can be cross-checked against MVP scope guidance.
