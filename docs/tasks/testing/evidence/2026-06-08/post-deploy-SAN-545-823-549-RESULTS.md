# Post-deploy validation — SAN-545 / SAN-823 / SAN-549

**Date:** 2026-06-08  
**Production:** https://www.mdeai.co/  
**PR #136 (SAN-545 + SAN-823):** OPEN — **not merged** as of this run

---

## SAN-545 — Rental Embed API 403 Fix

**Area:** Rentals / Camila

### API proof (production)

| Query | hybridUsed | embedStatus | results | source |
|-------|------------|-------------|---------|--------|
| `2BR near Estadio` | ✅ true | ⏸ null (pre-#136) | 4 | supabase |
| `furnished apartment laureles` | ✅ true | ⏸ null | 4 | supabase |
| `apartment envigado` | ✅ true | ⏸ null | 4 | supabase |

**Interpretation:** Semantic hybrid path is **live** on prod (`hybridUsed:true`). Structured telemetry (`embedStatus`, `embedHttpStatus`) ships with **PR #136** — not on prod yet.

### Branch tests (PR #136)

- `query-embedding.test.ts` — PASS (incl. HTTP 403 case)
- `search-rentals-date-passthrough.test.ts` — PASS

---

## SAN-823 — Rentals Fast-Path

**Area:** Rentals / Camila

### Production

| Check | Result |
|-------|--------|
| Parser confidence fix (`apartments in laureles`) | ⏸ **Not on prod** until PR #136 merges |
| Browser hero → `/chat` fast-path | ⏸ Blocked — deploy #136 first |
| Vitest `rental-search-fast-path` + `rental-query-parser` | ✅ PASS on branch (31 tests) |

### Expected after merge

- `apartments in laureles` → search immediately, no clarify
- `help me find a place` / `I am moving soon` → no fast-path (clarify via agent)

---

## SAN-549 — Nightlife Intent Routing

**Area:** Venues / Tourist

### Production API (`/api/grounded/search`)

| Query | intent param | venueKind | results |
|-------|--------------|-----------|---------|
| `clubs in provenza` | nightlife | nightlife | 5 |
| `cafes in laureles` | cafe | cafe | 5 |

### Disk / unit

- `search-grounded-places-quality` + fast-path tests — **22/22 PASS**

### Prior prod browser (2026-06-04)

- `rooftop cocktails in Provenza tonight` — nightlife cards + pins **PASS**  
- Evidence: `tasks/testing/evidence/SAN-549-prod-live-RESULTS-2026-06-04.md`

### Known gap (out of SAN-549 scope)

- Generic `popular venues tonight in Provenza` → event fast-path (VEN-025)

---

## Close recommendations

| Task ID | Full task name | Ready to close? |
|---------|----------------|-----------------|
| SAN-545 | Rental Embed API 403 Fix | **Partial** — hybrid works on prod; close after **PR #136 merge** + prod curl shows `embedStatus:"ok"` |
| SAN-823 | Rentals Fast-Path | **No** — requires **PR #136 merge** + `/chat` browser proof |
| SAN-549 | Nightlife Intent Routing | **Yes** — already Done 2026-06-04; API re-check 2026-06-08 green |

## Next

1. **Merge PR #136** → re-run SAN-545 + SAN-823 prod proof  
2. **SAN-546 — Prod Matrix Without Events** — start after 545/823 prod green
