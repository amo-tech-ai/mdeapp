---
type: wireframe
screen_number: "020"
title: Moderation
route: /admin/events
persona: [Patricia]
phase: MVP
---

# Wireframe: Moderation

## Page goal

Review flagged events, discovery queue, public Q&A approvals.

## Components

ModerationQueue · EventPreview · ApproveReject · DiscoveryCandidateCard

## AI features

AI drafts flagged — human decides

## Mermaid

```mermaid
flowchart TD
  Q[Queue item] --> R{Approve?}
  R -->|Yes| P[Publish or show]
  R -->|No| X[Reject + log]
```
