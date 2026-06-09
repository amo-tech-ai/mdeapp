# SCREEN-011 — Saved collections — evidence

**Date:** 2026-05-20  
**Status:** Done

## Shipped

- `mdeapp/src/app/saved/page.tsx` — server page with RLS-scoped fetch
- `mdeapp/src/lib/saved/load-user-collections.ts`
- `mdeapp/src/components/saved/saved-collections-grid.tsx`
- `chat-nav-rail.tsx` — `nav-saved-link` → `/saved`
- `e2e/screens/SCREEN-011-saved.spec.ts`

## Verification

| Check | Result |
|-------|--------|
| `GET /saved` | **200** |
| Playwright SCREEN-011 | **3/3** (desktop empty + nav + mobile) |
| Browser MCP | saved-page + sign-in empty state |
| `npm run floor` | exit **0** |
| RLS | `collections` + `saved_places` user-owned policies (Supabase MCP) |

## Notes

- Logged-out users see sign-in empty state (E2E_BYPASS_AUTH does not inject session).
- `save_place` Mastra tool deferred — page shell + grid ready for SCREEN-005 heart wiring.
