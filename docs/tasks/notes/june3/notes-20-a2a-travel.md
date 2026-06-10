Review of **`CopilotKit/examples/showcases/a2a-travel`** — what’s worth adding to copilotkit skills, and what to skip for mdeapp Phase 1.

## What this showcase is

**Not Mastra Pattern 1.** It’s a **multi-process A2A demo**:

```
Next.js (CopilotKit) → A2AMiddlewareAgent → HttpAgent orchestrator (:9000)
                                              ↓ A2A
                         LangGraph agents (:9001, :9003) + ADK agents (:9002, :9005)
```

Packages: `@ag-ui/a2a-middleware`, `@ag-ui/client` `HttpAgent`, `@a2a-js/sdk`. **6 concurrent processes** via `npm run dev`.

mdeapp today: in-process `MastraAgent.getLocalAgents` — **different architecture**. Treat a2a-travel as **Phase 2+ reference**, not implementation template.

---

## High value — add to skills

### 1. `V1/showcases/a2a-travel/a2a-middleware-runtime.md` (Phase 2 gate)

**Source:** `app/api/copilotkit/route.ts`

Documents **Pattern 3** (remote orchestrator + middleware), distinct from `mastra.md` Pattern 1:

| Step | Code |
|------|------|
| HttpAgent | `new HttpAgent({ url: orchestratorUrl })` |
| Middleware | `new A2AMiddlewareAgent({ agentUrls, orchestrationAgent, instructions })` |
| Runtime | `agents: { a2a_chat: a2aMiddlewareAgent }` — must match `<CopilotKit agent="a2a_chat">` |

**mdeapp rule:** Do not adopt until `/trips` multi-agent is scoped; keep Mastra in-process for launch.

---

### 2. `a2a-message-visualizer.md` — generative UI for agent hops

**Source:** `travel-chat.tsx` + `MessageToA2A` / `MessageFromA2A`

```tsx
useCopilotAction({
  name: "send_message_to_a2a_agent", // injected by middleware
  available: "frontend",
  render: (props) => (
    <>
      <MessageToA2A {...props} />   {/* orchestrator → agent (green) */}
      <MessageFromA2A {...props} /> {/* agent → orchestrator (blue) */}
    </>
  ),
});
```

**Add:** when to register renders for **middleware-injected tool names**; badge styling per agent (`agent-styles.ts`).

**mdeapp Phase 2:** Patricia ops / debug — visualize concierge → rental vs events sub-workflows (even without full A2A).

---

### 3. `dual-pane-chat-content.md` (Phase 1 transferable)

**Source:** `app/page.tsx` — **450px chat column + scrollable content panel**

Directly maps to:

| a2a-travel | mdeapp |
|------------|--------|
| Left: `TravelChat` / `CopilotChat` | `/` chat column, `/chat` |
| Right: `ItineraryCard`, `WeatherCard`, `BudgetBreakdown` | Cards + map column, `/trips/[id]` itinerary panel |

**Add:** lift structured data via callbacks (`onItineraryUpdate`) from chat child → parent React state — same shell as Camila, **without** A2A.

---

### 4. `hitl-form-prefill.md` — slot-filling form in chat

**Source:** `gather_trip_requirements` + `TripRequirementsForm.tsx`

```tsx
useCopilotAction({
  name: "gather_trip_requirements",
  renderAndWaitForResponse: ({ args, respond }) => (
    <TripRequirementsForm args={args} respond={respond} />
  ),
});
```

Orchestrator pre-fills `city`, `numberOfDays`, etc. from user message → form `useEffect` seeds fields.

**mdeapp mapping:**

- Roberto: host wizard (already similar)
- **Camila `/trips`:** trip requirements before itinerary agents run — strong Phase 2 fit

Extend existing `useHumanInTheLoop.md` / host bridge docs with this **prefill-from-args** pattern.

---

### 5. `hitl-gated-content-panel.md` — approve before main UI updates

**Source:** `request_budget_approval` + `approvalStates` + `useEffect` on `visibleMessages`

