---
title: mdeai Task Index (slim)
updated: 2026-06-02
owner: sanjiovani
plan: ../plan.md
todo: ../todo.md
mvp_required: ./MVP-REQUIRED.md
mvp_execution: ./MVP-EXECUTION.md
mvp_queue: ./linear/mvp-queue.json
linear_plan: ./linear/07-mvp.md
---

# mdeai — Task Index

> **Live P0 queue:** [`MVP-EXECUTION.md`](MVP-EXECUTION.md) · [`../todo.md`](../todo.md)  
> **Strategy:** [`../prd.md`](../prd.md) · **Now/Next/Later:** [`../roadmap.md`](contest/docs/roadmap.md) · **Post-MVP depth:** [`../advanced.md`](../advanced.md)

**North star:** Camila on `/` (cards + pins) · Andrés paid ticket · Roberto host publish @ https://www.mdeai.co

> **Progress audit (2026-06-01):** [`progres.md`](progres.md) · **~78%** MVP · floor **401** Vitest @ `c9e54b8` · **PR train:** [`PR/INDEX.md`](PR/INDEX.md) · **Skills:** [`../index-skills.md`](../index-skills.md)
>
> **MVP dashboard (frozen):** [`MVP-EXECUTION.md`](MVP-EXECUTION.md) · [`linear/mvp-queue.json`](linear/mvp-queue.json) · [`linear/NAMING-CLEANUP-REPORT.md`](NAMING-CLEANUP-REPORT.md)  
> **Linear titles:** PAY-*, EVT-*, UX-*, MAP-*, AUTH-*, OPS-* — IMP/EVP/SCREEN deprecated  
> **Views:** [MVP](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) `label:phase:launch` · [UX](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) `label:track:ux` — **single live design queue** (epic SAN-566, D-01…D-14 ← `tasks/design/index-design.md`; filter status≠Done; the `screens` project is just the folder, *not* a second queue) · [MDEAPP project](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues) · PR train `label:track:pr`

| Dot | Status |
|-----|--------|
| 🟢 | Complete |
| 🟡 | In progress |
| 🔴 | Failed / blocked |
| ⚪ | Not started |

---

## Master implementation order (remaining work)

Execute **top to bottom** within each tier. **`‖`** = parallel OK. Full detail: [`../plan.md`](../plan.md).

