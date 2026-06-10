# mdeapp — Repository Index

Navigational map of `/home/sk/mdeai/mdeapp/` — the project root for the **mdeai** app (`github.com/amo-tech-ai/mdeapp`). Next.js 16 (App Router, React 19, Turbopack, Tailwind v4) wiring **CopilotKit 1.55.2** → a local **Mastra** agent over **AG-UI**, on **Supabase**. Production AI = **Gemini only**.

> **Repo split:** the sibling planning/workspace repo `github.com/amo-tech-ai/mdeai` lives one level up at `/home/sk/mdeai/` and `.gitignore`s `mdeapp/`. This repo (mdeapp) is self-contained for build/run/test; planning history lives in the parent. All paths below are **mdeapp-root-relative**.

**Last indexed:** 2026-06-08

---

## Quick start (from repo root)

```bash
npm install        # one-time
npm run dev        # next dev (ui :3000→3001) + mastra dev (agent :4111), concurrently
npm run dev:ui     # Next.js only
npm run dev:agent  # Mastra dev server only
npm run build      # next build
npm test           # vitest run (445+ tests)
npm run floor      # lint + typecheck + build + test + audit (ship gate)
```

Local URLs: UI `http://localhost:3001` · CopilotKit runtime `…/api/copilotkit` · Mastra Studio `http://localhost:4111`.

---

## Top-level map

