-- =============================================================================
-- Migration: 20260509205216_pgvector_semantic_search.sql
-- Purpose:   Enable pgvector + embedding tables + HNSW indexes + semantic RPCs
-- Tables:    listing_embeddings, event_embeddings, restaurant_embeddings (new)
-- RPCs:      semantic_search_listings, semantic_search_events,
--            semantic_search_restaurants (new)
-- Depends:   apartments, events, restaurants tables (already exist)
-- =============================================================================

-- 1. Enable pgvector
create extension if not exists "vector" with schema extensions;

-- =============================================================================
-- 2. Embedding tables (768-dim, gemini-embedding-001)
-- =============================================================================

create table if not exists public.listing_embeddings (
  listing_id    uuid        primary key references public.apartments(id) on delete cascade,
  embedding     vector(768) not null,
  model         text        not null default 'gemini-embedding-001',
  content_hash  text        not null,
  updated_at    timestamptz not null default now()
);
comment on table public.listing_embeddings is
  'Gemini text embeddings for apartment listings. One row per apartment.';

create table if not exists public.event_embeddings (
  event_id      uuid        primary key references public.events(id) on delete cascade,
  embedding     vector(768) not null,
  model         text        not null default 'gemini-embedding-001',
  content_hash  text        not null,
  updated_at    timestamptz not null default now()
);
comment on table public.event_embeddings is
  'Gemini text embeddings for events. One row per event.';

create table if not exists public.restaurant_embeddings (
  restaurant_id uuid        primary key references public.restaurants(id) on delete cascade,
  embedding     vector(768) not null,
  model         text        not null default 'gemini-embedding-001',
  content_hash  text        not null,
  updated_at    timestamptz not null default now()
);
comment on table public.restaurant_embeddings is
  'Gemini text embeddings for restaurants. One row per restaurant.';

-- =============================================================================
-- 3. HNSW indexes — cosine similarity, tuned for 768-dim Gemini embeddings
--    m=16: 16 bi-directional links per node (quality/space tradeoff)
--    ef_construction=64: larger = better recall at index build, slower build
-- =============================================================================

create index if not exists listing_embeddings_hnsw
  on public.listing_embeddings
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

create index if not exists event_embeddings_hnsw
  on public.event_embeddings
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

create index if not exists restaurant_embeddings_hnsw
  on public.restaurant_embeddings
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- =============================================================================
-- 4. Enable RLS on all embedding tables
-- =============================================================================

alter table public.listing_embeddings    enable row level security;
alter table public.event_embeddings      enable row level security;
alter table public.restaurant_embeddings enable row level security;

-- listing_embeddings policies: anyone can read, only service role can write
drop policy if exists "Listing embeddings are readable by all" on public.listing_embeddings;
create policy "Listing embeddings are readable by all"
  on public.listing_embeddings for select
  to authenticated, anon
  using (true);

drop policy if exists "Service role can insert listing embeddings" on public.listing_embeddings;
create policy "Service role can insert listing embeddings"
  on public.listing_embeddings for insert
  to service_role
  with check (true);

drop policy if exists "Service role can update listing embeddings" on public.listing_embeddings;
create policy "Service role can update listing embeddings"
  on public.listing_embeddings for update
  to service_role
  using (true) with check (true);

drop policy if exists "Service role can delete listing embeddings" on public.listing_embeddings;
create policy "Service role can delete listing embeddings"
  on public.listing_embeddings for delete
  to service_role
  using (true);

-- event_embeddings policies
drop policy if exists "Event embeddings are readable by all" on public.event_embeddings;
create policy "Event embeddings are readable by all"
  on public.event_embeddings for select
  to authenticated, anon
  using (true);

drop policy if exists "Service role can insert event embeddings" on public.event_embeddings;
create policy "Service role can insert event embeddings"
  on public.event_embeddings for insert
  to service_role
  with check (true);

drop policy if exists "Service role can update event embeddings" on public.event_embeddings;
create policy "Service role can update event embeddings"
  on public.event_embeddings for update
  to service_role
  using (true) with check (true);

drop policy if exists "Service role can delete event embeddings" on public.event_embeddings;
create policy "Service role can delete event embeddings"
  on public.event_embeddings for delete
  to service_role
  using (true);

-- restaurant_embeddings policies
drop policy if exists "Restaurant embeddings are readable by all" on public.restaurant_embeddings;
create policy "Restaurant embeddings are readable by all"
  on public.restaurant_embeddings for select
  to authenticated, anon
  using (true);

drop policy if exists "Service role can insert restaurant embeddings" on public.restaurant_embeddings;
create policy "Service role can insert restaurant embeddings"
  on public.restaurant_embeddings for insert
  to service_role
  with check (true);

drop policy if exists "Service role can update restaurant embeddings" on public.restaurant_embeddings;
create policy "Service role can update restaurant embeddings"
  on public.restaurant_embeddings for update
  to service_role
  using (true) with check (true);

drop policy if exists "Service role can delete restaurant embeddings" on public.restaurant_embeddings;
create policy "Service role can delete restaurant embeddings"
  on public.restaurant_embeddings for delete
  to service_role
  using (true);

