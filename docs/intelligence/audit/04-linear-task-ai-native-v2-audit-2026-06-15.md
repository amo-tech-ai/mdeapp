---
title: Linear Task Audit — AI-native plan + CopilotKit v2 conformance
date: 2026-06-15
owner: ai@socialmediaville.ca
scope: Partners project (SPONS) + AI & Intelligence project
status: Audit — findings only, no task edits applied
skills_run: copilotkit · gemini · mastra · mde-supabase · mde-task-lifecycle · task-verifier
---

# Linear Task Audit — do the tasks follow the AI-native plan, and are they on CopilotKit v2?

## 0. The answer, first
**Mostly yes — with two clean-up piles in the AI & Intelligence project.** The 19 sponsorship tasks I filed match the AI-native plan and the v2 frontend. But the older AI & Intelligence backlog still carries two kinds of stale wording: (1) tasks written in **v1 CopilotKit** language even though the v2 migration is already shipped, and (2) tasks that name **extra AI agents** the product decided not to build. Neither breaks anything today — these are un-started backlog tasks — but if a developer picks one up as written, they'd build against a retired pattern.

**What it means in the real world:** No live surface is wrong. Camila's chat (`/chat`), Roberto's wizard (`/host/event/*`), and Patricia's analytics are all on v2 already. The risk is purely future: a dev (Sofía) opening `SAN-738 · CK-005 — renderAndWaitForResponse HITL for event publish` would wire a v1 hook that the codebase no longer uses, or open `SAN-750 · AGT-rentalAgent — rentalAgent: search + map pins on /rentals` and register a third agent the runtime allowlist (`SAN-591 · AGT-00D — Runtime Agent Allowlist`, Done) is built to block.

**Next step:** Approve the relabel/rewrite pass in §5 — I can re-word or close the stale tasks so the backlog reads v2 + 2-agent-clean. I have not edited any task yet.

---

## 1. What "follows the plan" means here (the rubric)
Two reference contracts, both on disk:

