Prioritized guide for **which `CopilotKit/examples/showcases/` repos to model** for mdeai — after **a2a-travel** (already in skills + `notes-21`).

Also note: **best Phase 1 references are not all in `showcases/`** — `examples/integrations/mastra`, `examples/canvas/mastra`, `examples/canvas/mastra-pm` beat most showcases for your stack.

---

## Already modeled (don’t duplicate)

| Source | mdeai use | Where documented |
|--------|-----------|------------------|
| **a2a-travel** | Dual-pane, HITL trip/budget, A2A (Phase 2) | `notes-21`, `V1/showcases/a2a-travel/` |
| **canvas/mastra** | `setState` CRUD, remote frontend actions | `V1/patterns/` |
| **canvas/mastra-pm** | Agent-owned WM, read-only board | `V1/patterns/` |
| **integrations/mastra** | Pattern 1 runtime (production) | `mastra.md` |

---

## Tier 1 — model next (Phase 1–ish, high ROI)

### 1. `banking` (+ twin `enterprise-brex`)

**Why:** Closest showcase to **production CopilotKit hygiene** on a real product UI.

| Pattern | Demo | mdeai adaptation |
|---------|------|------------------|
| **App-wide context** | `copilot-context.tsx` — `useCopilotReadable` + actions | Concierge filter hints; host `useCopilotReadable` on draft |
| **Role-scoped copilot** | Switch user → different tool outcomes | Camila vs Roberto vs Patricia (`/admin`) — same agent, different readables |
| **Generative UI (display)** | `showTransactions` → card component in chat | You already do this with `search-tool-renders.tsx` — use banking as **second reference** for non-search cards |
| **Generative UI (HITL loop)** | `showAndApproveTransactions` — approve one-by-one | Andrés checkout, trip budget, viewing booking — same as a2a budget approval |
| **Page-scoped actions** | Different tools on `/cards` vs `/team` | `/rentals` vs `/host/event/new` vs `/` — register actions only under route subtree |

**Personas:** Patricia (ops approvals), Andrés (payment approve), Roberto (role-gated host tools).

**Skip:** OpenAI, fake bank domain logic — steal **context + gen-UI + HITL** only.

---

### 2. `generative-ui` + `generative-ui-playground`

**Why:** Official map of **three gen-UI lanes** — aligns with how Camila’s chat should evolve.

| Spec | Demo | mdeai today / next |
|------|------|---------------------|
| **Static / AG-UI** | `useRenderToolCall`, HITL cards | ✅ `search-tool-renders`, host publish |
| **A2UI** | Declarative JSON UI in chat | Phase 2 — `references/a2ui.md` |
| **MCP Apps** | iframe apps from MCP servers | Phase 2 — booking widgets, external tools |

**Use:** Product vocabulary for PRD/tasks (“we’re Static GenUI, not MCP Apps yet”). Playground = quick visual checklist when adding a new card type.

**Don’t:** Migrate to v2 `CopilotKitProvider` from playground — stay 1.55.2.

---

### 3. `microsoft-kanban`

**Why:** **Kanban + NL task management** without A2A — closer to **mastra-pm** than a2a-travel, but with richer board UX.

| Pattern | mdeai surface |
|---------|---------------|
| Multi-column board from shared state | `/trips/[id]` Ideas → Itinerary (or Patricia leads CRM) |
| Tags, subtitles, task CRUD via chat | `trip_items` rows + concierge tools |
| C# backend + AG-UI sync | Phase 2 only — **UI/layout only** for Phase 1 |

**Personas:** Camila trip planning, Patricia `/admin/leads`.

**Skip:** .NET agent — board UX + prompt patterns only.

---

### 4. `deep-agents-job-search`

**Why:** **`useCopilotReadable` for uploaded / structured user context** — clean pattern for “Camila brings her constraints into the agent.”

| Pattern | Demo | mdeai adaptation |
|---------|------|------------------|
| Upload → parse → readable | Resume PDF → skills in context | Saved places export, trip prefs, rental shortlist JSON |
| Chat gated until context ready | Upload before search | “Sign in + neighborhood preference” before deep search |
| Tool stream to UI | Job cards in chat | Rental/event cards (same family) |

**Personas:** Camila (`/saved`, `/trips` ideas tab stub).

**Skip:** LangGraph DeepAgents backend — readable + upload UX only.

---

## Tier 2 — model when a surface ships (Phase 2 / POST)

