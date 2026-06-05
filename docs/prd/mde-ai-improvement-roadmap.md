# MDE AI — Phased Improvement Roadmap

> A build plan to take MDE AI from "great foundation, ~20% built" to a **revenue-generating, WhatsApp-native, Medellín-expert AI concierge** across Trips, Rentals, Restaurants, Cafés, and Nightlife — with booking + payment, deeper search, and a growth engine.
> **Grounded in current state (2026-06):** Venues vertical live (Nightlife ~70%, Restaurants ~55%), Rentals in progress (~10%), Trips blocked (~5%), 63 PRs merged, MVP ~17–24% complete. Engineering best-practices grade **B+**; DB/Maps/Next.js at A-level.
> **Companion docs:** [`strategic-audit.md`](../strategic-audit.md), [`task-backlog.md`](../task-backlog.md), [`revenue-engine-prd.md`](revenue-engine-prd.md), [`chatwoot-integration-plan.md`](chatwoot-integration-plan.md), [`commerce-marketplace-master-plan.md`](commerce-marketplace-master-plan.md).
> **Revenue execution order (authoritative):** [`INDEX-revenue.md`](https://github.com/amo-tech-ai/mdeai/blob/main/tasks/revenue/INDEX-revenue.md) in the **mdeai** planning repo — R1 = **C13 → C1 → C2** before R2+; this roadmap’s phases are narrative sequencing, not the Linear import order.

## The throughline

The foundation is A-grade — improvement is **not** a rebuild. It's three moves repeated across every vertical:
1. **Let the AI transact** (search → book → pay), not just find.
2. **Replicate the proven Venues pattern** (listings → detail → booking → DB → status) into the other verticals.
3. **Meet users on WhatsApp** with a Medellín-expert knowledge base behind a fast, intuitive concierge.

## Tech-stack legend (used in every phase)

| Tag | Role |
|---|---|
| **CopilotKit** | Web chat UI + generative cards + maps |
| **Chatwoot** | Omnichannel inbox + human handoff + CRM |
| **WhatsApp** | Primary channel (Cloud API, opt-in, 24h-window rules) |
| **Mastra** | Agents · tools · workflows (the brain) |
| **ADK** | Grounding sidecar (verifiable places/answers) |
| **Google Maps / Places** | Discovery, geo, venue data (field-mask, single-pin-writer) |
| **Gemini** | Reasoning model (+ fallback routing) |
| **Supabase** | System of record (RLS, atomic RPCs, webhooks) |
| **pgvector** | Semantic + hybrid search, agent memory |
| **Stripe** | Payments — Checkout, wallets, Connect, Billing |
| **OpenClaw** | Compliant discovery/aggregation (no API) |
| **Postiz** | Social scheduling/automation (IG/FB) |

---

## Phase 0 — Foundations & quick wins (Weeks 1–2)

**Goal:** bank free progress and remove friction before building new features.

| Task | Tech | Outcome |
|---|---|---|
| Merge in-review **hybrid search** (listings + events) | pgvector · Supabase | Every vertical's results improve instantly — no new code |
| Add **Gemini fallback + response cache** | Mastra · Gemini | Reliability under rate-limits; lower COGS on repeat queries |
| Cap **work-in-progress** (≤4 active), daily merge ritual | process | Completion % moves in visible weekly steps |
| Extract the **"Venues recipe"** doc from real code | — | Each new vertical becomes a days-long clone, not weeks |
| Ship **model/latency budget** (stream first token <1s) | Mastra · Gemini | Perceived speed; intuitive feel |

**Real-world:** *"cozy rooftop with a view"* now returns the right spots by *meaning*, and answers stream instantly even if Gemini is throttled.
**Revenue impact:** indirect (quality + speed → conversion). **Lifts MVP ~17% → ~22%.**

---

## Phase 1 — The Transaction Layer + Venues to 100% (Weeks 2–6)

**Goal:** the concierge stops dead-ending. Search → book → **pay** in one conversation. Finish Restaurants, Cafés, Nightlife.

> **R1 gate (post-MVP):** Before `create_checkout` ships, run **C13 agent cleanup → C1 agency → C2 checkout** per [`INDEX-revenue.md`](https://github.com/amo-tech-ai/mdeai/blob/main/tasks/revenue/INDEX-revenue.md) (Linear: SAN-550 → SAN-552 → SAN-551). Phase 1 tasks below map to those specs; do not skip C13.

### Core build
| Task | Tech | Detail |
|---|---|---|
| **`create_checkout` Mastra tool** | Mastra · Stripe · CopilotKit | Agent opens a Stripe Checkout / payment link in chat (reuse the proven `ticket-checkout` edge pattern) |
| **Shared checkout + wallet widget** | CopilotKit · Stripe | Apple/Google Pay above card form (+20–50% mobile conversion) |
| **Sales Agent** (upsell/bundle/promo) | Mastra | "Add bottle service?" / "2-for-1 cover before 11pm" |
| **Booking → payment loop** for venues | Supabase · Stripe | Nightlife VIP deposit; restaurant reservation hold; webhook = truth |
| **Cafés page → live** (clone venues recipe) | Maps · Supabase · CopilotKit | Replace stub with real listings + detail + loyalty |
| **Restaurant reservation depth** | Supabase · WhatsApp | Confirmation loop, no-show handling |

### Use cases / real-world
- **Nightlife:** *"rooftop bottle service tonight"* → AI recommends → **"Reserve VIP table — $80 deposit"** → Apple Pay → confirmed in chat. *(10–15% table fee)*
- **Restaurants:** *"steakhouse for 4 at 8pm"* → book → WhatsApp confirmation → seated. *(reservation fee / retainer)*
- **Cafés:** *"specialty coffee near me, open now"* → list → loyalty punch-card. *(featured + loyalty sub)*

**Outcomes:** Payments completion 30%→~55%; Venues 60%→~90%; AI-layer grade B→B+.
**Revenue impact:** ⭐⭐⭐⭐⭐ — first transactional income (VIP fees, reservations, featured listings).

---

## Phase 2 — Rentals end-to-end (Weeks 5–9)

**Goal:** turn the in-progress rentals work into a billed lead + booking engine (the expat/nomad money vertical).

| Task | Tech | Detail |
|---|---|---|
| **Rental cards in chat + map** | CopilotKit · Maps | Already in progress — finish to live |
| **Schedule-viewing modal → lead** | Supabase · Mastra | G2 capture → `leads` (RLS-scoped) |
| **Lead Agent** (qualify · enrich · route) | Mastra · pgvector | Score budget/timeline/contact; route to broker via inbox |
| **Metered lead billing** | Stripe Billing · Supabase | Charge agents per *qualified* lead ($30–$200) |
| **Mid-term rental deposit** | Stripe (Connect later) | Expat/nomad bookings |
| **Neighborhood knowledge** (safety/walkability/lifestyle) | pgvector · Supabase | Premium content that drives conversion |

**Real-world:** *"2BR in Laureles under $1,500, walkable, good for a nomad"* → AI ranks by neighborhood fit → **"Schedule viewing Saturday"** → qualified lead billed to the broker → human confirms.
**Outcomes:** Rentals 10%→~70%; new recurring revenue (lead fees + agent subscriptions $99–$299/mo).
**Revenue impact:** ⭐⭐⭐⭐ — high-WTP expat leads.

---

## Phase 3 — Trips: unblock & monetize (Weeks 8–13)

**Goal:** turn the retention layer into a **bundled booking** layer. (Currently blocked — sequence the dependency first.)

| Task | Tech | Detail |
|---|---|---|
| **Unblock:** build create-trip modal (SAN-275) | Supabase · CopilotKit | Prerequisite for the whole track |
| **Trip workspace shell** (SAN-276) | Next.js · Supabase | Owner 200 / non-owner 404; accessible tabs; mobile scroll-tabs |
| **Trip Agent** (itinerary · budget · recommend) | Mastra · Gemini · pgvector | Builds a bookable 3-day plan |
| **Trip bundles → one checkout** | Stripe (separate charges & transfers) | Hotel + 2 tours + dinner, paid once, split to operators |
| **Add-to-trip from any vertical** | CopilotKit · Supabase | "Add this to my trip" on cards |

**Real-world:** *"plan 3 days in Medellín, mid-budget, coffee + nightlife"* → AI builds itinerary with real bookable items → **"Book all — $340"** → one payment, operators auto-paid.
**Outcomes:** Trips 5%→~60%; highest-AOV transactions; retention + stickiness.
**Revenue impact:** ⭐⭐⭐⭐ — bundle take-rate.

---

## Phase 4 — WhatsApp-native concierge (Chatwoot) (Weeks 10–16)

**Goal:** meet Medellín where it lives. Same Mastra brain, new channel, human handoff.

| Task | Tech | Detail |
|---|---|---|
| **Chatwoot self-host** (Hetzner/Coolify) | Chatwoot | Omnichannel inbox + agent console + CSAT |
| **`/api/chatwoot-bridge`** | Mastra · n8n | HMAC verify · self-loop guard · idempotency · **24h-window check** |
| **WhatsApp Cloud API inbox** | WhatsApp · Supabase | Opt-in via `whatsapp_subscriptions`; approved templates; honor STOP |
| **Confidence-based human handoff** | Mastra · Chatwoot | Low confidence / VIP / payment → assign human + AI summary note |
| **Payment links in chat** | Stripe · Chatwoot | Book + pay inside WhatsApp |
| **IG/FB inboxes → funnel to WhatsApp** | Chatwoot | Discovery on social → booking on WA |

**Real-world:** A tourist DMs on WhatsApp *"need a table tonight + a salsa class tomorrow"* → AI handles both, sends payment links; a human concierge steps in for the VIP table. 60%+ handled by AI.
**Outcomes:** new high-intent channel; CSAT measured; re-engagement campaigns.
**Revenue impact:** ⭐⭐⭐⭐ — highest-conversion surface in Colombia.

---

## Phase 5 — Medellín expert knowledge base + deeper search + speed (Weeks 12–18)

**Goal:** make the concierge feel like a **local expert**, with fast, intuitive, trustworthy answers.

| Task | Tech | Detail |
|---|---|---|
| **Medellín knowledge base** (neighborhoods, etiquette, safety, seasonality, hidden gems) | pgvector · Supabase | Curated + embedded; the "leading expert" layer |
| **Deeper hybrid + semantic search** | pgvector · ADK | Keyword + vector + grounded places; intent-aware |
| **Agent memory** (`agent_memory`) | pgvector · Mastra | Remembers prefs: veggie, no reggaeton, budget |
| **ADK grounding → A-grade on prod** | ADK · Maps | Verifiable answers; lower hallucination |
| **Speed: caching, prefetch, streaming** | Supabase · Mastra | First token <1s; cached place details; prefetch map pins |
| **Intuitive flows** | CopilotKit · UX | "Next best action" chips; comparison views; empty-state prompts |

**Real-world:** *"where do locals actually eat in Envigado, not tourist traps?"* → expert-grounded answer with real open-now spots, remembers she's vegetarian, one tap to book.
**Outcomes:** trust + retention + conversion; search quality A-grade; faster, easier UX.
**Revenue impact:** ⭐⭐⭐ (multiplier on every vertical).

---

## Phase 6 — Growth & revenue engine (Weeks 14–22)

**Goal:** fill the funnel and monetize the supply side. Compliant discovery + social automation + business products.

| Task | Tech | Detail |
|---|---|---|
| **OpenClaw compliant discovery** | OpenClaw · Supabase | Find venues/operators/influencers via **official APIs + public registries + opt-in only** (no scraping; Ley 1581) |
| **Marketing Agent** | Mastra · Gemini | Generates IG/FB/WhatsApp content + campaigns |
| **Postiz social automation** | Postiz · Mastra | Schedule/post to Instagram + Facebook; dogfood = product demo |
| **Featured listings / sponsored pins** | Supabase · Maps | Self-serve `/advertise` (single-pin-writer flag) |
| **Business subscriptions + retainers** | Stripe Billing | Restaurants/venues/agents pay monthly |
| **Stripe Connect (marketplace)** | Stripe | Operator payouts + app fee → true take-rate |
| **AI agency packages** | Mastra · WhatsApp · Postiz | Sell the automation to local businesses (fastest cash) |

**Real-world:** MDE auto-posts *"Tonight in El Poblado"* to Instagram via Postiz, drives WhatsApp inquiries, books tables, and bills the venue a monthly retainer + featured placement.
**Outcomes:** demand + supply flywheel; multiple revenue streams live.
**Revenue impact:** ⭐⭐⭐⭐⭐ — services + commissions + ads compounding.

---

## Per-vertical summary (booking + payment)

| Vertical | Today | Plan target | Booking | Payment | Revenue line |
|---|---|---|---|---|---|
| **Nightlife** | ~70% live | 95% | VIP table / guest list | Stripe deposit | 10–15% table fee |
| **Restaurants** | ~55% live | 90% | Reservation | Fee / retainer | $300–$1,200/mo retainer |
| **Cafés** | stub | 80% | Loyalty / featured | Sub | $49–$149/mo |
| **Rentals** | ~10% | 70% | Viewing → lease | Lead fee / deposit | $30–$200 qualified lead |
| **Trips** | ~5% blocked | 60% | Itinerary bundle | Split checkout | Bundle take-rate |

---

## Sequencing & dependencies

```text
Phase 0  (free wins) ─┐
Phase 1  Transaction + Venues ──┬─> Phase 2  Rentals ──┐
                                │                       ├─> Phase 6  Growth/Revenue
Phase 3  Trips (needs SAN-275) ─┘                       │
Phase 4  WhatsApp/Chatwoot ─────────────────────────────┤
Phase 5  Knowledge base / search / speed ───────────────┘
```

- **Critical path to revenue:** Phase 0 → **R1 (C13→C1→C2)** → Phase 2 (lead billing) → Phase 6 (subscriptions/ads). See [`INDEX-revenue.md`](https://github.com/amo-tech-ai/mdeai/blob/main/tasks/revenue/INDEX-revenue.md).
- **Phases 4 & 5 run in parallel** once Phase 1 lands (shared Mastra brain).
- **Phase 3 (Trips) must not start before SAN-275** (create-trip modal).

---

## Goals & success metrics

| Goal | Metric | Target |
|---|---|---|
| AI can transact | % chats reaching paid checkout | > 15% |
| Replicate venues pattern | verticals fully live | 5/5 |
| WhatsApp-native | bot containment | > 60% |
| Expert knowledge | CSAT | > 4.4/5 |
| Speed | first token / search latency | <1s / <500ms |
| Revenue | MRR | services-led ramp → $10k → $50k |
| MVP completion | weighted % | ~24% → 70%+ |

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Scope spread (5 verticals at once) | Strict phase order; finish Venues before fanning out |
| WhatsApp ban (24h window / spam) | Window check in bridge; opt-in; approved templates; single sender |
| Data/privacy (Ley 1581) | First-party + official APIs + opt-in; no scraping (OpenClaw guardrails) |
| AI single-provider | Gemini + fallback routing + caching |
| Trips false start | Sequence SAN-275 first or park |
| Over-automation on social | Human review on Postiz posts; brand-safe templates |

---

## Implementation checklist (Phase 0–1, do first)

- [ ] Merge in-review hybrid search.
- [ ] Add Gemini fallback + response cache in Mastra.
- [ ] Build `create_checkout` Mastra tool (reuse ticket-checkout edge).
- [ ] Shared checkout + Apple/Google Pay widget.
- [ ] Sales Agent (upsell/bundle/promo).
- [ ] Nightlife VIP deposit + restaurant reservation hold (webhook = truth).
- [ ] Cafés page → live (clone venues recipe).
- [ ] Cap WIP ≤4; daily merge ritual; weekly Linear+GitHub scorecard.

> _Improvement Roadmap v1.1 — narrative phase order above; **Linear/import order** = [`INDEX-revenue.md`](https://github.com/amo-tech-ai/mdeai/blob/main/tasks/revenue/INDEX-revenue.md). Foundation is A-grade; the work is letting the AI transact and cloning the proven vertical pattern across Trips, Rentals, Restaurants, Cafés, Nightlife — on WhatsApp, with a Medellín-expert brain._
