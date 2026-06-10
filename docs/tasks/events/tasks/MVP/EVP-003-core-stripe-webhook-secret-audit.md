---
id: EVP-003-core
legacy_id: F11
title: P0 Stripe webhook secret audit (ticket vs sponsor)
status: Partial
priority: P0
phase: mvp
persona: andres
project: andres-commerce
milestone: P0
imp: "080"
linear: SAN-116
percent: 60
blocked_by: [stripe-sponsor-secret-rotation]
blocks: [EVP-001-core]
effort: 2h (audit + verify + document)
owner: sanjiovani
depends_on: [F06]
skill: [mde-supabase, mde-stripe, supabase-edge-functions]
verified_against:
  - /home/sk/mdeai/plan/prd/03-architecture.md §17 (Human approval architecture)
  - /home/sk/mdeai/plan/prd/04-product-surfaces.md §22 (Ticketing)
  - /home/sk/mdeai/plan/audit/04-supabase-audit.md §9 (Stripe ticket-payment-webhook — A+ rated)
  - /home/sk/mdeai/plan/audit/04-supabase-audit.md §4a–§4e (Edge fn freeze list — sponsor-* archived)
  - /home/sk/mdeai/.env.local var names: STRIPE_WEBHOOK_SECRET, STRIPE_SPONSOR_WEBHOOK_SECRET, STRIPE_WEBHOOK_DESTINATION_ID
---

# EVP-003-core — P0 Stripe webhook secret audit (ticket vs sponsor)

## 1. Purpose

The workspace `/home/sk/mdeai/.env.local` has **3 Stripe webhook-related env vars**: `STRIPE_WEBHOOK_SECRET`, `STRIPE_SPONSOR_WEBHOOK_SECRET`, `STRIPE_WEBHOOK_DESTINATION_ID`. The risk: **if `ticket-payment-webhook` and `sponsor-payment-webhook` share the same secret OR are crossed**, a sponsor webhook can be replayed against the ticket endpoint (or vice versa) and bypass signature verification. EVP-003-core is a forensic audit to confirm the two paths are isolated.

Per Supabase audit §9 the ticket stack is A+ engineered. But sponsor is Phase 3 (deferred). The freeze list (`tasks/notes/edge-fn-freeze-list.md`) pins sponsor versions — EVP-003-core verifies the SECRETS too, not just the code versions.

## 2. Goals

- **Inventory** all Stripe webhook secrets in legacy `/home/sk/mde/supabase/functions/`:
  - Which function reads which env var?
  - Are the values distinct in production?
- **Require distinct values** for `STRIPE_WEBHOOK_SECRET` (ticket) and `STRIPE_SPONSOR_WEBHOOK_SECRET` (sponsor) across **every** source they're configured in:
  - workspace `/home/sk/mdeai/.env.local`
  - Supabase Functions secrets (production)
  - Stripe Dashboard signing secrets
  - All three sources must show byte-distinct values. If any pair is identical → 🔴 finding, block W9 cutover until rotated.
  - Probe (safe — values never logged): `task-verifier probe-disk.sh env` — must print `Stripe webhook secrets are DISTINCT`.
- **Cross-reference** with Stripe dashboard:
  - 1 endpoint per webhook (no shared endpoints)
  - Each endpoint has its own signing secret
  - Each endpoint is subscribed to ONLY the relevant event types (ticket endpoint = `checkout.session.completed`, `payment_intent.succeeded`, etc.; sponsor endpoint = sponsor-specific events only)
- **Verify replay protection**:
  - `ticket-payment-webhook` uses `event.id` dedup via `idempotency_keys` table
  - `sponsor-payment-webhook` does same
- **Document** findings in `tasks/notes/F11-evidence.md`:
  - Each webhook function: which secret it reads, which Stripe endpoint it serves
  - 1-row-per-function audit table
  - Red flags (if any) + remediation plan
- **No code change in `mdeapp/`** — EVP-003-core is audit-only

## 3. Features (what the user gets)

- **Sofía / Patricia:** zero risk of Stripe webhook crossover (a malicious sponsor cannot trigger a ticket finalize, or vice versa)
- **Auditor:** clean evidence trail for any future PCI / financial review

## 4. Workflows

1. **Pre-flight (per `mde-stripe` + `mde-supabase` skills):**
   - Read `mcp__supabase__get_edge_function ticket-payment-webhook` (already done in audit 04)
   - Read `mcp__supabase__get_edge_function sponsor-payment-webhook`
   - Both verify Stripe signature on raw body