Budget JSON only calls `onBudgetUpdate` **after** user approves:

```tsx
const isApproved = approvalStates[budgetKey]?.approved;
if (isApproved) onBudgetUpdate?.(parsed);
```

**Add:** HITL doesn’t only unblock the agent — it can **gate the right-hand panel** (Andrés ticket approval, Roberto publish, trip budget).

Complements Roberto’s `EventPublishApprovalPanel` pattern.

---

### 6. `sequential-orchestrator-instructions.md`

**Source:** middleware `instructions` + `orchestrator.py`

Hard rules repeated in both layers:

- Call agents **ONE AT A TIME**
- **Always** `gather_trip_requirements` first
- **Always** `request_budget_approval` after budget
- Don’t re-call an agent once you have its result

**Add:** prompt template for multi-step concierge flows (Camila: rentals → events → places) even inside **single Mastra agent** — same discipline, no A2A required.

---

## Medium value — small doc or cross-link

| Topic | Source | Skill action |
|-------|--------|--------------|
| **`useCopilotChat` + `visibleMessages` scraping** | `travel-chat.tsx` L45–113 | `visible-messages-extraction.md` — **demo-only**; prefer `useCoAgent` / tool-render callbacks for mdeapp |
| **`display_weather_forecast`** frontend render | Same file | Same as `available-frontend-vs-disabled.md` — duplicate UI in chat + panel |
| **Nested `<CopilotKit>` in `TravelChat`** | `travel-chat.tsx` L302 | Anti-pattern note in `CopilotKit.md` (host layout is intentional; demo isolation is not) |
| **`renderAndWaitForResponse` deps `[approvalStates]`** | L206 | Document when HITL render **must** re-register vs stable `[]` + refs (LESSONS-adjacent) |
| **Multi-service `concurrently` dev script** | `package.json` | Ops note in showcase README only — not mdeapp `npm run dev` |

---

## Do NOT add / do NOT copy for mdeapp

| a2a-travel | Why skip Phase 1 |
|------------|------------------|
| Python ADK + LangGraph microservices | mdeapp = Mastra TS in-process |
| OpenAI itinerary/restaurant agents | **Gemini only** |
| `@ag-ui/a2a-middleware` | Not in mdeapp deps; ADK MCP disabled until Phase 2 |
| `@copilotkit/*` **latest** | Pin **1.55.2** |
| JSON parse from `ResultMessage` strings (`"A2A Agent Response: "`) | Fragile; use typed tool results |
| 5 localhost ports in prod | Vercel single Next runtime |

---

## Suggested skill tree

```
.agents/skills/copilotkit/V1/
├── showcases/
│   ├── README.md                    # Phase 2 gate + index
│   └── a2a-travel/
│       ├── README.md                # Architecture diagram, dev ports
│       ├── a2a-middleware-runtime.md
│       ├── a2a-message-visualizer.md
│       ├── dual-pane-chat-content.md      ← Phase 1 useful
│       ├── hitl-form-prefill.md           ← Phase 1 useful
│       ├── hitl-gated-content-panel.md    ← Phase 1 useful
│       ├── sequential-orchestrator-instructions.md
│       └── visible-messages-extraction.md  ← caution doc
```

Update `V1/patterns/README.md` → “Which example when?” row:

| Goal | Load |
|------|------|
| `/trips` shell + HITL trip form | a2a-travel → dual-pane + hitl-form-prefill |
| Multi-agent / A2A (Phase 2) | a2a-travel → middleware runtime |

Cross-link from `mastra.md`: **Pattern 1 (mdeapp) vs Pattern 3 (A2A middleware + HttpAgent)**.

---

## Priority if you only add 3 docs

1. **`dual-pane-chat-content.md`** — immediate value for `/trips` shell (SAN-* trips work)
2. **`hitl-form-prefill.md`** — trip requirements ≈ Camila trip planner
3. **`a2a-middleware-runtime.md`** — Phase 2 architecture guardrail so agents don’t mix patterns

Want these written into `.agents/skills/copilotkit/V1/showcases/a2a-travel/` like we did for canvas patterns?