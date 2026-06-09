Connect to GitHub PR #20 and run a full forensic verification before merge.

PR:
https://github.com/amo-tech-ai/mdeapp/pull/20

Goals:

* verify PR #20 works correctly
* verify no regression to PR #17/#18/#19
* verify vector/embedding changes are production-safe
* verify scope is manageable and not overengineered

Requirements:

* use GitHub/gh to inspect PR #20
* checkout PR locally
* review all changed files before modifying anything
* use relevant Claude skills + MCP official docs
* verify against official docs for:

  * Supabase pgvector/vector search
  * Gemini embeddings
  * Mastra search orchestration
  * CopilotKit integration
  * Next.js runtime behavior
* keep scope limited to PR #20 only
* no unrelated refactors
* no architecture redesign

Start with:

```bash
cd /home/sk/mdeai/mdeapp
gh pr checkout 20
git status
gh pr view 20 --comments --review-comments
gh pr diff 20 --name-only
```

Run verification:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Targeted verification:

* embedding/vector generation works correctly
* fallback behavior works if embeddings fail
* no crashes on network/API failures
* vector dimensions are validated correctly
* search ranking remains deterministic enough for tests
* no hallucinated geo/place data
* pgvector/Supabase queries are safe and sanitized
* no unsafe logging or PII leakage
* no performance regressions
* no duplicate embedding generation
* no overlap/conflict with PR #17/#18/#19

Runtime verification:

* verify local search flows still work
* verify restaurant/rental/event search still returns expected results
* verify vector fallback paths work correctly
* inspect browser console and server logs for runtime errors

PR discipline:

* confirm PR is focused and manageable
* identify oversized or mixed-scope changes
* identify hidden blockers
* verify clean worktree
* recommend merge order for PR #17 → #18 → #19 → #20

Return:

* exact commands run
* files reviewed
* tests passed/failed
* runtime proof
* blockers/red flags
* remaining risks
* merge readiness %
* recommended next step
