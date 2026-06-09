# Task: Concierge Improvements Sprint

**Linear:** [CHAT view](https://linear.app/sanjiovani/view/chat-5e4071d8144e) · **Tracker:** [`linear/markdown/CHAT.md`](../../linear/markdown/CHAT.md) · **Index:** [`june-9-chat-tasks.md`](./june-9-chat-tasks.md)

Act as a Senior Staff Engineer, QA Lead, CopilotKit Specialist, Mastra Architect, and Production Auditor.

Use:

* MCP tools
* Playwright
* GitHub
* Linear
* CopilotKit docs
* Mastra docs
* Google Maps docs
* Supabase docs

Follow official documentation and best practices.

## Rules

* Fix one area at a time
* Test after every change
* Do not move to next task until tests pass
* Create separate commits
* Create one PR at the end
* No redesigns
* No new agents
* No new UI

---

# Task 1 — Rentals

## Audit

Review:

* rental search
* rental cards
* rental pins
* rental details
* schedule viewing flow

Identify:

* latency
* clarify loops
* missing data
* UX issues

## Improve

Goal:

```text
apartments in laureles
→ search immediately
```

instead of:

```text
clarify
→ search
```

## Tests

Run:

* rental E2E
* rental smoke
* rental API tests

Verify:

* cards
* pins
* details
* schedule viewing

## Commit

```text
fix(rentals): improve search routing and latency
```

---

# Task 2 — Events

## Audit

Review:

* event cards
* event pins
* venue coordinates
* event details
* buy ticket flow

## Improve

Goal:

```text
95%+ event pin coverage
```

Implement:

* geocode fallback
* coordinate caching
* venue validation

## Tests

Run:

* events E2E
* maps E2E
* event search API tests

## Commit

```text
fix(events): improve venue pin coverage
```

---

# Task 3 — Restaurants

## Audit

Review:

* cards
* photos
* details
* directions

## Improve

Reduce placeholder images.

## Tests

Run:

* restaurant E2E
* search API tests

## Commit

```text
fix(restaurants): improve image fallback handling
```

---

# Task 4 — Cafes

## Audit

Review:

* cards
* pins
* details
* booking sheet

## Improve

Review Place ID coverage.

## Tests

Run:

* cafe E2E
* place details tests

## Commit

```text
fix(cafes): improve place validation coverage
```

---

# Task 5 — Nightlife

## Audit

Review:

* cards
* pins
* details
* safety messaging

## Improve

Add nightlife production coverage.

## Tests

Create:

```text
e2e/nightlife.spec.ts
```

Verify:

* cards
* pins
* details

## Commit

```text
test(nightlife): add regression coverage
```

---

# Task 6 — CopilotKit API

## Audit

Review:

```text
POST /api/copilotkit
```

Current:

```text
401
```

Expected:

```text
400
```

Determine:

* bug
* middleware
* test issue

Fix if appropriate.

## Tests

Run:

* API tests
* smoke tests

## Commit

```text
fix(api): align copilotkit error responses
```

---

# Task 7 — Full Validation

Run after every task and again at the end:

```bash
npm run lint
npm test -- --run
```

Final:

```bash
npm run typecheck
npm run floor
npx playwright test
node tasks/testing/scripts/chat-smoke.mjs --base https://www.mdeai.co
```

---

# Task 8 — Documentation

Update:

```text
docs/audits/concierge-audit.md
docs/notes/june-8-chat.md
```

Add:

* findings
* fixes
* screenshots
* metrics
* before/after comparison

---

# Task 9 — Create PR

Title:

```text
feat(concierge): improve search quality, map coverage and reliability
```

Include:

| Task        | Result |
| ----------- | ------ |
| Rentals     |        |
| Events      |        |
| Restaurants |        |
| Cafes       |        |
| Nightlife   |        |
| CopilotKit  |        |

Include:

* tests
* screenshots
* evidence
* performance improvements

## Final Output

Return:

1. Files changed
2. Tests passed
3. Performance gains
4. Remaining gaps
5. PR URL
6. Production readiness score

---

# Verification checklist & grading

**As-of:** 2026-06-09 · **Sprint:** UX-037 ([SAN-822](https://linear.app/sanjiovani/issue/SAN-822))  
**Baseline:** SAN-733 Done · prod `/chat` 200 · 5/5 vertical home-handoff E2E PASS (local)  
**Evidence:** `tasks/testing/evidence/2026-06-08/` · `docs/audits/concierge-audit.md`

## Grading legend

| Dot | Status | Meaning | Score weight |
|-----|--------|---------|--------------|
| 🟢 | **PASS** | Verified on disk, localhost, or prod — meets criterion | 100% |
| 🟡 | **PARTIAL** | Works on fast-path / baseline; sprint goal not met | 50% |
| ⚪ | **PENDING** | Not started; queued in Linear only | 0% |
| 🔴 | **FAIL** | Broken, regressed, or blocks sprint goal | 0% |

**Task %** = round(average of criterion weights) · **Sprint %** = average of Tasks 1–9

---

## Sprint meta

| Criterion | Dot | Evidence |
|-----------|-----|----------|
| Linear epic + 9 sub-issues created | 🟢 | SAN-822 → SAN-831; `tasks/ux/tasks/UX-037-concierge-improvements-sprint.md` |
| Sequential `blockedBy` chain wired | 🟢 | SAN-823 → … → SAN-831 |
| Sprint rules documented | 🟢 | This file + SAN-822 description |
| One-PR-at-end branch named | 🟢 | `ai/san-822-ux-037-concierge-improvements-sprint` |
| Any implementation commit landed | ⚪ | 0/6 fix commits on branch |
| PR opened | ⚪ | — |

**Sprint meta score: 67%** (4/6 🟢 · 2/6 ⚪)

---

## Task 1 — Rentals · [SAN-823](https://linear.app/sanjiovani/issue/SAN-823) · **38%**

| # | Criterion | Dot | Verification |
|---|-----------|-----|--------------|
| 1.1 | Audit: rental search | 🟢 | `concierge-audit.md` · `use-rental-search-fast-path.ts` reviewed |
| 1.2 | Audit: rental cards | 🟢 | `rental-card` testids; prod API shape PASS |
| 1.3 | Audit: rental pins | 🟢 | E2E pins PASS; some rows lack lat/lng documented |
| 1.4 | Audit: rental details | 🟢 | `rental-details-cta` on disk |
| 1.5 | Audit: schedule viewing | 🟢 | `schedule-viewing-modal` + `rental-schedule-cta` on disk |
| 1.6 | Latency / clarify gaps identified | 🟢 | Vague query +30–90s in audit |
| 1.7 | **Goal:** `apartments in laureles` → immediate search | 🔴 | `shouldInstantRentalClarify` still active in `rental-query-parser.ts` |
| 1.8 | Rental E2E (home handoff) | 🟡 | PASS with `RENTAL_QUERY` (37.8s) — not vague query |
| 1.9 | Rental smoke / API | 🟢 | `chat-smoke-prod.txt` 5 results + geo |
| 1.10 | Cards + pins verified in E2E | 🟢 | `home-to-chat-vertical-e2e.txt` |
| 1.11 | Details + schedule viewing E2E | ⚪ | Not exercised in sprint E2E |
| 1.12 | Commit `fix(rentals):…` | ⚪ | Not committed |

**Task 1: 38%** · 🟢×6 🟡×1 🔴×1 ⚪×2

---

## Task 2 — Events · [SAN-824](https://linear.app/sanjiovani/issue/SAN-824) · **42%**

| # | Criterion | Dot | Verification |
|---|-----------|-----|--------------|
| 2.1 | Audit: event cards | 🟢 | Prod 10 results; E2E PASS |
| 2.2 | Audit: event pins | 🟢 | Gap documented — pins often 0 |
| 2.3 | Audit: venue coordinates | 🟢 | API `mapsUrl` / source URL; lat/lng sparse |
| 2.4 | Audit: details + buy flow | 🟢 | `event-details-cta` · `event-buy-cta` on disk |
| 2.5 | **Goal:** 95%+ event pin coverage | 🔴 | No geocode fallback / cache in `src/**` events path |
| 2.6 | Geocode fallback implemented | ⚪ | Not started |
| 2.7 | Coordinate caching implemented | ⚪ | Not started |
| 2.8 | Venue validation implemented | ⚪ | Not started |
| 2.9 | Events E2E | 🟡 | Cards PASS; pins optional in spec (not 95% goal) |
| 2.10 | Event API tests | 🟢 | `chat-smoke-prod.txt` PASS |
| 2.11 | Commit `fix(events):…` | ⚪ | Not committed |

**Task 2: 42%** · 🟢×5 🟡×1 🔴×1 ⚪×4

---

## Task 3 — Restaurants · [SAN-825](https://linear.app/sanjiovani/issue/SAN-825) · **50%**

| # | Criterion | Dot | Verification |
|---|-----------|-----|--------------|
| 3.1 | Audit: cards | 🟢 | 5 cards prod synthetic; E2E PASS (45.8s) |
| 3.2 | Audit: photos | 🟢 | `restaurant-card-photo-placeholder` gap documented |
| 3.3 | Audit: details + directions | 🟢 | Fast-path panel + maps links on disk |
| 3.4 | **Goal:** reduce placeholder rate | ⚪ | No cache-warm / fallback change shipped |
| 3.5 | Restaurant E2E | 🟢 | `home-to-chat` restaurants PASS |
| 3.6 | Search / API path | 🟡 | Fast-path only; no dedicated restaurant API in smoke |
| 3.7 | Commit `fix(restaurants):…` | ⚪ | Not committed |

**Task 3: 50%** · 🟢×4 🟡×1 ⚪×2

---

## Task 4 — Cafés · [SAN-826](https://linear.app/sanjiovani/issue/SAN-826) · **57%**

| # | Criterion | Dot | Verification |
|---|-----------|-----|--------------|
| 4.1 | Audit: cards | 🟢 | 5 grounded café cards prod |
| 4.2 | Audit: pins | 🟢 | E2E PASS (45.5s) |
| 4.3 | Audit: details | 🟢 | `venue-detail-sheet` on disk |
| 4.4 | Audit: booking sheet | 🟢 | `cafe-booking-sheet` gated on `placeId` |
| 4.5 | **Goal:** improve Place ID coverage | ⚪ | No validation backfill shipped |
| 4.6 | Café E2E | 🟢 | `home-to-chat` cafés PASS |
| 4.7 | Place details tests | 🟢 | Smoke `GET /api/places/detail` 400 cases PASS |
| 4.8 | Commit `fix(cafes):…` | ⚪ | Not committed |

**Task 4: 57%** · 🟢×6 ⚪×2

---

## Task 5 — Nightlife · [SAN-827](https://linear.app/sanjiovani/issue/SAN-827) · **44%**

| # | Criterion | Dot | Verification |
|---|-----------|-----|--------------|
| 5.1 | Audit: cards | 🟢 | `nightlife-card` · VEN-025 e2e exists |
| 5.2 | Audit: pins | 🟢 | E2E home handoff PASS (41.0s) |
| 5.3 | Audit: details + safety | 🟢 | `nightlife-detail-panel` · `nightlife-safety-notice` |
| 5.4 | **Goal:** prod regression coverage | 🟡 | `home-to-chat` covers nightlife; not in `prod-synthetic-smoke` |
| 5.5 | `e2e/nightlife.spec.ts` created | 🔴 | File does not exist on disk |
| 5.6 | Cards + pins + details verified | 🟡 | Via `home-to-chat` only |
| 5.7 | Commit `test(nightlife):…` | ⚪ | Not committed |

**Task 5: 44%** · 🟢×3 🟡×2 🔴×1 ⚪×1

---

## Task 6 — CopilotKit API · [SAN-828](https://linear.app/sanjiovani/issue/SAN-828) · **25%**

| # | Criterion | Dot | Verification |
|---|-----------|-----|--------------|
| 6.1 | Audit: `POST /api/copilotkit` | 🟢 | Route + smoke script reviewed |
| 6.2 | Empty body returns 401 (prod) | 🔴 | `chat-smoke-prod.txt` FAIL |
| 6.3 | Empty body returns 400 (expected) | 🔴 | Smoke expectation not met |
| 6.4 | Root cause classified (bug vs test) | ⚪ | Not investigated in sprint |
| 6.5 | Fix or smoke alignment shipped | ⚪ | Not started |
| 6.6 | API + smoke tests green | 🔴 | 1/12 smoke checks fail |
| 6.7 | Commit `fix(api):…` | ⚪ | Not committed |

**Task 6: 25%** · 🟢×1 🔴×3 ⚪×3

---

## Task 7 — Full validation · [SAN-829](https://linear.app/sanjiovani/issue/SAN-829) · **43%**

| # | Criterion | Dot | Verification |
|---|-----------|-----|--------------|
| 7.1 | `npm run lint` after each task | ⚪ | No sprint commits yet |
| 7.2 | `npm test -- --run` after each task | ⚪ | Not run as sprint gate |
| 7.3 | `npm run typecheck` final | ⚪ | Not run post-sprint |
| 7.4 | `npm run floor` final | ⚪ | Not run post-sprint |
| 7.5 | `npx playwright test` full suite | 🟡 | `home-to-chat` 7/7 PASS; full suite not run |
| 7.6 | Prod `chat-smoke.mjs` | 🔴 | 401 copilotkit FAIL |
| 7.7 | Evidence saved | 🟢 | `tasks/testing/evidence/2026-06-08/` |

**Task 7: 43%** · 🟢×1 🟡×1 🔴×1 ⚪×4

---

## Task 8 — Documentation · [SAN-830](https://linear.app/sanjiovani/issue/SAN-830) · **50%**

| # | Criterion | Dot | Verification |
|---|-----------|-----|--------------|
| 8.1 | `concierge-audit.md` exists | 🟢 | `docs/audits/concierge-audit.md` |
| 8.2 | `june-8-chat.md` updated | 🟢 | Post-SAN-733 status |
| 8.3 | `launch-readiness.md` exists | 🟢 | Score 8.3/10 baseline |
| 8.4 | Before/after per vertical | ⚪ | Awaiting sprint fixes |
| 8.5 | Screenshots + metrics | 🟡 | Some in `evidence/2026-06-08/`; no per-task folders |
| 8.6 | Sprint outcomes in notes | 🟡 | This checklist; fixes TBD |
| 8.7 | Commit `docs(concierge):…` | ⚪ | Not committed |

**Task 8: 50%** · 🟢×3 🟡×2 ⚪×2

---

## Task 9 — Create PR · [SAN-831](https://linear.app/sanjiovani/issue/SAN-831) · **0%**

| # | Criterion | Dot | Verification |
|---|-----------|-----|--------------|
| 9.1 | Branch `ai/san-822-…` pushed | ⚪ | Not created |
| 9.2 | PR title `feat(concierge):…` | ⚪ | — |
| 9.3 | Result table filled | ⚪ | — |
| 9.4 | Tests + screenshots in PR | ⚪ | — |
| 9.5 | `Closes SAN-822` | ⚪ | — |
| 9.6 | Final output (6 bullets) | ⚪ | — |

**Task 9: 0%** · ⚪×6

---

## Score summary

| Task | SAN | Dot mix | **% correct** | Grade |
|------|-----|---------|---------------|-------|
| Meta | SAN-822 | 🟢🟢🟢🟢⚪⚪ | **67%** | 🟡 Planning ready |
| 1 Rentals | SAN-823 | 🟢×6 🟡×1 🔴×1 ⚪×2 | **38%** | 🔴 Goal open |
| 2 Events | SAN-824 | 🟢×5 🟡×1 🔴×1 ⚪×4 | **42%** | 🔴 Pins open |
| 3 Restaurants | SAN-825 | 🟢×4 🟡×1 ⚪×2 | **50%** | 🟡 Audit only |
| 4 Cafés | SAN-826 | 🟢×6 ⚪×2 | **57%** | 🟡 Audit only |
| 5 Nightlife | SAN-827 | 🟢×3 🟡×2 🔴×1 ⚪×1 | **44%** | 🔴 Spec file missing |
| 6 CopilotKit | SAN-828 | 🟢×1 🔴×3 ⚪×3 | **25%** | 🔴 Smoke fail |
| 7 Validation | SAN-829 | 🟢×1 🟡×1 🔴×1 ⚪×4 | **43%** | 🟡 Partial E2E |
| 8 Docs | SAN-830 | 🟢×3 🟡×2 ⚪×2 | **50%** | 🟡 Baseline docs |
| 9 PR | SAN-831 | ⚪×6 | **0%** | ⚪ Not started |

### Overall sprint completion: **42%**

```
Planning & audit  ████████░░  67%  🟡
Implementation    ████░░░░░░  35%  🔴  (Tasks 1–6 goals)
Testing           █████░░░░░  48%  🟡  (E2E strong; smoke/API gap)
Documentation       █████░░░░░  50%  🟡
Ship                ░░░░░░░░░░   0%  ⚪
```

### Production readiness (pre-sprint baseline)

| Area | Score | Dot |
|------|------:|-----|
| Homepage | 9.0 | 🟢 |
| Concierge | 9.0 | 🟢 |
| Maps | 8.0 | 🟡 |
| Search | 8.0 | 🟡 |
| Rentals | 8.0 | 🟡 |
| Events | 9.0 | 🟢 |
| Restaurants | 8.0 | 🟡 |
| Cafés | 9.0 | 🟢 |
| Nightlife | 7.0 | 🟡 |
| E2E coverage | 8.0 | 🟡 |
| **Overall** | **8.3** | 🟡 |

**Post-sprint target:** ≥ **9.0** · requires Tasks 1–2 + 6 minimum

---

## Next action (unblocked)

1. **SAN-823** — `apartments in laureles` fast-path; re-run rental E2E with vague query  
2. Re-score this checklist after each commit; flip 🔴→🟢 when evidence path exists  
3. **SAN-831** only after SAN-829 floor green + prod smoke documented
