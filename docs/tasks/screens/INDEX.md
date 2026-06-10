# Screen + wireframe specs — hub

**Domain folders** now own scr/wire pairs. This folder keeps **platform shell** specs + shared standards.

**Verify all pairings:** `node scripts/verify-scr-wire-pairing.mjs`  
**Testing standard:** [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md)  
**Master task index:** [`../INDEX.md`](../INDEX.md)

> **Skill caveat — CopilotKit v1 vs v2.** The `copilotkit-develop` and `copilotkit-integrations`
> skills teach **v2** APIs (`useFrontendTool`, `useAgent`, `useHumanInTheLoop`, `useRenderToolCall`,
> `createCopilotEndpoint`, `@copilotkit/react`). mdeapp is **pinned to v1.55.2** (CLAUDE.md hard rule),
> so any screen spec must **translate to v1**: `useCopilotAction` / `useCoAgent` /
> `renderAndWaitForResponse`, `<CopilotChat>` from `@copilotkit/react-ui` (Input is **not** exported —
> compose a custom textarea), runtime via `copilotRuntimeNextJSAppRouterEndpoint` +
> `ExperimentalEmptyAdapter` + `MastraAgent.getLocalAgents`. Agent name must equal the Mastra key
> (`conciergeAgent`). v2 migration is Phase 2 only.

---

## Where specs live

| Domain | Folder | INDEX |
|--------|--------|-------|
| **Events** (Andrés tickets, Roberto host) | [`../events/wireframes/`](../events/wireframes/INDEX.md) | 003 buyer + 004 host + **015 tickets** |
| **Venues** (café, nightlife, restaurants, sheet) | [`../venues/`](../venues/INDEX.md) · **Café hub:** [`../venues/cafes/INDEX.md`](../venues/cafes/INDEX.md) | 005–008 + `cafes/` |
| **Trips** (itinerary, checkout, saved) | [`../trips/`](../trips/INDEX.md) | 010–014 |
| **Maps** (exploration panel) | [`../maps/wireframes/`](../maps/wireframes/INDEX.md) | 011 |
| **Real estate** (rental cards) | [`../real-estate/`](../real-estate/INDEX.md) | 009 |
| **Platform shell** (this folder) | `tasks/screens/` | 001–002, 017–020, **027 events browse**, shared standards |

---

## Platform shell — specs in this folder

| Group | scr | wire | Legacy SCREEN |
|-------|-----|------|---------------|
| **001** | [001-scr-home-chat-chrome](001-scr-home-chat-chrome.md) | [001-wire-home-chat](001-wire-home-chat.md) | 001 |
| **002** | [002-scr-chat-nav-rail](002-scr-chat-nav-rail.md), [002-scr-chat-query-bar](002-scr-chat-query-bar.md), [017-scr-workflow-progress-strip](017-scr-workflow-progress-strip.md), [018-scr-mobile-responsive-shell](018-scr-mobile-responsive-shell.md) | [002-wire-chat-chrome](002-wire-chat-chrome.md) | 002, 003, 004, 018 |
| **017** | [017-scr-login-signup-polish](017-scr-login-signup-polish.md), [017-scr-schedule-viewing-modal](017-scr-schedule-viewing-modal.md) | [024-wire-auth-login-signup](024-wire-auth-login-signup.md) | 017, 008 |
| **019–020** | [019-scr-loading-error-empty-states](019-scr-loading-error-empty-states.md), [020-scr-accessibility-pass](020-scr-accessibility-pass.md) | — | 019, 020 |

**Schedule viewing (SCREEN-008)** shares wire with trips: [`../trips/010-wire-booking-checkout.md`](../trips/010-wire-booking-checkout.md)

---

## Browse pages (catalog routes)

| Route | scr | Linear | Status |
|-------|-----|--------|--------|
| `/restaurants` | [venues/008-scr](../venues/tasks/mvp/wireframes/008-scr-restaurant-listings-map.md) | SAN-490 | Done |
| `/nightlife` | [venues/007-scr](../venues/tasks/mvp/wireframes/007-scr-nightlife-listings-map.md) | SAN-491 | Done |
| `/cafes` | [venues/028-scr](../venues/tasks/mvp/008-scr-cafes-browse-page.md) | SAN-519 | Not started (sidebar greyed) |
| `/rentals` | [real-estate/REAL-011](../real-estate/wireframes/009-scr-rentals-browse-page.md) | SAN-478 | Not started (redirect today) |
| `/events` | **[SCREEN-027-events-browse.md](SCREEN-027-events-browse.md)** | SAN-518 | **MVP spec** (SAN-585) — no route yet |

Spec: SCREEN-027 · Data: SAN-586 · Nav enable: SAN-584 · Re-skin: SAN-587

---

## Deferred wires (no scr) — still in this folder

[009-wire-rentals-browse](../real-estate/009-wire-rentals-browse.md) · [010-wire-bookings-inbox](../trips/010-wire-bookings-inbox.md) · [016-wire-explore-unified](016-wire-explore-unified.md) · [018-wire-contest-discovery](018-wire-contest-discovery.md) · [019-wire-creator-dashboard](019-wire-creator-dashboard.md) · [020-wire-mindtrip-patterns](020-wire-mindtrip-patterns.md) · [023-wire-onboarding-wizard](023-wire-onboarding-wizard.md) · [025-wire-notifications](025-wire-notifications.md)

---

## Cross-domain flows

```text
/ chat shell (001–002, 018)
  ├─ rentals      → real-estate/009-scr + venues/006 sheet
  ├─ events       → events/wireframes/003-scr + 015-scr (tickets) + **SCREEN-027 /events browse (SAN-518)**
  ├─ cafés        → venues/cafes/INDEX.md (005-scr / SCREEN-021)
  ├─ nightlife    → venues/007-scr (planned)
  ├─ restaurants  → venues/008-scr
  └─ trips/saved  → trips/012-scr, trips/014-scr
```

[`00-index.md`](00-index.md) redirects here.

*Last updated: 2026-06-05 — SCREEN-027 events browse spec (SAN-585)*
