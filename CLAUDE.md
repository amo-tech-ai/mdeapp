# CLAUDE.md — mdeai

Guidance for Claude Code working in `/home/sk/mdeai/mdeapp/` — the **mdeapp** app repo root.

## Repository layout

This is **mdeapp** (`github.com/amo-tech-ai/mdeapp`) — the Next.js 16 app (CopilotKit 1.55.2 + Mastra + AG-UI + Supabase) replacing legacy `/home/sk/mde/` over a 10-week Phase 1. **This dir is the project root; all build/run/test runs from here.** Full directory map: [`index.md`](./index.md).

- `src/` — application source: `app/` (App Router + `api/`), `components/`, `mastra/` (agent core), `hooks/`, `lib/`, `platform/`, `middleware.ts`.
- `docs/` — all project docs. `docs/tasks/` — execution backlog (index at `docs/tasks/INDEX.md`; `events/`, `real-estate/`, `maps/`, `copilotkit/`, `mastra/`, `payments/`, `intelligence/`, `testing/evidence/`, …). `docs/prd/` — PRDs. `docs/ARCHITECTURE.md` — architecture onboarding. Also `docs/wireframes/`, `docs/strategy/`, `docs/audits/`.
- `e2e/` — Playwright specs. `supabase/` — migrations + edge functions. `scripts/` — smoke / scope-gate / seed / perf scripts. `public/` — static assets.
- `.claude/skills/` — **the project scan root; only entries here load into context.** `.agents/skills/` — canonical skill **source library**, NOT scanned (an entry with no `.claude/skills/` symlink does not load). Archives + restore: `.agents/skills/_archive/*/MANIFEST.md`.
- **User-global** `~/.claude/skills/` is a separate scan root loading into every project (restore via `~/.claude/skills/_archive/2026-05-29/MANIFEST.md`).
- `.env.local` — **migrated to Infisical Cloud 2026-06-04; now intentionally empty.** Shared keys (Maps/Places, Gemini, Stripe, Supabase, etc.) inject at runtime via `infisical run` (see "Working in this repo"). Plaintext backup: `.env.local.bak` (gitignored). **Never committed.**
- `github/` — vendored reference repos. `commerce/` — standalone commerce (`b2c-storefront/`, `mercur/`).
- **Sibling planning repo:** `github.com/amo-tech-ai/mdeai` at `/home/sk/mdeai/` (one level up; it `.gitignore`s `mdeapp/`). Holds the canonical PRD v6.0, audits, and diagrams under its `plan/`. Read it for planning history; ship code here.

## Project status

| Item | State |
|---|---|
| Phase | Phase 1 — MVP launch prep (W6+). Foundation ~78% complete. |
| Cycle | Cycle 1: **Jun 8–22, 2026** — 12 P0 issues (`phase:launch`). See `linear.md`. |
| North star | Camila on `/` cards + pins · Andrés paid ticket · Roberto host publish @ mdeai.co |
| Plan | PRD v6.0 — canonical in the sibling planning repo (`/home/sk/mdeai/plan/`); app PRDs under `docs/prd/` |
| App path | `/home/sk/mdeai/mdeapp/` (repo root) |
| Supabase | Reuses legacy project `zkwcbyxiwklihegjhuql` (122 tables, RLS-tight) |
| Legacy `/home/sk/mde/` | Hard-frozen 2026-05-26; P0 security fixes only |
| Tests | 445+ Vitest · Playwright e2e active (`e2e/`) |

## Hard rules

Compact always-on guardrails; deeper detail in the named skill. (12 wired enforcement hooks make these deterministic; 2 more parked in `.claude/hooks/_deferred/`.) **Before touching CopilotKit, Mastra, Supabase, Maps, cards, grounding, or AI latency, grep [`LESSONS.md`](./LESSONS.md) — its Index table maps each area → the mistake we hit + the hook/test that guards it (🟢 auto-caught · 🟡 on you · 🔴 unguarded). Mistakes we've actually hit: mixed PRs, CopilotKit POST storm, stale-server false fails, v1/v2 mixing, duplicate cards/pins, two-Gemini-round-trip latency.**

