**Agreed — keep Mercur commerce standalone until the buyer path works without mdeapp.**

Mixing too early is what caused the confusion: two runtimes (`:9000` vs `:3001`), two env contracts, worktrees, and “missing scripts” on the wrong branch.

---

## What “ecommerce working first” means (Mercur only)

| Layer | URL | Role |
|-------|-----|------|
| **Mercur API** | `http://localhost:9000` | Products, cart, checkout, orders |
| **B2C reference** | `http://localhost:3000` | Proof UI — [mercurjs/b2c-marketplace-storefront](https://github.com/mercurjs/b2c-marketplace-storefront) |
| **mdeapp** | `http://localhost:3001` | **Out of scope** until standalone gate passes |

**Done when (no mdeapp):**

1. `GET :9000/health` → 200  
2. Store API → products (24+), regions, cart create, line item  
3. B2C → browse → PDP → cart → checkout address step  
4. Stripe test payment → captured order (re-run C-016 proof if needed)  
5. **SAN-725** field-mask fixed on **Mercur/B2C side** (`*seller.reviews*` documented or seeded)

Phase 1 exit gate ([commerce-core-exit-gate](docs/ecommerce/evidence/2026-06-07/commerce-core-exit-gate.md)) already claimed this — **re-verify with Mercur actually running** (it was down in the last audit).

---

## What to pause (mdeapp ↔ Mercur)

| Item | Action |
|------|--------|
| **SAN-636 ECOM-C-008** Commerce API proxy | **Do not start** |
| **C-009–C-015** embeddings, Mastra, ProductCards | **Frozen** |
| `npm run verify:commerce-mdeapp-env` / `smoke:commerce-client` | **Ignore for now** — mdeapp bridge proof |
| Pulling `main` just for C-007 SDK | **Optional** — C-007 on `main` is inert until you wire chat |
| Concierge prompts for products | **No** |

**SAN-635 ECOM-C-007** merged on `main` but is only a read-only SDK wrapper — it doesn’t mix buyer UI yet. Treat it as **landed, not activated**.

---

## Correct next steps (Mercur-first)

```bash
# 1. Boot commerce stack only
cd ~/mdeai/mdeapp/commerce/mercur
bun run dev                    # :9000 health 200

# 2. Mercur env gate
cd ~/mdeai/mdeapp
node scripts/verify-commerce-env.mjs

# 3. Store API smoke (publishable key from commerce/.env)
source commerce/.env
curl -s http://localhost:9000/store/regions -H "x-publishable-api-key: $MEDUSA_PUBLISHABLE_KEY"
curl -s "http://localhost:9000/store/products?limit=3&region_id=<REG>" \
  -H "x-publishable-api-key: $MEDUSA_PUBLISHABLE_KEY"

# 4. B2C reference (separate terminal)
cd commerce/b2c-storefront
yarn dev                       # :3000 — categories, PDP, cart, checkout
```

Then **SAN-725 ECOM-C-022** — fix/document field mask in **B2C + Mercur evidence**, not in mdeapp chat.

---

## Revised sequence

```text
NOW:     Mercur boot → Store API → B2C browse/cart/checkout → re-prove paid order
NEXT:    SAN-725 field-mask policy (Mercur/B2C only)
LATER:   mdeapp bridge (C-008 proxy) — only after standalone ecommerce is green again
MUCH LATER: AI ProductCards in chat (C-010+)
```

---

**Bottom line:** Ecommerce = **Mercur + B2C reference**. mdeapp stays the rentals/events concierge until that path is green end-to-end. No mdeapp commerce scripts, no proxy, no agent tools until you say standalone ecommerce is proven again.