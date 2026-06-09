---
title: Docs → tasks gap map
status: Active
updated: 2026-05-27
parent: ./index-tasks.md
---

# Venues docs → task specs

Maps each planning doc under [`../docs/`](../docs/) to executable tasks in this folder.

---

## Coverage summary

| Doc | Tasks created / linked | Still deferred |
|-----|------------------------|----------------|
| [01-architecture](../docs/01-architecture.md) | — (reference only) | — |
| [02-booking-whatsapp](../docs/02-booking-whatsapp.md) | CAF-008→018, MSV-002/003/007, CKV-005/006/008 | Inbound WA webhook Phase 2 |
| [03-agents-tools-copilotkit](../docs/03-agents-tools-copilotkit.md) | MSV-*, CKV-* | — |
| [04-supabase-seeds-vectors](../docs/04-supabase-seeds-vectors.md) | CAF-001→009 | **VEC-001→005** in [`tasks/vector/`](../../vector/) |
| [05-maps-places-adk](../docs/05-maps-places-adk.md) | CAF-007/009, MAP-* platform | MAP-019 directions |
| [06-openclaw](../docs/06-openclaw-automation.md) | **OCL-013→016** in [`../openclaw/`](../openclaw/) | **VEN-008** admin draft UI → CAF-019 below |
| [07-roadmap-mvp](../docs/07-roadmap-mvp.md) | Full CAF/RST/NGT spine | — |
| [08-roadmap-advanced](../docs/08-roadmap-advanced.md) | VEN-GEM-*, MSV-010+ stubs | 071/072 partner reservations |
| [09-risks](../docs/09-risks-blockers.md) | — (gates only) | — |
| [10-status-audit](../docs/10-status-audit.md) | — (tracker) | — |
| [11-gemini-maps-adk](../docs/11-gemini-maps-adk-venues-routing.md) | VEN-GEM register below | ADK sidecar Phase 2 |
| [12-mastra](../docs/12-mastra-venues-routing.md) | MSV-001→008 | MSV-010→015 advanced |
| [13-copilotkit](../docs/13-copilotkit-venues-routing.md) | CKV-001→012 | CKV-020+ advanced |

---

## MVP next 10 (from doc 07)

| # | Doc ID | Task spec(s) |
|---|--------|--------------|
| 1 | VEN-002 | **RST-001** + CKV-001/002 |
| 2 | VEN-003 | **NGT-001/002** + MSV-001 + CKV-003/004 |
| 3 | VEN-001 | **CAF-008** |
| 4 | VEN-004 | **CAF-013/014** + MSV-002 + CKV-005/006 |
| 5 | VEN-005 | **CAF-016** + MSV-003/007 |
| 6 | VEC-001 | [`tasks/vector/VEC-001`](../../vector/VEC-001-pgvector-inventory-and-duplicate-index-plan.md) |
| 7 | VEN-006 | **CAF-004** (restaurant seed) |
| 8 | VEN-007 | **CAF-017** |
| 9 | VEN-009 | **CAF-009** |
| 10 | VEN-008 | **CAF-019** (stub — OpenClaw admin) |

---

## Advanced register (spec stubs — implement after MVP)

### VEN-GEM (Gemini / Maps / ADK) — doc 11

| ID | Title | Alias / owner |
|----|-------|---------------|
| VEN-GEM-001 | Nightlife grounding | = NGT-001 / MSV-001 |
| VEN-GEM-002 | Restaurant vector flag | = MSV-011 (not filed — use MSV-011 when VEC-005 lands) |
| VEN-GEM-003 | Concierge routing matrix | = MSV-005 / CAF-012 |
| VEN-GEM-004 | Structured card normalizer | = MSV-006 |
| VEN-GEM-010 | ADK grounding spike | Phase 2 |
| VEN-GEM-020 | Grounding Lite fallback | Phase 2 |
| VEN-GEM-021 | Two-step grounding + JSON | Phase 2 |
| VEN-GEM-030 | ADK sidecar production | Phase 2 |
| VEN-GEM-040 | Detail Maps CTAs | MAP-019 |
| VEN-GEM-050 | generativeSummary seed | CAF-009 extension |

### MSV advanced — doc 12

| ID | Title |
|----|-------|
| MSV-010 | Booking workflow suspend (Patricia HITL) |
| MSV-011 | search-restaurants vector rerank |
| MSV-012 | evaluationAgent + CAF-006 golden queries |
| MSV-013 | MCPClient Grounding Lite |
| MSV-014 | conciergeRoutingWorkflow venue intents |
| MSV-015 | withAudit on all venue writes |

### OpenClaw — doc 06

| ID | Path |
|----|------|
| OCL-013 | [`../openclaw/OCL-013-mvp-coffee-tour-crawler.md`](../openclaw/OCL-013-mvp-coffee-tour-crawler.md) |
| OCL-014 | [`../openclaw/OCL-014-postmvp-menu-extraction.md`](../openclaw/OCL-014-postmvp-menu-extraction.md) |
| OCL-015 | [`../openclaw/OCL-015-postmvp-instagram-cafe-discovery.md`](../openclaw/OCL-015-postmvp-instagram-cafe-discovery.md) |
| OCL-016 | [`../openclaw/OCL-016-postmvp-venue-intelligence.md`](../openclaw/OCL-016-postmvp-venue-intelligence.md) |

### Vector — doc 04

[`tasks/vector/VEC-001`](../../vector/VEC-001-pgvector-inventory-and-duplicate-index-plan.md) through **VEC-005** — owner: vector track; unblocks SCREEN-021 Phase B + MSV-011.

### Phase 3 frozen

- [`../drafts/071-restaurant-reservations-schema.md`](../drafts/071-restaurant-reservations-schema.md) → VEN-010 (not filed)
- [`../drafts/072-restaurant-booking-edge-fn.md`](../drafts/072-restaurant-booking-edge-fn.md) → VEN-011 (not filed)

---

## CAF-019 stub (VEN-008)

OpenClaw draft → Patricia admin approve → Supabase. Spec when OCL-013+ produces drafts:

- List pending OpenClaw artifacts in `/admin/enrichment`
- Approve merges into `restaurants` or cache metadata
- See doc 06 § VEN-008 alignment

*File when OCL-013 lands — not blocking MVP.*

---

## Task file count (this folder)

After 2026-05-27 gap fill: **CAF-001→018**, **MSV-001→008**, **CKV-001→012**, **RST-001/002**, **NGT-001→003**, plus hubs [`../INDEX.md`](../INDEX.md) (MVP order), `index-tasks.md`, `NUMBERING.md`.