```text
TIER 0 — Shipped 🟢
  All 78 foundation tasks (IMP-001–078) · archives under tasks/archive/

TIER 1 — P0 MVP exit (strict order)
  # Andrés pays for a ticket; Roberto proves host publish on prod
  079 G1         → Andrés ticket checkout (Stripe session + orders table)
  080 EVP-003    → Stripe webhook secret audit (security gate before payments go live)
  081 EVP-013    → Event card in chat renders correctly (buy CTA visible)
  082 G3         → Roberto host-publish proof on https://www.mdeai.co
  083 EVP-001    → Events production proof gates (all green before launch)
  # Parallel once above chain starts:
  084 F32        ‖ Production smoke / health check (cold-start + API roundtrip)
  085 AUTH-011   ‖ Auth production checklist (JWT, RLS, session handling)
  091 MAP-002B   ‖ ADK grounding deploy to Vercel prod
  092 MAP-008B   ‖ Verify mapId set on every Vercel map (AdvancedMarker requirement)

TIER 1C — UX prod remediation (P0 priority, runs ‖ Tier 1)
  # Visual polish and reliability for the live chat product
  093 UX-003 🟢 · 094 UX-002+095 UX-005 🟢 · 097 UX-001 🟢 · 102 UX-010 🟢 (G2c/G2d)
  Wave-1 🟢 UX-028/032/034 (#35–#37) · 098 UX-006 🟢 via UX-032 · 101 UX-009 🟢 via UX-034
  099 UX-007 (clear stale map markers) · 100 UX-008 🟢 · polish: UX-020/023/024/029/033
  Index: tasks/ux/tasks/INDEX.md

TIER 1D — PR remediation (P1 process — do first; ‖ MVP only when tree clean)
  # Clean up the hotfix pile, stacked PRs, and stale migrations before more ships land
  PR-13 🟡 Split hotfix pile → PR-01 🟢 Verify #34 → PR-08 Scope gate (restore_post_mvp_*)
  → PR-04 C1 migrations → PR-05/06/07 Extract edge fns/seeds/rollbacks → PR-09 Close #23
  → PR-02/03 Concierge hoist → PR-14/15 Worktrees + ADK smoke
  Index: tasks/PR/INDEX.md · Linear: tasks/linear/pr-remediation-queue.json · label track:pr

TIER 2 — P1 MVP polish (after Tier 1 all 🟢)
  # Nice-to-have before launch: auth UX, map panel, Playwright auth coverage
  086 EVP-014  Host events list page (Roberto sees his published events)
  087 SCREEN-017  Login / signup visual polish
  088 SCREEN-010  Map exploration right panel (click pin → detail panel)
  089 MAP-010  Place autocomplete when creating a venue (conditional on usage data)
  090 AUTH-005  Playwright auth e2e tests (quality gate, parallel OK)

TIER 3 — Intelligence CORE (‖ Tier 1 when staffed)
  # AI ranking + signal enrichment — makes results smarter, not just present
  INT-001 → INT-002 → INT-003 → INT-004 → INT-005
  Index: tasks/intelligence/intelligence-plan.md (MIS roadmap)
  INT specs: tasks/intelligence/tasks/INDEX.md
  Linear: https://linear.app/sanjiovani/view/intelligence-7bbdb829ba23

TIER 4 — Data foundation
  # Seed real venues/rentals/trips/events into Supabase so pages show real content
  4A venues (cafés → restaurants → nightlife):
    data-001 schema → 002 catalog contract → 009 migrations → 035 café seed
    → 003 café data → 004‖005 restaurant + nightclub data → 006 golden queries → 007 cache → 008 cron
  4B rentals:  data-019 → 020 → 021 → 023
  4C trips:    data-026 → 027 → 029 → 028 → 030
  4D events/maps/security: data-012…018 · data-034‖MAP-005 · data-010/011 · VEC-001
  Index: tasks/data/tasks-data/INDEX-data.md

TIER 5 — Venues MVP (VEN-009…051)
  # Café, restaurant, nightlife listing pages + map pins + booking/reservation flows
  DATA-002+009 (+ DATA-035 café seed) → VEN-009…013 (cards + map)
  → VEN-014 (venue detail sheet) → VEN-015…024 (filtering, search) → VEN-025…030 (reservations)
  → VEN-031 (testing) → VEN-032…043 (tours, optional ‖)
  → post-mvp VEN-025…034 → VEN-044…051
  Index: tasks/venues/tasks/mvp/mvp-index.md · crosswalk: tasks/venues/CROSSWALK-INT.md

TIER 6 — Intelligence MVP → ADV
  # Full AI signal pipeline: from search → ranking → personalization
  INT-006…010 (MVP scoring) → INT-011…015 (POST: memory + preferences)
  → INT-016…020 (ADV: vector similarity, needs VEC-001…003)

TIER 7 — Maps depth (ADV, after MAP-005)
  # Clustering, viewport sync, ADK grounding, neighborhood layers
  MAP-005 (places client) → 006 → 012A → 012 → 010 → data-033 → 011A → 011 → 023 · MAP-034

TIER 8 — Real estate + Trips apps (ADV)
  # Camila rental detail pages + full trips/itinerary app
  RE-001…020 (RE-017…020 = INT rental intelligence) · TRIP-001…019 after data-026…029

TIER 9 — Events ADV + vector + grounding + CK gaps
  # Advanced event flows, vector search, web grounding, CopilotKit v2 gaps
  EVP-015…047 · VEC-001…005 · GS-005…009 · CK-001…008

TIER 10 — Core post-MVP + Phase 2+
  # WhatsApp transport, language layer, admin, OpenClaw contest
  F20 (admin), F21A, F22, F26, F30 · OCL-* (OpenClaw) · CTEST-* (contest) · AUTH-009

TIER R — Revenue (post-MVP-exit, 37 tasks across R1–R5)
  # Gate: PAY-001 + EVT-001 + MAP-002B + AUTH-011 must all close first
  # Strategy: docs/strategy/index-revenue.md · Backlog: docs/strategy/task-backlog.md
  R1 (week 1–2): C13 → C1 ‖ C11 → C2
  R2 (wk 3–7):  C3 → C12 → C6 → C15 → C9 → C10
  R3 (wk 6–12): C4 → C5 → C7 → C8 → C14
  R4 (mo 3–6):  M1 → M4 ‖ M5 ‖ M6 ‖ M7 ‖ M8 → M2 → M9 ‖ M11 ‖ M3 ‖ M10 ‖ M12
  R5 (mo 6–18): A5 ‖ A6 ‖ A10 → A8 ‖ A2 → A1 → A3 ‖ A7 ‖ A4 ‖ A9
  Index: tasks/revenue/INDEX-revenue.md · Linear: Commerce Platform · AI & Intelligence · Growth & Operations
```

