# Rental Inquiry & Viewing Request
> Route: modal / inline flow from `/rentals/[id]`  
> User: Consumer  
> Phase: Core · P1

---

## Inquiry Flow — Desktop

```
┌──────────────────────────────────────────────────────┐
│  📩 Contact Host — Apto El Estadio                   │
│                                                      │
│  AI-drafted message (editable):                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ Hi Diego,                                    │   │
│  │                                              │   │
│  │ I'm interested in your 2BR apartment in      │   │
│  │ Laureles. I'm looking to move in around      │   │
│  │ January 15. Budget is $950–$1,200/month.     │   │
│  │ I work remotely and need fast wifi.          │   │
│  │ Do you allow cats?                           │   │
│  │                                              │   │
│  │ Looking forward to hearing from you.         │   │
│  │ — Camila                                     │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Move-in: [Jan 15 ▾]    Duration: [6 months ▾]      │
│                                                      │
│  [Edit Message]        [Send Inquiry ▶]             │
│                                                      │
│  ⚡ AI wrote this from your profile + preferences    │
└──────────────────────────────────────────────────────┘
```

## Viewing Request Flow

```
┌──────────────────────────────────────────────────────┐
│  📅 Request a Viewing — Apto El Estadio              │
│                                                      │
│  Available times:                                    │
│  ┌──────────────────────────────────────────────┐   │
│  │ ○ Tue Jan 7  · 3:00pm                        │   │
│  │ ● Wed Jan 8  · 10:00am  ← AI: "Best for you" │   │
│  │ ○ Thu Jan 9  · 6:00pm                        │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Notes (optional):                                   │
│  [I'll be bringing my partner________________]       │
│                                                      │
│  [Confirm Viewing — Wed Jan 8 · 10am ▶]             │
└──────────────────────────────────────────────────────┘
```

## Post-Inquiry State

```
┌────────────────────────────────────────┐
│  ✅ Inquiry sent to Diego!             │
│                                        │
│  Average response time: < 2 hours     │
│                                        │
│  I'll follow up if no reply in 48h.   │
│                                        │
│  [View My Inquiries]                  │
└────────────────────────────────────────┘
```

---

## AI Features
- Agent auto-drafts inquiry from: user profile + working memory (budget, move-in, pets, wifi needs)
- Agent suggests best viewing slot based on user calendar availability (if connected)
- Agent auto-follows up in 48h if host hasn't responded
- After viewing confirmed: "I'll remind you the day before and send you directions"
