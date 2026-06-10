# 🗺️ Maps — MAP task tracker
> Spec pack: [`docs/tasks/maps/`](../../tasks/maps/INDEX.md) · Updated: 2026-06-09 · Canonical CSV: [`Discovery Platform › Issues.csv`](../CSV/Discovery%20Platform%20%E2%80%BA%20Issues.csv)

**Legend:** 🟢 Complete · 🟡 In Progress · ⚪ Not Started · 🔴 Failed/Canceled · — No Linear issue (shipped W1)

> **P0 launch:** MAP-002B + MAP-008B (SAN-368, SAN-369) · **P1 spine:** MAP-005 → 006 → 012A → 012 → 010 → 011A → 011 → 023

---

## P0 production hardening (Cycle 1)

| Status | Spec | Linear | Title | Also in |
|--------|------|--------|-------|---------|
| 🟡 | MAP-002B | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | ADK grounding on production | mvp.md · core.md |
| 🟢 | MAP-008B | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) | Map ID on production | mvp.md · core.md |
| ⚪ | MAP-008B | [SAN-788](https://linear.app/sanjiovani/issue/SAN-788) | CI env guard + Vercel deployment check | mvp.md · sub-slice of 008B |
| 🔴 | MAP-002B | [SAN-463](https://linear.app/sanjiovani/issue/SAN-463) | Production ADK sidecar (dup) | mvp.md · Dup: SAN-368 ✅ |
| 🔴 | MAP-008B | [SAN-464](https://linear.app/sanjiovani/issue/SAN-464) | Vercel Map ID verify (dup) | mvp.md · Dup: SAN-369 ✅ |

---

## Active implementation spine (open specs on disk)

| Status | Spec | Linear | Title | Tracker |
|--------|------|--------|-------|---------|
| ⚪ | MAP-005 | [SAN-105](https://linear.app/sanjiovani/issue/SAN-105) | Places proxy edge + places_cache + RLS | ADV.md |
| ⚪ | MAP-005 | [SAN-776](https://linear.app/sanjiovani/issue/SAN-776) | FieldMask enforcement + caching audit | mvp.md |
| ⚪ | MAP-006 | [SAN-106](https://linear.app/sanjiovani/issue/SAN-106) | Nearby Search + Show nearby on RentalCard | ADV.md |
| ⚪ | MAP-012A | [SAN-107](https://linear.app/sanjiovani/issue/SAN-107) | Colombia coverage spike | ADV.md |
| ⚪ | MAP-012 | [SAN-230](https://linear.app/sanjiovani/issue/SAN-230) | Neighborhood intelligence cards | ADV.md |
| ⚪ | MAP-010 | [SAN-104](https://linear.app/sanjiovani/issue/SAN-104) | Place autocomplete — Roberto host venue | mvp.md |
| ⚪ | MAP-011A | [SAN-465](https://linear.app/sanjiovani/issue/SAN-465) | ADK sidecar compute_routes | ADV.md |
| ⚪ | MAP-011 | [SAN-229](https://linear.app/sanjiovani/issue/SAN-229) | Route previews + commute cards | ADV.md |
| ⚪ | MAP-023 | [SAN-108](https://linear.app/sanjiovani/issue/SAN-108) | Static Maps — event previews + OG | ADV.md |
| ⚪ | MAP-002A | [SAN-101](https://linear.app/sanjiovani/issue/SAN-101) | ADK LlmAgent + McpToolset (Phase 2) | ADV.md |
| ⚪ | MAP-034 | [SAN-466](https://linear.app/sanjiovani/issue/SAN-466) | Advanced marker UX polish | ADV.md |
| ⚪ | MAP-035 | [SAN-789](https://linear.app/sanjiovani/issue/SAN-789) | Neighborhood intel layer on `/explore` | ADV.md · renamed 2026-06-09 |
| 🟢 | MAP-DOC-001 | — | Refresh maps-prd repo truth | Doc only — no SAN |

**Superseded (do not assign):** SAN-102 → SAN-105 · SAN-103 → SAN-106 · SAN-228 → GS-006 (reopened, not SAN-104)

---

## Shipped platform (archive — no per-task Linear)

23 specs in [`docs/tasks/archive/maps-A/`](../../tasks/archive/maps-A/README.md): MAP-001–004, 007B, 008, 009, 013–019, 018B–F, 030, 031, 002D, 002E. Bundled W1 foundation; `implementation-order.json` marks `inLinear: false`.

---

## Hygiene — prefix collisions (fix in Linear)

| Linear | Title prefix | Problem | Status |
|--------|--------------|---------|--------|
| [SAN-789](https://linear.app/sanjiovani/issue/SAN-789) | ~~`MAP-010`~~ → **MAP-035** | Was colliding with SAN-104 autocomplete | ✅ 2026-06-09 |
| [SAN-227](https://linear.app/sanjiovani/issue/SAN-227) | ~~`MAP-009`~~ → **GS-005** | Reopened in grounding.md | ✅ 2026-06-09 |
| [SAN-231](https://linear.app/sanjiovani/issue/SAN-231) | ~~`MAP-013`~~ → **GS-009** | Reopened in grounding.md | ✅ 2026-06-09 |
| [SAN-463](https://linear.app/sanjiovani/issue/SAN-463) | MAP-002B dup | Duplicate of SAN-368 | ✅ verified 2026-06-09 |
| [SAN-464](https://linear.app/sanjiovani/issue/SAN-464) | MAP-008B dup | Duplicate of SAN-369 | ✅ verified 2026-06-09 |

---

## Implementation order (from [`maps/INDEX.md`](../../tasks/maps/INDEX.md))

```text
MAP-002B + MAP-008B (P0)
  → MAP-005 (+ SAN-776 audit) → MAP-006 → MAP-012A → MAP-012
  → MAP-010 → MAP-011A → MAP-011 → MAP-023
Parallel: MAP-002A · MAP-034 (post-MVP UX)
```
