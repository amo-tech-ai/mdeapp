**Short answer:** In the two folders you moved, **most launch-critical work is DATA + mobile wireframes**, not the 5 UX specs in `wireframes/ux/` (those are post-soak polish). Below is the MVP cut by tier.

---

## How to read this

| Tier | Meaning |
|------|---------|
| **P0 launch** | Blocks EVT-001 / `phase:launch` or north-star proof on prod |
| **P1 MVP** | Needed for Camila/Andrés/Roberto flows; ship in Cycle 1 if P0 is green |
| **P2+** | Polish, intelligence 1b, or Phase 2 — **not** MVP-blocking |

**Note:** `tasks/data/tasks-data/INDEX-data.md` and `wireframes/ux/README.md` still link to old `tasks/PR/` paths — worth updating when you have a minute.

---

## `tasks/wireframes/ux/` — MVP priority

These are **Stable Beta / card-unification**, not Cycle-1 launch gates (those are UX-001–005 in `ux/archive/legacy`, already shipped or tracked separately).

| Priority | ID | MVP? | Why |
|----------|-----|------|-----|
| **P1 (after soak)** | **UX-023** | Yes — polish | `ResultCardShell` — one card layout for café/rental/event; blocks UX-024/029. **Wait for SAN-462 3/3** |
| P1 | UX-024 | No (MVP polish) | Hover → pin parity — nice for desktop Camila |
| P2 | UX-029 | No | Retire `GroundedPlaceCard` after UX-023 |
| P2 | UX-033 | No | Stale markers cleanup (SAN-323) |
| — | UX-018 | **Phase 2** | ADK on Vercel — defer |

**MVP from this folder:** really only **UX-023**, and only **after** prod soak + PR-16 — not before PAY/EVT gates.

---

## `tasks/wireframes/mobile/` — MVP priority

From [`index-mobile.md`](tasks/wireframes/mobile/index-mobile.md) — **~40% mobile ready**; M2–M4 are MVP-blocking.

### P0 — ship for MVP mobile parity

| Order | ID | Persona | Why |
|------:|-----|---------|-----|
| 1 | **SCREEN-018** | Camila | Shell: drawer, map FAB, bottom sheet, dvh/safe-area — **partially on disk** |
| 2 | **MOB-CK-001** | Camila | CopilotKit mobile baseline (44px send, 16px input, safe-area) — **partial** |
| 3 | **MOB-CHAT-001** | Camila | Composer + keyboard UX — blocks checkout flow |
| 4 | **MAP-011** | Tourist | Mobile map (single instance, pin tap, dvh) — ties to [`02-maps-audit.md`](tasks/wireframes/audit/02-maps-audit.md) MAP-AUDIT-001/004 |
| 5 | **PAY-005** | Andrés | Mobile Stripe checkout + QR ticket @ 390px |

### P1 — MVP if time in Cycle 1

| ID | Why |
|----|-----|
| **MOB-CARD-001** | Touch-sized cards / carousels on `/chat` |
| **AIM-010** | Streaming skeleton, quick chips |
| **AUTH-006** | Google OAuth + magic link on mobile Safari |

### Not MVP (Phase 2)

**PERF-001**, **PWA-001**, **A11Y-001** — index explicitly marks M5 as Phase 2.

**Critical path (mobile):**  
`SCREEN-018 → MOB-CK-001 → MOB-CHAT-001 → MAP-011 → PAY-005`

---

## `tasks/data/tasks-data/` — MVP priority

Pack is **~77% done**; P0 venue + security already archived. Active folder = **app-layer + auth closeout**.

### P0 launch gates

| ID | Status | MVP role |
|----|--------|----------|
| **AUTH-011** | ~40% · SAN-367 | **Prod auth checklist** — launch gate with EVT-001 (HaveIBeenPwned, Vercel env, CopilotKit auth) |
| **SEARCH-002** | In progress · PR #38 | **Event hybrid fast-path UI** — Andrés/event discovery on main; tool path already shipped |
| **DATA-041** | ~90% in review | **venue_signals** — close human QA on top 30; unblocks intel quality |

### P1 MVP (north-star data, not launch ledger)

| ID | Status | MVP role |
|----|--------|----------|
| **DATA-028** | Blocked | **Paid ticket / showing → `trip_items`** — Andrés ticket + Camila trips after PAY-001 |
| **DATA-008** | Partial | **Places backfill** — detail panels without hammering Places API (café/restaurant cards) |
| **AUTH-009** | Ready | JWT → Mastra `RequestContext` — user-scoped tools (showings, tickets) |

### P1 app search (module MVP, not Cycle-1 exit)

| ID | Notes |
|----|-------|
| **SEARCH-001** | Rental hybrid **app wiring** — RPC live; SAN-386; `/rentals` still shell |

### Not MVP — defer

| Bucket | IDs |
|--------|-----|
| Events schema backlog | DATA-013, 016, 018 (P1 later), DATA-014/015/017 (P2) |
| Rentals/trips prep | DATA-022, 024, 025, 031, 032, 033 |
| Intelligence 1b | **AI-003**, **AI-004**, **DATA-046** |
| Auth polish | **AUTH-005** (P2 Playwright auth — good but not launch gate) |

**DATA critical path from INDEX:**  
`DATA-028` (trips sync) · `DATA-008` (cache backfill) · close **AUTH-011**

---

## Cross-folder MVP stack (recommended order)

Aligns with [`MVP-EXECUTION.md`](tasks/MVP-EXECUTION.md) + your new folders:

```text
LAUNCH GATES (may live outside these folders)
  PAY-001 → PAY-003 → EVT-013/002 → EVT-001
  AUTH-011 ← tasks/data/tasks-data
  MAP-002B / MAP-008B (prod mapId + ADK)

PARALLEL — DATA
  DATA-041 (close QA) → SEARCH-002 (#38 merge after soak)
  DATA-028 (after PAY-001 webhook path)
  DATA-008 (backfill cron)

PARALLEL — MOBILE (wireframes/mobile)
  SCREEN-018 → MOB-CK-001 → MOB-CHAT-001 → MAP-011 → PAY-005

AFTER SOAK — UX (wireframes/ux)
  UX-023 → UX-024 / UX-029
```

---

## One-line verdict

| Folder | MVP must-do |
|--------|-------------|
| **`wireframes/ux`** | **UX-023 only** (post-soak); rest is polish/Phase 2 |
| **`wireframes/mobile`** | **SCREEN-018, MOB-CK-001, MOB-CHAT-001, MAP-011, PAY-005** |
| **`data/tasks-data`** | **AUTH-011, SEARCH-002, DATA-041, DATA-028, DATA-008**, then AUTH-009 |

Want me to rewrite `INDEX-data.md` + `wireframes/ux/README.md` paths and add an `INDEX-mvp.md` that pins this ordering?