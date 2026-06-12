# CK-V2-004A — Concierge Chat Migration Spike (deliverable)

**Task:** SAN-890A · CK-V2-004A — Concierge Chat Migration Spike (recommended; docs only)  
**Parent:** SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2  
**Date:** 2026-06-12  
**Package:** `@copilotkit/react-core@1.55.2` · subpath `/v2` only  
**Sources:** [`CK-V2-001-hook-signatures.md`](./CK-V2-001-hook-signatures.md) · [`official-docs.md`](../../upgradeV2/official-docs.md) · `git grep origin/main` @ `408d2d8`

---

## Verdict

**Do not start SAN-890 code until this spike is reviewed.** `/chat` is the highest-risk surface: fast-path intercept, local event bubbles, HITL venue booking, 12 generative tool renders, and map pin sync. `useCopilotChatInternal` has **no** `/v2` export at 1.55.2.

---

## v1 inventory (`origin/main`)

| File | v1 API | Risk |
|---|---|---|
| `concierge-chat-messages.tsx` | `useCopilotChatInternal`, `useChatContext`, `useCopilotChat` | **P0** — message list + interrupt |
| `concierge-chat-input.tsx` | `useCopilotChatInternal` (`interrupt`) | **P0** — send gating + fast-path |
| `chat-center-panel.tsx` | `CopilotChat` from `react-ui` | **P0** — shell |
| `concierge-assistant-message.tsx` | `AssistantMessage` from `react-ui` | P1 — slot migration |
| `concierge-coagent-context.tsx` | `useCoAgent` | P1 → `useAgent` |
| `search-tool-renders.tsx` | `useCopilotAction` ×12 | P1 → `useRenderTool` |
| `concierge-venue-booking-bridge.tsx` | `renderAndWaitForResponse` | P1 → `useHumanInTheLoop` |
| `concierge-agent-error-bridge.tsx` | `useCopilotContext` | P1 — error handler |
| `event-web-citation-sync.tsx` | `useDefaultTool` | P2 → `useDefaultRenderTool` |
| `chat-filter-copilot-instructions.tsx` | `useCopilotAdditionalInstructions` | P2 → `useAgentContext` |
| `concierge-session-context.tsx` | `useCopilotChat().reset` | P2 |
| `chat-query-bar.tsx` | `useCopilotChat().appendMessage` | P2 |
| `concierge-initial-prompt.tsx` | `useCopilotChat` | P2 |
| `cafe-detail-panel.tsx` | `useCopilotChat` | P2 |

**Proposed flag:** `COPILOTKIT_V2_CHAT=1` (default off) — mirror SAN-888 pattern.

---

## Spike findings

### 1. `useCopilotChatInternal` (no `/v2` export)

**v1 usage today:**

```tsx
// concierge-chat-messages.tsx
const { messages: visibleMessages, interrupt } = useCopilotChatInternal();

// concierge-chat-input.tsx
const { interrupt } = useCopilotChatInternal();
const canSend = !inProgress && text.trim().length > 0 && !interrupt;
```

**v2 replacement strategy:**

| Concern | v2 approach |
|---|---|
| Message list | Stock `/v2` `CopilotChat` with `messageView` slots OR read messages via `useAgent` thread API |
| `interrupt` (HITL pending) | `/v2` interrupt pattern on `CopilotChat` / `useHumanInTheLoop` state — **verify in CopilotKit MCP before coding** |
| Local fast-path bubbles | Keep `useEventLocalChat()` — orthogonal to CopilotKit; merge local + agent messages in custom `messageView` slot |
| `appendMessage` / retry | `useAgent` send + thread helpers (replace `useCopilotChat().appendMessage`) |

**Open question:** Does `/v2` `CopilotChat` expose interrupt state on the input slot props equivalent to v1 `interrupt`? → **MCP verify** before SAN-890 B3.

### 2. `useChatContext` (`react-ui`)

