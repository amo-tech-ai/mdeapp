-- P1 CRM atomic RPCs: role grants + human-readable function descriptions.
-- Split from original 20260406120000. Depends on 20260406120001 + 20260406120002.

REVOKE ALL ON FUNCTION public.p1_schedule_tour_atomic(
  uuid, text, uuid, text, text, text, text, jsonb, uuid, timestamptz, text, jsonb
) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.p1_start_rental_application_atomic(
  uuid, text, uuid, text, text, jsonb, uuid, jsonb
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.p1_schedule_tour_atomic(
  uuid, text, uuid, text, text, text, text, jsonb, uuid, timestamptz, text, jsonb
) TO service_role;

GRANT EXECUTE ON FUNCTION public.p1_start_rental_application_atomic(
  uuid, text, uuid, text, text, jsonb, uuid, jsonb
) TO service_role;

COMMENT ON FUNCTION public.p1_schedule_tour_atomic IS
  'Single-transaction tour request: idempotent lead + exact showing slot; same-day conflict errors (America/Bogota) instead of returning wrong slot.';

COMMENT ON FUNCTION public.p1_start_rental_application_atomic IS
  'Single-transaction rental application start: idempotent lead + application row.';
