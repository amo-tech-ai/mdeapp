---
task_id: PR-17
title: CI lint for migration-timestamp uniqueness
phase: MEDIUM
priority: P2
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
area: data
skill: mde-supabase
source: docs/02-pr-audit.md (process hardening / #23 collision)
depends_on: []
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
preventive: true
description: Add a CI check that fails when two migrations share a timestamp prefix — would have caught #23's 20260520120000 collision.
---

## Summary

| Field | Value |
|-------|-------|
| Root cause | #23 carried two migrations sharing prefix `20260520120000_` → Supabase keys on the timestamp → **preview CANCELLED** (P0) |
| Fix | A CI lint that fails the build when any timestamp prefix appears twice in `supabase/migrations/` |
| One-liner | `ls supabase/migrations \| sed -E 's/_.*//' \| sort \| uniq -d` must print **nothing** |

## Problem

Duplicate migration timestamps are silent until Supabase replays and one shadows the other — the exact P0 that blocked #23's preview. A trivial CI check makes this a **build-time** failure instead of a deploy-time surprise. It guards every future migration PR, including PR-04 itself.

> **Note (Linear cross-ref):** the *specific* `20260520120000` collision is **already resolved** in **SAN-446 (DATA-048)** — 11 prefix renames + a tangled-file split. So PR-17 is **purely preventive** (stop the *next* collision), not a fix for the current one. No Linear issue tracks this CI guard — it's net-new.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| Script | `scripts/check-migration-timestamps.mjs` (or inline in CI) | Add — exit 1 if `sed -E 's/_.*//' \| sort \| uniq -d` over `supabase/migrations/` is non-empty; print the colliding prefixes |
| CI | `.github/workflows/floor.yml` (or migrations workflow) | Wire — run the check on any PR touching `supabase/migrations/**` |
| Optional | `.claude/hooks/` | Consider a local pre-commit mirror so it fails before CI too |

## Skill to use

- **`mde-supabase`** — migration filename convention (`<timestamp>_<name>.sql`); confirm the prefix extraction matches Supabase's version-key derivation exactly (so the lint and the replayer agree on what "collision" means).

## Gates / Acceptance

- [ ] Check fails (exit 1) on a deliberately duplicated timestamp and **names the colliding prefix**.
- [ ] Check passes on the current collision-free DATA-branch migration set (so PR-04 isn't blocked by a false positive).
- [ ] Wired into CI for any PR touching `supabase/migrations/**`.
- [ ] Ignores `supabase/migrations/_archive-not-on-remote/**` (archive isn't the live timeline).
- [ ] `/verify-floor` green.

## Testing & proof

### Persona / journey

**Sofía** — duplicate migration prefix fails at CI time (would have caught #23 `20260520120000` collision).

### Pre-ship

```bash
cd mdeapp
node scripts/check-migration-timestamps.mjs    # exit 0 on main
# Negative test: duplicate prefix in temp file → exit 1
npm run floor
```

### Implementation proof (Done · shipped in **#40**)

| Check | Evidence | Result |
|-------|----------|--------|
| Script exists | `mdeapp/scripts/check-migration-timestamps.mjs` | ✅ |
| Main migration set | `ls supabase/migrations \| sed -E 's/_.*//' \| sort \| uniq -d` empty | ✅ |
| CI wired | floor/CI runs on PRs touching migrations | ✅ in #40 train |

**Evidence:** PR #40 diff · shadow replay 79/79

## Risks / Notes

- Pairs with **PR-04** — ideally land this *before or with* C1 so the migration PR proves itself against the new gate.
- Keep the prefix rule in lockstep with Supabase's actual version key; if Supabase changes derivation, update the lint.
- Persona: **Sofía** (dev) — a collision becomes a red CI check in seconds, not a CANCELLED preview hours later. This is the guard for the exact #23 failure mode.
