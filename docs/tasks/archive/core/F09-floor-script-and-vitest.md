---
id: F09
title: `floor` npm script + first Vitest smoke test
status: Done
completed_at: 2026-05-20
priority: P1
phase: W2 — Day 1 (foundation for all W2-W10 tests)
effort: 2h (script + vitest port from my-mastra-app + 1 smoke test)
owner: claude
depends_on: [F06]
skill: [testing, mde-task-lifecycle]
evidence: /home/sk/mdeai/tasks/notes/F09-evidence.md
verified_against:
  - /home/sk/mdeai/plan/prd/01-foundation.md §3 goal 6 ("Test count ≥ 90 in mdeapp by end of Phase 1; starts at 0")
  - /home/sk/mdeai/plan/05-path-a-mastra-migration.md (W2 row 1 — Vitest floor)
  - /home/sk/mde/my-mastra-app/vitest.config.ts (9 lines — source)
  - /home/sk/mde/my-mastra-app/scripts/mastra-smoke.sh
---

# F09 — `floor` npm script + first Vitest smoke test

## 1. Purpose

Phase 1 goal 6 says **test count ≥ 90 in `mdeapp` by end of Phase 1, starting at 0**. F09 is the bedrock: install Vitest, port the proven `vitest.config.ts` from `my-mastra-app`, write the first smoke test, and add a `floor` npm script that runs the standard pre-commit checks (lint + build + tsc + test + audit). F09 is the foundation every W3-W9 port (F13-F20) writes tests against.

## 2. Goals

- `vitest` + `@vitest/coverage-v8` in `devDependencies`
- `vitest.config.ts` at `mdeapp/` root — ported from `/home/sk/mde/my-mastra-app/vitest.config.ts`
- `npm test` runs Vitest in single-run mode; `npm run test:watch` watches
- `mdeapp/src/__tests__/smoke.test.ts` exists with **1+ passing test** (test count goes from 0 → 1+)
- `npm run floor` script chains: `npm run lint && npm run typecheck && npm run build && npm test && npm run audit` (matches §4 step 4 + `package.json` — typecheck runs early to fail fast before the slower build)
- `npm run floor` exits 0 on a clean tree (passes acceptance gate before any commit)
- `.claude/commands/verify-floor.md` (already exists from earlier W1 setup) is wired to call `npm run floor`

## 3. Features (what the user gets)

- **Sofía (dev):** `npm run floor` is the single command to gate any commit. CI later mirrors it. Tests count starts at 1, grows with each F13+ port.
- **Lucía (QA):** can run `npm test -- --coverage` to see what's covered

## 4. Workflows

1. **Pre-flight (per `testing` skill):**
   - Read `mde-task-lifecycle` skill Phase 4 (test) — every task ships ≥ 1 test
   - Confirm Node ≥ 20 (Next.js 16 requirement) — already verified at F05

2. **Install Vitest:**
   ```bash
   cd mdeapp && npm install --save-dev vitest @vitest/coverage-v8
   ```

3. **Port `vitest.config.ts` from my-mastra-app + add `@/*` alias:**
   ```ts
   // mdeapp/vitest.config.ts
   import { defineConfig } from 'vitest/config';
   import path from 'node:path';
   export default defineConfig({
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
     test: {
       environment: 'node',
       globals: true,
       include: ['src/**/*.{test,spec}.ts', 'src/**/*.{test,spec}.tsx'],
     },
   });
   ```
   (Legacy config is `.ts` only and has no `@/*` alias — the alias is **required** because the smoke test imports `@/mastra` and `@/mastra/agents`. Tailwind v4 / tsconfig paths are not enough on their own — Vitest needs its own `resolve.alias`. The `.tsx` include is added so component tests can land in W3+.)

4. **Update `package.json` `scripts`:**
   ```json
   {
     "scripts": {
       "test": "vitest run",
       "test:watch": "vitest",
       "test:coverage": "vitest run --coverage",
       "lint": "next lint --quiet --max-warnings 0",
       "typecheck": "tsc --noEmit",
       "floor": "npm run lint && npm run typecheck && npm run build && npm test && npm run audit"
     }
   }
   ```
   (`floor` runs all 5 gates. Fails fast on first error.)

5. **Write the first smoke test** at `mdeapp/src/__tests__/smoke.test.ts`:
   ```ts
   import { describe, it, expect } from "vitest";
   import { mastra } from "@/mastra";
   import { pingAgent, MdeState } from "@/mastra/agents";

   describe("mdeapp smoke", () => {
     it("mastra instance has pingAgent registered", () => {
       expect(mastra.getAgentById("ping-agent")).toBeDefined();
     });
     it('pingAgent id is "ping-agent"', () => {
       expect(pingAgent.id).toBe("ping-agent");
     });
     it("MdeState schema accepts the canonical shape", () => {
       const parsed = MdeState.parse({ lastQuery: "", hint: "" });
       expect(parsed.lastQuery).toBe("");
       expect(parsed.hint).toBe("");
     });
     it("MdeState schema rejects non-object input", () => {
       expect(() => MdeState.parse(null)).toThrow();
     });
   });
   ```
   (4 tests for the count.) **Note the 2 beta-correct departures from earlier drafts:**
   - `mastra.getAgentById("ping-agent")` — beta `Mastra` exposes `.getAgentById()` / `.listAgents()`; there is **no public `.agents` property**. The earlier `mastra.agents.pingAgent` form would TypeError at runtime.
   - `MdeState.parse(null)` instead of `MdeState.parse({ wrong: "shape" })` — by default Zod object schemas **strip unknown keys**, so the spurious-key input does **not** throw (returns `{lastQuery:"", hint:""}`). `null` is a real non-object that genuinely fails the schema. If you want unknown-key rejection too, add `.strict()` to the schema definition (Phase 2 hygiene, not W2).

