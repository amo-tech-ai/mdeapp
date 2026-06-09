---
type: wireframe
screen_number: "018"
title: Proposal Center
route: /host/sponsors/proposals
persona: [Roberto]
phase: MVP
---

# Wireframe: Proposal Center

## Page goal

Draft, review, approve sponsor packages before send.

## Components

ProposalEditor · PackageTemplate · PreviewPDF · ApproveSendHITL

## AI features

Gemini draft · HITL before external send

## Mermaid

```mermaid
flowchart TD
  A[Draft proposal] --> B[Host edit]
  B --> C[HITL approve]
  C --> D[Send or export]
```
