-- DATA-042: event_signals 1:1 with events

CREATE TABLE public.event_signals (
  event_id uuid PRIMARY KEY REFERENCES public.events(id) ON DELETE CASCADE,
  hype_score numeric(4,3),
  local_vs_tourist numeric(4,3),
  music_energy numeric(4,3),
  networking_quality numeric(4,3),
  exclusivity numeric(4,3),
  fashion_score numeric(4,3),
  nightlife_score numeric(4,3),
  safety_score numeric(4,3),
  evidence jsonb NOT NULL DEFAULT '{}',
  source text NOT NULL DEFAULT 'ai_enriched',
  model_version text,
  confidence numeric(4,3) NOT NULL DEFAULT 0.5,
  generated_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.event_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY event_signals_public_select ON public.event_signals FOR SELECT USING (true);
CREATE POLICY event_signals_service_write ON public.event_signals
  FOR ALL TO service_role USING (true) WITH CHECK (true);
