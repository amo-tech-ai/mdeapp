import { redirect } from "next/navigation";

/** Canonical chat is `/` — keep `/chat` as alias for bookmarks and F19 docs. */
export default function ChatPage() {
  redirect("/");
}
