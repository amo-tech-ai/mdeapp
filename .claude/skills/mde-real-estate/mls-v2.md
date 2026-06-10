---
name: real-estate-tech
description: "Use when extending mdeai.co beyond V1 single-listing manual entry into MLS / IDX / multi-source aggregation, geospatial search at scale, or automated property valuation. V1 currently manual; this skill is V2+ prep. Triggers: 'MLS', 'IDX', 'RETS', 'RESO Web API', 'comparable sales', 'AVM', 'PostGIS clustering', 'listing dedup', 'faceted search', 'property valuation'. Source: rohitg00/awesome-claude-code-toolkit (real-estate-tech)."
metadata:
  source: https://github.com/rohitg00/awesome-claude-code-toolkit/blob/main/agents/specialized-domains/real-estate-tech.md
  installed: 2026-04-29
  version: "0.1.0"
  origin: external + mdeai.co adaptations
  scope: V2+ (V1 is manual single-listing — see real-estate skill for V1)
---

# Real-estate platform engineering — mdeai.co (V2+)

Companion to the V1 `real-estate` skill (which covers manual single-listing flows). This skill is the **V2+ ramp** when we move from "founder onboards 20 landlords" to "platform aggregates from MLS / IDX / multiple sources."

## When to invoke

- MLS / IDX / RETS / RESO Web API integration
- Multi-source listing dedup (we'll get duplicate listings from Zillow + Realtor.com + MLS for the same property)
- Geospatial search at scale (1000+ listings — `MarkerClusterer` client-side breaks)
- Automated valuation models (AVM) using comparable sales
- Faceted search API (price + beds + amenities + neighborhood, fast)
- Property photo media pipeline (transcode, watermark, deliver)
- Saved-search notification engine (renter saves criteria → daily new-match emails)

## V1 vs V2 boundary

**V1 (today, plan §1.1):** landlords manually upload via `/host/listings/new` wizard. ~50 listings target. Client-side `MarkerClusterer`. No external data. Use the `real-estate` skill, not this one.

**V2 (post-Day-30 cohort review):** if data shows we need supply at scale, this skill kicks in. Estimated: 1000+ listings via partial scraping, server-side clustering, comparable-sales pricing recommendations.

Do NOT invoke this skill for V1 work — it'll over-architect the simple flow.

## Architecture pillars (V2)

### 1. Data ingestion (RETS / RESO Web API)

- RETS = older REPL-style API; many MLS still serve only this
- RESO Web API = JSON / OData modern replacement (RESO 2.0 forward)
- Use a vendor like Spark Platform (Trestle) or RESO's RealHub to abstract per-MLS quirks
- Stream into Supabase via an edge fn `ingest-listing` with idempotency on `(mls_id, listing_id)`

### 2. Deduplication

- Address normalization first (USPS for US; libpostal for COL/intl)
- Generate `listing_signature = sha256(addr_normalized + bedrooms + sqm + price)`
- Same signature within 30 days = same listing — keep the freshest source
- Cross-source: prefer the MLS source over Zillow / Realtor scrapers

### 3. PostGIS geospatial at scale

V1 stores lat/lng as `numeric` columns. V2 needs:
- `apartments.geog GEOGRAPHY(POINT, 4326)` populated by trigger on lat/lng change
- `GIST` index on `geog`
- Server-side cluster query: `ST_ClusterDBSCAN(geog, eps_in_meters, minpoints) OVER ()` returns cluster_id per point
- Bounding-box query: `ST_Within(geog, ST_MakeEnvelope(...))`

Existing tasks/todo.md item `D1 — Server-side pin clustering` is exactly this.

### 4. Automated valuation (AVM)

- Comparable sales: 5+ closed listings within 1 km, ±20% sqm, ±2 beds, last 12 months
- Naive AVM: median price per sqm × subject sqm
- Better: GBM regression on (sqm, beds, baths, age, neighborhood, freshness) → trained nightly on `apartments` history
- Don't ship AVM until cohort data shows landlords WANT pricing recommendations (V1 explicitly defers per plan §1.2)

### 5. Faceted search

- Postgres GIN on `(neighborhood, bedrooms, price_monthly, amenities)` for filter
- pg_trgm on `title + description` for full-text
- For 10k+ listings, escalate to Elasticsearch / Typesense — not before

## V2 task triggers (when to actually invoke)

When `tasks/todo.md` Phase D items get scheduled:
- **D1 — Server-side pin clustering** → this skill's pillar 3
- **D6 — Heatmap overlay** → this skill's pillar 5 (geospatial aggregation)
- Any "AI pricing" feature → this skill's pillar 4

## Companion skills

- `real-estate` (V1 single-listing flows — DO NOT skip even when in V2)
- `firecrawl-scraper` (already installed — for non-MLS scraping like Airbnb / Booking.com listings)
- `supabase-postgres-best-practices` (for PostGIS + GIN index advice)
- `gemini` (AVM / description-quality scoring)

## Source

Adapted from [awesome-claude-code-toolkit / real-estate-tech](https://github.com/rohitg00/awesome-claude-code-toolkit/blob/main/agents/specialized-domains/real-estate-tech.md). The original is platform-generic; this version is anchored to the mdeai.co V1→V2 boundary.
