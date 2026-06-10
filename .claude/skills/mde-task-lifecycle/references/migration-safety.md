---
title: Migration safety reference
impact: HIGH
impactDescription: supabase/migrations checks and rollback discipline
tags: mde-task-lifecycle, migrations, supabase, sql
---

# Migration safety reference

Used during Phase 3 ([implementation.md](../implementation.md)) for any change under [supabase/migrations/](../../../../supabase/migrations/).

---

## Pre-flight

```
[ ] Migration filename uses ISO date prefix: YYYYMMDDHHMMSS_<short_name>.sql.
[ ] Numbered after the latest migration in the folder (no out-of-order timestamps).
[ ] Rollback SQL drafted as a comment block at the top of the file.
[ ] Change is justified by a prompt (no orphan migrations).
```

---

## Schema rules

| Rule | Why |
|------|-----|
| New tables include RLS in the same migration | A table without RLS is a leak the moment it ships. |
| FK columns have explicit ON DELETE behavior | CASCADE for owned children, SET NULL for soft refs, RESTRICT for protected. |
| Indexes on FK columns | Supabase does not auto-index FKs. |
| Indexes on filter columns (status, created_at, org_id) | Required for any list query >100 rows. |
| `created_at`, `updated_at` on every table | Convention; needed for change tracking. |
| Use `gen_random_uuid()` for PKs | Not `uuid_generate_v4()` (deprecated extension). |
| Use `text`, never `varchar(n)` | Postgres convention; no perf difference. |
| Use `timestamptz`, never `timestamp` | Always store with timezone. |
| Use `numeric(precision, scale)` for money | Never `float`. |

---

## RLS rules

```sql
-- Always use the subquery pattern.
CREATE POLICY select_own ON some_table
  FOR SELECT
  USING (org_id = (SELECT user_org_id()));   -- correct

-- Not this:
CREATE POLICY select_own ON some_table
  FOR SELECT
  USING (org_id = user_org_id());            -- wrong — re-evaluates per row
```

Required policies on every new table (unless explicitly public-read):

| Operation | Default policy |
|-----------|----------------|
| SELECT | `(select auth.uid()) = user_id` or org-scoped equivalent |
| INSERT | `WITH CHECK (select auth.uid()) = user_id` |
| UPDATE | `USING (...)` AND `WITH CHECK (...)` (both sides) |
| DELETE | `USING (select auth.uid()) = user_id` |

Service-role-only tables: a single policy `USING ((select auth.role()) = 'service_role')`.

---

## Reversibility

```
[ ] If the change is reversible, rollback SQL is included as a comment.
[ ] If the change is irreversible (DROP COLUMN with data, DROP TABLE), it is flagged in
    the prompt and the commit body says "IRREVERSIBLE — backup taken on <date>".
[ ] Renaming a column → use ALTER COLUMN ... RENAME (not drop+add).
[ ] Adding a NOT NULL column → ship in two phases: add nullable, backfill, then SET NOT NULL.
[ ] Type changes that lose data → backup the column first.
```

Example rollback comment:

```sql
-- Migration: 20260509120000_add_ranking_signals.sql
-- Rollback:
--   DROP TABLE IF EXISTS public.ranking_signals;
--   DROP INDEX IF EXISTS idx_ranking_signals_apartment;
```

---

## Apply order

```
[ ] 1. Apply to a Supabase dev branch (mcp__ed3787fc…__create_branch).
[ ] 2. Run smoke queries against the branch.
[ ] 3. Re-generate types: mcp__ed3787fc…__generate_typescript_types.
[ ] 4. Update src/integrations/supabase/types.ts.
[ ] 5. Run npm run build to confirm types compile.
[ ] 6. Run any RLS-sensitive tests against the branch.
[ ] 7. Merge branch → main project.
[ ] 8. Verify migration in mcp__ed3787fc…__list_migrations.
```

Never apply migrations directly to the main project from a feature branch.

---

## Common errors

| Error | Fix |
|-------|-----|
| Migration fails on `ALTER TABLE` due to existing rows | Add a default, then backfill, then SET NOT NULL in a follow-up migration. |
| RLS blocks the service role unexpectedly | Add a service-role policy or use the service-role client. |
| FK violation on insert | Confirm the parent row exists; check ON DELETE behavior on related FKs. |
| Index on FK missing → slow query | Add the index in the same migration as the FK. |
| Generated types out of sync after migration | Re-run `generate_typescript_types` and commit the diff. |

For broader implementation rules, see [../implementation.md](../implementation.md).
