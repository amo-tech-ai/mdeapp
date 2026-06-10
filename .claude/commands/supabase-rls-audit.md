---
description: Audit RLS coverage on public schema — all tables must have rls + ≥1 policy
allowed-tools: Bash, Read, Grep, mcp__ed3787fc-985d-4fc2-87ac-e09815d3583a__execute_sql, mcp__ed3787fc-985d-4fc2-87ac-e09815d3583a__list_tables, mcp__ed3787fc-985d-4fc2-87ac-e09815d3583a__get_advisors
---

# /supabase-rls-audit — RLS coverage audit

Verify every public-schema table in the live Supabase project (`zkwcbyxiwklihegjhuql`) has:

1. Row Level Security **enabled** (`pg_class.relrowsecurity = true`)
2. **At least one policy** in `pg_policies`

Per CLAUDE.md hard rule: every new table needs RLS + ≥1 policy.

## Workflow

1. **List tables** via Supabase MCP `list_tables` (schemas=['public']).
2. **Query RLS state** via Supabase MCP `execute_sql`:
   ```sql
   SELECT
     c.relname AS table_name,
     c.relrowsecurity AS rls_enabled,
     COUNT(p.polname) AS policy_count
   FROM pg_class c
   LEFT JOIN pg_policies p
     ON p.tablename = c.relname AND p.schemaname = 'public'
   JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE n.nspname = 'public' AND c.relkind = 'r'
   GROUP BY c.relname, c.relrowsecurity
   ORDER BY rls_enabled ASC, policy_count ASC, table_name;
   ```
3. **Run security advisors** via Supabase MCP `get_advisors` (type=security).
4. **Print three sections:**
   - ❌ Tables WITHOUT RLS (zero tolerance — fix immediately)
   - ⚠️ Tables WITH RLS but 0 policies (RLS-without-policy denies everything; usually a bug)
   - 🔴 Security advisor warnings (especially `function_search_path_mutable`, `auth_user_exposed`)
5. **Output table** in markdown.

## Expected output shape

```
## RLS audit — 2026-05-19

| Status | Table | RLS | Policies |
|--------|-------|-----|----------|
| ❌ | new_table_added_this_session | false | 0 |
| ⚠️ | another_table | true | 0 |
| ✅ | events | true | 11 |
| … | … | … | … |

## Security advisors

- 🔴 function_search_path_mutable: `decide_approval` — recommended fix: `SET search_path = public, pg_temp`
- 🟡 (none others)
```

## Anti-patterns

- Do not fix the advisor warnings inline — surface them, let the user decide whether to apply.
- Do not run `execute_sql` to DISABLE RLS. That's a destructive admin action.
- Do not modify schemas/* files as part of this command.
