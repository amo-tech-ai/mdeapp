# Events Platform — Next Priority Report

**Date:** 2026-06-19
**Scope:** Events Platform only (no Real Estate). Audit + planning only — no code changes, no Linear edits, no new issues.
**Method:** Every status below was verified against three sources — the live Linear issue, the actual files on disk in `mdeapp/src`, and the canonical design tree at `mdeai-design-system/`. Where Linear and code disagree, the **code is treated as truth** and the gap is flagged.

---

## TL;DR — start SAN-1194 next

**The single highest-value Events Platform task to start next is `SAN-1194 · HOST-DASH-001 — Host Dashboard OS`.**

It is the only one of the five reviewed issues that is **fully unblocked** (both hard dependencies — `SAN-760 · AIE-005 — hostOpsAgent + HostDashboardState` and `SAN-759 · AIE-007 — salesInsightWorkflow` — are already **Done**), its **backend data layer already exists on disk** (`src/lib/events/host-dashboard-kpis.ts`, `load-host-dashboard.ts`, `host-dashboard-result.ts`), its canonical design source is present (`dashboard-os.html` / `HostDashboardOS.jsx`), and it is the **handoff target that unblocks `SAN-1207 · HOST-ONBOARD-001`**. It completes Roberto's post-activation loop (his missing home base) and is a read-only aggregator — no HITL, no new tables, lowest risk of the five.

Plain-language: after Roberto publishes his first event today, his next click goes nowhere — `/host/dashboard` is a 404. SAN-1194 builds the page that tells him "is my business healthy today?" in five seconds. Most of the hard backend work is already written; the gap is the route, the component, the KPI API endpoint, and a nav item.

---

## 1. SAN-704 evidence handling (closeout)

`SAN-704 · AIE-004 [Core] — AI Runs Production Write Fix` is **Done** in Linear (completed 2026-06-19, evidence comment attached). Evidence handling per instruction:

| Item | Path | Action |
|---|---|---|
| Evidence doc | `docs/tasks/testing/evidence/2026-06-19/SAN-704-prod-ai-runs-evidence.md` | exists, readable — left uncommitted |
| Machine output | `docs/tasks/testing/evidence/2026-06-19/ai-runs-verification.json` | exists, readable — left uncommitted |
| Proof screenshot | `docs/tasks/testing/evidence/2026-06-19/screenshots/15-ai-runs-prod-host-turn.png` | exists, readable — left uncommitted |
| Verification harness | `scripts/prod-verify-ai-runs.mjs` | **NOT committed** — one-off throwaway harness |

No SAN-704 artifact is mixed into `chore/design-sync-ui-primitives` or PR #267. No code change was required for SAN-704; no PR is needed for it.

---

## 2. Working tree audit

Branch: `chore/design-sync-ui-primitives`. Totals: **21 modified (tracked) · 8 deleted · 393 untracked**. This is a heavily polluted tree mixing many concerns — it should **not** be the base for any Events Platform work.

| Class | Count (approx) | What it is | Recommended handling |
|---|---|---|---|
| **Design-sync work** | ~5 modified + `.design-sync/` | `.design-sync/*` (css-src, previews, NOTES) + `DESIGN.MD` | belongs to PR #267 scope only |
| **Events Platform work** | ~4 modified | `src/components/partners/partner-signup-wizard.tsx` (+test), `src/mastra/lib/__tests__/intelligence-event-search.test.ts`, `docs/tasks/events/**` | isolate per-issue on fresh branches before shipping |
| **Docs-only** | 287 untracked + 7 modified | `docs/audits/**`, `docs/tasks/**`, `docs/chatwoot/`, `docs/competitive/`, `docs/copilotkit/`, this report | commit separately as docs-only when ready |
| **Tooling / skills** | 34 `.claude/**` untracked + 8 deleted skills | new agents, hooks, skills; deleted copilotkit-* skill symlinks | separate tooling PR; not mixed with feature code |
| **Experimental / untracked roots** | `mdeai-design-system/` (untracked), `mdeai Design System-handoff-ARCHIVE/` (untracked), `scripts/` (26), `e2e/` (6), `.firecrawl/`, stray JSON/workspace files | scratch + reference trees | review individually; most should stay untracked or be gitignored |

