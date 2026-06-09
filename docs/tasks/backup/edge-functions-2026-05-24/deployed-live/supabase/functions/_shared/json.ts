/** Safe JSON.parse for untrusted model / client strings. */

export function safeJsonParse(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
