You are a senior AI product architect, geo-search engineer, Supabase pgvector specialist, and CopilotKit + Mastra implementation reviewer.

Goal:
Review the existing mdeai setup and generate a practical implementation plan for a new feature:

Coffee Tour Intelligence

Stack:
- CopilotKit
- Mastra
- Google ADK
- Google Search Grounding
- Google Maps Grounding
- Google Maps Grounding Lite MCP
- Google Places API New
- Supabase Postgres
- pgvector
- map listings/cards/pins UI

Context:
We want to create verified coffee tour listings for Medellín, especially tours like:
- Medellín Coffee Farm Tour in Barrio La Sierra
- Colombia Coffee Tour
- Coffee tour Medellín En Barrio La Sierra
- Coffee tour La Casa Grande
- Tour de Cafe Corazón de León
- Proyecto Renacer
- Tour cafetero Medellín / Atardecer
- Artisan coffee tours

What I need you to do:

1. Audit the current repo setup
- Find current CopilotKit setup
- Find Mastra agents, tools, workflows
- Find map/listing/card components
- Find Supabase schema/migrations
- Find existing Places / Maps / Grounding integrations
- Find pgvector usage
- Identify what already exists vs what is missing

2. Explain how CopilotKit should interact with listings
Answer clearly:
- How does the user ask for coffee tours in chat?
- How does Mastra route the intent?
- Which tool gets called?
- How are results returned?
- How does CopilotKit render tour cards?
- How are map pins created?
- How does user intent affect ranking?
- How do actions work: save, open map, compare, website, WhatsApp?

3. Design the Coffee Tour Intelligence workflow

Expected flow:

User:
“Find me the best authentic coffee farm tour near Medellín”

CopilotKit UI
→ Mastra routerAgent
→ coffeeTourSearchWorkflow
→ Google ADK sidecar
→ Grounding Lite MCP for natural-language geo search
→ Places API New for structured place details
→ Google Search Grounding for website/social/source verification
→ Supabase cache + canonical listings
→ pgvector semantic matching
→ mdeai scoring system
→ CopilotKit cards + map pins

4. Design required Mastra tools

Propose tool names and contracts:

- searchCoffeeTours
- enrichCoffeeTourWithPlaces
- verifyCoffeeTourSources
- rankCoffeeTours
- saveCoffeeTour
- compareCoffeeTours
- getNearbyCoffeeTourContext

For each tool include:
- input schema
- output schema
- source of truth
- error handling
- cache behavior
- whether it is read-only or write-capable

5. Design Supabase schema

Create recommended tables:

- coffee_tours
- coffee_tour_sources
- coffee_tour_profiles
- coffee_tour_embeddings
- coffee_tour_rank_signals
- coffee_tour_user_interactions
- coffee_tour_search_logs
- coffee_tour_cache

Include fields for:
- name
- slug
- place_id
- maps_url
- googleMapsLinks.placeUri if available
- address
- neighborhood
- lat/lng
- phone
- website
- instagram
- rating
- review_count
- price estimate
- duration
- languages
- pickup_available
- booking_url
- coffee_type
- farm_story
- social_impact
- authenticity_score
- source_confidence
- ai_summary
- best_for
- not_best_for
- embedding text
- embedding vector

6. pgvector best practices

Explain:
- What text should be embedded
- What should NOT be embedded
- How to chunk listing intelligence
- Which embedding columns/tables to use
- How semantic search should combine with structured filters
- How to avoid hallucinated facts
- How to refresh embeddings when listings change

Example embedding text:
“Authentic social-impact coffee farm tour in Barrio La Sierra with local farmers, coffee education, Medellín hillside views, beginner-friendly experience, Spanish/English guide, strong cultural story.”

7. Scoring system

Design a clear mdeai Coffee Tour Score /100.

Suggested factors:
- Google rating
- review count confidence
- authenticity / real farm experience
- social impact / local community story
- verified website/social presence
- source citations
- distance from user/map viewport
- availability/open status
- user intent match
- language fit
- price fit
- safety/trust confidence

Generate formula, weights, and examples.

8. User intent suggestions

Create intent categories:
- authentic farm tour
- social impact tour
- beginner-friendly coffee tour
- best rated tour
- family-friendly tour
- budget tour
- luxury/private tour
- Spanish-speaking tour
- English-speaking tour
- near Poblado
- near Laureles
- La Sierra tour
- sunset coffee tour
- coffee education / tasting

For each intent, explain:
- filters
- vector query
- ranking boost
- UI suggestion chip

9. Places API New + Grounding strategy

Explain when to use:
- Grounding Lite MCP
- Places Text Search
- Places Details
- Google Search Grounding
- Maps Grounding
- Supabase cached data

Important:
- Places API New should provide factual place data.
- Google Search Grounding should verify websites, Instagram, booking pages, articles, and recent source claims.
- Gemini must not invent coordinates, ratings, reviews, hours, or URLs.
- All factual fields must come from tools or database.

10. UI plan

Design:
- CoffeeTourCard
- CoffeeTourMapPin
- CoffeeTourCompareDrawer
- CoffeeTourDetailPage
- CoffeeTourSourceBadges
- CoffeeTourScoreBadge
- CoffeeTourIntentChips

Each card should show:
- name
- rating + review count
- neighborhood
- tour type
- why recommended
- best for
- price/duration if known
- confidence
- buttons: Map, Website, WhatsApp, Save, Compare

11. Implementation tasks

Generate task list in correct order:
- audit existing code
- create schema migration
- seed initial 10 coffee tours
- create Places enrichment service
- create Search Grounding verifier
- create embeddings pipeline
- create ranking function
- create Mastra tools
- create CopilotKit generative UI cards
- create map pins
- create tests
- create smoke test
- create production checklist

For each task include:
- file paths likely to change
- acceptance criteria
- test command
- risk level
- estimated effort

12. Safety, quality, and production rules

Include:
- no client-side secret keys
- cache Google API responses
- respect quotas
- store source provenance
- never hallucinate facts
- mark uncertain fields as unknown
- use RLS for user interactions
- use service role only in server/edge context
- add tests before marking done

Output format:
- Executive summary
- Current setup audit
- Architecture diagram
- Data model
- Tool contracts
- CopilotKit interaction model
- pgvector plan
- scoring formula
- UI plan
- task roadmap
- risks
- final recommendation

Be direct, practical, and implementation-ready.
Do not write code unless needed for schema examples.