---
parent: mde-supabase
title: Storage JS Client Cheatsheet
description: supabase-js storage methods (buckets, upload, download, signed URLs, transforms). Load when implementing file upload or download code.
load_when: storage.upload, createSignedUrl, storage bucket API, supabase storage client
---

# Supabase Storage JS Client Cheatsheet

All methods return `{ data, error }`. Always check `error` before using `data`.

## Bucket operations (admin / service_role)

```ts
// Create
await supabase.storage.createBucket('name', {
  public: false,
  allowedMimeTypes: ['image/*', 'application/pdf'],
  fileSizeLimit: '10MB',       // or bytes: 10485760
})

// Get bucket info
await supabase.storage.getBucket('name')

// Update bucket
await supabase.storage.updateBucket('name', { public: true, fileSizeLimit: '5MB' })

// Delete bucket (must be empty first)
await supabase.storage.deleteBucket('name')

// Empty bucket (delete all files)
await supabase.storage.emptyBucket('name')

// List all buckets
await supabase.storage.listBuckets()
```

## File operations

```ts
const b = supabase.storage.from('bucket-name')

// Upload
await b.upload('path/file.jpg', fileOrBlob, {
  contentType: 'image/jpeg',   // auto-detected from extension if omitted
  upsert: false,               // true = overwrite (CDN may cache old version)
  cacheControl: '3600',        // seconds for Cache-Control: max-age
  duplex: 'half',              // needed for Request body streams in Deno
})

// Download to Blob
const { data: blob } = await b.download('path/file.jpg')
const url = URL.createObjectURL(blob)

// Public URL (public buckets only)
const { data } = b.getPublicUrl('path/file.jpg')
// → data.publicUrl

// Public URL with image transform
const { data } = b.getPublicUrl('photo.jpg', {
  transform: { width: 400, height: 400, resize: 'cover', format: 'webp', quality: 80 }
})

// Signed URL (private buckets)
const { data } = await b.createSignedUrl('path/file.pdf', 3600)  // 3600s = 1h
// → data.signedUrl

// Signed URL with image transform
const { data } = await b.createSignedUrl('img.jpg', 3600, {
  transform: { width: 200, height: 200 }
})

// Bulk signed URLs
const { data } = await b.createSignedUrls(['a.pdf', 'b.pdf'], 3600)
// → data[].signedUrl

// Signed upload URL (let client upload directly without exposing service key)
const { data } = await b.createSignedUploadUrl('path/upload.jpg')
// → data.token, data.path, data.signedUrl
// Client uploads with: b.uploadToSignedUrl(data.path, data.token, file)

// Move / rename
await b.move('old/path.jpg', 'new/path.jpg')

// Copy
await b.copy('source.jpg', 'dest.jpg')

// Delete
await b.remove(['path/a.jpg', 'path/b.jpg'])

// List
const { data } = await b.list('folder/', {
  limit: 100,
  offset: 0,
  sortBy: { column: 'name', order: 'asc' },   // or 'created_at', 'updated_at', 'last_accessed_at', 'size'
  search: 'prefix',
})
```

## Transform options reference

| Option | Values | Notes |
|---|---|---|
| `width` | number (px) | Max width |
| `height` | number (px) | Max height |
| `resize` | `'cover'` `'contain'` `'fill'` | Default: `'cover'` |
| `format` | `'webp'` `'avif'` `'origin'` | `'origin'` = no conversion |
| `quality` | 20–100 | JPEG/WebP/AVIF compression |

## Error codes

| Code | Meaning |
|---|---|
| `400 Asset Already Exists` | File exists and `upsert: false` |
| `400 Payload too large` | Exceeds bucket `file_size_limit` |
| `400 Invalid MIME type` | Not in bucket `allowed_mime_types` |
| `401 Unauthorized` | No/invalid JWT |
| `403 Unauthorized` | RLS policy denied |
| `404 Object not found` | File doesn't exist |
| `409 Conflict` | Concurrent upload collision |
