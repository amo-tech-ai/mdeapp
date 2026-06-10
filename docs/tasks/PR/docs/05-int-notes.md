Let me explore the intelligence tasks directory structure before planning the verification.

Let me read the index files to understand the claimed status of each INT task.

The INDEX claims status against `mdeapp` main (7a5c91e), but none are marked "Done" — the best is "🟢 In Review" (code on main, Done withheld pending runtime proof). The user's bar is different and concrete: **committed to GitHub AND live on Vercel**. I need to verify that directly rather than trust the INDEX. Let me first understand the git topology.

Now I understand: `mdeapp/` is the real app (GitHub `amo-tech-ai/mdeapp`), currently on the `hotfix/g2d-cafe-fast-path` working tree (which I must not touch). "Committed to GitHub" = on `origin/main`; "live on Vercel" = deployed to prod. Let me check both, and look at how Vercel is wired.

The stale task list is from prior work — I'll replace it. Key finding: origin/main HEAD is `c9e54b8`; the merged PRs are SEARCH/UX/SAN-labeled (#28–#37), and INT tasks map indirectly to that code. Only the 8 "🟢 In Review" tasks (INT-001/002/003/004/005/007/008/010) are even candidates for "complete" — the 12 ⚪ Not Started and 3 🟡 In Progress can't be. Let me read the 8 candidate specs to get their concrete acceptance criteria and the symbols/files they deliver.

INT-001's own frontmatter says `status: In Progress` (not "In Review" like the INDEX claims) and its last acceptance box is unchecked — so the records already disagree. I'll verify against actual `origin/main`, not the docs. Let me read the other 7 candidates.

INT-002 frontmatter says `status: Not Started` while the INDEX says "🟢 In Review" — the per-task frontmatter and INDEX disagree, and the INDEX's own verification was against `7a5c91e`, which is now ~5 PRs behind origin/main HEAD `c9e54b8`. Both records are stale. Let me read the remaining 6 candidates, then verify against live origin/main.

I now have all 8 candidate specs. The docs are internally inconsistent (frontmatter says "Not Started/In Progress"; INDEX says "In Review"; acceptance boxes mostly unchecked; INT-004 and INT-010 carry explicit ⚠️ open-issue flags). I'll ignore the docs' self-claims and verify against reality. Let me run a read-only symbol sweep against `origin/main` to establish the **committed-to-GitHub** dimension for each candidate's concrete deliverables.

All 8 candidate files exist on origin/main. Now let me verify the actual symbols/behaviors inside them landed — especially the INT-010 `genericAskPending` Zod drift, which the INDEX flagged as an open one-line fix (the decisive test for whether INT-010 is actually complete on main).

