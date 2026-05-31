-- Idempotent hardening (supabase-postgres-best-practices):
-- - Index FK column on idempotency_keys (schema-foreign-key-indexes)
-- - Drop redundant showings unique index if DB applied older 061 (avoid duplicate unique violations)
-- - Lock SECURITY DEFINER search_path (pg_temp last) on P1 atomic RPCs
--
-- Safe after 20260407120000. No-op on fresh installs that already include edits to 051/061/071.

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_user_id
  ON public.idempotency_keys (user_id)
  WHERE user_id IS NOT NULL;

DROP INDEX IF EXISTS public.idx_showings_lead_apt_sched_unique;

ALTER FUNCTION public.p1_schedule_tour_atomic(
  uuid, text, uuid, text, text, text, text, jsonb, uuid, timestamptz, text, jsonb
) SET search_path = public, pg_temp;

ALTER FUNCTION public.p1_start_rental_application_atomic(
  uuid, text, uuid, text, text, jsonb, uuid, jsonb
) SET search_path = public, pg_temp;
