-- OBS-002b — promote agent failure class to a first-class ai_runs column.
-- Additive + nullable + reversible. Lets ops (Patricia) filter AI failures with
-- an indexed query (e.g. error_type = 'rate_limit') instead of scanning the
-- metadata JSON blob. Values mirror the AgentErrorType union in
-- src/mastra/lib/mastra-telemetry.ts: client_abort | timeout | rate_limit | auth
-- | tool_failure | model_failure | validation | database | unknown.

alter table public.ai_runs
  add column if not exists error_type text;

-- Partial index: only failed runs carry an error_type, so index just those rows.
create index if not exists idx_ai_runs_error_type
  on public.ai_runs (error_type)
  where error_type is not null;
