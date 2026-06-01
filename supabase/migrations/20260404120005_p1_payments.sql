-- P1: Stripe payment ledger rows (extends bookings.payment_status)
-- Depends on: bookings
-- Practices: numeric(12,2) for money (schema-data-types); index booking_id FK; single SELECT policy ORs roles

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings (id) ON DELETE RESTRICT,
  amount numeric(12, 2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'USD',
  stripe_payment_intent_id text,
  stripe_customer_id text,
  status text NOT NULL DEFAULT 'pending',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payments_status_check CHECK (
    status = ANY (
      ARRAY[
        'pending',
        'processing',
        'succeeded',
        'failed',
        'refunded',
        'canceled'
      ]::text[]
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments (booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments (status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_stripe_pi_unique ON public.payments (stripe_payment_intent_id)
WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments (created_at DESC);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Renter, apartment host (apartment bookings), or admin
CREATE POLICY payments_select_authenticated
  ON public.payments FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = payments.booking_id
        AND b.user_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.apartments a ON a.id = b.resource_id
      WHERE b.id = payments.booking_id
        AND b.booking_type = 'apartment'
        AND a.host_id = (select auth.uid())
    )
    OR (select public.is_admin())
  );

-- Inserts from client: only own booking; full automation uses service_role
CREATE POLICY payments_insert_own_booking
  ON public.payments FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
        AND b.user_id = (select auth.uid())
    )
  );

CREATE POLICY payments_update_own_or_admin
  ON public.payments FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = payments.booking_id
        AND b.user_id = (select auth.uid())
    )
    OR (select public.is_admin())
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = payments.booking_id
        AND b.user_id = (select auth.uid())
    )
    OR (select public.is_admin())
  );

CREATE POLICY payments_delete_admin
  ON public.payments FOR DELETE TO authenticated
  USING ((select public.is_admin()));

CREATE POLICY payments_service_role
  ON public.payments
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON TABLE public.payments TO anon;
GRANT ALL ON TABLE public.payments TO authenticated;
GRANT ALL ON TABLE public.payments TO service_role;

COMMENT ON TABLE public.payments IS 'P1: payment ledger; sync with Stripe webhooks via edge functions (service_role)';
