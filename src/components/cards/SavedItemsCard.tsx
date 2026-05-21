// SavedItemsCard — shared-state list demo (W5 saved-places foundation).

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface SavedItemsCardProps {
  title?: string;
  emptyMessage?: string;
  items: string[];
  onRemove?: (index: number) => void;
}

export function SavedItemsCard({
  title = "Saved items",
  emptyMessage = "Nothing saved yet. Ask the assistant to save something.",
  items,
  onRemove,
}: SavedItemsCardProps) {
  return (
    <Card className="mt-6 max-w-2xl w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="italic">
          Shared state demo — agent and user can both add or remove items.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2 pt-4">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground italic text-sm py-6">
            {emptyMessage}
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={`${index}-${item}`}
              className="group relative flex items-center rounded-lg bg-muted p-3"
            >
              <p className="pr-10 text-sm">{item}</p>
              {onRemove && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => onRemove(index)}
                  aria-label={`Remove ${item}`}
                >
                  <X data-icon="inline-start" />
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
