Below is a production-oriented audit and design for a **Medellín cafés intelligence system** that goes beyond map search and turns mdeai into a trust-first café discovery engine. The biggest shift is to treat cafés as a **multisignal knowledge graph**: Places data gives factual grounding, article/blog extraction gives vibe and qualitative nuance, embeddings power semantic matching, and user behavior re-ranks results over time. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

## Executive summary

Modern travel apps do not rank cafés by stars alone; they blend place facts, review volume, neighborhood context, semantic vibe matching, and user intent. For Medellín, the winning model is to separate **truth** from **taste**: use structured sources for facts, curated article signals for qualitative intelligence, and embeddings plus reranking for personalization. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)

What mdeai should do differently is build a café intelligence layer, not a list page. That means every café should have a canonical record, a source trail, extracted attributes, an AI-generated profile, and a rank score that explains *why* it is recommended. The architecture is strong, but I’d rate it **88/100** because the stack is already well aligned with pgvector, PostGIS, Gemini, and structured tool outputs; the main missing piece is a dedicated café intelligence schema and ranking pipeline. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

## Café intelligence factors

| Factor | Why it matters | Example | Structured DB or vector? | Weight suggestion |
|---|---|---:|---|---:|
| Specialty coffee | Core quality signal for coffee-focused users | Single-origin pour-over, washed Colombian lots | Both | 12 |
| Third-wave coffee | Distinguishes serious coffee shops from generic cafés | Roastery, tasting notes, barista-led quality | Both | 10 |
| Coworking friendly | Important for nomads and remote workers | Work tables, long-stay tolerance | Structured | 10 |
| Laptop friendly | Direct UX fit for work search | Outlets, seating, quiet norms | Structured | 8 |
| Fast Wi-Fi | High-frequency conversion factor | “Reliable Wi-Fi” or measured speed | Structured | 9 |
| Quiet | Strong preference for focused work or reading | Low music/noise, spacious layout | Vector + structured | 7 |
| Brunch | Major café discovery intent in Medellín | Full brunch menu | Structured | 6 |
| Aesthetic/interior | Drives social and date-spot discovery | Design-forward, photogenic space | Vector | 6 |
| Outdoor seating | Medellín climate makes this valuable | Terrace, patio, shaded tables | Structured | 5 |
| Digital nomad popularity | Social proof for remote-work suitability | Frequent mentions by nomad blogs | Structured | 6 |
| Local favorite | Strong trust and authenticity signal | Neighborhood regulars, not tourist-only | Vector + structured | 7 |
| Artisanal roasting | Quality and identity signal | In-house roast, small-lot sourcing | Structured | 8 |
| Social vibe | Important for meeting people | Lively, communal, conversation-friendly | Vector | 5 |
| Date spot | Discovery intent for couples | Cozy, attractive, dessert-forward | Vector | 4 |
| Pet friendly | Useful for lifestyle filtering | Pets allowed, water bowls | Structured | 3 |
| Neighborhood vibe | Often the real decision driver | Laureles calm, Poblado polished, Provenza busy | Vector + structured | 10 |

