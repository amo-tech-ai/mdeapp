-- Phase 1 events MVP — schema migration
-- Source: tasks/events/prompts/001-event-schema-migration.md (after audits #1 + #2)
-- Audits applied: B1-B5 (audit #1) + B1-B5 (audit #2)
--
-- Adds:
--   • ALTER public.events  (slug, status, organizer_id, total_capacity, staff_link_version, venue_id, updated_at)
--   • NEW public.event_venues, event_tickets, event_orders, event_attendees, event_check_ins
--   • ALTER public.payments (audit #2 B1 — booking_id nullable + event_order_id FK + source CHECK)
--   • Reusable set_updated_at() trigger fn
--   • 8 SECURITY DEFINER RPCs (get_anonymous_order, record_check_in, bump_staff_link_version,
--     ticket_checkout_create_pending, ticket_payment_finalize, ticket_payment_finalize_response,
--     ticket_payment_refund, ticket_validate_consume)
--   • RLS policies (strict by default; anon-buyer path via RPC + access_token)
--
-- ─────────────────────────────────────────────────────────────────────────────
-- SKILL COMPLIANCE — checked against `.claude/skills/supabase` + `supabase-postgres-best-practices`
-- ─────────────────────────────────────────────────────────────────────────────
-- ✅ schema-foreign-key-indexes — every FK column has an index (events.venue_id, event_orders.ticket_id,
--    event_orders.payment_id, event_attendees.ticket_id, event_check_ins.scanned_by — all indexed below)
-- ✅ security-rls-performance — `(select auth.uid())` subquery pattern used in all RLS policies (cached, not per-row)
-- ✅ schema-data-types — money in `int cents` (matches repo convention; no float for currency)
-- ✅ schema-constraints — CHECK constraints on status enums, qty bounds, sale-window order, etc.
-- ✅ Skill §"RLS in exposed schemas" — RLS enabled on all 5 new tables (public schema is exposed)
-- ✅ Skill §"UPDATE requires a SELECT policy" — `FOR ALL` policies on venues/tickets cover SELECT path
-- ✅ Skill §"Exposing tables to the Data API" — explicit GRANT ALL TO anon/authenticated/service_role added §9
-- ✅ Skill §"Security checklist — REVOKE before GRANT" — all 9 RPCs have REVOKE ALL FROM PUBLIC before GRANT EXECUTE
-- ⚠️ Skill §"Do not put security definer in exposed schema" — RPCs ARE in public.* (matches repo convention).
--    Mitigation: REVOKE FROM PUBLIC + GRANT only to service_role/authenticated/anon as appropriate.
--    Future hardening: move to a `private.*` schema with `public.*` thin RPC wrappers (audit #4+ scope).
-- ⚠️ Skill §"Run advisors before commit" — NOT YET RUN. After applying this migration locally,
--    run `mcp__ed3787fc__get_advisors lints=security` and reconcile any findings before merging to main.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- AUDIT #3 FIXES APPLIED — `tasks/events/audit/03-audit-migration.md`
-- ─────────────────────────────────────────────────────────────────────────────
-- ✅ Critical: oversell hole — added `event_tickets.qty_pending` column + new CHECK
--    `(qty_sold + qty_pending <= qty_total)`. ticket_checkout_create_pending now increments
--    qty_pending; ticket_payment_finalize converts qty_pending → qty_sold (net zero on combined);
--    NEW ticket_checkout_cancel RPC releases qty_pending on abandoned carts. The CHECK constraint
--    is the DB-enforced final guard: even if logic drifts, oversell is impossible.
-- ✅ High: attendees array length validation — RPC now raises ATTENDEES_QUANTITY_MISMATCH if
--    jsonb_array_length(p_attendees) <> p_quantity (prevents service_role caller from creating
--    order quantity 5 with 2 or 20 attendee rows).
-- ✅ Medium: short_id entropy — bumped 6 → 10 hex chars (collision rate drops from ~3.5% at 10k
--    orders to ~0.05%). Added gen_random_uuid() to the entropy mix.
-- ✓ Defended: STABLE volatility on get_anonymous_order + ticket_payment_finalize_response —
--   matches repo convention (see 20260404044720_remote_schema.sql); audit #3 over-cautious.
-- ✓ Defended: BEGIN/COMMIT — matches repo convention (3+ existing migrations use this pattern);
--   verified via `grep -l "^BEGIN;" supabase/migrations/*.sql` returns 4 files (counting this one).
-- ✓ Defended: GRANT ALL on anon for money/PII tables — matches repo convention; RLS does row-level work.
-- ✓ Defended: record_check_in p_result not pre-validated — table CHECK constraint catches invalid
--   values at INSERT time. Fail-fast at DB layer is sufficient.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- Existing rows untouched: public.events / public.bookings / public.payments preserved.
-- Existing trigger fn `public.update_updated_at()` is NOT reused — task spec requires `set_updated_at()`
-- as a clean separate fn for the events domain (avoids cross-domain coupling).

BEGIN;

-- =============================================================================
-- 0. Reusable updated_at trigger function (events domain)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_updated_at() IS
  'Events-domain trigger: auto-touches updated_at on UPDATE. Used by event_venues, event_tickets, event_orders, event_attendees, events.';

-- =============================================================================
-- 1. ALTER public.events — additive only (no data loss; zero-downtime safe)
-- =============================================================================

-- NOTE: `events.updated_at` already exists on the live `medellin` Supabase project (verified 2026-05-03).
-- Skipping `ADD COLUMN updated_at` to avoid 42701 conflict.
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS slug                text,
  ADD COLUMN IF NOT EXISTS status              text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published','live','closed','archived')),
  ADD COLUMN IF NOT EXISTS organizer_id        uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS total_capacity      int,
  ADD COLUMN IF NOT EXISTS staff_link_version  int  NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS venue_id            uuid;       -- FK added below after event_venues exists

CREATE UNIQUE INDEX IF NOT EXISTS events_slug_uk        ON public.events(slug) WHERE slug IS NOT NULL;
CREATE        INDEX IF NOT EXISTS events_organizer_idx  ON public.events(organizer_id) WHERE organizer_id IS NOT NULL;
CREATE        INDEX IF NOT EXISTS events_status_idx     ON public.events(status);
-- Per supabase-postgres-best-practices/schema-foreign-key-indexes: index every FK column.
CREATE        INDEX IF NOT EXISTS events_venue_idx      ON public.events(venue_id) WHERE venue_id IS NOT NULL;

DROP TRIGGER IF EXISTS events_set_updated_at ON public.events;
CREATE TRIGGER events_set_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON COLUMN public.events.staff_link_version IS
  'Bump to revoke all outstanding door-staff JWTs for this event (task 034 + 006).';

-- =============================================================================
-- 2. NEW: event_venues — distinct from inline events.address for clean P2 evolution
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.event_venues (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id    uuid NOT NULL REFERENCES public.profiles(id),
  name            text NOT NULL,
  address         text NOT NULL,
  city            text NOT NULL,
  postal_code     text,
  country         text NOT NULL DEFAULT 'CO',
  latitude        numeric(9,6),
  longitude       numeric(9,6),
  capacity        int,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_venues_org_idx  ON public.event_venues(organizer_id);
CREATE INDEX IF NOT EXISTS event_venues_city_idx ON public.event_venues(city);

ALTER TABLE public.event_venues ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS event_venues_set_updated_at ON public.event_venues;
CREATE TRIGGER event_venues_set_updated_at
  BEFORE UPDATE ON public.event_venues
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Wire events.venue_id FK now that event_venues exists
DO $do$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_venue_fkey') THEN
    ALTER TABLE public.events
      ADD CONSTRAINT events_venue_fkey FOREIGN KEY (venue_id) REFERENCES public.event_venues(id);
  END IF;
END $do$;

-- =============================================================================
-- 3. NEW: event_tickets — ticket types per event with sale windows + per-order limits
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.event_tickets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name            text NOT NULL,
  description     text,
  price_cents     int  NOT NULL CHECK (price_cents >= 0),
  currency        text NOT NULL DEFAULT 'COP',
  qty_total       int  NOT NULL CHECK (qty_total > 0),
  qty_sold        int  NOT NULL DEFAULT 0,
  qty_pending     int  NOT NULL DEFAULT 0 CHECK (qty_pending >= 0),  -- audit #3 fix: track reserved seats during checkout
  is_active       boolean NOT NULL DEFAULT true,
  position        int  NOT NULL DEFAULT 0,
  sale_starts_at  timestamptz,
  sale_ends_at    timestamptz,
  min_per_order   int  NOT NULL DEFAULT 1  CHECK (min_per_order >= 1),
  max_per_order   int  NOT NULL DEFAULT 10 CHECK (max_per_order >= min_per_order AND max_per_order <= 50),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  -- audit #3 critical: combined sold+pending must never exceed total
  CHECK (qty_sold + qty_pending <= qty_total),
  CHECK (sale_ends_at IS NULL OR sale_starts_at IS NULL OR sale_ends_at > sale_starts_at)
);

CREATE INDEX IF NOT EXISTS event_tickets_event_idx ON public.event_tickets(event_id);

ALTER TABLE public.event_tickets ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS event_tickets_set_updated_at ON public.event_tickets;
CREATE TRIGGER event_tickets_set_updated_at
  BEFORE UPDATE ON public.event_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- 4. NEW: event_orders — one purchase, parent of N attendees, ledger-linked
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.event_orders (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id              uuid NOT NULL REFERENCES public.events(id),
  ticket_id             uuid NOT NULL REFERENCES public.event_tickets(id),
  quantity              int  NOT NULL CHECK (quantity > 0 AND quantity <= 50),
  buyer_user_id         uuid REFERENCES auth.users(id),
  buyer_email           text NOT NULL,
  buyer_name            text NOT NULL,
  buyer_phone_e164      text,
  total_cents           int  NOT NULL,
  currency              text NOT NULL DEFAULT 'COP',
  payment_id            uuid REFERENCES public.payments(id),
  stripe_session_id     text,
  stripe_payment_intent text,
  status                text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','partial_refund','refunded','cancelled')),
  short_id              text NOT NULL UNIQUE,
  access_token          text NOT NULL UNIQUE,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_orders_event_idx   ON public.event_orders(event_id);
CREATE INDEX IF NOT EXISTS event_orders_ticket_idx  ON public.event_orders(ticket_id);                                    -- FK index (skill: schema-foreign-key-indexes)
CREATE INDEX IF NOT EXISTS event_orders_buyer_idx   ON public.event_orders(buyer_user_id) WHERE buyer_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS event_orders_payment_idx ON public.event_orders(payment_id) WHERE payment_id IS NOT NULL;      -- FK index for refund lookups
CREATE INDEX IF NOT EXISTS event_orders_status_idx  ON public.event_orders(status);
CREATE INDEX IF NOT EXISTS event_orders_pi_idx      ON public.event_orders(stripe_payment_intent) WHERE stripe_payment_intent IS NOT NULL;

ALTER TABLE public.event_orders ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS event_orders_set_updated_at ON public.event_orders;
CREATE TRIGGER event_orders_set_updated_at
  BEFORE UPDATE ON public.event_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON COLUMN public.event_orders.access_token IS
  'Random opaque token; embedded in confirmation email URL so anonymous buyers can fetch their order via get_anonymous_order RPC.';

-- =============================================================================
-- 4b. ALTER public.payments — generalize ledger to support BOTH bookings AND event_orders
-- =============================================================================
-- Audit #2 B1: existing payments.booking_id is NOT NULL — would block event-ticket payments.
-- Fix: drop NOT NULL on booking_id + add event_order_id + CHECK enforcing exactly one source.
-- Existing booking-payment rows continue to satisfy the CHECK (booking_id IS NOT NULL ∧ event_order_id IS NULL).

ALTER TABLE public.payments
  ALTER COLUMN booking_id DROP NOT NULL;

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS event_order_id uuid REFERENCES public.event_orders(id);

DO $do$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payments_source_chk') THEN
    ALTER TABLE public.payments
      ADD CONSTRAINT payments_source_chk CHECK (
        (booking_id IS NOT NULL AND event_order_id IS NULL)
        OR (booking_id IS NULL AND event_order_id IS NOT NULL)
      );
  END IF;
END $do$;

CREATE INDEX IF NOT EXISTS idx_payments_event_order_id
  ON public.payments(event_order_id) WHERE event_order_id IS NOT NULL;

-- New RLS policy for event-order payments (existing booking-payment policies untouched; Postgres OR-unions)
DROP POLICY IF EXISTS payments_event_order_select ON public.payments;
CREATE POLICY payments_event_order_select ON public.payments FOR SELECT
  USING (
    payments.event_order_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.event_orders o
      WHERE o.id = payments.event_order_id AND (
        o.buyer_user_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM public.events e WHERE e.id = o.event_id AND e.organizer_id = (select auth.uid()))
      )
    )
  );

COMMENT ON COLUMN public.payments.event_order_id IS
  'Set when this payment row corresponds to an event-ticket purchase (mutually exclusive with booking_id; enforced by payments_source_chk).';

-- =============================================================================
-- 5. NEW: event_attendees — per-person record carrying the QR
-- =============================================================================
-- id is caller-provided so JWT.attendee_id always equals event_attendees.id (audit #1 R6 fix)

CREATE TABLE IF NOT EXISTS public.event_attendees (
  id            uuid PRIMARY KEY,                            -- caller-provided UUID (NOT default)
  order_id      uuid NOT NULL REFERENCES public.event_orders(id) ON DELETE CASCADE,
  ticket_id     uuid NOT NULL REFERENCES public.event_tickets(id),
  event_id      uuid NOT NULL REFERENCES public.events(id),  -- denormalized for fast scanner lookup
  email         text NOT NULL,
  full_name     text NOT NULL,
  phone_e164    text,
  qr_token      text NOT NULL UNIQUE,
  qr_used_at    timestamptz,
  status        text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','active','cancelled','refunded')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_attendees_order_idx  ON public.event_attendees(order_id);
CREATE INDEX IF NOT EXISTS event_attendees_ticket_idx ON public.event_attendees(ticket_id);  -- FK index (skill: schema-foreign-key-indexes)
CREATE INDEX IF NOT EXISTS event_attendees_event_idx  ON public.event_attendees(event_id);

ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS event_attendees_set_updated_at ON public.event_attendees;
CREATE TRIGGER event_attendees_set_updated_at
  BEFORE UPDATE ON public.event_attendees
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON COLUMN public.event_attendees.id IS
  'NOT auto-defaulted: caller (ticket-checkout edge fn) generates the UUID in JS so JWT.attendee_id always equals this row id.';

-- =============================================================================
-- 6. NEW: event_check_ins — audit trail per scan (forensics + ops monitoring)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.event_check_ins (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        uuid NOT NULL REFERENCES public.events(id),
  attendee_id     uuid REFERENCES public.event_attendees(id),  -- nullable: failed scans w/ unknown token
  qr_token        text NOT NULL,                                -- always recorded (even on failure)
  scanned_by      uuid REFERENCES auth.users(id),               -- nullable for staff JWT (no Supabase user)
  scanner_device  text,
  ip_address      inet,
  result          text NOT NULL CHECK (result IN
    ('consumed','already_used','wrong_event','event_ended',
     'invalid_signature','unknown_token','refunded','cancelled','pending_payment')),
  details         jsonb DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_check_ins_event_idx     ON public.event_check_ins(event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS event_check_ins_attendee_idx  ON public.event_check_ins(attendee_id) WHERE attendee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS event_check_ins_scanned_idx   ON public.event_check_ins(scanned_by) WHERE scanned_by IS NOT NULL;  -- FK index (skill: schema-foreign-key-indexes)
CREATE INDEX IF NOT EXISTS event_check_ins_failures_idx  ON public.event_check_ins(event_id, result) WHERE result <> 'consumed';

ALTER TABLE public.event_check_ins ENABLE ROW LEVEL SECURITY;
-- No updated_at trigger — check-in records are immutable.

-- =============================================================================
-- 7. RLS policies (strict by default; anon-buyer path via RPC + access_token only)
-- =============================================================================

-- event_venues: public SELECT only when venue has at least one published/live event
-- (audit #2 R: don't expose draft/private venue rows). Owner sees all own venues.
DROP POLICY IF EXISTS venues_public_select ON public.event_venues;
CREATE POLICY venues_public_select ON public.event_venues FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.venue_id = event_venues.id AND e.status IN ('published','live')
  ));

DROP POLICY IF EXISTS venues_owner_all ON public.event_venues;
CREATE POLICY venues_owner_all ON public.event_venues FOR ALL
  USING (organizer_id = (select auth.uid()))
  WITH CHECK (organizer_id = (select auth.uid()));

-- event_tickets: public SELECT only on active tickets of published-or-live events
DROP POLICY IF EXISTS tickets_public_select ON public.event_tickets;
CREATE POLICY tickets_public_select ON public.event_tickets FOR SELECT
  USING (is_active = true AND EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_tickets.event_id AND e.status IN ('published','live')
  ));

DROP POLICY IF EXISTS tickets_organizer_all ON public.event_tickets;
CREATE POLICY tickets_organizer_all ON public.event_tickets FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_tickets.event_id AND e.organizer_id = (select auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_tickets.event_id AND e.organizer_id = (select auth.uid())
  ));

-- event_orders: authenticated buyer sees own; organizer sees own event's orders;
-- ANONYMOUS buyer reads via get_anonymous_order RPC (no direct policy).
-- INSERT/UPDATE/DELETE: service-role only via RPCs.
DROP POLICY IF EXISTS orders_buyer_select ON public.event_orders;
CREATE POLICY orders_buyer_select ON public.event_orders FOR SELECT
  USING (buyer_user_id = (select auth.uid()));

DROP POLICY IF EXISTS orders_organizer_select ON public.event_orders;
CREATE POLICY orders_organizer_select ON public.event_orders FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_orders.event_id AND e.organizer_id = (select auth.uid())
  ));

-- event_attendees: visible via order chain
DROP POLICY IF EXISTS attendees_via_order_select ON public.event_attendees;
CREATE POLICY attendees_via_order_select ON public.event_attendees FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.event_orders o
    WHERE o.id = event_attendees.order_id AND (
      o.buyer_user_id = (select auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = o.event_id AND e.organizer_id = (select auth.uid())
      )
    )
  ));

