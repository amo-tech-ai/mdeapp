---
title: Contest core migrations forensic audit (SAN-533 / CTEST-001)
date: 2026-06-02
auditor: Cursor (mde-supabase + task-verifier protocol)
scope:
  - mdeapp/supabase/migrations/20260603045904_create_contest_rls_helpers.sql
  - mdeapp/supabase/migrations/20260603045905_create_contest_orgs.sql
  - mdeapp/supabase/migrations/20260603045906_create_contest_memberships.sql
  - mdeapp/supabase/migrations/20260603045907_create_contests.sql
  - mdeapp/supabase/migrations/20260603045908_create_contest_rounds.sql
  - mdeapp/supabase/migrations/20260603045909_create_contestants.sql
  - mdeapp/supabase/migrations/20260603045910_create_contest_audit_events.sql
task: CTEST-001
linear: SAN-533
---

# Contest migrations forensic audit

## Executive summary

| Verdict | Dot | Score |
|---------|-----|------:|
| **Migration SQL quality** (what shipped) | 🟡 | **84%** |
| **CTEST-001 spec completeness** | 🔴 | **57%** |
| **Production-ready for contest vertical** | 🔴 | **No** |
| **Safe to merge as Phase 2 foundation slice** | 🟡 | **Yes, with follow-up migrations** |

The seven migrations **apply cleanly** on local `supabase db reset`, enable RLS on all six `contest_*` tables, and implement a **sound org → membership → contest → round → contestant → audit** model with `app_private` security-definer helpers and `(select auth.uid())` patterns. They are **not** sufficient to close CTEST-001 or unblock CTEST-002+ without **eight missing tables**, **storage buckets**, **RLS proof scripts**, **typegen**, and **Vitest/SQL tests**.

---

## Grading legend

| Dot | Meaning | Score band |
|-----|---------|------------|
| 🟢 | Meets spec / best practice; ship as-is | 90–100% |
| 🟡 | Acceptable with documented follow-up | 70–89% |
| ⚪ | N/A or deferred by explicit comment | — |
| 🔴 | Blocker, security gap, or spec miss | &lt;70% |

---

## Tests executed

| # | Test | Result | Notes |
|---|------|--------|-------|
| 1 | `supabase db reset` (all migrations) | 🟢 PASS | All 7 contest migrations applied without error |
| 2 | Catalog: RLS enabled on `contest%` tables | 🟢 PASS | 6/6 `rowsecurity = true` |
| 3 | Catalog: ≥1 policy per table | 🟢 PASS | 4–5 policies per table; none empty |
| 4 | UPDATE tables have SELECT policy | 🟢 PASS | 0 tables missing SELECT companion |
| 5 | Missing CTEST-001 tables | 🔴 FAIL | 8/14 tables absent (see below) |
| 6 | `SET ROLE anon` → draft contests/contestants | 🟢 PASS | `count = 0` for `status = 'draft'` |
| 7 | `npm test -- --run contest` | 🔴 FAIL | No test files |
| 8 | `npm run typecheck` | 🟢 PASS | No TS errors (contest types not referenced yet) |
| 9 | `contest_*` in `database.types.ts` | 🔴 FAIL | Not regenerated |
| 10 | Storage buckets `contestant-photos` / `contestant-docs` | 🔴 FAIL | Not in migrations |
| 11 | `supabase db lint` | 🟡 WARN | Pre-existing `public.addauth` error unrelated to contest |

---

## Per-migration scores

| Migration | Dot | % | Summary |
|-----------|-----|---:|---------|
| `20260603045904_create_contest_rls_helpers.sql` | 🟢 | **94** | `app_private` schema locked down; `search_path = ''`; append-only audit trigger helper |
| `20260603045905_create_contest_orgs.sql` | 🟡 | **78** | Solid table + indexes; only INSERT policy until next file; bootstrap needs paired membership insert |
| `20260603045906_create_contest_memberships.sql` | 🟢 | **90** | Definer helpers avoid RLS recursion; owner bootstrap policy; completes org SELECT/UPDATE |
| `20260603045907_create_contests.sql` | 🟢 | **91** | Lifecycle enums match spec; anon published-only; staff/admin split |
| `20260603045908_create_contest_rounds.sql` | 🟢 | **88** | Published round + published contest join for anon |
| `20260603045909_create_contestants.sql` | 🟡 | **83** | Strong public/self/staff split; **8 related tables explicitly deferred** |
| `20260603045910_create_contest_audit_events.sql` | 🟡 | **80** | Append-only enforced; auth cannot insert (service only); null `contest_org_id` rows unreadable |

**Weighted average (migration files only): 84%** 🟡

---

## CTEST-001 spec compliance matrix

