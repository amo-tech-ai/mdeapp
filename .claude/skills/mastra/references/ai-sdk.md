---
title: withMastra() AI SDK bridge
description: Load when integrating Vercel AI SDK with Mastra.
parent: mastra
impact: MEDIUM
impactDescription: Wrap AI SDK models with Mastra features
tags: mastra, ai-sdk, vercel
---

# AI SDK

If you're already using the [Vercel AI SDK](https://sdk.vercel.ai) directly and want to add Mastra capabilities like [processors](https://mastra.ai/docs/agents/processors) or [memory](https://mastra.ai/docs/memory/memory-processors) without switching to the full Mastra agent API, [`withMastra()`](https://mastra.ai/reference/ai-sdk/with-mastra) lets you wrap any AI SDK model with these features. This is useful when you want to keep your existing AI SDK code but add input/output processing, conversation persistence, or content filtering.

> **Tip:** If you want to use Mastra together with AI SDK UI (e.g. `useChat()`), visit the [AI SDK UI guide](https://mastra.ai/guides/build-your-ui/ai-sdk-ui).

## Installation

Install `@mastra/ai-sdk` to begin using the `withMastra()` function.

**npm**:

```bash
npm install @mastra/ai-sdk@latest
```

**pnpm**:

```bash
pnpm add @mastra/ai-sdk@latest
```

**Yarn**:

```bash
yarn add @mastra/ai-sdk@latest
```

**Bun**:

```bash
bun add @mastra/ai-sdk@latest
```

## Examples

### With Processors

Processors let you transform messages before they're sent to the model (`processInput`) and after responses are received (`processOutputResult`). This example creates a logging processor that logs message counts at each stage, then wraps an OpenAI model with it.

```typescript
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { withMastra } from '@mastra/ai-sdk'
import type { Processor } from '@mastra/core/processors'

const loggingProcessor: Processor<'logger'> = {
  id: 'logger',
  async processInput({ messages }) {
    console.log('Input:', messages.length, 'messages')
    return messages
  },
  async processOutputResult({ messages }) {
    console.log('Output:', messages.length, 'messages')
    return messages
  },
}

const model = withMastra(openai('gpt-5.4'), {
  inputProcessors: [loggingProcessor],
  outputProcessors: [loggingProcessor],
})

const { text } = await generateText({
  model,
  prompt: 'What is 2 + 2?',
})
```

### With Memory

Memory automatically loads previous messages from storage before the LLM call and saves new messages after. This example configures a libSQL storage backend to persist conversation history, loading the last 10 messages for context.

```typescript
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { withMastra } from '@mastra/ai-sdk'
import { LibSQLStore } from '@mastra/libsql'

const storage = new LibSQLStore({
  id: 'my-app',
  url: 'file:./data.db',
})
await storage.init()

const memoryStorage = await storage.getStore('memory')

const model = withMastra(openai('gpt-5.4'), {
  memory: {
    storage: memoryStorage!,
    threadId: 'user-thread-123',
    resourceId: 'user-123',
    lastMessages: 10,
  },
})

const { text } = await generateText({
  model,
  prompt: 'What did we talk about earlier?',
})
```

### With Processors & Memory

You can combine processors and memory together. Input processors run after memory loads historical messages, and output processors run before memory saves the response.

```typescript
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { withMastra } from '@mastra/ai-sdk'
import { LibSQLStore } from '@mastra/libsql'

const storage = new LibSQLStore({ id: 'my-app', url: 'file:./data.db' })
await storage.init()

const memoryStorage = await storage.getStore('memory')

const model = withMastra(openai('gpt-5.4'), {
  inputProcessors: [myGuardProcessor],
  outputProcessors: [myLoggingProcessor],
  memory: {
    storage: memoryStorage!,
    threadId: 'thread-123',
    resourceId: 'user-123',
    lastMessages: 10,
  },
})

const { text } = await generateText({
  model,
  prompt: 'Hello!',
})
```

## Related

- [`withMastra()`](https://mastra.ai/reference/ai-sdk/with-mastra): API reference for `withMastra()`
- [Processors](https://mastra.ai/docs/agents/processors): Learn about input and output processors
- [Memory](https://mastra.ai/docs/memory/overview): Overview of Mastra's memory system
- [AI SDK UI](https://mastra.ai/guides/build-your-ui/ai-sdk-ui): Using AI SDK UI hooks with Mastra agents, workflows, and networks