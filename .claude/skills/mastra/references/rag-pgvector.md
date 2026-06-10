---
title: RAG — PgVector storage
description: Load when storing Mastra embeddings in Postgres/PgVector or Supabase vector tables. Verify against mde-supabase for RLS.
parent: mastra
impact: MEDIUM
impactDescription: PgVector store configuration
tags: mastra, rag, pgvector, postgres
mdeapp: phase2-defer
---

# Storing embeddings in a vector database

> **🚩 mdeai scope (read first — verified 2026-06-05).** This page is **generic Mastra RAG/vector docs**, kept for reference. For mdeai specifically:
> - **Do NOT adopt `@mastra/rag` chunk/embed/retrieve for product search.** Restaurants/events/rentals/venues are **structured rows**, not documents — they're served by **Supabase pgvector RPC + Gemini embeddings** today, which is correct. See `tasks/mastra/plan/2-mastra-surface-gap-analysis.md` §5.
> - The **only** place a Mastra `PgVector` store earns its keep is **semantic *memory* recall** → **AGT-08 (SAN-603, Phase 3)**. Not MVP.
> - **Embeddings = Gemini, not OpenAI.** Use `gemini-embedding-001` → **768 dimensions** (not the `text-embedding-3-small`/1536 shown in examples below). No `gpt-*`/OpenAI in mdeai (CLAUDE.md hard rule).
> - `@mastra/pg` is installed; `@mastra/rag` is **not** — keep it that way unless AGT-08 needs the store.

After generating embeddings, you need to store them in a database that supports vector similarity search. Mastra provides a consistent interface for storing and querying embeddings across various vector databases.

## Supported databases

**PgVector**:

```ts
import { PgVector } from '@mastra/pg'

const store = new PgVector({
  id: 'pg-vector',
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
})

await store.createIndex({
  indexName: 'myCollection',
  dimension: 1536,
})

await store.upsert({
  indexName: 'myCollection',
  vectors: embeddings,
  metadata: chunks.map(chunk => ({ text: chunk.text })),
})
```

### Using PostgreSQL with pgvector

