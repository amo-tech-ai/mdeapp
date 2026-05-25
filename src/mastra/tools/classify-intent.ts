import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const intentSchema = z.enum(['rental_search', 'event_discovery', 'chitchat', 'unknown']);

export const classifyIntentTool = createTool({
  id: 'classify-intent',
  description: 'Pick exactly one intent label that matches the user message. Always call this first.',
  inputSchema: z.object({
    intent: intentSchema,
    confidence: z.number().min(0).max(1),
    reason: z.string().describe('one short sentence'),
  }),
  outputSchema: z.object({
    intent: intentSchema,
    confidence: z.number().min(0).max(1),
    reason: z.string(),
  }),
  execute: async (input: { intent: z.infer<typeof intentSchema>; confidence: number; reason: string }) => input,
});