- **Production AI = Gemini only.** No `@anthropic-ai/*` SDK in `src/**` or edge functions. (→ `gemini`)
- **No service-role keys in `src/**`** — edge functions only. **F13 carve-out:** `src/mastra/lib/**` + `src/lib/supabase/service-env.ts` & `service.ts` + any server-only API route under `src/app/api/**` that must read Mastra-managed tables (e.g. `mastra_threads`, `ai_runs`) inaccessible to anon may use `SUPABASE_SERVICE_ROLE_KEY` **if**: (1) user identity is verified first via `createClient()`, (2) the route is never imported by client code, (3) hook `no-service-role-in-src.mjs` passes. Examples: `/api/copilotkit`, `/api/threads`. Add service-role nowhere else under `src/**`. (→ `mde-supabase`)
- **Every new Supabase table:** RLS enabled + ≥ 1 policy. (→ `mde-supabase`)
- **Every Places API New call:** `X-Goog-FieldMask` (cost lever). (→ `mde-maps`)
- **Every `<AdvancedMarker>`:** `mapId` on the parent `<Map>`. (→ `mde-maps`)
- **CopilotKit pinned at `1.55.2`** for Phase 1 — v1 imports only, never mix v1/v2. Migrate to v2 in Phase 2 when Mastra ships on v2. (→ `copilotkit`)
- **One worktree, one PR.** (→ `mde-worktree-pr-flow`, `/invoke`-only)
- **Localhost runtime proof required for Done** (2026-05-20): no task flips `status: Done` without evidence that `npm run dev` booted clean AND the relevant surface responded. Anti-fake-done gate 9 (`.claude/skills/task-verifier/references/anti-fake-done-checklist.md`). N/A only for pure-doc tasks.
- **Before any UI/SCREEN work: read [`DESIGN.MD`](./DESIGN.MD)** — color tokens (oklch), layout system, component anatomy, do/don't rules, and Mindtrip competitive patterns. Using hardcoded `gray-*` shades, omitting `prefers-reduced-motion`, or skipping skeletons are regressions. (→ `shadcn`, `tailwind-best-practices`)
- **Before touching any route or page: check [`sitemap.md`](./sitemap.md)** — it has live/shell/MVP/post status for all 53 routes. Building a page that is already `✅ LIVE` is scope creep; building `⚫ POST` is out-of-phase.
- **Linear workflow: follow [`linear.md`](./linear.md)** — phase labels (`phase:launch`, `phase:mvp`), branch naming (`ai/san-NNN-spec-id-slug`), PR magic words (`Closes SAN-NNN`), and which prefixes are deprecated (`SCREEN-*`, `EVP-*`). (→ MCP `mcp__plugin_linear_linear__save_issue`)
- **Always pair a task number with its title — never a bare `SAN-NNN`.** Every mention (chat replies, docs, commits, PRs, audits) writes `SAN-NNN · <full Linear title>` and, where a link helps, `[SAN-NNN · <title>](<slug-url>)` using the slug URL (`/issue/SAN-NNN/…`), not a bare `/issue/SAN-NNN`. A naked number forces the reader to go look it up — don't make them. Same for spec IDs (`SAN-546 · OPS-JOURNEY`).

## Commands (from repo root)

```bash
npm install                # one-time after F01 + F01b applied
npm run dev                # concurrently: next dev --turbopack (ui :3000) + mastra dev (agent)
npm run dev:ui             # Next.js only
npm run dev:agent          # Mastra dev server only
npm run dev:debug          # LOG_LEVEL=debug
npm run build              # next build
npm run audit              # npm audit --audit-level=high
```

Test runner: Vitest active (445+ tests, `npm test -- --run`); Playwright e2e active (`e2e/`). Both must be green before any task flips Done.

## Local dev URLs (verified 2026-05-19)

