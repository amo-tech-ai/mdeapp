-- migration: restore_post_mvp_landlord_stack
-- Split (DATA-048) from combined 20260524140000_restore_post_mvp_landlord_sponsor_whatsapp.sql.
-- Matches remote supabase_migrations.schema_migrations version 20260524024015. SQL body verbatim; no content change.
BEGIN;
-- Restore post-MVP tables wrongly dropped by mdeapp_canonical_schema_cleanup.
-- Policy: keep post-MVP schema even when MVP does not query it.
-- Skips: trips/collections FKs (trip planner not restored), conversations FKs (legacy chat dropped).



-- =============================================================================
-- 1. Landlord profiles + public view
-- =============================================================================

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

CREATE INDEX IF NOT EXISTS landlord_profiles_user_idx ON public.landlord_profiles(user_id);
CREATE INDEX IF NOT EXISTS landlord_profiles_status_idx ON public.landlord_profiles(verification_status);

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

CREATE OR REPLACE VIEW public.landlord_profiles_public
WITH (security_invoker = true)
AS
SELECT
  id,
  display_name,
  avatar_url,
  bio,
  primary_neighborhood,
  languages,
  verification_status = 'approved' AS is_verified,
  verified_at,
  active_listings,
  total_leads_received,
  median_response_time_minutes
FROM public.landlord_profiles
WHERE verification_status IN ('approved', 'pending');

GRANT SELECT ON public.landlord_profiles_public TO anon, authenticated, service_role;

DO $do$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'apartments_landlord_id_fkey'
      AND conrelid = 'public.apartments'::regclass
  ) THEN
    ALTER TABLE public.apartments
      ADD CONSTRAINT apartments_landlord_id_fkey
      FOREIGN KEY (landlord_id) REFERENCES public.landlord_profiles(id) ON DELETE SET NULL;
  END IF;
END $do$;

CREATE INDEX IF NOT EXISTS idx_apartments_landlord_id
  ON public.apartments(landlord_id)
  WHERE landlord_id IS NOT NULL;

-- =============================================================================
-- 2. Landlord inbox + events
-- =============================================================================

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

CREATE OR REPLACE FUNCTION public.acting_landlord_ids()
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id FROM public.landlord_profiles WHERE user_id = (SELECT auth.uid());
$$;

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
COMMIT;
