-- P1: listing verification workflow
-- Depends on: apartments
-- Practices: index FK verified_by (schema-foreign-key-indexes); public read policy for badges

CREATE TABLE IF NOT EXISTS public.property_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id uuid NOT NULL REFERENCES public.apartments (id) ON DELETE CASCADE,
  verified_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
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

CREATE INDEX IF NOT EXISTS idx_property_verifications_apartment_id ON public.property_verifications (apartment_id);
CREATE INDEX IF NOT EXISTS idx_property_verifications_status ON public.property_verifications (status);
CREATE INDEX IF NOT EXISTS idx_property_verifications_verified_by ON public.property_verifications (verified_by);

CREATE TRIGGER property_verifications_updated_at
  BEFORE UPDATE ON public.property_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.property_verifications ENABLE ROW LEVEL SECURITY;

-- Anyone can read verification status for transparency on active listings
CREATE POLICY property_verifications_select_all
  ON public.property_verifications FOR SELECT
  USING (true);

CREATE POLICY property_verifications_insert_admin
  ON public.property_verifications FOR INSERT TO authenticated
  WITH CHECK ((select public.is_admin()));

CREATE POLICY property_verifications_update_admin
  ON public.property_verifications FOR UPDATE TO authenticated
  USING ((select public.is_admin()))
  WITH CHECK ((select public.is_admin()));

CREATE POLICY property_verifications_delete_admin
  ON public.property_verifications FOR DELETE TO authenticated
  USING ((select public.is_admin()));

CREATE POLICY property_verifications_service_role
  ON public.property_verifications
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON TABLE public.property_verifications TO anon;
GRANT ALL ON TABLE public.property_verifications TO authenticated;
GRANT ALL ON TABLE public.property_verifications TO service_role;

COMMENT ON TABLE public.property_verifications IS 'P1: one row per apartment; admin-managed verification badge';