| Showcase | Model for | mdeai route / persona | Notes |
|----------|-----------|------------------------|-------|
| **research-canvas** | Research workspace + Tavily + doc panel | `/trips` research, venue deep-dives | LangGraph + Docker; steal **canvas + HITL research** layout |
| **scene-creator** | Chat + **artifact panel** (not full-page replace) | Detail sheets, generated trip PDF preview | `ArtifactPanel.tsx` pattern |
| **deep-agents** | Visible **todo plan** in chat (pending/done steps) | Multi-step trip build, concierge routing transparency | Like a2a plan UI without A2A |
| **deep-agents-finance-erp** | Dashboard widgets + **HITL for money ops** | Patricia `/admin` dashboards, commission approvals | Heavy; widget gallery is reference only |
| **spreadsheet** | **Preview changes** before apply (`PreviewSpreadsheetChanges`) | Bulk itinerary edits, price tables | Good “confirm before write” UX |
| **presentation** | Multi-step **content generation** + side deck | Roberto marketing assets (POST) | Cloud + Tavily |
| **pydantic-ai-todos** | Kanban columns + Python agent | Alternative to mastra-pm if you ever split agents | Not Mastra |
| **adk-dashboard** | Metrics/charts on canvas from agent | Patricia ops metrics (POST) | ADK Phase 2 |
| **mcp-demo` / `open-mcp-client`** | MCP Apps in chat | External booking, WhatsApp tools (Phase 2) | Pair with `references/mcp-apps.md` |
| **multi-agent-canvas** | Agent picker + MCP travel/research | Inspiration for multi-intent routing UI | Requires **Copilot Cloud** — don’t run in mdeapp |
| **strands-file-analyzer** | PDF upload + analysis panels | Host contract upload, venue docs (POST) | Python sidecar |
| **chatkit-studio` / `orca` / `multi-page`** | Marketing / embed / analytics dashboards | Low priority for MVP | Skim only |

---

## Tier 3 — skip or minimal

| Showcase | Verdict |
|----------|---------|
| **todo** | Copilot Cloud hello-world — superseded by `integrations/mastra` |
| **langgraph-js-support-agents** | Support-ticket vertical; wrong domain |
| **banking** duplicate of **enterprise-brex** | Pick one (banking README is clearer) |

---

## Recommended modeling order (practical backlog)

```
1. banking          → context, role-scoped readables, approve-one-by-one HITL
2. generative-ui    → name what we build (static vs A2UI vs MCP)
3. microsoft-kanban → /trips board UX (columns, cards from chat)
4. deep-agents-job-search → readable + upload for Camila context
5. research-canvas  → when /trips gets “research mode”
6. scene-creator    → artifact column beside chat
7. spreadsheet      → preview-before-apply for bulk edits
8. deep-agents      → visible plan steps in chat (lighter than a2a)
```

---

## Map to mdeai north-star flows

| Flow | Primary showcases | mdeapp files to extend |
|------|-------------------|-------------------------|
| Camila chat + cards + map | **banking** (gen-UI), **generative-ui** | `search-tool-renders.tsx`, `geo-chat-shell.tsx` |
| Trip plan + itinerary | **a2a-travel**, **microsoft-kanban**, **research-canvas** | `trips/`, `itinerary-panel.tsx` |
| Roberto host + publish | **banking** (HITL), **canvas/mastra** (form fill) | `host-event-copilot-bridge.tsx` |
| Andrés pay + approve | **banking**, **a2a-travel** (budget gate) | checkout overlay |
| Patricia admin | **banking** (roles), **deep-agents-finance-erp** (dashboards) | `/admin/*` |

---

## What to add to copilotkit skills (if you extend docs)

| New skill folder | Source showcase | Priority |
|------------------|-----------------|----------|
| `V1/showcases/banking/` | `banking` | P0 — context + HITL + gen-UI |
| `V1/showcases/generative-ui/` | README + playground | P0 — protocol taxonomy |
| `V1/showcases/microsoft-kanban/` | kanban UI + shared state | P1 — `/trips` |
| `V1/showcases/deep-agents-job-search/` | `useCopilotReadable` upload | P1 — Camila context |
| `V1/showcases/research-canvas/` | research workspace | P2 |

Update `V1/showcases/README.md` catalog rows when each lands.

---

## One-line strategy

**Showcases = UX and CopilotKit patterns; `integrations/mastra` + canvas examples = engine.**  
Next repos to study: **`banking` → `generative-ui` → `microsoft-kanban` → `deep-agents-job-search`**. Defer LangGraph/Cloud/MCP-heavy demos until the matching mdeai route exits SHELL in `sitemap.md`.

Want this captured as `tasks/notes/notes-22-showcases-index.md` or folded into `notes-21` as an appendix?