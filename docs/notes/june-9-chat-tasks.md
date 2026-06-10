# UX-037 — Concierge improvements sprint (Linear index)

**Linear view:** [CHAT](https://linear.app/sanjiovani/view/chat-5e4071d8144e) · Filter: `label:CHAT`  
**Full tracker:** [`mdeapp/linear/markdown/CHAT.md`](../../linear/markdown/CHAT.md) · **Audit gate:** [`mdeapp/linear/audit-checklist.md`](../../linear/audit-checklist.md)

**Spec:** [`june-9-chat-improve.md`](./june-9-chat-improve.md) · **Audit prompt:** [`june-9-prompt.md`](./june-9-prompt.md)  
**Checklist scores:** `june-9-chat-improve.md` § Verification  
**Disk spec:** [`tasks/ux/tasks/UX-037-concierge-improvements-sprint.md`](../../../tasks/ux/tasks/UX-037-concierge-improvements-sprint.md)  
**Predecessor:** [SAN-733](https://linear.app/sanjiovani/issue/SAN-733) (Done) · **Branch:** `ai/san-822-ux-037-concierge-improvements-sprint`

---

## Epic

| SPEC | Linear | Title | Status |
|------|--------|-------|--------|
| UX-037 | [SAN-822](https://linear.app/sanjiovani/issue/SAN-822) | Concierge improvements sprint (post SAN-733) | Todo |

---

## Execution order (v2)

**823 → 828 → 824 → 827 → 825 → 826 → 829 → 830 → 831**

| Order | SPEC | Linear | Task | Commit |
|------:|------|--------|------|--------|
| — | — | [SAN-733](https://linear.app/sanjiovani/issue/SAN-733) | Home handoff (Done) | PR #134 |
| 1 | UX-038 | [SAN-823](https://linear.app/sanjiovani/issue/SAN-823) | Rentals pattern fast-path | `fix(rentals): improve search routing and latency` |
| 2 | UX-043 | [SAN-828](https://linear.app/sanjiovani/issue/SAN-828) | CopilotKit 401/400 audit | `fix(api): align copilotkit error responses` |
| 3 | UX-039 | [SAN-824](https://linear.app/sanjiovani/issue/SAN-824) | Event pins (upstream first) | `fix(events): improve venue pin coverage` |
| 4 | UX-042 | [SAN-827](https://linear.app/sanjiovani/issue/SAN-827) | Nightlife prod-synthetic #5 | `test(nightlife): add regression coverage` |
| 5 | UX-040 | [SAN-825](https://linear.app/sanjiovani/issue/SAN-825) | Restaurant photos (measure) | `fix(restaurants): improve image fallback handling` |
| 6 | UX-041 | [SAN-826](https://linear.app/sanjiovani/issue/SAN-826) | Café Place ID audit | `fix(cafes): improve place validation coverage` |
| 7 | UX-044 | [SAN-829](https://linear.app/sanjiovani/issue/SAN-829) | Validation gate | — |
| 8 | UX-045 | [SAN-830](https://linear.app/sanjiovani/issue/SAN-830) | Documentation | `docs(concierge): update audit and launch readiness` |
| 9 | UX-046 | [SAN-831](https://linear.app/sanjiovani/issue/SAN-831) | Ship PR | `feat(concierge): improve search quality, map coverage and reliability` |

**Start:** [SAN-823](https://linear.app/sanjiovani/issue/SAN-823)

---

## Evidence paths (per task)

```
tasks/testing/evidence/YYYY-MM-DD/chat-sprint/
├── san-823-rentals/
├── san-828-copilotkit/
├── san-824-events/
├── san-827-nightlife/
├── san-825-restaurants/
├── san-826-cafes/
├── san-829-floor/
└── RESULTS.md
```

---

## Quick links

| Resource | Path |
|----------|------|
| Mermaid journeys + prod checklist | [`linear/markdown/CHAT.md`](../../linear/markdown/CHAT.md) |
| User stories + Mastra audit + roadmap | [`CHAT.md` § User stories / Mastra / Improvements](../../linear/markdown/CHAT.md) |
| AI & Intelligence project | [Linear project](https://linear.app/sanjiovani/project/ai-and-intelligence-fe206edb90b2/issues) |
| Done gate | [`linear/audit-checklist.md`](../../linear/audit-checklist.md) |
| Concierge audit | [`docs/audits/concierge-audit.md`](../audits/concierge-audit.md) |
| Launch readiness | [`docs/audits/launch-readiness.md`](../audits/launch-readiness.md) |
