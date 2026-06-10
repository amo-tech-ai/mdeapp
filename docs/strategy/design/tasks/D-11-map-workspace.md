---
id: D-11
linear: SAN-577
phase: 3
status: Blocked
blocked_by: [D-08, D-09]
outputs:
  - Map ↔ card sync on browse + /chat
---

# D-11 — Map workspace (pins ↔ cards)

## Purpose

Mindtrip-class living map: pins synced to cards, hover↔pin parity, embedded in Explore routes + `/chat`.

## Acceptance criteria

- [ ] `<AdvancedMarker>` only with `mapId` on parent `<Map>`
- [ ] `X-Goog-FieldMask` on every Places call
- [ ] Card hover highlights pin; pin click scrolls card
- [ ] No duplicate pin sets (LESSONS MAP rules)

## Wireframe / spec references

- [`../wireframes/03-chat-maps-workspace.md`](../wireframes/03-chat-maps-workspace.md)
- [`../wireframes/ux/UX-024-hover-pin-parity.md`](../wireframes/ux/UX-024-hover-pin-parity.md)
- [`../wireframes/mobile/map-011-mobile-map-system.md`](../wireframes/mobile/map-011-mobile-map-system.md)

## Legacy / dedup

- Supersedes SAN-247 Map Exploration Panel intent

## Proof

Browser: cards + pins on map panel · Playwright map-panel testids
