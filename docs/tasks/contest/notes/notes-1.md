# Contest migrations forensic audit

Full report: [`tasks/contest/audit/2026-06-02-contest-migrations-forensic-audit.md`](tasks/contest/audit/2026-06-02-contest-migrations-forensic-audit.md)

## Verdict

| Lens | Dot | Score |
|------|-----|------:|
| **SQL quality** (7 migrations) | 🟡 | **84%** |
| **CTEST-001 spec complete** | 🔴 | **57%** |
| **Production-ready** | 🔴 | **No** |

`supabase db reset` applies all seven migrations cleanly. RLS is on for all six `contest_*` tables; anon cannot read draft contests/contestants (spot check). **CTEST-001 is not Done** — 8 of 14 tables, storage, tests, typegen, and evidence are still missing.

---

## Per-migration grades

| Migration | Dot | % |
|-----------|-----|---:|
| `45904` RLS helpers | 🟢 | 94 |
| `45905` contest_orgs | 🟡 | 78 |
| `45906` memberships + helpers | 🟢 | 90 |
| `45907` contests | 🟢 | 91 |
| `45908` contest_rounds | 🟢 | 88 |
| `45909` contestants | 🟡 | 83 |
| `45910` audit_events | 🟡 | 80 |

**Strengths:** `app_private` helpers with `security definer` + empty `search_path`; `(select auth.uid())`; no `FOR ALL` policies; append-only audit (triggers + `INSERT` denied for `authenticated`); indexes on FK/status columns.

---

## Critical blockers (🔴)

1. **8 tables missing** — `contestant_assets`, `contestant_social_links`, `contestant_profile_extractions`, `contestant_profile_reviews`, `contest_events`, `contestant_discovery_runs`, `contestant_discovery_leads`, `contestant_invite_drafts` (deferred in `45909` comment only).
2. **No storage buckets** — `contestant-photos` / `contestant-docs`.
3. **No tests** — `npm test -- contest` → 0 files.
4. **Types not regenerated** — no `contest_*` in `database.types.ts`.
5. **No `CTEST-001-evidence.md`** — remote catalog + anon negative proofs not recorded.

---

## Yellow flags (🟡)

- Org bootstrap: `INSERT org` → must `INSERT owner membership` before user can `SELECT` org.
- Audit rows with `contest_org_id IS NULL` are invisible to staff (only `service_role`).
- Judges are `member` but not `staff` — no audit read (confirm intent).
- No platform `super_admin` bypass for Patricia (org-scoped only).
- Org members can read draft contestant PII via `can_read_contest_private` (OK for back-office; mask in UI).

---

## Tests run

| Test | Result |
|------|--------|
| `supabase db reset` | 🟢 PASS |
| RLS on all `contest%` tables | 🟢 PASS |
| ≥1 policy per table | 🟢 PASS |
| `SET ROLE anon` on drafts | 🟢 PASS (0 rows) |
| Missing 8 tables | 🔴 FAIL |
| `npm test -- contest` | 🔴 FAIL |
| `npm run typecheck` | 🟢 PASS |
| Storage / typegen | 🔴 FAIL |

---

## CTEST-001 corrections (priority)

1. Ship migrations for the **8 missing tables** + RLS.
2. Add **storage** migration + policies.
3. **`supabase gen types`** + commit.
4. Write **`tasks/contest/notes/CTEST-001-evidence.md`** (catalog SQL, anon deny, cross-tenant).
5. Add **Vitest or SQL** RLS smoke tests.
6. Document host flow: org → owner membership → contest.

**CTEST-002+** remain 🔴 blocked until CTEST-001 is actually complete.

---

## Production readiness

**🔴 Not production-ready** for the contest vertical. Safe to **merge as a partial foundation PR** (SAN-533); keep Linear **In Progress**, not Done.

---

**Legend:** 🟢 90–100% · 🟡 70–89% · ⚪ N/A · 🔴 &lt;70% / blocker