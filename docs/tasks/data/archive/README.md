---
title: Data layer — archived completed specs
updated: 2026-06-02
active_backlog: ../../PR/tasks-data/INDEX-data.md
evidence: ../evidence/
---

# Data archive — completed tasks

**26 specs** moved here from [`../tasks-data/`](../tasks-data/) and [`../../PR/tasks-data/`](../../PR/tasks-data/) on **2026-06-01–02**. Live DB verification: [`../audit/DATA-FORENSIC-AUDIT-2026-06-01.md`](../audit/DATA-FORENSIC-AUDIT-2026-06-01.md).

**Active backlog:** [`../../PR/tasks-data/INDEX-data.md`](../../PR/tasks-data/INDEX-data.md) · **PR remediation (DATA-048 / #23):** [`../../PR/INDEX.md`](../../PR/INDEX.md) · **Done AUTH specs:** [`../../archive/data-A/`](../../archive/data-A/README.md)

Do not re-execute archived specs unless a regression reopens them.

---

## Archived specs

| ID | File | Evidence |
|----|------|----------|
| DATA-001 | [data-001-inventory.md](./data-001-inventory.md) | [data-001](../evidence/data-001-inventory.md) |
| DATA-002 | [data-002-catalog-contract.md](./data-002-catalog-contract.md) | [data-002](../evidence/data-002-three-kind-contract.md) |
| DATA-003 | [data-003-cafe-seed.md](./data-003-cafe-seed.md) | [data-003](../evidence/data-003-cafe-signoff.md) |
| DATA-004 | [data-004-restaurant-seed.md](./data-004-restaurant-seed.md) | [data-004](../evidence/data-004-restaurant-verify.md) |
| DATA-005 | [data-005-nightclub-seed.md](./data-005-nightclub-seed.md) | [data-005](../evidence/data-005-nightclub-seed.md) |
| DATA-006 | [data-006-golden-queries.md](./data-006-golden-queries.md) | [data-006](../evidence/data-006-venue-golden-queries.md) |
| DATA-007 | [data-007-cache-audit.md](./data-007-cache-audit.md) | [DATA-007](../../testing/evidence/DATA-007-cache-audit.md) |
| DATA-009 | [data-009-schema-migrations-m1-m3.md](./data-009-schema-migrations-m1-m3.md) | [data-009](../evidence/data-009-migrations.md) |
| DATA-010 | [data-010-postgres-search-path-hardening.md](./data-010-postgres-search-path-hardening.md) | [data-010](../evidence/data-010-search-path.md) |
| DATA-010b | [data-010b-postgres-migration-hygiene.md](./data-010b-postgres-migration-hygiene.md) | [data-010b](../evidence/data-010b-migration-hygiene.md) |
| DATA-011 | [data-011-edge-hardening-evidence.md](./data-011-edge-hardening-evidence.md) | [data-011](../evidence/data-011-edge-matrix.md) |
| DATA-012 | [data-012-events-data-inventory.md](./data-012-events-data-inventory.md) | [data-012](../evidence/data-012-events-inventory.md) |
| DATA-019 | [data-019-rentals-data-inventory.md](./data-019-rentals-data-inventory.md) | [data-019](../evidence/data-019-rentals-inventory.md) |
| DATA-020 | [data-020-leads-rental-fk-columns.md](./data-020-leads-rental-fk-columns.md) | live cols |
| DATA-021 | [data-021-showings-lead-bridge.md](./data-021-showings-lead-bridge.md) | [data-021](../evidence/data-021-showings-bridge.md) |
| DATA-023 | [data-023-rental-golden-queries.md](./data-023-rental-golden-queries.md) | SQL evidence |
| DATA-026 | [data-026-trips-data-inventory.md](./data-026-trips-data-inventory.md) | [data-026](../evidence/data-026-trips-inventory.md) |
| DATA-027 | [data-027-trip-items-insert-rpc.md](./data-027-trip-items-insert-rpc.md) | [data-027](../evidence/data-027-trip-items-rpc.md) |
| DATA-029 | [data-029-commerce-trip-id-linkage.md](./data-029-commerce-trip-id-linkage.md) | [data-029](../evidence/data-029-commerce-trip-id.md) |
| DATA-030 | [data-030-trips-golden-queries.md](./data-030-trips-golden-queries.md) | [data-030](../evidence/data-030-trips-golden-queries.md) |
| DATA-034 | [data-034-maps-geo-inventory.md](./data-034-maps-geo-inventory.md) | [data-034](../evidence/data-034-maps-geo-inventory.md) |
| DATA-035 | [data-035-cafe-listings-venue-anchor-seed.md](./data-035-cafe-listings-venue-anchor-seed.md) | 17 café rows |
| DATA-039 | [DATA-039-restaurants-schema-patch.md](./DATA-039-restaurants-schema-patch.md) | 44/44 neighborhood |
| DATA-040 | [DATA-040-embedding-jobs.md](./DATA-040-embedding-jobs.md) | triggers live |
| DATA-047 | [DATA-047-search-logs.md](./DATA-047-search-logs.md) | hybrid writes |
| SEARCH-003 | [SEARCH-003-restaurant-hybrid.md](./SEARCH-003-restaurant-hybrid.md) | `b7265b9` |

**Index-only Done (no spec file):** DATA-042 event_signals · DATA-043 rental_signals · DATA-044 neighborhood_profiles · [VEC-001](../../vector/VEC-001-pgvector-inventory-and-duplicate-index-plan.md)
