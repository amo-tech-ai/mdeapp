-- Durable rate limiter RPC.
-- Fixed-window (aligned to epoch/p_window_seconds). Atomic via ON CONFLICT increment.
-- Includes 1% opportunistic cleanup of rows older than 1 hour to bound table size.

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key text,
  p_max integer,
  p_window_seconds integer
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_window_start timestamptz;
  v_count integer;
  v_epoch bigint;
BEGIN
  IF p_key IS NULL OR length(p_key) = 0 THEN
    RAISE EXCEPTION 'check_rate_limit: p_key required' USING ERRCODE = 'P0001';
  END IF;
  IF p_max <= 0 OR p_window_seconds <= 0 THEN
    RAISE EXCEPTION 'check_rate_limit: p_max and p_window_seconds must be positive'
      USING ERRCODE = 'P0001';
  END IF;

  -- Align to fixed-window boundary: floor(epoch / window) * window.
  v_epoch := EXTRACT(EPOCH FROM now())::bigint;
  v_window_start := to_timestamp((v_epoch / p_window_seconds) * p_window_seconds);

  -- Atomic upsert-increment returns the post-increment count.
  INSERT INTO public.rate_limit_hits (bucket_key, window_start, count)
  VALUES (p_key, v_window_start, 1)
  ON CONFLICT (bucket_key, window_start)
  DO UPDATE SET count = rate_limit_hits.count + 1
  RETURNING count INTO v_count;

  -- Opportunistic cleanup (1% of calls) keeps the table small without pg_cron.
  IF random() < 0.01 THEN
    DELETE FROM public.rate_limit_hits
    WHERE window_start < now() - interval '1 hour';
  END IF;

  RETURN jsonb_build_object(
    'allowed', v_count <= p_max,
    'count', v_count,
    'max', p_max,
    'window_start', v_window_start,
    'retry_after_seconds',
      CASE
        WHEN v_count > p_max THEN
          GREATEST(
            1,
            EXTRACT(EPOCH FROM (
              v_window_start + (p_window_seconds || ' seconds')::interval - now()
            ))::integer
          )
        ELSE 0
      END
  );
END;
$$;
