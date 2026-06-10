Yes — correct.

> **Task:** [EVP-006-core-event-clarify-gate-and-chips.md](../EVP-006-core-event-clarify-gate-and-chips.md)

The agent should **not immediately dump random events** when the user only says:

```text
list events medellin
```

It should ask a helpful filter question and suggest categories.

## Better agent behavior

```text
What kind of events are you looking for?

Popular options in Medellín:
- Music / concerts
- Nightlife / clubs
- Sports
- Food & restaurants
- Art / culture
- Networking / business
- Tech / startup events
- Wellness / yoga
- Family-friendly
- Outdoor / festivals

You can say something like:
“nightlife this weekend in Poblado”
“sports events near Laureles”
“live music tonight”
“tech networking this week”
```

## Best UX rule

| User says              | Agent should do                              |
| ---------------------- | -------------------------------------------- |
| “list events medellin” | Ask category question + show suggested chips |
| “nightlife events”     | Call `search-events` with nightlife          |
| “music this weekend”   | Call `search-events` with music + weekend    |
| “sports near Laureles” | Call `search-events` with sports + Laureles  |
| “show all events”      | Call `search-events` broadly                 |

## Suggested event chips

```text
Music
Nightlife
Sports
Food
Culture
Networking
Tech
Wellness
Family
Outdoor
This Weekend
Tonight
Near Me
```

## Prompt rule to add

```text
When the user asks for generic events without a category, date, or neighborhood, ask one short clarifying question and suggest event type options. Do not call search-events yet unless the user says “show all” or provides a specific category/date/location.
```

This will make the agent feel smarter and more useful.
