---
task: D-PTR-07
title: "/contact — Book a demo / sales"
linear: SAN-693 · MKT — Contact / Book a demo (/contact)
route: /contact
status_today: 404 — not built
wireframe: ../../wireframes/contact-wireframe.html (authored 2026-06-10; includes loading/success/error state variants)
priority: P1
signup_types: n/a (lead capture)
---

# D-PTR-07 — `/contact`

> Common contract in [INDEX.md](./INDEX.md) applies.

**Goal:** the "Book a demo" target every landing's secondary CTA points at. A demo request is a partner lead — store it where ops can see it.

## Scope addition (2026-06-10 — Mindtrip pattern)

This task also ships the **`DemoBand` component** — the full-width dark closing band with the embedded short lead form ("See mdeai for Business in action." treatment) that EVERY D-PTR page renders as its final section (INDEX high-end bar, rule 1). Same endpoint, same states; `/contact` is the long-form canonical page, `DemoBand` the inline version. Build them together — one endpoint, two skins.

## Sections

1. **Split hero** — left: form (name, business, partner type select, email, WhatsApp, message); right: what happens next (we reply < 24h · 15-min call · live demo on your data).
2. **Submit** → POST to a server route writing a lead row (reuse the leads pattern from the schedule-viewing flow — RLS rules apply; anon insert policy or server route). Confirmation state inline (no redirect), mirroring SAN-716 — "Lead submitted" confirmation pattern.
3. **Alt contact** — WhatsApp deep link + email.

## Components (pinned)

shadcn/ui: `form` `input` `select` `textarea` `button` `sonner` (success toast) `skeleton`.

21st.dev (top-ranked, install `npx shadcn@latest add "https://21st.dev/r/{author}/{slug}"`, re-token to oklch):

| Page section | 21st.dev category | URL |
|---|---|---|
| 1. Split contact form layout | Forms (23+) | `21st.dev/s/forms` |
| Inputs w/ floating labels | Inputs (102+) | `21st.dev/s/inputs` |
| Partner-type select | Selects (62+) | `21st.dev/s/selects` |

## Acceptance criteria

- [ ] Submit writes a lead (verify row lands; table has RLS + ≥1 policy if new)
- [ ] Success + error + loading states (skeleton/disabled) all designed
- [ ] Partner-type select prefills from `?type=` query param
- [ ] Tokens/motion rules + localhost 200 + floor green + Playwright e2e (submit happy path)
