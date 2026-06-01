-- Extend public SELECT on embedding tables to include anon role.
-- Embeddings are vectors of already-public content; no PII exposed.
-- Without this, security invoker RPCs called with the anon key return 0 rows.

drop policy if exists listing_embeddings_public_select on public.listing_embeddings;
drop policy if exists event_embeddings_public_select on public.event_embeddings;
drop policy if exists restaurant_embeddings_public_select on public.restaurant_embeddings;

create policy listing_embeddings_public_select
  on public.listing_embeddings for select
  to authenticated, anon
  using (true);

create policy event_embeddings_public_select
  on public.event_embeddings for select
  to authenticated, anon
  using (true);

create policy restaurant_embeddings_public_select
  on public.restaurant_embeddings for select
  to authenticated, anon
  using (true);
