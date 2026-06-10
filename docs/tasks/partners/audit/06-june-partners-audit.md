---
title: "Partners Ecosystem — Forensic Audit (2026-06-06)"
auditor: Cursor (forensic)
scope:
  - tasks/design/partners/**
  - Linear project Partners (partners-032df556f9f9)
  - mdeapp disk + prod smoke
updated: 2026-06-06
verifier_run: 2026-06-06T13:05Z
verifier_skill: task-verifier
skills_loaded:
  - task-verifier
  - mde-supabase
  - copilotkitV1
  - mastra
verdict: "Planning strong · execution not started · NOT production-ready"
overall_score: 74
spec_score_avg: 76
execution_readiness_avg: 4
production_ready: false
safe_to_execute_any: false
---

# Partners Ecosystem — Forensic Audit

> **One-line verdict:** The blueprint is unusually coherent for a multi-sided platform (74% planning-correct), but **zero partner surfaces ship in code** — Roberto still has no `/host` landing, venues get 404, and SAN-683 schema blocks everything. **Not production-ready.**

**Linear project:** [Partners](https://linear.app/sanjiovani/project/partners-032df556f9f9/issues) · Epic [SAN-667](https://linear.app/sanjiovani/issue/SAN-667)

---

## Executive summary

| Dimension | Score | Dot | Real-world meaning |
|---|---:|:---:|---|
| **Blueprint / docs** | **82%** | 🟢 | Strategy is sound: one wizard, one dashboard, configure by `type`. Anti-overengineering holds. |
| **Linear hygiene** | **71%** | 🟡 | 30 issues filed under epic; dependencies implicit, milestones missing, epic stuck in Backlog. |
| **Disk ↔ spec alignment** | **68%** | 🟡 | Wireframes + 56 diagrams exist; broken path refs; stale `/broker/*` mentions; PRD still DRAFT. |
| **Code implementation** | **8%** | 🔴 | Only live pieces: `/host/event/new`, tickets, rental lead API. No `/partners`, `/venues`, `/dashboard`. |
| **Prod readiness** | **5%** | 🔴 | 8/9 partner routes 404 on prod; `/host` redirects to login (not a public landing). |
| **Will P1 succeed?** | **Yes, if gated** | 🟡 | Succeeds **only** if SAN-683 ships first + scope stays P0 (host, nightclub, broker). |

**Weighted overall: 74%** — excellent *design*, not shippable *product* yet.

---

## Tests run (2026-06-06)

| # | Test | Result | Evidence |
|---|---|:---:|---|
| T1 | Prod `chat-smoke.mjs` (Tier-1) | 🟡 PARTIAL | GET `/` 200 · rentals/events OK · **FAIL** empty POST `/api/copilotkit` → **401** (expected 400) |
| T2 | Prod partner route matrix | 🔴 FAIL | `/venues` `/partners` `/partners/signup` `/dashboard` `/sponsors` `/business/ai` `/partners/rentals` `/broker/leads` → **404** |
| T3 | Prod `/host` landing | 🔴 FAIL | **307** → `/login?next=%2Fhost` — no public marketing page |
| T4 | `mdeapp/src` route grep | 🔴 FAIL | No `app/partners/**`, `app/venues/**`, `app/dashboard/**`, `app/host/page.tsx` |
| T5 | Supabase partner schema | 🔴 FAIL | `public.leads` exists (CRM); **no** `partners`, `partner_drafts`, `organizations` (PRD §7) |
| T6 | Wireframe path audit | 🟡 WARN | Docs cite `../wireframe/` but files live in `./wireframes/` (duplicate tree under `tasks/design/wireframe/`) |
| T7 | Mermaid manifest | 🟢 PASS | 30 blocks in `_manifest.txt` + 26 PRD/revenue diagrams = **56** `.mmd`/`.svg` pairs |
| T8 | Linear project issues | 🟢 PASS | **30** issues under Partners project; SAN-666 correctly canceled → SAN-690 |
| T9 | Linear milestones | 🟢 PASS | **5** milestones on Partners project (M1–M5, created 2026-06-06) |
| T10 | Sitemap cross-check | 🟡 WARN | `/partners`, `/broker/*` marked ⚫ POST — aligns with "not built"; `/host` landing not distinguished from wizard |

---

## Grading system

| Dot | Grade | % range | Meaning |
|:---:|---|:---:|---|
| 🟢 | A | 85–100 | Spec correct, deps clear, ready to implement |
| 🟡 | B | 70–84 | Good spec; gaps, stale refs, or ordering issues |
| ⚪ | C | 55–69 | Incomplete, conflicting, or missing acceptance criteria |
| 🔴 | F | <55 | Blocker, wrong, or contradicts live stack |

**"100% correct" bar:** spec matches disk + Linear + sitemap + at least one acceptance criterion provable in code or prod. **No task in this project hits 100% today** — planning only.

---

## Critical blockers (fix before any vertical ships)

| # | Blocker | Impact | Example |
|---|---|---|---|
| B1 | **SAN-683 not started** (schema + RLS) | Signup, dashboard, leads, booking, copilot have nowhere to persist | Roberto completes wizard → data has no `partner_drafts` table |
| B2 | **No public `/host` landing** | P0 acquisition funnel broken | Host Googles "sell tickets Medellín" → hits login wall |
| B3 | **All B2B landings 404** | Venues/nightclubs can't self-serve signup | Club owner clicks "List your venue" → 404 |
| B4 | **SAN-683 in Backlog, SAN-665/690 in Todo** | Wrong execution order in Linear | Team starts signup UI before migrations |
| B5 | **PRD status = DRAFT** | No ratified acceptance gate | Disputes on verification depth, fee %, go-live rules |
| B6 | **`type=venue` overload** | Restaurant/café/nightclub/space share one param | Nightclub gets restaurant defaults unless `category` sub-field enforced |
| B7 | **Existing `public.leads` ≠ partner lead store** | SAN-684 may duplicate or collide | CRM lead row has no `partner_id`; attribution breaks |
| B8 | ~~**No MKT task for `/partners/rentals`**~~ | ✅ **Fixed 2026-06-06** — [SAN-691](https://linear.app/sanjiovani/issue/SAN-691) filed | Broker funnel now has landing owner |

---

## Missing items

| Item | Where expected | Status |
|---|---|---|
| `/partners` hub page + Linear task | `03-landing-pages.md`, `partner-journeys.md` §8 | ⚪ No SAN-* |
| `/partners/rentals` MKT task | `marketing-pages.md` #6, SAN-677 checklist | ✅ **SAN-691** (Todo, High) |
| Vertical cycles: vendor, tour, influencer | `index-partners.md` | ⚪ No SAN-67x (OK for P2/P3 but undocumented deferral) |
| Linear milestones M1–M5 | `revenue/07-linear-structure.md` | ✅ Created 2026-06-06; issues assigned |
| Explicit `blockedBy` links (683→665, etc.) | Linear issues | 🟡 **SAN-665 → blocked by SAN-683** (2026-06-06); 690 still prose-only |
| `partnerOnboardingAgent` + tools | `05-signup-wizard.md` | 🔴 Not in `mdeapp/src/mastra` |
| Dashboard wireframe (standalone) | SAN-674 claims band 05 of signup wireframe | 🟡 Exists embedded, not separate file |
| `/pricing`, `/contact`, `/partners/creator` | PRD §6.1 sitemap | ⚪ No tasks |
| Initiative "Partner Platform" | `revenue/07-linear-structure.md` | ⚪ Optional; not blocking |

---

## Doc-level corrections (cross-cutting)

| File | Issue | Correction |
|---|---|---|
| `00-INDEX.md`, `05-signup-wizard.md`, `partner-journeys.md` | Wireframe path `../wireframe/` | → `./wireframes/` (or symlink) |
| ~~`partner-journeys.md` §8 table~~ | Says SAN-665/690 "(new)" | ✅ Synced 2026-06-06 — full SAN registry |
| `revenue/07-linear-structure.md` | "Asset Management ☐ propose" | → Filed as **SAN-687**; update table |
| `partner-journeys.md` §6 | Still lists `/broker/*` as co-equal dashboard | → `/dashboard` primary; `/broker/*` alias only |
| `prd-partners.md` | `status: DRAFT` | Ratify or add "approved sections" list |
| `index-partners.md` vs PRD §3 | 11 vs 18 partner types | Add explicit "P2+ deferred types" table to PRD |
| SAN-674 description | References canceled SAN-666 | Update to SAN-690 |
| Gantt in `index-partners.md` | Copilot + Chatwoot parallel to schema | Add note: UI mock OK, **no prod writes** until 683 |

---

## Per-task audit (Linear × design spec)

### Epic & platform

| ID | Task | Dot | % | Grade | Report | Corrections |
|---|---|:---:|:---:|:---:|---|---|
| **SAN-667** | Partner Ecosystem epic | 🟡 | 78 | B+ | Epic text matches `00-INDEX.md`. **Stuck in Backlog** while 6 children are Todo. No milestones. | Move to **In Progress** when SAN-683 starts; create M1–M3 milestones; add project summary + target date |
| **SAN-674** | UX pack (wireframes + 30 SVGs) | 🟢 | 88 | A- | Deliverables **exist on disk**. Acceptance criteria **unchecked**. | Mark AC done after path fix; link SAN-690 not SAN-666; add `/partners/rentals` wireframe stub |
| **SAN-683** | Partner DB schema + RLS | 🟡 | 80 | B+ | Best-written blocker task. ERD SVG exists. **Zero migrations.** Must reconcile with `public.leads`. | **Live audit:** [`06b-supabase-audit.md`](./06b-supabase-audit.md) — extend `leads`/`bookings`, 8 net-new `partner_*` tables, 683a–e slices; **start 683a this week** |
| **SAN-684** | Lead-gen engine | 🟡 | 74 | B | Solid channel list. Depends on 683. `/api/leads/schedule-viewing` live for rentals only. | Specify `source` enum; map concierge → partner attribution; add Vitest for normalize pipeline |
| **SAN-685** | Partner AI copilot | 🟡 | 72 | B | Capability sets align with PRD §6.4. No `partnerOnboardingAgent` on disk. | Name agent in `mastra/agents/`; list exact tool names; dependency: 683 + CopilotKit provider on signup page |
| **SAN-686** | Booking system | 🟡 | 70 | B | Flow diagram good. Phase 2 for most verticals; nightclubs need it P1. | Split: **P1** = request/HITL/notify only; **P2** = Stripe paid bookings |
| **SAN-687** | Brand assets + Postiz | 🟡 | 70 | B | Matches `revenue/06-assets-and-social.md`. Postiz is Phase 2 per anti-overengineering. | Confirm Postiz env on Vercel before task starts; HITL publish gate in AC |
| **SAN-688** | Data intelligence | 🟡 | 72 | B | OpenClaw + Places + FieldMask called out. Good compliance notes. | Tie to existing `venue_signals`; don't rebuild ingestion |
| **SAN-689** | Chatwoot + WhatsApp | ⚪ | 65 | C+ | Medellín-realistic channel. **No Chatwoot wiring in mdeapp.** | Add spike AC: inbox ID + webhook route; defer auto-reply until 685 |

### Horizontal product (pages + shell)

| ID | Task | Dot | % | Grade | Report | Corrections |
|---|---|:---:|:---:|:---:|---|---|
| **SAN-660** | `/host` landing | 🟡 | 72 | B | Wireframe A·92. **Prod: login redirect, not landing.** `/host/event/new` is live wizard. | Add `app/host/page.tsx` **public** marketing shell; CTA → signup or wizard; auth only on publish |
| **SAN-661** | `/venues` landing | 🟡 | 70 | B | Wireframe ready. **404 prod.** One page for restaurant/café/nightclub via `?v=`. | Implement `?v=restaurant\|cafe\|nightclub\|space`; canonical meta per variant |
| **SAN-663** | `/business/ai` | ⚪ | 68 | C+ | Graded A- in marketing-pages. 404 prod. Phase P2 in roadmap but filed Todo. | Align priority: P2 → Backlog, or elevate if agency revenue is launch-critical |
| **SAN-664** | `/sponsors` | ⚪ | 68 | C+ | B·78 grade. Pairs with `/contests` (no task). 404 prod. | Add `/contests` stub or remove from sponsor AC until CONT track ready |
| **SAN-665** | Signup wizard | 🟡 | 76 | B | **`05-signup-wizard.md` is implementation-ready.** Blocked by 683. Wireframe path drift. | Fix paths; add `partner_drafts` API routes in AC; block Todo until 683 merged |
| **SAN-690** | `/dashboard` | 🟡 | 75 | B | Decision resolved (new shell). Module matrix in `06-dashboards.md`. No code. | First slice: Overview + Leads only; 301 `/broker/*` → `/dashboard?role=broker` |
| **SAN-668** | Revenue config | 🟢 | 82 | B+ | Ticket fees + rental leads **partially live**. Sponsorship/sub TBD. | Document live fee % in task; Stripe Connect = P2 explicit |
| **SAN-669** | AI services catalog | 🟡 | 74 | B | `08-ai-services.md` complete. Packaging not wired. | Map tiers to `partner_services` rows; Free tier = 1 service cap in AC |
| **SAN-670** | Marketing automation | 🟡 | 70 | B | Lifecycle flows documented. Depends on 670+687+689. | MVP = welcome email only; defer full Mastra workflow graph |
| **SAN-671** | Contests & growth | ⚪ | 66 | C+ | Correctly secondary. `prefix:CONT` label good. | Keep Backlog until P0 vertical proves referral |
| **SAN-672** | Marketplace | 🟢 | 86 | A- | Correctly Low priority, Phase 3+. | No correction — guardrail working |
| **SAN-673** | Concierge ↔ partner wiring | 🟡 | 73 | B | `12-concierge-model.md` diagrams exist. Sponsored = labeled called out. | Add test prompt matrix to AC (events, venues, rentals); prod evidence path |

### Vertical e2e cycles (SAN-675–682)

| ID | Partner | Dot | % | Grade | Real-world example | Corrections |
|---|---|:---:|:---:|:---:|---|---|
| **SAN-675** | Event host | 🟡 | 74 | B | Roberto lands on `/host`, signs up, publishes salsa night, sees ticket revenue in dashboard | Depends: 660+665+690+668+683. Add "first ticket sold" prod evidence to AC |
| **SAN-676** | Nightclub/bar | 🟡 | 72 | B | Provenza club lists venue, enables recurring-night ingest, fills Tuesday salsa | OpenClaw step = P1.5 not P1 unless ingest proven; pair with 688 |
| **SAN-677** | Broker | 🟡 | 74 | B | Broker lists Laureles 2BR, Camila schedules viewing, lead fee hits ledger | Landing → **SAN-691**; bulk import = P2 slice |
| **SAN-678** | Restaurant | 🟡 | 70 | B | Rooftop in El Poblado gets reservations via concierge | Booking (686) is P2 for restaurants — mark AC "lead-only" for P1 |
| **SAN-679** | Café | 🟡 | 69 | B | Nomad finds quiet wifi café in Laureles via concierge | P1 — keep in Backlog until 676/675 prove venue pipeline |
| **SAN-680** | Venue/space | 🟡 | 69 | B | Corporate event books a loft for 80 guests | Space booking = 686; defer past restaurant vertical |
| **SAN-681** | Sponsor | ⚪ | 67 | C+ | Brand sponsors a salsa festival; labeled placement in chat | Patricia-review gate in wizard — add admin route AC |
| **SAN-682** | Agency | ⚪ | 65 | C+ | Local restaurant chain buys AI + Postiz retainer | Keep P2; don't block P0 on agency revenue |

### Canceled / retired

| ID | Task | Dot | % | Note |
|---|---|:---:|:---:|---|
| **SAN-666** | Dashboard (old) | ⚪ | — | Correctly canceled; use **SAN-690** only |

---

## Design doc scores (tasks/design/partners)

| Doc | Dot | % | Corrections |
|---|:---:|:---:|---|
| `00-INDEX.md` | 🟢 | 90 | Fix wireframe paths |
| `index-partners.md` | 🟢 | 88 | Add vendor/tour/influencer "deferred" row |
| `prd-partners.md` | 🟡 | 82 | Exit DRAFT; resolve open questions §12 |
| `02-stakeholder-audit.md` | 🟢 | 90 | — |
| `03-landing-pages.md` | 🟢 | 86 | File missing Linear tasks for hub/rentals/pricing |
| `04-journey-maps.md` | 🟢 | 88 | 10 journeys + SVGs verified |
| `05-signup-wizard.md` | 🟢 | 87 | Add API contract appendix (`partner_drafts`) |
| `06-dashboards.md` | 🟢 | 85 | Add mobile nav pattern (sheet) |
| `07-revenue.md` | 🟢 | 84 | Pin actual ticket fee % from Stripe config |
| `08-ai-services.md` | 🟡 | 80 | Tie each service to existing Mastra tool or "net-new" flag |
| `09-marketing-automation.md` | 🟡 | 78 | — |
| `10-contests-growth.md` | 🟡 | 76 | — |
| `11-marketplace.md` | 🟢 | 86 | — |
| `12-concierge-model.md` | 🟡 | 80 | — |
| `13-roadmap.md` | 🟢 | 88 | — |
| `revenue/*` (8 docs) | 🟡 | 79 | Update `07-linear-structure.md` stale rows |
| Wireframes (3 HTML) | 🟢 | 92 | Best artifact in the pack |
| Diagrams (56 SVG) | 🟢 | 91 | PRD diagrams not in `_manifest.txt` — add or document separately |

**Docs pack average: 85%** 🟢

---

## Will the program succeed?

| Question | Answer |
|---|---|
| **Is the architecture right?** | **Yes.** One wizard + one dashboard + config by `type` avoids the #1 marketplace failure mode (8 bespoke portals). |
| **Is the scope realistic for Cycle 1?** | **Only P0 slice:** SAN-683 → SAN-665 → SAN-690 → SAN-660 → SAN-675 + SAN-668. Nightclub (676) and broker (677) are stretch. |
| **Biggest execution risk?** | Starting UI before schema; building Postiz/Chatwoot/OpenClaw before first paid ticket/lead. |
| **Biggest revenue risk?** | Thin supply — docs acknowledge; needs manual seeding of 10–20 P0 partners. |
| **Prod launch date honest take?** | Earliest shippable P0 vertical (Roberto host): **~3–4 weeks** after SAN-683 merges, assuming single-agent focus. |

---

## Production readiness checklist

| Gate | Status | Dot |
|---|:---:|:---:|
| Public marketing landings live | ❌ | 🔴 |
| Signup wizard persists data | ❌ | 🔴 |
| Partner RLS schema migrated | ❌ | 🔴 |
| Unified dashboard | ❌ | 🔴 |
| Ticket fee + rental lead monetization | ✅ partial | 🟡 |
| Concierge routes to partner inventory | ✅ partial | 🟡 |
| Prod partner journey evidence | ❌ | 🔴 |
| PRD ratified | ❌ | 🔴 |

**Production-ready: NO** 🔴 (5% — monetization primitives only)

---

## Recommended next steps (ordered)

### Week 1 — Foundation (unblock everything)

1. **Start SAN-683** — migration + RLS + types; reconcile `leads` table design.
2. **Ratify PRD** — close §12 open questions (verification depth, fee %, go-live threshold).
3. **Linear hygiene** — epic → In Progress; create milestones M1 Acquire, M2 Deliver, M3 Monetize; add `blocked by SAN-683` on 665, 690, 684.
4. ~~**File SAN-692** rentals MKT~~ → **Done:** [SAN-691](https://linear.app/sanjiovani/issue/SAN-691) `/partners/rentals`.
5. **Fix doc paths** — wireframe references → `./wireframes/`.

### Week 2 — First vertical slice (Roberto)

6. **SAN-660** — public `/host` page (not auth-gated); CTA → `/partners/signup?type=host`.
7. **SAN-665** — wizard steps 1–5 + `partner_drafts` autosave (no Postiz steps yet).
8. **SAN-690** — Overview tab only + completion score ring.
9. **SAN-675** — e2e proof: localhost + prod evidence `tasks/testing/evidence/YYYY-MM-DD/partner-host.png`.

### Week 3 — Monetize + second vertical

10. **SAN-668** — document live ticket % + lead fee in dashboard Revenue tab.
11. **SAN-661** + **SAN-676** — `/venues?v=nightclub` + recurring-night config stub.
12. **SAN-677** + rentals landing — broker lead → existing `/api/leads/schedule-viewing`.

### Defer explicitly (anti-scope-creep)

- SAN-687, 689, 670, 671, 672, 681, 682 → **Backlog** until P0 host proves GMV.
- Booking payments (686 Stripe split) → P2.

---

## Best practices (keep doing)

1. **Build once, configure many** — the strongest decision in the pack.
2. **Reuse live surfaces** — `/host/event/new`, Stripe tickets, schedule-viewing leads.
3. **HITL on money/public** — matches CLAUDE.md and Phase 1 trust bar.
4. **Gemini-only, CopilotKit 1.55.2** — stack alignment is correct.
5. **Wireframes before code** — host/venues/signup HTML de-risks UX.
6. **Per-vertical e2e Linear tasks** — checklist pattern in SAN-675–682 is excellent.
7. **Anti-overengineering table** in PRD §11 — use it as a scope veto in PR review.

## Best practices (start doing)

1. **Schema-first gate** — no Todo UI tasks until 683 is In Review.
2. **Evidence-driven Done** — each vertical needs localhost + prod screenshot (per `mdeai-testing.mdc`).
3. **One param story** — document `type` + `category` + `?v=` in a single `PARTNER-TYPES.md` enum.
4. **Milestone sync** — Gantt in `index-partners.md` should match Linear milestones.
5. **Sitemap updates** — flip routes from ⚫ POST → 🟡 MVP when branch merges.

---

## Summary scorecard

```
Planning & docs     ████████░░  82%  🟢
Linear structure    ███████░░░  71%  🟡
Spec ↔ disk         ███████░░░  68%  🟡
Implementation      █░░░░░░░░░   8%  🔴
Prod readiness      █░░░░░░░░░   5%  🔴
─────────────────────────────────────
OVERALL             ███████░░░  74%  🟡
```

**Bottom line for stakeholders:** The Partners blueprint is **better than average** and worth executing — but today it is a **design program**, not a **shipping program**. Flip SAN-683 to In Progress Monday; everything else follows.

---

## task-verifier pass — 2026-06-06 (re-run)

> **Protocol:** `task-verifier` SKILL §1–9 + `index-skills.md` routing (Done gate → `task-verifier` + `mde-supabase` for schema + `copilotkitV1`/`mastra` for agent tasks).  
> **Rubric:** `references/task-spec-rubric.md` — **Spec score** = design/Linear quality; **Execution readiness** = spec minus blockers (−15 per 🔴, cap 0).  
> **Persona impact (program):** Roberto has `/host/event/new` but no acquisition landing; venue owners and brokers have no funnel; Patricia has no partner schema to moderate.

### Stop condition

> **🛑 Not ready. These blockers must be fixed first:**
> 1. **SAN-683** — zero partner migrations on disk (`partner_drafts`, `partners`, …)
> 2. **SAN-690 still Todo without `blockedBy SAN-683`** — SAN-665 fixed 2026-06-06; add same block to 690
> 3. **No `page.tsx`** for any partner marketing route (9/11 probed MISS)
> 4. **No `partnerOnboardingAgent`** — spec names agent/tools not in `mdeapp/src/mastra`
> 5. **PRD `status: DRAFT`** — no ratified DoD
> 6. **Zero partner evidence** under `tasks/testing/evidence/`
> 7. ~~**Linear SAN-665 stale path**~~ — ✅ fixed 2026-06-06 (see Linear fixes section)

**Safe to execute any implementation task today:** **No** (only **SAN-674** doc/UX review and **SAN-683** schema design are unblocked).

---

### Verification report — 2026-06-06 · task-verifier

| Task | Spec /100 | Exec ready /100 | 🔴 | Safe? | Required fixes before code |
|---|---:|---:|---:|:---:|---|
| **SAN-667** epic | 82 | 0 | 2 | No | In Progress when 683 starts; milestones M1–M3 |
| **SAN-674** UX pack | 88 | 60 | 0 | **Doc only** | ✅ Paths fixed; flip AC when wireframes approved |
| **SAN-683** schema | 84 | 15 | 1 | **Yes (start)** | Reconcile `public.leads` vs partner leads; migration + RLS probe |
| **SAN-684** lead-gen | 76 | 0 | 1 | No | Blocked by 683; define `source` enum + partner_id FK |
| **SAN-685** copilot | 74 | 0 | 2 | No | Create `partnerOnboardingAgent`; CopilotKit on signup route |
| **SAN-686** booking | 72 | 0 | 1 | No | P1 slice = HITL request only; Stripe split = P2 |
| **SAN-687** Postiz/assets | 70 | 0 | 1 | No | Defer to P2; env spike first |
| **SAN-688** data intel | 72 | 0 | 1 | No | Extend `venue_signals`; don't duplicate OpenClaw |
| **SAN-689** Chatwoot | 68 | 0 | 1 | No | Spike webhook; defer auto-reply |
| **SAN-660** `/host` | 78 | 0 | 1 | No | `app/host/page.tsx` public; middleware exempt marketing |
| **SAN-661** `/venues` | 76 | 0 | 1 | No | `app/venues/page.tsx` + `?v=` variants |
| **SAN-663** `/business/ai` | 70 | 0 | 0 | No | Align Todo vs P2 roadmap priority |
| **SAN-664** `/sponsors` | 68 | 0 | 0 | No | `/contests` dependency explicit |
| **SAN-665** signup | 84 | 5 | 1 | No | ✅ Paths + `blockedBy 683`; UI mock OK parallel to schema |
| **SAN-690** dashboard | 78 | 0 | 2 | No | Block until 683; Overview-only MVP |
| **SAN-668** revenue | 82 | 25 | 0 | Partial | Tickets + schedule-viewing live; dashboard config missing |
| **SAN-669** AI catalog | 74 | 0 | 1 | No | Map tiers → `partner_services` after 683 |
| **SAN-670** automation | 70 | 0 | 1 | No | Welcome email only for MVP |
| **SAN-671** contests | 66 | 0 | 0 | No | Stay Backlog |
| **SAN-672** marketplace | 88 | 0 | 0 | No | Correctly deferred — no code |
| **SAN-673** concierge wire | 74 | 0 | 0 | No | Add prod prompt matrix to AC |
| **SAN-675** host e2e | 78 | 0 | 3 | No | All horizontals + 683; prod evidence AC |
| **SAN-676** nightclub e2e | 74 | 0 | 3 | No | OpenClaw = P1.5 |
| **SAN-691** `/partners/rentals` | 80 | 0 | 1 | No | Public landing page; wireframe TBD |
| **SAN-677** broker e2e | 74 | 0 | 2 | No | ✅ Landing → SAN-691; dashboard → SAN-690 |
| **SAN-678** restaurant | 70 | 0 | 2 | No | Lead-only P1 |
| **SAN-679** café | 68 | 0 | 2 | No | After venue pipeline |
| **SAN-680** venue space | 68 | 0 | 2 | No | After restaurant |
| **SAN-681** sponsor | 66 | 0 | 2 | No | Admin review gate AC |
| **SAN-682** agency | 64 | 0 | 2 | No | P2 explicit |
| **SAN-666** (canceled) | — | — | — | — | Use SAN-690 only |

**Averages:** Spec **76/100** (B) · Execution readiness **4/100** (F) — blockers dominate.

---

### Claims verified (disk / prod probes)

| Claim | Probe | Result |
|---|---|---|
| CopilotKit **1.55.2** pinned | `node -p require package.json` | ✅ `1.55.2` |
| Host wizard route exists | `ls mdeapp/src/app/host/event/new/page.tsx` | ✅ OK |
| Host events list exists | `ls mdeapp/src/app/host/events/page.tsx` | ✅ OK |
| Rental lead API exists | `ls mdeapp/src/app/api/leads/schedule-viewing/route.ts` | ✅ OK |
| Empty schedule-viewing → 400 | `curl -X POST prod … -d '{}'` | ✅ **400** |
| Wireframes on disk | `tasks/design/partners/wireframes/*.html` | ✅ 3 files |
| 30 mermaid blocks + SVG | `_manifest.txt` + `find *.svg` | ✅ 30 + 56 total pairs |
| `hostEventAgent` exists | `mdeapp/src/mastra/agents/host-event.ts` | ✅ exported |
| `conciergeAgent` exists | `mdeapp/src/mastra/agents/concierge.ts` | ✅ exported |
| `public.leads` migration | `supabase/migrations/20260404120001_p1_leads.sql` | ✅ RLS enabled |
| `sponsor.organizations` (partial) | `20260512120000_sponsor_schema_edge_acl.sql` | ✅ separate schema — not PRD §7 model |
| Linear issue count | MCP `list_issues project=Partners` | ✅ **31** active + 1 canceled (SAN-691 added) |
| SAN-666 canceled | Linear status | ✅ Canceled |
| Prod `/` healthy | `chat-smoke.mjs --base prod` | ✅ GET 200, rentals/events OK |

### Claims not verified

| Claim | Reason |
|---|---|
| Empty POST `/api/copilotkit` → 400 | Prod returned **401** this run (auth middleware change?) — re-probe after deploy |
| `partnerOnboardingAgent` + tools | **grep: no matches** in `mdeapp/src` |
| Partner schema tables | **grep migrations: none** for `partner_drafts` / `partners` |
| Public `/host` marketing landing | **MISS** `app/host/page.tsx`; prod `/host` → **307 login** |
| `/venues` `/partners/signup` `/dashboard` | **MISS** all `page.tsx`; prod **404** |
| Linear `blockedBy` SAN-683 → 665 | ✅ **Set 2026-06-06**; SAN-690 still needs same |
| Milestones M1–M5 | MCP `list_milestones` → **[]** |
| Partner journey evidence | **no** `tasks/testing/evidence/*/partner*` files |
| PRD ratified | frontmatter still **`DRAFT`** |

### Stale assumptions (fix in Linear + docs)

| Stale | Current truth |
|---|---|
| ~~SAN-665 wireframe/journey paths~~ | ✅ Fixed in Linear 2026-06-06 |
| ~~SAN-674 references SAN-666 dashboard~~ | ✅ Fixed → **SAN-690** + **SAN-691** |
| `revenue/07-linear-structure.md` Asset Management ☐ | Filed as **SAN-687** |
| `/host` = marketing landing in SAN-660 AC | Today `/host` subtree is **auth-walled** (307) |
| Linear issues = shippable task specs | Missing F*.md §1–10 template; **DoD not independently provable per issue** |

---

### Anti-fake-done gate (all 30 issues — 2026-06-06)

Per `anti-fake-done-checklist.md` gates 1–9. **No issue passes gate 1.**

| Gate | Partners project status |
|---|:---:|
| 1 Implementation on disk | 🔴 0/29 implementation tasks |
| 2 Tests pass (new) | 🔴 N/A — no new code |
| 3 Build passes | ⚪ Not probed (no partner code) |
| 4 Lint | ⚪ N/A |
| 5 INDEX.md sync | ⚪ N/A — SAN-* not in `tasks/INDEX.md` |
| 6 Evidence file | 🔴 None |
| 7 Blockers clear | 🔴 7 program blockers open |
| 8 External verify (prod) | 🔴 Partner routes 404 |
| 9 Localhost proof | 🔴 No partner surfaces to probe |

**Done verdict for entire Partners project:** **0 issues may flip Done.** SAN-674 may flip **In Review** after doc path fixes only.

---

### Scope validation (task-verifier §4)

| Rule | Partners pack | Verdict |
|---|---|:---:|
| Phase 1 English only | All docs English | ✅ |
| Gemini-only prod AI | PRD §8 + agent `FLASH_MODEL` | ✅ |
| CopilotKit 1.55.2 v1 | package.json + PRD | ✅ |
| No Phase 3 marketplace early | SAN-672 Low/Backlog | ✅ |
| Postiz/OpenClaw/Chatwoot deferred | PRD §11 says wait — but SAN-687/689 in same Gantt as P1 | 🟡 Gantt over-parallel |
| Service-role F13 carve-out documented | PRD §7 + 06-dashboards | ✅ |

---

### Commands — before execution (first implementer)

```bash
# 1. Schema design gate (SAN-683)
cd /home/sk/mdeai/mdeapp && rg "CREATE TABLE.*leads" supabase/migrations/

