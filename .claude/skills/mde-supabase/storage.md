---
parent: mde-supabase
name: supabase-storage
description: Complete guide for Supabase Storage — creating buckets, uploading files, signed URLs, RLS policies, image transformations, and production scaling. Use this skill whenever the user mentions: storage buckets, file uploads, image hosting, private files, signed URLs, content-type restrictions, file size limits, Storage RLS, CDN caching, or any Supabase Storage operation. Also use when working with user avatars, contract PDFs, media assets, or any file that needs to live outside the database.
---

# Supabase Storage

Supabase Storage is an S3-compatible object store built on PostgreSQL RLS. Files live outside the DB; metadata (bucket, path, owner, size, MIME) lives in `storage.objects` and is queryable with standard SQL.

## Quick decision guide

| Need | Approach |
|---|---|
| Public images (avatars, banners) | Public bucket + no RLS on SELECT |
| Private docs (contracts, reports) | Private bucket + signed URLs (1h) |
| User uploads (≤6 MB) | Standard upload |
| Large files / resumable (>6 MB) | TUS resumable upload |
| Serve images resized on-the-fly | Image Transformation + CDN |

---

## 1. Create a bucket

### SQL migration (preferred — idempotent, version-controlled)

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'contracts',
  'contracts',
  false,               -- private
  10485760,            -- 10 MB in bytes
  ARRAY['text/html', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;
```

### JavaScript client

```ts
const { data, error } = await supabase.storage.createBucket('avatars', {
  public: true,
  allowedMimeTypes: ['image/*'],
  fileSizeLimit: '5MB',     // or bytes: 5242880
})
```

### Key bucket properties

| Property | Type | Notes |
|---|---|---|
| `public` | boolean | `false` = private (RLS enforced for GET). `true` = public read, no RLS for GET but RLS still applies for PUT/DELETE |
| `file_size_limit` | int (bytes) or string ('5MB') | Rejected at upload if exceeded |
| `allowed_mime_types` | string[] | Wildcards like `'image/*'` work. `null` = any type |

---

## 2. RLS policies

Storage uses `storage.objects` as the policy table. Always enable RLS and add policies — without policies, private buckets block *everything* including service_role reads from client code (service_role bypasses RLS from edge functions, not from client).

### Patterns

```sql
-- Public read (for public buckets, makes SELECT explicit)
CREATE POLICY "public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Owner can upload their own files
-- Convention: path = user_id/filename.jpg
CREATE POLICY "user upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

-- Owner can update/delete their files
CREATE POLICY "user owns file"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

-- Service-role-only write (edge fn writes; users just read via signed URL)
-- No INSERT/UPDATE/DELETE policy = only service_role can write
```

**Key helpers:**
- `storage.foldername(name)` → `text[]` (path segments, e.g. `['user-id', 'subfolder']`)
- `storage.filename(name)` → `text` (last segment)
- `storage.extension(name)` → `text` (e.g. `'pdf'`)

**Always use `(SELECT auth.uid())` not `auth.uid()` in RLS** — the subquery form is cached per statement, not re-evaluated per row.

---

## 3. Upload files

### Standard upload (≤ 6 MB recommended, 5 GB max)

```ts
// From browser File object
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.jpg`, file, {
    contentType: 'image/jpeg',  // optional — auto-detected from extension
    upsert: true,               // overwrite if exists (default: false → 400 on conflict)
    cacheControl: '3600',       // Cache-Control: max-age=3600
  })
```

```ts
// From edge function (Deno) using service client
const { error } = await serviceClient.storage
  .from('contracts')
  .upload(`${applicationId}/contract-v1.html`, htmlContent, {
    contentType: 'text/html',
    upsert: true,
  })
```

### Upload from URL (edge function pattern)

```ts
const res = await fetch(externalUrl)
const blob = await res.blob()
await supabase.storage.from('bucket').upload('path/file.jpg', blob)
```

---

## 4. Download & signed URLs

### Public bucket — direct URL

```ts
const { data } = supabase.storage.from('avatars').getPublicUrl('user-id/avatar.jpg')
// data.publicUrl is the CDN URL — no auth needed
```

### Private bucket — signed URL (time-limited)

```ts
const { data, error } = await supabase.storage
  .from('contracts')
  .createSignedUrl('appId/contract.pdf', 3600)  // 3600 seconds = 1 hour
// data.signedUrl → use in <iframe src> or <a href>

// Bulk signed URLs
const { data } = await supabase.storage
  .from('docs')
  .createSignedUrls(['a.pdf', 'b.pdf'], 3600)
```

### Download to buffer (edge function)

```ts
const { data, error } = await supabase.storage
  .from('contracts')
  .download('appId/contract.pdf')
const text = await data?.text()
```

---

## 5. List files

```ts
const { data, error } = await supabase.storage
  .from('avatars')
  .list('user-id/', {
    limit: 20,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' },
    search: 'avatar',           // prefix filter
  })
// Returns: { name, id, updated_at, created_at, last_accessed_at, metadata }
// Folders return null for id/timestamps
```

**At scale:** `list()` is slow for large buckets because it computes folder hierarchies. For >10k objects, create a custom Postgres function:

```sql
CREATE OR REPLACE FUNCTION list_objects_in_bucket(
  p_bucket_id text, p_prefix text, p_limit int, p_offset int
) RETURNS TABLE (name text, id uuid, created_at timestamptz) AS $$
  SELECT name, id, created_at
  FROM storage.objects
  WHERE bucket_id = p_bucket_id AND name LIKE p_prefix || '%'
  ORDER BY created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$ LANGUAGE sql;
```

Call via `supabase.rpc('list_objects_in_bucket', { p_bucket_id: 'x', ... })`.

---

## 6. Move, copy, delete

```ts
// Move (rename)
await supabase.storage.from('bucket').move('old/path.jpg', 'new/path.jpg')

// Copy
await supabase.storage.from('bucket').copy('source.jpg', 'dest.jpg')

// Delete single
await supabase.storage.from('bucket').remove(['path/file.jpg'])

// Delete multiple
await supabase.storage.from('bucket').remove(['a.jpg', 'b.jpg', 'c.pdf'])
```

**Never delete from `storage.objects` directly via SQL** — the actual file in S3 won't be removed, leaving orphaned storage costs.

---

## 7. Image transformations

Supabase serves transformed images via a CDN when you request a resized URL.

```ts
const { data } = supabase.storage.from('avatars').getPublicUrl('photo.jpg', {
  transform: {
    width: 400,
    height: 400,
    resize: 'cover',    // 'cover' | 'contain' | 'fill'
    format: 'webp',     // 'webp' | 'avif' | 'origin'
    quality: 80,
  }
})
```

For private buckets use `createSignedUrl` with the same `transform` option:
```ts
await supabase.storage.from('private').createSignedUrl('img.jpg', 3600, {
  transform: { width: 200, height: 200 }
})
```

---

## 8. Production & scaling checklist

- **CDN caching:** Public buckets are cached at the edge automatically. Set `cacheControl` on uploads to control browser cache (`'3600'` = 1 hour, `'31536000'` = 1 year for immutable assets).
- **Smart CDN:** Enable in Supabase dashboard for higher cache hit rates (charged less for cached egress).
- **Image opt:** Always serve transformed/resized images instead of originals — images are the biggest egress source.
- **File size limits:** Set `file_size_limit` on each bucket to prevent surprise egress costs.
- **Indexes for RLS:** Add indexes on columns used in Storage RLS policies (e.g., `owner`, `bucket_id`) if policies are slow.
- **Private bucket + signed URL pattern:** Generate signed URLs server-side (edge function) with short expiry (≤1h). Refresh in the component before expiry.
- **Upsert carefully:** `upsert: true` updates the file but CDN may serve stale version until TTL expires. Append a version param to the path or invalidate the cache.

---

## 9. Common mdeai.co patterns

### Contracts bucket (private HTML/PDF)

```sql
-- Migration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('contracts', 'contracts', false, 10485760, ARRAY['text/html', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;
```

```ts
// Edge function upload (service role)
await serviceClient.storage.from('contracts').upload(
  `${applicationId}/contract-v1.html`,
  htmlContent,
  { contentType: 'text/html', upsert: true }
)

// Frontend signed URL (1h, refreshed before iframe expiry)
const { data } = await supabase.storage
  .from('contracts')
  .createSignedUrl(`${applicationId}/contract-v1.html`, 3600)
```

### User avatars (public images)

```sql
INSERT INTO storage.buckets (id, name, public, allowedMimeTypes, fileSizeLimit)
VALUES ('avatars', 'avatars', true, ARRAY['image/*'], 2097152)  -- 2 MB
ON CONFLICT (id) DO NOTHING;
```

```ts
// Upload with user-scoped path
await supabase.storage.from('avatars')
  .upload(`${userId}/avatar.jpg`, file, { upsert: true })

// Serve resized
const { data } = supabase.storage.from('avatars')
  .getPublicUrl(`${userId}/avatar.jpg`, { transform: { width: 128, height: 128 } })
```

---

## Reference files

- `references/rls-policies.md` — Full RLS policy examples for common patterns
- `references/api-cheatsheet.md` — All JS client methods with signatures
