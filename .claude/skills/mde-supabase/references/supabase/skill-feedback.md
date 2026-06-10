---
parent: mde-supabase
title: Supabase Skill Feedback Process
description: How to report incorrect Supabase skill guidance to upstream maintainers. Load only when user says skill advice was wrong.
load_when: skill gave wrong advice, incorrect supabase guidance, skill feedback
internal: true
---

# Skill Feedback

Use this when the user reports that the skill gave incorrect guidance, is missing information, or could be improved. This is about the skill (agent instructions), not about Supabase the product.

## Steps

1. **Ask permission** — Ask the user if they'd like to submit feedback to the skill maintainers. If they decline, move on.

2. **Draft the issue** — Use the template at [assets/feedback-issue-template.md](../assets/feedback-issue-template.md) to structure the feedback. Fill in the fields based on the conversation. Always identify which specific reference file and section caused the problem.

3. **Submit** — Create a GitHub Issue on the `supabase/agent-skills` repository using the draft as the issue body. The title must follow this format: `user-feedback: <summary of the problem>`.

4. **Share the result** — Share the issue URL with the user after submission. If submission fails, give the user this link to create the issue manually:

```
https://github.com/supabase/agent-skills/issues/new
```
