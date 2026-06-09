# Best Cafés in Medellín Intelligence System — Design Doc

## Executive summary

mdeai should **not rely only on Google Maps ranking** for “best cafés.” Use Google to find and enrich places, but build your own **café intelligence layer** from articles, blogs, Places data, and user intent.

Best architecture:

```text
Grounding Lite
→ finds cafés

Places API New
→ ratings, photos, hours, address

Article/source intelligence
→ vibe, coworking, specialty coffee, local reputation

pgvector
→ semantic café matching

mdeai scoring
→ “best for you” ranking
```

Google Search Grounding is useful for current/fresh facts and citations, while Places API New provides structured details like address, rating, and reviews. ([Google AI for Developers][1])

---

# 1. What makes a café “best”?

| Factor                  | Why it matters                 | Store as     | Suggested weight |
| ----------------------- | ------------------------------ | ------------ | ---------------: |
| Rating                  | Basic quality signal           | structured   |              20% |
| Review count            | Trust/confidence               | structured   |              15% |
| Specialty coffee        | Coffee quality                 | tag + vector |              15% |
| Coworking friendly      | Important for nomads           | tag + vector |              15% |
| Quiet / laptop friendly | User intent match              | vector       |              10% |
| Neighborhood fit        | Laureles, Poblado, Envigado    | structured   |              10% |
| Source mentions         | Appears across guides/articles | structured   |              10% |
| Open now                | Immediate usefulness           | structured   |               5% |

Today, mdeai mostly shows Google’s order + Places details. Better: add a custom **mdeai Café Score**.

---

# 2. Source quality table

| Source type          | Examples                          | Use for                            | Trust score |
| -------------------- | --------------------------------- | ---------------------------------- | ----------: |
| Official tourism     | Medellín Travel, Visit Medellín   | trustworthy city recommendations   |          90 |
| Editorial food media | Eater                             | specialty coffee / culture context |          88 |
| Travel blogs         | Half Half Travel, Desk to Dirtbag | vibe, traveler fit                 |          75 |
| Nomad blogs          | Nomads Beyond, coworking guides   | laptop/wifi/coworking tags         |          78 |
| Review platforms     | TripAdvisor, Wanderlog            | popularity + reviews               |          70 |
| Social platforms     | Lemon8, Medium                    | trend signals only                 |          55 |

Eater highlights Medellín’s third-wave café scene with brands like Pergamino, Rituales, and Urbania, which is useful for specialty-coffee context. ([Eater][2]) TripAdvisor provides ratings/review-style signals, but should not be your only quality source. ([Tripadvisor][3])

---

# 3. What to put in Supabase vs pgvector

| Data                    | Supabase structured columns | pgvector embedding |
| ----------------------- | --------------------------- | ------------------ |
| Name                    | ✅                           | ❌                  |
| Place ID                | ✅                           | ❌                  |
| Rating                  | ✅                           | ❌                  |
| Review count            | ✅                           | ❌                  |
| Address                 | ✅                           | ❌                  |
| Neighborhood            | ✅                           | ✅ optional         |
| Photos                  | ✅ URL/reference             | ❌                  |
| Opening hours           | ✅                           | ❌                  |
| Tags                    | ✅                           | ✅                  |
| Article summaries       | ✅ source table              | ✅                  |
| Café vibe               | ✅ short profile             | ✅                  |
| Quotes/excerpts         | ✅ short excerpt + source    | ✅ only if allowed  |
| “Laptop friendly” notes | ✅                           | ✅                  |
| “Best for…” profile     | ✅                           | ✅                  |

---

# 4. Suggested schema

```sql
cafes
- id
- place_id
- name
- neighborhood
- address
- lat
- lng
- rating
- user_rating_count
- price_level
- open_now
- maps_url
- primary_photo_name
- created_at
- updated_at

cafe_sources
- id
- cafe_id
- source_url
- source_title
- publisher
- author
- published_at
- trust_score
- source_type

cafe_source_mentions
- id
- cafe_id
- source_id
- mention_type
- short_excerpt
- paraphrased_summary
- tags
- extracted_at

cafe_ai_profiles
- cafe_id
- best_for
- vibe_summary
- work_friendly_score
- coffee_quality_score
- brunch_score
- date_spot_score
- quiet_score
- local_favorite_score

cafe_embeddings
- id
- cafe_id
- content_type
- content_text
- embedding vector
- source_id
```

---

# 5. pgvector strategy

## Embed these

| Content                   | Why                           |
| ------------------------- | ----------------------------- |
| Café vibe summaries       | semantic matching             |
| Article-derived summaries | captures “why people like it” |
| Coworking/laptop notes    | remote-work matching          |
| Neighborhood descriptions | “best café near nightlife”    |
| User preference profiles  | personalization               |
| AI-generated café profile | fast recommendation search    |

