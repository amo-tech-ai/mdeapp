-- Filter orphan landlord_id=NULL rows from the metrics view (D12 finish, part 2)
-- ──────────────────────────────────────────────────────────────────────
-- Caught during the D12 server-side browser proof: the view returned
-- 2 rows for qa-landlord — own row (correct) AND a `landlord_id=null`
-- row with `total_leads=1` (wrong).
--
-- Root cause: the D1 `auto_create_landlord_inbox_from_message` trigger
-- inserts a `landlord_inbox` row on first user chat message. When the
-- AI doesn't resolve a specific apartment, `landlord_id` ends up null.
-- These rows are useful as a renter-side audit trail but shouldn't
-- roll up into landlord-facing performance metrics.
--
-- Fix: add `AND landlord_id IS NOT NULL` to the view's WHERE clause.
-- The orphan rows still exist (renter audit trail) but no longer
-- corrupt landlord-facing metrics.

CREATE OR REPLACE VIEW public.landlord_response_metrics
WITH (security_invoker = true)
AS
WITH window_leads AS (
  SELECT
    landlord_id,
    status,
    created_at,
    first_reply_at,
    archived_at,
    CASE
      WHEN first_reply_at IS NOT NULL
       AND first_reply_at > created_at
       AND first_reply_at < created_at + interval '30 days'
      THEN extract(epoch FROM (first_reply_at - created_at))
      ELSE NULL
    END AS ttfr_seconds
  FROM public.landlord_inbox
  WHERE created_at >= now() - interval '30 days'
    AND landlord_id IS NOT NULL  -- skip orphan chat rows (no apartment resolved)
)
SELECT
  landlord_id,
  count(*)                                            AS total_leads,
  count(*) FILTER (WHERE status = 'new')               AS new_leads,
  count(*) FILTER (WHERE status IN ('new','viewed'))  AS active_leads,
  count(*) FILTER (WHERE status = 'replied')           AS replied_leads,
  count(*) FILTER (WHERE status = 'archived')          AS archived_leads,
  count(ttfr_seconds)                                  AS replied_with_ttfr,
  CASE
    WHEN count(*) = 0 THEN NULL
    ELSE round(
      count(*) FILTER (WHERE first_reply_at IS NOT NULL)::numeric
        / count(*)::numeric * 100
    )::int
  END                                                  AS reply_rate_pct,
  CASE
    WHEN count(ttfr_seconds) = 0 THEN NULL
    ELSE round(
      percentile_cont(0.5) WITHIN GROUP (ORDER BY ttfr_seconds)::numeric
    )::int
  END                                                  AS median_ttfr_seconds
FROM window_leads
GROUP BY landlord_id;

GRANT SELECT ON public.landlord_response_metrics TO authenticated;
