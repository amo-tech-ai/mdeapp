# F11 evidence — Stripe webhook secret audit — 2026-05-24

## Verdict: 🔴 NEEDS REMEDIATION (workspace secrets identical)

Ticket and sponsor webhook **code paths are isolated** (correct env var names). **`.env.local` has identical values** for both secrets — rotate sponsor endpoint secret before W9 cutover.

---

## Automated tests (T1–T9)

| # | Test | Result |
|---|------|--------|
| T1 | Ticket fn reads `STRIPE_WEBHOOK_SECRET` | ✅ `supabase/functions/ticket-payment-webhook/index.ts:71` |
| T2 | Sponsor fn reads `STRIPE_SPONSOR_WEBHOOK_SECRET` | ✅ backup/deployed-live `sponsor-payment-webhook/index.ts:241` |
| T3 | Ticket fn does NOT reference sponsor secret | ✅ no `STRIPE_SPONSOR_WEBHOOK_SECRET` in ticket-payment-webhook |
| T4 | Sponsor fn does NOT reference ticket secret alone | ✅ uses `STRIPE_SPONSOR_WEBHOOK_SECRET` only |
| T5 | Both fns `verify_jwt: false` | ✅ config.toml on checkout + webhook |
| T6 | Ticket fn uses `idempotency_keys` | ✅ ticket-payment-webhook |
| T7 | Sponsor fn uses `idempotency_keys` | ✅ sponsor-payment-webhook (backup) |
| T8 | `.env.local` has both vars defined | ✅ count=2 |
| T9 | Secrets DISTINCT in `.env.local` | 🔴 **IDENTICAL** (probe: length=38 both; values not logged) |

---

## Function inventory

| Function | Secret env var | Stripe endpoint URL | verify_jwt |
|----------|----------------|---------------------|------------|
| `ticket-checkout` | `STRIPE_SECRET_KEY` (session create) | N/A | false |
| `ticket-payment-webhook` | `STRIPE_WEBHOOK_SECRET` | `…/ticket-payment-webhook` | false |
| `sponsor-checkout` | `STRIPE_SECRET_KEY` | N/A | false |
| `sponsor-payment-webhook` | `STRIPE_SPONSOR_WEBHOOK_SECRET` | separate (Phase 3) | false |

---

## Stripe Dashboard (test mode — CLI)

Endpoint `we_1TYW8MFAkFMiToA1lx5q9CEJ` → `https://zkwcbyxiwklihegjhuql.supabase.co/functions/v1/ticket-payment-webhook`

Subscribed events (5): `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_succeeded`, `payment_intent.succeeded`, `charge.refunded`

Live mode endpoint list: not verified (Stripe CLI not authenticated in audit shell).

---

## Idempotency proof

```sql
SELECT count(*) FROM idempotency_keys
WHERE endpoint LIKE '%ticket-payment%' AND created_at > now() - interval '90 days';
-- 17 rows
```

---

## Red flags + remediation

| Finding | Severity | Owner | Action |
|---------|----------|-------|--------|
| `STRIPE_WEBHOOK_SECRET` === `STRIPE_SPONSOR_WEBHOOK_SECRET` in `/home/sk/mdeai/.env.local` | 🔴 P0 | Sofía | Create distinct sponsor test endpoint in Stripe Dashboard; rotate `STRIPE_SPONSOR_WEBHOOK_SECRET` in Supabase secrets + `.env.local` |
| Supabase production secret distinctness | ⚪ unverified | Sofía | Compare hashes via dashboard (never log full `whsec_`) |
| G1 paid proof not re-run on mdeapp | 🟡 | Lucía | `npm run smoke:ticket-paid-proof` after fresh test checkout |

**No `mdeapp/src/**` code changes** — audit-only per F11 spec.
