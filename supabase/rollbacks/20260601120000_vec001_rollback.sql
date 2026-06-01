-- Rollback VEC-001 — recreate duplicate HNSW indexes (not recommended)
CREATE INDEX IF NOT EXISTS idx_listing_embeddings_hnsw
  ON public.listing_embeddings USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_event_embeddings_hnsw
  ON public.event_embeddings USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_restaurant_embeddings_hnsw
  ON public.restaurant_embeddings USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
