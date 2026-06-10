# F47 evidence — 2026-05-24

## Commands

```text
npm run floor                              → exit 0 (110 tests)
npm run smoke:lead-capture                 → ✅ leadId=1b398ddd-68bb-4293-9c63-35a9b129da1a
curl POST :3001/api/leads/schedule-viewing → 200 { success, leadId }
supabase functions deploy chat-lead-capture → v13 (conversation_id → metadata fix)
```

## Production edge

- `supabase/functions/chat-lead-capture/index.ts` — stores `listing_id`, `listing_title`, `preferred_at`, `conversation_id` in `metadata` (no `conversation_id` column on `leads`)
- Deployed: `chat-lead-capture` verify_jwt=false

## App proxy

- `mdeapp/src/app/api/leads/schedule-viewing/route.ts` — Zod validate → edge POST
- `mdeapp/src/lib/leads/{schedule-viewing-schema,submit-schedule-viewing}.ts`
- `mdeapp/src/lib/supabase/edge-functions.ts` — anon auth headers (no service role in browser)

## DB proof

```sql
SELECT id, intent, source, email, metadata
FROM leads WHERE id = '1b398ddd-68bb-4293-9c63-35a9b129da1a';
-- intent=rental, source=form, metadata.listing_id + preferred_at present
```

## Persona impact

Camila submits schedule viewing from rental card or venue sheet → Patricia sees a new `leads` row with listing context in metadata.
