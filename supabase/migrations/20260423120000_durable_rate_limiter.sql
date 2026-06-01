-- Durable rate limiter: Postgres-backed fixed-window counter.
-- Replaces the per-isolate in-memory limiter in _shared/rate-limit.ts which
-- resets on cold start and can be bypassed by hitting different isolates.
--
-- Split into separate schema / RPC / grants files would be ideal, but this
-- migration only defines ONE function — no multi-function / multi-$$ issue.

CREATE TABLE IF NOT EXISTS public.rate_limit_hits (
  bucket_key   text        NOT NULL,
  window_start timestamptz NOT NULL,
  count        integer     NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket_key, window_start),
  CONSTRAINT rate_limit_hits_count_nonneg CHECK (count >= 0)
);

-- window_start index powers opportunistic cleanup of expired rows.
CREATE INDEX IF NOT EXISTS idx_rate_limit_hits_window_start
  ON public.rate_limit_hits (window_start);

ALTER TABLE public.rate_limit_hits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only" ON public.rate_limit_hits;
CREATE POLICY "Service role only"
  ON public.rate_limit_hits
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.rate_limit_hits IS
  'Durable rate limiter counter (fixed-window). Writes only via check_rate_limit(); service_role only.';
