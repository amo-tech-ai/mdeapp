Copy/paste this into Cursor:

````md
You are a senior software specialist, forensic auditor, and systems architect.

Project path: `/home/sk/mdeai/`

Goal: implement a testing audit progress tracker and update:
- `/home/sk/mdeai/tasks/progres.md`
- `/home/sk/mdeai/tasks/INDEX.md`
- `/home/sk/mdeai/todo.md`
- `/home/sk/mdeai/changelog`

Do not mark anything complete unless verified with evidence.

## Step 1 — Examine project truth

Read these first:
- `CLAUDE.md`
- `mvp.md`
- `advanced.md`
- `plan.md`
- `tasks/progres.md`
- `tasks/INDEX.md`
- `todo.md`
- `changelog`
- `tasks/MVP-REQUIRED.md`
- `tasks/maps/INDEX.md`
- `tasks/events/events-roadmap.md`
- `tasks/real-estate/real-estate-prd.md`
- `tasks/trips/trips-plan.md`
- `tasks/venues/prd-venues.md`

Also inspect:
- `mdeapp/package.json`
- `mdeapp/src/app`
- `mdeapp/src/components`
- `mdeapp/src/mastra`
- `mdeapp/src/platform`
- `mdeapp/src/app/api`
- `mdeapp/e2e`
- `mdeapp/src/**/*.test.ts`
- `mdeapp/src/**/*.test.tsx`
- `supabase/functions`
- `supabase/migrations`

## Step 2 — Run verification tests

From `/home/sk/mdeai/mdeapp`, run:

```bash
npm run lint
npm run test
npm run build
npm run floor
npm run verify:maps || true
npm run verify:mastra || true
````

Then check available Playwright tests:

```bash
find e2e -type f | sort
```

Run key smoke tests if available:

```bash
npx playwright test e2e --reporter=line
```

If a command fails, capture:

* exact command
* exit code
* short error summary
* affected task/system
* fix recommendation

## Step 3 — Audit major systems

Evaluate each area with proof:

| Area           | What to verify                                                     |
| -------------- | ------------------------------------------------------------------ |
| Core app       | Next.js app boots, routes load, build passes                       |
| CopilotKit     | `/api/copilotkit` exists and runtime works                         |
| Mastra         | agents/tools/workflows exist and are wired                         |
| Gemini         | model usage, structured outputs, function/tool calling             |
| Supabase       | migrations, RLS, indexes, edge functions, schema drift             |
| pgvector       | embeddings tables, search path, vector indexes                     |
| Maps           | vis.gl, MapContext, AdvancedMarker, mapId, pin sync                |
| Places API New | field masks, place details, cache/proxy                            |
| Grounding      | ADK/Grounding Lite, citations, attribution, quota logs             |
| Events         | event detail, host wizard, checkout, webhook, wallet QR            |
| Rentals        | rental search, cards, lead capture, schedule viewing               |
| Venues         | cafes/restaurants/nightlife cards, detail panels, booking requests |
| Trips          | trips dashboard, saved places, itinerary, trip items               |
| Auth           | login/signup, OAuth, protected routes, RLS isolation               |
| Automations    | OpenClaw, WhatsApp, Postiz, approval gates                         |
| Testing        | Vitest, Playwright, smoke scripts, production proof                |
| Production     | Vercel, env vars, prod smoke, mdeai.co                             |

## Step 4 — Create/update progress tracker

Update `/home/sk/mdeai/tasks/progres.md` with this format:

```md
# mdeai Testing Audit Progress Tracker

Updated: YYYY-MM-DD
Auditor: Cursor
Scope: /home/sk/mdeai

## Executive Score

| Area | Score | Status |
|---|---:|---|
| Overall MVP readiness | __/100 | 🟡 |
| Production readiness | __/100 | 🟡 |
| Testing coverage | __/100 | 🟡 |
| AI/Mastra readiness | __/100 | 🟡 |
| Supabase readiness | __/100 | 🟡 |
| Maps/Grounding readiness | __/100 | 🟡 |

## Status Legend

- 🟢 Complete — verified and tested
- 🟡 In Progress — partially working
- 🔴 Blocked / Failed — critical issue
- ⚪ Not Started — planned but missing

## Progress Tracker

| Task Name | Description | Status | % Complete | Confirmed Evidence | Missing / Failing | Next Action |
|---|---|---:|---:|---|---|---|
| Example | Example task | 🟡 | 60% | Test file exists | Prod proof missing | Run prod smoke |
```

Include rows for:

* Core app
* CopilotKit runtime
* Mastra agents
* Mastra workflows
* Gemini structured output
* Supabase schema
* RLS policies
* Edge functions
* pgvector
* Maps base
* Advanced Markers
* Places API New
* Grounding Lite / ADK
* Events checkout
* Stripe webhook
* Ticket wallet QR
* Host wizard
* Rental search
* Lead capture
* Venues/cafes
* Trips
* Auth
* Playwright tests
* Vitest tests
* Production smoke
* OpenClaw automation
* WhatsApp/Postiz automation

## Step 5 — Update tasks/INDEX.md

Update `/home/sk/mdeai/tasks/INDEX.md` with:

* current active P0 queue
* current P1 queue
* blocked tasks
* post-MVP tasks
* exact implementation order
* testing proof links/paths
* status dots and percent complete

Do not duplicate old stale rows. Keep it concise.

## Step 6 — Update todo.md

Update `/home/sk/mdeai/todo.md` with only actionable items.

Group by priority:

```md
# TODO — mdeai

## P0 — Must fix before MVP exit
- [ ] Task — proof needed — command/file to verify

## P1 — Polish after P0
- [ ] Task — proof needed — command/file to verify

## P2 — Post-MVP
- [ ] Task — why deferred

## Do Not Start Yet
- OpenClaw automation without approval gates
- WhatsApp auto-send
- Sponsor marketplace
- Advanced RAG/vector rerank
- Multi-agent expansion
```

## Step 7 — Update changelog

Append a new dated entry to `/home/sk/mdeai/changelog`:

```md
## YYYY-MM-DD — Testing audit progress tracker

### Added
- Created/updated testing audit tracker in `tasks/progres.md`

### Verified
- List successful commands and proof

### Failed / Blocked
- List failed commands and blockers

### Changed
- Updated `tasks/INDEX.md`
- Updated `todo.md`

### Next
- Top 5 next actions
```

## Step 8 — Required scoring system

Use this scoring:

|  Score | Meaning             |
| -----: | ------------------- |
| 90–100 | Production-ready    |
|  75–89 | Strong, minor gaps  |
|  50–74 | Partial, needs work |
|  25–49 | Weak / risky        |
|   0–24 | Not implemented     |

## Step 9 — Final report in terminal

After editing files, print a concise final report:

```md
# Audit Complete

## Files Updated
- tasks/progres.md
- tasks/INDEX.md
- todo.md
- changelog

## Test Results
| Command | Result | Notes |
|---|---|---|

## Biggest Blockers
1.
2.
3.

## MVP Exit Recommendation
Go / No-Go: ___
Reason: ___

## Next Cursor Task
___
```

Rules:

* Be forensic.
* Be honest.
* Do not mark fake done.
* Do not start new features.
* Focus on MVP proof.
* Prefer evidence from tests, routes, SQL, screenshots, curl, and logs.
* Keep docs concise and copy/paste friendly.

```
```
