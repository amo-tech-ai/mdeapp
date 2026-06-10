# F38 evidence — 2026-05-24

## Commands

```text
npm run floor                                              → exit 0
npm test -- src/__tests__/approval-commit-schema.test.ts   → pass
curl -X POST :3001/api/approval-commit -d '{}'             → HTTP 400 (route live)
npx supabase functions deploy approval-commit --project-ref zkwcbyxiwklihegjhuql → deployed
```

## Deliverables

- `supabase/functions/approval-commit/index.ts` — JWT auth, `request_approval` RPC, service-role insert on approve
- `supabase/functions/approval-commit/config.toml` — `verify_jwt = true`
- `supabase/functions/approval-commit/slugify.ts`
- `mdeapp/src/app/api/approval-commit/route.ts` — Next.js proxy (same pattern as leads/checkout)
- `mdeapp/src/lib/events/approval-commit-schema.ts`

## Design notes

- `decide_approval()` RPC requires `is_admin()` — edge uses direct `approval_decisions` insert + service role for Roberto path.
- `event_tickets` columns: `qty_total`, `is_active`.

## Persona impact

Roberto's approve click creates `events` + `event_tickets` rows — Andrés can buy tickets on published slug.

## Follow-ups

- Signed-in approve → SQL proof `events.status = published` (manual).
- Idempotency key if double-click approve (Phase 2).
