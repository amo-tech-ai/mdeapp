-- DATA-043: rental_signals 1:1 with apartments

CREATE TABLE public.rental_signals (
  apartment_id uuid PRIMARY KEY REFERENCES public.apartments(id) ON DELETE CASCADE,
  digital_nomad_score numeric(4,3),
  walkability numeric(4,3),
  nightlife_access numeric(4,3),
  quiet_score numeric(4,3),
  luxury_score numeric(4,3),
  workspace_score numeric(4,3),
  safety_score numeric(4,3),
  value_score numeric(4,3),
  tourist_density numeric(4,3),
  local_authenticity numeric(4,3),
  evidence jsonb NOT NULL DEFAULT '{}',
  source text NOT NULL DEFAULT 'ai_enriched',
  model_version text,
  confidence numeric(4,3) NOT NULL DEFAULT 0.5,
  generated_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rental_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY rental_signals_public_select ON public.rental_signals FOR SELECT USING (true);
CREATE POLICY rental_signals_service_write ON public.rental_signals
  FOR ALL TO service_role USING (true) WITH CHECK (true);
