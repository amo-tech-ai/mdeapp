-- Landlord V1 Day 4 — listing-photos Storage bucket for apartment images.
-- See: tasks/plan/06-landlord-v1-30day.md §5.1 D4.
--
-- Storage path convention: <auth.uid()>/<draft_uuid>/<filename>
--   - Folder is keyed by user_id (not landlord_id) so RLS works
--     uniformly with identity-docs (D3) and uploads work even before
--     the apartments row is created (D5).
--   - Sub-folder per draft so a single user can have multiple in-progress
--     drafts without filename collisions.
--
-- Bucket is PUBLIC: listing photos must be visible to anonymous renters
-- on /apartments and /apartments/:id. We rely on URL unguessability
-- (uuid) for soft privacy on drafts; the moment a listing is published
-- (D5) the URLs become publicly indexable, which is the goal.
--
-- Limits: 5 MB per image, JPEG/PNG/WebP only. Photos are pre-resized
-- client-side via lib/storage/upload-listing-photo.ts before upload.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-photos',
  'listing-photos',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Note: storage.objects policies created via execute_sql, not
-- apply_migration (the MCP role lacks ownership of storage.objects;
-- same constraint as identity-docs in 20260430000000).
