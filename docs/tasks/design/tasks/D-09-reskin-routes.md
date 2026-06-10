---
id: D-09
linear: SAN-575
phase: 3
status: Blocked
blocked_by: [D-07, D-08, D-01, D-05]
outputs:
  - Re-skinned /restaurants, /nightlife, /rentals, /cafes
---

# D-09 — Re-skin discovery routes (skin-only)

## Purpose

Apply D-05 pattern + D-08 components to **existing routes** — no new `/explore`.

## Route order (functional owner first)

| Route | Track A owner | Design action |
|-------|---------------|---------------|
| `/restaurants` | SAN-490 Done | Re-skin first |
| `/nightlife` | SAN-491 | Re-skin |
| `/rentals` | SAN-478 | Re-skin **after** functional browse |
| `/cafes` | SAN-519 | Re-skin **after** functional browse |

## Acceptance criteria

- [ ] Each route uses `<BrowseLayout>` + `<VenueCard>`
- [ ] Vertical accent per D-02; no hardcoded `gray-*`
- [ ] CopilotKit v1 only; no chat/agent changes in this task
- [ ] Attach spec as **input** to SAN-490/491/478/519 — do not duplicate issues

## Wireframe / spec references

- [`../pages/restaurants.md`](../pages/restaurants.md)
- [`../pages/nightlife.md`](../pages/nightlife.md)
- [`../pages/cafes.md`](../pages/cafes.md)
- [`../wireframes/screens/INDEX.md`](../wireframes/screens/INDEX.md) browse table

## Proof

Playwright journey per vertical · evidence under `tasks/testing/evidence/`
