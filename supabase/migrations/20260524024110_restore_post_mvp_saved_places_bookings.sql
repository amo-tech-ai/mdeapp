-- migration: restore_post_mvp_saved_places_bookings
-- Split (DATA-048) from combined 20260524140000_restore_post_mvp_landlord_sponsor_whatsapp.sql.
-- Matches remote supabase_migrations.schema_migrations version 20260524024110. SQL body verbatim; no content change.
BEGIN;
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
COMMIT;
