
  Events board — what's actually next

  I pulled the Events Platform project (44 Todo · 1 Done · 1 In Progress) and
  cross-checked the Screens project. The signal is unusually clean:

  - Exactly one launch-phase event task exists: SAN-366 · EVT-002 — Host publish 
  production proof (phase:launch, High). Spec G3-core-host-publish-proof: "Roberto 
  publishes an event through the host wizard on production and the live event row appears 
  in Supabase."
  - Everything else is out of MVP phase: 12 contest tasks (CTEST-*, phase:phase2) + the
  entire EVT-001…032 discovery/social pack (phase:post-mvp).
  - Already done: event cards in chat (SAN-117), /events/[slug] detail, host wizard, and
  /host/events (the SAN-118 page I just shipped).
  - Commerce/ticket side is the deferred track (G1 paid ticket, webhook) — not active
  during Discovery Beta.

  Recommendation: SAN-366 (EVT-002) — the G3 North-star

  It's the natural sequel to what I just shipped: a successful publish lands a real card 
  on the /host/events page (which currently shows the empty state for your account). And
  it needs no new build — the wizard (/host/event/new) and commit API
  (/api/approval-commit) are already LIVE. It's mostly a prod proof: create → publish →
  verify the events row + the card appears.
  publishes an event through the host wizard on production and the live event row appears
  in Supabase."
  - Everything else is out of MVP phase: 12 contest tasks (CTEST-*, phase:phase2) + the
  entire EVT-001…032 discovery/social pack (phase:post-mvp).
  - Already done: event cards in chat (SAN-117), /events/[slug] detail, host wizard, and
  /host/events (the SAN-118 page I just shipped).
  - Commerce/ticket side is the deferred track (G1 paid ticket, webhook) — not active
  during Discovery Beta.

  Recommendation: SAN-366 (EVT-002) — the G3 North-star

  It's the natural sequel to what I just shipped: a successful publish lands a real card
  on the /host/events page (which currently shows the empty state for your account). And
  it needs no new build — the wizard (/host/event/new) and commit API
  (/api/approval-commit) are already LIVE. It's mostly a prod proof: create → publish →
  verify the events row + the card appears.

  One conflict I flagged in the note: tasks.md files EVT-002 in the deferred Commerce
  track ("after PAY-003"). But host publish doesn't touch Stripe — it's separable from the
  payment webhook, so the publish-proof half is safe to do now and validates the new
  page.

  I have an authenticated prod session open in Chrome. Want me to run the host-publish
  flow on prod now (drive the wizard → publish → confirm the events row in Supabase via
  MCP → screenshot the populated /host/events) and capture the G3 evidence for SAN-366? Or
  would you rather I scope it as a plan first?

✻ Baked for 4m 8s

※ recap: You're focusing on events after shipping the `/host/events` page (SAN-118, merged
  to prod). The next task is SAN-366, proving Roberto can publish an event on production.
  Next action: run the host-publish flow on prod and capture the G3 evidence, pending 
  your go-ahead.

───────────────────────────────────────────────────────────────── host-events-list-page ──
❯ 
──────────────────────────────────────────────────────────────────────────────────────────
  ⏵⏵ auto mode on (shift+tab to cycle) · ← for agents               ⧉ In notes-1-next.md