## Do not embed only raw data like:

```text
rating: 4.7
address: Calle 10
```

That belongs in structured SQL.

---

# 6. Ranking formula

Suggested **mdeai Café Score**:

```text
score =
rating_quality * 0.20
+ review_confidence * 0.15
+ semantic_match * 0.25
+ source_mentions * 0.15
+ neighborhood_relevance * 0.10
+ open_now * 0.05
+ user_preference_match * 0.10
```

## Example

| Café          | Google rating | Semantic match | Source mentions | mdeai score |
| ------------- | ------------: | -------------: | --------------: | ----------: |
| Pergamino     |           4.7 |             90 |              95 |          92 |
| Café Zeppelin |           4.6 |             88 |              80 |          86 |
| Café Noir     |           4.5 |             92 |              75 |          85 |

This makes “best” explainable, not just Google’s ranking.

---

# 7. Recommendation categories

| User asks                  | Ranking focus                           |
| -------------------------- | --------------------------------------- |
| best cafés for remote work | wifi, quiet, laptop, outlets            |
| best specialty coffee      | roaster, third-wave, coffee quality     |
| best brunch cafés          | food, seating, weekend vibe             |
| quiet cafés                | noise/vibe/source notes                 |
| cafés near nightlife       | location + evening hours                |
| best date cafés            | ambiance, design, outdoor seating       |
| local hidden gems          | source mentions + lower tourist density |
| cafés like Pergamino       | embedding similarity                    |

---

# 8. UI recommendations

Each card should show:

```text
[Photo]
Pergamino
★ 4.7 (2k reviews) · Specialty Coffee · $$

Best for: specialty coffee + working
Why: mentioned across coffee guides, high rating, strong laptop-friendly signals

Sources:
Featured in Eater / Desk to Dirtbag / local guide

Open in Google Maps
Get directions
Read reviews
```

Use short source labels, not long article dumps.

---

# 9. Quote/reference policy

Do **not** copy full article text.

Store:

| Field               | Safe use          |
| ------------------- | ----------------- |
| source URL          | ✅                 |
| publisher           | ✅                 |
| title               | ✅                 |
| short excerpt       | ✅ keep very short |
| paraphrased summary | ✅ best            |
| extracted tags      | ✅                 |
| full article body   | ❌ avoid           |

Best practice:

```text
Store paraphrased insights + citation URL.
Only display short references like “Mentioned by Eater”.
```

---

# 10. New tasks to create

| Task    | Title                     | Why important                            |
| ------- | ------------------------- | ---------------------------------------- |
| MAP-024 | mdeai Café Scoring Engine | rank beyond Google order                 |
| MAP-025 | Café pgvector Embeddings  | semantic search like “quiet laptop café” |
| MAP-026 | Café Source Ingestion     | collect article/blog signals             |
| MAP-027 | Café AI Profiles          | create “best for” summaries              |
| MAP-028 | Source Attribution UI     | show trust and citations                 |
| MAP-029 | Personalized Café Ranking | match user preferences                   |
| MAP-030 | Similar Cafés Engine      | “cafés like Pergamino”                   |

---

# Recommended implementation order

| Phase   | Task    | Outcome                |
| ------- | ------- | ---------------------- |
| MVP+1   | MAP-024 | explainable café score |
| MVP+1   | MAP-026 | source database        |
| MVP+2   | MAP-025 | semantic search        |
| MVP+2   | MAP-027 | café profile cards     |
| MVP+2   | MAP-028 | source/citation badges |
| Phase 2 | MAP-029 | personalization        |
| Phase 2 | MAP-030 | similarity engine      |

---

# Final recommendation

Build the café system like this:

```text
Google finds places.
Places API enriches details.
Articles explain vibe.
pgvector matches user intent.
mdeai scores and explains recommendations.
```

This turns mdeai from:

```text
Google Maps wrapper
```

into:

```text
AI local café intelligence engine
```

[1]: https://ai.google.dev/gemini-api/docs/google-search?utm_source=chatgpt.com "Grounding with Google Search - generateContent API"
[2]: https://www.eater.com/24121596/colombian-coffee-medellin-cafes-third-wave?utm_source=chatgpt.com "Medellín's Third-Wave Cafes Are Changing the Colombian ..."
[3]: https://www.tripadvisor.com/Restaurants-g297478-c8-Medellin_Antioquia_Department.html?utm_source=chatgpt.com "THE 10 BEST Cafés in Medellin (Updated 2026)"
