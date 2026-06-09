---
title: Contest migrations forensic audit — full pack (13 files)
date: 2026-06-02
auditor: Cursor (mde-supabase + task-verifier protocol)
scope: mdeapp/supabase/migrations/20260603045904–45916
task: CTEST-001 / SAN-533
supersedes: 2026-06-02-contest-migrations-forensic-audit.md (6-table slice)
evidence: tasks/contest/notes/CTEST-001-evidence.md
---

# Contest migrations forensic audit (full pack)

## Executive summary

| Verdict | Dot | Score |
|---------|-----|------:|
| **Migration SQL applies locally** | 🟢 | **98%** |
| **RLS structure & helpers** | 🟡 | **86%** |
| **Public anon read path (approved fan UX)** | 🔴 | **0%** (runtime broken) |
| **CTEST-001 spec completeness** | 🟢 | **92%** |
| **Production-ready (prod deploy)** | 🔴 | **No** |
| **Safe to merge after critical fix** | 🟡 | **Yes, one migration** |

**Real-world impact:** Camila opens an approved contestant profile in a logged-out browser. `contestants` rows can work (policy inlines checks), but **approved photos and social links error** with `permission denied for function is_approved_public_contestant` — fans see broken galleries until fixed.

---

## Grading legend

| Dot | Meaning | Score band |
|-----|---------|------------|
| 🟢 | Meets spec / best practice | 90–100% |
| 🟡 | Shippable with documented follow-up | 70–89% |
| ⚪ | N/A or explicitly deferred | — |
| 🔴 | Blocker, security gap, or broken runtime path | &lt;70% |

---

## Tests executed (2026-06-02)

| # | Test | Dot | Result |
|---|------|-----|--------|
| 1 | `cd mdeapp && supabase db reset` | 🟢 | PASS — all 13 contest migrations apply |
| 2 | 14 `contest%` tables exist | 🟢 | PASS |
| 3 | RLS on all 14 tables | 🟢 | 14/14 `rowsecurity=true` |
| 4 | ≥1 policy per table | 🟢 | 0 tables without policies |
| 5 | Authenticated tables have SELECT companion for UPDATE | 🟢 | 0 gaps |
| 6 | `(select auth.uid())` in migration SQL | 🟢 | All policies use wrapped form |
| 7 | `ctest001_core_rls_negative.sql` | 🟢 | PASS → `ROLLBACK` |
| 8 | `npm test -- --run ctest001` | 🟢 | 1/1 passed |
| 9 | Anon **positive** approved `contestant_assets` | 🔴 | `permission denied for function is_approved_public_contestant` |
| 10 | Anon **positive** published `contests` | 🟢 | `count=1` for published slug |
| 11 | Storage buckets private | 🟢 | `contestant-photos`, `contestant-docs` `public=false` |
| 12 | `database.types.ts` contest tables | 🟢 | Regenerated locally |
| 13 | Duplicate migrations at repo root | 🔴 | `/home/sk/mdeai/supabase/migrations/` mirrors pack — deploy drift risk |
| 14 | Git committed in `mdeapp/` | 🔴 | Migrations still untracked on branch |
| 15 | Remote Supabase catalog proof | 🔴 | Not recorded |
| 16 | `supabase db lint` | 🟡 | Pre-existing non-contest errors only |

---

## Critical red flags

