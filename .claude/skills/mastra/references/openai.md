---
title: OpenAI models via Mastra
description: Load for OpenAI model strings in Mastra. Not used in mdeapp production.
parent: mastra
impact: LOW
impactDescription: Env key and OpenAI catalog digest
tags: mastra, openai, models
---

Access 52 OpenAI models through Mastra's model router. Authentication is handled automatically using the `OPENAI_API_KEY` environment variable.

Learn more in the [OpenAI documentation](https://platform.openai.com/docs/models).

```bash
OPENAI_API_KEY=your-api-key
```

```typescript
import { Agent } from "@mastra/core/agent";

const agent = new Agent({
  id: "my-agent",
  name: "My Agent",
  instructions: "You are a helpful assistant",
  model: "openai/chatgpt-image-latest"
});

// Generate a response
const response = await agent.generate("Hello!");

// Stream a response
const stream = await agent.stream("Tell me a story");
for await (const chunk of stream) {
  console.log(chunk);
}
```

## Models

| Model                           | Context | Tools | Reasoning | Image | Audio | Video | Input $/1M | Output $/1M |
| ------------------------------- | ------- | ----- | --------- | ----- | ----- | ----- | ---------- | ----------- |
| `openai/chatgpt-image-latest`   | —       |       |           |       |       |       | —          | —           |
| `openai/gpt-3.5-turbo`          | 16K     |       |           |       |       |       | $0.50      | $2          |
| `openai/gpt-4`                  | 8K      |       |           |       |       |       | $30        | $60         |
| `openai/gpt-4-turbo`            | 128K    |       |           |       |       |       | $10        | $30         |
| `openai/gpt-4.1`                | 1.0M    |       |           |       |       |       | $2         | $8          |
| `openai/gpt-4.1-mini`           | 1.0M    |       |           |       |       |       | $0.40      | $2          |
| `openai/gpt-4.1-nano`           | 1.0M    |       |           |       |       |       | $0.10      | $0.40       |
| `openai/gpt-4o`                 | 128K    |       |           |       |       |       | $3         | $10         |
| `openai/gpt-4o-2024-05-13`      | 128K    |       |           |       |       |       | $5         | $15         |
| `openai/gpt-4o-2024-08-06`      | 128K    |       |           |       |       |       | $3         | $10         |
| `openai/gpt-4o-2024-11-20`      | 128K    |       |           |       |       |       | $3         | $10         |
| `openai/gpt-4o-mini`            | 128K    |       |           |       |       |       | $0.15      | $0.60       |
| `openai/gpt-5`                  | 400K    |       |           |       |       |       | $1         | $10         |
| `openai/gpt-5-chat-latest`      | 400K    |       |           |       |       |       | $1         | $10         |
| `openai/gpt-5-codex`            | 400K    |       |           |       |       |       | $1         | $10         |
| `openai/gpt-5-mini`             | 400K    |       |           |       |       |       | $0.25      | $2          |
| `openai/gpt-5-nano`             | 400K    |       |           |       |       |       | $0.05      | $0.40       |
| `openai/gpt-5-pro`              | 400K    |       |           |       |       |       | $15        | $120        |
| `openai/gpt-5.1`                | 400K    |       |           |       |       |       | $1         | $10         |
| `openai/gpt-5.1-chat-latest`    | 128K    |       |           |       |       |       | $1         | $10         |
| `openai/gpt-5.1-codex`          | 400K    |       |           |       |       |       | $1         | $10         |
| `openai/gpt-5.1-codex-max`      | 400K    |       |           |       |       |       | $1         | $10         |
| `openai/gpt-5.1-codex-mini`     | 400K    |       |           |       |       |       | $0.25      | $2          |
| `openai/gpt-5.2`                | 400K    |       |           |       |       |       | $2         | $14         |
| `openai/gpt-5.2-chat-latest`    | 128K    |       |           |       |       |       | $2         | $14         |
| `openai/gpt-5.2-codex`          | 400K    |       |           |       |       |       | $2         | $14         |
| `openai/gpt-5.2-pro`            | 400K    |       |           |       |       |       | $21        | $168        |
| `openai/gpt-5.3-chat-latest`    | 128K    |       |           |       |       |       | $2         | $14         |
| `openai/gpt-5.3-codex`          | 400K    |       |           |       |       |       | $2         | $14         |
| `openai/gpt-5.3-codex-spark`    | 128K    |       |           |       |       |       | $2         | $14         |
| `openai/gpt-5.4`                | 1.1M    |       |           |       |       |       | $3         | $15         |
| `openai/gpt-5.4-mini`           | 400K    |       |           |       |       |       | $0.75      | $5          |
| `openai/gpt-5.4-nano`           | 400K    |       |           |       |       |       | $0.20      | $1          |
| `openai/gpt-5.4-pro`            | 1.1M    |       |           |       |       |       | $30        | $180        |
| `openai/gpt-5.5`                | 1.1M    |       |           |       |       |       | $5         | $30         |
| `openai/gpt-5.5-pro`            | 1.1M    |       |           |       |       |       | $30        | $180        |
| `openai/gpt-image-1`            | —       |       |           |       |       |       | —          | —           |
| `openai/gpt-image-1-mini`       | —       |       |           |       |       |       | —          | —           |
| `openai/gpt-image-1.5`          | —       |       |           |       |       |       | —          | —           |
| `openai/o1`                     | 200K    |       |           |       |       |       | $15        | $60         |
| `openai/o1-mini`                | 128K    |       |           |       |       |       | $1         | $4          |
| `openai/o1-preview`             | 128K    |       |           |       |       |       | $15        | $60         |
| `openai/o1-pro`                 | 200K    |       |           |       |       |       | $150       | $600        |
| `openai/o3`                     | 200K    |       |           |       |       |       | $2         | $8          |
| `openai/o3-deep-research`       | 200K    |       |           |       |       |       | $10        | $40         |
| `openai/o3-mini`                | 200K    |       |           |       |       |       | $1         | $4          |
| `openai/o3-pro`                 | 200K    |       |           |       |       |       | $20        | $80         |
| `openai/o4-mini`                | 200K    |       |           |       |       |       | $1         | $4          |
| `openai/o4-mini-deep-research`  | 200K    |       |           |       |       |       | $2         | $8          |
| `openai/text-embedding-3-large` | 8K      |       |           |       |       |       | $0.13      | —           |
| `openai/text-embedding-3-small` | 8K      |       |           |       |       |       | $0.02      | —           |
| `openai/text-embedding-ada-002` | 8K      |       |           |       |       |       | $0.10      | —           |

## Advanced configuration

### Custom headers

```typescript
const agent = new Agent({
  id: "custom-agent",
  name: "custom-agent",
  model: {
    id: "openai/chatgpt-image-latest",
    apiKey: process.env.OPENAI_API_KEY,
    headers: {
      "X-Custom-Header": "value"
    }
  }
});
```

### Dynamic model selection

```typescript
const agent = new Agent({
  id: "dynamic-agent",
  name: "Dynamic Agent",
  model: ({ requestContext }) => {
    const useAdvanced = requestContext.task === "complex";
    return useAdvanced
      ? "openai/text-embedding-ada-002"
      : "openai/chatgpt-image-latest";
  }
});
```

## Provider Options

OpenAI supports the following provider-specific options via the `providerOptions` parameter:

```typescript
const response = await agent.generate("Hello!", {
  providerOptions: {
    openai: {
      // See available options in the table below
    }
  }
});
```

### Available Options

**conversation** (`string | null | undefined`)

**include** (`("file_search_call.results" | "message.output_text.logprobs" | "reasoning.encrypted_content")[] | null | undefined`)

**instructions** (`string | null | undefined`)

**logprobs** (`number | boolean | undefined`)

**maxToolCalls** (`number | null | undefined`)

**metadata** (`any`)

**parallelToolCalls** (`boolean | null | undefined`)

**previousResponseId** (`string | null | undefined`)

**promptCacheKey** (`string | null | undefined`)

**promptCacheRetention** (`"in_memory" | "24h" | null | undefined`)

**reasoningEffort** (`string | null | undefined`)

**reasoningSummary** (`string | null | undefined`)

**safetyIdentifier** (`string | null | undefined`)

**serviceTier** (`"default" | "auto" | "flex" | "priority" | null | undefined`)

**store** (`boolean | null | undefined`): Controls whether OpenAI stores your API requests for model training. Required to be "false" if your organization has zero data retention enabled. See: https\://platform.openai.com/docs/guides/your-data#zero-data-retention

**strictJsonSchema** (`boolean | null | undefined`)

**textVerbosity** (`"low" | "medium" | "high" | null | undefined`)

**truncation** (`"auto" | "disabled" | null | undefined`)

**user** (`string | null | undefined`)

**systemMessageMode** (`"remove" | "system" | "developer" | undefined`)

**forceReasoning** (`boolean | undefined`)

**allowedTools** (`{ toolNames: string[]; mode?: "auto" | "required" | undefined; } | undefined`)

## Direct provider installation

This provider can also be installed directly as a standalone package, which can be used instead of the Mastra model router string. View the [package documentation](https://www.npmjs.com/package/@ai-sdk/openai) for more details.

**npm**:

```bash
npm install @ai-sdk/openai
```

**pnpm**:

```bash
pnpm add @ai-sdk/openai
```

**Yarn**:

```bash
yarn add @ai-sdk/openai
```

**Bun**:

```bash
bun add @ai-sdk/openai
```

For detailed provider-specific documentation, see the [AI SDK OpenAI provider docs](https://ai-sdk.dev/providers/ai-sdk-providers/openai).