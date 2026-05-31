DROP INDEX IF EXISTS public.restaurants_neighborhood_idx;
ALTER TABLE public.restaurants DROP COLUMN IF EXISTS neighborhood;
-- Note: NOT NULL restore skipped if rows have NULL price_level/hours
