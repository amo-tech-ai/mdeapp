---
title: "PR #105 (SAN-683 partner schema) — forensic audit"
auditor: Claude Opus 4.8 + Supabase MCP (local apply) + official Supabase docs
pr: https://github.com/amo-tech-ai/mdeapp/pull/105
linear: SAN-683
project: zkwcbyxiwklihegjhuql (medellin, free plan)
updated: 2026-06-06
verified_by: local supabase apply (14/14) + §A/§B gate + mde-supabase rules + supabase.com/docs RLS
verdict: "Correct, rule-compliant, test-proven on local. Mergeable after types regen + (optional) FOR ALL cleanup."
overall_score: 90
production_ready: "after gate 7/8 on the applied target"
supersedes_concern: "external 82/100 'no applied test' — now satisfied (local apply + RLS pen-test green)"
---

# PR #105 — Partner schema (ptr001–ptr014) forensic audit

> **Verdict: 🟢 90/100 — ship after 2 small steps.** The SQL is correct, rule-compliant, follows official Supabase RLS performance guidance, and **applied cleanly on a local stack (14/14) with the §A structural + §B RLS pen-test gates green**. The external reviewer's only 🔴 ("not applied/tested") is now satisfied. Remaining: regenerate `database.types.ts` and run `get_advisors` on the applied target; optionally drop the redundant `*_service_role FOR ALL` policies.

**Scope audited:** 14 migrations (ptr001–ptr014) — note the PR adds **ptr014** (storage RLS tighten, driven by 06e) beyond the "ptr001–013" in the title — + `partners.seed.sql`. Verified against `mde-supabase` rules (`supabase-migrations`, `-rls-policies`, `-database-functions`, `-sql-style`, `-declarative-schema`) and `supabase.com/docs` RLS Performance guide.

---

## Evidence (this is the missing test the external audit flagged)

Branching is **blocked — the org is on the free plan** (Pro required), so the branch path was substituted with the **local Supabase stack** (equivalent isolation, zero prod risk).

| Gate | Method | Result |
|---|---|---|
| 1 Apply clean, in order | `psql -f` ptr001→ptr014 on local (real baseline: leads/bookings/profiles/sponsor) | ✅ **14/14, 0 errors** |
| 2 Schema shape (§A) | information_schema / pg_* asserts | ✅ 8 new tables · leads +3 · bookings +5 · 2 enums · RLS on 8 · 2 helpers |
| 3 RLS scoped (§B) | `set role anon` + policy shape | ✅ anon reads **0** · helper returns 0 no-auth (DEFINER ok) · **SELECT=USING-only, INSERT=WITH CHECK-only** |
| 5 Idempotent (§D) | re-apply ptr003/ptr010 | ✅ no error |
| RLS perf (official docs) | code review vs supabase.com RLS guide | ✅ all RLS columns indexed · `(select auth.uid())` initplan wrap · `security definer` helper bypasses join-RLS |
| 4 FK cascade/restrict | DDL inspection (not runtime) | 🟡 declared correct; add runtime test in CI |
| 7 Advisors | MCP remote-only | 🔴 **not run** — migrations not on a remote project yet |
| 8 Types generate | — | 🔴 **not done** — `database.types.ts` not in PR |

---

## Per-table report

Legend: 🟢 correct · 🟡 minor · 🔴 fix. **RLS** lists policy roles. **Idx** = FK/RLS-column indexes present.