The strongest signals repeatedly appearing across the sources are specialty coffee quality, coworking suitability, neighborhood-specific vibe, laptop-friendly seating, brunch, and design/ambience. The sources also repeatedly frame Medellín cafés through the lens of digital nomads, third-wave coffee culture, and neighborhood identity, especially in El Poblado, Provenza, Laureles, and La Sierra. [theglobalcircle](https://www.theglobalcircle.com/laptop-friendly-cafes-to-remote-work-in-medellin-colombia/)

## Source analysis

| Source | Quality score | Local expertise score | SEO spam risk | Best extracted signals | Trustworthiness |
|---|---:|---:|---:|---|---|
| Gather Coffee story | 6 | 5 | 5 | Likely café narrative, café culture language | Medium |
| Tripadvisor Medellín cafés page | 8 | 4 | 4 | Breadth, popularity, review volume, ranking stability | High for popularity, weaker for nuance |
| Belmonte Penthouse | 7 | 8 | 4 | Neighborhood-by-neighborhood coworking and café context | High |
| Nomads Beyond | 7 | 8 | 5 | Laureles-specific café/work patterns | High |
| Half Half Travel | 7 | 6 | 4 | Traveler-friendly café selection and practical travel framing | High |
| Desk to Dirtbag | 7 | 7 | 5 | Ambience, laptop use, nomad fit | Medium-high |
| Sam and Kel’s Adventures | 7 | 6 | 5 | Coworking and café selection for travelers | Medium-high |
| 23 Hotel slow travel guide | 7 | 6 | 4 | Boutique, slow-travel, aesthetic signals | High |
| Eater | 9 | 5 | 2 | Third-wave coffee, producer relationships, coffee scene context | Very high |
| Dannybooboo | 6 | 8 | 5 | Neighborhood granularity, hidden gems, remote-work lens | Medium-high |
| Green Hills Coffee | 7 | 6 | 4 | Curated specialty café list, neighborhood clusters | High |
| The Wayward Road | 6 | 5 | 5 | General café discovery and traveler framing | Medium |
| Casa Col | 7 | 5 | 4 | Current 2026-style top cafés framing, practical listability | High-medium |
| Medellín.travel | 8 | 9 | 2 | Official tourism signal, local authority, tourism-safe framing | Very high |
| Medellín.com | 6 | 4 | 5 | Broad discovery, less authoritative on nuance | Medium |
| Wanderlog | 6 | 3 | 4 | Crowd-sourced density and consumer familiarity | Medium |
| Lemon8 | 4 | 3 | 6 | Social trend signal, but noisy and ephemeral | Low-medium |
| They Travelling | 5 | 4 | 5 | General traveler list, useful for breadth not depth | Medium |

The most trustworthy qualitative sources are Eater, Medellín.travel, and carefully written neighborhood guides with firsthand experience, because they provide context rather than just listicles. Tripadvisor is useful for ranking popularity and review count, but it should not drive “best café” claims on its own because it overweights generic mass appeal and underweights nuance. [eater](https://www.eater.com/24121596/colombian-coffee-medellin-cafes-third-wave)

## Suggested Supabase schema

Here is the schema direction I’d recommend for café intelligence, optimized for canonical records, source provenance, rich cards, and search/ranking. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)

### `cafes`
Canonical café entity.
- `id`
- `name`
- `slug`
- `place_id`
- `google_place_id`
- `lat`
- `lng`
- `address`
- `neighborhood_id`
- `primary_category`
- `price_level`
- `phone`
- `website`
- `hours_jsonb`
- `rating`
- `review_count`
- `photo_count`
- `is_open_now`
- `verified_status`
- `created_at`
- `updated_at`

### `cafe_sources`
Provenance table.
- `id`
- `cafe_id`
- `source_type` (`places`, `article`, `blog`, `review`, `manual`)
- `source_name`
- `source_url`
- `source_title`
- `published_at`
- `retrieved_at`
- `trust_score`
- `extraction_quality`
- `notes`

### `cafe_quotes`
Short paraphrased or quoted snippets allowed for attribution only.
- `id`
- `cafe_id`
- `source_id`
- `quote_type` (`summary`, `vibe`, `amenity`, `expert_note`)
- `text`
- `author`
- `published_at`
- `confidence`

### `cafe_tags`
Structured normalized tags.
- `cafe_id`
- `tag`
- `value`
- `confidence`
- `source_count`
- `last_seen_at`

Examples:
- `specialty_coffee`
- `coworking_friendly`
- `laptop_friendly`
- `quiet`
- `brunch`
- `outdoor_seating`
- `pet_friendly`
- `third_wave`
- `date_spot`
- `local_favorite`

### `cafe_neighborhoods`
Neighborhood-level intelligence.
- `id`
- `cafe_id`
- `neighborhood_id`
- `walkability_score`
- `noise_score`
- `nomad_density`
- `tourist_density`
- `coffee_scene_score`
- `last_updated_at`

### `cafe_photos`
Media records.
- `id`
- `cafe_id`
- `source_id`
- `url`
- `width`
- `height`
- `hash`
- `alt_text`
- `is_primary`
- `license_type`
- `created_at`

### `cafe_ai_profiles`
AI-generated, human-reviewed synopsis.
- `cafe_id`
- `profile_short`
- `profile_long`
- `best_for`
- `not_best_for`
- `vibe_summary`
- `confidence`
- `generated_at`
- `review_status`

### `cafe_embeddings`
One row per embedded object.
- `id`
- `cafe_id`
- `content_type` (`article_summary`, `vibe_summary`, `quote`, `neighborhood_profile`, `user_feedback`, `ai_profile`)
- `content_id`
- `embedding vector(...)`
- `source_id`
- `model`
- `chunk_index`
- `created_at`

### `cafe_rank_signals`
Deterministic scoring components.
- `cafe_id`
- `places_rating`
- `review_count`
- `article_mention_count`
- `source_diversity`
- `coworking_score`
- `wifi_score`
- `quiet_score`
- `specialty_score`
- `freshness_score`
- `popularity_score`
- `trust_score`
- `final_score`
- `score_breakdown_jsonb`
- `computed_at`

### `cafe_reviews_summary`
Aggregated review intelligence.
- `cafe_id`
- `summary_text`
- `pros_jsonb`
- `cons_jsonb`
- `sentiment_score`
- `common_topics_jsonb`
- `last_reviewed_at`

This separation keeps facts, opinions, and AI-generated interpretation from collapsing into one unsafe blob. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

## pgvector strategy

The best embedding targets are not raw pages; they are **atomic meaning units**. Embed:
- article summaries,
- café vibe descriptions,
- extracted quotes paraphrased into safe summaries,
- coworking/review summaries,
- neighborhood atmosphere descriptions,
- AI-generated café profiles,
- user preference vectors,
- query-intent examples like “quiet café for laptop work in Laureles”. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)

