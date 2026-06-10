---
title: RAG overview — Mastra
description: Load when adding retrieval-augmented generation, chunking, or vector stores in Mastra. Phase 2 for mdeapp unless task explicitly scopes RAG.
parent: mastra
impact: MEDIUM
impactDescription: RAG pipelines and vector retrieval
tags: mastra, rag, embeddings
mdeapp: phase2-defer
---

# RAG (Retrieval-Augmented Generation) in Mastra

RAG in Mastra helps you enhance LLM outputs by incorporating relevant context from your own data sources, improving accuracy and grounding responses in real information.

Mastra's RAG system provides:

- Standardized APIs to process and embed documents
- Support for multiple vector stores
- Chunking and embedding strategies for optimal retrieval
- Observability for tracking embedding and retrieval performance

## Example

To implement RAG, you process your documents into chunks, create embeddings, store them in a vector database, and then retrieve relevant context at query time.

```ts
import { embedMany } from 'ai'
import { PgVector } from '@mastra/pg'
import { MDocument } from '@mastra/rag'
import { z } from 'zod'

// 1. Initialize document
const doc = MDocument.fromText(`Your document text here...`)

// 2. Create chunks
const chunks = await doc.chunk({
  strategy: 'recursive',
  size: 512,
  overlap: 50,
})

// 3. Generate embeddings; we need to pass the text of each chunk
import { ModelRouterEmbeddingModel } from '@mastra/core/llm'

const { embeddings } = await embedMany({
  values: chunks.map(chunk => chunk.text),
  model: new ModelRouterEmbeddingModel('openai/text-embedding-3-small'),
})

// 4. Store in vector database
const pgVector = new PgVector({
  id: 'pg-vector',
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
})
await pgVector.upsert({
  indexName: 'embeddings',
  vectors: embeddings,
}) // using an index name of 'embeddings'

// 5. Query similar chunks
const results = await pgVector.query({
  indexName: 'embeddings',
  queryVector: queryVector,
  topK: 3,
}) // queryVector is the embedding of the query

console.log('Similar chunks:', results)
```

This example shows the essentials: initialize a document, create chunks, generate embeddings, store them, and query for similar content.

## Document processing

The basic building block of RAG is document processing. Documents can be chunked using various strategies (recursive, sliding window, etc.) and enriched with metadata. See the [chunking and embedding doc](https://mastra.ai/docs/rag/chunking-and-embedding).

## Vector storage

Mastra supports multiple vector stores for embedding persistence and similarity search, including pgvector, Pinecone, Qdrant, and MongoDB. See the [vector database doc](https://mastra.ai/docs/rag/vector-databases).

## More resources

- [Chain of Thought RAG Example](https://github.com/mastra-ai/mastra/tree/main/examples/basics/rag/cot-rag)