-- Restore post-MVP rental workflow tables.
-- Policy: keep post-MVP schema; mdeapp MVP still queries apartments only.

-- P1: rental application packets
-- Depends on: leads, apartments, profiles
-- Practices: index FKs + composite (apartment_id, status) for host queues; RLS subqueries

CREATE TABLE IF NOT EXISTS public.rental_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads (id) ON DELETE SET NULL,
  apartment_id uuid NOT NULL REFERENCES public.apartments (id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'draft',
  documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  ai_summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT rental_applications_status_check CHECK (
    status = ANY (
      ARRAY[
        'draft',
        'submitted',
        'under_review',
        'approved',
        'rejected',
        'withdrawn'
      ]::text[]
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_rental_applications_lead_id ON public.rental_applications (lead_id);
CREATE INDEX IF NOT EXISTS idx_rental_applications_apartment_id ON public.rental_applications (apartment_id);
CREATE INDEX IF NOT EXISTS idx_rental_applications_applicant_id ON public.rental_applications (applicant_id);
CREATE INDEX IF NOT EXISTS idx_rental_applications_status ON public.rental_applications (status);
CREATE INDEX IF NOT EXISTS idx_rental_applications_created_at ON public.rental_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rental_applications_apartment_status ON public.rental_applications (apartment_id, status);

CREATE TRIGGER rental_applications_updated_at
  BEFORE UPDATE ON public.rental_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.rental_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY rental_applications_select_applicant_host_admin
  ON public.rental_applications FOR SELECT TO authenticated
  USING (
    applicant_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.apartments a
      WHERE a.id = rental_applications.apartment_id
        AND a.host_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM public.leads l
      WHERE rental_applications.lead_id IS NOT NULL
        AND l.id = rental_applications.lead_id
        AND l.assigned_agent_id = (select auth.uid())
    )
    OR (select public.is_admin())
  );

CREATE POLICY rental_applications_insert_applicant
  ON public.rental_applications FOR INSERT TO authenticated
  WITH CHECK (applicant_id = (select auth.uid()));

CREATE POLICY rental_applications_update_applicant_host_admin
  ON public.rental_applications FOR UPDATE TO authenticated
  USING (
    applicant_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.apartments a
      WHERE a.id = rental_applications.apartment_id
        AND a.host_id = (select auth.uid())
    )
    OR (select public.is_admin())
  )
  WITH CHECK (
    applicant_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.apartments a
      WHERE a.id = rental_applications.apartment_id
        AND a.host_id = (select auth.uid())
    )
    OR (select public.is_admin())
  );

CREATE POLICY rental_applications_delete_applicant_admin
  ON public.rental_applications FOR DELETE TO authenticated
  USING (applicant_id = (select auth.uid()) OR (select public.is_admin()));

CREATE POLICY rental_applications_service_role
  ON public.rental_applications
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON TABLE public.rental_applications TO anon;
GRANT ALL ON TABLE public.rental_applications TO authenticated;
GRANT ALL ON TABLE public.rental_applications TO service_role;

COMMENT ON TABLE public.rental_applications IS 'P1: application documents + AI summary for an apartment';


-- P1: property showing appointments
-- Depends on: leads, apartments
-- Practices: composite index for lead + time filters; RLS uses (select auth.uid())

CREATE TABLE IF NOT EXISTS public.showings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads (id) ON DELETE CASCADE,
  apartment_id uuid NOT NULL REFERENCES public.apartments (id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  host_notes text,
  renter_notes text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT showings_status_check CHECK (
    status = ANY (
      ARRAY[
        'scheduled',
        'confirmed',
        'completed',
        'cancelled',
        'no_show'
      ]::text[]
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_showings_lead_id ON public.showings (lead_id);
CREATE INDEX IF NOT EXISTS idx_showings_apartment_id ON public.showings (apartment_id);
CREATE INDEX IF NOT EXISTS idx_showings_scheduled_at ON public.showings (scheduled_at);
CREATE INDEX IF NOT EXISTS idx_showings_status ON public.showings (status);
CREATE INDEX IF NOT EXISTS idx_showings_lead_scheduled ON public.showings (lead_id, scheduled_at DESC);

CREATE TRIGGER showings_updated_at
  BEFORE UPDATE ON public.showings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.showings ENABLE ROW LEVEL SECURITY;

-- Renter (lead owner), listing host, assigned agent, admin
CREATE POLICY showings_select_visible
  ON public.showings FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = showings.lead_id
        AND (
          l.user_id = (select auth.uid())
          OR l.assigned_agent_id = (select auth.uid())
        )
    )
    OR EXISTS (
      SELECT 1 FROM public.apartments a
      WHERE a.id = showings.apartment_id
        AND a.host_id = (select auth.uid())
    )
    OR (select public.is_admin())
  );

CREATE POLICY showings_insert_authenticated
  ON public.showings FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_id
        AND (
          l.user_id = (select auth.uid())
          OR l.assigned_agent_id = (select auth.uid())
          OR (select public.is_admin())
        )
    )
  );

