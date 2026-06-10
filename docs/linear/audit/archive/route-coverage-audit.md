# Route-to-issue coverage audit

**Date:** 2026-06-09  
**Sitemap:** [`/home/sk/mdeai/sitemap.md`](../../../sitemap.md)  
**Method:** Route status from sitemap ↔ Linear SAN crosswalk

---

## MVP / shell routes (audit table)

| Route | Issue | Owner SAN | Status | Gap |
|-------|-------|-----------|--------|-----|
| `/chat` | ✅ | SAN-733, SAN-822 | 733 Done | SAN-546 matrix · SAN-831 sprint exit |
| `/events` | ✅ | SAN-518, SAN-586 | Live | Browse OK |
| `/events/[slug]` | ✅ | SAN-237, **SAN-135**, **SAN-731** | 135 In Review | Skeleton SAN-731 · PAY SAN-178 |
| `/venues` | — | *N/A* | — | **No `/venues` route** — use `/restaurants` `/nightlife` `/cafes` |
| `/restaurants` | ✅ | SAN-490 | Done | — |
| `/nightlife` | ✅ | SAN-491 | Done | — |
| `/cafes` | ✅ | SAN-519 | Backlog | Page polish |
| `/rentals` | ✅ | SAN-478 | Todo | P0 catalog |
| `/saved` | 🟡 | SAN-253, TRIP | Done | No SAVED-* row |
| `/trips` | ✅ | TRIP-001–019 | Shell | Workspace incomplete |
| `/host/events` | ✅ | SAN-118, SAN-366 | Done | G3 met |
| `/host/event/new` | ✅ | EVP-010 | Live | — |
| `/host/analytics` | 🟡 | **SAN-730** (nav), AIE-008+ | Backlog | **Route not in sitemap** — wireframe 008-host-dashboard · post-launch |
| `/admin/events` | ❌ | — | POST | W8 Patricia — no issue yet |

---

## Additional launch-critical routes

| Route | Status | Issue | Gap |
|-------|--------|-------|-----|
| `/` | ✅ LIVE | SAN-733 handoff | Home → chat `?q=` Done |
| `/events` | ✅ LIVE | SAN-518, SAN-586 | — |
| `/events/[slug]` | ✅ LIVE | EVP + SAN-586 | Checkout shell — SAN-178 |
| `/me/tickets` | ✅ LIVE | SAN-259 UIX-031 In Review | Wallet UI — payment proof SAN-178 |
| `/login` `/signup` | ✅ LIVE | Core auth | Polish only |

---

## API routes (sample)

| API | Status | Issue |
|-----|--------|-------|
| `/api/copilotkit` | ✅ LIVE | F13 SAN-548 |
| `/api/events/search` | ✅ LIVE | SAN-586 |
| `/api/rentals/search` | ✅ LIVE | RE cluster |
| `/api/places/detail` | ✅ LIVE | DATA-008 SAN-338 |

---

## Gaps found

| Gap | Severity | Recommended issue |
|-----|----------|-------------------|
| `/rentals` still redirects to `/chat` | 🔴 P0 | SAN-478 — prioritize Cycle 1 |
| `/trips` shell only | 🟡 P1 | TRIP-004+ workspace — post north-star |
| `/saved` no dedicated tracker row | 🟢 | Add SAVED-001 stub or footnote in `trips.md` |
| `/admin/events` no issue | 🟢 | POST — create at W8 with Patricia epic |
| Booking checkout overlay shell | 🔴 | SAN-178 PAY-001 |

---

## Actions

1. Elevate **SAN-478** in CHAT/rentals sprint — Camila catalog P0
2. Link `/me/tickets` proof to **SAN-178** acceptance criteria
3. Add `/saved` row to `trips.md` or `ux.md` (SAN-253 reference)
4. Re-audit after sitemap.md update when `/rentals` ships
