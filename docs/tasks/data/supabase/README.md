# Supabase data docs — mdeai

**Project:** `zkwcbyxiwklihegjhuql` · `https://zkwcbyxiwklihegjhuql.supabase.co`  
**App:** `/home/sk/mdeai/mdeapp/` — all client code under `src/lib/supabase/`

Supabase is the **single source of truth** for identity (Auth JWT), data (Postgres + RLS), and selective Edge Functions (money, leads, webhooks). Mastra + CopilotKit run on Vercel and **read** Supabase sessions via Next.js cookies — they do not replace Supabase Auth.

---

## Official documentation (always re-check)

| Topic | URL |
|-------|-----|
| Auth overview | https://supabase.com/docs/guides/auth |
| JWT + RLS | https://supabase.com/docs/guides/auth/jwts |
| JWT claims | https://supabase.com/docs/guides/auth/jwt-fields |
| Google OAuth | https://supabase.com/docs/guides/auth/social-login/auth-google |
| Next.js SSR (cookies) | https://supabase.com/docs/guides/auth/server-side/nextjs |
| Creating SSR client | https://supabase.com/docs/guides/auth/server-side/creating-a-client |
| RLS | https://supabase.com/docs/guides/database/postgres/row-level-security |

**MCP:** `user-supabase` → `search_docs` with GraphQL (see skill `mde-supabase`).

---

## Repo layout (mdeapp)

```
mdeapp/src/lib/supabase/
  client.ts          # Browser — anon/publishable key
  server.ts          # RSC / route handlers — cookies
  middleware.ts      # Session refresh + route guard
  env.ts             # URL + key resolution
  edge-functions.ts  # Bearer forward to /functions/v1
```

**Env (see `mdeapp/.env.example`):**

| Variable | Scope | Role |
|----------|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Anon JWT → RLS as `anon` / `authenticated` |
| `NEXT_PUBLIC_SITE_URL` | Server actions | Magic link + OAuth redirect base |
| `SUPABASE_URL` | Server / Mastra tools | Same project |
| `SUPABASE_ANON_KEY` | Mastra tools | Prefer over service role |
| `SUPABASE_SERVICE_ROLE_KEY` | Server audit only | **Never** `NEXT_PUBLIC_*`; hook blocks new uses in `src/` |
| `DATABASE_URL` | `search-rentals` pool | 🟡 Bypasses RLS — tighten per AUTH-008 |

---

## Live audits in this repo

| Doc | What it covers |
|-----|----------------|
| [`../plan/18-supabase-audit.md`](../plan/18-supabase-audit.md) | 118 tables, RLS grades, `DATABASE_URL`, service role in server |
| [`../plan/17-edge-audit.md`](../plan/17-edge-audit.md) | 38 edge functions, JWT on/off, mdeapp ports |
| [`../plan/21-auth-architecture-roadmap.md`](../plan/21-auth-architecture-roadmap.md) | End-to-end auth + CopilotKit + Mastra |
| [`../auth/INDEX.md`](../auth/INDEX.md) | Executable auth tasks AUTH-001…011 |

**Migrations:** Canonical SQL today lives in `/home/sk/mde/supabase/migrations/` (legacy). New migrations for mdeapp should eventually live in `mdeapp/supabase/migrations/` — track in product schema roadmap.

---

## Auth patterns (mdeapp)

### 1. Session in Next.js (F08 — Done)

- Magic link: `signInWithOtp` → `/auth/callback` → `exchangeCodeForSession`
- Middleware: `getUser()` + refresh cookies ([SSR guide](https://supabase.com/docs/guides/auth/server-side/nextjs))
- Hard gate: `/host/**` only today; `/trips`, `/saved` in AUTH-003

### 2. CopilotKit → Mastra (Pattern 1)

- Route: `POST /api/copilotkit` reads cookies → `getUser()` → `userId` in `RequestContext`
- **Not** in upstream CopilotKit Mastra example — mdeapp addition is correct
- Production: `COPILOTKIT_API_KEY` Bearer ([`copilotkit-auth.ts`](../../../mdeapp/src/lib/copilotkit-auth.ts))
- Skill: `copilotkit-integrations` → Mastra in-process only for Phase 1

### 3. Edge function proxy

```ts
// Pattern: session.access_token as Authorization Bearer
headers: getSupabaseAnonAuthHeaders(session?.access_token)
```

Used by: `schedule-viewing`, `approval-commit`. JWT-off edges rely on app-layer validation — see AUTH-011 + edge audit.

### 4. Mastra tools + RLS

| Tool | DB access | RLS |
|------|-----------|-----|
| `search-events` | Supabase JS (anon, optional SR fallback) | Public published events |
| `search-rentals` | `pg` + `DATABASE_URL` | **Bypass** — AUTH-008 |
| User trips/saved | — | Needs AUTH-006 user-scoped client |

### 5. Mastra server auth (deferred)

`@mastra/auth-supabase` applies to **Mastra HTTP server / Studio** (`:4111`), not in-process CopilotKit ([Mastra docs](https://mastra.ai/docs/server/auth/supabase) — verified MCP 2026-05-20). Use AUTH-010 only if Studio is public.

---

## RLS rules (mde-supabase skill)

1. Every new `public` table: `ENABLE ROW LEVEL SECURITY` + ≥1 policy.
2. Use `(SELECT auth.uid())` in policies, not bare `auth.uid()` per row.
3. `user_metadata` is user-editable — authorize with `app_metadata` or `profiles` table.
4. Service role **only** in Edge Functions or tightly scoped server modules — never browser.

---

## Personas → tables

| Persona | Action | Tables / Auth |
|---------|--------|----------------|
| **Camila** | Chat, save, trips | `trips`, `trip_items`, `saved_*`, `leads` |
| **Roberto** | Host wizard, publish | `events`, `approval_requests` |
| **Andrés** | Ticket buy | `event_orders`, Stripe edges |
| **Patricia** | Admin W8+ | `profiles.role`, admin policies |
| **Sofía** | `ai_runs`, traces | Service role server insert only |

---

## Skills & rules

| Resource | Path |
|----------|------|
| mde-supabase skill | `.claude/skills/mde-supabase/SKILL.md` |
| Supabase plugin skill | Claude plugin `supabase` |
| Project rules | `.claude/rules/supabase-*.md` → `mde-supabase/references/project-rules/` |
| CLAUDE.md | `/home/sk/mdeai/CLAUDE.md` |

---

## Quick commands

```bash
# From mdeapp
cd /home/sk/mdeai/mdeapp
npm run dev   # UI :3001 + Mastra :4111

# Auth smoke (after AUTH-001)
# 1. /login → Google or magic link
# 2. /trips — data visible when logged in
# 3. curl -X POST http://localhost:3001/api/copilotkit -d '{}'  # route alive
```

**Supabase MCP checks before schema work:** `list_tables`, `get_advisors`, `execute_sql` (read-only).
