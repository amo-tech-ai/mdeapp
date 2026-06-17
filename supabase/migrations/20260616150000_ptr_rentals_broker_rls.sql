-- PTR-RENTALS-002 / SAN-1105 — broker-scoped RLS on apartments, leads, showings
-- Replaces authenticated_can_view_all_apartments (broker isolation hole).
-- Ownership chain: auth.uid() → landlord_profiles.user_id → apartments.landlord_id

BEGIN;

CREATE OR REPLACE FUNCTION public.broker_owns_apartment(p_apartment_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.apartments a
    WHERE a.id = p_apartment_id
      AND a.landlord_id IN (SELECT public.acting_landlord_ids())
  );
$$;

COMMENT ON FUNCTION public.broker_owns_apartment(uuid) IS
  'True when the current auth user owns the apartment via landlord_profiles → apartments.landlord_id.';

DROP POLICY IF EXISTS authenticated_can_view_all_apartments ON public.apartments;

DROP POLICY IF EXISTS apartments_select_broker_or_catalog ON public.apartments;
CREATE POLICY apartments_select_broker_or_catalog
  ON public.apartments
  FOR SELECT
  TO authenticated
  USING (
    landlord_id IN (SELECT public.acting_landlord_ids())
    OR status IN ('active', 'booked')
    OR (SELECT public.is_admin())
  );

DROP POLICY IF EXISTS apartments_insert_broker ON public.apartments;
CREATE POLICY apartments_insert_broker
  ON public.apartments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    landlord_id IN (SELECT public.acting_landlord_ids())
    OR (SELECT public.is_admin())
  );

DROP POLICY IF EXISTS apartments_update_broker ON public.apartments;
CREATE POLICY apartments_update_broker
  ON public.apartments
  FOR UPDATE
  TO authenticated
  USING (
    landlord_id IN (SELECT public.acting_landlord_ids())
    OR (SELECT public.is_admin())
  )
  WITH CHECK (
    landlord_id IN (SELECT public.acting_landlord_ids())
    OR (SELECT public.is_admin())
  );

-- Broker listing policies are additive (PostgreSQL ORs permissive policies).
-- Legacy policies are kept on purpose:
--   leads_select_own_or_agent_or_admin — prospect + assigned-agent CRM (p1_leads)
--   leads_select_partner_member — partner queue (ptr012)
-- They do not grant cross-broker reads: an unassigned broker cannot SELECT another
-- landlord's leads (smoke: broker_a_cannot_read_broker_b_lead in ptr-rentals-p0-rls-smoke.sql).

DROP POLICY IF EXISTS leads_select_broker_listing ON public.leads;
CREATE POLICY leads_select_broker_listing
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (
    (
      apartment_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.apartments a
        WHERE a.id = leads.apartment_id
          AND a.landlord_id IN (SELECT public.acting_landlord_ids())
      )
    )
    OR (SELECT public.is_admin())
  );

DROP POLICY IF EXISTS leads_update_broker_listing ON public.leads;
CREATE POLICY leads_update_broker_listing
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (
    (
      apartment_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.apartments a
        WHERE a.id = leads.apartment_id
          AND a.landlord_id IN (SELECT public.acting_landlord_ids())
      )
    )
    OR (SELECT public.is_admin())
  )
  WITH CHECK (
    (
      apartment_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.apartments a
        WHERE a.id = leads.apartment_id
          AND a.landlord_id IN (SELECT public.acting_landlord_ids())
      )
    )
    OR (SELECT public.is_admin())
  );

DROP POLICY IF EXISTS showings_select_visible ON public.showings;
CREATE POLICY showings_select_visible
  ON public.showings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.leads l
      WHERE l.id = showings.lead_id
        AND (
          l.user_id = (SELECT auth.uid())
          OR l.assigned_agent_id = (SELECT auth.uid())
        )
    )
    OR EXISTS (
      SELECT 1
      FROM public.apartments a
      WHERE a.id = showings.apartment_id
        AND (
          a.host_id = (SELECT auth.uid())
          OR a.landlord_id IN (SELECT public.acting_landlord_ids())
        )
    )
    OR (SELECT public.is_admin())
  );

DROP POLICY IF EXISTS showings_update_visible ON public.showings;
CREATE POLICY showings_update_visible
  ON public.showings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.leads l
      WHERE l.id = showings.lead_id
        AND (
          l.user_id = (SELECT auth.uid())
          OR l.assigned_agent_id = (SELECT auth.uid())
        )
    )
    OR EXISTS (
      SELECT 1
      FROM public.apartments a
      WHERE a.id = showings.apartment_id
        AND (
          a.host_id = (SELECT auth.uid())
          OR a.landlord_id IN (SELECT public.acting_landlord_ids())
        )
    )
    OR (SELECT public.is_admin())
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.leads l
      WHERE l.id = showings.lead_id
        AND (
          l.user_id = (SELECT auth.uid())
          OR l.assigned_agent_id = (SELECT auth.uid())
        )
    )
    OR EXISTS (
      SELECT 1
      FROM public.apartments a
      WHERE a.id = showings.apartment_id
        AND (
          a.host_id = (SELECT auth.uid())
          OR a.landlord_id IN (SELECT public.acting_landlord_ids())
        )
    )
    OR (SELECT public.is_admin())
  );

COMMIT;