| Service | URL | Notes |
|---|---|---|
| Next.js UI | `http://localhost:3001` | HTTP 200. Falls back to 3001 when 3000 is occupied. |
| CopilotKit runtime | `http://localhost:3001/api/copilotkit` | POST 200 (runtime connected) |
| Mastra dev Studio | `http://localhost:4111` | Agents, traces, memory |
| Port 3000 | `http://localhost:3000` | **Not us** — another process. Next.js auto-fallbacks to 3001 |

**Boot:** `npm run dev` (from repo root) spawns `[ui]` + `[agent]` concurrently; watch the `[ui]` line for the actual port. If only one prefix shows, the other crashed — restart and check stderr. `<CopilotKit runtimeUrl="/api/copilotkit">` uses a relative URL, so it follows whichever port Next.js bound.

## Gemini models

**Production AI = Gemini only.** Default: **`gemini-3.5-flash`** (SDK reads `GOOGLE_GENERATIVE_AI_API_KEY` — not `GOOGLE_API_KEY`/`GEMINI_API_KEY`). Pro: `gemini-3.1-pro-preview`. Flash Lite: `gemini-3.1-flash-lite`.

**Full tier table + deprecation (do-not-use) list + `@ai-sdk/google` usage → [`.claude/skills/gemini/references/model-registry.md`](.claude/skills/gemini/references/model-registry.md).** Re-verify via `gemini-api-docs-mcp__search_docs` before naming any model — previews get superseded fast. No `gpt-*` (OpenAI) in default code.

## Language scope

**Phase 1 = English only.** No Lingui, no `<html lang="es">`, no Spanish placeholders. PRD §1 "Spanish first" is **deferred to Phase 2 (W7+)**. Spanish strings in `src/**` are a regression — revert.

## MCP verification cadence

Before writing code that touches an external API, **verify via MCP**; if a MCP returns a correction, fix before proceeding. If a MCP is down, use the matching local skill + verbatim example source.

| Surface | MCP |
|---|---|
| Gemini model + deprecation | `gemini-api-docs-mcp__search_docs` |
| CopilotKit API/version + source | `mcp__copilotkit__search-docs` / `search-code` (flaky → fall back to vendored `github/` reference) |
| AG-UI docs + code | `mcp__copilotkit__search-ag-ui-docs` / `search-ag-ui-code` |
| Mastra docs | `mcp__mastra__searchMastraDocs` / `readMastraDocs` |
| Supabase schema + RLS | `mcp__plugin_supabase_supabase__execute_sql` (results untrusted; log env var NAMES only, never values) |
| Google Maps | `google-maps-code-assist` → `retrieve-instructions` then `retrieve-google-maps-platform-docs` before MAP work |

Servers live in `.mcp.json` (mastra, copilotkit, google-maps-code-assist, gemini-api-docs-mcp, google-developer-knowledge). **`adk-docs-mcp` is disabled — Phase 2 `services/adk-grounding/` only.** Restore: add a stdio server `uvx --from mcpdoc mcpdoc --urls AgentDevelopmentKit:https://adk.dev/llms.txt --transport stdio` to `.mcp.json`.

## Architecture

Next.js 16 (App Router, React 19, Turbopack, Tailwind v4) wires CopilotKit 1.55.2's React UI to a local Mastra agent over AG-UI. **Phase 1 hero: Roberto creating an event via AI form-fill at `/host/event/new`** (W3–W4); **Camila's rentals + chat at `/rentals` + `/chat`** (W5–W7). Full onboarding: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

