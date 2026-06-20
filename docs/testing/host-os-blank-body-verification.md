# SAN-1209-FIX — Host OS production blank-body: diagnosis + verification

**Date:** 2026-06-20 · **Branch:** `ai/san-1209-fix-host-os-blank` · **Build:** Next 16.2.6 prod (`next start`, local) · **Account:** QA host `qa-landlord@mdeai.co`

## Problem (reported)

Production `/host/dashboard`, `/host/events` and `/host/analytics` rendered the
Host OS shell **header + nav**, but the **main body was blank**. All three failed
identically — pointing at the **shared** Host OS shell, not any one page's data.

## Why all three blank together (shared subtree)

The three routes are the only ones wrapped by the unified Host OS shell
(`src/app/host/layout.tsx` → `HostOsShell` → `HostOsBody`). They share **one**
`<CopilotKit>` `hostOpsAgent` provider and **one** persistent
`<CopilotChat>` rail. `/host/events/page.tsx` is a static server component with no
data fetch, yet it blanked too — so the trigger lives in the shared shell /
runtime, not page logic. A throw in that shared client subtree with **no error
boundary** discards the body silently — no fallback, no console breadcrumb.

## Local prod reproduction attempt (Step 1 fallback)

The task allows local reproduction with a host test account when an authenticated
prod browser is unavailable. Ran the **production build** (`next start`, port 3010,
`output: standalone`) and drove all three routes with a real injected QA host
Supabase session via Playwright (`PW_SKIP_WEBSERVER=1`).

| Route | Body testid | Result | Console |
|---|---|---|---|
| `/host/dashboard` | `host-dashboard` | ✅ renders (desktop + tablet 768 + mobile 390) | clean |
| `/host/analytics` | `host-analytics` + KPI grid/empty | ✅ renders, Analytics nav active | clean |
| `/host/events` | `host-events` (event grid) | ✅ renders @ 1440 / 768 / 390 | clean |

Anonymous `/host/dashboard` correctly 307-redirects to `/login?next=/host/dashboard`.

**The blank body did NOT reproduce on a local prod build.** That is itself a
finding: the production trigger is **environment-specific to the Vercel runtime**
(e.g. a runtime/agent/Postgres connection that differs from local), not a
deterministic code bug. The prod server log shows `[mastra-storage] using Postgres`
— a runtime dependency that exists on prod and can fail there independently of the
page code.

## Root cause (actionable defect)

The **actionable** defect is not a single reproducible line — it is the **absence
of error isolation** around the shared Host OS subtree. Whatever throws in
production (agent discovery, the persistent rail's runtime handshake, a runtime
dependency) had nowhere to be caught, so React discarded the body with no signal.
This is what we fix.

## Fix (defensive isolation — body can never blank silently)

1. **`HostErrorBoundary`** (`src/components/host/host-error-boundary.tsx`) — reusable
   React class boundary; logs a labelled console breadcrumb on catch.
2. **`HostOsBody`** wraps the **page body** and the **Copilot rail** in separate
   boundaries. A rail crash shows "Host concierge temporarily unavailable"; the page
   body keeps rendering. A page-body crash shows a labelled fallback, not a blank panel.
3. **`src/app/host/error.tsx`** — Next.js segment error boundary; replaces only the
   routed page content while the shell stays mounted, with a "Try again" reset.
4. **`HostOsShell`** passes `onError` to `<CopilotKit>` so v2 agent-discovery /
   runtime errors (which do **not** throw — they flow to `onError`) are logged
   instead of failing silently.

## Verification

- `npm run lint` ✅ · `npm run typecheck` ✅ · `npm run build` ✅
- Host unit tests ✅ — 49 existing + 5 new (`host-os-body.test.tsx`): boundary shows
  fallback on throw, **body renders even when the rail crashes**, body fallback on
  page throw.
- Host e2e against the **prod build** with a real QA host session ✅ — table above.
- Full `npm test`: only failures are 2 unrelated **live-data** integration files
  (`search-003-ranking`, `anchor-ranking`) under `src/mastra/lib/` — this branch
  touches no `src/mastra/` code; they return 0 rows in this environment (pre-existing).

## Known risks / follow-up

- Local prod build does not reproduce the prod blank, so **production** must be
  re-verified after deploy: load all three host routes signed-in and confirm body +
  clean console (or a labelled fallback + the new `onError` / `componentDidCatch`
  breadcrumb identifying the real prod trigger).
- The new `onError` breadcrumb is the diagnostic hook for the next prod incident —
  if the rail still fails on Vercel, its console log will name the cause.
