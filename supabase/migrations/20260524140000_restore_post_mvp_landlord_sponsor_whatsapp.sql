-- Restore post-MVP tables wrongly dropped by mdeapp_canonical_schema_cleanup.
-- Applied live as: restore_post_mvp_landlord_stack + verification_analytics + saved_places_bookings + sponsor_whatsapp
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



CREATE TABLE IF NOT EXISTS public.verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL REFERENCES public.landlord_profiles(id) ON DELETE CASCADE,
  doc_kind text NOT NULL CHECK (doc_kind IN (
    'national_id', 'passport', 'rut', 'property_deed', 'utility_bill'
  )),
  storage_path text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  rejection_reason text,
  expires_at timestamptz,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS verification_requests_landlord_idx ON public.verification_requests(landlord_id);
CREATE INDEX IF NOT EXISTS verification_requests_pending_idx ON public.verification_requests(uploaded_at DESC) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS verification_requests_reviewed_by_idx ON public.verification_requests(reviewed_by) WHERE reviewed_by IS NOT NULL;

ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS verification_requests_select_own ON public.verification_requests;
CREATE POLICY verification_requests_select_own ON public.verification_requests FOR SELECT TO authenticated
  USING (landlord_id IN (SELECT public.acting_landlord_ids()) OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS verification_requests_insert_own ON public.verification_requests;
CREATE POLICY verification_requests_insert_own ON public.verification_requests FOR INSERT TO authenticated
  WITH CHECK (landlord_id IN (SELECT public.acting_landlord_ids()));

DROP POLICY IF EXISTS verification_requests_service_role ON public.verification_requests;
CREATE POLICY verification_requests_service_role ON public.verification_requests TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.verification_requests TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.property_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id uuid NOT NULL REFERENCES public.apartments(id) ON DELETE CASCADE,
  verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  verified_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT property_verifications_one_per_listing UNIQUE (apartment_id),
  CONSTRAINT property_verifications_status_check CHECK (
    status = ANY (ARRAY['pending', 'verified', 'rejected', 'revoked']::text[])
  )
);

CREATE INDEX IF NOT EXISTS idx_property_verifications_apartment_id ON public.property_verifications(apartment_id);
CREATE INDEX IF NOT EXISTS idx_property_verifications_status ON public.property_verifications(status);
CREATE INDEX IF NOT EXISTS idx_property_verifications_verified_by ON public.property_verifications(verified_by);

DROP TRIGGER IF EXISTS property_verifications_updated_at ON public.property_verifications;
CREATE TRIGGER property_verifications_updated_at
  BEFORE UPDATE ON public.property_verifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.property_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS property_verifications_select_all ON public.property_verifications;
CREATE POLICY property_verifications_select_all ON public.property_verifications FOR SELECT USING (true);
DROP POLICY IF EXISTS property_verifications_insert_admin ON public.property_verifications;
CREATE POLICY property_verifications_insert_admin ON public.property_verifications FOR INSERT TO authenticated WITH CHECK ((SELECT public.is_admin()));
DROP POLICY IF EXISTS property_verifications_update_admin ON public.property_verifications;
CREATE POLICY property_verifications_update_admin ON public.property_verifications FOR UPDATE TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));
DROP POLICY IF EXISTS property_verifications_delete_admin ON public.property_verifications;
CREATE POLICY property_verifications_delete_admin ON public.property_verifications FOR DELETE TO authenticated USING ((SELECT public.is_admin()));
DROP POLICY IF EXISTS property_verifications_service_role ON public.property_verifications;
CREATE POLICY property_verifications_service_role ON public.property_verifications TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.property_verifications TO anon, authenticated, service_role;

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

CREATE INDEX IF NOT EXISTS analytics_events_daily_date_idx ON public.analytics_events_daily(date DESC);
ALTER TABLE public.analytics_events_daily ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_manage_analytics_events_daily ON public.analytics_events_daily;
CREATE POLICY service_role_manage_analytics_events_daily ON public.analytics_events_daily FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS landlords_view_own_analytics ON public.analytics_events_daily;
CREATE POLICY landlords_view_own_analytics ON public.analytics_events_daily FOR SELECT TO authenticated
  USING (landlord_id IN (SELECT public.acting_landlord_ids()));

GRANT ALL ON TABLE public.analytics_events_daily TO anon, authenticated, service_role;

