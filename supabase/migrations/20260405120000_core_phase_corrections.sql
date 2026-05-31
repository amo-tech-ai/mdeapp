
-- CORE Phase Corrections Migration
-- Source: tasks/audit/09-full-system-audit.md §9.4, §9.5
-- Date: 2026-04-05
-- Creates missing tables and indexes required by CORE phase prompts

-- ============================================================
-- 1. idempotency_keys — dedup for POST endpoints (02E)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.idempotency_keys (
  key TEXT PRIMARY KEY,
  endpoint TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  response JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_idempotency_keys_created ON public.idempotency_keys(created_at);

-- FK to auth.users: index referencing column for CASCADE deletes and lookups (schema-foreign-key-indexes)
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_user_id
  ON public.idempotency_keys (user_id)
  WHERE user_id IS NOT NULL;

COMMENT ON TABLE public.idempotency_keys IS 'E2: prevents duplicate writes from retries. TTL 24h — clean via cron.';

ALTER TABLE public.idempotency_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on idempotency_keys"
  ON public.idempotency_keys TO service_role
  USING (true) WITH CHECK (true);

-- ============================================================
-- 2. notifications — in-app notifications (02E, 02F)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id) WHERE read = false;
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users mark own as read"
  ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Service role manages notifications"
  ON public.notifications TO service_role
  USING (true) WITH CHECK (true);

COMMENT ON TABLE public.notifications IS 'E2: showing requests, application updates, booking confirmations.';

-- ============================================================
-- 3. agent_audit_log — agent action audit trail (09E)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.agent_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_detail JSONB,
  target_entity TEXT,
  target_entity_type TEXT,
  result TEXT NOT NULL DEFAULT 'success',
  duration_ms INTEGER,
  triggered_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_audit_agent ON public.agent_audit_log(agent_name);
CREATE INDEX idx_agent_audit_action ON public.agent_audit_log(action_type);
CREATE INDEX idx_agent_audit_created ON public.agent_audit_log(created_at DESC);

ALTER TABLE public.agent_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages agent_audit_log"
  ON public.agent_audit_log TO service_role
  USING (true) WITH CHECK (true);

COMMENT ON TABLE public.agent_audit_log IS 'E9-004: audit trail for Paperclip/Hermes/OpenClaw agent actions.';

-- ============================================================
-- 4. Missing indexes on existing tables
-- ============================================================

-- apartments.host_id — used in RLS, currently causes full table scan
CREATE INDEX IF NOT EXISTS idx_apartments_host_id
  ON public.apartments(host_id);

-- showings dedup — prevent duplicate showings (same lead + apartment + same day)
CREATE UNIQUE INDEX IF NOT EXISTS idx_showings_lead_apt_day
  ON public.showings(
    lead_id,
    apartment_id,
    ((scheduled_at AT TIME ZONE 'America/Bogota')::date)
  );
-- rental_applications dedup — prevent duplicate apps (same lead + apartment, not withdrawn)
CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_lead_apt
  ON public.rental_applications(lead_id, apartment_id)
  WHERE status != 'withdrawn';

-- ============================================================
-- 5. payments.stripe_event_id — webhook dedup (13B)
-- ============================================================
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS stripe_event_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_stripe_event
  ON public.payments(stripe_event_id)
  WHERE stripe_event_id IS NOT NULL;

COMMENT ON COLUMN public.payments.stripe_event_id IS '13B: Stripe webhook event dedup — prevents double-processing.';
