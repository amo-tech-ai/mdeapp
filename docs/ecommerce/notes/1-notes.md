Short answer: Today you have a Mercur backend + a thin /shop preview. A site like b2c.mercurjs.com/pl needs a full B2C storefront app (categories, PDP, cart, checkout, seller pages) — either run Mercur’s reference storefront on :3000, or build those surfaces into mdeapp over Phase 2–3.

What you have vs the demo
Layer	You today	b2c.mercurjs.com
Backend
Mercur :9000 — 24 products, Stripe, seller mdeai
Same Mercur Store API
Storefront
mdeapp /shop — title grid only (C-007)
Full Next.js B2C app
Home / categories
❌
/pl, /pl/categories
Product page
❌
/pl/products/new-runner-flag (variants, cart, seller reviews)
Cart + checkout
❌
Cart + Stripe Elements
Seller pages
❌
Per-vendor listings
Search
❌
Algolia (in official repo)
Your /shop page proves C-007 (server SDK → Store API). It is not a storefront.

What the official repo needs
From mercurjs/b2c-marketplace-storefront:

1. Run the B2C app (default :3000)

git clone https://github.com/mercurjs/b2c-marketplace-storefront.git
cd b2c-marketplace-storefront
yarn install
# .env.local from their README:
# MEDUSA_BACKEND_URL=http://localhost:9000
# NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<pk from commerce/.env>
# NEXT_PUBLIC_BASE_URL=http://localhost:3000
# NEXT_PUBLIC_DEFAULT_REGION=<your region code>
# NEXT_PUBLIC_STRIPE_KEY=<pk_test from commerce/.env>
yarn dev   # → http://localhost:3000
2. Mercur backend (you mostly have this)

Requirement	Status
API on :9000
✅
Publishable key
✅ MEDUSA_PUBLISHABLE_KEY
Products + seller links
✅ 24 SKUs
Region(s)
⚠️ Demo uses pl; yours may be eur — set NEXT_PUBLIC_DEFAULT_REGION to match
STORE_CORS includes storefront origin
⚠️ Must include http://localhost:3000 in packages/api/.env
Stripe checkout
✅ Phase 1 proof done
Redis + Postgres
✅ (Redis container)
3. Optional for full demo parity

Feature	Needed for
Algolia (NEXT_PUBLIC_ALGOLIA_*)
Category/search UX like demo
TalkJS
Seller chat
Product images
PDP hero/carousel (your seed may use placeholders)
More catalog depth
“More from this seller”, trending blocks
Algolia is not required to browse products — only for search/filter like the live demo.

mdeai strategy (ADR) — don’t ship a second production storefront
Per ADR-001 and the roadmap:

Production buyer UI = mdeapp (chat-first Camila), not a second Next app.
b2c-marketplace-storefront = reference for SDK/cart/seller UX — copy patterns, don’t deploy as mdeai.co.
mdeapp-native path to “real store” (what to build):

Task	Delivers
C-007 ✅
Server medusa-client.ts
C-008
/api/commerce/products, /cart, /checkout
C-014
ProductCard in chat
C-015
Cart state UI
C-012–C-013
Mastra cart + checkout tools
New routes
/shop, /shop/[handle], /shop/cart styled like demo PDP — not clone whole repo
That gets you PDP + cart inside mdeapp without duplicating b2c.mercurjs.com as a separate product.

Recommended local setup (two ports)
:9000  Mercur API          (commerce/mercur — already running)
:3000  B2C storefront      (clone b2c-marketplace-storefront — quick visual reference)
:3001  mdeapp concierge    (your AI app + /shop preview)
Port 3000 matches the official storefront README (NEXT_PUBLIC_BASE_URL=http://localhost:3000). mdeapp can stay on 3001 to avoid clashing.

Minimum checklist to see “real” store pages locally
Mercur up → curl http://localhost:9000/health → OK
Clone + configure b2c-marketplace-storefront with your pk_ and region
Add http://localhost:3000 to Mercur STORE_CORS
yarn dev in storefront → open /pl/categories and a product URL
Bottom line
Fastest path to pages like the demo: run Mercur’s B2C storefront on :3000 (dev/reference only).
Correct mdeai path: C-008 → cart/checkout routes → shop PDP/cart in mdeapp (chat remains primary).
Want me to clone the B2C storefront under commerce/b2c-storefront/, wire .env.local, fix CORS, and start it on :3000?