CREATE OR REPLACE VIEW public.landlord_response_metrics
WITH (security_invoker = true)
AS
WITH window_leads AS (
  SELECT landlord_id, status, created_at, first_reply_at, archived_at,
    CASE WHEN first_reply_at IS NOT NULL AND first_reply_at > created_at
      AND first_reply_at < created_at + interval '30 days'
      THEN extract(epoch FROM (first_reply_at - created_at)) ELSE NULL END AS ttfr_seconds
  FROM public.landlord_inbox
  WHERE created_at >= now() - interval '30 days' AND landlord_id IS NOT NULL
)
SELECT landlord_id,
  count(*) AS total_leads,
  count(*) FILTER (WHERE status = 'new') AS new_leads,
  count(*) FILTER (WHERE status IN ('new', 'viewed')) AS active_leads,
  count(*) FILTER (WHERE status = 'replied') AS replied_leads,
  count(*) FILTER (WHERE status = 'archived') AS archived_leads,
  count(ttfr_seconds) AS replied_with_ttfr,
  CASE WHEN count(*) = 0 THEN NULL ELSE round(count(*) FILTER (WHERE first_reply_at IS NOT NULL)::numeric / count(*)::numeric * 100)::int END AS reply_rate_pct,
  CASE WHEN count(ttfr_seconds) = 0 THEN NULL ELSE round(percentile_cont(0.5) WITHIN GROUP (ORDER BY ttfr_seconds)::numeric)::int END AS median_ttfr_seconds
FROM window_leads GROUP BY landlord_id;

GRANT SELECT ON public.landlord_response_metrics TO authenticated;




CREATE TABLE IF NOT EXISTS public.saved_places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  location_type text NOT NULL,
  location_id uuid NOT NULL,
  collection_id uuid,
  tags text[] DEFAULT '{}'::text[],
  notes text,
  is_favorite boolean DEFAULT false,
  priority integer DEFAULT 0,
  saved_at timestamptz NOT NULL DEFAULT now(),
  last_viewed_at timestamptz,
  view_count integer DEFAULT 0,
  trip_id uuid,
  CONSTRAINT saved_places_location_type_check CHECK (
    location_type = ANY (ARRAY['event', 'restaurant', 'rental', 'poi']::text[])
  ),
  CONSTRAINT valid_view_count CHECK (view_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_saved_places_user_id ON public.saved_places(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_location ON public.saved_places(location_type, location_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_favorites ON public.saved_places(user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_saved_places_tags ON public.saved_places USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_saved_places_user_location ON public.saved_places(user_id, location_type);
CREATE INDEX IF NOT EXISTS idx_saved_places_trip_id ON public.saved_places(trip_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_collection ON public.saved_places(collection_id) WHERE collection_id IS NOT NULL;

ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS authenticated_users_can_view_own_saved_places ON public.saved_places;
CREATE POLICY authenticated_users_can_view_own_saved_places ON public.saved_places FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS authenticated_users_can_insert_own_saved_places ON public.saved_places;
CREATE POLICY authenticated_users_can_insert_own_saved_places ON public.saved_places FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS authenticated_users_can_update_own_saved_places ON public.saved_places;
CREATE POLICY authenticated_users_can_update_own_saved_places ON public.saved_places FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS authenticated_users_can_delete_own_saved_places ON public.saved_places;
CREATE POLICY authenticated_users_can_delete_own_saved_places ON public.saved_places FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS service_role_all_saved_places ON public.saved_places;
CREATE POLICY service_role_all_saved_places ON public.saved_places TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.saved_places TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_type public.booking_type NOT NULL,
  resource_id uuid NOT NULL,
  resource_title text NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending'::public.booking_status,
  start_date date NOT NULL,
  end_date date,
  start_time time without time zone,
  end_time time without time zone,
  party_size integer DEFAULT 1,
  quantity integer DEFAULT 1,
  unit_price numeric(10,2),
  total_price numeric(10,2),
  currency text DEFAULT 'USD'::text,
  payment_status public.payment_status DEFAULT 'pending'::public.payment_status,
  payment_method text,
  payment_reference text,
  confirmation_code text,
  special_requests text,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  trip_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  CONSTRAINT bookings_confirmation_code_key UNIQUE (confirmation_code)
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_type ON public.bookings(booking_type);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_resource ON public.bookings(resource_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_date ON public.bookings(start_date);
CREATE INDEX IF NOT EXISTS idx_bookings_confirmation ON public.bookings(confirmation_code) WHERE confirmation_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_trip ON public.bookings(trip_id) WHERE trip_id IS NOT NULL;

DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
DROP TRIGGER IF EXISTS generate_booking_confirmation ON public.bookings;
CREATE TRIGGER generate_booking_confirmation BEFORE INSERT ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.generate_confirmation_code();

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS authenticated_users_can_view_own_bookings ON public.bookings;
CREATE POLICY authenticated_users_can_view_own_bookings ON public.bookings FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS authenticated_users_can_create_bookings ON public.bookings;
CREATE POLICY authenticated_users_can_create_bookings ON public.bookings FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS authenticated_users_can_update_own_bookings ON public.bookings;
CREATE POLICY authenticated_users_can_update_own_bookings ON public.bookings FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS service_role_full_access ON public.bookings;
CREATE POLICY service_role_full_access ON public.bookings TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.bookings TO anon, authenticated, service_role;




CREATE TABLE IF NOT EXISTS public.event_sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  sponsor_org_id uuid NOT NULL,
  tier text NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'premium', 'title')),
  amount_cents int NOT NULL CHECK (amount_cents >= 0),
  currency text NOT NULL DEFAULT 'COP',
  contract_start_at timestamptz,
  contract_end_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'completed', 'cancelled')),
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, sponsor_org_id, tier)
);

