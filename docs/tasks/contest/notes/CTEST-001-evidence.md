# CTEST-001 evidence — Supabase contest core schema and RLS

**Task:** [CTEST-001-supabase-contest-core-schema.md](../tasks/CTEST-001-supabase-contest-core-schema.md)  
**Linear:** SAN-533  
**Date:** 2026-06-02  
**Environment:** local Supabase (`postgresql://postgres:postgres@127.0.0.1:54322/postgres`)

## 1. `supabase db reset`

```text
cd mdeapp && supabase db reset
Exit code: 0 (2026-06-02)
```

Migrations applied through `20260603045916_create_contestant_storage_buckets.sql`.

## 2. Catalog — 14 contest tables

```sql
SELECT tablename FROM pg_tables
WHERE schemaname = 'public' AND tablename LIKE 'contest%'
ORDER BY 1;
```

| # | tablename |
|---|-----------|
| 1 | contest_audit_events |
| 2 | contest_events |
| 3 | contest_memberships |
| 4 | contest_orgs |
| 5 | contest_rounds |
| 6 | contestant_assets |
| 7 | contestant_discovery_leads |
| 8 | contestant_discovery_runs |
| 9 | contestant_invite_drafts |
| 10 | contestant_profile_extractions |
| 11 | contestant_profile_reviews |
| 12 | contestant_social_links |
| 13 | contestants |
| 14 | contests |

**Count:** 14 tables (matches CTEST-001 spec).

## 3. RLS enabled (100%)

```sql
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename LIKE 'contest%';
```

All 14 rows: `rowsecurity = true`.

## 4. Policy count per table

```sql
SELECT tablename, count(*) FROM pg_policies
WHERE tablename LIKE 'contest%'
GROUP BY tablename ORDER BY 1;
```

| tablename | policies |
|-----------|----------|
| contest_audit_events | 4 |
| contest_events | 5 |
| contest_memberships | 4 |
| contest_orgs | 4 |
| contest_rounds | 5 |
| contestant_assets | 5 |
| contestant_discovery_leads | 4 |
| contestant_discovery_runs | 4 |
| contestant_invite_drafts | 4 |
| contestant_profile_extractions | 4 |
| contestant_profile_reviews | 4 |
| contestant_social_links | 5 |
| contestants | 5 |
| contests | 5 |

**Storage** (`storage.buckets`):

| id | public |
|----|--------|
| contestant-photos | false |
| contestant-docs | false |

Storage policies on `storage.objects`: insert/select/update/delete for own contestant folder; anon select on approved public photos via `contestant_assets` join; docs staff/owner only.

## 5. Anon negative tests

Harness: `mdeapp/supabase/__tests__/ctest001_core_rls_negative.sql`

| Probe | Result |
|-------|--------|
| Draft contests | 0 rows |
| contest_memberships | 42501 |
| contest_audit_events | 42501 |
| contestant_profile_extractions | 42501 |
| contestant_discovery_leads | 42501 |
| contestant_invite_drafts | 42501 |

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/__tests__/ctest001_core_rls_negative.sql
# ends with ROLLBACK — exit 0
```

## 6. Cross-tenant / privilege negatives

| Probe | Actor | Result |
|-------|-------|--------|
| Self-approve contestant | contestant JWT | 42501 on UPDATE |
| Edit org settings | staff (non-admin) | 0 rows updated |
| Read extractions | outsider JWT | 0 rows |
| Read discovery leads | outsider JWT | 0 rows |
| UPDATE audit row | superuser in txn | trigger error (append-only) |
| DELETE audit row | superuser in txn | trigger error (append-only) |

## 7. `npm test`

```bash
cd mdeapp && npm test -- --run ctest001   # 1 passed
cd mdeapp && npm test -- --run            # 115 files, 483 passed
```

Vitest wrapper: `mdeapp/src/lib/contest/ctest001-rls.harness.test.ts`

## 8. `npm run typecheck`

```bash
cd mdeapp && npm run typecheck
# exit 0
```

Types regenerated: `mdeapp/src/lib/supabase/database.types.ts` includes `contest_*` / `contestant_*` tables.

## 9. Migrations added (this slice)

| File | Scope |
|------|--------|
| `20260603045911_create_contestant_rls_helpers.sql` | `app_private` contestant helpers |
| `20260603045912_create_contestant_assets_and_social.sql` | assets + social links |
| `20260603045913_create_contestant_profile_extractions_reviews.sql` | extractions + reviews |
| `20260603045914_create_contest_events.sql` | contest_events |
| `20260603045915_create_contestant_discovery.sql` | discovery runs/leads/invite drafts + audit entity_table |
| `20260603045916_create_contestant_storage_buckets.sql` | contestant-photos, contestant-docs |

Prior slice (already on disk): `20260603045904`–`45910`.

## 10. Out of scope (confirmed absent)

- `vote_ledger`, judge scoring, Stripe, CopilotKit/Mastra workflows, UI routes, OpenClaw.

## 11. Remote catalog proof (pre-deploy)

**Project:** `zkwcbyxiwklihegjhuql`  
**Date:** 2026-06-03 (Supabase MCP `execute_sql` + `list_migrations`)

```sql
SELECT tablename FROM pg_tables
WHERE schemaname = 'public' AND tablename LIKE 'contest%'
ORDER BY 1;
```

**Result:** `[]` (0 rows) — contest vertical not on remote yet.

**Latest remote migration:** `20260601120800_data047_search_logs_observability` (no `202606030459*`).

**Post-push checklist:** re-run catalog query; expect 14 tables + RLS; then mark SAN-533 deploy complete.

## 12. Remaining before remote Done

- [x] Local `supabase db reset` through `45917` + SQL harness + `npm test -- --run ctest001` (2026-06-03).
- [x] Commit migrations/tests/types in `mdeapp/` (2026-06-03).
- [ ] `supabase db push` (or CI) to remote.
- [ ] Remote catalog proof **after** push (repeat section 11 query).
- [ ] Flip CTEST-001 / SAN-533 status after task-verifier + post-push proof.
