-- migration: restore_post_mvp_verification_analytics
-- Split (DATA-048) from combined 20260524140000_restore_post_mvp_landlord_sponsor_whatsapp.sql.
-- Matches remote supabase_migrations.schema_migrations version 20260524024105. SQL body verbatim; no content change.
BEGIN;
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
COMMIT;
