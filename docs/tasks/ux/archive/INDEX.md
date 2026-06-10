---
title: UX tasks archive — shipped on Vercel
updated: 2026-06-01
prod_url: https://www.mdeai.co
main_sha_g2d: a8b33a2
main_sha_current: 3af7ea0
vercel_project: https://vercel.com/amo100/mdeapp
evidence: ../../testing/evidence/prod-smoke-2026-06-01.md
active_index: ../tasks/INDEX.md
---

# UX archive — verified on production (Vercel)

Tasks moved here **only** when:

1. Merged to `origin/main`, and  
2. Behavior verified on **https://www.mdeai.co** (G2d prod smoke and/or API probe).

**Not archived** (code local / not on Vercel): UX-028, UX-032, UX-034 — stay in [`../tasks/`](../tasks/INDEX.md).

---

## Vercel / production verification (2026-06-01)

| Check | Result | Notes |
|-------|--------|-------|
| `GET https://www.mdeai.co/` | **200** | Site up |
| `POST /api/copilotkit` | **400** | Runtime bridge alive |
| `POST /api/grounded/search` | **200** + results | Café fast path (#33) — `{"query":"…"}` |
| `POST /api/restaurants/search` | **200**; `imageUrl` empty | Q3 still placeholders until UX-028 ships |
| G2d browser matrix | **PASS** | [`prod-smoke-2026-06-01.md`](../../testing/evidence/prod-smoke-2026-06-01.md) |
| `origin/main` | **`3af7ea0`** | Includes G2d chain `a8b33a2` → café hotfix `259f1ef` |

---

## Shipped on Vercel — feature specs (`shipped-on-vercel/specs/`)

| ID | Linear | PR / gate | Prod proof |
|----|--------|-----------|------------|
| UX-010 | SAN-318 | Epic — G2c + G2d | SAN-318 Done; cards on prod |
| UX-013 | SAN-427 | #25 | Café fallback |
| UX-014 | SAN-428 | #26 | Tool envelope, no `writer.custom` |
| UX-015 | SAN-320 | #21 | Error bridge |
| UX-016 | SAN-430 | #21 | RUN_ERROR e2e |
| UX-019 | SAN-429 | #24 | Event memory guard B-09 |
| UX-021 | SAN-434 | #30 | `data-result-kind`, a11y |
| UX-022 | SAN-435 | #29 | DomainResults |
| UX-025 | SAN-439 | #29 | RestaurantCard rich |
| UX-026 | SAN-442 | #29 | AttractionCard rich |
| UX-027 | SAN-324 | #21 | Rental copy |
| UX-030 | SAN-441 | #30 | Card system e2e |
| UX-031 | SAN-431 | #30 | Live audit spec |
| UX-035 | SAN-433 | G2d Q1 | Rental parser prod |
| UX-036 | — | #28 | Restaurant fast path |
| — | — | **#33** hotfix | `GroundedFastPathPanel` / `/api/grounded/search` (not a UX-### row) |

**Consolidation doc:** [`UX-LEGACY-001-010-CONSOLIDATION.md`](shipped-on-vercel/specs/UX-LEGACY-001-010-CONSOLIDATION.md)

---

## Shipped — test specs (`shipped-on-vercel/tests/`)

UX-T-013, UX-T-014, UX-T-016, UX-T-019, UX-T-027, UX-T-030, UX-T-031, UX-T-035, UX-T-037, UX-T-CK, UX-T-CU — implementations live under `mdeapp/e2e/` and `mdeapp/src/**/__tests__/`.

---

## Legacy QA pack (`legacy/`)

| ID | Status on prod | Successor |
|----|----------------|-----------|
| UX-001 | 🟢 | Concierge restored |
| UX-002 | 🟢 | → UX-015 |
| UX-003 | 🟢 | → UX-035 verified |
| UX-004 | 🔴 canceled | — |
| UX-005 | 🟢 | → UX-015 |
| UX-008 | 🟢 | → UX-027 |

Open legacy successors (active, not archived): UX-006 → UX-032 · UX-007 → UX-033 · UX-009 → UX-034.

---

## Forensic report (point-in-time)

[`UX-TASKS-VERIFICATION-REPORT.md`](UX-TASKS-VERIFICATION-REPORT.md) — pre-archive rubric; superseded for Done tasks by prod smoke above.