| ID | Sev | Finding | Real-world example | Fix |
|----|-----|---------|-------------------|-----|
| **RF-01** | 🔴 P0 | `app_private.is_approved_public_contestant(uuid)` **not granted to `anon`**, but used in anon RLS on `contestant_assets`, `contestant_social_links`, and `storage.objects` | Fan shares contestant link on Instagram; logged-out viewer gets DB error instead of hero photo | `GRANT EXECUTE ON FUNCTION app_private.is_approved_public_contestant(uuid) TO anon;` in `45911` or hotfix migration |
| **RF-02** | 🔴 P1 | No SQL/Vitest **positive** test for anon approved asset read | Regression ships again when helpers change | Add probe in `ctest001_core_rls_negative.sql` after RF-01 fix |
| **RF-03** | 🔴 P1 | **Duplicate migration tree** at repo root `supabase/migrations/` | CI job points at wrong folder → prod missing tables | Delete or symlink one canonical path; document `mdeapp/supabase` only |
| **RF-04** | 🟡 P2 | `contests_slug_key` is **globally unique** on `slug` alone | Two orgs cannot both host `/contests/miss-medellin-2026` | Drop global unique if URLs are `/{org}/{slug}`; keep `contests_org_slug_key` only |
| **RF-05** | 🟡 P2 | `contest_audit_events` SELECT requires `contest_org_id IS NOT NULL` | System rows with null org never visible to Patricia | Service-role insert only with org_id set; document invariant |
| **RF-06** | 🟡 P2 | Storage path `((storage.foldername(name))[1])::uuid` throws on malformed paths | Bad upload path crashes policy evaluation | Validate path in app; optional `safe` cast pattern in policy |
| **RF-07** | 🟡 P2 | `45916` storage UPDATE policies lack explicit `WITH CHECK` | Upsert edge cases may behave oddly | Add `WITH CHECK` mirroring `USING` on UPDATE |
| **RF-08** | ⚪ | Not committed / not on remote | Sofía cannot reproduce on staging | Commit slice + `supabase db push` + catalog SQL in evidence |

---

## Per-migration report

### `20260603045904_create_contest_rls_helpers.sql` — 🟢 **94%**

| Area | Dot | Notes |
|------|-----|-------|
| `app_private` lockdown | 🟢 | Revoked from public/anon; `USAGE` for authenticated |
| Trigger helpers | 🟢 | `search_path = ''`; audit append-only via exception |
| Grants on triggers | 🟡 | No explicit `GRANT EXECUTE` to authenticated (invoker triggers — OK) |

**Corrections:** None blocking.

**Example:** Patricia cannot `DELETE` audit rows — trigger raises `contest audit events are append-only` (verified in SQL harness).

---

### `20260603045905_create_contest_orgs.sql` — 🟡 **82%**

| Area | Dot | Notes |
|------|-----|-------|
| Table + checks | 🟢 | Slug format, status enum |
| RLS enabled | 🟢 | |
| Policies | 🟡 | INSERT-only here; SELECT/UPDATE in `45906` (valid split) |
| Bootstrap | 🟡 | Owner must insert org **and** membership in one flow |

**Corrections:**
1. Document two-step bootstrap in CTEST-004/008 (org row + owner membership).
2. Consider `SELECT` policy on `45905` for owner immediately after insert (optional).

**Example:** Roberto creates `contest_orgs` row but forgets `contest_memberships` → cannot see his org until admin fixes.

---

### `20260603045906_create_contest_memberships.sql` — 🟢 **91%**

| Area | Dot | Notes |
|------|-----|-------|
| Definer helpers | 🟢 | Avoids RLS recursion; role ordering |
| Policies | 🟢 | Admin manage; owner bootstrap |
| Indexes | 🟢 | `(contest_org_id, profile_id, role)` partial |

**Corrections:** Judge role is read-limited in comments only — judge-specific policies deferred to CTEST-002 (OK).

---

### `20260603045907_create_contests.sql` — 🟡 **88%**

| Area | Dot | Notes |
|------|-----|-------|
| Lifecycle enums | 🟢 | Matches CTEST-001 |
| Anon published read | 🟢 | Verified with fixture |
| Staff/admin split | 🟢 | |
| Slug uniqueness | 🟡 | **RF-04** global `contests_slug_key` |

**Corrections:**
1. Drop `contests_slug_key` if public routes use org-scoped slugs only.
2. Add `updated_by_profile_id` trigger population (app-layer OK).

---

### `20260603045908_create_contest_rounds.sql` — 🟢 **90%**

| Area | Dot | Notes |
|------|-----|-------|
| Anon join to published contest | 🟢 | |
| Vote weights placeholder | 🟢 | No `vote_ledger` (correct) |

