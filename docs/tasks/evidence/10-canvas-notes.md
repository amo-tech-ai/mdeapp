Updating tracking + parallel-exploring the Mastra examples and plan files.

Updating todo + changelog briefly (per your request) then synthesizing the examples → use cases → tasks map.

Now the synthesis of what the Mastra examples cover, where they map, and what's next.

## The 2 Mastra canvas examples — what they actually demonstrate

| Example | Score (per `plan/02-repo-plan.md`) | What it teaches | Mapped to mdeai surface |
|---|---:|---|---|
| **`canvas/mastra`** | 96 | 4 card types (Project / Entity / Note / Chart) · bidirectional state sync via `useCoAgent<T>` · multi-step planning · HITL interrupts · JSON view · responsive (sidebar + popup) · Zod working-memory | Generative-UI **card grid pattern** + working-memory shape. Per PRD §45: source for `src/mastra/agents/host-event.ts` + `packages/types/src/event-draft.ts` |
| **`canvas/mastra-pm`** | 93 | 3-step progressive workshop · step-3 = full Kanban + team management · structured Zod state · PM agent persona · CLI + Web clients · `useCoAgent` typed hooks | Roberto's **multi-field host event wizard** + Patricia's W8 admin Kanban |

## The other examples worth knowing about

Inventoried `CopilotKit/examples/`:

```
canvas/       (7 variants — 2 Mastra-based, 5 other frameworks)
integrations/ (19 framework adapters — only `mastra/` is our foundation)
showcases/    (24 production-quality apps)
v2/           (11 framework adapters)
v1/           (legacy patterns — still useful)
e2e/, images/  (meta)
```

### Examples already mapped to existing tasks ✅

| Example | Already a pattern source for | Task |
|---|---|---|
| `integrations/mastra` (score 99) | mdeapp foundation | ✅ F01 Done |
| `canvas/mastra` (96) | Working-memory shape + card grid | 🟡 partial — F22-F30 use the cards, **the canvas-grid UI itself is unspecced** |
| `canvas/mastra-pm` (93) | Multi-field wizard | ❌ no task — **F33 needed (see below)** |
| `showcases/banking` (91) | Approvals + roles | ❌ no task — pattern note belongs in F29 + W4 PRD §17 |
| `v1/form-filling` (90) | Roberto's host-event flow | ❌ no task — **F33 primary reference** |
| `showcases/generative-ui` (90) | Card render pattern | 🟡 partial — F24/F25/F26 use F07 shadcn instead |
| `v1/chat-with-your-data` (88) | Camila's data-query chat | ❌ no task — **F35 reference** |
| `@vis.gl/react-google-maps` + `js-markerclusterer` | Maps | ❌ no task — covered by F16 Path A (W5) |

### Examples with potential but no task yet

| Example | Potential mdeai use | Recommendation |
|---|---|---|
| `showcases/multi-agent-canvas` | Multi-intent routing visualization (F18 routerAgent) | Reference in F18 spec note · ❌ no separate task |
| `showcases/research-canvas` | Tourist "deep dive" concierge | ⚪ Phase 2 (matches deferred F31) |
| `showcases/microsoft-kanban` | Patricia W8 admin (events draft → published) | Reference in **F27 AdminLayout** spec (when it lands) |
| `showcases/spreadsheet` | Patricia analytics (leads + tickets + events count) | ⚪ Phase 2 admin polish |
| `showcases/scene-creator` | Maps + composed scenes | ⚪ Phase 2 |
| `showcases/enterprise-brex` | Multi-permission enterprise | ⚪ Phase 3 (sponsor marketplace) |
| `showcases/deep-agents-finance-erp` | Sponsor ROI dashboard | ⚪ Phase 3 |
| `showcases/deep-agents-job-search` | Multi-step deep search | ⚪ Phase 2 |
| `showcases/presentation` | Roberto's event preview slides | ⚪ defer (not in PRD §51) |
| `showcases/orca` | unknown | ⚪ inspect later |
| `v1/travel` | Tourist itinerary (matches F31 TripWizard) | ⚪ Phase 2 |
| `v2/react-router` | Route patterns | ⚪ already in App Router; reference only |

## Where these go in the plan — your real question

