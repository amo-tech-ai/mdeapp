Short answer: the [screens project](https://linear.app/sanjiovani/project/screens-c954b41b2344/issues) has a **fat backlog** — a lot is already shipped or sitting in **In Review**. Best ROI now is **finish In Review → one new browse page → mobile stack**, not admin/post-MVP catalog pages.

---

### Already strong (don’t re-open)

| SAN | Screen | Persona |
|-----|--------|---------|
| [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) | `/host/events` Roberto list | Roberto |
| [SAN-488](https://linear.app/sanjiovani/issue/SAN-488) | Chat nav rail + threads | Camila |
| [SAN-489](https://linear.app/sanjiovani/issue/SAN-489) | Mobile 3-panel shell | Camila |
| [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) | `/restaurants` browse | Tourist |
| [SAN-236/237/240](https://linear.app/sanjiovani/issue/SAN-236) | Event cards, detail, host wizard | Camila / Roberto |
| [SAN-114](https://linear.app/sanjiovani/issue/SAN-114) | Café cards in chat | Tourist |

Core concierge + events host path is mostly **LIVE** per [`sitemap.md`](sitemap.md).

---

### Tier 1 — Finish these first (In Review → Done, low risk)

These are mostly polish on **existing routes** — fastest “screens completed” wins:

| Priority | SAN | Screen | Why |
|---------|-----|--------|-----|
| 1 | [SAN-263](https://linear.app/sanjiovani/issue/SAN-263) | Workflow progress strip | Mindtrip-style search steps on `/` |
| 2 | [SAN-265](https://linear.app/sanjiovani/issue/SAN-265) | Loading / empty / error states | Cross-cutting; unblocks perceived quality |
| 3 | [SAN-268](https://linear.app/sanjiovani/issue/SAN-268) | A11y pass (MVP surfaces) | Launch hygiene |
| 4 | [SAN-111](https://linear.app/sanjiovani/issue/SAN-111) | Map exploration panel | Right column polish; map is the product |
| 5 | [SAN-248](https://linear.app/sanjiovani/issue/SAN-248) | Ticket checkout modal | Andrés — closes checkout **shell** on `/events/[slug]` |
| 6 | [SAN-259](https://linear.app/sanjiovani/issue/SAN-259) | My tickets + QR polish | Andrés wallet UX |
| 7 | [SAN-251](https://linear.app/sanjiovani/issue/SAN-251) / [SAN-255](https://linear.app/sanjiovani/issue/SAN-255) | Trips + itinerary | Camila — `/trips` is ⚠️ SHELL today |

**Note:** [SAN-262](https://linear.app/sanjiovani/issue/SAN-262) (schedule viewing) may already match LIVE overlay — verify disk, then close or narrow scope.

---

### Tier 2 — Best **new** screens to build next

Copy the **SAN-490 restaurants** pattern (grid + filters + map) onto stub routes:

| Priority | SAN | Route | Persona | Effort |
|---------|-----|-------|---------|--------|
| 1 | [SAN-491](https://linear.app/sanjiovani/issue/SAN-491) | `/nightlife` | Tourist | **Low** — same template as restaurants; route is ⚠️ SHELL |
| 2 | [SAN-522](https://linear.app/sanjiovani/issue/SAN-522) + [SAN-524](https://linear.app/sanjiovani/issue/SAN-524) | Mobile composer + map sheet | Camila | **Medium** — depends on [SAN-521](https://linear.app/sanjiovani/issue/SAN-521) (In Progress) |
| 3 | [SAN-517](https://linear.app/sanjiovani/issue/SAN-517) spec → login polish | `/login`, `/signup` | All | **Low** — functional but ugly; spec at `tasks/screens/017-scr-login-signup-polish.md` |
| 4 | [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) | `/admin/bookings` | Patricia | **Medium** — venue booking spine needs ops queue |

**Nightlife first** — highest leverage: chat panels already work (VEN-013); you only need the browse page to match restaurants.

---

### Tier 3 — Mobile pack (after SAN-521 lands)

All depend on **SCREEN-018 Done** ✅:

| SAN | What |
|-----|------|
| [SAN-523](https://linear.app/sanjiovani/issue/SAN-523) | AI chips + contextual prompts |
| [SAN-525](https://linear.app/sanjiovani/issue/SAN-525) | Touch-friendly card carousels |
| [SAN-526](https://linear.app/sanjiovani/issue/SAN-526) | Mobile Stripe checkout |
| [SAN-527](https://linear.app/sanjiovani/issue/SAN-527) | Mobile OAuth stability |

85% mobile traffic → this stack matters more than admin dashboards.

---

### Defer for launch (on screens project but wrong phase)

| SAN | Why wait |
|-----|----------|
| [SAN-515–519](https://linear.app/sanjiovani/issue/SAN-515) | Admin CRM, `/events` catalog, `/cafes` catalog, `/me/profile` — all ⚫ POST in sitemap |
| [SAN-244/478/479](https://linear.app/sanjiovani/issue/SAN-478) | `/rentals` catalog — REAL-011 gated post chat-primary |
| [SAN-261/269/271](https://linear.app/sanjiovani/issue/SAN-261) | Explore unified, onboarding, notifications — Phase 2 |

---

### Suggested sprint order (screens-only)

```text
Week A — close In Review
  SAN-263 → SAN-265 → SAN-268 → SAN-111 → SAN-248 → SAN-259

Week B — one new browse + mobile core
  SAN-491 (/nightlife) → finish SAN-521 → SAN-522 + SAN-524

Week C — ops + auth polish
  SAN-311 (admin bookings) → login/signup polish (017 spec)
```

---

### Gap not on screens project but blocks “complete” feeling

| Item | Where |
|------|--------|
| G3 prod publish proof | [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) — Events Platform |
| `/host/events` authed E2E | Follow-up on SAN-118 Done |
| `/restaurants/[slug]` detail | ⚫ POST — not on screens backlog yet |

If you want one **single next screen to ship this week**: **[SAN-491 nightlife listings](https://linear.app/sanjiovani/issue/SAN-491/screen-022-nightlife-listings-map)** — clone SAN-490, route already stubbed, chat already works.