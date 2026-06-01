-- MASTRA-074: Places API (New) cache schema + TTL strategy
-- Reduces duplicate Text Search / Details calls, bounds cost, and gives
-- RLS boundaries for cached external data.
--
-- ToS note: Google Maps Platform ToS permits caching of Place responses
-- for up to 30 days. TTL defaults are set conservatively below.
-- See: https://developers.google.com/maps/documentation/places/web-service/usage-and-billing
--
-- 2026-05-14 fix: removed now() from partial index predicates (now() is STABLE
-- not IMMUTABLE; partial index predicates require IMMUTABLE functions).
-- 2026-05-14 fix: split FOR ALL policies into 4 separate policies per table
-- to comply with project RLS convention (supabase-rls-policies.md).

-- ─── Text/Nearby Search cache ─────────────────────────────────────────────────
-- Keyed by a hash of the query + location, holds the first-page API response.
-- TTL: 24–72 h (set to 48 h default; tune per usage in production).
CREATE TABLE IF NOT EXISTS public.places_search_cache (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- SHA-256(query_text || '|' || location_key) — unique per search intent
  query_hash   text        NOT NULL,
  query_text   text        NOT NULL,          -- human-readable for debugging
  location_key text        NOT NULL,          -- e.g. "6.2442,-75.5812,30000"
  payload      jsonb       NOT NULL,          -- raw Places API response array
  created_at   timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL DEFAULT (now() + interval '48 hours'),
  CONSTRAINT places_search_cache_query_hash_key UNIQUE (query_hash)
);

CREATE INDEX IF NOT EXISTS idx_places_search_cache_query_hash
  ON public.places_search_cache (query_hash);

-- Plain index (no partial predicate — now() is STABLE not IMMUTABLE;
-- using it in a partial index predicate breaks supabase db reset).
CREATE INDEX IF NOT EXISTS idx_places_search_cache_expires_at
  ON public.places_search_cache (expires_at);

-- ─── Place Details cache ──────────────────────────────────────────────────────
-- Keyed by Google Place ID. Stores the enriched details payload.
-- TTL: 7–14 d (set to 14 d default; tune in production).
CREATE TABLE IF NOT EXISTS public.place_details_cache (
  place_id        text        PRIMARY KEY,    -- Google Place ID (ChIJ…)
  display_name    text,                        -- places.displayName.text
  google_maps_uri text,                        -- places.googleMapsLinks.placeUri
  latitude        double precision,
  longitude       double precision,
  payload         jsonb       NOT NULL,        -- full getPlace response
  created_at      timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz NOT NULL DEFAULT (now() + interval '14 days')
);

-- Plain index (same reason — no now() in partial predicate).
CREATE INDEX IF NOT EXISTS idx_place_details_cache_expires_at
  ON public.place_details_cache (expires_at);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
-- Cache tables are internal; only service role reads/writes (enrichment scripts
-- and Mastra server). No authenticated-user SELECT needed at this stage.
-- Policies are split per operation (SELECT/INSERT/UPDATE/DELETE) per project
-- convention (supabase-rls-policies.md — no FOR ALL).
ALTER TABLE public.places_search_cache  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_details_cache  ENABLE ROW LEVEL SECURITY;

-- places_search_cache: 4 policies for service_role
CREATE POLICY "service_role_select_places_search_cache"
  ON public.places_search_cache
  FOR SELECT TO service_role
  USING (true);

CREATE POLICY "service_role_insert_places_search_cache"
  ON public.places_search_cache
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "service_role_update_places_search_cache"
  ON public.places_search_cache
  FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role_delete_places_search_cache"
  ON public.places_search_cache
  FOR DELETE TO service_role
  USING (true);

-- place_details_cache: 4 policies for service_role
CREATE POLICY "service_role_select_place_details_cache"
  ON public.place_details_cache
  FOR SELECT TO service_role
  USING (true);

CREATE POLICY "service_role_insert_place_details_cache"
  ON public.place_details_cache
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "service_role_update_place_details_cache"
  ON public.place_details_cache
  FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role_delete_place_details_cache"
  ON public.place_details_cache
  FOR DELETE TO service_role
  USING (true);

-- ─── maps_url + ai_summary columns on enrichment targets ──────────────────────
-- MASTRA-048: add maps_url and ai_summary to restaurants and tourist_destinations.
-- NOTE: google_place_id already exists in remote_schema (20260404044720).
--       maps_url stores the placeUri from googleMapsLinks (MASTRA-067 alignment).
--       ai_summary stores Gemini-generated venue descriptions (offline, not
--       Places generativeSummary which returns null for Colombian venues).

ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS maps_url   text,
  ADD COLUMN IF NOT EXISTS ai_summary text;

ALTER TABLE public.tourist_destinations
  ADD COLUMN IF NOT EXISTS maps_url   text,
  ADD COLUMN IF NOT EXISTS ai_summary text;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS maps_url   text;

-- Index maps_url for fast card rendering queries
CREATE INDEX IF NOT EXISTS idx_restaurants_maps_url
  ON public.restaurants (maps_url)
  WHERE maps_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tourist_destinations_maps_url
  ON public.tourist_destinations (maps_url)
  WHERE maps_url IS NOT NULL;

COMMENT ON COLUMN public.restaurants.maps_url IS
  'Canonical Google Maps deep link (placeUri from Places API googleMapsLinks). MASTRA-067/048.';
COMMENT ON COLUMN public.restaurants.ai_summary IS
  'Gemini-generated 2-sentence venue description. Cached at seeding time — NOT from Places generativeSummary (unavailable for Colombia). MASTRA-048.';
COMMENT ON COLUMN public.tourist_destinations.maps_url IS
  'Canonical Google Maps deep link (placeUri). MASTRA-067/048.';
COMMENT ON COLUMN public.tourist_destinations.ai_summary IS
  'Gemini-generated 2-sentence venue description. MASTRA-048.';
