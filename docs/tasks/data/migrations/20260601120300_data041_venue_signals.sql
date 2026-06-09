-- DATA-041: venue_signals polymorphic (restaurants + venue_anchors)

CREATE TABLE public.venue_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_kind text NOT NULL CHECK (venue_kind IN (
    'restaurant', 'cafe', 'nightclub', 'bar', 'rooftop', 'gym', 'spa', 'attraction'
  )),
  restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE CASCADE,
  venue_anchor_id uuid REFERENCES public.venue_anchors(id) ON DELETE CASCADE,
  quiet_score numeric(4,3),
  date_night_score numeric(4,3),
  digital_nomad_score numeric(4,3),
  wifi_score numeric(4,3),
  rooftop_score numeric(4,3),
  cocktail_score numeric(4,3),
  nightlife_score numeric(4,3),
  brunch_score numeric(4,3),
  hidden_gem_score numeric(4,3),
  local_authenticity_score numeric(4,3),
  touristy_score numeric(4,3),
  service_score numeric(4,3),
  value_score numeric(4,3),
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  source text NOT NULL DEFAULT 'ai_enriched',
  model_version text,
  confidence numeric(4,3) NOT NULL DEFAULT 0.5,
  generated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT venue_signals_one_parent CHECK (
    (restaurant_id IS NOT NULL)::int + (venue_anchor_id IS NOT NULL)::int = 1
  ),
  CONSTRAINT venue_signals_restaurant_kind CHECK (
    restaurant_id IS NULL OR venue_kind = 'restaurant'
  ),
  CONSTRAINT venue_signals_anchor_kind CHECK (
    venue_anchor_id IS NULL OR venue_kind IN ('cafe', 'nightclub', 'bar', 'rooftop')
  )
);

CREATE UNIQUE INDEX venue_signals_restaurant_uidx
  ON public.venue_signals (restaurant_id) WHERE restaurant_id IS NOT NULL;
CREATE UNIQUE INDEX venue_signals_anchor_uidx
  ON public.venue_signals (venue_anchor_id) WHERE venue_anchor_id IS NOT NULL;

ALTER TABLE public.venue_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY venue_signals_public_select ON public.venue_signals FOR SELECT USING (true);
CREATE POLICY venue_signals_service_write ON public.venue_signals
  FOR ALL TO service_role USING (true) WITH CHECK (true);
