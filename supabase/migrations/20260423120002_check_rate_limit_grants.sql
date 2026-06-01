-- Grants for check_rate_limit(). Split from the function body to keep
-- each migration single-purpose (see 20260406120000 split rationale).

REVOKE ALL ON FUNCTION public.check_rate_limit(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer) TO service_role;

COMMENT ON FUNCTION public.check_rate_limit(text, integer, integer) IS
  'Durable fixed-window rate limiter. Returns jsonb {allowed, count, max, retry_after_seconds}. service_role only.';
