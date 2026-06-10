# AGENTS.md — mdeai

Guidance for Codex working in `/home/sk/mdeai/`.

## Repository layout

This is a **planning + application workspace** building a brand-new mdeai app (`mdeapp/`) on CopilotKit + Mastra + Supabase, replacing the legacy `/home/sk/mde/` deployment over a 10-week Phase 1.

- `mdeapp/` — the new Next.js 16 application (CopilotKit 1.55.2 + Mastra + AG-UI). All build/run/test runs from here.
- `plan/` — PRD v6.0 + audits + diagrams. Read `plan/prd.md` (index → 10 chunks) before any code change.
- `tasks/` — execution backlog. **`tasks/core/`** platform (F01–F13, F18–F20) · **`tasks/events/`** Roberto/Andrés · **`tasks/real-estate/`** Camila · **`tasks/maps/`** **MAP-001–012** (implementation order; see `tasks/maps/NUMBERING.md`). Index at `tasks/INDEX.md`.
- `docs/` — strategic background, repo grading, copilotkit + maps research.
- `drafts/` — work-in-progress notes.
- `.Codex/skills/` — 33 enabled Codex skills (Phase 1 pack of 22 + 11 yellow keepers). Lower limits enforced per PDF best-practice ceiling.
- `.agents/skills/` — 22 canonical skill sources. `.Codex/skills/` mostly symlinks here.
- `.agents/skills/_archive/2026-05-19/` — 82 archived skills (wrong-stack, superseded, vendor-saas, etc.). See `MANIFEST.md` to restore.
- `.env.local` (repo root) — shared keys: Google Maps / Places, Gemini, Stripe, Supabase. **Never committed.**
- `CopilotKit/` — full CopilotKit monorepo clone (for `examples/integrations/mastra/` reference).
- `github/` — vendored reference repos (events, maps).

## Project status (2026-05-30)

| Item | State |
|---|---|
| Phase | Phase 1 — **MVP exit** (Tier 1 + UX 1C); foundation shipped (IMP-001–078) |
| MVP readiness | **72/100** forensic — **No-Go** until G1/G3/EVP-001 + UX P0 ([`progress/may30.md`](progress/may30.md)) |
| Plan / queue | [`plan.md`](plan.md) · [`todo.md`](todo.md) · [`tasks/progres.md`](tasks/progres.md) |
| PRD / roadmap | [`prd.md`](prd.md) · [`roadmap.md`](roadmap.md) |
| Skills routing | [`index-skills.md`](index-skills.md) — load ≤5 per task |
| App path | `/home/sk/mdeai/mdeapp/` @ **`8c99ded`** |
| Foundation example | `/home/sk/mdeai/CopilotKit/examples/integrations/mastra/` |
| Supabase | Reuses legacy project `zkwcbyxiwklihegjhuql` (122 tables, RLS-tight) |
| Legacy `/home/sk/mde/` | Hard-freeze — P0 security fixes only |

## Hard rules (preserved from legacy AGENTS.md)

- **Production AI is Gemini only.** No `@anthropic-ai/*` SDK in `mdeapp/` or edge functions.
- **NEVER** put service-role keys in `mdeapp/src/**`. Only edge functions.
- **Carve-out (F13):** `mdeapp/src/mastra/lib/**` and `mdeapp/src/lib/supabase/service-env.ts` + `service.ts` may use `SUPABASE_SERVICE_ROLE_KEY` for server-only `ai_runs` writes (imported by in-process Mastra + `/api/copilotkit` only; hook `no-service-role-in-src.mjs` enforces paths). Do not add service-role references elsewhere under `mdeapp/src/**`.
- **EVERY** new Supabase table needs RLS enabled + ≥ 1 policy.
- **EVERY** Places API New call includes `X-Goog-FieldMask` (cost lever).
- **EVERY** `<AdvancedMarker>` has a `mapId` on parent `<Map>`.
- **CopilotKit pinned at `1.55.2`** for Phase 1. Migrate to v2 in Phase 2 only when Mastra integration ships on v2. **Do not mix v1 and v2 imports.**
- **One worktree, one PR.** See `mde-worktree-pr-flow` skill.
- **Localhost runtime proof required for Done** (rule added 2026-05-20). No task flips `status: Done` without an evidence entry showing `npm run dev` booted clean AND the relevant surface responded (e.g. `curl :3001/` HTTP 200, `POST :3001/api/copilotkit` HTTP 400/200, persona-visible path reachable). This is anti-fake-done gate 9 in [`/home/sk/mdeai/.Codex/skills/task-verifier/references/anti-fake-done-checklist.md`](.Codex/skills/task-verifier/references/anti-fake-done-checklist.md). N/A only for pure-doc tasks that touch zero source/config/hook files, AND that fact is recorded explicitly in evidence.

## Commands (from `mdeapp/`)

