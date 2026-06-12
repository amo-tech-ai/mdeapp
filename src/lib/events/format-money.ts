/**
 * Shared money formatter for host sales surfaces.
 *
 * Formats integer cents as a whole-unit currency string ("COP 23,640,000",
 * "$2,500") with NO fake decimal precision. Lives in its own module so BOTH the
 * deterministic insight core (SAN-759 · AIE-007 — salesInsightWorkflow, narration
 * prompt) and the render layer (SAN-729 · AIE-008 — Host Analytics KPI cards) format
 * money the SAME way — the dashboard cards and the spoken narrative never disagree.
 *
 * GUARDRAIL: numbers are still computed in code; the LLM only restates the formatted
 * string. This formatter is what keeps "COP 23,640,000" on the card identical to the
 * sentence the agent speaks.
 */
export function formatMoney(cents: number, currency: string): string {
  const whole = Math.round(cents / 100);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(whole);
  } catch {
    // Unknown currency code → plain number + code suffix
    return `${whole.toLocaleString("en-US")} ${currency}`;
  }
}
