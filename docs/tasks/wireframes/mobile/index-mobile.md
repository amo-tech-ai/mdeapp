---
title: MDEAI Mobile Task Index
updated: 2026-06-02
owner: sanjiovani
plan: mobile-plan.md
---

# MDEAI Mobile Task Index

> **Strategy:** [mobile-plan.md](mobile-plan.md) · **Skills:** `tailwind-responsive-ui` · `responsive-design` · `mde-maps` · `copilotkit`
>
> **Mobile readiness: ~40%.** M1 (shell) 🟡 In Progress — disk components exist, Playwright 8/8 and viewport export outstanding. M2–M4 are MVP-blocking. M5 is Phase 2.

## Status key

| Symbol | Meaning |
|---|---|
| ✅ | Done — shipped and evidenced |
| 🟡 | In Progress |
| ⚪ | Not Started |
| ⛔ | Blocked |

---

## M1 — Shell Foundation 🟡 In Progress

| ID | Task | File | Status | Priority | Effort | Route |
|---|---|---|---|---|---|---|
| SCREEN-018 | Mobile Responsive 3-Panel Shell | [018-scr-mobile-responsive-shell.md](018-scr-mobile-responsive-shell.md) | 🟡 In Progress | P0 | 3–4h | `/` |

**Delivers:** Nav drawer, map FAB, bottom sheet, safe areas, dvh heights, reduced-motion.

**Outstanding before Done:** `viewportFit: "cover"` in `layout.tsx`, FAB safe-area offset, `85dvh` sheet height, Playwright 8/8 green, evidence file.

---

## M1.5 — CopilotKit Mobile Baseline (MVP P0)

| ID | Task | File | Status | Priority | Effort | Route |
|---|---|---|---|---|---|---|
| MOB-CK-001 | CopilotKit v1 Mobile Best Practices | [mob-ck-001-copilotkit-mobile-best-practices.md](mob-ck-001-copilotkit-mobile-best-practices.md) | 🟡 Partially Done | P0 | 1h | `/` |

**Delivers:** iOS zoom prevention, 44px send button, safe-area padding, prefers-reduced-motion, enterKeyHint, auto-grow textarea, viewportFit cover.

---

## M2 — Chat + AI UX (MVP P0)

| ID | Task | File | Status | Priority | Effort | Route |
|---|---|---|---|---|---|---|
| MOB-CHAT-001 | Mobile Chat Composer + Keyboard UX | [mob-chat-001-mobile-chat-composer.md](mob-chat-001-mobile-chat-composer.md) | ⚪ | P0 | 2h | `/` |
| AIM-010 | Mobile AI Concierge UX | [aim-010-mobile-ai-ux.md](aim-010-mobile-ai-ux.md) | ⚪ | P1 | 2h | `/` |

**Delivers:** Sticky composer above iOS keyboard, textarea growth limits, quick-action chips, streaming skeleton, location context.

**Blocks:** M4 (PAY-005 checkout depends on working composer), M5 (PERF-001 needs features first)

---

## M3 — Maps + Discovery (MVP P0)

| ID | Task | File | Status | Priority | Effort | Route |
|---|---|---|---|---|---|---|
| MAP-011 | Mobile Map Interaction System | [map-011-mobile-map-system.md](map-011-mobile-map-system.md) | ⚪ | P0 | 4h | `/` |
| MOB-CARD-001 | Mobile Card System | [mob-card-001-mobile-card-system.md](mob-card-001-mobile-card-system.md) | ⚪ | P1 | 3h | `/` |

**Delivers:** Pinch-zoom without scroll conflict, marker tap detail sheet, bottom sheet snap points, card carousels, touch-sized CTAs.

---

## M4 — Booking + Auth (MVP P0)

