---
title: Events UI — forensic audit & spec pack
updated: 2026-06-08
auditor: Cursor (UI/UX architect + task-verifier)
spec_index: ./specs/INDEX.md
tracker: ./index-events.md
sitemap: ../../sitemap.md
design: ../../DESIGN.MD
---

# Events UI — pages, dashboards & overlays audit

**Verdict:** Core loop UI is **shipped and mostly correct** on disk. **Spec drift** was the main problem — docs said `/events` and `/host/events` were missing when they exist. **32 surfaces** still need specs-only → implementation.

**Spec pack:** [`specs/INDEX.md`](./specs/INDEX.md) (27 new/updated specs)

---

## 1. Route audit (Step 1)

| Route | Status | % | Missing UI states | Design issues | a11y gaps | Mobile gaps | Test gaps | Key files |
|-------|--------|--:|-------------------|---------------|-----------|-------------|-----------|-----------|
| `/` | 🟢 Live | 95% | Copilot error state | — | Inspector noise dev-only | Map column hides <md | Prod synthetic | `app/page.tsx`, `geo-chat-shell.tsx` |
| `/chat` | 🟢 Live | 95% | Same as `/` | — | Same | Same | Same | `app/chat/page.tsx` |
| `/events` | 🟢 Live | 90% | Client transition skeleton | No map column vs restaurants | Filter chips focus ring | Filter wrap OK | SCREEN-027 | `events/page.tsx`, `event-browse-view.tsx` |
| `/events/[slug]` | 🟡 Partial | 70% | Route loading skeleton thin | Commerce not Luma; Share disabled | Hero `alt=""` empty | Bottom buy bar ✅ | SCREEN-014 | `event-detail-view.tsx` |
| `/me/tickets` | 🟢 Live | 90% | Empty wallet | Plain layout OK | h1 present | max-w-2xl OK | SCREEN-015 auth | `me/tickets/page.tsx` |
| `/me/tickets/[id]` | 🟢 Live | 90% | Invalid token | — | QR alt text | Full width QR | Partial | `ticket-detail-view.tsx` |
| `/host/event/new` | 🟢 Live | 92% | Agent error | Nav Events disabled | Wizard focus | Nav hidden mobile | SCREEN-016 | `host-event-shell.tsx` |
| `/host/events` | 🟢 Live | 88% | No loading.tsx | No status filter bar (wire drift) | Good h1/CTAs | Grid 1-col OK | 016b redirect only | `host/events/page.tsx` |
| `/login` | 🟢 Live | 95% | — | — | Form labels | Responsive | auth-guard | `login/page.tsx` |
| `/signup` | 🟢 Live | 95% | — | — | Same | Same | Same | `signup/page.tsx` |

**Token audit:** No `gray-*` / `zinc-*` in `components/events/**` or `components/host/**` — **PASS** DESIGN.MD.

---

## 2. Overlays audit

| Surface | Status | Spec | Gaps |
|---------|--------|------|------|
| Event card | 🟢 | OVL-001 | SCREEN-006 clarify flake |
| Checkout modal | 🟢 | OVL-002 | G1 prod proof |
| HITL approval | 🟢 | OVL-003 | — |
| Detail sheet | 🟢 | OVL-005 | Luma parity TBD |
| Discovery save | ⚪ | OVL-004 | Not built |

---

## 3. Verified correct (existing screens)

These match specs **after drift fixes** — safe to treat as Done for UI:

| Surface | Spec | Evidence |
|---------|------|----------|
| Event card in chat | OVL-001 / SCREEN-006 | Vitest + prod events API |
| `/events` browse | PAGE-002 / SCREEN-027 | `page.tsx` + SAN-586 catalog |
| `/events/[slug]` commerce | PAGE-003 / SCREEN-014 | Tiers + mobile buy bar |
| Ticket wallet + QR | PAGE-004/005 / SCREEN-015 | Routes on disk |
| Host wizard + HITL | PAGE-006 / SCREEN-016 | CopilotKit + approval panel |
| `/host/events` list | PAGE-007 / SAN-118 | Server Component + empty/error |

---

## 4. Specs created (Step 2–5)

| Category | Count | Location |
|----------|------:|----------|
| Live page specs | 9 | `specs/pages/PAGE-*.md` |
| Luma upgrade spec | 1 | `specs/pages/PAGE-003b-event-detail-luma.md` |
| Overlay specs | 5 | `specs/overlays/OVL-*.md` |
| Missing page specs | 10 | `specs/pages/missing/PAGE-M*.md` |
| Venue booking specs | 7 | `specs/venue-booking/VEN-*.md` |
| Template | 1 | `specs/_SPEC-TEMPLATE.md` |
| Index | 1 | `specs/INDEX.md` |

---

## 5. Specs updated (drift fixes)

| File | Change |
|------|--------|
| [`tasks/screens/SCREEN-027-events-browse.md`](../screens/SCREEN-027-events-browse.md) | Disk status → ✅ Live; nav enabled |
| [`tasks/MVP/EVP-014-core-host-events-list-page.md`](./tasks/MVP/EVP-014-core-host-events-list-page.md) | status Done, DoD checked, HostEventCard note |
| [`wireframes/EVP-014-wire-host-events-list.md`](./wireframes/EVP-014-wire-host-events-list.md) | status Live; filter bar → deferred |
| [`wireframes/INDEX.md`](./wireframes/INDEX.md) | Link to specs pack |

---

## 6. Summary table — all event pages/screens