6. **Port smoke shell scripts** (low-priority but useful) from `my-mastra-app/scripts/`:
   - `mastra-smoke.sh` (boot + curl test)
   - `verify-env-security.mjs` (env var sanity)
   Both go under `mdeapp/scripts/`.

7. **Run `npm run floor` once** — expect exit 0.

## 5. User journeys

- **Sofía:** before every commit runs `npm run floor` → confirms 5 gates pass → commits
- **Future Claude session:** before any F-task is marked Done, runs `npm run floor` (gate enforced by hook + by task spec acceptance criteria)

## 6. Agents

None — pure tooling.

## 7. Integrations

| Integration | Purpose |
|---|---|
| `vitest@latest` | Test runner (Vite-native, fast) |
| `@vitest/coverage-v8` | Coverage via V8 |
| Next.js `next lint` | ESLint |
| `tsc --noEmit` | Type check |
| `npm audit --audit-level=high` | CVE check (already wired in F01b) |

## 8. Summary

Install Vitest, port `vitest.config.ts` from legacy, write 4 smoke tests, add `npm run floor` script chaining lint+typecheck+build+test+audit. It helps every future port (F13-F20) ship with verification. We'll know it worked when `npm run floor` exits 0 and `npm test` shows ≥ 4 passing.

## 9. Definition of Done

- [x] `vitest` + `@vitest/coverage-v8` in `devDependencies` — `^4.1.6`
- [x] `mdeapp/vitest.config.ts` exists matching legacy shape — with added `@/*` alias (per audit 05 patch #3)
- [x] `package.json scripts.test`, `test:watch`, `test:coverage`, `lint`, `typecheck`, `floor` all present
- [x] `mdeapp/src/__tests__/smoke.test.ts` exists with ≥ 4 passing tests (4 tests in 532 ms)
- [x] `npm test` exits 0 with ≥ 4 tests passing
- [x] `npm run floor` exits 0 on the current tree
- [ ] `mdeapp/scripts/{mastra-smoke.sh,verify-env-security.mjs}` ported (optional — deferred to W3 when first agent ports need them)
- [x] `.claude/commands/verify-floor.md` references `npm run floor`

## 10. Tests

### Acceptance tests (automated)

| # | Test | Command | Expected |
|---|---|---|---|
| T1 | vitest installed | `node -p "require('./package.json').devDependencies.vitest"` | non-empty |
| T2 | coverage installed | `node -p "require('./package.json').devDependencies['@vitest/coverage-v8']"` | non-empty |
| T3 | vitest.config exists | `test -f vitest.config.ts && echo OK` | `OK` |
| T4 | floor script exists | `node -p "require('./package.json').scripts.floor"` | non-empty |
| T5 | smoke test exists + ≥4 tests | `npm test 2>&1 \| grep -oE '[0-9]+ passed' \| head -1` | `4 passed` (or more) |
| T6 | npm run floor green | `npm run floor 2>&1 \| tail -3` | exit 0 |
| T7 | lint script exists | `node -p "require('./package.json').scripts.lint"` | non-empty |
| T8 | typecheck script exists | `node -p "require('./package.json').scripts.typecheck"` | non-empty |

### Negative tests

| # | Inject | Expected |
|---|---|---|
| Tn1 | Add a deliberate `expect(1).toBe(2)` in smoke.test.ts | T5 fails — confirms tests actually run |
| Tn2 | Add a syntax error in a `.ts` file under `src/` | T6 fails (lint or typecheck step) — confirms floor gate |

### Evidence to capture in `tasks/notes/F09-evidence.md`

- `npm test` output (showing N passing)
- `npm run floor` output (showing all 5 gates green)
- Test count: `0 → N` (the W1 → W2 baseline for PRD goal 6)

## Notes / verification

- **Per `testing` skill:** Vitest is the chosen runner (not Jest). Coverage via V8 only (not c8 — faster).
- **PRD goal 6:** mdeapp starts at 0 tests. F09 = 4. Each F13-F20 port adds 3-5 tests. By end of Phase 1, expect ≥ 90.
- **Defer to W3+:** Playwright e2e (per `testing` skill — uses `mcp__playwright-test__*`). E2E lives separately at `mdeapp/playwright/` not `mdeapp/src/__tests__/`.
- **Hook integration:** the existing `lint-edited-ts.mjs` + `typecheck-edited-ts.mjs` hooks fire on Edit; F09's `floor` is the human-driven full-tree gate.
