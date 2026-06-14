---
title: "AGT-PTR task pack — Mastra × CopilotKit forensic audit"
auditor: Cursor (task-verifier protocol)
updated: 2026-06-06
verifier_skill: task-verifier
skills_loaded: [task-verifier, mastra, copilotkitV1, mde-supabase]
scope:
  - tasks/mastra/partners/AGT-PTR-*.md
  - docs/partners/docs/07-ai-intelligence-partners-audit.md
  - Linear SAN-685, SAN-705–711
  - mdeapp disk (mastra, copilotkit, routes)
mcp_used: [user-mastra, project-0-mdeai-copilotkit, plugin-linear-linear]
verdict: "Strategy is ~85% correct; task specs ~72%; execution readiness ~15% — fix 6 blockers before SAN-705"
spec_score_avg: 72
execution_readiness_avg: 15
strategy_score: 85
safe_to_execute_ptr01: false
---

# AGT-PTR — Mastra × CopilotKit forensic audit

> **One-line verdict:** The **one `partnerAgent` + scoped tools + HITL** strategy is right and aligned with disk patterns (`hostEventAgent`, `host-event-copilot-bridge.tsx`). The **7 Linear issues + disk specs are directionally correct (~72%)** but **not safe to execute** until SAN-683 is on remote, CopilotKit provider nesting is designed, and **SAN-591 allowlist is re-verified on disk** (evidence claims filtering; runtime currently exposes all 7 Mastra agents).

**Persona impact:** Roberto / venue partners get **no visible change** until SAN-683 + SAN-705 + SAN-709 ship — today partner routes 404 and only `conciergeAgent` + `hostEventAgent` exist.

---

## Executive summary

| Dimension | Score | Grade | Meaning |
|---|---:|:---:|---|
| **AI strategy (07 audit)** | **85%** | 🟢 A- | Consumer vs partner split correct; defer multi-agent router |
| **Task decomposition (7 PTR)** | **72%** | 🟡 B | Right slices; dependency + CK architecture gaps |
| **Disk/MCP accuracy in specs** | **68%** | 🟡 B- | Wrong paths, stale allowlist reference, missing threadId |
| **Execution readiness** | **15%** | 🔴 F | Schema not applied; zero partner code; prod routes 404 |
| **Linear hygiene** | **78%** | 🟡 B | Issues filed; ID↔spec numbering confusing; tool verb drift |

**Weighted “are these tasks correct?” → 72%** (spec quality)  
**Weighted “can we start SAN-705 today?” → 15%** (execution readiness)

---

## Probes run (2026-06-06)

| # | Claim | Probe | Result |
|---|---|---|---|
| P1 | `partnerAgent` exists | `rg partnerAgent mdeapp/src` | 🔴 **0 hits** |
| P2 | Partner routes | `ls mdeapp/src/app/partners` | 🔴 **missing** |
| P3 | ptr migrations on disk | `ls 2026060613*.sql` | 🟢 **13 files** |
| P4 | ptr migrations on remote | `supabase migration list` Remote col empty | 🔴 **not applied** |
| P5 | CopilotKit version | `package.json` | 🟢 **1.55.2** pinned |
| P6 | Registered agents | `mastra/index.ts` | 🟢 7 agents; **no partnerAgent** |
| P7 | CK client allowlist type | `copilotkit-client-props.ts` | 🟢 `conciergeAgent \| hostEventAgent` only |
| P8 | SAN-591 runtime allowlist | `getLocalAgentsWithLogging` body | 🔴 **exposes all** `mastra.listAgents()` — no filter on disk |
| P9 | Host CK pattern | `host/event/layout.tsx` | 🟢 nested `<CopilotKit agent=hostEventAgent>` |
| P10 | Root CK provider | `app/layout.tsx` | 🟢 `MdeCopilotKitProvider` → `conciergeAgent` wraps **all** routes |
| P11 | `ai_runs` agent_type enum | `ai-runs.ts` | 🟡 `sponsor` exists; **no `partner`** — fallback `general_concierge` |
| P12 | Lead capture path | grep `schedule-viewing` | 🟢 `/api/leads/schedule-viewing` (not edge yet) |
| P13 | Linear AGT-PTR issues | `list_issues` AI project | 🟢 SAN-705–711 under SAN-685 |
| P14 | CopilotKit MCP multi-agent | `search-docs` Agent Lock | 🟢 Route-level `agent=` prop validated; **cannot nest providers** |
| P15 | 06b migration verdict | read §Opus re-verification | 🟢 SQL ready; live DB unchanged |

---

## Critical blockers (🔴 fix before SAN-705)

