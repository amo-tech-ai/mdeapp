-- P1 CRM: idempotency support (schema only — functions live in split migrations 120001–120003).
--
-- Background: this file originally bundled two CREATE FUNCTION blocks + REVOKE/GRANT
-- in a single migration. The hosted migration runner fails such files with:
--   "cannot insert multiple commands into a prepared statement" (SQLSTATE 42601)
-- because the execution pipeline sends the already-split unit through the extended
-- query protocol, which rejects multi-command payloads from PL/pgSQL bodies.
--
-- Split as of 2026-04-23:
--   20260406120000_p1_crm_idempotency_atomic.sql       — this file (schema only)
--   20260406120001_p1_schedule_tour_atomic.sql         — p1_schedule_tour_atomic()
--   20260406120002_p1_application_atomic.sql           — p1_start_rental_application_atomic()
--   20260406120003_p1_atomic_grants.sql                — REVOKE + GRANT + COMMENT

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS idempotency_key text;

COMMENT ON COLUMN public.leads.idempotency_key IS
  'Client-generated key (UUID string) for safe retries; unique per user when set.';

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_user_idempotency_unique
  ON public.leads (user_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

ALTER TABLE public.rental_applications
  ADD COLUMN IF NOT EXISTS idempotency_key text;

COMMENT ON COLUMN public.rental_applications.idempotency_key IS
  'Client-generated key for safe retries on application start.';

CREATE UNIQUE INDEX IF NOT EXISTS idx_rental_applications_applicant_idempotency_unique
  ON public.rental_applications (applicant_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;
