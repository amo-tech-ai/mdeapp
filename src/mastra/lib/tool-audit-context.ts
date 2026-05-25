import type { RequestContext } from "@mastra/core/request-context";

export const MDEAI_USER_ID_KEY = "mdeaiUserId";

export function setAuditUserId(
  requestContext: RequestContext,
  userId: string | null,
): void {
  if (userId) requestContext.set(MDEAI_USER_ID_KEY, userId);
}

export function getAuditUserId(context?: unknown): string | null {
  const ctx = context as { requestContext?: RequestContext } | undefined;
  const id = ctx?.requestContext?.get(MDEAI_USER_ID_KEY);
  return typeof id === "string" ? id : null;
}
