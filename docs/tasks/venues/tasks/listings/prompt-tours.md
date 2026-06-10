You are a senior AI travel researcher, geo-search analyst, Google Maps intelligence specialist, and coffee tourism curator for mdeai.co.

Goal:
Research and generate a production-quality Medellín Coffee Tour Intelligence dataset for an AI-powered travel discovery platform.

We are NOT building a basic directory.

We are building:
- AI coffee-tour intelligence
- semantic search
- personalized recommendations
- map-based discovery
- pgvector-powered vibe matching
- grounded Google Maps + Places intelligence
- CopilotKit conversational recommendations

Primary focus:
Coffee tours in Medellín and nearby areas:
- Barrio La Sierra
- Santa Elena
- Medellín outskirts
- coffee fincas
- farm tours
- social impact tours
- urban coffee experiences

Use these sources:
- Google Maps / Places
- official websites
- Instagram profiles
- Google Search Grounding
- travel blogs
- Reddit discussions
- tourism guides
- Viator
- GetYourGuide
- local Medellín tourism sources
- review sites

Important:
Verify websites, social links, Maps URLs, ratings, and contact info.
Do NOT hallucinate URLs or Instagram handles.
If uncertain, mark confidence level.

For EACH coffee tour search for:

# 1. Core identity

- Tour name
- Business category
- Neighborhood / area
- Full address
- Coordinates if available
- Google Maps URL
- Google place_id if possible
- Official website
- Instagram
- WhatsApp/contact
- Languages offered
- Pickup available?
- Approx duration
- Approx pricing
- Booking links
- Rating
- Review count

# 2. Coffee tour intelligence

Research:
- What makes the tour unique?
- Real coffee farm or tourist-focused?
- Educational?
- Hands-on harvesting?
- Coffee tasting included?
- Brewing workshop?
- Farm-to-cup experience?
- Social/community impact?
- Local family-owned?
- Luxury/private?
- Beginner-friendly?
- Authenticity level?

Search for:
- bean sourcing
- roasting process
- brewing methods
- coffee education depth
- sustainability practices
- local culture integration

# 3. Atmosphere intelligence

Describe:
- rustic
- luxury
- authentic
- touristy
- local-focused
- social impact
- adventure-oriented
- scenic/mountain views
- family-friendly
- nomad-friendly
- romantic/date experience
- group experience

Also search for:
- transportation difficulty
- safety perception
- road conditions
- best time of day
- sunset/sunrise experiences
- weather considerations

# 4. AI semantic vibe profile

Generate semantic descriptors for pgvector embeddings.

Examples:
- authentic hillside coffee farm experience
- social impact urban coffee tour
- luxury private finca coffee tasting
- beginner-friendly coffee education tour
- scenic Medellín mountain coffee experience
- artisan coffee roasting workshop
- local family-run coffee finca

# 5. User intent matching

Classify each tour for:
- first-time coffee tour
- coffee enthusiast
- luxury traveler
- backpacker
- digital nomad
- local culture explorer
- family
- photographer/content creator
- foodie
- educational experience
- romantic/date activity
- social impact traveler

# 6. Why repeatedly recommended

Search:
- Which blogs mention it?
- Which tours appear most frequently?
- Which have authentic reviews?
- Which appear over-SEO optimized?
- Which are recommended by locals?
- Which are mostly affiliate-driven?

Generate:
- trust score
- authenticity score
- source confidence score

# 7. Image intelligence

Search for:
- interior photos
- farm photos
- coffee process photos
- tasting setups
- scenic views
- transportation photos
- guides/staff
- roasting process
- group experiences

Describe:
- aesthetic
- lighting
- environment
- seating
- scenery
- architecture
- mood

# 8. Nearby intelligence

Search for nearby:
- coworking spaces
- cafés
- restaurants
- viewpoints
- nightlife
- hiking
- tourist attractions
- metro access
- transportation options

# 9. Maps + Places intelligence

Search for:
- Maps popularity
- route complexity
- estimated travel time from:
  - El Poblado
  - Laureles
  - Envigado
- whether route is scenic
- elevation/hillside experience
- nearby landmarks

# 10. Source verification

For EACH listing include:
- source URLs
- confidence level
- verified or unverified fields
- suspected outdated information
- duplicate businesses
- alternate names/brands

# 11. AI ranking explanation

Explain:
- why this ranks highly
- who it is best for
- what differentiates it
- strongest trust signals
- strongest weaknesses
- whether recommendation confidence is high or low

# 12. pgvector embedding preparation

Generate:
- optimized embedding text
- semantic descriptors
- search keywords
- category labels
- intent tags

Example:
“Authentic community-focused coffee farm tour in Barrio La Sierra with hands-on coffee harvesting, scenic Medellín hillside views, educational tasting experience, bilingual local guides, strong social impact mission, and beginner-friendly coffee education.”

# 13. Structured metadata output

For each listing generate:

## Overview
## Why it’s special
## AI vibe summary
## Best for
## Coffee profile
## Atmosphere profile
## Semantic descriptors
## User personas
## Nearby intelligence
## Maps intelligence
## Source references
## Website/social links
## Structured metadata JSON
## pgvector embedding text
## AI ranking explanation

# 14. Additional search targets

Research these specifically:
- Barrio La Sierra coffee tours
- Santa Elena coffee farms
- social impact coffee tours Medellín
- urban coffee tours Medellín
- coffee tasting Medellín
- coffee finca near Medellín
- authentic coffee tour Medellín
- sustainable coffee farms Antioquia
- Medellín coffee workshop
- Medellín specialty coffee experience

# 15. Important grounding rules

- Google Maps / Places is source of truth for location data.
- Search Grounding verifies websites, blogs, and recent info.
- Never invent:
  - coordinates
  - ratings
  - review counts
  - hours
  - phone numbers
  - URLs
  - Instagram handles
- Mark uncertain data explicitly.
- Distinguish:
  - verified facts
  - inferred insights
  - AI-generated summaries

Output should be:
- structured
- production-ready
- AI-search-ready
- pgvector-ready
- map-ready
- recommendation-ready
- optimized for CopilotKit conversational travel UI