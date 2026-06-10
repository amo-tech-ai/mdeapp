# MIS Linear import report — 2026-05-30

## Summary

| Metric | Count |
|--------|------:|
| Registry imported | 57 (MIS 35, INT 22) |
| Created | 1 |
| Updated | 56 |
| Errors | 0 |
| Phase 1 shipped (Done) | 11/10 |
| Collisions | 8 |
| Missing AI specs (not imported) | 9 |

## Phase 1 status

**Shipped (MIS-M1):** VEC-001, DATA-039, DATA-040, DATA-041, DATA-042, DATA-043, DATA-044, DATA-045, DATA-047, SEARCH-003, MASTRA-MIS-001

**Next execution (Phase 1b):** VEC-003 → VEC-004 → SEARCH-001 → SEARCH-002 → AI-004 → AI-003 → DATA-046 → VEC-005

## Missing tasks (no disk spec — not imported)

- **AI-005:** No spec in intelligence-plan §5.5 — gap in AI-001…020 range
- **AI-006:** No spec in intelligence-plan §5.5
- **AI-007:** No spec in intelligence-plan §5.5
- **AI-008:** No spec in intelligence-plan §5.5
- **AI-009:** No spec in intelligence-plan §5.5
- **AI-016:** No spec in intelligence-plan §5.5
- **AI-017:** No spec in intelligence-plan §5.5
- **AI-018:** No spec in intelligence-plan §5.5
- **AI-019:** No spec in intelligence-plan §5.5

## Duplicate / collision report

- **VEN-002:** SAN-363 vs SAN-159
- **VEN-001:** SAN-362 vs SAN-158
- **EVT-002:** SAN-366 vs SAN-120
- **EVT-014:** SAN-132 vs SAN-118
- **EVT-013:** SAN-131 vs SAN-117
- **EVT-001:** SAN-119 vs SAN-115
- **CAF-001:** SAN-114 vs SAN-109
- **MAP-010:** SAN-228 vs SAN-104

## Dependency gaps

All blockers in registry.

## Labels

- `track:intelligence` ✅
- `track:data` ✅
- `phase:intel-0` ✅
- `phase:intel-1` ✅
- `phase:intel-1b` ✅
- `phase:intel-deferred` ✅
- `phase:intel-conv` ✅
- `phase:intel-memory` ✅
- `stack:supabase` ✅
- `stack:pgvector` ✅
- `stack:search` ✅
- `stack:mastra` ✅
- `layer:observability` ✅
- `layer:signals` ✅
- `layer:ranking` ✅
- `layer:grounding` ✅
- `layer:routing` ✅
- `layer:memory` ✅
- `intel-order:01` ✅
- `intel-order:11` ✅
- `intel-order:12` ✅
- `intel-order:18` ✅
- `intel-order:02` ✅
- `intel-order:03` ✅
- `intel-order:04` ✅
- `intel-order:05` ✅
- `intel-order:06` ✅
- `intel-order:07` ✅
- `intel-order:08` ✅
- `intel-order:17` ✅
- `intel-order:09` ✅
- `intel-order:13` ✅
- `intel-order:14` ✅
- `intel-order:10` ✅
- `intel-order:11` ✅
- `intel-order:16` ✅
- `intel-order:15` ✅
- `int-seq:01` ✅
- `int-seq:02` ✅
- `int-seq:03` ✅
- `int-seq:04` ✅
- `int-seq:05` ✅
- `int-seq:06` ✅
- `int-seq:07` ✅
- `int-seq:08` ✅
- `int-seq:09` ✅
- `int-seq:10` ✅
- `int-seq:11` ✅
- `int-seq:12` ✅
- `int-seq:13` ✅
- `int-seq:14` ✅
- `int-seq:15` ✅
- `int-seq:16` ✅
- `int-seq:17` ✅
- `int-seq:18` ✅
- `int-seq:19` ✅
- `int-seq:20` ✅
- `int-seq:21` ✅
- `int-seq:22` ✅

## Views (create manually in Linear)

### INTELLIGENCE
```text
project:MDEAPP label:track:intelligence
```

### INTEL Phase 1
```text
project:MDEAPP label:phase:intel-1 state:Todo,"In Progress","In Review","Done"
```

### INT Conversational (INT-001…022)
```text
project:MDEAPP label:phase:intel-conv
```

### INT Memory (INT-011…020)
```text
project:MDEAPP label:phase:intel-memory
```

### INTEL Search
```text
project:MDEAPP label:track:intelligence label:stack:search
```

### INTEL Supabase
```text
project:MDEAPP label:track:intelligence label:stack:supabase
```

### INTEL Ranking
```text
project:MDEAPP label:track:intelligence label:layer:ranking
```

### INTEL Grounding
```text
project:MDEAPP label:track:intelligence label:layer:grounding
```

### INTEL Observability
```text
project:MDEAPP label:track:intelligence label:layer:observability
```

### INT Routing layer
```text
project:MDEAPP label:layer:routing
```

### INT Memory layer
```text
project:MDEAPP label:layer:memory
```

## SAN ↔ SPEC map (new issues)

| SAN-426 | MASTRA-MIS-001 |

---
Hub: [`11-intelligence-views.md`](11-intelligence-views.md)
