---
id: D-13
linear: SAN-579
phase: 3
status: Ready
blocked_by: []
outputs:
  - Re-skinned /
---

# D-13 — Re-skin Home `/`

## Purpose

Build `/` from 14-band `home-wireframe.html` using D-08 cards where browse entry appears.

## Acceptance criteria

- [x] 14 scroll bands implemented per wireframe annotations
      — Band 11 (Testimonials) formally deferred: no user base yet, impossible to populate.
        Replaced with HomePressLogos (Mindtrip parity). Revisit post-launch when reviews exist.
- [x] Reuse shipped chat chrome (SAN-232) — extend, don't rewrite nav
- [ ] ⌘K `CommandDialog` optional slice using D-07 `command` primitive
- [x] Browse entry row (5 verticals) per README §2D

## Wireframe / spec references

- [`../wireframe/home-wireframe.html`](../wireframe/home-wireframe.html) **primary**
- [`../wireframes/screens/001-scr-home-chat-chrome.md`](../wireframes/screens/001-scr-home-chat-chrome.md)
- [`../wireframes/screens/001-wire-home-chat.md`](../wireframes/screens/001-wire-home-chat.md)

## Legacy / dedup

- **Reuse:** SAN-232 Done

## Proof

localhost `/` · prod Tier-2 matrix · screenshot evidence
