---
title: Tools — Mastra
description: Load when defining createTool, tool schemas, or agent tool lists. Verify createTool signature in embedded-docs.
parent: mastra
impact: HIGH
impactDescription: createTool and agent tools
tags: mastra, tools, zod
mdeapp: active
---

# Tools

Agents use tools to call APIs, query databases, or run custom functions from your codebase. Tools give agents capabilities beyond language generation by providing structured access to data and performing clearly defined operations. You can also load tools from remote [MCP servers](https://mastra.ai/docs/mcp/overview) to expand an agent's capabilities.

## When to use tools

Use tools when an agent needs additional context or information from remote resources, or when it needs to run code that performs a specific operation. This includes tasks a model can't reliably handle on its own, such as fetching live data or returning consistent, well-defined outputs.

## Quickstart

Import [`createTool`](https://mastra.ai/reference/tools/create-tool) from `@mastra/core/tools` and define a tool with an `id`, `description`, `inputSchema`, `outputSchema`, and `execute` function.

This example shows how to create a tool that fetches weather data from an API. When the agent calls the tool, it provides the required input as defined by the tool's `inputSchema`. The tool accesses this data through its `inputData` parameter, which in this example includes the `location` used in the weather API query.

```typescript
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const weatherTool = createTool({
  id: 'weather-tool',
  description: 'Fetches weather for a location',
  inputSchema: z.object({
    location: z.string(),
  }),
  outputSchema: z.object({
    weather: z.string(),
  }),
  execute: async inputData => {
    const { location } = inputData

    const response = await fetch(`https://wttr.in/${location}?format=3`)
    const weather = await response.text()

    return { weather }
  },
})
```

When creating tools, keep descriptions concise and focused on what the tool does, emphasizing its primary use case. Descriptive schema names can also help guide the agent on how to use the tool.

> **Note:** Visit the [`createTool`](https://mastra.ai/reference/tools/create-tool) reference for more information on available properties, configurations, and examples.

To make a tool available to an agent, add it to the `tools` property on the `Agent` class. Mentioning available tools and their general purpose in the agent's system prompt helps the agent decide when to call a tool and when not to.

```typescript
import { Agent } from '@mastra/core/agent'
import { weatherTool } from '../tools/weather-tool'

export const weatherAgent = new Agent({
  id: 'weather-agent',
  name: 'Weather Agent',
  instructions: `
    You are a helpful weather assistant.
    Use the weatherTool to fetch current weather data.`,
  model: 'openai/gpt-5.5',
  tools: { weatherTool },
})
```

## Define schemas

You can define the tool's `inputSchema` and `outputSchema` with any library that supports [Standard JSON Schema](https://standardschema.dev/json-schema). This includes libraries like [Zod](https://zod.dev/), [Valibot](https://valibot.dev/), and [ArkType](https://arktype.io/).

**Zod**:

```typescript
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const weatherTool = createTool({
  id: 'weather-tool',
  description: 'Fetches weather for a location',
  inputSchema: z.object({
    location: z.string(),
  }),
  outputSchema: z.object({
    weather: z.string(),
  }),
  execute: async inputData => {
    // Fetch weather data
  },
})
```

**Valibot**:

```typescript
import { createTool } from '@mastra/core/tools'
import * as v from 'valibot'
import { toStandardJsonSchema } from '@valibot/to-json-schema'

export const weatherTool = createTool({
  id: 'weather-tool',
  description: 'Fetches weather for a location',
  inputSchema: toStandardJsonSchema(
    v.object({
      location: v.string(),
    }),
  ),
  outputSchema: toStandardJsonSchema(
    v.object({
      weather: v.string(),
    }),
  ),
  execute: async inputData => {
    // Fetch weather data
  },
})
```

**ArkType**:

```typescript
import { createTool } from '@mastra/core/tools'
import { type } from 'arktype'

export const weatherTool = createTool({
  id: 'weather-tool',
  description: 'Fetches weather for a location',
  inputSchema: type({
    location: 'string',
  }),
  outputSchema: type({
    weather: 'string',
  }),
  execute: async inputData => {
    // Fetch weather data
  },
})
```

## Multiple tools

An agent can use multiple tools to handle more complex tasks by delegating specific parts to individual tools. The agent decides which tools to use based on the user's message, the agent's instructions, and the tool descriptions and schemas.

```typescript
import { Agent } from '@mastra/core/agent'
import { weatherTool } from '../tools/weather-tool'
import { hazardsTool } from '../tools/hazards-tool'

export const weatherAgent = new Agent({
  id: 'weather-agent',
  name: 'Weather Agent',
  instructions: `
    You are a helpful weather assistant.
    Use the weatherTool to fetch current weather data.
    Use the hazardsTool to provide information about potential weather hazards.`,
  model: 'openai/gpt-5.5',
  tools: { weatherTool, hazardsTool },
})
```

## Agents as tools

Add subagents through the `agents` configuration to create a [supervisor](https://mastra.ai/docs/agents/supervisor-agents). Mastra converts each subagent to a tool named `agent-<key>`. Include a `description` on each subagent so the supervisor knows when to delegate.

```typescript
import { Agent } from '@mastra/core/agent'

const writer = new Agent({
  id: 'writer',
  name: 'Writer',
  description: 'Drafts and edits written content',
  instructions: 'You are a skilled writer.',
  model: 'openai/gpt-5.5',
})

