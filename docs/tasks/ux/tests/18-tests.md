After applying all fixes, run a full forensic verification pass for PR #18.

Requirements:

* use relevant Claude skills + MCP docs verification
* verify against official docs before changing behavior
* do not expand scope beyond existing CodeRabbit issues

Run and verify:

1. Static validation

* npm run lint
* npm run typecheck

2. Full tests

* npm test

3. Targeted tests

* intent-slots tests
* intelligent restaurant search tests
* fallback behavior tests
* query-embedding failure tests
* neighborhood escaping tests
* June label tests

4. Smoke verification

* npm run smoke:golden-queries
* verify tsx --env-file works correctly
* verify .env.local loads correctly

5. Runtime verification

* confirm intelligent search degrades safely on embedding/API/network failure
* confirm curated fallback activates correctly
* confirm sanitized neighborhood input does not break PostgREST filters
* confirm logs use filtered/final counts
* confirm PII minimization works correctly

6. PR discipline

* keep commits focused
* no unrelated refactors
* verify worktree cleanliness
* verify no accidental architecture drift

Return:

* exact commands run
* tests passed/failed
* screenshots/logs if relevant
* remaining risks
* merge readiness %
* recommended next step
