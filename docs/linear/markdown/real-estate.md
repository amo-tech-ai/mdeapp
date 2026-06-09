# 🏠 Real Estate — RE task tracker
> Spec pack: [`docs/tasks/real-estate/`](../../tasks/real-estate/tasks/INDEX.md) · PRD: [`real-estate-prd.md`](../../tasks/real-estate/real-estate-prd.md) · Updated: 2026-06-09 · Canonical: `mvp.md` § Rental Cards MVP + `ADV.md` § RE Browse

**Legend:** 🟢 Complete · 🟡 In Progress · ⚪ Not Started · — No dedicated SAN (bundled)

**Persona:** Camila — chat search → cards → schedule viewing → lead in DB

---

## Spec → Linear → markdown (RE-001–020)

| Status | Spec | Linear | Title | Tracker |
|--------|------|--------|-------|---------|
| ⚪ | RE-001 | [SAN-467](https://linear.app/sanjiovani/issue/SAN-467) | Supabase schema audit — rentals cluster | mvp.md |
| ⚪ | RE-002 | [SAN-468](https://linear.app/sanjiovani/issue/SAN-468) | Apartment inventory quality | mvp.md |
| ⚪ | RE-003 | [SAN-469](https://linear.app/sanjiovani/issue/SAN-469) | Rental search indexes (price_daily) | mvp.md |
| 🔴 | RE-003 | [SAN-470](https://linear.app/sanjiovani/issue/SAN-470) | Rental search indexes (dup REAL-003) | mvp.md · Dup: **SAN-469** ✅ |
| 🟡 | RE-004 | [SAN-471](https://linear.app/sanjiovani/issue/SAN-471) | Rental cards in chat (SCREEN-005) | mvp.md |
| ⚪ | RE-005 | [SAN-472](https://linear.app/sanjiovani/issue/SAN-472) | Map pin sync with rental cards | mvp.md |
| 🟡 | RE-006 | [SAN-473](https://linear.app/sanjiovani/issue/SAN-473) | Schedule viewing modal (SCREEN-008) | mvp.md |
| ⚪ | RE-007 | [SAN-474](https://linear.app/sanjiovani/issue/SAN-474) | Lead capture edge proof (G2) | mvp.md · also [SAN-557](https://linear.app/sanjiovani/issue/SAN-557) CW-5 |
| ⚪ | RE-008 | [SAN-475](https://linear.app/sanjiovani/issue/SAN-475) | Landlord inbox MVP | mvp.md |
| ⚪ | RE-009 | [SAN-476](https://linear.app/sanjiovani/issue/SAN-476) | Showing bridge (leads → showings) | mvp.md |
| ⚪ | RE-010 | [SAN-477](https://linear.app/sanjiovani/issue/SAN-477) | Saved + trips integration | mvp.md · [SAN-279](https://linear.app/sanjiovani/issue/SAN-279) trips |
| 🟢 | RE-011 | [SAN-478](https://linear.app/sanjiovani/issue/SAN-478) | Rental browse page `/rentals` | mvp.md |
| ⚪ | RE-012 | [SAN-479](https://linear.app/sanjiovani/issue/SAN-479) | Rental detail `/rentals/[id]` | ADV.md |
| ⚪ | RE-013 | [SAN-480](https://linear.app/sanjiovani/issue/SAN-480) | Rental application wizard | ADV.md |
| ⚪ | RE-014 | [SAN-481](https://linear.app/sanjiovani/issue/SAN-481) | Booking + payment prep (rental Stripe) | ADV.md |
| ⚪ | RE-015 | [SAN-482](https://linear.app/sanjiovani/issue/SAN-482) | Playwright + RLS tests | mvp.md |
| ⚪ | RE-016 | [SAN-483](https://linear.app/sanjiovani/issue/SAN-483) | Production smoke + floor | mvp.md |
| ⚪ | RE-017 | [SAN-484](https://linear.app/sanjiovani/issue/SAN-484) | Rental parser intelligence | mvp.md |
| ⚪ | RE-018 | [SAN-485](https://linear.app/sanjiovani/issue/SAN-485) | Gemini rental clarify routing | mvp.md · related [SAN-407](https://linear.app/sanjiovani/issue/SAN-407) |
| ⚪ | RE-019 | [SAN-486](https://linear.app/sanjiovani/issue/SAN-486) | Availability + date filters | mvp.md |
| ⚪ | RE-020 | [SAN-487](https://linear.app/sanjiovani/issue/SAN-487) | Rental preference memory (pgvector) | ADV.md |

## Related (not RE-* prefix)

| Linear | Title | Tie |
|--------|-------|-----|
| [SAN-545](https://linear.app/sanjiovani/issue/SAN-545) | Fix rental embed API 403 | Hybrid search blocker |
| [SAN-386](https://linear.app/sanjiovani/issue/SAN-386) | SEARCH-001 rental hybrid | MIS / data pack |
| [SAN-562](https://linear.app/sanjiovani/issue/SAN-562) | C4/C8 metered rental leads | Revenue overlap · ADV |
| [SAN-746](https://linear.app/sanjiovani/issue/SAN-746) | rentalLeadWorkflow | Mastra · ADV |

## Hygiene

| Issue | Action |
|-------|--------|
| ~~SAN-469 / SAN-470~~ | ✅ SAN-470 dup of SAN-469 (2026-06-09) · full RE-003 spec on SAN-469 |
| SAN-407 / SAN-485 | Clarify bypass — coordinate RE-017/018 |
| F24 / F41 | Covered by RE-004 / RE-011 — no separate SAN |
