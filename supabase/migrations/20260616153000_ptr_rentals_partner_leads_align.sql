-- PTR-RENTALS-P0 follow-up — align partner-member leads access with listing ownership
-- Tightens ptr012: partner_id match alone is not enough when apartment_id is set;
-- apartment.landlord_id must bridge to partners.landlord_profile_id for that partner.

BEGIN;

CREATE OR REPLACE FUNCTION public.lead_partner_listing_aligned(
  p_partner_id uuid,
  p_apartment_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    p_apartment_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.partners p
      JOIN public.apartments a ON a.landlord_id = p.landlord_profile_id
      WHERE p.id = p_partner_id
        AND a.id = p_apartment_id
    );
$$;

COMMENT ON FUNCTION public.lead_partner_listing_aligned(uuid, uuid) IS
  'True when lead partner_id matches the landlord_profile bridge for apartment_id, or apartment_id is null.';

DROP POLICY IF EXISTS leads_select_partner_member ON public.leads;
CREATE POLICY leads_select_partner_member
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (SELECT public.partner_ids_for_user())
    AND public.lead_partner_listing_aligned(partner_id, apartment_id)
  );

DROP POLICY IF EXISTS leads_update_partner_member ON public.leads;
CREATE POLICY leads_update_partner_member
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (
    partner_id IN (SELECT public.partner_ids_for_user())
    AND public.lead_partner_listing_aligned(partner_id, apartment_id)
  )
  WITH CHECK (
    partner_id IN (SELECT public.partner_ids_for_user())
    AND public.lead_partner_listing_aligned(partner_id, apartment_id)
  );

COMMIT;
