# MVP scope audit

**Date:** 2026-06-09  
**Rule:** Every open issue → exactly one bucket: **Core · MVP · Post-MVP · Advanced**  
**PRD guard:** Events PRD — no sponsor automation / advanced AI OS in MVP

---

## Verdict

| Pack | In MVP bucket? | Scope creep risk | Action |
|------|----------------|------------------|--------|
| **Core** | ✅ | Low | SAN-115/178/546 launch ledger |
| **Events EVP** | ✅ | Low | Roberto publish Done |
| **Maps** | ✅ | Low | SAN-368 ADK prod in flight |
| **Venues VEN** | ✅ | 🟡 | SAN-792–796 parallel track — dedupe |
| **Real Estate** | ✅ | Low | RE-001–020 tracked |
| **Trips** | ✅ | Low | TRIP shell — post-launch polish OK |
| **Partners** | 🟡 | Medium | PTR-AI in ADV; MKT P1 optional |
| **OpenClaw** | ❌ | **High if pulled** | 40 filed — **freeze post-MVP** |
| **Sponsors** | ❌ | **High** | GS-009 SAN-231 Backlog — not Cycle 1 |
| **Intelligence** | ❌ | **High** | 43 open orphans in AI & Intelligence |
| **Revenue R2+** | ❌ | **High** | 32 tasks — gated on SAN-178 |
| **VEB** | 🟡 | Medium | Filed MVP tier 003–012 — **not launch gate** |
| **AIE pack** | ❌ | **High** | SAN-757+ — Advanced Events OS |

---

## Open issues mis-bucketed (sample)

### Intelligence in MVP cycle 🔴

| SAN | Labels | Status | Should be |
|-----|--------|--------|-----------|
| SAN-383 | phase:intel-1b | In Progress | Post-MVP |
| SAN-372 | phase:intel-1b | In Progress | Post-MVP |
| SAN-373 | phase:intel-1b | In Progress | Post-MVP |
| SAN-787 | track:intelligence | Backlog | Post-MVP |
| SAN-791 | track:intelligence | Backlog | Post-MVP |

### Commerce creep 🟡

| SAN | Title | Status | Should be |
|-----|-------|--------|-----------|
| SAN-727 | ECOM-C-023 Stripe re-proof | Todo | MVP only if blocks SAN-178 |
| SAN-720 | ECOM-C-019 AI E2E checkout | Backlog | Post-MVP |
| SAN-643 | ECOM-C-015 Cart state UI | Backlog | Post-MVP |

### Events advanced 🟡

| SAN | Title | Status | Should be |
|-----|-------|--------|-----------|
| SAN-757 | AIE-000 Events OS pack | Backlog | Advanced |
| SAN-759–765 | AIE-005…011 | Backlog | Advanced |
| SAN-231 | GS-009 sponsor research | Backlog | Post-MVP |

### Venues duplicate track 🔴

| SAN | Spec in title | Canonical |
|-----|---------------|-----------|
| SAN-792 | DATA-VEN-001 | DATA-001 SAN-325 |
| SAN-793 | VEN-010 | SAN-293 |
| SAN-794 | VEN-015 | SAN-298 |
| SAN-795 | VEN-020 | SAN-307 |
| SAN-796 | VEN-025 | SAN-314 |

---

## Bucket assignment rules (enforce at create)

| Label | Bucket |
|-------|--------|
| `phase:launch` + north-star proof | **Core / MVP exit** |
| `phase:mvp` + persona P0 | **MVP** |
| `phase:post-mvp` | **Post-MVP** |
| `phase:intel-*` | **Advanced** |
| `prefix:OCL` | **Advanced** |
| `prefix:VEB` + tier advanced | **Advanced** |
| `prefix:AIE` | **Advanced** |

---

## Actions

1. **Launch scope freeze** — [`launch-scope-freeze.md`](./launch-scope-freeze.md)
2. Cancel or dup **SAN-792–796** venue orphan track
3. Label audit: add `phase:post-mvp` to intel-1b open issues if not launch-critical
4. **Do not import** Revenue R2–R5 until SAN-178 Done
5. Re-audit after CSV export with label column fresh
