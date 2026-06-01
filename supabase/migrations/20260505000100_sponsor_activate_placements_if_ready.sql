-- ============================================================
-- Audit B2 fix: sponsor.activate_placements_if_ready
--
-- Closes the "pay-before-sign" / "sign-before-pay" race: a
-- sponsor's placements MUST NOT go live until BOTH conditions
-- are true at the same moment:
--
--   1. sponsor.invoices.status = 'paid'  for the application
--   2. sponsor.contracts.status IN ('signed','active')  for the application
--
-- Called by:
--   • sponsor-payment-webhook  (after invoice.status → 'paid')
--   • sponsor-contract-sign    (after contract.status → 'signed')
--
-- Both callers invoke the same function, so there is exactly ONE
-- place in the entire system that can flip placements.active = true.
-- ============================================================

CREATE OR REPLACE FUNCTION public.activate_placements_if_ready(
  p_application_id uuid
)
RETURNS integer           -- number of placements activated (0 if conditions not yet met)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''      -- prevent search_path injection in SECURITY DEFINER context
AS $$
DECLARE
  v_invoice_paid    boolean := false;
  v_contract_signed boolean := false;
  v_activated       integer := 0;
BEGIN
  -- ── 1. Check for a paid invoice ─────────────────────────────────────────────
  SELECT EXISTS (
    SELECT 1
      FROM sponsor.invoices
     WHERE application_id = p_application_id
       AND status = 'paid'
  ) INTO v_invoice_paid;

  -- ── 2. Check for a signed or active contract ─────────────────────────────────
  SELECT EXISTS (
    SELECT 1
      FROM sponsor.contracts
     WHERE application_id = p_application_id
       AND status IN ('signed', 'active')
  ) INTO v_contract_signed;

  -- ── 3. Only activate when BOTH conditions met ────────────────────────────────
  --
  -- If either condition is not yet met the function returns 0 silently.
  -- The other caller (webhook or contract-sign) will invoke this function
  -- again once its half of the prerequisite is complete, at which point
  -- both conditions will be true and the placements will activate.
  --
  IF NOT v_invoice_paid OR NOT v_contract_signed THEN
    RETURN 0;
  END IF;

  -- ── 4. Activate eligible placements atomically ───────────────────────────────
  --
  -- Only placements whose campaign window has started are activated now.
  -- Future-dated placements (start_at > now()) will be activated by the
  -- rules-engine cron when their window opens.
  --
  UPDATE sponsor.placements
     SET active = true
   WHERE application_id = p_application_id
     AND start_at <= now()
     AND active = false;         -- idempotent: already-active placements are skipped

  GET DIAGNOSTICS v_activated = ROW_COUNT;
  RETURN v_activated;
END;
$$;

-- ── Permissions ───────────────────────────────────────────────────────────────
-- Only service_role (edge functions) should call this. Never expose to anon or
-- authenticated roles — placement activation is an internal operation.
REVOKE EXECUTE ON FUNCTION public.activate_placements_if_ready(uuid) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.activate_placements_if_ready(uuid) TO service_role;

-- ── Comment ───────────────────────────────────────────────────────────────────
COMMENT ON FUNCTION public.activate_placements_if_ready(uuid) IS
  'Activates sponsor placements for an application only when BOTH a paid invoice '
  'AND a signed/active contract exist. Safe to call multiple times (idempotent). '
  'Returns the count of newly activated placements (0 = conditions not yet met).';
