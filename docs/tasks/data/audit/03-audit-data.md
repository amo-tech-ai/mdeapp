---
title: DATA audit checklist (mde-supabase compare)
date: 2026-05-30
used_by: 03-data-implemented-tasks-audit.md
---

# DATA pack — Supabase forensic checklist

Run this checklist before marking any DATA task **Done**. Full results: [`03-data-implemented-tasks-audit.md`](03-data-implemented-tasks-audit.md).

## A. Task spec

- [ ] Spec `status` matches evidence file path
- [ ] `depends_on` satisfied on live Supabase
- [ ] `unblocks` updated in INDEX-data.md
- [ ] No stale cross-track notes in INDEX

## B. Evidence (anti-fake-done)

- [ ] Evidence file exists under `tasks/data/evidence/` or declared alt path
- [ ] Evidence includes date, project id, method (MCP / curl / test)
- [ ] For DDL: migration version named in evidence
- [ ] For edge: version number + `verify_jwt` recorded
- [ ] Golden SQL: pass/fail counts + query date

## C. Live Supabase (MCP)

- [ ] `execute_sql` proves rows/columns/functions claimed
- [ ] `list_migrations` version matches repo filename
- [ ] `get_advisors` security run after migration tasks
- [ ] RLS enabled on new tables (`pg_policies` spot-check)
- [ ] No anon INSERT on sensitive tables unless spec requires

## D. Repo migrations

- [ ] File in `supabase/migrations/` (not evidence-only)
- [ ] Version timestamp = remote applied version
- [ ] Semantic name suffix = remote name
- [ ] No duplicate semantic names in migrations folder

## E. App / edge wiring

- [ ] Edge fn in `supabase/functions/` if mdeai-owned
- [ ] Service role only inside edge / F13 carve-out paths
- [ ] API route smoke if task touches `mdeapp/src/app/api/**`

## F. mde-supabase universal rules

- [ ] Service-role never in browser or unauthorized `src/`
- [ ] `(SELECT auth.uid())` in new RLS policies
- [ ] SECURITY DEFINER functions: `SET search_path = ''` or pg_catalog-only
- [ ] Places API calls include field mask (seed scripts)
- [ ] Sponsor tables use `.schema('sponsor')` if applicable

## G. Score gate

| Result | Criteria |
|--------|----------|
| 🟢 Done ≥90% | A–F pass; live = repo = evidence |
| 🟡 Partial 50–89% | Live OK; drift or missing evidence |
| 🔴 Wrong <50% | Spec Done but live missing or unsafe |

**2026-05-30 audit:** 11 🟢 · 10 🟡 · 0 🔴 fake · grade **74/100**.
