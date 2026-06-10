---
task: data-010
date: 2026-05-30
project: zkwcbyxiwklihegjhuql
method: Supabase MCP apply_migration + get_advisors security
status: pass
migration: ../../supabase/migrations/20260530012233_data010_search_path_hardening.sql
evidence_copy: migrations/20260530012233_data010_search_path_hardening.sql
hygiene: data-010b-migration-hygiene.md
---

# DATA-010 — search_path hardening evidence

## Verdict

**PASS** — All 10 advisor-flagged `function_search_path_mutable` warnings cleared. Migration applied live + committed to repo.

| Metric | Before | After |
|--------|-------:|------:|
| `function_search_path_mutable` | **10** | **0** |
| Functions hardened | 0 | **10** |
| P0 absent from mutable list | — | ✅ |

## Advisor snapshot (security)

| Lint | Before | After | Notes |
|------|-------:|------:|-------|
| `function_search_path_mutable` | 10 | **0** | **Done gate** |
| `anon_security_definer_function_executable` | 43 | 43 | Phase 2 / DATA-011 backlog |
| `authenticated_security_definer_function_executable` | 68 | 68 | Phase 2 backlog |
| `rls_disabled_in_public` | 1 | 1 | `public.spatial_ref_sys` (PostGIS) |
| `extension_in_public` | 3 | 3 | Out of scope |
| `rls_policy_always_true` | 2 | 2 | Out of scope |
| `auth_leaked_password_protection` | 1 | 1 | AUTH-011 |

## Functions hardened (SET search_path = '')

| Function | Tier | security_definer | After search_path |
|----------|------|------------------|-------------------|
| `get_anonymous_order` | P0 | yes | `''` ✅ |
| `ticket_payment_finalize_response` | P0 | yes | `''` ✅ |
| `ticket_payment_refund` | P0 | yes | `''` ✅ |
| `record_check_in` | P1 | yes | `''` ✅ |
| `compute_lead_score` | P1 | yes | `''` ✅ |
| `update_conversation_on_message` | P1 | yes | `''` ✅ (`public.conversations` qualified) |
| `fts_spanish` | P2 | no | `''` ✅ |
| `fts_array_to_text` | P2 | no | `''` ✅ |
| `set_updated_at` | P2 | no | `''` ✅ |
| `trigger_set_timestamps` | P2 | no | `''` ✅ |

## Before — mutable list (2026-05-30 pre-migration)

1. `public.fts_spanish`
2. `public.fts_array_to_text`
3. `public.get_anonymous_order`
4. `public.compute_lead_score`
5. `public.record_check_in`
6. `public.trigger_set_timestamps`
7. `public.set_updated_at`
8. `public.update_conversation_on_message`
9. `public.ticket_payment_finalize_response`
10. `public.ticket_payment_refund`

## After — mutable list

*(empty — 0 rows)*

## Already pinned (verify-only, not in mutable list)

| Function | search_path |
|----------|-------------|
| `ticket_payment_finalize` | `public, pg_temp` |
| `check_rate_limit` | `public, pg_temp` |
| `insert_trip_item_for_user` | `public` |

## Migration artifacts

- Repo: [`supabase/migrations/20260530012233_data010_search_path_hardening.sql`](../../../supabase/migrations/20260530012233_data010_search_path_hardening.sql)
- Evidence copy: [`migrations/20260530012233_data010_search_path_hardening.sql`](migrations/20260530012233_data010_search_path_hardening.sql)
- Hygiene (DATA-010b): [`data-010b-migration-hygiene.md`](data-010b-migration-hygiene.md)
- Applied via MCP: `apply_migration` name `data010_search_path_hardening` (version `20260530012233`)

## Regression note

No signature changes. `update_conversation_on_message` body now uses `public.conversations` (behavior-preserving). JSON concat in `compute_lead_score` uses explicit `::jsonb` casts in applied migration.

## Score

| Scope | Score |
|-------|------:|
| DATA-010 acceptance (P0 + full flagged set) | **100/100** |