-- =============================================================================
-- 5. Semantic search RPCs
--    Accept a pre-computed query embedding; return matched entities + similarity.
--    Caller (ai-search edge fn) embeds the user query via Gemini then calls these.
-- =============================================================================

do $do$ begin
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                  where p.proname = 'semantic_search_listings' and n.nspname = 'public') then
    execute $e$
      create or replace function public.semantic_search_listings(
  query_embedding  vector(768),
  similarity_threshold float8 default 0.6,
  match_count      int    default 20
)
returns table (
  id            uuid,
  title         text,
  description   text,
  neighborhood  text,
  city          text,
  price_monthly numeric,
  bedrooms      int,
  bathrooms     numeric,
  rating        numeric,
  images        text[],
  amenities     text[],
  pet_friendly  boolean,
  furnished     boolean,
  status        text,
  similarity    float8
)
language sql stable security invoker
set search_path = ''
as $fn$
  select
    a.id,
    a.title,
    a.description,
    a.neighborhood,
    a.city,
    a.price_monthly,
    a.bedrooms,
    a.bathrooms,
    a.rating,
    a.images,
    a.amenities,
    a.pet_friendly,
    a.furnished,
    a.status,
    (1 - (le.embedding operator(extensions.<=>) query_embedding))::float8 as similarity
  from public.apartments a
  inner join public.listing_embeddings le on le.listing_id = a.id
  where a.status = 'active'
    and (1 - (le.embedding operator(extensions.<=>) query_embedding)) > similarity_threshold
  order by le.embedding operator(extensions.<=>) query_embedding
  limit match_count;
$fn$;
    $e$;
  end if;
end $do$;

do $do$ begin
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                  where p.proname = 'semantic_search_events' and n.nspname = 'public') then
    execute $e$
      create or replace function public.semantic_search_events(
  query_embedding  vector(768),
  similarity_threshold float8 default 0.6,
  match_count      int    default 20
)
returns table (
  id                 uuid,
  name               text,
  description        text,
  event_type         text,
  address            text,
  event_start_time   timestamptz,
  ticket_price_min   numeric,
  rating             numeric,
  primary_image_url  text,
  tags               text[],
  similarity         float8
)
language sql stable security invoker
set search_path = ''
as $fn$
  select
    e.id,
    e.name,
    e.description,
    e.event_type,
    e.address,
    e.event_start_time,
    e.ticket_price_min,
    e.rating,
    e.primary_image_url,
    e.tags,
    (1 - (ee.embedding operator(extensions.<=>) query_embedding))::float8 as similarity
  from public.events e
  inner join public.event_embeddings ee on ee.event_id = e.id
  where e.is_active = true
    and e.event_start_time > now()
    and (1 - (ee.embedding operator(extensions.<=>) query_embedding)) > similarity_threshold
  order by ee.embedding operator(extensions.<=>) query_embedding
  limit match_count;
$fn$;
    $e$;
  end if;
end $do$;

do $do$ begin
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                  where p.proname = 'semantic_search_restaurants' and n.nspname = 'public') then
    execute $e$
      create or replace function public.semantic_search_restaurants(
  query_embedding  vector(768),
  similarity_threshold float8 default 0.6,
  match_count      int    default 20
)
returns table (
  id                 uuid,
  name               text,
  description        text,
  cuisine_types      text[],
  address            text,
  city               text,
  price_level        int,
  rating             numeric,
  primary_image_url  text,
  dietary_options    text[],
  ambiance           text[],
  similarity         float8
)
language sql stable security invoker
set search_path = ''
as $fn$
  select
    r.id,
    r.name,
    r.description,
    r.cuisine_types,
    r.address,
    r.city,
    r.price_level,
    r.rating,
    r.primary_image_url,
    r.dietary_options,
    r.ambiance,
    (1 - (re.embedding operator(extensions.<=>) query_embedding))::float8 as similarity
  from public.restaurants r
  inner join public.restaurant_embeddings re on re.restaurant_id = r.id
  where r.is_active = true
    and (1 - (re.embedding operator(extensions.<=>) query_embedding)) > similarity_threshold
  order by re.embedding operator(extensions.<=>) query_embedding
  limit match_count;
$fn$;
    $e$;
  end if;
end $do$;

-- =============================================================================
-- 6. updated_at maintenance triggers
-- =============================================================================

create or replace function public.touch_embedding_updated_at()
returns trigger
language plpgsql security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists listing_embeddings_updated_at on public.listing_embeddings;
create trigger listing_embeddings_updated_at
  before update on public.listing_embeddings
  for each row execute function public.touch_embedding_updated_at();

drop trigger if exists event_embeddings_updated_at on public.event_embeddings;
create trigger event_embeddings_updated_at
  before update on public.event_embeddings
  for each row execute function public.touch_embedding_updated_at();

drop trigger if exists restaurant_embeddings_updated_at on public.restaurant_embeddings;
create trigger restaurant_embeddings_updated_at
  before update on public.restaurant_embeddings
  for each row execute function public.touch_embedding_updated_at();
