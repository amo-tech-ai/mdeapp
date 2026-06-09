## Plan: Coffee Tours Intelligence System

Build this as **AI local experience discovery**, not a Google Maps clone.

### Core flow

```text
User asks:
“best coffee farm tour near Medellín”

CopilotKit UI
→ Mastra router
→ ADK Grounding Lite
→ Google Places New
→ Google Search Grounding
→ Supabase + pgvector
→ ranked tour cards + map pins
```

Your existing architecture already supports this split: CopilotKit renders, Mastra routes, ADK returns grounded JSON, Places New enriches, Supabase stores/cache, and vis.gl draws pins. 

## What each tool does

| Tool                        | Use it for                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------- |
| **CopilotKit**              | Chat UI, cards, “save tour”, “open map”, “compare tours”                           |
| **Mastra**                  | Router agent, workflows, scoring, tool calls                                       |
| **Google ADK**              | Sidecar for Google Maps/Search intelligence                                        |
| **Grounding Lite MCP**      | Natural language geo search: “coffee farm tour in La Sierra”                       |
| **Places API New**          | placeId, rating, reviews, hours, photos, phone, Maps URL                           |
| **Google Search Grounding** | websites, Instagram, blogs, fresh verification                                     |
| **Supabase**                | canonical tour records, facts, sources, scores                                     |
| **pgvector**                | vibe/intent matching: “authentic local farm”, “social impact”, “beginner friendly” |

## Supabase tables

```sql
coffee_tours
- id
- place_id
- name
- neighborhood
- address
- lat
- lng
- phone
- website
- instagram
- rating
- review_count
- price_estimate
- duration
- languages
- pickup_available
- maps_url
- status

coffee_tour_sources
- tour_id
- source_type
- source_url
- source_title
- trust_score
- retrieved_at

coffee_tour_profiles
- tour_id
- ai_summary
- why_special
- best_for
- not_best_for
- coffee_type
- social_impact
- farm_story
- confidence

coffee_tour_embeddings
- tour_id
- content_type
- content_text
- embedding

coffee_tour_rank_signals
- tour_id
- rating_score
- review_score
- authenticity_score
- source_score
- social_impact_score
- distance_score
- final_score
```

This follows your café system direction: structured facts stay in SQL, vibe/source summaries go into pgvector. 

## Ranking formula

```text
mdeai Coffee Tour Score =
25% rating/reviews
20% authenticity/farm experience
15% source verification
15% social impact/local story
10% location/distance
10% website/social completeness
5% open/booking availability
```

## MVP workflow

1. Seed your 10 coffee tour operators.
2. Call Places New for rating, reviews, photos, hours, placeId.
3. Use Search Grounding to verify website, Instagram, booking links.
4. Generate AI profiles: “why special”, “best for”, “coffee type”.
5. Store semantic summaries in pgvector.
6. Show ranked cards + map pins in CopilotKit.
7. Add “Why recommended” explanation.

## Example card

```text
Coffee Farm Tour in Barrio La Sierra
★ 5.0 · 267 reviews

Best for:
Authentic local coffee farm + social impact

Why recommended:
Highly rated, based in La Sierra, strong local farm story, good fit for travelers who want more than a café visit.

Actions:
Open map · Visit website · WhatsApp · Save
```

## Build order

| Phase | Task                          |
| ----- | ----------------------------- |
| 1     | Create coffee tour schema     |
| 2     | Seed 10 tours manually        |
| 3     | Places New enrichment         |
| 4     | Search Grounding verification |
| 5     | pgvector embeddings           |
| 6     | mdeai tour score              |
| 7     | CopilotKit cards + map pins   |

Best next step: create **`MAP-031 Coffee Tour Intelligence`** using the same pattern as your café scoring tasks.
