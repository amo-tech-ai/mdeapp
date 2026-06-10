---
title: Phase 4 — Testing
impact: MEDIUM
impactDescription: Routes Vitest, Playwright, edge smoke per change shape
tags: mde-task-lifecycle, testing, vitest, playwright
---

# Phase 4 — Testing

Coordinator. Routes to **`testing`** topic files for Vitest and Playwright — patterns live there, not duplicated here.

---

## Table of contents

1. [Entry / exit criteria](#entry--exit-criteria)
2. [Workflow checklist](#workflow-checklist)
3. [Test type matrix](#test-type-matrix)
4. [Validation hierarchy](#validation-hierarchy)
5. [Smoke-test workflow](#smoke-test-workflow)
6. [Failure triage](#failure-triage)
7. [Regression triggers](#regression-triggers)
8. [Routing](#routing)

---

## Entry / exit criteria

| | Criterion |
|---|---|
| **Entry** | Phase 3 build is green. All wiring-plan files modified. |
| **Exit** | Required gates pass ([`/deploy-check`](../../commands/deploy-check.md) **full** or equivalent). Smoke evidence captured (screenshot for UI, log timestamp for edge fn, query result for migration). Regression suite green. |

Required pre-ship gates (lint baseline, type-check, bundle budget, four-states check, RLS, JWT, env-var hygiene): run [`/deploy-check`](../../commands/deploy-check.md) — full checklist for what used to live in the **`mdeai-project-gates`** skill. Do not duplicate that checklist here.

---

## Workflow checklist

> **Test tier:** Use the **`lean-dev-flow`** skill to pick the right tier — T1 targeted (~2s) for single-file changes, T2 domain (~5s) for hooks/agents/lib, T3 floor only at PR time. Running `npm run floor` before every commit is the most common waste pattern in this codebase.

```
[ ] 1.  Match each AC row to a test type via the matrix.
[ ] 2.  Write tests in order: unit → integration → E2E.
[ ] 3.  Run T1 or T2 per lean-dev-flow tier selection (not full floor).
[ ] 4.  Run targeted Playwright spec if user journey changed (test:e2e:smoke).
[ ] 5.  Manual smoke per Smoke-test workflow (server alive check first).
[ ] 6.  Capture structured evidence (- [x] format, HTTP status, test count).
[ ] 7.  Run `npm run floor` once at PR time — CI will re-run it, that's fine.
[ ] 8.  If any gate fails → loop back to Phase 3.
```

---

## Test type matrix

| Change shape | Test type | Specialist skill |
|--------------|-----------|------------------|
| New React component | Unit + JSDOM render | [`testing` — vitest.md](../testing/vitest.md) |
| New custom hook | `renderHook` + assertions | [`testing` — vitest.md](../testing/vitest.md) |
| New page or user journey | E2E flow | [`testing` — playwright.md](../testing/playwright.md) |
| Edge function | Zod-schema unit test + `supabase functions invoke` smoke | [testing-strategy skill](../../../.agents/skills/testing-strategy/SKILL.md) or [testing — testing-strategy.md](../testing/references/testing-strategy.md) |
| Database migration | RLS test + smoke SELECT | [`/deploy-check`](../../commands/deploy-check.md) + Supabase advisors |
| Cron / scheduled routine | Manual trigger + DB side-effect check | Manual smoke |
| Trio agent / Paperclip routine | Live VPS dry-run, `dangerouslyBypass…: false` | Manual smoke + audit log review |
| AI prompt change | Eval set ≥10 cases, before/after compare | [testing-strategy skill](../../../.agents/skills/testing-strategy/SKILL.md) |
| Pure refactor (no behavior change) | Re-run existing tests; no new tests | — |

Full matrix with column-by-column rules: [references/testing-matrix.md](references/testing-matrix.md).

For Vitest patterns (mocks, providers, fixtures), JSDOM caveats, RTL queries → [`testing` — vitest.md](../testing/vitest.md).

For Playwright setup, selectors, network mocking, video/screenshot artifacts → [`testing` — playwright.md](../testing/playwright.md).

For test-plan design (what to test, what to skip) → [references/testing-strategy.md](../testing/references/testing-strategy.md) in **`testing`**.

---

## Validation hierarchy

Run in order. Stop and fix at the first failure.

```
1. Lint                  (fastest, catches most)
2. Type-check (build)    (still fast)
3. Unit tests            (Vitest)
4. Component tests       (Vitest + RTL)
5. Integration tests     (hooks + Supabase mocks)
6. E2E tests             (Playwright on dev server)
7. Manual smoke          (the actual user flow)
8. Regression suite      (full Vitest after every change)
```

Each higher level is more expensive but catches issues lower levels can't.

---

## Smoke-test workflow

After Phase 3 passes gates, exercise the change manually.

| Change | Smoke steps |
|--------|------------|
| New page | Navigate, verify all four states, check at 375 / 768 / 1280 widths |
| Updated hook | Open a component that uses it, exercise every state path |
| New edge function | `supabase functions invoke <name> --body '{...}'`, check shape, check `ai_runs` row |
| New migration | Authed SELECT against new table; confirm RLS rejects cross-org reads |
| New cron | Trigger manually, confirm side effects (rows inserted, notifications sent) |
| AI prompt change | Send 10 sample queries, compare against eval fixture |

Record evidence in the prompt's `## Verification` section before Phase 5.

---

## Failure triage

When a test fails:

1. **Read the failure message fully.** Vitest and Playwright print diffs — read them.
2. **Reproduce locally.** `npm run test:watch` for the file, or `npx playwright test <spec> --headed --debug`.
3. **Classify:**
   - Test is wrong → fix the test.
   - Code is wrong → loop back to Phase 3.
   - Flake → add a wait/assertion, never `setTimeout`.
4. **Never skip a failing test** without a tracked follow-up task ID in the `it.skip` annotation.

For systematic regressions, escalate to the **`systematic-debugging`** skill — indexed in [CLAUDE.md](../../../CLAUDE.md) (Skills); typically installed globally, not under this repo’s `.claude/skills/`.

---

## Regression triggers

| Trigger | Action |
|---------|--------|
| Touched a hook used by ≥3 components | Re-run the full Vitest suite |
| Touched a route or layout | Re-run relevant Playwright spec |
| Touched RLS or a migration | Re-run RLS smoke for every affected table |
| Touched an AI prompt | Re-run eval fixture for that agent |
| Pre-Phase-5 | Lint + Vitest + build + targeted Playwright |

Snapshot tests are useful but require careful review — never blindly update snapshots.

---

## Routing

| Need | Route to |
|------|----------|
| Vitest patterns / RTL queries / fixtures | [`testing` — vitest.md](../testing/vitest.md) |
| Playwright setup, selectors, mocks | [`testing` — playwright.md](../testing/playwright.md) |
| Test-plan design | **`testing-strategy`** skill or internal references |
| Pre-ship gate verification | [`/deploy-check`](../../commands/deploy-check.md) |
| Stuck debugging a failure | **`systematic-debugging`** — see [CLAUDE.md](../../../CLAUDE.md) (Skills) |

Hand off to [shipping.md](shipping.md) when gates are green and evidence captured.
