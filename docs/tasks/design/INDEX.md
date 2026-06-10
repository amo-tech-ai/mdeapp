---
title: Design Track — Task Index (D-01…D-14)
updated: 2026-06-10
epic: SAN-566
linear_project: UX
verified: disk + Linear + vitest 2026-06-10
---

# Design track — INDEX (canonical)

**Epic:** [SAN-566 · Design Track — light-luxury re-skin + Concierge OS (D-01–D-14)](https://linear.app/sanjiovani/issue/SAN-566)  
**Specs:** [`tasks/D-*.md`](tasks/) · **Process:** [`docs/design-process.md`](docs/design-process.md) · **Legacy map:** [`tasks/_legacy-map.md`](tasks/_legacy-map.md)  
**Wireframes:** [`../../wireframes/index-wire.md`](../../wireframes/index-wire.md)

## Progress summary

| Metric | Value |
|--------|------:|
| **Linear Done** | 11 / 14 (79%) |
| **Forensic complete** (disk proof) | 10 🟢 · 2 🟡 · 2 ⚪ |
| **Next assignable** | D-10 (SAN-576) · D-12 (SAN-578) · D-14 (SAN-580) |
| **Epic SAN-566** | In Progress |

**Legend:** 🟢 complete · 🟡 in progress / gaps · 🔴 failed · ⚪ not started

---

## D-01…D-14 — verified status

| D | Linear | Phase | Task | Dot | % | Proof (2026-06-10) | Spec |
|---|--------|-------|------|:---:|:---:|---|---|
| **D-01** | [SAN-567](https://linear.app/sanjiovani/issue/SAN-567) | 0 | IA + route reconciliation | 🟢 | 100 | [`docs/ia-journey.md`](docs/ia-journey.md) on disk · Linear Done | [tasks/D-01](tasks/D-01-ia-journey.md) |
| **D-02** | [SAN-568](https://linear.app/sanjiovani/issue/SAN-568) | 0 | Design system doc | 🟢 | 100 | [`docs/design-system.md`](docs/design-system.md) · Linear Done | [tasks/D-02](tasks/D-02-design-system.md) |
| **D-03** | [SAN-569](https://linear.app/sanjiovani/issue/SAN-569) | 0 | Image strategy | 🟢 | 100 | [`docs/images.md`](docs/images.md) · Linear Done | [tasks/D-03](tasks/D-03-images.md) |
| **D-04** | [SAN-570](https://linear.app/sanjiovani/issue/SAN-570) | 0 | Component inventory | 🟢 | 100 | [`docs/component-inventory.md`](docs/component-inventory.md) · Linear Done | [tasks/D-04](tasks/D-04-component-inventory.md) |
| **D-05** | [SAN-571](https://linear.app/sanjiovani/issue/SAN-571) | 1 | Discovery wireframe (flagship) | 🟢 | 100 | [`wireframe/explore-wireframe.html`](wireframe/explore-wireframe.html) · Linear Done | [tasks/D-05](tasks/D-05-discovery-wireframe.md) |
| **D-06** | [SAN-572](https://linear.app/sanjiovani/issue/SAN-572) | 1 | Dashboard wireframe | 🟢 | 100 | [`wireframe/dashboard-wireframe.html`](wireframe/dashboard-wireframe.html) · Linear Done | [tasks/D-06](tasks/D-06-dashboard-wireframe.md) |
| **D-07** | [SAN-573](https://linear.app/sanjiovani/issue/SAN-573) | 2 | P0 shadcn install | 🟢 | 100 | `src/components/ui/{tabs,command,avatar,carousel,sonner,sidebar}.tsx` · PR #76+#78 · Linear Done | [tasks/D-07](tasks/D-07-shadcn-install.md) |
| **D-08** | [SAN-574](https://linear.app/sanjiovani/issue/SAN-574) | 3 | VenueCard + BrowseLayout | 🟢 | 95 | `src/components/browse/*` · `scripts/san-574-scope-gate.sh` PASS · vitest 13/13 · Linear Done · *spec frontmatter still `Todo`* | [tasks/D-08](tasks/D-08-venue-card.md) |
| **D-09** | [SAN-575](https://linear.app/sanjiovani/issue/SAN-575) | 3 | Re-skin discovery routes | 🟡 | 85 | `BrowseLayout` on `/restaurants` `/rentals` `/nightlife` `/cafes` · vitest browse 23/23 · Linear Done · **gap:** `/cafes` no map column · shadcn debt (D-08 table) open | [tasks/D-09](tasks/D-09-reskin-routes.md) |
| **D-10** | [SAN-576](https://linear.app/sanjiovani/issue/SAN-576) | 3 | Re-skin dashboard | ⚪ | 0 | Linear Backlog · no `SidebarProvider` on `/saved` `/trips` `/me/tickets` | [tasks/D-10](tasks/D-10-dashboard-reskin.md) |
| **D-11** | [SAN-577](https://linear.app/sanjiovani/issue/SAN-577) | 3 | Map workspace | 🟡 | 75 | `BrowseMapPanel` + `useBrowseMapSync` on restaurants/rentals/events/nightlife · Linear Done · **gap:** `/cafes` · `/chat` pin parity not fully verified | [tasks/D-11](tasks/D-11-map-workspace.md) |
| **D-12** | [SAN-578](https://linear.app/sanjiovani/issue/SAN-578) | 3 | Concierge surface band | ⚪ | 0 | Linear Backlog · no full-width AI band on browse pages | [tasks/D-12](tasks/D-12-concierge-band.md) |
| **D-13** | [SAN-579](https://linear.app/sanjiovani/issue/SAN-579) | 3 | Re-skin Home `/` | 🟢 | 90 | `src/components/home/*` on `/` · [SAN-718](https://linear.app/sanjiovani/issue/SAN-718) live discovery rows Done · Linear Done · **open:** ⌘K `CommandDialog` optional slice | [tasks/D-13](tasks/D-13-home-reskin.md) |
| **D-14** | [SAN-580](https://linear.app/sanjiovani/issue/SAN-580) | 4 | Polish + proof | ⚪ | 0 | Linear Backlog · no `d-14-polish-RESULTS.md` evidence | [tasks/D-14](tasks/D-14-polish-proof.md) |

---

## Gaps & failures (action list)

| Priority | Item | Affects | Fix |
|----------|------|---------|-----|
| 🔴 | **`tasks/D-08` frontmatter `status: Todo`** + unchecked AC boxes | Index drift | Sync spec to Done; tick AC or note deferred shadcn debt → D-09 |
| 🟡 | **`/cafes` browse — no map column** | D-09 · D-11 | Wire `BrowseMapPanel` like restaurants (SAN-519 follow-up) |
| 🟡 | **D-08 shadcn debt** (ToggleGroup, CardFooter, nova radius) | D-09 polish | Track in D-09 or small follow-up PR |
| 🟡 | **⌘K CommandDialog** on `/` | D-13 optional AC | D-07 `command` primitive installed; wire in D-13 slice |
| ⚪ | **Dashboard re-skin** `/saved` · `/trips` · `/me/tickets` | D-10 | Post-MVP — assign SAN-576 when Track A idle |
| ⚪ | **Concierge AI band** on browse | D-12 | SAN-578 after D-09 map gaps closed |
| ⚪ | **Track B polish evidence** | D-14 | Playwright + a11y on re-skinned surfaces only |
| 🟡 | **`wireframe-d/`** duplicate on disk (untracked) vs git **`wireframe/`** | Local drift | Use `wireframe/` in specs; delete or git-add `wireframe-d/` |

---

## Critical path

```text
D-01 ─┬─ D-05 ─┬─ D-08 ─ D-09 ─┬─ D-11 ─ D-12 ─┐
      └─ D-06 ─┘                 └─ D-13 ──────────┤
D-02/D-03/D-04 (parallel docs)   D-10 (parallel)  └─ D-14
D-07 (install) ────────────────────────────────────────┘
```

**Current frontier:** D-10 · D-12 · D-14 (⚪) · close D-09/D-11 `/cafes` map gap (🟡).

---

## Agent assignment (verified 2026-06-10)

| Safe now? | Issue | Task | Notes |
|-----------|-------|------|-------|
| — | SAN-567…577,579 | D-01…09,11,13 | Linear Done (see gaps above) |
| **Yes** | [SAN-576](https://linear.app/sanjiovani/issue/SAN-576) | D-10 dashboard | Post-MVP · deps satisfied |
| **Yes** | [SAN-578](https://linear.app/sanjiovani/issue/SAN-578) | D-12 concierge band | After `/cafes` map |
| No | [SAN-580](https://linear.app/sanjiovani/issue/SAN-580) | D-14 polish | Needs D-10…D-13 closer to 🟢 |

---

## Dedup (do not duplicate)

| D-task | Track A / legacy | Relationship |
|--------|------------------|--------------|
| D-08 | SAN-360 · SAN-437 · shipped cards | **Consolidate** → `VenueCardShell` (PR #81) |
| D-09 | SAN-478 · SAN-490 · SAN-491 · SAN-519 | **Skin input** — functional owners own routes |
| D-11 | SAN-247 · SAN-524 | **Extend** map workspace |
| D-13 | SAN-232 · SAN-718 | **Reuse** home chrome + live rows |
| D-14 | SAN-265 · SAN-268 | **Extend** polish to re-skinned surfaces only |

Full dedup + partners program (separate track): [`index-design.md`](index-design.md#dedup-map--design-epic--existing-issues-2026-06-05-relations-wired-in-linear).

---

## Verify commands

```bash
cd /home/sk/mdeai/mdeapp
npm test -- browse venue-card --run          # D-08/D-09
bash scripts/san-574-scope-gate.sh           # D-08 scope
test -f docs/tasks/design/docs/ia-journey.md # D-01
test -f src/components/browse/BrowseLayout.tsx
```

**Browser (class U):** `/restaurants` · `/rentals` · `/nightlife` · `/cafes` · `/` — map pins on browse routes except `/cafes`.

---

## Related indexes

| Doc | Owns |
|-----|------|
| [`../../wireframes/index-wire.md`](../../wireframes/index-wire.md) | Full wireframe tree |
| [`../INDEX.md`](../INDEX.md) | All tasks router |
| [`DESIGN-INVENTORY.md`](DESIGN-INVENTORY.md) | Component audit |
| [`index-design.md`](index-design.md) | Extended narrative + partners dedup (legacy; use this file first) |
