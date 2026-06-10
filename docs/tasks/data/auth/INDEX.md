---
title: Auth task index (mdeapp)
parent: tasks/data/plan/21-auth-architecture-roadmap.md
date: 2026-05-26
archived_done: ../../archive/data-A/README.md
---

# Auth tasks — INDEX

**Done specs** → [`../../archive/data-A/`](../../archive/data-A/README.md) (AUTH-001–004, 006–008, 010).  
**F08** (magic link + SSR) is **Done** in [`../../core/F08-supabase-auth-login-page.md`](../../core/F08-supabase-auth-login-page.md).

## Open backlog

| Order | ID | Title | Status | Effort |
|------:|-----|-------|--------|--------|
| 1 | [AUTH-005](AUTH-005-playwright-auth-e2e.md) | Playwright smoke (manual Google) | Ready | 4h |
| 2 | [AUTH-009](AUTH-009-jwt-request-context.md) | JWT in Mastra RequestContext | Ready | 4h |
| 3 | [AUTH-011](AUTH-011-production-auth-checklist.md) | Production evidence checklist | Ready (partial evidence) | 2h |

## Archived (Done — do not re-execute)

| ID | Archive |
|----|---------|
| AUTH-001 | [Google OAuth UI](../../archive/data-A/AUTH-001-google-oauth.md) |
| AUTH-002 | [Supabase Dashboard Google](../../archive/data-A/AUTH-002-supabase-google-dashboard.md) |
| AUTH-003 | [Middleware `/trips`, `/saved`](../../archive/data-A/AUTH-003-middleware-trips-saved.md) |
| AUTH-004 | [`getUser()` API routes](../../archive/data-A/AUTH-004-getuser-api-routes.md) |
| AUTH-006 | [User-scoped client factory](../../archive/data-A/AUTH-006-user-scoped-supabase-tools.md) |
| AUTH-007 | [search-events anon only](../../archive/data-A/AUTH-007-search-events-no-service-role.md) |
| AUTH-008 | [search-rentals RLS](../../archive/data-A/AUTH-008-search-rentals-rls.md) |
| AUTH-010 | [Mastra Studio auth doc](../../archive/data-A/AUTH-010-mastra-studio-auth.md) |

Evidence: [`../../evidence/AUTH-001-003-007-008-evidence.md`](../../evidence/AUTH-001-003-007-008-evidence.md) · [`../../evidence/AUTH-011-evidence.md`](../../evidence/AUTH-011-evidence.md) (partial)

## Skills (required)

| Skill | Use for |
|-------|---------|
| `mde-supabase` | OAuth, SSR, RLS, edge headers |
| `mastra` | RequestContext, tools |
| `copilotkit-integrations` | Pattern 1 route — do not add Pattern 2 |
| `playwright-cli` | AUTH-005 |

## Diagrams

- [`../diagrams/auth-user-journey.mmd`](../diagrams/auth-user-journey.mmd)

## Verification

- [`VERIFICATION.md`](VERIFICATION.md) — forensic report (2026-05-20); pack **not 100%** until AUTH-005/009/011 close
