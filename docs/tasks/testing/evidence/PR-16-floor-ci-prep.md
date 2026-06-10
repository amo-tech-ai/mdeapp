# PR-16 — Floor CI workflow (prep)

**Date:** 2026-06-02  
**Branch:** `main` (pending merge of `floor.yml`)  
**Task:** SAN-458 / PR-16

## Implemented in repo

| File | Change |
|------|--------|
| `mdeapp/.github/workflows/floor.yml` | `npm run floor` on PR + push to `main` |
| `mdeapp/.github/workflows/ci.yml` | Disabled (workflow_dispatch only); superseded by Floor |
| `tasks/PR/docs/16-branch-protection.md` | Admin checklist + `gh api` snippet |

## Local proof

```bash
cd mdeapp && npm run floor
```

**Result:** exit 0 (lint · typecheck · build · test · audit).

## Required check name (after first PR run)

**`Floor / floor`**

## Still manual (admin)

- [ ] GitHub → `main` branch protection with `Floor / floor` + 1 review
- [ ] Trial PR with intentional lint fail → merge blocked
- [ ] Record trial in `PR-16-branch-protection.md` (this folder)

## Soak (parallel)

**SAN-462:** 1/3 scheduled — [run 26820069434](https://github.com/amo-tech-ai/mdeapp/actions/runs/26820069434) ✅ 2026-06-02.
