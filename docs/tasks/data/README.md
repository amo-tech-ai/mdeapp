# tasks/data — planning & audit index

Structured specs, audits, and roadmaps for **mdeapp** + Supabase project `zkwcbyxiwklihegjhuql`. Not executable code — companion to `tasks/core/F*.md`.

## Folders

| Path | Purpose |
|------|---------|
| [`plan/`](plan/) | Architecture roadmaps, audits (17–22), product schema — **active reference** |
| [`../PR/tasks-data/`](../PR/tasks-data/INDEX-data.md) | **Active DATA specs** — open / in-progress / blocked |
| [`archive/`](archive/) | **Done DATA specs** (25 files, 2026-06-01) |
| [`auth/`](auth/) | **Open auth tasks** AUTH-005, 009, 011 — Done → [`../archive/data-A/`](../archive/data-A/README.md) |
| [`supabase/`](supabase/) | Supabase README + links to audits & skills |
| [`diagrams/`](diagrams/) | Mermaid sources (auth journeys, RLS, etc.) |

## Start here

| If you are… | Read |
|-------------|------|
| Implementing login / Google / RLS tools | [`auth/INDEX.md`](auth/INDEX.md) → open AUTH-005/009/011; Done in [`../archive/data-A/`](../archive/data-A/README.md) |
| Auditing live DB + edge | [`plan/18-supabase-audit.md`](plan/18-supabase-audit.md), [`plan/17-edge-audit.md`](plan/17-edge-audit.md) |
| Full auth architecture | [`plan/21-auth-architecture-roadmap.md`](plan/21-auth-architecture-roadmap.md) |
| Supabase conventions | [`supabase/README.md`](supabase/README.md) |

## Skills (load before coding)

| Work | Skill |
|------|-------|
| Auth, RLS, edge, migrations | `mde-supabase` |
| Mastra agents / tools / server auth | `mastra` |
| CopilotKit + Mastra wiring | `copilotkit-integrations` → `references/integrations/mastra.md` |
| New routes / provider | `copilotkit-setup`, `copilotkit-develop` |

## MCP verification (2026-05-20)

| Source | Tool | Used for auth tasks |
|--------|------|---------------------|
| Supabase | `user-supabase` → `search_docs` | Google OAuth, SSR `getUser`, JWT |
| Mastra | `user-mastra` → `mastraDocs` | `docs/server/auth/supabase`, `MastraAuthSupabase` |
| CopilotKit | Local skill + `mdeapp/src/app/api/copilotkit/route.ts` | Pattern 1 in-process; example has **no** auth |

## Related

- Foundation auth (Done): `tasks/core/F08-supabase-auth-login-page.md`
- CLAUDE.md hard rules: service role never in `mdeapp/src/**`, Gemini-only, CopilotKit 1.55.2
