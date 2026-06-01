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
