-- Day 3 #1 — Affiliate attribution + outbound click tracking.
--
-- Records every click from an in-app rental card / detail-page CTA out to
-- the source listing (Airbnb, Booking.com, FazWaz, Metrocuadrado, …).
-- Powers two things:
--   1. Affiliate attribution — when the rewriter appends the partner tag,
--      we log which tag was actually delivered so commission disputes can
--      be reconciled against this table.
--   2. Conversion analytics — funnel from chat → save → outbound click is
--      the closest real-world signal we have for "the user is committing"
--      until we own checkout.
--
-- Identity is best-effort: user_id is filled from auth.uid() when the
-- caller is authenticated, NULL for anonymous chat sessions. We do NOT
-- attempt to bridge anon → user post-hoc; that's handled at the auth layer
-- via session_data carryover.
--
-- See: tasks/CHAT-CENTRAL-PLAN.md §5 · Week 2 Fri + tasks/todo.md Day 3 #1.

CREATE TABLE IF NOT EXISTS public.outbound_clicks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  listing_id   uuid NOT NULL,
  source_url   text NOT NULL,
  -- Short tag identifying which affiliate program (if any) handled the
  -- click. NULL means the URL passed through without rewriting (no
  -- partner program for that domain, or env tag not set).
  affiliate_tag text,
  -- Where the click came from (chat-card, detail-page, etc) — keeps the
  -- analytics question "which surface drives outbound?" answerable
  -- without joining against route history.
  surface      text NOT NULL CHECK (surface IN ('chat_card', 'detail_page', 'map_info_window')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- listing_id will mostly be UUIDs from `apartments`, but chat sometimes
-- surfaces scraped listings that aren't in our DB yet. Don't FK to
-- apartments — let the column store the AI-supplied id and reconcile
-- offline. (Indexed for analytics queries by listing.)
CREATE INDEX IF NOT EXISTS outbound_clicks_listing_idx
  ON public.outbound_clicks (listing_id, created_at DESC);

CREATE INDEX IF NOT EXISTS outbound_clicks_user_idx
  ON public.outbound_clicks (user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

-- RLS: writes go through the SECURITY DEFINER RPC below; reads are
-- analytics-only (service role). No public SELECT — leaking outbound
-- click history would expose user behavior across listings.
ALTER TABLE public.outbound_clicks ENABLE ROW LEVEL SECURITY;

-- Belt-and-suspenders: deny all direct table access. The RPC is the only
-- documented write path, and reads happen via service role for analytics.
REVOKE ALL ON TABLE public.outbound_clicks FROM anon, authenticated;

COMMENT ON TABLE public.outbound_clicks IS
  'Outbound click log for affiliate attribution + conversion analytics. Writes via log_outbound_click() RPC only; reads via service role.';

-- ─────────────────────────────────────────────────────────────────────────
-- log_outbound_click — public write surface.
--
-- Fires-and-forgets from the client. user_id is auto-filled from auth.uid()
-- (NULL for anon). Returns the inserted row's id so the client can
-- correlate with downstream events if needed.
--
-- SECURITY DEFINER bypasses the table's RLS denial (writes are the only
-- thing we want to allow). The function does basic input validation:
--   - surface must be one of the CHECK constraint values (caught by the
--     constraint, returns a friendly error)
--   - source_url must look like an http(s) URL (defense-in-depth — the
--     UI rewriter has already validated)
-- ─────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.log_outbound_click(
  p_listing_id   uuid,
  p_source_url   text,
  p_affiliate_tag text DEFAULT NULL,
  p_surface      text DEFAULT 'chat_card'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF p_source_url !~ '^https?://' THEN
    RAISE EXCEPTION 'source_url must start with http(s)://' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.outbound_clicks (user_id, listing_id, source_url, affiliate_tag, surface)
  VALUES (auth.uid(), p_listing_id, p_source_url, p_affiliate_tag, p_surface)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.log_outbound_click(uuid, text, text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.log_outbound_click(uuid, text, text, text) TO anon, authenticated;

COMMENT ON FUNCTION public.log_outbound_click(uuid, text, text, text) IS
  'Append a row to outbound_clicks. SECURITY DEFINER; auto-fills user_id from auth.uid(). Returns the inserted row id.';
