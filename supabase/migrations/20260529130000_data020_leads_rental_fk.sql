-- DATA-020 — leads rental FK columns
-- Applied live: data020_leads_rental_fk_columns (2026-05-29)

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS apartment_id uuid REFERENCES public.apartments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS preferred_showing_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_leads_apartment_id ON public.leads (apartment_id) WHERE apartment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_intent_apartment ON public.leads (intent, apartment_id) WHERE intent = 'rental';

UPDATE public.leads
SET apartment_id = (metadata->>'listing_id')::uuid
WHERE apartment_id IS NULL
  AND metadata->>'listing_id' ~ '^[0-9a-f-]{36}$';
