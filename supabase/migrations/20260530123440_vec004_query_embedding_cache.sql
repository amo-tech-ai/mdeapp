-- VEC-004: query-level embedding dedupe cache (reconstructed from remote via Supabase MCP 2026-05-30)

CREATE TABLE public.query_embedding_cache (
  cache_key text PRIMARY KEY,
  query_text_normalized text NOT NULL,
  model text NOT NULL DEFAULT 'gemini-embedding-001',
  dimensions integer NOT NULL DEFAULT 768,
  embedding vector(768) NOT NULL,
  hit_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX query_embedding_cache_last_used_idx
  ON public.query_embedding_cache (last_used_at DESC);

ALTER TABLE public.query_embedding_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY query_embedding_cache_service_all ON public.query_embedding_cache
  FOR ALL TO service_role USING (true) WITH CHECK (true);
