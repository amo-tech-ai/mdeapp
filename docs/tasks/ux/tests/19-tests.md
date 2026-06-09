For PR #19 (`feat(search): MIS rental + event hybrid search`), run a full forensic verification and production-readiness audit before merge.

Requirements:

* review all changed files first
* use relevant Claude skills + MCP docs verification
* verify against official docs for Supabase, Mastra, CopilotKit, Maps, and search/ranking behavior
* keep scope focused to PR #19 only
* no architecture redesign or unrelated refactors

Verification steps:

1. Static validation

* npm run lint
* npm run typecheck

2. Full test suite

* npm test

3. Targeted PR #19 verification

* rental hybrid search behavior
* event hybrid search behavior
* INT-002 parser behavior
* ranking consistency
* fallback behavior
* grounding/search degradation handling
* sanitized query/filter handling
* search result determinism

4. Runtime/smoke verification

* verify concierge routing works correctly
* verify no hallucinated geo/place data
* verify Supabase fallback behavior
* verify map/result synchronization
* verify logs and telemetry do not expose unsafe PII
* verify no breaking overlap with PR #18 or PR #17

5. Worktree / PR discipline

* confirm branch is focused and mergeable
* identify mixed concerns or oversized changes
* identify hidden blockers or technical debt
* verify clean git state and no accidental files

Return:

* exact commands run
* tests passed/failed
* critical blockers
* red flags
* remaining risks
* merge readiness %
* recommended merge order between PR #17 / #18 / #19
* concise forensic audit summary
