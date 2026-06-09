**Verdict:** Todo count is correct (15), but **3 Todo items are blocked** and **Linear priority ≠ execution order**. Merge the In Review trio first, then run the CHAT chain (`SAN-823 → SAN-828 → SAN-824`) before maps/venue work.

---

## 1. Correct execution order

```text
GATE (In Review — finish before pulling new Todo work)
  1. SAN-730  AIE-002 host nav rail
  2. SAN-731  UI-004 detail skeleton + hero alt
  3. SAN-135  AIE-024 Luma event detail Phase A

CHAT sprint (cross-project — blocks event pins)
  4. SAN-823  UX-038 rentals fast-path        [Real Estate · Todo]
  5. SAN-828  UX-043 CopilotKit 401 vs 400    [Platform Infrastructure · Todo]
  6. SAN-824  UX-039 event pin coverage       [Events Platform · Todo]

EVENTS PLATFORM (after gates + pins)
  7.  SAN-729  /host/analytics + HostOpsCopilotBridge   ← blockedBy SAN-730
  8.  SAN-765  /venues explorer
  9.  SAN-120  Event maps + venue integration           ← after SAN-824
  10. SAN-492  Venue offerings schema
  11. SAN-493  Seed Mamacita + partners                 ← after SAN-492
  12. SAN-510  Wire: offerings panel
  13. SAN-511  Wire: proposal modal
  14. SAN-494  Restaurant Event Venue CTA
  15. SAN-495  Offerings detail panel
  16. SAN-496  Request proposal modal (HITL)
  17. SAN-512  Wire: match panel          (Tier 2 prep — Backlog until 496 done)
  18. SAN-513  Wire: wizard venue step
  19. SAN-514  Wire: admin queue

DEFER (Backlog — do not promote early)
  SAN-136   vibe tags          ← blockedBy SAN-135 · phase:post-mvp
  SAN-497–503, SAN-500        ← venue Tier 2+ (agent, workflow, admin impl)
  SAN-119–132                 ← discovery pack
```

---

## 2. Blockers

| Issue | Status | Blocked by | Project | Impact |
|-------|--------|------------|---------|--------|
| **SAN-730** | In Review | — | Events | Blocks **SAN-729** |
| **SAN-731** | In Review | — | Events | Soft-dep **SAN-135** polish |
| **SAN-135** | In Review | — | Events | Blocks **SAN-136** |
| **SAN-729** | Todo | **SAN-730** | Events | Analytics route + nav link |
| **SAN-824** | Todo | **SAN-828** | Events | Event map pins / geocode |
| **SAN-828** | Todo | **SAN-823** | Platform Infra | CopilotKit smoke (401 vs 400) |
| **SAN-823** | Todo | — | Real Estate | CHAT sprint order 1 |
| **SAN-120** | Todo | **SAN-824** (logical) | Events | Maps integration on bad coords |
| **SAN-136** | Todo | **SAN-135** | Events | Should not be in active Todo |
| **SAN-493** | Todo | **SAN-492** | Events | Seed needs schema |
| **SAN-494–496** | Todo | **SAN-510/511** + **SAN-492** | Events | Wire-before-code |
| **SAN-495–496** | Todo | **SAN-494–495** chain | Events | Linear CSV relations |

**Prod smoke today:** empty `POST /api/copilotkit` → **401** (script expects **400**) — confirms SAN-828 is real, not cosmetic.

---

## 3. Issues out of order

| Problem | Current | Should be |
|---------|---------|-----------|
| **SAN-824 at top of Todo** | Listed as next Events work | After **SAN-828** (and **SAN-823**) |
| **SAN-729 in Todo** | Urgent priority | After **SAN-730** merged |
| **SAN-136 in Todo** | #13 in column | **Backlog** until SAN-135 Done |
| **SAN-120 before SAN-824** | Both in Todo | SAN-120 **after** pin/geocode fix |
| **SAN-512/513/514 in Todo** | Ahead of schema | OK as doc-only; **implementation** waits on 492→496 |
| **`index-events.md` queue** | `NOW: SAN-115 → 730/731 → 135` | Missing CHAT chain **823→828→824** |
| **Todo sort vs dependency** | Linear sorts by priority/updated | Manual execution order above is source of truth |

**Todo column hygiene:** 15 items ✓ · Tier 2 (500–503) correctly in Backlog ✓

---

## 4. Missing specs / wireframes