**Corrections:** None blocking.

---

### `20260603045909_create_contestants.sql` — 🟢 **92%**

| Area | Dot | Notes |
|------|-----|-------|
| Self-approve blocked | 🟢 | SQL harness |
| Anon policy | 🟢 | **Inlines** EXISTS — does not call `is_approved_public_contestant` |
| PII fields | 🟡 | `legal_name`, `email` visible to staff via private read — document column exposure in UI |

**Corrections:** Ensure public pages never SELECT `legal_name` (view or column allowlist in API).

---

### `20260603045910_create_contest_audit_events.sql` — 🟡 **84%**

| Area | Dot | Notes |
|------|-----|-------|
| Append-only | 🟢 | Trigger + RLS `false` policies |
| Auth insert blocked | 🟢 | `insert_none` policy |
| `entity_table` enum | 🟡 | Extended in `45915` — good |
| Null `contest_org_id` | 🟡 | **RF-05** unreadable by staff |

**Corrections:** Require `contest_org_id` on insert from service routes; add CHECK or NOT NULL when all writers updated.

---

### `20260603045911_create_contestant_rls_helpers.sql` — 🔴 **72%**

| Area | Dot | Notes |
|------|-----|-------|
| Helper design | 🟢 | `security definer`, `search_path = ''` |
| Grants | 🔴 | **`anon` missing** on `is_approved_public_contestant` — **RF-01** |

**Corrections (required):**
```sql
grant execute on function app_private.is_approved_public_contestant(uuid) to anon;
```

**Example:** Without fix, tourist opens contestant gallery → empty/error despite approved profile.

---

### `20260603045912_create_contestant_assets_and_social.sql` — 🔴 **68%**

| Area | Dot | Notes |
|------|-----|-------|
| Schema | 🟢 | Bucket/path uniqueness, indexes |
| Staff/self policies | 🟢 | |
| Anon approved photos | 🔴 | Depends on broken helper — **RF-01** |

**Corrections:** Fix `45911` grants; add positive anon test with approved fixture.

---

### `20260603045913_create_contestant_profile_extractions_reviews.sql` — 🟢 **90%**

| Area | Dot | Notes |
|------|-----|-------|
| Anon denied | 🟢 | No grants to anon |
| Contestant cannot approve extraction | 🟢 | `review_status` capped for self |
| Reviews immutable | 🟢 | UPDATE/DELETE `false` |
| Staff insert reviews | 🟢 | `can_manage_contestant` |

**Corrections:** Staff can set `review_status = 'approved'` on extractions via `can_manage` path — ensure UI uses `contestant_profile_reviews` for audit trail.

---

### `20260603045914_create_contest_events.sql` — 🟢 **89%**

| Area | Dot | Notes |
|------|-----|-------|
| Mirrors `contest_rounds` pattern | 🟢 | |
| Finals schedule | 🟢 | Casting/rehearsal/final types |

**Corrections:** None blocking.

---

### `20260603045915_create_contestant_discovery.sql` — 🟢 **91%**

| Area | Dot | Notes |
|------|-----|-------|
| Staff-only | 🟢 | No anon grants |
| Audit entity_table extended | 🟢 | |
| Outsider denied | 🟢 | SQL harness |

**Corrections:** `created_by_profile_id` must match `auth.uid()` on insert — good.

---

### `20260603045916_create_contestant_storage_buckets.sql` — 🟡 **76%**

| Area | Dot | Notes |
|------|-----|-------|
| Private buckets | 🟢 | |
| Owner/staff paths | 🟢 | |
| Anon approved photo | 🔴 | **RF-01** via helper in policy |
| No `COMMENT ON POLICY` | 🟢 | Follows landlord pattern |
| UPDATE `WITH CHECK` | 🟡 | **RF-07** |

**Corrections:** Fix anon execute; add `WITH CHECK` on UPDATE policies; document path `<contestant_id>/<filename>` in CTEST-008.

---

## CTEST-001 task scorecard

