# Google Search Grounding — Top 10 Core Features for mdeai

| #  | Feature                         | What it does                            | Best mdeai use case                          | Stack fit            | Score /100 |
| -- | ------------------------------- | --------------------------------------- | -------------------------------------------- | -------------------- | ---------: |
| 1  | Real-time event discovery       | Searches current web pages/events       | “What’s happening this weekend in Medellín?” | Mastra tool          |         98 |
| 2  | Official ticket verification    | Verifies real ticket URLs               | Eventbrite/Tuboleta validation               | Mastra + Supabase    |         97 |
| 3  | Venue announcement grounding    | Finds latest venue updates              | club closures/openings/schedule changes      | Mastra               |         96 |
| 4  | Source-backed recommendations   | Adds citations to AI answers            | “Best rooftop bars tonight”                  | CopilotKit cards     |         95 |
| 5  | Neighborhood trend summaries    | Summarizes web/news/blog activity       | Laureles vs Poblado trends                   | Mastra synthesis     |         95 |
| 6  | Tourism freshness layer         | Finds current travel conditions         | protests/weather/closures                    | Search fallback tool |         94 |
| 7  | Restaurant opening verification | Detects new openings/temporary closures | Medellín café intelligence                   | Places + Search      |         94 |
| 8  | Festival schedule grounding     | Verifies lineups/times                  | Feria de las Flores                          | Event agent          |         93 |
| 9  | Safety/current alerts           | Finds recent disruptions/news           | strikes, flooding, transit issues            | Concierge tool       |         92 |
| 10 | Citation rendering              | Displays trusted sources                | “Verified from web” UX                       | CopilotKit UI        |         92 |

---

# Google Search Grounding — Top 10 Advanced Features

| #  | Advanced Feature              | What it does                           | Real-world example               | Stack fit             | Score /100 |
| -- | ----------------------------- | -------------------------------------- | -------------------------------- | --------------------- | ---------: |
| 1  | Autonomous event intelligence | Continuously monitors web for events   | Medellín nightlife AI feed       | Mastra workflows      |         99 |
| 2  | AI itinerary planner          | Combines events/maps/weather/news      | 3-day Medellín AI planner        | Mastra + Maps         |         99 |
| 3  | Sponsor intelligence agent    | Researches sponsors/brands/news        | fashion sponsor targeting        | Search + Supabase     |         98 |
| 4  | Geo-intelligence summaries    | Combines maps + news + trends          | “Best digital nomad areas”       | Mastra synthesis      |         98 |
| 5  | Personalized nightlife AI     | Learns user preferences + web trends   | techno + rooftop recommendations | Memory + Search       |         97 |
| 6  | Event verification pipeline   | AI validates scraped events            | fake-event filtering             | Search + moderation   |         97 |
| 7  | Real-estate intelligence      | Current neighborhood/property insights | rental market changes            | Search + Maps         |         96 |
| 8  | AI watchlists/alerts          | Monitors changing topics               | venue reopening alerts           | scheduled workflows   |         95 |
| 9  | Multi-source reasoning        | Combines blogs/news/maps               | “safest café work areas”         | Gemini synthesis      |         95 |
| 10 | Dynamic city pulse engine     | AI summarizes city activity daily      | Medellín today digest            | workflows + grounding |         94 |

---

# Best Use Cases by Vertical

| Vertical    | Best Search Grounding Uses                                                            |
| ----------- | ------------------------------------------------------------------------------------- |
| Real Estate | neighborhood changes, safety, construction, rental law, scams, local market news      |
| Events      | ticket verification, lineup changes, official announcements, “this weekend” discovery |
| Restaurants | openings, closures, trending cafés, chef announcements, local rankings                |
| Tourism     | protests, weather impacts, attraction closures, local recommendations                 |
| Sponsors    | company news, partnerships, brand campaigns, competitor analysis                      |
| Concierge   | fresh local facts with citations                                                      |

---

# What Search Grounding SHOULD be used for

## Best for

```text
fresh web information
+
current facts
+
official pages
+
citations
+
real-time changes
```

Examples:

* events tonight
* venue schedule changes
* restaurant openings
* weather-sensitive recommendations
* current travel disruptions
* official announcements

---

# What Search Grounding should NOT replace

