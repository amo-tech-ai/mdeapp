# SAN-683 / PR #105 merge gate results

**Date:** 2026-06-07  
**Branch:** `ai/san-683-partner-schema` @ `8aac97a`  
**Environment:** Local Supabase (`127.0.0.1:54322`) — **not prod**  
**Supabase cloud branch:** Blocked — Pro plan required for branching

## Summary

| Step | Result | Notes |
|---|---|---|
| 1. Apply ptr001–ptr014 | 🟢 PASS | `supabase migration up` after shadow-replay guards on 14106/14224 |
| 2. 06c §A–§E | 🟢 **19/19** | `node scripts/run-san683-merge-gate.mjs` |
| 3. Negative F1 pen-test | 🟢 PASS | `permission denied` on `status`/`completion_score` UPDATE |
| 4. Supabase advisors | 🟡 PARTIAL | Prod MCP: no `partner_*` tables yet (pre-apply). Local `db lint`: pre-existing unrelated function errors |
| 5. `database.types.ts` | 🟢 PASS | Regenerated locally; `partners` table present (line ~2639) |
| 6. CI | 🟢 PASS | `floor` + Vercel green on PR #105 |

## 06c detail

```
PASS bootstrap — profile + rental lead
PASS seed — partners.seed.sql
PASS §A partner_tables — 8
PASS §A leads_partner_cols — 3
PASS §A bookings_partner_cols — 5
PASS §A partner_enums — 2
PASS §A partner_rls_tables — 8
PASS §A partner_helpers — 3
PASS §B anon_denied
PASS §B member_scope — visible=5
PASS §B service_role_bypass — 5
PASS §C fk_profile_id
PASS §C revenue_restrict
PASS §D seed_idempotent
PASS §E partners_rows — 5
PASS §E services_rows — 7
PASS §E revenue_rows — 2
PASS §E leads_attributed — 1
PASS F1 negative pen-test — column privilege blocked

Gate summary: 19/19 passed
```

## Remaining before merge

- [ ] Commit gate artifacts: `database.types.ts`, seed UUID cast fix, `run-san683-merge-gate.mjs`, optional 14106/14224 shadow guards
- [ ] Supabase **cloud branch** apply (needs Pro) OR human-approved prod promotion path
- [ ] Prod `get_advisors` after ptr apply (partner RLS/storage policies)
- [ ] **Do not merge** until types + gate script committed and prod/branch apply plan agreed

## Commands

```bash
cd mdeapp
supabase migration up
node scripts/run-san683-merge-gate.mjs
supabase gen types typescript --local > src/lib/supabase/database.types.ts
```
