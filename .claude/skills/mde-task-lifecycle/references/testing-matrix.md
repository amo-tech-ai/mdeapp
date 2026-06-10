---
title: Testing matrix
impact: MEDIUM
impactDescription: Change shape → required test types (Phase 4)
tags: mde-task-lifecycle, testing, matrix
---

# Testing matrix

Used during Phase 4 ([testing.md](../testing.md)) to map a change shape to required test types.

---

## Matrix

| Change shape | Unit | Component | Hook | E2E | Edge fn smoke | Migration smoke | RLS test | Eval set | Skill |
|--------------|------|-----------|------|-----|---------------|-----------------|----------|----------|-------|
| New React component (presentational) | — | yes | — | — | — | — | — | — | `testing` · Vitest |
| New React component (data-fetching) | — | yes | yes | optional | — | — | — | — | `testing` · Vitest |
| New custom hook | yes | — | yes | — | — | — | — | — | `testing` · Vitest |
| New page / route | — | yes | yes | yes | — | — | — | — | `testing` · Playwright |
| User-journey change spanning ≥2 pages | — | — | — | yes | — | — | — | — | `testing` · Playwright |
| New edge function | yes (Zod) | — | — | optional | yes | — | — | — | `testing-strategy` |
| Edge function refactor (no behavior change) | yes | — | — | — | yes | — | — | — | `testing-strategy` |
| Migration (new table) | — | — | — | — | — | yes | yes | — | manual + [`/deploy-check`](../../../commands/deploy-check.md) |
| Migration (schema change to existing table) | — | — | — | — | — | yes | yes | — | manual |
| Cron / scheduled routine | yes | — | — | — | yes | — | — | — | manual |
| Trio agent / Paperclip routine | yes | — | — | — | yes | — | — | optional | manual + audit log |
| AI prompt change | — | — | — | — | yes | — | — | yes | `testing-strategy` |
| Pure refactor (no behavior change) | re-run existing | re-run existing | re-run existing | re-run existing | — | — | — | — | — |
| Docs only | — | — | — | — | — | — | — | — | — |

Legend: `yes` = required, `optional` = if AC names it, `—` = not applicable.

---

## Tools

| Tool | Use for | Config |
|------|---------|--------|
| Vitest | Unit, component, hook, integration | [vitest.config.ts](../../../../vitest.config.ts) |
| React Testing Library | Component DOM assertions | bundled with Vitest setup |
| `@testing-library/user-event` | User interactions in component tests | preferred over `fireEvent` |
| `renderHook` | Hook tests | from `@testing-library/react` |
| Playwright | E2E browser tests | [playwright.config.ts](../../../../playwright.config.ts) |
| `supabase functions invoke` | Edge function smoke | CLI |
| Supabase MCP execute_sql | Migration / RLS smoke | `mcp__ed3787fc…__execute_sql` |
| AI eval fixture | Prompt-change comparison | `tasks/evals/<agent>/cases.json` (convention) |

---

## Required gates (every task)

```
[ ] npm run lint
[ ] npm run test
[ ] npm run build
[ ] Manual smoke per testing.md §Smoke-test workflow
```

These are independent of the matrix above. They run on every task regardless of change shape.

---

## When to skip

| Skip | Justification required in prompt |
|------|--------------------------------|
| Component test for a one-off layout wrapper | "No logic; visual only; covered by Playwright snapshot at /<route>." |
| E2E for a single-component change | "Component tests cover all branches; no cross-page interaction changed." |
| RLS test for a public-read table | "Table is public-read by design (apartments listing); RLS policy is `true` and reviewed." |
| Eval set for a prompt typo fix | "Whitespace-only change; behavior unchanged." |

Every skip needs an inline justification in the prompt's Verification section.

---

## Specialist skill routing

| Need | Skill |
|------|-------|
| React + JSDOM + Vitest patterns, mocking, snapshots | [`testing` — vitest.md](../testing/vitest.md) |
| Playwright config, selectors, network mocking, fixtures | [`testing` — playwright.md](../testing/playwright.md) |
| Designing what to test for a new feature | [`testing` — testing-strategy.md](../testing/references/testing-strategy.md) |
| Pre-ship gate verification | [`/deploy-check`](../../../commands/deploy-check.md) **full** |
| Browser preview / live-page debug | [`testing` — preview-mcp.md](../testing/preview-mcp.md) |

For workflow detail, see [../testing.md](../testing.md).
