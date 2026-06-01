-- DATA-047: search_logs + grounding_failures + signal_generation_logs

CREATE TABLE public.search_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text text NOT NULL,
  intent text,
  slots jsonb NOT NULL DEFAULT '{}',
  tool_name text NOT NULL,
  results_count int NOT NULL DEFAULT 0,
  zero_results boolean GENERATED ALWAYS AS (results_count = 0) STORED,
  clicked_entity_type text,
  clicked_entity_id uuid,
  latency_ms int NOT NULL,
  grounding_used boolean NOT NULL DEFAULT false,
  hybrid_used boolean NOT NULL DEFAULT false,
  rank_explanation jsonb NOT NULL DEFAULT '[]',
  session_id text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX search_logs_created_at_idx ON public.search_logs (created_at DESC);
CREATE INDEX search_logs_zero_results_idx ON public.search_logs (zero_results) WHERE zero_results = true;

ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY search_logs_service_insert ON public.search_logs
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY search_logs_service_select ON public.search_logs
  FOR SELECT TO service_role USING (true);
CREATE POLICY search_logs_authenticated_own_select ON public.search_logs
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.grounding_failures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text text NOT NULL,
  tool_name text NOT NULL,
  failure_reason text NOT NULL,
  slots jsonb NOT NULL DEFAULT '{}',
  latency_ms int,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.grounding_failures ENABLE ROW LEVEL SECURITY;
CREATE POLICY grounding_failures_service_all ON public.grounding_failures
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.signal_generation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_table text NOT NULL,
  entity_id uuid NOT NULL,
  source text NOT NULL,
  model_version text,
  confidence numeric(4,3),
  status text NOT NULL CHECK (status IN ('seeded', 'failed', 'qa_approved')),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.signal_generation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY signal_generation_logs_service_all ON public.signal_generation_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);
