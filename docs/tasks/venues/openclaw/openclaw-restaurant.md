
https://github.com/alexpolonsky/agent-skills

https://github.com/alexpolonsky/agent-skill-ontopo

https://github.com/lqminhhh/openclaw-restaurant-reservations

https://github.com/omarshahine/restaurant-cli

https://github.com/mikehe123/opentable-reservations

https://github.com/garavitgabriel/rappi-plugin-claude-openclaw

https://github.com/kayacancode/reserve-me
# I Vibe-Coded a Personal Restaurant Reservation Agent. It Lives in My WhatsApp.

[

![Ryan Sarver](https://miro.medium.com/v2/resize:fill:64:64/1*9BqD-GsSDt1kt2GQ1CLlXA.png)





](https://medium.com/@rsarver?source=post_page---byline--aac73997ad2e---------------------------------------)

[Ryan Sarver](https://medium.com/@rsarver?source=post_page---byline--aac73997ad2e---------------------------------------)

Follow

7 min read

·

Mar 5, 2026

6

_How I went from “wouldn’t it be cool if…” to a fully functional AI agent that finds, checks, monitors, and books restaurants, from my phone, in a single weekend._

I stopped checking. I built something to check for me. It got me an impossible table in nine days.

I am, genuinely, someone who cares too much about restaurants. When I’m traveling to a city, I’m doing recon weeks in advance, triangulating across sources, trying to land the right table at the right place for the right night. It’s one of the real pleasures of life, and I take it seriously.

**The problem: the tooling is broken.** There are too many reservation platforms that have carved out different swaths of the restaurant world, and they don’t talk to each other. You have to remember which restaurants are on which system, bounce between apps, and (most maddeningly) if you want a table at that place everyone’s talking about and it’s full, there’s no good way to know when a slot opens up short of refreshing it manually like a maniac.

So I built a solution. And the interesting part of the story isn’t the reservation agent itself. It’s _how_ I built it, and what that reveals about where AI tooling is right now.

## The Build: A `/resi` Skill for OpenClaw

OpenClaw’s skills are essentially modules: a folder with a `SKILL.md` describing the capability and the CLI tooling the agent should use. When I message my agent, it reads the relevant skills and decides which to invoke.

I wanted a single skill that handled everything restaurant-related. I called it `/resi`.

The core functions I needed:

**1. Restaurant search:** given a city, date, party size, and time window, find available tables across the major reservation platforms. Not “here’s a list of restaurants,” but _actual availability right now_.

**2. Open times lookup:** for a specific restaurant I already know I want, what’s available? Give me the slots.

**3. Availability monitor:** this is the killer feature. Tell the system I want a table at Restaurant X on Date Y for N people, and have it poll until something opens, then notify me immediately via WhatsApp.

I opened Claude Code, described what I wanted, and started iterating.

> _“I want to build a CLI tool that can search restaurant availability, check open times for a specific restaurant, and set up a monitor that polls and notifies me when a slot opens. It needs to work across [Platform A] and [Platform B]. The output should be clean JSON so an LLM can parse it.”_

And then Claude Code just… built it. Not all at once. We went back and forth, debugged auth flows, handled rate limiting, structured the outputs. But the arc from “idea” to “working CLI” was measured in hours, not days. I didn’t write most of the code. I directed it, reviewed it, and made judgment calls.

The resulting skill has three clean CLI entry points:

resi search --city amsterdam --date 2026-03-15 --party 2 --time "20:00"  
resi open-times --restaurant "Restaurant Name" --date 2026-03-15 --party 2  
resi monitor --restaurant "Restaurant Name" --date 2026-03-15 --party 2 --notify whatsapp

The monitor function runs as a background process on my local machine. When a slot opens, it fires a WhatsApp message to me directly. I’ve already snagged two tables I would have missed entirely.

## What This Actually Looks Like in Practice

From my phone, I can now message my agent things like:

> “Find me a good table in Amsterdam for Saturday night, 2 people, anywhere from 8 to 10pm.”

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:700/1*KVYzGUlJLltyn3wudNzYkw.png)

The agent invokes `resi search`, parses the results, filters for places that match my taste profile (it knows my restaurant list, a curated CSV of around 50 Amsterdam spots I've fed into its knowledge base), and comes back with a ranked list of available tables with times and direct booking links.

Or:

> “Set up a monitor for [that impossible-to-get restaurant] on the 22nd for 2 people.”

It spins up the background monitor. I go about my life. My phone buzzes when something opens.

This is the kind of thing that used to require either a premium third-party service, a lot of manual effort, or knowing someone. Now it’s a WhatsApp message.

## The Bigger Point: What Vibe Coding Actually Means

I want to be careful here, because “vibe coding” has become a bit of a meme, and like most memes, it’s half right and half misleading.

The half that’s right: you genuinely can build functional, useful software without being a professional developer. The tooling has crossed a threshold. I came up with the restaurant agent idea, described what I wanted in plain English, and Claude Code produced working code. The iteration loops were fast. The bugs got fixed. The thing works.

The half that’s misleading: this is not magic, and it is not zero-effort. What I actually brought to this:

- **Product intuition.** I knew exactly what I wanted to build and why. I’d thought through the UX: what the agent should say, what edge cases to handle, what “done” looked like. Inspected HTML, nudged it, edited it.
- **System architecture sense.** Knowing to keep the CLI outputs as clean JSON for LLM consumption, knowing to separate the monitor as a background process, knowing how to structure a skill in OpenClaw.
- **Debugging judgment.** When Claude Code produced something that didn’t work, I had enough context to diagnose why and redirect. It’s less like having a junior dev write code for you and more like pair programming with someone very fast and very literal.

What I _didn’t_ need: deep expertise in any of the APIs I was hitting, fluency in the specific language patterns Claude used, or patience for reading through documentation. Claude Code handled all of that.

The net effect is a dramatic compression of the “idea to working software” timeline. Probably 10x for someone like me. Maybe 3–5x for a senior engineer who’d have built it faster anyway.

**But honestly, the metric that matters most to me isn’t speed. It’s that building software is _fun_ again.**

For a long time, the part I dreaded wasn’t the idea or the product thinking. It was everything before you could actually see something work: setting up the environment, getting dependencies right, remembering syntax, fighting config. The activation energy to go from “I want to build X” to “I am building X” was high enough that a lot of ideas just died in the gap.

That gap is basically gone now. I can dream something up, act like a good product and engineering manager directing a very capable team, and watch it get built. The creative loop is tight. The fun part is almost the whole thing.

## Why This Matters (and Who This Is For)

If you’re a hacker, a founder, or a technical leader who has ever had the experience of knowing exactly what tool you want but not having the time or bandwidth to build it, this is your moment.

The combination of OpenClaw as persistent infrastructure, Claude Code for fast iteration on the actual build, and Claude as the reasoning layer that ties it all together is genuinely powerful in a way that feels qualitatively different from “AI helps me write code faster.”

**I have a personal agent now. It runs on hardware I control, with data that stays private, and it’s extensible because the skills system is just files. Every new workflow I want is a new skill. I’m building one now for travel planning, but that’s another post.**

The restaurant agent cost me a weekend of focused time and a few dollars in API calls. It has already returned value that I’d have happily paid $30/month for as a subscription. That math is going to keep getting more favorable.

## Building Your Own

If you want to try this yourself:

1. **Get OpenClaw running locally** and connect it to WhatsApp or Telegram. The setup wizard handles most of the complexity, and running it on a Mac with always-on power is all you need.
2. **Build the CLI tool first** using Claude Code before you think about the skill wrapper. Describe the functions you want, let Claude Code iterate, and focus your energy on reviewing outputs and catching edge cases. Aim for clean JSON output so the agent can parse results without friction.
3. **Write the** `**SKILL.md**` **last.** Once the CLI works, describing it to the agent is straightforward. The `SKILL.md` just tells OpenClaw what the skill does and how to invoke it. Claude figures out the rest.

For the restaurant piece specifically, the core challenge is handling auth against the reservation platforms gracefully and building a polling mechanism that doesn’t hammer their servers. Claude Code knows how to do both. Just be clear about what you want and iterate on the edge cases.

## What’s Really Going On Here

Step back from the restaurant agent for a second and look at what’s actually been assembled.

OpenClaw is a persistent agent that lives in your chat interface and knows everything about you: your calendar, your preferences, your history, your communication patterns, your files. It’s always on, always accessible from your phone, and it accumulates context over time. That alone is powerful.

Claude Code lets you vibe code a new action layer on top of that in an afternoon. Whatever you can describe, you can build. The CLI becomes a skill. The skill becomes something your agent can invoke on your behalf, from anywhere, triggered by a natural language message.

The combination is what’s special. You’re not just automating a task. You’re extending what your agent can _do_ in the world, backed by everything it already knows about you. The restaurant agent works better because it knows my taste profile. A travel planning skill will work better because it knows my calendar. Every new capability compounds on the context that’s already there.

That’s the architecture worth getting excited about. The restaurant reservations are just a fun place to start.

_If you’re building something similar or have questions about the stack, I’d love to hear from you. And if you want to know which restaurants in Amsterdam I’m trying to get into right now? That’s a different conversation :)_

## Case 5: Multi-Channel Restaurant Booking

**The problem:** A restaurant group wanted to accept reservations via WhatsApp, Telegram, and their website — without maintaining three separate systems.

**The solution:** A single OpenClaw deployment with a reservation skill that:

- Checks availability against the restaurant's booking system
- Handles party size, date/time, and special requests
- Sends confirmation messages
- Handles cancellations and modifications

**Deployment:** One Lighthouse instance running OpenClaw, connected to [Telegram](https://www.tencentcloud.com/techpedia/139185), [WhatsApp](https://www.tencentcloud.com/techpedia/139186), and a web widget. The [Tencent Cloud Lighthouse Special Offer](https://www.tencentcloud.com/act/pro/intl-openclaw) made the infrastructure cost negligible compared to the labor savings.

**Result:** 70% of reservations now handled automatically. Staff freed up during peak hours. No-show rate dropped because automated reminders were sent 24 hours before the booking.

**Lesson learned:** Time zone handling is trickier than you'd expect. Always confirm the booking time back to the user in their local time zone, and store everything in UTC internally.

---# The night OpenClaw booked my dinner reservation (and why retail media should take note)

[](https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.thedrum.com%2Fopinion%2Fthe-night-openclaw-booked-my-dinner-reservation-and-why-retail-media-should-take-note)[](https://twitter.com/intent/tweet?text=The%20night%20OpenClaw%20booked%20my%20dinner%20reservation%20%28and%20why%20retail%20media%20should%20take%20note%29&url=https%3A%2F%2Fwww.thedrum.com%2Fopinion%2Fthe-night-openclaw-booked-my-dinner-reservation-and-why-retail-media-should-take-note&via=thedrum)[](https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.thedrum.com%2Fopinion%2Fthe-night-openclaw-booked-my-dinner-reservation-and-why-retail-media-should-take-note&source=TheDrum)[](mailto:?&subject=The%20Drum:%20The%20night%20OpenClaw%20booked%20my%20dinner%20reservation%20%28and%20why%20retail%20media%20should%20take%20note%29&body=https%3A%2F%2Fwww.thedrum.com%2Fopinion%2Fthe-night-openclaw-booked-my-dinner-reservation-and-why-retail-media-should-take-note)[](https://api.whatsapp.com/send?text=The%20night%20OpenClaw%20booked%20my%20dinner%20reservation%20%28and%20why%20retail%20media%20should%20take%20note%29%20via%20The%20Drum%20-%20https%3A%2F%2Fwww.thedrum.com%2Fopinion%2Fthe-night-openclaw-booked-my-dinner-reservation-and-why-retail-media-should-take-note)

#### By Nick Larkins, Co-founder and chief product officer

February 26, 2026 | 7 min read

[![Listen](https://www.thedrum.com/assets/images/icons/article/article-listen-icon.svg)](https://www.thedrum.com/opinion/the-night-openclaw-booked-my-dinner-reservation-and-why-retail-media-should-take-note#)

[Listen to article](https://www.thedrum.com/opinion/the-night-openclaw-booked-my-dinner-reservation-and-why-retail-media-should-take-note#) 6 min 9 sec

**Nick Larkins, co-founder and chief product officer of QSIC, shares how the AI agent built its own calling app and explains why that leap from assistance to action should be a wake-up call for retail media.**

![](https://thedrum-media.imgix.net/thedrum-user-assets-prod/s3/images/original/reservation.png?w=940&ar=default&fit=crop&crop=faces&auto=format&dpr=2)

(Adobe Stock)

Recently, I snagged a rare table at a buzzy new restaurant. Or rather, AI did it for me. It didn’t use some reservation system’s API. It literally decided to call the restaurant and chat with a human.

The world has been going a little crazy about OpenClaw. When I first started reading about it, one use case stopped me in my tracks. Someone had tasked the agent with booking a restaurant. Online booking failed, so the agent built a calling app, generated a voice and phoned the restaurant to secure a table.

It didn’t ask permission. It just acted.

Naturally, I had to try it.

Let me explain. I tasked OpenClaw, an AI assistant, with making a dinner reservation. Its first attempt, booking online, failed. The restaurant was fully booked. No availability. Dead end.

But instead of returning a sad little ‘no tables available’ message, the AI agent thought: ‘Hang on. Humans would just call.’ So it did.

It used a combination of tools to spin up a calling application, generate an AI voice and place a call to the restaurant. It was able to speak to a real person, find a last-minute cancellation and book the table.

What made this particularly interesting for me is that at QSIC, an audio company, we already use tools like ElevenLabs for AI-generated voice and have a Twilio account for telephony. Those tools were available within the environment the agent could access.

In other words, it didn’t need to go looking for capabilities. The building blocks were already there.

It didn’t ask permission. It didn’t pop up a warning. It simply looked at the tools available to it and said, ‘Yep, that’ll do.’

This thing is powerful in a way that doesn’t feel theoretical. It feels immediate. And once you realize that an agent can both decide to act and create the tools to do so, you start mentally inventorying what else it might think is a good idea.

#### Want to go deeper? Ask The Drum

- [What is OpenAI's Voice Engine for reproducing human speech?](https://www.thedrum.com/ask?q=What%20is%20OpenAI%27s%20Voice%20Engine%20for%20reproducing%20human%20speech%3F&qs=051a6ea0-29ea-40d9-b80d-c226a7add5d2)
- [What happened with McDonald's AOT AI drive-thru assistant?](https://www.thedrum.com/ask?q=What%20happened%20with%20McDonald%27s%20AOT%20AI%20drive-thru%20assistant%3F&qs=051a6ea0-29ea-40d9-b80d-c226a7add5d2)
- [What will AI agents' future role be as 'apps of the AI world'?](https://www.thedrum.com/ask?q=What%20will%20AI%20agents%27%20future%20role%20be%20as%20%27apps%20of%20the%20AI%20world%27%3F&qs=051a6ea0-29ea-40d9-b80d-c226a7add5d2)
- [How is AI transforming consumer-brand interactions with ambient intelligence?](https://www.thedrum.com/ask?q=How%20is%20AI%20transforming%20consumer-brand%20interactions%20with%20ambient%20intelligence%3F&qs=051a6ea0-29ea-40d9-b80d-c226a7add5d2)
- [How can I identify legitimate AI, avoiding 'AI-washing' in 2025?](https://www.thedrum.com/ask?q=How%20can%20I%20identify%20legitimate%20AI%2C%20avoiding%20%27AI-washing%27%20in%202025%3F&qs=051a6ea0-29ea-40d9-b80d-c226a7add5d2)

## **This isn’t just another AI feature**

We’ve been living in the age of assistive AI for a while now. AI that conducts research, drafts emails, makes recommendations and helps with predictions. Helpful? Sure. Disruptive? Not really.

What’s different here is that this AI didn’t suggest calling the restaurant; it just did it.

OpenClaw-style agents don’t wait for integrations. They observe the environment, reason about outcomes and create tools on the fly to get things done.

That should make every industry, especially retail media, pause for a moment. Retail media today is still very API brained. We obsess over clean integrations, predefined inventory, fixed workflows and dashboards that explain what already happened.

Now imagine an AI agent that doesn’t just analyze campaign performance but acts on it. It might see sell-through dropping in real time and analyze whether the cause is linked to, say, inventory management or underperforming creative. It could then adjust ad spend, media scheduling, or generate new creative.

No human in the loop or adding the problem to next week’s to-do list. Just report that ‘sales are soft in these 73 stores between 4pm and 7pm. Fix it.’

And then it does. The restaurant call proved the point: if a human can do it with a phone, an AI agent can too.

That should make Silicon Valley nervous. AI helps avoid friction, but friction has been profitable for software providers for a long time. If AI agents can build tools on the fly, bypass platforms, talk directly to humans and execute end-to-end outcomes, then a lot of beautifully engineered SaaS layers start to look optional.

## **The slightly terrifying bit**

This is the part where we all pretend everything is fine while gripping the table edge. Because yes, there are risks. A few obvious ones:

- **Unintended actions:** Agents doing technically correct but commercially disastrous things.
- **Brand safety:** AI improvising in ways marketing never signed off on.
- **Prompt injection/data leaks:** Malicious users steering the agent to reveal internal data, credentials, or execute unauthorized code.
- **Malware/supply chain risk:** An agent building or integrating a compromised ‘tool’ on the fly, leading to system-wide infection or data exfiltration.
- **Regulatory exposure:** Who’s liable when an AI ‘decides’ something?
- **Trust erosion:** When humans don’t understand why something happened.

An AI that can call a restaurant can also call a supplier. Or negotiate pricing. Or place orders. Or pause campaigns. Agency cuts both ways. So no, we shouldn’t just unleash this stuff and hope for the best.

## **Why I’m still bullish**

Despite all that, I’m optimistic. Because for the first time, AI is starting to look like a colleague.

A weird one, sure. But a colleague nonetheless.

For retail media in particular, this is a gift. Because retail media is messy. There are fragmented systems, complex franchise models, legacy tech and bottlenecks everywhere.

Agentic AI thrives in mess. It doesn’t need perfection or consistency. It just needs permission to try.

Retail media has been waiting for that kind of leap.

## **The future**

The future isn’t AI running wild. Agentic AI must be governed by guardrails, its decisions must be auditable and explainable and it must be aligned to real-world outcomes.

Retail media leaders should be experimenting now. Not by getting AI to beautify slide decks or with timid pilots that go nowhere. But with real agents doing real work in controlled environments.

No, agentic AI won’t be perfect right out of the gate. Yes, mistakes will happen. But if it can land a table at a busy restaurant on a Friday night, imagine what it can do for your business.

**Nick Larkins is co-founder and chief product officer of QSIC, the intelligent audio platform that helps retailers deliver great music and smarter ads.**