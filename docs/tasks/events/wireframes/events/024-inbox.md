---
type: wireframe
screen_number: "024"
title: Host Inbox
route: /host/inbox
persona: [Roberto]
phase: MVP
---

# Wireframe: Host Inbox

## Page goal

Guest questions, Ask Host queue, AI-drafted replies.

## Components

InboxThreadList · MessagePreview · AiDraftReply · ApproveSend

## AI features

Ask Host EVP-034 drafts · host approves

## Mermaid

```mermaid
flowchart TD
  Q[Guest question] --> D[AI draft]
  D --> H[Host approve]
  H --> S[Send reply]
```
