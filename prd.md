---
title: mdeai.co — New Platform PRD (v6.0) — Index
date: 2026-05-30
status: Active (implementation in flight)
progress_audit: progress/may30.md
chunked: yes (v7 — 10 canonical parts under /home/sk/mdeai/plan/prd/)
doc_system: ../plan/prd/README.md
execution_plan: plan.md
task_index: docs/tasks/INDEX.md
mvp_exit: docs/tasks/MVP-REQUIRED.md
supersedes: prior single-file prd; plan/{01-copilotkit-plan,02-repo-plan,03-repo-plan}.md
preserves: docs/prd.md v5.1 personas + revenue model + market positioning
---

# mdeai.co — New Platform PRD (v6.0) — Index

> **One-paragraph summary.** Build a brand-new Next.js 16 app at `/home/sk/mdeai/mdeapp/` on top of `CopilotKit/examples/integrations/mastra/`. Reuse the live Supabase project, Stripe, and Maps API keys. Replace ~2,400 LoC of legacy custom AI glue with CopilotKit primitives + shared Zod contracts + ~700 LoC of irreducible mdeai code. Phase 1 ships Roberto’s event-host pilot (W3–4), Camila’s rentals + unified `/chat` (W5–7), edge-function forensic + tests (W8–9), traffic cutover (W10–12 realistic). OpenClaw, sponsor marketplace, and contests are deferred — architecture leaves approval + outbox seams so they land without rewrite.

> **PRD v7 (2026-05-21):** [`plan/prd/README.md`](../plan/prd/README.md) — **10 canonical docs** + [`00-forensic-audit`](../plan/prd/00-forensic-audit.md).

> **Live status (2026-05-30 audit):** Planning **82/100** · Implementation **~72/100** (forensic) · **MVP exit: No-Go** until G1/G3/EVP-001 + UX P0 — [`progress/may30.md`](./progress/may30.md) · [`checklist.md`](./checklist.md).

