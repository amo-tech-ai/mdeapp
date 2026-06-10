-- migration: landlord_v1_base_tables   (DATA-050 / B1 — out-of-band base-table backfill)
--
-- WHY THIS FILE EXISTS
--   landlord_profiles, landlord_inbox, landlord_inbox_events and analytics_events_daily
--   were created in PRODUCTION via direct SQL in early sprints and never committed as
--   ordered migrations. A LATER migration — 20260501204538_landlord_v1_response_metrics.sql
--   — references public.landlord_inbox, so a from-scratch shadow replay
--   (`supabase db diff --from migrations`) aborts with:
--       ERROR: relation "public.landlord_inbox" does not exist (SQLSTATE 42P01)
--   This migration creates those base objects with a 14-digit prefix that sorts BEFORE
--   20260501204538, restoring a clean, reproducible from-scratch replay.
--
-- ALREADY EXISTS IN PROD — DO NOT `supabase db push` THIS FILE.
--   These objects already exist in the live database. Register this version in remote
--   history WITHOUT re-running the DDL (gated on explicit human approval — DATA-050):
--       supabase migration repair --status applied 20260430140000
--
-- SOURCE OF DDL
--   Scoped, read-only `pg_dump --schema-only` of exactly these four tables against the
--   live schema (2026-06-01); transcribed into the repo's idempotent restore-migration
--   style. The two existing "restore" migrations are fully idempotent, so once these
--   objects exist they no-op / replace cleanly:
--     · 20260524024015_restore_post_mvp_landlord_stack.sql        (profiles, inbox, events)
--     · 20260524024105_restore_post_mvp_verification_analytics.sql (analytics_events_daily)
--
-- DEPENDENCY NOTES
--   · public.update_updated_at() and public.is_admin() already exist here — both are
--     created by 20260404044720_remote_schema.sql, which replays first.
--   · public.acting_landlord_ids() is defined only in the later 20260524024015, so the
--     inbox/analytics policies below would not resolve it yet. It is (re)created here,
--     after landlord_profiles (which its body reads), ahead of those policies.
--   · public.apartments and auth.users already exist (remote_schema / Supabase auth).
--   · The landlord_profiles_public view and the apartments_landlord_id_fkey constraint
--     are intentionally NOT recreated here — they are not needed to satisfy the early
--     reference and remain owned by 20260524024015.
BEGIN;

-- 1. landlord_profiles --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.landlord_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'individual'
    CHECK (kind IN ('individual', 'agent', 'property_manager')),
  display_name text NOT NULL,
  whatsapp_e164 text,
  phone_e164 text,
  bio text,
  avatar_url text,
  primary_neighborhood text,
  languages text[] DEFAULT ARRAY['es']::text[],
  verification_status text NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verified_at timestamptz,
  total_listings integer DEFAULT 0,
  active_listings integer DEFAULT 0,
  total_leads_received integer DEFAULT 0,
  total_replies_sent integer DEFAULT 0,
  median_response_time_minutes integer,
  notes text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS landlord_profiles_status_idx
  ON public.landlord_profiles(verification_status);

DROP TRIGGER IF EXISTS landlord_profiles_updated_at ON public.landlord_profiles;
CREATE TRIGGER landlord_profiles_updated_at
  BEFORE UPDATE ON public.landlord_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.landlord_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_manage_landlord_profiles ON public.landlord_profiles;
CREATE POLICY service_role_manage_landlord_profiles
  ON public.landlord_profiles FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS landlords_view_own_profile ON public.landlord_profiles;
CREATE POLICY landlords_view_own_profile
  ON public.landlord_profiles FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS landlords_update_own_profile ON public.landlord_profiles;
CREATE POLICY landlords_update_own_profile
  ON public.landlord_profiles FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS landlords_insert_own_profile ON public.landlord_profiles;
CREATE POLICY landlords_insert_own_profile
  ON public.landlord_profiles FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

GRANT ALL ON TABLE public.landlord_profiles TO anon, authenticated, service_role;

-- 2. acting_landlord_ids() — required by the inbox/analytics policies below ----
CREATE OR REPLACE FUNCTION public.acting_landlord_ids()
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id FROM public.landlord_profiles WHERE user_id = (SELECT auth.uid());
$$;

