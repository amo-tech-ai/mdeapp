---
task_id: PR-18
title: SHA-pin all GitHub Actions repo-wide
phase: MEDIUM
priority: P2
status: Not Started
area: process
skill: mde-vercel
source: docs/02-pr-audit.md (#37 supply-chain)
depends_on: []
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
description: Replace floating-tag GitHub Action refs (@v4) with commit-SHA pins across all workflows for supply-chain safety.
---

## Summary

| Field | Value |
|-------|-------|
| Finding | #37's workflow uses `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4` by **floating tag** |
| Risk | A floating tag can be re-pointed by an attacker who compromises the action repo → arbitrary code in CI with repo secrets |
| Fix | Pin every `uses:` to a full **commit SHA** (`@<40-char-sha>  # v4.x.y`), repo-wide |

## Problem

Floating major-version tags (`@v4`) are mutable — supply-chain best practice is to pin third-party Actions to an immutable commit SHA, with the human-readable version in a trailing comment. The audit flagged #37 specifically, but the fix is repo-wide: every workflow's `uses:` should be SHA-pinned.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| Audit | `.github/workflows/**/*.yml` | Enumerate every `uses: <action>@<tag>` |
| Pin | each `uses:` | Replace tag with the resolved commit SHA for that release; append `# <tag>` comment for readability |
| Optional | a pin-checker (e.g. a lint step or `pinact`/`dependabot` config) | Add — keep pins current and block new floating-tag refs |

## Skill to use

- **`mde-vercel`** — the GitHub Actions/CI surface; resolving a tag → its release commit SHA; keeping Dependabot/pin-updates flowing so pins don't rot.

## Gates / Acceptance

- [ ] Every `uses:` in `.github/workflows/**` references a 40-char commit SHA (no `@v4` / `@main` floating refs).
- [ ] Each pin carries a trailing `# vX.Y.Z` comment mapping SHA → human version.
- [ ] SHAs resolve to the intended release (spot-check 2–3 against the upstream release tag).
- [ ] CI still green after pinning (pins point at working releases, not arbitrary commits).
- [ ] (Optional) a guard prevents re-introducing floating tags (Dependabot or a lint).

## Testing & proof

### Persona / journey

**Sofía** supply-chain — CI secrets protected from mutable `@v4` action tags.

### Pre-ship

```bash
cd mdeapp
rg 'uses:.*@[^0-9a-f]{7,}' .github/workflows/   # floating tags — should be empty after pin
rg 'uses:.*@[0-9a-f]{40}' .github/workflows/ | wc -l
# After pin: all workflows green
gh run list --workflow=ci.yml --limit 3
npm run floor
```

**Pass criteria:** every `uses:` is 40-char SHA + `# vX.Y.Z` comment; CI green post-pin; optional lint blocks new floating refs.

**Evidence artifact:** `tasks/testing/evidence/PR-18-sha-pinned-actions.md` — before/after `rg` output + CI run URL.

## Risks / Notes

- Pin to SHAs from **trusted release tags** — don't pin to a random commit; resolve the SHA *from* the official `vX.Y.Z` tag.
- Keep Dependabot (or equivalent) enabled so pinned SHAs still receive security bumps — pinning without updates is stale, not safe.
- Persona: **Sofía** (dev) / supply-chain — CI runs with repo secrets; an unpinned action is a credential-exfil vector. Low-effort, real hardening.