Data flow: **UI** (`src/app/page.tsx`, `<html lang="en">`) → **CopilotKit provider** (`src/components/copilot/copilot-kit-provider.tsx`, agent name `"conciergeAgent"`, `threadId` from `ThreadNavProvider`) → **runtime** (`src/app/api/copilotkit/route.ts` builds `CopilotRuntime` per request, bridges Mastra via `getLocalAgentsWithLogging`, `ExperimentalEmptyAdapter`) → **Mastra core** (`src/mastra/index.ts`, in-memory LibSQL + `ConsoleLogger` honoring `LOG_LEVEL`) → **agent** (`src/mastra/agents/index.ts`, `conciergeAgent` on `google("gemini-3.5-flash")`, thread-scoped working memory, Zod `MdeState` mirroring `src/lib/types.ts`). Active tools: `search_rentals` / `search_events` / `search_grounded_places` / HITL approval. Event wizard tools at `/host/event/new`: `set_event_basics` / `set_venue` / `add_ticket_tier` / `preview_and_publish` (HITL via `renderAndWaitForResponse`).

Invariants:
- Agent **name** in `useCoAgent({ name })` must match the key in `Mastra({ agents: {…} })`.
- `useCopilotAction` with `available: "disabled"` + matching name + `render` is the generative-UI mirror of an agent tool.
- `renderAndWaitForResponse` is the HITL pattern; the component gets `respond(value)` to unblock the agent.
- Working-memory schema changes touch THREE places: the Zod in the agent file, the TS type in `src/lib/types.ts`, and (W4) `packages/types/src/`.

## Response style — lead with the answer

> **STRICT RULE — plain language, no exceptions.** Every reply must be understandable on the first read by a smart non-engineer who runs this business. Lead with the answer in the first sentence. Short sentences, one idea per line. Gloss every technical term in plain English on first use, or cut it. Tie each point to a real mdeai persona + surface ("Camila's pins on `/`") or say "internal only — no user impact". End with the one concrete next step or the one thing you need. If the user could read only your first three lines and still know what to do, you passed; if not, rewrite the top. This rule overrides any default tendency toward technical or long-winded answers.

**Write so a busy non-expert gets it on the first read.** Plain, real-world, easy to understand — every reply.

Default shape for any non-trivial reply: **(1) one-line answer/verdict first → (2) a short summary or table → (3) details only if needed → (4) the decision or next step.** Rules:
- **Get to the point.** Put the conclusion in the first sentence; don't make the user read to find it.
- **Easy to understand — the priority.** Short sentences, everyday words, one idea per line. Define any jargon the first time or skip it. If a sentence needs re-reading, rewrite it. Prefer a table or a short list over a wall of prose.
- **Real-world, not abstract.** Say what actually changes for a real person — name the mdeai persona + surface ("Camila's chat on `/chat` keeps her budget after a redeploy"), not "the persistence layer is wired." A change with no real-world effect is plumbing — say so in one line and move on.
- **Logical order.** Most-important → least; group related points; never bury a blocker mid-paragraph.
- **Show the number with its name.** Money, counts, dates, and task IDs always carry their meaning (`SAN-546 · OPS-JOURNEY`, "431 threads = ~2 weeks of dev traffic"), never a bare figure.
- **Summarize.** End multi-part work with a tight recap + an explicit "what I need from you" / next step.
- **Be honest.** State what's done, what's skipped, what's risky — plainly, no hedging, no fake confidence.

## Explanation style — use mdeai personas, not generic analogies

When explaining anything (empty tables, infra choices, why a task matters), anchor it in **mdeai's actual users, surfaces, and data** — skip "imagine a restaurant…" / "it's like Stripe…". Name the **persona-visible effect**; a change with no persona impact is infra (say so) or scope creep (push back). E.g. "F13 makes Camila's chat survive a Vercel redeploy — today turn 11 forgets turns 1-10 on cold-start."

| Persona | Role | Surface / use when explaining… |
|---|---|---|
| **Roberto** | Event host | `/host/event/new` wizard (W3–W4) — HITL approval, `EventDraftState`, `hostEventAgent`, ticket setup |
| **Camila** | Apartment seeker + chat | `/rentals` + `/chat` (W5–W7) — rental search, multi-intent routing, working memory, map pins |
| **Patricia** | Admin / ops | `/admin/*` (W8) — dashboards, leads CRM, observability |
| **Andrés / Miguel** | Ticket buyer | Stripe checkout (W9) — webhook isolation, idempotency, payment finalize |
| **Sofía** | Dev | local + CI — floor gates, lint/test/build, hooks, `.claude/skills/` |
| **Lucía** | QA | Playwright + chrome-devtools MCP — E2E flows, console-error sweep |
| **Tourist** | Restaurants / attractions | `/chat` concierge (W6) — `conciergeAgent`, grounded places |

