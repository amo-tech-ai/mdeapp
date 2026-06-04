# mdeai — Documentation Index

> The map for the mdeai docs. Two tracks: **engineering reference** (how the app is built) and the **strategy & planning corpus** (revenue, monetization, Chatwoot, commerce). Start at the TL;DR, then jump to the doc that matches your job.

## TL;DR — the one decision everything serves

**Monetize the AI concierge as a services-led business first** (AI marketing agency + lead/transaction billing on the surfaces that already exist), and let the **marketplace/commerce business compound underneath it** — revenue *before* liquidity. Every strategy doc below ladders up to that single sequencing decision.

---

## Engineering reference

| Doc | What it is |
|---|---|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | 5-minute system overview — agents, gates (G1/G2), data flow, invariants, "where do I add X?" |
| [`localhost-qa-runbook.md`](localhost-qa-runbook.md) | Local QA after Maps/grounding changes |

---

## Strategy & planning corpus

Read in this order for the full arc; each doc also stands alone.

| # | Doc | Use when | Audience |
|---|---|---|---|
| 1 | [`revenue-strategy.md`](revenue-strategy.md) | 5-minute executive view of the revenue thesis | Founders, investors |
| 2 | [`strategy/`](strategy/00-index.md) | Deep, per-phase working version (10 chunks) of the strategy | RevOps, execution |
| 3 | [`revenue-strategy-v2.md`](revenue-strategy-v2.md) | Scorecard-driven plan: ranked channels, nightlife/cafés, unit economics, paths to $10k/$50k/$100k/$1M | Founders, RevOps |
| 4 | [`prd/revenue-engine-prd.md`](prd/revenue-engine-prd.md) | How the money *moves* — revenue state machines, Stripe Checkout vs Connect, payment workflows, new revenue tables | Engineering, product |
| 5 | [`strategic-audit.md`](strategic-audit.md) | CTO audit grounded in the real codebase — scores (57/100), top-25 fixes, brutally honest CEO/CTO call | Leadership, eng |
| 6 | [`task-backlog.md`](task-backlog.md) | Prioritized Core/MVP/Advanced task cards + six Top-25 rankings | Eng, PM |
| 7 | [`prd/chatwoot-integration-plan.md`](prd/chatwoot-integration-plan.md) | Omnichannel concierge: Chatwoot as inbox + human-handoff + CRM in front of Mastra | Eng, ops |
| 8 | [`prd/chatwoot-setup-review.md`](prd/chatwoot-setup-review.md) | Production-hardening review of the Chatwoot setup plan (compliance, bridge contract, data reconciliation) | Eng, ops |
| 9 | [`prd/commerce-marketplace-master-plan.md`](prd/commerce-marketplace-master-plan.md) | MedusaJS marketplace adapted *behind* mdeai — architecture, 100+ features, schema, roadmap | Product, eng |

### Strategy chunks (folder 2 expanded)

| Chunk | Topic |
|---|---|
| [01](strategy/01-market-research.md) | Market research / competitor teardown |
| [02](strategy/02-revenue-sources.md) | Revenue sources per vertical |
| [03](strategy/03-ai-services.md) | AI services (first revenue) |
| [04](strategy/04-marketplace-strategy.md) | Marketplace model (who pays) |
| [05](strategy/05-subscription-plans.md) | Subscription tiers |
| [06](strategy/06-partnerships.md) | Partnerships |
| [07](strategy/07-lead-generation.md) | Lead-generation engine |
| [08](strategy/08-financial-model.md) | Financial model |
| [09](strategy/09-prioritization.md) | Prioritization |
| [10](strategy/10-final-recommendation.md) | Final recommendation |

---

## Read by role

| You are… | Read |
|---|---|
| **Investor / exec** (10 min) | `revenue-strategy.md` → `strategic-audit.md` (scores) → `revenue-strategy-v2.md` (paths) |
| **Founder / RevOps** | `revenue-strategy-v2.md` → `strategy/` → `task-backlog.md` |
| **Engineer / PM** | `strategic-audit.md` → `task-backlog.md` → `prd/revenue-engine-prd.md` → the relevant PRD |
| **Building Chatwoot** | `prd/chatwoot-integration-plan.md` → `prd/chatwoot-setup-review.md` |
| **Building commerce** | `prd/commerce-marketplace-master-plan.md` (+ `revenue-engine-prd.md` for Stripe) |

---

## Cross-cutting principles (true across every doc)

1. **Revenue before liquidity** — services/leads first, marketplace take-rate later.
2. **One shared Mastra brain** — same agents/tools serve web (CopilotKit), WhatsApp (Chatwoot), and commerce (Medusa). Never duplicate AI logic.
3. **Clear source of truth** — Supabase owns business objects + vector index; Chatwoot owns conversations; Medusa owns commerce objects; Stripe owns money. Integrate via API + events, never shared tables.
4. **Webhook is truth** — payment/order state flips on Stripe/Medusa webhooks, never the client.
5. **Compliance is not optional** — Ley 1581 (Habeas Data) + WhatsApp/Meta ToS; opt-in, approved templates, honor STOP, no scraping.
6. **Build headless** — adopt tools (Chatwoot, Medusa) as engines behind the mdeai brain, not separate apps.

---

## Status & provenance

- All figures are **benchmark + modeled estimates**, not signed terms — replace with partner/actuals as they land.
- The audit, backlog, and PRDs are **grounded in the real codebase** (7 Mastra agents, gates G1/G2, 80 Supabase migrations, ticketing + `sponsor.*` subsystems, no Connect/Billing yet).
- Living docs — **revisit quarterly.**

> _Docs index v1. New strategy/PRD docs should be linked here and follow the cross-cutting principles above._
