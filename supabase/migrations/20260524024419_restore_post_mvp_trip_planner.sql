-- Restore trip planner tables (post-MVP).
-- Re-wires FKs on saved_places + bookings (already restored without trip/collection FKs).

BEGIN;

-- =============================================================================
-- 1. Core trip planner tables
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  destination text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'planning'
    CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  budget numeric(10,2),
  currency text DEFAULT 'USD'::text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT valid_dates CHECK (start_date <= end_date)
);

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON public.trips(start_date);
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON public.trips(destination) WHERE destination IS NOT NULL;

DROP TRIGGER IF EXISTS trips_updated_at ON public.trips;
CREATE TRIGGER trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trigger_trips_broadcast ON public.trips;
CREATE TRIGGER trigger_trips_broadcast
  AFTER INSERT OR DELETE OR UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.broadcast_trips_changes();

DROP TRIGGER IF EXISTS trips_realtime_broadcast ON public.trips;
CREATE TRIGGER trips_realtime_broadcast
  AFTER INSERT OR DELETE OR UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.realtime_broadcast_trips();

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS authenticated_users_can_view_own_trips ON public.trips;
CREATE POLICY authenticated_users_can_view_own_trips ON public.trips FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS authenticated_users_can_insert_own_trips ON public.trips;
CREATE POLICY authenticated_users_can_insert_own_trips ON public.trips FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS authenticated_users_can_update_own_trips ON public.trips;
CREATE POLICY authenticated_users_can_update_own_trips ON public.trips FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS authenticated_users_can_delete_own_trips ON public.trips;
CREATE POLICY authenticated_users_can_delete_own_trips ON public.trips FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

GRANT ALL ON TABLE public.trips TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  emoji text,
  color text,
  is_public boolean DEFAULT false,
  share_token text UNIQUE,
  item_count integer DEFAULT 0,
  cover_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT valid_item_count CHECK (item_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_collections_user_id ON public.collections(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_collections_user ON public.collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_share_token ON public.collections(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_collections_public ON public.collections(is_public) WHERE is_public = true AND deleted_at IS NULL;

DROP TRIGGER IF EXISTS collections_updated_at ON public.collections;
CREATE TRIGGER collections_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_can_view_public_collections ON public.collections;
CREATE POLICY anon_can_view_public_collections ON public.collections FOR SELECT TO anon
  USING (is_public = true AND deleted_at IS NULL);

DROP POLICY IF EXISTS authenticated_users_can_view_own_or_public_collections ON public.collections;
CREATE POLICY authenticated_users_can_view_own_or_public_collections ON public.collections FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR (is_public = true AND deleted_at IS NULL));

DROP POLICY IF EXISTS authenticated_users_can_insert_own_collections ON public.collections;
CREATE POLICY authenticated_users_can_insert_own_collections ON public.collections FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS authenticated_users_can_update_own_collections ON public.collections;
CREATE POLICY authenticated_users_can_update_own_collections ON public.collections FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS authenticated_users_can_delete_own_collections ON public.collections;
CREATE POLICY authenticated_users_can_delete_own_collections ON public.collections FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

GRANT ALL ON TABLE public.collections TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.trip_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  item_type text NOT NULL
    CHECK (item_type IN ('event', 'restaurant', 'rental', 'poi', 'other')),
  source_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  start_at timestamptz,
  end_at timestamptz,
  location_name text,
  address text,
  latitude numeric(10,8),
  longitude numeric(11,8),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_trip_item UNIQUE (trip_id, item_type, source_id),
  CONSTRAINT valid_dates CHECK (start_at IS NULL OR end_at IS NULL OR start_at <= end_at)
);

CREATE INDEX IF NOT EXISTS idx_trip_items_trip ON public.trip_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_items_type ON public.trip_items(item_type, source_id);
CREATE INDEX IF NOT EXISTS idx_trip_items_dates ON public.trip_items(start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_trip_items_created_by ON public.trip_items(created_by) WHERE created_by IS NOT NULL;

DROP TRIGGER IF EXISTS trip_items_updated_at ON public.trip_items;
CREATE TRIGGER trip_items_updated_at
  BEFORE UPDATE ON public.trip_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trigger_trip_items_broadcast ON public.trip_items;
CREATE TRIGGER trigger_trip_items_broadcast
  AFTER INSERT OR DELETE OR UPDATE ON public.trip_items
  FOR EACH ROW EXECUTE FUNCTION public.broadcast_trip_items_changes();

DROP TRIGGER IF EXISTS trip_items_realtime_broadcast ON public.trip_items;
CREATE TRIGGER trip_items_realtime_broadcast
  AFTER INSERT OR DELETE OR UPDATE ON public.trip_items
  FOR EACH ROW EXECUTE FUNCTION public.realtime_broadcast_trip_items();

ALTER TABLE public.trip_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS authenticated_users_can_view_trip_items ON public.trip_items;
CREATE POLICY authenticated_users_can_view_trip_items ON public.trip_items FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = trip_items.trip_id AND t.user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS authenticated_users_can_insert_trip_items ON public.trip_items;
CREATE POLICY authenticated_users_can_insert_trip_items ON public.trip_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = trip_id AND t.user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS authenticated_users_can_update_trip_items ON public.trip_items;
CREATE POLICY authenticated_users_can_update_trip_items ON public.trip_items FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = trip_items.trip_id AND t.user_id = (SELECT auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = trip_items.trip_id AND t.user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS authenticated_users_can_delete_trip_items ON public.trip_items;
CREATE POLICY authenticated_users_can_delete_trip_items ON public.trip_items FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = trip_items.trip_id AND t.user_id = (SELECT auth.uid())
  ));

GRANT ALL ON TABLE public.trip_items TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.budget_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  total_budget numeric(10,2) NOT NULL,
  total_spent numeric(10,2) DEFAULT 0,
  total_pending numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'USD'::text,
  categories jsonb DEFAULT '{"food": {"spent": 0, "budget": 0}, "other": {"spent": 0, "budget": 0}, "shopping": {"spent": 0, "budget": 0}, "transport": {"spent": 0, "budget": 0}, "activities": {"spent": 0, "budget": 0}, "accommodation": {"spent": 0, "budget": 0}}'::jsonb,
  alert_threshold numeric(3,2) DEFAULT 0.80,
  alerts_sent jsonb DEFAULT '[]'::jsonb,
  ai_recommendations jsonb DEFAULT '[]'::jsonb,
  last_optimization_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_budget_per_trip UNIQUE (trip_id),
  CONSTRAINT valid_budget CHECK (total_budget >= 0),
  CONSTRAINT valid_pending CHECK (total_pending >= 0),
  CONSTRAINT valid_spent CHECK (total_spent >= 0),
  CONSTRAINT valid_threshold CHECK (alert_threshold >= 0 AND alert_threshold <= 1)
);

