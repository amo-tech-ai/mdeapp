---
title: Mastra + React + Vite
description: Load for React/Next.js + Mastra starter patterns.
parent: mastra
impact: MEDIUM
impactDescription: Agent server with AI SDK UI chat patterns
tags: mastra, react, vite, ai-sdk-ui
---

# Integrate Mastra in your React + Vite project

In this guide, you'll build a tool-calling AI agent using Mastra, then connect it to React by calling the agent directly from Mastra's standalone server.

You'll use [AI SDK UI](https://ai-sdk.dev/docs/ai-sdk-ui/overview) and [AI Elements](https://ai-sdk.dev/elements) to create a beautiful, interactive chat experience.

## Before you begin

- You'll need an API key from a supported [model provider](https://mastra.ai/models). If you don't have a preference, use [OpenAI](https://mastra.ai/models/providers/openai).
- Install Node.js `v22.13.0` or later

## Create a new React + Vite app (optional)

If you already have a React + Vite app using Tailwind, skip to the next step.

### Project scaffold

Run the following command to [create a new React + Vite app](https://vite.dev/guide/#scaffolding-your-first-vite-project):

**npm**:

```bash
npm create vite@latest mastra-react -- --template react-ts
```

**pnpm**:

```bash
pnpm create vite mastra-react --template react-ts
```

**Yarn**:

```bash
yarn create vite mastra-react --template react-ts
```

**Bun**:

```bash
bunx create-vite mastra-react --template react-ts
```

This creates a project called `mastra-react`, but you can replace it with any name you want.

Navigate to your project directory:

```bash
cd mastra-react
```

### Tailwind

Next, install Tailwind:

**npm**:

```bash
npm install tailwindcss @tailwindcss/vite
```

**pnpm**:

```bash
pnpm add tailwindcss @tailwindcss/vite
```

**Yarn**:

```bash
yarn add tailwindcss @tailwindcss/vite
```

**Bun**:

```bash
bun add tailwindcss @tailwindcss/vite
```

Configure the Vite plugins:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Replace everything in `src/index.css` with the following:

```css
@import 'tailwindcss';
```

Add these `compilerOptions` to `tsconfig.json`:

```jsonc
{
  // ...
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
    },
  },
}
```

Edit `tsconfig.app.json` to resolve paths:

```jsonc
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
    },
    // ...
  },
}
```

## Initialize Mastra

Run [`mastra init`](https://mastra.ai/reference/cli/mastra). When prompted, choose a provider (e.g. OpenAI) and enter your key:

**npm**:

```bash
npx mastra@latest init
```

**pnpm**:

```bash
pnpm dlx mastra@latest init
```

**Yarn**:

```bash
yarn dlx mastra@latest init
```

**Bun**:

```bash
bun x mastra@latest init
```

This creates a `src/mastra` folder with an example weather agent and the following files:

- `index.ts` - Mastra config, including memory
- `tools/weather-tool.ts` - a tool to fetch weather for a given location
- `agents/weather-agent.ts`- a weather agent with a prompt that uses the tool

You'll call `weather-agent.ts` from your chat UI in the next steps.

## Install AI SDK UI & AI elements

Install AI SDK UI along with the Mastra adapter:

**npm**:

```bash
npm install @mastra/ai-sdk@latest @ai-sdk/react ai
```

**pnpm**:

```bash
pnpm add @mastra/ai-sdk@latest @ai-sdk/react ai
```

**Yarn**:

```bash
yarn add @mastra/ai-sdk@latest @ai-sdk/react ai
```

**Bun**:

```bash
bun add @mastra/ai-sdk@latest @ai-sdk/react ai
```

Next, initialize AI Elements. When prompted, choose the default options:

**npm**:

```bash
npx ai-elements@latest
```

**pnpm**:

```bash
pnpm dlx ai-elements@latest
```

**Yarn**:

```bash
yarn dlx ai-elements@latest
```

**Bun**:

```bash
bun x ai-elements@latest
```

This downloads the entire AI Elements UI component library into a `@/components/ai-elements` folder.

## Create a chat route

Open ⁠`src/mastra/index.ts` and add a [⁠chatRoute()](https://mastra.ai/reference/ai-sdk/chat-route) to your config. This creates an API route your React frontend can call for AI SDK-compatible chat responses, which you’ll use with ⁠useChat() next.

```ts
import { Mastra } from '@mastra/core/mastra'
// Existing imports...
import { chatRoute } from '@mastra/ai-sdk'

export const mastra = new Mastra({
  // Existing config...
  server: {
    apiRoutes: [
      chatRoute({
        path: '/chat/:agentId',
      }),
    ],
  },
})
```

## Add the chat UI

Replace the `src/App.tsx` file to create a chat interface:

```tsx
import * as React from 'react'
import { DefaultChatTransport, type ToolUIPart } from 'ai'
import { useChat } from '@ai-sdk/react'

import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
} from '@/components/ai-elements/prompt-input'

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'

import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message'

import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from '@/components/ai-elements/tool'

export default function App() {
  const [input, setInput] = React.useState<string>('')

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:4111/chat/weather-agent',
    }),
  })

  const handleSubmit = async () => {
    if (!input.trim()) return

    sendMessage({ text: input })
    setInput('')
  }

  return (
    <div className="relative mx-auto size-full h-screen max-w-4xl p-6">
      <div className="flex h-full flex-col">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map(message => (
              <div key={message.id}>
                {message.parts?.map((part, i) => {
                  if (part.type === 'text') {
                    return (
                      <Message key={`${message.id}-${i}`} from={message.role}>
                        <MessageContent>
                          <MessageResponse>{part.text}</MessageResponse>
                        </MessageContent>
                      </Message>
                    )
                  }

                  if (part.type?.startsWith('tool-')) {
                    return (
                      <Tool key={`${message.id}-${i}`}>
                        <ToolHeader
                          type={(part as ToolUIPart).type}
                          state={(part as ToolUIPart).state || 'output-available'}
                          className="cursor-pointer"
                        />
                        <ToolContent>
                          <ToolInput input={(part as ToolUIPart).input || {}} />
                          <ToolOutput
                            output={(part as ToolUIPart).output}
                            errorText={(part as ToolUIPart).errorText}
                          />
                        </ToolContent>
                      </Tool>
                    )
                  }

                  return null
                })}
              </div>
            ))}
            <ConversationScrollButton />
          </ConversationContent>
        </Conversation>
        <PromptInput onSubmit={handleSubmit} className="mt-20">
          <PromptInputBody>
            <PromptInputTextarea
              onChange={e => setInput(e.target.value)}
              className="md:leading-10"
              value={input}
              placeholder="Ask about the weather..."
              disabled={status !== 'ready'}
            />
          </PromptInputBody>
        </PromptInput>
      </div>
    </div>
  )
}
```

This component connects [`useChat()`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat) to the `chat/weather-agent` endpoint, sending prompts there and streaming the response back in chunks.

It renders the response text using the [`<MessageResponse>`](https://ai-sdk.dev/elements/components/message#messageresponse-) component, and shows any tool invocations with the [`<Tool>`](https://ai-sdk.dev/elements/components/tool) component.

## Test your agent

In order to test your agent with the chat interface, you need to run both the Mastra server and the Vite development server.

1. Start the Mastra development server:

   **npm**:

   ```bash
   npx mastra dev
   ```

   **pnpm**:

   ```bash
   pnpm dlx mastra dev
   ```

   **Yarn**:

   ```bash
   yarn dlx mastra dev
   ```

   **Bun**:

   ```bash
   bun x mastra dev
   ```

2. In a separate terminal window, start the Vite development server:

   **npm**:

   ```bash
   npm run dev
   ```

   **pnpm**:

   ```bash
   pnpm run dev
   ```

   **Yarn**:

   ```bash
   yarn dev
   ```

   **Bun**:

   ```bash
   bun run dev
   ```

3. Open your application at <http://localhost:5173>

4. Try asking about the weather. If your API key is set up correctly, you'll get a response

## Next steps

Congratulations on building your Mastra agent with React! 🎉

From here, you can extend the project with your own tools and logic:

- Learn more about [agents](https://mastra.ai/docs/agents/overview)
- Give your agent its own [tools](https://mastra.ai/docs/agents/using-tools)
- Add human-like [memory](https://mastra.ai/docs/memory/overview) to your agent

When you're ready, read more about how Mastra integrates with AI SDK UI and React, and how to deploy your agent anywhere:

- Integrate Mastra with [AI SDK UI](https://mastra.ai/guides/build-your-ui/ai-sdk-ui)
- Deploy your agent [anywhere](https://mastra.ai/docs/deployment/overview)