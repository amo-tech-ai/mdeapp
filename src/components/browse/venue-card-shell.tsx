"use client";

import type { KeyboardEvent, ReactNode } from "react";
import type { ResultKind } from "@/components/cards/card-interaction-props";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type VenueCardShellLayout = "standard" | "rental";
export type VenueCardShellComposition = "legacy" | "nova";
export type VenueCardShellMediaLayout = "inline" | "cover";

export type VenueCardShellProps = {
  testId: string;
  resultKind: ResultKind;
  pinId?: string;
  selected?: boolean;
  featured?: boolean;
  ariaLabel?: string;
  layout?: VenueCardShellLayout;
  composition?: VenueCardShellComposition;
  /** Nova only — full-width hero media above body (browse grids). */
  mediaLayout?: VenueCardShellMediaLayout;
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

function VenueCardBody({
  layout,
  media,
  children,
  bodyProps,
  fill,
}: {
  layout: VenueCardShellLayout;
  media: ReactNode;
  children: ReactNode;
  bodyProps: Record<string, unknown>;
  fill?: boolean;
}) {
  const bodyClass = cn("min-w-0 flex-1", fill && "flex flex-col");

  return (
    <div className={cn("flex gap-3", fill && "flex-1 items-stretch")}>
      {layout === "standard" ? (
        <>
          {media}
          <div className={bodyClass} {...bodyProps}>
            {children}
          </div>
        </>
      ) : (
        <>
          <div className={bodyClass} {...bodyProps}>
            {children}
          </div>
          {media}
        </>
      )}
    </div>
  );
}

export function VenueCardShell({
  testId,
  resultKind,
  pinId,
  selected,
  featured,
  ariaLabel,
  layout = "standard",
  composition = "legacy",
  mediaLayout = "inline",
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

  const sharedDataProps = {
    "data-testid": testId,
    "data-result-kind": resultKind,
    "data-pin-id": pinId,
    "data-selected": selected ? "true" : "false",
    onMouseEnter: onPreview,
    onFocus: onPreview,
    "aria-label": ariaLabel,
  };

  if (composition === "nova") {
    const body = (
      <div className={cn("min-w-0 flex-1", "flex flex-col")} {...bodyProps}>
        {children}
      </div>
    );

    return (
      <Card
        size="sm"
        className={cn(
          "flex h-full flex-col gap-0 py-0 transition",
          selected && "ring-2 ring-primary/30",
          featured && "border-primary/40 bg-primary/[0.02]",
        )}
        {...sharedDataProps}
      >
        {mediaLayout === "cover" ? (
          <div className="px-3 pt-3">{media}</div>
        ) : null}
        <CardContent
          className={cn(
            "flex flex-1 flex-col px-3 py-3",
            mediaLayout === "cover" && "pt-0",
          )}
        >
          {mediaLayout === "cover" ? (
            body
          ) : (
            <VenueCardBody
              layout={layout}
              media={media}
              bodyProps={bodyProps}
              fill
            >
              {children}
            </VenueCardBody>
          )}
        </CardContent>
        {footer ? (
          <CardFooter className="mt-auto flex min-h-10 flex-wrap items-center justify-between gap-2 border-t bg-transparent px-3 py-2">
            {footer}
          </CardFooter>
        ) : null}
      </Card>
    );
  }

  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border bg-card text-sm shadow-sm transition",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border",
        featured && "border-primary/40 bg-primary/[0.02]",
      )}
      {...sharedDataProps}
    >
      <div className="flex gap-3 p-3">
        <VenueCardBody layout={layout} media={media} bodyProps={bodyProps}>
          {children}
        </VenueCardBody>
      </div>
      {footer}
    </article>
  );
}