CREATE INDEX IF NOT EXISTS event_sponsors_event_idx ON public.event_sponsors(event_id);
CREATE INDEX IF NOT EXISTS event_sponsors_org_idx ON public.event_sponsors(sponsor_org_id);
CREATE INDEX IF NOT EXISTS event_sponsors_status_idx ON public.event_sponsors(event_id, status);

DROP TRIGGER IF EXISTS event_sponsors_set_updated_at ON public.event_sponsors;
CREATE TRIGGER event_sponsors_set_updated_at BEFORE UPDATE ON public.event_sponsors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.event_sponsors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sponsors_public_active_select ON public.event_sponsors;
CREATE POLICY sponsors_public_active_select ON public.event_sponsors FOR SELECT
  USING (status IN ('approved', 'active') AND EXISTS (
    SELECT 1 FROM public.events e WHERE e.id = event_sponsors.event_id AND e.status IN ('published', 'live')
  ));
DROP POLICY IF EXISTS sponsors_organizer_all ON public.event_sponsors;
CREATE POLICY sponsors_organizer_all ON public.event_sponsors FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_sponsors.event_id AND e.organizer_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_sponsors.event_id AND e.organizer_id = (SELECT auth.uid())));
DROP POLICY IF EXISTS event_sponsors_service_role ON public.event_sponsors;
CREATE POLICY event_sponsors_service_role ON public.event_sponsors TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.event_sponsors TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.event_sponsor_placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_sponsor_id uuid NOT NULL REFERENCES public.event_sponsors(id) ON DELETE CASCADE,
  surface text NOT NULL CHECK (surface IN (
    'event_hero', 'ticket_pdf', 'confirmation_email', 'recap_email',
    'in_app_banner', 'contest_header', 'venue_signage', 'stage_screen', 'other'
  )),
  asset_id uuid REFERENCES public.event_media_assets(id),
  position int NOT NULL DEFAULT 0,
  weight numeric(4,2) NOT NULL DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 10),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_sponsor_placements_sponsor_idx ON public.event_sponsor_placements(event_sponsor_id);
CREATE INDEX IF NOT EXISTS event_sponsor_placements_surface_idx ON public.event_sponsor_placements(surface) WHERE is_active = true;

DROP TRIGGER IF EXISTS event_sponsor_placements_set_updated_at ON public.event_sponsor_placements;
CREATE TRIGGER event_sponsor_placements_set_updated_at BEFORE UPDATE ON public.event_sponsor_placements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.event_sponsor_placements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS placements_public_active_select ON public.event_sponsor_placements;
CREATE POLICY placements_public_active_select ON public.event_sponsor_placements FOR SELECT
  USING (is_active = true AND EXISTS (
    SELECT 1 FROM public.event_sponsors s WHERE s.id = event_sponsor_placements.event_sponsor_id AND s.status IN ('approved', 'active')
  ));
DROP POLICY IF EXISTS placements_organizer_all ON public.event_sponsor_placements;
CREATE POLICY placements_organizer_all ON public.event_sponsor_placements FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.event_sponsors s JOIN public.events e ON e.id = s.event_id
    WHERE s.id = event_sponsor_placements.event_sponsor_id AND e.organizer_id = (SELECT auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.event_sponsors s JOIN public.events e ON e.id = s.event_id
    WHERE s.id = event_sponsor_placements.event_sponsor_id AND e.organizer_id = (SELECT auth.uid())
  ));
