---
title: Verifier blocker patches — pass/fail
date: 2026-05-20
auditor: task-verifier
scope: 6 surgical patches against the verifier blockers in 04-VERIFICATION-of-02-and-03.md §Stop-condition
guardrails:
  - no new features
  - no architecture changes
  - no `npm audit fix --force`
  - no Supabase migrations
  - no secret values exposed in any artifact
verdict: 6/6 patches landed; 1 environmental finding (Stripe identical secrets) intentionally NOT remediated this turn — F11 spec now requires it
---

# Patch pass/fail

| # | Blocker | Patch site | Probe | Result |
|---|---|---|---|---|
| 1 | F11 spec must require distinct ticket vs sponsor secrets | `tasks/core/EVP-003-core-stripe-webhook-secret-audit.md` §2 Goals + §9 DoD + §10 T9 | `grep -c 'DISTINCT' tasks/core/F11-…md` ≥ 4 | ✅ **PASS** (4 hits — Goals, DoD line, T9 probe-call, evidence requirement) |
| 2 | F13 depends_on references nonexistent `F09-supp` | `tasks/core/F13-ai-runs-observability.md` frontmatter | `awk '/^depends_on:/{print}' …F13…md` | ✅ **PASS** — now `depends_on: [F06, F09]` |
| 3 | F09 vitest config missing `@/*` → `./src` alias | `tasks/core/F09-floor-script-and-vitest.md` §4 step 3 | `grep -c "resolve.*alias\|'@'.*path.resolve" tasks/core/F09-…md` ≥ 2 | ✅ **PASS** (2 hits — alias key + path.resolve call) |
| 4 | F09 5-gate floor ↔ `/verify-floor` 4-gate command mismatch | `.claude/commands/verify-floor.md` rewritten | `grep -cE 'Lint\|Typecheck\|Build\|Test\|Audit' verify-floor.md` ≥ 5 | ✅ **PASS** (12 hits — table + manual fallback both list all 5 gates; delegates to `npm run floor` once F09 ships) |
| 5 | F18 `Agent({ workflows })` fallback only a "may need" — must be hard prereq | `tasks/core/F18-router-and-classify-intent.md` §1 + §2 Goals + §3 + §4 step 1 + §5 + §7 ACs | `grep -ci 'hard prerequisite\|required prereq' F18-…md` ≥ 2 | ✅ **PASS** (2 hits + Goals reframed; ACs now block on prereq evidence) |
| 6 | F19 still names `PromptInjectionDetector` + `TokenLimiter` (absent on beta) | `tasks/core/F19-…md` §1 risk header + §2 Goals + §4 pre-flight + §5 drift table | `grep -c 'TokenLimiterProcessor\|ModerationProcessor\|SystemPromptScrubber' F19-…md` ≥ 6 | ✅ **PASS** (6 hits across all three new classes; legacy names retained only in "do not import" warnings) |

**Net: 6 / 6 ✅**

## Re-run of `task-verifier` probe (2026-05-20, post-patch)

```
filter=tasks    → 🟢 ok=0  🟡 warn=0  🔴 fail=0   (was 🔴 1, F13→F09-supp; now clean)
filter=env      → 🟢 ok=7  🟡 warn=0  🔴 fail=1   (Stripe identical-secrets — environmental, see below)
filter=beta     → 🟢 ok=6  🟡 warn=1  🔴 fail=0   (TokenLimiterProcessor / ModerationProcessor / SystemPromptScrubber confirmed)
```

## Out-of-scope-this-turn (intentional)

| Item | Why deferred | Where it's owned |
|---|---|---|
| **Stripe webhook-secret rotation** | The verifier flagged identical values in `/home/sk/mdeai/.env.local`. Rotating real Stripe signing secrets is W2 execution work owned by **F11**, not a spec patch. This turn updates F11 so its DoD now BLOCKS until the values are distinct in all 3 sources (workspace env, Supabase Functions secrets, Stripe Dashboard). The verifier will keep flagging the env until F11 executes. | F11 execution (W2 Day 2) |
| `npm audit fix --force` | User guardrail. mdeapp has 2 moderate CVEs in postcss (transitive via next 16.2.6); `--audit-level=high` keeps `npm run audit` at exit 0. No upgrade attempted. | F01b follow-up (waiver doc) or upstream Next patch |
| Supabase migrations | User guardrail. None touched. | n/a |

## Files changed (5 specs + 1 command)

```
tasks/core/F09-floor-script-and-vitest.md           (+13 −1   vitest.config.ts alias)
tasks/core/EVP-003-core-stripe-webhook-secret-audit.md       (+11 −4   Goals + DoD + T9 distinctness probe)
tasks/core/F13-ai-runs-observability.md             ( +1 −1   depends_on F09-supp → F09)
tasks/core/F18-router-and-classify-intent.md        (+22 −10  fallback elevated to hard prereq)
tasks/core/F19-concierge-and-restaurants-attractions.md (+18 −8  processor rename)
.claude/commands/verify-floor.md                    (+30 −15  5 gates + delegate to npm run floor)
```

No `mdeapp/src/**` code change. No new dependencies installed. No git push.

## Commands to run next

1. **Re-run probe** any time before flipping any task to Done: `bash .claude/skills/task-verifier/scripts/probe-disk.sh`.
2. **Ship F09** to materialize the `floor` script + `vitest.config.ts` (now spec is correct).
3. **Execute F11 W2 Day 2** — rotate Stripe secrets distinct; only then `🔴 fail=1` on the env probe clears.
4. **Before F18 execution** — capture `tasks/notes/F18-evidence.md` per the new hard-prereq AC.
