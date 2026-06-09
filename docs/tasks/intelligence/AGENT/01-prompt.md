Yes — this is partly a **Mastra memory function**, but the full system needs **Mastra + Supabase + pgvector + CopilotKit**.

# Simple architecture

```text
User chats
→ CopilotKit captures UI/chat state
→ Mastra agent decides what matters
→ Supabase stores structured preferences
→ pgvector stores semantic memories
→ Next search retrieves memory before rental search
→ agent gives smarter results
```

# What each tool does

| Tool                  | Role                                                                           |
| --------------------- | ------------------------------------------------------------------------------ |
| **Mastra Memory**     | remembers conversations, working memory, semantic recall                       |
| **Supabase Postgres** | stores user preferences, interactions, trips, saved rentals                    |
| **pgvector**          | semantic memory search: “quiet remote-work apartment” ≈ “peaceful WiFi rental” |
| **CopilotKit**        | exposes user state/actions to the agent in the UI                              |
| **Gemini embeddings** | converts memory text into vectors                                              |

Mastra supports message history, working memory, observational memory, and semantic recall. Working memory stores structured user data like preferences/goals, while semantic recall retrieves related past messages by meaning. ([mastra.ai][1])

Supabase uses the `pgvector` Postgres extension to store embeddings in vector columns and query them with similarity search. ([Supabase][2])

# What you need to build

## 1. Structured memory tables

```text
user_preferences
- user_id
- domain: rental/event/restaurant
- key: preferred_neighborhood
- value: Laureles
- confidence
- updated_at

user_interactions
- user_id
- item_type: rental
- item_id
- action: clicked/saved/rejected/scheduled
- metadata
- created_at
```

Use this for exact facts.

Example:

```text
User often searches Laureles + $1000/month.
Boost Laureles rentals.
```

## 2. Semantic memory with pgvector

```text
user_memory_embeddings
- user_id
- content
- embedding
- domain
- source
- confidence
- expires_at
```

Use this for meaning-based recall.

Example:

```text
“quiet apartment for remote work”
matches old memory:
“prefers calm streets and reliable WiFi”
```

## 3. Mastra memory

Use Mastra for:

```text
lastMessages
workingMemory
semanticRecall
observationalMemory
resource = user_id
thread = chat_id
```

Important: use the same `resource` for the same user so memory follows them across chats. Mastra docs show memory calls using `resource` and `thread` identifiers to recall facts later. ([mastra.ai][1])

## 4. CopilotKit state

Use CopilotKit for:

```text
current trip
current filters
selected rental
saved rentals
map pins
user actions
```

Then Mastra can see what the user is doing, not just what they typed.

# Example flow

User says:

```text
list rentals in june 1 to 30 $1000 medellin
```

System does:

```text
1. Parse current prompt:
   city = Medellín
   dates = June 1–30
   budget = $1000/month

2. Retrieve memory:
   prefers Laureles
   wants furnished
   remote work important

3. Search rentals:
   monthly furnished rentals near $1000

4. Rank:
   Laureles + WiFi + furnished higher

5. Ask only missing question:
   “Do you prefer Laureles, Poblado, Envigado, or quieter local areas?”
```

# Best implementation order

| PR  | Build                                              |
| --- | -------------------------------------------------- |
| PR1 | Improve rental parser: dates, monthly budget, city |
| PR2 | Add `user_preferences` + RLS                       |
| PR3 | Store clicks/saves/rejections                      |
| PR4 | Add pgvector semantic memory                       |
| PR5 | Mastra memory retrieval before search              |
| PR6 | Ranking boost from memory                          |
| PR7 | User memory settings: view/edit/delete             |

# Links to use

| Topic                           | Full URL                                                                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mastra Memory Overview          | [https://mastra.ai/docs/memory/overview](https://mastra.ai/docs/memory/overview)                                                                                   |
| Mastra Working Memory           | [https://mastra.ai/docs/memory/working-memory](https://mastra.ai/docs/memory/working-memory)                                                                       |
| Mastra Semantic Recall          | [https://mastra.ai/docs/memory/semantic-recall](https://mastra.ai/docs/memory/semantic-recall)                                                                     |
| Mastra Observational Memory     | [https://mastra.ai/docs/memory/observational-memory](https://mastra.ai/docs/memory/observational-memory)                                                           |
| Mastra Storage                  | [https://mastra.ai/docs/memory/storage](https://mastra.ai/docs/memory/storage)                                                                                     |
| Mastra Request Context          | [https://mastra.ai/docs/reference/tools/client-js/classes/RequestContext](https://mastra.ai/docs/reference/tools/client-js/classes/RequestContext)                 |
| CopilotKit `useCoAgent`         | [https://docs.copilotkit.ai/reference/hooks/useCoAgent](https://docs.copilotkit.ai/reference/hooks/useCoAgent)                                                     |
| CopilotKit `useCopilotAction`   | [https://docs.copilotkit.ai/reference/hooks/useCopilotAction](https://docs.copilotkit.ai/reference/hooks/useCopilotAction)                                         |
| CopilotKit `useCopilotReadable` | [https://docs.copilotkit.ai/reference/hooks/useCopilotReadable](https://docs.copilotkit.ai/reference/hooks/useCopilotReadable)                                     |
| CopilotKit Mastra example       | [https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) |
| Supabase Vector Columns         | [https://supabase.com/docs/guides/ai/vector-columns](https://supabase.com/docs/guides/ai/vector-columns)                                                           |
| Supabase Semantic Search        | [https://supabase.com/docs/guides/ai/semantic-search](https://supabase.com/docs/guides/ai/semantic-search)                                                         |
| Supabase Vector Indexes         | [https://supabase.com/docs/guides/ai/vector-indexes](https://supabase.com/docs/guides/ai/vector-indexes)                                                           |
| Supabase RAG with Permissions   | [https://supabase.com/docs/guides/ai/rag-with-permissions](https://supabase.com/docs/guides/ai/rag-with-permissions)                                               |
| pgvector GitHub                 | [https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)                                                                                       |
| Gemini Embeddings               | [https://ai.google.dev/gemini-api/docs/embeddings](https://ai.google.dev/gemini-api/docs/embeddings)                                                               |

# Prompt for Cursor

```text
Create a PRD and implementation plan for persistent rental memory in mdeai.

Goal:
Make the rental agent remember user preferences and improve future rental searches.

Use:
- Mastra Memory
- Supabase Postgres
- pgvector
- CopilotKit state/actions
- Gemini embeddings

Design:
1. Session memory
2. Long-term user preferences
3. Interaction memory
4. Semantic memory embeddings
5. Ranking boost from memory
6. User controls to view/edit/delete memory

Example:
If user previously preferred furnished Laureles rentals around $1000/month with strong WiFi, future searches should prioritize that and not ask the same questions again.

Output:
- architecture
- Supabase schema
- RLS policies
- pgvector setup
- Mastra memory config
- CopilotKit UI state/actions
- rental ranking changes
- privacy rules
- PR breakdown
- tests
- acceptance criteria
```

# Best answer

Use **Mastra memory for agent context**, but use **Supabase + pgvector as your durable product memory**. That gives you reliable, editable, searchable memory instead of hidden “AI magic.”

---

**Master plan (phases, PRD, mermaid, task map):** [`../agent-plan.md`](../agent-plan.md)

[1]: https://mastra.ai/en/docs/memory/overview "Memory overview | Memory | Mastra Docs"
[2]: https://supabase.com/docs/guides/ai/vector-columns "Vector columns | Supabase Docs"
