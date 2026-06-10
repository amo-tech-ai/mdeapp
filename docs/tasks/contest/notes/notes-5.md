Cross-check of **`mdeapp/supabase/migrations/20260603045904`–`45917`** against the eight `mde-supabase` project rules (Supabase-oriented docs). **mdeai SKILL** (`mde-supabase/SKILL.md`) overrides generic docs where they conflict — noted below.

## Summary

| Rule doc | Verdict | Notes |
|----------|---------|--------|
| **supabase-migrations** | 🟡 Partial | Headers + RLS + split files ✅; **lowercase** and **naming** mixed |
| **supabase-rls-policies** | 🟢 Strong | Matches Supabase + mdeai `(select auth.uid())`, granular policies |
| **supabase-database-functions** | 🟢 Strong | `app_private` + `search_path = ''` + definer only where needed |
| **supabase-sql-style** | 🟡 Partial | Naming/comments ✅; **UPPERCASE** blocks in recovered core files |
| **supabase-patterns** | 🟢 Aligned | RLS, indexes, service_role storage, migration-only DDL |
| **supabase-declarative-schema** | ⚪ N/A / conflict | mdeai uses **imperative** migrations; SKILL says iterate → `db pull` |
| **supabase-edge-functions** | ⚪ N/A | No edge functions in this pack |
| **supabase-realtime** | ⚪ N/A (by design) | No `realtime.*` in CTEST-001; CTEST-002 can add `broadcast` |

---

## 1. `supabase-migrations.md`

| Requirement | Contest pack | Match |
|-------------|--------------|-------|
| File in `supabase/migrations/` | `mdeapp/supabase/migrations/` (symlink from repo root) | ✅ |
| `YYYYMMDDHHmmss_description.sql` | `20260603045904_…` — valid timestamp prefix; `45904` is task stamp, not strict UTC clock | 🟡 |
| Header comment (purpose, affected objects) | Present on `45904`–`45915`, `45917`; `45916` is line comments only | 🟡 |
| **All SQL lowercase** | `45904`–`45912`, `45915`: lowercase; **`45905`–`45910`, parts of `45907`**: `CREATE TABLE`, `CREATE POLICY` (pg_dump recovery) | ❌ style |
| RLS on every new table | All 14 `contest%` tables + storage policies | ✅ |
| Granular policies (per op + role) | e.g. `contests_anon_select_published`, `contests_authenticated_update_staff` | ✅ |
| `begin` / `commit` | All except **`45916`** (storage only, no transaction wrapper) | 🟡 |

**Example — good (45904):**

```1:11:mdeapp/supabase/migrations/20260603045904_create_contest_rls_helpers.sql
/*
  migration: create contest rls helpers
  task: san-533 / ctest-001 supabase contest core schema and rls
*/

begin;

create schema if not exists app_private;
```

**Example — style drift (45907):**

```8:16:mdeapp/supabase/migrations/20260603045907_create_contests.sql
CREATE TABLE public.contests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contest_org_id uuid NOT NULL,
    created_by_profile_id uuid NOT NULL,
    ...
    status text DEFAULT 'draft'::text NOT NULL,
```

**Remediation (low priority):** normalize `45905`–`45910` to lowercase + wrap `45916` in `begin;` / `commit;` for consistency with other mdeai migrations.

---

## 2. `supabase-rls-policies.md` + `supabase-patterns.md`

| Requirement | Contest pack | Match |
|-------------|--------------|-------|
| Use `auth.uid()`, not `current_user` | Policies use `(select auth.uid())` / `( SELECT auth.uid() AS uid)` | ✅ |
| No `FOR ALL` | None found | ✅ |
| Separate SELECT / INSERT / UPDATE / DELETE | Per table, per role (`anon` / `authenticated`) | ✅ |
| `TO anon` / `TO authenticated` | Explicit on policies | ✅ |
| SELECT: `USING` only; INSERT: `WITH CHECK` | Matches (e.g. storage insert/update) | ✅ |
| `(select auth.uid())` for perf | Widespread in policies; helpers use it in `45911` | ✅ |
| Index columns used in RLS | `contest_org_id`, `contest_id`, `profile_id`, `status`, etc. | ✅ |
| Policy names in double quotes | Unquoted snake_case (`contest_orgs_authenticated_insert_owner`) | 🟡 cosmetic |
| `security definer` helpers in private schema | `app_private.*`; grants to `authenticated` + **`anon`** for `is_approved_public_contestant` (`45911`, `45917`) | ✅ (mdeai pattern) |

**Example — doc-aligned policy shape (45912):**

```45:50:mdeapp/supabase/migrations/20260603045912_create_contestant_assets_and_social.sql
create policy contestant_assets_anon_select_approved_public_photos
  on public.contestant_assets
  for select
  to anon
  using (
```

**mdeai-specific (SKILL, not in generic RLS doc):** table-level `REVOKE ALL` from `public`/`anon` + explicit `GRANT` — present on `45912`; stricter than minimal Supabase examples.

