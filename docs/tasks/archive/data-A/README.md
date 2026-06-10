---
title: Data / Auth — archived pack A (Done AUTH specs)
updated: 2026-05-26
active_backlog: ../../data/auth/INDEX.md
---

# Data archive — pack A (auth)

**8 AUTH specs** archived **2026-05-26** — shipped in `mdeapp/` with batch evidence [`../../evidence/AUTH-001-003-007-008-evidence.md`](../../evidence/AUTH-001-003-007-008-evidence.md).

**Active backlog:** [`../../data/auth/INDEX.md`](../../data/auth/INDEX.md) — AUTH-005, 009, 011 + plan/audit docs under [`../../data/README.md`](../../data/README.md).

---

## Completion verdict

| Scope | Complete? | Notes |
|-------|:---------:|-------|
| **Archived AUTH-001–010 (except 005, 009, 011)** | **Yes** | Google OAuth, middleware, getUser routes, user-scoped factory, anon search tools, Studio doc |
| **AUTH-005 Playwright E2E** | **No** | No `e2e/auth-*.spec.ts` on disk |
| **AUTH-009 JWT → RequestContext** | **No** | CopilotKit route has `getUser()` only — no `access_token` in RequestContext |
| **AUTH-011 prod checklist** | **Partial** | Evidence [`../../evidence/AUTH-011-evidence.md`](../../evidence/AUTH-011-evidence.md) — hold until live Google OAuth + ADK URL |
| **Full `tasks/data/` pack** | **No** | Plan audits (17–22), diagrams, supabase README stay active as reference |

Do not re-execute archived specs unless regression reopens them.

---

## Archived specs

| ID | File |
|----|------|
| AUTH-001 | [AUTH-001-google-oauth.md](./AUTH-001-google-oauth.md) |
| AUTH-002 | [AUTH-002-supabase-google-dashboard.md](./AUTH-002-supabase-google-dashboard.md) |
| AUTH-003 | [AUTH-003-middleware-trips-saved.md](./AUTH-003-middleware-trips-saved.md) |
| AUTH-004 | [AUTH-004-getuser-api-routes.md](./AUTH-004-getuser-api-routes.md) |
| AUTH-006 | [AUTH-006-user-scoped-supabase-tools.md](./AUTH-006-user-scoped-supabase-tools.md) |
| AUTH-007 | [AUTH-007-search-events-no-service-role.md](./AUTH-007-search-events-no-service-role.md) |
| AUTH-008 | [AUTH-008-search-rentals-rls.md](./AUTH-008-search-rentals-rls.md) |
| AUTH-010 | [AUTH-010-mastra-studio-auth.md](./AUTH-010-mastra-studio-auth.md) |

**Verify:** `cd mdeapp && npm test -- user-scoped && rg signInWithOAuth src/app/auth`
