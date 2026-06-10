Your list is mostly correct, but a few links are outdated, duplicated, or not the best source for implementation.

# Recommended core links (correct + useful)

| Purpose                       | Recommended Link                                                                                                                    | Why                         |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Mastra memory overview        | [Mastra Memory Overview](https://mastra.ai/docs/memory/overview?utm_source=chatgpt.com)                                             | Main memory architecture    |
| How memory works              | [Mastra How Memory Works](https://mastra.ai/learn/how-memory-works?utm_source=chatgpt.com)                                          | Best conceptual guide       |
| Working memory                | [Mastra Working Memory](https://mastra.ai/docs/memory/working-memory?utm_source=chatgpt.com)                                        | Structured user preferences |
| Message history               | [Mastra Message History](https://mastra.ai/docs/memory/message-history?utm_source=chatgpt.com)                                      | Chat continuity             |
| Observational memory          | [Mastra Observational Memory](https://mastra.ai/docs/memory/observational-memory?utm_source=chatgpt.com)                            | Learns from interactions    |
| Memory processors             | [Mastra Memory Processors](https://mastra.ai/docs/memory/memory-processors?utm_source=chatgpt.com)                                  | Summarization/trimming      |
| Semantic recall               | [Mastra Recall Reference](https://mastra.ai/reference/memory/recall?utm_source=chatgpt.com)                                         | Vector retrieval            |
| Threads/resources             | [Mastra Memory Class Reference](https://mastra.ai/en/reference/memory/Memory?utm_source=chatgpt.com)                                | Thread/user memory APIs     |
| Storage overview              | [Mastra Storage Overview](https://mastra.ai/docs/storage/overview?utm_source=chatgpt.com)                                           | PostgreSQL + memory storage |
| CopilotKit Mastra example     | [CopilotKit Mastra Example](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra?utm_source=chatgpt.com) | Your main runtime reference |
| CopilotKit useCoAgent         | [CopilotKit useCoAgent](https://docs.copilotkit.ai/reference/hooks/useCoAgent?utm_source=chatgpt.com)                               | Shared UI/agent state       |
| CopilotKit useCopilotAction   | [CopilotKit useCopilotAction](https://docs.copilotkit.ai/reference/hooks/useCopilotAction?utm_source=chatgpt.com)                   | Agent actions               |
| CopilotKit useCopilotReadable | [CopilotKit useCopilotReadable](https://docs.copilotkit.ai/reference/hooks/useCopilotReadable?utm_source=chatgpt.com)               | Agent-readable UI state     |
| Supabase vector columns       | [Supabase Vector Columns](https://supabase.com/docs/guides/ai/vector-columns?utm_source=chatgpt.com)                                | pgvector basics             |
| Supabase semantic search      | [Supabase Semantic Search](https://supabase.com/docs/guides/ai/semantic-search?utm_source=chatgpt.com)                              | Vector retrieval            |
| Supabase vector indexes       | [Supabase Vector Indexes](https://supabase.com/docs/guides/ai/vector-indexes?utm_source=chatgpt.com)                                | Performance                 |
| Supabase RAG permissions      | [Supabase RAG With Permissions](https://supabase.com/docs/guides/ai/rag-with-permissions?utm_source=chatgpt.com)                    | Multi-user security         |
| pgvector GitHub               | [pgvector GitHub](https://github.com/pgvector/pgvector?utm_source=chatgpt.com)                                                      | Official extension          |
| Gemini embeddings             | [Gemini Embeddings Docs](https://ai.google.dev/gemini-api/docs/embeddings?utm_source=chatgpt.com)                                   | Embedding generation        |

# Links to remove / lower priority

| Link                                         | Verdict       | Why                               |
| -------------------------------------------- | ------------- | --------------------------------- |
| `mastra.ai/blog/build-agents-mastra-mongodb` | Low priority  | MongoDB not your stack            |
| Duplicate MongoDB blog                       | Remove        | Duplicate                         |
| `github.com/mastra-ai/mastra/issues/13470`   | Optional only | Bug discussion, not architecture  |
| `mastra.ai/ai-gateway`                       | Optional      | Useful later, not memory-specific |

# Best architecture docs for YOUR stack

You are building:

```text
Next.js
+ CopilotKit
+ Mastra
+ Supabase
+ pgvector
+ Gemini
+ Google Maps
```

So your MOST IMPORTANT docs are:

| Priority | Link                      |
| -------- | ------------------------- |
| P0       | Mastra Memory Overview    |
| P0       | Mastra Working Memory     |
| P0       | CopilotKit Mastra example |
| P0       | Supabase Vector Columns   |
| P0       | Supabase Semantic Search  |
| P1       | Observational Memory      |
| P1       | useCoAgent                |
| P1       | Memory Processors         |
| P1       | RAG With Permissions      |
| P2       | AI Gateway                |
| P2       | MongoDB examples          |

# What each one solves

| Problem                       | Doc                  |
| ----------------------------- | -------------------- |
| Remember user preferences     | Working Memory       |
| Recall old chats semantically | Semantic Recall      |
| Learn from user actions       | Observational Memory |
| Share UI state with agent     | useCoAgent           |
| Persist memory in Postgres    | Storage Overview     |
| Store embeddings              | Vector Columns       |
| Search embeddings             | Semantic Search      |
| Secure multi-user retrieval   | RAG With Permissions |

# Recommended implementation order

| Phase   | Focus                                          |
| ------- | ---------------------------------------------- |
| Phase 1 | rental parser intelligence                     |
| Phase 2 | working memory                                 |
| Phase 3 | user preferences table                         |
| Phase 4 | interaction memory                             |
| Phase 5 | pgvector semantic recall                       |
| Phase 6 | ranking personalization                        |
| Phase 7 | cross-domain memory (events/restaurants/trips) |

# Best additional docs to add

| Topic                        | URL                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Mastra semantic recall docs  | [Mastra Semantic Recall](https://mastra.ai/docs/memory/semantic-recall?utm_source=chatgpt.com)                      |
| Mastra threads/resources     | [Mastra Threads and Resources](https://mastra.ai/docs/memory/threads-and-resources?utm_source=chatgpt.com)          |
| Supabase pgvector extension  | [Supabase pgvector Extension](https://supabase.com/docs/guides/database/extensions/pgvector?utm_source=chatgpt.com) |
| Supabase Row Level Security  | [Supabase RLS Guide](https://supabase.com/docs/guides/database/postgres/row-level-security?utm_source=chatgpt.com)  |
| Google Gemini embeddings API | [Gemini Embeddings API](https://ai.google.dev/gemini-api/docs/embeddings?utm_source=chatgpt.com)                    |

# Final recommendation

Your core memory stack should be:

```text
Mastra = agent memory orchestration
Supabase = durable memory database
pgvector = semantic recall
CopilotKit = UI state + actions
Gemini embeddings = memory vectors
```

That is the correct production architecture for mdeai.

---

**Master plan:** [`../agent-plan.md`](../agent-plan.md) · **Tasks:** [`../INDEX.md`](../INDEX.md) · **P0 rental fix:** RE-017 / RE-018
