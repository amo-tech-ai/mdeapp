-- MASTRA-048: Add ai_summary column to events table
-- events.ai_summary holds Gemini-generated 2-sentence event descriptions
-- (parallel to restaurants.ai_summary and tourist_destinations.ai_summary)
ALTER TABLE events ADD COLUMN IF NOT EXISTS ai_summary text;