# 2. Route baseline (should all MISS until built)
for r in host partners/signup dashboard venues; do
  test -f "src/app/$r/page.tsx" && echo "UNEXPECTED $r" || echo "EXPECTED MISS $r"
done

# 3. Agent inventory (no partnerOnboarding yet)
rg "export.*Agent" src/mastra/agents/index.ts

# 4. After SAN-683 migration lands
npm test -- --run partner   # once tests exist
npm run floor
```

### Commands — after each task (Done gate)

```bash
cd /home/sk/mdeai/mdeapp && npm run dev   # clean boot
curl -s -o /dev/null -w "localhost %{http_code}\n" http://localhost:3001/<route>
node /home/sk/mdeai/tasks/testing/scripts/chat-smoke.mjs --base http://localhost:3001
# + Browser/Playwright per mdeai-testing.mdc
# + prod tier-1 when persona-visible
```

---

### task-verifier delta vs initial audit

| Finding | New in re-run? |
|---|---|
| SAN-665 cites **nonexistent** `tasks/design/docs/partner-journeys.md` | ✅ **New** |
| Wireframes duplicated in `tasks/design/wireframe/` **and** `partners/wireframes/` | ✅ **New** |
| `hostEventAgent` exists but **not** `partnerOnboardingAgent` | ✅ Confirmed |
| `/host/event/new` prod **307** (auth) — wizard not anonymous | ✅ **New nuance** |
| `schedule-viewing` prod **400** on empty body | ✅ API alive |
| Dual-score rubric (spec 76 vs exec 4) | ✅ **New section** |
| Anti-fake-done: **0/29** pass gate 1 | ✅ **New section** |

**Re-verified overall: 74% planning · 4% execution-ready** — unchanged headline, stronger evidence trail.

---

## Linear fixes applied — 2026-06-06

| Action | Issue | Change |
|---|---|---|
| Path + spec refresh | [SAN-665](https://linear.app/sanjiovani/issue/SAN-665) | Wireframe → `partners/wireframes/`; journeys → `partners/partner-journeys.md`; 10-step AC; **`blockedBy SAN-683`** |
| Stale refs removed | [SAN-674](https://linear.app/sanjiovani/issue/SAN-674) | SAN-666 → **SAN-690**; added SAN-691 rentals wireframe slot |
| **New MKT task** | [SAN-691](https://linear.app/sanjiovani/issue/SAN-691) | `/partners/rentals` landing · Todo · High · `ptr:broker` |
| Broker vertical link | [SAN-677](https://linear.app/sanjiovani/issue/SAN-677) | Landing checklist → SAN-691; dashboard → SAN-690 (not SAN-666) |

**Partners project issue count:** 31 active (+ SAN-666 canceled).

---

*Audit generated 2026-06-06 · Initial forensic pass + task-verifier re-run + Linear hygiene · Evidence: Linear MCP, prod curl, chat-smoke, disk grep, sitemap.md, supabase migrations, `index-skills.md` routing.*

---

## Opus verification + skill attachment — 2026-06-06

> Re-verified the audit against disk + Linear. **~90% correct.** Acknowledged the "Linear fixes applied" section (SAN-665 path, SAN-674→690, **SAN-691** rentals, SAN-677 link) — all confirmed done. Remaining corrections + the skill attachment below.

### Corrections (not yet captured above)
1. **`blockedBy` IS wired** (earlier sections call it "prose-only/not-set" — stale): `683→665/690`, `690→668`, `683/690→686`, `665/690/668→675`, `675→676–680`, `675/669→681–682`. Only the status mismatch remained → **683 moved to Todo**.
2. **SAN-662 was misidentified** as `/partners/rentals`. It is the **About page**, and it was **orphaned** (UX project, no epic parent, no PTR) — the Cursor pass missed this. `/partners/rentals` is correctly now **SAN-691**. **Fix applied:** 662 moved to Partners + parented to SAN-667 + PTR.
3. **SAN-666 dangling refs** remained in the **epic (667) body and verticals 675–682** (Cursor only swept 674/677). **Swept → SAN-690.**

### Skill attachment — every task gets build + verify skills
**"Create field in Linear":** custom fields are **not creatable via the MCP/API** (admin-UI only). Mechanism: a **`Skills:`** line in each issue description + this authoritative mapping. Every task's verify set includes **`task-verifier`** (Done gate).

| Task | Build skill(s) | Verify skill(s) |
|---|---|---|
| 667 epic | `mde-task-lifecycle` | `task-verifier` |
| 683 schema | `mde-supabase` | `task-verifier` · `mde-supabase` |
| 684 lead-gen | `mde-supabase` · `mastra` | `task-verifier` · `testing` |
| 685 copilot | `copilotkitV1` · `mastra` | `task-verifier` · `mastra-smoke-test` |
| 686 booking | `mde-supabase` · `mastra` | `task-verifier` · `testing` |
| 687 assets+social | `mastra` · `mde-supabase` | `task-verifier` |
| 688 data intel | `mde-supabase` · `mde-maps` | `task-verifier` |
| 689 Chatwoot | `chatwoot-cli` · `mastra` | `task-verifier` |
| 668 revenue | `mde-supabase` (Stripe) | `task-verifier` · `testing` |
| 669 AI services | `mastra` | `task-verifier` |
| 670 automation | `mastra` · `chatwoot-cli` | `task-verifier` |
| 671 contests | `mde-supabase` · `shadcn` | `task-verifier` |
| 672 marketplace | `medusa` · `mde-supabase` | `task-verifier` |
| 673 concierge wiring | `mastra` · `copilotkitV1` | `task-verifier` · `mastra-smoke-test` |
| 665 signup | `copilotkitV1` · `mastra` · `shadcn` | `task-verifier` · `testing` |
| 690 dashboard | `shadcn` · `copilotkitV1` | `task-verifier` · `playwright-cli` |
| 660/661/662/663/664 landings | `shadcn` · `tailwind-best-practices` | `task-verifier` · `playwright-cli` |
| 691 /partners/rentals | `shadcn` · `mde-real-estate` | `task-verifier` · `playwright-cli` |
| 674 UX pack | `mermaid-diagrams` · `shadcn` | `task-verifier` |
| 675 host e2e | `mde-task-lifecycle` · `copilotkitV1` | `task-verifier` · `playwright-cli` |
| 676/678/679/680 venue verticals | `mde-task-lifecycle` · `mde-supabase` · `shadcn` | `task-verifier` · `playwright-cli` |
| 677 broker e2e | `mde-task-lifecycle` · `mde-real-estate` | `task-verifier` · `playwright-cli` |
| 681/682 sponsor·agency | `mde-task-lifecycle` · `mastra` | `task-verifier` |

All listed skills exist under `.claude/skills/` (verified). `Skills:` line applied to touched issues; mapping above is the source of truth for the rest (propagation offered).

