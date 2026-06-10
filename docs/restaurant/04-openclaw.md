## Summary

**Best idea for mdeai:** use OpenClaw only as a **post-MVP restaurant ops/automation layer**, not as the first booking flow.

For PR #156, keep the flow simple:

```text
Restaurant card → Request table → venue_booking_requests → Patricia/manual follow-up
```

OpenClaw comes later:

```text
Request table → OpenClaw checks availability / WhatsApp / OpenTable / staff calendar → human approves → booking confirmed
```

## Review table

| Source                            | Core features                                                                  | Advanced use case                         |                               Fit for mdeai |      Score |
| --------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------- | ------------------------------------------: | ---------: |
| Remote OpenClaw restaurant setup  | WhatsApp reservations, guest profiles, staff notes, inventory, vendor orders   | Restaurant ops assistant for managers     |                   Strong post-MVP ops layer | **88/100** |
| Medium WhatsApp reservation agent | Search, open times, availability monitor, WhatsApp alerts                      | “Notify me when a table opens”            |               Great concierge feature later | **86/100** |
| restaurant-cli GitHub             | Resy booking, OpenTable availability, Tock/SevenRooms roadmap, JSON agent mode | Provider-agnostic restaurant booking tool |                    Best technical reference | **90/100** |
| Apify OpenTable Booker            | MCP tools: search, availability, book, cancel OpenTable                        | Direct OpenTable booking from agent       |                   Powerful but paid/riskier | **82/100** |
| Reddit OpenTable thread           | Shows blocking/VPS issues                                                      | Warns about bot detection                 |                       Important risk signal | **75/100** |
| The Drum article                  | Agent called restaurant when online booking failed                             | Voice-call booking agent                  |            Too risky without approval gates | **70/100** |
| Try The Menu                      | Menu sync, POS/backend updates, availability                                   | Restaurant menu intelligence              | Useful for restaurant profiles, not booking | **78/100** |
| ClawHub Local Booking             | Search, availability, Stripe checkout, explicit confirmation                   | Local service booking pattern             |                         Good workflow model | **84/100** |
| ClawHub Browser Booking Agent     | Browser automation + screenshots + confirmation IDs                            | Proof-based booking automation            |                    Good QA/evidence pattern | **80/100** |

## Core vs advanced

| Level              | Build for mdeai                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------ |
| **Core now**       | Request table sheet, save to `venue_booking_requests`, signed-in gate, admin review        |
| **Core next**      | Patricia queue: approve/reject/counter, WhatsApp draft, status updates                     |
| **Advanced later** | OpenClaw checks restaurant calendar/OpenTable/Resy, monitors openings, sends confirmations |
| **Do not do yet**  | Auto-call restaurants, auto-submit payment, bypass OpenTable bot protection                |

## Real-world examples

| User            | Example                                                         |
| --------------- | --------------------------------------------------------------- |
| Tourist         | “Book dinner for 4 in Provenza tonight” → mdeai creates request |
| Patricia        | Sees request → confirms manually with restaurant                |
| Restaurant      | Gets WhatsApp draft: “Table for 4, 8pm, allergies: shellfish”   |
| Future OpenClaw | If no table exists, monitor openings and alert Patricia/user    |

## Recommendation

**Grade for PR #156 direction:** **92/100**

**Grade for OpenClaw restaurant automation now:** **65/100**

Use OpenClaw as **automation behind the scenes later**. For launch, keep restaurant booking as an **honest request flow**, not instant confirmed booking.
review the openclaw restaurant booking - https://www.remoteopenclaw.com/blog/openclaw-setup-for-restaurants - https://medium.com/@rsarver/i-vibe-coded-a-personal-restaurant-reservation-agent-thanks-to-openclaw-it-lives-in-my-whatsapp-aac73997ad2e - https://www.reddit.com/r/openclaw/comments/1rq01u9/booking_restaurant_on_opentable/ -
 https://www.thedrum.com/opinion/the-night-openclaw-booked-my-dinner-reservation-and-why-retail-media-should-take-note - 
 https://github.com/omarshahine/restaurant-cli - https://apify.com/clearpath/opentable-booker -
  https://www.trythemenu.com/blogs/how-openclaw-powers-smart-digital-menus-with-try-the-menu -
   https://www.linkedin.com/posts/jacob-klug-37b254156_this-is-insane-my-openclaw-just-called-booked-activity-7430254732130242560-k8m3/ - https://www.linkedin.com/posts/1azfarkhan_someone-gave-openclaw-a-simple-task-book-activity-7431446355501535232-LHSW/ 
   https://clawhub.ai/danielzhangreal/book-anything
    https://clawhub.ai/alionkissadeer/restaurant-booker
    https://clawhub.ai/ivangdavila/booking 
    https://clawhub.ai/edwardrodriguez703-design/local-booking 
    https://clawhub.ai/austineyapp/browser-booking-agent
     https://clawhub.ai/danielzhangreal/book-anything 
     web search top these links features use cases real world examples rate review score grade / 100 table format core advanced