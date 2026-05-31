-- 25U: Tighten payments_event_order_select from public → authenticated role
-- The USING clause correctly checks auth.uid(), but roles={public} meant anon
-- callers matched the policy (getting 0 rows, but triggering it). Replace with
-- authenticated-only policy so anon users see no policy at all.

DROP POLICY IF EXISTS payments_event_order_select ON public.payments;

CREATE POLICY payments_event_order_select ON public.payments
FOR SELECT TO authenticated
USING (
  event_order_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.event_orders o
    WHERE o.id = payments.event_order_id
      AND (
        o.buyer_user_id = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.events e
          WHERE e.id = o.event_id
            AND e.organizer_id = (SELECT auth.uid())
        )
      )
  )
);