| # | Table | Purpose | RLS (policies) | Idx | FK on-delete | Grade | Notes |
|--:|---|---|---|:--:|---|:--:|---|
| 1 | `partner_organizations` | multi-location parent org | member SELECT/UPDATE + admin + service | ✅ display_name | — | 🟢 95 | namespaced to dodge `sponsor.organizations` clash ✓ |
| 2 | `partners` | one row / profile+vertical | owner SELECT, member SELECT/UPDATE, admin CRUD, service | ✅ profile+type uniq, status, 3 bridge FKs | org→SET NULL; profile→RESTRICT | 🟢 94 | bridges `sponsor.organizations` + `landlord_profiles` (no copy) ✓; `completion_score` 0–100 check ✓ |
| 3 | `partner_members` | team access (owner/staff/billing) | team SELECT, owner UPDATE/DELETE, service | ✅ **profile_id idx** (RLS-helper perf) | partner→CASCADE, profile→CASCADE | 🟢 92 | PK(partner_id,profile_id); role check ✓ |
| 4 | `partner_drafts` | wizard autosave (step 1–10) | owner SELECT/INSERT/UPDATE, service | ✅ profile, partner, **active-uniq partial** | partner→CASCADE, profile→CASCADE | 🟢 90 | `payload jsonb` = wizard source of truth; step check 1–10 ✓ |
| 5 | `partner_services` | per-partner feature flags | member SELECT, owner mutate, service | ✅ partner_id, uniq(partner,service_key) | partner→CASCADE | 🟢 90 | `service_key` is free text (no enum) — see Improvements |
| 6 | `partner_locations` | map pins | member SELECT, owner mutate, service | ✅ partner_id, primary | partner→CASCADE | 🟢 90 | lat/lng double; `google_place_id` for grounding ✓ |
| 7 | `partner_assets` (+ `partner-assets` bucket) | uploaded files | table member RLS + **storage.objects folder-scoped** (ptr014) | ✅ partner_id, kind | partner→CASCADE | 🟡 86 | ptr009 shipped bucket-wide write; **ptr014 tightens to folder-scoped** — correct only if both applied (see Red flags) |
| 8 | `revenue_ledger` | immutable GMV attribution | member SELECT, admin update/delete, service insert | ✅ partner+created, source | partner→**RESTRICT** | 🟢 93 | `idempotency_key` unique ✓; source_kind check ✓; immutability not trigger-enforced (admin can edit) |
| 9 | `public.leads` *(extended)* | +partner attribution | + partner-member SELECT/UPDATE (additive, PERMISSIVE) | ✅ (partner,status), (listing) | partner→SET NULL | 🟡 88 | **UPDATE policy lets a partner edit any column of their lead** (assigned_agent_id, score) — least-privilege gap |
| 10 | `public.bookings` *(extended)* | +partner HITL approval | + partner-member SELECT/UPDATE | ✅ (partner,partner_status) | partner→SET NULL, approved_by→SET NULL | 🟢 89 | `partner_status` check pending/approved/declined ✓ |

**Functions / enums:** `partner_ids_for_user()` + `partner_organization_ids_for_user()` — `language sql · stable · security definer · set search_path=''` · fully-qualified · `grant execute` to authenticated/service 🟢 (matches database-functions rule + official "bypass join-RLS" guidance). Enums `partner_type` (8) · `partner_status` (5) 🟢.

---

## Errors / red flags / failure points

| # | Sev | Finding | Impact |
|--:|:--:|---|---|
| R1 | 🟡 | **`*_service_role` policies are `FOR ALL`** on every table + storage | Violates `supabase-rls-policies` ("no FOR ALL") **and are redundant** — `service_role` has `BYPASSRLS`, so these policies + the `*_insert_service` ones are **no-ops**. Noise, not a vuln. |
| R2 | 🟡 | **leads/bookings partner UPDATE breadth** | Policy checks only `partner_id` ownership → a partner can rewrite CRM-internal columns (`assigned_agent_id`, `score`, `status`). Least-privilege gap once partners self-serve. |
| R3 | 🟡 | **Seed mutates a real lead** | `partners.seed.sql` `UPDATE public.leads … where intent='rental' limit 1` — dev-only banner exists, but if run on prod it attaches a real lead to seed data. Footgun. |
| R4 | 🟡 | **ptr009→ptr014 partial-apply window** | ptr009 grants bucket-wide write to any authenticated; ptr014 tightens to folder-scoped. A partial apply (ptr009 without ptr014) leaves the bucket open. Squash or guard. |
| R5 | 🔴 | **No `database.types.ts` regen** | Client/server TS will lack partner types → SAN-665/690 build blind. Gate 8 unmet. |
| R6 | 🟡 | **No CI schema test** | 06c proposed a Vitest §A/§B test; not in PR → gate not enforced per-PR, only this one-time run. |
| R7 | 🟡 | **Advisors not run** | `get_advisors` is remote-only; can't run until applied. Must run immediately post-apply (catches missing-RLS/perf). |
| R8 | ⚪ | **CodeRabbit skipped** (rate limit) | This manual audit substitutes; re-run before merge if possible. |
| R9 | ⚪ | **revenue_ledger immutability** not enforced | Admin/service can UPDATE/DELETE; "immutable" is convention only. Add a no-update trigger if hard immutability is required. |

