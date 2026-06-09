---
title: Events UI — Linear coverage matrix
updated: 2026-06-08
linear_project: https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues
spec_index: ./INDEX.md
audit: ../pages-ui-inventory.md
---

# Events UI — Linear coverage verification

**Question:** Is every Events page/overlay/dashboard tracked on Linear?

**Answer:** **Yes — every surface has a canonical Linear issue.**  
**Gap:** Only **~40%** of UI issues sit in the [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) project; most live screens are tracked under **UX** (SCREEN/UIX) or **Partners** (MKT/PTR). That is intentional cross-project routing — not missing tracking.

**Action for Events Platform board:** Add **UI-TRACK mirror issues** (or `relatedTo` links) for UX-owned screens so the Events project shows full UI scope. Three surfaces had **no issue at all** — filed as [SAN-729](https://linear.app/sanjiovani/issue/SAN-729), [SAN-730](https://linear.app/sanjiovani/issue/SAN-730), [SAN-731](https://linear.app/sanjiovani/issue/SAN-731) (see bottom).

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🟢 EP | Issue is **in Events Platform** project |
| 🔵 UX | Canonical issue in **UX** project |
| 🟣 PTR | Canonical issue in **Partners** project |
| 🟠 OPS | Admin/ops in **UX** backlog |
| ⚪ NEW | Created 2026-06-08 in Events Platform |

---

## Live routes — audit + Linear

| Spec | Route | Status | Canonical Linear | Project | EP? | Spec file |
|------|-------|--------|------------------|---------|-----|-----------|
| PAGE-001 | `/`, `/chat` | 🟢 | [SAN-236](https://linear.app/sanjiovani/issue/SAN-236) SCREEN-006 · [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) | UX + EP | 🟢 | PAGE-001 |
| PAGE-002 | `/events` | 🟢 | [SAN-518](https://linear.app/sanjiovani/issue/SAN-518) SCREEN-027 | UX | 🔵 | PAGE-002 |
| PAGE-003 | `/events/[slug]` | 🟡 | [SAN-237](https://linear.app/sanjiovani/issue/SAN-237) SCREEN-014 | UX | 🔵 | PAGE-003 |
| PAGE-003b | Luma upgrade | ⚪ | [SAN-135](https://linear.app/sanjiovani/issue/SAN-135) EVT-017 | EP | 🟢 | PAGE-003b |
| PAGE-004 | `/me/tickets` | 🟢 | [SAN-259](https://linear.app/sanjiovani/issue/SAN-259) SCREEN-015 | UX | 🔵 | PAGE-004 |
| PAGE-005 | `/me/tickets/[id]` | 🟢 | SAN-259 (same) | UX | 🔵 | PAGE-005 |
| PAGE-006 | `/host/event/new` | 🟢 | [SAN-240](https://linear.app/sanjiovani/issue/SAN-240) SCREEN-016 · [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) proof | UX + EP | 🟢 | PAGE-006 |
| PAGE-007 | `/host/events` | 🟢 | [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) EVT-014 | EP | 🟢 | PAGE-007 |
| PAGE-008 | `/login`, `/signup` | 🟢 | [SAN-112](https://linear.app/sanjiovani/issue/SAN-112) UX-012 | UX | 🔵 | PAGE-008 |

---

## Overlays

| Spec | Surface | Canonical Linear | Project | EP? |
|------|---------|------------------|---------|-----|
| OVL-001 | Event card | [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) + [SAN-236](https://linear.app/sanjiovani/issue/SAN-236) | EP + UX | 🟢 |
| OVL-002 | Checkout modal | [SAN-248](https://linear.app/sanjiovani/issue/SAN-248) SCREEN-009 | UX | 🔵 |
| OVL-003 | HITL approval | [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) | EP | 🟢 |
| OVL-004 | Discovery save | [SAN-128](https://linear.app/sanjiovani/issue/SAN-128) EVT-010 | EP | 🟢 |
| OVL-005 | Detail sheet | [SAN-245](https://linear.app/sanjiovani/issue/SAN-245) SCREEN-007 | UX | 🔵 |

---

## Missing pages (spec-only)

| Spec | Route | Canonical Linear | Project | EP? |
|------|-------|------------------|---------|-----|
| PAGE-M01 | `/host` marketing | [SAN-660](https://linear.app/sanjiovani/issue/SAN-660) | Partners | 🟣 |
| PAGE-M02 | `/host/analytics` | [SAN-729](https://linear.app/sanjiovani/issue/SAN-729) UI-002 | EP | ⚪ |
| PAGE-M03 | `/dashboard` events tab | [SAN-690](https://linear.app/sanjiovani/issue/SAN-690) | Partners | 🟣 |
| PAGE-M04 | `/admin/events` | [SAN-515](https://linear.app/sanjiovani/issue/SAN-515) SCREEN-024 | UX | 🟠 |
| PAGE-M05 | `/admin/bookings` | [SAN-502](https://linear.app/sanjiovani/issue/SAN-502) + VEN-007 | EP | 🟢 |
| PAGE-M06 | `/admin/leads` | [SAN-516](https://linear.app/sanjiovani/issue/SAN-516) | UX | 🟠 |
| PAGE-M07 | `/sponsors` | [SAN-664](https://linear.app/sanjiovani/issue/SAN-664) | Partners | 🟣 |
| PAGE-M08 | `/business/event-marketing` | [SAN-701](https://linear.app/sanjiovani/issue/SAN-701) | Partners | 🟣 |
| PAGE-M09 | Discovery queue | [SAN-129](https://linear.app/sanjiovani/issue/SAN-129) | EP | 🟢 |
| PAGE-M10 | Sponsor CRM | [SAN-132](https://linear.app/sanjiovani/issue/SAN-132) | EP | 🟢 |

---

## Venue booking UI (SAN-494 → SAN-514)

All **🟢 in Events Platform** — see [project board](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues).

| Spec | Linear | Title |
|------|--------|-------|
| VEN-001 | [SAN-494](https://linear.app/sanjiovani/issue/SAN-494) | Restaurant Event Venue CTA |
| VEN-002 | [SAN-495](https://linear.app/sanjiovani/issue/SAN-495) | Offerings panel |
| VEN-003 | [SAN-496](https://linear.app/sanjiovani/issue/SAN-496) | Proposal modal HITL |
| VEN-004 | [SAN-498](https://linear.app/sanjiovani/issue/SAN-498) | AI venue match |
| VEN-005 | [SAN-499](https://linear.app/sanjiovani/issue/SAN-499) | Compare venues |
| VEN-006 | [SAN-500](https://linear.app/sanjiovani/issue/SAN-500) | Wizard venue step |
| VEN-007 | [SAN-502](https://linear.app/sanjiovani/issue/SAN-502) / [SAN-514](https://linear.app/sanjiovani/issue/SAN-514) | Admin booking queue |

Wire-only: SAN-510–513 (also on EP).

---

## UI polish (audit gaps) — new in Events Platform

| ID | Fix | Linear | Priority |
|----|-----|--------|----------|
| UI-P01 | Enable `/host/events` in host nav rail | [SAN-730](https://linear.app/sanjiovani/issue/SAN-730) UI-003 | P1 |
| UI-P02 | Event detail `loading.tsx` + hero alt | [SAN-731](https://linear.app/sanjiovani/issue/SAN-731) UI-004 | P1 |

---

## Cross-project index (link in Events descriptions)

When viewing [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues), also watch:

| Project | Owns |
|---------|------|
| **UX** | SCREEN-006/014/015/016/027/009, checkout modal, detail sheet, admin screens |
| **Partners** | `/host` landing, `/dashboard`, `/sponsors`, event marketing |
| **Platform Infrastructure** | Wire specs (WIRE-003/019/022) |

**Disk spec pack (source of truth for UI audit):** `tasks/events/specs/`

---

## Verification checklist

- [x] All 10 audited routes have disk implementation + spec file
- [x] All 10 routes map to ≥1 Linear issue
- [x] Venue booking SAN-494–514 on Events Platform
- [x] Luma upgrade SAN-135 on Events Platform
- [x] Gaps with zero Linear: host analytics, nav rail, detail skeleton → **SAN-729–731**
- [ ] Optional: add `relatedTo` from EP issues to UX canonicals (manual in Linear)

---

## Recommended Linear hygiene (one-time)

1. On [SAN-518](https://linear.app/sanjiovani/issue/SAN-518), [SAN-237](https://linear.app/sanjiovani/issue/SAN-237), [SAN-259](https://linear.app/sanjiovani/issue/SAN-259): add link `tasks/events/specs/pages/PAGE-*.md` in description.
2. Add label `area:events` to UX-owned screen issues if missing.
3. Parent epic under Events Platform: **"UI-000 Events UI spec pack"** linking to `pages-ui-inventory.md`.
