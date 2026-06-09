---
id: D-10
linear: SAN-576
phase: 3
status: Blocked
blocked_by: [D-06, D-07, D-08]
outputs:
  - Re-skinned /saved, /trips, /me/tickets
---

# D-10 — Re-skin dashboard (post-MVP polish)

## Purpose

Apply D-06 dashboard wireframe to life-management routes — **must not block MVP revenue**.

## Acceptance criteria

- [ ] `/saved`, `/trips`, `/me/tickets` use D-06 zones + D-07 sidebar/tabs where applicable
- [ ] `SidebarProvider` from shadcn wired here (not D-07)
- [ ] Shell-only — no new booking DB scope

## Wireframe / spec references

- [`../wireframe/dashboard-wireframe.html`](../wireframe/dashboard-wireframe.html)
- [`../wireframes/trips/012-scr-trips-dashboard.md`](../wireframes/trips/012-scr-trips-dashboard.md)
- [`../wireframes/trips/014-scr-saved-collections-page.md`](../wireframes/trips/014-scr-saved-collections-page.md)

## Legacy / dedup

- **Extend:** SAN-255, SAN-259, SAN-253, SAN-251

## Proof

localhost routes 200 · visual screenshot · no regression on ticket wallet QR