PostgreSQL with the pgvector extension is a good solution for teams already using PostgreSQL who want to minimize infrastructure complexity. For detailed setup instructions and best practices, see the [official pgvector repository](https://github.com/pgvector/pgvector).

**libSQL**:

```ts
import { LibSQLVector } from '@mastra/core/vector/libsql'

const store = new LibSQLVector({
  id: 'libsql-vector',
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN, // Optional: for Turso cloud databases
})

await store.createIndex({
  indexName: 'myCollection',
  dimension: 1536,
})

await store.upsert({
  indexName: 'myCollection',
  vectors: embeddings,
  metadata: chunks.map(chunk => ({ text: chunk.text })),
})
```

**Upstash**:

```ts
import { UpstashVector } from '@mastra/upstash'

// In upstash they refer to the store as an index
const store = new UpstashVector({
  id: 'upstash-vector',
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_TOKEN,
})

// There is no store.createIndex call here, Upstash creates indexes (known as namespaces in Upstash) automatically
// when you upsert if that namespace does not exist yet.
await store.upsert({
  indexName: 'myCollection', // the namespace name in Upstash
  vectors: embeddings,
  metadata: chunks.map(chunk => ({ text: chunk.text })),
})
```

**Cloudflare**:

```ts
import { CloudflareVector } from '@mastra/vectorize'

const store = new CloudflareVector({
  id: 'cloudflare-vector',
  accountId: process.env.CF_ACCOUNT_ID,
  apiToken: process.env.CF_API_TOKEN,
})
await store.createIndex({
  indexName: 'myCollection',
  dimension: 1536,
})
await store.upsert({
  indexName: 'myCollection',
  vectors: embeddings,
  metadata: chunks.map(chunk => ({ text: chunk.text })),
})
```

**OpenSearch**:

```ts
import { OpenSearchVector } from '@mastra/opensearch'

const store = new OpenSearchVector({ id: 'opensearch', node: process.env.OPENSEARCH_URL })

await store.createIndex({
  indexName: 'my-collection',
  dimension: 1536,
})

await store.upsert({
  indexName: 'my-collection',
  vectors: embeddings,
  metadata: chunks.map(chunk => ({ text: chunk.text })),
})
```

**Elasticsearch**:

```ts
import { ElasticSearchVector } from '@mastra/elasticsearch'

const store = new ElasticSearchVector({
  id: 'elasticsearch-vector',
  url: process.env.ELASTICSEARCH_URL,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY,
  },
})

await store.createIndex({
  indexName: 'my-collection',
  dimension: 1536,
})

await store.upsert({
  indexName: 'my-collection',
  vectors: embeddings,
  metadata: chunks.map(chunk => ({ text: chunk.text })),
})
```

### Using Elasticsearch

For detailed setup instructions and best practices, see the [official Elasticsearch documentation](https://www.elastic.co/docs/solutions/search/get-started).

**Couchbase**:

```ts
import { CouchbaseVector } from '@mastra/couchbase'

const store = new CouchbaseVector({
  id: 'couchbase-vector',
  connectionString: process.env.COUCHBASE_CONNECTION_STRING,
  username: process.env.COUCHBASE_USERNAME,
  password: process.env.COUCHBASE_PASSWORD,
  bucketName: process.env.COUCHBASE_BUCKET,
  scopeName: process.env.COUCHBASE_SCOPE,
  collectionName: process.env.COUCHBASE_COLLECTION,
})
await store.createIndex({
  indexName: 'myCollection',
  dimension: 1536,
})
await store.upsert({
  indexName: 'myCollection',
  vectors: embeddings,
  metadata: chunks.map(chunk => ({ text: chunk.text })),
})
```

**Lance**:

```ts
import { LanceVectorStore } from '@mastra/lance'

const store = await LanceVectorStore.create('/path/to/db')

await store.createIndex({
  tableName: 'myVectors',
  indexName: 'myCollection',
  dimension: 1536,
})

await store.upsert({
  tableName: 'myVectors',
  vectors: embeddings,
  metadata: chunks.map(chunk => ({ text: chunk.text })),
})
```

### Using LanceDB

LanceDB is an embedded vector database built on the Lance columnar format, suitable for local development or cloud deployment. For detailed setup instructions and best practices, see the [official LanceDB documentation](https://lancedb.github.io/lancedb/).

**S3 Vectors**:

```ts
import { S3Vectors } from '@mastra/s3vectors'

const store = new S3Vectors({
  id: 's3-vectors',
  vectorBucketName: 'my-vector-bucket',
  clientConfig: {
    region: 'us-east-1',
  },
  nonFilterableMetadataKeys: ['content'],
})

await store.createIndex({
  indexName: 'my-index',
  dimension: 1536,
})
await store.upsert({
  indexName: 'my-index',
  vectors: embeddings,
  metadata: chunks.map(chunk => ({ text: chunk.text })),
})
```

## Using vector storage

Once initialized, all vector stores share the same interface for creating indexes, upserting embeddings, and querying.

### Creating Indexes

Before storing embeddings, you need to create an index with the appropriate dimension size for your embedding model:

```ts
// Create an index with dimension 1536 (for text-embedding-3-small)
await store.createIndex({
  indexName: 'myCollection',
  dimension: 1536,
})
```

The dimension size must match the output dimension of your chosen embedding model. Common dimension sizes are:

- `OpenAI text-embedding-3-small`: 1536 dimensions (or custom, e.g., 256)
- `Cohere embed-multilingual-v3`: 1024 dimensions
- `Google gemini-embedding-001`: 768 dimensions (or custom)

> **Warning:** Index dimensions can't be changed after creation. To use a different model, delete and recreate the index with the new dimension size.

### Naming Rules for Databases

Each vector database enforces specific naming conventions for indexes and collections to ensure compatib
**PgVector**:

Index names must:

- Start with a letter or underscore
- Contain only letters, numbers, and underscores
- Example: `my_index_123` is valid
- Example: `my-index` is not valid (contains hyphen)


**libSQL**:

Index names must:

- Start with a letter or underscore
- Contain only letters, numbers, and underscores
- Example: `my_index_123` is valid
- Example: `my-index` is not valid (contains hyphen)


**S3 Vectors**:

Index names must:

- Be unique within the same vector bucket
- Be 3–63 characters long
- Use only lowercase letters (`a–z`), numbers (`0–9`), hyphens (`-`), and dots (`.`)
- Begin and end with a letter or number
- Example: `my-index.123` is valid
- Example: `my_index` is not valid (contains underscore)
- Example: `-myindex` is not valid (begins with hyphen)
- Example: `myindex-` is not valid (ends with hyphen)
- Example: `MyIndex` is not valid (contains uppercase letters)

### Upserting Embeddings

After creating an index, you can store embeddings along with their basic metadata:

```ts
// Store embeddings with their corresponding metadata
await store.upsert({
  indexName: 'myCollection', // index name
  vectors: embeddings, // array of embedding vectors
  metadata: chunks.map(chunk => ({
    text: chunk.text, // The original text content
    id: chunk.id, // Optional unique identifier
  })),
})
```

The upsert operation:

- Takes an array of embedding vectors and their corresponding metadata
- Updates existing vectors if they share the same ID
- Creates new vectors if they don't exist
- Automatically handles batching for large datasets

## Adding metadata

Vector stores support rich metadata (any JSON-serializable fields) for filtering and organization. Since metadata is stored with no fixed schema, use consistent field naming to avoid unexpected query results.

> **Warning:** Metadata is crucial for vector storage - without it, you'd only have numerical embeddings with no way to return the original text or filter results. Always store at least the source text as metadata.

```ts
// Store embeddings with rich metadata for better organization and filtering
await store.upsert({
  indexName: 'myCollection',
  vectors: embeddings,
  metadata: chunks.map(chunk => ({
    // Basic content
    text: chunk.text,
    id: chunk.id,

    // Document organization
    source: chunk.source,
    category: chunk.category,

    // Temporal metadata
    createdAt: new Date().toISOString(),
    version: '1.0',

    // Custom fields
    language: chunk.language,
    author: chunk.author,
    confidenceScore: chunk.score,
  })),
})
```

Key metadata considerations:

- Be strict with field naming - inconsistencies like 'category' vs 'Category' will affect queries
- Only include fields you plan to filter or sort by - extra fields add overhead
- Add timestamps (e.g., 'createdAt', 'lastUpdated') to track content freshness

## Deleting vectors

When building RAG applications, you often need to clean up stale vectors when documents are deleted or updated. Mastra provides the `deleteVectors` method that supports deleting vectors by metadata filters, making it straightforward to remove all embeddings associated with a specific document.

### Delete by Metadata Filter

The most common use case is deleting all vectors for a specific document when a user deletes it:

```ts
// Delete all vectors for a specific document
await store.deleteVectors({
  indexName: 'myCollection',
  filter: { docId: 'document-123' },
})
```

This is particularly useful when:

- A user deletes a document and you need to remove all its chunks
- You're re-indexing a document and want to remove old vectors first
- You need to clean up vectors for a specific user or tenant

### Delete Multiple Documents

You can also use complex filters to delete vectors matching multiple conditions:

```ts
// Delete all vectors for multiple documents
await store.deleteVectors({
  indexName: 'myCollection',
  filter: {
    docId: { $in: ['doc-1', 'doc-2', 'doc-3'] },
  },
})

// Delete vectors for a specific user's documents
await store.deleteVectors({
  indexName: 'myCollection',
  filter: {
    $and: [{ userId: 'user-123' }, { status: 'archived' }],
  },
})
```

### Delete by Vector IDs

If you have specific vector IDs to delete, you can pass them directly:

```ts
// Delete specific vectors by their IDs
await store.deleteVectors({
  indexName: 'myCollection',
  ids: ['vec-1', 'vec-2', 'vec-3'],
})
```

## Best practices

- Create indexes before bulk insertions
- Use batch operations for large insertions (the upsert method handles batching automatically)
- Only store metadata you'll query against
- Match embedding dimensions to your model (e.g., 1536 for `text-embedding-3-small`)