| # | Blocker | Why it fails | Fix |
|---|---|---|---|
| B1 | **SAN-683 not on remote** | Tools write `partner_drafts` / `partner_id` — tables absent live | Human-approved `db push` + regen `database.types.ts` |
| B2 | **CopilotKit provider nesting** | Root layout always mounts `conciergeAgent`; host nests second provider; CK docs forbid nested providers | Add **route-group architecture task**: opt partner routes out of root provider OR document proven host pattern + test POST agent key |
| B3 | **SAN-591 allowlist drift** | Evidence [`SAN-591`](../../../mastra/evidence/SAN-591-agt-00d-2026-06-06.md) says 3 agents exposed; **disk exposes all 7** | Re-implement `RUNTIME_AGENT_ALLOWLIST` in `getLocalAgentsWithLogging` **before** adding `partnerAgent` |
| B4 | **AGT-PTR-01 wrong file path** | Spec cites `lib/copilotkit/copilotkit-client-props.ts` | Correct to `mdeapp/src/lib/copilotkit-client-props.ts` |
| B5 | **AGT-PTR-04 dependency bug** | `depends_on: [SAN-705]` only; AC requires `list_partner_leads` from PTR-02 | Add **SAN-706** to `depends_on` |
| B6 | **`threadId` + `resourceId` not specified** | Partner drafts need `partner-draft:{id}` threads; root uses `ThreadNavProvider` concierge threads | PTR-03 AC: pass `threadId` on partner `<CopilotKit>`; server `resourceId` from draft id |

---

## Red flags (🟡 — won't block spec review, will block Done)

| # | Flag | Detail |
|---|---|---|
| R1 | **Linear ↔ disk tool HTTP verb** | SAN-706 Linear: `PATCH /drafts/[id]` · disk PTR-02: `POST /drafts` |
| R2 | **Agent naming drift** | SAN-665 prose: `partnerOnboardingAgent` · specs: `partnerAgent` |
| R3 | **hostEventAgent coexistence** | SAN-675 + `/host/event/new` keep `hostEventAgent`; PTR-03 `type=host` duplicates Roberto path — need **migration note** (when to deprecate host wizard agent) |
| R4 | **Telemetry mapping** | `log-agent-run.ts` has no `hostEventAgent` / `partnerAgent` entries; uses `general_concierge` fallback |
| R5 | **Task template incomplete** | PTR specs lack mde-task-lifecycle §6 sections (Purpose, Workflows, User journeys, Integrations, rollback) |
| R6 | **Sitemap gap** | `sitemap.md` has `/partners` POST only — no `/partners/signup`, `/dashboard` entries |
| R7 | **PTR-07 attribution chicken-egg** | `apartments` lack `partner_id` until `partners` bridges `landlord_profiles` — attribution needs **listing→partner map** in search tools |
| R8 | **Local db reset** | `delivery_receipts` hotfix blocks replay of ptr001–013 — shadow test still broken |
| R9 | **SAN-665 blockedBy** | Relation to SAN-709 may be description-only; verify Linear graph |

---

## Per-task forensic scorecard

Legend: **Spec** = plan correctness · **Ready** = safe to implement today · Persona = who notices

| Task | Linear | Spec | Ready | Blockers | Persona |
|---|---|---:|---:|---|---|
| AGT-PTR-01 | SAN-705 | **82** B+ | **20** | B1,B3,B4,B6 | Roberto — no agent until shipped |
| AGT-PTR-02 | SAN-706 | **80** B | **15** | B1,R1 | Partners — no DB writes |
| AGT-PTR-03 | SAN-709 | **75** B | **10** | B1,B2,B6,R3 | Signup copilot — route 404 |
| AGT-PTR-04 | SAN-707 | **68** C+ | **12** | B2,B5 | Dashboard assistant — route 404 |
| AGT-PTR-05 | SAN-708 | **78** B | **12** | B1 | Broker lead replies |
| AGT-PTR-06 | SAN-711 | **80** B | **25** | — (policy-only) | Infra — Patricia ops |
| AGT-PTR-07 | SAN-710 | **74** B- | **10** | B1,R7 | Camila leads → partner CRM |

**Pack average:** Spec **76.7** · Ready **14.9**

### AGT-PTR-01 — findings

| Check | Status |
|---|---|
| Single `partnerAgent` vs 18 vertical agents | 🟢 Correct |
| `gemini-3.5-flash` | 🟢 Matches CLAUDE.md |
| Register in `mastra/index.ts` | 🟢 Correct |
| Extend `CopilotAgentName` union | 🟢 Required |
| Extend `RUNTIME_AGENT_ALLOWLIST` | 🔴 **Missing from disk — must add to AC** |
| `log-agent-run` `agent_type` | 🟡 Add `partner` enum migration OR map to `sponsor` |
| File path `copilotkit/copilotkit-client-props.ts` | 🔴 **Wrong** |