| ID | Route / surface | Status | Spec | Linear |
|----|-----------------|--------|------|--------|
| PAGE-001 | `/`, `/chat` | 🟢 | PAGE-001 | SAN-236, SAN-117 |
| PAGE-002 | `/events` | 🟢 | PAGE-002 | SAN-518 |
| PAGE-003 | `/events/[slug]` | 🟡 | PAGE-003 | SAN-237, SAN-731 |
| PAGE-003b | Luma upgrade | ⚪ | PAGE-003b | SAN-135 |
| PAGE-004 | `/me/tickets` | 🟢 | PAGE-004 | SAN-259 |
| PAGE-005 | `/me/tickets/[id]` | 🟢 | PAGE-005 | SAN-259 |
| PAGE-006 | `/host/event/new` | 🟢 | PAGE-006 | SAN-240, SAN-366 |
| PAGE-007 | `/host/events` | 🟢 | PAGE-007 | SAN-118, SAN-730 |
| PAGE-008 | `/login`, `/signup` | 🟢 | PAGE-008 | SAN-112 |
| OVL-001–005 | Cards, modal, HITL, discovery, sheet | 🟢/⚪ | OVL-* | SAN-117,248,245,128 |
| PAGE-M01–M10 | Marketing, admin, CRM | ⚪ | missing/* | SAN-660–701, SAN-729 |
| VEN-001–007 | Venue booking UI | ⚪ | venue-booking/* | SAN-494–514 |
| UI-001 | Spec pack index | ✅ | INDEX + LINEAR-COVERAGE | [SAN-732](https://linear.app/sanjiovani/issue/SAN-732) |

---

## 7. Missing implementation backlog

**P0 — polish live (no new features)**

1. Enable `/host/events` in `host-nav-rail.tsx`
2. Hero meaningful `alt` on event detail
3. `events/[slug]/loading.tsx` skeleton (Luma prep)
4. SCREEN-006 Playwright with dev server
5. Authed host-events Playwright (016c green)

**P1 — SAN-135 Luma slice**

6. Hero + host block per PAGE-003b PR-A

**P2 — marketing & ops**

7. `/host` landing (SAN-660)
8. `/admin/events` (SAN-515)
9. Discovery save UI (SAN-128)

**P3 — venue booking chain**

10. Schema SAN-492 → VEN-001→007

---

## 8. Linear issue mapping

**Full matrix:** [`specs/LINEAR-COVERAGE.md`](./specs/LINEAR-COVERAGE.md) · **Parent:** [SAN-732](https://linear.app/sanjiovani/issue/SAN-732)

| Linear | Spec ID | Action |
|--------|---------|--------|
| SAN-732 | UI-001 | Spec pack parent — link all child issues |
| SAN-730 | UI-P01 / PAGE-007 | Enable host nav Events link |
| SAN-731 | UI-P02 / PAGE-003 | Detail skeleton + hero alt |
| SAN-729 | PAGE-M02 | Build `/host/analytics` |
| SAN-118 | PAGE-007 | Done — nav rail fix PR |
| SAN-518 | PAGE-002 | Close UI — evidence refresh |
| SAN-135 | PAGE-003b | Implement Luma PR-A |
| SAN-660 | PAGE-M01 | Build landing |
| SAN-515 | PAGE-M04 | Build admin |
| SAN-128 | OVL-004 | Build discovery save |
| SAN-132 | PAGE-M10 | Sponsor CRM |
| SAN-494–514 | VEN-001–007 | Sequential after schema |
| SAN-690 | PAGE-M03 | Dashboard host tab |

**Linear verification (2026-06-08):** Every spec surface maps to ≥1 issue. UX/Partners canonicals (SAN-518, SAN-237, SAN-259, SAN-248, SAN-660, etc.) live outside [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) by design — see cross-project table in LINEAR-COVERAGE.md.

---

## 9. Top 10 UI/UX fixes (priority)

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | Enable host nav **Events** link | Roberto finds his list | 15 min |
| 2 | Event detail hero `alt={event.name}` | a11y | 5 min |
| 3 | Detail page loading skeleton | Perceived perf | 1h |
| 4 | Luma hero + host block (SAN-135) | Tourist conversion | 1–2 days |
| 5 | Browse page map toggle (parity) | Discovery UX | 1 day |
| 6 | Share button implement or remove | Trust | 2h |
| 7 | Host events status filter chips | Wire spec parity | 4h |
| 8 | `/host` marketing landing | Host acquisition | 1 day |
| 9 | Checkout success → wallet deep link | Andrés loop | 4h |
| 10 | Detail sheet ↔ full page CTA parity | Camila consistency | 4h |

---

## 10. Recommended next PR plan

**PR-1 `fix(host): enable events nav link`** (C-small)

- `host-nav-rail.tsx` — enable `/host/events`, mark active on list route
- Verify: manual + SCREEN-016b unchanged

**PR-2 `fix(events): detail a11y + loading skeleton`** (C-small)

- `event-detail-view.tsx` alt text
- `app/events/[slug]/loading.tsx`
- Verify: SCREEN-014, vitest

**PR-3 `feat(events): Luma hero + host block`** (C-medium) — **SAN-135**

- Spec: PAGE-003b PR-A only
- New components: `EventDetailHero`, `EventHostBlock`
- Verify: Browser prod + localhost, evidence path

**PR-4 `docs(events): spec drift`** (docs-only) — this pack + EVP-014/SCREEN-027 updates

**Do not implement in next PR:** venue booking, admin, discovery save, sponsor CRM.

---

## Related

- Inventory (persona summary): [`event-pages.md`](./event-pages.md)
- Executive summary: [`summary.md`](./summary.md)
- Full tracker: [`index-events.md`](./index-events.md)
- Linear coverage matrix: [`specs/LINEAR-COVERAGE.md`](./specs/LINEAR-COVERAGE.md)
