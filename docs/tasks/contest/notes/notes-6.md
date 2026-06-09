## Contest migrations — verified

All **14** files (`45904`–`45917`) in `mdeapp/supabase/migrations/` pass local verification against **mde-supabase** rules (security/RLS/functions first; style second).

### What changed (style + correctness, uncommitted)

| Area | Fix |
|------|-----|
| **45905–45910** | Lowercase SQL; multiline granular policies; `status in ('published','closed')` in policies |
| **45916** | Block header, `begin`/`commit`, multiline storage policies, **UPDATE `with check`** (RF-07) |
| **45911 / 45917** | `grant execute … to anon` on `is_approved_public_contestant` (RF-01); idempotent storage UPDATE in `45917` |

### Verification (green)

```text
supabase db reset     → through 45917
SQL harness           → ROLLBACK (negative + positive paths)
npm test --run ctest001 → 1 passed
Local catalog         → 14 contest% tables, 16 app_private helpers
```

`supabase db lint` only reports **legacy** function issues (`rental_applications`, `insert_trip_item_for_user`) — nothing in the contest pack.

### Best-practices checklist

- RLS on every table; no `FOR ALL`; `(select auth.uid())` in policies  
- `app_private` helpers: `security definer` + `set search_path = ''` + tight `grant execute`  
- Storage: UPDATE has both `using` and `with check`; service_role bucket policy  
- **RF-04:** `contests_slug_key` kept (product decision)  
- **RF-03:** single tree via `supabase` → `mdeapp/supabase` symlink  

### Still open

1. **Uncommitted diff** — 7 migration files (~417/+286 lines formatting); branch is **ahead 1** of origin (`9b99903`). Say if you want a follow-up commit.  
2. **Remote** — `supabase db push` not run; remote still has **0** `contest%` tables (see `tasks/contest/notes/notes-4.md`).

Notes updated: [`tasks/contest/notes/notes-4.md`](tasks/contest/notes/notes-4.md) with the style-pass verdict and audit table refresh.