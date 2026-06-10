# EVT venue booking — links plan (repos, patterns, implementation order)

**Date:** 2026-06-10 · **Class D**  
**Audience:** Sofía implementing EVT chain; agents loading `prompt-links.md`  
**Linear:** [SAN-866 · VEB-PATTERNS](https://linear.app/sanjiovani/issue/SAN-866) · [Linear doc](https://linear.app/sanjiovani/document/evt-booking-github-patterns-mermaid-linear-model-61c8c160ac86)

**Sibling docs:** [`mastra-links-2.md`](./mastra-links-2.md) (forensic repo scores) · [`booking-patterns-mastra-copilotkit-plan.md`](../../events/research/booking-patterns-mastra-copilotkit-plan.md) · [`evt-booking-linear-diagrams-repos.md`](../../events/research/evt-booking-linear-diagrams-repos.md)

---

## Verdict

Copy **UI layout, HITL approval UX, workflow step order, and Zod/DTO shapes** from external repos — **never** copy runtime stack (CopilotKit v2, LangGraph, MCP iframe apps, Python agents). mdeapp Phase 1 = **CopilotKit 1.55.2 v1** + **in-process Mastra** + **Gemini** + **Controlled Generative UI** (`useCopilotAction` disabled + `render` / `renderAndWaitForResponse`).

**In-repo beats GitHub for HITL:** [SAN-302 · VEN-023](https://linear.app/sanjiovani/issue/SAN-302) → `venue-booking-hitl-panel.tsx` + `concierge-venue-booking-bridge.tsx` is the real template for [SAN-496 · EVT-037](https://linear.app/sanjiovani/issue/SAN-496), not hotel booking repos.

---

## Architecture rules (non-negotiable)

| Flow | Table | Tasks |
|------|-------|-------|
| Restaurant **table** booking (Mamasita Friday 8pm) | `venue_booking_requests` | SAN-299 · SAN-302 |
| **Event venue proposal** (private event at Mamacita) | `bookings` where `booking_type='event'` | SAN-496 · SAN-501 · SAN-502 |

**Schema chain:** `partner_locations` → `venue_event_offerings` → `venue_event_packages` → `bookings`

**Do not use for event proposals:** `partner_venues` · `venues` · `event_venue_bookings` · `venue_booking_requests`

---

## Implementation order

### Serial critical path (one SAN = one PR)

```text
SAN-492 ✅ schema
  → SAN-494 · EVT-035  Restaurant card Event Venue CTA
  → SAN-495 · EVT-036  Event offerings detail panel
  → SAN-496 · EVT-037  Request proposal HITL        ← gate: SAN-299/302 Class U 4/4
  → SAN-501 · EVT-042  eventVenueBookingWorkflow
  → SAN-502 · EVT-043  Patricia admin queue
```

### Parallel lane (after SAN-492; separate PRs)

| Task | When | Notes |
|------|------|-------|
| SAN-497 · EVT-038 — Search/rank + venueShortlistWorkflow | Anytime | Optional for v1 Mamacita CTA happy path |
| SAN-498 · EVT-039 — AI venue match score panel | After SAN-497 | Needs `rankVenueMatch` output schema |
| SAN-500 · EVT-041 — Host wizard venue step | After SAN-495 soft | Prefills SAN-496 |
| SAN-704 · AIE-004 — ai_runs prod writes | Infra | Patricia observability |
| SAN-858 · DATA-QUALITY — Events ownership | Data | Roberto `/host/events` visibility |

### Gates

| Gate | Blocks | Status |
|------|--------|--------|
| SAN-299 + SAN-302 Class U **4/4** | **SAN-496** merge | 🔴 2/4 (fix Playwright B/C) |
| SAN-865 · VEB-019 core adapter | SAN-496, SAN-501 | 🟡 scaffold on disk |
| SAN-495 merged | SAN-496 UI entry | ⬜ |

---

## Step 0 — In-repo (copy before any GitHub link)

| Resource | Why first | Patterns to copy |
|----------|-----------|------------------|
| [`src/app/api/copilotkit/route.ts`](../../../src/app/api/copilotkit/route.ts) | Wiring SoT | `CopilotRuntime` + `getLocalAgentsWithLogging` |
| [`concierge-venue-booking-bridge.tsx`](../../../src/components/copilot/concierge-venue-booking-bridge.tsx) | Live HITL bridge | Dual action names; `available: "disabled"` |
| [`venue-booking-hitl-panel.tsx`](../../../src/components/chat/venue-booking-hitl-panel.tsx) | Live approval UI | Approve/Cancel; `executing` + `inProgress` footer |
| [`host-event-copilot-bridge.tsx`](../../../src/components/host/host-event-copilot-bridge.tsx) | Roberto publish HITL | `renderAndWaitForResponse` |
| [`restaurant-card.tsx`](../../../src/components/copilot/restaurant-card.tsx) | SAN-494 ~80% done | `event-venue-cta`, `Hosts Events` badge |
| [`event-venue-booking-core.ts`](../../../src/lib/events/event-venue-booking-core.ts) | SAN-496/501 insert | `insertEventProposal` stub |
| [CK `examples/integrations/mastra`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) | Canonical CK+Mastra | Same stack as mdeapp |

---

## Master repo index

Scores = **MDE reuse for EVT-035…043**, not GitHub stars. 🔴 = skip.

### CopilotKit examples

| Repo | Score | Tasks | Why helpful | Copy | Skip |
|------|-------|-------|-------------|------|------|
| [integrations/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) | 🟢 95 | All | Exact CK 1.x + in-process Mastra wiring | `route.ts`, agent map, `useCoAgent` | — |
| [canvas/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra) | 🟢 90 | 495, 496, 498 | Card grid, HITL interrupt, plan progress, `useCopilotAction` render | `page.tsx`, `CardRenderer`, plan tools | OpenAI model; full canvas scope |
| [showcases/a2a-travel](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/a2a-travel) | 🟢 88 | 494, 495, 496, 500 | Trip/restaurant blocks, budget HITL, card footers | `components/` layouts | A2A supervisor arch |
| [canvas/mastra-pm](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm) | 🟢 82 | 500, 502 | Kanban columns, wizard steps, shared state | Column layout, stepper UX | Full PM app |
| [showcases/banking](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/banking) | 🟡 75 | 496, 502 | Best **approve-before-mutate** story; generative list render | HITL card UX, role context idea | **Entire v2 stack** — translate hooks |
| [showcases/mcp-apps](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/mcp-apps) | 🟡 55 | 495, 496, 502 | 4-step hotel wizard + kanban **storyboard** | Step order, confirm gate copy | iframe, MCP server, v2 middleware |
| [showcases/generative-ui](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/generative-ui) | 🟡 60 | All | Names “Controlled Generative UI” pattern | Concept only | v2 `useFrontendTool` code |
| [showcases/langgraph-js-support-agents](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/langgraph-js-support-agents) | 🟡 45 | 502 | Escalation → human queue semantics | Status escalation idea | LangGraph impl |
| [showcases/multi-agent-canvas](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/multi-agent-canvas) | 🔴 25 | — | — | — | Copilot Cloud + LangGraph |
| [showcases/todo](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/todo) | 🟡 55 | — | Minimal CK onboarding | `useCopilotAction` basics | Too thin |
| [showcases/pydantic-ai-todos](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/pydantic-ai-todos) | 🟡 50 | 497 | `useCoAgent` state sync diagram | State flow mental model | Python + HttpAgent |

### Mastra / travel / booking (external)

| Repo | Score | Tasks | Why helpful | Copy | Skip |
|------|-------|-------|-------------|------|------|
| [Mastra travel-ai blog](https://mastra.ai/blog/travel-ai) | 🟢 88 | 497, 501 | Coordinator + analyzer; Zod I/O | Agent split, schemas | Claude → Gemini |
| [mastra-travel-app](https://github.com/PedrooJ/mastra-travel-app) | 🟡 70 | 497, 501 | Workflow step graph | `src/mastra/workflows/` shape | OpenAI; Studio-only |
| [tanstack-start-mastra-example](https://github.com/ataschz/tanstack-start-mastra-example) | 🟢 86 | 498 | Streaming tool → score UI | Render + `reasons[]` chips | TanStack Start app shell |
| [mastra-hotel-booking-ai-agent](https://github.com/Calinemesef/mastra-hotel-booking-ai-agent) | 🟡 72 | 495, 496 | Tool-per-step; package DTO | Tool response shape | No HITL UI; OpenAI |
| [southwest-flight-booking](https://github.com/leporejoseph/southwest-flight-booking) | 🟡 65 | 501, 502 | Booking lifecycle / status enum | `partner_status` transitions | Non-Mastra |
| [Mastra HITL blog](https://mastra.ai/blog/human-in-the-loop-when-to-use-agent-approval) | 🟢 85 | 496 | When agent must suspend | Approval semantics | — |
| [mindtrip](https://github.com/api-evangelist/mindtrip) | 🟡 50 | 494 | Product journey (UX doc) | Secondary CTA placement | No code |
| [mastravel](https://github.com/vishal777-git/mastravel) | 🔴 15 | — | — | — | **Not Mastra code** |
| [mastra-location-agent](https://github.com/ashenghm/mastra-location-agent) | 🔴 45 | — | — | — | IP geo, wrong domain |
| [Sol_Basic_Hotel Gemini](https://github.com/KishorNaik/Sol_Basic_Hotel_Booking_Assistant_Mastra_AI_Google_Gemini) | 🔴 55 | — | — | — | Lookup bookings only |

---

## v2 → v1 translation (CopilotKit showcases)

Most showcases under [`examples/showcases`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases) ship **CopilotKit v2**. Translate patterns into mdeapp v1 — do not import v2 packages.

| v2 (e.g. banking) | mdeapp v1 (1.55.2) |
|-------------------|---------------------|
| `useHumanInTheLoop({ name, render })` | `useCopilotAction({ name, available: "disabled", renderAndWaitForResponse })` |
| `useFrontendTool({ name, render })` | `useCopilotAction({ name, available: "disabled", render })` |
| `useAgentContext` | `useCopilotReadable` + `useCoAgent` |
| `BuiltInAgent` + Hono v2 runtime | `CopilotRuntime` + in-process Mastra |
| `addNewCard` approve/cancel card | `event-proposal-hitl-panel` approve/cancel |
| `showTransactions` render = answer | Tool render with no duplicate agent prose |

---

## Per-task playbooks

Each row: **why** the example helps → **what to copy** (file/pattern) → **mdeapp target** → **how to adapt**.

---

### 1 · [SAN-494 · EVT-035 — Restaurant Card Event Venue CTA](https://linear.app/sanjiovani/issue/SAN-494)

**Persona:** Tourist on `/chat` sees Mamacita card → opens offerings.

| Priority | Source | Why helpful | Copy this pattern | mdeapp target |
|----------|--------|-------------|-------------------|---------------|
| **In-repo** | `restaurant-card.tsx` | Badge + CTA already exist | `Hosts Events` badge, `data-testid="event-venue-cta"` | Finish wire only |
| **Primary** | [a2a-travel `components/`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/a2a-travel) | Card footer density, secondary action placement | Button row under card body | `onOpenEventVenue` handler |
| Secondary | [canvas/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra) `page.tsx` | Card grid spacing | Footer button group layout | Same card |
| UX only | [mindtrip](https://github.com/api-evangelist/mindtrip) | “Plan an event” journey | CTA label hierarchy | Copy only |

**Adapt:** Gate CTA on `accepts_event_bookings` / offerings exist. Wire `onOpenEventVenue` → SAN-495 sheet (`rental-ui-context.tsx` hook). **No DB write. No agent call.**

**Skip:** mastra-location-agent · mcp-apps iframe · instant-book CTAs

**Verify:** `restaurant-card.test.tsx` · Mamacita e2e · screenshot evidence

---

### 2 · [SAN-495 · EVT-036 — Event Offerings Detail Panel](https://linear.app/sanjiovani/issue/SAN-495)

**Persona:** Tourist browses packages before requesting a proposal.

| Priority | Source | Why helpful | Copy this pattern | mdeapp target |
|----------|--------|-------------|-------------------|---------------|
| **Primary** | [a2a-travel](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/a2a-travel) | Day/restaurant content blocks | Tier list cards (title, subtitle, meta) | `event-offerings-panel.tsx` |
| Secondary | [canvas/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra) `CardRenderer` | Typed card fields | Capacity, amenities, price band rows | Package cards |
| Secondary | [mcp-apps hotels wizard](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/mcp-apps) | 4-step “compare rooms” UX | Step labels only | Sheet sections |
| DTO only | [mastra-hotel-booking-ai-agent](https://github.com/Calinemesef/mastra-hotel-booking-ai-agent) | Tool returns package list | JSON shape for offerings | Supabase query mapper |

**Adapt:** shadcn `Sheet`. Load `venue_event_offerings` + `venue_event_packages`. CTA “Request event proposal” → opens SAN-496 shell — **no insert**.

**Skip:** Sol_Basic_Hotel (lookup, not catalog) · MCP iframe runtime

**Verify:** Panel open/close vitest · wire from SAN-494 CTA

---

### 3 · [SAN-496 · EVT-037 — Request Proposal Modal (HITL)](https://linear.app/sanjiovani/issue/SAN-496) — **spine task**

**Persona:** Tourist/Roberto reviews proposal → Patricia gets pending row.

| Priority | Source | Why helpful | Copy this pattern | mdeapp target |
|----------|--------|-------------|-------------------|---------------|
| **Primary** | **mdeapp SAN-302** | Proven HITL on prod path | `renderAndWaitForResponse`, dual action names, panel footer | `event-proposal-hitl-panel.tsx` |
| **Primary** | `concierge-venue-booking-bridge.tsx` | Bridge registration | `requestVenueBooking` + `request-venue-booking` mirror | `createEventProposal` + `create-event-proposal` |
| Secondary | [banking](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/banking) `addNewCard` | Approve/cancel before server mutate | Card layout + honest pending copy | HITL panel (v2→v1) |
| Secondary | [a2a-travel](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/a2a-travel) | Budget approval step | Multi-field review before submit | Review step UI |
| Secondary | [Mastra HITL blog](https://mastra.ai/blog/human-in-the-loop-when-to-use-agent-approval) | When to suspend agent | Approval gate before tool execute | Agent prompt |
| Secondary | [mcp-apps hotels](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/mcp-apps) | Final confirm step | Review summary block | Confirm screen fields |

**Adapt:**

```text
Mastra tool: create-event-proposal
CK bridge:   createEventProposal + create-event-proposal (dual names)
Insert:      insertEventProposal() in event-venue-booking-core.ts
Ledger:      bookings.booking_type='event', partner_status='pending'
Never:       venue_booking_requests
Copy:        "Proposal pending — not confirmed until Patricia approves"
```

**Gate:** SAN-299 + SAN-302 Class U **4/4** before merge.

**Verify:** Playwright HITL matrix (clone SAN-299 spec) · vitest tool registry

---

### 4 · [SAN-497 · EVT-038 — Search/Rank + venueShortlistWorkflow](https://linear.app/sanjiovani/issue/SAN-497) — parallel

**Persona:** Roberto asks for “80 guests rooftop Provenza” → ranked shortlist.

| Priority | Source | Why helpful | Copy this pattern | mdeapp target |
|----------|--------|-------------|-------------------|---------------|
| **Primary** | [travel-ai blog](https://mastra.ai/blog/travel-ai) | Coordinator + analyzer split | `searchVenueOfferings` + `rankVenueMatch` | Tools on existing agents |
| **Primary** | [mastra-travel-app](https://github.com/PedrooJ/mastra-travel-app) | Workflow steps | validate → search → rank → explain | `venue-shortlist-workflow.ts` |
| Secondary | [canvas/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra) plan tools | Multi-step progress | `setPlan` / `updatePlanProgress` shape | Workflow status UI |
| Secondary | [a2a-travel](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/a2a-travel) | Orchestration UX | Shortlist presentation | Chat cards |

**Adapt:** Deterministic score in code (30% capacity · 25% budget · 20% event type · 15% amenities · 10% location). Gemini **only** for `reasons[]` bullets. **No new `eventVenueAgent` key** — tools on `conciergeAgent` / `hostEventAgent`.

**Skip:** mastravel · langgraph-js-support-agents as impl base

---

### 5 · [SAN-498 · EVT-039 — AI Venue Match Score Panel](https://linear.app/sanjiovani/issue/SAN-498) — parallel, after 497

| Priority | Source | Why helpful | Copy this pattern | mdeapp target |
|----------|--------|-------------|-------------------|---------------|
| **Primary** | [tanstack-start-mastra-example](https://github.com/ataschz/tanstack-start-mastra-example) | Streaming score UI | Score % + reason chips | `venue-match-score-panel.tsx` |
| Secondary | [canvas/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra) chart cards | Metric display | Bar / badge layout | Match panel |
| Secondary | [banking](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/banking) `showTransactions` | Render = answer | No duplicate prose after cards | `useCopilotAction` render |
| Secondary | [travel-ai blog](https://mastra.ai/blog/travel-ai) | Analyzer formatting | Structured fit bullets | `reasons[]` schema |

**Adapt:** Numbers from SQL; Gemini explains only. Blocked by SAN-497 output schema.

---

### 6 · [SAN-501 · EVT-042 — eventVenueBookingWorkflow](https://linear.app/sanjiovani/issue/SAN-501)

| Priority | Source | Why helpful | Copy this pattern | mdeapp target |
|----------|--------|-------------|-------------------|---------------|
| **Primary** | [mastra-travel-app](https://github.com/PedrooJ/mastra-travel-app) | Step graph | validate → persist → notify | `event-venue-booking-workflow.ts` |
| Secondary | [southwest-flight-booking](https://github.com/leporejoseph/southwest-flight-booking) | Status machine | pending → approved → declined | `partner_status` enum |
| **In-repo** | `event-venue-booking-core.ts` | Insert abstraction | `insertEventProposal` | Core step |
| Secondary | [canvas/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra) | Plan completion | `completePlan` after steps | Workflow end state |

**Adapt:** No LLM in payment/confirm paths. Idempotent duplicate submit. Vitest happy + reject paths.

---

### 7 · [SAN-502 · EVT-043 — Patricia Admin Queue](https://linear.app/sanjiovani/issue/SAN-502)

| Priority | Source | Why helpful | Copy this pattern | mdeapp target |
|----------|--------|-------------|-------------------|---------------|
| **Primary** | **In-repo** `/admin/bookings` | RLS + table patterns | Admin gate, row actions | `/admin/event-bookings` |
| Secondary | [canvas/mastra-pm](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm) | Kanban columns | pending / approved / declined columns | Queue filters |
| Secondary | [southwest-flight-booking](https://github.com/leporejoseph/southwest-flight-booking) | Lifecycle | Status transitions | `partner_status` updates |
| Secondary | [banking](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/banking) | Table + drawer | Row detail, role enforcement | Admin drawer |
| Secondary | [mcp-apps kanban](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/mcp-apps) | Column semantics | needs_info column idea | Status chip |
| UX | VEB-W05 wireframe | Column layout | Patricia queue ASCII | Page layout |

**Adapt:** Filter `bookings` where `booking_type='event'`. Actions: approve, decline, request info, assign, notes, SLA timer.

**Skip:** Chat-embedded kanban as prod admin

---

### 8 · [SAN-500 · EVT-041 — Host Wizard Venue Step](https://linear.app/sanjiovani/issue/SAN-500) — parallel

| Priority | Source | Why helpful | Copy this pattern | mdeapp target |
|----------|--------|-------------|-------------------|---------------|
| **Primary** | **In-repo** `host-event-copilot-bridge.tsx` | Roberto publish HITL | `renderAndWaitForResponse` | `set_venue` tool |
| Secondary | [a2a-travel](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/a2a-travel) | Multi-step wizard | Step chrome | `HostEventShell` venue step |
| Secondary | [canvas/mastra-pm](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm) | Step progression | Stepper state | `EventDraftState.venue` |

**Adapt:** Save `partner_location_id`; prefill SAN-496 proposal.

---

## Recommended study order (~2 hours)

```text
1. mdeapp in-repo (Step 0 table)           — 30 min
2. CK integrations/mastra                    — 20 min  wiring SoT
3. CK canvas/mastra                          — 25 min  cards + HITL + useCoAgent
4. CK showcases/a2a-travel                    — 20 min  domain UX
5. CK showcases/banking (README only)        — 15 min  approval semantics → v1 map
6. Mastra travel-ai blog                     — 15 min  agent split + Zod
7. CK canvas/mastra-pm OR mcp-apps hotels    — 15 min  only if doing 502 or 495 copy
```

**Do not browse** all 48 examples under [`examples/`](https://github.com/CopilotKit/CopilotKit/tree/main/examples) — use this plan.

---

## Cursor / agent prompt (paste into implementation)

```text
Stack: CopilotKit 1.55.2 v1 + in-process Mastra + Gemini only.
Read: docs/intelligence/links/links-plan.md

In-repo first: venue-booking-hitl-panel, concierge-venue-booking-bridge,
host-event-copilot-bridge, integrations/mastra wiring.

Serial: SAN-494 → SAN-495 → SAN-496 → SAN-501 → SAN-502
Parallel: SAN-497, SAN-498, SAN-500, SAN-704, SAN-858

Ledger: bookings (booking_type=event) — NEVER venue_booking_requests for proposals.
HITL: useCopilotAction renderAndWaitForResponse (clone SAN-302).
CK v2 showcases (banking, mcp-apps): UI semantics only — translate to v1.

Skip: mastravel, mastra-location-agent, Sol_Basic_Hotel, multi-agent-canvas.
Gate: SAN-299 + SAN-302 Class U 4/4 before SAN-496 merge.
One SAN = one PR. Evidence: docs/tasks/testing/evidence/YYYY-MM-DD/
```

---

## GO / NO-GO (2026-06-10)

| Check | Result |
|-------|--------|
| SAN-492 schema on disk | ✅ |
| SAN-494 UI scaffold | 🟡 In Progress — wire to SAN-495 |
| SAN-299/302 table HITL | 🔴 2/4 — blocks SAN-496 |
| SAN-865 core adapter | 🟡 extend before 496/501 |
| Bad repos removed from prompts | ✅ this doc |
| **Start SAN-494/495** | 🟢 GO |
| **Merge SAN-496** | 🔴 NO-GO until gate + adapter |

---

## Related files

| File | Role |
|------|------|
| [`prompt-links.md`](./prompt-links.md) | Agent audit prompt (source list) |
| [`mastra-links-2.md`](./mastra-links-2.md) | Forensic per-repo deep dives |
| [`copilotkit-links.md`](./copilotkit-links.md) | CK-specific links (cleanup pending) |
| [`evt-booking-linear-diagrams-repos.md`](../../events/research/evt-booking-linear-diagrams-repos.md) | Mermaid + Linear registry |