| Requirement | Dot | % | Evidence |
|-------------|-----|---:|----------|
| 14 core tables | 🔴 | **43** | 6 exist; 8 missing |
| RLS on every contest table | 🟢 | **100** | All 6 enabled |
| Policies: anon / contestant / organizer / judge / admin | 🟡 | **85** | Judge = `member` not `staff`; no platform `super_admin` bypass |
| Anon cannot read drafts/extractions/leads | 🟢 | **100** | Anon probe on drafts; missing tables N/A |
| Published contest + approved contestant public read | 🟢 | **95** | Policies present; not exercised with fixture data |
| Storage buckets + policies | 🔴 | **0** | Not migrated |
| Remote catalog proof in evidence | 🔴 | **0** | No `CTEST-001-evidence.md` run recorded |
| `npm test` / typegen / build after typegen | 🔴 | **25** | typecheck passes; no contest types/tests |
| No `vote_ledger` in this task | 🟢 | **100** | Absent |
| Split migrations + comments | 🟢 | **95** | Matches mde-supabase migration style |

**CTEST-001 overall spec score: 57%** 🔴 — **not Done**.

---

## Missing tables (blockers for CTEST-001 Done)

| Table | CTEST-001 | Status |
|-------|-----------|--------|
| `contest_orgs` | ✅ | Shipped |
| `contest_memberships` | ✅ | Shipped |
| `contests` | ✅ | Shipped |
| `contest_rounds` | ✅ | Shipped |
| `contestants` | ✅ | Shipped (core only) |
| `contest_audit_events` | ✅ | Shipped |
| `contestant_assets` | ❌ | Deferred in `45909` comment |
| `contestant_social_links` | ❌ | Missing |
| `contestant_profile_extractions` | ❌ | Missing |
| `contestant_profile_reviews` | ❌ | Missing |
| `contest_events` | ❌ | Missing |
| `contestant_discovery_runs` | ❌ | Missing |
| `contestant_discovery_leads` | ❌ | Missing |
| `contestant_invite_drafts` | ❌ | Missing |

---

## Red flags (critical)

| ID | Severity | Finding | Fix |
|----|----------|---------|-----|
| R1 | 🔴 Blocker | **8/14 tables missing** — CTEST-001 DoD requires full core pack | Add migrations `45911+` or amend task scope in writing |
| R2 | 🔴 Blocker | **No RLS proof evidence** — anon negative / cross-tenant scripts not in `tasks/contest/notes/CTEST-001-evidence.md` | Run SQL harness; attach exit codes |
| R3 | 🔴 Blocker | **No Vitest/SQL tests** — `npm test -- contest` finds zero files | Add `src/lib/contest/__tests__/schema-rls.test.ts` or SQL tap |
| R4 | 🔴 Blocker | **Types not regenerated** — `database.types.ts` has no `contest_*` | `supabase gen types` + commit |
| R5 | 🔴 Blocker | **Storage not created** — CTEST-001 workflow step 5 | Migration for buckets + `storage.objects` policies |

---

## Yellow flags (fix before production)

| ID | Finding | Recommendation |
|----|---------|----------------|
| Y1 | **Org bootstrap** — after `INSERT contest_orgs`, user cannot `SELECT` org until `INSERT contest_memberships` (owner) in same flow | Document in host API; wrap in transaction |
| Y2 | **`contest_audit_events` SELECT** requires `contest_org_id IS NOT NULL` | Server inserts must always set `contest_org_id`; add CHECK or trigger |
| Y3 | **Judges** are `member` but not `staff` — cannot read `contest_audit_events` | Confirm product intent; add judge read policy if needed |
| Y4 | **No platform admin (Patricia) bypass** — only org-scoped roles | Future: `has_role(admin)` read policies or service-only admin routes |
| Y5 | **Global unique `contests.slug`** — blocks same slug across orgs | OK if URLs are `/contests/[slug]` globally; else drop `contests_slug_key` |
| Y6 | **PII columns** on `contestants` (`email`, `phone`, `legal_name`) visible to org members via `can_read_contest_private` | Ensure UI masks on public routes; never expose via anon policies |
| Y7 | **SECURITY DEFINER helpers** granted to `authenticated` | Acceptable pattern; never grant to `anon`; audit new helpers same way |
| Y8 | **`45905` ships org table with INSERT-only** | Fine across migration chain; dangerous if 45906 fails mid-deploy |

---

## Grey / deferred (documented)

| Item | Note |
|------|------|
| `contestant_assets`, extractions, reviews | Explicitly deferred in `45909` — track as **CTEST-001b** or split task |
| Platform Patricia global admin | Out of scope for org-tenant model; admin UI may use service role |
| Remote deploy proof | Local reset passed; production needs `execute_sql` catalog snapshot |

---

## Best practices observed (mde-supabase)

- 🟢 `(select auth.uid())` in policies (not bare `auth.uid()`)
- 🟢 `security definer` + `set search_path = ''` on helper functions
- 🟢 `REVOKE ALL` / `GRANT EXECUTE` pattern on `app_private` helpers
- 🟢 Separate policies per command (no `FOR ALL`)
- 🟢 `ENABLE ROW LEVEL SECURITY` before policies
- 🟢 Indexes on FK and status columns used in RLS predicates
- 🟢 Append-only audit via triggers + `INSERT` denied to `authenticated`
- 🟢 Transaction-wrapped migrations with header comments
- 🟢 `service_role` granted `ALL`; client roles least-privilege