2. **Inventory env-var usage:**
   ```bash
   # Read both function sources from legacy
   grep -n 'STRIPE_.*_SECRET\|STRIPE_.*_WEBHOOK' /home/sk/mde/supabase/functions/ticket-payment-webhook/index.ts
   grep -n 'STRIPE_.*_SECRET\|STRIPE_.*_WEBHOOK' /home/sk/mde/supabase/functions/sponsor-payment-webhook/index.ts
   ```

3. **Cross-reference with workspace env:**
   ```bash
   grep -oE '^STRIPE_[A-Z_]+=' /home/sk/mdeai/.env.local | sort -u
   ```
   Expected vars (per .env.local audit earlier):
   - `STRIPE_PUBLISHABLE_KEY` (public, for frontend)
   - `STRIPE_SECRET_KEY` (server-side, both functions use)
   - `STRIPE_WEBHOOK_SECRET` (ticket webhook)
   - `STRIPE_SPONSOR_CHECKOUT_KEY` (sponsor checkout — separate flow)
   - `STRIPE_SPONSOR_WEBHOOK_SECRET` (sponsor webhook)
   - `STRIPE_WEBHOOK_DESTINATION_ID` (Stripe destination — for routing)

4. **Verify distinct values** — pull from Supabase Functions secrets (via Supabase MCP `get_logs` for redacted bootstrap output, or dashboard):
   ```sql
   -- Sanity: are both functions actively running with their own configs?
   SELECT slug, version, status, verify_jwt FROM (
     SELECT 'ticket-payment-webhook' AS slug, 'v27' AS version, 'ACTIVE' AS status, false AS verify_jwt
     UNION ALL
     SELECT 'sponsor-payment-webhook', 'v19', 'ACTIVE', false
   ) AS x;
   ```
   (Both must be verify_jwt:false — Stripe's signature is the auth, not JWT.)

5. **Verify Stripe dashboard endpoints** (manual step — outside MCP scope):
   - Go to Stripe Dashboard → Developers → Webhooks
   - Confirm 2 endpoints exist with distinct signing secrets
   - Confirm each endpoint's "subscribed events" list matches its function's handled types
   - Capture screenshot to evidence file

6. **Write `tasks/notes/F11-evidence.md`** with the inventory table.

## 5. User journeys

- **Sofía (post-audit):** opens `F11-evidence.md` → sees confirmation that ticket vs sponsor are isolated
- **Patricia (admin):** has 1-page artifact to show in a financial review

## 6. Agents

None — audit.

## 7. Integrations

| Integration | Purpose |
|---|---|
| Stripe (verify dashboard) | Confirm endpoint isolation |
| Supabase MCP `get_edge_function` | Read function source — already done in audit 04 |
| Workspace `.env.local` | Sanity-check vars (NEVER print values to conversation) |
| `idempotency_keys` table | Replay protection check (audit 04 §9a confirms ticket flow uses it) |

## 8. Summary

Audit Stripe webhook secret isolation between `ticket-payment-webhook` (active, A+ rated) and `sponsor-payment-webhook` (frozen, Phase 3). Document evidence + flag any crossover. No code change. We'll know it worked when `tasks/notes/F11-evidence.md` exists with: (a) function-to-secret mapping table, (b) Stripe dashboard confirmation of 2 distinct endpoints, (c) idempotency-keys confirmation.

## 9. Definition of Done

- [ ] `tasks/notes/F11-evidence.md` exists with:
  - [ ] Function inventory table (ticket-payment-webhook + sponsor-payment-webhook + ticket-checkout + sponsor-checkout = 4 rows)
  - [ ] Per-function env-var name (e.g., `STRIPE_WEBHOOK_SECRET` for ticket, `STRIPE_SPONSOR_WEBHOOK_SECRET` for sponsor)
  - [ ] Stripe dashboard screenshot (or text confirmation) — 2 distinct endpoints, distinct signing secrets
  - [ ] **Distinctness proof** across all 3 sources (workspace .env.local, Supabase Functions secrets, Stripe Dashboard) — values byte-distinct; record only hashes or first 4 chars, never full values
  - [ ] Idempotency proof: `mcp__supabase__execute_sql "SELECT count(*) FROM public.idempotency_keys WHERE endpoint='ticket-payment-webhook' AND created_at > now() - interval '90 days'"` shows ≥ 1
  - [ ] Red-flag section (if any) + remediation owner + ETA
- [ ] `STRIPE_WEBHOOK_SECRET` and `STRIPE_SPONSOR_WEBHOOK_SECRET` are distinct in `/home/sk/mdeai/.env.local` (verifier probe T9 below prints `DISTINCT`)
- [ ] No `mdeapp/src/**` code change (this is audit-only)
- [ ] No secret values written to evidence file (only env-var names + truncated hashes)

## 10. Tests

### Acceptance tests (automated, audit only — no DB writes)

| # | Test | Command | Expected |
|---|---|---|---|
| T1 | Ticket fn reads STRIPE_WEBHOOK_SECRET | `grep -q 'STRIPE_WEBHOOK_SECRET' /home/sk/mde/supabase/functions/ticket-payment-webhook/index.ts && echo OK` | `OK` |
| T2 | Sponsor fn reads STRIPE_SPONSOR_WEBHOOK_SECRET | `grep -q 'STRIPE_SPONSOR_WEBHOOK_SECRET' /home/sk/mde/supabase/functions/sponsor-payment-webhook/index.ts && echo OK` | `OK` |
| T3 | Ticket fn does NOT reference sponsor secret | `! grep -q 'STRIPE_SPONSOR_WEBHOOK_SECRET' /home/sk/mde/supabase/functions/ticket-payment-webhook/index.ts && echo OK` | `OK` |
| T4 | Sponsor fn does NOT reference ticket secret | `! grep 'STRIPE_WEBHOOK_SECRET' /home/sk/mde/supabase/functions/sponsor-payment-webhook/index.ts \| grep -v SPONSOR && echo OK` | `OK` |
| T5 | Both fns are `verify_jwt: false` | Supabase MCP `list_edge_functions` | both false |
| T6 | Ticket fn uses idempotency_keys | `grep -q 'idempotency_keys' /home/sk/mde/supabase/functions/ticket-payment-webhook/index.ts && echo OK` | `OK` |
| T7 | Sponsor fn uses idempotency_keys | `grep -q 'idempotency_keys' /home/sk/mde/supabase/functions/sponsor-payment-webhook/index.ts && echo OK` | `OK` |
| T8 | `.env.local` has both secrets defined | `grep -cE '^(STRIPE_WEBHOOK_SECRET\|STRIPE_SPONSOR_WEBHOOK_SECRET)=' /home/sk/mdeai/.env.local` | `2` |
| T9 | `.env.local` ticket and sponsor secrets are DISTINCT (values never logged) | `bash /home/sk/mdeai/.claude/skills/task-verifier/scripts/probe-disk.sh env 2>&1 \| grep -E 'Stripe webhook secrets are (DISTINCT\|IDENTICAL)'` | `🟢 Stripe webhook secrets are DISTINCT in /home/sk/mdeai/.env.local` |

### Manual / dashboard tests

| # | Test | How | Expected |
|---|---|---|---|
| Tm1 | 2 distinct Stripe webhook endpoints | Stripe Dashboard → Developers → Webhooks | 2 endpoints listed |
| Tm2 | Each endpoint has unique signing secret | Dashboard → click each endpoint → "Signing secret" field | 2 distinct values (don't paste in chat; redact to first 8 chars) |
| Tm3 | Ticket endpoint subscribed events | Dashboard → ticket endpoint → "Events" | Includes: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`, `payment_intent.succeeded`, `charge.refunded`. **Excludes** any `customer.*` or `invoice.*` (sponsor-specific). |
| Tm4 | Sponsor endpoint subscribed events | Dashboard → sponsor endpoint → "Events" | Includes sponsor-specific events ONLY. **Excludes** any of ticket events above. |

### Cross-system replay test (skip in W2 — defer to W9 production audit)

Send a real Stripe test webhook to the WRONG endpoint and confirm 400 signature-verification-failed response. (Requires Stripe CLI; defer to W9 pre-cutover audit.)

### Evidence to capture in `tasks/notes/F11-evidence.md`

- Output of T1-T8 (commands + results)
- Stripe dashboard screenshot or text confirmation (Tm1-Tm4)
- 1-row-per-function audit table
- Verdict: ✅ isolated / 🟡 needs followup / 🔴 crossed (block W9 deploy)

## Notes / verification

- **Why P0:** if a webhook is replayed against the wrong endpoint AND signatures verify (because the secrets are shared), an attacker can refund tickets they didn't pay for, or trigger sponsor payouts. Both ruin the company.
- **Audit-only:** EVP-003-core does NOT modify any function. Any required fix becomes a separate task with explicit approval.
- **Reusable for W10 cutover:** evidence file serves as the security review artifact before any production traffic flips to mdeapp.
- **Sponsor stack is frozen** (per `tasks/notes/edge-fn-freeze-list.md`) but the endpoint must still be audited because it's live and receiving Stripe events.
- **Defer Phase 2:** rotating both webhook secrets (post-W10 hygiene), implementing webhook secret rotation runbook.
