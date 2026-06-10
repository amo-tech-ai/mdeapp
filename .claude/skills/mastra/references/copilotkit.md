---
title: CopilotKit + Mastra (separate server)
description: Load for Mastra standalone server + Next.js CopilotKit integration. NOT mdeapp Pattern 1 — use copilotkit-integrations mastra.md for mdeapp.
parent: mastra
impact: MEDIUM
impactDescription: Split-stack CopilotKit guide
tags: mastra, copilotkit, integration
mdeapp: not-default-use-integrations-ref
---

# Using CopilotKit

[CopilotKit](https://www.copilotkit.ai/) provides React components to quickly integrate customizable AI copilots into your application. Combined with Mastra, you can build sophisticated AI apps featuring bidirectional state synchronization and interactive UIs.

Visit the [CopilotKit documentation](https://docs.copilotkit.ai/) to learn more about CopilotKit concepts, components, and advanced usage patterns.

> **Info:** For a full-stack integration approach where Mastra runs directly in your Next.js API routes, see the [CopilotKit Quickstart](https://docs.copilotkit.ai/mastra/quickstart) guide.

> **Tip:** Visit Mastra's [**"UI Dojo"**](https://ui-dojo.mastra.ai/) to see real-world examples of CopilotKit integrated with Mastra.

## Integration guide

Run Mastra as a standalone server and connect your Next.js frontend (with CopilotKit) to its API endpoints.

1. Set up your directory structure. A possible directory structure could look like this:

   ```bash
   project-root
   ├── mastra-server
   │   ├── src
   │   │   └── mastra
   │   └── package.json
   └── my-copilot-app
       └── package.json
   ```

   Bootstrap your Mastra server:

   **npm**:

   ```bash
   npx create-mastra@latest
   ```

   **pnpm**:

   ```bash
   pnpm dlx create-mastra@latest
   ```

   **Yarn**:

   ```bash
   yarn dlx create-mastra@latest
   ```

   **Bun**:

   ```bash
   bun x create-mastra@latest
   ```

   This command will launch an interactive wizard to help you scaffold a new Mastra project, including prompting you for a project name and setting up basic configurations. Follow the prompts to create your server project.

   Navigate to your newly created Mastra server directory:

   ```bash
   cd mastra-server # Replace with the actual directory name you provided
   ```

   You now have a basic Mastra server project ready. You should have the following files and folders:

   ```bash
   src
   └── mastra
       ├── agents
       │   └── weather-agent.ts
       ├── scorers
       │   └── weather-scorer.ts
       ├── tools
       │   └── weather-tool.ts
       ├── workflows
       │   └── weather-workflow.ts
       └── index.ts
   ```

   > **Note:** Ensure that you have set the appropriate environment variables for your LLM provider in the `.env` file.

2. Create a chat route for the CopilotKit frontend by using the `registerCopilotKit()` helper from `@ag-ui/mastra`. Add it to your Mastra project (and its peer dependencies):

   **npm**:

   ```bash
   npm install @ag-ui/mastra @mastra/client-js @mastra/core @ag-ui/core @ag-ui/client @copilotkit/runtime
   ```

   **pnpm**:

   ```bash
   pnpm add @ag-ui/mastra @mastra/client-js @mastra/core @ag-ui/core @ag-ui/client @copilotkit/runtime
   ```

   **Yarn**:

   ```bash
   yarn add @ag-ui/mastra @mastra/client-js @mastra/core @ag-ui/core @ag-ui/client @copilotkit/runtime
   ```

   **Bun**:

   ```bash
   bun add @ag-ui/mastra @mastra/client-js @mastra/core @ag-ui/core @ag-ui/client @copilotkit/runtime
   ```

   In your `src/mastra/index.ts` file, register the chat route:

   ```typescript
   import { Mastra } from '@mastra/core/mastra'
   import { registerCopilotKit } from '@ag-ui/mastra/copilotkit'
   // Rest of the imports...

   export const mastra = new Mastra({
     // Rest of the configuration...
     server: {
       cors: {
         origin: '*',
         allowMethods: ['*'],
         allowHeaders: ['*'],
       },
       apiRoutes: [
         registerCopilotKit({
           path: '/chat',
           resourceId: 'weatherAgent',
         }),
       ],
     },
   })
   ```

   This will make the `weatherAgent` available at `/chat` in a CopilotKit-compatible format. You have to add the CORS configuration to allow the CopilotKit frontend to access the Mastra server. For production deployments, make sure to restrict the CORS origins to only your frontend domain.

3. Run the Mastra server using the following command:

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

   By default, the Mastra server will run on `http://localhost:4111`. Keep this server running for the next steps where we'll set up the CopilotKit frontend to connect to it.

4. Go up one directory to your project root.

   ```bash
   cd ..
   ```

   Create a new Next.js project with the name `my-copilot-app`:

   **npm**:

   ```bash
   npx create-next-app@latest my-copilot-app
   ```

   **pnpm**:

   ```bash
   pnpm dlx create-next-app@latest my-copilot-app
   ```

   **Yarn**:

   ```bash
   yarn dlx create-next-app@latest my-copilot-app
   ```

   **Bun**:

   ```bash
   bun x create-next-app@latest my-copilot-app
   ```

   Navigate to your newly created Next.js project directory:

   ```bash
   cd my-copilot-app
   ```

5. Install the CopilotKit UI packages which you'll use to display a chat interface:

   **npm**:

   ```bash
   npm install @copilotkit/react-ui @copilotkit/react-core
   ```

   **pnpm**:

   ```bash
   pnpm add @copilotkit/react-ui @copilotkit/react-core
   ```

   **Yarn**:

   ```bash
   yarn add @copilotkit/react-ui @copilotkit/react-core
   ```

   **Bun**:

   ```bash
   bun add @copilotkit/react-ui @copilotkit/react-core
   ```

   Open the home route of the Next.js app (usually `app/page.tsx` or `src/app/page.tsx`) and replace the existing contents with the following code to set up a basic CopilotKit chat interface:

   ```typescript
   import { CopilotChat } from '@copilotkit/react-ui'
   import { CopilotKit } from '@copilotkit/react-core'
   import '@copilotkit/react-ui/styles.css'

   export default function Home() {
     return (
       <CopilotKit runtimeUrl="http://localhost:4111/chat" agent="weatherAgent">
         <CopilotChat
           labels={{
             title: 'Weather Agent',
             initial: 'Hi! 👋 Ask me about the weather, forecasts, and climate.',
           }}
         />
       </CopilotKit>
     )
   }
   ```

6. You're ready to connect the pieces! Make sure both the Mastra server and the CopilotKit frontend are running. Start the Next.js development server:

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

   You should now be able to chat with your agent in the browser.

Congratulations! You have successfully integrated Mastra with CopilotKit using a separate server approach. Your CopilotKit frontend now communicates with a standalone Mastra agent server.

## Deployment

When deploying your Mastra server with CopilotKit, you must exclude `@copilotkit/runtime` from the bundle. This package contains dependencies that aren't compatible with bundling and will cause 500 errors if included.

> **Note:** This issue doesn't occur during development with `mastra dev` since it doesn't require bundling. However, anyone running `mastra build` for deployment will encounter this issue.

Add the `@copilotkit/runtime` package to your bundler externals configuration:

```typescript
export const mastra = new Mastra({
  bundler: {
    externals: ['@copilotkit/runtime'],
  },
})
```