Done. [Core Foundation](https://linear.app/sanjiovani/project/core-foundation-3a69b76c57ca/issues) now has **21 issues** with `track:core` applied (label already existed; it was just unused).

## Criteria used

Per the Core Foundation project scope — auth, Supabase security, Vercel/env, CI/floor, smoke tests, Stripe secrets, maps prod keys, intelligence CORE (INT-001–005) — **not** feature screens, venue seeds, or discovery maps work.

## What moved → Core Foundation + `track:core`

| Bucket | Issues |
|--------|--------|
| **Auth** | SAN-367 AUTH-011, SAN-112 UX-012 (login/signup) |
| **Ops / CI** | SAN-100 OPS-002, SAN-462 OPS-001, SAN-322 UX-034 (nightly synthetic), SAN-458 PR-16, SAN-460 PR-18, SAN-459 PR-17 |
| **Payments** | SAN-178 PAY-001, SAN-116 PAY-003 |
| **Maps prod gates** | SAN-368 MAP-002B, SAN-369 MAP-008B |
| **Supabase hardening** | SAN-339 DATA-010, SAN-340 DATA-011 |
| **Intelligence CORE** | SAN-404–408 INT-001–005 |
| **Platform F-tasks** | SAN-95 SYS-001 (F20), SAN-96 SYS-002 (F21A) |

## What stayed out (by design)

| Project / view | Why not core |
|----------------|--------------|
| **DATA view** (`track:data`) | DATA-001–008 = venue catalog/seeds; DATA-012+ = domain inventories — product data, not engine room |
| **Screens** | UI surfaces (SCREEN-*, wireframes) except auth login |
| **Discovery Platform** | MAP features (nearby search, places proxy, etc.) — only prod env verify gates are core |
| **Platform Infra** | VEB-*, AUT-*, OpenClaw, contest SYS-* — post-MVP or domain features |
| **SAN-97/98/99** | Component ports (hero photos, RestaurantCard, OnboardingLayout) — P1 polish, not foundation |

## Cleanup

Marked duplicates in Discovery Platform:
- SAN-463 → duplicate of SAN-368 (MAP-002B)
- SAN-464 → duplicate of SAN-369 (MAP-008B)

## Suggested view

Create a saved view: `label:track:core` or `project:"Core Foundation"` — gives you the engine-room queue separate from [DATA](https://linear.app/sanjiovani/view/data-54425dec37b9), [Screens](https://linear.app/sanjiovani/project/screens-c954b41b2344/issues), and [Discovery](https://linear.app/sanjiovani/project/discovery-platform-23d24b177348/issues).

**Gap:** AUTH-005 (Playwright auth e2e) is on disk in `tasks/data/auth/` but has no Linear issue yet — want me to create it in Core Foundation?