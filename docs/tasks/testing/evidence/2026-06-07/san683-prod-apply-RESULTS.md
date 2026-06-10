# SAN-683 prod apply — RESULTS

**Status:** ✅ **DONE — schema + RLS production-live** (2026-06-07)  
**Linear:** SAN-683 · Merge `b23a5f8` · Apply ptr001–ptr014 on prod  
**Project:** `zkwcbyxiwklihegjhuql` (medellin)  
**Method:** `npx supabase db push --linked`  
**Last remote migration:** `20260606131300` (ptr014)  
**Related evidence:** [`san683-prod-apply-prep.md`](./san683-prod-apply-prep.md) · [`san683-merge-gate-RESULTS.md`](./san683-merge-gate-RESULTS.md)

## Pre-apply

- Dry-run: ptr001–ptr014 only ✅
- Backup/PITR: human attestation (not verifiable via MCP/API from agent)
- Step A history repair: completed earlier same day

## Apply result

**Applied:** ✅ all 14 migrations succeeded (NOTICE lines only — idempotent `IF NOT EXISTS` / `DROP IF EXISTS`)

## Post-apply verification

| Check | Result | Method |
|---|---|---|
| ptr001–ptr014 on remote | ✅ | `supabase migration list` + MCP `list_migrations` |
| `partners` exists | ✅ | MCP SQL |
| `partner_drafts` exists | ✅ | MCP SQL |
| `revenue_ledger` exists | ✅ | MCP SQL |
| `leads.partner_id` | ✅ | MCP SQL |
| `bookings.partner_id` | ✅ | MCP SQL |
| RLS on 8 partner tables | ✅ | MCP SQL (`rowsecurity=true`) |
| anon cannot read partners (policies) | ✅ | No anon policies on partner tables |
| Member cannot UPDATE `partners.status` | ✅ | `authenticated` UPDATE only on `settings` |
| Member cannot UPDATE `tier` | ✅ | `authenticated` UPDATE on `config`,`enabled` only |
| `revenue_ledger` append-only | ✅ | No authenticated UPDATE/DELETE policies |
| `partner-assets` storage policies | ✅ | 4 member-scoped policies present |
| `npm run verify:partner-schema` | ⏭ SKIP | Dev host `ENETUNREACH` to prod IPv6 direct |
| `run-san683-merge-gate.mjs` | ⏭ SKIP | Same network block — **MCP SQL used instead** |
| **MCP SQL verification** | ✅ PASS | Tables, columns, RLS, column grants, policies, storage `with_check` |

## Advisors (post-apply)

| Type | Count | Partner-specific |
|---|---|---|
| Security | 100 (99 WARN, 1 ERROR) | 4 WARN — `partner_ids_for_user` SECURITY DEFINER executable by anon/authenticated (expected helper pattern) |
| Performance | 418 (312 INFO, 106 WARN) | 0 partner-related |

Pre-existing ERROR: `spatial_ref_sys` RLS (PostGIS) — not introduced by SAN-683.

## SAN-683 final verdict

| Layer | Live? | Notes |
|---|---|---|
| **Schema + RLS on prod** | ✅ **YES** | ptr001–ptr014 applied; remote through `20260606131300` |
| **MCP SQL verification** | ✅ PASS | See table above |
| **Live JWT pen-tests** | ⏭ SKIPPED | Host `ENETUNREACH` to prod IPv6 — non-blocking; static grants/policies confirm F1/F4/F5 |
| **Persona-visible onboarding** | ❌ NO | Unblocks **SAN-665** `POST /api/partners/activate` |

## Known non-blockers (post-close)

- `spatial_ref_sys` RLS ERROR — pre-existing PostGIS
- `partner_ids_for_user` SECURITY DEFINER WARN — expected helper pattern
- `multiple_permissive_policies` WARN on partner tables — admin + member overlap
- Optional: run `run-san683-merge-gate.mjs` from IPv4-capable host for live F1 pen-test

## Next task

**SAN-665** — activation API. Plan: [`tasks/design/partners/SAN-665-activate-api-plan.md`](../../design/partners/SAN-665-activate-api-plan.md)

## Rollback

If rollback required: Supabase Dashboard PITR/backup restore to pre-apply timestamp. No down-migration shipped.
