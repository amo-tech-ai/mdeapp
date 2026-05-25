export type WorkflowStatus = 'pending' | 'running' | 'suspended' | 'completed' | 'failed';

export interface WorkflowRun {
  id: string;
  workflow_name: string;
  status: WorkflowStatus;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  step_name: string;
  status: WorkflowStatus;
  started_at: string | null;
  completed_at: string | null;
  output: Record<string, unknown> | null;
}
