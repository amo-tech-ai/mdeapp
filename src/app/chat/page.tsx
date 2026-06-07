import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

/** Canonical chat is `/` — keep `/chat` as alias for bookmarks and F19 docs. */
export default async function ChatPage({ searchParams }: Props) {
  const { q } = await searchParams;
  redirect(q ? `/?q=${encodeURIComponent(q)}` : "/");
}