| Requirement | Dot | % | Status |
|-------------|-----|---:|--------|
| 14 core tables | 🟢 | **100** | All present |
| RLS every table | 🟢 | **100** | |
| Policies by actor | 🟡 | **88** | Judge = member; anon public path broken |
| Anon cannot read private drafts | 🟢 | **100** | Harness |
| Public published + approved read | 🔴 | **40** | Contests OK; assets/storage broken |
| Storage buckets | 🟢 | **95** | |
| SQL + Vitest proof | 🟡 | **75** | Negative only |
| Types regenerated | 🟢 | **100** | Local |
| Remote catalog | 🔴 | **0** | |
| No vote_ledger | 🟢 | **100** | |
| **CTEST-001 overall** | 🟡 | **92** spec / **78** runtime |

**Done gate:** 🔴 **Not Done** until RF-01 fixed, RF-02 test added, committed, remote proof.

---

## SAN-533 / migration corrections checklist

| Item | Owner | Action |
|------|-------|--------|
| RF-01 anon EXECUTE | Migration | `45917_grant_anon_public_contestant_read.sql` |
| RF-02 positive test | Test | Extend `ctest001_core_rls_negative.sql` |
| RF-03 duplicate tree | Repo | Remove `/home/sk/mdeai/supabase/migrations` duplicate or add README |
| RF-04 global slug | Product | Confirm URL scheme → migration if org-scoped |
| Commit + push | Git | Surgical `feat(contest): CTEST-001 schema+RLS (SAN-533)` |
| Remote proof | Ops | MCP/SQL catalog on `zkwcbyxiwklihegjhuql` |
| CTEST-002 prep | Next | `vote_ledger` + Realtime `vote:tally:{id}` |

---

## Best practices score (mde-supabase)

| Practice | Dot | % |
|----------|-----|---:|
| RLS on all public tables | 🟢 | 100 |
| `(SELECT auth.uid())` | 🟢 | 100 |
| `SECURITY DEFINER` + `search_path = ''` | 🟢 | 100 |
| Revoke/ grant hardening | 🟢 | 95 |
| Indexes on policy columns | 🟡 | 80 |
| Split migrations + comments | 🟢 | 95 |
| Evidence + tests | 🟡 | 75 |
| No service role in client | 🟢 | 100 |
| **Weighted** | 🟡 | **86** |

---

## Production readiness

| Environment | Verdict |
|-------------|---------|
| **Local dev / CI** | 🟡 Ready after RF-01 + commit |
| **Staging/prod Supabase** | 🔴 Not ready — not deployed + anon bug |
| **Fan-facing public pages** | 🔴 Blocked on RF-01 |
| **Patricia admin / discovery** | 🟡 Ready for internal tooling behind auth |
| **CTEST-002 vote ledger** | 🟢 Unblocked for schema work |

---

## Suggested improvements (non-blocking)

1. **SQL view** `public.contestants_public` — only safe columns for anon API.
2. **Realtime** — on `contestants` status change, `realtime.send` to `contest:{id}:tally` (CTEST-002).
3. **`supabase db advisors`** — run after RF-01 on staging.
4. **Inline anon policies** — alternative to granting anon execute on definer helpers (security reviewers sometimes prefer duplicate EXISTS in anon policies only).

---

## Overall grades

| Layer | Dot | % |
|-------|-----|---:|
| Migrations 45904–45910 (core 6) | 🟢 | **90** |
| Migrations 45911–45916 (follow-up 7) | 🟡 | **79** |
| **Full pack 45904–45916** | 🟡 | **86** |
| CTEST-001 spec coverage | 🟢 | **92** |
| **Production ready** | 🔴 | **62** |

---

## References

- Skill: `.claude/skills/mde-supabase/SKILL.md`
- Task: `tasks/contest/tasks/CTEST-001-supabase-contest-core-schema.md`
- Evidence: `tasks/contest/notes/CTEST-001-evidence.md`
- Prior audit (6-table): `tasks/contest/audit/2026-06-02-contest-migrations-forensic-audit.md`