| ID | Task | File | Status | Priority | Effort | Route |
|---|---|---|---|---|---|---|
| PAY-005 | Mobile Checkout UX | [pay-005-mobile-checkout.md](pay-005-mobile-checkout.md) | ⚪ | P0 | 4h | `/events/[slug]` + `/me/tickets` |
| AUTH-006 | Mobile Auth Stability | [auth-006-mobile-auth.md](auth-006-mobile-auth.md) | ⚪ | P1 | 3h | `/login` + `/signup` |

**Delivers:** Stripe Elements on mobile, Apple Pay / Google Pay buttons, QR ticket at 390px, Google OAuth on Safari, PKCE flow, magic link deep-links.

---

## M5 — Performance + PWA + A11Y (Phase 2)

| ID | Task | File | Status | Priority | Effort | Route |
|---|---|---|---|---|---|---|
| PERF-001 | Mobile Performance Optimization | [perf-001-mobile-performance.md](perf-001-mobile-performance.md) | ⚪ | P1 | 5h | All |
| PWA-001 | Mobile Install Experience | [pwa-001-mobile-install.md](pwa-001-mobile-install.md) | ⚪ | P1 | 4h | All |
| A11Y-001 | Mobile Accessibility Audit | [a11y-001-mobile-accessibility.md](a11y-001-mobile-accessibility.md) | ⚪ | P2 | 4h | All |

**Delivers:** LCP < 2.5s, Lighthouse ≥ 80, add-to-homescreen prompt, offline fallback, VoiceOver/TalkBack usable.

---

## Playwright spec map

| Spec file | Task | Viewports |
|---|---|---|
| `e2e/screens/SCREEN-018-mobile-shell.spec.ts` | SCREEN-018 🟡 (exists, 3/8 pass) | 390×844 + 1280×900 |
| `e2e/screens/MOB-CHAT-001-mobile-chat-composer.spec.ts` | MOB-CHAT-001 (planned) | 390×844, 375×667, 412×915 |
| `e2e/screens/MAP-011-mobile-map.spec.ts` | MAP-011 (planned) | 390×844 + 1280×900 |
| `e2e/screens/MOB-CARD-001-mobile-cards.spec.ts` | MOB-CARD-001 (planned) | 390×844, 768×1024 |
| `e2e/screens/PAY-005-mobile-checkout.spec.ts` | PAY-005 | 390×844 |
| `e2e/screens/AUTH-006-mobile-auth.spec.ts` | AUTH-006 | 390×844 |
| `e2e/screens/AIM-010-mobile-ai.spec.ts` | AIM-010 | 390×844 |
| `e2e/perf/PERF-001-mobile-performance.spec.ts` | PERF-001 | 390×844 (throttled) |
| `e2e/pwa/PWA-001-install.spec.ts` | PWA-001 | 390×844 |
| `e2e/a11y/A11Y-001-mobile-accessibility.spec.ts` | A11Y-001 | 390×844 |

---

## Critical path to MVP mobile parity

```
SCREEN-018 🟡 → MOB-CHAT-001 → MAP-011 → PAY-005 → MVP mobile launch
                          ↘            ↗
                        MOB-CARD-001
                          ↘
                         AIM-010
                          ↘
                        AUTH-006 → PWA-001
                               ↘
                             PERF-001 → A11Y-001
```

---

## Mobile design standards (quick ref)

| Standard | Value |
|---|---|
| Min touch target | 44×44px |
| Composer font-size (iOS zoom prevention) | ≥ 16px |
| Mobile breakpoint | `< 768px` (no prefix in Tailwind v4) |
| Tablet breakpoint | `md:` = 768px+ |
| Desktop breakpoint | `lg:` = 1024px+ |
| Viewport height unit | `dvh` not `vh` |
| Bottom safe area | `env(safe-area-inset-bottom, 0px)` |
| Reduced motion | `prefers-reduced-motion: reduce` → `transition: none` |
| Color token standard | oklch via CSS custom properties — no hardcoded gray shades |
| Map gesture | `gestureHandling: "greedy"` on all map instances |