| Keep existing system | Why                           |
| -------------------- | ----------------------------- |
| Grounding Lite MCP   | best for place discovery      |
| Places API New       | best for ratings/photos/hours |
| Routes API           | best for commute/travel       |
| Supabase             | source of truth               |
| Maps JS              | map rendering                 |
| Nearby Search        | structured location queries   |

---

# Correct Architecture for mdeai

## Recommended production flow

```text
User asks:
"best live music tonight near Laureles"

↓
Mastra router

↓
Grounding Lite MCP
(find venues)

↓
Places API New
(enrich places)

↓
Google Search Grounding
(check fresh events/live music tonight)

↓
Mastra synthesis

↓
CopilotKit cards + map pins + citations
```

This is the strongest architecture.

---

# Best Stack Placement

| Layer              | Responsibility          |
| ------------------ | ----------------------- |
| Mastra             | orchestration/routing   |
| Search Grounding   | fresh web retrieval     |
| Grounding Lite MCP | geo/place discovery     |
| Places API New     | structured enrichment   |
| Supabase           | persistent storage      |
| CopilotKit         | rendering/citations     |
| Cloud Run sidecar  | maps/place intelligence |

---

# Recommended Core Tasks

| Task                   | Why important                |
| ---------------------- | ---------------------------- |
| MAP-002D               | search grounding integration |
| EVT-SEARCH-001         | event discovery fallback     |
| CORE-GEMINI-001        | quotas/logging               |
| CORE-GEMINI-002        | citation cards               |
| REST-SEARCH-001        | restaurant verification      |
| REAL-ESTATE-SEARCH-001 | neighborhood intelligence    |
| SPONSOR-SEARCH-001     | sponsor research agent       |

---

# Best MVP Features to Build First

| Priority | Feature                  | Why                          |
| -------- | ------------------------ | ---------------------------- |
| 1        | Event grounding fallback | highest user value           |
| 2        | Citation cards           | trust                        |
| 3        | Ticket verification      | reduces fake events          |
| 4        | Neighborhood summaries   | concierge feel               |
| 5        | Venue updates            | fresh nightlife intelligence |

---

# Advanced Features to Build Later

| Later Phase                    | Why defer                |
| ------------------------------ | ------------------------ |
| Autonomous monitoring agents   | expensive/complex        |
| Continuous search crawlers     | quota heavy              |
| Live AI watchlists             | needs infra maturity     |
| Personalized AI memory ranking | needs user history       |
| Full city pulse engine         | requires analytics stack |

---

# Biggest Risks

| Risk                   | Why important                      |
| ---------------------- | ---------------------------------- |
| Cost explosion         | search grounding billed per search |
| Hallucinated citations | grounding can still fail           |
| Stale pages            | some event pages outdated          |
| Latency                | web grounding slower than local DB |
| Overusing grounding    | should not run every prompt        |

---

# Best Practices

| Best Practice                      | Why                   |
| ---------------------------------- | --------------------- |
| Only trigger on “freshness intent” | reduce cost           |
| Require citations                  | trust                 |
| Add quota guards                   | avoid runaway spend   |
| Cache grounded summaries           | faster repeat queries |
| Use Supabase first                 | grounding is fallback |
| Log grounding metadata             | debugging/analytics   |
| Fail gracefully                    | never block chat      |

---

# Correct Intent Routing

| User asks                       | Best system      |
| ------------------------------- | ---------------- |
| “quiet cafés near me”           | Grounding Lite   |
| “top cafés open tonight”        | Places + Search  |
| “events this weekend”           | Search grounding |
| “best area for digital nomads”  | Search + Maps    |
| “walk time from rental to café” | Routes API       |
| “is this event real?”           | Search grounding |

---

# Final Summary

## Your current architecture is already correct

You already solved:

* Maps architecture
* Grounding Lite
* Places enrichment
* Cloud Run sidecar
* secure APIs
* caching
* map sync

Google Search Grounding should now become:

```text
freshness + citations layer
```

NOT:

```text
replacement for maps/place systems
```

---

# Best Final Architecture

```text
Grounding Lite MCP
→ place discovery

Places API New
→ ratings/photos/hours

Google Search Grounding
→ fresh web facts + citations

Mastra
→ orchestration + routing

Supabase
→ source of truth

CopilotKit
→ rich UI + citations
```

That is a very strong modern AI geo/travel architecture.
