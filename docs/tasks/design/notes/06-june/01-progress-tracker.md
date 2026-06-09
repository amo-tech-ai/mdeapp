I'll examine the Linear project, read the design audit, and cross-reference the codebase to build an accurate tracker.

The design audit file is empty. Let me fetch the Linear project data and scan the codebase in parallel.

Good data. Let me retry the Linear issues and read key reference files in parallel.

Now let me read the D-track task index and key audit files.

Let me quickly verify D-07's actual disk state since the index says it's done (7/14) but the audit showed 6/6 files missing.

Now I have everything needed. Let me compile the full tracker.

I have all the data. Here is the full Progress Task Tracker.

---

# mdeai UX Project — Progress Task Tracker
**Audited:** 2026-06-06 · **Source:** Linear UX project + disk verification + sitemap.md + D-track index

---

## Summary Dashboard

| Layer | Done | In Progress | Blocked | % Overall |
|---|:---:|:---:|:---:|:---:|
| Design Foundation (M2) | 6/6 | 0 | 0 | **100%** 🟢 |
| Component Base (M3) | 1/2 | 1 | 0 | **75%** 🟡 |
| Surface Re-skins (M4) | 0/5 | 0 | 5 | **0%** ⚪ |
| Transactions/Payments (M5) | 0/4 | 1 | 3 | **10%** 🟥 |
| Collections & Trips (M6) | 0/3 | 0 | 3 | **0%** ⚪ |
| Mobile, A11y & Polish (M7) | 0/12 | 0 | 12 | **0%** ⚪ |
| Live Routes | 26/53 | — | — | **49%** 🟡 |

---