### AGT-PTR-02 — findings

| Check | Status |
|---|---|
| JWT + RLS via `createClient()` | 🟢 Correct (F13) |
| No service-role in client | 🟢 Correct |
| `partner_ids_for_user()` helper in ptr005 | 🟢 Verified in 06b |
| Tool-only on `partnerAgent` | 🟢 Correct |
| Cross-tenant pen-test in AC | 🟡 Add explicit anon + wrong-partner cases (Linear has it; disk spec thin) |

### AGT-PTR-03 — findings

| Check | Status |
|---|---|
| Mirror `host-event-copilot-bridge.tsx` | 🟢 Correct pattern |
| `useCoAgent` + `useCopilotAction` | 🟢 copilotkitV1 |
| `partner_drafts.payload` source of truth | 🟢 Matches 06b |
| Route layout with `getCopilotKitClientProps("partnerAgent")` | 🟡 **Must specify** `partners/signup/layout.tsx` |
| Nested provider under root concierge | 🔴 **Architecture unresolved** |
| Depends on SAN-412 INT-009 | 🟡 Should be explicit `depends_on` |
| Playwright spec path | 🟢 Reasonable |

### AGT-PTR-04 — findings

| Check | Status |
|---|---|
| Read-only dashboard first | 🟢 Anti-scope-creep |
| Missing SAN-706 dependency | 🔴 **Fix depends_on** |
| `/dashboard` not in sitemap | 🟡 Register in `sitemap.md` when building |

### AGT-PTR-05 / 06 — findings

| Check | Status |
|---|---|
| HITL before tourist send | 🟢 Matches host publish |
| Policy module after lead HITL | 🟡 Consider **PTR-06 before PTR-05** or same PR |
| `renderAndWaitForResponse` | 🟢 copilotkitV1 confirmed |

### AGT-PTR-07 — findings

| Check | Status |
|---|---|
| Consumer path only (no partnerAgent) | 🟢 Correct |
| `chat-lead-capture` vs `/api/leads/schedule-viewing` | 🟡 Disk uses **API route** today — spec should name actual path |
| Search tools emit `partner_id` | 🔴 Not on rental cards today |

---

## AI & Intelligence strategy evaluation

### What is correct (keep)

| Decision | Evidence |
|---|---|
| **One `partnerAgent`, capability flags** | Matches SAN-685, host pattern, CK Agent Lock per route |
| **Reuse AGT-00** (589/590/591/605) | Telemetry + scorers apply to partner replies |
| **Defer AI-003 multi-agent router** | Conflicts with single copilot; MASTRA-MIS-001 frozen |
| **Defer SAN-670/687/689 automation** | Advanced; not M1 |
| **Mastra threads not `partner_messages`** | 06b + 431 live `mastra_threads` rows |
| **Split monolith SAN-685 → PTR-01–07** | Linear + disk index aligned |

### What is missing (file new tasks or amend specs)

| Gap | Suggested action |
|---|---|
| **PTR-00 CopilotKit route architecture** | Document: partner routes opt out of `MdeCopilotKitProvider` OR use nested layout like `/host/event` with integration test |
| **hostEventAgent → partnerAgent migration** | Add row to SAN-675 / PTR-03: deprecate timeline for `/host/event/new` |
| **SAN-591 regression** | Re-open or sub-task: restore runtime allowlist before partnerAgent |
| **INT-009 finish** | Link SAN-412 as blocker on SAN-709 |
| **Partner golden queries (AGT-17)** | Later: onboarding NL → field fill eval set |
| **AGT-04A grounding on partner drafts** | Phase 1 tail: partner public copy guard |

### AI & Intelligence project coverage

| Area | Partner coverage after PTR pack |
|---|---|
| Consumer concierge | 🟢 Unchanged (correct) |
| Host wizard | 🟡 Parallel until migration |
| Partner signup/dashboard/leads | 🟢 PTR-01–05 cover M1 |
| Booking/Postiz/WhatsApp | 🟢 Deferred to SAN-686/687/689 |
| Concierge demand routing | 🟡 PTR-07 + SAN-673 (M4) |

**Strategy grade: 85% (A-)** — not over-engineered; execution order sane.

---

## MCP / skill checklist

| Check | Mastra | CopilotKit v1 |
|---|---|---|
| Agent registered in `Mastra({ agents })` | Required PTR-01 | N/A |
| `useCoAgent({ name })` matches map key | Required | 🟢 |
| `useCopilotAction` for form fill | PTR-03 | 🟢 host bridge precedent |
| `renderAndWaitForResponse` HITL | PTR-05/06 | 🟢 host publish |
| Pattern 1 `/api/copilotkit` | All surfaces | 🟢 |
| Stable module-level CK props | All layouts | 🟢 LESSONS |
| Tool `name` = Mastra tool id | PTR-02 | 🟢 |
| `available: "disabled"` for render-only | If generative cards | Optional M1 |

