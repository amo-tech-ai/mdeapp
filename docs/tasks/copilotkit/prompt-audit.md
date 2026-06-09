You are a senior software specialist and forensic auditor.

Audit /home/sk/mdeai/mdeapp for CopilotKit + Mastra best practices.

Use official references:
- https://docs.copilotkit.ai/
- https://docs.copilotkit.ai/mastra
- https://docs.copilotkit.ai/mastra/prebuilt-components
- https://docs.copilotkit.ai/mastra/custom-look-and-feel/slots
- https://docs.copilotkit.ai/mastra/custom-look-and-feel/headless-ui
- https://docs.copilotkit.ai/mastra/programmatic-control
- https://docs.copilotkit.ai/mastra/inspector
- https://docs.copilotkit.ai/mastra/generative-ui/your-components/display-only
- https://docs.copilotkit.ai/mastra/generative-ui/your-components/interactive
- https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering
- https://docs.copilotkit.ai/mastra/generative-ui/state-rendering
- https://docs.copilotkit.ai/mastra/generative-ui/mcp-apps
- https://docs.copilotkit.ai/mastra/generative-ui/a2ui
- https://docs.copilotkit.ai/mastra/frontend-tools
- https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read
- https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write
- https://docs.copilotkit.ai/mastra/threads
- https://docs.copilotkit.ai/mastra/agent-app-context
- https://docs.copilotkit.ai/mastra/human-in-the-loop/interrupt-flow
- https://docs.copilotkit.ai/mastra/human-in-the-loop/tool-based
- https://docs.copilotkit.ai/mastra/copilot-runtime
- https://docs.copilotkit.ai/mastra/ag-ui
- https://docs.copilotkit.ai/mastra/troubleshooting/common-issues
- https://mastra.ai/guides/build-your-ui/copilotkit
- https://mastra.ai/blog/copilotkitmastra
- https://mastra.ai/docs/v0/frameworks/agentic-uis/copilotkit
- https://mastra.ai/blog/fullstack-typescript-agents-with-mastra-and-copilotkit

Project rules:
- CopilotKit 1.55.2 only. Do not mix v1/v2 imports.
- Mastra owns orchestration.
- CopilotKit owns UI.
- Supabase owns truth.
- Gemini explains, but must not invent data.
- No autonomous publish, payment, ticket, lead, WhatsApp, or database mutation without approved deterministic path.
- Keep one router + workflows. Avoid agent sprawl.
- Use AG-UI/CopilotRuntime, not a custom SSE/chat runtime.
- Use strict Zod contracts for tools, state, and render payloads.

Audit scope:
1. Runtime wiring
   - Check /api/copilotkit route.
   - Check Mastra local agent registration.
   - Check CopilotKit provider/runtimeUrl/agent setup.
   - Check if routerAgent is actually wired or still using pingAgent.
   - Check for duplicate Mastra servers or split runtime risk.

2. CopilotKit best practices
   - useCoAgent usage.
   - useCopilotAction usage.
   - Generative UI tool rendering.
   - Shared state sync.
   - Frontend tools.
   - Threads/session handling.
   - Agent app context.
   - Programmatic control.
   - Inspector/debug support.
   - Custom look and feel / slots / headless UI usage.

3. Mastra best practices
   - Agent structure.
   - Workflow structure.
   - Tool schemas.
   - Error handling.
   - Streaming behavior.
   - Memory/storage.
   - Observability.
   - Tool audit wrappers.
   - Avoid dynamic unsafe access like mastra.agents.X if risky.

4. Safety and production blockers
   - Service role key leakage.
   - Browser-exposed server secrets.
   - Missing auth checks.
   - Missing RLS assumptions.
   - Missing HITL approval for publish/payment/lead/booking.
   - Missing rate limits.
   - Missing audit logs.
   - Missing deterministic commit paths.

5. UI and product behavior
   - Cards render from tool payloads only.
   - No invented listings/events/places.
   - Map pins sync correctly.
   - Loading/error/empty states exist.
   - Mobile responsiveness.
   - Reduced motion support.
   - No duplicate cards or duplicate pins.

6. Tests to run
   - npm run lint
   - npm run typecheck if available
   - npm test -- --run
   - npm run build
   - npm run floor
   - Playwright relevant CopilotKit/Mastra/chat/map/host/event tests
   - Add or suggest missing tests if gaps exist.

Generate a forensic audit report with:

A. Executive verdict
- Production ready: yes/no
- Overall score /100
- CopilotKit score /100
- Mastra score /100
- UI score /100
- Security score /100
- Test coverage score /100

B. Score table using dots
- 🟢 90–100 correct
- 🟡 70–89 acceptable but needs improvement
- 🔴 0–69 blocker or risky

C. Findings table
For each issue include:
- Dot
- Area
- File/path
- Problem
- Why it matters
- Severity: P0/P1/P2
- Exact fix
- Test to prove fixed
- Percent correct

D. Task-by-task corrections
List each required correction as:
- Task name
- Files to inspect/change
- Acceptance criteria
- Commands to run
- Expected proof
- Risk if skipped

E. Red flags and blockers
Separate true blockers from nice-to-have improvements.

F. Best-practice comparison
Compare current code against official CopilotKit + Mastra docs.

G. Final go/no-go
Say clearly:
- Merge safe?
- Production safe?
- What must be fixed before launch?
- What can wait?

Do not make code changes unless the audit clearly identifies a safe, isolated fix.
Do not over-engineer.
Do not mark anything 100% correct witho
::contentReference[oaicite:2]{index=2}
ut test proof.