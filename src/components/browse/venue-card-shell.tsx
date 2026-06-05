"use client";

import type { KeyboardEvent, ReactNode } from "react";
import type { ResultKind } from "@/components/cards/card-interaction-props";
import { cn } from "@/lib/utils";

export type VenueCardShellLayout = "standard" | "rental";

export type VenueCardShellProps = {
  testId: string;
  resultKind: ResultKind;
  pinId?: string;
  selected?: boolean;
  featured?: boolean;
  ariaLabel?: string;
  layout?: VenueCardShellLayout;
  /** Map pin preview on hover/focus (restaurant / café chat cards). */
  onPreview?: () => void;
  bodyRole?: "button";
  bodyTabIndex?: 0;
  bodyAriaLabel?: string;
  onBodyClick?: () => void;
  onBodyKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  media: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function VenueCardShell({
  testId,
  resultKind,
  pinId,
  selected,
  featured,
  ariaLabel,
  layout = "standard",
  onPreview,
  bodyRole,
  bodyTabIndex,
  bodyAriaLabel,
  onBodyClick,
  onBodyKeyDown,
  media,
  children,
  footer,
}: VenueCardShellProps) {
  const bodyProps =
    bodyRole || bodyTabIndex != null || onBodyClick || onBodyKeyDown
      ? {
          role: bodyRole,
          tabIndex: bodyTabIndex,
          "aria-label": bodyAriaLabel,
          onClick: onBodyClick,
          onKeyDown: onBodyKeyDown,
        }
      : {};

  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border bg-card text-sm shadow-sm transition",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border",
        featured && "border-primary/40 bg-primary/[0.02]",
      )}
      data-testid={testId}
      data-result-kind={resultKind}
      data-pin-id={pinId}
      data-selected={selected ? "true" : "false"}
      onMouseEnter={onPreview}
      onFocus={onPreview}
      aria-label={ariaLabel}
    >
      <div className="flex gap-3 p-3">
        {layout === "standard" ? (
          <>
            {media}
            <div className="min-w-0 flex-1" {...bodyProps}>
              {children}
            </div>
          </>
        ) : (
          <>
            <div className="min-w-0 flex-1" {...bodyProps}>
              {children}
            </div>
            {media}
          </>
        )}
      </div>
      {footer}
    </article>
  );
}
