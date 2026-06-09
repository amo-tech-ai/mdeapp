# Screen ↔ wireframe pairing checklist

**Rule:** File prefix `NNN` is **not** a pair key. Always use frontmatter `wireframes:` / `screens:` or the domain INDEX below.

**Verify command** (bidirectional frontmatter, all domain folders):

```bash
node scripts/verify-scr-wire-pairing.mjs
```

*Last verified: 2026-05-27*

---

## Domain folders (authoritative lists)

| Domain | INDEX |
|--------|-------|
| Platform shell | [`INDEX.md`](INDEX.md) |
| Events | [`../events/wireframes/INDEX.md`](../events/wireframes/INDEX.md) |
| Venues | [`../venues/INDEX.md`](../venues/INDEX.md) |
| Trips | [`../trips/INDEX.md`](../trips/INDEX.md) |
| Maps | [`../maps/wireframes/INDEX.md`](../maps/wireframes/INDEX.md) |
| Real estate | [`../real-estate/INDEX.md`](../real-estate/INDEX.md) |

Hub: [`INDEX.md`](INDEX.md) · master: [`../INDEX.md`](../INDEX.md)

---

## ⚠️ Same prefix ≠ related

| scr | wire (same prefix) | Related? | Actual wire for scr |
|-----|-------------------|----------|---------------------|
| `002-scr-chat-nav-rail` | `009-wire-rental-search` | **NO** | `002-wire-chat-chrome` |
| `017-scr-workflow-progress-strip` | `006-wire-venue-detail` | **NO** | `002-wire-chat-chrome` + `009-wire-rental-search` |
| `006-scr-venue-detail-sheet` | `014-wire-saved-collections` | **NO** | `006-wire-venue-detail` |
| `011-scr-map-exploration-panel` | `010-wire-nightlife-explorer` | **NO** | `011-wire-map-exploration` |
| `003-scr-event-detail-page` | `002-wire-chat-chrome` | **NO** | `003-wire-event-detail-page` |
| `015-scr-my-tickets-qr` | `009-wire-rentals-browse` | **NO** | `015-wire-my-tickets-qr` |
| `004-scr-host-event-wizard` | `016-wire-explore-unified` | **NO** | `004-wire-host-event-wizard` |
| `017-scr-login-signup-polish` | `012-wire-trips-dashboard` | **NO** | `024-wire-auth-login-signup` |
| `018-scr-mobile-responsive-shell` | `012-wire-trip-workspace` | **NO** | `002-wire-chat-chrome` |
| `005-scr-cafe-*` (venues/cafes/) | `005-wire-cafe-*` | **YES** | (prefix aligns) |

---

## Checklist — every screen spec (scr)

> Full tables live in each domain INDEX. Run `verify-scr-wire-pairing.mjs` for ground truth.

| Legacy ID | Domain | scr |
|-----------|--------|-----|
| SCREEN-001–004, 018 | `tasks/screens/` | 001, 002, 017-workflow, 018 |
| SCREEN-005 | `tasks/real-estate/` | [009-scr-rental-card-polish](../real-estate/009-scr-rental-card-polish.md) |
| SCREEN-006, 014, 015, 016 | `tasks/events/wireframes/` | 003-scr ×2, 015-scr, 004-scr |
| SCREEN-007–008, 021–023 | `tasks/venues/` | 006-scr, 005/007/008 |
| SCREEN-009–013 | `tasks/trips/` | 010, 012, 013, 014 |
| SCREEN-010 | `tasks/maps/wireframes/` | [011-scr-map-exploration-panel](../maps/wireframes/011-scr-map-exploration-panel.md) |
| SCREEN-017, 019–020 | `tasks/screens/` | 017-login, 019, 020 |

**Subtask (no wire):** [CAFE-001-booking-requests-schema](../venues/CAFE-001-booking-requests-schema.md)

---

## Checklist — every wireframe (wire)

See domain INDEX files above. Deferred / unpaired wires remain under `tasks/screens/` (016, 018–020, 023, 025) and domain folders (009-rentals-browse, 010-bookings-inbox, 007-nightlife-explorer stub).

## Your example: 002-scr vs 009-wire

```
002-scr-chat-nav-rail.md     →  SCREEN-002  →  left nav + thread list
009-wire-rental-search.md    →  WIRE-002    →  rental cards in chat thread  (real-estate/)
```

**Not related.** Same numeric prefix in legacy WIRE-002 vs file group 009 is intentional mess — trust frontmatter.

| | 002-scr | 009-wire-rental-search |
|---|---------|----------|
| **What** | Nav rail + threads | Rental search results UI |
| **Persona focus** | Camila — resume chats | Camila — apartment cards |
| **Paired with** | `002-wire-chat-chrome` | `009-scr-rental-card-polish` (+ workflow scr) |
| **Component area** | Left column | Center thread / generative UI |

When implementing **SCREEN-002**, open **`002-wire-chat-chrome.md`** (nav section), not `009-wire-rental-search.md`.

When implementing **SCREEN-005** (rental cards), open **`009-wire-rental-search.md`** in `tasks/real-estate/`.

## Frontmatter contract

**scr file:**

```yaml
wireframes:
  - 002-wire-chat-chrome.md   # primary or shared
primary_wire: 002-wire-chat-chrome.md   # optional but recommended when prefix ≠ wire #
```

**wire file:**

```yaml
screens:
  - 002-scr-chat-nav-rail.md
screen_ids:
  - SCREEN-002
```

Both directions must list each other (except cross-cutting scr with `wireframes: []`).

---

## Related docs

- [INDEX.md](INDEX.md) — platform shell hub + domain routing
- [`../INDEX.md`](../INDEX.md) — master task index
