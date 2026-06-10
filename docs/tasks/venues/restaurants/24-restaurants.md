Not bad — **good base schema**, but not enough for “restaurant intelligence” yet.

## Score

| Area                        |  Score |
| --------------------------- | -----: |
| Basic restaurant catalog    | 86/100 |
| Google Places compatibility | 82/100 |
| Search/filtering            | 80/100 |
| AI intelligence             | 55/100 |
| Booking readiness           | 45/100 |
| pgvector readiness          | 60/100 |
| Production safety           | 72/100 |

Overall: **74/100**

## What is good

| Good                                       | Why                            |
| ------------------------------------------ | ------------------------------ |
| `google_place_id` unique                   | Correct source-of-truth anchor |
| `latitude` / `longitude`                   | Good for map pins              |
| `cuisine_types`, `tags`, `ambiance` arrays | Useful for filters             |
| `fts_content`                              | Good for keyword search        |
| `rating`, `rating_count`                   | Basic ranking                  |
| `data_freshness`, `cache_expires_at`       | Good for Places caching        |
| `ai_summary`                               | Useful for card/detail copy    |
| `trigger_ai_embed()`                       | Good direction for embeddings  |

## Main problems

| Problem                                        | Severity | Fix                                                               |
| ---------------------------------------------- | -------: | ----------------------------------------------------------------- |
| `price_level` is required                      |     High | Make nullable. Google may not return it.                          |
| `hours_of_operation` is required               |   Medium | Make nullable or keep default `{}` but add `hours_source`.        |
| No neighborhood field                          |     High | Add `neighborhood`, example: Laureles, Provenza, Manila.          |
| No booking fields                              |     High | Add booking/contact strategy or separate booking table.           |
| No source evidence table                       |     High | Need provenance for AI trust.                                     |
| No review intelligence                         |     High | Need summaries/signals from reviews.                              |
| No venue signals table                         | Critical | This is the “AI advantage.”                                       |
| Embedding trigger is too broad                 |   Medium | Avoid embedding every small update automatically. Use jobs queue. |
| `ai_generated` as source                       |    Risky | Rename to `ai_enriched`; never let AI be canonical source.        |
| Numeric lat/lng works, but geography is better |   Medium | Add PostGIS `geography(Point,4326)` later.                        |

## Biggest missing table

You need this:

```sql
create table public.restaurant_signals (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,

  quiet_score numeric(4,3),
  date_night_score numeric(4,3),
  digital_nomad_score numeric(4,3),
  local_authenticity_score numeric(4,3),
  touristy_score numeric(4,3),
  cocktail_score numeric(4,3),
  brunch_score numeric(4,3),
  nightlife_score numeric(4,3),
  value_score numeric(4,3),
  service_score numeric(4,3),

  evidence jsonb not null default '{}'::jsonb,
  source text not null default 'ai_review_summary',
  confidence numeric(4,3) not null default 0.5,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

This powers queries like:

```text
quiet date-night restaurant in Provenza
```

## Add source evidence

```sql
create table public.restaurant_source_evidence (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,

  source_type text not null,
  source_url text,
  source_title text,
  extracted_text text,
  confidence numeric(4,3) default 0.5,
  checked_at timestamptz default now(),

  created_at timestamptz default now()
);
```

Use for:

* Google
* website
* Instagram
* menu
* blog
* Reddit
* Tripadvisor
* OpenClaw draft

## Add documents for embeddings

```sql
create table public.restaurant_documents (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,

  document_type text not null,
  content text not null,
  summary text,
  metadata jsonb default '{}',
  source_url text,
  created_at timestamptz default now()
);
```

## Add vector table

Better than embedding directly on `restaurants`:

```sql
create table public.restaurant_embeddings (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  content_type text not null,
  content text not null,
  embedding vector(768),
  metadata jsonb default '{}',
  created_at timestamptz default now()
);
```

## Recommended changes to current table

Add:

```sql
alter table public.restaurants
add column if not exists neighborhood text,
add column if not exists place_types text[] default '{}',
add column if not exists google_rating numeric(3,2),
add column if not exists google_rating_count integer,
add column if not exists booking_url text,
add column if not exists booking_method text,
add column if not exists whatsapp text,
add column if not exists instagram text,
add column if not exists source_confidence numeric(4,3) default 0.5,
add column if not exists facts_checked_at timestamptz default now(),
add column if not exists intelligence_summary text,
add column if not exists best_for text[] default '{}',
add column if not exists not_ideal_for text[] default '{}';
```

Make `price_level` safer:

```sql
alter table public.restaurants
alter column price_level drop not null;
```

## Best practice: do not auto-embed directly on every update

This trigger is risky:

```sql
trigger_ai_embed()
```

Better pattern:

```text
restaurant updated
→ create embedding_jobs row
→ worker generates embedding
→ update restaurant_embeddings
```

Why:

* avoids slow writes
* avoids duplicate embeddings
* easier retry
* easier model changes
* safer cost control

## Best final structure

| Layer         | Table                        |
| ------------- | ---------------------------- |
| Facts         | `restaurants`                |
| Intelligence  | `restaurant_signals`         |
| Evidence      | `restaurant_source_evidence` |
| Raw text      | `restaurant_documents`       |
| Vector search | `restaurant_embeddings`      |
| Booking       | `venue_booking_requests`     |
| WhatsApp      | `wa_outbox`                  |

## Final verdict

Your `restaurants` table is a **good catalog table**.

But for mdeai’s competitive advantage, add:

```text
signals + evidence + documents + embeddings + booking requests
```

That turns it from:

```text
restaurant directory
```

into:

```text
restaurant intelligence system
```
