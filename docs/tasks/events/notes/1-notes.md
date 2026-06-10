## Events task naming (mandatory)

**Every Events / Events Platform reference uses the full Linear title — never abbreviations.**

```text
SAN-### · SPEC-ID — <full Linear issue title>
```

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| SAN-730 host nav | **SAN-730 · AIE-002 — Enable host navigation rail** |
| SAN-492 schema | **SAN-492 · EVT-033 — Event venue + offerings schema** |
| proof band fix | **SAN-660 · MKT — For Event Hosts landing (/host)** |

Rules:
- Always **SAN-###** + **spec id** (EVT/AIE/UI/UX/EVP/MKT) + **full Linear title**
- Applies to execution order, blockers, PR comments, commits, and chat
- Cross-project issues (SAN-823, SAN-828) still get full titles when listed in Events notes
- After every shipped task → graded entry in [`changelog.md`](../changelog.md) + row update in [`todo.md`](../todo.md)

### Done gate (every Events task)

Cursor rule: [`.cursor/rules/mdeai-done-gate.mdc`](../../.cursor/rules/mdeai-done-gate.mdc)

1. **Name** — full Linear title everywhere
2. **Before code** — pre-verify: skills + MCP + task-verifier → update `todo.md` scores + failure points ([`mdeai-events-pre-impl-verify.mdc`](../../.cursor/rules/mdeai-events-pre-impl-verify.mdc))
3. **After code** — Vitest → Playwright → Browser screenshot → `tasks/testing/evidence/…/SAN-###-RESULTS.md`
4. **Before merge** — cubic/CodeRabbit resolved; floor green
5. **Linear** — In Review with evidence + changelog row; **Done** only after user OK

---

**Linear hygiene is fixed.** Events Platform Todo is down to **7 venue-chain items** (all blocked except **SAN-492 · EVT-033 — Event venue + offerings schema** once upstream gates clear). Blocked cross-cutting work moved to Backlog.

---

## Corrected execution order

```text
GATE (active now — not in venue Todo):
  1. SAN-730 · AIE-002 — Enable host navigation rail                    [PR #135]
  2. SAN-731 · UI-004 — Event detail loading skeleton + hero alt (a11y)
  3. SAN-135 · AIE-024 — MVP Luma event detail layout (EVP-032)

CHAT chain (cross-project, Backlog until unblocked):
  4. SAN-823 · UX-038 — Rentals: hybrid fast-path                        [Real Estate]
  5. SAN-828 · UX-043 — CopilotKit empty-body 401 vs 400 smoke             [Platform Infra]
  6. SAN-824 · UX-039 — Events: pin coverage via upstream coords + geocode gaps
     → Backlog, blockedBy SAN-828 · UX-043

Post-gate Events:
  7. SAN-729 · AIE-008 — /host/analytics + HostOpsCopilotBridge
     → Backlog, blockedBy SAN-730 · AIE-002
  8. SAN-765 · AIE-011 — Venue explorer /venues
     → Backlog, blockedBy SAN-115 · AIE-001 — Production proof ledger (MVP launch gate)

Venue chain (Events Todo — ordered, do not start until blockers Done):
  9.  SAN-492 · EVT-033 — Event venue + offerings schema
  10. SAN-493 · EVT-034 — Seed Mamacita + 5 event partners
  11. SAN-510 · EVT-051 — Wire: Event offerings panel + Event Venue CTA
  12. SAN-511 · EVT-052 — Wire: Request proposal modal
  13. SAN-494 · EVT-035 — Restaurant card Event Venue CTA
  14. SAN-495 · EVT-036 — Event offerings detail panel
  15. SAN-496 · EVT-037 — Request proposal modal (HITL)

Tier 2 (Backlog):
  SAN-512 · EVT-053 — Wire: Venue match panel + compare
    → blockedBy SAN-497 · EVT-038 — EventVenueAgent search/rank tools
  SAN-513 · EVT-054 — Wire: Host wizard venue step
  SAN-514 · EVT-055 — Wire: Admin event booking queue
    → blockedBy SAN-492 · EVT-033 + SAN-496 · EVT-037
  SAN-120 · EVP-016 — Event maps + venue integration (EVT-MVP-03)
    → blockedBy SAN-104 · MAP-010 — Place autocomplete for venue,
      SAN-119 · EVP-015 — Grounded event discovery
  SAN-136 · EVT-018 — Event vibe tags and AI summary
    → blockedBy SAN-135 · AIE-024 — MVP Luma event detail layout
```

---

## Issues moved to Backlog

| Issue | Reason |
|-------|--------|
| SAN-729 · AIE-008 — /host/analytics + HostOpsCopilotBridge | blockedBy SAN-730 · AIE-002 — Enable host navigation rail |
| SAN-765 · AIE-011 — Venue explorer /venues | blockedBy SAN-115 · AIE-001 — Production proof ledger |
| SAN-136 · EVT-018 — Event vibe tags and AI summary | post-MVP; blockedBy SAN-135 · AIE-024 — MVP Luma event detail layout |
| SAN-120 · EVP-016 — Event maps + venue integration | blockedBy SAN-104 · MAP-010, SAN-119 · EVP-015 |
| SAN-824 · UX-039 — Events: pin coverage via upstream coords + geocode gaps | CHAT sprint; blockedBy SAN-828 · UX-043 |
| SAN-512 · EVT-053, SAN-513 · EVT-054, SAN-514 · EVT-055 | Tier 2 wires / prep |

---

