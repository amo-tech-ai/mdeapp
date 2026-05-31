-- DATA-044: neighborhood_profiles + Astorga seed

INSERT INTO public.neighborhoods (slug, name, safety_score, walkability_score, nomad_score, metadata)
VALUES (
  'astorga', 'Astorga', 0.72, 0.68, 0.55,
  '{"region":"Medellín metro","note":"Phase 1 MIS seed"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE public.neighborhood_profiles (
  neighborhood_id uuid PRIMARY KEY REFERENCES public.neighborhoods(id) ON DELETE CASCADE,
  nightlife_density numeric(4,3),
  safety_perception numeric(4,3),
  digital_nomad_friendliness numeric(4,3),
  tourist_density numeric(4,3),
  noise_level numeric(4,3),
  luxury_index numeric(4,3),
  local_authenticity numeric(4,3),
  rooftop_density numeric(4,3),
  transit_quality numeric(4,3),
  food_quality numeric(4,3),
  gym_coworking_proximity numeric(4,3),
  summary text,
  evidence jsonb NOT NULL DEFAULT '{}',
  source text NOT NULL DEFAULT 'editorial',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.neighborhood_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY neighborhood_profiles_public_select ON public.neighborhood_profiles FOR SELECT USING (true);
CREATE POLICY neighborhood_profiles_service_write ON public.neighborhood_profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);
