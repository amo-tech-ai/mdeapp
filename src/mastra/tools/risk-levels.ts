export const RiskLevel = {
  low: "low",
  medium: "medium",
  high: "high",
  critical: "critical",
} as const;

export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];
