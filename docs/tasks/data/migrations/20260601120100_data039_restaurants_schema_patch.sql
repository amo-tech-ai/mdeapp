-- DATA-039: restaurants.neighborhood + nullable price_level / hours_of_operation

ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS neighborhood text;

ALTER TABLE public.restaurants
  ALTER COLUMN price_level DROP NOT NULL;

ALTER TABLE public.restaurants
  ALTER COLUMN hours_of_operation DROP NOT NULL;

UPDATE public.restaurants r
SET neighborhood = CASE
  WHEN r.address ILIKE '%Provenza%' OR r.address ILIKE '%Provenca%' THEN 'Provenza'
  WHEN r.address ILIKE '%Laureles%' OR r.city ILIKE '%Laureles%' THEN 'Laureles'
  WHEN r.address ILIKE '%Envigado%' OR r.city ILIKE '%Envigado%' THEN 'Envigado'
  WHEN r.address ILIKE '%Sabaneta%' OR r.city ILIKE '%Sabaneta%' THEN 'Sabaneta'
  WHEN r.address ILIKE '%Manila%' THEN 'Manila'
  WHEN r.address ILIKE '%Centro%' OR r.city ILIKE '%Centro%' THEN 'Centro'
  WHEN r.address ILIKE '%Belén%' OR r.address ILIKE '%Belen%' THEN 'Belén'
  WHEN r.address ILIKE '%Poblado%' OR r.city ILIKE '%Poblado%' THEN 'El Poblado'
  WHEN r.city IS NOT NULL AND r.city <> '' THEN r.city
  ELSE NULL
END
WHERE r.neighborhood IS NULL;

CREATE INDEX IF NOT EXISTS restaurants_neighborhood_idx
  ON public.restaurants (neighborhood)
  WHERE is_active = true AND neighborhood IS NOT NULL;
