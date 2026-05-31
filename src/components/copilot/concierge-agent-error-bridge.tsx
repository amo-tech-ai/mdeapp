"use client";

import { useEffect } from "react";
import { useCopilotContext } from "@copilotkit/react-core";
import type { CopilotErrorEvent } from "@copilotkit/shared";
import { reportConciergeError } from "@/lib/concierge-error-store";

const BRIDGE_ID = "concierge-agent-error-bridge";

function isIgnoredAgentError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const name = error instanceof Error ? error.name : "";
  return (
    name === "AbortError" ||
    message === "Fetch is aborted" ||
    message === "signal is aborted without reason" ||
    message === "component unmounted" ||
    !message
  );
}

/** Self-hosted runtime has no publicApiKey — props.onError never fires; use internal handler. */
export function ConciergeAgentErrorBridge() {
  const { setInternalErrorHandler, removeInternalErrorHandler } = useCopilotContext();

  useEffect(() => {
    setInternalErrorHandler({
      [BRIDGE_ID]: (errorEvent: CopilotErrorEvent) => {
        if (isIgnoredAgentError(errorEvent?.error)) return;
        reportConciergeError();
      },
    });
    return () => {
      removeInternalErrorHandler(BRIDGE_ID);
    };
  }, [setInternalErrorHandler, removeInternalErrorHandler]);

  return null;
}