**Retired IDs (do not use in new specs):** `ven-01–24` · `CTI-*` · `tasks/venues/tasks-intelligent/` · `cafes/listings/` (use `tasks/venues/tasks/listings/`). Migration: [`venues/tasks/VEN-MIGRATION-2026-05-28.md`](venues/tasks/VEN-MIGRATION-2026-05-28.md).

---

## Metrics (2026-06-01)

| Metric | Value | Status |
|--------|------:|:------:|
| Overall MVP readiness | **~78%** | 🟡 |
| Shipped foundation (IMP-001–078) | 78 tasks | 🟢 |
| **Active P0 open** | **7 MVP** + **4 UX polish** (wave-1 closed) | 🟡 |
| **PR remediation** | PR-13 🟡 In Progress · PR-14…18 ⚪ | 🟡 |
| Post-MVP tracks catalogued | 22 indexes | ⚪ |
| Tests / floor | **401/401** Vitest @ `c9e54b8` | 🟢 |
| Prod | https://www.mdeai.co · G2d + wave-1 on `main` | 🟢 |
| UX wave-1 | **#35–#37** merged (`c9e54b8`) | 🟢 |
| MVP exit (G1+G3+EVT-001 ledger) | **not closed** | 🟥 |
| Progress tracker | [`progres.md`](progres.md) · [`PR/INDEX.md`](PR/INDEX.md) | 🟢 |

**Verification (2026-06-01):** `main` @ **`c9e54b8`** · Vitest **401** · G2d PASS · PR-13 triage: [`PR/evidence/PR-13-triage-2026-06-01.md`](PR/evidence/PR-13-triage-2026-06-01.md). Full audit: [`progres.md`](progres.md).

---

## Active queue — P0 MVP exit

> **Linear milestone:** 🚨 Launch Critical · **View:** [MVP view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) · Machine queue: [`linear/mvp-queue.json`](linear/mvp-queue.json)

