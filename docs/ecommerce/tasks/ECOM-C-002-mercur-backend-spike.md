---
id: ECOM-C-002
title: Mercur Backend Spike
phase: 1
priority: P0
complexity: M
status: Done
linear_issue: SAN-630
linear_url: https://linear.app/sanjiovani/issue/SAN-630
github_repos:
  - https://github.com/mercurjs/mercur
---

# ECOM-C-002

# Title

Mercur Backend Spike — Scaffold, Migrate, Health 200

# Goal

`commerce/mercur` runs locally: dependencies installed, DB migrated, API health 200, admin login works.

# Business Value

De-risks Mercur 2.0 + Medusa stack before Stripe and catalog work. Proves the chosen repo (`mercurjs/mercur` basic template) boots in mdeai infra.

# Scope

**In scope**

- `commerce/mercur/` from Mercur `basic` template (or CLI create)
- `bun install` / lockfile committed
- Postgres DB `mercur` + Redis for dev
- `medusa db:migrate` success
- Admin user created
- `redisUrl` in `medusa-config.ts` if required
- Root `dev` script → `packages/api` only
- `commerce/mercur/BOOT.md` boot reference

**Out of scope**

- Stripe configuration
- Custom seller seed
- 20-product catalog
- Vendor panel deploy
- mdeapp env vars

# Files Likely Touched

| Path | Action |
|---|---|
| `commerce/mercur/` | Scaffold / commit |
| `commerce/mercur/package.json` | `dev` script |
| `commerce/mercur/packages/api/medusa-config.ts` | `redisUrl`, CORS |
| `commerce/mercur/packages/api/.env` | Local secrets (gitignored) |
| `commerce/mercur/BOOT.md` | Create / update |
| `.gitignore` | Ensure `packages/api/.env` ignored |

# Official Documentation

| Topic | URL |
|---|---|
| Mercur installation | https://docs.mercurjs.com/getting-started/installation |
| Mercur CLI create | https://docs.mercurjs.com/developer-guide/cli#create |
| Manual Medusa + Mercur setup | https://docs.mercurjs.com/v1/get-started#manual-installation |
| Medusa local dev | https://docs.medusajs.com/learn/installation |
| Medusa db migrate | https://docs.medusajs.com/resources/medusa-cli/commands/db |
| Mercur dev setup | https://docs.mercurjs.com/v1/development/set-up |

# Dependencies

| Depends on | Blocks |
|---|---|
| ECOM-C-001 (ADR merged) | ECOM-C-003, ECOM-C-005, ECOM-C-006, ECOM-C-004 |

# Acceptance Criteria

- [ ] `cd commerce/mercur && bun install` exits 0
- [ ] `bunx medusa db:migrate` (from `packages/api`) exits 0
- [ ] `curl http://localhost:9000/health` → 200 while dev server running
- [ ] Admin panel loads at configured URL; login with documented credentials
- [ ] `BOOT.md` documents: Postgres, Redis, migrate, dev, admin creds
- [ ] **Not Done** until ECOM-C-006 Store API returns `count >= 1` (cross-gate)
- [ ] No secrets committed to git

# Proof Commands

```bash
cd commerce/mercur
bun install
docker start mercur-dev-redis 2>/dev/null || docker run -d --name mercur-dev-redis -p 6379:6379 redis:7-alpine
cd packages/api && bunx medusa db:migrate
bun run dev &
sleep 15
curl -s -o /dev/null -w 'health=%{http_code}\n' http://localhost:9000/health
git status -- commerce/mercur/packages/api/.env  # must not be staged
```

# Test Plan

1. Fresh clone: follow `BOOT.md` from zero → health 200
2. Admin login → dashboard loads
3. Default seed runs without fatal error (`bun run seed` if template provides it)
4. Verify turbo/yarn issues resolved (API-only dev script)

# Risks

| Risk | Mitigation |
|---|---|
| CLI `create` hangs on npm | Use `templates/basic` copy (documented in BOOT.md) |
| Redis required but missing | Docker redis container; `redisUrl` in config |
| Yarn 4 vs bun conflict | API-only `bun run --cwd packages/api dev` |
| Supabase local Postgres port mismatch | Document `DATABASE_URL` in BOOT.md |

# Rollback Plan

Remove `commerce/mercur/` directory; drop `mercur` database. No mdeapp impact.

# Estimated Complexity

**M** — infra + monorepo quirks; **partially done** in workspace

# Priority

**P0**

# Current state (workspace)

- API runs on `:9000`, health 200
- Migrations OK; admin `admin@mdeai.co` exists
- Store API returns 0 products (fixed in ECOM-C-006)
- Remaining: formalize PR, confirm BOOT.md complete, mark Done
