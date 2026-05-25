import { normalizeToolEnvelope } from "@/lib/normalize-tool-envelope";

export function isToolRenderError(result: unknown, status: string): boolean {
  if (status === "failed" || status === "error") return true;
  if (!result || typeof result !== "object") return false;
  const envelope = result as { error?: string | { message?: string } };
  if (typeof envelope.error === "string") return envelope.error.length > 0;
  if (envelope.error && typeof envelope.error === "object") {
    return Boolean(envelope.error.message);
  }
  return false;
}

export function getToolRenderErrorMessage(result: unknown): string {
  if (!result || typeof result !== "object") {
    return "Something went wrong. Please try again.";
  }
  const envelope = result as { error?: string | { message?: string } };
  if (typeof envelope.error === "string" && envelope.error.trim()) {
    return envelope.error;
  }
  if (envelope.error && typeof envelope.error === "object" && envelope.error.message) {
    return envelope.error.message;
  }
  return "Something went wrong. Please try again.";
}

export function isToolRenderEmpty(result: unknown): boolean {
  const envelope = normalizeToolEnvelope(result);
  return (envelope.results?.length ?? 0) === 0;
}
