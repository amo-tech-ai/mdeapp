-- =============================================================================
-- Task 027: event_taxes_and_fees — Colombia IVA 19% + service fees per organizer
-- Phase 1.5 EVENTS
-- =============================================================================

-- 1. Tax/fee rule table (per organizer, reused across events)
CREATE TABLE IF NOT EXISTS public.event_taxes_and_fees (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id      uuid NOT NULL REFERENCES public.profiles(id),
  name              text NOT NULL,
  type              text NOT NULL CHECK (type IN ('TAX','FEE')),
  calculation_type  text NOT NULL CHECK (calculation_type IN ('FIXED','PERCENTAGE')),
  rate              numeric(10,3) NOT NULL CHECK (rate >= 0),
  is_active         boolean NOT NULL DEFAULT true,
  is_default        boolean NOT NULL DEFAULT false,
  description       text,
  display_order     int NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_taxes_and_fees_org_idx ON public.event_taxes_and_fees(organizer_id);
ALTER TABLE  public.event_taxes_and_fees ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS event_taxes_and_fees_set_updated_at ON public.event_taxes_and_fees;
CREATE TRIGGER event_taxes_and_fees_set_updated_at
  BEFORE UPDATE ON public.event_taxes_and_fees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 2. M:N pivot: applies rules to specific ticket tiers
CREATE TABLE IF NOT EXISTS public.event_ticket_taxes_and_fees (
  ticket_id   uuid NOT NULL REFERENCES public.event_tickets(id) ON DELETE CASCADE,
  tax_fee_id  uuid NOT NULL REFERENCES public.event_taxes_and_fees(id) ON DELETE CASCADE,
  PRIMARY KEY (ticket_id, tax_fee_id)
);

CREATE INDEX IF NOT EXISTS event_ticket_tax_fee_ticket_idx ON public.event_ticket_taxes_and_fees(ticket_id);
CREATE INDEX IF NOT EXISTS event_ticket_tax_fee_rule_idx   ON public.event_ticket_taxes_and_fees(tax_fee_id);

ALTER TABLE public.event_ticket_taxes_and_fees ENABLE ROW LEVEL SECURITY;

-- 3. Per-order breakdown columns (subtotal + tax + fee separate from total)
ALTER TABLE public.event_orders
  ADD COLUMN IF NOT EXISTS subtotal_cents int NOT NULL DEFAULT 0 CHECK (subtotal_cents >= 0),
  ADD COLUMN IF NOT EXISTS tax_cents      int NOT NULL DEFAULT 0 CHECK (tax_cents >= 0),
  ADD COLUMN IF NOT EXISTS fee_cents      int NOT NULL DEFAULT 0 CHECK (fee_cents >= 0);

-- 4. RLS policies
DROP POLICY IF EXISTS tax_fee_organizer_all ON public.event_taxes_and_fees;
CREATE POLICY tax_fee_organizer_all ON public.event_taxes_and_fees FOR ALL
  USING (organizer_id = (select auth.uid()))
  WITH CHECK (organizer_id = (select auth.uid()));

DROP POLICY IF EXISTS tax_fee_public_select ON public.event_taxes_and_fees;
CREATE POLICY tax_fee_public_select ON public.event_taxes_and_fees FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS ticket_tax_fee_public_select ON public.event_ticket_taxes_and_fees;
CREATE POLICY ticket_tax_fee_public_select ON public.event_ticket_taxes_and_fees FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.event_tickets t
    JOIN public.events e ON e.id = t.event_id
    WHERE t.id = event_ticket_taxes_and_fees.ticket_id AND e.status IN ('published','live')
  ));

DROP POLICY IF EXISTS ticket_tax_fee_organizer_all ON public.event_ticket_taxes_and_fees;
CREATE POLICY ticket_tax_fee_organizer_all ON public.event_ticket_taxes_and_fees FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.event_tickets t
    JOIN public.events e ON e.id = t.event_id
    WHERE t.id = event_ticket_taxes_and_fees.ticket_id AND e.organizer_id = (select auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.event_tickets t
    JOIN public.events e ON e.id = t.event_id
    WHERE t.id = event_ticket_taxes_and_fees.ticket_id AND e.organizer_id = (select auth.uid())
  ));

-- 5. Calculation helper RPC — called by ticket-checkout before persisting total_cents
CREATE OR REPLACE FUNCTION public.compute_ticket_total(
  p_ticket_id     uuid,
  p_quantity      int,
  p_discount_cents int DEFAULT 0
) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER
  SET search_path = public
AS $$
DECLARE
  v_ticket  public.event_tickets%ROWTYPE;
  v_subtotal int;
  v_tax      int := 0;
  v_fee      int := 0;
  v_rule     public.event_taxes_and_fees%ROWTYPE;
  v_amount   int;
BEGIN
  SELECT * INTO v_ticket FROM public.event_tickets WHERE id = p_ticket_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'TICKET_NOT_FOUND'; END IF;

  v_subtotal := GREATEST(0, (v_ticket.price_cents * p_quantity) - p_discount_cents);

  FOR v_rule IN
    SELECT t.* FROM public.event_taxes_and_fees t
    JOIN public.event_ticket_taxes_and_fees pivot ON pivot.tax_fee_id = t.id
    WHERE pivot.ticket_id = p_ticket_id AND t.is_active
    ORDER BY t.display_order
  LOOP
    IF v_rule.calculation_type = 'PERCENTAGE' THEN
      v_amount := round(v_subtotal * v_rule.rate / 100);
    ELSE
      v_amount := round(v_rule.rate * p_quantity);
    END IF;

    IF v_rule.type = 'TAX' THEN
      v_tax := v_tax + v_amount;
    ELSE
      v_fee := v_fee + v_amount;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'subtotal_cents', v_subtotal,
    'tax_cents',      v_tax,
    'fee_cents',      v_fee,
    'total_cents',    v_subtotal + v_tax + v_fee
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.compute_ticket_total(uuid, int, int) TO service_role;
GRANT EXECUTE ON FUNCTION public.compute_ticket_total(uuid, int, int) TO authenticated;

COMMENT ON TABLE  public.event_taxes_and_fees IS 'Per-organizer tax/fee rules (e.g. Colombia IVA 19%, service fee COP 500/ticket). Reused across events.';
COMMENT ON TABLE  public.event_ticket_taxes_and_fees IS 'M:N pivot: which tax/fee rules apply to which ticket tiers.';
COMMENT ON FUNCTION public.compute_ticket_total IS 'Returns {subtotal_cents, tax_cents, fee_cents, total_cents} for a ticket purchase. Called by ticket-checkout before final INSERT.';
