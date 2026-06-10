---
id: D-14
linear: SAN-580
phase: 4
status: Blocked
blocked_by: [D-09, D-10, D-11, D-12, D-13]
outputs:
  - Responsive + a11y + states proof on all re-skinned surfaces
---

# D-14 — Polish + proof

## Purpose

Final quality gate on Track B surfaces: responsive, WCAG AA, loading/empty/error, motion.

## Acceptance criteria

- [ ] `prefers-reduced-motion` on all new animations
- [ ] Loading / empty / error states per [`../wireframes/screens/019-scr-loading-error-empty-states.md`](../wireframes/screens/019-scr-loading-error-empty-states.md)
- [ ] A11y pass extends SAN-268 to re-skinned routes only
- [ ] Playwright e2e for core verticals + mobile viewports
- [ ] Evidence: `tasks/testing/evidence/YYYY-MM-DD/d-14-polish-RESULTS.md`

## Wireframe / spec references

- [`../wireframes/screens/SCREEN-TESTING-STANDARD.md`](../wireframes/screens/SCREEN-TESTING-STANDARD.md)
- [`../wireframes/screens/020-scr-accessibility-pass.md`](../wireframes/screens/020-scr-accessibility-pass.md)
- [`../wireframes/mobile/a11y-001-mobile-accessibility.md`](../wireframes/mobile/a11y-001-mobile-accessibility.md)

## Legacy / dedup

- **Extend** SAN-265, SAN-268 (MVP polish closed — apply to new skin only)

## Proof

`npm run floor` (CI) · Playwright prod synthetic · a11y snapshot · mobile screenshots