DROP POLICY IF EXISTS event_sponsor_placements_service_role ON public.event_sponsor_placements;
CREATE POLICY event_sponsor_placements_service_role ON public.event_sponsor_placements TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.event_sponsor_placements TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL UNIQUE,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  message_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT whatsapp_conversations_message_count_check CHECK (message_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_phone_number ON public.whatsapp_conversations(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_last_message_at ON public.whatsapp_conversations(last_message_at DESC);

DROP TRIGGER IF EXISTS update_whatsapp_conversations_updated_at ON public.whatsapp_conversations;
CREATE TRIGGER update_whatsapp_conversations_updated_at BEFORE UPDATE ON public.whatsapp_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_select_conversations ON public.whatsapp_conversations;
CREATE POLICY service_role_select_conversations ON public.whatsapp_conversations FOR SELECT TO service_role USING (true);
DROP POLICY IF EXISTS service_role_insert_conversations ON public.whatsapp_conversations;
CREATE POLICY service_role_insert_conversations ON public.whatsapp_conversations FOR INSERT TO service_role WITH CHECK (true);
DROP POLICY IF EXISTS service_role_update_conversations ON public.whatsapp_conversations;
CREATE POLICY service_role_update_conversations ON public.whatsapp_conversations FOR UPDATE TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_delete_conversations ON public.whatsapp_conversations;
CREATE POLICY service_role_delete_conversations ON public.whatsapp_conversations FOR DELETE TO service_role USING (true);

GRANT ALL ON TABLE public.whatsapp_conversations TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  direction text NOT NULL,
  message_type text DEFAULT 'text'::text,
  content text NOT NULL,
  sender text NOT NULL,
  external_id text,
  status text DEFAULT 'pending'::text,
  created_at timestamptz NOT NULL DEFAULT now(),
  to_number text,
  raw_payload jsonb,
  CONSTRAINT whatsapp_messages_direction_check CHECK (direction = ANY (ARRAY['inbound', 'outbound']::text[])),
  CONSTRAINT whatsapp_messages_sender_check CHECK (sender = ANY (ARRAY['user', 'assistant']::text[])),
  CONSTRAINT whatsapp_messages_status_check CHECK (status = ANY (ARRAY['pending', 'sent', 'delivered', 'read', 'failed']::text[]))
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone_number ON public.whatsapp_messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON public.whatsapp_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_external_id ON public.whatsapp_messages(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone_created ON public.whatsapp_messages(phone_number, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_whatsapp_messages_external_id ON public.whatsapp_messages(external_id) WHERE external_id IS NOT NULL;

ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_select_messages ON public.whatsapp_messages;
CREATE POLICY service_role_select_messages ON public.whatsapp_messages FOR SELECT TO service_role USING (true);
DROP POLICY IF EXISTS service_role_insert_messages ON public.whatsapp_messages;
CREATE POLICY service_role_insert_messages ON public.whatsapp_messages FOR INSERT TO service_role WITH CHECK (true);
DROP POLICY IF EXISTS service_role_update_messages ON public.whatsapp_messages;
CREATE POLICY service_role_update_messages ON public.whatsapp_messages FOR UPDATE TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_delete_messages ON public.whatsapp_messages;
CREATE POLICY service_role_delete_messages ON public.whatsapp_messages FOR DELETE TO service_role USING (true);

GRANT ALL ON TABLE public.whatsapp_messages TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.whatsapp_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_e164 text NOT NULL,
  opted_in boolean DEFAULT true,
  saved_search jsonb DEFAULT '{}'::jsonb,
  conversation_id uuid,
  last_notified_at timestamptz,
  notification_frequency text DEFAULT 'daily' CHECK (notification_frequency IN ('realtime', 'daily', 'weekly', 'never')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_wa_subs_opted_in ON public.whatsapp_subscriptions(opted_in, last_notified_at) WHERE opted_in = true;

DROP TRIGGER IF EXISTS whatsapp_subscriptions_updated_at ON public.whatsapp_subscriptions;
CREATE TRIGGER whatsapp_subscriptions_updated_at BEFORE UPDATE ON public.whatsapp_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.whatsapp_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS wa_subs_own_select ON public.whatsapp_subscriptions;
CREATE POLICY wa_subs_own_select ON public.whatsapp_subscriptions FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS wa_subs_own_insert ON public.whatsapp_subscriptions;
CREATE POLICY wa_subs_own_insert ON public.whatsapp_subscriptions FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS wa_subs_own_update ON public.whatsapp_subscriptions;
CREATE POLICY wa_subs_own_update ON public.whatsapp_subscriptions FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS wa_subs_service ON public.whatsapp_subscriptions;
CREATE POLICY wa_subs_service ON public.whatsapp_subscriptions FOR ALL TO service_role USING (true);

GRANT ALL ON TABLE public.whatsapp_subscriptions TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.wa_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text UNIQUE,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'dispatching', 'sent', 'dead')),
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  last_error text,
  to_e164 text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wa_outbox_status_next ON public.wa_outbox(status, next_attempt_at);
ALTER TABLE public.wa_outbox ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS wa_outbox_service_role ON public.wa_outbox;
CREATE POLICY wa_outbox_service_role ON public.wa_outbox TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.wa_outbox TO service_role;


COMMIT;
