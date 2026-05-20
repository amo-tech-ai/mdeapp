// Shared state shape for mdeai agents. Mirrors the Zod schema in
// src/mastra/agents/index.ts (MdeState). Keep these two in sync.
// W3 replaces this with EventDraftState for Roberto's host event flow.
export type MdeState = {
  lastQuery: string;
  hint: string;
};
