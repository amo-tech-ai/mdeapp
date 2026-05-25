import Link from "next/link";
import { Heart } from "lucide-react";
import { EmptyState } from "@/components/empty/empty-state";
import {
  SavedCollectionsGrid,
  SavedSignInPrompt,
} from "@/components/saved/saved-collections-grid";
import { loadUserCollections } from "@/lib/saved/load-user-collections";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Saved collections · mdeai",
};

export default async function SavedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const collections = user ? await loadUserCollections(user.id) : [];

  return (
    <main
      data-testid="saved-page"
      className="mx-auto min-h-screen max-w-5xl px-4 py-8"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Saved collections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Shortlists from chat — rentals, events, and places you hearted.
          </p>
        </div>
        <Link href="/" className="text-sm text-primary hover:underline">
          Back to chat
        </Link>
      </div>

      {!user ? (
        <EmptyState
          testId="saved-empty-signin"
          title="Sign in to view your saves"
          description="Camila's shortlists live here once you're logged in."
          icon={<Heart className="size-8" />}
          suggestions={[{ label: "Go to chat", testId: "saved-empty-chat" }]}
        />
      ) : null}
      {user && !collections.length ? (
        <>
          <EmptyState
            testId="saved-empty-collections"
            title="No collections yet"
            description="Heart a rental or event in chat — collections will appear here."
            icon={<Heart className="size-8" />}
          />
          <div className="mt-4 text-center">
            <Link
              href="/"
              data-testid="saved-start-chat"
              className="text-sm font-medium text-primary hover:underline"
            >
              Start in chat
            </Link>
          </div>
        </>
      ) : null}
      {user && collections.length > 0 ? (
        <SavedCollectionsGrid collections={collections} />
      ) : null}
      {!user ? (
        <div className="mt-4 text-center">
          <SavedSignInPrompt />
        </div>
      ) : null}
    </main>
  );
}
