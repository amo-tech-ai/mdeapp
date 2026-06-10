# MIS release audit prompt (canonical)

Use when splitting MIS WIP before PR.

```text
You are Claude Code acting as a senior forensic auditor and release engineer.

Goal:
Safely separate MVP-ready MIS search improvements from post-MVP infrastructure work.

Critical rules:

* Do NOT mix MIS work into PR #16
* Do NOT create a mega-PR
* Do NOT expand MVP scope
* Do NOT add roadmap/docs cleanup
* Keep PR A mergeable and reviewable

Current issue:
MIS multi-vertical WIP is mixed into the UX-002/005 branch.

Task:

1. Finish PR #16 independently.
2. Create new branch from latest main:
   feat/mis-multi-vertical-search
3. Cherry-pick ONLY Bucket A files:

   * INT-002
   * SEARCH-001
   * SEARCH-002
   * rankExplanation UI
   * queryText wiring
   * golden smoke updates
   * related tests
4. Exclude Bucket B:

   * embeddings
   * cache
   * workers
   * cron
   * grounding verifier
   * migration-only infra

Before PR:

* fix stale rental rankExplanation bug
* verify event hybrid path in real browser flow
* verify no raw JSON leaks
* verify map/card sync
* verify no console errors

Run:

npm run verify:mis-phase1
npm run smoke:golden-queries
npm run test -- src/mastra/lib src/mastra/tools src/lib
npm run typecheck
npm run check:mastra
npm run floor

Browser proof:

1. digital nomad rental Laureles
2. salsa this weekend
3. Wi-Fi cafe Laureles
4. dinner + nightlife Provenza

Required output:

* verdict
* score
* exact Bucket A commit list
* exact Bucket B defer list
* blockers
* fixes
* tests
* browser proof
* PR recommendation

Do not commit Bucket B yet.
```

Skills: `mde-worktree-pr-flow`, `task-verifier`, `mde-task-lifecycle` (see `docs/index-skills.md`).