```bash
npm install                # one-time after F01 + F01b applied
npm run dev                # concurrently: next dev --turbopack (ui :3000) + mastra dev (agent)
npm run dev:ui             # Next.js only
npm run dev:agent          # Mastra dev server only
npm run dev:debug          # LOG_LEVEL=debug
npm run build              # next build
npm run audit              # npm audit --audit-level=high
```

Test runner: **Vitest** — `npm run test` (**313** tests, 2026-05-30). **Playwright** — 25 files under `e2e/`. Floor: `npm run floor`.

## Local dev URLs (verified 2026-05-19)

| Service | URL | Status / notes |
|---|---|---|
| Next.js UI | `http://localhost:3001` | HTTP 200. Falls back to 3001 when 3000 is occupied. |
| CopilotKit runtime | `http://localhost:3001/api/copilotkit` | POST 200 (runtime connected) |
| Mastra dev Studio | `http://localhost:4111` | Studio UI for agents, traces, memory |
| Port 3000 | `http://localhost:3000` | **Not us** — another process (PID may vary). Next.js auto-fallbacks to 3001 |

**Boot command:** `cd mdeapp && npm run dev` — concurrently spawns `[ui]` (next dev --turbopack) and `[agent]` (mastra dev). Watch for the `[ui]` line showing the actual port (3000 or 3001 depending on availability). If your shell shows only one prefix, the other crashed — restart and check stderr.

**Killing the port-3000 squatter (optional):** `lsof -i :3000` to find the PID; only kill if you know what it is. The Next.js fallback to 3001 is safe — `<CopilotKit runtimeUrl="/api/copilotkit">` uses a relative URL, so it follows whichever port Next.js bound.

## Gemini model registry (verified via `gemini-api-docs-mcp`, 2026-05-19)

> Source: `https://ai.google.dev/gemini-api/docs/models` + `/deprecations`. Always re-verify before naming any model — preview models get superseded fast.

| Tier | Model ID | Released | Use for | Status |
|---|---|---|---|---|
| **Flash (default)** | `gemini-3.5-flash` | **2026-05-19** | All Phase 1 agents (`pingAgent`, `conciergeAgent`, `rentalAgent`, `eventAgent`) | ✅ current, no shutdown announced |
| **Pro** | `gemini-3.1-pro-preview` | 2026-02-19 | Complex parsing (host event form-fill if Flash struggles) | ✅ current |
| **Flash Lite** | `gemini-3.1-flash-lite` | 2026-05-07 | High-volume background jobs (Phase 2 OpenClaw enrichment) | ✅ current, shutdown 2027-05-07 |

### Deprecated / superseded — do NOT use

| Model | Status | Replace with |
|---|---|---|
| `gemini-2.0-flash` / `gemini-2.0-flash-001` | Shutdown 2026-06-01 | `gemini-3.5-flash` |
| `gemini-2.0-flash-exp` | Preview retired | `gemini-3.5-flash` |
| `gemini-2.5-flash` | Supported until 2026-10-16 | `gemini-3.5-flash` (new code) |
| `gemini-2.5-pro` | Supported until 2026-10-16 | `gemini-3.1-pro-preview` |
| `gemini-3-flash-preview` | Superseded by 3.5 | `gemini-3.5-flash` |
| `gemini-2.5-flash-lite` | Supported until 2026-10-16 | `gemini-3.1-flash-lite` |

### Usage with `@ai-sdk/google`

```ts
import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";

export const pingAgent = new Agent({
  id: "ping-agent",
  name: "Ping Agent",
  model: google("gemini-3.5-flash"),    // ← current Flash, not 2.5
  // env var read: GOOGLE_GENERATIVE_AI_API_KEY
  // (NOT GOOGLE_API_KEY which is BuiltInAgent v2 convention)
  // (NOT GEMINI_API_KEY which is what legacy /home/sk/mde edge fns use)
});
```

**Out of scope:** `gpt-*` models (OpenAI). Project is Gemini-first; OpenAI is an optional fallback only if explicitly configured in a specific edge fn, never in default code.

## Language scope

**Phase 1 = English only.** No Lingui, no `<html lang="es">`, no Spanish placeholders. The PRD §1 vision ("Spanish first, English available") is **deferred to Phase 2 (W7+)**. Adding i18n in W1-W6 is out of scope. If you find Spanish strings in `mdeapp/src/**`, treat it as a regression and revert.

## MCP verification cadence (per `plan/prd/00-skills-reference.md`)

Before writing any code that touches an external API, verify via MCP:

| Surface | MCP | Status today |
|---|---|---|
| Gemini model + deprecation | `gemini-api-docs-mcp__search_docs` | ✅ working |
| CopilotKit API + version | `mcp__d0236592__search-docs` | ⚠️ flaky — fall back to local `CopilotKit/examples/integrations/mastra/` |
| CopilotKit source code | `mcp__copilotkit__search-code` | ✅ working (configured 2026-05-19 via `.mcp.json`; verified via tools/call) |
| AG-UI docs + code | `mcp__copilotkit__search-ag-ui-docs` / `search-ag-ui-code` | ✅ working (same MCP server as CopilotKit) |
| Mastra docs | `mcp__mastra__searchMastraDocs` / `readMastraDocs` / `mastraDocs` / `getMastraHelp` | ✅ working (configured 2026-05-19 via `@mastra/mcp-docs-server` stdio in `.mcp.json`) |
| Supabase schema + RLS | `mcp__ed3787fc__execute_sql` | ✅ working |
| Google Maps | `google-maps-code-assist` | ✅ working |

**Rule:** if a MCP returns a correction, fix the implementation before proceeding. If MCP is down, use the matching local skill + verbatim example source.

**MCP servers configured at project scope** (`.mcp.json`):

```jsonc
{
  "mcpServers": {
    "mastra":     { "type": "stdio", "command": "npx", "args": ["-y", "@mastra/mcp-docs-server@latest"] },
    "copilotkit": { "type": "http",  "url": "https://mcp.copilotkit.ai/mcp" }
  }
}
```

The `d0236592-…` hash that appeared in older session tool lists was the same `https://mcp.copilotkit.ai/mcp` endpoint — opaque ID, not a separate server. If it ever shows "disconnected" again, just re-run `Codex mcp list` to retry the health check, or `Codex mcp add ...` to re-register.

## Architecture (mdeapp/)

Next.js 16 (App Router, React 19, Turbopack, Tailwind v4) wires CopilotKit 1.55.2's React UI to a local Mastra agent over the AG-UI protocol. **Phase 1 hero flow: Roberto creating an event via AI form-fill at `/host/event/new`** (W3–W4); **Camila's rentals + chat at `/rentals` + `/chat`** (W5–W7).

Data flow (after F02 + F03 land):

1. **UI** — `src/app/page.tsx` mounts `<CopilotSidebar>` from `@copilotkit/react-ui`. **Phase 1 = English** (`<html lang="en">`). Spanish/Lingui i18n is Phase 2+ (W7+) per PRD §1 vision; the PRD reference to Spanish-first is **deferred until Phase 2**. Uses `useCoAgent<MdeState>({ name: "pingAgent" })` in W1, replaced by `useCoAgent<EventDraftState>({ name: "hostEventAgent" })` in W3, then `useCoAgentState<MapState>` (read-only) for the chat path in W6.
2. **Runtime endpoint** — `src/app/api/copilotkit/route.ts` builds `CopilotRuntime` per request, bridges Mastra via `MastraAgent.getLocalAgents({ mastra })` from `@ag-ui/mastra`. Uses `ExperimentalEmptyAdapter` (agents are local — no second orchestrator).
3. **Mastra core** — `src/mastra/index.ts` constructs `Mastra` with in-memory LibSQL storage + `ConsoleLogger` honoring `LOG_LEVEL`.
4. **Agent** — `src/mastra/agents/index.ts` defines `pingAgent` (was `weatherAgent`) using `google("gemini-3.5-flash")` (NOT OpenAI). Memory has `scope: "thread"` working-memory with Zod schema `MdeState = { lastQuery: string, hint: string }`. The schema mirrors `src/lib/types.ts` — keep in sync.
5. **Tools** — empty in W1. W3 adds `set_event_basics`, `set_venue`, `add_ticket_tier`, `preview_and_publish` (HITL via `renderAndWaitForResponse`). W5+ adds `search_rentals`, `search_events`, `search_grounded_places`.

Key invariants:

- Agent **name** in `useCoAgent({ name })` must match the key in `Mastra({ agents: { ... } })`.
- A `useCopilotAction` with `available: "disabled"` + matching name + `render` is the generative-UI mirror of an agent tool.
- `renderAndWaitForResponse` is the HITL pattern; component receives `respond(value)` to unblock the agent. Phase 1 uses it for Roberto's event-publish approval.
- Working-memory schema changes touch THREE places: the Zod in the agent file, the TS type in `src/lib/types.ts`, and (in W4) `packages/types/src/`.

## Explanation style — use mdeai personas, not generic analogies

When explaining anything — empty tables, infra choices, why a task matters, what a config swap actually changes — anchor it in **mdeai's actual users, surfaces, and data**. Skip "imagine a restaurant…", "think of Stripe…", "it's like Slack…" unless the analogy adds something mdeai-specific can't. Generic analogies feel friendly but make the listener translate twice; mdeai-native examples land directly because the audience already lives in the product.

### Personas (use these by name)