export const supervisor = new Agent({
  id: 'supervisor',
  name: 'Supervisor',
  instructions: 'Coordinate the writer to produce content.',
  model: 'openai/gpt-5.5',
  agents: { writer },
})
```

## Workflows as tools

Add workflows through the `workflows` configuration. Mastra converts each workflow to a tool named `workflow-<key>`, using the workflow's `inputSchema` and `outputSchema`. Include a `description` on the workflow so the agent knows when to trigger it.

```typescript
import { Agent } from '@mastra/core/agent'
import { researchWorkflow } from '../workflows/research-workflow'

export const researchAgent = new Agent({
  id: 'research-agent',
  name: 'Research Agent',
  instructions: 'You are a research assistant.',
  model: 'openai/gpt-5.5',
  workflows: { researchWorkflow },
})
```

## Shape output for the model

Use `toModelOutput` when your tool returns rich structured data for your application, but you want the model to receive a smaller or multimodal representation. This keeps model context focused while preserving the full tool result in your app.

```typescript
export const weatherTool = createTool({
  execute: async ({ location }) => {
    const response = await fetch(`https://wttr.in/${location}?format=j1`)
    const data = await response.json()

    return {
      location,
      temperature: data.current_condition[0].temp_F,
      condition: data.current_condition[0].weatherDesc[0].value,
      weatherIconUrl: data.current_condition[0].weatherIconUrl[0].value,
      source: data,
    }
  },
  toModelOutput: output => {
    return {
      type: 'content',
      value: [
        {
          type: 'text',
          text: `${output.location}: ${output.temperature}F and ${output.condition}`,
        },
        { type: 'image-url', url: output.weatherIconUrl },
      ],
    }
  },
})
```

## Transform tool payloads for UI and transcripts

Use `transform` when a tool returns raw data your application needs, but browser-facing streams or user-visible transcript messages should receive a smaller or safer shape. `transform` is separate from `toModelOutput`: `toModelOutput` shapes the payload sent back to the model, while `transform` shapes tool input, output, errors, approval payloads, and suspension payloads for `display` and `transcript` targets.

If a transform is configured and it fails, Mastra does not fall back to the raw payload for display or transcript targets. Input deltas are suppressed when no safe `inputDelta` transform is available.

See the [`createTool()` reference](https://mastra.ai/reference/tools/create-tool) for a `transform` example. For shared rules across several tools, configure the agent-level `transform` policy in the [`Agent` constructor](https://mastra.ai/reference/agents/agent).

## Control tool selection

Pass `toolChoice` or `activeTools` to `.generate()` or `.stream()` to control which tools the agent uses at runtime.

```typescript
await agent.generate('Check the forecast', {
  toolChoice: 'required',
  activeTools: ['weatherTool'],
})
```

> **Note:** See the [`Agent.generate()` reference](https://mastra.ai/reference/agents/generate) for all runtime options including `toolsets`, `clientTools`, and `prepareStep`.

## Control `toolName` in stream responses

The `toolName` in stream responses is determined by the **object key** you use, not the `id` property of the tool, agent, or workflow.

```typescript
export const weatherTool = createTool({
  id: 'weather-tool',
})

// Using the variable name as the key
tools: { weatherTool }
// Stream returns: toolName: "weatherTool"

// Using the tool's id as the key
tools: { [weatherTool.id]: weatherTool }
// Stream returns: toolName: "weather-tool"

// Using a custom key
tools: { "my-custom-name": weatherTool }
// Stream returns: toolName: "my-custom-name"
```

This lets you specify how tools are identified in the stream. If you want the `toolName` to match the tool's `id`, use the tool's `id` as the object key.

### Subagents and workflows as tools

Subagents and workflows follow the same pattern. They're converted to tools with a prefix followed by your object key:

| Property    | Prefix      | Example key | `toolName`          |
| ----------- | ----------- | ----------- | ------------------- |
| `agents`    | `agent-`    | `weather`   | `agent-weather`     |
| `workflows` | `workflow-` | `research`  | `workflow-research` |

```typescript
const orchestrator = new Agent({
  agents: {
    weather: weatherAgent, // toolName: "agent-weather"
  },
  workflows: {
    research: researchWorkflow, // toolName: "workflow-research"
  },
})
```

Note that for subagents, you'll see two different identifiers in stream responses:

- `toolName: "agent-weather"` in tool call events — the generated tool wrapper name
- `id: "weather-agent"` in `data-tool-agent` chunks — the subagent's actual `id` property

## Related

- [`createTool` reference](https://mastra.ai/reference/tools/create-tool)
- [`Agent.generate()` reference](https://mastra.ai/reference/agents/generate): Runtime options for tool selection, steps, and callbacks
- [Background tasks](https://mastra.ai/docs/agents/background-tasks): Run long-running tools without blocking the agent loop
- [MCP overview](https://mastra.ai/docs/mcp/overview)
- [Dynamic tool search](https://mastra.ai/reference/processors/tool-search-processor): Load tools on demand for agents with large tool libraries
- [Tools with structured output](https://mastra.ai/docs/agents/structured-output): Model compatibility when combining tools and structured output
- [Agent approval](https://mastra.ai/docs/agents/agent-approval)
- [Request context](https://mastra.ai/docs/server/request-context)