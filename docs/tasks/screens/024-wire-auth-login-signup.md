---
type: wireframe
id: WIRE-024
number: "024"
title: Login / Signup
persona: All
path: /login
priority: P0
build_status: Not Started
screens:
  - 017-scr-login-signup-polish.md
screen_ids:
  - SCREEN-017
skill:
  - mde-wireframe
---
# Wireframe: Login / Signup

**Source:** legacy `Login.tsx`, `Signup.tsx`, `ForgotPassword.tsx`  
**Persona:** All · **Paths:** `/login`, `/signup`, `/forgot-password` · **Auth:** public

## Login

```text
┌─────────────────────────────────────────┐
│ mdeai                                   │
│ Sign in to save trips & book tickets    │
│                                         │
│ Email    [________________________]     │
│ Password [________________________]     │
│ [Sign in]                               │
│ ─────────── or ───────────              │
│ [Continue with Google]                  │
│ Forgot password? · Create account       │
└─────────────────────────────────────────┘
```

## Signup

Same shell + confirm password · ToS checkbox · redirect `/onboarding` or `/`

## Unlocks (legacy matrix)

| Feature | Anon | Logged in |
|---------|------|-----------|
| Chat | 3-msg gate (Phase 2) | Unlimited |
| Save / trips / bookings | ❌ | ✅ |
| Ticket purchase | Token access | Full account |

## Implementation

Supabase SSR · `/login` not inside CopilotKit shell — minimal layout, no 3-panel

## Error states

Invalid credentials · Email not confirmed · OAuth cancel

## Mobile

Full-screen centered card; same fields