## D-Track — Design Re-skin (D-01 → D-14, Epic [SAN-566](https://linear.app/sanjiovani/issue/SAN-566))

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|---|---|---|:---:|---|---|---|
| **D-01** [SAN-567](https://linear.app/sanjiovani/issue/SAN-567) | IA + route reconciliation — 5-domain nav | 🟢 Completed | 100% | `ia-journey.md` 195L on disk; Linear Done | — | None |
| **D-02** [SAN-568](https://linear.app/sanjiovani/issue/SAN-568) | Design system doc — oklch teal+gold tokens | 🟢 Completed | 100% | `design-system.md` 186L; tokens match `globals.css` | Minor hue drift (amber 65→86) noted in §7 | Reconcile DESIGN.MD ↔ design-system.md (D-14) |
| **D-03** [SAN-569](https://linear.app/sanjiovani/issue/SAN-569) | Image strategy — Places proxy + blur-up | 🟢 Completed | 100% | `images.md` 135L; placeholder gradient spec | — | None |
| **D-04** [SAN-570](https://linear.app/sanjiovani/issue/SAN-570) | Component inventory — 70/20/10 split | 🟢 Completed | 100% | `component-inventory.md` 145L; shadcn/custom tagged | `navigation-menu` marked ✅ but not installed (D-07/D-09 fix) | Patch inventory after D-09 adds nav-menu |
| **D-05** [SAN-571](https://linear.app/sanjiovani/issue/SAN-571) | Discovery wireframe — AI band + cards/map | 🟢 Completed | 100% | `explore-wireframe.html` 704L; annotations complete | — | None |
| **D-06** [SAN-572](https://linear.app/sanjiovani/issue/SAN-572) | Dashboard wireframe — 5-zone OS layout | 🟢 Completed | 95% | `dashboard-wireframe.html` 205L; Linear Done | Thinner spec (205L vs 704L explore) — optional enrichment before D-10 | Add 2–3 band annotations before D-10 starts |
| **D-07** [SAN-573](https://linear.app/sanjiovani/issue/SAN-573) | P0 shadcn install — tabs, command, avatar, carousel, sonner, sidebar | 🟢 Completed | 100% | All 6 files present: `tabs.tsx` `command.tsx` `avatar.tsx` `carousel.tsx` `sonner.tsx` `sidebar.tsx` | Index dated June 5 listed Done; disk confirms | Verify `<Toaster />` wired in layout.tsx |
| **D-08** [SAN-574](https://linear.app/sanjiovani/issue/SAN-574) | Shared browse system — VenueCard + BrowseLayout | 🟡 In Progress | 70% | `venue-card-shell.tsx` + `BrowseLayout.tsx` + `__tests__/` + `san-574-scope-gate.sh` all on disk | Linear status still "Todo" — needs Done gate proof; `npm run build` + Vitest results not recorded | Run Done gate: `npm run build`, Vitest tests, screenshot proof → flip Linear → Done |
| **D-09** [SAN-575](https://linear.app/sanjiovani/issue/SAN-575) | Re-skin discovery routes — `/restaurants` `/cafes` `/nightlife` `/rentals` | ⚪ Not Started | 0% | Spec 85% correct | Blocked on D-08 completion + SAN-478 (`/rentals` functional page) | Unblocks after D-08 Done; `/rentals` needs SAN-478 first |
| **D-10** [SAN-576](https://linear.app/sanjiovani/issue/SAN-576) | Re-skin dashboard — `/saved` `/trips` `/me/tickets` | ⚪ Not Started | 0% | Spec 84% correct | Blocked on D-07✓ D-08 | Unblocks after D-08 |
| **D-11** [SAN-577](https://linear.app/sanjiovani/issue/SAN-577) | Map workspace — pin↔card sync (Mindtrip moat) | ⚪ Not Started | 0% | Map partially built; `mapId` AC in spec | Blocked on D-08 + D-09 | Highest UX ROI feature (design-plan #5, score 93) — priority after D-09 |
| **D-12** [SAN-578](https://linear.app/sanjiovani/issue/SAN-578) | Concierge surface band — CopilotKit v1 AI strip | ⚪ Not Started | 0% | Spec 85% correct | Blocked on D-09 | Reuses existing `conciergeAgent` — fast once unblocked |
| **D-13** [SAN-579](https://linear.app/sanjiovani/issue/SAN-579) | Re-skin Home `/` — 14-band wireframe | ⚪ Not Started | 0% | `home-wireframe.html` 624L detailed spec | Blocked on D-08 | Can run parallel to D-09 after D-08 |
| **D-14** [SAN-580](https://linear.app/sanjiovani/issue/SAN-580) | Polish + proof — Playwright/a11y on re-skinned surfaces | ⚪ Not Started | 0% | §6 Quality Gate AC written for all surfaces | Blocked on D-09…D-13 all Done | Final gate — `d-14-RESULTS.md` required |

**D-Track total: 7/14 Done (50%) · 1 In Progress · 6 Blocked · Overall execution 50% 🟡**

---

## AI Agent + Automation Layer

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|---|---|---|:---:|---|---|---|
| CopilotKit Runtime `/api/copilotkit` | AG-UI bridge — all agent turns | 🟢 Completed | 100% | POST 200, CopilotKit 1.55.2 pinned, route.ts live | — | None |
| Mastra `conciergeAgent` | Core agent on `gemini-3.5-flash`, working memory | 🟢 Completed | 100% | `src/mastra/agents/index.ts`; Studio at :4111 | — | None |
| `search_rentals` tool | Mastra → Supabase rental search | 🟢 Completed | 100% | `/api/rentals/search` live | — | None |
| `search_events` tool | Mastra → Supabase events | 🟢 Completed | 100% | `/api/events/search` live | — | None |
| `search_grounded_places` tool | Gemini + Places API (restaurants, cafés) | 🟢 Completed | 100% | `/api/grounded/search` + `/api/places/detail` live; FieldMask gated | — | None |
| HITL Roberto Wizard | `renderAndWaitForResponse` — event publish approval | 🟢 Completed | 100% | `/host/event/new` + `/api/approval-commit` live | — | None |
| AGT-00A Faithfulness Scorer | Mastra scorer + `GET /api/scorers` | 🟢 Completed | 100% | Commit `212720a` merged | — | None |
| AGT-00B Grounding-Coverage Scorer | Mastra scorer | 🟢 Completed | 100% | Commit `7bee3a6` merged | — | None |
| AGT-00D Runtime Agent Allowlist | Mastra allowlist system | 🟢 Completed | 100% | Commit `c408a16` merged | — | None |
| Stripe Checkout | Create checkout session → returns `sessionUrl` | 🟡 In Progress | 65% | `/api/tickets/checkout` live | **Webhook `/api/tickets/webhook` — finalize order missing** — MVP P0 BLOCKER 🚨 | Deploy Stripe webhook + register events in Stripe Dashboard; e2e proof by **2026-06-08** |
| Camila HITL Lead Capture | Schedule viewing modal → leads table | 🟢 Completed | 100% | `/api/leads/schedule-viewing` live | — | None |
| Thread Memory (F13) | Mastra thread-scoped working memory | 🟢 Completed | 100% | `mastra_threads` via service-role carve-out; survives redeploy | — | None |
| RLS + Security Hardening | Supabase RLS + DEFINER policies | 🟢 Completed | 100% | Commit `7f73959` merged; hook `no-service-role-in-src.mjs` active | — | None |

---

## Core Screens + Routes

| Route | Screen | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next |
|---|---|---|:---:|---|---|---|
| `/` Home | Hero + concierge + verticals | 🟢 Live | 100% | sitemap LIVE; D-13 reskin pending | D-13 visual re-skin not started | D-13 after D-08 |
| `/chat` | Concierge alias → `/` | 🟢 Live | 100% | Redirect confirmed | — | — |
| `/events` + `/events/[slug]` | Event catalog + detail + Buy CTA | 🟢 Live | 100% | SAN-518 + SAN-586 + SAN-584 done | Stripe checkout webhook missing | Webhook P0 |
| `/restaurants` | Browse + filters | 🟢 Live | 100% | SAN-490 + SAN-575 re-skin basis | D-09 visual re-skin pending | D-09 |
| `/cafes` | Café browse catalog | 🟢 Live | 100% | SAN-519; nav enabled SAN-584 | D-09 visual re-skin pending | D-09 |
| `/nightlife` + listing | Nightlife browse | 🟢 Live | 100% | SAN-491 + SAN-575 basis | D-09 visual re-skin pending | D-09 |
| `/saved` | Saved places + collections | 🟢 Live | 100% | sitemap LIVE | D-10 visual re-skin pending | D-10 |
| `/host/event/new` | Roberto's AI publish wizard (HITL) | 🟢 Live | 100% | HITL approval panel live | — | — |
| `/host/events` | Roberto's published events list | 🟢 Live | 100% | SAN-118 + SAN-366 | — | — |
| `/me/tickets` + `[id]` | Ticket wallet + QR | 🟢 Live | 100% | Andrés can scan at door | — | — |
| `/login` `/signup` | Auth flows | 🟢 Live | 90% | Functional; visual polish pending | Login/signup D-09 skin scope | D-09 login polish |
| `/rentals` | Rental catalog browse | 🟥 Blocked | 10% | Redirects to `/chat` today | **SAN-478 functional page unbuilt** — design-plan #1, score 99 🚨 | Ship SAN-478 Track A; D-09 skin after |
| `/rentals/[id]` | Rental detail | ⚪ Not Started | 0% | Wireframe `rental-detail-wireframe.html` exists | No page.tsx | SAN-479 |
| `/trips` | Trips dashboard | 🟡 In Progress | 20% | Page exists, stub | Incomplete — SAN-255 M6 | M6 after D-10 |
| `/booking-checkout` overlay | Stripe checkout modal | 🟡 In Progress | 60% | Session creation works | **Stripe webhook finalize missing** 🚨 | EVP-003 by Jun 8 |
| `/admin/*` | Patricia ops dashboard | ⚪ Not Started | 0% | — | POST-MVP | W8 |

---

## Milestones Progress

| Milestone | Target | Status | % | ⚠️ Gap | 💡 Action |
|---|---|---|:---:|---|---|
| M2 — Design Foundation | 2026-06-10 | 🟢 Completed | **100%** | — | None |
| M3 — Component Base & Shared Card | 2026-06-13 | 🟡 In Progress | **75%** | D-08 files exist but not marked Done | Run D-08 Done gate today |
| M4 — Surface Re-skins | 2026-06-20 | ⚪ Not Started | **0%** | D-09…D-13 all blocked on D-08 | Unblocks after D-08 Done |
| M5 — Transactions | **2026-06-08** | 🟥 Blocked | **~10%** | **Stripe webhook not live** — target 2 DAYS AWAY 🚨 | URGENT: deploy EVP-003 webhook |
| M6 — Collections & Trips | 2026-06-15 | ⚪ Not Started | **0%** | `/trips` stub; itinerary missing | After D-10 |
| M7 — Mobile, A11y & Polish | 2026-06-22 | ⚪ Not Started | **0%** | 12 issues, all Backlog | After M4 |
| M8 — Phase 2 Browse & Admin | 2026-07-31 | ⚪ Not Started | **0%** | Post-launch | After launch |

---

## Production Readiness Verdict

| Area | Score | Dot | Blockers |
|---|---:|:---:|---|
| AI agent runtime + tools | 96 | 🟢 | None |
| Auth + RLS security | 98 | 🟢 | None |
| Event publish wizard (Roberto) | 95 | 🟢 | None |
| Restaurant/Café/Nightlife browse | 88 | 🟢 | D-09 skin only (not a launch blocker) |
| **Stripe payment finalize** | **25** | 🟥 | **EVP-003 webhook undeployed — blocks Andrés paying** |
| **Rentals catalog** | **15** | 🟥 | **SAN-478 unbuilt — Camila sees nothing** |
| Visual re-skin (D-09…D-14) | 5 | 🟥 | D-08 not marked Done; chain blocked |
| Trips / itinerary | 20 | 🟥 | SAN-255, SAN-251 not started |
| **Overall production-ready?** | **~52%** | 🟥 | **NOT LAUNCH-READY — 2 P0 blockers** |

---

## Next Website Pages to Design — Priority Order

Based on design-plan scores, sitemap gaps, and M4 critical path:

| Priority | Page | Route | Why Now | Design Vehicle | Score |
|---|---|---|---|---|:---:|
| **🔥 1** | **Rentals catalog** | `/rentals` | Design-plan #1 (score 99) — Camila's core surface; total blank today | Wireframe exists `rentals-browse-wireframe.html` → SAN-478 functional → D-09 skin | 99 |
| **🔥 2** | **Rental detail page** | `/rentals/[id]` | Cards link nowhere — dead end for every rental result | `rental-detail-wireframe.html` exists on disk | 95 |
| **3** | **Home re-skin** | `/` | 14-band wireframe ready; D-13 spec 86%; hero is the first impression at mdeai.co | `home-wireframe.html` 624L → D-13 (parallel to D-09 after D-08) | 92 |
| **4** | **For Event Hosts landing** | `/host` | Roberto acquisition page; marketing score 92; converts supply | New design needed — partners/wireframes exist as reference | 92 |
| **5** | **Trips dashboard** | `/trips` | Andrés + Camila retention layer; M6 target Jun 15 | `012-wire-trips-dashboard.md` + `trips-dashboard.html` wireframe | 88 |
| **6** | **Contact / Book a demo** | `/contact` | Captures venue + B2B leads; marketing score 82; low build effort | Single form + hero — reference `partner-signup-wireframe.html` | 82 |
| **7** | **About page** | `/about` | Trust layer for new visitors; sitemap POST but marketing score 80; 1-day build | New design — city identity + team + mission | 80 |
| **8** | **For Venues** | `/venues` | Venue acquisition (restaurants, cafés, nightlife self-list); score 88 | Reference `venues-wireframe.html` on disk | 88 |
| **9** | **Onboarding wizard** | `/onboarding` | Post-signup preferences + neighbourhood (personalizes concierge) | `023-wire-onboarding-wizard.md` wireframe ready | 78 |
| **10** | **Neighbourhood guides** | `/medellin/[barrio]` | SEO organic play — Laureles, Poblado, El Centro; score 90 | New — template repeatable per barrio | 90 |

---

## 🚨 Critical Path — Do These First

```
TODAY (Jun 6)
  1. Run D-08 Done gate → flip Linear to Done → unblocks D-09/D-13

URGENT (by Jun 8 — M5 deadline)
  2. Deploy Stripe webhook EVP-003 + register events in Stripe Dashboard
  3. E2E proof: Andrés buys ticket → webhook fires → order finalized

THIS WEEK (Jun 8–13 — M3 complete)
  4. Ship SAN-478 (rentals functional browse page) — Track A #1 priority
  5. Start D-09 re-skin after D-08 Done (restaurants + cafés first, rentals after SAN-478)
  6. Start D-13 home re-skin in parallel (no D-09 dependency)

BY JUN 15 (M4 surface re-skins + M6 trips)
  7. D-11 map workspace (highest ROI UX feature — Mindtrip moat)
  8. D-10 dashboard re-skin (/saved, /trips, /me/tickets)
  9. SAN-255 trips dashboard (M6)

BY JUN 22 (M7 — launch)
  10. D-14 polish + Playwright proof pass on all re-skinned surfaces
  11. Mobile + a11y sweep (SAN-521–530)
```

The two launch blockers are **Stripe webhook** (Andrés can't pay) and **`/rentals` page** (Camila sees nothing). Everything else — including the entire D-track re-skin — is quality/polish, not a functional launch gate.