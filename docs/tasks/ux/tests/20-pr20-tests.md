Use this for PR #17:

For PR #17 (`feat(ux): UX-002 error bubble + UX-005 thinking indicator`), run a focused forensic verification before merge.

Requirements:

* review all changed files first
* use relevant Claude skills + MCP/docs verification
* verify against official docs for CopilotKit, React, Zustand/store patterns, and Next.js client components
* keep scope limited to PR #17 only
* no unrelated refactors
* no architecture redesign

Verification steps:

1. Static validation

* npm run lint
* npm run typecheck

2. Full test suite

* npm test

3. Targeted PR #17 tests

* error bubble renders when CopilotKit/concierge error occurs
* error bubble does not persist forever after recovery
* thinking indicator appears during pending concierge response
* thinking indicator disappears when response completes
* no duplicate loading states
* no hydration/client component errors
* no broken mobile layout
* no regression to existing chat/result cards

4. Runtime/smoke verification

* start local dev server
* open `/`
* trigger a normal concierge message
* trigger or simulate an error response
* verify UX behavior visually
* check browser console for errors
* check terminal logs for runtime errors

5. PR discipline

* confirm branch is small and focused
* confirm no unrelated files changed
* confirm clean git state
* confirm PR #17 can merge before PR #18/#19

Return:

* exact commands run
* tests passed/failed
* browser/runtime proof
* changed files reviewed
* critical blockers
* remaining risks
* merge readiness %
* recommended next step
