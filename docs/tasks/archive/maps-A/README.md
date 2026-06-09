---
title: Maps core — archived (Done)
updated: 2026-05-26
active_backlog: ../../maps/INDEX.md
---

# Maps core archive

**23 MAP specs** moved here on **2026-05-26** — all **`status: Done`** in frontmatter and verified on disk in `mdeapp/`.

**Active backlog:** [`../../maps/INDEX.md`](../../maps/INDEX.md) — MAP-005, 006, 010, 011, 012, 012A, 023, 002A.

---

## What “core complete” means (and what it does not)

| Scope | Complete? | Notes |
|-------|:---------:|-------|
| **MVP platform block** (001, 002, 013, 007B, 008, 004, 014–019, 018B–F, 030, 031, 009) | **Yes** | Shipped — Camila gets grounded cards + map pins on `/` |
| **CopilotKit maps shell** (F48, F49, F50, F50b) | **Yes** | [`tasks/archive/copilot-A/`](../copilot-A/README.md) |
| **MAP-001–012 spine (literal)** | **No** | **005, 006, 010, 011, 012** still **Not Started** in root |
| **Phase 2** (002A ADK package, 002D Search enable) | **Filed + Done ops** | 002D/E archived as Done; 002A remains active in root |

Do **not** execute archived specs again unless a regression reopens them — open a new task id instead.

---

## Archived files (Done)

| ID | File |
|----|------|
| MAP-001 | [MAP-001-platform-map-pipeline.md](./MAP-001-platform-map-pipeline.md) |
| MAP-002 | [MAP-002-grounding-attribution.md](./MAP-002-grounding-attribution.md) |
| MAP-002D | [MAP-002D-search-grounding-enable.md](./MAP-002D-search-grounding-enable.md) — Phase 2 spec, marked Done |
| MAP-002E | [MAP-002E-gemini-maps-fallback-runbook.md](./MAP-002E-gemini-maps-fallback-runbook.md) |
| MAP-004 | [MAP-004-places-grounding-clients.md](./MAP-004-places-grounding-clients.md) |
| MAP-007 | [MAP-007-chat-three-panel-polish.md](./MAP-007-chat-three-panel-polish.md) — **Superseded** by 007B |
| MAP-007B | [MAP-007B-center-copilot-layout.md](./MAP-007B-center-copilot-layout.md) |
| MAP-008 | [MAP-008-advanced-markers-map-id.md](./MAP-008-advanced-markers-map-id.md) |
| MAP-009 | [MAP-009-marker-clustering.md](./MAP-009-marker-clustering.md) |
| MAP-013 | [MAP-013-env-key-verification.md](./MAP-013-env-key-verification.md) |
| MAP-014 | [MAP-014-single-map-mobile-mount.md](./MAP-014-single-map-mobile-mount.md) |
| MAP-015 | [MAP-015-place-card-pin-sync.md](./MAP-015-place-card-pin-sync.md) |
| MAP-016 | [MAP-016-fit-bounds-on-search.md](./MAP-016-fit-bounds-on-search.md) |
| MAP-017 | [MAP-017-mock-pin-lifecycle.md](./MAP-017-mock-pin-lifecycle.md) |
| MAP-018 | [MAP-018-mindtrip-grounded-place-cards.md](./MAP-018-mindtrip-grounded-place-cards.md) — parent |
| MAP-018B–F | [018B](./MAP-018B-sidecar-places-enrichment.md) · [018C](./MAP-018C-mastra-enriched-grounded-schema.md) · [018D](./MAP-018D-places-photo-proxy.md) · [018E](./MAP-018E-places-details-cache.md) · [018F](./MAP-018F-grounded-place-card-ui.md) |
| MAP-019 | [MAP-019-google-maps-link-ctas.md](./MAP-019-google-maps-link-ctas.md) |
| MAP-030 | [MAP-030-category-advanced-markers.md](./MAP-030-category-advanced-markers.md) |
| MAP-031 | [MAP-031-map-results-panel-grounded-copy.md](./MAP-031-map-results-panel-grounded-copy.md) |

Evidence: `tasks/notes/MAP-###-evidence.md` · gates: [`../../maps/VERIFICATION-CHECKLIST.md`](../../maps/VERIFICATION-CHECKLIST.md)
