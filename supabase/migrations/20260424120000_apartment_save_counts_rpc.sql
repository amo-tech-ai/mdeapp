-- Week 2 Tue — social-proof counter for chat cards.
--
-- Returns per-apartment save counts for a batch of listing IDs. SECURITY
-- DEFINER bypasses saved_places RLS to expose aggregate-only data (no
-- user_ids) to anon + authenticated roles. Powers the "Saved by N nomads"
-- footer on RentalCardInline.
--
-- Signed: aggregate-only. The function never returns user_ids, timestamps,
-- or collection assignments — only `(apartment_id, save_count)` rows.
--
-- See: tasks/CHAT-CENTRAL-PLAN.md §5 · Week 2 Tue.

CREATE OR REPLACE FUNCTION public.apartment_save_counts(apartment_ids uuid[])
RETURNS TABLE (apartment_id uuid, save_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT location_id AS apartment_id, COUNT(*)::bigint AS save_count
  FROM saved_places
  WHERE location_type = 'apartment'
    AND location_id = ANY(apartment_ids)
  GROUP BY location_id;
$$;

REVOKE ALL ON FUNCTION public.apartment_save_counts(uuid[]) FROM public;
GRANT EXECUTE ON FUNCTION public.apartment_save_counts(uuid[]) TO anon, authenticated;

COMMENT ON FUNCTION public.apartment_save_counts(uuid[]) IS
  'Aggregate save counts for a batch of apartment IDs. SECURITY DEFINER; returns only (apartment_id, save_count) — no user data leakage. Powers chat-card social proof.';
