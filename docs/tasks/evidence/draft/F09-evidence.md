# F09 evidence — 2026-05-20

> Vitest + `floor` script shipped. Test count: **0 → 4**. All 5 gates pass. Localhost backfilled 2026-05-20 per new "localhost proof required" rule.

## Acceptance tests

| # | Test | Result |
|---|---|---|
| T1 | `vitest` in devDependencies | ✅ `^4.1.6` |
| T2 | `@vitest/coverage-v8` in devDependencies | ✅ `^4.1.6` |
| T3 | `vitest.config.ts` exists with `@/*` alias | ✅ |
| T4 | `package.json scripts.floor` chains 5 gates | ✅ `npm run lint && npm run typecheck && npm run build && npm test && npm run audit` |
| T5 | `npm test` exits 0 with ≥ 4 passing | ✅ `Test Files 1 passed (1) · Tests 4 passed (4) · 532ms` |
| T6 | `npm run floor` exits 0 | ✅ all 5 gates green |
| T7 | `lint` + `typecheck` scripts present | ✅ |
| T8 | `verify-floor.md` references `npm run floor` | ✅ |

## Negative test (Tn1)

Injected `expect(1).toBe(2)` into a temp test file:
```
Test Files  1 failed | 1 passed (2)
Tests       1 failed | 4 passed (5)
```
Gate caught the deliberate failure. Reverted → green again.

## Files changed in mdeapp/

- `package.json` — +6 scripts (`lint`, `typecheck`, `test`, `test:watch`, `test:coverage`, `floor`); +5 devDeps (`vitest@^4.1.6`, `@vitest/coverage-v8@^4.1.6`, `eslint@^9.39.4`, `eslint-config-next@^16.2.6`, `@eslint/eslintrc@^3.3.5`)
- `vitest.config.ts` — NEW, `resolve.alias: { '@': './src' }` + node env + globals
- `eslint.config.mjs` — NEW, flat config extending `eslint-config-next/{core-web-vitals,typescript}` (Next 16 removed `next lint`)
- `src/__tests__/smoke.test.ts` — NEW, 4 tests: mastra agent registry, pingAgent id, MdeState schema accept + reject
- `src/mastra/agents/index.ts` — +1 `@ts-expect-error` line documenting `@mastra/memory@beta` ↔ `@mastra/core@beta` type drift

## Beta-drift / Next 16 traps surfaced

| Trap | Resolution |
|---|---|
| Next 16 dropped `next lint` | Migrated to ESLint flat config + `eslint-config-next` |
| ESLint 10 breaks `eslint-plugin-react` | Pinned to ESLint 9.39.4 |
| `@mastra/memory@beta` Memory type vs `@mastra/core@beta` MastraMemory | One-line `@ts-expect-error` with rationale comment |

## Localhost runtime proof (new rule — 2026-05-20)

Full transcript in [`localhost-smoke-2026-05-20.md`](localhost-smoke-2026-05-20.md). Summary:

- `GET http://localhost:3001/` → **HTTP 200** · 43,756 bytes · `<title>mdeai — concierge for Medellín`
- `POST http://localhost:3001/api/copilotkit` → **HTTP 400** with structured error (endpoint alive, parsing requests, rejecting malformed input)
- `GET http://localhost:4111/` (Mastra Studio) → **HTTP 200**

F09's additions (Vitest + ESLint flat config + `@ts-expect-error` suppression) did not regress the dev server. Boot time still <1s for Next.js Turbopack + ~1s for Mastra.

## Anti-fake-done checklist (9 gates — gate 9 added 2026-05-20)

| # | Gate | Status |
|---|---|---|
| 1 | Implementation on disk | ✅ |
| 2 | Tests pass | ✅ 4/4 in 532ms |
| 3 | Build passes | ✅ |
| 4 | Lint passes | ✅ |
| 5 | INDEX matches frontmatter status | ✅ |
| 6 | Evidence file exists | ✅ this file |
| 7 | No open blocker | ✅ |
| 8 | External verification | N/A (F09 has no external surface) |
| **9** | **Localhost runtime proof** | ✅ backfilled — see localhost-smoke-2026-05-20.md |

## Notes

- Test count baseline for PRD goal 6 ("≥ 90 by end of Phase 1"): W2 start = 0 → after F09 = 4. Each F13–F20 port should add 3–5 tests.
- `floor` is the canonical 5-gate command; `/verify-floor` slash command delegates to it.
- Optional shell helpers (`mdeapp/scripts/mastra-smoke.sh`, `verify-env-security.mjs`) remain deferred — spec marked them as optional.
- 2 moderate postcss CVEs (transitive via Next 16.2.6) tracked but not high-severity; `--audit-level=high` keeps the gate green.
