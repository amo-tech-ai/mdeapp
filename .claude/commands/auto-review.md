---
description: Invoke `mdeai-auto-reviewer` subagent on changed files. Manual gate (F21A — no hooks). Outputs findings + score/grade per `.claude/auto-review/rules.md`.
allowed-tools: Bash, Read, Task
---

# /auto-review — manual semantic review of changed files

Run before committing to surface drift `npm run floor` can't catch. Read-only. Warn-only. ~20–40 s.

## What it does

1. **Detect changed files** — `git diff --name-only HEAD` + `git status --porcelain` (covers staged + unstaged + untracked).
2. **Filter to in-scope** — keep only `.ts` / `.tsx` under `mdeapp/src/**` or `mdeapp/supabase/functions/**`. Exclude test files (`**/*.{test,spec}.{ts,tsx}`, `**/__tests__/**`).
3. **Detect review pass** — if last commit author is `claude` or message contains `mdeai-auto-review`, this is a follow-up. Surface in output as "pass N".
4. **Invoke `mdeai-auto-reviewer` via the Task tool** with the file list as the prompt. The subagent reads `.claude/auto-review/rules.md`, applies R1–R5, returns findings + score + grade.
5. **Print the subagent's output verbatim.** No interpretation. The user decides what to fix.

## Workflow

From `/home/sk/mdeai/`:

```bash
cd mdeapp
CHANGED=$(
  { git diff --name-only HEAD; git status --porcelain | awk '{print $2}'; } \
    2>/dev/null \
  | sort -u \
  | grep -E '\.(ts|tsx)$' \
  | grep -E '^(mdeapp/)?(src|supabase/functions)/' \
  | grep -vE '(\.(test|spec)\.(ts|tsx)$|__tests__/)' \
  | sed 's|^mdeapp/||'
)
if [ -z "$CHANGED" ]; then
  echo "📋 /auto-review: no in-scope .ts/.tsx files changed since HEAD — skipped."
  exit 0
fi
echo "Files to review:"
echo "$CHANGED" | sed 's/^/  - /'
```

Then invoke the Task tool with `subagent_type: "mdeai-auto-reviewer"` and pass the file list (one per line) as the prompt. Show the subagent's output to the user verbatim.

## Pass tracking (follow-up reviews)

Before invocation, check if a previous review already ran for this set of files:

```bash
LAST_REVIEW=$(grep -h 'mdeai-auto-review' .claude/runtime/review.log 2>/dev/null | tail -1)
PASS=$(grep -c 'mdeai-auto-review' .claude/runtime/review.log 2>/dev/null || echo 0)
PASS=$((PASS + 1))
echo "Review pass: $PASS"
```

After the subagent finishes, append to `.claude/runtime/review.log`:

```text
{ISO-timestamp} pass={N} files={count} findings={count} score={N} grade={letter}
```

This is the **only** auto-write the command makes — small, append-only, dedup-keyed by timestamp.

## Acceptance criteria (per invocation)

- [ ] Subagent output printed verbatim (header line + per-file findings or "0 findings" line).
- [ ] Pass number shown in the wrapper output.
- [ ] `.claude/runtime/review.log` appended with one new line.
- [ ] No code modified, no files written outside `.claude/runtime/`.
- [ ] If no changed files in scope, exits with the "no in-scope" message and skips invocation.

## What it does NOT do

- **Does not block commits.** Warn-only. Hard-block belongs in F21C (after telemetry proves the rules are well-calibrated).
- **Does not run lint/typecheck/build/test.** Those are `npm run floor` — separate concern.
- **Does not write to the codebase.** Read-only subagent.
- **Does not auto-fix.** Surfaces findings for the human to act on.
- **Does not call out to GitHub.** PR-time review is F21D (`anthropics/claude-code-action@v1`); this command is local-only.

## Anti-patterns

- Don't invoke this in a loop. One review per logical change. If you want a re-review after fixes, run it again — but the pass counter goes up, which is honest signal that drift is fighting the design.
- Don't suppress the output to chase a higher grade. The score is calibration data; massaging it defeats the purpose.
- Don't add more rules without running the F21A 5-run calibration first. R6–R10 are deferred until R1–R5 prove low false-positive rate on this codebase.

## Notes / verification

- Subagent: `.claude/agents/mdeai-auto-reviewer.md` (Haiku, read-only — Read/Grep/Glob only).
- Rules: `.claude/auto-review/rules.md` (V1: R1–R5, scoring rubric matches `plan/data/04-checklist.md`).
- This is the V1 surface (F21A — calibration). Hook-driven auto-trigger is F21B. GitHub Actions PR review is F21D.
- If `mdeai-auto-reviewer` subagent is not yet registered (next session start hasn't picked it up), the Task tool will return "unknown subagent_type" — re-start Claude Code session and retry.
