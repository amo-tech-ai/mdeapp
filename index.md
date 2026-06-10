# mdeapp — Repository Index

Navigational map of `/home/sk/mdeai/mdeapp/` — the project root for the **mdeai** app (`github.com/amo-tech-ai/mdeapp`). Next.js 16 (App Router, React 19, Turbopack, Tailwind v4) wiring **CopilotKit 1.55.2** → a local **Mastra** agent over **AG-UI**, on **Supabase**. Production AI = **Gemini only**.

> **Repo split:** the sibling planning/workspace repo `github.com/amo-tech-ai/mdeai` lives one level up at `/home/sk/mdeai/` and `.gitignore`s `mdeapp/`. This repo (mdeapp) is self-contained for build/run/test; planning history lives in the parent. All paths below are **mdeapp-root-relative**.

**Last indexed:** 2026-06-10 (post [PR #158](https://github.com/amo-tech-ai/mdeapp/pull/158) docs restore on `main` @ `6542210`)

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
| `commerce/` | Standalone commerce — `mercur/` (tracked); `b2c-storefront/` local reference (gitignored). |
| `graphify-out/` | Generated codebase graph (`graph.json`, `GRAPH_REPORT.md`) — gitignored, rebuilt on commit. |
| `.worktrees/` | Canonical linked worktrees (`wt-san-NNN-slug/`) — gitignored. |
| `workspace/` | Scratch / infra-workflow working area (`skills/`, worktree notes). |
| `github/` | Vendored reference clones — gitignored (`/github/`). |
| `.claude/` | Claude Code config — **skills scan root** (`.claude/skills/`), hooks, settings. |
| `.agents/` | Canonical skill source library (not scanned; symlinked into `.claude/skills/`). |
| `.mastra/` | Mastra build/runtime output. |
| `.github/` · `.vercel/` · `.vscode/` · `.cursor/` · `.codex/` | CI, deploy, editor/agent configs. |
| `node_modules/` · `.next/` · `test-results/` · `tmp/` | Generated — not source. |

### Key root files

| File | Purpose |
|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | Project instructions for Claude Code — hard rules, architecture, commands. **Read first.** |
| [`index.md`](./index.md) | This file — repo map. |
| [`lean.md`](./lean.md) | Lean orchestrator (class D/C/U/S, verify gates, pairing). |
| [`prd.md`](./prd.md) · [`roadmap.md`](./roadmap.md) · [`plan.md`](./plan.md) | PRD index, roadmap, plan snapshot. |
| [`DESIGN.MD`](./DESIGN.MD) | Color tokens (oklch), typography, layout, component anatomy, do/don't. **Read before any UI work.** |
| [`LESSONS.md`](./LESSONS.md) | Past mistakes + hooks that guard each area. |
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

> **Master router:** [`docs/index-docs.md`](./docs/index-docs.md) — freshness dots, events SoT, known gaps.
> **Restore:** squash-merged via PR #158 (`6542210`); **3,460** paths tracked in git on `main`.

| Path | What it owns | Tracked files |
|---|---|---:|
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Full app architecture onboarding. | 1 |
| [`docs/README.md`](./docs/README.md) | Docs entry point. | 1 |
| [`docs/tasks/`](./docs/tasks/) | **Execution backlog** — [`INDEX.md`](./docs/tasks/INDEX.md); compat [`tasks/`](./tasks/) @ repo root → same tree. Domains: `events` (301), `partners` (160), … | ~1,400+ |
| [`docs/prd/`](./docs/prd/) | App PRDs (canonical PRD v6.0 still at outer `plan/prd.md`). | varies |
| [`docs/strategy/`](./docs/strategy/) · `strategic-audit.md` · `revenue-strategy*.md` | Strategy + revenue planning. | varies |
| [`docs/wireframes/`](./docs/wireframes/) | AI-native marketplace wireframes (June 2026 — auth, consumer, events). | 35 |
| [`docs/wireframes-design/`](./docs/wireframes-design/) · [`docs/design/wireframes/`](./docs/design/wireframes/) | Legacy D-track SCR/WIRE set (00–06 + mobile + screens). Alias `wireframes-design` → `design/wireframes`. | 75 |
| [`docs/design/wireframe/`](./docs/design/wireframe/) | HTML lo-fi mockups (cafes, restaurants, nightlife). | 17 |
| [`docs/design/`](./docs/design/) | Design improvement pack + pages + mockups. | 158 |
| [`docs/screenshots/`](./docs/screenshots/) | Captured screens — **local symlink** → `/home/sk/mdeai/screenshots` (gitignored). | 0 in git |
| [`docs/copilotkit-mastra/`](./docs/copilotkit-mastra/) | CopilotKit + Mastra integration research. | 6 |
| [`docs/ecommerce/`](./docs/ecommerce/) | Medusa commerce tasks + evidence (`ECOM-C-*`). | 70 |
| [`docs/partners/`](./docs/partners/) | Partner stack (ptr001–014). | 160 |
| [`docs/restaurant/`](./docs/restaurant/) | Restaurant booking research (`04`–`08` mastra/openclaw). | 8 |
| [`docs/events/`](./docs/events/) | **Events platform SoT** — symlink → [`docs/tasks/events/`](./docs/tasks/events/) (`todo.md`, `plans/`, `tasks/`, `specs/`, `index-events.md`, 301 files). | 301 |
| [`docs/research/`](./docs/research/) | Deep audits; `**/repos/` vendored clones gitignored. | markdown only |
| [`docs/linear/`](./docs/linear/) · [`docs/audits/`](./docs/audits/) · [`docs/notes/`](./docs/notes/) | Linear exports, audits, session notes. | varies |
| [`docs/docs-vault/`](./docs/docs-vault/) | Obsidian reference vault (gitignored bulk). | 0 in git |
| [`docs/graphify-reference.md`](./docs/graphify-reference.md) | Graphify hook + `graphify-out/` usage. | 1 |
| [`docs/localhost-qa-runbook.md`](./docs/localhost-qa-runbook.md) · `task-backlog.md` | QA runbook + backlog snapshot. | 2 |

### Docs restore verification (2026-06-10)

| Check | Result |
|---|---|
| Root nav (`lean.md`, `CLAUDE.md`, `plan.md`, `index-skills.md`, `prd.md`, `roadmap.md`, `sitemap.md`, `tasks.md`) | ✅ on disk + tracked |
| `docs/` tracked in git | **3,460** files |
| `docs/` on disk (incl. local-only notes) | **3,610** files (+150 local notes / archives) |
| Gitlinks (nested repos) | **0** |
| `.claude/` tracked | **311** paths; **34** skills in scan root |
| Broken symlinks under `docs/` | **0** |
| `docs/tasks/INDEX.md` relative links | ✅ spot-checked |
| Intentionally **not** in git | `docs/screenshots/`, `docs/docs-vault/`, `docs/research/**/repos/`, `.obsidian/` caches |
| Compat symlinks (untracked until next PR) | `docs/events` → `tasks/events`, `tasks/` → `docs/tasks`, `docs/plan.md` → root nav, `MVP-EXECUTION` alias |

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
| Pick up a task | [`docs/index-docs.md`](./docs/index-docs.md) → [`docs/tasks/INDEX.md`](./docs/tasks/INDEX.md) · [`todo.md`](./todo.md) |
| Lean workflow / verify class | [`lean.md`](./lean.md) |
| File a Linear issue | [`linear.md`](./linear.md) |
