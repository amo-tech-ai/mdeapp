# PR-16 — Branch protection for `main` (SAN-458)

**Status:** CI workflow authored (`floor.yml`). **GitHub UI step still required** (admin).

**Required status check context (after first `floor.yml` run on a PR):** `Floor / floor`

---

## What ships in repo

| File | Purpose |
|------|---------|
| `mdeapp/.github/workflows/floor.yml` | Runs `npm run floor` on every PR + push to `main` |
| `mdeapp/.github/workflows/ci.yml` | Legacy name kept until branch protection migrated — prefer **Floor / floor** |

`npm run floor` = `lint` → `typecheck` → `build` → `test` → `audit` (high).

---

## Admin: enable branch protection (one-time)

GitHub → **amo-tech-ai/mdeapp** → Settings → Branches → Add rule for `main`:

| Setting | Value |
|---------|--------|
| Require a pull request before merging | ✅ |
| Required approvals | **1** |
| Require status checks to pass | ✅ |
| Require branches to be up to date | ✅ |
| Status checks that are required | **`Floor / floor`** (exact string from first green PR) |
| Do not allow bypassing | ✅ for non-admins |

### CLI (admin token)

After one green PR shows the check name:

```bash
gh api --method PUT repos/amo-tech-ai/mdeapp/branches/main/protection \
  --input - <<'EOF'
{
  "required_status_checks": {
    "strict": true,
    "checks": [{ "context": "Floor / floor" }]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```

Verify:

```bash
gh api repos/amo-tech-ai/mdeapp/branches/main/protection | jq '.required_status_checks,.required_pull_request_reviews'
```

---

## Proof (trial PR)

1. Open a PR with an intentional lint error → merge **blocked**.
2. Fix → `Floor / floor` green → merge allowed (with 1 approval).
3. Record run URL in `tasks/testing/evidence/PR-16-branch-protection.md`.

---

## Related

- Task: [`tasks/PR/tasks/PR-16-floor-merge-gate.md`](../tasks/PR-16-floor-merge-gate.md)
- Blocked until soak: UX-023 (runtime card refactor)
