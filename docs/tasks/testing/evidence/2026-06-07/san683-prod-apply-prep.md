# SAN-683 prod apply prep — `zkwcbyxiwklihegjhuql`

**Prepared:** 2026-06-07  
**Merge commit:** `b23a5f8` (PR #105)  
**Status:** ✅ **SAN-683 DONE** — Step A + Step B complete (2026-06-07). See [`san683-prod-apply-RESULTS.md`](./san683-prod-apply-RESULTS.md).  
**Do not start SAN-665 until post-apply verification passes.**

---

## 1. Repo state

| Check | Result |
|---|---|
| Branch | `main` @ `dce4292` (includes `b23a5f8` as ancestor) |
| SAN-683 squash | `b23a5f8 feat(supabase): SAN-683 partner schema + RLS foundation` |
| ptr001–ptr014 on disk | ✅ 14 files under `mdeapp/supabase/migrations/20260606130*.sql` |

---

## 2. Linked Supabase project

| Field | Value |
|---|---|
| Project ref | `zkwcbyxiwklihegjhuql` |
| Name | `medellin` |
| CLI link | ● linked (`supabase/.temp/project-ref`) |

---

## 3. Remote migration state (prod)

**Last applied on remote:** `20260606114224` (`revoke_public_security_definer_rpcs`)

**Partner schema on prod today:** ❌ not present  
- `partners`, `partner_drafts`, `revenue_ledger` — absent  
- `leads.partner_id` / `listing_*` — absent  
- `venue_source_evidence`, `search_logs` — present (DATA-045/047 already live)

---

## 4. Pending migrations

### 🚨 BLOCKER — history mismatch (must fix before `db push`)

| Version | Local file | Remote history | Schema on prod |
|---|---|---|---|
| `20260530120700` | ✅ `data045_evidence_tables` | ❌ missing | ✅ tables exist |
| `20260530120800` | ✅ `data047_search_logs_observability` | ❌ missing | ✅ tables exist |
| `20260601120700` | ❌ no local file | ✅ `data045_evidence_tables` | ✅ (duplicate stamp) |
| `20260601120800` | ❌ no local file | ✅ `data047_search_logs_observability` | ✅ (duplicate stamp) |

`supabase db push --dry-run` **fails** until this is reconciled:

```text
Remote migration versions not found in local migrations directory.
supabase migration repair --status reverted 20260601120700 20260601120800
```

### SAN-683 ptr batch (after history fix)

| # | Version | File |
|---|---|---|
| ptr001 | `20260606130000` | `ptr001_partner_enums_and_helpers.sql` |
| ptr002 | `20260606130100` | `ptr002_partner_organizations.sql` |
| ptr003 | `20260606130200` | `ptr003_partners.sql` |
| ptr004 | `20260606130300` | `ptr004_partner_members.sql` |
| ptr005 | `20260606130400` | `ptr005_partner_rls_helpers_and_member_policies.sql` |
| ptr006 | `20260606130500` | `ptr006_partner_drafts.sql` |
| ptr007 | `20260606130600` | `ptr007_partner_services.sql` |
| ptr008 | `20260606130700` | `ptr008_partner_locations.sql` |
| ptr009 | `20260606130800` | `ptr009_partner_assets_and_storage.sql` |
| ptr010 | `20260606130900` | `ptr010_leads_partner_columns.sql` |
| ptr011 | `20260606131000` | `ptr011_bookings_partner_columns.sql` |
| ptr012 | `20260606131100` | `ptr012_leads_bookings_partner_rls.sql` |
| ptr013 | `20260606131200` | `ptr013_revenue_ledger.sql` |
| ptr014 | `20260606131300` | `ptr014_partner_privilege_hardening.sql` |

**Total DDL to apply after repair:** 16 migration version rows (2 history-only + 14 ptr)

---

## 5. Pre-apply advisors (prod, pre-ptr)

| Type | Count | Blocker |
|---|---|---|
| Security | 96 (95 WARN, 1 ERROR) | `spatial_ref_sys` RLS (pre-existing PostGIS; not introduced by SAN-683) |
| Performance | 200+ WARN | Pre-existing; re-run after apply |

No partner-table advisor findings (tables not live yet).

---

## 6. Backup / rollback

### Before apply

1. **Supabase Dashboard** → Project `medellin` → Database → Backups  
   - Confirm latest daily backup timestamp  
   - Enable/verify **PITR** if on Pro plan
2. Optional manual dump (read-only):
   ```bash
   cd mdeapp
   pg_dump "$DIRECT_URL" --schema-only --no-owner -f ../tasks/testing/evidence/2026-06-07/pre-san683-schema.sql
   ```
   (Use `DIRECT_URL` from Infisical — never commit credentials.)

### Rollback options

| Scenario | Action |
|---|---|
| **ptr apply fails mid-batch** | Do not re-run blindly. Inspect `supabase_migrations.schema_migrations` + error log. Fix forward with new migration; avoid manual DDL on prod. |
| **ptr applied but app broken** | App rollback on Vercel independent of DB. DB rollback = restore from backup/PITR (destructive to data written after apply). |
| **History repair wrong** | `migration repair` is metadata-only for applied/reverted stamps — document exact commands run. |

### Post-apply verification (required before SAN-665)

```bash
cd mdeapp
npx supabase migration list          # ptr001–ptr014 show Local | Remote
SUPABASE_DB_URL="<prod direct or branch URL>" npm run verify:partner-schema
node scripts/run-san683-merge-gate.mjs   # 06c §A–§E + F1 pen-test (against apply target)
# MCP: get_advisors security + performance on zkwcbyxiwklihegjhuql
```

---

## 7. Step A results (executed 2026-06-07)

### Repair commands — both succeeded

```text
Repaired migration history: [20260601120700 20260601120800] => reverted
Repaired migration history: [20260530120700 20260530120800] => applied
```

### Migration list delta

| Version | Before (Local \| Remote) | After (Local \| Remote) |
|---|---|---|
| `20260530120700` | ✅ \| ❌ | ✅ \| ✅ |
| `20260530120800` | ✅ \| ❌ | ✅ \| ✅ |
| `20260601120700` | ❌ \| ✅ phantom | **removed** |
| `20260601120800` | ❌ \| ✅ phantom | **removed** |
| `20260606130000`–`31300` | ✅ \| ❌ | ✅ \| ❌ (pending) |

Prod `schema_migrations` confirms: `20260530120700`, `20260530120800` applied; phantoms gone; ptr001 not yet applied.

### Dry-run (`db push --dry-run --linked`) — PASS

Would push **only** ptr001–ptr014 (14 files). No unexpected migrations.

## 8. Apply commands — **Step B PAUSED**

### Step B — Prod apply (human approval required)

```bash
cd /home/sk/mdeai/mdeapp
npx supabase db push --linked
```

**Do not run Step B until Step A dry-run is clean and backup is confirmed.**

---

## 8. Gate checklist

- [ ] Human approves history repair (Step A)
- [ ] `db push --dry-run` shows only ptr001–ptr014
- [ ] Backup/PITR confirmed
- [ ] Human approves `db push` (Step B)
- [ ] `verify:partner-schema` PASS against prod
- [ ] `run-san683-merge-gate.mjs` 19/19 PASS
- [ ] `get_advisors` re-run — no new ERROR on partner tables
- [ ] **Then** unblock SAN-665 `/api/partners/activate`
