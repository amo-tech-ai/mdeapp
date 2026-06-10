# Product-friendly Linear board (2026-05-30)

> **Superseded by:** [`07-mvp.md`](07-mvp.md) — PREFIX-### catalog is canonical.

Applied by `scripts/linear-apply-product-titles.mjs`. Log: [`product-titles-apply-log.json`](product-titles-apply-log.json).

## Milestone

| Before | After |
|--------|--------|
| P0 — MVP gates | **🚨 Launch Critical** |

## Title format

**Linear title:** `Verb + feature + outcome` (no IMP/SCREEN prefix in title).

**Description header:** `Spec · IMP · Persona` + link to disk spec.

## Area labels (group MVP view by label)

| Label | Use for |
|-------|---------|
| `area:launch` | MVP exit blockers |
| `area:payments` | Stripe, webhooks, G1 |
| `area:events` | Tickets, host publish, event cards |
| `area:concierge` | AI chat UX |
| `area:maps` | Maps, pins, grounding |
| `area:rentals` | Rental parser, Save tooltip |
| `area:stability` | Smoke, auth, monitors |
| `area:venues` | Cafés, restaurants (post-launch) |
| `area:future` | Deferred optional work |

## Update [MVP view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207)

1. **Filter:** `project:MDEAPP milestone:"🚨 Launch Critical" state:Todo,"In Progress"`
2. **Group by:** Label → `area:*` (or subgroup `track:ux` / `track:events`)
3. **Manual sort (Todo):** match [`02-views-sort.md`](02-views-sort.md) P0 pull order

## New issues (2026-05-30)

| Task | SAN | Title |
|------|-----|--------|
| G3-core-host-publish-proof | [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) | Prove Roberto can publish an event on production |
| AUTH-011 | [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) | Verify production login and Vercel env |
| MAP-002B | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | Deploy grounded place search to production |
| MAP-008B | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) | Verify Google Maps pins on production |

## Re-apply

```bash
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
node scripts/linear-apply-product-titles.mjs
```

Idempotent for titles; creating issues again would duplicate — edit script `CREATE_ISSUES` if re-run needed.
