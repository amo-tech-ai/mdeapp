# Events — group 003

**Index:** [`INDEX.md`](INDEX.md) · **Pairing verify:** `node scripts/verify-scr-wire-pairing.mjs`

File prefix **`003`** = buyer discovery + public detail. **`004`** = Roberto host wizard (separate persona/path). Legacy **`SCREEN-*`** IDs stay for e2e and Linear.

---

## Flow (Andrés / Tourist — buyer)

```text
/ chat
  └─ 003-scr-event-card-polish (SCREEN-006)
       wire: 003-wire-event-discovery
       search-events → EventCard + map pins
            │
            ├─ [Buy tickets] → /events/[slug] or in-chat checkout
            ├─ [Details]     → [006-scr venue sheet](../../venues/006-scr-venue-detail-sheet.md) (SCREEN-007)
            └─ shareable link ──► 003-scr-event-detail-page (SCREEN-014)
                                     wire: 003-wire-event-detail-page
                                          └─ [Buy] → [010-scr checkout](../../trips/010-scr-booking-checkout-modal.md) (SCREEN-009)
```

## Flow (Roberto — host)

```text
/host/event/new
  └─ 004-scr-host-event-wizard (SCREEN-016)
       wire: 004-wire-host-event-wizard
       hostEventAgent + HITL publish
            └─ live at /events/[slug] (feeds buyer flow above)
```

---

## Spec ↔ wire pairing

| File | Legacy ID | Persona | Path | Wire | Status |
|------|-----------|---------|------|------|--------|
| [003-scr-event-card-polish](003-scr-event-card-polish.md) | SCREEN-006 | Andrés, Tourist | `/` in-thread | [003-wire-event-discovery](003-wire-event-discovery.md) | Done |
| [003-scr-event-detail-page](003-scr-event-detail-page.md) | SCREEN-014 | Andrés | `/events/[slug]` | [003-wire-event-detail-page](003-wire-event-detail-page.md) | Done |
| [004-scr-host-event-wizard](004-scr-host-event-wizard.md) | SCREEN-016 | Roberto | `/host/event/new` | [004-wire-host-event-wizard](004-wire-host-event-wizard.md) | Done (UI); manual publish QA open |
| [015-scr-my-tickets-qr](015-scr-my-tickets-qr.md) | SCREEN-015 | Andrés | `/me/tickets` | [015-wire-my-tickets-qr](015-wire-my-tickets-qr.md) | Done |

**Not in group 003:** venue overlay → [006-scr-venue-detail-sheet](../../venues/006-scr-venue-detail-sheet.md) · checkout → [010-scr-booking-checkout-modal](../../trips/010-scr-booking-checkout-modal.md) · **015** tickets → [015-scr-my-tickets-qr](015-scr-my-tickets-qr.md) (same folder)

---

## Disk targets (shipped)

| Surface | Key files |
|---------|-----------|
| EventCard | `mdeapp/src/components/copilot/event-card.tsx`, `search-tool-renders.tsx` |
| Event detail | `mdeapp/src/app/events/[slug]/page.tsx`, `event-detail-view.tsx` |
| Host wizard | `mdeapp/src/app/host/event/new/page.tsx`, `host-event-shell.tsx` |

## Evidence

- [`../evidence/SCREEN-006-evidence.md`](../evidence/SCREEN-006-evidence.md)
- [`../evidence/SCREEN-014-evidence.md`](../evidence/SCREEN-014-evidence.md)
- [`../evidence/SCREEN-016-evidence.md`](../evidence/SCREEN-016-evidence.md)

*Last updated: 2026-05-27*