The repo-plan + PRD already documented "what to use from where" (PRD §45 component-to-target table). The gap is **route-level task specs** — the screens that consume the components F22-F30 build.

**Per `plan/prd/04-product-surfaces.md` §22-24 + `plan/prd/08-delivery.md` §51:**

| PRD surface | PRD week | Pattern source | Existing F-task | Status |
|---|---|---|---|---|
| `/host/event/new` (Roberto wizard) | W3-W4 | `v1/form-filling` + `canvas/mastra-pm` | ❌ **none yet — propose F33** |
| `/host/events` (Roberto list) | W3 | `canvas/mastra` card grid + F25 EventCard | ❌ **propose F34** |
| `/rentals` (Camila list + map) | W5 | `v1/chat-with-your-data` + F24 RentalCard + F16 maps | ❌ **propose F35** |
| `/rentals/:id` (rental detail) | W5 | `@googlemaps/extended-component-library` | ❌ **propose F36** |
| `/chat` (concierge full surface) | W6 | `canvas/mastra` 4-card UI + F19 conciergeAgent | ❌ **propose F37** |
| `/me/tickets/:id` (buyer wallet) | W9 | Stripe + QR | ❌ **propose F38** |
| `/staff/scan/:eventId/:token` (scanner PWA) | W9 | port legacy | ❌ **propose F39** |
| Event-publish HITL | W4 PRD §17 | `showcases/banking` approval pattern | ⚪ inline reference in F33 |
| Admin Kanban | W8 | `showcases/microsoft-kanban` + `canvas/mastra-pm` step-3 | ⚪ reference in F27 |

## Next set of tasks — the actual answer

Based on the plan files + PRD §51, the next 7 task slices (F33-F39) **all route-level**, all map to PRD weeks that are coming up. Logged in `todo.md` this turn. **Not specced yet** — that's the next call.

Recommended slicing order (smallest → largest):

1. **F35 — Camila `/rentals` page** (~1.5h) — uses F24 RentalCard already specced + a simple list query (F17 not strictly required if W5 starts with mock data); pattern: `v1/chat-with-your-data`.
2. **F34 — Roberto `/host/events` list** (~1.5h) — uses F25 EventCard already specced + auth gate (F08 done) — small surface.
3. **F33 — Roberto host wizard `/host/event/new`** (~4h) — biggest piece; combines `v1/form-filling` form pattern + `canvas/mastra-pm` step-3 Kanban-style structured state + `showcases/banking` HITL approval. Depends on F14 (eventAgent backend).
4. **F36 — `/rentals/:id` detail** (~2h) — server-rendered, place overview, lead capture form.
5. **F37 — `/chat` full surface** (~3h) — depends on F18 + F19 (routerAgent + conciergeAgent).
6. **F38 — `/me/tickets/:id`** (~2h) — Stripe checkout return + QR code.
7. **F39 — Scanner PWA** (~3h) — port from legacy; W9.

Plus the immediately-available quick wins from the prior turn:
- **F22** hero photos (30 min · zero risk)
- **F32** prod smoke + gate 9.5 (30 min)

### Recommended this week

1. **F22 + F32** (1 hour combined — quick wins, zero decisions)
2. **F35** (~1.5h — uses already-specced F24, gives Camila a real page)
3. **F34** (~1.5h — uses already-specced F25, gives Roberto a real page)

That's ~4.5 hours of work that moves 2 personas from "we have card components" to "they have working pages on `mdeapp.vercel.app`". Once those land, write F33 (the wizard — biggest piece) with the form-filling + mastra-pm patterns as references.

### What to NOT spec yet

- F36 (rental detail) — wait until F35 surfaces real Camila feedback
- F37 (chat) — wait until F18 + F19 backend ports land
- F38 + F39 — W9 work, defer until W8 ends
- All `showcases/*` direct-port tasks — they're pattern references only per PRD §44. Don't create tasks for "port the banking showcase" — instead, reference its pattern inside F29 / F33 / F27 when those land.

Files updated this turn: [`todo.md`](todo.md) (per-week mapping added) + [`changelog`](changelog) (entry for the gap analysis). No new task specs written this turn — your sequence decision unblocks F33-F39 spec authoring next.