Use chunking by meaning, not by fixed paragraph size. For example, one chunk can be “work-friendly atmosphere,” another “coffee quality and sourcing,” another “brunch and seating,” and another “neighborhood vibe.” That gives better retrieval than embedding the entire article or café page as a single vector because each user query maps to a different intent surface. [producerroasterforum](https://producerroasterforum.com/exploring-the-specialty-coffee-scene-in-medellin-colombia/)

Similarity search should be hybrid:
- lexical filters first for neighborhood, open now, distance, price, and category,
- vector similarity second for vibe/intent match,
- reranker third for business rules, freshness, and trust. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

A good retrieval path is:
1. Generate intent embedding from the user query.
2. Fetch candidate cafés from filtered structured data.
3. Pull top similar embeddings from café profiles and article summaries.
4. Rerank with composite score and user preferences.
5. Produce an explainable response with source-backed reasons. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)

## AI ranking engine

The ranking engine should not imitate Google Maps. It should optimize for **fit**, **trust**, and **intent satisfaction**. A practical weighted formula is:

\[
FinalScore = 0.18 PlacesRating + 0.12 ReviewCountNorm + 0.16 SemanticMatch + 0.12 UserPreferenceMatch + 0.10 NeighborhoodFit + 0.10 SpecialtyFit + 0.08 CoworkingFit + 0.06 SourceConsensus + 0.05 Freshness + 0.05 Popularity + 0.03 TrustBonus - 0.15 Penalties
\]

The penalties should cover weak freshness, conflicting source signals, closed status, low trust, noisy tourist-only bias for certain intents, or missing core amenities for work-focused searches. mdeai already uses the right philosophy in rentals: deterministic ranker, pgvector, and user taste vectors, which should be copied here almost exactly for cafés. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

A better café ranking should include these signals:
- Places rating and review count for baseline popularity.
- Semantic match between query and café vibe/profile.
- Neighborhood fit for the user’s context.
- Source diversity and consensus.
- Specialization fit, such as specialty coffee versus brunch versus work.
- Freshness of signals and recent source activity.
- Personal preference alignment from saved items and clicks. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)

## Recommendation engine ideas