**Flag — canonical design tree is not in git.** `mdeai-design-system/` has **0 tracked files** (`git ls-files` returns nothing). Every Events V2 issue references it as the build source, but it lives only on disk, untracked. This is a continuity risk: a fresh clone or another worktree has no design source. (The stale `mdeai Design System-handoff-ARCHIVE/` is also untracked — 0 files — so at least the duplicate isn't competing in history.)

---

## 3. Events Platform prioritization review (the five issues)

### SAN-1207 · HOST-ONBOARD-001 — Host Onboarding Route (`/host/onboarding`)

| Field | Finding |
|---|---|
| Linear state | **In Progress** (started 2026-06-18) · High |
| Dependencies | blockedBy `SAN-675 · PTR — Event host: full onboarding cycle (e2e)` + `SAN-1194 · HOST-DASH-001 — Host Dashboard OS` |
| Blockers | **Blocked.** Hands off to `/host/dashboard`, which does not exist yet (SAN-1194 not built). Also gated on SAN-675. |
| Design source | `mdeai-design-system/project/ui_kits/host/onboarding/HostOnboarding.jsx` (+ `index.html`) — **present, canonical** ✅ |
| Implementation status | **0% on disk.** No `src/app/host/onboarding/` route exists (only `/host/rentals/onboarding` — real-estate, out of scope). Linear says "In Progress" but no code — **status drift**. |
| Missing work | Entire route, 5-role picker, multi-step progress, server-side resume state, payment-readiness check, AI workspace step, redirect to `/host/dashboard`, e2e. |
| Recommended next action | **Hold.** Do not start until SAN-1194 exists (the handoff target). Reconcile the "In Progress" label with reality (no code). |

### SAN-1194 · HOST-DASH-001 — Host Dashboard OS (`/host/dashboard`)

| Field | Finding |
|---|---|
| Linear state | **Todo** · High |
| Dependencies | `relations.blockedBy = []` — **no blockers.** Consumes hostOpsAgent (briefing) + KPI reads. |
| Blockers | **None.** `SAN-760 · AIE-005 — hostOpsAgent` ✅ Done, `SAN-759 · AIE-007 — salesInsightWorkflow` ✅ Done. |
| Design source | `mdeai-design-system/project/ui_kits/host/dashboard-os.html` + `HostDashboardOS.jsx` — **present, canonical** ✅ |
| Implementation status | **~30%.** Backend data layer already on disk: `src/lib/events/host-dashboard-kpis.ts`, `load-host-dashboard.ts`, `host-dashboard-result.ts`, `HostDashboardState` type in `src/lib/types/host-dashboard.ts`. Reusable UI parts exist: `host-kpi-card.tsx`, `host-narrative-banner.tsx`. |
| Missing work | Route `src/app/host/dashboard/page.tsx`; component `host-dashboard-os.tsx`; API `GET /api/host/dashboard/kpis` (no `src/app/api/host/` dir exists yet — only `api/host/rentals`); add "Dashboard" item to `host-nav-rail.tsx` (currently only Events · New event · Analytics). |
| Recommended next action | **START NEXT.** Unblocked, backend mostly done, unblocks SAN-1207, completes the host loop. |

### SAN-884 · AIE-008B — Host Events OS Hub (`/host/events`)

| Field | Finding |
|---|---|
| Linear state | **Todo** · High · parent `SAN-757 · AIE-000` |
| Dependencies | blockedBy `SAN-761 · AIE-009 — Generative KPI cards` + `SAN-763 · AIE-010 — Event analytics funnel`. Requires hostOpsAgent ✅, salesInsightWorkflow ✅. |
| Blockers | **Blocked.** SAN-761 is **Backlog** (and itself sequenced behind the v2-bridge migration `SAN-888 · CK-V2-002`); SAN-763 is **Backlog** (needs new `event_views`/`visitor_sessions` tables). |
| Design source | `mdeai-design-system/project/ui_kits/host/events-os.html` + `HostEventsOS.jsx` — present ✅. Linear body still points at spec `docs/events/tasks/AI-native-system/Core/AIE-008b-…`, not the design tree (see §5). |
| Implementation status | **~30%.** `/host/events` route exists but is the **read-only event list** (`HostEventsGrid`, EVP-014/SAN-118), not the OS hub. `host-ops-copilot-bridge.tsx` exists; `focusedEventId` per-event KPI cache not wired into this page. |
| Missing work | Extend page to list + ops panel; mount HostOpsCopilotBridge here; `focusedEventId` in shared state; per-row revenue/tickets/bookings/alerts; recommendations panel. |
| Recommended next action | **Hold** until SAN-761 + SAN-763 land (which themselves wait on the v2 bridge + new tables). Not a near-term start. |

### SAN-885 · AIE-014B — Event Command Center (`/host/events/[eventId]`)

| Field | Finding |
|---|---|
| Linear state | **Todo** · High · parent `SAN-757 · AIE-000` |
| Dependencies | blockedBy `SAN-884` (hub), `SAN-761`, `SAN-763`, `SAN-773 · AIE-020 — Host bookings`; partial `SAN-766 · AIE-013 — revenueForecastWorkflow`. |
| Blockers | **Most heavily blocked of the five** — sits downstream of the entire Event-OS chain. |
| Design source | `mdeai-design-system/project/ui_kits/host/command-center.html` + `HostCommandCenter.jsx` — present ✅ |
| Implementation status | **~40%.** Route `/host/events/[id]` exists with `HostCommandCenterShell` + `command-center-view.ts`. Real event header from `public.events` (RLS-scoped). Operational metrics show an **honest "Design preview" banner** (`data-testid="host-cc-preview-banner"`) until command-center read tools land. |
| Missing work | Wire real tool reads (sales/funnel/bookings/forecast); lock `focusedEventId`; recommendations fusion; remove preview banner; ≥3 signal types per turn; `ai_runs` proof. |
| Recommended next action | **Hold.** Last in the sequence (`009 → 010 → 008B → 020 → 014B`). The labeled-preview shell is already a good interim state. |

### SAN-855 · VEB-000 — Event Venue Booking Platform

| Field | Finding |
|---|---|
| Linear state | **Todo** · High · **parent epic** (track:venues) |
| Dependencies | Long child chain: SAN-492 ✅, SAN-493 ✅, SAN-494 ✅, SAN-495 (ready), SAN-496–502 (blocked), SAN-865 · VEB-019 core adapter (In Review). Gated on SAN-299/302. |
| Blockers | **~14% E2E by its own audit.** Proposal modal, booking workflow, Patricia queue all incomplete. |
| Design source | `mdeai-design-system/project/ui_kits/host/venue-matchmaker.html` + `VenueMatchmaker.jsx`, `venues-os.html` + `HostVenuesOS.jsx` — present ✅. Canonical remediation plan: `docs/events/notes/june-10/evt-remediation-plan.md`. |
| Implementation status | **~14% E2E.** Backend partials on disk: `src/lib/events/event-venue-booking-core.ts` + `event-venue-booking-workflow-core.ts` (+ tests). Schema + seed + CTA shipped. |
| Missing work | Finish SAN-865 `partner_id`; SAN-496 proposal modal + migration; SAN-501 booking workflow; SAN-502 Patricia admin queue; search/rank/compare/match-score UI. |
| Recommended next action | **Multi-issue epic, not a single next start.** If venue revenue is the priority, the unblocking sub-task is finishing `SAN-865 · VEB-019` then `SAN-495`/`SAN-496`. Larger effort than SAN-1194. |

---

## 4. Host flow validation — Roberto's journey

`Partner Signup → Host Onboarding → Host Dashboard → Host Events Hub → Event Command Center`

| Step | Linear issue | Route | Design source | Implemented | Missing screens | Missing data wiring | Missing tests |
|---|---|---|---|---|---|---|---|
| Partner Signup | `SAN-723 · MKT — Partner signup wizard` ✅ Done | `/partners/signup` ✅ exists | `partners/wireframes/partner-signup-wireframe.html` | **~90%** | full 10-step wizard + AI co-pilot (deferred SAN-685) | activate API wired ✅ | covered (component tests) |
| Host Onboarding | `SAN-1207 · HOST-ONBOARD-001` (In Progress label, no code) | `/host/onboarding` ❌ **404** | `host/onboarding/HostOnboarding.jsx` ✅ | **0%** | entire route + 5-role picker + steps | server-side resume state, payment readiness, AI workspace | all (no route) |
| Host Dashboard | `SAN-1194 · HOST-DASH-001` Todo | `/host/dashboard` ❌ **404** | `host/dashboard-os.html` ✅ | **~30%** (data layer only) | route + `host-dashboard-os.tsx` + nav item | `GET /api/host/dashboard/kpis` endpoint; briefing stream | `host-dashboard`, `host-nav-rail` updates, e2e |
| Host Events Hub | `SAN-884 · AIE-008B` Todo (blocked) | `/host/events` ✅ exists (list only) | `host/events-os.html` ✅ | **~30%** | ops panel layout on the list page | bridge mount + `focusedEventId` + per-row KPIs | bridge smoke, Playwright journey |
| Event Command Center | `SAN-885 · AIE-014B` Todo (blocked) | `/host/events/[id]` ✅ exists (preview) | `host/command-center.html` ✅ | **~40%** | none (shell live) — preview banner present | real sales/funnel/bookings/forecast tool reads | scope guard, ≥3-signal Playwright |

**Journey verdict:** The two ends of Roberto's journey are real (signup ✅, command-center shell ✅), but the **middle two links — Onboarding and Dashboard — are both 404s.** The journey breaks immediately after signup. The cheapest, highest-leverage repair is the Dashboard (SAN-1194): it is unblocked, its data layer exists, and once it lands, Onboarding (SAN-1207) gains its handoff target.

---

## 5. Design source verification

**Canonical tree present:** `mdeai-design-system/project/ui_kits/host/` contains every kit the five issues reference — `onboarding/HostOnboarding.jsx`, `dashboard-os.html`/`HostDashboardOS.jsx`, `events-os.html`/`HostEventsOS.jsx`, `command-center.html`/`HostCommandCenter.jsx`, `venue-matchmaker.html`/`VenueMatchmaker.jsx`. ✅

**Flags:**

1. **Canonical tree is untracked in git** (`git ls-files mdeai-design-system` → 0). The design source the whole EVTV2 track builds from exists only on the working disk. Recommend deciding whether it should be committed or formally referenced — otherwise a clean checkout has no design source. *(Flagged for visibility; not actioned here — no code/Linear changes per scope. See `design-source-tracking-decision.md` for the decision report.)*
2. **Stale duplicate quarantined, not deleted:** `mdeai Design System-handoff-ARCHIVE/mdeai-design-system/` still exists on disk (untracked, 0 tracked files). Its `-ARCHIVE` suffix signals it's retired, but it remains a confusion risk for anyone grepping the tree.
3. **Issue body drift:** the newer issues (SAN-1194, SAN-1207) correctly cite `mdeai-design-system/...` paths. The older Event-OS issues (SAN-884, SAN-885) still cite only their spec docs (`docs/events/tasks/AI-native-system/...`) and rely on `SAN-980 · Host events OS — design screen build` for the design pointer, rather than naming the canonical kit path directly. Not stale, but less explicit.

No issue references a wrong/foreign design path. The main exposure is #1 (untracked canonical tree).

---

## 6. Final recommendation

**Start `SAN-1194 · HOST-DASH-001 — Host Dashboard OS` next.**

| Task | Priority | Status (code) | Dependencies | Effort | Risk | Recommended order |
|---|---|---|---|---|---|---|
| **SAN-1194 · HOST-DASH-001 — Host Dashboard OS** | High | ~30% (data layer done) | **none — unblocked** | **S–M** (route + component + 1 API + nav) | **Low** (read-only, no HITL, no new tables) | **1 — START NEXT** |
| SAN-1207 · HOST-ONBOARD-001 — Host Onboarding | High | 0% | SAN-1194, SAN-675 | M | Med (resume state, payment readiness) | 2 — after SAN-1194 |
| SAN-855 · VEB-000 — Venue Booking (via SAN-865→496) | High | ~14% E2E | long child chain | L (epic) | Med–High (booking writes, admin queue) | 3 — if venue revenue prioritized |
| SAN-884 · AIE-008B — Host Events OS Hub | High | ~30% | SAN-761, SAN-763 (both Backlog) | M | Med (POST-storm, layout) | 4 — after KPI cards + funnel |
| SAN-885 · AIE-014B — Event Command Center | High | ~40% (preview shell) | SAN-884, 761, 763, 773 | M–L | Med | 5 — last in Event-OS chain |

**Why SAN-1194 wins on every axis:** unblocked today (the other four are all gated), the most backend already written, lowest risk profile, and it is the lynchpin that converts a dead-end post-signup experience into a working host loop and unblocks the next task (SAN-1207). The Event-OS hub/command-center pair (SAN-884/885) cannot start in earnest until the KPI-card and funnel work (SAN-761/SAN-763) clears the v2-bridge migration and new analytics tables — that is a longer pole.

**Immediate build checklist for SAN-1194 (when work is authorized):**
1. Branch fresh from `origin/main` (NOT `chore/design-sync-ui-primitives`).
2. `src/app/host/dashboard/page.tsx` — server component, auth-gate to `/login`, reuse `load-host-dashboard.ts`.
3. `src/app/api/host/dashboard/kpis/route.ts` — Revenue · Tickets · Conversion · Active · Upcoming, with 7d/30d trends (DB-sourced; values never LLM-generated).
4. `src/components/host/host-dashboard-os.tsx` — reuse `host-kpi-card.tsx` + `host-narrative-banner.tsx`; AI briefing is figure-free prose from hostOpsAgent.
5. Add "Dashboard" as first item in `host-nav-rail.tsx` + update `host-nav-rail.test.ts`.
6. Port visuals from `dashboard-os.html` / `HostDashboardOS.jsx` (teal CTAs, gold ✦ for AI only).
7. Evidence: localhost runtime proof + screenshot at 390×844 + `npm run floor` green.

See `san-1194-host-dashboard-readiness.md` for the full SAN-1194 readiness plan.
