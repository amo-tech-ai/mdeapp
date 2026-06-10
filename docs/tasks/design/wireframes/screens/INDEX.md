# Screen + wireframe specs — hub

> **Design track (D-01…D-14):** [`../tasks/INDEX.md`](../tasks/INDEX.md) — single task queue. This hub is for **platform-shell SCR/WIRE** route-build specs only.

**Canonical tree:** `tasks/wireframes/**` — edit here first.  
**Mirror:** `tasks/screens/` holds platform-shell copies; run `cp tasks/wireframes/screens/002-scr-*.md tasks/screens/` after edits or rely on verify script drift errors.

**Verify pairings:** `node scripts/verify-scr-wire-pairing.mjs` (repo root)  
**Testing standard:** [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md)  
**Audit (2026-06-04):** [`../../notes/june3/notes-4-screens-audit.md`](../../notes/june3/notes-4-screens-audit.md)

> **CopilotKit v1 only** — mdeapp pinned 1.55.2; translate v2 skill snippets to `useCoAgent` / `useCopilotAction` before coding.

---

## Where specs live

| Domain | Folder | INDEX |
|--------|--------|-------|
| **Events** | [`../events/wireframes/`](../events/wireframes/INDEX.md) | 003, 004, 015, **EVP-014** `/host/events` |
| **Venues** | [`../venues/`](../venues/INDEX.md) | 007 nightlife, 008 restaurants, **028 cafés browse** |
| **Trips** | [`../trips/`](../trips/INDEX.md) | 010 checkout, 012–014 |
| **Maps** | [`../maps/wireframes/`](../maps/wireframes/INDEX.md) | 011 |
| **Real estate** | [`../real-estate/`](../real-estate/INDEX.md) | 009 cards **+ REAL-011 browse** |
| **Platform shell** | **`tasks/wireframes/screens/`** (this folder) | 001–002, 017–020 |

---

## Platform shell — specs in this folder

| Group | scr | wire | Legacy SCREEN |
|-------|-----|------|---------------|
| **001** | [001-scr-home-chat-chrome](001-scr-home-chat-chrome.md) | [001-wire-home-chat](001-wire-home-chat.md) | 001 |
| **002** | [002-scr-chat-nav-rail](002-scr-chat-nav-rail.md), [002-scr-chat-query-bar](002-scr-chat-query-bar.md) | [002-wire-chat-chrome](002-wire-chat-chrome.md) | 002, 003 |
| **004, 018** | [017-scr-workflow-progress-strip](017-scr-workflow-progress-strip.md) · [018-scr-mobile-responsive-shell](../../screens/018-scr-mobile-responsive-shell.md) | [002-wire-chat-chrome](002-wire-chat-chrome.md) | 004, 018 |
| **017, 019–020** | [017-scr-login-signup-polish](017-scr-login-signup-polish.md), [019-scr-loading-error-empty-states](019-scr-loading-error-empty-states.md), [020-scr-accessibility-pass](020-scr-accessibility-pass.md) | [024-wire-auth-login-signup](024-wire-auth-login-signup.md) | 017, 019, 020 |

**SCREEN-008** schedule viewing: [`../real-estate/017-scr-schedule-viewing-modal.md`](../real-estate/017-scr-schedule-viewing-modal.md)

---

## Browse pages (implementation-ready 2026-06-04)

| Route | scr | Linear | Status |
|-------|-----|--------|--------|
| `/restaurants` | [venues/008-scr](../../venues/tasks/mvp/wireframes/008-scr-restaurant-listings-map.md) | SAN-490 | Done |
| `/nightlife` | [venues/007-scr](../../venues/tasks/mvp/wireframes/007-scr-nightlife-listings-map.md) | SAN-491 | In Review (browse shipped) |
| `/cafes` | [venues/028-scr](../venues/008-scr-cafes-browse-page.md) | SAN-519 | Not Started (sidebar greyed) |
| `/rentals` | [real-estate/REAL-011](../real-estate/009-scr-rentals-browse-page.md) | SAN-478 | Not Started (redirect today) |
| `/events` | [SCREEN-027](../../screens/SCREEN-027-events-browse.md) | SAN-518 | Not Started (no route; sidebar greyed) |
| `/host/events` | [EVP-014-core](../../events/tasks/MVP/EVP-014-core-host-events-list-page.md) | SAN-118 | Done |

---

## Deferred wires (no scr yet)

[010-wire-bookings-inbox](../trips/010-wire-bookings-inbox.md) · [016-wire-explore-unified](../trips/016-wire-explore-unified.md) · [023-wire-onboarding-wizard](../trips/023-wire-onboarding-wizard.md) · [025-wire-notifications](025-wire-notifications.md)

*WIRE-015 rentals browse now paired — see REAL-011 scr.*

---

*Last updated: 2026-06-05 — Explore sidebar audit; `/events` browse spec added*