-- 3. landlord_inbox -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.landlord_inbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL DEFAULT 'chat'
    CHECK (channel IN ('chat', 'form', 'whatsapp', 'admin_manual')),
  conversation_id uuid,
  renter_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  renter_name text,
  renter_phone_e164 text,
  renter_email text,
  apartment_id uuid REFERENCES public.apartments(id) ON DELETE SET NULL,
  landlord_id uuid REFERENCES public.landlord_profiles(id) ON DELETE SET NULL,
  raw_message text NOT NULL,
  structured_profile jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'viewed', 'replied', 'archived', 'spam')),
  viewed_at timestamptz,
  first_reply_at timestamptz,
  archived_at timestamptz,
  archived_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS landlord_inbox_landlord_status_idx
  ON public.landlord_inbox(landlord_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS landlord_inbox_apartment_idx
  ON public.landlord_inbox(apartment_id, created_at DESC)
  WHERE apartment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS landlord_inbox_renter_idx
  ON public.landlord_inbox(renter_id, created_at DESC)
  WHERE renter_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_landlord_inbox_landlord_id
  ON public.landlord_inbox(landlord_id);
CREATE INDEX IF NOT EXISTS idx_landlord_inbox_created_at
  ON public.landlord_inbox(created_at);

DROP TRIGGER IF EXISTS landlord_inbox_updated_at ON public.landlord_inbox;
CREATE TRIGGER landlord_inbox_updated_at
  BEFORE UPDATE ON public.landlord_inbox
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.landlord_inbox ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_manage_landlord_inbox ON public.landlord_inbox;
CREATE POLICY service_role_manage_landlord_inbox
  ON public.landlord_inbox FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS landlord_inbox_select ON public.landlord_inbox;
CREATE POLICY landlord_inbox_select ON public.landlord_inbox FOR SELECT TO authenticated
  USING (
    landlord_id IN (SELECT public.acting_landlord_ids())
    OR renter_id = (SELECT auth.uid())
    OR (SELECT public.is_admin())
  );

DROP POLICY IF EXISTS landlord_inbox_update ON public.landlord_inbox;
CREATE POLICY landlord_inbox_update ON public.landlord_inbox FOR UPDATE TO authenticated
  USING (landlord_id IN (SELECT public.acting_landlord_ids()) OR (SELECT public.is_admin()))
  WITH CHECK (landlord_id IN (SELECT public.acting_landlord_ids()) OR (SELECT public.is_admin()));

GRANT ALL ON TABLE public.landlord_inbox TO anon, authenticated, service_role;

-- 4. landlord_inbox_events ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.landlord_inbox_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inbox_id uuid NOT NULL REFERENCES public.landlord_inbox(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN (
    'created', 'viewed', 'whatsapp_clicked', 'marked_replied',
    'archived', 'spam_marked', 'reopened', 'admin_assigned'
  )),
  actor_user_id uuid REFERENCES auth.users(id),
  actor_kind text CHECK (actor_kind IN ('renter', 'landlord', 'admin', 'system')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS landlord_inbox_events_inbox_idx
  ON public.landlord_inbox_events(inbox_id, created_at DESC);
CREATE INDEX IF NOT EXISTS landlord_inbox_events_type_time_idx
  ON public.landlord_inbox_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS landlord_inbox_events_actor_idx
  ON public.landlord_inbox_events(actor_user_id)
  WHERE actor_user_id IS NOT NULL;

ALTER TABLE public.landlord_inbox_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_manage_landlord_inbox_events ON public.landlord_inbox_events;
CREATE POLICY service_role_manage_landlord_inbox_events
  ON public.landlord_inbox_events FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS landlord_inbox_events_select ON public.landlord_inbox_events;
CREATE POLICY landlord_inbox_events_select ON public.landlord_inbox_events FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.landlord_inbox li
      WHERE li.id = landlord_inbox_events.inbox_id
        AND (
          li.landlord_id IN (SELECT public.acting_landlord_ids())
          OR li.renter_id = (SELECT auth.uid())
        )
    )
    OR (SELECT public.is_admin())
  );

GRANT ALL ON TABLE public.landlord_inbox_events TO anon, authenticated, service_role;

-- 5. analytics_events_daily ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events_daily (
  landlord_id uuid NOT NULL REFERENCES public.landlord_profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  logins integer DEFAULT 0,
  listings_created integer DEFAULT 0,
  listings_edited integer DEFAULT 0,
  leads_received integer DEFAULT 0,
  leads_viewed integer DEFAULT 0,
  whatsapp_clicks integer DEFAULT 0,
  replies_marked integer DEFAULT 0,
  affiliate_revenue_cents integer DEFAULT 0,
  PRIMARY KEY (landlord_id, date)
);

CREATE INDEX IF NOT EXISTS analytics_events_daily_date_idx
  ON public.analytics_events_daily(date DESC);

ALTER TABLE public.analytics_events_daily ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_manage_analytics_events_daily ON public.analytics_events_daily;
CREATE POLICY service_role_manage_analytics_events_daily
  ON public.analytics_events_daily FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS landlords_view_own_analytics ON public.analytics_events_daily;
CREATE POLICY landlords_view_own_analytics
  ON public.analytics_events_daily FOR SELECT TO authenticated
  USING (landlord_id IN (SELECT public.acting_landlord_ids()));

GRANT ALL ON TABLE public.analytics_events_daily TO anon, authenticated, service_role;

COMMIT;
