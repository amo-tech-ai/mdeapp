# Navigation Structure
> Applies to: all routes

---

## Route Hierarchy

```
/ (Home — AI Concierge)
│
├── /events
│   ├── /events/[slug]
│   └── /events/[slug]/checkout
│
├── /rentals
│   └── /rentals/[id]
│
├── /venues
│   └── /venues/[id]
│
├── /restaurants
│   └── /restaurants/[id]
│
├── /cafes
│   └── /cafes/[id]
│
├── /nightlife
│   └── /nightlife/[id]
│
├── /me
│   ├── /me/tickets          (ticket wallet)
│   ├── /me/saved            (saved items)
│   └── /me/profile
│
├── /host
│   ├── /host/event/new      (AI creation wizard)
│   ├── /host/events         (event list)
│   ├── /host/events/[id]/tickets
│   ├── /host/events/[id]/attendees
│   └── /host/rentals
│
├── /sponsor
│   ├── /sponsor             (dashboard)
│   └── /sponsor/discover    (opportunity discovery)
│
└── /admin
    ├── /admin               (ops dashboard)
    ├── /admin/crm           (leads pipeline)
    └── /admin/analytics     (analytics + chat with data)
```

---

## Navigation Per User Role

| Route Group | Consumer | Host | Admin | Sponsor |
|---|---|---|---|---|
| `/` | ✓ | ✓ | ✓ | ✓ |
| `/events`, `/rentals`, `/venues` | ✓ | ✓ | ✓ | ✓ |
| `/restaurants`, `/cafes`, `/nightlife` | ✓ | ✓ | ✓ | ✓ |
| `/me/*` | ✓ | ✓ | ✓ | ✓ |
| `/host/*` | ✗ | ✓ | ✓ | ✗ |
| `/sponsor/*` | ✗ | ✗ | ✓ | ✓ |
| `/admin/*` | ✗ | ✗ | ✓ | ✗ |

---

## Mobile Bottom Navigation

```
🏠 Home   📅 Events   🗺️ Explore   📌 Saved   👤 Me
```

- Explore tab = full-screen map with all domain pins
- 5th tab = `Me` shows role-appropriate menu (Host dashboard if host role)

---

## Left Panel Navigation Order

```
1. HOME section
   - Home
   - Explore (map)

2. DISCOVER section
   - Events
   - Rentals
   - Venues
   - Restaurants
   - Cafes
   - Nightlife

3. MY STUFF section
   - Saved (count badge)
   - My Tickets
   - Recent

4. HOSTING section (hosts only)
   - My Events
   - My Rentals

5. ADMIN section (admin only)
   - Operations
   - CRM
   - Analytics
   - Users

6. SPONSOR section (sponsors only)
   - Dashboard
   - Discover

7. Memory snapshot (bottom, always visible)
8. Create button (CTA, always visible)
```

---

## AI Chat = Primary Navigation

Key insight: the left panel navigation is a **fallback**. The primary navigation for power users is the chat:
- "Go to my jazz night" → agent navigates to `/host/events/jazz-night`
- "Show me my tickets" → agent opens `/me/tickets`
- "Find venues in El Poblado" → agent searches venues inline, no page navigation needed

This is the core UX innovation: AI removes the need for most navigation.