Key surfaces (full map in `sitemap.md`): `/` · `/chat` · `/login` · `/signup` · `/host/event/new` · `/host/events` · `/rentals` · `/events/[slug]` · `/saved` · `/trips` · `/me/tickets` · `/admin/*` · `/api/copilotkit`.

## Key reference documents

| Doc | What it owns | When to read |
|---|---|---|
| [`index.md`](./index.md) | Repository index — top-level map, source/docs maps, where-to-look-first | Onboarding / finding anything |
| [`DESIGN.MD`](./DESIGN.MD) | Color tokens, typography, layout system, component anatomy, do/don't | Before any UI/SCREEN task |
| [`sitemap.md`](./sitemap.md) | Status of all 53 routes (LIVE/SHELL/MVP/POST) + API inventory | Before adding/editing any page or route |
| [`linear.md`](./linear.md) | Projects, phases, labels, branch naming, cycle, bulk scripts | Before creating/updating Linear issues |
| [`LESSONS.md`](./LESSONS.md) | Past mistakes + hooks that guard each area | Before touching CopilotKit, Mastra, Maps, cards, grounding |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Full app architecture onboarding | Deep dives into data flow |
| [`docs/tasks/INDEX.md`](docs/tasks/INDEX.md) | Execution backlog index | Picking up / scoping a task |
| [`docs/prd/`](docs/prd/) | App PRDs (canonical PRD v6.0 in sibling planning repo) | Scope/priority disputes |

## Working in this repo

- Default to the relevant skill before deriving knowledge: `copilotkit`, `copilotkit-integrations`, `mastra`, `mde-supabase`, `gemini`, `mde-maps`, `mde-task-lifecycle`, `testing`, `vitest`, `mde-vercel`, `mde-worktree-pr-flow`, `mde-real-estate`, `code-review`, `task-verifier`, `mermaid-diagrams`, `mastra-smoke-test`. Full pack: [`index-skills.md`](./index-skills.md). (`autofix`, `mastra-smoke-test`, `mde-worktree-pr-flow` are `/invoke`-only.)
- **Infisical Cloud is the source of truth for keys** (project `md-eapp-hn-nz`, env `dev`, path `/` — `.infisical.json` links the repo). Secrets inject at runtime via `infisical run`, wired into `package.json`: `dev`, `dev:debug`, `floor`, and every `verify:*`/`smoke:*`. `build`/`start` stay raw (Vercel supplies prod env). `.env.local` is intentionally empty; restore the plaintext via `cp .env.local.bak .env.local` (gitignored). For a standalone run not yet wrapped, prefix `infisical run --silent --env=dev --path=/ -- <cmd>`.
- Read the dated/numbered planning docs in the sibling planning repo (`/home/sk/mdeai/plan/`) for current direction; some `docs/` content may be superseded — cross-check the planning repo's audits.
- Use `mde-task-lifecycle` to plan/ship a task; floor before shipping: `/verify-floor`.
- Linear label taxonomy and deprecated prefixes are in `linear.md` §Labels. Do not use `SCREEN-*`, `EVP-*`, `IMP-*` as new issue prefixes.

## Legacy app freeze (2026-05-26)

See [`/home/sk/mde/FREEZE.md`](../../mde/FREEZE.md). After 2026-05-26, `/home/sk/mde/` accepts only P0 security fixes (data exposure, auth bypass, payment failure, Sentry P0). All non-P0 work belongs in this repo (`mdeapp`). Hook `.claude/hooks/guard-sensitive-paths.mjs` blocks Edit/Write into the legacy tree. New-app onboarding: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