Key signals: INT-001/002/008 deliverables are genuinely on main (real logic, not stubs). Two decisive items need exact context: (1) is the `genericAskPending` at concierge.ts:55 on the **lastRentalQuery** block (INT-010's drift) or just lastEventQuery? (2) under what condition does the canned `RENTAL_CLARIFY_MESSAGE` still fire at use-rental-search-fast-path.ts:131 (INT-004)? Let me read both sections from origin/main directly.

Two decisive negatives confirmed:

- **INT-010 = NOT complete.** The `genericAskPending` at concierge.ts:55 sits on the **`lastEventQuery`** block; the `lastRentalQuery` Zod block (lines 21-29) still lacks it. That's exactly the drift the INDEX flagged as open — and it's a live bug: the hook *writes* `lastRentalQuery.genericAskPending` (line ~134) but Zod strips it on persist.
- **INT-004 = NOT complete (and deploy-gated by design).** The canned `RENTAL_CLARIFY_MESSAGE` is still the live path at use-rental-search-fast-path.ts:131; the "route 0.50–0.84 → conciergeAgent" acceptance isn't the live behavior.

Both INT-003 and INT-004 depend on `conciergeAgent`, which the docs say is dead on prod. The "live on Vercel" dimension is now the gating question — I must verify prod runtime, not assume. Let me find the production URL and the SAN-322 synthetic smoke harness.

Prod URL is `https://www.mdeai.co`; the SAN-322 nightly synthetic smoke exercises exactly the 4 verticals these wrappers power (rentals→INT-002, events→INT-007, cafes→INT-008, restaurants→INT-021). That CI run is the authoritative "live on Vercel" signal. Let me check its recent results, and confirm INT-001's shared schema is actually wired into the runtime (not committed-but-dead).

The prod synthetic smoke **passed on `https://www.mdeai.co` today** (run `26760735915`, success, 14:19Z, post-#37) — that's the authoritative "live on Vercel" proof for the deterministic verticals. INT-001's schema is wired (intent-slots → extract-intent-slots tool → concierge). Let me confirm exactly which verticals the smoke *asserts* (so I know what's actually proven live), and spot-check that conciergeAgent-dependent paths aren't covered.

All 4 verticals are asserted with concrete card-count checks and the run passed on prod today — so rentals/events/restaurants/cafes deterministic search → cards is **proven live on Vercel**. The smoke has zero clarify/conciergeAgent assertions, confirming it does NOT cover INT-003/004 (Gemini-clarify routing). Let me do one cheap spot-check that a "Not Started" task (INT-011 `user_preferences`) is genuinely absent on main — guarding against under-crediting — then I'll finalize verdicts and execute the archive moves.

Evidence is conclusive. Final determination:

- **`user_preferences`/`user_interactions`/pgvector migrations are genuinely absent on main** → INT-011/012/016 (and the rest of the ⚪ block) really are Not Started. No under-crediting.
- **4 tasks meet both bars (committed to GitHub + live on Vercel):** INT-001 (shared schema — deployed + wired + fast-path intact), INT-002 (rentals — smoke-proven), INT-007 (events — smoke-proven), INT-008 (cafes — smoke-proven).
- **Everything else falls short:** INT-003/004 (canned clarify still the live path; conciergeAgent path not smoke-covered), INT-005 (e2e absent, depends on INT-004), INT-010 (Zod `genericAskPending` rental drift = live bug), INT-006/009/021 (partial), INT-011–020/022 (not on main).

The candidate frontmatter is stale ("Not Started"/"In Progress" despite being shipped + live). I'll update status with evidence, then move the 4 to archive. Let me mark this phase and update the 4 frontmatters.

Frontmatter updated on all 4 with commit + prod-smoke evidence. Now move them to the archive directory.

All 4 moved into `archive/`. Now sync the records — update the master table rows (status + link path) and the verification note in `tasks/intelligence/tasks/INDEX.md` so it points to reality.

All records synced. Let me do a final verification pass — confirm the moves, check the parent INDEX doesn't now contradict, and ensure no stale self-links remain.

Moves and links verified; all 4 archived files carry `status: Done`. The parent `INDEX.md:22` still says the INT program is "~5%, INT-001 after DATA-041" — now contradictory since INT-001 is archived. Let me read that section and correct it minimally.

Done. Here's the full disposition.

## Answer: 4 of 22 intelligence tasks are 100% complete (committed to GitHub **and** live on Vercel)

I verified against reality, not the docs (which were stale — frontmatter said "Not Started"/"In Progress" on shipped code; the INDEX's own check was against `7a5c91e`, ~5 PRs behind `origin/main` HEAD `c9e54b8`).

**Two bars, both checked:**
- **Committed to GitHub** = deliverable symbols present on `amo-tech-ai/mdeapp` `origin/main` (c9e54b8), not stubs.
- **Live on Vercel** = the SAN-322 prod synthetic smoke (`e2e/prod-synthetic-smoke.spec.ts`) passed on `https://www.mdeai.co` today (run `26760735915`, success, 14:19Z) — it drives the real chat and asserts `data-testid` card counts for all 4 verticals.

### Archived → `tasks/intelligence/archive/`

| Task | Evidence (committed + live) |
|------|------|
| **INT-001** shared intent/slot schema | `intent-slots.ts` → `extract-intent-slots` tool wired into `concierge.ts`; fast-path API intact per smoke |
| **INT-002** rental parser (Camila) | `rental-query-parser.ts` cityWide/monthly/date bands on main; rentals query → `rental-card` live |
| **INT-007** event wrapper (Roberto) | `use-event-search-fast-path` + `event-discovery-workflow` on main; events query → `event-card` live |
| **INT-008** café wrapper (Tourist) | `search-grounded-places.ts` café path on main; cafés query → `grounded-card[cafe]` live |

### Held back — and exactly why (not hidden)

| Task | Committed? | Live? | Blocker |
|------|:--:|:--:|------|
| INT-003 Gemini clarify routing | partial | ❌ | Canned `RENTAL_CLARIFY_MESSAGE` still fires at `use-rental-search-fast-path.ts:131`; the 0.50–0.84→`conciergeAgent` band isn't the live path and isn't smoke-covered |
| INT-004 no-canned-bypass | ❌ | ❌ | Bypass removal never landed — **deploy-gated** behind UX-001/UX-002 (conciergeAgent dead on prod) |
| INT-005 regression tests | partial | n/a | Unit tests exist; `e2e/intelligence/` spec absent; depends on INT-004 |
| INT-010 working-memory schema | partial | ❌ | **Live bug:** Zod `lastRentalQuery` still lacks `genericAskPending` (only on `lastEventQuery` @ concierge.ts:55) → the hook writes it but Zod strips it on persist |
| INT-006 / INT-009 / INT-021 | partial | partial | INT-006 date-overlap SQL not shipped; INT-009 UI-state mirror open; INT-021 restaurant live but `venue_search` half not on main |
| INT-011–020, INT-022 | ❌ | ❌ | Not Started — confirmed no `user_preferences`/`user_interactions`/pgvector migration on main |

### Records synced
- 4 frontmatters → `status: Done` + `closed:` evidence line (commit + smoke run).
- `tasks/intelligence/tasks/INDEX.md` — rows repointed to `../archive/`, verification note refreshed to `c9e54b8` + smoke run, added "Archived / Not archived" summary.
- `tasks/intelligence/INDEX.md` — INT program ~5%→~18%, next = INT-003.

Note: the planning repo (`/home/sk/mdeai`) has **no git remote**, so these are local file moves — nothing to push. The shipped *code* was already on GitHub + prod.

**Fastest path to archive more:** INT-010 is a genuine one-line fix (add `genericAskPending` to the rental Zod block) — that's a real Camila bug today. INT-003/004/005 all unblock once `conciergeAgent` is restored on prod (UX-001/UX-002). Want me to take the INT-010 one-liner?