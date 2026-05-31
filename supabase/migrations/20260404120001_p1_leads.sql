-- P1: CRM leads (pipeline)
-- Depends on: neighborhoods, profiles
-- Practices: FK indexes (schema-foreign-key-indexes), RLS (security-rls-performance: select auth.uid())

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  neighborhood_id uuid REFERENCES public.neighborhoods (id) ON DELETE SET NULL,
  source text NOT NULL DEFAULT 'web',
  score numeric(5, 2),
  status text NOT NULL DEFAULT 'new',
  assigned_agent_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  email text,
  phone text,
  notes text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT leads_status_check CHECK (
    status = ANY (
      ARRAY['new', 'contacted', 'qualified', 'lost', 'converted']::text[]
    )
  ),
  CONSTRAINT leads_source_check CHECK (char_length(source) > 0)
);

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads (user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_agent ON public.leads (assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_neighborhood_id ON public.leads (neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_leads_status_created_at ON public.leads (status, created_at DESC);

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Prospect sees own rows; assigned agent sees assigned; admins see all
CREATE POLICY leads_select_own_or_agent_or_admin
  ON public.leads FOR SELECT TO authenticated
  USING (
    user_id = (select auth.uid())
    OR assigned_agent_id = (select auth.uid())
    OR (select public.is_admin())
  );

CREATE POLICY leads_insert_own_user
  ON public.leads FOR INSERT TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY leads_update_own_or_agent_or_admin
  ON public.leads FOR UPDATE TO authenticated
  USING (
    user_id = (select auth.uid())
    OR assigned_agent_id = (select auth.uid())
    OR (select public.is_admin())
  )
  WITH CHECK (
    user_id = (select auth.uid())
    OR assigned_agent_id = (select auth.uid())
    OR (select public.is_admin())
  );

CREATE POLICY leads_delete_own_or_admin
  ON public.leads FOR DELETE TO authenticated
  USING (user_id = (select auth.uid()) OR (select public.is_admin()));

CREATE POLICY leads_service_role
  ON public.leads
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON TABLE public.leads TO anon;
GRANT ALL ON TABLE public.leads TO authenticated;
GRANT ALL ON TABLE public.leads TO service_role;

COMMENT ON TABLE public.leads IS 'P1: CRM lead; edge functions use service_role for automated inserts where needed';
