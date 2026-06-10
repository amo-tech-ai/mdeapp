Investigate the production concierge launch regression.

Role:
Act as Senior Software Specialist, Forensic Auditor, CopilotKit Engineer, Next.js App Router Engineer, UX QA Lead, and MCP Browser Tester.

Problem:
Production home page looks correct, but the AI concierge/chat does not launch.

Observed in real Chrome:
- / loads visually.
- Query bar accepts text and sets ?q=...
- Clicking Ask does not open chat/results.
- Clicking Ask the concierge does not open chat.
- Clicking Start exploring does not navigate.
- /chat redirects/aliases back to /
- DOM shows 0 textareas, 0 CopilotKit elements, 0 chat inputs.
- Console shows no errors.

This may be caused by:
- Next.js route/redirect issue
- /chat alias dropping query params
- Home query bar not wired to router
- CopilotKit not mounted
- Static marketing hero replacing live chat
- Client component not hydrated
- Button/link event handlers broken
- Feature flag/env issue
- Recent D-13 home reskin regression

Break the investigation into small steps.

Step 1 — Reproduce
Run with Chrome MCP, Playwright MCP, and local browser:
- Production: https://www.mdeai.co
- Localhost
- Preview deployment if available

Test:
- /
- /chat
- /?q=rooftop%20bars%20in%20Provenza
- /chat?q=rooftop%20bars%20in%20Provenza

Record:
- URL changes
- DOM elements
- console errors
- network requests
- API calls
- screenshots
- video if available

Step 2 — Find the owner code
Search for:
- Home page component
- query bar component
- Ask button handler
- Ask the concierge CTA
- Start exploring CTA
- /chat route
- redirects
- rewrites
- middleware
- CopilotKit provider
- CopilotKit runtime
- useCopilotAction
- CopilotChat
- CopilotSidebar
- /api/copilotkit

Step 3 — Identify which technology is failing

Create this table:

| Layer | Expected | Actual | Pass/Fail | Evidence |
|---|---|---|---|---|
| Next.js route /chat |
| Next.js search params |
| Home query form |
| Client hydration |
| CopilotKit provider |
| CopilotKit UI mount |
| API /api/copilotkit |
| Mastra agent |
| Browser event handlers |
| Middleware/redirects |

Step 4 — Run isolated tests

Create or run tests for:
- Home query submit navigates correctly
- /chat?q=... preserves q
- CopilotKit provider mounts
- Chat input exists
- Ask CTA opens chat
- Start exploring CTA works
- /api/copilotkit reachable
- No console errors
- No hydration errors

Step 5 — Use official docs and skills

Use:
- Next.js App Router official docs
- CopilotKit official docs
- Mastra docs
- Playwright docs
- shadcn/ui docs
- project skills:
  - copilotkit
  - mastra
  - nextjs
  - playwright
  - web-design-guidelines
  - task-verifier
  - mde-worktree-pr-flow

Step 6 — Diagnose root cause

Answer clearly:
- Is /chat supposed to be a real page or alias to /?
- Should CopilotKit mount on /?
- Should the query bar open chat inline or navigate?
- Is the home hero currently only static marketing UI?
- Was live chat removed during D-13 home reskin?
- Is this a frontend routing issue, CopilotKit mounting issue, or backend/API issue?

Step 7 — Fix plan

Do not immediately code until root cause is proven.

Create:

| Fix Option | Risk | Effort | Recommended |
|---|---|---|---|
| Restore /chat real route |
| Mount CopilotKit on home |
| Make query bar navigate to working route |
| Open CopilotSidebar from Ask button |
| Add fallback results page |
| Feature-flag chat until ready |

Step 8 — Minimal fix

If root cause is confirmed and fix is small:
- Make the smallest safe fix.
- Do not touch partner system.
- Do not start SAN-690.
- Keep PR focused on concierge launch only.

Step 9 — Validation

Run:
- npm test
- relevant chat/CopilotKit tests
- tsc --noEmit
- eslint changed files
- Playwright browser test
- Chrome MCP visual test
- 10x production smoke after deploy

Acceptance Criteria:
- Typing query on / and clicking Ask opens working concierge or results.
- /chat?q=... does not lose the query.
- Chat/CopilotKit UI mounts.
- At least one real chat input exists.
- /api/copilotkit is reachable.
- No console errors.
- No hydration errors.
- Mobile still works.

Output report:

# Concierge Regression Audit

| Area | Status | Evidence |
|---|---|---|

# Root Cause

Explain in simple words.

# Fix

Explain what changed.

# Tests

| Test | Result |
|---|---|

# Final Verdict

Use:
🟢 pass
🟡 watch
🔴 blocker
⚪ deferred

Question to answer:
Is the concierge launch production-ready now?

Important:
Do not create duplicate tasks.
Do not start SAN-690 — MKT Partner Dashboard.
This is higher priority than dashboard work because the concierge is the product north star.