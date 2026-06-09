---
task_id: PR-04
title: C1 — migrations PR from DATA branch (collision-free)
phase: HIGH
priority: P1
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
main_branch: data/c1-supabase-migrations
main_commit: b26d74c
area: data
skill: mde-supabase
source: docs/03-notes.md (#23 supersession — C1)
depends_on: [PR-08]
data_spec: ../tasks-data/DATA-048-migration-version-prefix-realign.md
linear_issue: SAN-446
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
do_not_duplicate: DATA-048 spec is the same work — update SAN-446 on merge
description: Land the realigned, collision-free migration history into git as one ordered PR.
---

## Summary

| Field | Value |
|-------|-------|
| Source | `data/DATA-048-migration-realign` (**local only**) → `supabase/migrations/` paths **only** |
| Why not #23 | #23's migration set contains the `20260520120000` **collision** (P0 preview blocker); the DATA branch already fixed it (`20260526014446` / `20260526035150`) and adds `data049_advisor_remediation` |
| Hard constraint | Migrations are **one ordered sequence** — never split across independently-merging PRs |
| First-ever | `supabase/` is currently **untracked on `main`** — this is the first time the schema history enters git |
| Linear | **SAN-446 (DATA-048, In Progress)** is this exact work — body: *"All 76 migration files … currently **untracked** on the branch; must be committed."* PR-04 **is the commit step SAN-446 is waiting on**, not net-new. The `20260520120000` collision is **already fixed** there (11 prefix renames + tangled-file split, byte-identical SQL). |

## Problem

The realigned migration history exists only on an unpushed local branch that is *also* mixed with 32 unrelated UX files. Extract **only** the migration files onto a fresh branch off latest `main`, leaving the UX files behind.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| Branch | `data/c1-supabase-migrations` (fresh off `main`) | Create |
| Migrations | `supabase/migrations/**` (from DATA branch, ~76 files, collision-free) | Create (track) |
| Migrations | `supabase/migrations/_archive-not-on-remote/**` | Keep archived — **not** live timeline |
| Types | `src/integrations/supabase/types.ts` (if regenerated) | Modify if drift |

Extract command (no merge, no push yet):
`git checkout main -b data/c1-supabase-migrations && git checkout data/DATA-048-migration-realign -- supabase/migrations/`

## Skill to use

- **`mde-supabase`** — RLS + ≥1 policy on every new table; `(select auth.uid())` subquery pattern; service-role only in edge functions.
- Reference: `mde-task-lifecycle/references/migration-safety.md` — pre-flight, apply-order, shadow-replay.

## Gates / Acceptance

- [ ] **Shadow-replay green** on a disposable Supabase branch (`create_branch` → replay → drop). **No `db push` to prod.**
- [ ] Timestamp-uniqueness check passes (no duplicate prefixes) — `ls supabase/migrations | sed -E 's/_.*//' | sort | uniq -d` is empty.
- [ ] Every new table has RLS enabled + ≥1 policy (security-reviewer / `get_advisors` clean).
- [ ] `restore_post_mvp_*` scope resolved by **PR-08** before this PR opens.
- [ ] `/verify-floor` green; PR is migrations-only (no `src/` UX files leaked in).

## Testing & proof

### Persona / journey

**Camila** rental search · **Roberto** events · **Patricia** ops — all depend on schema/RLS existing in prod without replay collision.

### Pre-ship (never `db push` to prod without human gate)

```bash
cd mdeapp
node scripts/check-migration-timestamps.mjs          # exit 0, no duplicate prefixes
supabase db reset --linked                           # shadow replay on branch only
supabase db diff --from migrations --to linked --use-migra   # exit 0 post-repair
npm run floor
```

### Implementation proof (Done · PR **#40** @ `a50bdc0`)

| Check | Evidence | Result |
|-------|----------|--------|
| Merged | [#40](https://github.com/amo-tech-ai/mdeapp/pull/40) | ✅ |
| Shadow replay | 79/79 migrations, 0 SQLSTATE errors | ✅ post B1–B4 |
| Prod history repair | B1–B3 `migration repair --status applied` (no B4 alias repair) | ✅ |
| Timestamp lint | `scripts/check-migration-timestamps.mjs` in #40 | ✅ |
| DATA readiness | 97% (3% = intentional B4 version alias on prod) | documented |

**Evidence:** `tasks/PR/NOTES/notes-5.md` · `tasks/data/evidence/DATA-050-base-table-backfill.md`

## Risks / Notes

- **Tracked as SAN-446 (DATA-048).** Update that Linear issue when this lands — it's *In Progress*, blocked only on committing the 76 files. Do not open a duplicate issue.
- **Backup:** the realigned migrations live only locally — cutting + **pushing** this branch is also the backup. Do it early even before opening the PR.
- Do **not** include the 32 UX files from the DATA branch (they belong to already-merged UX PRs).
- Blocks PR-05/06/07/09. Human-gate the eventual merge.