CREATE POLICY showings_update_visible
  ON public.showings FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = showings.lead_id
        AND (
          l.user_id = (select auth.uid())
          OR l.assigned_agent_id = (select auth.uid())
        )
    )
    OR EXISTS (
      SELECT 1 FROM public.apartments a
      WHERE a.id = showings.apartment_id
        AND a.host_id = (select auth.uid())
    )
    OR (select public.is_admin())
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = showings.lead_id
        AND (
          l.user_id = (select auth.uid())
          OR l.assigned_agent_id = (select auth.uid())
        )
    )
    OR EXISTS (
      SELECT 1 FROM public.apartments a
      WHERE a.id = showings.apartment_id
        AND a.host_id = (select auth.uid())
    )
    OR (select public.is_admin())
  );

CREATE POLICY showings_delete_admin_or_parties
  ON public.showings FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = showings.lead_id
        AND (
          l.user_id = (select auth.uid())
          OR l.assigned_agent_id = (select auth.uid())
        )
    )
    OR (select public.is_admin())
  );

CREATE POLICY showings_service_role
  ON public.showings
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON TABLE public.showings TO anon;
GRANT ALL ON TABLE public.showings TO authenticated;
GRANT ALL ON TABLE public.showings TO service_role;

COMMENT ON TABLE public.showings IS 'P1: scheduled showings; links lead + apartment listing';



-- rental_freshness_log, rental_listing_images, rental_listing_sources, rental_search_sessions
-- (from remote_schema; FK listing_id -> apartments)

CREATE TABLE IF NOT EXISTS public.rental_freshness_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.apartments(id) ON DELETE CASCADE,
  checked_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL CHECK (status = ANY (ARRAY['active','unconfirmed','stale'])),
  http_status integer,
  html_signature_match boolean,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rental_freshness_log_checked_at ON public.rental_freshness_log (checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_rental_freshness_log_listing_id ON public.rental_freshness_log (listing_id);
CREATE INDEX IF NOT EXISTS idx_rental_freshness_log_status ON public.rental_freshness_log (listing_id, status) WHERE status <> 'active';

CREATE TABLE IF NOT EXISTS public.rental_listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.apartments(id) ON DELETE CASCADE,
  source_url text,
  storage_path text NOT NULL,
  mime_type text,
  width integer,
  height integer,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rental_listing_images_listing_id ON public.rental_listing_images (listing_id);
CREATE INDEX IF NOT EXISTS idx_rental_listing_images_sort ON public.rental_listing_images (listing_id, sort_order);

CREATE TABLE IF NOT EXISTS public.rental_listing_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_key text NOT NULL UNIQUE,
  base_url text,
  is_enabled boolean NOT NULL DEFAULT true,
  rate_limit_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_crawl_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rental_listing_sources_enabled ON public.rental_listing_sources (is_enabled) WHERE is_enabled = true;
CREATE INDEX IF NOT EXISTS idx_rental_listing_sources_key ON public.rental_listing_sources (source_key);

CREATE TABLE IF NOT EXISTS public.rental_search_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  filter_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  result_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rental_search_sessions_created_at ON public.rental_search_sessions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rental_search_sessions_user_id ON public.rental_search_sessions (user_id);

COMMENT ON TABLE public.rental_search_sessions IS 'persisted rental search criteria and result snapshot';

-- RLS
ALTER TABLE public.rental_freshness_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_listing_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_search_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY anon_select_rental_freshness_log ON public.rental_freshness_log FOR SELECT TO anon USING (true);
CREATE POLICY authenticated_select_rental_freshness_log ON public.rental_freshness_log FOR SELECT TO authenticated USING (true);
CREATE POLICY service_role_all_rental_freshness_log ON public.rental_freshness_log TO service_role USING (true) WITH CHECK (true);

CREATE POLICY anon_select_rental_listing_images ON public.rental_listing_images FOR SELECT TO anon USING (true);
CREATE POLICY authenticated_select_rental_listing_images ON public.rental_listing_images FOR SELECT TO authenticated USING (true);
CREATE POLICY service_role_all_rental_listing_images ON public.rental_listing_images TO service_role USING (true) WITH CHECK (true);

CREATE POLICY anon_select_rental_listing_sources ON public.rental_listing_sources FOR SELECT TO anon USING (is_enabled = true);
CREATE POLICY authenticated_select_rental_listing_sources ON public.rental_listing_sources FOR SELECT TO authenticated USING (true);
CREATE POLICY service_role_all_rental_listing_sources ON public.rental_listing_sources TO service_role USING (true) WITH CHECK (true);

CREATE POLICY authenticated_select_own_rental_search_sessions ON public.rental_search_sessions FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY authenticated_insert_own_rental_search_sessions ON public.rental_search_sessions FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY authenticated_update_own_rental_search_sessions ON public.rental_search_sessions FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY authenticated_delete_own_rental_search_sessions ON public.rental_search_sessions FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY service_role_all_rental_search_sessions ON public.rental_search_sessions TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.rental_freshness_log TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.rental_listing_images TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.rental_listing_sources TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.rental_search_sessions TO anon, authenticated, service_role;
