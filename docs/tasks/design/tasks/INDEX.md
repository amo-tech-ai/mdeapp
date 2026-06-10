---
title: Design Track — Task Index (D-01…D-14)
updated: 2026-06-05
epic: SAN-566
linear_project: UX
---

# Design track tasks — INDEX

**Canonical specs:** `./D-*.md` · **Process:** [`../docs/design-process.md`](../docs/design-process.md) · **Legacy map:** [`_legacy-map.md`](_legacy-map.md)

**Progress:** **8/14 Done** (D-01…D-08) · **Next assignable:** D-09 (SAN-575) + D-13 (SAN-579) — both unblocked

| D | Linear | Phase | Task | Status | Blockers | Spec |
|---|--------|-------|------|--------|----------|------|
| **D-01** | [SAN-567](https://linear.app/sanjiovani/issue/SAN-567) | 0 | IA + route reconciliation | ✅ Done | — | [D-01](D-01-ia-journey.md) |
| **D-02** | [SAN-568](https://linear.app/sanjiovani/issue/SAN-568) | 0 | Design system doc | ✅ Done | — | [D-02](D-02-design-system.md) |
| **D-03** | [SAN-569](https://linear.app/sanjiovani/issue/SAN-569) | 0 | Image strategy | ✅ Done | — | [D-03](D-03-images.md) |
| **D-04** | [SAN-570](https://linear.app/sanjiovani/issue/SAN-570) | 0 | Component inventory | ✅ Done | — | [D-04](D-04-component-inventory.md) |
| **D-05** | [SAN-571](https://linear.app/sanjiovani/issue/SAN-571) | 1 | Discovery wireframe (flagship) | ✅ Done | D-01 | [D-05](D-05-discovery-wireframe.md) |
| **D-06** | [SAN-572](https://linear.app/sanjiovani/issue/SAN-572) | 1 | Dashboard wireframe | ✅ Done | D-01 | [D-06](D-06-dashboard-wireframe.md) |
| **D-07** | [SAN-573](https://linear.app/sanjiovani/issue/SAN-573) | 2 | P0 shadcn install | ✅ Done | — | [D-07](D-07-shadcn-install.md) |
| **D-08** | [SAN-574](https://linear.app/sanjiovani/issue/SAN-574) | 3 | VenueCard + BrowseLayout | ✅ Done | — | [D-08](D-08-venue-card.md) |
| **D-09** | [SAN-575](https://linear.app/sanjiovani/issue/SAN-575) | 3 | Re-skin discovery routes | ✅ Done | — | [D-09](D-09-reskin-routes.md) |
| **D-10** | [SAN-576](https://linear.app/sanjiovani/issue/SAN-576) | 3 | Re-skin dashboard | ☐ Ready | D-06✓ D-07✓ D-08✓ | [D-10](D-10-dashboard-reskin.md) |
| **D-11** | [SAN-577](https://linear.app/sanjiovani/issue/SAN-577) | 3 | Map workspace | ☐ Blocked | D-08✓ D-09 | [D-11](D-11-map-workspace.md) |
| **D-12** | [SAN-578](https://linear.app/sanjiovani/issue/SAN-578) | 3 | Concierge surface band | ☐ Blocked | D-09 | [D-12](D-12-concierge-band.md) |
| **D-13** | [SAN-579](https://linear.app/sanjiovani/issue/SAN-579) | 3 | Re-skin Home `/` | ☐ **Ready** | D-08✓ | [D-13](D-13-home-reskin.md) |
| **D-14** | [SAN-580](https://linear.app/sanjiovani/issue/SAN-580) | 4 | Polish + proof | ☐ Blocked | D-09…D-13 | [D-14](D-14-polish-proof.md) |

## Critical path

```
D-01 ─┬─ D-05 ─┬─ D-08 ─ D-09 ─┬─ D-11 ─ D-12 ─┐
      └─ D-06 ─┘                 └─ D-13 ──────────┤
D-02/D-03/D-04 (parallel docs)   D-10 (parallel)  └─ D-14
D-07 (install) ────────────────────────────────────────┘
```

## Agent assignment (2026-06-05)

| Safe now? | Issue | Notes |
|-----------|-------|-------|
| — | SAN-573 | **Done** — PR #76 + hotfix #78 |
| — | SAN-574 | **Done** — PR #79 merged, verified 2026-06-06 |
| **Yes** | SAN-575 | D-09 re-skin discovery routes — start now |
| **Yes** | SAN-579 | D-13 home re-skin — start now (parallel to D-09) |
| **Yes** | SAN-576 | D-10 dashboard re-skin — ready (non-MVP, can follow D-09) |
| No | SAN-577, SAN-578 | Wait on D-09 first |
| No | SAN-580 | Wait on D-09…D-13 all Done |

## Dedup (do not duplicate)

| D-task | Track A / legacy | Relationship |
|--------|------------------|--------------|
| D-08 | SAN-360, SAN-437, shipped cards | **Consolidate** into VenueCard |
| D-09 | SAN-478, 490, 491, 519 | **Skin input** only |
| D-13 | SAN-232 home chrome | **Reuse** |
| D-14 | SAN-265, SAN-268 | **Extend** to new surfaces |

Full table: [`../index-design.md`](../index-design.md#dedup-map--design-epic--existing-issues-2026-06-05-relations-wired-in-linear)