The recommendation engine should support intent modes, not just search. Examples:
- “best cafés for remote work” should emphasize wifi, seating, quiet, outlet access, and laptop tolerance.
- “best specialty coffee” should emphasize coffee quality, roast source, third-wave language, and expert article mentions.
- “quiet cafés near nightlife” should combine sound level, neighborhood, and distance constraints.
- “best brunch cafés” should prioritize menu depth and daylight-friendly vibe.
- “best date cafés” should favor aesthetics, dessert, ambiance, and evening suitability.
- “hidden local cafés” should favor local-favorite signals and lower tourist density.
- “cafés by neighborhood” should cluster by Laureles, Poblado, Provenza, Manila, La Sierra, etc.
- “cafés similar to Pergamino” should use café-to-café similarity based on embeddings and structured features. [greenhillscoffee](https://greenhillscoffee.co/en/blogs/world-of-speciality-coffee/the-10-best-cafes-in-medellin-colombia)

A strong pattern is to create **intent templates** that map query language to weighted features. That keeps the AI from hallucinating “best” and makes it explainable: “I ranked this high because it matches work-friendly + specialty coffee + Laureles calm vibe.”

## UX recommendations

Café cards should show both factual truth and interpretive value. I would show:
- name, neighborhood, rating, review count, hours, distance,
- chips like “Quiet,” “Laptop friendly,” “Fast Wi‑Fi,” “Specialty coffee,” “Brunch,” “Outdoor seating,”
- a short AI explanation,
- source badges like “Featured by Eater,” “Mentioned in 5 sources,” or “Popular in Laureles guides”. [medellinguru](https://medellinguru.com/guide-to-laureles/)

The explanation should always be evidence-backed and concise:
- “Matches your work setup: quiet, laptop-friendly, strong Wi‑Fi.”
- “Best fit for specialty coffee: repeated in third-wave coffee coverage.”
- “Neighborhood fit: calmer than Provenza, stronger local café scene in Laureles.”

Citations should appear as source badges or expandable references, not as raw article text. Show source labels like “Article sources,” “Places source,” and “User signals,” and on hover or expand reveal the references used to generate the recommendation. That preserves trust without violating copyright boundaries. [eater](https://www.eater.com/24121596/colombian-coffee-medellin-cafes-third-wave)

## Task breakdown

### MAP-024 — AI café scoring engine
- Goal: Build the composite score used for café ranking.
- Schema changes: `cafe_rank_signals`, score history table, maybe `ranking_explanations`.
- Vector strategy: query embedding + café profile embeddings + preference vector.
- API calls: ranking RPC, Places fetch, embeddings fetch, source lookup.
- UI changes: score chips, “Why this café” explanation.
- Tests: ranking unit tests, golden query sets, override/penalty tests.
- Rollout plan: shadow mode first, compare against Places sort.
- Rollback plan: fall back to rating + distance + open_now.

### MAP-025 — café embeddings + pgvector
- Goal: Store and query café semantic representations.
- Schema changes: `cafe_embeddings`, vector indexes, content chunk table.
- Vector strategy: embed summaries, vibes, quote summaries, user prefs.
- API calls: embed-on-write edge function, search RPC.
- UI changes: semantic search response labels.
- Tests: retrieval recall on labeled intent queries.
- Rollout plan: backfill top cafés first.
- Rollback plan: disable vector path, keep structured search.

### MAP-026 — neighborhood café intelligence
- Goal: Add neighborhood-level café context.
- Schema changes: `cafe_neighborhoods`, neighborhood aggregates.
- Vector strategy: neighborhood atmosphere embedding + cluster summaries.
- API calls: aggregate jobs from cafes and articles.
- UI changes: neighborhood comparison panels.
- Tests: district-level ranking and filter behavior.
- Rollout plan: start with Laureles, Poblado, Provenza.
- Rollback plan: hide neighborhood features if data is sparse.

### MAP-027 — AI café recommendation profiles
- Goal: Generate human-readable café profiles.
- Schema changes: `cafe_ai_profiles`, review queue.
- Vector strategy: profile embeddings for search and matching.
- API calls: generation from trusted summaries, moderation.
- UI changes: “Why we like it,” “Best for,” “Not best for.”
- Tests: hallucination checks, source coverage checks.
- Rollout plan: generate only for cafés with enough source consensus.
- Rollback plan: freeze profiles and show structured facts only.

### MAP-028 — source attribution system
- Goal: Make recommendation provenance visible.
- Schema changes: `cafe_sources`, `cafe_quotes`, attribution logs.
- Vector strategy: embed source summaries, not copied bodies.
- API calls: source retriever, citation formatter.
- UI changes: source chips and expandable references.
- Tests: attribution completeness, source freshness, duplication checks.
- Rollout plan: start with top 50 cafés.
- Rollback plan: fallback to Places-only attribution.

### MAP-029 — personalized café ranking
- Goal: Tailor ranking to each user.
- Schema changes: `user_taste_vectors` or café-specific preference vectors.
- Vector strategy: saved cafés, clicks, dwell, trip adds, query history.
- API calls: preference update job and re-ranking RPC.
- UI changes: “Because you like quiet cafés” hints.
- Tests: A/B on CTR, save rate, and conversion.
- Rollout plan: implicit feedback only at first.
- Rollback plan: disable personalization and use global rank.

### MAP-030 — café similarity engine
- Goal: Support “cafés similar to X.”
- Schema changes: similarity cache, related-cafés table.
- Vector strategy: café-to-café embedding similarity plus shared tags.
- API calls: nearest-neighbor search, cross-filter by neighborhood.
- UI changes: “Similar cafés nearby” module.
- Tests: human relevance judgments, cold-start handling.
- Rollout plan: seed with top 100 cafés.
- Rollback plan: return curated related cafés from tags only.

## Final roadmap

**MVP:** canonical café table, Places ingestion, source table, tags, basic embeddings, and a simple ranking RPC using rating, review count, distance, open status, and semantic match. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)
**P1:** article extraction pipeline, AI café profiles, source attribution UI, and neighborhood intelligence for Laureles/Poblado/Provenza. [producerroasterforum](https://producerroasterforum.com/exploring-the-specialty-coffee-scene-in-medellin-colombia/)
**P2:** personalized ranking, café similarity, and better reranking with user taste vectors and interaction history. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)
**Advanced AI concierge:** intent-mode routing, explainable recommendations, cross-surface trip planning, and neighborhood-aware discovery that feels closer to a premium travel concierge than a map search product. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

My strongest recommendation is to treat “best café” as a **decision system**, not a list. That will let mdeai outperform raw Google Maps by surfacing the right café for the right moment, with trust, context, and explainability built in from the start. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)