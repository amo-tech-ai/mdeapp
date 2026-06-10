# CTEST-001 migration corrections (SAN-533)

**Audit:** [`tasks/contest/audit/2026-06-02-contest-migrations-forensic-audit-full.md`](../audit/2026-06-02-contest-migrations-forensic-audit-full.md)  
**Canonical migrations:** `mdeapp/supabase/migrations/` only (not `/home/sk/mdeai/supabase/migrations/`)

---

## Correction checklist → migration files

| ID | Priority | What to change | File(s) | Status |
|----|----------|----------------|---------|--------|
| **RF-01** | 🔴 P0 | `GRANT EXECUTE … is_approved_public_contestant(uuid) TO anon` | `45911` + idempotent `45917` | 🟢 **Applied & verified** |
| **RF-02** | 🔴 P1 | Positive anon test: approved photo metadata readable | `supabase/__tests__/ctest001_core_rls_negative.sql` | 🟢 **Applied & verified** |
| **RF-03** | 🔴 P1 | Single migration root (`mdeapp/supabase` only) | Repo hygiene (delete duplicate tree) | 🟢 **Done** — removed `/home/sk/mdeai/supabase/migrations/202606030459*`; canonical path only |
| **RF-04** | 🟡 P2 | Drop global `contests_slug_key` if URLs are org-scoped | `45907` or new migration | 🟢 **No change** — keep global `contests_slug_key` for `/contests/[slug]` (SAN-538 / CTEST-010) |
| **RF-05** | 🟡 P2 | Require `contest_org_id` on audit inserts (service route) | App code + optional `NOT NULL` later | ⚪ **Documented** |
| **RF-06** | 🟡 P2 | Enforce storage path `<contestant_uuid>/…` in upload API | CTEST-008 app code | ⚪ **App layer** |
| **RF-07** | 🟡 P2 | Storage `UPDATE` policies need `WITH CHECK` | `45916` + `45917` | 🟢 **45917** recreates policies with `WITH CHECK` |
| **RF-08** | ⚪ | Commit, push, remote catalog SQL | Git + evidence | 🟡 **Commit local** — remote pre-deploy: 0 `contest%` tables; latest migration `20260601120800` |

---

## Per-file corrections (what changed / what to do)

### `20260603045904_create_contest_rls_helpers.sql` — 🟢 no change

- Keep as-is: `app_private` schema, `set_contest_updated_at`, `prevent_contest_audit_mutation`.

### `20260603045905_create_contest_orgs.sql` — 🟢 no SQL change

- **App:** after org insert, always insert owner `contest_memberships` row (same transaction).

### `20260603045906_create_contest_memberships.sql` — 🟢 no change

### `20260603045907_create_contests.sql` — 🟡 optional follow-up

- **RF-04 (decided 2026-06-03):** Keep **both** `contests_slug_key` (global) and `contests_org_slug_key` — wireframes use `/contests/[slug]`; do not drop global unique unless product moves to org-scoped URLs only.

### `20260603045908_create_contest_rounds.sql` — 🟢 no change

### `20260603045909_create_contestants.sql` — 🟢 no change

- **UI:** never expose `legal_name`, `email`, `phone` on anon/public pages (use `display_name` only).

### `20260603045910_create_contest_audit_events.sql` — 🟡 app invariant

- Service-role inserts must set `contest_org_id` (rows with NULL are invisible to staff SELECT).

### `20260603045911_create_contestant_rls_helpers.sql` — 🟢 **corrected**

```sql
grant execute on function app_private.is_approved_public_contestant(uuid) to anon;
```

**Why:** Anon policies on `contestant_assets`, `contestant_social_links`, and `storage.objects` call this helper. Without the grant, tourists get `permission denied for function is_approved_public_contestant`.

**Example:** Fan opens shared contestant link logged out → hero photo row in `contestant_assets` loads (count = 1).

### `20260603045912_create_contestant_assets_and_social.sql` — 🟢 no SQL change (fixed via 45911)

### `20260603045913_create_contestant_profile_extractions_reviews.sql` — 🟢 no change

### `20260603045914_create_contest_events.sql` — 🟢 no change

### `20260603045915_create_contestant_discovery.sql` — 🟢 no change

### `20260603045916_create_contestant_storage_buckets.sql` — 🟡 partial

- Buckets and anon-approved SELECT policy are correct.
- **RF-07:** `UPDATE` policies originally lacked `WITH CHECK`; fixed in `45917` for environments that need idempotent refresh.

### `20260603045917_contest_audit_fixes.sql` — 🟢 **new**

- Idempotent: re-grants anon execute (safe if 45911 already has it).
- Recreates `contestant_photos_update_own` and `contestant_docs_update_own` with `WITH CHECK`.

---

## Verification (run after corrections)

```bash
cd mdeapp
supabase db reset                                    # expect exit 0 through 45917
psql "$DATABASE_URL" -f supabase/__tests__/ctest001_core_rls_negative.sql  # ROLLBACK
npm test -- --run ctest001                           # 1 passed
```

**Anon privilege probe:**

```sql
SELECT has_function_privilege('anon', 'app_private.is_approved_public_contestant(uuid)', 'EXECUTE');
-- expect t
```

**Last run (2026-06-02):** all above 🟢 PASS after RF-01 + RF-02 + 45917.

---

## Updated grades (post-correction)

| Layer | Dot | % |
|-------|-----|---:|
| Migrations apply | 🟢 | 98 |
| RLS structure | 🟢 | 90 |
| Anon public gallery path | 🟢 | 95 |
| CTEST-001 spec (local) | 🟢 | 92 |
| Production deploy | 🟡 | 75 |

**CTEST-001 → Done:** still 🟡 **In Review** until RF-08 (commit + remote catalog).  
**Fan-facing pages:** 🟢 schema/RLS unblocked locally after RF-01.

---

## Still open (not migration SQL)

1. ~~Remove duplicate root contest migrations (RF-03).~~ Done.
2. Commit `mdeapp` migration pack + test + types (RF-08) — then `supabase db push` for remote apply.
3. Re-run remote catalog SQL after push (pre-deploy snapshot in `CTEST-001-evidence.md`).
4. CTEST-002: `vote_ledger` + Realtime `vote:tally:{contest_id}` (separate task).

---

## Quick reference: which task uses which migration

| Task | Migrations |
|------|------------|
| CTEST-001 | 45904–45917 |
| CTEST-008 | 45912, 45913, 45916 (+ 45911 grant) |
| CTEST-011 | 45915 |
| CTEST-002 | new tables — do not add to 001 pack |