**No 🔴 correctness/security defects in the SQL itself.** R5 is the only 🔴 and it's a missing artifact, not a bug.

---

## Blockers before merge

1. **Regenerate types** (R5): `supabase gen types typescript --linked > src/types/database.types.ts` (after apply) — commit to the PR.
2. **Apply + advisors** (R7): apply to the target, then `get_advisors security` + `performance` must show no new ERROR.

## Critical fixes (recommended, not strictly blocking)
- **R1:** delete all `*_service_role` / `*_insert_service` policies (service_role bypasses RLS) — removes the FOR ALL rule violation and ~10 dead policies. *Or* keep + document as intentional. One-line-each diff.
- **R4:** fold ptr014 into ptr009 (or keep ordered but never apply ptr009 alone).
- **R3:** harden the seed — guard the leads UPDATE behind `where current_setting('app.seed_env','t') = 'local'` or drop it.

## What's missing
- `database.types.ts` (R5) · CI Vitest schema test (R6) · runtime FK cascade/restrict test (gate 4) · `partner_automations`/`campaigns` tables (intentionally deferred to M4 — documented) · `partner_conversations` (deferred to SAN-689 — documented) · a `down`/rollback migration (repo has `rollbacks/` but none for ptr*).

## Improvements
- **R2:** restrict partner lead/booking UPDATE to safe columns (column grants or a `BEFORE UPDATE` trigger that rejects changes to `assigned_agent_id`/`score`).
- Consider an enum or reference table for `partner_services.service_key` (currently free text → typos like `ai_listing` vs `ai_event_booking` won't be caught).
- Add `rollbacks/2026..._ptr_rollback.sql` for symmetry with repo convention.
- Wire the 06c Vitest gate into `floor` so the schema is re-verified every PR.

---

## mde-supabase rule compliance

| Rule | Verdict |
|---|---|
| `supabase-migrations` | 🟢 lowercase, header comments, RLS on every new table, granular policies |
| `supabase-rls-policies` | 🟡 granular + USING/WITH CHECK correct + `auth.uid()` ✓; **but `FOR ALL` on service_role policies (R1)** |
| `supabase-database-functions` | 🟢 `security definer` justified + `set search_path=''` + fully-qualified |
| `supabase-sql-style` | 🟡 snake_case/plural ✓; uuid PKs instead of `identity` — **deliberate repo-consistency** (leads/bookings/etc. all uuid) |
| `supabase-declarative-schema` | 🟡 hand-written migrations, no `supabase/schemas/` — **matches actual repo practice**; RLS/comments are documented "known caveats" that belong in versioned migrations anyway |

## Official Supabase docs alignment (RLS Performance guide)
🟢 **All three core recommendations met:** (1) indexes on every RLS-filtered column (`partner_members.profile_id`, `leads/bookings.partner_id`, all FK `partner_id`); (2) `(select auth.uid())` / `(select partner_ids_for_user())` subquery wrapping → initplan caches once per query; (3) `security definer` helper bypasses `partner_members` RLS, preventing recursion + per-row join cost.

---

## Score

| Area | Grade | % |
|---|:--:|--:|
| Architecture (one platform, configure by type) | A | 95 |
| Reuse existing DB (extend leads/bookings, bridge sponsor/landlord) | A | 95 |
| RLS design + performance | A- | 90 |
| Migration safety (additive, idempotent, ordered) | A- | 90 |
| **Test evidence** (was C/65 → now applied + pen-tested) | A- | 90 |
| Rule compliance | B+ | 87 |
| Production readiness (pending types + advisors) | B+ | 86 |
| **Overall** | **A-** | **90** |

**Δ vs external audit (82):** +8 — the external 🔴 "Supabase applied test missing" is now green (local apply + RLS pen-test), and FK-column indexing / RLS-perf were verified against official docs. Remaining gap to 100 = types regen + advisors on the applied target + the R1–R4 polish.

## Recommendation
**Merge after:** (1) apply to target, (2) `get_advisors` clean, (3) commit regenerated `database.types.ts`. **Optional but cheap:** drop the redundant `*_service_role` FOR ALL policies (R1) and squash ptr014→ptr009 (R4). Then SAN-683 unblocks SAN-665 · 690 · 684 · 686 · 687 · 688 · 689.
