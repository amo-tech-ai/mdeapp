-- DATA-009 M3 — apartments rental search indexes
-- Applied live: data009_apartments_price_daily_indexes (2026-05-29)
-- Note: non-CONCURRENT for MCP apply (44-row table)

CREATE INDEX IF NOT EXISTS idx_apartments_price_daily_active
  ON public.apartments (price_daily)
  WHERE status = 'active' AND price_daily IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_apartments_rental_search_daily
  ON public.apartments (neighborhood, bedrooms, price_daily)
  WHERE status = 'active';