| Contract | Source | The rule in one line |
|---|---|---|
| **AI-native plan** | `docs/design/ai-native/AI-First Dashboard.md`, `ai-native-marketplace.md`, `docs/partners/sponsors/00-INDEX.md` | Numbers come from deterministic tools rendered as data cards; the AI writes figure-free prose; every send/spend is a HITL approval card; unknowns say "data pending". |
| **2-agent hard rule** | `docs/partners/sponsors/02-implementation-plan.md` §1; guard = `SAN-591 · AGT-00D — Runtime Agent Allowlist` (Done) | Exactly two product agents are UI-invoked: `conciergeAgent` + `hostEventAgent`. A new agent is a deliberate marketplace-tier decision, never a default. |
| **CopilotKit v2** | `docs/upgradeV2/03-copilotkitv2-upgrade-audit.md`; live on `main` (PRs #217/#219/#220/#222, commit `078a677c`) | Frontend is **v2 now** via the `/v2` subpath of `@copilotkit/react-core` `1.55.2`. v1 symbols (`useCoAgent`, `renderAndWaitForResponse`, `useCopilotAction`, `useCopilotReadable`) are retired in `src/`. |

**v1 → v2 symbol map (what "stale" means below):**

| v1 (retired in src/) | v2 (live) |
|---|---|
| `useCoAgent` | `useAgent` |
| `renderAndWaitForResponse` (HITL) | `useHumanInTheLoop` |
| `useCopilotAction` (handler) | `useFrontendTool` |
| `useCopilotAction` (`available:"disabled"` + render) | `useRenderTool` |
| `useCopilotReadable` / `useCopilotAdditionalInstructions` | `useAgentContext` |
| `@copilotkit/react-ui` + its `styles.css` | consolidated into `@copilotkit/react-core/v2` |

---

## 2. Partners project — the 19 sponsorship tasks (SPONS) — PASS
All 19 tasks I filed (`SAN-912`…`SAN-930`, label SPONS) conform. They use canonical agents, stages, tables, tools; carry the golden rule, HITL, provenance, and RLS; and reference v2 symbols where UI is implied.

| Check | Result | Evidence |
|---|---|---|
| Canonical 7-stage lifecycle (Lead→Reported) | ✅ | mirrored across SPN-002, SPN-006…SPN-010 |
| Canonical 8 tables (no `sponsorship_deals` drift) | ✅ | `SAN-912 · SPN-001 — Sponsor deal schema + RLS` names the real tables |
| RLS + ≥1 policy on every new table | ✅ | SPN-001 and `SAN-925 · SPN-014 — event_sponsor_listing schema + provenance tags` both name RLS |
| Golden rule + provenance (verified/estimated/data-pending) | ✅ | SPN-002, SPN-014, and all 3 net-new (SPN-017/018/019) carry "no invented numbers" acceptance |
| HITL on send/spend → v2 `useHumanInTheLoop` | ✅ | `SAN-917 · SPN-006` and `SAN-921 · SPN-010 — ROI report composer + HITL figures review` |
| v2 shell hook | ✅ | `SAN-914 · SPN-003 — /host/sponsors workspace shell` references `useAgent` (v2) |
| 2-agent rule honored | ✅ | `SAN-924 · SPN-013 — dedicated sponsorAgent + scorer` is explicitly tagged as the **deferred** marketplace-tier decision, not a default |

**Verdict:** No changes needed in the Partners SPONS set.

---

## 3. AI & Intelligence project — 100 issues — two clean-up piles
Status mix: 16 Done · 21 Todo · 57 Backlog · 2 In Progress · 2 Duplicate · 1 In Review · 1 Canceled. The v2 migration epic itself (`CK-V2-*`) is **done and correct** — `SAN-886 · CK-V2-000` through `SAN-891 · CK-V2-005` are the proof the frontend is v2. The drift is entirely in **older, un-started backlog** written before two decisions landed (v2 migration; 2-agent consolidation).

### 3a. Pile one — v1 CopilotKit wording, now stale (rewrite to v2 or close)
These pre-migration tasks still name retired v1 hooks. They are all Todo/Backlog (none Done), so nothing was built wrong — but the wording must move to v2.

| ID · spec | Title (verbatim) | Stale symbol | Fix |
|---|---|---|---|
| `SAN-741 · CK-008` | useCoAgent<MdeState> map pin sync from agent tool calls | `useCoAgent` | → `useAgent` |
| `SAN-739 · CK-006` | Generative rental card via useCopilotAction(available:"disabled", render) | `useCopilotAction` render | → `useRenderTool` |
| `SAN-738 · CK-005` | renderAndWaitForResponse HITL for event publish | `renderAndWaitForResponse` | → `useHumanInTheLoop` |
| `SAN-737 · CK-004` | useCopilotReadable on every route with page-specific context | `useCopilotReadable` | → `useAgentContext` |
| `SAN-740 · CK-007` | HITL booking confirmation card (price + details before Stripe charge) | `renderAndWaitForResponse` (body) | → `useHumanInTheLoop` |
| `SAN-834 · CONCIERGE-002` | Agent running status badge (useCoAgent.running + nodeName) | `useCoAgent` | → `useAgent` running state |
| `SAN-595 · AGT-01` | Native tool-approval (host publish + checkout) | `renderAndWaitForResponse` (body) | → `useHumanInTheLoop` |
| `SAN-708 · AGT-PTR-05` | Lead qualification + HITL reply draft | `renderAndWaitForResponse` (body) | → `useHumanInTheLoop` |
| `SAN-709 · AGT-PTR-03` | Onboarding copilot (/partners/signup) | `useCoAgent` (body) | → `useAgent` |
| `SAN-707 · AGT-PTR-04` | Dashboard copilot shell (/dashboard) | `useCopilotReadable` (body) | → `useAgentContext` |

### 3b. Pile two — agents beyond the two allowed (defer, don't condemn)
**Framing correction:** the rule is **2 product-facing agents NOW**, not "2 agents forever." These tasks do not "violate architecture" — they are **deferred until marketplace scale**. The runtime allowlist (`SAN-591 · AGT-00D — Runtime Agent Allowlist`, Done) is the guard that keeps any un-deferred extra agent out of production today. Each task needs one of two labels: **fold the capability into `conciergeAgent`/`hostEventAgent` as a tool cluster** (the near-term pattern), or **tag `deferred:marketplace-tier`** (like `SAN-924 · SPN-013` already does) — to be built when the sponsor/partner marketplace becomes its own domain.

| ID · spec | Names agent | Note |
|---|---|---|
| `SAN-742` (AGT-routerAgent) | routerAgent | **Superseded** — the Gemini Flash structured router (`SAN-871 · INT-023 — Gemini Flash structured router + topic switch`, Done) replaced the agent-based router. Strong close candidate. |
| `SAN-750` (AGT-rentalAgent) | rentalAgent | fold into conciergeAgent tools |
| `SAN-749` (AGT-eventAgent) | eventAgent | fold into conciergeAgent tools |
| `SAN-751` (AGT-crmAgent) | crmAgent | fold into hostEventAgent / host-ops tools |
| `SAN-748` (AGT-adminOps) | adminOpsAgent | fold into host-ops tools |
| `SAN-743` (AGT-venueAgent) | venueAgent | fold into hostEventAgent tools; also see §3c (new table, no RLS) |
| `SAN-705 · AGT-PTR-01` | partnerAgent | partner track — confirm marketplace-tier deferral or fold |
| `SAN-807 · AGT-PTR-08`, `SAN-808 · AGT-PTR-09` | partnerAgent (body) | same partner-track decision |
| `SAN-833 · CONCIERGE-001` | eventAgent + rentalAgent enum | "AvailableAgents enum for multi-domain routing" — predates 2-agent decision |
| `SAN-565` (MASTRA) | Sales Agent | fold or defer |
| `SAN-592 · AGT-03` | evaluationAgent | internal scorer-judge, not UI-invoked — **allowed** (lives in src/mastra, off the UI allowlist); listed for completeness |

### 3c. Pile three — honesty + RLS gaps (small, targeted)
| ID · spec | Gap | Fix |
|---|---|---|
| `SAN-852 · AI-INS-001 — AI Concierge Insights for admin` | user-facing analytics numbers, no provenance note | add "data pending" / verified-source acceptance |
| `SAN-808 · AGT-PTR-09 — Revenue insights tool` | Gemini narrative over revenue_ledger; AI must not type the figure | add golden-rule acceptance (numbers in cards, prose figure-free) |
| `SAN-888 · CK-V2-002 — host-analytics-prototype` | analytics prototype, no honesty note | confirm cards carry provenance; Done, so verify not rewrite |
| `SAN-383 · DATA-045 — Evidence + grounding tables` | implies new tables, no RLS mention | add RLS + ≥1 policy to acceptance |
| `SAN-743 · AGT-venueAgent` | implies new venue table, no RLS mention | add RLS + ≥1 policy |

---

## 4. On-disk doc drift (the planning packs, not Linear)
The same two stale patterns live in three doc trees. These feed future task-writing, so they propagate drift if left.

| Doc tree | Drift | Severity |
|---|---|---|
| `docs/events/tasks/AI-native-system/` | v1 throughout (`useCoAgent`, `renderAndWaitForResponse`); names `attendeeAgent` (plan.md:36, lifecycle.md:40,44,174) and `sponsorAgent` (lifecycle.md:40,205) | Medium — whole pack reads v1 + extra agents |
| `docs/partners/tasks/AGT-PTR-*` | registers `partnerAgent` "alongside conciergeAgent, hostEventAgent" as MVP (AGT-PTR-01:44); stray `partnerOnboardingAgent` (AGT-PTR-03:26); v1 patterns | **High** — the most concrete near-term 2-agent-rule violation |
| `docs/partners/sponsors/research/01-competitive-analysis.md` | names `marketplaceAgent` (162,211,220) — but line 153 reaffirms the 2-agent rule and frames extras as capability clusters | Low — self-corrects in context |
| `CLAUDE.md` (both copies) | "CopilotKit pinned at 1.55.2 — v1 imports only, migrate in Phase 2" | Medium — **superseded**; frontend is v2 now. The line misleads every future session. |
| `docs/partners/sponsors/01–10` | none — v2, canonical stages/tables/tools | ✅ clean |

---

## 4b. Strategic coverage check — the "sponsor intelligence" engines are already filed
A reviewer flagged four missing sponsor-intelligence capabilities. Checked against the SPONS backlog, **all four already exist** — under different SPN numbers. No new tasks needed; filing them would duplicate.

| Proposed engine | Already filed as | Coverage |
|---|---|---|
| Sponsor Intelligence Engine (Fit / Renewal / Opportunity scores) | `SAN-916 · SPN-005 — score_brand_fit + lead capture` (Fit) + `SAN-929 · SPN-018 — Predictive deal-health scoring` (Renewal/churn) + `SAN-928 · SPN-017 — Sponsor knowledge graph` (cross-event signal) | full — split across 3 tasks, not one engine |
| Sponsor Opportunity Listings (Anvara-style marketplace listing) | `SAN-925 · SPN-014 — event_sponsor_listing schema + provenance` + `SAN-926 · SPN-015 — Brand-side matching (match_sponsor_opportunities)` | full |
| AI Package Builder (event-type tiers, not Gold/Silver/Bronze) | `SAN-927 · SPN-016 — AI package builder (suggest_packages)` | exact match |
| Deal Health Engine (Healthy / At-Risk / Likely-Renewal / Likely-Churn) | `SAN-929 · SPN-018 — Predictive deal-health scoring (renewal/churn likelihood)` | exact match — informs-only, no auto-act, no fabricated confidence % |

**The only real gap is presentation, not capability:** the three Fit/Renewal/Opportunity scores live in three separate tasks rather than one consolidated "intelligence panel." That is a UI-grouping decision, not a missing engine — optional, and out of scope for the approved cleanup.

## 5. Recommended clean-up (awaiting approval — nothing edited yet)
1. **Relabel pile one (§3a):** rewrite 10 task titles/bodies from v1 hooks → v2 hooks. Add a `v2` label so the backlog is filterable. None are Done, so no code rework — wording only.
2. **Reconcile pile two (§3b):** for each extra-agent task, either fold into a tool cluster or tag `deferred:marketplace-tier` (the SPN-013 pattern). Close `SAN-742 · AGT-routerAgent` as superseded by `SAN-871 · INT-023`.
3. **Patch pile three (§3c):** add provenance / RLS acceptance lines to the 5 named tasks.
4. **Doc drift (§4):** fix the `CLAUDE.md` "v1 only" line first (it misleads every session); then sweep `AGT-PTR-*` and `AI-native-system` packs to v2 + 2-agent wording.

**The one thing I need from you:** say "do the relabel pass" and I'll start with the `CLAUDE.md` v1-line fix and the 10 pile-one task rewrites; or tell me which pile to leave alone.