CREATE INDEX IF NOT EXISTS idx_budget_tracking_trip_id ON public.budget_tracking(trip_id);
CREATE INDEX IF NOT EXISTS idx_budget_tracking_alerts ON public.budget_tracking((total_spent / NULLIF(total_budget, 0)))
  WHERE (total_spent / NULLIF(total_budget, 0)) >= 0.80;

DROP TRIGGER IF EXISTS budget_tracking_updated_at ON public.budget_tracking;
CREATE TRIGGER budget_tracking_updated_at
  BEFORE UPDATE ON public.budget_tracking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.budget_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS authenticated_users_can_view_budget_for_own_trips ON public.budget_tracking;
CREATE POLICY authenticated_users_can_view_budget_for_own_trips ON public.budget_tracking FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = budget_tracking.trip_id AND t.user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS authenticated_users_can_insert_budget_for_own_trips ON public.budget_tracking;
CREATE POLICY authenticated_users_can_insert_budget_for_own_trips ON public.budget_tracking FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = trip_id AND t.user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS authenticated_users_can_update_budget_for_own_trips ON public.budget_tracking;
CREATE POLICY authenticated_users_can_update_budget_for_own_trips ON public.budget_tracking FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = budget_tracking.trip_id AND t.user_id = (SELECT auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = budget_tracking.trip_id AND t.user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS authenticated_users_can_delete_budget_for_own_trips ON public.budget_tracking;
CREATE POLICY authenticated_users_can_delete_budget_for_own_trips ON public.budget_tracking FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = budget_tracking.trip_id AND t.user_id = (SELECT auth.uid())
  ));

GRANT ALL ON TABLE public.budget_tracking TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.conflict_resolutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type public.conflict_type NOT NULL,
  severity integer NOT NULL CHECK (severity >= 1 AND severity <= 10),
  title text NOT NULL,
  description text NOT NULL,
  affected_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  status public.resolution_status DEFAULT 'detected'::public.resolution_status,
  resolution_options jsonb,
  selected_resolution jsonb,
  resolved_by text CHECK (resolved_by IN ('ai', 'user')),
  detected_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conflicts_trip_id ON public.conflict_resolutions(trip_id);
CREATE INDEX IF NOT EXISTS idx_conflicts_user_id ON public.conflict_resolutions(user_id);
CREATE INDEX IF NOT EXISTS idx_conflicts_status ON public.conflict_resolutions(status);
CREATE INDEX IF NOT EXISTS idx_conflicts_type ON public.conflict_resolutions(type);
CREATE INDEX IF NOT EXISTS idx_conflicts_severity ON public.conflict_resolutions(severity DESC);
CREATE INDEX IF NOT EXISTS idx_conflicts_unresolved ON public.conflict_resolutions(trip_id, status)
  WHERE status IN ('detected'::public.resolution_status, 'pending_review'::public.resolution_status);

