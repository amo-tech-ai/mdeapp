# MCP cadence — which MCP verifies which surface

> Before writing or executing any task, verify external surfaces via the matching MCP. If an MCP returns a correction, fix the task spec or implementation **before proceeding**.

## Surface → MCP map

| Surface | MCP / source | Common verifications |
|---|---|---|
| **CopilotKit API + version** | `mcp__copilotkit__search-docs`, `search-code` | Hook names (v1 vs v2), pinned version, AG-UI bridge shape |
| **CopilotKit AG-UI** | `mcp__copilotkit__search-ag-ui-docs`, `search-ag-ui-code` | `context.writer.custom`, SSE event types |
| **Mastra docs** | `mcp__mastra__searchMastraDocs`, `readMastraDocs`, `getMastraHelp` | Agent/Memory/Workflow/Processors/Workspace beta API |
| **Mastra installed API shape** | `ls`/`grep` under `node_modules/@mastra/core/dist/**` | Constructor options, exported class names, type literal unions |
| **Supabase schema + RLS** | `mcp__ed3787fc-…__execute_sql`, `list_tables`, `get_advisors` | Table existence, row counts, RLS coverage, advisor lints |
| **Supabase edge functions** | `mcp__ed3787fc-…__list_edge_functions`, `get_edge_function` | Live version, `verify_jwt` flag, deployed source |
| **Gemini model + deprecations** | `gemini-api-docs-mcp__search_docs` | Current model IDs, shutdown dates, parameter changes |
| **Google Maps API + Places** | `google-maps-code-assist` | Field masks, AdvancedMarker mapId requirement |
| **GitHub repo state** | `gh api repos/<owner>/<repo>` | Visibility, default branch, latest SHA, topics |
| **Vercel project state** | `vercel:status` skill | Linked project name, prod URL — critical to avoid clobbering `amo100/mdeai` |

## Rules

1. **If a task spec names an API, function, or env var, the corresponding MCP must confirm it before the task is "Safe to execute".** Memory from training data is not evidence.
2. **For beta APIs, prefer local `node_modules/` over remote docs.** Beta drift is faster than doc updates — what's shipped in `dist/` is the ground truth.
3. **If an MCP returns 0 hits for a referenced symbol, that's a 🔴 finding.** Either the symbol was renamed, removed, or never existed.
4. **Edge function checks must use `get_edge_function` (which returns deployed source)**, not `grep` against `/home/sk/mde/supabase/functions/<slug>/` — some functions are deploy-only and have no local mirror.
5. **Never trust legacy edge function paths for fns that mdeapp doesn't ship.** Sponsor / openclaw / postiz / contest functions are deploy-only on the live project.

## Trap list (mdeai-specific)

| Trap | What to probe instead |
|---|---|
| Task says `@mastra/core/processors → TokenLimiter` | `ls node_modules/@mastra/core/dist/processors/processors/` — class is `TokenLimiterProcessor` on beta |
| Task says `Agent({ workflows: [...] })` | `grep workflows node_modules/@mastra/core/dist/agent/agent.d.ts` — constructor option absent on beta |
| Task says `@mastra/evals` | `ls node_modules/@mastra/evals` — absent on beta (must defer or use other) |
| Task says `tailwind.config.ts` | `cat node_modules/tailwindcss/package.json` — v4 is CSS-first; no config file needed |
| Task says `gemini-2.5-flash` | Replace with `gemini-3.5-flash` per CLAUDE.md model registry |
| Task says `npm audit exit 0` | Run `npm run audit` (script uses `--audit-level=high`); don't conflate with bare `npm audit` |
| Task says `F09-supp` | `ls tasks/core/F09*.md` — actual file is `F09-floor-script-and-vitest.md` |
| Task references repo `mdeai/mdeai-app` | `gh repo view amo-tech-ai/mdeapp` — real repo namespace |
| Task says `vercel link → amo100/mdeai` | That's legacy production `www.mdeai.co`; create new project for mdeapp |
