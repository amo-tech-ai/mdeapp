Use this Cursor prompt:

```text
Act as a senior software specialist, forensic auditor, and QA engineer.

Run a full implementation test of the Medellín Intelligence System.

Goal:
Verify that the intelligent Medellín features are actually implemented, working, tested, logged, grounded, and production-safe.

Use:
- MCP tools
- Supabase MCP live DB
- Chrome DevTools MCP
- Playwright MCP
- Mastra skills/docs
- project skills
- local repo evidence
- browser E2E
- official docs when needed

Review:
- tasks/mastra/MIS-TASKS-INDEX.md
- tasks/mastra/progress-mastra.md
- tasks/mastra/audit/MIS-MASTRA-AUDIT-2026-05-30.md
- tasks/data/evidence/MIS-M1-2026-06-01.md
- tasks/intelligence/intelligence-plan.md
- tasks/data/tasks-data/
- mdeapp/src/mastra/
- mdeapp/src/mastra/tools/
- mdeapp/src/mastra/lib/
- mdeapp/src/app/
- supabase/migrations/

Verified task state:
- SEARCH-003 → Done
- MASTRA-MIS-001 → Done
- SEARCH-001 → Phase 1b
- SEARCH-002 → Phase 1b
- AI-003 → Phase 1b
- AI-004 → Phase 1b
- DATA-046 → Phase 1b

Test intelligent user journeys:

1. Restaurant intelligence
Query:
quiet rooftop Provenza
Verify:
- hybrid restaurant search used
- venue_signals joined
- rank explanation shown
- evidence shown
- cards render
- map pins render
- search_logs row written

2. Rental intelligence
Query:
digital nomad rental Laureles near cafes and gyms
Verify:
- current path works
- rental_signals exist
- identify if SEARCH-001 is still missing
- confirm whether hybrid rental ranking is implemented or not

3. Event intelligence
Query:
salsa this weekend in Medellín
Verify:
- event search works
- event_signals exist
- identify if SEARCH-002 is still missing
- confirm whether hybrid event ranking is implemented or not

4. Cafe / coworking intelligence
Query:
cafe with strong Wi-Fi in Laureles
Verify:
- correct tool path
- ADK/Places fallback if needed
- cards render
- map pins render
- grounding is present
- identify missing venue_anchors hybrid path

5. Neighborhood intelligence
Query:
compare Poblado vs Laureles for remote work
Verify:
- neighborhood_profiles exist
- response uses real data
- no hallucinated neighborhood claims
- identify missing compare UI if any

6. Multi-step Medellín plan
Query:
plan dinner, salsa, and a nearby place to stay in Provenza
Verify:
- current system behavior
- identify if this is correctly deferred
- confirm no fake itinerary workflow is shipped too early

Run tests:
- npm run verify:mis-phase1
- npm run smoke:golden-queries
- npm run test -- intent-slots intelligence-restaurant search-restaurants
- npm run typecheck
- npm run check:mastra
- Playwright browser E2E for the main queries
- Chrome DevTools network inspection for tool calls and errors

Supabase live checks:
- migrations aligned
- venue_signals row count
- event_signals row count
- rental_signals row count
- neighborhood_profiles row count
- venue_source_evidence rows
- search_logs writes
- RLS policies
- duplicate HNSW indexes removed
- embedding_jobs table
- query_embedding_cache exists or is still missing

Mastra checks:
- conciergeAgent is sole production chat path
- tools handle retrieval
- LLM only explains
- workflows are not primary chat path
- no supervisor/A2A/ACP misuse
- no LLM-as-ranker
- no Phase 2 architecture creep
- working memory is used correctly
- structured output is used where needed
- background tasks are only used for embeddings/signals

Audit for:
- implementation gaps
- broken features
- red flags
- blockers
- routing bugs
- stale docs
- stale Linear states
- schema drift
- migration drift
- RLS risks
- latency issues
- hallucination risks
- evidence gaps
- logging gaps
- map/card rendering issues
- missing tests
- missing Supabase tables
- missing Mastra tools

Generate report:
1. Executive verdict
2. Percent implemented
3. Percent production-ready
4. What works now
5. What is partially live
6. What is missing
7. Critical blockers
8. Red flags
9. Supabase verification
10. Mastra verification
11. Playwright/Chrome E2E results
12. Test output summary
13. Best-practice gaps
14. Suggested Supabase additions
15. Suggested Mastra additions
16. Suggested CopilotKit UX fixes
17. Suggested Linear updates
18. Exact next 10 implementation tasks
19. Files to modify next
20. Final go/no-go verdict

Important rules:
- Do not redesign architecture.
- Do not start Phase 2.
- Do not create supervisor agents.
- Do not create A2A/ACP.
- Do not build relationship graph.
- Do not build unified venues migration.
- Do not use LLM as source of truth.
- Keep SQL/hybrid first.
- Keep ADK as fallback/grounding only.
- Preserve fast paths.
- Mark features honestly:
  - implemented
  - partially live
  - missing
  - deferred

Focus:
- Medellín intelligence implementation
- rentals
- restaurants
- cafes
- events
- tours
- gyms
- neighborhoods
- maps
- cards
- evidence
- search logs
- latency
- production readiness
```CREATE UPDATE PROGRESS CHANGE LOG TODO SUGGEST NEXT TASKS
@tasks/intelligence/audit 