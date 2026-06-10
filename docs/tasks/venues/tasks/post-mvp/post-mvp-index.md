# Venues post-MVP — implementation order

**Prerequisite:** complete [`../mvp/mvp-index.md`](../mvp/mvp-index.md) through **VEN-031** (E2E) for venue booking MVP.

**Folder:** `025-ven-*` … `034-ven-*` in this directory.

Layer prefix in filename: **mastra** · **copilot** · **vitest** · **data** · **supabase**

**Parent:** [`../../INDEX.md`](../../INDEX.md) · **MVP:** [`../mvp/mvp-index.md`](../mvp/mvp-index.md)

Vector (VEC-*), OpenClaw (OCL-*): [`../../openclaw/`](../../openclaw/) · [`../../../vector/`](../../../vector/INDEX.md)

**Coffee tours:** MVP [`VEN-032…043`](../mvp/mvp-index.md#phase-7--coffee-tours-32-43-optional) · Post-MVP **VEN-044…051** below.

---

## Phase 1 — Agent routing polish (25–26)

After MVP **ven-011**. Steps **25–26** can run in parallel.

| Step | Task | Layer | What | Status |
|------|------|-------|------|--------|
| **25** | [025-ven-mastra-concierge-instructions](025-ven-mastra-concierge-instructions.md) | mastra | Café vs restaurant vs nightlife routing rules | ⚪ |
| **26** | [026-ven-mastra-normalize-tool-output](026-ven-mastra-normalize-tool-output.md) | mastra | Tool output → card kinds + map pin categories | ⚪ |

---

## Phase 2 — Types + memory (27–28)

| Step | Task | Layer | What | Depends on | Status |
|------|------|-------|------|------------|--------|
| **27** | [027-ven-copilot-unified-detail-types](027-ven-copilot-unified-detail-types.md) | copilot | Shared `VenuePlaceDetail` types | ven-010, ven-013 | ⚪ |
| **28** | [028-ven-mastra-working-memory-slots](028-ven-mastra-working-memory-slots.md) | mastra | Thread memory venue + booking slots | VEN-016 | ⚪ |

---

## Phase 3 — UX + workflow (29–30)

| Step | Task | Layer | What | Depends on | Status |
|------|------|-------|------|------------|--------|
| **29** | [029-ven-copilot-filter-chips-nightlife](029-ven-copilot-filter-chips-nightlife.md) | copilot | Chat filter chips + scoped messages | ven-025 | ⚪ |
| **30** | [030-ven-mastra-booking-workflow](030-ven-mastra-booking-workflow.md) | mastra | `venueBookingWorkflow` validate → insert → draft WA | VEN-016, VEN-022 | ⚪ |

---

## Phase 4 — Unit tests (31–32)

| Step | Task | Layer | What | Depends on | Status |
|------|------|-------|------|------------|--------|
| **31** | [031-ven-vitest-copilot-card-renders](031-ven-vitest-copilot-card-renders.md) | vitest | RTL/snapshot for restaurant + nightlife cards | ven-009, ven-012 | ⚪ |
| **32** | [032-ven-vitest-mastra-venue-tools](032-ven-vitest-mastra-venue-tools.md) | vitest | Tool schema tests + agent registry | ven-011, VEN-016, VEN-022 | ⚪ |

---

## Phase 5 — Restaurant reservations (33–34)

Phase 3 product track — real-time table booking (not venue WhatsApp flow).

| Step | Task | Layer | What | Depends on | Status |
|------|------|-------|------|------------|--------|
| **33** | [033-ven-data-restaurant-reservations-schema](033-ven-data-restaurant-reservations-schema.md) | data | `restaurant.*` tables — reservations, tables, slots | external event schema | ⚪ |
| **34** | [034-ven-supabase-restaurant-booking-edge-fn](034-ven-supabase-restaurant-booking-edge-fn.md) | supabase | `restaurant-booking` edge fn + RestaurantDetail UI | ven-033 | ⚪ |

## Phase 6 — Coffee tours post-MVP (44–51)

| Step | Task | Was CTI | Status |
|------|------|---------|--------|
| **44** | [044-ven-post-coffee-tour-embeddings](044-ven-post-coffee-tour-embeddings.md) | CTI-011 | ⚪ |
| **45** | [045-ven-verify-coffee-tour-sources](045-ven-verify-coffee-tour-sources.md) | CTI-012 | ⚪ |
| **46** | [046-ven-adk-coffee-tour-discovery](046-ven-adk-coffee-tour-discovery.md) | CTI-013 | ⚪ |
| **47** | [047-ven-save-coffee-tour](047-ven-save-coffee-tour.md) | CTI-014 | ⚪ |
| **48** | [048-ven-coffee-tour-compare-drawer](048-ven-coffee-tour-compare-drawer.md) | CTI-015 | ⚪ |
| **49** | [049-ven-coffee-tour-query-chips](049-ven-coffee-tour-query-chips.md) | CTI-016 | ⚪ |
| **50** | [050-ven-coffee-tour-workflow](050-ven-coffee-tour-workflow.md) | CTI-018 | ⚪ |
| **51** | [051-ven-coffee-tour-whatsapp-handoff](051-ven-coffee-tour-whatsapp-handoff.md) | CTI-020 | ⚪ |

```text
MVP through 31 → post-mvp 25–34 polish → 44–51 tour enhancements (optional)
```

*Updated: 2026-05-28 — CTI merged into VEN*
