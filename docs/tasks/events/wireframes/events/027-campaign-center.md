---
type: wireframe
screen_number: "027"
title: Campaign Center
route: /host/marketing
persona: [Roberto]
phase: Advanced
---

# Wireframe: Campaign Center

## Page goal

Draft email/social campaigns — HITL before Postiz/Resend send.

## Components

CampaignList · DraftEditor · AudiencePicker · ScheduleHITL

## AI features

`campaignAgent` · `contentAgent` · `socialAgent` (Advanced split)

## Mermaid

```mermaid
flowchart TD
  A[Draft campaign] --> B[HITL]
  B --> C[Postiz or Resend]
```
