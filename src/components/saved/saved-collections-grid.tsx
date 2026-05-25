import Link from "next/link";
import type { SavedCollectionRow } from "@/lib/saved/load-user-collections";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SavedCollectionsGridProps = {
  collections: SavedCollectionRow[];
};

/** SCREEN-011 — collection cards grid. */
export function SavedCollectionsGrid({ collections }: SavedCollectionsGridProps) {
  return (
    <ul
      data-testid="saved-collections-grid"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {collections.map((c) => (
        <li key={c.id}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span aria-hidden>{c.emoji ?? "♡"}</span>
                {c.name}
              </CardTitle>
              {c.description ? (
                <CardDescription>{c.description}</CardDescription>
              ) : null}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {c.item_count === 1 ? "1 item" : `${c.item_count} items`}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function SavedSignInPrompt() {
  return (
    <p className="text-sm text-muted-foreground">
      <Link href="/login?next=/saved" className="font-medium text-primary hover:underline">
        Sign in
      </Link>{" "}
      to sync saves from chat across devices.
    </p>
  );
}