DROP TRIGGER IF EXISTS conflict_resolutions_updated_at ON public.conflict_resolutions;
CREATE TRIGGER conflict_resolutions_updated_at
  BEFORE UPDATE ON public.conflict_resolutions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.conflict_resolutions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS authenticated_users_can_view_conflicts_in_own_trips ON public.conflict_resolutions;
CREATE POLICY authenticated_users_can_view_conflicts_in_own_trips ON public.conflict_resolutions FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS authenticated_users_can_insert_conflicts_in_own_trips ON public.conflict_resolutions;
CREATE POLICY authenticated_users_can_insert_conflicts_in_own_trips ON public.conflict_resolutions FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS authenticated_users_can_update_conflicts_in_own_trips ON public.conflict_resolutions;
CREATE POLICY authenticated_users_can_update_conflicts_in_own_trips ON public.conflict_resolutions FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS authenticated_users_can_delete_conflicts_in_own_trips ON public.conflict_resolutions;
CREATE POLICY authenticated_users_can_delete_conflicts_in_own_trips ON public.conflict_resolutions FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

GRANT ALL ON TABLE public.conflict_resolutions TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.proactive_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN (
    'add_activity', 'book_restaurant', 'budget_alert', 'local_event',
    'time_optimization', 'weather_alert', 'price_drop', 'cancellation_notice'
  )),
  title text NOT NULL,
  description text,
  agent_name text,
  confidence_score numeric CHECK (confidence_score >= 0 AND confidence_score <= 1),
  reasoning text,
  suggestion_data jsonb DEFAULT '{}'::jsonb,
  action_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'shown', 'accepted', 'rejected', 'expired')),
  shown_at timestamptz,
  responded_at timestamptz,
  priority integer DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_proactive_suggestions_user_id ON public.proactive_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_proactive_suggestions_trip_id ON public.proactive_suggestions(trip_id);
CREATE INDEX IF NOT EXISTS idx_proactive_suggestions_status ON public.proactive_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_proactive_suggestions_created_at ON public.proactive_suggestions(created_at DESC);

DROP TRIGGER IF EXISTS trigger_broadcast_proactive_suggestions ON public.proactive_suggestions;
CREATE TRIGGER trigger_broadcast_proactive_suggestions
  AFTER INSERT OR DELETE OR UPDATE ON public.proactive_suggestions
  FOR EACH ROW EXECUTE FUNCTION public.broadcast_proactive_suggestions_changes();

DROP TRIGGER IF EXISTS trigger_suggestions_broadcast ON public.proactive_suggestions;
CREATE TRIGGER trigger_suggestions_broadcast
  AFTER INSERT OR DELETE OR UPDATE ON public.proactive_suggestions
  FOR EACH ROW EXECUTE FUNCTION public.broadcast_suggestions_changes();

ALTER TABLE public.proactive_suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage all suggestions" ON public.proactive_suggestions;
CREATE POLICY "Service role can manage all suggestions" ON public.proactive_suggestions
  USING ((SELECT auth.role()) = 'service_role'::text);

DROP POLICY IF EXISTS "Users can view their own suggestions" ON public.proactive_suggestions;
CREATE POLICY "Users can view their own suggestions" ON public.proactive_suggestions FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own suggestions" ON public.proactive_suggestions;
CREATE POLICY "Users can update their own suggestions" ON public.proactive_suggestions FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

GRANT ALL ON TABLE public.proactive_suggestions TO anon, authenticated, service_role;

-- =============================================================================
-- 2. Re-wire FKs on tables restored without trip/collection references
-- =============================================================================

DO $do$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'saved_places_trip_id_fkey'
  ) THEN
    ALTER TABLE public.saved_places
      ADD CONSTRAINT saved_places_trip_id_fkey
      FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'saved_places_collection_id_fkey'
  ) THEN
    ALTER TABLE public.saved_places
      ADD CONSTRAINT saved_places_collection_id_fkey
      FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_trip_id_fkey'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_trip_id_fkey
      FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE SET NULL;
  END IF;
END $do$;

CREATE INDEX IF NOT EXISTS idx_saved_places_user_trip ON public.saved_places(user_id, trip_id);

DROP TRIGGER IF EXISTS saved_places_update_collection_count ON public.saved_places;
CREATE TRIGGER saved_places_update_collection_count
  AFTER INSERT OR UPDATE OF collection_id OR DELETE ON public.saved_places
  FOR EACH ROW EXECUTE FUNCTION public.update_collection_count();

COMMIT;