| IMP | Spec ID | What it does | SAN | % | Status | Spec |
|----:|---------|-------------|-----|--:|:------:|------|
| 079 | G1 | Andrés buys a ticket — Stripe session + `event_orders` row + wallet | [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) | 80 | 🟡 | [`../todo.md`](../todo.md) |
| 080 | EVP-003-core | Separate Stripe webhook signing secrets per environment (security gate) | [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) | 60 | 🔴 | [`events/EVP-003-core-stripe-webhook-secret-audit.md`](events/EVP-003-core-stripe-webhook-secret-audit.md) |
| 081 | EVP-013-core | Event card in chat thread — correct rendering + Buy CTA visible | [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) | 45 | 🔴 | [`events/EVP-013-core-event-card-component.md`](events/EVP-013-core-event-card-component.md) |
| 082 | G3-core | Roberto host-publish proof on prod — wizard → published event live | [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) | 90 | 🟡 | [`events/G3-core-host-publish-proof.md`](events/G3-core-host-publish-proof.md) |
| 083 | EVP-001-core | Events production proof gates — all checks green before launch | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) | 0 | 🔴 | [`events/EVP-001-core-production-proof-gates.md`](events/EVP-001-core-production-proof-gates.md) |
| 084 | F32 | Production smoke — cold-start + `/api/copilotkit` + map + chat roundtrip | [SAN-100](https://linear.app/sanjiovani/issue/SAN-100) | 0 | ⚪ | [`core/F32-production-smoke.md`](core/F32-production-smoke.md) |
| 085 | AUTH-011 | Auth production checklist — JWT expiry, RLS, session handling on prod | [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) | 40 | 🟡 | [`data/tasks/AUTH-011-production-auth-checklist.md`](data/tasks/AUTH-011-production-auth-checklist.md) |
| 091 | MAP-002B | Deploy ADK grounding service to Vercel prod (enables web-grounded results) | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | 0 | ⚪ | [`maps/MAP-002B-prod-adk-deploy.md`](maps/MAP-002B-prod-adk-deploy.md) |
| 092 | MAP-008B | Verify `mapId` is set on every Vercel-deployed map (required for AdvancedMarker) | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) | 0 | ⚪ | [`maps/MAP-008B-vercel-map-id-verify.md`](maps/MAP-008B-vercel-map-id-verify.md) |

---

## Active queue — UX prod remediation (P0 priority)

**Parallel with MVP exit** — do not defer. Full order: [`ux/INDEX.md`](ux/INDEX.md) · [`../plan.md`](../plan.md) Tier 1C.
**View:** [UX Tasks](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) — filter: `label:track:ux`

