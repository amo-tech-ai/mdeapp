---
title: Now & next — plain-English status + how I ship
updated: 2026-06-03
companion: notes-14.md · notes-17-discovery-beta-execution.md · tasks.md
---

> **Summary:** One page — what we're shipping *now*, what's *next*, and *how* I move through it efficiently. Discovery Beta only (find places, chat, book a table on [mdeai.co](https://www.mdeai.co)). No tickets/trips this cycle. Deep how-to lives in [`notes-17`](./notes-17-discovery-beta-execution.md); deeper feature notes in [`notes-14`](./notes-14.md).

# What we're working on

**Goal this cycle:** Camila logs in on her phone, Carlos sees restaurant pins on the live map, Sarah books a table and sees **Pending** — and we prove every step on mdeai.co, not just localhost.

**Rule of the cycle:** one task → one branch → one PR → 3 proofs (disk → tests → prod) → merge → Linear Done. No parallel feature work, no mid-task doc churn.

---

## The 5 priorities — state + the *one* next move

Each row is tagged by **what kind of gate** is blocking it, because that decides who unblocks it (me vs you vs a wait):

| # | Task | State today | Gate type | The one next move |
|---|------|-------------|-----------|-------------------|
| 1 | **AUTH** — [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) (PR #56) | Code done; floor + CodeRabbit + Vercel **green**; auth e2e green on fresh server | **Admin** (branch protection wants 1 review) | You approve PR #56 (or I merge with `--admin`) → then prod login smoke |
| 2 | **Map pins** — [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) / MAP-008B | Code exists; pins blank on prod because Map ID not set | **Env** (Vercel) | Set `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` on Vercel → thin evidence PR |
| 3 | **Floor gate** — PR-16 / [SAN-458](https://linear.app/sanjiovani/issue/SAN-458) | `floor` workflow live + stable; protection toggle not applied | **Admin** (GitHub settings) | You flip branch-protection: require `floor` check (solo-dev: skip the review requirement or it deadlocks self-merge) |
| 4 | **Chat memory** — F13 | Persistence code shipped (Postgres vs in-memory); prod un-verified | **Env/verify** (Vercel `DATABASE_URL`) | Confirm `DATABASE_URL` set on Vercel → cold-start memory test → open a Linear issue to track |
| 5 | **Nightly soak** — [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) | 1 of 3 green nights | **Wait** (do not actively work) | Let scheduled nightly run; freeze merges to chat/fast-path/pins until 3/3 |

**Read this table as:** only #1 is a code-merge I can drive to green now. #2/#3/#4 are config/admin you own. #5 is a timer.

---

## After the merge — feature order (Discovery Beta)

From [`notes-14`](./notes-14.md), once auth is in and soak clears:

1. **SAN-369** map pins on prod — tourist in Provenza sees pins, not a blank map.
2. **SAN-368** café search on prod — *"specialty coffee Laureles"* returns real café cards live.
3. **SAN-490** `/restaurants` page — browse restaurants + map, no chat required.
4. **Booking polish** — agent confirms before sending; request tied to the signed-in account.
5. **End-to-end proof** — Lucía runs Carlos + Sarah journeys on mdeai.co.

**Frozen until soak 3/3:** event cards in chat, anything touching CopilotKit wiring / fast-path / pins / café results / smoke workflow (the SAN-462 soak scope).

---

## How I move forward efficiently (the loop)

For each task, in order — full detail in [`notes-17`](./notes-17-discovery-beta-execution.md):

1. **Pre-flight (no code):** Linear status vs disk vs open PRs. Classify the gate — **env / admin / code / wait**. Don't write code for an env or admin task.
2. **Smallest diff:** reuse existing patterns (café chat → restaurant page). No adjacent cleanup or refactors.
3. **Prove in 3 layers:** `verify:task -- <ID>` (scoped) → `floor` once before PR → **fresh** `npm run dev` + localhost + mdeai.co where the task says prod. (Always kill stale dev servers first — a reused server on :3001 silently tests the *wrong* branch.)
4. **Ship:** PR body = commands run + exit codes + preview/prod URL. Merge only on green floor. Then one Linear comment + Done with the evidence link.
5. **Handoff:** move to the next queued issue; update the one-liner here or in notes-14 — no new planning docs.

**Efficiency = serial shipping by gate type** (env/admin tasks get thin evidence PRs; feature tasks get UI + tests in one PR). **Correctness = `verify:task` + fresh dev + prod smoke before merge or Linear Done.**

---

## Not this cycle

| Skip | Why |
|------|-----|
| Stripe / event tickets | Commerce track — later |
| Trips, `/saved`, WhatsApp-to-venue | Phase 2 |
| Roberto publishing events on prod | Ships with commerce |

---

## One sentence

**Merge auth (PR #56) → set Map ID + `DATABASE_URL` on Vercel → turn on map pins + café search live → ship `/restaurants` → polish booking → prove Carlos + Sarah on mdeai.co, while the nightly soak counts to 3.**
