# Cursor Prompt — Audit, Improve, Correct, and Reprioritize Concierge Sprint

Act as a Principal Engineer, Staff Architect, QA Lead, CopilotKit Specialist, Mastra Architect, and Production Auditor.

Review the Concierge Sprint plan, implementation order, Linear issues, audit scores, and evidence.

**Linear view:** filter `label:CHAT` · epic [SAN-822](https://linear.app/sanjiovani/issue/SAN-822)  
**Task index:** [`june-9-chat-tasks.md`](./june-9-chat-tasks.md) · **Scores:** [`june-9-chat-improve.md`](./june-9-chat-improve.md) § Verification

### Current optimized order (v2 — applied)

1. [SAN-823](https://linear.app/sanjiovani/issue/SAN-823) Rentals — pattern fast-path (not blind clarify skip)
2. [SAN-828](https://linear.app/sanjiovani/issue/SAN-828) CopilotKit — audit 401 vs 400 **before** heavy map work
3. [SAN-824](https://linear.app/sanjiovani/issue/SAN-824) Events — upstream venue coords; geocode gaps only
4. [SAN-827](https://linear.app/sanjiovani/issue/SAN-827) Nightlife — prod-synthetic 5th query (not new spec file)
5. [SAN-825](https://linear.app/sanjiovani/issue/SAN-825) Restaurants — measure placeholders first
6. [SAN-826](https://linear.app/sanjiovani/issue/SAN-826) Cafés — audit + graceful degrade
7. [SAN-829](https://linear.app/sanjiovani/issue/SAN-829) → [SAN-830](https://linear.app/sanjiovani/issue/SAN-830) → [SAN-831](https://linear.app/sanjiovani/issue/SAN-831)

Use:

* MCP tools
* GitHub
* Linear
* Playwright
* CopilotKit docs
* Mastra docs
* Supabase docs
* Google Maps docs
* Production best practices

---

# Goal

Audit the entire Concierge Sprint and identify:

* incorrect assumptions
* missing tasks
* unnecessary tasks
* incorrect priorities
* architectural risks
* technical debt
* testing gaps
* UX gaps
* performance issues
* production blockers

Do not implement code yet.

---

# Task 1 — Audit Sprint Structure

Review:

* SAN-822 → SAN-831
* blockedBy chain
* implementation order
* dependencies
* scope

Determine:

| SAN | Correct Priority? | Blocked By Correct? | Keep | Change | Why |
| --- | ----------------- | ------------------- | ---- | ------ | --- |

Suggest better ordering if needed.

---

# Task 2 — Audit Each SAN

For every SAN:

* score correctness
* score business value
* score technical value
* score user impact
* score implementation effort

Output:

| SAN | Current Score | Recommended Score | Priority | Reason |
| --- | ------------- | ----------------- | -------- | ------ |

---

# Task 3 — Challenge Assumptions

Verify whether these should actually be fixed:

### SAN-823 Rentals

Is skipping clarify always correct?

Could it reduce search quality?

What patterns should bypass clarify?

---

### SAN-824 Events

Do we need geocoding?

Or should event data quality be fixed upstream?

Compare:

* geocode fallback
* cached coordinates
* source data improvements

Recommend best approach.

---

### SAN-825 Restaurants

Are placeholders actually hurting conversion?

Measure before building.

---

### SAN-826 Cafes

Should missing Place IDs be fixed?

Or should booking gracefully degrade?

---

### SAN-827 Nightlife

Do we need a dedicated E2E?

Or add nightlife to existing synthetic coverage?

---

### SAN-828 CopilotKit

Is 401 actually wrong?

Or is smoke expecting the wrong status code?

Verify before changing code.

---

# Task 4 — Missing Improvements

Identify missing high-value work.

Examples:

* search latency
* cache layer
* telemetry
* analytics
* observability
* query routing
* map performance
* error tracking
* retries
* monitoring

Output:

| Missing Task | Impact | Priority |
| ------------ | ------ | -------- |

---

# Task 5 — Testing Improvements

Review current coverage.

Identify:

* missing E2E
* missing smoke tests
* missing production checks
* flaky tests

Output:

| Test | Current | Gap | Fix |
| ---- | ------- | --- | --- |

---

# Task 6 — Production Readiness

Re-score:

| Area | Current | Target | Recommendation |
| ---- | ------- | ------ | -------------- |

Areas:

* Homepage
* Concierge
* Rentals
* Events
* Restaurants
* Cafes
* Nightlife
* Maps
* Search
* Analytics
* Testing

---

# Task 7 — Create Optimized Sprint Plan

**Status: v2 applied** — see [`june-9-chat-tasks.md`](./june-9-chat-tasks.md).

| Order | SAN | Why moved |
|------:|-----|-----------|
| 1 | [SAN-823](https://linear.app/sanjiovani/issue/SAN-823) | Camila P0 — rental latency on home handoff |
| 2 | [SAN-828](https://linear.app/sanjiovani/issue/SAN-828) | Unblocks prod smoke early; cheap audit vs geocode work |
| 3 | [SAN-824](https://linear.app/sanjiovani/issue/SAN-824) | Pins need API quality first, geocode as fallback |
| 4 | [SAN-827](https://linear.app/sanjiovani/issue/SAN-827) | Lean test — extend prod-synthetic, not new spec |
| 5 | [SAN-825](https://linear.app/sanjiovani/issue/SAN-825) | Lower ROI until measured on prod |
| 6 | [SAN-826](https://linear.app/sanjiovani/issue/SAN-826) | Degrade UX > invent Place IDs |
| 7–9 | SAN-829/830/831 | Validation → docs → single PR |

If audit finds a better sequence, update Linear `blockedBy` + task index.

---

# Task 8 — Final Recommendations

Provide:

### Keep

What should remain unchanged.

### Improve

What should change.

### Remove

What is unnecessary.

### Add

What is missing.

### Risks

Potential failure points.

### Best Practices

Recommendations from:

* CopilotKit
* Mastra
* Supabase
* Google Maps
* Playwright

---

# Output Required

Return:

1. Executive summary
2. Corrected sprint roadmap
3. Updated scores
4. Missing tasks
5. Risks
6. Recommended implementation order
7. Production readiness score
8. Final grade out of 100

Do not write code.

Do not create commits.

Do not create PRs.

Perform a senior architecture and production audit only.

---

## Linear CHAT view (create in UI)

1. **Issues** → **Views** → **New view**
2. Filter: `label:CHAT`
3. Optional: `state:Todo,"In Progress","In Review"` · group by **Priority** or **Project**
4. Sort: manual order matching v2 chain above

Includes SAN-733 (Done) + SAN-822…831 (sprint pack).