-- event_check_ins: organizer sees own event's logs only.
-- INSERT: service-role-only (via record_check_in RPC, called from task 006).
DROP POLICY IF EXISTS checkins_organizer_select ON public.event_check_ins;
CREATE POLICY checkins_organizer_select ON public.event_check_ins FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_check_ins.event_id AND e.organizer_id = (select auth.uid())
  ));

-- =============================================================================
-- 8. SECURITY DEFINER RPCs
-- =============================================================================

-- 8.1 Anon order lookup (audit #2 R3 fix). Used by /me/tickets/:id?token=<access_token>
CREATE OR REPLACE FUNCTION public.get_anonymous_order(p_order_id uuid, p_access_token text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER STABLE AS $$
DECLARE
  v_order public.event_orders%ROWTYPE;
BEGIN
  SELECT * INTO v_order FROM public.event_orders
   WHERE id = p_order_id AND access_token = p_access_token AND status IN ('paid','refunded','partial_refund');
  IF NOT FOUND THEN RETURN NULL; END IF;
  RETURN jsonb_build_object(
    'order',     row_to_json(v_order),
    'event',     (SELECT row_to_json(e) FROM public.events e WHERE e.id = v_order.event_id),
    'attendees', (SELECT jsonb_agg(row_to_json(a)) FROM public.event_attendees a WHERE a.order_id = p_order_id)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_anonymous_order(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_anonymous_order(uuid, text) TO anon, authenticated;

-- 8.2 Audit-trail helper — called from task 006 after every scan attempt (success or failure)
CREATE OR REPLACE FUNCTION public.record_check_in(
  p_event_id       uuid,
  p_attendee_id    uuid,
  p_qr_token       text,
  p_scanned_by     uuid,
  p_scanner_device text,
  p_ip_address     inet,
  p_result         text,
  p_details        jsonb
) RETURNS uuid LANGUAGE sql SECURITY DEFINER AS $$
  INSERT INTO public.event_check_ins
    (event_id, attendee_id, qr_token, scanned_by, scanner_device, ip_address, result, details)
  VALUES
    (p_event_id, p_attendee_id, p_qr_token, p_scanned_by, p_scanner_device, p_ip_address, p_result, p_details)
  RETURNING id;
$$;

REVOKE ALL ON FUNCTION public.record_check_in(uuid, uuid, text, uuid, text, inet, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_check_in(uuid, uuid, text, uuid, text, inet, text, jsonb) TO service_role;

-- 8.3 Bump staff_link_version (used by task 034 staff-link-revoke endpoint)
CREATE OR REPLACE FUNCTION public.bump_staff_link_version(p_event_id uuid)
RETURNS int LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_new_version int;
BEGIN
  UPDATE public.events
     SET staff_link_version = staff_link_version + 1
   WHERE id = p_event_id AND organizer_id = (SELECT auth.uid())
   RETURNING staff_link_version INTO v_new_version;
  IF NOT FOUND THEN RAISE EXCEPTION 'NOT_ORGANIZER'; END IF;
  RETURN v_new_version;
END;
$$;

REVOKE ALL ON FUNCTION public.bump_staff_link_version(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bump_staff_link_version(uuid) TO authenticated;

-- 8.4 Checkout — atomic capacity check + pending order/attendees creation (task 004)
CREATE OR REPLACE FUNCTION public.ticket_checkout_create_pending(
  p_event_id     uuid,
  p_ticket_id    uuid,
  p_quantity     int,
  p_buyer_email  text,
  p_buyer_name   text,
  p_access_token text,
  p_attendees    jsonb  -- jsonb array of { id, email, full_name, qr_token }
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_ticket   public.event_tickets%ROWTYPE;
  v_event    public.events%ROWTYPE;
  v_order_id uuid;
  v_short_id text;
  v_attendee jsonb;
BEGIN
  -- Lock at event_id granularity (audit #1 R7: hashtext can theoretically collide; v2 hardening)
  PERFORM pg_advisory_xact_lock(hashtext(p_event_id::text));

  -- audit #3 high: validate attendees array length matches quantity
  IF jsonb_array_length(p_attendees) <> p_quantity THEN
    RAISE EXCEPTION 'ATTENDEES_QUANTITY_MISMATCH: expected %, got %',
      p_quantity, jsonb_array_length(p_attendees);
  END IF;

  -- Capacity check (FOR UPDATE locks the row for this transaction)
  SELECT * INTO v_ticket FROM public.event_tickets WHERE id = p_ticket_id FOR UPDATE;
  IF NOT FOUND OR NOT v_ticket.is_active THEN RAISE EXCEPTION 'TICKET_INACTIVE'; END IF;
  IF v_ticket.event_id <> p_event_id THEN RAISE EXCEPTION 'TICKET_INACTIVE'; END IF;
  -- audit #3 critical: combined sold + pending + new must not exceed total. Prevents oversell
  -- when N concurrent checkouts each see the same qty_sold + insert pending orders.
  IF v_ticket.qty_sold + v_ticket.qty_pending + p_quantity > v_ticket.qty_total THEN
    RAISE EXCEPTION 'OUT_OF_STOCK';
  END IF;
  IF p_quantity < v_ticket.min_per_order OR p_quantity > v_ticket.max_per_order THEN
    RAISE EXCEPTION 'QUANTITY_OUT_OF_RANGE: min=% max=%', v_ticket.min_per_order, v_ticket.max_per_order;
  END IF;

  SELECT * INTO v_event FROM public.events WHERE id = p_event_id;
  IF v_event.status NOT IN ('published','live') THEN RAISE EXCEPTION 'EVENT_NOT_PUBLISHED'; END IF;

  -- Sale-window check (sale_starts_at / sale_ends_at)
  IF v_ticket.sale_starts_at IS NOT NULL AND v_ticket.sale_starts_at > now() THEN
    RAISE EXCEPTION 'TICKET_SALE_NOT_STARTED';
  END IF;
  IF v_ticket.sale_ends_at IS NOT NULL AND v_ticket.sale_ends_at < now() THEN
    RAISE EXCEPTION 'TICKET_SALE_ENDED';
  END IF;

  -- audit #3 medium: short_id entropy bumped from 6 → 10 hex chars (16^10 = 1.1T; collision ~0.05% at 10k orders)
  v_short_id := 'MDE-' || upper(substr(
    md5(random()::text || clock_timestamp()::text || gen_random_uuid()::text), 1, 10));

  -- audit #3 critical: increment qty_pending atomically (we hold FOR UPDATE on the ticket row).
  -- The CHECK constraint (qty_sold + qty_pending <= qty_total) enforces this even if the
  -- application logic ever drifts.
  UPDATE public.event_tickets
     SET qty_pending = qty_pending + p_quantity
   WHERE id = p_ticket_id;

  -- Create pending order with ticket_id + quantity + access_token persisted (audit #2 B2 + R3)
  INSERT INTO public.event_orders
    (event_id, ticket_id, quantity, buyer_email, buyer_name, total_cents, currency, status, short_id, access_token)
  VALUES
    (p_event_id, p_ticket_id, p_quantity, p_buyer_email, p_buyer_name,
     v_ticket.price_cents * p_quantity, v_ticket.currency, 'pending', v_short_id, p_access_token)
  RETURNING id INTO v_order_id;

  -- Create pending attendees with caller-provided UUIDs + JWTs (audit #1 R6)
  FOR v_attendee IN SELECT * FROM jsonb_array_elements(p_attendees) LOOP
    INSERT INTO public.event_attendees
      (id, order_id, ticket_id, event_id, email, full_name, qr_token, status)
    VALUES
      ((v_attendee->>'id')::uuid, v_order_id, p_ticket_id, p_event_id,
       v_attendee->>'email', v_attendee->>'full_name', v_attendee->>'qr_token', 'pending');
  END LOOP;

  -- qty_sold is NOT incremented here — that happens only on payment_intent.succeeded in
  -- ticket_payment_finalize, which converts the qty_pending reservation into a committed sale.

  RETURN jsonb_build_object(
    'order_id',    v_order_id,
    'short_id',    v_short_id,
    'price_cents', v_ticket.price_cents,
    'ticket_name', v_ticket.name,
    'event_name',  v_event.name
  );
END;
$$;

REVOKE ALL ON FUNCTION public.ticket_checkout_create_pending(uuid, uuid, int, text, text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ticket_checkout_create_pending(uuid, uuid, int, text, text, text, jsonb) TO service_role;

-- 8.5 Webhook helper — builds the response payload used by both happy-path and idempotent-replay paths
CREATE OR REPLACE FUNCTION public.ticket_payment_finalize_response(
  v_event public.events, v_order public.event_orders, v_ticket public.event_tickets
) RETURNS jsonb LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT jsonb_build_object(
    'event',     row_to_json(v_event),
    'order',     row_to_json(v_order),
    'ticket',    row_to_json(v_ticket),
    'attendees', (SELECT jsonb_agg(row_to_json(a)) FROM public.event_attendees a WHERE a.order_id = v_order.id)
  );
$$;

REVOKE ALL ON FUNCTION public.ticket_payment_finalize_response(public.events, public.event_orders, public.event_tickets) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ticket_payment_finalize_response(public.events, public.event_orders, public.event_tickets) TO service_role;

-- 8.6 Webhook finalize — single atomic order + attendees + qty_sold (audit #1 R4)
CREATE OR REPLACE FUNCTION public.ticket_payment_finalize(
  p_order_id           uuid,
  p_payment_intent_id  text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_order  public.event_orders%ROWTYPE;
  v_ticket public.event_tickets%ROWTYPE;
  v_event  public.events%ROWTYPE;
BEGIN
  -- 1. Lock the order row
  SELECT * INTO v_order FROM public.event_orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ORDER_NOT_FOUND'; END IF;

  -- Idempotent: if already paid (e.g., webhook double-fire bypassing the cache), no-op succeed
  IF v_order.status = 'paid' THEN
    SELECT * INTO v_event  FROM public.events        WHERE id = v_order.event_id;
    SELECT * INTO v_ticket FROM public.event_tickets WHERE id = v_order.ticket_id;
    RETURN public.ticket_payment_finalize_response(v_event, v_order, v_ticket);
  END IF;

  IF v_order.status <> 'pending' THEN
    RAISE EXCEPTION 'ORDER_BAD_STATE: %', v_order.status;
  END IF;

  -- 2. Lock ticket row + atomic increment. audit #3 critical fix: convert qty_pending → qty_sold
  -- (net zero on combined reservation; the seat moves from "held" to "sold" without changing total).
  SELECT * INTO v_ticket FROM public.event_tickets WHERE id = v_order.ticket_id FOR UPDATE;
  UPDATE public.event_tickets
     SET qty_sold    = qty_sold + v_order.quantity,
         qty_pending = GREATEST(0, qty_pending - v_order.quantity)
   WHERE id = v_order.ticket_id;
  v_ticket.qty_sold    := v_ticket.qty_sold + v_order.quantity;
  v_ticket.qty_pending := GREATEST(0, v_ticket.qty_pending - v_order.quantity);

  -- 3. Flip order status + record PI
  UPDATE public.event_orders
     SET status = 'paid', stripe_payment_intent = p_payment_intent_id
   WHERE id = p_order_id;
  v_order.status                := 'paid';
  v_order.stripe_payment_intent := p_payment_intent_id;

  -- 4. Flip attendees pending → active (qr_token already minted at checkout — audit #1 R6)
  UPDATE public.event_attendees
     SET status = 'active'
   WHERE order_id = p_order_id AND status = 'pending';

  SELECT * INTO v_event FROM public.events WHERE id = v_order.event_id;

  -- 5. Build response payload for email/PDF
  RETURN public.ticket_payment_finalize_response(v_event, v_order, v_ticket);
END;
$$;

REVOKE ALL ON FUNCTION public.ticket_payment_finalize(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ticket_payment_finalize(uuid, text) TO service_role;

-- 8.7 Webhook refund — atomic; called via Stripe charge.refunded event lookup
-- Phase 1: full refund only. Partial refunds via task 026 in Phase 1.5 (replaces this fn).
CREATE OR REPLACE FUNCTION public.ticket_payment_refund(p_order_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_order public.event_orders%ROWTYPE;
BEGIN
  SELECT * INTO v_order FROM public.event_orders WHERE id = p_order_id FOR UPDATE;
  IF v_order.status NOT IN ('paid','partial_refund') THEN
    RAISE EXCEPTION 'ORDER_NOT_REFUNDABLE: %', v_order.status;
  END IF;

  UPDATE public.event_attendees SET status = 'refunded' WHERE order_id = p_order_id AND status = 'active';
  UPDATE public.event_orders    SET status = 'refunded' WHERE id = p_order_id;

  -- Decrement qty_sold so the seat returns to inventory
  UPDATE public.event_tickets
     SET qty_sold = GREATEST(0, qty_sold - v_order.quantity)
   WHERE id = v_order.ticket_id;
END;
$$;

REVOKE ALL ON FUNCTION public.ticket_payment_refund(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ticket_payment_refund(uuid) TO service_role;

-- 8.7b Cancel a pending order (audit #3 critical: free up qty_pending for abandoned carts).
-- Called by: (a) Stripe payment_intent.canceled webhook, (b) Phase 1.5 cleanup cron after 30 min,
-- (c) explicit "Cancel order" CTA from /me/tickets when status='pending'.
-- Only cancels pending orders. paid/refunded orders go through ticket_payment_refund instead.
CREATE OR REPLACE FUNCTION public.ticket_checkout_cancel(p_order_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_order public.event_orders%ROWTYPE;
BEGIN
  SELECT * INTO v_order FROM public.event_orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ORDER_NOT_FOUND'; END IF;
  IF v_order.status <> 'pending' THEN
    RAISE EXCEPTION 'ORDER_NOT_PENDING: status=%', v_order.status;
  END IF;

  -- Release the reservation: qty_pending decrements; qty_sold untouched (was never bumped)
  UPDATE public.event_tickets
     SET qty_pending = GREATEST(0, qty_pending - v_order.quantity)
   WHERE id = v_order.ticket_id;

  -- Mark order + attendees cancelled (cascades preserve audit trail; rows stay)
  UPDATE public.event_attendees SET status = 'cancelled' WHERE order_id = p_order_id;
  UPDATE public.event_orders    SET status = 'cancelled' WHERE id = p_order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.ticket_checkout_cancel(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ticket_checkout_cancel(uuid) TO service_role;

-- 8.8 Door scan — race-safe single-use with explicit error codes (task 006)
CREATE OR REPLACE FUNCTION public.ticket_validate_consume(p_qr_token text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_attendee public.event_attendees%ROWTYPE;
  v_ticket   public.event_tickets%ROWTYPE;
  v_event    public.events%ROWTYPE;
  v_now      timestamptz := now();
BEGIN
  -- 1. Look up attendee by qr_token (UNIQUE; O(1))
  SELECT * INTO v_attendee FROM public.event_attendees WHERE qr_token = p_qr_token;
  IF NOT FOUND THEN
    -- Distinguish UNKNOWN_TOKEN (no row) from INVALID_SIGNATURE (caller pre-checked sig)
    RETURN jsonb_build_object('result', 'unknown_token');
  END IF;

  -- 2. Status checks (no DB write yet)
  IF v_attendee.status = 'pending'   THEN RETURN jsonb_build_object('result', 'pending_payment'); END IF;
  IF v_attendee.status = 'refunded'  THEN
    RETURN jsonb_build_object('result', 'refunded',
      'details', jsonb_build_object('attendee_name', v_attendee.full_name));
  END IF;
  IF v_attendee.status = 'cancelled' THEN RETURN jsonb_build_object('result', 'cancelled'); END IF;

  IF v_attendee.qr_used_at IS NOT NULL THEN
    RETURN jsonb_build_object('result', 'already_used', 'details', jsonb_build_object(
      'used_at',       v_attendee.qr_used_at,
      'attendee_name', v_attendee.full_name
    ));
  END IF;

  -- 3. Event sanity
  SELECT * INTO v_event FROM public.events WHERE id = v_attendee.event_id;
  IF v_event.event_end_time IS NOT NULL AND v_event.event_end_time < v_now THEN
    RETURN jsonb_build_object('result', 'event_ended');
  END IF;

  -- 4. Atomic consume — race-safe (returns 0 rows if another concurrent scan won)
  UPDATE public.event_attendees
     SET qr_used_at = v_now
   WHERE id = v_attendee.id AND qr_used_at IS NULL
   RETURNING qr_used_at INTO v_attendee.qr_used_at;

  IF NOT FOUND THEN
    -- Race lost — read the winner's timestamp
    SELECT qr_used_at INTO v_attendee.qr_used_at
      FROM public.event_attendees WHERE id = v_attendee.id;
    RETURN jsonb_build_object('result', 'already_used', 'details', jsonb_build_object(
      'used_at',       v_attendee.qr_used_at,
      'attendee_name', v_attendee.full_name
    ));
  END IF;

  SELECT * INTO v_ticket FROM public.event_tickets WHERE id = v_attendee.ticket_id;

  RETURN jsonb_build_object('result', 'consumed', 'details', jsonb_build_object(
    'attendee_name', v_attendee.full_name,
    'ticket_tier',   v_ticket.name,
    'short_id',      (SELECT short_id FROM public.event_orders WHERE id = v_attendee.order_id)
  ));
END;
$$;

REVOKE ALL ON FUNCTION public.ticket_validate_consume(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ticket_validate_consume(text) TO service_role;

-- =============================================================================
-- 9. GRANT statements (Data API access — required when role-default access is restricted)
-- =============================================================================
-- Per supabase skill §"Exposing tables to the Data API": newly created tables may not be
-- auto-exposed to anon/authenticated. Granting table-level access here; RLS does row-level work.
-- Matches the existing repo convention (see 20260404120005_p1_payments.sql lines 102-104).

GRANT ALL ON TABLE public.event_venues     TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.event_tickets    TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.event_orders     TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.event_attendees  TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.event_check_ins  TO anon, authenticated, service_role;

-- =============================================================================
-- 10. Comments (operator-friendly schema docs)
-- =============================================================================

COMMENT ON TABLE public.event_venues     IS 'Phase 1 events MVP — venue master record. Public SELECT only when venue has a published/live event.';
COMMENT ON TABLE public.event_tickets    IS 'Phase 1 events MVP — ticket types per event. Sale windows + min/max per order. Public SELECT only on active tickets of published events.';
COMMENT ON TABLE public.event_orders     IS 'Phase 1 events MVP — one purchase, parent of N attendees. Anon buyers read via get_anonymous_order RPC + access_token.';
COMMENT ON TABLE public.event_attendees  IS 'Phase 1 events MVP — per-person QR holder. id is caller-provided so JWT.attendee_id always matches.';
COMMENT ON TABLE public.event_check_ins  IS 'Phase 1 events MVP — append-only audit log of every door scan (success + failure). Immutable.';

COMMIT;

-- =============================================================================
-- ROLLBACK PLAN (for reference; do NOT run as part of this migration)
-- =============================================================================
-- BEGIN;
--   DROP FUNCTION IF EXISTS public.ticket_validate_consume(text);
--   DROP FUNCTION IF EXISTS public.ticket_payment_refund(uuid);
--   DROP FUNCTION IF EXISTS public.ticket_payment_finalize(uuid, text);
--   DROP FUNCTION IF EXISTS public.ticket_payment_finalize_response(public.events, public.event_orders, public.event_tickets);
--   DROP FUNCTION IF EXISTS public.ticket_checkout_create_pending(uuid, uuid, int, text, text, text, jsonb);
--   DROP FUNCTION IF EXISTS public.bump_staff_link_version(uuid);
--   DROP FUNCTION IF EXISTS public.record_check_in(uuid, uuid, text, uuid, text, inet, text, jsonb);
--   DROP FUNCTION IF EXISTS public.get_anonymous_order(uuid, text);
--   DROP TABLE IF EXISTS public.event_check_ins CASCADE;
--   DROP TABLE IF EXISTS public.event_attendees CASCADE;
--   ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_source_chk;
--   DROP POLICY IF EXISTS payments_event_order_select ON public.payments;
--   DROP INDEX IF EXISTS public.idx_payments_event_order_id;
--   ALTER TABLE public.payments DROP COLUMN IF EXISTS event_order_id;
--   ALTER TABLE public.payments ALTER COLUMN booking_id SET NOT NULL;
--   DROP TABLE IF EXISTS public.event_orders CASCADE;
--   DROP TABLE IF EXISTS public.event_tickets CASCADE;
--   ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_venue_fkey;
--   DROP TABLE IF EXISTS public.event_venues CASCADE;
--   ALTER TABLE public.events
--     DROP COLUMN IF EXISTS updated_at,
--     DROP COLUMN IF EXISTS venue_id,
--     DROP COLUMN IF EXISTS staff_link_version,
--     DROP COLUMN IF EXISTS total_capacity,
--     DROP COLUMN IF EXISTS organizer_id,
--     DROP COLUMN IF EXISTS status,
--     DROP COLUMN IF EXISTS slug;
--   DROP TRIGGER IF EXISTS events_set_updated_at ON public.events;
--   DROP FUNCTION IF EXISTS public.set_updated_at();
-- COMMIT;
