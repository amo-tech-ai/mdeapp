/** GS-002 — rollback web citation UI when `false`. */
export function webCitationsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_WEB_CITATIONS !== "false";
}
