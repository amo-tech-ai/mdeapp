---
title: SAN-974 · PAY-WEBHOOK-1 — Ticket Checkout Finalize · Owner Runbook
task: SAN-974 · PAY-WEBHOOK-1 — Ticket Checkout Finalize
pr: https://github.com/amo-tech-ai/mdeapp/pull/228
owner: sanjiovani
status: code-green · awaiting Stripe Dashboard proof
updated: 2026-06-16
---

# SAN-974 · PAY-WEBHOOK-1 — Ticket Checkout Finalize — Owner Runbook

**What this is:** the last steps a human has to do by hand to finish
`SAN-974 · PAY-WEBHOOK-1 — Ticket Checkout Finalize`. The code is done and green.
What's left is connecting Stripe to our live webhook and proving one real test
payment turns into a scannable ticket.

**Who this is for:** the account owner (you). No coding needed. Follow the steps
in order. Each step says exactly what to click and what "good" looks like.

**Why it matters (plain terms):** today a buyer like Andrés could pay and *not*
reliably get a ticket, because Stripe isn't yet told where to send the
"payment succeeded" message. These steps wire that up and prove it works.

---

## Where the code stands (already done — no action needed)

| Item | State |
|---|---|
| PR [#228](https://github.com/amo-tech-ai/mdeapp/pull/228) code blocker | Fixed |
| Commit `e376a1e4` | Pushed |
| Checkout e2e on Chromium | 4 passed, 2 skipped, 0 failures |

The remaining work below is **not code** — it is Stripe Dashboard setup plus one
proof payment.

**Key facts you'll need:**

- Stripe account: **Socialmediaville Inc**
- Webhook endpoint URL (our live ticket-payment handler):

```
https://zkwcbyxiwklihegjhuql.supabase.co/functions/v1/ticket-payment-webhook
```

- Supabase project ref: `zkwcbyxiwklihegjhuql`

> **Test mode vs live mode:** do every step below in **Test mode** first
> (toggle is top-right in the Stripe Dashboard). Use the test card. Only repeat
> in Live mode once the test passes — and live mode has its **own** signing
> secret, so you'd redo steps 2–3 with the live value.

---

## Step 1 — Create the webhook endpoint in Stripe

1. Log in to the Stripe Dashboard as **Socialmediaville Inc**.
2. Make sure **Test mode** is ON (top-right toggle).
3. Go to **Developers → Webhooks** (or **Workbench → Webhooks**).
4. Click **Add endpoint** (or **Add destination**).
5. In **Endpoint URL**, paste exactly:

```
https://zkwcbyxiwklihegjhuql.supabase.co/functions/v1/ticket-payment-webhook
```

6. Under **Select events**, add exactly these four and nothing else:

   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.expired`
   - `charge.refunded`

7. Click **Add endpoint** to save.

**Good looks like:** the endpoint appears in the Webhooks list with the URL above
and "4 events" subscribed.

---

## Step 2 — Copy the endpoint signing secret

1. Click the endpoint you just created.
2. Find **Signing secret** and click **Reveal**.
3. Copy the value. It starts with `whsec_`.

> **Critical:** use the **Dashboard endpoint** secret (this one). Do **NOT** use
> the `whsec_` printed by the local `stripe listen` CLI — that one only works on
> your laptop and will make every real webhook fail signature checks.

Keep this secret on your clipboard for Step 3. Never paste it into chat, a doc, a
commit, or a screenshot.

---

## Step 3 — Set `STRIPE_WEBHOOK_SECRET` on the edge function

Our webhook handler runs as a Supabase **edge function**, so the secret lives in
Supabase's edge-function secrets — not in `.env.local` and not in Vercel.

**Option A — Supabase Dashboard (recommended, no terminal):**

1. Go to the Supabase Dashboard → project `zkwcbyxiwklihegjhuql`.
2. **Project Settings → Edge Functions → Secrets** (also reachable via
   **Edge Functions → Manage secrets**).
3. Add a secret named exactly `STRIPE_WEBHOOK_SECRET`.
4. Paste the `whsec_…` value from Step 2.
5. Save.

**Option B — Supabase CLI (if you prefer the terminal):**

Run this and paste the secret when shaping the command — replace the placeholder,
do not commit the real value anywhere:

```
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_DASHBOARD_SECRET --project-ref zkwcbyxiwklihegjhuql
```

> Edge-function secrets take effect on the next invocation — no redeploy needed.
> If you *do* redeploy the function later via CLI, re-confirm the secret is still
> set (CLI deploys don't wipe secrets, but it's worth a glance).

**Good looks like:** `STRIPE_WEBHOOK_SECRET` shows in the Supabase edge-function
secrets list (value hidden). Don't echo or log the value.

---

## Step 4 — Run one test-mode purchase

1. On the live site (or staging), open any published event at `/events/[slug]`.
2. Pick a ticket tier and click **Buy / Pay with Stripe**.
3. On Stripe's hosted checkout page, pay with the test card:

```
4242 4242 4242 4242
```

   - Expiry: any future date (e.g. `12/34`)
   - CVC: any 3 digits (e.g. `123`)
   - ZIP/postal: any value (e.g. `12345`)

4. Complete the payment. You should be redirected back with a success banner
   ("Payment received — check your email for tickets").

**Now confirm all four of these:**

| Check | Where to look | Good looks like |
|---|---|---|
| Webhook delivered 2xx | Stripe Dashboard → your endpoint → **Events / Attempts** | `checkout.session.completed` shows HTTP **200** (green) |
| Order is `paid` | Supabase Dashboard → Table editor → `event_orders` | the new row's `status` = `paid` |
| Ticket appears | Visit `/me/tickets` (use the wallet link / token from the success page) | the new ticket is listed |
| QR exists | Open the ticket | a QR code renders |

> If the webhook attempt shows a non-200 (e.g. 401 or 400): a 401 usually means
> the endpoint URL is wrong; a 400 "signature" error means the secret in Step 3
> doesn't match the Dashboard endpoint secret from Step 2. Fix and re-send.

---

## Step 5 — Duplicate / idempotency proof

This proves a retried or duplicated Stripe message can't create a second ticket.

1. In the Stripe Dashboard, open your endpoint → **Events**.
2. Find the `checkout.session.completed` event from Step 4.
3. Click it → **Resend** (resend the same event to the endpoint).
4. Wait for the new delivery attempt to show **200**.

**Then confirm no duplicates were created:**

| Check | Where to look | Good looks like |
|---|---|---|
| No duplicate order | `event_orders` | still **one** row for this purchase |
| No duplicate attendee | `event_attendees` | same attendee count as after Step 4 |
| No duplicate ticket | `/me/tickets` | still **one** ticket |

**Good looks like:** the resend returns 200 (handler accepted it) **and** the
counts above are unchanged — the second delivery was safely ignored.

---

## Step 6 — Final SAN-974 PASS/FAIL checklist

Fill this in as you go. SAN-974 · PAY-WEBHOOK-1 — Ticket Checkout Finalize is
**Done** only when every row is PASS.

| # | Proof | PASS / FAIL |
|---|---|---|
| 1 | PR [#228](https://github.com/amo-tech-ai/mdeapp/pull/228) code green (commit `e376a1e4`, checkout e2e 4 passed) | ☐ |
| 2 | Webhook endpoint subscribed to all 4 events | ☐ |
| 3 | `STRIPE_WEBHOOK_SECRET` set on the edge function (Dashboard secret, not CLI) | ☐ |
| 4 | One test payment finalized — webhook 200 + order `paid` | ☐ |
| 5 | Wallet shows the ticket at `/me/tickets` | ☐ |
| 6 | QR present on the ticket | ☐ |
| 7 | Duplicate resend safe — no second order/attendee/ticket | ☐ |

**When all 7 are PASS:** capture screenshots (webhook 200, `event_orders` row =
`paid`, the QR) into `docs/tasks/testing/evidence/SAN-974/`, then flip
`SAN-974 · PAY-WEBHOOK-1 — Ticket Checkout Finalize` to Done and merge PR #228.

**If any row FAILs:** stop there and note which one — the table above tells you
which step to revisit (most failures trace back to Step 2/3 secret mismatch or a
wrong endpoint URL in Step 1).