---

## Per-task corrections (contest pack)

### CTEST-000 — Diagrams / scope gate

| Dot | % | Corrections |
|-----|---:|-------------|
| 🟢 | **100** | No migration work. Keep diagrams as source of truth. |

### CTEST-001 — Supabase core schema + RLS (this audit)

| Dot | % | Corrections |
|-----|---:|-------------|
| 🔴 | **57** | See checklist below. **Do not mark Done.** |

**Required corrections (priority order):**

1. Add migrations for **8 missing tables** with RLS matching [`CTEST-001`](../tasks/CTEST-001-supabase-contest-core-schema.md) §3.
2. Add **storage** migration: `contestant-photos`, `contestant-docs` + policies.
3. Run **`supabase gen types`**; commit `database.types.ts` changes.
4. Add **`tasks/contest/notes/CTEST-001-evidence.md`**: local + remote catalog SQL, anon negative, cross-contestant deny.
5. Add **Vitest or pgTAP** for RLS smoke (minimum: tables exist, RLS on, policy count).
6. Optional hardening: `CHECK (contest_audit_events.contest_org_id IS NOT NULL)` when `contest_id` set.
7. Document **host bootstrap** sequence: create org → insert owner membership → create contest.

### CTEST-002 — Vote ledgers

| Dot | % | Corrections |
|-----|---:|-------------|
| 🔴 | **0** | **Blocked** until CTEST-001 core complete. Do not add `vote_ledger` to current migrations. |

### CTEST-003 — Tickets / paid votes

| Dot | % | Corrections |
|-----|---:|-------------|
| 🔴 | **0** | **Blocked** on CTEST-001 + 002. |

### CTEST-004 — CopilotKit workspace

| Dot | % | Corrections |
|-----|---:|-------------|
| 🔴 | **0** | **Blocked** on schema + types. |

### CTEST-005 — Mastra / Gemini

| Dot | % | Corrections |
|-----|---:|-------------|
| 🔴 | **0** | **Blocked** on CTEST-002 + 004. |

### CTEST-006 — Screens / wireframes

| Dot | % | Corrections |
|-----|---:|-------------|
| 🟡 | **40** | Wireframes can proceed; **routes must not write** to tables until RLS proof exists. |

### CTEST-007 — Playwright proof gates

| Dot | % | Corrections |
|-----|---:|-------------|
| 🔴 | **0** | **Blocked** on schema + 006. |

### CTEST-008–011 — Signup, profile, vote UI, discovery

| Dot | % | Corrections |
|-----|---:|-------------|
| 🔴 | **0–15** | **Blocked** on missing `contestant_profile_extractions`, assets, links tables (008–009). |

### CTEST-012 — Spec / Linear sync

| Dot | % | Corrections |
|-----|---:|-------------|
| 🟡 | **75** | Update SAN-533 description: **partial implementation** (6/14 tables). Record this audit URL. |

---

## Production readiness checklist

| Gate | Status |
|------|--------|
| Migrations apply on clean DB | 🟢 Yes |
| RLS enabled | 🟢 Yes |
| Anon cannot read drafts (spot check) | 🟢 Yes |
| Full CTEST-001 schema | 🔴 No |
| Storage | 🔴 No |
| Automated RLS tests | 🔴 No |
| Types in app | 🔴 No |
| Evidence file | 🔴 No |
| Remote production catalog proof | 🔴 No |
| CTEST-002+ unblocked | 🔴 No |

**Production-ready:** 🔴 **No** — suitable as **incremental PR slice** only (SAN-533 partial), not for fan-facing contest launch.

---

## Suggested improvements (next PR)

1. **Single follow-up migration file** per table group (assets + social, extractions + reviews, events, discovery trio) to stay under commit size limits.
2. **SQL proof script** at `mdeapp/supabase/tests/contest_rls_proof.sql` runnable in CI.
3. **Bootstrap RPC** `create_contest_org_with_owner(name, slug)` — security definer, single transaction (org + membership + audit row).
4. **Patricia read path** — either service-role admin API or `has_role('admin')` SELECT policies on org/contest scoped by assignment table (Phase 2).
5. **Regenerate types** and add thin `src/lib/contest/db.ts` typed helpers (no service role).

---

## References

- Task: [`tasks/contest/tasks/CTEST-001-supabase-contest-core-schema.md`](../tasks/CTEST-001-supabase-contest-core-schema.md)
- Linear: [SAN-533](https://linear.app/sanjiovani/issue/SAN-533/ctest-001-supabase-contest-core-schema-and-rls)
- Skill: [`.agents/skills/mde-supabase/SKILL.md`](../../../.agents/skills/mde-supabase/SKILL.md)
- Prior spec audit: [`2026-06-02-spec-verification.md`](./2026-06-02-spec-verification.md)

---

## Sign-off

| Role | Verdict |
|------|---------|
| Forensic auditor | Merge **7 migrations** as foundation; **reject CTEST-001 Done** until corrections R1–R5 |
| Suggested Linear status | SAN-533 → **In Progress** (not Done) |
