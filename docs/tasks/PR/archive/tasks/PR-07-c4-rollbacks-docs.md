---
task_id: PR-07
title: C4 — rollbacks + README PR from #23
phase: LOW
priority: P3
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
area: data
skill: mde-supabase
source: docs/03-notes.md (#23 supersession — C4)
depends_on: [PR-04]
github_pr: 23
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
description: Extract the rollback SQL + supabase README from #23 into a small docs/safety PR.
---

## Summary

| Field | Value |
|-------|-------|
| Source | PR #23 — `supabase/rollbacks/**` + `supabase/README.md` |
| Content | `vec001_rollback.sql`, `data039_rollback.sql`, `supabase/README.md` |
| Risk | Lowest — non-executed SQL (manual rollback aids) + docs only |

## Problem

The rollback scripts and the `supabase/` README exist **only in #23**. They are operational safety nets (how to undo `vec001` / `data039`) and the entry-point doc for the schema directory. They never execute as part of the migration timeline, so they carry no ordering risk — but they must still land in git, not be lost when #23 closes.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| Branch | `data/c4-rollbacks-docs` (fresh off `main`, after C1) | Create |
| Rollbacks | `supabase/rollbacks/vec001_rollback.sql`, `supabase/rollbacks/data039_rollback.sql` | Create (track) |
| Docs | `supabase/README.md` | Create (track) |

## Skill to use

- **`mde-supabase`** — confirm the rollbacks match the forward migrations they undo (table/column names still exist post-C1); confirm README references resolve to files that actually landed in C1.

## Gates / Acceptance

- [ ] Rollback SQL parses (psql `--dry-run` or `EXPLAIN`-only; **never executed** against prod).
- [ ] Each rollback references objects that exist after **PR-04** applied (no dangling table names).
- [ ] `supabase/README.md` links/paths resolve against the post-C1 tree.
- [ ] `/verify-floor` green.

## Testing & proof

### Persona / journey

**Sofía** (dev rollback path) · **Patricia** (ops README) — documentation-only; no runtime user journey.

### Pre-ship

```bash
cd mdeapp
test -f supabase/README.md && test -f supabase/rollbacks/vec001_rollback.sql
# Parse-only — never execute against prod
head -20 supabase/rollbacks/*.sql
npm run floor
```

### Implementation proof (Done · PR **#44** @ `6424be2`)

| Check | Evidence | Result |
|-------|----------|--------|
| Merged | [#44](https://github.com/amo-tech-ai/mdeapp/pull/44) | ✅ |
| README + rollbacks tracked | `supabase/README.md`, `supabase/rollbacks/` on `main` | ✅ |
| No auto-apply in CI | rollbacks not wired to migration replay | ✅ by design |

**Evidence:** `tasks/PR/INDEX.md` Wave 2 table

## Risks / Notes

- Depends on **PR-04** (rollbacks must describe migrations that actually landed). Ship last in the C-chain, before PR-09.
- These are documentation/safety artifacts — **do not** wire them into CI or auto-apply them. Persona: **Sofía** (dev) needs a documented undo path; **Patricia** (ops) needs the README to navigate the schema.
