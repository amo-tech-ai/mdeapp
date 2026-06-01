-- Landlord V1 Day 3 — identity-docs Storage bucket for verification uploads.
-- See: tasks/plan/06-landlord-v1-30day.md §5.1 D3.
--
-- Storage path convention: <auth.uid()>/<filename>
--   - User-id (not landlord_id) so uploads work even if landlord_profiles
--     row is created in the same transaction.
--   - Used by verification_requests.storage_path (full path including
--     user-id prefix).
--
-- Bucket is private (public=false). All reads go through signed URLs or
-- service-role admin tooling.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'identity-docs',
  'identity-docs',
  false,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS: insert + select gated to the auth.uid() folder; admin can read all.

DROP POLICY IF EXISTS identity_docs_insert_own ON storage.objects;
CREATE POLICY identity_docs_insert_own
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'identity-docs'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

DROP POLICY IF EXISTS identity_docs_select_own ON storage.objects;
CREATE POLICY identity_docs_select_own
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'identity-docs'
    AND (
      (storage.foldername(name))[1] = (SELECT auth.uid()::text)
      OR (SELECT public.is_admin())
    )
  );

DROP POLICY IF EXISTS identity_docs_update_own ON storage.objects;
CREATE POLICY identity_docs_update_own
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'identity-docs'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

DROP POLICY IF EXISTS identity_docs_delete_own ON storage.objects;
CREATE POLICY identity_docs_delete_own
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'identity-docs'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

DROP POLICY IF EXISTS identity_docs_service_role ON storage.objects;
CREATE POLICY identity_docs_service_role
  ON storage.objects
  TO service_role
  USING (bucket_id = 'identity-docs')
  WITH CHECK (bucket_id = 'identity-docs');

-- Do not use COMMENT ON POLICY on storage.objects. supabase db reset runs
-- migrations as a role that is not owner of storage.objects; Postgres returns
-- SQLSTATE 42501 (must be owner of relation objects) and aborts before later
-- migrations (e.g. places_search_cache). Document policy intent in this file
-- header and inline comments above each CREATE POLICY instead.
