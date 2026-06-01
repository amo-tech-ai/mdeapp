-- P1: normalized Medellín neighborhoods (scores for ranking / maps)
-- Depends on: existing public schema only
-- Practices: schema-data-types (timestamptz, numeric precision), schema-foreign-key-indexes,
--   security-rls-performance (wrap auth in scalar subquery in policies)

CREATE TABLE IF NOT EXISTS public.neighborhoods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  city text NOT NULL DEFAULT 'Medellín',
  safety_score numeric(4, 1),
  walkability_score numeric(4, 1),
  nomad_score numeric(4, 1),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT neighborhoods_scores_range CHECK (
    (safety_score IS NULL OR (safety_score >= 0 AND safety_score <= 10))
    AND (walkability_score IS NULL OR (walkability_score >= 0 AND walkability_score <= 10))
    AND (nomad_score IS NULL OR (nomad_score >= 0 AND nomad_score <= 10))
  )
);

CREATE INDEX IF NOT EXISTS idx_neighborhoods_city ON public.neighborhoods (city);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_name ON public.neighborhoods (name);

CREATE TRIGGER neighborhoods_updated_at
  BEFORE UPDATE ON public.neighborhoods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;

-- Public read (listing / explore UIs)
CREATE POLICY neighborhoods_select_public
  ON public.neighborhoods FOR SELECT
  USING (true);

CREATE POLICY neighborhoods_insert_admin
  ON public.neighborhoods FOR INSERT TO authenticated
  WITH CHECK ((select public.is_admin()));

CREATE POLICY neighborhoods_update_admin
  ON public.neighborhoods FOR UPDATE TO authenticated
  USING ((select public.is_admin()))
  WITH CHECK ((select public.is_admin()));

CREATE POLICY neighborhoods_delete_admin
  ON public.neighborhoods FOR DELETE TO authenticated
  USING ((select public.is_admin()));

CREATE POLICY neighborhoods_service_role
  ON public.neighborhoods
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON TABLE public.neighborhoods TO anon;
GRANT ALL ON TABLE public.neighborhoods TO authenticated;
GRANT ALL ON TABLE public.neighborhoods TO service_role;

COMMENT ON TABLE public.neighborhoods IS 'P1: neighborhood facts + scores; join from apartments.neighborhood text or future neighborhood_id';
