Sanjiovani — yes, use it as a **booking marketplace pattern**, not as delivery.

## Task 1 — What to reuse

Medusa example gives 4 useful ideas:

| Delivery example         | Restaurant booking version                        |
| ------------------------ | ------------------------------------------------- |
| Restaurant module        | Restaurant / venue profile                        |
| Products                 | Booking offers: table, tasting menu, private room |
| Cart + order             | Booking request / paid reservation                |
| Delivery status workflow | Booking status workflow                           |

Medusa’s example manages restaurants, restaurant admins, drivers, and real-time delivery tracking ([Medusa Documentation][1]). For mdeai, replace **drivers/delivery** with **reservation requests + restaurant confirmation**.

## Task 2 — New booking workflow

```text
User asks:
"Book dinner for 4 in Laureles Friday 8pm"

↓
mdeai shows restaurant cards + map pins

↓
User clicks Reserve

↓
Create booking request:
pending_restaurant_confirmation

↓
Restaurant / Patricia approves

↓
Optional Stripe deposit

↓
User gets confirmation
```

## Task 3 — Status mapping

| Delivery status      | Booking status  |
| -------------------- | --------------- |
| pending              | requested       |
| restaurant_accepted  | confirmed       |
| restaurant_declined  | declined        |
| restaurant_preparing | preparing_table |
| ready_for_pickup     | ready_for_guest |
| delivered            | completed       |

Medusa uses status-driven workflows and stores workflow transaction IDs for tracking long-running processes ([Medusa Documentation][1]). That maps well to booking because a restaurant may confirm later, not instantly.

## Task 4 — Fit with mdeai

This matches your current Venues plan: restaurants/cafés already have cards, detail panels, Places details, booking stubs, and `venue_booking_requests`; booking persistence is the next gap. 

## Task 5 — Recommended MVP

Do **not** build full Uber Eats.

Build this first:

1. `venue_booking_requests`
2. booking sheet: date, time, party size, notes
3. status: `requested → confirmed/declined`
4. Patricia admin queue
5. optional WhatsApp draft
6. later: Stripe deposit / cancellation rules

## Best architecture

Keep mdeai as:

```text
Supabase = booking truth
Mastra = helps user choose
CopilotKit = booking UI
Maps/Places = location proof
Stripe = optional deposit
```

Use Medusa only if you want a full marketplace commerce backend. For mdeai MVP, Supabase is simpler and fits your current stack better.

[1]: https://docs.medusajs.com/resources/recipes/marketplace/examples/restaurant-delivery "Marketplace Recipe: Restaurant-Delivery Example - Medusa Documentation"
