---
id: F30
title: Port OnboardingLayout — first-run shell
status: Not Started
priority: P2
phase: W7 — Day 1 (first-run UX polish, post-MVP feature)
effort: 1h (shell + smoke + tests)
owner: claude
depends_on: [F07]
skill: [shadcn, react-best-practices]
parent_plan: /home/sk/mdeai/plan/07-legacy-design-port-plan.md
verified_against:
  - legacy: /home/sk/mde/src/components/onboarding/OnboardingLayout.tsx
  - PRD §51 (post-MVP first-run UX)
---

# F30 — OnboardingLayout

## 1. Purpose

A first-time visitor to mdeapp lands on `/` and currently sees the CopilotKit chat sidebar against a near-empty page. Legacy proved a guided onboarding shell that explains "what is mdeai?" / "who is this for?" with hero imagery and three persona entry points. F30 ports that shell as `<OnboardingLayout>` — a layout component used by a new `/welcome` route shown to first-time visitors (cookie-based detection, no DB write needed Phase 1).

## 2. Goals

- `mdeapp/src/components/onboarding/OnboardingLayout.tsx` — shell with hero, persona-pick CTAs (Roberto / Camila / Tourist), and a "skip to chat" link
- `mdeapp/src/app/welcome/page.tsx` — uses `<OnboardingLayout>`; redirects to `/` when first-visit cookie is set
- ≥ 2 Vitest tests (shell renders · all 3 persona CTAs visible)
- Uses F22 hero photos for the background strip
- No interference with CopilotKit chat (F30 is a route-level shell; CopilotKit provider mounts at app root only)
- Gate 9 — `curl :3001/welcome` HTTP 200 with all 3 persona names in body

## 3. Features (persona value)

| Persona | What they get |
|---|---|
| **Roberto** (first visit) | Sees a "Host an event" CTA front and center; click → `/host/event/new` (W3) |
| **Camila** (first visit) | Sees "Find an apartment" CTA → `/rentals` (W5) |
| **Tourist** (first visit) | Sees "Explore Medellín" CTA → `/chat` (W6) |
| **Returning visitor** | Cookie set → `/welcome` redirects to `/` (no shell again) |

## 4. Workflows

1. **Pre-flight:** confirm F07 primitives + F22 hero photos exist.
2. Create `mdeapp/src/components/onboarding/OnboardingLayout.tsx`:
   - Server Component (no `useState` — wholly static layout)
   - Props: `{ children: ReactNode }` (children render in a card below the hero)
   - Slot: 3 `<Button>` CTAs as direct children (composable, not hardcoded)
3. Create `mdeapp/src/app/welcome/page.tsx`:
   - Server Component reads cookie `mdeai_visited` via `cookies()` from `next/headers`
   - If set → `redirect("/")` from `next/navigation`
   - If not set → render `<OnboardingLayout>` with 3 persona CTAs, plus a `<form>` with a Server Action that sets `mdeai_visited` and redirects
4. Add `mdeapp/src/components/onboarding/__tests__/OnboardingLayout.test.tsx`:
   - T-A: renders 3 persona CTAs
   - T-B: hero image src points at `/hero/...`
5. `npm run floor` — exit 0.
6. Gate 9 — `curl :3001/welcome` → HTTP 200 + body contains "Roberto" + "Camila" + "Tourist".
7. Write `tasks/notes/F30-evidence.md`.

## 5. User journeys

- **First-time Roberto** → lands on `/welcome` → sees hero + "Host an event" CTA → clicks → `/host/event/new` (W3 surface).
- **Returning Roberto** → lands on `/welcome` → cookie present → server-side redirect to `/` (no flash of welcome content).
- **Roberto via deep link to `/rentals`** → onboarding does not interfere (only `/welcome` route is the shell).

## 6. Agents

None — pure layout + cookie check.

## 7. Integrations

| Integration | Purpose |
|---|---|
| F07 shadcn | Card / Button |
| F22 photos | Hero background strip |
| Next 16 `cookies()` from `next/headers` | First-visit detection (Server Component) |
| Next 16 Server Action | Set the visited cookie + redirect |

## 8. Summary

Build a route-level onboarding shell with 3 persona CTAs + cookie-based first-visit detection. Server Components throughout (no client `useState`). Uses F07 + F22. ~1h. Used once at the welcome surface — does not touch the CopilotKit chat surface at `/`.

## 9. Definition of Done

- [ ] `mdeapp/src/components/onboarding/OnboardingLayout.tsx` exists (Server Component)
- [ ] `mdeapp/src/app/welcome/page.tsx` exists with cookie redirect
- [ ] ≥ 2 Vitest tests pass
- [ ] No `"use client"` in the layout or page (Server Components only)
- [ ] No CopilotKit imports in the welcome page (the shell does not mount CopilotKit again — that lives at app root)
- [ ] `npm run floor` exit 0
- [ ] Localhost `curl :3001/welcome` → HTTP 200 + 3 persona names in body
- [ ] Evidence at `tasks/notes/F30-evidence.md`

## 10. Tests

| # | Test | Expected |
|---|---|---|
| T1 | Layout exists | `test -f mdeapp/src/components/onboarding/OnboardingLayout.tsx` |
| T2 | Welcome route exists | `test -f mdeapp/src/app/welcome/page.tsx` |
| T3 | Vitest ≥ 2 | `npm test` |
| T4 | No `"use client"` | `! grep -E '^"use client"' mdeapp/src/components/onboarding/*.tsx mdeapp/src/app/welcome/page.tsx` |
| T5 | No CopilotKit import in welcome | `! grep -E '@copilotkit' mdeapp/src/app/welcome/page.tsx` |
| T6 | Floor green | `npm run floor` |
| T7 | Localhost HTTP 200 | curl probe |
| T8 | Body has 3 persona names | `curl -s :3001/welcome \| grep -ciE 'Roberto\|Camila\|Tourist'` ≥ 3 |

### Negative tests

| # | Inject | Expected |
|---|---|---|
| Tn1 | Add `"use client"` to OnboardingLayout | T4 fails — confirms Server-Component contract |
| Tn2 | Add `import { CopilotKit }` to welcome page | T5 fails — guard against double-mount |

## 11. Rollback

```bash
rm -rf mdeapp/src/components/onboarding/ mdeapp/src/app/welcome/
```

## Notes

- **No CopilotKit interference:** the chat provider mounts in `mdeapp/src/app/layout.tsx` — F30 does not re-wrap it.
- **Cookie-only first-visit detection** Phase 1; a DB-backed onboarding-completed flag is Phase 2.
- **W7 placement** is intentional — onboarding polish lands after the three core flows (Roberto W3-W4, Camila W5, Tourist W6) work end-to-end.