| IMP | Spec ID | SAN | What it does | % | Status | Spec |
|----:|---------|-----|-------------|--:|:------:|------|
| 097 | UX-001 | [SAN-315](https://linear.app/sanjiovani/issue/SAN-315) | Restore `conciergeAgent` name on prod so chat doesn't 404 silently (PR #13) | 100 | 🟢 | [`ux/UX-001-restore-concierge-agent-prod.md`](ux/UX-001-restore-concierge-agent-prod.md) |
| 093 | UX-003 | [SAN-316](https://linear.app/sanjiovani/issue/SAN-316) | Fix “$500 a night” rental price parser — Camila's query returned no results | 100 | 🟢 | [`ux/archive/`](ux/archive/) · PR #15 |
| 094 | UX-002 | [SAN-320](https://linear.app/sanjiovani/issue/SAN-320) | Show user-facing error message on `RUN_ERROR` / timeout (not a blank spinner) | 100 | 🟢 | [`ux/archive/`](ux/archive/) · UX-015 |
| 095 | UX-005 | [SAN-319](https://linear.app/sanjiovani/issue/SAN-319) | Animated “thinking” indicator while concierge is processing | 100 | 🟢 | same PR as UX-002 |
| 101 | UX-009 | [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) | Synthetic prod monitor — pings `/` + `/api/copilotkit` on a schedule | 100 | 🟢 | **UX-034** [#37](https://github.com/amo-tech-ai/mdeapp/pull/37) |
| 098 | UX-006 | [SAN-321](https://linear.app/sanjiovani/issue/SAN-321) | “New chat” button resets thread + clears map pins cleanly | 100 | 🟢 | **UX-032** [#36](https://github.com/amo-tech-ai/mdeapp/pull/36) |
| — | UX-028 | [SAN-440](https://linear.app/sanjiovani/issue/SAN-440) | Restaurant cards show real Google Places photos (not blank placeholders) | 100 | 🟢 | [#35](https://github.com/amo-tech-ai/mdeapp/pull/35) |
| 099 | UX-007 | [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) | Clear stale AdvancedMarkers when results change so old pins don't linger on the map | 0 | ⚪ | [`PR/ux/UX-033-clear-stale-advanced-markers.md`](PR/ux/UX-033-clear-stale-advanced-markers.md) |
| 100 | UX-008 | [SAN-324](https://linear.app/sanjiovani/issue/SAN-324) | Fix save-heart tooltip copy (“Save” not “Saved” on first click) | 100 | 🟢 | [`ux/archive/`](ux/archive/) · UX-027 |
| 102 | UX-010 | [SAN-318](https://linear.app/sanjiovani/issue/SAN-318) | Unified result-card architecture — rental/event/restaurant cards share one pattern | 100 | 🟢 | [`ux/archive/`](ux/archive/) |
| 096 | UX-004 | [SAN-317](https://linear.app/sanjiovani/issue/SAN-317) | ~~Disable Events/Food chips~~ — not needed once concierge was restored | — | 🚫 Canceled | — |

Audit: [`ux/audit/03-ux-audit.md`](ux/audit/03-ux-audit.md) · cards: [`ux/audit/10-audit-cards.md`](ux/audit/10-audit-cards.md)

---

## Active queue — PR remediation ([`PR/INDEX.md`](PR/INDEX.md))

> **Linear:** [MDEAPP project](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues) · filter `label:track:pr` · machine queue: [`linear/pr-remediation-queue.json`](linear/pr-remediation-queue.json) · **PR-13 triage:** [`PR/evidence/PR-13-triage-2026-06-01.md`](PR/evidence/PR-13-triage-2026-06-01.md)

| Order | ID | What it does | Pri | Status | Spec |
|------:|----|-------------|-----|--------|------|
| 0 | [PR-13](https://linear.app/sanjiovani/issue/SAN-447) | Triage the hotfix pile — discard what landed in #35–37, salvage what's still needed | P1 | 🟡 | [`PR/tasks/PR-13-split-hotfix-pile.md`](PR/tasks/PR-13-split-hotfix-pile.md) |
| 1 | [PR-01](https://linear.app/sanjiovani/issue/SAN-451) | Confirm PR #34 events try/catch is safe on prod (already merged — verify only) | P2 | 🟢 | [`PR/tasks/PR-01-search-events-trycatch.md`](PR/tasks/PR-01-search-events-trycatch.md) |
| 2 | [PR-08](https://linear.app/sanjiovani/issue/SAN-445) | Decide which `restore_post_mvp_*` branches are in scope before any merge | P1 | ⚪ | [`PR/tasks/PR-08-restore-postmvp-decision.md`](PR/tasks/PR-08-restore-postmvp-decision.md) |
| 3 | [PR-04](https://linear.app/sanjiovani/issue/SAN-446) | Land C1 schema migrations (DATA-048 venue columns) in their own clean PR | P1 | 🟡 | [`PR/tasks/PR-04-c1-migrations.md`](PR/tasks/PR-04-c1-migrations.md) |
| 4–6 | [PR-05…07](https://linear.app/sanjiovani/issue/SAN-452) | Extract edge functions / seed scripts / rollback migrations out of mega-PR #23 | P1–P3 | ⚪ | [`PR/LINEAR.md`](PR/LINEAR.md) |
| 7 | [PR-09](https://linear.app/sanjiovani/issue/SAN-455) | Close PR #23 (stale mega-PR) + leave supersede comment pointing to replacements | P2 | ⚪ | [`PR/tasks/PR-09-close-23-supersede.md`](PR/tasks/PR-09-close-23-supersede.md) |
| 8–9 | [PR-02](https://linear.app/sanjiovani/issue/SAN-450) / [PR-03](https://linear.app/sanjiovani/issue/SAN-449) | Hoist concierge provider higher + fix remount on hot reload | P1–P2 | ⚪ | [`PR/LINEAR.md`](PR/LINEAR.md) |
| 10–12 | [PR-10](https://linear.app/sanjiovani/issue/SAN-457) · [PR-11](https://linear.app/sanjiovani/issue/SAN-432) · [PR-12](https://linear.app/sanjiovani/issue/SAN-456) | PR #31 scope review · PR #19/#20 close or merge · anon-key audit | P2–P3 | ⚪ | [`PR/INDEX.md`](PR/INDEX.md) |
| 17–19 | [PR-17](https://linear.app/sanjiovani/issue/SAN-459) · [PR-16](https://linear.app/sanjiovani/issue/SAN-458) · [PR-18](https://linear.app/sanjiovani/issue/SAN-460) | Migration lint gate · floor CI workflow · SHA-pin dependencies | P1–P2 | ⚪ | [`PR/LINEAR.md`](PR/LINEAR.md) |
| 21–22 | [PR-14](https://linear.app/sanjiovani/issue/SAN-448) / [PR-15](https://linear.app/sanjiovani/issue/SAN-444) | Relocate worktrees to `/tmp/` · ADK smoke test setup | P2 | ⚪ | [`PR/tasks/PR-14-relocate-worktrees.md`](PR/tasks/PR-14-relocate-worktrees.md) |

**Do not mix:** open GitHub **#23** wholesale · **#38** while soak red · hotfix tree mega-PR.

---

## Active queue — P1 polish

| IMP | ID | What it does | % | Status | Spec |
|----:|----|-------------|--:|:------:|------|
| 086 | EVP-014-core | Host events list page — Roberto sees all his published events at `/host/events` | 0 | ⚪ | [`events/EVP-014-core-host-events-list-page.md`](events/EVP-014-core-host-events-list-page.md) |
| 087 | SCREEN-017 | Login / signup visual polish — shadcn styling, error states, Playwright spec | 0 | ⚪ | [`screens/017-scr-login-signup-polish.md`](screens/017-scr-login-signup-polish.md) |
| 088 | SCREEN-010 | Map exploration right panel — click a pin → detail slides in from right | 0 | ⚪ | [`maps/wireframes/011-scr-map-exploration-panel.md`](maps/wireframes/011-scr-map-exploration-panel.md) |
| 089 | MAP-010 | Place autocomplete when a host creates a venue (Google Places typeahead) | 0 | ⚪ | [`maps/MAP-010-place-autocomplete-venue.md`](maps/MAP-010-place-autocomplete-venue.md) |
| 090 | AUTH-005 | Playwright e2e tests for login → chat → auth-gated page flows | 0 | ⚪ | [`data/tasks/AUTH-005-playwright-auth-e2e.md`](data/tasks/AUTH-005-playwright-auth-e2e.md) |

---

## Post-MVP catalog (by track)

> Work that is **planned and indexed** but does not block MVP launch. Start after Tier 1 is green.

| Track | Phase | Open scope | Index |
|-------|:-----:|------------|-------|
| **Intelligence (MIS)** | Phase 0→4 | DATA-040+, SEARCH-*, AI-*, INT-001…022 | [`intelligence/intelligence-plan.md`](intelligence/intelligence-plan.md) · [`intelligence/tasks/INDEX.md`](intelligence/tasks/INDEX.md) · [Linear view](https://linear.app/sanjiovani/view/intelligence-7bbdb829ba23) |
| **Data** | ADV | data-001…035 (001 🟡; **035** café seed) | [`data/tasks-data/INDEX-data.md`](data/tasks-data/INDEX-data.md) |
| **Venues (VEN)** | MVP→ADV | **VEN-009…051**; SCREEN-021 🟢; DATA-035 seed | [`venues/tasks/mvp/mvp-index.md`](venues/tasks/mvp/mvp-index.md) · [`venues/INDEX.md`](venues/INDEX.md) |
| **Maps depth** | ADV | MAP-005…023, 034, 002A | [`maps/INDEX.md`](maps/INDEX.md) |
| **Real estate** | ADV | RE-001…020 | [`real-estate/tasks/INDEX.md`](real-estate/tasks/INDEX.md) |
| **Trips** | ADV | TRIP-001…019 + data-026…030 | [`trips/tasks/INDEX.md`](trips/tasks/INDEX.md) |
| **Events (EVP)** | P0–ADV | EVP-001…047 | [`events/tasks/INDEX.md`](events/tasks/INDEX.md) |
| **Vector** | ADV | VEC-001…005 | [`vector/INDEX.md`](vector/INDEX.md) |
| **Grounding** | ADV | GS-005…009 | [`grounding-search/tasks/INDEX.md`](grounding-search/tasks/INDEX.md) |
| **CopilotKit gaps** | ADV | CK-001…008 | [`copilotkit/INDEX.md`](copilotkit/INDEX.md) |
| **Core platform** | ADV | F20, F21A, F22, F26, F30 | [`core/README.md`](core/README.md) |
| **Auth** | P0/P2 | AUTH-011 🟡, AUTH-005, AUTH-009 | [`data/auth/INDEX.md`](data/auth/INDEX.md) |
| **ADK ops** | ADV | CR-07, CR-08 | [`ADK/INDEX.md`](ADK/INDEX.md) |
| **OpenClaw** | Phase 2+ | OCL-001…042 | [`openclaw/index-ocl.md`](openclaw/index-ocl.md) |
| **Contest** | Phase 2+ | CTEST-* | [`contest/INDEX.md`](contest/INDEX.md) |
| **UX (prod chat)** | **P0 polish** | Wave-1 🟢; UX-020/023/024/029/033 open | [`ux/tasks/INDEX.md`](ux/tasks/INDEX.md) |
| **PR remediation** | **P1 process** | PR-13…18 (split hotfix, #23 train) | [`PR/INDEX.md`](PR/INDEX.md) |
| **Screens** | MVP+ | SCREEN-* registry | [`screens/INDEX.md`](screens/INDEX.md) |
| **Archives (Done)** | 🟢 | IMP-001–078 | [`archive/README.md`](archive/README.md) |

**Venues audit / order proof:** [`venues/tasks/audit/01-venues-audit.md`](venues/tasks/audit/01-venues-audit.md) · [`venues/tasks/audit/02-implementation-order-plan.md`](venues/tasks/audit/02-implementation-order-plan.md)

---

## Skills + docs (agent routing)

| Work | Load (≤5) | Path |
|------|-----------|------|
| Task lifecycle / Done | `mde-task-lifecycle` → `task-verifier` | `.claude/skills/` |
| CopilotKit + Mastra | `copilotkit` → `copilotkit-integrations` | not `copilotkit-develop` alone (v2) |
| Agents / tools | `mastra` → `gemini` | `gemini-3.5-flash` in `mdeapp` |
| Maps | `mde-maps` | MCP: google-maps-code-assist |
| DB / edge | `mde-supabase` | MCP: user-supabase |
| UI | `shadcn`, `tailwind-best-practices` | screen specs in `tasks/screens/` |

Full matrix: [`../index-skills.md`](../index-skills.md)

---

## Quick links

| Area | Index |
|------|-------|
| **Plan / todo / MVP exit** | [`../plan.md`](../plan.md) · [`../todo.md`](../todo.md) · [`MVP-REQUIRED.md`](MVP-REQUIRED.md) |
| **Progress audit** | [`../progress/may30.md`](../progress/may30.md) · [`progres.md`](progres.md) |
| Events | [`events/tasks/INDEX.md`](events/tasks/INDEX.md) |
| Maps | [`maps/INDEX.md`](maps/INDEX.md) |
| Screens | [`screens/INDEX.md`](screens/INDEX.md) |
| Core | [`core/README.md`](core/README.md) |
| Data | [`data/tasks-data/INDEX-data.md`](data/tasks-data/INDEX-data.md) |
| Venues | [`venues/tasks/mvp/mvp-index.md`](venues/tasks/mvp/mvp-index.md) |
| Intelligence | [`intelligence/tasks/INDEX.md`](intelligence/tasks/INDEX.md) |
| **UX / prod chat** | [`ux/tasks/INDEX.md`](ux/tasks/INDEX.md) |
| **PR remediation** | [`PR/INDEX.md`](PR/INDEX.md) · [`linear/pr-remediation-queue.json`](linear/pr-remediation-queue.json) |
| **Linear MDEAPP** | [Project issues](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues) |
| Linear / IMP | [`linear/core-mvp-order.json`](linear/core-mvp-order.json) |

*Last reviewed: 2026-06-01 — `main` @ `c9e54b8`; wave-1 #35–#37; PR-13 triage [`PR/evidence/PR-13-triage-2026-06-01.md`](PR/evidence/PR-13-triage-2026-06-01.md)*