| Issue | Local spec | Wireframe | Gap |
|-------|------------|-----------|-----|
| SAN-730 | `tasks/events/tasks/AI-native-system/Core/AIE-002-core-host-nav-enable.md` ✓ | `wireframes/events/008-host-dashboard.md` ✓ | — |
| SAN-731 | `specs/pages/PAGE-003-event-detail-commerce.md` ✓ | `wireframes/events/003-event-details.md` ✓ | — |
| SAN-135 | `MVP/AIE-024-mvp-luma-event-detail.md` ✓ | `design/luma/screens/003-event-detail.md` ✓ | Mermaid in Linear ✓ |
| SAN-729 | `Core/AIE-008-core-host-analytics-page.md` + `PAGE-M02-host-analytics.md` ✓ | 013, 014 ✓ | hostOps agent specs (AIE-005/006) pre-req |
| SAN-765 | `Core/AIE-011-core-venue-explorer.md` ✓ | `wireframes/events/029-venue-explorer.md` ✓ | — |
| **SAN-492** | **No dedicated EVT-033 schema doc** | — | **P0 gap** — only refs in VEN-002 + PAGE-M05 |
| SAN-494–496 | `specs/venue-booking/VEN-001–003` ✓ | Partial | — |
| **SAN-510–514** | Linear descriptions ✓ | **No VEB-W01–W05 markdown on disk** | Wires live in issue bodies only |
| **SAN-824** | CHAT.md tracker only | — | No `tasks/**/UX-039*.md` |
| SAN-828 | CHAT.md ✓ | — | — |
| SAN-120 | EVP-016 in specs | Maps refs | Depends on SAN-824 proof |

**Action:** Add `specs/venue-booking/EVT-033-schema.md` before SAN-492 ships; optionally materialize VEB wire files from SAN-510–514 issue bodies.

---

## 5. Missing tests

| Issue | Expected | Disk | Status |
|-------|----------|------|--------|
| SAN-730 | `e2e/host/host-nav-rail.spec.ts` | **Missing** | SCREEN-002 nav-rail exists; host-specific assert not shipped |
| SAN-731 | SCREEN-014 + skeleton assert | `mdeapp/e2e/screens/SCREEN-014-event-detail.spec.ts` ✓ | Extend for `loading.tsx` |
| SAN-135 | SCREEN-014 Luma layout | Partial | No Luma-specific e2e yet |
| SAN-828 | `chat-smoke.mjs` localhost + prod | `tasks/testing/scripts/chat-smoke.mjs` ✓ | **Red on prod** (401) |
| SAN-824 | `home-to-chat` events + pin count | `mdeapp/e2e/home-to-chat.spec.ts` ✓ | No dedicated geocode-gap test |
| SAN-492 | RLS + migration tests | — | **Missing** — hook `source-command-supabase-rls-audit` |
| SAN-118 | host events list e2e | SCREEN-016b/c ✓ | `host-events-list.spec.ts` still called out missing in index |
| Venue UI | Playwright for CTA→proposal | — | Not started (expected) |

---

## 6. Recommended next 5 tasks

| # | Task | Why | Unblocked? |
|---|------|-----|------------|
| **1** | **Merge SAN-730** | Unblocks SAN-729; Roberto-visible | In Review — ship it |
| **2** | **Merge SAN-731** | a11y + skeleton; low risk polish | In Review |
| **3** | **Merge SAN-135** | Luma Phase A; unblocks vibe work later | In Review |
| **4** | **SAN-823 → SAN-828** | CHAT order 1→2; unblocks SAN-824 + prod smoke | Cross-project but no Events deps |
| **5** | **SAN-492** schema migration | MVP Gates milestone; unblocks entire venue chain | ✓ Can run **parallel** to CHAT if different agent |

**Do not start yet:** SAN-824, SAN-729, SAN-120, SAN-136, SAN-494–496 implementation.

**Optional hygiene:** Move **SAN-136** Todo → Backlog (blocked + post-mvp; frees mental focus on the 15).

---

## 7. Final readiness score

| Dimension | Score | Grade | Notes |
|-----------|------:|-------|-------|
| **Planning / spec sync** | 88 | B+ | Linear enriched; EVT-033 + VEB wires thin |
| **Todo hygiene (count)** | 95 | A | Exactly 15; Tier 2 in Backlog |
| **Execution order accuracy** | 68 | D+ | Blocked items still in active Todo |
| **Blocker graph clarity** | 82 | B | Linear relations correct; cross-project chain easy to miss |
| **Test coverage for next slice** | 70 | C | SCREEN-014 exists; host-nav + schema tests missing |
| **Implementation readiness** | **74** | **C+** | Ship 730/731/135 → CHAT chain → venue schema |

---

### Sync actions (Linear ↔ disk)

1. **`index-events.md` priority queue** — insert `SAN-823 → SAN-828 → SAN-824` before venue work; demote SAN-824 from implicit #1.
2. **Move SAN-136 → Backlog** — keeps Todo = next 15 *executable* items after In Review clears.
3. **Add EVT-033 schema spec** — single blocker for confident SAN-492 PR.

**Immediate next step:** merge **SAN-730**, then **SAN-731**, then resolve **SAN-828** (after **SAN-823**) before touching **SAN-824**.

Want me to move SAN-136 to Backlog and update `index-events.md` execution order on disk?