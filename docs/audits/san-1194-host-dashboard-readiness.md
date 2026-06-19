# SAN-1194 · HOST-DASH-001 — Host Dashboard OS — Readiness Plan

**Date:** 2026-06-19
**Scope:** Planning only — no code written. This is the build-ready brief for SAN-1194, to be executed on a fresh branch once authorized.
**Verdict:** **READY TO START.** Every prerequisite is satisfied (verified on disk + in Linear). See §8.

**Plain language:** After Roberto publishes his first event today, his next click lands on a 404 — `/host/dashboard` does not exist. SAN-1194 builds his home base: a page that answers "is my business healthy today?" in five seconds (revenue, tickets sold, conversion, active + upcoming events, plus a short AI briefing). Most of the hard backend work is already written; what's missing is the page, one API endpoint, the component, and a nav item.

---

## 1. Route target

`/host/dashboard` — currently a **404** (verified: `src/app/host/dashboard/` does not exist; only `/host/rentals/onboarding` exists, which is real-estate and out of scope).

New file: `src/app/host/dashboard/page.tsx` (server component, auth-gated to `/login`).

---

## 2. Design source (canonical, verified present)

| File | Purpose |
|---|---|
| `mdeai-design-system/project/ui_kits/host/dashboard-os.html` | Static visual reference — layout, KPI grid, briefing panel |
| `mdeai-design-system/project/ui_kits/host/HostDashboardOS.jsx` | Component reference — structure + props shape |

Visual rules from `DESIGN.MD`: oklch tokens only (no hardcoded `gray-*`), teal CTAs, gold ✦ reserved for AI-generated content, skeletons for loading, honor `prefers-reduced-motion`. Mobile-first at 390×844 (Roberto on phone).

> **Design-source risk:** both files are **untracked in git** (`mdeai-design-system/` has 0 tracked files). They exist on this working disk only. A fresh clone or new worktree has no design source. See `design-source-tracking-decision.md` — recommended fix is to commit the canonical host kits (Option A) **before or alongside** the SAN-1194 build so the builder's worktree has the reference.

---

## 3. Existing backend files (verified on disk — reuse, do not rebuild)

| File | Role |
|---|---|
| `src/lib/events/host-dashboard-kpis.ts` | KPI computation (revenue, tickets, conversion, active, upcoming) |
| `src/lib/events/load-host-dashboard.ts` | Server loader — assembles dashboard data for a host |
| `src/lib/events/host-dashboard-result.ts` | Result/shape types for the dashboard payload |
| `src/lib/types/host-dashboard.ts` | `HostDashboardState` type (shared-state contract) |

Reusable UI already present:

| File | Role |
|---|---|
| `src/components/host/host-kpi-card.tsx` | Single KPI card (number + trend) |
| `src/components/host/host-narrative-banner.tsx` | AI briefing banner |
| `src/components/host/host-nav-rail.tsx` | Host left-nav (currently: Events · New event · Analytics — **no Dashboard item**) |

**Golden rule (numbers):** all KPI figures come from `host-dashboard-kpis.ts` / the DB. The AI briefing narrates trends in prose but **never re-types or invents a number** — figures are lifted from the tool result, the LLM only describes them.

---

## 4. Dependencies (both Done — unblocked)

| Dependency | State | What it provides |
|---|---|---|
| `SAN-760 · AIE-005 — hostOpsAgent + HostDashboardState` | ✅ Done | the ops agent + shared-state shape the briefing reads from |
| `SAN-759 · AIE-007 — salesInsightWorkflow` | ✅ Done | the sales/revenue computation the KPI cards surface |

Linear `relations.blockedBy = []` for SAN-1194. No other gate.

---

## 5. First implementation slice (the ONLY scope for the first PR)

Ship a working, honest shell — not the full AI experience:

1. **Route** `src/app/host/dashboard/page.tsx` — server component, auth-gate to `/login`, call `load-host-dashboard.ts`.
2. **KPI API** `src/app/api/host/dashboard/kpis/route.ts` — Revenue · Tickets · Conversion · Active · Upcoming, with 7d/30d trends, all DB-sourced. (No `src/app/api/host/dashboard/` dir exists yet — verified.)
3. **Component** `src/components/host/host-dashboard-os.tsx` — static dashboard shell + KPI cards (reuse `host-kpi-card.tsx`), with **data-pending / skeleton states** for any not-yet-wired panel. Honest labeled placeholders where data isn't live yet (same pattern as the command-center "Design preview" banner).
4. **Nav** — add "Dashboard" as the first item in `host-nav-rail.tsx` + update `host-nav-rail.test.ts`.
5. **Briefing** — `host-narrative-banner.tsx` shows the hostOpsAgent briefing as figure-free prose (or a "briefing pending" state if the stream isn't wired in slice 1).

**Evidence for Done:** localhost `npm run dev` boots clean + `/host/dashboard` responds; screenshot at 390×844; `npm run floor` green; vitest count not regressed.

---

## 6. Do NOT build in this slice (explicit out-of-scope)

- ❌ Advanced AI recommendations / generative KPI cards (that is `SAN-761 · AIE-009`, Backlog)
- ❌ Event Command Center (`SAN-885 · AIE-014B`)
- ❌ Venue Booking (`SAN-855 · VEB-000`)
- ❌ Host Onboarding route (`SAN-1207 · HOST-ONBOARD-001` — comes *after* this lands and becomes its handoff target)
- ❌ New Supabase tables (this is a read-only aggregator over existing tables)

---

## 7. Build sequencing (when authorized)

1. **Branch fresh from `origin/main`** — never from `chore/design-sync-ui-primitives` (polluted: 21 modified / 8 deleted / 393 untracked).
2. Hardlink `node_modules` into the worktree (`cp -al`, never symlink — Turbopack rejects symlinked `node_modules`).
3. Build slice §5 only.
4. Verify per §5 evidence.
5. One focused PR; merge; confirm prod; only then start SAN-1207.

---

## 8. Readiness checklist

| Criterion | State |
|---|---|
| Route target identified | ✅ `/host/dashboard` (404 today) |
| Design source present | ✅ `dashboard-os.html` + `HostDashboardOS.jsx` (⚠️ untracked — see §2) |
| Backend data layer exists | ✅ `host-dashboard-kpis.ts`, `load-host-dashboard.ts`, `host-dashboard-result.ts` |
| Shared-state type exists | ✅ `HostDashboardState` in `src/lib/types/host-dashboard.ts` |
| Reusable UI exists | ✅ `host-kpi-card.tsx`, `host-narrative-banner.tsx` |
| Hard dependencies Done | ✅ SAN-760, SAN-759 |
| Linear blockers | ✅ none (`blockedBy: []`) |
| First slice scoped | ✅ §5 (shell + KPI cards + data-pending) |
| Out-of-scope fenced | ✅ §6 |

**Recommendation: READY to start SAN-1194.** The one watch-item is the untracked design source (§2) — resolve via `design-source-tracking-decision.md` Option A so the build worktree has the reference; the build itself is otherwise fully unblocked.
