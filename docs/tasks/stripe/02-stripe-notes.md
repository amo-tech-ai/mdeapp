## How old Proof 001 applies to mdeai today

Same Supabase project (`zkwcbyxiwklihegjhuql`), same DB/RPCs (`ticket_checkout_create_pending`, `ticket_payment_finalize`, etc.). Proof 001 validated the **backend spine** on legacy `/home/sk/mde/`. mdeai **reused that spine** and rewired the buyer UI in Next.js (`mdeapp/`).

---

### What carries over unchanged (architecture is correct)

The doc’s sequence diagram still matches what we shipped:

```
Andrés → SCREEN-009 modal → /api/tickets/checkout → ticket-checkout edge
  → pending order + qty_pending++ → Stripe Checkout Session
  → ticket-payment-webhook → ticket_payment_finalize → status=paid
```

| Old mde pattern | mdeai today |
|---------------|-------------|
| Checkout Sessions (not Payment Element) | ✅ Same |
| `verify_jwt=false` on checkout + webhook | ✅ `config.toml` + deployed |
| Reserve inventory **before** Stripe call | ✅ `ticket-checkout` RPC |
| Fulfill on `checkout.session.completed` (+ async/expired/refund) | ✅ Ported in `ticket-payment-webhook` |
| Stripe API `2026-04-22.dahlia` | ✅ Both edge fns |
| Raw body → `constructEventAsync` | ✅ Webhook |
| App + Stripe idempotency keys | ✅ Modal sends UUID; edge passes to Stripe |
| Metadata `{ order_id }` only (no PII) | ✅ Same audit fix |

**Bottom line:** You don’t need to redesign Stripe. Proof 001 already proved the hard part — **ops + frontend completion**.

---

### What mdeai changed (intentional deltas)

| Old mde | mdeai now |
|---------|-----------|
| Vite `EventDetail.tsx` + `EventTicketCheckout.tsx` | Next.js `event-detail-view.tsx` + `booking-checkout-modal.tsx` |
| Direct POST to edge from browser | Server proxy `/api/tickets/checkout` (no Stripe keys in browser) ✅ better |
| Success URL → `/me/tickets?checkout=success` | Success URL → `/events/[slug]?checkout=success` (until **SCREEN-015**) |
| Playwright `events-buyer-032-034.spec.ts` @ `:8080` | `SCREEN-009-checkout.spec.ts` — **mocks API**, no real Stripe pay |
| Deno `ticket_stripe_smoke_test.ts` + `evt069-stripe-smoke.sh` | Only `npm run smoke:ticket-checkout` (creates session, **does not prove webhook**) |

---

### Where you are vs Proof 001 “done” bar

| Proof 001 gate | mdeai status |
|----------------|--------------|
| Phase 1 backend spine | ✅ **EVT-01 Done** — edges in repo + deployed |
| Phase 2 buyer UI | 🟡 **SCREEN-009 Done** — modal + redirect; no wallet/QR yet |
| Phase 3 ops proof (the big one) | 🔴 **Not closed** — no fresh test payment → `event_orders.status=paid` |
| F11 separate ticket vs sponsor `whsec` | ⚪ **Not started** — doc explicitly warns against shared secrets |
| SCREEN-015 `/me/tickets` + QR | ⚪ **Next P0** — old doc’s step 2.5 |

**G1 is at ~85%:** checkout session works (`smoke:ticket-checkout` → pending order + `cs_test_*`). Proof 001’s closure criterion was **Stripe Dashboard delivery 2xx → SQL `status=paid`** — we haven’t re-proven that in mdeapp yet.

---

### Lesson #1 from the doc applies **right now**

The stuck-payment incident wasn’t bad handler code — it was:

> **No test-mode webhook endpoint** (live had one; test had zero) + stale `STRIPE_WEBHOOK_SECRET`.

Before calling G1 Done, rerun Proof 001 **Phase 3** verbatim:

```bash
# 1. Test-mode endpoint exists with 5 events
stripe webhook_endpoints list --limit 20

# 2. Secret matches Supabase (resend → 200, not 400)
# Dashboard "Reveal" → supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# 3. Fresh payment on localhost:3001 (not replay)
# Buy GA on reina-de-antioquia-2026-finals with 4242…4242

# 4. SQL proof
select id, status, stripe_session_id, stripe_payment_intent, paid_at
from event_orders order by created_at desc limit 1;
```

If step 3 succeeds but SQL stays `pending` → **ops**, not app code (exact same failure mode as Proof 001).

---

### What to port from old notes (priority order)

1. **F11 audit** — confirm ticket `STRIPE_WEBHOOK_SECRET` ≠ sponsor secret in Dashboard + Supabase + `.env.local` ([`tasks/events/EVP-003-core-stripe-webhook-secret-audit.md`](tasks/events/EVP-003-core-stripe-webhook-secret-audit.md))
2. **Phase 3 ops proof** — one live test checkout after webhook config → document in `EVT-01-evidence.md`
3. **SCREEN-015** — `/me/tickets` + QR (old Proof 001 step 2.5; success URL can move back to wallet)
4. **Port tests/scripts** from legacy (currently only in `tasks/backup/`):
   - `supabase/functions/tests/ticket_stripe_smoke_test.ts`
   - `scripts/evt069-stripe-smoke.sh` → adapt to `:3001` + `/api/tickets/checkout`
5. **Phase 4 hardening** (post-MVP): stale pending cleanup, RPC `search_path`, webhook alerts — still valid from doc §Phase 4

---

### What does **not** apply to mdeapp

- Legacy paths: `src/pages/EventDetail.tsx`, `useEventTicketTiers.ts`, Playwright @ `:8080`
- “One worktree one PR” context for Proof 001 merge — historical
- Sponsor checkout — Phase 3 deferred; F11 is audit-only for now
- Maps/Mastra/leads — out of scope for Stripe doc (G2 is separate, already Done)

---

### Practical read for your current backlog

| Task | Relationship to old doc |
|------|-------------------------|
| **F11** | Directly implements doc §Phase 0 step 6 + §Secrets |
| **G1 paid proof** | Doc §Phase 3 steps 3.1–3.4 — **mandatory before SCREEN-009 → 100%** |
| **SCREEN-015** | Doc §Phase 2 step 2.5 — Andrés wallet after pay |
| **EVT-01** | Already ported Phase 1 — don’t re-implement checkout logic |

**Summary:** Old Proof 001 is the **playbook for closing G1**, not a rebuild spec. Backend matches; what’s missing is **ops verification (test webhook + secret sync)**, **wallet UI (015)**, and **real-payment E2E** — the same gaps the old project closed in Phase 3 after the webhook endpoint incident.

Want me to run the Phase 3 Stripe ops checklist against your current Dashboard/secrets next?