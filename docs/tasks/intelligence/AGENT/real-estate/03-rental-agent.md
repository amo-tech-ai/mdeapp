Audit and improve the rental parser + clarification intelligence.

Problem:
The user entered:
“list rentals in june 1 to 30 $1000 medellin”

The agent incorrectly asked:
“What dates, budget, and setup are you looking for?”

The system should already understand:

* Medellin location
* June 1 → June 30 date range
* monthly stay intent
* ~$1000 budget
* rental search intent

Goal:
Make the rental agent behave like an expert Medellín rental advisor, not a generic keyword bot.

Tasks:

1. Audit current parser behavior
   Inspect:

* rental-query-parser.ts
* use-rental-search-fast-path.ts
* clarify logic
* genericAskPending flow
* fast-path confidence scoring

Determine:

* why dates were not extracted
* why monthly intent was missed
* why budget semantics failed
* why generic clarify triggered

2. Add monthly rental intelligence

Support:

* “June 1 to 30”
* “1 month”
* “monthly rental”
* “stay for 2 months”
* “short-term furnished apartment”
* “remote work apartment”

Infer:

* check-in/check-out
* monthly stay type
* budget period (monthly vs nightly)

3. Improve clarification logic

Do NOT ask for information already provided.

Only ask high-value missing questions:

* preferred neighborhood
* furnished/unfurnished
* remote work friendly
* nightlife vs quiet
* apartment vs studio
* pet friendly

4. Medellín rental expertise

Add heuristics:

* Laureles → remote workers / walkable
* Poblado → luxury/nightlife
* Envigado → quieter/local
* Sabaneta → cheaper residential
* monthly stays → prioritize furnished apartments

5. Improve parser confidence scoring

If prompt includes:

* rental intent
* city
* dates
* budget

Then search immediately instead of generic clarify.

6. Add tests

Test prompts:

* “rentals in june for one month around $1000”
* “studio in laureles for july”
* “2 month furnished apartment in poblado”
* “cheap monthly rental medellin”
* “remote work apartment envigado”

Verify:

* extracted intent
* extracted dates
* extracted budget semantics
* clarification quality
* search payload

7. Generate report

Include:

* current failure points
* parser gaps
* missing heuristics
* Medellín-specific improvements
* clarification scoring improvements
* recommended PR breakdown
* production readiness score

Use:

* copilotkit-debug
* copilotkit-integrations
* mastra
* mde-maps
* testing
* webapp-testing

Run:

* unit tests
* parser tests
* production browser tests
* API payload inspection

Goal:
The assistant should behave like a Medellín rental concierge expert.
