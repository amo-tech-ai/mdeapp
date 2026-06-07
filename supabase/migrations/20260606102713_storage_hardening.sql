-- Storage hardening: contracts MIME allowlist + sponsor-assets policy cleanup
--
-- Audit ref: tasks/data/audit/06-rls-full-audit-2026-06-06.md (LOW/MEDIUM findings)
--
-- Change 1: Remove text/html from contracts bucket MIME allowlist.
--   Contracts must only be PDFs. HTML in a private signed-URL bucket is an XSS
--   vector if a server-side process ever stores or renders the file in an iframe.
--   No app code uses this bucket yet (0 objects, pre-shipped) so no behaviour change.
--
-- Change 2: Replace three TO PUBLIC write policies on sponsor-assets with
--   explicit TO authenticated policies. The USING / WITH CHECK logic is identical;
--   only the role scoping is tightened. Public read (sponsor_assets_public_get)
--   is unchanged.

-- ============================================================
-- 1. contracts bucket — strip text/html from MIME allowlist
-- ============================================================

UPDATE storage.buckets
SET allowed_mime_types = ARRAY['application/pdf']
WHERE id = 'contracts';

-- ============================================================
-- 2. sponsor-assets — replace TO PUBLIC write policies
-- ============================================================

-- Drop the three non-standard TO PUBLIC policies
DROP POLICY IF EXISTS "sponsor_assets_auth_insert"  ON storage.objects;
DROP POLICY IF EXISTS "sponsor_assets_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "sponsor_assets_owner_delete" ON storage.objects;

-- INSERT: any authenticated user may upload to the sponsor-assets bucket
-- (matches original intent; auth.role() check was redundant with TO authenticated)
CREATE POLICY "sponsor_assets_insert_authenticated"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'sponsor-assets');

-- UPDATE: authenticated users may update only objects they own
CREATE POLICY "sponsor_assets_update_own"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING  (bucket_id = 'sponsor-assets' AND owner = (SELECT auth.uid()))
  WITH CHECK (bucket_id = 'sponsor-assets' AND owner = (SELECT auth.uid()));

-- DELETE: authenticated users may delete only objects they own
CREATE POLICY "sponsor_assets_delete_own"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'sponsor-assets' AND owner = (SELECT auth.uid()));

-- sponsor_assets_public_get ({anon,authenticated} SELECT) is intentionally left
-- unchanged — public read of sponsor logos is correct behavior.
