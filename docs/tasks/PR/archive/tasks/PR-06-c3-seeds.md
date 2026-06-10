---
task_id: PR-06
title: C3 — seeds PR from #23
phase: MEDIUM
priority: P2
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
area: data
skill: mde-supabase
source: docs/03-notes.md (#23 supersession — C3)
depends_on: [PR-04]
github_pr: 23
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
description: Extract the venue seed data + 2 seed scripts from #23 into their own low-risk PR.
---

## Summary

| Field | Value |
|-------|-------|
| Source | PR #23 — `supabase/seeds/**` (6 files) + `scripts/seed-cafe-anchors.mjs`, `scripts/seed-nightclub-anchors.mjs` |
| Content | `cafes-medellin.{seed,curated}.json`, `golden-queries-venues.json`, `nightclubs-medellin.{csv,curated.json}`, `seeds/README.md` |
| Risk | Low — data only, no schema change |

## Problem

Seed data + seeders only exist in #23. They power grounded venue search (golden queries). Extract to a clean, reviewable PR separate from migrations and functions.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| Branch | `data/c3-seeds` (fresh off `main`, after C1) | Create |
| Seeds | `supabase/seeds/venues/*.json`, `*.csv`, `supabase/seeds/README.md` | Create (track) |
| Scripts | `scripts/seed-cafe-anchors.mjs`, `scripts/seed-nightclub-anchors.mjs` | Create (track) |

## Skill to use

- **`mde-supabase`** — seed conventions; confirm seeders use the anon/service client correctly and don't embed secrets.

## Gates / Acceptance

- [ ] Seed JSON/CSV validate (parse clean); golden-queries-venues set matches the search smoke expectations.
- [ ] Seeders are idempotent (re-running doesn't duplicate rows) or clearly one-shot.
- [ ] No secrets in scripts (env var **names** only).
- [ ] `/verify-floor` green.

## Testing & proof

### Persona / journey

**Tourist** — café/nightclub grounded search in `/chat` depends on venue seed data + golden queries.

### Pre-ship

```bash
cd mdeapp
node -e "JSON.parse(require('fs').readFileSync('supabase/seeds/venues/golden-queries-venues.json'))"
node scripts/seed-cafe-anchors.mjs --dry-run   # if supported; else idempotency check on branch
PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 npm run test:e2e:prod-synthetic
# Q4 cafés: cafeGroundedCards > 0 in report.json
npm run floor
```

### Implementation proof (Done · PR **#43** @ `01616d1`)

| Check | Evidence | Result |
|-------|----------|--------|
| Merged | [#43](https://github.com/amo-tech-ai/mdeapp/pull/43) | ✅ |
| Prod café grounding | `mdeapp/tmp/prod-synthetic-smoke-qa/report.json` → `cafeGroundedCards: 5` | ✅ 2026-06-01 |
| Visual proof | `tasks/testing/evidence/visual-cards/02-cafes.png` | ✅ |

**Evidence:** prod synthetic Q4 · visual-cards e2e

## Risks / Notes

- Depends on **PR-04** (seed targets must exist). Persona: **Tourist** — cafe/nightclub seeds back the concierge grounded results.
