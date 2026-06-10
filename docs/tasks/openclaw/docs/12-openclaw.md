# Top 10 GitHub Repos + Ideas for OpenClaw + Cafés + Restaurants

## Executive summary

Best architecture for mdeai:

```text
OpenClaw
→ browser/data execution

Mastra
→ orchestration

CopilotKit
→ conversational UI

Supabase + pgvector
→ memory + semantic intelligence

Maps + Places
→ grounded geo layer
```

The biggest opportunity is NOT restaurant CRUD apps.

The opportunity is:

```text
AI-powered local intelligence graph
```

---

# Top 10 Repos / Projects

| #  | Project                 | URL                                                                                                                  | Score /100 | Best Features                                                              |
| -- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------: | -------------------------------------------------------------------------- |
| 1  | TREK                    | [https://github.com/mauriceboe/TREK](https://github.com/mauriceboe/TREK)                                             |         97 | Interactive maps, collaboration, route planning, Google Places integration |
| 2  | NOMAD                   | [https://github.com/mauriceboe/NOMAD](https://github.com/mauriceboe/NOMAD)                                           |         95 | Shared planning, real-time collaboration, map UX                           |
| 3  | TripTailor              | [https://github.com/papercri/triptailor](https://github.com/papercri/triptailor)                                     |         93 | AI travel assistant, destination intelligence, maps + AI                   |
| 4  | pgvector                | [https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)                                         |         92 | Semantic search engine foundation                                          |
| 5  | NaLaMap                 | [https://github.com/nalamap/nalamap](https://github.com/nalamap/nalamap)                                             |         91 | Natural-language maps                                                      |
| 6  | OpenClaw                | [https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)                                         |         90 | Browser execution + AI automation                                          |
| 7  | Google Maps MCP Planner | [https://mcp.directory/servers/google-maps-travel-planner](https://mcp.directory/servers/google-maps-travel-planner) |         88 | MCP travel-planning architecture                                           |
| 8  | Trip Planner Frontend   | [https://github.com/lushiyun/trip-planner-frontend](https://github.com/lushiyun/trip-planner-frontend)               |         86 | Place cards, filters, weather, routing                                     |
| 9  | AI Travel Planner       | [https://github.com/thrishank007/AI-Travel-Planner](https://github.com/thrishank007/AI-Travel-Planner)               |         82 | AI itinerary generation                                                    |
| 10 | Gorse Recommender       | [https://github.com/zhenghaoz/gorse](https://github.com/zhenghaoz/gorse)                                             |         80 | Recommendation engine architecture                                         |

TREK includes:

* interactive maps
* clustering
* route visualization
* Google Places integration
* real-time collaboration
* budgets
* PWA support ([GitHub][1])

TripTailor includes:

* AI assistant
* destination intelligence
* map embedding
* cuisine/culture summaries
* itinerary generation ([GitHub][2])

---

# Best OpenClaw Use Cases for Cafés & Restaurants

| Use Case                     | Value                          | Score |
| ---------------------------- | ------------------------------ | ----: |
| Instagram café discovery     | Massive Medellín value         |    97 |
| Restaurant enrichment        | Website/menu/social extraction |    95 |
| AI hidden-gems finder        | Very differentiated            |    94 |
| Menu intelligence extraction | Huge UX win                    |    93 |
| Review summarization         | Strong AI feature              |    92 |
| “Best dish” extraction       | Very useful                    |    92 |
| Real-time opening monitoring | High value                     |    90 |
| New café detection           | Strong moat                    |    89 |
| Local event detection        | Excellent for city portal      |    88 |
| Creator-food-map extraction  | Viral potential                |    87 |

---

# Most Valuable Features to Steal

## 1. “Best Dish” Intelligence

Inspired by:

* DishAdvisor
* Yelp AI
* food creator maps

Feature:

```text
Best item to order:
- pistachio latte
- pour-over
- brunch sandwich
```

Not just:

* “4.8 stars”

DishAdvisor focuses on:

* what to order
* not only where to eat ([Reddit][3])

---

# 2. AI Food Crawl Maps

Inspired by:

* Food Crawl
* creator map extraction

Feature:

```text
Map all restaurants from:
- TikTok
- YouTube
- Instagram creators
```

Extremely viral.

Food Crawl already parses creator videos and pins restaurants on maps. ([Reddit][4])

---

# 3. Semantic Café Search

Example:

```text
quiet laptop café with natural lighting near Laureles
```

Uses:

* pgvector
* embeddings
* Maps
* review summaries

---

# 4. Authenticity Score

Massive Medellín opportunity.

Example:

```text
Authenticity:
92/100
```

Signals:

* local reviews
* family-run
* social presence
* low-tourist spam
* creator mentions
* specialty coffee indicators

---

# 5. Café Vibe Search

Example intents:

| Intent           | Query                   |
| ---------------- | ----------------------- |
| work café        | laptop, outlets, quiet  |
| date café        | cozy, romantic, evening |
| brunch           | natural light, groups   |
| specialty coffee | pour-over, roasting     |
| hidden gem       | low tourism, locals     |

---

# 6. Dynamic Map Markers

Inspired by:

* Google Maps
* Airbnb
* Foursquare

Example:

```text
☕ 94
Laptop Friendly
```

Marker changes:

* open/closed
* vibe
* crowd level
* specialty coffee
* confidence

---

# 7. Creator-Driven Discovery

Huge future.

Example:

```text
Best cafés from Medellín creators
```

OpenClaw:

* scans creators
* extracts locations
* builds trust graph

---

# 8. Menu Intelligence

Very underrated.

OpenClaw can:

* screenshot menus
* OCR menus
* extract prices
* extract specialties

Inspired by:

* OpenMenuMap ([Reddit][5])

---

# 9. Neighborhood Intelligence

Example:

```text
Laureles:
- best work cafés
- brunch density
- coffee-tour hubs
- nightlife crossover
```

This becomes:

* map overlays
* polygons
* semantic neighborhood scoring

---

# 10. Conversational Maps

Inspired by:

* IMAIA research
* Ask Maps

Example:

```text
Show hidden specialty cafés near the green neighborhood with coworking spaces.
```

IMAIA demonstrates conversational grounded map intelligence using spatial reasoning and multi-agent map systems. ([arXiv][6])

---

# Best Architecture Pattern

## Recommended

```text
CopilotKit
→ UI + cards + actions

Mastra
→ workflows + orchestration

OpenClaw
→ browser execution

Places API
→ factual place truth

Supabase
→ canonical storage

pgvector
→ vibe search + semantic ranking
```

---

# Most Important Tables

## cafes

```sql
id
name
place_id
rating
review_count
lat
lng
website
instagram
maps_url
```

---

## cafe_profiles

```sql
vibe
best_for
specialties
atmosphere
lighting
noise_level
wifi_quality
work_friendly
date_friendly
```

---

## cafe_embeddings

```sql
embedding_text
embedding vector(1536)
```

---

## cafe_rank_signals

```sql
authenticity_score
specialty_score
creator_score
semantic_score
trust_score
final_score
```

---

# Most Important MVP Features

| Feature               | Priority |
| --------------------- | -------: |
| AI café search        |       P0 |
| AdvancedMarkers       |       P0 |
| Vibe search           |       P0 |
| Review summaries      |       P0 |
| Best dish extraction  |       P1 |
| Instagram enrichment  |       P1 |
| Semantic ranking      |       P1 |
| Neighborhood overlays |       P2 |
| Creator discovery     |       P2 |
| Conversational maps   |       P3 |

---

# Final Recommendation

Build:

```text
Foursquare + Yelp AI + Google Maps AI + Medellín local intelligence
```

NOT:

* generic restaurant directory
* generic travel planner
* generic chatbot

Your moat becomes:

```text
Medellín semantic lifestyle graph
```

Powered by:

* OpenClaw research
* Maps grounding
* pgvector
* local intelligence
* creator discovery
* semantic vibe search
* explainable recommendations

[1]: https://github.com/mauriceboe/TREK?utm_source=chatgpt.com "GitHub - mauriceboe/TREK: A self-hosted travel/trip planner with real-time collaboration, interactive maps, PWA support, SSO, budgets, packing lists, and more. · GitHub"
[2]: https://github.com/papercri/triptailor?utm_source=chatgpt.com "GitHub - papercri/triptailor: TripTailor is an AI-powered travel planner web app that helps users discover destinations and get personalized travel recommendations. Built with modern technologies, it allows users to explore cities, view key information, and plan their trips through an interactive assistant."
[3]: https://www.reddit.com/r/Python/comments/1erxk9r?utm_source=chatgpt.com "Introducing DishAdvisor: Discover the Best Dishes based on user reviews (Open Source Project)"
[4]: https://www.reddit.com/r/FoodVlog/comments/1tjcn9i/i_made_a_tool_that_maps_every_restaurant_from_a/?utm_source=chatgpt.com "I made a tool that maps every restaurant from a food YouTuber's video"
[5]: https://www.reddit.com/r/SideProject/comments/1p6796v/openmenumap_a_crowdsourced_map_of_real_restaurant/?utm_source=chatgpt.com "OpenMenuMap: a crowdsourced map of real restaurant prices (menus & receipts). Feedback welcome!"
[6]: https://arxiv.org/abs/2507.06993?utm_source=chatgpt.com "IMAIA: Interactive Maps AI Assistant for Travel Planning and Geo-Spatial Intelligence"
