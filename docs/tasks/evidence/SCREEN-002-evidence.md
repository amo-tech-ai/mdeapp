# SCREEN-002 Evidence — Chat Nav Rail + Thread List

**Date:** 2026-06-02  
**Status:** Done

## Changes made

### New files
- `mdeapp/src/app/api/threads/route.ts` — GET `/api/threads`; reads `mastra_threads` via service role, returns user's 20 most-recent threads sorted by `updatedAt` desc; returns `{ threads: [] }` for unauthenticated sessions
- `mdeapp/src/lib/chat/thread-nav-context.tsx` — React context (`ThreadNavProvider`) holding `activeThreadId`, `setActiveThreadId`, `clearActiveThread`
- `mdeapp/src/lib/chat/use-nav-threads.ts` — `useNavThreads()` hook fetching `/api/threads` on mount (once via `useRef` guard); exposes `{ threads, loading, refresh }`
- `mdeapp/e2e/screens/SCREEN-002-nav-rail.spec.ts` — Playwright spec (5 tests)

### Modified files
- `mdeapp/src/components/copilot/copilot-kit-provider.tsx` — added `ThreadNavProvider` wrapper; inner `CopilotKitWithThread` reads `activeThreadId` and passes it as `threadId` prop to `<CopilotKit>` (official CopilotKit 1.55.2 prop: `node_modules/@copilotkit/react-core/dist/copilotkit-dwDWYpya.d.cts`)
- `mdeapp/src/components/chat/chat-nav-rail.tsx` — rewritten with: new chat button, loading skeleton (3-item `animate-pulse`), thread list with active state, empty state ("No chats yet"), Saved + Trips disabled with Phase 4 tooltip

## Architecture

```
/api/threads (service-role)
      ↓  GET
useNavThreads()  →  NavThread[]  →  ChatNavRail (thread list)
                                          ↓ click
                              ThreadNavContext.setActiveThreadId()
                                          ↓
                          <CopilotKit threadId={activeThreadId}>
```

Service role used in `/api/threads` is within the F13 carve-out (`mdeapp/src/lib/supabase/service.ts`) — server-only API route, no client exposure.

## Probes

| Claim | Probe | Result |
|---|---|---|
| `mastra_threads` exists | `SELECT COUNT(*) FROM mastra_threads` | ✅ table present |
| CopilotKit `threadId` prop | `grep -n threadId node_modules/@copilotkit/react-core/dist/copilotkit-dwDWYpya.d.cts` | ✅ line ~2359 `threadId?: string` |
| Service role client available | `ls mdeapp/src/lib/supabase/service.ts` | ✅ exists |
| F13 carve-out allows service role in API route | CLAUDE.md F13 carve-out section | ✅ `/api/threads` is server-only, imported only by edge/API routes |
| RLS on `mastra_threads` | `SELECT policyname FROM pg_policies WHERE tablename = 'mastra_threads'` | ✅ `service_role_manage` policy |
| `npm run lint` | exit 0 | ✅ 0 warnings |
| `npx tsc --noEmit` | exit 0 | ✅ no errors |
| `npm test -- --run` | exit 0 | ✅ 445/445 pass |

## Test IDs

| Element | data-testid |
|---|---|
| Nav rail `<nav>` | `nav-rail` |
| New chat button | `nav-new-chat` |
| Per-thread button | `nav-thread-item` |
| Empty state span | `nav-threads-empty` |
| Saved link | `nav-saved-link` |
| Trips link | `nav-trips-link` |

## Acceptance criteria

- [x] Thread list loads from `/api/threads` (service role, server-only)
- [x] Active thread highlighted with `bg-muted font-medium`
- [x] "New chat" clears active thread + calls `startNewChat()` + routes to `/`
- [x] Loading skeleton shown during fetch (`animate-pulse` items)
- [x] Empty state shown when no threads
- [x] Thread click sets `activeThreadId` → `<CopilotKit threadId>` switches context
- [x] Saved + Trips disabled with "Available in Phase 4" tooltip
- [x] `npm run lint` clean, `npx tsc --noEmit` clean
- [x] 445/445 unit tests pass
- [x] English only, no Spanish strings
- [x] No service-role key exposure in client code
