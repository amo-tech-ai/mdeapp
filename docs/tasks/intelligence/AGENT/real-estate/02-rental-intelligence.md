Audit the rental agent intelligence and conversational flow on https://www.mdeai.co/

Goal:
Verify the agent truly understands Medellín rental intent, asks intelligent follow-up questions, and behaves like a local rental expert — not just a keyword search bot.

Test query:
“Search for rentals in June for one month around $1000”

Audit and explain:

1. Intent understanding
   Verify how the agent interprets:

* June = move-in/start date
* one month = short-term stay
* $1000 = total monthly budget or monthly rent
* Medellín neighborhoods implied/not implied
* furnished vs unfurnished assumptions
* USD vs COP assumptions

2. Follow-up question quality
   Verify whether the agent asks smart clarification questions such as:

* preferred neighborhood (Laureles, Poblado, Envigado, etc.)
* furnished or unfurnished
* utilities included?
* apartment, studio, room, or house?
* nightlife vs quiet area
* remote work / wifi needs
* gym/pool/doorman
* monthly vs nightly pricing confusion
* flexible dates?

Flag weak/generic questions.

3. Rental expertise quality
   Verify if the agent behaves like a Medellín rental specialist:

* understands neighborhood differences
* understands realistic pricing
* understands expat/digital nomad preferences
* understands monthly stay logic
* avoids showing nightly Airbnb listings for monthly searches
* prioritizes furnished monthly rentals for June stays

4. Search logic audit
   Trace how the search is performed:

* parser extraction
* fast-path detection
* API payload
* filters generated
* map pins
* ranking logic
* card rendering
* fallback to agent tools if needed

5. Failure points
   Identify:

* incorrect assumptions
* missing clarifications
* bad ranking
* duplicate cards
* wrong currency handling
* stale pins
* weak parser logic
* hallucinated neighborhood knowledge
* slow responses
* poor zero-results handling

6. Improvement recommendations
   Suggest improvements for:

* parser intelligence
* rental scoring/ranking
* neighborhood recommendations
* Medellín-specific heuristics
* conversational memory
* map UX
* booking/scheduling workflow
* WhatsApp lead flow
* long-stay optimization
* expat-friendly suggestions

7. Test matrix
   Run multiple prompts:

* “1BR in Laureles for July under $1200”
* “Cheap monthly rental near Provenza”
* “Quiet apartment for remote work in Medellín”
* “Luxury furnished rental in El Poblado for 2 months”
* “Studio near coworking spaces”
* “Pet friendly rental in Envigado”

For each:

* explain intent extraction
* explain clarifications asked
* explain whether results are good
* identify issues

8. Production-quality verdict
   Score:

* parser intelligence
* rental expertise
* UX
* map behavior
* follow-up questioning
* Medellín local knowledge
* production readiness

Generate:

* forensic audit report
* critical fixes
* P0/P1/P2 improvements
* recommended next PRs/tasks
* best practices

Use:

* copilotkit-debug
* copilotkit-integrations
* mde-maps
* mastra
* webapp-testing
* testing
* code-review

Verify with:

* production browser testing
* console/network inspection
* API payload inspection
* fast-path behavior
* fallback agent behavior
