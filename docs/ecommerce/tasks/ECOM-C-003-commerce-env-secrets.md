---
id: ECOM-C-003
title: Commerce Environment & Secrets
phase: 1
priority: P0
complexity: S
status: Done
linear_issue: SAN-631
linear_url: https://linear.app/sanjiovani/issue/SAN-631
---

# ECOM-C-003

# Title

Commerce Environment & Secrets — Infisical `/commerce` Path

# Goal

All Mercur secrets documented, injectable via Infisical, never committed. mdeapp and Mercur secret namespaces separated.

# Business Value

Safe local + CI + future Vercel/Medusa Cloud deploy without leaking Stripe or DB credentials. Prevents accidental reuse of events Stripe webhook secrets.

# Scope

**In scope**

- `commerce/mercur/packages/api/.env.template` (all required vars, no values)
- Infisical path `/commerce` documented (project `md-eapp-hn-nz`, env `dev`)
- CORS vars for mdeapp `:3000` / `:3001` (future bridge)
- `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `COOKIE_SECRET`
- Stripe placeholders (`STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`) — values in C-004
- `BOOT.md` section: `infisical run --path=/commerce -- ...`
- `docs/ecommerce/docs/env-commerce.md` — commerce vs events Stripe namespace
- `mdeapp/scripts/verify-commerce-env.mjs` — fails if ticket/sponsor webhook names reused
- Gitignore verification

**Out of scope**

- Stripe provider wiring (ECOM-C-004)
- Vercel env sync
- mdeapp `MEDUSA_*` vars (Phase 2 ECOM-C-007)

# Files Likely Touched

| Path | Action |
|---|---|
| `commerce/mercur/packages/api/.env.template` | Create / update |
| `commerce/mercur/BOOT.md` | Infisical section |
| `docs/ecommerce/docs/env-commerce.md` | Create |
| `mdeapp/scripts/verify-commerce-env.mjs` | Create |
| `commerce/mercur/.gitignore` | Verify `.env` |
| `docs/ecommerce/tasks/ECOM-C-003-commerce-env-secrets.md` | Status update |
| Infisical dashboard | `/commerce` secrets (manual) |

# Official Documentation

| Topic | URL |
|---|---|
| Mercur installation env vars | https://docs.mercurjs.com/getting-started/installation#options |
| Medusa Cloud env reference | https://docs.mercurjs.com/how-to-guides/medusa-cloud#setup |
| Medusa environment variables | https://docs.medusajs.com/learn/fundamentals/environment-variables |
| Infisical CLI | https://infisical.com/docs/cli/usage |

# Dependencies

| Depends on | Blocks |
|---|---|
| ECOM-C-002 (Mercur scaffold exists) | ECOM-C-004 |

# Acceptance Criteria

- [ ] `.env.template` lists every var required for `packages/api` boot
- [ ] `.env` and `.env.local` gitignored under `commerce/mercur`
- [ ] `infisical run --silent --env=dev --path=/commerce -- bun run dev` boots API (or documented blocker)
- [ ] CORS includes `http://localhost:3000,http://localhost:3001`
- [ ] No plaintext secrets in git history for this PR
- [ ] Separate namespace documented: `/` = mdeapp, `/commerce` = Mercur
- [ ] Commerce Stripe vars use `COMMERCE_STRIPE_*` or isolated Mercur `STRIPE_*` — not events webhook secrets
- [ ] `verify-commerce-env.mjs` exits 1 on missing required vars

# Proof Commands

```bash
test -f commerce/mercur/packages/api/.env.template
grep -q DATABASE_URL commerce/mercur/packages/api/.env.template
grep -q REDIS_URL commerce/mercur/packages/api/.env.template
git check-ignore -v commerce/mercur/packages/api/.env
git grep -l 'sk_live\|sk_test' -- commerce/ || echo 'no stripe keys in tree OK'
```

# Test Plan

1. Copy `.env.template` → `.env`, fill from Infisical → migrate + health 200
2. `git status` shows no `.env` files staged
3. Second developer can boot using template + Infisical path only

# Risks

| Risk | Mitigation |
|---|---|
| Infisical path not created | Document manual setup step; block C-004 until done |
| Shared Stripe key with events app | Separate test keys + webhook endpoints in template comments |
| JWT_SECRET rotation breaks sessions | Document dev-only rotation procedure |

# Rollback Plan

Revert template + BOOT.md; local `.env` unchanged on disk.

# Estimated Complexity

**S**

# Priority

**P0**

# Current state (workspace)

- Local `.env` exists (gitignored)
- Infisical `/commerce` path not yet formalized in docs
