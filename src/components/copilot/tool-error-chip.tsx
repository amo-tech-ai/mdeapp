"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ToolErrorChipProps = {
  message: string;
  testId?: string;
  onRetry?: () => void;
};

/** SCREEN-019 — user-readable tool failure (no stack traces). */
export function ToolErrorChip({
  message,
  testId = "tool-error-chip",
  onRetry,
}: ToolErrorChipProps) {
  return (
    <div
      role="alert"
      data-testid={testId}
      className="my-2 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        <p>{message}</p>
        {onRetry ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            data-testid="tool-error-retry"
            onClick={onRetry}
          >
            Try again
          </Button>
        ) : null}
      </div>
    </div>
  );
}
