---
title: Google Gemini via Mastra
description: Load for Google/Gemini model strings in Mastra router. mdeapp production models → gemini skill.
parent: mastra
impact: LOW
impactDescription: Env key and Google model catalog digest
tags: mastra, gemini, google
---

# ![Google logo](https://models.dev/logos/google.svg)Google

Access 38 Google models through Mastra's model router. Authentication is handled automatically using the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable.

Learn more in the [Google documentation](https://ai.google.dev/gemini-api/docs/models).

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key
```

```typescript
import { Agent } from "@mastra/core/agent";

const agent = new Agent({
  id: "my-agent",
  name: "My Agent",
  instructions: "You are a helpful assistant",
  model: "google/gemini-1.5-flash"
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

| Model                                               | Context | Tools | Reasoning | Image | Audio | Video | Input $/1M | Output $/1M |
| --------------------------------------------------- | ------- | ----- | --------- | ----- | ----- | ----- | ---------- | ----------- |
| `google/gemini-1.5-flash`                           | 1.0M    |       |           |       |       |       | $0.07      | $0.30       |
| `google/gemini-1.5-flash-8b`                        | 1.0M    |       |           |       |       |       | $0.04      | $0.15       |
| `google/gemini-1.5-pro`                             | 1.0M    |       |           |       |       |       | $1         | $5          |
| `google/gemini-2.0-flash`                           | 1.0M    |       |           |       |       |       | $0.10      | $0.40       |
| `google/gemini-2.0-flash-lite`                      | 1.0M    |       |           |       |       |       | $0.07      | $0.30       |
| `google/gemini-2.5-flash`                           | 1.0M    |       |           |       |       |       | $0.30      | $3          |
| `google/gemini-2.5-flash-image`                     | 33K     |       |           |       |       |       | $0.30      | $30         |
| `google/gemini-2.5-flash-image-preview`             | 33K     |       |           |       |       |       | $0.30      | $30         |
| `google/gemini-2.5-flash-lite`                      | 1.0M    |       |           |       |       |       | $0.10      | $0.40       |
| `google/gemini-2.5-flash-lite-preview-06-17`        | 1.0M    |       |           |       |       |       | $0.10      | $0.40       |
| `google/gemini-2.5-flash-lite-preview-09-2025`      | 1.0M    |       |           |       |       |       | $0.10      | $0.40       |
| `google/gemini-2.5-flash-preview-04-17`             | 1.0M    |       |           |       |       |       | $0.15      | $0.60       |
| `google/gemini-2.5-flash-preview-05-20`             | 1.0M    |       |           |       |       |       | $0.15      | $0.60       |
| `google/gemini-2.5-flash-preview-09-2025`           | 1.0M    |       |           |       |       |       | $0.30      | $3          |
| `google/gemini-2.5-flash-preview-tts`               | 8K      |       |           |       |       |       | $0.50      | $10         |
| `google/gemini-2.5-pro`                             | 1.0M    |       |           |       |       |       | $1         | $10         |
| `google/gemini-2.5-pro-preview-05-06`               | 1.0M    |       |           |       |       |       | $1         | $10         |
| `google/gemini-2.5-pro-preview-06-05`               | 1.0M    |       |           |       |       |       | $1         | $10         |
| `google/gemini-2.5-pro-preview-tts`                 | 8K      |       |           |       |       |       | $1         | $20         |
| `google/gemini-3-flash-preview`                     | 1.0M    |       |           |       |       |       | $0.50      | $3          |
| `google/gemini-3-pro-preview`                       | 1.0M    |       |           |       |       |       | $2         | $12         |
| `google/gemini-3.1-flash-image-preview`             | 131K    |       |           |       |       |       | $0.25      | $60         |
| `google/gemini-3.1-flash-lite`                      | 1.0M    |       |           |       |       |       | $0.25      | $2          |
| `google/gemini-3.1-flash-lite-preview`              | 1.0M    |       |           |       |       |       | $0.25      | $2          |
| `google/gemini-3.1-pro-preview`                     | 1.0M    |       |           |       |       |       | $2         | $12         |
| `google/gemini-3.1-pro-preview-customtools`         | 1.0M    |       |           |       |       |       | $2         | $12         |
| `google/gemini-embedding-001`                       | 2K      |       |           |       |       |       | $0.15      | —           |
| `google/gemini-flash-latest`                        | 1.0M    |       |           |       |       |       | $0.30      | $3          |
| `google/gemini-flash-lite-latest`                   | 1.0M    |       |           |       |       |       | $0.10      | $0.40       |
| `google/gemini-live-2.5-flash`                      | 128K    |       |           |       |       |       | $0.50      | $2          |
| `google/gemini-live-2.5-flash-preview-native-audio` | 131K    |       |           |       |       |       | $0.50      | $2          |
| `google/gemma-3-12b-it`                             | 33K     |       |           |       |       |       | —          | —           |
| `google/gemma-3-27b-it`                             | 131K    |       |           |       |       |       | —          | —           |
| `google/gemma-3-4b-it`                              | 33K     |       |           |       |       |       | —          | —           |
| `google/gemma-3n-e2b-it`                            | 8K      |       |           |       |       |       | —          | —           |
| `google/gemma-3n-e4b-it`                            | 8K      |       |           |       |       |       | —          | —           |
| `google/gemma-4-26b-a4b-it`                         | 256K    |       |           |       |       |       | —          | —           |
| `google/gemma-4-31b-it`                             | 256K    |       |           |       |       |       | —          | —           |

## Advanced configuration

### Custom headers

```typescript
const agent = new Agent({
  id: "custom-agent",
  name: "custom-agent",
  model: {
    id: "google/gemini-1.5-flash",
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
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
      ? "google/gemma-4-31b-it"
      : "google/gemini-1.5-flash";
  }
});
```

## Provider Options

Google supports the following provider-specific options via the `providerOptions` parameter:

```typescript
const response = await agent.generate("Hello!", {
  providerOptions: {
    google: {
      // See available options in the table below
    }
  }
});
```

### Available Options

**responseModalities** (`("TEXT" | "IMAGE")[] | undefined`)

**thinkingConfig** (`{ thinkingBudget?: number | undefined; includeThoughts?: boolean | undefined; thinkingLevel?: "minimal" | "low" | "medium" | "high" | undefined; } | undefined`)

**cachedContent** (`string | undefined`)

**structuredOutputs** (`boolean | undefined`)

**safetySettings** (`{ category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_CIVIC_INTEGRITY"; threshold: "HARM_BLOCK_THRESHOLD_UNSPECIFIED" | ... 4 more ... | "OFF"; }[] | undefined`)

**threshold** (`"HARM_BLOCK_THRESHOLD_UNSPECIFIED" | "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE" | "OFF" | undefined`)

**audioTimestamp** (`boolean | undefined`)

**labels** (`Record<string, string> | undefined`)

**mediaResolution** (`"MEDIA_RESOLUTION_UNSPECIFIED" | "MEDIA_RESOLUTION_LOW" | "MEDIA_RESOLUTION_MEDIUM" | "MEDIA_RESOLUTION_HIGH" | undefined`)

**imageConfig** (`{ aspectRatio?: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "4:5" | "5:4" | "9:16" | "16:9" | "21:9" | "1:8" | "8:1" | "1:4" | "4:1" | undefined; imageSize?: "1K" | "2K" | "4K" | "512" | undefined; } | undefined`)

**retrievalConfig** (`{ latLng?: { latitude: number; longitude: number; } | undefined; } | undefined`)

**streamFunctionCallArguments** (`boolean | undefined`)

**serviceTier** (`"standard" | "flex" | "priority" | undefined`)

## Direct provider installation

This provider can also be installed directly as a standalone package, which can be used instead of the Mastra model router string. View the [package documentation](https://www.npmjs.com/package/@ai-sdk/google) for more details.

**npm**:

```bash
npm install @ai-sdk/google
```

**pnpm**:

```bash
pnpm add @ai-sdk/google
```

**Yarn**:

```bash
yarn add @ai-sdk/google
```

**Bun**:

```bash
bun add @ai-sdk/google
```