-- MAP-018E: field_mask_version + photo_name_primary on place_details_cache
-- Extends MASTRA-074 schema (20260515043737_places_cache_schema.sql).

ALTER TABLE public.place_details_cache
  ADD COLUMN IF NOT EXISTS field_mask_version text NOT NULL DEFAULT 'legacy',
  ADD COLUMN IF NOT EXISTS photo_name_primary text;

ALTER TABLE public.place_details_cache DROP CONSTRAINT IF EXISTS place_details_cache_pkey;

ALTER TABLE public.place_details_cache
  ADD CONSTRAINT place_details_cache_pkey PRIMARY KEY (place_id, field_mask_version);

CREATE INDEX IF NOT EXISTS idx_place_details_cache_mask_expires
  ON public.place_details_cache (field_mask_version, expires_at);

ALTER TABLE public.place_details_cache
  ALTER COLUMN expires_at SET DEFAULT (now() + interval '7 days');

COMMENT ON COLUMN public.place_details_cache.field_mask_version IS
  'Sync with PLACE_DETAILS_FIELD_MASK_VERSION (google-places-client.ts / places_enrich.py).';
COMMENT ON COLUMN public.place_details_cache.photo_name_primary IS
  'photos[0].name from Place Details — avoids re-parsing payload for photo proxy.';
