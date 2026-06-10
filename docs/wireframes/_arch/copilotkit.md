# CopilotKit Architecture Reference

---

## Feature Map

| CopilotKit Feature | Screen | Benefit |
|---|---|---|
| `CopilotSidebar` | All host + admin routes | Persistent chat wraps main canvas; open by default |
| `CopilotPopup` (FAB) | `/events`, `/rentals`, `/restaurants`, `/cafes` | Chat available without taking space; expands on tap |
| `CopilotChat` (embedded) | `/admin/analytics`, kanban panels | Chat embedded in split-pane layout |
| `useCoAgent<MdeState>` | All routes | Map pins, kanban cards, lead pipeline update live from agent state |
| `useCopilotReadable` | Every route | Agent knows current page context (event details, rental data, admin KPIs) |
| `useCopilotAction(render)` | All discovery screens | `EventCard`, `RentalCard`, `VenueCard`, `LeadCard`, `ChartCard` render in chat |
| `useCopilotAction(available:"disabled", render)` | Event/rental/venue details | Frontend mirrors backend agent tool as generative UI |
| `renderAndWaitForResponse` | All booking + publish flows | HITL before: publish event, send proposal, confirm booking, charge card |
| `ExperimentalEmptyAdapter` | `/api/copilotkit` | No LLM inference in Next.js layer; all inference in Mastra server |
| `CopilotRuntime` | `/api/copilotkit` route | Builds per-request bridge to Mastra via `getLocalAgentsWithLogging` |
| CSS variables | Global | `--copilot-kit-primary-color` matches mdeai brand tokens from DESIGN.MD |
| Custom `AssistantMessage` | All chat surfaces | Agent name badge + typing skeleton + branded bubble |
| `ThreadNavProvider` | App shell | `threadId` per session; agent memory scoped correctly |
| Streaming | Long responses | Reports, proposals, itineraries stream token-by-token |

---

## HITL Pattern — Standard Implementation

```typescript
// In Mastra agent tool
const publishEvent = createTool({
  id: "preview_and_publish",
  description: "Preview event and request host approval before publishing",
  inputSchema: z.object({ event_draft: EventDraftSchema }),
  execute: async ({ context, input }) => {
    // renderAndWaitForResponse blocks until host approves
    const approval = await context.renderAndWaitForResponse({
      name: "publish_event_approval",
      description: "Show Roberto the event summary and wait for publish approval",
      render: ({ respond }) => ({
        component: "PublishEventCard",
        props: { draft: input.event_draft, respond }
      })
    })
    
    if (approval.action === "publish") {
      await publishToSupabase(input.event_draft)
      await createStripeTickets(input.event_draft)
      return { published: true, event_id: newId }
    }
    return { published: false, reason: "Host cancelled" }
  }
})
```

---

## Generative Card Pattern

```typescript
// Frontend: mirrors agent tool as generative UI card
useCopilotAction({
  name: "search_rentals",
  available: "disabled",        // Never called from frontend
  render: ({ args, result }) => (
    <RentalCard
      rental={result}
      onInquire={() => startInquiryFlow(result.id)}
      onScheduleViewing={() => scheduleViewing(result.id)}
    />
  )
})

// Agent: calls the real search_rentals tool
// Frontend: renders the card automatically when agent calls it
```

---

## `useCopilotReadable` — Per-Route Context

| Route | What's passed to agent |
|---|---|
| `/events` | Current search results, applied filters, user preferences |
| `/events/[slug]` | Full event data (title, date, capacity, tickets, venue, host) |
| `/rentals` | Search results, filter state, user budget + preferences |
| `/rentals/[id]` | Full rental data (amenities, price, host, availability) |
| `/host/event/new` | Current event draft state at each wizard step |
| `/host/events/[id]/tickets` | Ticket tiers, sales velocity, promo codes |
| `/admin` | Platform KPIs, exception counts, pending approvals |
| `/admin/analytics` | Current period, revenue data, top events, trends |

---

## Phase Migration Path

| Phase | CopilotKit Version | Key APIs |
|---|---|---|
| **Phase 1** (now) | 1.55.2 | `renderAndWaitForResponse`, `useCoAgent`, `useCopilotAction` |
| **Phase 2** | 1.55.2 | Add `useCopilotReadable` on all routes; expand generative cards |
| **Phase 3** | Migrate to v2 | `useHumanInTheLoop`, `useFrontendTool`, `useAgentContext` (role-aware) |

**Never mix v1 and v2 APIs in the same session.** Pin at 1.55.2 for all Phase 1 + Phase 2 work.