| Persona | Role | Primary surface | Use them when explaining… |
|---|---|---|---|
| **Roberto** | Event host (organizer) | `/host/event/new` wizard (W3–W4) | host-side flows, HITL approval, `EventDraftState`, `hostEventAgent`, ticket setup |
| **Camila** | Apartment seeker + chat user | `/rentals` + `/chat` (W5–W7) | rental search, multi-intent routing, working memory across turns, map pins |
| **Patricia** | Admin / ops | `/admin/*` (W8) | dashboards, leads CRM, observability queries, freeze decisions |
| **Andrés / Miguel** | Ticket buyer | Stripe checkout (W9) | webhook isolation, idempotency, payment finalize |
| **Sofía** | Dev | local + CI | floor gates, lint/test/build, hooks, `.Codex/skills/` |
| **Lucía** | QA | Playwright + chrome-devtools MCP | E2E flows, console-error sweep, visual regression |
| **Tourist** | Restaurants / attractions seeker | `/chat` concierge (W6) | conciergeAgent, `search-restaurants`, `search-attractions`, grounded places |

### Surfaces (use these paths, not abstract ones)

`/`, `/login`, `/host/event/new`, `/host/events`, `/rentals`, `/chat`, `/admin/*`, `/api/copilotkit`. Tie every technical change to which surface it affects and what the persona on that surface notices.

### Do / don't

| Don't say | Do say |
|---|---|
| "Think of the database as a restaurant's filing cabinet…" | "`mastra_messages` is where Camila's chat turns land — every 'show me cheaper' reply is one row." |
| "It's like Stripe's charges table" | "`mastra_ai_spans` is the trace dashboard Sofía opens when Roberto reports the event wizard feels slow." |
| "Imagine a Slack bot's channel config" | "`mastra_channel_config` would only fill if mdeai shipped a WhatsApp version for Camila — we haven't." |
| "F13 swaps the storage adapter" | "F13 makes Camila's chat history survive a Vercel redeploy — today turn 11 forgets turns 1-10 on cold-start." |
| "Stripe webhook secrets should be distinct" | "Today Roberto's ticket revenue and a sponsor signup share one signing secret — F11 separates them so a forged sponsor event can't authenticate against the ticket finalize endpoint." |

### Real-world impact framing

When proposing or summarizing work, name the persona-visible effect. A change without a persona impact is either infra (say so) or scope creep (push back).

- "F07 lands Paisa tokens → every future card (Roberto's event preview, Camila's rental, the concierge's restaurant suggestion) shares the same teal Save button without re-inventing it."
- "F06 produces a `https://mdeapp-<hash>.vercel.app` URL → you can text the designer a link from your phone instead of needing her on localhost."
- "F09 floor exits 0 → Sofía's `npm run floor` catches a regression before it ever reaches Camila's chat."

Empty/full database tables get the same treatment: name **which persona's action would fill the table**, and whether that action is in scope for the current phase.

## Working in this repo

- **Skill routing table:** [`index-skills.md`](index-skills.md) § Load by work type — **≤5 skills** per task.
- **Default pack:** `mde-task-lifecycle` → then `copilotkit` / `copilotkit-integrations` (Mastra wiring), `mastra`, `gemini`, `mde-supabase`, `mde-maps`, `testing`, `task-verifier`, `mde-worktree-pr-flow`.
- **Important:** `copilotkit-develop` is **v2**-oriented; mdeapp is **1.55.2** — use `copilotkit-integrations` + verbatim Mastra example, not v2 hook names.
- **UI:** `shadcn`, `tailwind-best-practices` (symlink under `.claude/skills/`).
- Scan root: `.claude/skills/` (not `.agents/` alone). Archives: `.agents/skills/_archive/2026-05-19/MANIFEST.md`.
- `.env.local` at repo root is the source of truth for keys. `mdeapp/.env.local` is a copy with Next.js-prefixed names (`NEXT_PUBLIC_*` for client-readable, `GOOGLE_GENERATIVE_AI_API_KEY` for the Gemini SDK).
- Planning docs in `plan/prd/`, `plan/audit/`, `plan/diagrams/` are versioned (00–10). Read the dated/numbered ones for current direction. Legacy `docs/` may be superseded — cross-check with `plan/audit/01-plan-audit.md` execution log §11.

## Legacy app freeze (2026-05-26)

See [`/home/sk/mde/FREEZE.md`](../mde/FREEZE.md). After **2026-05-26**, `/home/sk/mde/` accepts only P0 security fixes (data exposure, auth bypass, payment failure, Sentry P0). All non-P0 work belongs in `/home/sk/mdeai/mdeapp/`. The hook `.Codex/hooks/guard-sensitive-paths.mjs` already blocks `Edit/Write/MultiEdit` into the legacy tree — that protection stays on. The 5-min onboarding for the new app lives at [`mdeapp/docs/ARCHITECTURE.md`](mdeapp/docs/ARCHITECTURE.md).
