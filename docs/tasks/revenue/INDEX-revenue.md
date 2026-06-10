---
title: Revenue Tasks Index
updated: 2026-06-04
owner: sanjiovani
strategy: ../../docs/strategy/index-revenue.md
backlog: ../../docs/strategy/task-backlog.md
audit: ../audit/38-revenue-audit.md
---

# Revenue Tasks

> **Gate:** All revenue tasks require MVP exit (PAY-001 + EVT-001 + MAP-002B + AUTH-011). Track: [Linear MVP view](https://linear.app/sanjiovani/view/mvp-48ab105e7f0a). Until gate closes, keep issues in **Backlog** with `blocked-by` MVP-exit.
>
> **Strategy:** [`docs/strategy/index-revenue.md`](../../docs/strategy/index-revenue.md) · [`docs/strategy/task-backlog.md`](../../docs/strategy/task-backlog.md)
>
> **Audit:** [`tasks/audit/38-revenue-audit.md`](../audit/38-revenue-audit.md) — Linear label matrix §6
>
> **Linear sync:** [`tasks/revenue/LINEAR-REVENUE.md`](LINEAR-REVENUE.md) — R1 + CW imported 2026-06-05
>
> **Skills routing:** Stripe → `mde-stripe` + `mde-supabase` · Agents → `mastra` + `copilotkit-integrations` · UI → `copilotkit` + `shadcn` · Lifecycle → `mde-task-lifecycle` → `task-verifier`
>
> **Linear labels:** All tasks use **`phase:post-mvp`** (not `phase:mvp`). Import labels from each task's `linear_labels` frontmatter — see [`linear.md`](../../linear.md).

## `/advertise` scope split

| Task | Route / section | Owns |
|------|-----------------|------|
| **C1** | `/advertise` → **Agency** (managed AI marketing retainer) | Stripe Billing subscription, agency tiers $299–$999/mo |
| **C5** | `/advertise` → **Get Listed** (self-serve) | `sponsor.*` placements, directory packages |

Ship C1 first; C5 extends the same page with a second section (no duplicate route).

---

## TIER R1 — First revenue sprint (post-MVP-exit, week 1–2)

> Theme: agent cleanup + agency cash + **first transact tool**. C11 (wallets) starts in R2 after C2.

| # | Task ID | File | Linear | Linear Project | Effort | Depends on | Status |
|---|---------|------|--------|----------------|--------|------------|--------|
| 1 | C13 | [C13-agent-cleanup.md](C13-agent-cleanup.md) | [SAN-550](https://linear.app/sanjiovani/issue/SAN-550) | AI & Intelligence | 3–5 days | MVP-exit | ⚪ Backlog |
| 2 | C1 | [C1-ai-marketing-agency.md](C1-ai-marketing-agency.md) | [SAN-552](https://linear.app/sanjiovani/issue/SAN-552) | Growth & Operations | 2–3 wk | C13 | ⚪ Backlog |
| 3 | C2 | [C2-create-checkout-tool.md](C2-create-checkout-tool.md) | [SAN-551](https://linear.app/sanjiovani/issue/SAN-551) | Commerce Platform | 3–4 wk | C13 | ⚪ Backlog |

## TIER R2 — Revenue infrastructure (weeks 2–7, after C2 ships)

> Theme: wallets on CheckoutWidget + billing rails + Sales Agent.

| # | Task ID | File | Linear Project | Effort | Depends on | Status |
|---|---------|------|----------------|--------|------------|--------|
| 4 | C11 | [C11-wallets-everywhere.md](C11-wallets-everywhere.md) | Commerce Platform | 1 wk | C2 | ⚪ Not Started |
| 5 | C3 | [C3-stripe-billing.md](C3-stripe-billing.md) | Commerce Platform | 2–4 wk | C1 | ⚪ Not Started |
| 6 | C12 | [C12-platform-fees-ledger.md](C12-platform-fees-ledger.md) | Commerce Platform | 1–2 wk | C2 | ⚪ Not Started |
| 7 | C6 | [C6-sales-agent.md](C6-sales-agent.md) | AI & Intelligence | 2–3 wk | C13, C2 | ⚪ Not Started |
| 8 | C15 | [C15-promo-codes.md](C15-promo-codes.md) | Commerce Platform | 1 wk | C2 | ⚪ Not Started |
| 9 | C9 | [C9-restaurant-venue-retainer.md](C9-restaurant-venue-retainer.md) | Venues | 2 wk | C3, C5 | ⚪ Not Started |
| 10 | C10 | [C10-nightlife-vip-deposit.md](C10-nightlife-vip-deposit.md) | Venues | 2–3 wk | C2, C6 | ⚪ Not Started |

## TIER R3-A — Independent (weeks 6–12, no Chatwoot required)

> Theme: metered leads, self-serve listings, Lead Agent.

| # | Task ID | File | Linear Project | Effort | Depends on | Status |
|---|---------|------|----------------|--------|------------|--------|
| 11 | C4 | [C4-metered-rental-lead-billing.md](C4-metered-rental-lead-billing.md) | Commerce Platform + Real Estate | 2 wk | C3 | ⚪ Not Started |
| 12 | C5 | [C5-advertise-self-serve.md](C5-advertise-self-serve.md) | Growth & Operations | 3–4 wk | C2 | ⚪ Not Started |
| 13 | C8 | [C8-lead-agent.md](C8-lead-agent.md) | AI & Intelligence + Real Estate | 2–3 wk | C4 | ⚪ Not Started |

## TIER CW — Chatwoot prerequisite (parallel with R2, before R3-B)

> **Canonical specs:** [`tasks/venues/tasks/chatwoot/`](../venues/tasks/chatwoot/) (ignore duplicate `tasks/chatwoot/` copy).
>
> **Order:** CW-1 → CW-2 → CW-3 → CW-4 → CW-5. C7 blocked until **CW-3** live.

| # | Task ID | File | Linear | Linear Project | Depends on | Status |
|---|---------|------|--------|----------------|------------|--------|
| CW-1 | CW-1 | [CW-1-deploy-chatwoot.md](../venues/tasks/chatwoot/CW-1-deploy-chatwoot.md) | [SAN-553](https://linear.app/sanjiovani/issue/SAN-553) | Growth & Operations | MVP-exit | ⚪ Backlog |
| CW-2 | CW-2 | [CW-2-whatsapp-cloud-api-inbox.md](../venues/tasks/chatwoot/CW-2-whatsapp-cloud-api-inbox.md) | [SAN-554](https://linear.app/sanjiovani/issue/SAN-554) | Growth & Operations | CW-1 | ⚪ Backlog |
| CW-3 | CW-3 | [CW-3-chatwoot-bridge.md](../venues/tasks/chatwoot/CW-3-chatwoot-bridge.md) | [SAN-555](https://linear.app/sanjiovani/issue/SAN-555) | Growth & Operations | CW-2 | ⚪ Backlog |
| CW-4 | CW-4 | [CW-4-contact-conversation-mirror.md](../venues/tasks/chatwoot/CW-4-contact-conversation-mirror.md) | [SAN-556](https://linear.app/sanjiovani/issue/SAN-556) | Growth & Operations | CW-3 | ⚪ Backlog |
| CW-5 | CW-5 | [CW-5-g2-lead-capture-hook.md](../venues/tasks/chatwoot/CW-5-g2-lead-capture-hook.md) | [SAN-557](https://linear.app/sanjiovani/issue/SAN-557) | Growth & Operations | CW-4 | ⚪ Backlog |

## TIER R3-B — Chatwoot-dependent

| # | Task ID | File | Linear Project | Effort | Depends on | Status |
|---|---------|------|----------------|--------|------------|--------|
| 14 | C7 | [C7-marketing-agent-whatsapp.md](C7-marketing-agent-whatsapp.md) | AI & Intelligence | 3 wk | C1, CW-3 | 🔴 Blocked on CW-3 |
| 15 | C14 | [C14-abandoned-cart-whatsapp-recovery.md](C14-abandoned-cart-whatsapp-recovery.md) | Growth & Operations | 1–2 wk | C7 | 🔴 Blocked on C7 |

## TIER R4 — Connect, portals, and CRM (months 3–6)

> **Order:** M1 → M4 → M5 → M6 → M7 → M8 → M2 → M9 → M11 → M3 → M10 → M12

| # | Task ID | File | Linear Project | Effort | Depends on | Status |
|---|---------|------|----------------|--------|------------|--------|
| 16 | M1 | [M1-stripe-connect-express.md](M1-stripe-connect-express.md) | Commerce Platform | 6–10 wk | C2, C12 | ⚪ Not Started |
| 17 | M4 | [M4-business-subscription-tiers.md](M4-business-subscription-tiers.md) | Commerce Platform | 3–4 wk | C3 | ⚪ Not Started |
| 18 | M5 | [M5-sponsor-agent.md](M5-sponsor-agent.md) | AI & Intelligence | 3 wk | C5 | ⚪ Not Started |
| 19 | M6 | [M6-opportunities-crm.md](M6-opportunities-crm.md) | Growth & Operations | 2–3 wk | C8 | ⚪ Not Started |
| 20 | M7 | [M7-restaurant-reservation-management.md](M7-restaurant-reservation-management.md) | Venues | 3 wk | C7 | 🔴 Blocked on C7 |
| 21 | M8 | [M8-campaigns-automations.md](M8-campaigns-automations.md) | Growth & Operations | 3–4 wk | C7 | 🔴 Blocked on C7 |
| 22 | M2 | [M2-business-portal.md](M2-business-portal.md) | Growth & Operations | 4–6 wk | C3, C8 | ⚪ Not Started |
| 23 | M9 | [M9-analytics-dashboards.md](M9-analytics-dashboards.md) | Growth & Operations | 3 wk | M2 | ⚪ Not Started |
| 24 | M11 | [M11-partners-onboarding.md](M11-partners-onboarding.md) | Growth & Operations | 2–3 wk | M1, M2 | ⚪ Not Started |
| 25 | M3 | [M3-tourism-experience-checkout.md](M3-tourism-experience-checkout.md) | Commerce Platform | 4–6 wk | M1, C2 | ⚪ Not Started |
| 26 | M10 | [M10-rental-deposit-connect.md](M10-rental-deposit-connect.md) | Real Estate | 4 wk | M1, C2 | ⚪ Not Started |
| 27 | M12 | [M12-consumer-pro-subscription.md](M12-consumer-pro-subscription.md) | Trips | 2–3 wk | C3 | ⚪ Not Started |

## TIER R5 — AI monetization (months 6–18)

A1–A10 specs live in [`docs/strategy/index-revenue.md`](../../docs/strategy/index-revenue.md) only — **do not import to Linear** until task files exist under `tasks/revenue/`.

---

## Linear label quick reference

| Task group | `linear_labels` |
|------------|-----------------|
| C2,C3,C4,C11,C12,C15,M1,M3,M4,M10 | `phase:post-mvp`, `prefix:PAY`, `area:payments`, `stack:stripe` |
| C13,C6,C7,C8,M5 | `phase:post-mvp`, `track:intelligence`, `prefix:INT`, `stack:mastra` |
| C1,C5,C14,M2,M6,M8,M9,M11 | `phase:post-mvp`, `prefix:OPS`, `area:launch` |
| C9,C10,M7 | `phase:post-mvp`, `track:venues`, `prefix:VEN` |
| C4,C8,M10 (+ real estate) | also `track:real` |
| M12 | `phase:post-mvp`, `track:trips`, `prefix:TRP` |
| CW-* | `phase:post-mvp`, `track:venues`, `prefix:OPS`, `stack:whatsapp` |
