# Mercur local boot — mdeai commerce spike

Verified **2026-06-07** on localhost.

## Services

| Service | URL | Notes |
|---|---|---|
| Medusa + Mercur API | http://localhost:9000/health | `bun run dev` from repo root |
| Admin dashboard | http://localhost:9000/dashboard | **not** `:7000` in this scaffold |
| Vendor portal | http://localhost:9000/seller | **not** `:7001` in this scaffold |
| Store API | http://localhost:9000/store/* | requires `x-publishable-api-key` |

## Environment (ECOM-C-003)

| File | Purpose |
|------|---------|
| `commerce/.env` | Canonical Stripe + publishable key + seller id |
| `packages/api/.env` | Runtime — **must match** commerce Stripe vars |

```bash
cd /home/sk/mdeai/mdeapp && node scripts/verify-commerce-env.mjs
```

Infisical path `/commerce` (project `md-eapp-hn-nz`, env `dev`):

```bash
infisical run --silent --env=dev --path=/commerce -- bun run dev
```

Docs: `docs/ecommerce/docs/env-commerce.md` · ADR: `docs/ecommerce/adr/001-standalone-mercur.md`

## Prerequisites

- **Postgres:** local Supabase stack `127.0.0.1:54322`, database `mercur`
- **Redis:** Docker container `mercur-dev-redis` on `127.0.0.1:6379`
- **Bun:** `~/.bun/bin/bun`

## Boot commands

```bash
cd /home/sk/mdeai/mdeapp/commerce/mercur

# deps (once)
bun install

# env (once)
cp packages/api/.env.template packages/api/.env
# DATABASE_URL=postgres://postgres:postgres@127.0.0.1:54322/mercur
# REDIS_URL=redis://127.0.0.1:6379

# db + base Medusa seed (once)
cd packages/api
bunx medusa db:migrate
bunx medusa user -e admin@mdeai.co -p 'MercurDev2026!' -i admin
bun run seed

# demo seller + 20 mdeai SKUs (idempotent)
cd ../..
bun run seed:mdeai-catalog

# API (from repo root)
bun run dev
```

> Root `bun run dev` starts **API only** (`packages/api`). Admin + vendor are served on `:9000` paths above.

## Admin login

| Field | Value |
|---|---|
| URL | http://localhost:9000/dashboard |
| Email | `admin@mdeai.co` |
| Password | `MercurDev2026!` |

## Demo seller (ECOM-C-005)

| Field | Value |
|---|---|
| Name | `mdeai` |
| Handle | `mdeai` |
| Seller id | `sel_01KTHZGQ85Z1RE6X1JSJMVWVX8` |
| Status | `open` (approved — required for Store API) |
| Email | `seller@mdeai.co` |

Re-seed seller only:

```bash
cd /home/sk/mdeai/mdeapp/commerce/mercur && bun run seed:seller
```

## Publishable API key (dev)

```bash
export MEDUSA_PUBLISHABLE_KEY=pk_42c83cc5daa68b27dcd0e98ea5e3f70bd380acbbab514879d71d57a0d2cf3cb5
```

Linked to **Default Sales Channel** (`sc_01KTHTXENNVK48D4KE5GRBNG4X`).

## Catalog seed (ECOM-C-006)

```bash
cd /home/sk/mdeai/mdeapp/commerce/mercur
bun run seed:mdeai-catalog
```

Script: `packages/api/src/scripts/seed-mdeai-catalog.ts` — creates seller `mdeai`, 20 Medellín SKUs, links legacy demo products.

## Store API verification

```bash
export MEDUSA_PUBLISHABLE_KEY=pk_42c83cc5daa68b27dcd0e98ea5e3f70bd380acbbab514879d71d57a0d2cf3cb5

curl -s -H "x-publishable-api-key: $MEDUSA_PUBLISHABLE_KEY" \
  "http://localhost:9000/store/products?limit=25" | jq '{count, titles: [.products[].title]}'
```

**Expected:** `count >= 20` (currently **24** = 20 mdeai + 4 legacy Medusa demos).

## Known Store API blocker (fixed 2026-06-07)

Mercur filters `/store/products` to products linked via `product_seller` to sellers with `status: open`. Default Medusa seed created published products but **no seller** → `count: 0`. Fix: `bun run seed:mdeai-catalog`.

## mdeapp CORS

`packages/api/.env` includes `localhost:3000` and `localhost:3001` in `STORE_CORS` / `AUTH_CORS` for Phase 2 bridge.

## Docker helpers