## Blockers added (Linear `blockedBy`)

| Issue | blockedBy |
|-------|-----------|
| SAN-729 · AIE-008 — /host/analytics + HostOpsCopilotBridge | SAN-730 · AIE-002 — Enable host navigation rail |
| SAN-765 · AIE-011 — Venue explorer /venues | SAN-115 · AIE-001 — Production proof ledger |
| SAN-136 · EVT-018 — Event vibe tags and AI summary | SAN-135 · AIE-024 — MVP Luma event detail layout |
| SAN-120 · EVP-016 — Event maps + venue integration | SAN-104 · MAP-010, SAN-119 · EVP-015 |
| SAN-493 · EVT-034 — Seed Mamacita + 5 event partners | SAN-492 · EVT-033 — Event venue + offerings schema |
| SAN-494 · EVT-035 — Restaurant card Event Venue CTA | SAN-492 · EVT-033, SAN-493 · EVT-034 |
| SAN-510 · EVT-051 — Wire: Event offerings panel + Event Venue CTA | SAN-492 · EVT-033 |
| SAN-511 · EVT-052 — Wire: Request proposal modal | SAN-492 · EVT-033 |
| SAN-513 · EVT-054 — Wire: Host wizard venue step | SAN-492 · EVT-033 |
| SAN-512 · EVT-053 — Wire: Venue match panel + compare | SAN-497 · EVT-038 |
| SAN-514 · EVT-055 — Wire: Admin event booking queue | SAN-492 · EVT-033, SAN-496 · EVT-037 |
| SAN-495 · EVT-036 — Event offerings detail panel | SAN-510 · EVT-051 |
| SAN-496 · EVT-037 — Request proposal modal (HITL) | SAN-511 · EVT-052, SAN-494 · EVT-035 |
| SAN-824 · UX-039 — Events: pin coverage via upstream coords + geocode gaps | SAN-828 · UX-043 |

---

## Events Platform Todo (7)

SAN-492 · EVT-033 — Event venue + offerings schema →
SAN-493 · EVT-034 — Seed Mamacita + 5 event partners →
SAN-510 · EVT-051 — Wire: Event offerings panel + Event Venue CTA →
SAN-511 · EVT-052 — Wire: Request proposal modal →
SAN-494 · EVT-035 — Restaurant card Event Venue CTA →
SAN-495 · EVT-036 — Event offerings detail panel →
SAN-496 · EVT-037 — Request proposal modal (HITL)

Only **SAN-492 · EVT-033 — Event venue + offerings schema** is startable once gate + CHAT chain complete.

---

## Partners / host landing (related, not Events Platform Todo)

| Issue | Status |
|-------|--------|
| **SAN-660 · MKT — For Event Hosts landing (/host)** | PR #130 · head `d714b2c` — proof band + tap targets fixed |

---

## Specs / wireframes (disk)

| Gap (audit) | Status |
|-------------|--------|
| SAN-492 · EVT-033 — Event venue + offerings schema | **Added** `tasks/events/specs/venue-booking/EVT-033-schema.md` |
| SAN-510–514 · EVT-051–055 wires | **On disk** `tasks/venues/tasks/event-booking/wireframes/VEB-W01–W05` |
| Wire index | **Added** `tasks/events/specs/venue-booking/WIREFRAMES.md` |
| Venue test matrix | **Added** `tasks/events/specs/venue-booking/venue-booking-test-matrix.md` |
| SAN-824 · UX-039 — Events: pin coverage | No local task file yet |

---

## Missing tests (still open)

| Issue | Status |
|-------|--------|
| SAN-492 · EVT-033 — Event venue + offerings schema | RLS / migration tests not written |
| SAN-494–496 · EVT-035–037 | Playwright not started |
| SAN-730 · AIE-002 — Enable host navigation rail | **Done** — `host-nav-rail.spec.ts` |
| SAN-731 · UI-004 — Event detail loading skeleton + hero alt | In Review |
| SAN-660 · MKT — For Event Hosts landing (/host) | **Done** — SAN-660 Playwright 1/1 |

---

## Next 5 tasks (real coding order)

1. **Merge SAN-730 · AIE-002 — Enable host navigation rail** — [PR #135](https://github.com/amo-tech-ai/mdeapp/pull/135)
2. **Finish SAN-731 · UI-004 — Event detail loading skeleton + hero alt (a11y)**
3. **Merge SAN-135 · AIE-024 — MVP Luma event detail layout (EVP-032)**
4. **SAN-823 · UX-038 → SAN-828 · UX-043** — CHAT chain (cross-project)
5. **SAN-824 · UX-039 — Events: pin coverage via upstream coords + geocode gaps**

Venue work starts at **SAN-492 · EVT-033 — Event venue + offerings schema** only after the above.

---

## Readiness score (post-fix)

| Area | Before | After |
|------|-------:|------:|
| Task descriptions | 90 | 90 |
| Linear blocker relations | 62 | **88** |
| Execution order | 70 | **85** |
| Specs/wireframes | 82 | **92** |
| Implementation readiness | 74 | **82** |
| **Overall** | **74** | **87/100** |

---

**Next real task:** merge **SAN-730 · AIE-002 — Enable host navigation rail**, ship **SAN-731 · UI-004 — Event detail loading skeleton + hero alt (a11y)**, then **SAN-135 · AIE-024 — MVP Luma event detail layout** before **SAN-492 · EVT-033 — Event venue + offerings schema** or **SAN-824 · UX-039 — Events: pin coverage**.
