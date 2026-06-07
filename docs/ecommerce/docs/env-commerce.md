# Commerce environment & secrets (ECOM-C-003)

**Namespace:** Infisical path `/commerce` · project `md-eapp-hn-nz` · env `dev`  
**Local files (gitignored):** `commerce/.env` + `commerce/mercur/packages/api/.env`

## Rule: two Stripe worlds

| Namespace | Path | Used for |
|-----------|------|----------|
| mdeapp events / tickets | Infisical `/` | `STRIPE_*` + Supabase `ticket-payment-webhook` |
| Mercur commerce | Infisical `/commerce` | `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET` → `/hooks/payment/stripe_stripe` |

**Never** copy `STRIPE_SPONSOR_WEBHOOK_SECRET` or ticket webhook `whsec_*` into commerce env.

Live keys belong in `commerce/.env.live` (gitignored), not `commerce/.env`.

## Required variables

### `commerce/.env` (canonical local copy)

| Variable | Required | Notes |
|----------|----------|-------|
| `MEDUSA_PUBLISHABLE_KEY` | Yes | Store API `x-publishable-api-key` |
| `SELLER_ID` | Yes | Demo seller `mdeai` |
| `STRIPE_API_KEY` | Yes | Test `sk_test_*` — Medusa reads this name |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Test `pk_test_*` — storefront Phase 2 |
| `STRIPE_WEBHOOK_SECRET` | Yes | From `stripe listen` or Dashboard endpoint |

### `commerce/mercur/packages/api/.env` (runtime)

Mercur `loadEnv()` reads **this** directory. Keep Stripe vars **in sync** with `commerce/.env`.

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | `postgres://…/mercur` |
| `REDIS_URL` | Yes | `redis://127.0.0.1:6379` |
| `JWT_SECRET` | Yes | Dev-only value |
| `COOKIE_SECRET` | Yes | Dev-only value |
| `STORE_CORS` | Yes | Include `localhost:3000,3001` for Phase 2 bridge |
| `ADMIN_CORS` | Yes | `localhost:9000` |
| `AUTH_CORS` | Yes | Admin + vendor + mdeapp ports |
| `MERCUR_VENDOR_URL` | Yes | `http://localhost:9000/seller` |
| `STRIPE_API_KEY` | Yes | Same as `commerce/.env` |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Same as `commerce/.env` |
| `STRIPE_WEBHOOK_SECRET` | Yes | Same as `commerce/.env` |

Template without values: `commerce/mercur/packages/api/.env.template`

## Infisical usage

```bash
# From commerce/mercur (when /commerce path is populated in Infisical)
infisical run --silent --env=dev --path=/commerce -- bun run dev
```

mdeapp commands stay on path `/`:

```bash
cd mdeapp && infisical run --silent --env=dev --path=/ -- npm run dev
```

## Local webhook

```bash
stripe listen --forward-to localhost:9000/hooks/payment/stripe_stripe
# Paste whsec_... into BOTH commerce/.env and packages/api/.env
```

## Verification

```bash
cd mdeapp
node scripts/verify-commerce-env.mjs
```

Exit 0 = Phase 1 commerce env contract satisfied.

## Git safety

- `.env*` gitignored at `mdeapp/` root (includes `commerce/.env`)
- `commerce/mercur/packages/api/.env` gitignored via package `.gitignore`
- Never commit `sk_*`, `pk_live_*`, or `whsec_*`
