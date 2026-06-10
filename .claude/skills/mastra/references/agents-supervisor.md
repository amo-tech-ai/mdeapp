---
title: Supervisor agents — Mastra
description: Load when designing supervisor + subagent delegation. Phase 2+ for mdeapp — Phase 1 uses single conciergeAgent.
parent: mastra
impact: MEDIUM
impactDescription: Supervisor stream/generate patterns
tags: mastra, agents, supervisor
mdeapp: phase2-defer
---

# Supervisor agents

**Added in:** `@mastra/core@1.8.0`

A supervisor agent coordinates multiple subagents using [`Agent.stream()`](https://mastra.ai/reference/streaming/agents/stream) or [`Agent.generate()`](https://mastra.ai/reference/agents/generate). You configure subagents on the supervisor's `agents` property, and the supervisor uses its instructions and each subagent's `description` to decide when and how to delegate tasks.

## When to use supervisor agents

Use supervisor agents when a task requires multiple agents with different specializations to work together. The supervisor handles delegation decisions, context passing, and result synthesis.

Common use cases:

- Research and writing workflows where one agent gathers data and another produces content
- Multi-step tasks that need different expertise at each stage
- Tasks where you need fine-grained control over delegation behavior

> **Note:** Supervisor agents are one approach to building multi-agent systems in Mastra. For other patterns, read the [conceptual overview](https://mastra.ai/guides/concepts/multi-agent-systems).

## Quickstart

Define subagents with clear descriptions, then create a supervisor agent that references them:

```typescript
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'

const researchAgent = new Agent({
  id: 'research-agent',
  description: 'Gathers factual information and returns bullet-point summaries.',
  model: 'openai/gpt-5-mini',
})

const writingAgent = new Agent({
  id: 'writing-agent',
  description: 'Transforms research into well-structured articles.',
  model: 'openai/gpt-5-mini',
})

const supervisor = new Agent({
  id: 'supervisor',
  instructions: `You coordinate research and writing using specialized agents.
    Delegate to research-agent for facts, then writing-agent for content.`,
  model: 'openai/gpt-5.5',
  agents: { researchAgent, writingAgent },
  memory: new Memory({
    storage: new LibSQLStore({ id: 'storage', url: 'file:mastra.db' }),
  }),
})

const stream = await supervisor.stream('Research AI in education and write an article', {
  maxSteps: 10,
})

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk)
}
```

## Delegation hooks

Delegation hooks let you intercept, modify, or reject delegations as they happen. Configure them under the `delegation` option, either in the agent's `defaultOptions` or per-call.

### `onDelegationStart`

Called before the supervisor delegates to a subagent. Return an object to control the delegation:

- `proceed: true`: Allow the delegation (default behavior)
- `proceed: false`: Reject the delegation with a `rejectionReason`
- `modifiedPrompt`: Rewrite the prompt sent to the subagent
- `modifiedMaxSteps`: Limit the subagent's iteration count

```typescript
const stream = await supervisor.stream('Research AI trends', {
  maxSteps: 10,
  delegation: {
    onDelegationStart: async context => {
      console.log(`Delegating to: ${context.primitiveId}`)

      // Modify the prompt for a specific agent
      if (context.primitiveId === 'research-agent') {
        return {
          proceed: true,
          modifiedPrompt: `${context.prompt}\n\nFocus on 2024-2025 data.`,
          modifiedMaxSteps: 5,
        }
      }

      // Reject delegation after too many iterations
      if (context.iteration > 8) {
        return {
          proceed: false,
          rejectionReason: 'Max iterations reached. Synthesize current findings.',
        }
      }

      return { proceed: true }
    },
  },
})
```

The `context` object includes:

| Property      | Description                               |
| ------------- | ----------------------------------------- |
| `primitiveId` | The ID of the subagent being delegated to |
| `prompt`      | The prompt the supervisor is sending      |
| `iteration`   | Current iteration number                  |

### `onDelegationComplete`

Called after a delegation finishes. Use it to inspect results, provide feedback, or stop execution:

- `context.bail()`: Stop the supervisor loop immediately
- Return `{ feedback: '...' }`: Add feedback that gets saved to the supervisor's memory and is visible to subsequent iterations

```typescript
const stream = await supervisor.stream('Research AI trends', {
  maxSteps: 10,
  delegation: {
    onDelegationComplete: async context => {
      console.log(`Completed: ${context.primitiveId}`)

      // Bail on errors
      if (context.error) {
        context.bail()
        return {
          feedback: `Delegation to ${context.primitiveId} failed: ${context.error}. Try a different approach.`,
        }
      }
    },
  },
})
```

The `context` object includes:

| Property      | Description                          |
| ------------- | ------------------------------------ |
| `primitiveId` | The ID of the subagent that ran      |
| `result`      | The subagent's response              |
| `error`       | Error if the delegation failed       |
| `bail()`      | Function to stop the supervisor loop |

## Message filtering

By default, subagents receive the full conversation context from the supervisor. Use `messageFilter` to control what messages are shared — for example, to remove sensitive data or limit context size.

```typescript
const stream = await supervisor.stream('Research AI trends', {
  maxSteps: 10,
  delegation: {
    messageFilter: ({ messages, primitiveId, prompt }) => {
      // Remove messages containing sensitive data
      return messages
        .filter(msg => {
          const content =
            typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
          return !content.includes('confidential')
        })
        .slice(-10) // Only pass the last 10 messages
    },
  },
})
```

The callback receives `messages` (the full conversation history), `primitiveId` (the subagent ID), and `prompt` (the delegation prompt). Return the filtered array of messages.

## Subagent result context

When a subagent completes, the supervisor model receives the subagent's text response in later iterations. Nested tool calls and subagent metadata, such as thread and resource IDs, are not added to the supervisor model context.

Application code and UI integrations can still inspect the raw delegation result, including `subAgentToolResults`, from the tool result payload. This keeps debugging and display data available without sending nested tool arguments or outputs back into the supervisor's next model call.

Set `includeSubAgentToolResultsInModelContext` to include the full subagent result, including nested tool results and subagent metadata, in the supervisor model context.

```typescript
await supervisor.generate('Research AI trends', {
  delegation: {
    includeSubAgentToolResultsInModelContext: true,
  },
})
```

## Iteration monitoring

`onIterationComplete` is called after each iteration of the supervisor loop. Use it to log progress, inject feedback, or stop execution early.

```typescript
const stream = await supervisor.stream('Research AI trends', {
  maxSteps: 10,
  onIterationComplete: async context => {
    console.log(`Iteration ${context.iteration}/${context.maxIterations}`)
    console.log(`Finish reason: ${context.finishReason}`)

    // Inject feedback to guide the agent
    if (!context.text.includes('recommendations')) {
      return {
        continue: true,
        feedback: 'Please include specific recommendations in your analysis.',
      }
    }

    // Stop early when the response is sufficient
    if (context.text.length > 1000 && context.finishReason === 'stop') {
      return { continue: false }
    }

    return { continue: true }
  },
})
```

Return `{ continue: true }` to keep iterating, or `{ continue: false }` to stop. Include optional `feedback` to inject guidance into the conversation. When `feedback` is combined with `continue: false`, the model may get one final turn to produce a text response incorporating the feedback, but only if the current iteration is still active (e.g., after tool calls) — otherwise no extra turn is granted.

## Memory isolation

Supervisor agents implement memory isolation. Subagents receive the full conversation context for better decision-making, but only their specific delegation prompt and response are saved to their memory.

How it works:

1. **Full context forwarded**: When the supervisor delegates, the subagent receives all messages from the supervisor's conversation
2. **Scoped memory saves**: Only the delegation prompt and the subagent's response are saved to the subagent's memory
3. **Fresh thread per invocation**: Each delegation uses a unique thread ID, ensuring clean separation

This ensures subagents have the context they need without cluttering their memory with the entire supervisor conversation.

> **Note:** Visit [memory in multi-agent systems](https://mastra.ai/docs/memory/overview) for more details.

## Tool approval propagation

Tool approvals propagate through the delegation chain. When a subagent uses a tool with `requireApproval: true` or calls `suspend()`, the approval request surfaces to the supervisor level.

```typescript
const sensitiveDataTool = createTool({
  id: 'get-user-data',
  requireApproval: true,
  execute: async input => {
    return await database.getUserData(input.userId)
  },
})

const dataAgent = new Agent({
  id: 'data-agent',
  tools: { sensitiveDataTool },
})

const supervisor = new Agent({
  id: 'supervisor',
  agents: { dataAgent },
  memory: new Memory(),
})

const stream = await supervisor.stream('Get data for user 123')

for await (const chunk of stream.fullStream) {
  if (chunk.type === 'tool-call-approval') {
    console.log('Tool requires approval:', chunk.payload.toolName)
  }
}
```

## Task completion scoring

Task completion scorers validate whether the task is complete after each iteration. If validation fails, the supervisor continues iterating. Feedback from failed scorers is included in the conversation context so subagents can see what was missing.

```typescript
import { createScorer } from '@mastra/core/evals'

const taskCompleteScorer = createScorer({
  id: 'task-complete',
  name: 'Task Completeness',
}).generateScore(async context => {
  const text = (context.run.output || '').toString()
  const hasAnalysis = text.includes('analysis')
  const hasRecommendations = text.includes('recommendation')
  return hasAnalysis && hasRecommendations ? 1 : 0
})

const stream = await supervisor.stream('Research AI in education', {
  maxSteps: 10,
  isTaskComplete: {
    scorers: [taskCompleteScorer],
    strategy: 'all',
    onComplete: async result => {
      console.log('Task complete:', result.complete)
    },
  },
})
```

## Writing effective instructions

Clear instructions are essential for effective delegation. Your supervisor's `instructions` should specify available resources, when to use each one, how to coordinate them, and success criteria.

Each subagent should have a clear `description` that explains what it does, what format it returns, and when to use it. The supervisor uses these descriptions to make delegation decisions.

```typescript
const supervisor = new Agent({
  instructions: `You coordinate research and writing tasks.

Available resources:
- researchAgent: Gathers factual data and sources (returns bullet points)
- writingAgent: Transforms research into narrative content (returns full paragraphs)

Delegation strategy:
1. For research requests: Delegate to researchAgent first
2. For writing requests: Delegate to writingAgent
3. For complex requests: Delegate to researchAgent first, then writingAgent

Success criteria:
- All user questions are fully answered
- Response is well-formatted and complete`,
  agents: { researchAgent, writingAgent },
})
```

## Running subagents in the background

Subagent invocations are dispatched as tool calls, so they can run as [background tasks](https://mastra.ai/docs/agents/background-tasks). This is useful when one or more delegations are long-running and you don't want them to block the supervisor's response.

Enable the [backgroundTasks manager](https://mastra.ai/reference/configuration) on the Mastra instance, then opt subagents in on the supervisor:

```typescript
const supervisor = new Agent({
  id: 'supervisor',
  instructions: 'Coordinate research and writing using the available agents.',
  model: 'openai/gpt-5.5',
  agents: { researchAgent, writingAgent },
  backgroundTasks: {
    tools: {
      researchAgent: { enabled: true, timeoutMs: 900_000 },
      writingAgent: { enabled: true, timeoutMs: 900_000 },
    },
  },
})

const stream = await supervisor.streamUntilIdle('Research AI in education and write an article', {
  memory: { thread: 't1', resource: 'u1' },
})
```

Use [`streamUntilIdle()`](https://mastra.ai/reference/streaming/agents/streamUntilIdle) instead of `stream()` so the stream stays open until the subagents complete and the supervisor has had a chance to respond to their results.

If a subagent isn't listed on the supervisor but has its own background-eligible tools, the supervisor still dispatches the subagent as a background task and inherits its config. See [Inheriting from the subagent](https://mastra.ai/docs/agents/background-tasks) for details.

## Subagent versioning

When using the [editor](https://mastra.ai/docs/editor/overview), you can control which stored version of each subagent the supervisor uses at runtime. Set version overrides on the Mastra instance or per invocation:

```typescript
const result = await supervisor.generate('Research and write about AI safety', {
  versions: {
    agents: {
      'research-agent': { status: 'published' },
      'writing-agent': { versionId: 'draft-456' },
    },
  },
})
```

Version overrides propagate automatically through delegation. See [Subagent versioning](https://mastra.ai/docs/editor/overview) for details on resolution order and server API usage.

## Related

- [Background tasks](https://mastra.ai/docs/agents/background-tasks)
- [Subagent versioning](https://mastra.ai/docs/editor/overview)
- [Guide: Research coordinator](https://mastra.ai/guides/guide/research-coordinator)
- [Agent.stream() reference](https://mastra.ai/reference/streaming/agents/stream)
- [Agent.streamUntilIdle() reference](https://mastra.ai/reference/streaming/agents/streamUntilIdle)
- [Agent.generate() reference](https://mastra.ai/reference/agents/generate)
- [Agent approval](https://mastra.ai/docs/agents/agent-approval)
- [Memory in multi-agent systems](https://mastra.ai/docs/memory/overview)
- [Concept: Multi-agent systems](https://mastra.ai/guides/concepts/multi-agent-systems)