---

## Critical fixes (ordered)

1. **Apply SAN-683** — `db push` + types regen  
2. **Restore SAN-591 allowlist** on disk (or update evidence if intentional regression)  
3. **Patch AGT-PTR-01** — correct file paths; add `RUNTIME_AGENT_ALLOWLIST` + `log-agent-run` mapping AC  
4. **Patch AGT-PTR-04** — `depends_on: [SAN-705, SAN-706]`  
5. **Add PTR-00 or expand PTR-03** — CopilotKit provider / threadId architecture  
6. **Align SAN-706 Linear** — POST vs PATCH for draft upsert  
7. **Update `sitemap.md`** — `/partners/signup`, `/dashboard`  
8. **Fix local migration replay** — `delivery_receipts` hotfix (optional but needed for CI shadow)

---

## Suggested improvements (non-blocking)

- Add **mermaid sequence** for nested-provider decision to PTR-03 spec  
- Add **`verified_against:`** date field to each PTR frontmatter after next disk probe  
- Rename Linear descriptions `partnerOnboardingAgent` → `partnerAgent`  
- Add **AGT-PTR pack** row to `tasks/mastra/plan/index-mastra.md` build order table  
- Extend **06-june-partners-audit** T5 row: migrations on disk, not applied  
- Consider **PTR-06 before PTR-05** if policy module is small (shared HITL list first)

---

## Is anything missing?

| Missing item | Priority |
|---|---|
| CopilotKit provider / thread architecture spec | P0 |
| Runtime allowlist restoration | P0 |
| `partner` `agent_type` enum decision | P1 |
| hostEventAgent deprecation plan | P1 |
| INT-009 explicit dependency | P1 |
| Partner e2e smoke in `tasks/testing/` | P1 |
| `sitemap.md` partner routes | P2 |

---

## Verdict table

| Question | Answer |
|---|---|
| Is the partner AI **strategy** correct? | **Yes (~85%)** |
| Are the **7 tasks** the right decomposition? | **Yes (~78%)** |
| Are disk specs **accurate enough to code**? | **Not yet (~68% disk accuracy)** |
| Safe to start **SAN-705** now? | **No — 15% readiness** |
| Safe after B1+B3+B4+B6 fixed? | **Yes — start SAN-705** |

---

## Related artifacts

| Doc | Path |
|---|---|
| Partner AI audit | `../AI/07-ai-intelligence-partners-audit.md` |
| Supabase audit | `06b-supabase-audit.md` |
| Program audit | `06-june-partners-audit.md` |
| PTR index | `../../../mastra/partners/AGT-PTR-INDEX.md` |
| SAN-591 evidence | `../../../mastra/evidence/SAN-591-agt-00d-2026-06-06.md` |
| Host HITL reference | `mdeapp/src/components/host/host-event-copilot-bridge.tsx` |

---

## Re-verify command bundle

```bash
# Schema
cd /home/sk/mdeai/mdeapp && supabase migration list | rg 2026060613

# Agents
rg 'partnerAgent|hostEventAgent|conciergeAgent' mdeapp/src/mastra mdeapp/src/lib/copilotkit-client-props.ts

# Routes
ls mdeapp/src/app/partners mdeapp/src/app/dashboard 2>&1

# Floor (after any PTR code)
cd mdeapp && infisical run --silent --env=dev --path=/ -- npm run floor
```

**Next audit trigger:** after SAN-683 remote apply + SAN-705 PR opened.

---

## Corrections applied (2026-06-06, post-audit)

| Fix | Where |
|---|---|
| **AGT-PTR-00** CopilotKit route architecture (disk) | `tasks/mastra/partners/AGT-PTR-00-copilotkit-route-architecture.md` |
| Mermaid diagrams on all PTR specs + INDEX gantt/system | `tasks/mastra/partners/AGT-PTR-*.md` |
| PTR-04 `depends_on` +706 | AGT-PTR-04 |
| PTR-03 + PTR-00, SAN-412, `threadId`, layout.tsx | AGT-PTR-03 |
| PTR-02 POST + PATCH draft routes | AGT-PTR-02 |
| PTR-06 before PTR-05 (policy first) | AGT-PTR-05/06 deps |
| PTR-07 `/api/leads/schedule-viewing` path | AGT-PTR-07 |
| `partnerAgent` naming (not partnerOnboardingAgent) | AGT-PTR-03 |
| hostEventAgent coexistence note | AGT-PTR-01/03 |

**Revised spec score (post-fix): ~82%** · **Ready after SAN-683 + allowlist restore: ~35%**
