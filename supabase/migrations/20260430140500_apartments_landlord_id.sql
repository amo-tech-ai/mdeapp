-- migration: apartments_landlord_id   (DATA-050 / B2 — out-of-band column backfill)
--
-- WHY THIS FILE EXISTS
--   public.apartments.landlord_id and moderation_status were added in production via direct
--   SQL and never committed as ordered migrations. 20260501204538_landlord_v1_response_metrics
--   references apartments.landlord_id; data040 references moderation_status in a trigger WHEN.
--
-- ALREADY EXISTS IN PROD — register without re-running DDL:
--   supabase migration repair --status applied 20260430140500
BEGIN;

ALTER TABLE public.apartments
  ADD COLUMN IF NOT EXISTS landlord_id uuid
    REFERENCES public.landlord_profiles(id) ON DELETE SET NULL;

ALTER TABLE public.apartments
  ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'pending';

COMMIT;