> **PR track:** PR-1 → PR-5 largely landed in `main`; remaining = **prod proofs** not greenfield scaffold — [`roadmap.md`](./roadmap.md#repo-first-pr-track).

---

## Audit verdict (planning vs code)

| Claim | Status (2026-05-30) |
|-------|---------------------|
| Strategy & architecture docs | **Strong** — use as source of truth for *how* to build |
| `mdeapp/` matches full PRD vision | **Partial** — `/`, `/chat`, host wizard, ticketing code, maps, 7 agents; **exit proofs** open |
| Safe to call platform production-ready | **No** — floor green; **G1, EVP-003/013, G3, EVP-001, UX P0, F32/MAP prod** not closed |

**Do not** mark tasks Done without the gates in [Definition of Done](#definition-of-done) below.

---

## Repo truth (`mdeapp`, 2026-05-30)

> **Live execution order:** [`plan.md`](./plan.md) § At a glance · **Audit:** [`progress/may30.md`](./progress/may30.md) · **Skills:** [`index-skills.md`](./index-skills.md)

| Area | Built | Missing / open | Exit task |
|------|-------|----------------|-----------|
| CK + Mastra runtime | ✅ `/api/copilotkit`, 7 agents, 3 workflows, `gemini-3.5-flash` | prod proof ledger | EVP-001 |
| **`/` 3-panel + café** | ✅ F48–F50, SCREEN-021 / CAF-A5, G2 | — | G2 🟢 |
| Generative cards + pins | ✅ rentals + café pins | EventCard e2e **fails** SCREEN-006 | EVP-013 🔴 |
| Auth | ✅ `/login`, `/signup` | prod checklist | AUTH-011 |
| Maps | ✅ MAP-001/002/008 local | prod ADK + Map ID | MAP-002B, MAP-008B |
| Ticketing | 🟡 code + smokes | live paid row | G1, EVP-003 |
| Events host | 🟡 wizard path | prod publish row | G3, EVP-001 |
| Venues data/booking | ⚪ specs | DATA-035 seed, VEN-015+ | post-MVP tier |
| Intelligence | ⚪ specs | INT-001…005 CORE | parallel post-exit |

**Proof today:** prod shell + G2 lead + localhost smokes. **Not MVP exit:** G1 live payment evidence, G3 prod row, EVP-001 ledger.

**Screen-first index:** [`docs/tasks/05-INDEX-SCREEN-FIRST.md`](./docs/tasks/05-INDEX-SCREEN-FIRST.md)

---

## Definition of Done

Applies to every task in [`docs/tasks/INDEX.md`](./docs/tasks/INDEX.md) and every PR in the [repo-first track](./roadmap.md#repo-first-pr-track):

1. Code merged in **`mdeapp/`**  
2. Test passing (task-specified Vitest / Playwright)  
3. Localhost: `npm run dev` — affected route/API responds  
4. Evidence: screenshot, `curl`, or SQL in task changelog  
5. `npm run floor` green when floor covers the change  

Planning-only work is **Spec complete**, not **Done**.

---

## Unified platform rule (one sentence)

**Supabase owns data · Mastra owns orchestration · CopilotKit owns UI · Google Maps owns spatial display · Gemini explains — never invents geo facts.**

Module PRDs are **appendices** to this rule, not separate orchestrators:

| Module | Canonical PRD | Platform slice |
|--------|---------------|----------------|
| **Maps V2** | [`plan/maps/maps-prd.md`](../plan/maps/maps-prd.md) | MapContext, Places, Grounding, MAP-001–012 |
| **Real estate** | [`plan/real-estate/draft/prd-real-estateV2.md`](../plan/real-estate/draft/prd-real-estateV2.md) (+ [`real-estate-prd.md`](../plan/real-estate/real-estate-prd.md) for CK examples) | Rentals, leads, showings, RE-001–040 |
| **Events** | [`plan/events/events-prd.md`](../plan/events/events-prd.md) | Host wizard, ticketing, EVT edges |
| **Chat canvas** | [`docs/CHAT-CENTRAL-PLAN.md`](./docs/CHAT-CENTRAL-PLAN.md) | Three-panel `/chat`, `ToolResponse` envelope |

**Runtime simplification (mandatory):** one `routerAgent` + **workflows** (`rental-search`, `venue-discovery`, `nearby-intel`, `search-grounded-places` tool) — **not** 20+ module-specific agents listed in draft PRDs.

---

## Readiness scores (2026-05-30 audit)

| Dimension | /100 | Notes |
|-----------|-----:|-------|
| Architecture (design) | **82** | Correct lanes; one router + workflows |
| Implementation (mdeapp) | **72** | Forensic — [`progress/may30.md`](./progress/may30.md); not MVP exit |
| Maps architecture | **88** | `maps-prd.md`; prod MAP-002B/008B open |
| AI architecture (CK+Mastra) | **88** | 7 agents + tools; UX errors on prod open |
| Testing / floor | **82** | **313** Vitest; floor exit 0 |
| Operational readiness (prod) | **68** | www up; commerce + UX proofs missing |
| **Platform weighted today** | **~72** | **No-Go** until Tier 1 + 1C |
| **Target at MVP exit** | **~85** | G1+G2+G3 ledger + F32 + UX P0 + MAP prod |

Full rubric: [`plan/unified-execution-review.md` §9](../plan/unified-execution-review.md#9-scores-100).

---

## Conflicts resolved (read before coding)

| Topic | Old PRD text | **Ruling** |
|-------|--------------|------------|
| UI language | Part I vision: Spanish first | **Phase 1 = English only** per `CLAUDE.md`; Spanish Phase 2 |
| Agent count | Part III: 7 agents reused | **Ship 2–3** in MVP; rest are workflows/tools |
| Chat home | Vision: one canvas at `/` | **Target `/chat` three-panel**; `/` sidebar is W1 stub |
| Maps agents | maps-prd §6.6 roster | **Tools on router** until post-MVP |
| Events agents | events-prd §5 matrix | **hostEventAgent + discovery workflow**; defer Vendor/Marketing agents |
| Week 10 cutover | Part VIII | **Treat as 12–14w** unless MAP-001 + ticket E2E slip left |

---

## Highest ROI — repo-first PR track

| PR | Build | Proof |
|----|-------|-------|
| **PR-1** | `src/platform/` + MAP-001 + `/chat` shell | Pins visible; Vitest schemas |
| **PR-2** | Grounding tool + attribution + quota log | Grounded query + “Google Maps” badge |
| **PR-3** | Roberto wizard + HITL | `events` + tiers after approve |
| **PR-4** | Ticket checkout + webhook + wallet | `event_orders.status = paid` |
| **PR-5** | Rentals workflow + listings + lead | ≤5 cards, pins, `leads` row |

Do **not** start PR-3 until PR-1 is green. Details: [`roadmap.md` § Repo-first PR track](./roadmap.md#repo-first-pr-track) · [`plan/docs/prd-audit-report.md`](../plan/docs/prd-audit-report.md).

---

## Read order (v7 canonical system)

**Start:** [`plan/prd/README.md`](../plan/prd/README.md) → [`plan/prd/00-forensic-audit.md`](../plan/prd/00-forensic-audit.md) → implement from [`07-contracts-schemas.md`](../plan/prd/07-contracts-schemas.md).

| # | File | Purpose | Audience |
|---|------|---------|----------|
| **0** | [00-forensic-audit.md](../plan/prd/00-forensic-audit.md) | Scores, risks, cuts, all subsidiary reports | CTO, leads |
| **1** | [01-executive-strategy.md](../plan/prd/01-executive-strategy.md) | Vision, MVP, scope rules | Founders, product |
| **2** | [02-core-architecture.md](../plan/prd/02-core-architecture.md) | Lanes, boundaries | Architects |
| **3** | [03-runtime-orchestration.md](../plan/prd/03-runtime-orchestration.md) | CK + Mastra + agents | AI engineers |
| **4** | [04-maps-grounding.md](../plan/prd/04-maps-grounding.md) | MAP-001–012, `/chat` map | Maps engineers |
| **5** | [05-events-ticketing.md](../plan/prd/05-events-ticketing.md) | Roberto + Stripe | Events engineers |
| **6** | [06-rentals-leads.md](../plan/prd/06-rentals-leads.md) | Camila + leads | RE engineers |
| **7** | [07-contracts-schemas.md](../plan/prd/07-contracts-schemas.md) | **PR-1 entry** — Zod contracts | All engineers |
| **8** | [08-repo-code-organization.md](../plan/prd/08-repo-code-organization.md) | `mdeapp/` + `platform/` tree | All engineers |
| **9** | [09-operations-security.md](../plan/prd/09-operations-security.md) | RLS, ops, MCP, HITL | Ops, security |
| **10** | [10-delivery-roadmap.md](../plan/prd/10-delivery-roadmap.md) | PR-1–5, Done gates, weeks | PM, eng leads |
| — | [roadmap.md](./roadmap.md) | Living Now/Next/Later | everyone |
| — | [advanced.md](./advanced.md) | Post-MVP / forbidden scope | product |
| — | [_legacy/](../plan/prd/_legacy/) | v6 chunks (archived) | historical only |
| — | [plan/docs/README.md](../plan/docs/README.md) | Draft bundle 01–03 — **not canonical** | optional |

---

## Shared code target (`mdeapp/src/platform/`)

Cross-vertical contracts and map/chat glue — **one import surface** (see unified review §4):

- `platform/contracts/` — `MapPin`, `ToolResponse`, `EventDraft`, approvals  
- `platform/maps/` — `MapContext`, `normalize-tool-output`, field masks  
- `platform/cards/` — Rental, Event, Place, GroundingAttribution  
- `platform/places/` — server `places-client` (used by Mastra tools → edge proxy)

Defer `packages/types/` monorepo until edge + app + mastra all import the same schemas.

---

## Decisions waiting on user (full list in part X)

1. Repo path: `/home/sk/mdeai/mdeapp/`?
2. `/home/sk/mdeai-app/` (half-built earlier): move / delete / keep as scratch?
3. GitHub repo: `mdeai/mdeai-app` private?
4. Vercel: new project or share existing?
5. Legacy hard-freeze date: end of week 1?
6. `clawg-ui` + `clawpilot` (user-supplied): clone-and-review or defer?

Once answered → tasks 1–10 (week 1) per [prd/08-delivery.md](../plan/prd/08-delivery.md) §51, then **MAP-001** per [maps-prd.md](../plan/maps/maps-prd.md).

---

## Repo-first index

**All reference repos + CopilotKit examples + grades:** [`index.md`](./index.md)

## Related plans

| Doc | What it covers |
|---|---|
| [**index.md**](./index.md) | **Repo-first master index** — CK examples, github/maps, github/events, scores |
| [**unified-execution-review.md**](../plan/unified-execution-review.md) | Forensic review (superseded by `plan/prd/00-forensic-audit`) |
| [maps/maps-prd.md](../plan/maps/maps-prd.md) | Google Maps V2 implementation (MAP-001–012) |
| [events/events-prd.md](../plan/events/events-prd.md) | Events module (agents trimmed in review) |
| [real-estate/draft/prd-real-estateV2.md](../plan/real-estate/draft/prd-real-estateV2.md) | Rentals product + Mastra architecture |
| [01-copilotkit-plan.md](../plan/01-copilotkit-plan.md) | Week-1 day-by-day bootstrap |
| [02-repo-plan.md](../plan/02-repo-plan.md) | Top-20 repo grading + reuse matrix |
| [03-repo-plan.md](../plan/03-repo-plan.md) | Repo strategy v2 |
| [CHAT-CENTRAL-PLAN.md](./docs/CHAT-CENTRAL-PLAN.md) | Three-panel chat + ToolResponse moat |
| [100-AUDIT-FORENSIC-ARCHITECTURE-2026-05-19.md](./docs/100-AUDIT-FORENSIC-ARCHITECTURE-2026-05-19.md) | Option D (greenfield) |
| [docs/prd.md](./docs/prd.md) | Legacy v5.1 PRD (personas + revenue preserved) |
