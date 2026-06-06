-- HOTFIX: Restrict email_outbox and delivery_receipts to service_role only
--
-- Audit ref: tasks/data/audit/06-rls-full-audit-2026-06-06.md (CRITICAL-1, CRITICAL-2)
--
-- Root cause: both policies were named "service_role" but created without an explicit
-- TO clause, which defaults to TO PUBLIC (all roles including anon).
-- This gave unauthenticated API callers full SELECT/INSERT/UPDATE/DELETE on both tables.
--
-- email_outbox exposure: to_email (PII), payload (email body), email injection vector
-- delivery_receipts exposure: raw provider webhook data, delivery status corruption
--
-- This migration: drops both bad policies, recreates them scoped to service_role only.
-- No app code changes required. Background job / edge function behaviour is unchanged.

-- ============================================================
-- 1. email_outbox
-- ============================================================

DROP POLICY "email_outbox service_role" ON public.email_outbox;

CREATE POLICY "email_outbox_service_role_only"
  ON public.email_outbox
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 2. delivery_receipts
-- ============================================================

DROP POLICY "delivery_receipts service_role" ON public.delivery_receipts;

CREATE POLICY "delivery_receipts_service_role_only"
  ON public.delivery_receipts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