| Path | What it is |
|---|---|
| `src/` | Application source (Next.js app, components, Mastra agent). See [Source map](#source-map). |
| `docs/` | All project docs — architecture, PRDs, tasks backlog, strategy, wireframes. See [Docs map](#docs-map). |
| `e2e/` | Playwright end-to-end specs + `helpers/`. |
| `scripts/` | Smoke tests, scope gates, seeders, perf probes (`.mjs`/`.ts`/`.sh`). |
| `supabase/` | Migrations + edge functions (the canonical migration tree for this repo). |
| `public/` | Static assets served by Next.js. |
| `config/` | Tooling config (`mcporter.json`). |
| `commerce/` | Standalone commerce work — `b2c-storefront/`, `mercur/`. |
| `workspace/` | Scratch / infra-workflow working area (`skills/`, worktree notes). |
| `github/` | Vendored reference repos. |
| `.claude/` | Claude Code config — **skills scan root** (`.claude/skills/`), hooks, settings. |
| `.agents/` | Canonical skill source library (not scanned; symlinked into `.claude/skills/`). |
| `.mastra/` | Mastra build/runtime output. |
| `.github/` · `.vercel/` · `.vscode/` · `.cursor/` · `.codex/` | CI, deploy, editor/agent configs. |
| `node_modules/` · `.next/` · `test-results/` · `tmp/` | Generated — not source. |

### Key root files

| File | Purpose |
|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | Project instructions for Claude Code — hard rules, architecture, commands. **Read first.** |
| [`DESIGN.MD`](./DESIGN.MD) | Color tokens (oklch), typography, layout, component anatomy, do/don't. **Read before any UI work.** |
| [`sitemap.md`](./sitemap.md) | Status of all routes (LIVE/SHELL/MVP/POST) + API inventory. **Read before adding/editing a route.** |
| [`linear.md`](./linear.md) | Linear projects, phases, labels, branch naming, cycle, bulk scripts. |
| [`linear-reference.md`](./linear-reference.md) | Linear taxonomy reference. |
| [`index-skills.md`](./index-skills.md) | Skills inventory graded vs PRD. |
| [`skills-lock.json`](./skills-lock.json) | Pinned skills manifest. |
| [`todo.md`](./todo.md) | Proof-driven launch queue (non-events) — canonical todo for this repo. |
| [`tasks.md`](./tasks.md) · [`plan.md`](./plan.md) · [`dashboard.md`](./dashboard.md) | Backlog, plan snapshot, health dashboard. |
| [`changelog.md`](./changelog.md) | Evidence-scored change log. |
| `package.json` · `next.config.ts` · `tsconfig.json` | Build config. |
| `vitest.config.ts` · `playwright.config.ts` | Test runners. |
| `.env.example` · `.env.infisical` · `.mcp.json` | Env (Infisical-injected) + MCP servers. |

---

## Source map (`src/`)

| Path | Contents |
|---|---|
| `src/app/` | App Router. Routes: `chat`, `events`, `rentals`, `restaurants`, `cafes`, `nightlife`, `host`, `partners`, `me`, `saved`, `trips`, `shop`, `login`, `signup`, `auth` + `page.tsx`, `layout.tsx`, `globals.css`. |
| `src/app/api/` | Route handlers: `copilotkit`, `threads`, `grounded`, `grounding`, `places`, `rentals`, `restaurants`, `events`, `tickets`, `leads`, `partners`, `venue-booking`, `approval-commit`, `scorers`. |
| `src/components/` | UI by domain: `chat`, `copilot`, `cards`, `maps`, `events`, `rentals`, `restaurants`, `cafes`, `nightlife`, `host`, `partners`, `trips`, `tickets`, `saved`, `venues`, `home`, `marketing`, `blocks`, `browse`, `approvals`, `modals`, `sheets`, `empty`, `analytics`, `auth`, `ui` (shadcn). |
| `src/mastra/` | Agent core — `index.ts`, `agents/`, `tools/`, `workflows/`, `scorers/`, `lib/`, `types/`, `copilotkit/`, `workspaces.ts`. |
| `src/hooks/` · `src/lib/` · `src/platform/` | React hooks, shared libs (incl. `lib/supabase/`), platform utilities. |
| `src/middleware.ts` | Next.js middleware. |
| `src/__tests__/` | Co-located unit tests. |

**Data flow:** UI → `components/copilot/copilot-kit-provider.tsx` (agent `"conciergeAgent"`) → `app/api/copilotkit/route.ts` (`CopilotRuntime` + Mastra bridge) → `mastra/index.ts` → `mastra/agents/index.ts` (`conciergeAgent` on `gemini-3.5-flash`). Full detail: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

---

## Docs map (`docs/`)

| Path | What it owns |
|---|---|
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Full app architecture onboarding. |
| [`docs/README.md`](./docs/README.md) | Docs entry point. |
| [`docs/tasks/`](./docs/tasks/) | **Execution backlog** (moved into this repo). Index at [`docs/tasks/INDEX.md`](./docs/tasks/INDEX.md); `CONVENTIONS.md`, `MVP-REQUIRED.md`; subdirs per area (`events`, `real-estate`, `maps`, `copilotkit`, `mastra`, `payments`, `intelligence`, `partners`, `testing/evidence`, `dashboard`, …). |
| [`docs/prd/`](./docs/prd/) | PRDs — commerce marketplace, revenue engine, AI improvement roadmap, chatwoot integration. |
| [`docs/strategy/`](./docs/strategy/) · `strategic-audit.md` · `revenue-strategy*.md` | Strategy + revenue planning. |
| [`docs/wireframes/`](./docs/wireframes/) · [`docs/screenshots/`](./docs/screenshots/) | UX wireframes + captured screens. |
| [`docs/copilotkit-mastra/`](./docs/copilotkit-mastra/) | CopilotKit + Mastra integration research. |
| [`docs/ecommerce/`](./docs/ecommerce/) · [`docs/partners/`](./docs/partners/) · [`docs/restaurant/`](./docs/restaurant/) | Vertical-specific docs. |
| [`docs/linear/`](./docs/linear/) · [`docs/audits/`](./docs/audits/) · [`docs/notes/`](./docs/notes/) | Linear exports, audits, working notes. |
| [`docs/docs-vault/`](./docs/docs-vault/) | Obsidian vault of reference material. |
| [`docs/localhost-qa-runbook.md`](./docs/localhost-qa-runbook.md) · `task-backlog.md` | QA runbook + backlog snapshot. |

---

## Routes (see [`sitemap.md`](./sitemap.md) for live/shell/MVP/post status)

`/` · `/chat` · `/events/[slug]` · `/rentals` · `/restaurants` · `/cafes` · `/nightlife` · `/host/*` · `/partners/*` · `/me/tickets` · `/saved` · `/trips` · `/shop` · `/login` · `/signup` · `/auth/*` · `/api/copilotkit` · `/api/threads` · `/api/grounded`.

---

## Tests

- **Vitest** (445+): `npm test -- --run`. Unit tests co-located in `src/**/__tests__` and `*.test.ts`.
- **Playwright** e2e: [`e2e/`](./e2e/) — `npx playwright test`. Config: `playwright.config.ts`.
- Both must be green before any task flips Done.

---

## Where to look first

| I want to… | Start here |
|---|---|
| Understand the rules | [`CLAUDE.md`](./CLAUDE.md) |
| Add/edit a page | [`sitemap.md`](./sitemap.md) → `src/app/` |
| Do UI work | [`DESIGN.MD`](./DESIGN.MD) → `src/components/ui/` |
| Understand the agent | [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) → `src/mastra/` |
| Pick up a task | [`docs/tasks/INDEX.md`](./docs/tasks/INDEX.md) · [`todo.md`](./todo.md) |
| File a Linear issue | [`linear.md`](./linear.md) |
