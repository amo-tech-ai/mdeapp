---
title: Now & next — quick summary
updated: 2026-06-03
companion: notes-13-features-implement.md · tasks.md
---

> **Summary:** One-page “now & next” — Cursor is on prod login; then map pins, café search, `/restaurants`, and journey proof. Skip tickets and trips this cycle.

# What we're working on

**Track:** Discovery Beta — find places, chat with the concierge, book a table on [mdeai.co](https://www.mdeai.co). No ticket sales or trip planner yet.

**Goal this cycle:** Camila can log in on her phone, Carlos sees restaurants on the map, Sarah books a table and sees "Pending," and we prove it all on the live site.

---

## Right now

| Who | What | Why it matters |
|-----|------|----------------|
| **Cursor** | [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) — prod login fix (PR #56) | Camila signs up on iPhone at mdeai.co and stays logged in after refresh |
| **Waiting** | [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) — nightly prod chat check (1 of 3 done) | Must pass 3 nights in a row before we merge big chat UI changes |

**Cursor label in Linear:** `cursor:active` = coding now · `cursor:queued` = up next

[Full Cursor status on Core Foundation →](https://linear.app/sanjiovani/project/core-foundation-3a69b76c57ca/activity#project-update-6638f84c)

---

## Next (in order)

| # | Task | User story |
|---|------|------------|
| 1 | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) — map pins on prod | Tourist opens map in Provenza and sees restaurant pins, not a blank map |
| 2 | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) — café search on prod | *"Specialty coffee Laureles"* returns real café cards on the live site |
| 3 | [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) — `/restaurants` page | Tourist browses restaurants with map — no chat required |
| 4 | Booking polish | Agent asks Sarah to confirm before sending · request clearly tied to her account |
| 5 | End-to-end proof | Lucía runs Carlos + Sarah journeys on mdeai.co — chat → book → pending → browse |

**After the 3 nightly checks pass:** ship event cards in chat (Andrés sees salsa events as cards).

---

## Already working (don't rebuild)

- Chat + map on home
- Smart restaurant / nightlife picks in chat
- Book-a-table form + **Pending** status on venue panel
- Mobile layout (drawer, map button)
- Host event wizard (draft with AI)

---

## Not this cycle

| Skip | Why |
|------|-----|
| Stripe / event tickets | Commerce track — later |
| Trips, `/saved`, WhatsApp to venues | Phase 2 |
| Roberto publishing events on prod | With commerce |

---

## One sentence

**Fix prod login → turn on map + café search on live site → ship `/restaurants` → polish booking → prove Sarah and Carlos flows on mdeai.co.**

More detail → [`notes-13-features-implement.md`](./notes-13-features-implement.md) · full queue → [`tasks.md`](../../tasks.md)
