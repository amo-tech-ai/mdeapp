"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type EmptyStateSuggestion = {
  label: string;
  testId?: string;
  onClick?: () => void;
};

type EmptyStateProps = {
  title: string;
  description?: string;
  testId?: string;
  icon?: ReactNode;
  suggestions?: EmptyStateSuggestion[];
  className?: string;
};

/** SCREEN-019 — shared empty copy + optional suggestion chips. */
export function EmptyState({
  title,
  description,
  testId = "empty-state",
  icon,
  suggestions,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-testid={testId}
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="text-muted-foreground" aria-hidden>
          {icon}
        </div>
      ) : null}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
      ) : null}
      {suggestions && suggestions.length > 0 ? (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              data-testid={s.testId ?? "empty-state-suggestion"}
              onClick={s.onClick}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground hover:bg-muted"
            >
              {s.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
