---
id: F20
title: Port evaluationAgent + scorers + Vercel deploy prep
status: Not Started
priority: P1
phase: W8-W9 — observability + deployment
effort: 2h evaluation + 1h scorers + 1h Vercel prep
owner: claude
depends_on: [F19-concierge-and-restaurants-attractions]
skill: [mastra, mde-vercel, testing, copilotkit-integrations]
integration_pattern: in-process
observability_note: ai_runs (F13) + optional mastra_ai_spans via @mastra/observability PgStore — defer spans to post-F20 unless blocked
copilotkit_docs:
  - https://docs.copilotkit.ai/mastra/copilot-runtime
  - https://docs.copilotkit.ai/mastra/ag-ui
  - https://docs.copilotkit.ai/mastra/inspector
verified_against:
  - https://mastra.ai/guides/build-your-ui/copilotkit (bundler.externals only if mastra build — not next build)
master_plan: /home/sk/mdeai/plan/05-path-a-mastra-migration.md
source_files:
  - /home/sk/mde/my-mastra-app/src/mastra/agents/evaluation.ts
  - /home/sk/mde/my-mastra-app/src/mastra/scorers/weather-scorer.ts (PATTERN ONLY — not literal copy)
  - /home/sk/mde/my-mastra-app/scripts/fix-vercel-build.cjs (DEFERRED reference)
target_files:
  - mdeapp/src/mastra/agents/evaluation.ts
  - mdeapp/src/mastra/scorers/index.ts (NEW — write fresh mdeai scorers based on legacy pattern)
  - mdeapp/scripts/fix-vercel-build.cjs (only if needed)
---

# F20 — Port evaluationAgent + scorer patterns + Vercel deploy prep

## 1. Purpose

Closes Phase 1 observability + deployment:
- **evaluationAgent** — scoring/eval helper (per PRD §13 "evaluation reused")
- **3 scorers** — written fresh based on legacy `weather-scorer.ts` pattern: `toolCallAppropriatenessScorer`, `completenessScorer`, `translationScorer`
- **Vercel build script** — only needed if migrating to `mastra build` (we use `next build`; defer unless required)

**API risks (probe before coding):**

1. **`@mastra/evals`** — separate package; likely **not** in mdeapp beta lockfile. If `npm ls @mastra/evals` empty → defer all scorers; document in evidence.
2. **`mastra_ai_spans`** — 932 rows from legacy Mastra Postgres store; mdeapp uses LibSQL `:memory:` today. **PostgresStore is owned by [MASTRA-003](../../mastra/MASTRA-003-postgres-storage.md)** — F20 documents scorers + deploy prep only; do not duplicate storage migration here.

## 2. Goals

- `evaluationAgent` registered (used by future eval workflows, not user-facing yet)
- 3 scorers exported from `mastra/scorers/index.ts`
- `mastra/index.ts` registers all 3 scorers via `scorers: { ... }`
- Evidence: 1 scorer dry-run on a sample agent run returns 0..1 score
- `fix-vercel-build.cjs` referenced (deferred unless we run `mastra build`)

## 3. Source files — adapt + rewrite

| Source | Approach |
|---|---|
| `agents/evaluation.ts` | Port + verify `@mastra/evals` compatibility |
| `scorers/weather-scorer.ts` | **Pattern reference only** — rewrite as mdeai scorers (one file with 3 named exports for tool-call/completeness/translation) |
| `scripts/fix-vercel-build.cjs` | **Defer** — read only, document the externals pattern in W9 deployment task |

## 4. Workflow

1. **Pre-flight (Mastra MCP):**
   - `mcp__mastra__listMastraPackages` — check if `@mastra/evals` listed
   - `mcp__mastra__searchMastraDocs("@mastra/evals scorer")` — confirm scorer API
   - If absent, set `EVALS_AVAILABLE=false` and skip scorers (defer to Phase 2)

2. **Port `evaluation.ts`** — verbatim with model swap (Gemini)

3. **Write fresh `mastra/scorers/index.ts`:**
   ```ts
   // Based on legacy weather-scorer.ts pattern — rewritten for mdeai
   import { createScorer } from '@mastra/evals'; // verify
   
   export const toolCallAppropriatenessScorer = createScorer({
     id: 'tool-call-appropriateness',
     description: 'Did the agent call the right tool for the user intent?',
     evaluate: async ({ input, output, agent }) => {
       // 0..1 score — heuristic or LLM-judge
     },
   });
   
   export const completenessScorer = createScorer({ /* ... */ });
   export const translationScorer = createScorer({ /* ... */ });
   ```

4. **Register in mastra/index.ts:**
   ```ts
   import { evaluationAgent } from './agents/evaluation';
   import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers';
   export const mastra = new Mastra({
     agents: { /*...*/, evaluationAgent },
     scorers: { toolCallAppropriatenessScorer, completenessScorer, translationScorer },
     // ...
   });
   ```

5. **Vercel prep (defer unless blocked):**
   - Read `scripts/fix-vercel-build.cjs` for documentation
   - If `vercel deploy` fails due to Mastra bundling, port the fix script + add `bundler.externals: ['@copilotkit/runtime']` to Mastra constructor (per Mastra-side official docs guide)

## 5. API drift adjustments

| Risk | Check | Mitigation |
|---|---|---|
| `@mastra/evals` package absent in beta | Mastra MCP | Defer all 3 scorers to Phase 2; evaluationAgent skipped or runs without scoring |
| `createScorer` API renamed/refactored | Mastra MCP | Adapt; worst case write inline scorer functions |
| Vercel build doesn't need `fix-vercel-build.cjs` (we use `next build`) | n/a | Skip entirely |

## 6. Tests

**Vitest:**
- `evaluationAgent.id === 'evaluation-agent'` (or current convention)
- Each scorer returns numeric value in [0, 1] for sample input
- Scorers don't throw on missing fields

**Integration:**
- Run a previous F14-F19 agent call; pass output through `toolCallAppropriatenessScorer`; assert score recorded
- Verify scorer output logged to test stdout or `ai_runs.metadata.score` — no `mastra_scorers` table in schema

## 7. Acceptance criteria

- [ ] `evaluation.ts` ported (or deferred with rationale if `@mastra/evals` missing)
- [ ] 3 scorers exported from `scorers/index.ts` (or deferred)
- [ ] `mastra/index.ts` registers them
- [ ] Build / lint / tsc green
- [ ] 3+ new Vitest tests pass
- [ ] First scorer run produces a score 0..1
- [ ] Vercel prep documented OR confirmed-unnecessary in `tasks/notes/F20-vercel-prep-decision.md`

## 8. Rollback

`git revert HEAD` removes evaluation + scorers + index registration. App still works via F13-F19.

## 9. Definition of Done

All ACs pass. Commit: `feat(mastra): port evaluationAgent + 3 scorers + Vercel deploy prep notes (F20)`.

## Optional follow-on (post-W9)

- `mastra_ai_spans` daily P95 rollup cron (per Supabase audit §10b)
- Sentry SDK wiring in `mdeapp/src/instrumentation.ts`
- These are W8 production-readiness tasks separate from F20.
