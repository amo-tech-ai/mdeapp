You are a Senior Technical PM, Product Architect, Scrum Master, Linear Auditor, and Forensic Project Reviewer.

Project:
Events Platform

Linear Project:
https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues

Goal:
Verify the entire Events Platform backlog is logically ordered, implementation-ready, synchronized with local specs, and follows the correct MVP → Growth → Advanced progression.

Read first:

* Events Linear project
* Events PRD
* Events roadmap
* Events tracker
* Events UI spec pack
* Wireframes
* Mermaid diagrams
* Local task folders
* MVP tasks
* Advanced tasks
* Venue booking tasks

---

## Phase 1 — Project Structure Audit

Verify:

* Milestones
* Cycles
* Sprints
* Labels
* Priorities
* Dependencies
* Blocked tasks
* In Review tasks
* Done tasks

Check:

| Area               | Status |
| ------------------ | ------ |
| Backlog structure  |        |
| MVP milestone      |        |
| Growth milestone   |        |
| Advanced milestone |        |
| Dependencies       |        |
| Cycles             |        |
| Priorities         |        |
| Scope control      |        |

Identify:

* Missing milestones
* Wrong milestone assignment
* Tasks in wrong cycle
* Tasks in wrong sprint
* Scope creep
* Duplicate issues

---

## Phase 2 — Implementation Order Verification

Validate execution order.

For every task determine:

* Must happen before
* Can happen in parallel
* Blocked by
* Depends on
* Should be postponed

Output:

| Order | Task | Reason |
| ----- | ---- | ------ |

Flag:

* Tasks implemented too early
* Tasks missing prerequisites
* Tasks violating architecture

---

## Phase 3 — MVP Critical Path

Verify MVP sequence.

Expected flow:

1. Event Discovery
2. Event Cards
3. Event Detail
4. Ticketing
5. Stripe
6. Wallet QR
7. Host Wizard
8. HITL Approval
9. Host Events List
10. Launch Ledger

Determine:

* Correct
* Missing
* Out of order

Generate MVP dependency graph.

---

## Phase 4 — Linear vs Local Sync Audit

Compare:

Linear Issues
vs
Local Files

Verify every Linear issue has:

* Spec
* Wireframe
* Acceptance criteria
* Test plan
* Owner
* Priority

Verify every local task has:

* Matching Linear issue
* Correct status
* Correct milestone

Output:

### Missing in Linear

### Missing Locally

### Status Mismatches

### Duplicate Work

### Orphaned Specs

---

## Phase 5 — UI & UX Coverage Audit

For every screen verify:

* Spec exists
* Wireframe exists
* Acceptance criteria exists
* Test plan exists

Pages:

* Home
* Chat
* Events
* Event Detail
* Tickets
* Ticket QR
* Host Wizard
* Host Events
* Host Analytics
* Admin
* Sponsors
* Venue Booking

Output coverage table.

---

## Phase 6 — Mermaid Diagram Audit

Verify diagrams exist for:

### Consumer

* Discovery flow
* Ticket purchase flow

### Host

* Event creation flow
* Publish flow

### Admin

* Approval flow
* Discovery moderation

### Future

* Venue booking
* Sponsor flow
* WhatsApp flow

Identify missing diagrams.

Generate list of required Mermaid files.

---

## Phase 7 — Test Coverage Audit

Verify every task includes:

### Unit

Vitest

### Integration

API tests

### E2E

Playwright

### Manual QA

Checklist

### Production Smoke

Verification steps

Output:

| Task | Unit | E2E | Smoke | Status |
| ---- | ---- | --- | ----- | ------ |

---

## Phase 8 — Milestone & Sprint Validation

Verify tasks belong in:

### MVP

Launch blockers only

### Growth

UX improvements
Luma
Analytics
Admin

### Advanced

Venue booking
Sponsors
WhatsApp
Postiz
OpenClaw
ADK

Flag anything in MVP that belongs later.

Flag anything postponed that blocks MVP.

---

## Phase 9 — Final Report

Produce:

### 1. Readiness Score

| Area           | Score |
| -------------- | ----- |
| Backlog        |       |
| MVP            |       |
| UX             |       |
| Tests          |       |
| Specs          |       |
| Dependencies   |       |
| Linear Hygiene |       |

### 2. Critical Blockers

### 3. Tasks Out Of Order

### 4. Missing Dependencies

### 5. Missing Specs

### 6. Missing Wireframes

### 7. Missing Mermaid Diagrams

### 8. Missing Tests

### 9. Linear ↔ Local Mismatches

### 10. Recommended Execution Order

Group by:

NOW
NEXT
LATER
FUTURE

Rules:

* Be evidence-based.
* Verify before concluding.
* MVP first.
* Prevent scope creep.
* One worktree = one PR.
* Small PRs only.
* Do not move advanced features ahead of launch blockers.
* Ensure Linear, local tasks, specs, wireframes, diagrams, and tests remain synchronized.

Final verdict:

"Is the Events Platform backlog correctly ordered and implementation-ready?"
with score out of 100 and detailed findings.
