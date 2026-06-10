---
type: wireframe
screen_number: "007"
title: Profile
route: /me
persona: [Andrés, Roberto]
phase: MVP
status: spec
---

# Wireframe: Profile

## Page goal

Identity hub — attending vs hosting tabs (Luma me-* pattern).

## User type

Attendee · Host

## User stories

```text
As Roberto I want to see hosting and attending in one profile
So that I switch context quickly
```

## Components

ProfileHeader · TabHosting · TabAttending · TabPast · SettingsLink

## Mobile

```text
┌─────────────────────────┐
│ [av] Name · Medellín    │
│ [Hosting][Attending]    │
│ Upcoming events list    │
└─────────────────────────┘
```

## Data sources

`users`, `events` by organizer, `tickets` by user

## AI features

Minimal — navigation only

## Mermaid

```mermaid
flowchart LR
  P[Profile] --> H[Hosting tab]
  P --> A[Attending tab]
  H --> HE[/host/events]
  A --> W[/me/tickets]
```
