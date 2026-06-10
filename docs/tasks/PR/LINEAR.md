---
title: PR remediation — Linear map
updated: 2026-06-02T13:42Z
linear_sync: 2026-06-02T13:42Z
project: MDEAPP
project_url: https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues
label: track:pr
queue: ../linear/pr-remediation-queue.json
archive: ./archive/README.md
main_sha: bf40ef9
prod_sha: bf40ef9
stable_beta_gate: SAN-462
scheduled_soak: 1/3
---

# PR remediation ↔ Linear

> **Board:** [MDEAPP project issues](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues) · filter **`label:track:pr`**  
> **Specs:** [`INDEX.md`](./INDEX.md) · **Tracker:** [`PROGRESS-TRACKER.md`](./PROGRESS-TRACKER.md) · **Status:** [`tasks/STATUS-2026-06-02.md`](./tasks/STATUS-2026-06-02.md)

| Order | PR | Linear | Status |
|------:|----|--------|--------|
| 0 | PR-13 | [SAN-447](https://linear.app/sanjiovani/issue/SAN-447) | Done |
| 1 | PR-01 | [SAN-451](https://linear.app/sanjiovani/issue/SAN-451) | Done (#34) |
| 2 | PR-08 | [SAN-445](https://linear.app/sanjiovani/issue/SAN-445) | Done |
| 3 | PR-04 | [SAN-446](https://linear.app/sanjiovani/issue/SAN-446) | Done — [#40](https://github.com/amo-tech-ai/mdeapp/pull/40) |
| 4 | PR-05 | [SAN-452](https://linear.app/sanjiovani/issue/SAN-452) | Done — [#42](https://github.com/amo-tech-ai/mdeapp/pull/42) |
| 5 | PR-06 | [SAN-453](https://linear.app/sanjiovani/issue/SAN-453) | Done — [#43](https://github.com/amo-tech-ai/mdeapp/pull/43) |
| 6 | PR-07 | [SAN-454](https://linear.app/sanjiovani/issue/SAN-454) | Done — [#44](https://github.com/amo-tech-ai/mdeapp/pull/44) |
| 7 | PR-09 | [SAN-455](https://linear.app/sanjiovani/issue/SAN-455) | Done — #23 closed |
| 8 | PR-02 | [SAN-450](https://linear.app/sanjiovani/issue/SAN-450) | Done — [#41](https://github.com/amo-tech-ai/mdeapp/pull/41) |
| 9 | PR-03 | [SAN-449](https://linear.app/sanjiovani/issue/SAN-449) | Done — [#41](https://github.com/amo-tech-ai/mdeapp/pull/41) |
| 10 | PR-10 | [SAN-457](https://linear.app/sanjiovani/issue/SAN-457) | Done — [#31](https://github.com/amo-tech-ai/mdeapp/pull/31) |
| 11 | PR-11 | [SAN-461](https://linear.app/sanjiovani/issue/SAN-461) | Done — closed #19/#20 |
| 12 | PR-12 | [SAN-456](https://linear.app/sanjiovani/issue/SAN-456) | Done — [#46](https://github.com/amo-tech-ai/mdeapp/pull/46) |
| — | **OPS-001** | [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) | **In Progress** — **1/3** scheduled soak (2026-06-02 ✅) |
| 17 | PR-17 | [SAN-459](https://linear.app/sanjiovani/issue/SAN-459) | Done — in #40 |
| 18 | PR-16 | [SAN-458](https://linear.app/sanjiovani/issue/SAN-458) | **In Progress** — `floor.yml` ✅ @ `bf40ef9`; branch protection admin pending |
| 19 | PR-18 | [SAN-460](https://linear.app/sanjiovani/issue/SAN-460) | Todo — after soak |
| 21 | PR-14 | [SAN-448](https://linear.app/sanjiovani/issue/SAN-448) | Done |
| 22 | PR-15 | [SAN-444](https://linear.app/sanjiovani/issue/SAN-444) | Backlog |

**UX (Stable Beta train):** UX-020 [SAN-436](https://linear.app/sanjiovani/issue/SAN-436) **Done** ([#45](https://github.com/amo-tech-ai/mdeapp/pull/45) → `2da978f`). UX-023 [SAN-437](https://linear.app/sanjiovani/issue/SAN-437) Todo — **blocked by soak** until SAN-462 completes.

**Soak:** UX-034 Done [SAN-322](https://linear.app/sanjiovani/issue/SAN-322); **1/3 scheduled** on [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) (run [26820069434](https://github.com/amo-tech-ai/mdeapp/actions/runs/26820069434) 2026-06-02).

**Board sort (Launch Critical):** **SAN-462** (2 more scheduled greens) → finish **SAN-458** admin step → **SAN-437**.

**Note:** PR-08/04 reuse DATA issues SAN-445/446 — one unit of work per row in [`INDEX.md`](./INDEX.md) duplicate map.
