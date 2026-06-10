-- VEC-001: Drop duplicate HNSW indexes (keep *_hnsw, drop idx_*_hnsw)

DROP INDEX IF EXISTS public.idx_listing_embeddings_hnsw;
DROP INDEX IF EXISTS public.idx_event_embeddings_hnsw;
DROP INDEX IF EXISTS public.idx_restaurant_embeddings_hnsw;
