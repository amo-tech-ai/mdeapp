Use this in Cursor:

You are Cursor acting as a senior technical PM, frontend architect, task verifier, and QA auditor for mdeai Events.

Goal: review the Events UI spec pack and fix any errors in task flow, specs, Linear mapping, tests, and diagrams before implementation starts.

Use these skills:

* task-verifier
* mde-task-lifecycle
* shadcn
* web-design-guidelines
* ui-ux-pro-max
* tailwind-best-practices
* testing
* mermaid-diagrams
* copilotkit-integrations

Read first:

* `tasks/events/specs/INDEX.md`
* `tasks/events/specs/LINEAR-COVERAGE.md`
* `tasks/events/pages-ui-inventory.md`
* `tasks/events/index-events.md`
* `tasks/events/wireframes/INDEX.md`
* `tasks/screens/SCREEN-027-events-browse.md`
* `tasks/events/tasks/MVP/EVP-014-core-host-events-list-page.md`
* `sitemap.md`
* `DESIGN.MD`
* `CLAUDE.md`

Process:

1. Verify spec correctness
   Check every Events UI spec for:

* correct route
* correct persona
* correct status
* correct Linear issue
* correct dependency order
* correct implementation phase
* no duplicate task ownership
* no MVP scope creep
* no missing acceptance criteria

2. Verify task flow
   Confirm the implementation order is correct:

* PR-1: SAN-730 enable `/host/events` nav
* PR-2: SAN-731 event detail a11y + loading skeleton
* PR-3: SAN-135 Luma hero + host block
* PR-4: SAN-732 spec pack + drift fixes

Flag anything that should move earlier or later.

3. Verify existing pages
   Check code against specs for:

* `/events`
* `/events/[slug]`
* `/host/event/new`
* `/host/events`
* `/me/tickets`
* `/me/tickets/[id]`

For each page, verify:

* loading state
* empty state
* error state
* mobile layout
* accessibility
* CTA behavior
* test coverage
* design token compliance

4. Fix docs if wrong
   If a spec, index, wireframe, or task file is stale, update it.
   Do not change production code unless the fix is docs-only or explicitly required by PR-1/PR-2.

5. Add Mermaid diagrams
   Create or update diagrams for:

* Events UI route map
* Buyer ticket journey
* Host publish journey
* Admin/discovery approval future flow
* Venue booking future flow

Use simple Mermaid flowcharts. Put diagrams in the relevant spec files or `tasks/events/specs/DIAGRAMS.md`.

6. Test plan
   Create a clear test matrix:

* Vitest tests needed
* Playwright tests needed
* manual QA steps
* prod smoke checks
* accessibility checks
* mobile checks

Map tests to Linear issues.

7. Final audit report
   Output a concise markdown report with:

* errors found
* files changed
* diagrams added
* tests added or recommended
* corrected task order
* blockers
* next PR plan
* confidence score /100

Rules:

* Do not build venue booking yet.
* Do not build admin dashboards yet.
* Do not build sponsor CRM yet.
* Do not move post-MVP features into MVP.
* Keep each PR small.
* One worktree, one PR.
* Follow `DESIGN.MD` strictly.
* No hardcoded gray/zinc colors.
* No fake Done status without proof.

Expected result:
The Events UI spec pack becomes implementation-ready, with correct flow, tests, diagrams, and no stale task status.
