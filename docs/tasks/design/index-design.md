---
title: "mdeai — Design Track Index (redirect)"
updated: 2026-06-10
redirect: INDEX.md
---

# Design track index — moved

**Canonical index (progress + verification):** [**INDEX.md**](INDEX.md) — combined queue, forensic status table, gaps, and verify commands (verified 2026-06-10).

Use **INDEX.md** for:

- D-01…D-14 status dots · % complete · disk proof
- Next assignable tasks (SAN-576 · SAN-578 · SAN-580)
- Critical path and dedup summary

---

## Extended reference (kept below)

The sections below remain for **partners program** context and historical narrative. Task status in those sections may be stale — trust [**INDEX.md**](INDEX.md) for D-track progress.

---

# mdeai — Design Track Index (historical narrative)

> **One line:** execute `design-process.md` as an ordered, flagship-first task list. **Track A (revenue) never pauses for this.** Net-new work = **4 docs + 2 wireframes + 1 install + a re-skin chain** — days of design, then build interleaved with the MVP.

**Locked decisions** (from `design-process.md` §0): LIGHT background · **2 brand colors** (teal `--primary` + gold `--accent`) · **code-first** · **70% shadcn / 20% 21st / 10% custom**.

**Guardrail:** Track A = revenue / North-Star. Everything below is **Track B**.

---

## Already done (inputs — do not redo)

`design-plan.md` · `concierge-os-direction.md` · `design-process.md` · `README.md` · `docs/component-inventory.md` · `wireframe-d/home-wireframe.html` · `mockups/*.html` · `travelai-links.md`.

---

## Dedup map — design epic ↔ existing issues *(2026-06-05; relations wired in Linear)*

| D-task | Existing issue(s) | Action |
|---|---|---|
| **D-08** | SAN-360 · SAN-437 · shipped cards | **REUSE** — consolidate into `VenueCardShell` |
| **D-05** | SAN-261 · SAN-244 · SAN-267 | **Supersede** — old wireframes |
| **D-09** | SAN-478 · SAN-490 · SAN-491 · SAN-519 | **Input/extend** — skin feeds route builds |
| **D-10** | SAN-255 · SAN-259 · SAN-251 · SAN-253 | **Extend** — re-skin dashboards |
| **D-11** | SAN-247 · SAN-524 | **Supersede/extend** |
| **D-12** | SAN-523 · SAN-522 | **Fold** — mobile concierge ⊂ D-12 |
| **D-13** | SAN-232 · SAN-718 | **Reuse** home chrome + live rows |
| **D-14** | SAN-265 · SAN-268 | **Extend** polish to re-skinned surfaces |

**Resolved 2026-06-05:** D-08 reframed as consolidate-not-rebuild; stale `WIRE-*` (SAN-244/247/261/267) **Canceled**.

---

## Partners track *(separate program — not D-01…D-14)*

Supply + B2B marketplace — own Linear project **Partners**, epic **SAN-667**. See [`../../partners/`](../../partners/) if present, or Linear project Partners.

**Relationship to D-track:** D-track = consumer re-skin; Partners = supply surfaces. Shared: `VenueCardShell`, CopilotKit, Maps.

Implementation order (marketing site first → schema → pilot → verticals): see Linear epic SAN-667 and partner wireframes under [`../../wireframes/HTML/`](../../wireframes/HTML/).