---

## 3. `supabase-database-functions.md`

| Requirement | Contest pack | Match |
|-------------|--------------|-------|
| Default **SECURITY INVOKER** | `set_contest_updated_at`, `prevent_contest_audit_mutation` | ✅ |
| **SECURITY DEFINER** only when needed | RLS helpers in `45906`, `45907`, `45911` | ✅ |
| `set search_path = ''` | All `app_private` functions | ✅ |
| Fully qualified object names | `public.contestants`, `public.contests`, etc. | ✅ |
| **STABLE** on read helpers | SQL helpers marked `stable` | ✅ |
| Trigger attachment | `…_set_updated_at` on core tables | ✅ |

**Example — matches function doc template:**

```13:21:mdeapp/supabase/migrations/20260603045904_create_contest_rls_helpers.sql
create or replace function app_private.set_contest_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
```

**Caution (doc + SKILL):** definer helpers must stay in `app_private` with tight `GRANT EXECUTE` — you already `REVOKE` from `public`/`anon` and grant narrowly (`45911` anon grant is intentional for public gallery RLS).

---

## 4. `supabase-sql-style.md`

| Requirement | Contest pack | Match |
|-------------|--------------|-------|
| lowercase keywords | Mixed (see migrations) | 🟡 |
| `snake_case` tables/columns | `contest_orgs`, `contest_org_id`, … | ✅ |
| Plural table names | `contests`, `contestants` | ✅ |
| `id` as `identity generated always` | **`uuid` + `gen_random_uuid()`** — matches rest of mdeai DB, not this style guide | 🟡 (project convention) |
| `comment on table` | On core tables (often `COMMENT ON` uppercase in dump files) | ✅ |

---

## 5. `supabase-declarative-schema.md` vs mdeai practice

| Declarative doc | mdeai reality | Contest pack |
|-----------------|---------------|--------------|
| Edit `supabase/schemas/`, generate migrations via `db diff` | **SKILL:** iterate with MCP/SQL → `db pull` when stable; most mdeai history is hand/versioned SQL | Hand-written + one recovery pass from local DB |
| Don’t edit `migrations/` directly | Contradicted by entire `mdeapp` migration tree | Direct edits are **normal here** |

**Verdict:** Treat declarative doc as **optional/future** workflow, not the audit bar for CTEST-001. For new contest DDL, prefer SKILL flow (prototype → advisors → pull) *or* keep imperative files but normalize style.

---

## 6. `supabase-edge-functions.md`

No contest edge functions in this pack — **N/A**. Service-role storage policy in `45916` is the server-side hook for later upload/finalize routes (patterns doc: service role only in edge/API).

---

## 7. `supabase-realtime.md`

| Realtime doc | Contest pack |
|--------------|--------------|
| Prefer `broadcast` + triggers, not `postgres_changes` | No realtime in `45904`–`45917` |
| Topic pattern `scope:entity:id` | Deferred to **CTEST-002** (`vote:tally:{contest_id}`) |
| Index RLS predicate columns | Already done on contest tables |

**Verdict:** Correct for schema-only CTEST-001. When adding vote tallies, follow realtime doc + existing project migration `20260505000200_realtime_broadcast_migration.sql` (broadcast, not `postgres_changes`).

---

## Per-file quick map

| File | Best aligned with | Main gaps |
|------|-------------------|-----------|
| `45904` | migrations, database-functions | — |
| `45905`–`45910` | RLS, patterns (logic) | **UPPERCASE** (sql-style, migrations) |
| `45911` | database-functions, RLS | — |
| `45912`–`45915` | migrations, RLS, sql-style | — |
| `45916` | RLS (storage), patterns | No `begin`/`commit`; bucket DML (declarative doc: DML not in diff) |
| `45917` | migrations, RLS hotfix | Idempotent fixes — good practice |

---

## Priority fixes (if you want doc parity)

1. **P2 — Style:** Lowercase `45905`–`45910` (and uppercase `COMMENT ON` blocks) to match `supabase-migrations` + `supabase-sql-style`.
2. **P3 — Consistency:** Wrap `45916` in `begin;` / `commit;` + block header like other files.
3. **P3 — Policy names:** Optional rename to quoted descriptive strings (RLS doc); not required for correctness.
4. **Do not change for doc alone:** `uuid` PKs, global `contests_slug_key`, `app_private` definer helpers — aligned with **mdeai** SKILL/PRD, not generic SQL style `identity` rule.

---

## Bottom line

**Security and Supabase RLS/function guidance: production-grade** for Phase 1 contest schema. **Documentation/style guide compliance: ~75%** — mainly **casing inconsistency** on recovered core migrations and **declarative-schema workflow** not used (which is fine per `mde-supabase/SKILL.md`). Edge functions and realtime rules don’t apply to this pack yet.

I can open a small follow-up PR that only lowercases `45905`–`45910` and wraps `45916` if you want doc-clean without behavior changes.