```bash
docker run -d --name mercur-dev-redis -p 6379:6379 redis:7-alpine

PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres \
  -c "CREATE DATABASE mercur;"
```

## Stripe checkout (ECOM-C-004) — verified 2026-06-07

**Provider:** `@medusajs/medusa/payment-stripe` only (no Connect in Phase 1).  
**Config:** `packages/api/medusa-config.ts` + Stripe vars in `packages/api/.env` (sync from `commerce/.env`).

### One-time checkout prep

```bash
cd /home/sk/mdeai/mdeapp/commerce/mercur
bun run seed:checkout-prep   # seller stock location + shipping + Stripe on region
```

### Webhook forwarding (separate terminal)

```bash
stripe listen --forward-to localhost:9000/hooks/payment/stripe_stripe
# Copy whsec_... → STRIPE_WEBHOOK_SECRET in commerce/.env AND packages/api/.env
```

### Store API proof (payment session)

```bash
source /home/sk/mdeai/mdeapp/commerce/.env
PK="$MEDUSA_PUBLISHABLE_KEY"
REG=reg_01KTHTXVGSPF1F6V33D3KSCQXX

CART=$(curl -s -X POST -H "x-publishable-api-key: $PK" -H 'Content-Type: application/json' \
  -d "{\"region_id\":\"$REG\"}" http://localhost:9000/store/carts | jq -r '.cart.id')

VARIANT=$(curl -s -H "x-publishable-api-key: $PK" \
  'http://localhost:9000/store/products?limit=1' | jq -r '.products[0].variants[0].id')

curl -s -X POST -H "x-publishable-api-key: $PK" -H 'Content-Type: application/json' \
  -d "{\"variant_id\":\"$VARIANT\",\"quantity\":1}" \
  "http://localhost:9000/store/carts/$CART/line-items" > /dev/null

curl -s -X POST -H "x-publishable-api-key: $PK" -H 'Content-Type: application/json' \
  -d '{"shipping_address":{"first_name":"Camila","last_name":"Test","address_1":"Calle 10","city":"Medellin","country_code":"es","postal_code":"050001"},"email":"buyer@test.com"}' \
  "http://localhost:9000/store/carts/$CART" > /dev/null

SHIP=$(curl -s -H "x-publishable-api-key: $PK" \
  "http://localhost:9000/store/shipping-options?cart_id=$CART" \
  | jq -r '.shipping_options | to_entries[0].value[0].id')

curl -s -X POST -H "x-publishable-api-key: $PK" -H 'Content-Type: application/json' \
  -d "{\"option_id\":\"$SHIP\"}" \
  "http://localhost:9000/store/carts/$CART/shipping-methods" > /dev/null

PC=$(curl -s -X POST -H "x-publishable-api-key: $PK" -H 'Content-Type: application/json' \
  -d "{\"cart_id\":\"$CART\"}" http://localhost:9000/store/payment-collections | jq -r '.payment_collection.id')

curl -s -X POST -H "x-publishable-api-key: $PK" -H 'Content-Type: application/json' \
  -d '{"provider_id":"pp_stripe_stripe"}' \
  "http://localhost:9000/store/payment-collections/$PC/payment-sessions" \
  | jq '{client_secret: .payment_collection.payment_sessions[0].data.client_secret, pi: .payment_collection.payment_sessions[0].data.id}'
```

**Expected:** `client_secret` starts with `pi_` and `status: requires_payment_method`.

### Paid order proof (ECOM-C-016)

After `stripe listen` is running, confirm test card server-side then complete cart:

```bash
# Use PI id from payment session above
curl -s -u "$STRIPE_API_KEY:" -X POST "https://api.stripe.com/v1/payment_intents/$PI/confirm" \
  -d "payment_method=pm_card_visa" -d "return_url=http://localhost:9000/health" | jq '{status, amount_received}'

sleep 2
curl -s -X POST -H "x-publishable-api-key: $PK" \
  "http://localhost:9000/store/carts/$CART/complete" | jq .

# Admin: order payment_status should be captured
```

**Verified:** `order_*` with `payment_status: captured`, `total: 15` (€10 item + €5 shipping).

## Phase 1 remaining

| Task | Status |
|---|---|
| ECOM-C-001 ADR | In progress |
| ECOM-C-003 env docs | Partial — template updated |
| ECOM-C-004 Stripe | **Done** |
| ECOM-C-016 Paid order | **Done** (Mercur standalone) |
| ECOM-C-018 Exit gate | Open — needs formal checklist signoff |

## Phase 2+ (frozen)

No `mdeapp/src` commerce bridge until ECOM-C-018 exit gate.
