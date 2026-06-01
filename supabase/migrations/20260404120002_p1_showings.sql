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
