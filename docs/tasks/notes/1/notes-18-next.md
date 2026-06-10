---
title: Next steps — Discovery Beta + PR queue
updated: 2026-06-03
companion: notes-17-discovery-beta-execution.md · notes-14.md · tasks/PR/INDEX.md
---

> **Summary:** Clickable checklist for what to ship next — merge auth PR, turn on branch protection, then MAP → ADK → restaurants → e2e → F13. Links go to Linear, GitHub, Vercel, and specs.

**Vercel hub:** [Project](https://vercel.com/amo100/mdeapp) · [Env vars](https://vercel.com/amo100/mdeapp/settings/environment-variables) · [Deployments](https://vercel.com/amo100/mdeapp/deployments) · [Prod site](https://www.mdeai.co)

---

## Now

| Step | Task | Linear | GitHub | Vercel / prod | Spec |
|------|------|--------|--------|---------------|------|
| 1 | **Merge PR #56** — AUTH-011 prod login | [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) | [PR #56](https://github.com/amo-tech-ai/mdeapp/pull/56) | [Preview deploy](https://vercel.com/amo100/mdeapp/deployments) · test [login](https://www.mdeai.co/login) | [AUTH-011](../data/tasks-data/AUTH-011-production-auth-checklist.md) |
| 2 | **PR-16** — branch protection + floor gate | [SAN-458](https://linear.app/sanjiovani/issue/SAN-458) | [Branch rules](https://github.com/amo-tech-ai/mdeapp/settings/branches) · [Floor workflow](https://github.com/amo-tech-ai/mdeapp/actions/workflows/floor.yml) | — | [PR-16](../PR/tasks/PR-16-floor-merge-gate.md) |

**Verify before merge #56:** `cd mdeapp && npm run verify:task -- AUTH-011`

---

## Discovery Beta PRs (in order)

| # | Task | Linear | GitHub branch | Vercel | Spec |
|---|------|--------|---------------|--------|------|
| 1 | **SAN-369** / MAP-008B — Map ID on prod | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) | `ai/san-369-map-008b-map-id-on-production` | Set [`NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`](https://vercel.com/amo100/mdeapp/settings/environment-variables) on **Production + Preview** | [MAP-008B](../maps/MAP-008B-vercel-map-id-verify.md) |
| 2 | **SAN-368** / MAP-002B — ADK on prod | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | `ai/san-368-map-002b-adk-grounding-on-production` | Set [`ADK_GROUNDING_URL`](https://vercel.com/amo100/mdeapp/settings/environment-variables) + `ADK_INTERNAL_TOKEN` | [MAP-002B](../maps/MAP-002B-prod-adk-deploy.md) |
| 3 | **SAN-490** / SCREEN-023 — `/restaurants` | [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) | `ai/san-490-screen-023-restaurant-listings-page` | [Prod `/restaurants`](https://www.mdeai.co/restaurants) (404 until shipped) | [SCREEN-023](../venues/tasks/mvp/wireframes/008-scr-restaurant-listings-map.md) |
| 4 | **SAN-314** / VEN-031 — venue Playwright | [SAN-314](https://linear.app/sanjiovani/issue/SAN-314) | `ai/san-314-ven-031-playwright-venue-screens` | — | [VEN-031](../venues/tasks/mvp/031-ven-playwright-venue-screens.md) |
| 5 | **F13** — thread persistence | *(create issue)* | TBD | Cold-start on [prod chat](https://www.mdeai.co/chat) | [tasks.md row 8](../../tasks.md) · [F13 archive](../archive/core/F13-ai-runs-observability.md) |

---

## Wait (don’t merge yet)

| Item | Linear | GitHub | Notes |
|------|--------|--------|-------|
| **SAN-462** soak **1/3** | [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) | [Prod synthetic workflow](https://github.com/amo-tech-ai/mdeapp/actions/workflows/prod-synthetic-smoke.yml) | Hold UX-023 + **PR #38** until **3/3** |
| **PR #38** SEARCH-002 | [SAN-386](https://linear.app/sanjiovani/issue/SAN-386) | [PR #38](https://github.com/amo-tech-ai/mdeapp/pull/38) · [SEARCH-002 spec](../data/tasks-data/SEARCH-002-event-hybrid.md) | Events fast-path UI — after soak |
| **PR #39** INT-010 | [SAN-413](https://linear.app/sanjiovani/issue/SAN-413) | [PR #39](https://github.com/amo-tech-ai/mdeapp/pull/39) | Defer — not Discovery Beta |
| **PR-18** SHA-pin | [SAN-460](https://linear.app/sanjiovani/issue/SAN-460) | — | After soak · [PR-18](../PR/tasks/PR-18-sha-pin-actions.md) |
| **PR-15** ADK audit | [SAN-444](https://linear.app/sanjiovani/issue/SAN-444) | — | Phase 2 · [PR-15](../PR/tasks/PR-15-verify-adk-phase2.md) |

---

## Housekeeping

| Item | Links |
|------|-------|
| **DATA-041** human QA | [SAN-379](https://linear.app/sanjiovani/issue/SAN-379) · [DATA-041](../data/tasks-data/DATA-041-venue-signals.md) |
| Update PR status snapshot | [STATUS-2026-06-02.md](../PR/tasks/STATUS-2026-06-02.md) after #56 merge |
| Execution playbook | [notes-17](./notes-17-discovery-beta-execution.md) |
| Operator queue | [tasks.md](../../tasks.md) |

---

**Start:** merge [PR #56](https://github.com/amo-tech-ai/mdeapp/pull/56) → branch **SAN-369** → set [Vercel Map ID](https://vercel.com/amo100/mdeapp/settings/environment-variables).
