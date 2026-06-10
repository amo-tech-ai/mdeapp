<!--
  mdeai PR template — keep PRs small, single-purpose, and reviewable.
  Lesson banked 2026-06-10: a 64-file PR that mixed UI + backend + docs hid 3 bugs
  and took longer to split than it would have to ship as 4 small PRs.
  One issue · one layer · one small PR.
-->

## What & why
<!-- One or two sentences. Plain English: what does this change do for a real user? -->

Closes SAN-___ · <SPEC-ID> — <full Linear title>

## Layer (pick ONE)
<!-- A PR should live in a single layer. Mixing them is what creates unreviewable PRs. -->
- [ ] **UI** — presentational component(s), mock/fixture data, no DB/agent
- [ ] **Data / DTO** — fetch/query + typed mapping, read-only
- [ ] **Backend / AI** — Mastra tool, core logic, DB write, edge fn (mocked-Supabase unit tests, no UI)
- [ ] **Wire** — connect an existing UI to an existing tool/action + e2e
- [ ] **Docs / chore** — no `src/**` runtime change

## Size budget
<!-- Soft budget. Over it? Either justify here or split the PR. -->
- [ ] ≤ ~400 net lines and ≤ ~15 files **— or** I've justified why below
- [ ] No unrelated files (docs trees, lockfile churn, other features) rode along
- [ ] Branch is **up to date with `main`** (rebased/merged) — not a stale base

<!-- If over budget, justify or note the follow-up split: -->

## Test plan & evidence
- [ ] `npm run floor` green (lint · typecheck · build · test · audit)
- [ ] Tests added/updated for the change (unit for logic, e2e for a user path)
- [ ] Evidence: `docs/tasks/testing/evidence/YYYY-MM-DD/<id>-RESULTS.md` (link below)
<!-- Paste the floor result / test counts / evidence path here. State honestly what was NOT run. -->

## Self-review
- [ ] No secrets / service-role keys added under `src/**` (F13 carve-outs only)
- [ ] New Supabase table → RLS + ≥1 policy · Places call → field mask · `<Map>` → `mapId`
- [ ] Every `SAN-NNN` in this PR is written as `SAN-NNN · SPEC-ID — full title`
