-- Landlord V1 — server-side response metrics + cohort aggregator (D12 finish, part 1)
-- ──────────────────────────────────────────────────────────────────────
-- Completes D12 by adding the server-side counterparts to the
-- client-side KPI strip already shipped in commit d0243ec:
--
--   1. landlord_response_metrics view — per-landlord 30-day rollup of
--      inbox activity (server-side equivalent of useLandlordMetrics).
--   2. snapshot_analytics_events_daily(target_date) — UPSERT one row
--      per landlord per day into analytics_events_daily. Idempotent.
--   3. pg_cron schedule mdeai_analytics_daily_snapshot — fires daily
--      at 03:10 UTC (≈ 22:10 Bogotá previous day) snapshotting
--      yesterday's metrics.
--
-- Note: the orphan-row filter (`AND landlord_id IS NOT NULL`) lands
-- in the next migration `20260501204754_…_filter_orphans.sql` after
-- the D1 chat-trigger leaks were caught during browser proof.

BEGIN;

-- 1. landlord_response_metrics view (security_invoker)
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

-- 2. snapshot_analytics_events_daily(target_date) — idempotent UPSERT
CREATE OR REPLACE FUNCTION public.snapshot_analytics_events_daily(target_date date)
RETURNS TABLE (landlord_id uuid, snapshotted_date date, leads_received int)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $fn$
  WITH per_landlord AS (
    SELECT
      lp.id AS landlord_id,
      coalesce(li.received, 0) AS leads_received,
      coalesce(li.viewed, 0)   AS leads_viewed,
      coalesce(li.replied, 0)  AS replies_marked,
      coalesce(ap.created, 0)  AS listings_created
    FROM public.landlord_profiles lp
    LEFT JOIN (
      SELECT
        landlord_id,
        count(*) FILTER (WHERE created_at::date     = target_date) AS received,
        count(*) FILTER (WHERE viewed_at::date      = target_date) AS viewed,
        count(*) FILTER (WHERE first_reply_at::date = target_date) AS replied
      FROM public.landlord_inbox
      WHERE created_at::date     = target_date
         OR viewed_at::date      = target_date
         OR first_reply_at::date = target_date
      GROUP BY landlord_id
    ) li ON li.landlord_id = lp.id
    LEFT JOIN (
      SELECT landlord_id, count(*) AS created
      FROM public.apartments
      WHERE landlord_id IS NOT NULL
        AND created_at::date = target_date
      GROUP BY landlord_id
    ) ap ON ap.landlord_id = lp.id
    WHERE coalesce(li.received, 0)
        + coalesce(li.viewed, 0)
        + coalesce(li.replied, 0)
        + coalesce(ap.created, 0) > 0
  ),
  upserted AS (
    INSERT INTO public.analytics_events_daily AS d (
      landlord_id, date,
      logins, listings_created, listings_edited,
      leads_received, leads_viewed, whatsapp_clicks,
      replies_marked, affiliate_revenue_cents
    )
    SELECT
      pl.landlord_id, target_date, 0, pl.listings_created, 0,
      pl.leads_received, pl.leads_viewed, 0,
      pl.replies_marked, 0
    FROM per_landlord pl
    ON CONFLICT (landlord_id, date) DO UPDATE SET
      listings_created = EXCLUDED.listings_created,
      leads_received   = EXCLUDED.leads_received,
      leads_viewed     = EXCLUDED.leads_viewed,
      replies_marked   = EXCLUDED.replies_marked
    RETURNING d.landlord_id, d.date, d.leads_received
  )
  SELECT landlord_id, date AS snapshotted_date, leads_received FROM upserted;
$fn$;

REVOKE EXECUTE ON FUNCTION public.snapshot_analytics_events_daily(date)
  FROM PUBLIC, anon, authenticated;

-- 3. pg_cron daily schedule (guarded: pg_cron not available in local dev)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    RAISE NOTICE 'pg_cron not installed, skipping analytics cron schedule (local dev)';
    RETURN;
  END IF;
  -- Remove existing schedule if present
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'mdeai_analytics_daily_snapshot') THEN
    PERFORM cron.unschedule('mdeai_analytics_daily_snapshot');
  END IF;
  -- Create daily snapshot schedule
  PERFORM cron.schedule(
    'mdeai_analytics_daily_snapshot',
    '10 3 * * *',
    'SELECT public.snapshot_analytics_events_daily((current_date - 1));'
  );
END $$;

COMMIT;