**v1:** `const { labels } = useChatContext();` in `concierge-chat-messages.tsx`.

**v2:** `CopilotChatConfigurationProvider` or slot props on `/v2` `CopilotChat` (labels, icons). See [`official-docs.md`](../../upgradeV2/official-docs.md) Step 2.

### 3. Custom slots (message rendering)

| v1 | v2 slot |
|---|---|
| `ConciergeAssistantMessage` (wraps `AssistantMessage`) | `assistantMessage` slot under `messageView` |
| `ConciergeUserMessage` (`data-testid="concierge-user-message"`) | `userMessage` slot — **preserve testids** |
| `RestaurantFilterChips` in message flow | Custom slot or inline in `assistantMessage` |
| `ConciergeErrorNotice` + retry | Keep `useSyncExternalStore` on `concierge-error-store`; wire retry via `useAgent` send |

### 4. `useDefaultTool` → `useDefaultRenderTool`

**v1:** `event-web-citation-sync.tsx` — `useDefaultTool({ render: DefaultToolCitationBridge })`.

**v2:** `useDefaultRenderTool` from `/v2` — verify signature via `node_modules/@copilotkit/react-core/dist/v2/index.d.cts` before SAN-890 D4.

### 5. `useCopilotContext` error bridge

**v1:** `setInternalErrorHandler` / `removeInternalErrorHandler` on `useCopilotContext()`.

**v2 options (pick one in SAN-890):**

1. `CopilotKit` provider `onError` callback from `/v2` (if exported)
2. Keep a thin v1 error bridge **only** on flag-off path; v2 path uses provider error prop
3. Centralize on existing `concierge-error-store` + runtime fetch error detection

**Recommendation:** Option 1 + fallback to store — spike acceptance requires MCP confirmation.

### 6. Fast-path intercept (must survive migration)

`concierge-chat-input.tsx` routes through `sendConciergeUserMessage()`:

- Rental / event / restaurant / grounded / event-venue-booking fast paths
- Only calls `onAgentSend` (CopilotKit) when fast paths miss

**Invariant:** v2 migration must **not** move fast-path logic into the agent. Flag-on path keeps identical `sendConciergeUserMessage` pipeline; only the `onAgentSend` target changes.

### 7. Generative tools (`search-tool-renders.tsx`)

12 `useCopilotAction` registrations (Mastra key + createTool id fallbacks) → 12 `useRenderTool` mirrors in `search-tool-renders-v2.tsx`.

**VEB guard:** Run `veb-mvp-001` checklist after migration — day-trip must not hijack to event cards.

### 8. HITL venue booking

`concierge-venue-booking-bridge.tsx` uses `renderAndWaitForResponse` → `useHumanInTheLoop` in v2 (same pattern as SAN-889 host publish).

---

## Proposed SAN-890 file plan

| Action | Path |
|---|---|
| Add flag | `src/lib/copilotkit-v2-chat-flag.ts` |
| Gate layout | `src/app/chat/page.tsx` or new `chat-layout-v2.tsx` |
| v2 copies | `*-v2.tsx` for bridge, shell, tool renders — v1 untouched |
| Spike doc | this file ✅ |

---

## Acceptance criteria (spike done when)

- [x] All v1 chat CopilotKit touchpoints inventoried with file paths
- [x] Each v1 API has proposed v2 replacement or explicit open question
- [x] Fast-path + local message invariants documented
- [ ] CopilotKit MCP confirms `/v2` interrupt + error handler pattern (**SAN-890 A1 gate**)
- [ ] Reviewer sign-off on file plan

---

## References

- Spike gate: SAN-887 · [`CK-V2-001-hook-signatures.md`](./CK-V2-001-hook-signatures.md)
- Program tracker: [`docs/upgradeV2/todo.md`](../../upgradeV2/todo.md)
- Linear: SAN-890 · CK-V2-004 (section A sub-spike)
