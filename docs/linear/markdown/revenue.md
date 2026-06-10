# 💰 Revenue — C/M/CW task tracker
> Spec pack: [`docs/tasks/revenue/`](../../tasks/revenue/INDEX-revenue.md) · Linear log: [`LINEAR-REVENUE.md`](../../tasks/revenue/LINEAR-REVENUE.md) · Updated: 2026-06-09 · Gate: PAY-001 + EVT-001 + MAP-002B + AUTH-011

**Legend:** 🟢 Imported · ⚪ Backlog in Linear · — Not filed yet · 🔴 Canceled dup

**MVP-exit gate:** [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) · [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) · [SAN-368](https://linear.app/sanjiovani/issue/SAN-368)

---

## R1 — First revenue sprint (imported 2026-06-05)

| Status | Task | Linear | Title | Tracker |
|--------|------|--------|-------|---------|
| ⚪ | C13 | [SAN-550](https://linear.app/sanjiovani/issue/SAN-550) | Agent cleanup (ping/router/evaluation) | ADV.md |
| ⚪ | C1 | [SAN-552](https://linear.app/sanjiovani/issue/SAN-552) | Agency agent + /advertise Agency section | ADV.md |
| ⚪ | C2 | [SAN-551](https://linear.app/sanjiovani/issue/SAN-551) | create_checkout tool + checkout widget | ADV.md · 🔴 dup SAN-564 canceled |

## CW — Chatwoot prerequisite (imported)

| Status | Task | Linear | Title | Tracker |
|--------|------|--------|-------|---------|
| ⚪ | CW-1 | [SAN-553](https://linear.app/sanjiovani/issue/SAN-553) | Deploy Chatwoot on Hetzner | ADV.md § Integrations |
| ⚪ | CW-2 | [SAN-554](https://linear.app/sanjiovani/issue/SAN-554) | WhatsApp Cloud API inbox | ADV.md |
| ⚪ | CW-3 | [SAN-555](https://linear.app/sanjiovani/issue/SAN-555) | /api/chatwoot-bridge Mastra pipeline | ADV.md |
| ⚪ | CW-4 | [SAN-556](https://linear.app/sanjiovani/issue/SAN-556) | Supabase contact/conversation mirror | ADV.md |
| ⚪ | CW-5 | [SAN-557](https://linear.app/sanjiovani/issue/SAN-557) | G2 rental lead capture hook | ADV.md · RE-007 |

## Overlap / defer triage (in Linear, not pilot import)

| Linear | Overlaps | Tracker | Action |
|--------|----------|---------|--------|
| [SAN-563](https://linear.app/sanjiovani/issue/SAN-563) | C2 checkout widget | ADV.md | 🔴 **Duplicate** of SAN-551 (2026-06-09) |
| [SAN-564](https://linear.app/sanjiovani/issue/SAN-564) | C2 create_checkout | mvp.md 🔴 | **Canceled** — dup SAN-551 |
| [SAN-565](https://linear.app/sanjiovani/issue/SAN-565) | C6 Sales Agent | — | Defer R2 import |
| [SAN-559](https://linear.app/sanjiovani/issue/SAN-559) | C10 nightlife VIP | ADV.md | Defer R2 |
| [SAN-560](https://linear.app/sanjiovani/issue/SAN-560) | M7 restaurant reservations | ADV.md | Defer R4 |
| [SAN-561](https://linear.app/sanjiovani/issue/SAN-561) | C14/C15 promo | ADV.md | Defer R2 |
| [SAN-562](https://linear.app/sanjiovani/issue/SAN-562) | C4/C8 rental leads | ADV.md | Defer R3-A |

---

## Not in Linear yet (deferred per LINEAR-REVENUE.md)

| Tier | Tasks | Count | Action |
|------|-------|------:|--------|
| R2 | C11, C3, C12, C6, C15, C9, C10 | 7 | Import after C2 proof |
| R3-A | C4, C5, C8 | 3 | Import after C3 |
| R3-B | C7, C14 | 2 | Blocked on CW-3 |
| R4 | M1–M12 | 12 | Months 3–6 |
| R5 | A1–A10 | 10 | Strategy only — no task files |

---

## Hygiene checklist

- [x] Close SAN-563 as dup of SAN-551 (2026-06-09)
- [ ] Import R2 batch when MVP-exit gate closes
- [ ] C5 `/advertise` Get Listed — separate from C1 Agency section (same route, two sections)
- [ ] Re-export Commerce Platform CSV after next revenue import batch
