import { createClient } from "@/lib/supabase/server";

export type SavedCollectionRow = {
  id: string;
  name: string;
  description: string | null;
  emoji: string | null;
  item_count: number;
};

/** Load non-deleted collections for the authenticated user (RLS-scoped). */
export async function loadUserCollections(
  userId: string,
): Promise<SavedCollectionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("id, name, description, emoji, item_count")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[saved] loadUserCollections:", error.message);
    return [];
  }

  return (data ?? []) as SavedCollectionRow[];
}
