---
title: User Journey — Host and Attendee
type: journey
---

```mermaid
journey
  title AI-Native Events — Host and Attendee
  section Roberto Host Core
    Open host wizard chat: 5: Roberto
    Describe event in natural language: 5: Roberto, hostEventAgent
    Set venue via Maps search: 4: Roberto, Google Maps
    Configure ticket tiers: 4: Roberto, hostEventAgent
    HITL approve publish: 3: Roberto
    Event live on Supabase: 5: Roberto
  section Roberto Host MVP
    Ask sales in analytics chat: 5: Roberto, hostOpsAgent
    Review revenue forecast card: 4: Roberto
    Match sponsor prospects: 3: Roberto, sponsorAgent
    Score CRM leads: 3: Roberto
  section Andrés Attendee Core
    Discover event in chat or browse: 5: Andrés, conciergeAgent
    View event detail and map: 4: Andrés
    Stripe checkout buy ticket: 4: Andrés, Stripe
    Wallet QR ticket: 5: Andrés
  section Andrés Attendee MVP
    Get event recommendations: 4: Andrés, attendeeAgent
    Request booking or partner info: 3: Andrés
    RAG search grounded answers: 4: Andrés
  section Advanced
    WhatsApp reminder opt-in: 3: Andrés
    Marketing blast receives: 2: Andrés
    Multi-agent ops automation: 2: Patricia
```
